
'use client';

import { useState } from 'react';
import UploadForm from '../components/UploadForm';

export default function BlogClosingCTA() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Have Your Own Story to Share?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            We'd love to feature your creative parenting moments and success stories on our blog.
          </p>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center whitespace-nowrap cursor-pointer"
          >
            Share Your Story
            <i className="ri-upload-line ml-2 w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
      </section>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}
