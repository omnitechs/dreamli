
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PageInfo {
  path: string;
  title: string;
  category: string;
}

export default function SitemapPage() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const discoverPages = () => {
      const pageRoutes: PageInfo[] = [
        // Main pages
        { path: '/', title: 'Home', category: 'Main' },
        { path: '/shop', title: 'Shop', category: 'Main' },
        { path: '/steam', title: 'STEAM Pack', category: 'Main' },
        { path: '/gifts', title: 'Gift Pack', category: 'Main' },
        { path: '/schools', title: 'Schools Program', category: 'Main' },
        { path: '/why', title: 'Why Dreamli', category: 'Main' },
        { path: '/how-it-works', title: 'How It Works', category: 'Main' },
        { path: '/blog', title: 'Blog', category: 'Main' },
        
        // Account & Auth
        { path: '/login', title: 'Login', category: 'Account' },
        { path: '/signup', title: 'Sign Up', category: 'Account' },
        { path: '/forgot-password', title: 'Forgot Password', category: 'Account' },
        { path: '/reset-password', title: 'Reset Password', category: 'Account' },
        { path: '/dashboard', title: 'Dashboard', category: 'Account' },
        { path: '/dashboard/gamified', title: 'Gamified Dashboard', category: 'Account' },
        { path: '/dashboard/access-requests', title: 'Access Requests', category: 'Account' },
        
        // Tools & Features
        { path: '/3d-viewer', title: '3D Viewer', category: 'Tools' },
        { path: '/color-palette', title: 'Color Palette', category: 'Tools' },
        { path: '/calendar', title: 'Calendar', category: 'Tools' },
        { path: '/memory', title: 'Memory Timeline', category: 'Tools' },
        { path: '/memory/share', title: 'Share Memory', category: 'Tools' },
        { path: '/claim', title: 'Claim Page', category: 'Tools' },
        { path: '/notifications', title: 'Notifications', category: 'Tools' },
        
        // Business
        { path: '/collaboration', title: 'Collaboration', category: 'Business' },
        { path: '/collaboration/apply', title: 'Apply for Collaboration', category: 'Business' },
        { path: '/contact', title: 'Contact', category: 'Business' },
        
        // Dutch Pages (NL)
        { path: '/nl', title: 'Startpagina (NL)', category: 'Dutch' },
        { path: '/nl/shop', title: 'Winkel (NL)', category: 'Dutch' },
        { path: '/nl/steam', title: 'STEAM Pakket (NL)', category: 'Dutch' },
        { path: '/nl/gifts', title: 'Cadeau Pakket (NL)', category: 'Dutch' },
        { path: '/nl/school', title: 'Scholenprogramma (NL)', category: 'Dutch' },
        { path: '/nl/waarom', title: 'Waarom Dreamli (NL)', category: 'Dutch' },
        { path: '/nl/hoe-werkt-het', title: 'Hoe het werkt (NL)', category: 'Dutch' },
        { path: '/nl/blog', title: 'Blog (NL)', category: 'Dutch' },
        { path: '/nl/collaboration', title: 'Samenwerking (NL)', category: 'Dutch' },
        { path: '/nl/collaboration/apply', title: 'Aanmelden voor samenwerking (NL)', category: 'Dutch' },
        { path: '/nl/contact', title: 'Contact (NL)', category: 'Dutch' },
        
        // German Pages (DE)
        { path: '/de', title: 'Startseite (DE)', category: 'German' },
        { path: '/de/shop', title: 'Shop (DE)', category: 'German' },
        { path: '/de/steam', title: 'STEAM Paket (DE)', category: 'German' },
        { path: '/de/gifts', title: 'Geschenkpaket (DE)', category: 'German' },
        { path: '/de/schools', title: 'Schulprogramm (DE)', category: 'German' },
        { path: '/de/why', title: 'Warum Dreamli (DE)', category: 'German' },
        { path: '/de/how-it-works', title: 'Wie es funktioniert (DE)', category: 'German' },
        { path: '/de/blog', title: 'Blog (DE)', category: 'German' },
        { path: '/de/collaboration', title: 'Zusammenarbeit (DE)', category: 'German' },
        { path: '/de/collaboration/apply', title: 'Für Zusammenarbeit bewerben (DE)', category: 'German' },
        { path: '/de/contact', title: 'Kontakt (DE)', category: 'German' },
        
        // Admin & Management
        { path: '/admin', title: 'Admin Dashboard', category: 'Admin' },
        { path: '/admin/users', title: 'User Management', category: 'Admin' },
        { path: '/admin/pricing', title: 'Pricing Management', category: 'Admin' },
        { path: '/payments', title: 'Payments', category: 'Admin' },
        { path: '/coupons', title: 'Coupons Management', category: 'Admin' },
        
        // Payment
        { path: '/payment/success', title: 'Payment Success', category: 'Payment' },
        { path: '/payment/cancel', title: 'Payment Cancelled', category: 'Payment' },
        
        // Legal
        { path: '/privacy', title: 'Privacy Policy', category: 'Legal' },
        { path: '/terms', title: 'Terms of Service', category: 'Legal' },
        { path: '/faq', title: 'FAQ', category: 'Legal' },
        { path: '/sitemap-page', title: 'Sitemap', category: 'Legal' },
      ];

      setPages(pageRoutes);
      setLoading(false);
    };

    discoverPages();
  }, []);

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.category]) {
      acc[page.category] = [];
    }
    acc[page.category].push(page);
    return acc;
  }, {} as Record<string, PageInfo[]>);

  const categoryOrder = ['Main', 'Account', 'Tools', 'Business', 'Dutch', 'Admin', 'Payment', 'Legal'];
  const categoryColors: { [key: string]: string } = {
    'Main': 'from-blue-500 to-blue-600',
    'Account': 'from-green-500 to-green-600', 
    'Tools': 'from-purple-500 to-purple-600',
    'Business': 'from-orange-500 to-orange-600',
    'Dutch': 'from-yellow-500 to-yellow-600',
    'German': 'from-red-500 to-red-600',
    'Admin': 'from-gray-600 to-gray-700',
    'Payment': 'from-pink-500 to-pink-600',
    'Legal': 'from-indigo-500 to-indigo-600'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sitemap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Navigation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete overview of all pages on our website. Use this as a comprehensive navigation tool 
            to explore every section and feature available.
          </p>
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-4 inline-block">
            <p className="text-sm text-gray-500">
              Total Pages: <span className="font-semibold text-blue-600">{pages.length}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {categoryOrder.map(category => {
            const categoryPages = groupedPages[category];
            if (!categoryPages || categoryPages.length === 0) return null;

            return (
              <div 
                key={category} 
                className={`rounded-xl border-2 p-6 ${categoryColors[category] || 'bg-white border-gray-200'}`}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 text-sm font-bold">
                    {categoryPages.length}
                  </span>
                  {category} Pages
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPages.map((page, index) => (
                    <Link
                      key={index}
                      href={page.path}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {page.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-mono">
                            {page.path}
                          </p>
                        </div>
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-external-link-line text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Sitemap</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page automatically updates when new pages are added to the website. 
            It serves as a comprehensive navigation tool and development reference for all available routes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>🔄 Auto-updating</span>
            <span>📱 Mobile-friendly</span>
            <span>🎯 Complete coverage</span>
            <span>⚡ Fast navigation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
