
interface ColorSelectorProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorSelector({ label, value, onChange }: ColorSelectorProps) {
  const colors = [
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
    { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Orange', value: 'orange', hex: '#F97316' },
    { name: 'Gray', value: 'gray', hex: '#6B7280' },
    { name: 'Black', value: 'black', hex: '#1F2937' },
    { name: 'White', value: 'white', hex: '#FFFFFF' }
  ];

  const getColorHex = (colorValue: string) => {
    const color = colors.find(c => c.value === colorValue || c.hex === colorValue);
    return color ? color.hex : colorValue;
  };

  const getColorValue = (colorInput: string) => {
    const color = colors.find(c => c.hex === colorInput || c.value === colorInput);
    return color ? color.value : colorInput;
  };

  const handleColorChange = (colorValue: string) => {
    onChange(colorValue);
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'color_changed', {
        event_category: 'configurator',
        event_label: colorValue,
        value: colorValue
      });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorChange(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
              getColorValue(value) === color.value
                ? 'border-gray-900 scale-110'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          >
            {color.value === 'white' && (
              <div className="w-full h-full rounded-full border border-gray-200"></div>
            )}
            {getColorValue(value) === color.value && (
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <i className={`ri-check-line text-sm ${
                  color.value === 'white' || color.value === 'yellow' 
                    ? 'text-gray-800' 
                    : 'text-white'
                }`}></i>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
