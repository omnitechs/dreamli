
'use client';

interface ProgramOptionsProps {
  onRequestPilot: () => void;
}

export default function ProgramOptions({ onRequestPilot }: ProgramOptionsProps) {
  const programs = [
    {
      title: "One-Off Creative Workshop",
      duration: "Single session",
      description: "Fun, low-risk introduction to creativity",
      features: [
        "Pre-created themed 3D models (€299 value)",
        "Complete painting kit with paints, brushes, cleanup (€79 value)",
        "Ready-to-use teacher guide (€49 value)",
        "Satisfaction Guarantee — full refund if students aren't happy (Priceless)"
      ],
      price: "€249",
      originalPrice: "€427",
      popular: false,
      closingLine: "Perfect for school events or a first Dreamli experience."
    },
    {
      title: "6-Week Creative Journey",
      duration: "Weekly sessions",
      description: "From fun to transformation. Students create → print → paint, unlimited times",
      features: [
        "Unlimited 3D prints from student drawings (€899 value)",
        "6 weekly challenges & lesson plans (€249 value)",
        "Complete material kit for all weeks (€179 value)",
        "Student progress tracker (€149 value)",
        "Satisfaction Guarantee — full refund if not satisfied"
      ],
      price: "€1,130",
      originalPrice: "€1,476",
      popular: true,
      closingLine: "Build creativity, confidence, and resilience in 6 weeks."
    },
    {
      title: "Dreamli Creative Club",
      duration: "Monthly ongoing",
      description: "Ongoing enrichment that turns creativity into real-world skills",
      features: [
        "New 3D prints & themed kits monthly (€499 value)",
        "Unlimited student drawings → printed models (€299 value)",
        "Digital creative profile for each student (€249 value)",
        "Seasonal parent showcases (€199 value)",
        "Gamified panel — students earn scores, learn teamwork, financial literacy, advertising, scaling value, AI skills, and can earn back part of monthly cost (Priceless)",
        "Satisfaction Guarantee — cancel anytime, refund last month if not satisfied"
      ],
      price: "€639/month",
      originalPrice: "€1,246/month",
      popular: false,
      closingLine: "Year-round creativity + future-ready skills."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-purple-700">Program Options</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose What Fits Your Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible formats designed for different educational goals and schedules
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className={`relative bg-white rounded-3xl p-8 shadow-lg border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${program.popular ? 'border-[#FFA726] ring-2 ring-[#FFA726]/20' : 'border-gray-200'}`}>
              
              {program.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#FFA726] text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-[#FFA726] font-semibold mb-3">{program.duration}</p>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{program.description}</p>
                
                {/* Value vs Price */}
                <div className="mb-4">
                  <div className="text-lg text-gray-500 line-through mb-1">Total Value: {program.originalPrice}</div>
                  <div className="text-3xl font-bold text-gray-900">{program.price}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {program.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-check-fill text-green-600 text-sm"></i>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Closing line */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-800 italic text-center">"{program.closingLine}"</p>
              </div>

              <button
                onClick={onRequestPilot}
                className={`w-full py-4 rounded-full text-lg font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105 ${
                  program.popular 
                    ? 'bg-[#FFA726] text-white hover:bg-[#FF9800]'
                    : 'bg-white text-[#FFA726] border-2 border-[#FFA726] hover:bg-[#FFA726] hover:text-white'
                }`}
              >
                Reserve Your Spot Today
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee and Scarcity */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {/* Guarantee Box */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-shield-check-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-lg">100% Satisfaction Guarantee</h3>
                <p className="text-green-700">If your students aren't satisfied, we refund your payment.</p>
              </div>
            </div>
          </div>

          {/* Scarcity Box */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <i className="ri-alarm-warning-fill text-white text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg">Limited Availability</h3>
                <p className="text-red-700">Only 3 schools per city accepted per term. 15 pilot spots left this term.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRequestPilot}
              className="bg-[#FFA726] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FF9800] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Reserve Your Spot Today
            </button>
            
            <button
              onClick={onRequestPilot}
              className="bg-transparent text-[#FFA726] border-2 border-[#FFA726] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#FFA726] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg transform hover:scale-105"
            >
              Book a Quick Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
