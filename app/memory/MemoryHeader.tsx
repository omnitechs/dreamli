
'use client';

import { useState, useEffect } from 'react';

interface MemoryHeaderProps {
  productName?: string;
  childName?: string;
  dedicationMessage?: string;
  isOwner?: boolean;
  onDedicationUpdate?: (message: string) => void;
}

export default function MemoryHeader({ 
  productName = "Magical Unicorn", 
  childName = "Adam", 
  dedicationMessage = "For my special Adam, with all my love", 
  isOwner = false,
  onDedicationUpdate 
}: MemoryHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    productName: productName,
    childName: childName || '',
    dedicationMessage: dedicationMessage
  });
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);

  // Generate stars only on client side to prevent hydration mismatch
  useEffect(() => {
    const generatedStars = Array.from({ length: 8 }, (_, i) => ({
      left: `${(i * 17 + 23) % 100}%`,
      top: `${(i * 13 + 37) % 100}%`,
      delay: `${(i * 0.5) % 3}s`,
      duration: '4s'
    }));
    setStars(generatedStars);
  }, []);

  const handleSave = () => {
    if (onDedicationUpdate) {
      onDedicationUpdate(editData.dedicationMessage);
    }
    setShowEditModal(false);
  };

  const displayName = childName || productName;

  return (
    <div className="relative">
      <div className="text-center mb-8 relative">
        <div className="absolute inset-0 pointer-events-none" suppressHydrationWarning={true}>
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            >
              <div className="w-1 h-1 bg-yellow-300 rounded-full opacity-40"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          {/* Dedication Message */}
          {dedicationMessage && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-[#FFB6C1]/20 to-[#B9E4C9]/20 rounded-2xl p-4 backdrop-blur-sm border border-white/50">
                <p className="text-lg font-medium text-gray-700 italic">
                  "{dedicationMessage}"
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
              <i className="ri-user-smile-line text-2xl text-white"></i>
            </div>
            
            {isOwner && (
              <button
                onClick={() => setShowEditModal(true)}
                className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-lg"
              >
                <i className="ri-edit-line text-sm text-gray-600"></i>
              </button>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {displayName}'s Dreamli
          </h1>
          
          <p className="text-lg text-gray-600 font-medium">
            The story of this magical creation
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Names & Message</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dedication Message
                  </label>
                  <textarea
                    value={editData.dedicationMessage}
                    onChange={(e) => setEditData({...editData, dedicationMessage: e.target.value})}
                    placeholder="For my dear Emma, For the best child ever..."
                    maxLength={150}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editData.dedicationMessage.length}/150 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editData.productName}
                    onChange={(e) => setEditData({...editData, productName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Name (optional)
                  </label>
                  <input
                    type="text"
                    value={editData.childName}
                    onChange={(e) => setEditData({...editData, childName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
