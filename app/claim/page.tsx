
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import WelcomeSection from './WelcomeSection';
import ClaimForm from './ClaimForm';
import AlreadyClaimed from './AlreadyClaimed';

function ClaimContent() {
  const searchParams = useSearchParams();
  const [productId, setProductId] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setProductId(id);
      // Simulate checking if product is already claimed
      // In real implementation, this would be an API call
      setTimeout(() => {
        setIsClaimed(false); // For demo, assume not claimed
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
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <i className="ri-loader-4-line text-4xl text-[#B9E4C9]"></i>
          </div>
          <p className="text-gray-600">Loading your Dreamli...</p>
        </div>
      </div>
    );
  }

  if (isClaimed) {
    return <AlreadyClaimed productId={productId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection 
          onConfirm={() => setShowForm(true)}
          showForm={showForm}
        />
        
        {showForm && (
          <ClaimForm 
            productId={productId}
            onSuccess={() => setIsClaimed(true)}
          />
        )}
      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin">
            <i className="ri-loader-4-line text-4xl text-[#B9E4C9]"></i>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ClaimContent />
    </Suspense>
  );
}
