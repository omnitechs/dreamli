
import Tooltip from './Tooltip';

interface StyleSelectorProps {
  selected: 'A' | 'B' | 'C';
  onSelect: (style: 'A' | 'B' | 'C') => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  const styles = [
    {
      id: 'A' as const,
      name: 'Text + Outline',
      description: 'Classic text with border',
      tooltip: 'Clean text with customizable outline and border effects'
    },
    {
      id: 'B' as const,
      name: 'Per-Letter Heights',
      description: 'Wavy/Pixel line',
      tooltip: 'Alternate heights for a playful wavy effect.'
    },
    {
      id: 'C' as const,
      name: 'Segmented Chain',
      description: 'Link blocks',
      tooltip: 'Each letter is a separate block joined with links.'
    }
  ];

  const handleStyleChange = (styleId: 'A' | 'B' | 'C') => {
    onSelect(styleId);
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'style_selected', {
        event_category: 'configurator',
        event_label: `style_${styleId}`,
        value: styleId
      });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Style</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <Tooltip key={style.id} content={style.tooltip}>
            <button
              onClick={() => handleStyleChange(style.id)}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap ${
                selected === style.id
                  ? 'border-blue-600 bg-blue-50 text-blue-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              aria-label={`Select ${style.name} style`}
            >
              <div className="text-sm font-medium">{style.name}</div>
              <div className="text-xs opacity-75 mt-1">{style.description}</div>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
