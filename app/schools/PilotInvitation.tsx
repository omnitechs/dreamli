
'use client';

interface PilotInvitationProps {
  onRequestPilot: () => void;
}

export default function PilotInvitation({ onRequestPilot }: PilotInvitationProps) {
  return (
    <section className="py-24 bg-[#1F2937] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 left-1/3 w-8 h-8 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Ready to Transform Creative Learning in Your School?
          </h2>

          {/* Value props */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-gift-fill text-white text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">Try a session — no commitment</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-time-fill text-white text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">15-min demo</h3>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-fill text-white text-xl"></i>
              </div>
              <h3 className="font-bold text-lg mb-2">100% satisfaction guarantee</h3>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRequestPilot}
              className="bg-[#FFA726] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Request a Pilot
            </button>
            
            <button
              onClick={onRequestPilot}
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-[#1F2937] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Book a 15-min Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
