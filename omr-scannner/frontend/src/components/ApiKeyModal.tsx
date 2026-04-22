import { useState } from 'react';
import { Key, Cpu } from 'lucide-react';
import { SUPPORTED_MODELS } from '../lib/types';

interface ApiKeyModalProps {
    onSave: (key: string, model: string) => void;
    isOpen: boolean;
}

export function ApiKeyModal({ onSave, isOpen }: ApiKeyModalProps) {
    const [key, setKey] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash');

    if (!isOpen) return null;

    const selectedModel = SUPPORTED_MODELS.find(m => m.id === model);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="text-yellow-500" />
                    <h2 className="text-xl font-bold">Configure AI Scanner</h2>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    To process OMR sheets, we need an API Key for your chosen provider.
                    This key is stored only in your browser's session memory.
                </p>

                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            <Cpu size={12} className="text-gray-400" />
                            <label className="block text-xs font-bold text-gray-500">AI MODEL</label>
                        </div>
                        <select
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        >
                            {SUPPORTED_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                            {selectedModel?.provider === 'zai' ? 'Z.AI API KEY' : 
                             selectedModel?.provider === 'openrouter' ? 'OPENROUTER API KEY' : 
                             'GEMINI API KEY'}
                        </label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={`Paste your ${selectedModel?.provider === 'zai' ? 'Z.AI' : 
                                         selectedModel?.provider === 'openrouter' ? 'OpenRouter' : 
                                         'Gemini'} API Key here...`}
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            {selectedModel?.provider === 'zai' 
                                ? 'Get your key from the Z.AI developer portal.' 
                                : selectedModel?.provider === 'openrouter'
                                ? 'Get your key from openrouter.ai.'
                                : 'Get your key from Google AI Studio.'}
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
                    OMR Scanning Powered by {selectedModel?.provider === 'zai' ? 'Z.AI GLM' : 
                                            selectedModel?.provider === 'openrouter' ? 'OpenRouter' : 
                                            'Google Gemini'}
                </p>
            </div>
        </div>
    );
}
