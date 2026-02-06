import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

// Initialize Gemini API
// API Key should be provided by the user via UI or Environment Variable
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string, modelName: string = 'gemini-1.5-flash') {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    /**
     * Generates content from an OMR image using a specific system prompt
     */
    async analyzeOMR(imageBase64: string, systemPrompt: string): Promise<any> {
        try {
            // Remove data URL prefix if present for Parts
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
            console.error('Gemini Analysis Error:', error);
            throw error;
        }
    }

    private parseJSON(text: string) {
        try {
            // Clean up markdown blocks if present ( ```json ... ``` )
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.warn('Failed to parse JSON, returning raw text', text);
            throw new Error('Invalid JSON response from AI');
        }
    }
}
