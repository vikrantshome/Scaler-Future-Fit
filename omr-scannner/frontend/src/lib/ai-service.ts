import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import { SUPPORTED_MODELS } from './types';

export interface AIService {
    analyzeOMR(imageBase64: string, systemPrompt: string, onRetry?: (attempt: number) => void): Promise<any>;
}

/**
 * Utility for infinite retries on transient service errors
 */
async function withRetry<T>(
    fn: () => Promise<T>,
    onRetry?: (attempt: number) => void
): Promise<T> {
    let attempt = 0;
    
    while (true) {
        try {
            return await fn();
        } catch (error: any) {
            const isRetryable = 
                error.message?.includes('429') || 
                error.message?.includes('503') || 
                error.message?.includes('overloaded') ||
                error.message?.includes('Rate limit') ||
                error.message?.includes('fetch'); // Network transient errors

            if (!isRetryable) {
                throw error; // Permanent error (Auth, Invalid Prompt, etc.)
            }

            attempt++;
            if (onRetry) onRetry(attempt);
            // Wait exactly 1 second before next attempt as requested
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

class GeminiProvider implements AIService {
    private model: any;

    constructor(apiKey: string, modelName: string) {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    async analyzeOMR(imageBase64: string, systemPrompt: string, onRetry?: (attempt: number) => void): Promise<any> {
        return withRetry(async () => {
            try {
                const base64Data = imageBase64.split(',')[1] || imageBase64;
                const imagePart: Part = {
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg',
                    },
                };

                const prompt = `${systemPrompt}\n\nReturn the result as a raw JSON object. Do not wrap in Markdown code blocks.`;
                const result = await this.model.generateContent([prompt, imagePart]);
                const response = await result.response;
                const text = response.text();

                return this.parseJSON(text);
            } catch (error) {
                console.error('Gemini Provider Error:', error);
                throw error;
            }
        }, onRetry);
    }

    private parseJSON(text: string) {
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    }
}

class ZaiProvider implements AIService {
    private apiKey: string;
    private modelName: string;
    private baseURL = 'https://api.z.ai/api/paas/v4';

    constructor(apiKey: string, modelName: string) {
        this.apiKey = apiKey;
        this.modelName = modelName;
    }

    async analyzeOMR(imageBase64: string, systemPrompt: string, onRetry?: (attempt: number) => void): Promise<any> {
        return withRetry(async () => {
            try {
                const imageUrl = imageBase64.startsWith('data:') 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`;

                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.modelName,
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: `${systemPrompt}\n\nReturn the result as a raw JSON object. Do not wrap in Markdown code blocks.` },
                                    {
                                        type: 'image_url',
                                        image_url: { url: imageUrl }
                                    }
                                ]
                            }
                        ],
                        temperature: 0.1
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Z.AI API Error: ${response.status} ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                const text = data.choices[0].message.content;

                return this.parseJSON(text);
            } catch (error) {
                console.error('Zai Provider Error:', error);
                throw error;
            }
        }, onRetry);
    }

    private parseJSON(text: string) {
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    }
}

class OpenRouterProvider implements AIService {
    private apiKey: string;
    private modelName: string;
    private baseURL = 'https://openrouter.ai/api/v1';

    constructor(apiKey: string, modelName: string) {
        this.apiKey = apiKey;
        this.modelName = modelName;
    }

    async analyzeOMR(imageBase64: string, systemPrompt: string, onRetry?: (attempt: number) => void): Promise<any> {
        return withRetry(async () => {
            try {
                const imageUrl = imageBase64.startsWith('data:') 
                    ? imageBase64 
                    : `data:image/jpeg;base64,${imageBase64}`;

                const response = await fetch(`${this.baseURL}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Scaler OMR Scanner'
                    },
                    body: JSON.stringify({
                        model: this.modelName,
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: `${systemPrompt}\n\nReturn the result as a raw JSON object. Do not wrap in Markdown code blocks.` },
                                    {
                                        type: 'image_url',
                                        image_url: { url: imageUrl }
                                    }
                                ]
                            }
                        ],
                        response_format: { type: 'json_object' },
                        temperature: 0.1
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`OpenRouter API Error: ${response.status} ${JSON.stringify(errorData)}`);
                }

                const data = await response.json();
                const text = data.choices[0].message.content;

                return this.parseJSON(text);
            } catch (error) {
                console.error('OpenRouter Provider Error:', error);
                throw error;
            }
        }, onRetry);
    }

    private parseJSON(text: string) {
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    }
}

export function getAIService(apiKey: string, modelId: string): AIService {
    const modelConfig = SUPPORTED_MODELS.find(m => m.id === modelId);
    
    if (!modelConfig || modelConfig.provider === 'google') {
        return new GeminiProvider(apiKey, modelId);
    }
    
    if (modelConfig.provider === 'zai') {
        return new ZaiProvider(apiKey, modelId);
    }

    if (modelConfig.provider === 'openrouter') {
        return new OpenRouterProvider(apiKey, modelId);
    }

    throw new Error(`Unsupported provider for model: ${modelId}`);
}
