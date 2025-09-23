
'use client';

import ZoomableImage from '../components/ZoomableImage';

interface StepSectionProps {
  stepNumber: number;
  title: string;
  blurb: string;
  substeps: string[];
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
}

export default function StepSection({ 
  stepNumber, 
  title, 
  blurb, 
  substeps, 
  imageUrl, 
  imageAlt,
  reverse = false 
}: StepSectionProps) {
  const sectionId = `step-${stepNumber}`;

  return (
    <div id={sectionId} className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
          <div className="flex-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-[#8472DF] text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                {stepNumber}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#333333]">{title}</h2>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">{blurb}</p>
            
            <ul className="space-y-4">
              {substeps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-[#8472DF] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {imageUrl && (
            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <ZoomableImage 
                  src={imageUrl}
                  alt={imageAlt || `Step ${stepNumber}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
