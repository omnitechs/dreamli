// app/(lang)/[lang]/projects/[projectId]/components/UploadCard.tsx
'use client';

import { useState } from 'react';
import { Upload, Link2, Plus } from 'lucide-react';
import useImages from '@/app/(lang)/[lang]/ai/hooks/useImages';
import { useDispatch } from 'react-redux';
import { addImages } from '@/app/(lang)/[lang]/ai/store/slices/generatorSlice';


export function UploadCard() {
    const dispatch = useDispatch();
    const { handleFiles, fileInputRef } = useImages();

    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    // ---- Local helpers ----
    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);
        try {
            await handleFiles(e.target.files);
        } finally {
            setUploading(false);
            e.target.value = ''; // reset input
        }
    };

    const handleFileUpload = async (files: FileList) => {
        if (!files?.length) return;
        setUploading(true);
        try {
            await handleFiles(files);
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files?.length) {
            await handleFileUpload(files);
        }
    };

    const onBrowseClick = () => fileInputRef.current?.click();

    const handleUrlSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = imageUrl.trim();
        if (!url) return;

        // Optimistic add by URL (no upload)
        setUploading(true);
        try {
            const id = crypto.randomUUID();
            dispatch(
                addImages([
                    {
                        id,
                        url,
                        key: '',
                        meta: { source: 'url' },
                    } as any,
                ]),
            );
            setImageUrl('');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Images
            </h3>

            {/* File Upload */}
            <div
                className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50'
                    : uploading ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-400'}
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={onBrowseClick}
                role="button"
                aria-label="Upload images"
            >
                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/75 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            Uploading...
                        </div>
                    </div>
                )}

                {/* Hidden input uses the ref provided by the hook */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onClick={(e) => e.stopPropagation()}
                />

                <div className="space-y-2 pointer-events-none">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Drop images here or click to browse
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                </div>
            </div>

            {/* URL Input */}
            <form onSubmit={handleUrlSubmit} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Or add from URL</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            disabled={uploading}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!imageUrl.trim() || uploading}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}
