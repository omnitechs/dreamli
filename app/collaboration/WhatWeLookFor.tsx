export default function WhatWeLookFor() {
  const requirements = [
    "Print-friendly FDM models (0.2–0.28 mm), minimal supports",
    "Kid-safe shapes and family-friendly themes", 
    "Original work only (no fan-art/IP without license)",
    "Clear notes: scale, supports, tested settings"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Look For
          </h2>
        </div>
        
        <div className="space-y-4">
          {requirements.map((requirement, index) => (
            <div key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {requirement}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}