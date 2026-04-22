import { useState } from 'react';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Dashboard } from './components/Dashboard';

function App() {
  // Migration logic: check for old gemini_* keys and move them to ai_*
  const initialKey = sessionStorage.getItem('ai_api_key') || sessionStorage.getItem('gemini_api_key');
  const initialModel = sessionStorage.getItem('ai_model') || sessionStorage.getItem('gemini_model') || 'gemini-2.5-flash';

  const [apiKey, setApiKey] = useState<string | null>(initialKey);
  const [model, setModel] = useState<string>(initialModel);

  const handleSaveKey = (key: string, modelName: string) => {
    sessionStorage.setItem('ai_api_key', key);
    sessionStorage.setItem('ai_model', modelName);
    // Cleanup old keys
    sessionStorage.removeItem('gemini_api_key');
    sessionStorage.removeItem('gemini_model');
    
    setApiKey(key);
    setModel(modelName);
  };

  const handleClearKey = () => {
    sessionStorage.removeItem('ai_api_key');
    sessionStorage.removeItem('gemini_api_key');
    setApiKey(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-bold text-xl">S</div>
          <div>
            <h1 className="font-bold leading-tight">Scaler OMR Scanner</h1>
            <p className="text-xs text-gray-500">AI-Powered • Multi-Model • Frontend Only</p>
          </div>
        </div>
        <div>
          {apiKey && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">Model: {model}</span>
              <button
                onClick={handleClearKey}
                className="text-xs text-red-500 hover:underline"
              >
                Clear Credentials
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {!apiKey ? (
          <ApiKeyModal isOpen={true} onSave={handleSaveKey} />
        ) : (
          <Dashboard apiKey={apiKey} modelName={model} />
        )}
      </main>
    </div>
  );
}

export default App;
