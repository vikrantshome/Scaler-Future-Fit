import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
// Need to ensure the worker is loaded correctly in Vite
// Using a dynamic import or URL import is standard
const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export type PDFDocument = pdfjsLib.PDFDocumentProxy;

/**
 * Loads a PDF document from a File object
 */
export async function loadPDF(file: File): Promise<PDFDocument> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    return loadingTask.promise;
}

/**
 * Renders a specific page of the PDF to an Image Data URL (JPEG)
 * @param pdf The loaded PDF document
 * @param pageNumber The page number (1-indexed)
 * @param scale Content scaling factor (default 2.0 for high quality)
 */
export async function renderPageToImage(
    pdf: PDFDocument,
    pageNumber: number,
    scale: number = 2.0
): Promise<string> {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    // @ts-ignore
    await page.render(renderContext).promise;

    // Convert to JPEG with 0.8 quality to reduce token usage
    return canvas.toDataURL('image/jpeg', 0.8);
}
