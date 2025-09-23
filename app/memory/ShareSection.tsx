
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AccessItem {
  id: number;
  type: 'email' | 'phone' | 'custom';
  value: string;
  name: string;
}

interface ShareSectionProps {
  productId: string;
  isOwner?: boolean;
  accessList?: AccessItem[];
  onAccessListChange?: (list: AccessItem[]) => void;
}

export default function ShareSection({ 
  productId, 
  isOwner = false, 
  accessList = [], 
  onAccessListChange 
}: ShareSectionProps) {
  const [isPublic, setIsPublic] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
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
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <div className="mb-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Dit Verhaal Delen
        </h2>
        
        <p className="text-gray-600 text-center mb-8">
          Laat familie en vrienden deze magische reis zien
        </p>

        {isOwner && (
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className="text-sm text-gray-700">Privé</span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                isPublic ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                isPublic ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
            <span className="text-sm text-gray-700">Openbaar</span>
          </div>
        )}

        {/* Access Management for Private Stories */}
        {isOwner && !isPublic && (
          <div className="mb-8 p-4 bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Toegangscontrole</h3>
              <button
                onClick={() => setShowAccessModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Toegang Beheren
              </button>
            </div>
            
            <div className="space-y-2">
              {accessList.slice(0, 3).map((access) => (
                <div key={access.id} className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className={`${
                    access.type === 'email' ? 'ri-mail-line' :
                    access.type === 'phone' ? 'ri-phone-line' :
                    'ri-key-line'
                  } text-xs`}></i>
                  <span>{access.name}</span>
                </div>
              ))}
              
              {accessList.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{accessList.length - 3} meer
                </div>
              )}
              
              {accessList.length === 0 && (
                <div className="text-sm text-gray-500">
                  Nog geen toegang verleend
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCopyLink}
            className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-4 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <i className="ri-link text-lg"></i>
              <span>{copySuccess ? 'Link Gekopieerd!' : 'Link Kopiëren'}</span>
            </div>
          </button>

          <button
            onClick={() => setShowQRCode(true)}
            className="bg-white text-gray-800 px-6 py-4 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <i className="ri-qr-code-line text-lg"></i>
              <span>QR Code</span>
            </div>
          </button>

          <Link
            href={`/memory/share?id=${productId}`}
            target="_blank"
            className="bg-blue-500 text-white px-6 py-4 rounded-2xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <i className="ri-external-link-line text-lg"></i>
              <span>Voorbeeld</span>
            </div>
          </Link>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-[#FFF5F5] to-[#F0F8FF] rounded-2xl border border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <i className="ri-information-line text-lg text-gray-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                {isPublic 
                  ? 'Deze herinneringenpagina is openbaar en kan door iedereen met de link bekeken worden.'
                  : `Deze herinneringenpagina is privé en alleen ${accessList.length} geautoriseerde ${accessList.length === 1 ? 'persoon' : 'personen'} kunnen het bekijken.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Management Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Toegangscontrole</h3>
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-4">
                  Mensen met deze toegangscodes kunnen je privéverhaal bekijken:
                </p>
                
                {/* Access List */}
                <div className="space-y-2">
                  {accessList.map((access) => (
                    <div key={access.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                          <i className={`${
                            access.type === 'email' ? 'ri-mail-line' :
                            access.type === 'phone' ? 'ri-phone-line' :
                            'ri-key-line'
                          } text-sm text-white`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{access.name}</p>
                          <p className="text-xs text-gray-500">{access.value}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (onAccessListChange) {
                            onAccessListChange(accessList.filter(a => a.id !== access.id));
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <i className="ri-delete-bin-line text-sm text-red-600"></i>
                      </button>
                    </div>
                  ))}
                  
                  {accessList.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      Nog geen toegang verleend
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => setShowAccessModal(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Klaar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-6">QR Code Delen</h3>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <img 
                  src={generateQRCode()}
                  alt="QR Code voor herinneringenpagina"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              
              <p className="text-gray-600 mb-6">
                Scan deze QR code om de herinneringenpagina te bekijken
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Sluiten
                </button>
                <button
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx?.drawImage(img, 0, 0);
                      const link = document.createElement('a');
                      link.download = `dreamli-qr-${productId}.png`;
                      link.href = canvas.toDataURL();
                      link.click();
                    };
                    img.src = generateQRCode();
                  }}
                  className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Downloaden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
