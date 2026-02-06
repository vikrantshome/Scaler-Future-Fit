import { useState } from 'react';
import { Key, Settings } from 'lucide-react';

interface ApiKeyModalProps {
    onSave: (key: string, model: string) => void;
    isOpen: boolean;
}

export function ApiKeyModal({ onSave, isOpen }: ApiKeyModalProps) {
    const [key, setKey] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="text-yellow-500" />
                    <h2 className="text-xl font-bold">Configure AI Scanner</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    To process OMR sheets, we need a Gemini API Key.
                    This key is stored only in your browser's memory.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">API KEY</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Paste Gemini API Key here..."
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Settings size={12} className="text-gray-400" />
                            <label className="block text-xs font-bold text-gray-500">MODEL NAME</label>
                        </div>
                        <input
                            type="text"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                            placeholder="e.g. gemini-1.5-flash"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            Common models: <code>gemini-2.5-flash</code>, <code>gemini-1.5-flash</code>, <code>gemini-1.5-pro</code>
                        </p>
                    </div>
                </div>

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
                    disabled={!key.trim() || !model.trim()}
                    onClick={() => onSave(key, model)}
                >
                    Start Scanner
                </button>

                <p className="text-xs text-center mt-4 text-gray-400">
                    Powered by Google Gemini
                </p>
            </div>
        </div>
    );
}
