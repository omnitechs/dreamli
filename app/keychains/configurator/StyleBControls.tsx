
import { KeychainConfig } from '../KeychainConfigurator';
import ColorSelector from './ColorSelector';

interface StyleBControlsProps {
  config: KeychainConfig;
  onUpdate: (updates: Partial<KeychainConfig>) => void;
}

export default function StyleBControls({ config, onUpdate }: StyleBControlsProps) {
  const fonts = [
    'Archivo Black', 'Bangers', 'Bungee', 'Changa One', 'Bebas Neue', 'Poppins Black'
  ];

  const nameLength = Math.min((config.name || config.text || '').length, 12);

  const updateLetterColor = (index: number, color: string) => {
    const newColors = [...(config.letterColors || [])];
    while (newColors.length <= index) {
      newColors.push('blue');
    }
    newColors[index] = color;
    onUpdate({ letterColors: newColors });
  };

  const updateLetterOffset = (index: number, offset: number) => {
    const newOffsets = [...(config.letterOffsets || [])];
    while (newOffsets.length <= index) {
      newOffsets.push(0);
    }
    newOffsets[index] = offset;
    onUpdate({ letterOffsets: newOffsets });
  };

  return (
    <div className="space-y-4">
      {/* Font Selection */}
      <div>
        <label htmlFor="fontB" className="block text-sm font-medium text-gray-700 mb-2">
          Font
        </label>
        <select
          id="fontB"
          value={config.fontB}
          onChange={(e) => onUpdate({ fontB: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 cursor-pointer"
        >
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      
      {/* Letter Size */}
      <div>
        <label htmlFor="letterSize" className="block text-sm font-medium text-gray-700 mb-2">
          Letter Size: {config.letterSize}mm
        </label>
        <input
          id="letterSize"
          type="range"
          min="5"
          max="50"
          value={config.letterSize}
          onChange={(e) => onUpdate({ letterSize: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Spacing */}
      <div>
        <label htmlFor="spacingB" className="block text-sm font-medium text-gray-700 mb-2">
          Spacing: {config.spacingB}
        </label>
        <input
          id="spacingB"
          type="range"
          min="0.5"
          max="1.2"
          step="0.05"
          value={config.spacingB}
          onChange={(e) => onUpdate({ spacingB: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Heights */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="oddHeight" className="block text-sm font-medium text-gray-700 mb-2">
            Odd Letters Height: {config.oddHeight}mm
          </label>
          <input
            id="oddHeight"
            type="range"
            min="1"
            max="10"
            value={config.oddHeight}
            onChange={(e) => onUpdate({ oddHeight: parseInt(e.target.value) })}
            className="w-full cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="evenHeight" className="block text-sm font-medium text-gray-700 mb-2">
            Even Letters Height: {config.evenHeight}mm
          </label>
          <input
            id="evenHeight"
            type="range"
            min="1"
            max="10"
            value={config.evenHeight}
            onChange={(e) => onUpdate({ evenHeight: parseInt(e.target.value) })}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
      
      {/* Ring Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Ring Settings</h4>
          <button
            onClick={() => onUpdate({ showRingB: !config.showRingB })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              config.showRingB ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={config.showRingB}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.showRingB ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {config.showRingB && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ringSizeB" className="block text-sm font-medium text-gray-700 mb-2">
                  Ring Size: {config.ringSizeB}mm
                </label>
                <input
                  id="ringSizeB"
                  type="range"
                  min="4"
                  max="15"
                  value={config.ringSizeB}
                  onChange={(e) => onUpdate({ ringSizeB: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="ringHeightB" className="block text-sm font-medium text-gray-700 mb-2">
                  Ring Height: {config.ringHeightB}mm
                </label>
                <input
                  id="ringHeightB"
                  type="range"
                  min="1"
                  max="10"
                  value={config.ringHeightB}
                  onChange={(e) => onUpdate({ ringHeightB: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="ringXB" className="block text-sm font-medium text-gray-700 mb-2">
                  Ring X: {config.ringXB}mm
                </label>
                <input
                  id="ringXB"
                  type="range"
                  min="-20"
                  max="0"
                  step="0.1"
                  value={config.ringXB}
                  onChange={(e) => onUpdate({ ringXB: parseFloat(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="ringYB" className="block text-sm font-medium text-gray-700 mb-2">
                  Ring Y: {config.ringYB > 0 ? '+' : ''}{config.ringYB}mm
                </label>
                <input
                  id="ringYB"
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={config.ringYB}
                  onChange={(e) => onUpdate({ ringYB: parseFloat(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Colors */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Colors</h4>
          <button
            onClick={() => onUpdate({ useSingleColorB: !config.useSingleColorB })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              config.useSingleColorB ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={config.useSingleColorB}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.useSingleColorB ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {config.useSingleColorB ? (
          <div className="grid grid-cols-2 gap-4">
            <ColorSelector
              label="General Color"
              value={config.generalColorB}
              onChange={(color) => onUpdate({ generalColorB: color })}
            />
            <ColorSelector
              label="Ring Color"
              value={config.ringColorB}
              onChange={(color) => onUpdate({ ringColorB: color })}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Per-letter colors (first {nameLength} letters):</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: nameLength }, (_, i) => (
                <ColorSelector
                  key={i}
                  label={`L${i + 1}`}
                  value={(config.letterColors && config.letterColors[i]) || 'blue'}
                  onChange={(color) => updateLetterColor(i, color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Per-letter X-offsets */}
      {(config.name || config.text) && nameLength > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-900 mb-4">Letter Positions</h4>
          <div className="space-y-3">
            {Array.from({ length: nameLength }, (_, i) => (
              <div key={i}>
                <label htmlFor={`offset-${i}`} className="block text-sm font-medium text-gray-700 mb-2">
                  L{i + 1} X-offset: {((config.letterOffsets && config.letterOffsets[i]) || 0) > 0 ? '+' : ''}{(config.letterOffsets && config.letterOffsets[i]) || 0}mm
                </label>
                <input
                  id={`offset-${i}`}
                  type="range"
                  min="-8"
                  max="8"
                  step="0.1"
                  value={(config.letterOffsets && config.letterOffsets[i]) || 0}
                  onChange={(e) => updateLetterOffset(i, parseFloat(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
