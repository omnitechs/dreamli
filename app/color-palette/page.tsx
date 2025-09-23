
'use client';

import { useState } from 'react';

const colors = [
  { hex: '8472DF', name: 'Purple' },
  { hex: '93C4FF', name: 'Light Blue' },
  { hex: 'FFB067', name: 'Orange' },
  { hex: 'DBEAFE', name: 'Very Light Blue' },
  { hex: '2E2E2E', name: 'Dark Gray' },
  { hex: 'ACEEF3', name: 'Cyan' },
  { hex: 'F3E8FF', name: 'Light Purple' },
];

export default function ColorPalettePage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(`#${color}`);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Color Palette Reference</h1>
          <p className="text-lg text-gray-600">Click any color to copy its hex code</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {colors.map((color, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => copyToClipboard(color.hex)}
            >
              <div
                className="h-32 w-full"
                style={{ backgroundColor: `#${color.hex}` }}
              ></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{color.name}</h3>
                <p className="text-sm text-gray-600 font-mono">#{color.hex}</p>
                {copiedColor === color.hex && (
                  <p className="text-xs text-green-600 mt-2">Copied!</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Color Usage Examples</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Primary Colors</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-white text-sm" style={{ backgroundColor: '#8472DF' }}>#8472DF</span>
                <span className="px-3 py-1 rounded-full text-white text-sm" style={{ backgroundColor: '#2E2E2E' }}>#2E2E2E</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Accent Colors</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-gray-800 text-sm" style={{ backgroundColor: '#FFB067' }}>#FFB067</span>
                <span className="px-3 py-1 rounded-full text-gray-800 text-sm" style={{ backgroundColor: '#93C4FF' }}>#93C4FF</span>
                <span className="px-3 py-1 rounded-full text-gray-800 text-sm" style={{ backgroundColor: '#ACEEF3' }}>#ACEEF3</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Background Colors</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-gray-800 text-sm border" style={{ backgroundColor: '#DBEAFE' }}>#DBEAFE</span>
                <span className="px-3 py-1 rounded-full text-gray-800 text-sm border" style={{ backgroundColor: '#F3E8FF' }}>#F3E8FF</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Color Combinations</h3>
              <div className="space-y-2">
                <div className="flex h-8 rounded overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: '#8472DF' }}></div>
                  <div className="flex-1" style={{ backgroundColor: '#F3E8FF' }}></div>
                </div>
                <div className="flex h-8 rounded overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: '#FFB067' }}></div>
                  <div className="flex-1" style={{ backgroundColor: '#DBEAFE' }}></div>
                </div>
                <div className="flex h-8 rounded overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: '#93C4FF' }}></div>
                  <div className="flex-1" style={{ backgroundColor: '#ACEEF3' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Tailwind CSS Classes</h3>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                <div>bg-[#8472DF] text-[#8472DF] border-[#8472DF]</div>
                <div>bg-[#93C4FF] text-[#93C4FF] border-[#93C4FF]</div>
                <div>bg-[#FFB067] text-[#FFB067] border-[#FFB067]</div>
                <div>bg-[#DBEAFE] text-[#DBEAFE] border-[#DBEAFE]</div>
                <div>bg-[#2E2E2E] text-[#2E2E2E] border-[#2E2E2E]</div>
                <div>bg-[#ACEEF3] text-[#ACEEF3] border-[#ACEEF3]</div>
                <div>bg-[#F3E8FF] text-[#F3E8FF] border-[#F3E8FF]</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">CSS Variables</h3>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
                <div>--purple: #8472DF;</div>
                <div>--light-blue: #93C4FF;</div>
                <div>--orange: #FFB067;</div>
                <div>--very-light-blue: #DBEAFE;</div>
                <div>--dark-gray: #2E2E2E;</div>
                <div>--cyan: #ACEEF3;</div>
                <div>--light-purple: #F3E8FF;</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
