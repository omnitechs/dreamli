
'use client';

import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Upload Drawing",
      description: "Upload your child's drawing and we'll transform it into a complete keepsake bundle.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png",
      alt: "Parent photographing a child's angel drawing to turn into a 3D printed keepsake",
      link: "/how-it-works#step-1"
    },
    {
      number: 2,
      title: "Preview & Confirm",
      description: "See the 3D model preview and confirm before we start creating your figure.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/d4cb39d78c1c354c9040a676b15b190c.webp",
      alt: "3D modeling software showing an angel figurine created from a child's drawing",
      link: "/how-it-works#step-2"
    },
    {
      number: 3,
      title: "We Create It",
      description: "Our team 3D prints your figurine, creates the lithophane nightlight, magnet, and keychains.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/65b1a71f4f3d3f49dd830c05c2695294.webp",
      link: "/how-it-works#step-3"
    },
    {
      number: 4,
      title: "Build & Paint",
      description: "Your complete Gift Pack arrives ready to display, plus access to your private Memory Page.",
      image: "https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/ae69e1793d0aa487776c0b377072507a.webp",
      link: "/how-it-works#step-4"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-blue-700">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Simple 4 Steps</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Remove confusion, show it's easy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Link 
              key={step.number} 
              href={step.link}
              className="text-center group cursor-pointer block transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">{step.number}</span>
              </div>
              <div className="mb-6 overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img 
                  src={step.image} 
                  alt={step.number === 1 ? "Child's drawing of an angel being uploaded to Dreamli platform" : 
                       step.number === 2 ? "3D modeling software showing an angel figurine created from a child's drawing" :
                       "Hand holding a 3D printed angel figurine outside as a personalized keepsake from a child's drawing"}
                  className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 rounded-full px-6 py-3" style={{ backgroundColor: '#e6e6e6' }}>
            <i className="ri-shield-check-line text-xl w-6 h-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #93C4FF 0%, #ACEEF3 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
            <span className="text-black font-medium">Made by experienced craftspeople</span>
          </div>
        </div>
      </div>
    </section>
  );
}
