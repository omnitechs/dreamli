'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function FooterBanner() {
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const tc = useTranslations('christmas');
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Marketplace CTA */}
        <div className="bg-gradient-to-r from-[#FFB067] to-[#ACEEF3] rounded-3xl p-12 text-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-white">{tc('footerBanner.inspireTitle')}</h3>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">{tc('footerBanner.inspireText')}</p>
            <Link href={`/${lang}/marketplace`}>
              <button className="bg-white hover:bg-gray-50 text-[#8472DF] text-lg px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:scale-105 whitespace-nowrap group">
                {tc('footerBanner.browse')}
                <i className="ri-gallery-line ml-3 group-hover:translate-x-1 transition-transform inline-block"></i>
              </button>
            </Link>
          </div>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-br from-[#8472DF] via-[#93C4FF] to-[#ACEEF3] rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              {tc('footerBanner.mainTitleA')}
              <br />
              {tc('footerBanner.mainTitleB')}
            </h2>

            <Link href={`/${lang}/christmas#create`}>
              <button className="bg-white hover:bg-gray-50 text-[#8472DF] text-xl px-12 py-6 rounded-full font-bold transition-all duration-300 shadow-2xl hover:scale-105 whitespace-nowrap group">
                {tc('footerBanner.cta')}
                <i className="ri-rocket-line ml-3 group-hover:translate-x-1 transition-transform inline-block"></i>
              </button>
            </Link>

            <div className="grid md:grid-cols-4 gap-8 pt-12 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-map-pin-line text-3xl text-white"></i>
                </div>
                <div className="text-white font-semibold">{tc('footerBanner.badges.made')}</div>
                <div className="text-white/80 text-sm">🇳🇱</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-leaf-line text-3xl text-white"></i>
                </div>
                <div className="text-white font-semibold">{tc('footerBanner.badges.pla')}</div>
                <div className="text-white/80 text-sm">🌱</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-shield-check-line text-3xl text-white"></i>
                </div>
                <div className="text-white font-semibold">{tc('footerBanner.badges.secure')}</div>
                <div className="text-white/80 text-sm">🔒</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-rocket-line text-3xl text-white"></i>
                </div>
                <div className="text-white font-semibold">{tc('footerBanner.badges.fast')}</div>
                <div className="text-white/80 text-sm">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
