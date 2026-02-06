# Work Breakdown Structure (WBS) - AI OMR Scanner

## 1. Project Management & Architecture
### 1.1. Requirement Analysis
- 1.1.1. Analyze OMR Layout (`omr_sheet.html`) & Field Mapping
- 1.1.2. Define JSON Data Schema for Export
- 1.1.3. finalize Tech Stack (React, Vite, PDF.js, Gemini API)

### 1.2. Technical Architecture
- 1.2.1. Define Client-Side State Management (Zustand/Context for Batch Processing)
- 1.2.2. Design Component Hierarchy
- 1.2.3. Setup Application Routing (Upload -> Processing -> Results)

## 2. Frontend Environment Setup
### 2.1. Project Initialization
- 2.1.1. Initialize Vite + React (TypeScript)
- 2.1.2. Configure TailwindCSS & Shadcn/UI (optional) for styling
- 2.1.3. Setup Linting & Prettier constraints

### 2.2. Dependency Management
- 2.2.1. Install PDF Handling Libraries (`pdfjs-dist`, `react-pdf`)
- 2.2.2. Install Data Handling Libraries (`xlsx`, `papaparse`, `zod`)
- 2.2.3. Install UI Utilities (`lucide-react`, `clsx`, `tailwind-merge`)

## 3. Core Module: PDF Engine
### 3.1. File Handling
- 3.1.1. Implement Drag-and-Drop File Uploader
- 3.1.2. Implement File Validation (PDF Type, Size Limits)

### 3.2. Rendering Pipeline
- 3.2.1. Implement `PDFDocument` parsing service
- 3.2.2. Create `PageRenderer` to convert PDF Pages to Canvas/Blob objects
- 3.2.3. Implement Image Pre-processing (Compression/Resizing for API limits)

## 4. Core Module: AI Processing Engine
### 4.1. API Integration
- 4.1.1. Create `GeminiClient` service for API communication
- 4.1.2. Implement Rate Limiting / Queue System (Start/Pause/Resume)
- 4.1.3. Error Handling & Retry Logic (for 429s or Network Errors)

### 4.2. Prompt Engineering (Multi-Page Strategy)
- 4.2.1. Develop **Page 1 Prompt**: Extract Text (Name, Email) & Digits (Mobile, Date)
- 4.2.2. Develop **Page 2 Prompt**: Extract Handwriting Digits (Personality Q1-12)
- 4.2.3. Develop **Page 3 Prompt**: Extract Bubbles (Academic Q13-17)
- 4.2.4. Develop **Page 4 Prompt**: Extract Checkbox (Consent)
- 4.2.5. Develop **Universal Prompt**: Extract "Student ID" from header block

### 4.3. Data Parsing & Validation
- 4.3.1. Implement JSON Response Parser (fixing Markdown wrapping)
- 4.3.2. Create Validation Schemas (Zod) for each page type
- 4.3.3. Implement "Student Record Aggregator" (Merging 4 pages into 1 record based on Student ID)

## 5. User Interface Implementation
### 5.1. Configuration Screens
- 5.1.1. Build API Key Input Modal (Secure storage in SessionStorage)
- 5.1.2. Build Batch Configuration (Max Concurrent Requests)

### 5.2. Operational Dashboard (Scanning View)
- 5.2.1. Build Live Preview Card (Current Page Image + Overlay)
- 5.2.2. Build Processing Queue List (Pending -> Processing -> Completed)
- 5.2.3. Implement Real-time Progress Bar & Status Indicators

### 5.3. Results & Review
- 5.3.1. Build Data Table with Sorting/Filtering
- 5.3.2. Implement "Confidence Check" Highlighting (Flag missing/low-confidence fields)
- 5.3.3. Enable Inline Editing for corrections

### 5.4. Export Module
- 5.4.1. Implement CSV Export Formatting (Flattened JSON to CSV)
- 5.4.2. Implement JSON Bundle Export (Backup)

## 6. Testing, Optimization & Deployment
### 6.1. Functional Testing
- 6.1.1. Unit Test: PDF to Image conversion
- 6.1.2. Integration Test: Full pipeline with sample `Branch Fitment Test.pdf`
- 6.1.3. Validate Data Accuracy against known values

### 6.2. Performance Optimization
- 6.2.1. Memory Management (revokeObjectURLs for images)
- 6.2.2. Optimize Prompt tokens to reduce cost/latency

### 6.3. Documentation & Handover
- 6.3.1. Write User Guide (How to scan, API Keys)
- 6.3.2. Finalize README.md
