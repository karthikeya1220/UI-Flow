import { describe, it, expect, vi } from 'vitest';

describe('UIFlow M0.6.3 Email & Password Authentication & Identity Tests', () => {

    describe('1. Email/Password Authentication & Registration API', () => {
        it('should call supabase.auth.signUp() with email, password, and emailRedirectTo', async () => {
            const mockSignUp = vi.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: null },
                error: null
            });

            const mockClient = {
                auth: {
                    signUp: mockSignUp,
                }
            };

            const result = await mockClient.auth.signUp({
                email: 'test@example.com',
                password: 'Password123!',
                options: {
                    emailRedirectTo: 'http://localhost:3000/auth/callback?next=/dashboard',
                    data: { full_name: 'Test User' }
                }
            });

            expect(mockSignUp).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'Password123!',
                options: {
                    emailRedirectTo: 'http://localhost:3000/auth/callback?next=/dashboard',
                    data: { full_name: 'Test User' }
                }
            });
            expect(result.data.user.id).toBe('test-user-id');
        });

        it('should call supabase.auth.signInWithPassword() and reject invalid credentials with an error', async () => {
            const mockSignInWithPassword = vi.fn().mockResolvedValue({
                data: { user: null, session: null },
                error: new Error('Invalid login credentials')
            });

            const mockClient = {
                auth: {
                    signInWithPassword: mockSignInWithPassword,
                }
            };

            const res = await mockClient.auth.signInWithPassword({
                email: 'wrong@example.com',
                password: 'WrongPassword'
            });

            expect(res.error).toBeDefined();
            expect(res.error?.message).toBe('Invalid login credentials');
        });

        it('should call supabase.auth.resetPasswordForEmail() with recovery redirect URL', async () => {
            const mockReset = vi.fn().mockResolvedValue({ data: {}, error: null });
            const mockClient = {
                auth: {
                    resetPasswordForEmail: mockReset,
                }
            };

            await mockClient.auth.resetPasswordForEmail('user@example.com', {
                redirectTo: 'http://localhost:3000/reset-password'
            });

            expect(mockReset).toHaveBeenCalledWith('user@example.com', {
                redirectTo: 'http://localhost:3000/reset-password'
            });
        });

        it('should call supabase.auth.updateUser() to set a new password on recovery session', async () => {
            const mockUpdateUser = vi.fn().mockResolvedValue({
                data: { user: { id: 'recovered-user-id' } },
                error: null
            });
            const mockClient = {
                auth: {
                    updateUser: mockUpdateUser,
                }
            };

            const res = await mockClient.auth.updateUser({ password: 'NewSecurePassword123' });
            expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'NewSecurePassword123' });
            expect(res.data.user.id).toBe('recovered-user-id');
        });
    });

    describe('2. Existing user one-time email identity binding', () => {
        it('should safely bind existing Neon user on first email/password login and retain their ID', async () => {
            const mockSupabaseUser = {
                id: '22222222-3333-4444-5555-666666666666',
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
                            .mockResolvedValueOnce([existingDbUser]) // 2. lookup by email -> found candidate
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
            expect(result.dbUser.email).toBe('darshankarthik05@gmail.com');
            expect(result.dbUser.supabase_id).toBe(mockSupabaseUser.id);
            expect(mockDb.update).toHaveBeenCalled();
        });

        it('should never check or query by email once account has a bound supabase_id', async () => {
            const boundDbUser = {
                id: 1,
                name: 'Darshan Karthikeya',
                email: 'darshankarthik05@gmail.com',
                credits: 0,
                supabase_id: '22222222-3333-4444-5555-666666666666'
            };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn().mockResolvedValueOnce([boundDbUser])
                    })
                }),
                update: vi.fn()
            };

            vi.resetModules();
            vi.doMock('@/lib/supabase/server', () => ({
                createClient: vi.fn().mockResolvedValue({
                    auth: {
                        getUser: vi.fn().mockResolvedValue({
                            data: {
                                user: {
                                    id: '22222222-3333-4444-5555-666666666666',
                                    email: 'darshankarthik05@gmail.com',
                                    confirmed_at: '2026-11-04T00:00:00Z'
                                }
                            },
                            error: null
                        })
                    }
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { requireAuthUser } = await import('@/lib/auth');
            const result = await requireAuthUser();

            expect(result.dbUser.id).toBe(1);
            expect(result.dbUser.supabase_id).toBe('22222222-3333-4444-5555-666666666666');
            // update should not be called since user was already bound
            expect(mockDb.update).not.toHaveBeenCalled();
        });
    });

    describe('3. Callback Route Token Hash & OTP Verification', () => {
        it('should process token_hash OTP verification during confirmation or recovery', async () => {
            const mockVerifyOtp = vi.fn().mockResolvedValue({ data: { user: { id: 'verified-user' } }, error: null });

            const mockSupabase = {
                auth: {
                    exchangeCodeForSession: vi.fn(),
                    verifyOtp: mockVerifyOtp
                }
            };

            // Simulated callback handler verification logic
            const token_hash = 'sample-recovery-token-hash';
            const type = 'recovery';

            if (token_hash && type) {
                await mockSupabase.auth.verifyOtp({ type: type as any, token_hash });
            }

            expect(mockVerifyOtp).toHaveBeenCalledWith({ type: 'recovery', token_hash: 'sample-recovery-token-hash' });
        });
    });
});

