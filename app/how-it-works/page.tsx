
'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import StepSection from './StepSection';
import FooterCTA from './FooterCTA';
import FAQ from './FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadForm from '../components/UploadForm';

export default function HowItWorksPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    document.title = "How It Works: Drawing to 3D Printed, Paintable Figure | Dreamli";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Step-by-step: upload artwork (photo or scan), preview and approve the 3D model, we 3D-print and deliver your paintable figure with brushes and paints.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Step-by-step: upload artwork (photo or scan), preview and approve the 3D model, we 3D-print and deliver your paintable figure with brushes and paints.';
      document.head.appendChild(meta);
    }
  }, []);

  const handleStartForFree = () => {
    setShowUploadModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] mb-6 leading-tight">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-[#8472DF] font-semibold mb-8 max-w-2xl mx-auto">
              Simple 4 Steps — from drawing to a real figure.
            </p>
            <button 
              onClick={handleStartForFree}
              className="inline-block bg-[#8472DF] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#7A66D9] transition-colors shadow-lg whitespace-nowrap cursor-pointer"
            >
              Start for Free
            </button>
          </div>
        </div>
      </div>
      
      <div onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.textContent?.includes('Start for Free') || target.closest('button')?.textContent?.includes('Start for Free')) {
          e.preventDefault();
          handleStartForFree();
        }
      }}>
        <StepSection
          stepNumber={1}
          title="Upload Drawing"
          blurb="Remove confusion; it's easy."
          substeps={[
            "Start for Free — Click any call-to-action to begin.",
            "Upload the drawing — Photo or scan is fine.",
            "Add child & contact — Name, age, email; phone optional.",
            "Secure checkout — Pay safely to create your project."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/9bb975c2407a95f21c17eb0e6194b353.png"
          imageAlt="Upload Drawing Process"
        />
        
        <StepSection
          stepNumber={2}
          title="Preview & Confirm"
          blurb="See and approve before we print."
          substeps={[
            "Account / Login — Set a password from email or use Google.",
            "Orders — Your dashboard lists every order.",
            "Memory Page — A live timeline of updates and files.",
            "3D Preview & Revisions — Review the model; approve or request up to 3 changes."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5b6120a5cd542ee7eeb0ff23c5c818da.png"
          imageAlt="3D Preview and Dashboard"
          reverse={true}
        />
        
        <StepSection
          stepNumber={3}
          title="We Create It"
          blurb="We build with care and quality."
          substeps={[
            "3D Printing — After approval, we print and quality-check.",
            "Age-Smart Painting Kit — Brushes and paints matched to age and style.",
            "Shipping & Tracking — Packed safely; updates sent to your email."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/5cf087223314587d8aa5957dc16f184b.png"
          imageAlt="3D Printing Process"
        />
        
        <StepSection
          stepNumber={4}
          title="Build & Paint"
          blurb="Make memories together, then share."
          substeps={[
            "Build, Paint & Share — Paint at home; upload photos and videos to the Memory Page; share the link with loved ones."
          ]}
          imageUrl="https://static.readdy.ai/image/ad9dc4c8042d4c1a873be12f55826cf9/017119b0ec5f5649c005512454c5aa0a.png"
          imageAlt="Family Building and Painting Together"
          reverse={true}
        />
        
        <FAQ />
        <FooterCTA />
      </div>
      
      <Footer />
      
      {showUploadModal && (
        <UploadForm 
          onClose={() => setShowUploadModal(false)} 
          isNL={false}
        />
      )}
    </div>
  );
}
