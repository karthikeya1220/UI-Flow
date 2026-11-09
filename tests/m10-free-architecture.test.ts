import { describe, it, expect, vi } from 'vitest';
import Constants from '@/data/Constants';

describe('UIFlow M1.0 OpenRouter Free-Only Architecture & Regression Tests', () => {

    describe('1. Free-Only Provider Configuration', () => {
        it('should have OpenRouter Free as the default and first user-facing model', () => {
            const userFacingModels = Constants.AiModelList.filter((m: any) => m.isUserFacing !== false);
            expect(userFacingModels.length).toBeGreaterThanOrEqual(1);

            const defaultModel = userFacingModels[0];
            expect(defaultModel.name).toContain('OpenRouter Free');
            expect(defaultModel.modelName).toBe('openrouter/free');
            expect(defaultModel.provider).toBe('openrouter');
            expect(defaultModel.badge).toBe('Free Cloud');
        });

        it('should never expose paid models in user-facing choices', () => {
            const userFacingModels = Constants.AiModelList.filter((m: any) => m.isUserFacing !== false);
            const userFacingNames = userFacingModels.map(m => m.name);

            // Paid models must not appear to normal users
            expect(userFacingNames).not.toContain('Gemini Google');
            expect(userFacingNames).not.toContain('llama By Meta');
            expect(userFacingNames).not.toContain('Deepkseek');
        });

        it('should retain backward-compatibility mappings for existing project playback', () => {
            const legacyGemini = Constants.AiModelList.find(m => m.name === 'Gemini Google');
            const legacyMeta = Constants.AiModelList.find(m => m.name === 'llama By Meta');

            expect(legacyGemini).toBeDefined();
            expect(legacyMeta).toBeDefined();
        });
    });

    describe('2. OpenRouter Free AI API Handling', () => {
        it('should validate required model and description before making requests', async () => {
            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'test-user' },
                    dbUser: { id: 1 }
                })
            }));

            const { POST } = await import('@/app/api/ai-model/route');
            const req = new Request('http://localhost:3000/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'OpenRouter Free (Default)' }) // missing description
            });

            const res = await POST(req as any);
            const text = await res.text();
            expect(text).toContain('// Error: Missing required fields: description');
        });

        it('should reject requests with invalid model identifiers safely', async () => {
            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'test-user' },
                    dbUser: { id: 1 }
                })
            }));

            const { POST } = await import('@/app/api/ai-model/route');
            const req = new Request('http://localhost:3000/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gpt-4o-paid-enterprise',
                    description: 'Build a dashboard'
                })
            });

            const res = await POST(req as any);
            const text = await res.text();
            expect(text).toContain('// Error: Invalid AI model');
        });

        it('should handle missing OPENROUTER_AI_API_KEY gracefully for openrouter provider', async () => {
            const originalKey = process.env.OPENROUTER_AI_API_KEY;
            delete process.env.OPENROUTER_AI_API_KEY;

            vi.resetModules();
            vi.doMock('@/lib/auth', () => ({
                requireAuthUser: vi.fn().mockResolvedValue({
                    supabaseUser: { id: 'test-user' },
                    dbUser: { id: 1 }
                })
            }));

            const { POST } = await import('@/app/api/ai-model/route');
            const req = new Request('http://localhost:3000/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'OpenRouter Free (Default)',
                    description: 'Build a landing page'
                })
            });

            const res = await POST(req as any);
            const text = await res.text();
            expect(text).toContain('// Error: AI service configuration missing');

            process.env.OPENROUTER_AI_API_KEY = originalKey;
        });
    });
});

