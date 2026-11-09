import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AppError, validateRequest } from "@/lib/error-handling";
import { requireAuthUser } from "@/lib/auth";

let openai: OpenAI;
function getOpenAI() {
    if (!openai) {
        openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_AI_API_KEY,
        });
    }
    return openai;
}

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        // Authenticate request before invoking AI model
        await requireAuthUser();

        const { model, description, imageUrl } = await req.json();

        // Validate required fields
        validateRequest({ model, description }, ['model', 'description']);

        const ModelObj = Constants.AiModelList.find(item => item.name === model || item.modelName === model);
        if (!ModelObj) {
            throw new AppError(`Invalid AI model: ${model}`, 400);
        }

        const modelName = ModelObj.modelName;
        const provider = ModelObj.provider;
        console.log(`[AI Model API] Selected provider: ${provider}, model: ${modelName}`);

        let stream: ReadableStream;

        if (provider === 'ollama') {
            // Local Ollama generation (Free & zero-cost)
            const ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
            
            // Ollama text-based prompt (vision not supported by 3B/8B text models)
            const ollamaPrompt = `${description}\n\nNote: Please generate a complete React component with imports and default export using Tailwind CSS classes. Return ONLY code without markdown code blocks.`;

            let ollamaRes: Response;
            try {
                ollamaRes = await fetch(`${ollamaHost}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: modelName,
                        prompt: ollamaPrompt,
                        stream: true
                    }),
                    signal: AbortSignal.timeout(120000)
                });
            } catch (err: any) {
                console.error('[AI Model API] Ollama connection failure:', err);
                throw new AppError(`Local Ollama service unavailable at ${ollamaHost}. Please ensure 'ollama serve' is running.`, 503);
            }

            if (!ollamaRes.ok || !ollamaRes.body) {
                const errText = await ollamaRes.text().catch(() => '');
                console.error('[AI Model API] Ollama error response:', errText);
                throw new AppError(`Local Ollama error (${ollamaRes.status}): ${errText || 'Failed to generate'}`, 502);
            }

            const ollamaReader = ollamaRes.body.getReader();
            const decoder = new TextDecoder();

            stream = new ReadableStream({
                async start(controller) {
                    try {
                        let buffer = '';
                        while (true) {
                            const { done, value } = await ollamaReader.read();
                            if (done) break;
                            buffer += decoder.decode(value, { stream: true });
                            const lines = buffer.split('\n');
                            buffer = lines.pop() || '';

                            for (const line of lines) {
                                if (!line.trim()) continue;
                                try {
                                    const json = JSON.parse(line);
                                    if (json.response) {
                                        controller.enqueue(new TextEncoder().encode(json.response));
                                    }
                                } catch (e) {
                                    // Non-JSON line ignored
                                }
                            }
                        }
                        controller.close();
                    } catch (streamError) {
                        console.error('[AI Model API] Ollama stream error:', streamError);
                        controller.error(streamError);
                    }
                }
            });

        } else {
            // OpenRouter Free Cloud provider
            if (!process.env.OPENROUTER_AI_API_KEY) {
                throw new AppError('AI service configuration missing (OPENROUTER_AI_API_KEY)', 500);
            }

            // Attempt multimodal with image first, fallback gracefully to text-only if upstream rejects image
            let response: any;
            try {
                const messages: any[] = [
                    {
                        role: "user",
                        content: imageUrl ? [
                            { type: "text", text: description },
                            { type: "image_url", image_url: { url: imageUrl } }
                        ] : [
                            { type: "text", text: description }
                        ]
                    }
                ];

                response = await getOpenAI().chat.completions.create({
                    model: modelName,
                    stream: true,
                    max_tokens: 3000,
                    temperature: 0.7,
                    messages
                });
            } catch (initialErr: any) {
                // If upstream free provider fails specifically on image format/multimodal payload, retry text-only
                if (imageUrl && (initialErr?.status === 400 || initialErr?.message?.includes('image') || initialErr?.message?.includes('multimodal'))) {
                    console.warn('[AI Model API] Multimodal rejected by upstream provider, falling back to text description:', initialErr.message);
                    response = await getOpenAI().chat.completions.create({
                        model: modelName,
                        stream: true,
                        max_tokens: 3000,
                        temperature: 0.7,
                        messages: [
                            {
                                role: "user",
                                content: `Note: Visual analysis unavailable from free upstream provider. Synthesizing from project description:\n\n${description}`
                            }
                        ]
                    });
                } else if (initialErr?.status === 429) {
                    throw new AppError('Free tier rate limit reached on OpenRouter. Please wait 1 minute before retrying.', 429);
                } else if (initialErr?.status === 402) {
                    throw new AppError('Free tier credits unavailable. The application is configured for zero-cost operation only.', 402);
                } else {
                    throw initialErr;
                }
            }

            stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of response) {
                            const text = chunk.choices?.[0]?.delta?.content || "";
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                        controller.close();
                    } catch (streamError: any) {
                        console.error('[AI Model API] OpenRouter stream error:', streamError);
                        const msg = streamError?.status === 429 
                            ? 'OpenRouter free rate limit reached. Please retry in 1 minute.' 
                            : streamError?.message || 'Streaming failed';
                        controller.enqueue(new TextEncoder().encode(`\n// Stream interrupted: ${msg}`));
                        controller.close();
                    }
                },
            });
        }

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            },
        });

    } catch (error: any) {
        console.error('AI Model API Error:', error);
        
        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to generate code. Please try again.';
            
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(`// Error: ${errorMessage}`));
                controller.close();
            }
        });

        return new Response(errorStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
            },
        });
    }
}
