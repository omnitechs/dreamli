import LazyGlb from '@/components/GlbViewer';
import { useTranslations } from 'next-intl';

export default function TestimonialSection() {
  const tc = useTranslations('christmas');
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[#F3E8FF] to-[#DBEAFE]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8472DF]/20 to-[#93C4FF]/20 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden border-4 border-[#8472DF]/30 shadow-2xl w-full h-[520px]">
              {/* GLB viewer of the deer with explicit container size */}
              <LazyGlb modelUrl="/deer.glb" forceType="glb" className="w-full h-full" height={520} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill text-3xl text-[#FFB067]"></i>
              ))}
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-[#2E2E2E] leading-tight">
              {tc('testimonial.title')}
            </h2>

            <blockquote className="text-xl text-[#2E2E2E]/80 italic leading-relaxed border-l-4 border-[#8472DF] pl-6">
              {tc('testimonial.quote')}
            </blockquote>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8472DF] to-[#93C4FF] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                S
              </div>
              <div>
                <div className="text-[#2E2E2E] font-semibold text-lg">{tc('testimonial.name')}</div>
                <div className="text-[#2E2E2E]/60 flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-[#8472DF]"></i>
                  {tc('testimonial.verified')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
