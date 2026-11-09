import { describe, it, expect, vi } from 'vitest';

describe('UIFlow M0.6 Identity, Authentication & Ownership Isolation Tests', () => {

    describe('1. Unauthenticated API access enforcement', () => {
        it('should throw 401 Unauthorized when supabase.auth.getUser() returns null session', async () => {
            const mockGetServerClient = vi.fn().mockResolvedValue({
                auth: {
                    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Session not found') })
                }
            });

            vi.doMock('@/lib/supabase/server', () => ({
                createClient: mockGetServerClient
            }));

            const { requireAuthUser } = await import('@/lib/auth');
            await expect(requireAuthUser()).rejects.toThrow('Unauthorized: Authentication required');
        });
    });

    describe('2. Existing user one-time identity migration', () => {
        it('should bind supabase_id to existing user matching email without creating duplicate', async () => {
            const mockSupabaseUser = {
                id: '11111111-2222-3333-4444-555555555555',
                email: 'darshankarthik05@gmail.com',
                confirmed_at: '2026-11-04T00:00:00Z',
                user_metadata: { full_name: 'Darshan Karthikeya' }
            };

            const existingDbUser = {
                id: 1,
                name: 'Darshan Karthikeya',
                email: 'darshankarthik05@gmail.com',
                credits: 0,
                supabase_id: null
            };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn()
                            .mockResolvedValueOnce([]) // 1. lookup by supabase_id -> not found
                            .mockResolvedValueOnce([existingDbUser]) // 2. lookup by email -> found unbound candidate
                    })
                }),
                update: vi.fn().mockReturnValue({
                    set: vi.fn().mockReturnValue({
                        where: vi.fn().mockReturnValue({
                            returning: vi.fn().mockResolvedValue([{ ...existingDbUser, supabase_id: mockSupabaseUser.id }])
                        })
                    })
                })
            };

            vi.resetModules();
            vi.doMock('@/lib/supabase/server', () => ({
                createClient: vi.fn().mockResolvedValue({
                    auth: {
                        getUser: vi.fn().mockResolvedValue({ data: { user: mockSupabaseUser }, error: null })
                    }
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { requireAuthUser } = await import('@/lib/auth');
            const result = await requireAuthUser();

            expect(result.dbUser.id).toBe(1);
            expect(result.dbUser.supabase_id).toBe(mockSupabaseUser.id);
            expect(mockDb.update).toHaveBeenCalled();
        });

        it('should abort with 409 Conflict if candidate email is already bound to a different supabase_id', async () => {
            const mockSupabaseUser = {
                id: '99999999-9999-9999-9999-999999999999',
                email: 'darshankarthik05@gmail.com',
                confirmed_at: '2026-11-04T00:00:00Z'
            };

            const alreadyBoundDbUser = {
                id: 1,
                name: 'Darshan Karthikeya',
                email: 'darshankarthik05@gmail.com',
                credits: 0,
                supabase_id: '11111111-2222-3333-4444-555555555555' // bound to someone else
            };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn()
                            .mockResolvedValueOnce([]) // by supabase_id -> not found
                            .mockResolvedValueOnce([alreadyBoundDbUser]) // by email -> found conflicting row
                    })
                })
            };

            vi.resetModules();
            vi.doMock('@/lib/supabase/server', () => ({
                createClient: vi.fn().mockResolvedValue({
                    auth: {
                        getUser: vi.fn().mockResolvedValue({ data: { user: mockSupabaseUser }, error: null })
                    }
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { requireAuthUser } = await import('@/lib/auth');
            await expect(requireAuthUser()).rejects.toThrow('Identity conflict: This email is bound to another account');
        });
    });

    describe('3. Cross-user project access denial and ownership', () => {
        it('should strictly query wireframes by authenticated user_id, preventing cross-user leakage', async () => {
            const callerDbUser = { id: 42, email: 'attacker@example.com', supabase_id: 'attacker-uuid', credits: 0, name: 'Attacker' };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn().mockResolvedValue([])
                    })
                })
            };

            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'attacker-uuid', email: 'attacker@example.com' },
                    dbUser: callerDbUser
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { GET } = await import('@/app/api/wireframe-to-code/route');
            const req = new Request('http://localhost:3000/api/wireframe-to-code?uid=victim-project-uid');
            const response = await GET(req);
            const json = await response.json();

            expect(response.status).toBe(404);
            expect(json.error).toContain('Wireframe not found or access denied');
        });

        it('should prevent unauthorized code export for wireframes owned by other users', async () => {
            const callerDbUser = { id: 42, email: 'attacker@example.com', supabase_id: 'attacker-uuid', credits: 0, name: 'Attacker' };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn().mockResolvedValue([]) // No matching project for this user_id
                    })
                })
            };

            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'attacker-uuid', email: 'attacker@example.com' },
                    dbUser: callerDbUser
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { GET } = await import('@/app/api/export-code/route');
            const req = new Request('http://localhost:3000/api/export-code?uid=foreign-uid');
            const response = await GET(req as any);
            const json = await response.json();

            expect(response.status).toBe(404);
            expect(json.error).toContain('Code not found for this wireframe or access denied');
        });
    });

    describe('4. Secure image upload & signed URL generation', () => {
        it('should reject file upload when magic bytes do not match declared PNG MIME type', async () => {
            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'user-uuid-123' },
                    dbUser: { id: 1 }
                })
            }));

            const { POST } = await import('@/app/api/upload-image/route');
            
            // Craft an invalid file that claims to be image/png but has ASCII bytes
            const fakeFile = new File(['NOT_A_PNG_FILE_HEADER'], 'test.png', { type: 'image/png' });
            const formData = new FormData();
            formData.append('file', fakeFile);

            const req = new Request('http://localhost:3000/api/upload-image', {
                method: 'POST',
                body: formData
            });

            const response = await POST(req as any);
            const json = await response.json();

            expect(response.status).toBe(400);
            expect(json.error).toContain('File content does not match reported image format');
        });

        it('should reject signed URL request if requested path is outside caller user UUID folder', async () => {
            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'user-uuid-123' },
                    dbUser: { id: 1 }
                })
            }));

            const { GET } = await import('@/app/api/storage-signed-url/route');
            const req = new Request('http://localhost:3000/api/storage-signed-url?path=victim-uuid-456/wireframe.png');
            const response = await GET(req as any);
            const json = await response.json();

            expect(response.status).toBe(403);
            expect(json.error).toContain('Cannot generate signed URL for another user\'s file');
        });
    });
});
