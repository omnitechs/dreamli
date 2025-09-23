'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UploadForm from '../../components/UploadForm';

export default function HeaderDE() {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const pathname = usePathname();
  const isDE = pathname.startsWith('/de');

  // Function to get the equivalent URL in the other language
  const getLanguageSwitchUrl = (targetLanguage: 'en' | 'nl' | 'de') => {
    if (targetLanguage === 'en') {
      // Switch from German to English
      if (pathname === '/de') return '/';
      if (pathname.startsWith('/de/')) {
        const path = pathname.replace('/de', '');
        return path;
      }
      return '/';
    } else if (targetLanguage === 'nl') {
      // Switch from German to Dutch
      if (pathname === '/de') return '/nl';
      if (pathname.startsWith('/de/')) {
        const path = pathname.replace('/de', '');
        return `/nl${path}`;
      }
      return '/nl';
    } else {
      // Switch to German
      if (pathname === '/') return '/de';
      if (pathname === '/nl') return '/de';
      if (pathname.startsWith('/nl/')) {
        const path = pathname.replace('/nl', '');
        return `/de${path}`;
      }
      if (pathname.startsWith('/de')) return pathname;
      return `/de${pathname}`;
    }
  };

  // Ensure component knows it's running on client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle sticky behavior
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  // Handle dropdown with timeout for better UX
  let dropdownTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    setShowShopDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setShowShopDropdown(false);
    }, 150);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeout = setTimeout(() => {
      setShowShopDropdown(false);
    }, 150);
  };

  // Don't render navigation until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/de" className="cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png" 
              alt="Dreamli Logo"
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Loading placeholder for navigation */}
          <div className="hidden md:flex space-x-8">
            <div className="w-20 h-6 bg-gray-100 rounded animate-pulse"></div>
            <div className="w-16 h-6 bg-gray-100 rounded animate-pulse"></div>
          </div>
          
          {/* Mobile menu button placeholder */}
          <div className="md:hidden w-8 h-8 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`bg-white shadow-sm transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : 'relative z-40'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/de" className="cursor-pointer">
            <img 
              src="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/48224f9cc1b0c55ac8c088f51f17f701.png" 
              alt="Dreamli Logo"
              className="h-10 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex space-x-8" suppressHydrationWarning={true}>
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/de/shop" className="text-gray-700 hover:text-purple-600 transition-colors cursor-pointer flex items-center">
                Shop
                <i className="ri-arrow-down-s-line ml-1"></i>
              </Link>
              {showShopDropdown && (
                <div 
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link 
                    href="/de/gifts" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                  >
                    Geschenkpaket
                  </Link>
                  <Link 
                    href="/de/steam" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                  >
                    Steam Paket
                  </Link>
                  <a 
                    href="https://shop.dreamli.nl" 
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors"
                  >
                    Webshop
                  </a>
                </div>
              )}
            </div>
            <Link href="/de/blog" className="text-gray-700 hover:text-purple-600 transition-colors">
              Blog
            </Link>
            <a href="https://panel.dreamli.nl" className="text-gray-700 hover:text-purple-600 transition-colors">
              Dashboard
            </a>
            <Link href="/de/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Kontakt
            </Link>
            <div className="flex items-center space-x-2">
              <Link 
                href={getLanguageSwitchUrl('en')} 
                className={`px-2 py-1 text-sm rounded ${!isDE && !pathname.startsWith('/nl') ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
              >
                EN
              </Link>
              <Link 
                href={getLanguageSwitchUrl('nl')} 
                className={`px-2 py-1 text-sm rounded ${pathname.startsWith('/nl') ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
              >
                NL
              </Link>
              <Link 
                href={getLanguageSwitchUrl('de')} 
                className={`px-2 py-1 text-sm rounded ${isDE ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
              >
                DE
              </Link>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            suppressHydrationWarning={true}
          >
            <i className={`${isMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-600`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4" suppressHydrationWarning={true}>
            <nav className="space-y-2">
              <div>
                <Link 
                  href="/de/shop" 
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <div className="ml-4 space-y-1">
                  <Link 
                    href="/de/gifts" 
                    className="block py-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Geschenkpaket
                  </Link>
                  <Link 
                    href="/de/steam" 
                    className="block py-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Steam Paket
                  </Link>
                  <a 
                    href="https://shop.dreamli.nl" 
                    className="block py-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Webshop
                  </a>
                </div>
              </div>
              <Link 
                href="/de/blog" 
                className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <a 
                href="https://panel.dreamli.nl" 
                className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </a>
              <Link 
                href="/de/contact" 
                className="block py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Kontakt
              </Link>
              <div className="flex items-center space-x-2 py-2">
                <Link 
                  href={getLanguageSwitchUrl('en')} 
                  className={`px-3 py-1 text-sm rounded ${!isDE && !pathname.startsWith('/nl') ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  EN
                </Link>
                <Link 
                  href={getLanguageSwitchUrl('nl')} 
                  className={`px-3 py-1 text-sm rounded ${pathname.startsWith('/nl') ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  NL
                </Link>
                <Link 
                  href={getLanguageSwitchUrl('de')} 
                  className={`px-3 py-1 text-sm rounded ${isDE ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  DE
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer div when header is sticky to prevent content jumping */}
      {isSticky && <div className="h-[76px]"></div>}

      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}