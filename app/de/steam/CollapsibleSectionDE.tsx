'use client';

import { useState, useEffect } from 'react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
}

export default function CollapsibleSectionDE({ 
  title, 
  subtitle, 
  icon, 
  children, 
  defaultOpen = false,
  color = "from-blue-500 to-purple-600"
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Desktop version (unchanged)
  const DesktopVersion = () => (
    <div className="w-full">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gradient-to-r ${color} text-black py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group ${ 
          isOpen ? 'rounded-b-none' : 'hover:scale-[1.02]'
        }`}
        style={color === 'from-[#FFB067] to-[#F3E8FF]' ? { background: 'linear-gradient(to right, #FFB067, #F3E8FF) !important', color: '#000000 !important' } : color.includes('#93C4FF') ? { background: 'linear-gradient(to right, #93C4FF, #ACEEF3) !important', color: '#000000 !important' } : { color: '#000000 !important' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className={`${icon} text-2xl text-black`} style={{ color: '#000000 !important' }}></i>
            </div>
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-black" style={{ color: '#000000 !important' }}>{title}</h2>
              {subtitle && (
                <p className="text-black/80 text-sm md:text-base mt-1" style={{ color: 'rgba(0, 0, 0, 0.8) !important' }}>{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden sm:block text-black" style={{ color: '#000000 !important' }}>
              {isOpen ? 'Details verbergen' : 'Details anzeigen'}
            </span>
            <div className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${ 
              isOpen ? 'rotate-180' : ''
            }`}>
              <i className="ri-arrow-down-s-line text-2xl text-black" style={{ color: '#000000 !important' }}></i>
            </div>
          </div>
        </div>
      </button>

      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${ 
        isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-2 border-t-0 border-gray-200 rounded-b-2xl shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );

  // Mobile version (fullscreen overlay)
  const MobileVersion = () => (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-full bg-gradient-to-r ${color} text-black py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02]`}
        style={color === 'from-[#FFB067] to-[#F3E8FF]' ? { background: 'linear-gradient(to right, #FFB067, #F3E8FF) !important', color: '#000000 !important' } : color.includes('#93C4FF') ? { background: 'linear-gradient(to right, #93C4FF, #ACEEF3) !important', color: '#000000 !important' } : { color: '#000000 !important' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <i className={`${icon} text-lg text-black`} style={{ color: '#000000 !important' }}></i>
            </div>
            <div className="text-left">
              <h2 className="text-xl font-bold text-black" style={{ color: '#000000 !important' }}>{title}</h2>
              {subtitle && (
                <p className="text-black/80 text-sm mt-1" style={{ color: 'rgba(0, 0, 0, 0.8) !important' }}>{subtitle}</p>
              )}
            </div>
          </div>
          <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
            <i className="ri-arrow-right-s-line text-lg text-black" style={{ color: '#000000 !important' }}></i>
          </div>
        </div>
      </button>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header Bar */}
          <div className={`bg-gradient-to-r ${color} text-black p-4 flex items-center justify-between flex-shrink-0`}
               style={color === 'from-[#FFB067] to-[#F3E8FF]' ? { background: 'linear-gradient(to right, #FFB067, #F3E8FF) !important', color: '#000000 !important' } : color.includes('#93C4FF') ? { background: 'linear-gradient(to right, #93C4FF, #ACEEF3) !important', color: '#000000 !important' } : { color: '#000000 !important' }}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className={`${icon} text-lg text-black`} style={{ color: '#000000 !important' }}></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-black" style={{ color: '#000000 !important' }}>{title}</h2>
                {subtitle && (
                  <p className="text-black/80 text-xs" style={{ color: 'rgba(0, 0, 0, 0.8) !important' }}>{subtitle}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
            >
              <i className="ri-close-line text-lg text-black" style={{ color: '#000000 !important' }}></i>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {children}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop: Hidden on mobile (md and up) */}
      <div className="hidden md:block">
        <DesktopVersion />
      </div>

      {/* Mobile: Hidden on desktop (below md) */}
      <div className="block md:hidden">
        <MobileVersion />
      </div>
    </>
  );
}