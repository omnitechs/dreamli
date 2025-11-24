'use client';

import LazyGlb from '@/components/GlbViewer';
import {useTranslations} from 'next-intl';

export default function FeatureGrid() {
  const t = useTranslations('aiLanding');
  const tc = useTranslations('christmas');
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Text to 3D — only the horse image per spec */}
          <div className="bg-gradient-to-br from-[#F8F9FF] to-[#F3E8FF] rounded-3xl p-10 border border-[#8472DF]/20 hover:border-[#8472DF]/50 transition-all duration-300 group hover:shadow-xl">
            <div className="w-16 h-16 bg-[#8472DF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="ri-edit-line text-4xl text-[#8472DF]"></i>
            </div>

            <h3 className="text-3xl font-bold text-[#2E2E2E] mb-4">{tc('textTo3d.title')}</h3>

            <p className="text-xl text-[#8472DF] mb-6 leading-relaxed font-semibold">{tc('textTo3d.canDescribe')}</p>

            <p className="text-[#2E2E2E]/70 leading-relaxed mb-8">{t('textTo3dExplainer')}</p>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <i className="ri-terminal-box-line text-[#8472DF]"></i>
                <span className="text-[#2E2E2E]/70 text-sm">{tc('textTo3d.promptLabel')}</span>
              </div>
              <div className="text-[#2E2E2E] font-mono text-sm mb-4">"{t('horsePrompt')}"</div>
              {/* Make this image container same size as the Image-to-3D viewer for visual consistency */}
              <div className="w-full bg-gradient-to-br from-[#8472DF]/10 to-[#93C4FF]/10 rounded-lg p-2">
                <div className="w-full h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden border border-gray-200">
                  {/* Only image here */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/horse.png"
                    alt="Horse Prompt Preview"
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image to 3D — image + GLB with explicit size */}
          <div className="bg-gradient-to-br from-[#F8F9FF] to-[#DBEAFE] rounded-3xl p-10 border border-[#93C4FF]/20 hover:border-[#93C4FF]/50 transition-all duration-300 group hover:shadow-xl">
            <div className="w-16 h-16 bg-[#93C4FF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <i className="ri-image-line text-4xl text-[#93C4FF]"></i>
            </div>

            <h3 className="text-3xl font-bold text-[#2E2E2E] mb-4">{tc('imageTo3d.title')}</h3>

            <p className="text-xl text-[#93C4FF] mb-6 leading-relaxed font-semibold">{tc('imageTo3d.havePicture')}</p>

            <p className="text-[#2E2E2E]/70 leading-relaxed mb-8">{tc('imageTo3d.explainer')}</p>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <i className="ri-upload-cloud-line text-[#93C4FF]"></i>
                <span className="text-[#2E2E2E]/70 text-sm">{tc('imageTo3d.uploadLabel')}</span>
              </div>
              {/* Vertical flow: image ↓ 3D model */}
              <div className="flex flex-col items-center gap-4">
                {/* Make the source image exactly the same size as the 3D viewer below */}
                <div className="w-full bg-gradient-to-br from-[#FFB067]/20 to-[#FFB067]/10 rounded-lg p-2">
                  <div className="w-full h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/horse.png" alt="Source Image" className="w-full h-full object-contain bg-white" />
                  </div>
                </div>
                <i className="ri-arrow-down-line text-3xl text-[#8472DF] animate-pulse"></i>
                <div className="w-full bg-gradient-to-br from-[#8472DF]/10 to-[#93C4FF]/10 rounded-lg p-2">
                  <div className="w-full h-56 sm:h-64 md:h-72 rounded-lg overflow-hidden border border-gray-200">
                    <LazyGlb
                      modelUrl="/horse.glb"
                      forceType="glb"
                      className="w-full h-full"
                      showHints={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
