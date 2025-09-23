
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MemoryHeader from './MemoryHeader';
import CreationTimeline from './CreationTimeline';
import UserMemories from './UserMemories';
import TimeCapsule from './TimeCapsule';
import ShareSection from './ShareSection';

// Claim Modal Component
function ClaimModal({ isOpen, onClose, onClaim }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onClaim: (data: any) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: '',
    ownerName: '',
    dedicationMessage: ''
  });

  if (!isOpen) return null;

  const handleConfirmClaim = () => {
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClaim(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {step === 1 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Owner Access Token Detected</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-key-line text-2xl text-white"></i>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  You have entered with an owner access token. Do you want to claim this as one of your memories?
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-alert-line text-lg text-yellow-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800">
                      If this is not your memory, please click "No" to continue as a visitor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleConfirmClaim}
                  className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-4 rounded-full text-lg font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-check-line text-lg"></i>
                    <span>Yes, This is My Memory</span>
                  </div>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-white text-gray-700 px-6 py-4 rounded-full font-semibold border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-close-line text-lg"></i>
                    <span>No, Continue as Visitor</span>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-xl text-gray-600"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900">Claim Your Memory</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="childName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Child's Name (optional)
                  </label>
                  <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    placeholder="e.g., Emma"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50"
                  />
                </div>

                <div>
                  <label htmlFor="dedicationMessage" className="block text-sm font-semibold text-gray-700 mb-2">
                    Dedication Message (optional)
                  </label>
                  <textarea
                    id="dedicationMessage"
                    name="dedicationMessage"
                    value={formData.dedicationMessage}
                    onChange={handleChange}
                    placeholder="e.g., For Mila, from Dad"
                    maxLength={500}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.dedicationMessage.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-4 rounded-full text-lg font-semibold hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                >
                  Claim Memory
                </button>
              </form>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-information-line text-lg text-gray-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Once claimed, you'll be able to add photos, videos, and manage this memory.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Static background elements to prevent hydration issues
const backgroundElements = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 23) % 100}%`,
  top: `${(i * 13 + 37) % 100}%`,
  delay: `${(i * 0.5) % 5}s`,
  duration: `${4 + (i % 3)}s`
}));

function MemoryPageContent() {
  const searchParams = useSearchParams();
  const memoryId = searchParams.get('id') || 'default-memory';
  const isAdmin = searchParams.get('admin') === 'true';
  const ownerToken = searchParams.get('token');
  
  const [showTimeCapsule, setShowTimeCapsule] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [memoryData, setMemoryData] = useState({
    productName: "Magical Unicorn",
    childName: "Adam",
    dedicationMessage: "For my special Adam, with all my love"
  });

  // Check if user has owner token on page load
  useEffect(() => {
    if (ownerToken && !isClaimed && !isAdmin) {
      setShowClaimModal(true);
    }
  }, [ownerToken, isClaimed, isAdmin]);

  const handleClaimMemory = (claimData: any) => {
    setMemoryData({
      productName: claimData.childName ? `${claimData.childName}'s Creation` : memoryData.productName,
      childName: claimData.childName || memoryData.childName,
      dedicationMessage: claimData.dedicationMessage || memoryData.dedicationMessage
    });
    setIsClaimed(true);
    setShowClaimModal(false);
  };

  const isOwner = isClaimed || isAdmin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {backgroundElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-pulse"
            style={{
              left: element.left,
              top: element.top,
              animationDelay: element.delay,
              animationDuration: element.duration
            }}
          >
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Admin Mode Indicator */}
        {isAdmin && (
          <div className="bg-blue-500 text-white p-3">
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-medium">Admin Mode Active</span>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/admin"
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-dashboard-line"></i>
                    <span>Admin Dashboard</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <MemoryHeader 
            productName={memoryData.productName}
            childName={memoryData.childName}
            dedicationMessage={memoryData.dedicationMessage}
            isOwner={isOwner}
          />
          
          <CreationTimeline isAdmin={isAdmin} />
          <UserMemories isOwner={isOwner} />
          
          {/* Time Capsule Section */}
          <div className="mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-time-line text-3xl text-white"></i>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Time Capsule</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create a magical time capsule experience with your Dreamli
              </p>
              
              <button
                onClick={() => setShowTimeCapsule(true)}
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-4 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-magic-line text-lg"></i>
                  <span>Open Time Capsule</span>
                </div>
              </button>
            </div>
          </div>
          
          <ShareSection 
            productId={memoryId}
            isOwner={isOwner}
          />
        </div>

        {/* Time Capsule Modal */}
        {showTimeCapsule && (
          <TimeCapsule
            isOwner={isOwner}
            onClose={() => setShowTimeCapsule(false)}
          />
        )}

        {/* Claim Modal */}
        <ClaimModal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onClaim={handleClaimMemory}
        />
      </div>
    </div>
  );
}

export default function MemoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#B9E4C9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading memory...</p>
        </div>
      </div>
    }>
      <MemoryPageContent />
    </Suspense>
  );
}
