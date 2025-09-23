export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Upload",
      description: "Upload a photo or drawing (JPG/PNG). Add notes for important details.",
      icon: "ri-upload-2-line"
    },
    {
      number: 2,
      title: "Live AI preview",
      description: "See your 3D model update in real time. Request one free round of minor tweaks.",
      icon: "ri-3d-view-line"
    },
    {
      number: 3,
      title: "Print & ship",
      description: "Choose size and color tier. The price updates live. Approve and order; we print and deliver.",
      icon: "ri-printer-line"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            How it works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <i className="ri-arrow-right-line text-gray-400"></i>
                  </div>
                </div>
              )}
              
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {step.number}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${step.icon} text-blue-600 text-xl`}></i>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Step {step.number} — {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}