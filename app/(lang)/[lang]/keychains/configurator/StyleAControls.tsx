
import { KeychainConfig } from '../KeychainConfigurator';
import Tooltip from './Tooltip';
import ColorSelector from './ColorSelector';

interface StyleAControlsProps {
  config: KeychainConfig;
  onUpdate: (updates: Partial<KeychainConfig>) => void;
  errors: Record<string, string>;
}

export default function StyleAControls({ config, onUpdate, errors }: StyleAControlsProps) {
  const fonts = [
    'Archivo Black', 'Bangers', 'Bungee', 'Changa One', 'Bebas Neue', 
    'Noto Sans', 'Poppins Black', 'Pacifico', 'Press Start 2P', 'Audiowide', 'DynaPuff'
  ];

  return (
    <div className="space-y-4">
      {/* Two Lines Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="twoLines" className="text-sm font-medium text-gray-700">
            Two Lines
          </label>
          <Tooltip content="Use a second line for surnames or short phrases.">
            <i className="ri-information-line w-4 h-4 flex items-center justify-center text-gray-400 cursor-help"></i>
          </Tooltip>
        </div>
        <button
          id="twoLines"
          onClick={() => onUpdate({ twoLines: !config.twoLines })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            config.twoLines ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={config.twoLines}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.twoLines ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {/* Line Inputs */}
      {config.twoLines && (
        <div className="space-y-3">
          <div>
            <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-2">
              Line 1 *
            </label>
            <input
              id="line1"
              type="text"
              value={config.line1}
              onChange={(e) => onUpdate({ line1: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.line1 ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="First line"
            />
            {errors.line1 && (
              <p className="text-red-500 text-xs mt-1" role="alert">{errors.line1}</p>
            )}
          </div>
          <div>
            <label htmlFor="line2" className="block text-sm font-medium text-gray-700 mb-2">
              Line 2
            </label>
            <input
              id="line2"
              type="text"
              value={config.line2}
              onChange={(e) => onUpdate({ line2: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Second line (optional)"
            />
          </div>
        </div>
      )}
      
      {/* Font Selection */}
      <div>
        <label htmlFor="fontA" className="block text-sm font-medium text-gray-700 mb-2">
          Font
        </label>
        <select
          id="fontA"
          value={config.fontA}
          onChange={(e) => onUpdate({ fontA: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 cursor-pointer"
        >
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      
      {/* Text Size */}
      <div>
        <label htmlFor="textSize" className="block text-sm font-medium text-gray-700 mb-2">
          Text Size: {config.textSize}mm
        </label>
        <input
          id="textSize"
          type="range"
          min="5"
          max="50"
          value={config.textSize}
          onChange={(e) => onUpdate({ textSize: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Line Spacing */}
      <div>
        <label htmlFor="lineSpacing" className="block text-sm font-medium text-gray-700 mb-2">
          Line Spacing: {config.lineSpacing}
        </label>
        <input
          id="lineSpacing"
          type="range"
          min="0.8"
          max="1.6"
          step="0.1"
          value={config.lineSpacing}
          onChange={(e) => onUpdate({ lineSpacing: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Border Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="borderThickness" className="block text-sm font-medium text-gray-700 mb-2">
            Border Thickness: {config.borderThickness}mm
          </label>
          <input
            id="borderThickness"
            type="range"
            min="1"
            max="6"
            value={config.borderThickness}
            onChange={(e) => onUpdate({ borderThickness: parseInt(e.target.value) })}
            className="w-full cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="borderHeight" className="block text-sm font-medium text-gray-700 mb-2">
            Border Height: {config.borderHeight}mm
          </label>
          <input
            id="borderHeight"
            type="range"
            min="1"
            max="6"
            value={config.borderHeight}
            onChange={(e) => onUpdate({ borderHeight: parseInt(e.target.value) })}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
      
      {/* Text Height */}
      <div>
        <label htmlFor="textHeight" className="block text-sm font-medium text-gray-700 mb-2">
          Text Height: {config.textHeight > 0 ? '+' : ''}{config.textHeight}mm
        </label>
        <input
          id="textHeight"
          type="range"
          min="-3"
          max="4"
          step="0.1"
          value={config.textHeight}
          onChange={(e) => onUpdate({ textHeight: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Engraved</span>
          <span>Raised</span>
        </div>
      </div>
      
      {/* Ring Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Ring Settings</h4>
          <button
            onClick={() => onUpdate({ showRingA: !config.showRingA })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              config.showRingA ? 'bg-blue-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={config.showRingA}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.showRingA ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {config.showRingA && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="outerDiameter" className="block text-sm font-medium text-gray-700 mb-2">
                  Outer Ø: {config.outerDiameter}mm
                </label>
                <input
                  id="outerDiameter"
                  type="range"
                  min="6"
                  max="14"
                  value={config.outerDiameter}
                  onChange={(e) => onUpdate({ outerDiameter: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="innerDiameter" className="block text-sm font-medium text-gray-700 mb-2">
                  Inner Ø: {config.innerDiameter}mm
                </label>
                <input
                  id="innerDiameter"
                  type="range"
                  min="2"
                  max="6"
                  value={config.innerDiameter}
                  onChange={(e) => onUpdate({ innerDiameter: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="ringHeightA" className="block text-sm font-medium text-gray-700 mb-2">
                Ring Height: {config.ringHeightA}mm
              </label>
              <input
                id="ringHeightA"
                type="range"
                min="2"
                max="5"
                value={config.ringHeightA}
                onChange={(e) => onUpdate({ ringHeightA: parseInt(e.target.value) })}
                className="w-full cursor-pointer"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="adjustX" className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust X: {config.adjustX > 0 ? '+' : ''}{config.adjustX}mm
                </label>
                <input
                  id="adjustX"
                  type="range"
                  min="-10"
                  max="10"
                  value={config.adjustX}
                  onChange={(e) => onUpdate({ adjustX: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="adjustY" className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Y: {config.adjustY > 0 ? '+' : ''}{config.adjustY}mm
                </label>
                <input
                  id="adjustY"
                  type="range"
                  min="-10"
                  max="10"
                  value={config.adjustY}
                  onChange={(e) => onUpdate({ adjustY: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Colors */}
      <div className="border-t pt-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-md font-medium text-gray-900">Colors</span>
          <div className="flex rounded-full p-1 bg-gray-200">
            <button
              onClick={() => onUpdate({ colorModeA: 'single' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                config.colorModeA === 'single' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => onUpdate({ colorModeA: 'two' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                config.colorModeA === 'two' 
                ? 'bg-white text-gray-900 shadow' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Two Colors
            </button>
          </div>
        </div>
        
        {config.colorModeA === 'single' ? (
          <ColorSelector
            label="Single Color"
            value={config.singleColorA}
            onChange={(color) => onUpdate({ singleColorA: color })}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <ColorSelector
              label="Base Color"
              value={config.baseColorA}
              onChange={(color) => onUpdate({ baseColorA: color })}
            />
            <ColorSelector
              label="Text Color"
              value={config.textColorA}
              onChange={(color) => onUpdate({ textColorA: color })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
