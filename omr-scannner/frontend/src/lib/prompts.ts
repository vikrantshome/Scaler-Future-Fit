export const OMR_PROMPTS = {
  PAGE_1_DETAILS: `
You are an OMR Scanner. Analyze this "Page 1 - Student Details" of the Scaler Future Fit assessment.
Extract the following fields into a JSON object:
{
  "student_id": "Extract the ID from the top right 'Student ID' block",
  "full_name": "Read the handwritten name (Block letters)",
  "email": "Read the handwritten email",
  "school_name": "Read the school name",
  "city": "Read the city",
  "date": "Read the date (DD-MM-YYYY) from the digits",
  "mobile_number": "Read the 10-digit mobile number",
  "grade": "Read the 2-digit grade"
}
If a field is empty or unreadable, set it to null or empty string.
  `,

  PAGE_2_PERSONALITY: `
You are an OMR Scanner. Analyze this "Page 2 - Personality Assessment" (Q1-12) of the Scaler Future Fit assessment.
Extract the handwritten numbers (1-5) written in the boxes for questions 1 to 12.
Also extract the Student ID from top right.
Return JSON:
{
  "student_id": "...",
  "q1": number | null,
  "q2": number | null,
  ...
  "q12": number | null
}
  `,

  PAGE_3_ACADEMIC: `
You are an OMR Scanner. Analyze this "Page 3 - Academic Preferences" (Q13-17) of the Scaler Future Fit assessment.
Identify the filled bubble (A, B, C, D, or E) for each question.
Also extract the Student ID from top right.
Return JSON:
{
  "student_id": "...",
  "q13": "A" | "B" | "C" | "D" | "E" | null,
  "q14": "...",
  "q15": "...",
  "q16": "...",
  "q17": "..."
}
  `,

  PAGE_4_CONSENT: `
You are an OMR Scanner. Analyze this "Page 4 - Consent" of the Scaler Future Fit assessment.
Check if the "Consent for Contact" checkbox is ticked/filled.
Also extract the Student ID from top right.
Return JSON:
{
  "student_id": "...",
  "consent": boolean
}
  `,

  CLASSIFY_PAGE: `
You are an OMR Scanner. Identify the type of this OMR page.
- Page 1: "Student Details" (form fields for Name, Email, School etc.)
- Page 2: "Personality Assessment" (Numbers 1-5 in boxes, Q1-Q12)
- Page 3: "Academic Preferences" (Bubbles A-E, Q13-Q17)
- Page 4: "Consent" (A single "Consent for Contact" checkbox)

Check the title and content.
Return JSON:
{
  "page_type": 1 | 2 | 3 | 4 | 0
}
Use 0 if unknown.
  `
};
