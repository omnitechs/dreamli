
'use client';

export default function FooterCTA() {
  return (
    <div className="bg-gradient-to-r from-[#8472DF] to-[#8472DF] py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to turn their drawing into reality?
        </h2>
        <button className="inline-block bg-white text-[#8472DF] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg whitespace-nowrap cursor-pointer">
          Start for Free
        </button>
      </div>
    </div>
  );
}
