'use client';

import { useState } from 'react';

interface PublicShareSectionProps {
  productId: string;
  childName?: string;
}

export default function PublicShareSection({ productId, childName }: PublicShareSectionProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/memory/share?id=${productId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <div className="mb-16">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/70">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Share This Magical Story
          </h2>
          <p className="text-gray-600 text-lg">
            Let more family and friends experience {childName ? `${childName}'s` : 'this'} journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleCopyLink}
            className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-8 py-6 rounded-3xl font-bold text-lg hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-3">
              <i className="ri-link text-2xl"></i>
              <span>{copySuccess ? 'Link Copied!' : 'Copy Share Link'}</span>
            </div>
          </button>

          <button
            onClick={() => setShowQRCode(true)}
            className="bg-white text-gray-800 px-8 py-6 rounded-3xl font-bold text-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="flex items-center justify-center space-x-3">
              <i className="ri-qr-code-line text-2xl"></i>
              <span>Get QR Code</span>
            </div>
          </button>
        </div>

        <div className="bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-6 h-6 flex items-center justify-center mt-1">
              <i className="ri-information-line text-2xl text-[#B9E4C9]"></i>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">About this page</h4>
              <p className="text-gray-700 leading-relaxed">
                This memory page is public and can be viewed by anyone with the link. 
                It's a beautiful way to share the magic of bringing a child's drawing to life 
                with friends, family, and loved ones around the world.
              </p>
            </div>
          </div>
        </div>

        {/* Social sharing buttons */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-6">Or share directly:</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                const text = `Check out ${childName ? `${childName}'s` : 'this'} magical Dreamli story!`;
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(url, '_blank');
              }}
              className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <i className="ri-twitter-line text-xl"></i>
            </button>
            <button
              onClick={() => {
                const text = `Check out ${childName ? `${childName}'s` : 'this'} magical Dreamli story!`;
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
              }}
              className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <i className="ri-facebook-line text-xl"></i>
            </button>
            <button
              onClick={() => {
                const text = `Check out ${childName ? `${childName}'s` : 'this'} magical Dreamli story! ${shareUrl}`;
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
              }}
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <i className="ri-whatsapp-line text-xl"></i>
            </button>
            <button
              onClick={() => {
                const text = `Check out ${childName ? `${childName}'s` : 'this'} magical Dreamli story!`;
                const url = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text} ${shareUrl}`)}`;
                window.open(url, '_blank');
              }}
              className="w-12 h-12 bg-gray-500 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110"
            >
              <i className="ri-mail-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-10 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Share QR Code</h3>
              
              <div className="bg-gradient-to-br from-[#FFF5F5] to-[#F0F8FF] rounded-3xl p-8 mb-8 shadow-inner">
                <img 
                  src={generateQRCode()}
                  alt="QR Code for memory page"
                  className="w-60 h-60 mx-auto rounded-2xl shadow-lg"
                />
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">
                Scan this QR code to view the magical story
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx?.drawImage(img, 0, 0);
                      const link = document.createElement('a');
                      link.download = `dreamli-share-qr-${productId}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    };
                    img.src = generateQRCode();
                  }}
                  className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-4 rounded-2xl font-bold text-lg hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}