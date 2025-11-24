'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import { useParams } from 'next/navigation';

export default function HeroSplit() {
  const t = useTranslations('aiLanding');
  const params = useParams<{ lang: string }>();
  const lang = (params?.lang || 'en') as string;
  const [isMounted, setIsMounted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'typing' | 'wireframe' | 'render' | 'photo'>('typing');
  const [typedText, setTypedText] = useState('');
  // Multilingual prompt text for hero typing animation
  const fullText = t('heroPrompt');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timers: NodeJS.Timeout[] = [];

    if (animationPhase === 'typing') {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          timers.push(setTimeout(() => setAnimationPhase('wireframe'), 500));
        }
      }, 50);
      timers.push(typeInterval as unknown as NodeJS.Timeout);
    } else if (animationPhase === 'wireframe') {
      timers.push(setTimeout(() => setAnimationPhase('render'), 2000));
    } else if (animationPhase === 'render') {
      timers.push(setTimeout(() => setAnimationPhase('photo'), 2000));
    } else if (animationPhase === 'photo') {
      timers.push(setTimeout(() => {
        setTypedText('');
        setAnimationPhase('typing');
      }, 3000));
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [animationPhase, isMounted]);

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-gradient-to-br from-[#F3E8FF] to-[#DBEAFE]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#8472DF]/10 border border-[#8472DF]/30 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-[#8472DF] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#8472DF]">New</span>
                <span className="text-sm text-[#2E2E2E]">Try with Free AI Credits</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight mb-6">
                Turn Your Imagination into a <span className="text-[#8472DF]">Real 3D Object.</span>
              </h1>
              
              <p className="text-xl text-[#2E2E2E]/80 leading-relaxed">
                Characters. Ornaments. Prototypes. Describe it with text or upload a photo. Our AI designs it, and we 3D print it in Groningen.
              </p>
            </div>

            <div className="space-y-4">
              <Link href={`/${lang}/christmas`}>
                <button className="bg-[#8472DF] hover:bg-[#8472DF]/90 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap" suppressHydrationWarning>
                  Start Creating for Free
                  <i className="ri-arrow-right-line"></i>
                </button>
              </Link>
              
              <div className="flex items-center gap-6 text-sm text-[#2E2E2E]/70">
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-[#8472DF]"></i>
                  <span>No 3D skills needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-check-line text-[#8472DF]"></i>
                  <span>Prints from €10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[500px] flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              {animationPhase === 'typing' && (
                <div key="typing-phase" className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="bg-[#F8F9FF] rounded-lg p-4 font-mono text-[#2E2E2E]">
                    {typedText}<span className="animate-pulse">|</span>
                  </div>
                </div>
              )}

              {animationPhase === 'wireframe' && (
                <div key="wireframe-phase" className="relative w-64 h-64 mx-auto">
                  <div className="absolute inset-0 border-4 border-[#8472DF] rounded-lg animate-spin" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-8 border-4 border-[#93C4FF] rounded-lg animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                  <div className="absolute inset-16 border-4 border-[#ACEEF3] rounded-lg animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-robot-line text-6xl text-[#8472DF] animate-pulse"></i>
                  </div>
                </div>
              )}

              {animationPhase === 'render' && (
                <div key="render-phase" className="relative w-80 h-80 mx-auto bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8472DF]/30 to-transparent animate-pulse"></div>
                  {/* Use local deer image as the render preview */}
                  <img
                    src="/deer.png"
                    alt="3D Render"
                    className="w-64 h-64 object-contain relative z-10"
                  />
                </div>
              )}

              {animationPhase === 'photo' && (
                <div key="photo-phase" className="relative">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-2xl">
                    {/* Final generated image placeholder (same as render for now) */}
                    <img
                      src="/deer.png"
                      alt="Final Photo"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[#8472DF] text-white font-bold px-6 py-3 rounded-full shadow-lg">
                    Real Object! ✨
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
