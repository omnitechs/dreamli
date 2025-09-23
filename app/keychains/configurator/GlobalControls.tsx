
import { KeychainConfig } from '../KeychainConfigurator';
import Tooltip from './Tooltip';

interface GlobalControlsProps {
  config: KeychainConfig;
  onUpdate: (updates: Partial<KeychainConfig>) => void;
  errors: Record<string, string>;
}

export default function GlobalControls({ config, onUpdate, errors }: GlobalControlsProps) {
  return (
    <div className="space-y-4">
      {/* Max Size Slider */}
      <div>
        <label htmlFor="maxSize" className="block text-sm font-medium text-gray-700 mb-2">
          Max Size: {config.maxSize}mm
        </label>
        <input
          id="maxSize"
          type="range"
          min="20"
          max="250"
          value={config.maxSize}
          onChange={(e) => onUpdate({ maxSize: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
          aria-label="Maximum size in millimeters"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20mm</span>
          <span>250mm</span>
        </div>
      </div>
      
      {/* Ring Position */}
      <div>
        <label htmlFor="ringPosition" className="block text-sm font-medium text-gray-700 mb-2">
          Ring Position
        </label>
        <select
          id="ringPosition"
          value={config.ringPosition}
          onChange={(e) => onUpdate({ 
            ringPosition: e.target.value as 'left' | 'right' | 'top' | 'custom' 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 cursor-pointer"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="top">Top</option>
          <option value="custom">Custom (X/Y)</option>
        </select>
      </div>
      
      {/* Custom Ring Position */}
      {config.ringPosition === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ringX" className="block text-sm font-medium text-gray-700 mb-2">
              Ring X: {config.ringX}mm
            </label>
            <input
              id="ringX"
              type="range"
              min="-100"
              max="100"
              step="0.5"
              value={config.ringX}
              onChange={(e) => onUpdate({ ringX: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="ringY" className="block text-sm font-medium text-gray-700 mb-2">
              Ring Y: {config.ringY}mm
            </label>
            <input
              id="ringY"
              type="range"
              min="-100"
              max="100"
              step="0.5"
              value={config.ringY}
              onChange={(e) => onUpdate({ ringY: parseFloat(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      )}
      
      {/* NFC Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="nfcToggle" className="text-sm font-medium text-gray-700">
            NFC
          </label>
          <Tooltip content="Add a small NFC tag that opens your link when tapped with a phone.">
            <i className="ri-information-line w-4 h-4 flex items-center justify-center text-gray-400 cursor-help"></i>
          </Tooltip>
        </div>
        <button
          id="nfcToggle"
          onClick={() => onUpdate({ nfcEnabled: !config.nfcEnabled, nfc: !config.nfcEnabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            config.nfcEnabled ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={config.nfcEnabled}
          aria-label="Toggle NFC feature"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.nfcEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {/* NFC URL Input */}
      {config.nfcEnabled && (
        <div>
          <label htmlFor="nfcUrl" className="block text-sm font-medium text-gray-700 mb-2">
            NFC URL *
          </label>
          <input
            id="nfcUrl"
            type="url"
            value={config.nfcUrl}
            onChange={(e) => onUpdate({ nfcUrl: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              errors.nfcUrl ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="https://example.com"
            aria-describedby={errors.nfcUrl ? "nfc-url-error" : undefined}
          />
          {errors.nfcUrl && (
            <p id="nfc-url-error" className="text-red-500 text-xs mt-1" role="alert">
              {errors.nfcUrl}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
