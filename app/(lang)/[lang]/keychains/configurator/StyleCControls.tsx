
import { KeychainConfig } from '../KeychainConfigurator';
import ColorSelector from './ColorSelector';

interface StyleCControlsProps {
  config: KeychainConfig;
  onUpdate: (updates: Partial<KeychainConfig>) => void;
}

export default function StyleCControls({ config, onUpdate }: StyleCControlsProps) {
  const fonts = [
    'Archivo Black', 'Bangers', 'Bungee', 'Changa One', 'Bebas Neue', 'Poppins Black', 'Sedgwick Ave Display'
  ];

  return (
    <div className="space-y-4">
      {/* Font Selection */}
      <div>
        <label htmlFor="fontC" className="block text-sm font-medium text-gray-700 mb-2">
          Font
        </label>
        <select
          id="fontC"
          value={config.fontC}
          onChange={(e) => onUpdate({ fontC: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 cursor-pointer"
        >
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      
      {/* Letter Size */}
      <div>
        <label htmlFor="letterSizeC" className="block text-sm font-medium text-gray-700 mb-2">
          Letter Size: {config.letterSizeC}mm
        </label>
        <input
          id="letterSizeC"
          type="range"
          min="5"
          max="30"
          value={config.letterSizeC}
          onChange={(e) => onUpdate({ letterSizeC: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Letter Relief Height */}
      <div>
        <label htmlFor="letterReliefHeight" className="block text-sm font-medium text-gray-700 mb-2">
          Letter Relief Height: {config.letterReliefHeight > 0 ? '+' : ''}{config.letterReliefHeight}mm
        </label>
        <input
          id="letterReliefHeight"
          type="range"
          min="-12"
          max="5"
          value={config.letterReliefHeight}
          onChange={(e) => onUpdate({ letterReliefHeight: parseInt(e.target.value) })}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Engraved</span>
          <span>Raised</span>
        </div>
      </div>
      
      {/* Base Rectangle Settings */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Base Rectangle</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="blockHeight" className="block text-sm font-medium text-gray-700 mb-2">
              Height: {config.blockHeight}mm
            </label>
            <input
              id="blockHeight"
              type="range"
              min="6"
              max="12"
              value={config.blockHeight}
              onChange={(e) => onUpdate({ blockHeight: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="blockWidth" className="block text-sm font-medium text-gray-700 mb-2">
              Width: {config.blockWidth}mm
            </label>
            <input
              id="blockWidth"
              type="range"
              min="10"
              max="18"
              value={config.blockWidth}
              onChange={(e) => onUpdate({ blockWidth: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="blockLength" className="block text-sm font-medium text-gray-700 mb-2">
              Length: {config.blockLength}mm
            </label>
            <input
              id="blockLength"
              type="range"
              min="12"
              max="20"
              value={config.blockLength}
              onChange={(e) => onUpdate({ blockLength: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* First Element Link Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="firstElementLink" className="text-sm font-medium text-gray-700">
          First Element Link
        </label>
        <button
          id="firstElementLink"
          onClick={() => onUpdate({ firstElementLink: !config.firstElementLink })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
            config.firstElementLink ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
          aria-checked={config.firstElementLink}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              config.firstElementLink ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {/* Chamfer Size */}
      <div>
        <label htmlFor="chamferSize" className="block text-sm font-medium text-gray-700 mb-2">
          Chamfer Size: {config.chamferSize}mm
        </label>
        <input
          id="chamferSize"
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={config.chamferSize}
          onChange={(e) => onUpdate({ chamferSize: parseFloat(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>
      
      {/* Side Link Settings */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Side Link (Cylinder)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="outerDiameterC" className="block text-sm font-medium text-gray-700 mb-2">
              Outer Ø: {config.outerDiameterC}mm
            </label>
            <input
              id="outerDiameterC"
              type="range"
              min="4"
              max="8"
              value={config.outerDiameterC}
              onChange={(e) => onUpdate({ outerDiameterC: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="innerDiameterC" className="block text-sm font-medium text-gray-700 mb-2">
              Inner Ø: {config.innerDiameterC}mm
            </label>
            <input
              id="innerDiameterC"
              type="range"
              min="2"
              max="4"
              value={config.innerDiameterC}
              onChange={(e) => onUpdate({ innerDiameterC: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="linkHeight" className="block text-sm font-medium text-gray-700 mb-2">
              Link Height: {config.linkHeight}mm
            </label>
            <input
              id="linkHeight"
              type="range"
              min="3"
              max="6"
              value={config.linkHeight}
              onChange={(e) => onUpdate({ linkHeight: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="separation" className="block text-sm font-medium text-gray-700 mb-2">
              Separation: {config.separation}mm
            </label>
            <input
              id="separation"
              type="range"
              min="1"
              max="3"
              value={config.separation}
              onChange={(e) => onUpdate({ separation: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      {/* Colors */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Colors</h4>
        <div className="grid grid-cols-2 gap-4">
          <ColorSelector
            label="Base Color"
            value={config.baseColorC}
            onChange={(color) => onUpdate({ baseColorC: color })}
          />
          <ColorSelector
            label="Letter Color"
            value={config.letterColorC}
            onChange={(color) => onUpdate({ letterColorC: color })}
          />
        </div>
      </div>
    </div>
  );
}
