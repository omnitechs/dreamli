'use client';

interface PublicMemoryHeaderProps {
  productName: string;
  childName?: string;
  dedicationMessage?: string;
}

export default function PublicMemoryHeader({ 
  productName, 
  childName, 
  dedicationMessage 
}: PublicMemoryHeaderProps) {
  const displayName = childName || productName;

  return (
    <div className="text-center mb-12 relative">
      {/* Floating sparkles around header */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: '5s'
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Profile Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
          <i className="ri-user-smile-line text-3xl text-white"></i>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
          {displayName}'s Dreamli
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 font-medium mb-4 animate-fade-in">
          The story of this magical creation
        </p>

        {/* Dedication Message */}
        {dedicationMessage && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg animate-fade-in">
            <p className="text-gray-700 italic">"{dedicationMessage}"</p>
          </div>
        )}

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-4">
          <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}