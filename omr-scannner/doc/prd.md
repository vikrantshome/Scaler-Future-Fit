# Product Requirements Document (PRD) - AI OMR Scanner

## 1. Introduction
The AI OMR Scanner is a **Frontend-only** web application that leverages Generative AI (Multimodal LLM) to scan and extract data from OMR sheets. Users upload a PDF, and the application processes it client-side, converting pages to images and sending them to an AI model for intelligent extraction.

## 2. Problem Statement
Traditional OMR scanners require rigid templates and backend processing. We need a flexible, zero-setup solution that runs entirely in the browser and uses modern AI to "read" the OMR sheets like a human would.

## 3. Goals & Objectives
- **Zero Backend**: All logic resides in the React frontend.
- **AI-Powered**: Use Vision-capable LLMs (e.g., Gemini 1.5 Flash, GPT-4o) to interpret OMR marks.
- **Real-time**: Visual feedback as each page is analyzed.
- **Privacy**, **Cost**: (User brings their own API key OR we use a configured endpoint).

## 4. User Stories
- **Upload**: User selects a PDF file.
- **Key Configuration**: User enters their API Key (if required) for the AI service.
- **Scanning**: The app converts the PDF pages to high-quality images in the browser.
- **Extraction**: The app sends each image to the AI with a specific prompt ("Extract Student ID and marked answers...").
- **Review**: User sees the extracted data populate a table row-by-row.
- **Export**: User downloads the table as a CSV.

## 5. Functional Requirements

### 5.1. Frontend Architecture
- **Framework**: React (Vite).
- **Styling**: TailwindCSS (Modern, clean, "VibeMatch" aesthetic).
- **PDF Handling**: `react-pdf` or `pdfjs-dist` to render pages to HTMLCanvas/Images.

### 5.2. AI Integration
- **Model**: Gemini 1.5 Flash (Recommended for speed/cost) or GPT-4o.
- **Data Schema (JSON Output)**:
    - **Page 1 (Student Details)**:
        - `student_id` (Top right block)
        - `full_name` (Text)
        - `email` (Text)
        - `school_name` (Text)
        - `city` (Text)
        - `date` (DD-MM-YYYY)
        - `mobile_number` (10 digits)
        - `grade` (2 digits)
    - **Page 2 (Personality)**:
        - `q1` to `q12` (Numeric value 1-5 written in box)
    - **Page 3 (Academic)**:
        - `q13` to `q17` (Selected Bubble: A, B, C, D, or E)
    - **Page 4 (Consent)**:
        - `consent` (Boolean: Checked/Unchecked)
- **Prompt Strategy**:
    - Input: Image of OMR Sheet Page(s).
    - System Prompt: "You are an OMR Scanner. Analyze the provided image of the 'Scaler Future Fit' assessment sheet. Identify the page number and extract the relevant fields.
      - **Page 1**: Read handwritten text for Name, Email, School, City. Read digits for Date, Mobile, Grade.
      - **Page 2**: Read the handwritten numbers (1-5) in the boxes for Q1-12.
      - **Page 3**: Identify the filled bubble (A-E) for Q13-17.
      - **Page 4**: Check if the consent box is ticked.
      - **Universal**: Extract 'Student ID' from the top right block on every page."
    - Output Parsing: JSON mode enforcement.

### 5.3. UI Components
- **Dropzone**: "Upload your Branch Fitment Test PDF".
- **API Key Input**: (Optional/Hidden if pre-configured).
- **Live Preview**: Show the current page being scanned and the AI's "thought" (extracted JSON).
- **Results Grid**: ID, Question Columns, Status.

## 6. Technical Constraints
- **Browser Limits**: PDF scanning is memory intensive; process pages sequentially or in small batches.
- **Rate Limits**: AI APIs have RPM limits; implement throttling/queueing.

## 7. Assumptions
- The "Branch Fitment Test" OMR has clear bubbles and Student ID sections.
- The user has internet access to reach the AI API.
- We will target **Gemini API** (Google) as the primary provider given the context.
