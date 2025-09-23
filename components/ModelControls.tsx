
'use client';

interface ModelControlsProps {
  onReset: () => void;
  onDownload?: () => void;
  fileName?: string;
}

export default function ModelControls({ 
  onReset, 
  onDownload, 
  fileName 
}: ModelControlsProps) {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Model Controls</h3>
      
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          <strong>Mouse Controls:</strong>
        </div>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click and drag to rotate</li>
          <li>• Scroll to zoom in/out</li>
        </ul>
      </div>

      {fileName && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Current File:</div>
          <div className="font-medium text-gray-900 truncate">{fileName}</div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors whitespace-nowrap"
        >
          <i className="ri-refresh-line mr-2"></i>
          Reset View
        </button>
        
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-download-line mr-2"></i>
            Download
          </button>
        )}
      </div>
    </div>
  );
}
