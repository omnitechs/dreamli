'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PublicMemoryHeader from './PublicMemoryHeader';
import PublicCreationTimeline from './PublicCreationTimeline';
import PublicUserMemories from './PublicUserMemories';
import PublicShareSection from './PublicShareSection';

function PublicMemoryContent() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState({
    productName: 'Magical Unicorn',
    childName: 'Adam',
    dedicationMessage: 'Voor Adam, van Papa',
    isPublic: true
  });

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProductId(id);
      // In real implementation, fetch product data from API and check if public
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 animate-spin">
            <i className="ri-loader-4-line text-4xl text-[#B9E4C9]"></i>
          </div>
          <p className="text-gray-600 text-lg">Loading magical memories...</p>
        </div>
      </div>
    );
  }

  if (!productData.isPublic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-lock-line text-3xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Private Memory</h2>
          <p className="text-gray-600 mb-8">
            This Dreamli memory page is private and can only be viewed by the owner.
          </p>
          <a
            href="/"
            className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap inline-block"
          >
            Visit Dreamli
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          >
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
          </div>
        ))}

        {/* Floating sparkles */}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-pink-300 to-blue-300 rounded-full opacity-20"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <PublicMemoryHeader 
            productName={productData.productName}
            childName={productData.childName}
            dedicationMessage={productData.dedicationMessage}
          />

          <PublicCreationTimeline />

          <PublicUserMemories />

          <PublicShareSection 
            productId={productId || 'demo'}
            childName={productData.childName}
          />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8">
            <div className="flex flex-col items-center space-y-1 text-[#B9E4C9]">
              <i className="ri-timeline-view text-2xl"></i>
              <span className="text-xs font-medium">Timeline</span>
            </div>
            <div className="flex flex-col items-center space-y-1 text-gray-300">
              <i className="ri-time-line text-2xl"></i>
              <span className="text-xs font-medium">Time Capsule</span>
            </div>
            <div className="flex flex-col items-center space-y-1 text-gray-300">
              <i className="ri-information-line text-2xl"></i>
              <span className="text-xs font-medium">About</span>
            </div>
            <div className="flex flex-col items-center space-y-1 text-gray-300">
              <i className="ri-share-line text-2xl"></i>
              <span className="text-xs font-medium">Share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}

export default function PublicMemoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 animate-spin">
            <i className="ri-loader-4-line text-4xl text-[#B9E4C9]"></i>
          </div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PublicMemoryContent />
    </Suspense>
  );
}
