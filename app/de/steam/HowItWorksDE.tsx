'use client';

import { useState } from 'react';

const steps = [
  {
    number: "01",
    title: "Hochladen & Scannen",
    description: "Laden Sie Ihre Kinderzeichnungen hoch - unsere KI scannt und analysiert jedes Detail mit Präzision.",
    image: "https://readdy.ai/api/search-image?query=child%20uploading%20colorful%20drawing%20to%20tablet%20device%2C%20modern%20minimalist%20background%2C%20bright%20lighting%2C%20educational%20technology%20concept&width=600&height=400&seq=howworks1&orientation=landscape"
  },
  {
    number: "02", 
    title: "KI-Transformation",
    description: "Unsere fortschrittliche KI verwandelt 2D-Zeichnungen in atemberaubende 3D-Modelle und bewahrt dabei jede kreative Nuance.",
    image: "https://readdy.ai/api/search-image?query=artificial%20intelligence%20transforming%202D%20drawing%20into%203D%20model%2C%20holographic%20display%2C%20futuristic%20technology%2C%20clean%20white%20background&width=600&height=400&seq=howworks2&orientation=landscape"
  },
  {
    number: "03",
    title: "3D-Druck & Versand", 
    description: "Ihr einzigartiges 3D-Modell wird professionell gedruckt und sicher zu Ihnen nach Hause geliefert.",
    image: "https://readdy.ai/api/search-image?query=3D%20printer%20creating%20colorful%20toy%20from%20child%20drawing%2C%20professional%20printing%20setup%2C%20bright%20clean%20workspace%2C%20package%20ready%20for%20shipping&width=600&height=400&seq=howworks3&orientation=landscape"
  }
];

export default function HowItWorksDE() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Wie es funktioniert
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Von der Zeichnung zur Realität in nur drei einfachen Schritten. 
            Entdecken Sie, wie unsere innovative Technologie Kinderträume zum Leben erweckt.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-white shadow-xl border-2 border-purple-200' 
                    : 'bg-white/60 hover:bg-white hover:shadow-lg'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    activeStep === index 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:pl-8">
            <div className="relative">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-lg">
            <i className="ri-time-line text-2xl text-purple-600"></i>
            <span className="text-lg font-semibold text-gray-900">
              Durchschnittliche Bearbeitungszeit: 7-10 Werktage
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}