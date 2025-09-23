'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';

export default function ProductIntroSectionDE() {
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