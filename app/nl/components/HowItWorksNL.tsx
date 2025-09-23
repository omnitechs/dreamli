
'use client';

import { useState } from 'react';
import Link from 'next/link';
import UploadForm from '../../components/UploadForm';

export default function HowItWorksNL() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const steps = [
    {
      number: 1,
      title: "Upload Tekening",
      description: "Upload de unieke tekening van je kind - we hebben geen kant-en-klare ontwerpen.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/4caf18ca8c8368429662c9e0e9fd8e65.webp",
      alt: "Ouder fotografeert de engeltekening van een kind om er een 3D-geprint aandenken van te maken",
      link: "/nl/hoe-werkt-het#stap-1"
    },
    {
      number: 2,
      title: "Bekijk & Bevestig",
      description: "Zie het 3D-model van de tekening en bevestig voordat we het maken.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d4cb39d78c1c354c9040a676b15b190c.webp",
      alt: "3D-modelleringssoftware toont een engeltje gemaakt van een kindertekening",
      link: "/nl/hoe-werkt-het#stap-2"
    },
    {
      number: 3,
      title: "Wij Maken Het",
      description: "Ons team print de figuur in 3D volgens jouw goedgekeurde ontwerp.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/65b1a71f4f3d3f49dd830c05c2695294.webp",
      alt: "Hand houdt een 3D-geprint engeltje buiten als gepersonaliseerd aandenken van een kindertekening",
      link: "/nl/hoe-werkt-het#stap-3"
    },
    {
      number: 4,
      title: "Bouwen & Verven",
      description: "Alle gereedschappen en instructies inbegrepen voor de finishing touch.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ae69e1793d0aa487776c0b377072507a.webp",
      alt: "Blij meisje houdt haar muistekening met een bijpassend op maat gemaakt 3D-geprint beeldje",
      link: "/nl/hoe-werkt-het#stap-4"
    }
  ];

  return (
    <>
      <section id="hoe-werkt-het" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <span className="text-sm font-semibold text-blue-700">Hoe Het Werkt</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simpele 4 Stappen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Van tekening tot 3D-model - eenvoudig en betrouwbaar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Link key={index} href={step.link} className="text-center group cursor-pointer">
                <div className="transform transition-all duration-300 hover:scale-105">
                  {/* Step number */}
                  <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>

                  {/* Image */}
                  <div className="mb-6 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img 
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Reassuring note */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-3 bg-[#F5F5F5] rounded-full px-6 py-3">
              <i className="ri-shield-check-fill bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] bg-clip-text text-transparent text-xl"></i>
              <span className="text-black font-medium">Gemaakt door ervaren ambachtslieden</span>
            </div>
          </div>
        </div>
      </section>

      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} isNL={true} />
      )}
    </>
  );
}