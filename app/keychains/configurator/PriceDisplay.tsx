
interface PriceDisplayProps {
  price: number;
  nfcEnabled: boolean;
  isValid: boolean;
  onAddToCart: () => void;
  config?: {
    activeTab: 'name' | 'photo';
    resinThickness?: number;
    photo?: File | null;
  };
}

export default function PriceDisplay({ price, nfcEnabled, isValid, onAddToCart, config }: PriceDisplayProps) {
  const basePrice = config?.activeTab === 'photo' ? 20 : 15;
  const nfcPrice = nfcEnabled ? 5 : 0;
  const resinUpgrade = config?.activeTab === 'photo' && config?.resinThickness && config?.resinThickness > 2 
    ? Math.round((config.resinThickness - 2) * 2) : 0;
  
  const totalPrice = basePrice + nfcPrice + resinUpgrade;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-medium mb-4">Pricing</h3>
      
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">
            {config?.activeTab === 'photo' ? 'Photo + Resin Keychain' : 'Name Keychain'}
          </span>
          <span className="font-medium">€{basePrice}</span>
        </div>
        
        {nfcEnabled && (
          <div className="flex justify-between">
            <span className="text-gray-600">NFC Tag</span>
            <span className="font-medium">€{nfcPrice}</span>
          </div>
        )}
        
        {resinUpgrade > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Extra Resin ({config?.resinThickness}mm)</span>
            <span className="font-medium">€{resinUpgrade}</span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>€{totalPrice}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onAddToCart}
        disabled={!isValid}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors whitespace-nowrap cursor-pointer ${
          isValid
            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {!isValid 
          ? (config?.activeTab === 'photo' ? 'Upload Photo to Continue' : 'Enter Name to Continue')
          : 'Add to Cart'
        }
      </button>
      
      {config?.activeTab === 'photo' && config?.photo && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center"></i>
            <span className="text-sm font-medium">Photo Protected</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Your photo will be sealed in durable resin coating for long-lasting protection.
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🚚 Free shipping over €50</p>
        <p>⚡ 3-5 business days production</p>
      </div>
    </div>
  );
}
