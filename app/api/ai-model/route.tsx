import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import { AppError, handleApiError, validateRequest } from "@/lib/error-handling";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
});

export const maxDuration = 300;

export async function POST(req: NextRequest) {
    try {
        const { model, description, imageUrl } = await req.json();

        // Validate required fields
        validateRequest({ model, description, imageUrl }, ['model', 'description', 'imageUrl']);

        // Validate API key
        if (!process.env.OPENROUTER_AI_API_KEY) {
            throw new AppError('AI service configuration missing', 500);
        }

        const ModelObj = Constants.AiModelList.find(item => item.name === model);
        if (!ModelObj) {
            throw new AppError(`Invalid AI model: ${model}`, 400);
        }

        const modelName = ModelObj?.modelName;
        console.log('Using AI model:', modelName);

        const response = await openai.chat.completions.create({
            model: modelName ?? 'google/gemini-2.0-pro-exp-02-05:free',
            stream: true,
            max_tokens: 4000,
            temperature: 0.7,
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": description
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": imageUrl
                            }
                        }
                    ]
                }
            ]
        });

        // Create a readable stream to send data in real-time
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        controller.enqueue(new TextEncoder().encode(text));
                    }
                    controller.close();
                } catch (streamError) {
                    console.error('Stream error:', streamError);
                    controller.error(streamError);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive"
            },
        });

    } catch (error) {
        console.error('AI Model API Error:', error);
        
        // Return error as a stream to match expected response format
        const errorMessage = error instanceof AppError 
            ? error.message 
            : 'Failed to generate code. Please try again.';
            
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode(`// Error: ${errorMessage}`));
                controller.close();
            }
        });

        return new Response(errorStream, {
            status: error instanceof AppError ? error.statusCode : 500,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    }
}