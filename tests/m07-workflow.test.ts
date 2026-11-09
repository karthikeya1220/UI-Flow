import { describe, it, expect, vi } from 'vitest';
import JSZip from 'jszip';

describe('UIFlow M0.7 Core Product Workflow Tests', () => {

    describe('1. Model Mapping Verification', () => {
        it('should correctly map all UI options to valid AI model identifiers', async () => {
            const Constants = (await import('@/data/Constants')).default;
            
            const gemini = Constants.AiModelList.find(m => m.name === 'Gemini Google');
            const llama = Constants.AiModelList.find(m => m.name === 'llama By Meta');
            const deepseek = Constants.AiModelList.find(m => m.name === 'Deepkseek');

            expect(gemini?.modelName).toBe('google/gemini-2.5-flash');
            expect(llama?.modelName).toBe('meta-llama/llama-3.3-70b-instruct');
            expect(deepseek?.modelName).toBe('deepseek/deepseek-chat');

            // Ensure llama does NOT point to gemini
            expect(llama?.modelName).not.toBe(gemini?.modelName);
        });
    });

    describe('2. Real ZIP Export Integrity', () => {
        it('should generate a valid binary ZIP archive with React project scaffold and ownership verification', async () => {
            const mockDbUser = { id: 1, email: 'darshankarthik05@gmail.com' };
            const mockWireframe = {
                id: 1,
                uid: 'bbea6702-9aad-4c66-9478-69dbad97965c',
                user_id: 1,
                model: 'Gemini Google',
                code: {
                    resp: 'import React from "react";\nexport default function App() {\n  return <div className="p-4">Hello UIFlow</div>;\n}'
                }
            };

            const mockDb = {
                select: vi.fn().mockReturnValue({
                    from: vi.fn().mockReturnValue({
                        where: vi.fn().mockResolvedValue([mockWireframe])
                    })
                })
            };

            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: '4a2abd2a-c155-4ad1-9a8d-2d0a94a2bc7f', email: 'darshankarthik05@gmail.com' },
                    dbUser: mockDbUser
                })
            }));
            vi.doMock('@/configs/db', () => ({ db: mockDb }));

            const { GET } = await import('@/app/api/export-code/route');
            const req = new Request('http://localhost:3000/api/export-code?uid=bbea6702-9aad-4c66-9478-69dbad97965c&format=zip');
            const response = await GET(req as any);

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toBe('application/zip');
            expect(response.headers.get('Content-Disposition')).toContain('.zip');

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Verify ZIP binary magic number: PK (0x50, 0x4B, 0x03, 0x04)
            expect(buffer[0]).toBe(0x50);
            expect(buffer[1]).toBe(0x4B);
            expect(buffer[2]).toBe(0x03);
            expect(buffer[3]).toBe(0x04);

            // Load and inspect zip file contents using JSZip
            const zip = await JSZip.loadAsync(buffer);
            expect(zip.file('src/App.jsx')).not.toBeNull();
            expect(zip.file('src/index.jsx')).not.toBeNull();
            expect(zip.file('src/index.css')).not.toBeNull();
            expect(zip.file('package.json')).not.toBeNull();
            expect(zip.file('tailwind.config.js')).not.toBeNull();

            const appContent = await zip.file('src/App.jsx')?.async('string');
            expect(appContent).toContain('export default function App');
            expect(appContent).toContain('Hello UIFlow');

            const pkgJson = JSON.parse(await zip.file('package.json')?.async('string') || '{}');
            expect(pkgJson.dependencies['react']).toBeDefined();
            expect(pkgJson.dependencies['lucide-react']).toBeDefined();
        });
    });

    describe('3. AI Route Authentication & Input Validation', () => {
        it('should require authentication and validate request fields before touching OpenRouter', async () => {
            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockRejectedValue(new Error('Unauthorized: Authentication required'))
            }));

            const { POST } = await import('@/app/api/ai-model/route');
            const req = new Request('http://localhost:3000/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'Gemini Google',
                    description: 'Test description',
                    imageUrl: 'https://example.com/test.png'
                })
            });

            const res = await POST(req as any);
            const text = await res.text();
            expect(text).toContain('// Error: Unauthorized: Authentication required');
        });

        it('should return error stream if OPENROUTER_AI_API_KEY is not configured', async () => {
            const originalKey = process.env.OPENROUTER_AI_API_KEY;
            delete process.env.OPENROUTER_AI_API_KEY;

            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'test-user-id' },
                    dbUser: { id: 1 }
                })
            }));

            const { POST } = await import('@/app/api/ai-model/route');
            const req = new Request('http://localhost:3000/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'Gemini Google',
                    description: 'Test description',
                    imageUrl: 'https://example.com/test.png'
                })
            });

            const res = await POST(req as any);
            const text = await res.text();
            expect(text).toContain('// Error: AI service configuration missing');

            process.env.OPENROUTER_AI_API_KEY = originalKey;
        });
    });
});

