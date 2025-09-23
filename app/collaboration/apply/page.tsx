import { Suspense } from 'react';
import ApplicationForm from './ApplicationForm';

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="ri-loader-4-line text-2xl text-white animate-spin"></i>
        </div>
        <p className="text-gray-600">Loading application form...</p>
      </div>
    </div>}>
      <ApplicationForm />
    </Suspense>
  );
}