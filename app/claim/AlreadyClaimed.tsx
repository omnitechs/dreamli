
'use client';

interface AlreadyClaimedProps {
  productId: string | null;
}

export default function AlreadyClaimed({ productId }: AlreadyClaimedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-shield-check-line text-3xl text-white"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Already Claimed
          </h2>
          
          <p className="text-gray-600 mb-8">
            This Dreamli has already been claimed and is being enjoyed by its family.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/memory?id=' + productId}
              className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              View Memory Page
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-white text-gray-700 px-6 py-3 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
