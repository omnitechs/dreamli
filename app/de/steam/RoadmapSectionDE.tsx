'use client';

import { useState } from 'react';

const roadmapItems = [
  {
    quarter: "Q1 2024",
    title: "Erweiterte KI-Funktionen",
    description: "Verbesserte Erkennung komplexer Zeichnungen und mehrfarbige 3D-Modelle",
    status: "completed",
    features: [
      "Multi-Color 3D-Druck",
      "Verbesserte Kantenerkennung", 
      "Automatische Größenoptimierung"
    ]
  },
  {
    quarter: "Q2 2024", 
    title: "Mobile App Launch",
    description: "Native iOS und Android Apps für einfacheres Hochladen und Verfolgen",
    status: "completed",
    features: [
      "AR Vorschau-Funktion",
      "Push-Benachrichtigungen",
      "Offline-Zeichnungsspeicher"
    ]
  },
  {
    quarter: "Q3 2024",
    title: "Interaktive Features",
    description: "Bewegliche Teile und einfache Elektronik für 3D-Modelle",
    status: "in-progress", 
    features: [
      "Bewegliche Gelenke",
      "LED-Integration",
      "Sound-Module"
    ]
  },
  {
    quarter: "Q4 2024",
    title: "Kollaborative Plattform",
    description: "Kinder können gemeinsam an Projekten arbeiten und Kreationen teilen",
    status: "planned",
    features: [
      "Gemeinsame Projektarbeit",
      "Kreativitäts-Galerie",
      "Peer-Bewertungssystem"
    ]
  },
  {
    quarter: "Q1 2025",
    title: "KI-Lernassistent", 
    description: "Personalisierte Lernpläne basierend auf individuellen Stärken",
    status: "planned",
    features: [
      "Adaptive Lernpfade",
      "Fortschrittsverfolgung",
      "Individuelle Herausforderungen"
    ]
  },
  {
    quarter: "Q2 2025",
    title: "VR Integration",
    description: "Virtual Reality Erlebnisse zum Erkunden der eigenen 3D-Kreationen",
    status: "planned", 
    features: [
      "VR-Galerie",
      "Immersive Bearbeitung",
      "Virtuelle Spielwelten"
    ]
  }
];

export default function RoadmapSectionDE() {
  const [selectedItem, setSelectedItem] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'planned': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in-progress': return 'In Arbeit';
      case 'planned': return 'Geplant';
      default: return 'Geplant';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Unsere Entwicklungs-Roadmap
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie, welche aufregenden neuen Features und Verbesserungen 
            wir für die Zukunft geplant haben. Innovation hört nie auf!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {roadmapItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedItem === index
                      ? 'bg-white shadow-xl border-2 border-purple-200'
                      : 'bg-white/60 hover:bg-white hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedItem(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-600">
                      {item.quarter}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {roadmapItems[selectedItem].title}
                </h3>
                <span className={`px-4 py-2 rounded-full text-sm text-white ${getStatusColor(roadmapItems[selectedItem].status)}`}>
                  {getStatusText(roadmapItems[selectedItem].status)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">
                {roadmapItems[selectedItem].description}
              </p>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Hauptfunktionen:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {roadmapItems[selectedItem].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <i className="ri-lightbulb-line text-2xl text-purple-600"></i>
                  <div>
                    <p className="text-purple-800 font-semibold">
                      Innovation im Fokus
                    </p>
                    <p className="text-purple-600 text-sm">
                      Jedes Update wird sorgfältig geplant, um die Lernerfahrung Ihrer Kinder zu verbessern.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Haben Sie Ideen für neue Features?
            </h3>
            <p className="text-gray-600 mb-6">
              Wir hören immer auf unsere Community! Teilen Sie Ihre Vorschläge mit uns.
            </p>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap">
              Feedback senden
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}