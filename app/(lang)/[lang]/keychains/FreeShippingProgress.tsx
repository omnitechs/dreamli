
interface FreeShippingProgressProps {
  cartTotal: number;
}

export default function FreeShippingProgress({ cartTotal }: FreeShippingProgressProps) {
  const freeShippingThreshold = 50;
  const remaining = Math.max(0, freeShippingThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  if (cartTotal === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-4 border z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {remaining > 0 
            ? `Spend €${remaining.toFixed(2)} more for free shipping`
            : 'You qualify for free shipping!'
          }
        </span>
        <i className="ri-truck-line w-5 h-5 flex items-center justify-center text-green-600"></i>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
