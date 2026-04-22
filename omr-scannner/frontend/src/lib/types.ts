import { z } from 'zod';

// Page 1: Student Details
export const Page1Schema = z.object({
    student_id: z.string().nullable(),
    full_name: z.string().nullable(),
    email: z.string().nullable(),
    school_name: z.string().nullable(),
    city: z.string().nullable(),
    date: z.string().nullable(),
    mobile_number: z.string().nullable(),
    grade: z.string().nullable(),
});

// Page 2: Personality (Q1-12)
// Fields named q1..q12
// Value: 1-5 or null
const qSchema = z.number().min(1).max(5).nullable().or(z.string().transform(val => {
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
}));

const personalityShape: Record<string, z.ZodTypeAny> = {
    student_id: z.string().nullable(),
};
for (let i = 1; i <= 12; i++) {
    personalityShape[`q${i}`] = qSchema;
}
export const Page2Schema = z.object(personalityShape);

// Page 3: Academic (Q13-17)
// Value: A, B, C, D, E or null
const bubbleSchema = z.enum(['A', 'B', 'C', 'D', 'E']).nullable();
const academicShape: Record<string, z.ZodTypeAny> = {
    student_id: z.string().nullable(),
};
for (let i = 13; i <= 17; i++) {
    academicShape[`q${i}`] = bubbleSchema;
}
export const Page3Schema = z.object(academicShape);

// Page 4: Consent
export const Page4Schema = z.object({
    student_id: z.string().nullable(),
    consent: z.boolean().nullable(),
});

// Aggregated Student Record
export const StudentRecordSchema = Page1Schema.extend({
    // Merge Page 2 fields
    ...personalityShape,
    // Merge Page 3 fields
    ...academicShape,
    // Merge Page 4 fields
    consent: z.boolean().nullable(),

    // Meta fields
    status: z.enum(['processing', 'complete', 'error']).default('processing'),
    missing_pages: z.array(z.number()).default([]),
});

export type AIProvider = 'google' | 'zai' | 'openrouter';

export interface ModelConfig {
    id: string;
    name: string;
    provider: AIProvider;
}

export const SUPPORTED_MODELS: ModelConfig[] = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google' },
    { id: 'glm-4.6v-flash', name: 'GLM-4.6V-Flash', provider: 'zai' },
    { id: 'openrouter/auto', name: 'OpenRouter Free (Auto)', provider: 'openrouter' },
];

export type Page1Data = z.infer<typeof Page1Schema>;
export type Page2Data = z.infer<typeof Page2Schema>;
export type Page3Data = z.infer<typeof Page3Schema>;
export type Page4Data = z.infer<typeof Page4Schema>;
export type StudentRecord = z.infer<typeof StudentRecordSchema>;
