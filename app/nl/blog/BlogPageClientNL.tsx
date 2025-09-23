
'use client';

import { useState } from 'react';
import UploadForm from '../../components/UploadForm';

export default function BlogPageClientNL() {
  const [showUploadForm, setShowUploadForm] = useState(false);

  return (
    <>
      {/* Upload Form Modal */}
      {showUploadForm && (
        <UploadForm onClose={() => setShowUploadForm(false)} />
      )}
    </>
  );
}
