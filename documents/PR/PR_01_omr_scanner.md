# PR #1: OMR Scanner Application

## Branch
`feature/omr-scanner`

## Summary
Standalone web application for scanning OMR answer sheets using AI (Gemini/OpenAI). Converts PDFs to images and extracts student responses.

## Files Added
```
omr-scannner/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main scanner UI
│   │   ├── components/
│   │   │   ├── FileUpload.tsx   # PDF upload component
│   │   │   ├── ResultsTable.tsx # Dynamic results display
│   │   │   └── ModelConfig.tsx  # AI model selector
│   │   ├── services/
│   │   │   ├── pdfService.ts    # PDF to image conversion
│   │   │   └── aiService.ts     # Gemini/OpenAI integration
│   │   └── utils/
│   │       └── prompts.ts       # OMR extraction prompts
│   ├── package.json
│   └── vite.config.ts
├── data/
│   └── output/                  # CSV output directory
└── README.md
```

## Key Features
- PDF to Image conversion (client-side)
- AI-powered OMR extraction (Gemini 2.0 Flash / GPT-4o)
- Dynamic model configuration
- Student ID persistence across pages
- Auto-download CSV on completion
- LocalStorage data persistence
- Wake Lock to prevent sleep during processing

## Testing Instructions
1. `cd omr-scannner/frontend && npm install`
2. `npm run dev`
3. Open `http://localhost:5173`
4. Upload a PDF with OMR answer sheets
5. Select AI model and start scanning
6. Verify CSV output contains correct student data

## Dependencies Added
- `pdfjs-dist` - PDF rendering
- `openai` - OpenAI API client
- `@google/generative-ai` - Gemini API client

## Breaking Changes
None - This is a new standalone application.
