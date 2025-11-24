'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PricingTabs() {
  const tc = useTranslations('christmas');
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const [activeTab, setActiveTab] = useState<'design' | 'print'>('print');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [glowInDark, setGlowInDark] = useState(false);
  const [colorModel, setColorModel] = useState(false);

  const sizes = [
    {
      id: 'small',
      name: 'Small',
      size: '5cm',
      price: 10,
      tag: 'Tree Ornament',
      desc: 'Perfect for keychains and baubles.',
      icon: 'ri-gift-line'
    },
    {
      id: 'medium',
      name: 'Medium',
      size: '10cm',
      price: 13,
      tag: 'Desk Toy',
      desc: 'The standard size. Most popular.',
      icon: 'ri-trophy-line',
      popular: true
    },
    {
      id: 'large',
      name: 'Large',
      size: '15cm',
      price: 20,
      tag: 'Statue',
      desc: 'High detail, great for gifts.',
      icon: 'ri-award-line'
    },
    {
      id: 'max',
      name: 'Max',
      size: '25cm',
      price: 50,
      tag: 'Masterpiece',
      desc: 'A massive centerpiece.',
      icon: 'ri-vip-crown-line'
    }
  ];

  const selectedPrice = sizes.find(s => s.id === selectedSize)?.price || 0;
  // Pricing: Glow-in-the-dark doubles the base price; Color the model adds a flat €20
  const baseWithGlow = glowInDark ? selectedPrice * 2 : selectedPrice;
  const totalPrice = baseWithGlow + (colorModel ? 20 : 0);

  return (
    <section id="pricing" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-[#2E2E2E] mb-4">{tc('pricing.title')}</h2>
          <p className="text-xl text-[#2E2E2E]/70">{tc('pricing.subtitle')}</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-full p-2 inline-flex gap-2 border border-gray-200">
            <button
              onClick={() => setActiveTab('design')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'design'
                  ? 'bg-[#8472DF] text-white shadow-lg'
                  : 'text-[#2E2E2E]/70 hover:text-[#2E2E2E]'
              }`}
            >
              {tc('pricing.tabs.design')}
            </button>
            <button
              onClick={() => setActiveTab('print')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === 'print'
                  ? 'bg-[#8472DF] text-white shadow-lg'
                  : 'text-[#2E2E2E]/70 hover:text-[#2E2E2E]'
              }`}
            >
              {tc('pricing.tabs.print')}
            </button>
          </div>
        </div>

        {activeTab === 'design' && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#F8F9FF] to-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#2E2E2E] mb-2">{tc('pricing.design.free.price')}</div>
                <div className="text-[#8472DF] font-semibold text-lg">{tc('pricing.design.free.label')}</div>
              </div>
              <ul className="space-y-4 mb-8">
                {tc.raw('pricing.design.free.bullets').map((b: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-[#2E2E2E]/80">
                    <i className="ri-checkbox-circle-fill text-[#8472DF] text-xl mt-1"></i>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/ai`}>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-[#2E2E2E] py-4 rounded-full font-semibold transition-all whitespace-nowrap">{tc('pricing.design.free.btn')}</button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#8472DF]/10 to-[#93C4FF]/10 rounded-3xl p-8 border-2 border-[#8472DF] relative shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8472DF] text-white px-6 py-1 rounded-full text-sm font-semibold whitespace-nowrap">{tc('pricing.design.pro.mostPopular')}</div>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-[#2E2E2E] mb-2">{tc('pricing.design.pro.price')}</div>
                <div className="text-[#8472DF] font-semibold text-lg">{tc('pricing.design.pro.label')}</div>
              </div>
              <ul className="space-y-4 mb-8">
                {tc.raw('pricing.design.pro.bullets').map((b: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-[#2E2E2E]/80">
                    <i className="ri-checkbox-circle-fill text-[#8472DF] text-xl mt-1"></i>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/credits`}>
                <button className="w-full bg-[#8472DF] hover:bg-[#8472DF]/90 text-white py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap">{tc('pricing.design.pro.btn')}</button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'print' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <p className="text-[#2E2E2E]/70 mb-2">{tc('pricing.print.material')}</p>
              <div className="inline-flex items-center gap-2 bg-[#F8F9FF] rounded-full px-6 py-3 border border-[#8472DF]/20">
                <i className="ri-hand-heart-line text-[#8472DF] text-xl"></i>
                <span className="text-[#2E2E2E] font-semibold">{tc('pricing.print.select')}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`relative bg-gradient-to-br from-[#F8F9FF] to-white rounded-3xl p-6 border-2 transition-all duration-300 text-left hover:shadow-xl ${
                    selectedSize === size.id
                      ? 'border-[#8472DF] shadow-lg shadow-[#8472DF]/30 scale-105'
                      : 'border-gray-200 hover:border-[#8472DF]/50'
                  }`}
                >
                  {size.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8472DF] text-white px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap">{tc('pricing.print.mostPopular')}</div>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    selectedSize === size.id ? 'bg-[#8472DF]/20' : 'bg-gray-100'
                  }`}>
                    <i className={`${size.icon} text-2xl ${
                      selectedSize === size.id ? 'text-[#8472DF]' : 'text-[#2E2E2E]/50'
                    }`}></i>
                  </div>

                  <div className="mb-2">
                    <div className="text-[#2E2E2E] font-bold text-2xl">{size.name}</div>
                    <div className="text-[#2E2E2E]/60 text-sm">{size.size}</div>
                  </div>

                  <div className="bg-[#8472DF]/10 text-[#8472DF] text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 whitespace-nowrap">
                    {size.tag}
                  </div>

                  <p className="text-[#2E2E2E]/70 text-sm mb-4">{size.desc}</p>

                  <div className="text-[#2E2E2E] font-bold text-3xl">€{size.price}</div>
                </button>
              ))}
            </div>

            <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#F8F9FF] to-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#ACEEF3]/20 rounded-xl flex items-center justify-center">
                    <i className="ri-flashlight-line text-2xl text-[#ACEEF3]"></i>
                  </div>
                  <div>
                    <div className="text-[#2E2E2E] font-semibold text-lg">{tc('pricing.print.glow.title')}</div>
                    <div className="text-[#2E2E2E]/60 text-sm">{tc('pricing.print.glow.desc')}</div>
                  </div>
                </div>
                <button
                  onClick={() => setGlowInDark(!glowInDark)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    glowInDark ? 'bg-[#8472DF]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                    glowInDark ? 'left-9' : 'left-1'
                  }`}></div>
                </button>
              </div>

              {glowInDark && (
                <div className="bg-[#ACEEF3]/10 border border-[#ACEEF3]/30 rounded-xl p-4 mb-6">
                  <div className="text-[#ACEEF3] font-semibold mb-1">{tc('pricing.print.glow.x2')}</div>
                  <div className="text-[#2E2E2E]/70 text-sm">{tc('pricing.print.glow.x2desc')}</div>
                </div>
              )}

              {/* Color the Model toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFB067]/20 rounded-xl flex items-center justify-center">
                    <i className="ri-palette-line text-2xl text-[#FFB067]"></i>
                  </div>
                  <div>
                    <div className="text-[#2E2E2E] font-semibold text-lg">{tc('pricing.print.color.title', { fallback: 'Color the model' })}</div>
                    <div className="text-[#2E2E2E]/60 text-sm">{tc('pricing.print.color.desc', { fallback: 'Hand-painted color finish for your print.' })}</div>
                  </div>
                </div>
                <button
                  onClick={() => setColorModel(!colorModel)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    colorModel ? 'bg-[#8472DF]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                    colorModel ? 'left-9' : 'left-1'
                  }`}></div>
                </button>
              </div>

              {colorModel && (
                <div className="bg-[#FFB067]/10 border border-[#FFB067]/30 rounded-xl p-4 mb-6">
                  <div className="text-[#FF8A00] font-semibold mb-1">{tc('pricing.print.color.plus20', { fallback: '+€20' })}</div>
                  <div className="text-[#2E2E2E]/70 text-sm">{tc('pricing.print.color.plus20desc', { fallback: 'Adds a flat €20 for color painting' })}</div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2E2E2E]/70">{tc('pricing.print.summary.selectedSize')}</span>
                  <span className="text-[#2E2E2E] font-semibold">
                    {sizes.find(s => s.id === selectedSize)?.name} ({sizes.find(s => s.id === selectedSize)?.size})
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2E2E2E]/70">{tc('pricing.print.summary.basePrice')}</span>
                  <span className="text-[#2E2E2E] font-semibold">€{selectedPrice}</span>
                </div>
                {glowInDark && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#2E2E2E]/70">{tc('pricing.print.summary.glow')}</span>
                    <span className="text-[#2E2E2E] font-semibold">x2</span>
                  </div>
                )}
                {colorModel && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#2E2E2E]/70">{tc('pricing.print.summary.color', { fallback: 'Color the model:' })}</span>
                    <span className="text-[#2E2E2E] font-semibold">{tc('pricing.print.color.plus20', { fallback: '+€20' })}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-2xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-[#2E2E2E]">{tc('pricing.print.summary.total')}</span>
                  <span className="text-[#8472DF]">€{totalPrice}</span>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
    </section>
  );
}
