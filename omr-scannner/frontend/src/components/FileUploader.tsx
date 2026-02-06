import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    isProcessing?: boolean;
}

export function FileUploader({ onFileSelect, isProcessing }: FileUploaderProps) {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (isProcessing) return;

            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                onFileSelect(file);
            }
        },
        [onFileSelect, isProcessing]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div
            className={cn(
                "border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer",
                isProcessing
                    ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !isProcessing && document.getElementById('file-input')?.click()}
        >
            <input
                id="file-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
                disabled={isProcessing}
            />

            <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                    <Upload size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Upload OMR Sheet (PDF)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Drag & drop or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                        Supports multi-page PDFs
                    </p>
                </div>
            </div>
        </div>
    );
}
