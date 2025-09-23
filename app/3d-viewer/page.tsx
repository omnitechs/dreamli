
'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThreeScene from '../../components/ThreeScene';
import FileUploader from '../../components/FileUploader';
import ModelControls from '../../components/ModelControls';

export default function ThreeDViewerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setSelectedFile(file);
    
    try {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    } catch (error) {
      console.error('Error creating object URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl(null);
    setSelectedFile(null);
  };

  const handleDownload = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">3D Model Viewer</h1>
            </div>
            
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="font-['Pacifico'] text-lg">Dreamli</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">3D Viewer</h2>
                {isLoading && (
                  <div className="flex items-center text-blue-600">
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Loading...
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <ThreeScene 
                  stlUrl={modelUrl || undefined}
                  width={800}
                  height={600}
                />
              </div>
              
              {!modelUrl && (
                <div className="mt-6 text-center text-gray-600">
                  <p>Upload an STL file to view your 3D model</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Model</h2>
              <FileUploader 
                onFileSelect={handleFileSelect}
                accept=".stl"
                maxSize={50 * 1024 * 1024}
              />
            </div>

            <ModelControls
              onReset={handleReset}
              onDownload={selectedFile ? handleDownload : undefined}
              fileName={selectedFile?.name}
            />

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">About STL Files</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>STL (STereoLithography) files are commonly used for 3D printing and contain mesh data representing the surface geometry of 3D objects.</p>
                <p>Supported features:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Binary and ASCII STL formats</li>
                  <li>Interactive rotation and zoom</li>
                  <li>Automatic model centering</li>
                  <li>File size up to 50MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
