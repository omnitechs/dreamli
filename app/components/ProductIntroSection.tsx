
'use client';

import { useState } from 'react';
import UploadForm from './UploadForm';

export default function ProductIntroSection() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('section:nth-child(5)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}
