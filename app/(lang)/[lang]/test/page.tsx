
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Version {
    id: string;
    name: string;
    type: 'text' | 'image' | '3d';
    prompt?: string;
    images?: string[];
    timestamp: Date;
    parentId?: string;
    thumbnail?: string;
    metadata?: {
        style?: string;
        inputCount?: number;
        outputType?: string;
        inputType?: 'text' | 'image' | 'both';
        meshyJobId?: string;
    };
}

interface Project {
    id: string;
    name: string;
    versions: Version[];
    activeVersionId: string;
    branches: { [key: string]: Version[] };
}

interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    versionId?: string;
    images?: string[];
    model3d?: string;
    timestamp: Date;
    inputType?: 'text' | 'image' | 'both';
}

interface ImageState {
    id: string;
    url: string;
    label: 'Front' | 'Side' | 'Top' | '¾' | 'Custom';
    origin: 'Uploaded' | 'Generated' | 'Edited';
    timestamp: Date;
    selected: boolean;
    locked: boolean;
    primary: boolean;
}

export default function Creator3D() {
    const [projects, setProjects] = useState<Project[]>([
        {
            id: '1',
            name: 'Futuristic Robot Design',
            activeVersionId: 'v1',
            versions: [
                {
                    id: 'v1',
                    name: 'v1',
                    type: 'text',
                    prompt: 'A futuristic robot with sleek metallic design',
                    timestamp: new Date(Date.now() - 3600000),
                    thumbnail: 'https://readdy.ai/api/search-image?query=futuristic%20robot%20with%20sleek%20metallic%20design%20standing%20in%20minimalist%20white%20studio%20background%20with%20soft%20lighting&width=400&height=400&seq=1&orientation=squarish',
                    metadata: { style: 'realistic', inputType: 'text', outputType: 'Text Generation' }
                },
                {
                    id: 'v2',
                    name: 'v2 - Modified Image',
                    type: 'image',
                    prompt: 'Enhanced robot with more angular features',
                    timestamp: new Date(Date.now() - 1800000),
                    parentId: 'v1',
                    images: ['https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=2&orientation=squarish'],
                    thumbnail: 'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=2&orientation=squarish',
                    metadata: { style: 'detailed', inputType: 'image', outputType: 'Image Generation' }
                },
                {
                    id: 'v3',
                    name: 'v3 - Multi-angle',
                    type: 'image',
                    prompt: 'Generated front, side, and 3/4 views',
                    timestamp: new Date(Date.now() - 900000),
                    parentId: 'v2',
                    images: [
                        'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20front%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=3&orientation=squarish',
                        'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20side%20profile%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=4&orientation=squarish',
                        'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20three%20quarter%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=5&orientation=squarish'
                    ],
                    thumbnail: 'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20front%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=3&orientation=squarish',
                    metadata: { style: 'detailed', inputType: 'image', outputType: 'Multi-angle Generation', inputCount: 3 }
                }
            ],
            branches: {},
        },
    ]);

    const [activeProject, setActiveProject] = useState<Project>(projects[0]);
    const [activeTab, setActiveTab] = useState<'prompt' | 'images' | 'model'>('prompt');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'user',
            content: 'A futuristic robot with sleek metallic design',
            timestamp: new Date(Date.now() - 3600000),
            inputType: 'text'
        },
        {
            id: '2',
            type: 'ai',
            content: "I've generated your initial concept! This text-based prompt created a sleek futuristic robot design.",
            versionId: 'v1',
            timestamp: new Date(Date.now() - 3590000),
        },
        {
            id: '3',
            type: 'user',
            content: 'Make the robot more angular and enhance the metallic features',
            timestamp: new Date(Date.now() - 1800000),
            inputType: 'text'
        },
        {
            id: '4',
            type: 'ai',
            content: "Great! I've modified the image based on your prompt. The robot now has more angular features and enhanced metallic details.",
            versionId: 'v2',
            images: ['https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=2&orientation=squarish'],
            timestamp: new Date(Date.now() - 1790000),
        },
        {
            id: '5',
            type: 'user',
            content: 'Generate multiple angles of this design',
            timestamp: new Date(Date.now() - 900000),
            inputType: 'text'
        },
        {
            id: '6',
            type: 'ai',
            content: "Perfect! I've generated front, side, and ¾ views of your robot design. These multiple angles will be great for 3D generation.",
            versionId: 'v3',
            images: [
                'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20front%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=3&orientation=squarish',
                'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20side%20profile%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=4&orientation=squarish',
                'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20three%20quarter%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=5&orientation=squarish'
            ],
            timestamp: new Date(Date.now() - 890000),
        }
    ]);

    const [inputText, setInputText] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('realistic');
    const [inputMode, setInputMode] = useState<'text' | 'images'>('text');
    const [showImageEditModal, setShowImageEditModal] = useState(false);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const [imageEditPrompt, setImageEditPrompt] = useState('');
    const [imageStates, setImageStates] = useState<ImageState[]>([
        {
            id: '1',
            url: 'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20front%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=3&orientation=squarish',
            label: 'Front',
            origin: 'Generated',
            timestamp: new Date(Date.now() - 900000),
            selected: true,
            locked: false,
            primary: true
        },
        {
            id: '2',
            url: 'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20side%20profile%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=4&orientation=squarish',
            label: 'Side',
            origin: 'Generated',
            timestamp: new Date(Date.now() - 900000),
            selected: true,
            locked: false,
            primary: false
        },
        {
            id: '3',
            url: 'https://readdy.ai/api/search-image?query=futuristic%20angular%20robot%20three%20quarter%20view%20with%20enhanced%20metallic%20features%20in%20white%20studio%20background&width=400&height=400&seq=5&orientation=squarish',
            label: '¾',
            origin: 'Generated',
            timestamp: new Date(Date.now() - 900000),
            selected: true,
            locked: false,
            primary: false
        }
    ]);
    const [approvalSet, setApprovalSet] = useState<ImageState[]>([]);
    const [isGenerating3D, setIsGenerating3D] = useState(false);
    const [anglePrompts, setAnglePrompts] = useState<{[key: string]: string}>({
        'Front': '',
        'Side': '',
        'Top': '',
        '¾': ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const activeVersion = activeProject.versions.find((v) => v.id === activeProject.activeVersionId);

    // Update current prompt when active version changes
    useEffect(() => {
        if (activeVersion?.prompt) {
            setCurrentPrompt(activeVersion.prompt);
        }
    }, [activeVersion]);

    // Update approval set from selected images
    useEffect(() => {
        const selectedImages = imageStates.filter(img => img.selected);
        setApprovalSet(selectedImages);
    }, [imageStates]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const createNewVersion = (baseVersion: Version, updates: Partial<Version>): Version => {
        const versionNumber = activeProject.versions.length + 1;
        return {
            ...baseVersion,
            id: `v${versionNumber}`,
            name: `v${versionNumber}${updates.name ? ` - ${updates.name}` : ''}`,
            timestamp: new Date(),
            parentId: baseVersion.id,
            ...updates
        };
    };

    const handleSendMessage = () => {
        if (!inputText.trim() && uploadedFiles.length === 0) return;

        const hasText = inputText.trim().length > 0;
        const hasImages = uploadedFiles.length > 0;

        let inputType: 'text' | 'image' | 'both' = 'text';
        if (hasImages && !hasText) inputType = 'image';
        else if (hasImages && hasText) inputType = 'both';

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: hasText ? inputText : 'Uploaded image(s) for processing',
            timestamp: new Date(),
            inputType,
            images: uploadedFiles.length > 0 ? uploadedFiles.map(file => URL.createObjectURL(file)) : undefined
        };

        // Determine the workflow based on input
        let aiResponse: string;
        let newVersionType: 'text' | 'image' | '3d' = 'text';
        let newVersionName = '';

        if (inputType === 'text') {
            // Text-only: can go directly to Meshy or generate images first
            aiResponse = "I've processed your text prompt. You can now generate 3D directly or create reference images first.";
            newVersionType = 'text';
            newVersionName = 'Text Input';
        } else if (inputType === 'image') {
            // Image-only: prepare for Meshy or modify images
            aiResponse = "I've received your reference image(s). These can be sent directly to 3D generation or modified first.";
            newVersionType = 'image';
            newVersionName = 'Image Input';
        } else {
            // Both: use text to modify images
            aiResponse = "I'll use your text prompt to modify the uploaded images, creating enhanced versions for 3D generation.";
            newVersionType = 'image';
            newVersionName = 'Modified Images';
        }

        const newVersion = createNewVersion(activeVersion!, {
            type: newVersionType,
            prompt: hasText ? inputText : 'Image-based input',
            images: uploadedFiles.length > 0 ? uploadedFiles.map(file => URL.createObjectURL(file)) : undefined,
            name: newVersionName,
            metadata: {
                style: selectedStyle,
                inputType,
                inputCount: uploadedFiles.length || 1,
                outputType: newVersionType === 'text' ? 'Text Generation' : 'Image Generation'
            }
        });

        const newAiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: aiResponse,
            versionId: newVersion.id,
            timestamp: new Date(),
            images: newVersion.images,
        };

        setChatMessages(prev => [...prev, newUserMessage, newAiMessage]);
        setActiveProject(prev => ({
            ...prev,
            versions: [...prev.versions, newVersion],
            activeVersionId: newVersion.id,
        }));

        // Update image states if images were uploaded
        if (uploadedFiles.length > 0) {
            const newImageStates: ImageState[] = uploadedFiles.map((file, idx) => ({
                id: `img-${Date.now()}-${idx}`,
                url: URL.createObjectURL(file),
                label: 'Custom',
                origin: 'Uploaded',
                timestamp: new Date(),
                selected: false,
                locked: false,
                primary: idx === 0
            }));
            setImageStates(prev => [...prev, ...newImageStates]);
        }

        setInputText('');
        setUploadedFiles([]);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setUploadedFiles(Array.from(files));
        }
    };

    const handleVersionSelect = (versionId: string) => {
        setActiveProject(prev => ({ ...prev, activeVersionId: versionId }));

        // Load version data into UI
        const version = activeProject.versions.find(v => v.id === versionId);
        if (version) {
            setCurrentPrompt(version.prompt || '');
            if (version.images) {
                const versionImageStates: ImageState[] = version.images.map((img, idx) => ({
                    id: `${versionId}-img-${idx}`,
                    url: img,
                    label: idx === 0 ? 'Front' : idx === 1 ? 'Side' : '¾',
                    origin: 'Generated',
                    timestamp: version.timestamp,
                    selected: true,
                    locked: false,
                    primary: idx === 0
                }));
                setImageStates(versionImageStates);
            }
        }
    };

    const handleForkVersion = (versionId: string) => {
        const sourceVersion = activeProject.versions.find(v => v.id === versionId);
        if (!sourceVersion) return;

        const forkedVersion = createNewVersion(sourceVersion, {
            name: 'Fork',
            metadata: { ...sourceVersion.metadata }
        });

        setActiveProject(prev => ({
            ...prev,
            versions: [...prev.versions, forkedVersion],
            activeVersionId: forkedVersion.id,
        }));

        // Add fork message to chat
        const forkMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'ai',
            content: `Forked from ${sourceVersion.name}. You can now make changes without affecting the original version.`,
            versionId: forkedVersion.id,
            timestamp: new Date(),
        };

        setChatMessages(prev => [...prev, forkMessage]);
    };

    const handleEditImage = (imageUrl: string) => {
        setEditingImage(imageUrl);
        setShowImageEditModal(true);
    };

    const handleApplyImageEdit = () => {
        if (!editingImage || !imageEditPrompt.trim()) return;

        const newImageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28imageEditPrompt%29%7D%20modified%20version%20with%20enhanced%20details%20in%20professional%20studio%20lighting&width=400&height=400&seq=${Date.now()}&orientation=squarish`;

        // Create new version for the edited image
        const newVersion = createNewVersion(activeVersion!, {
            type: 'image',
            name: 'Image Edit',
            prompt: imageEditPrompt,
            images: [newImageUrl],
            metadata: {
                style: selectedStyle,
                inputType: 'image',
                outputType: 'Edited Image'
            }
        });

        const editMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'ai',
            content: `I've modified the image based on your prompt: "${imageEditPrompt}"`,
            versionId: newVersion.id,
            images: [newImageUrl],
            timestamp: new Date(),
        };

        setChatMessages(prev => [...prev, editMessage]);
        setActiveProject(prev => ({
            ...prev,
            versions: [...prev.versions, newVersion],
            activeVersionId: newVersion.id,
        }));

        // Update image states
        const newImageState: ImageState = {
            id: `edited-${Date.now()}`,
            url: newImageUrl,
            label: 'Custom',
            origin: 'Edited',
            timestamp: new Date(),
            selected: true,
            locked: false,
            primary: true
        };
        setImageStates(prev => [...prev, newImageState]);

        setShowImageEditModal(false);
        setImageEditPrompt('');
        setEditingImage(null);
    };

    const handleGenerate3D = async () => {
        setIsGenerating3D(true);

        // Simulate 3D generation delay
        setTimeout(() => {
            const newVersion = createNewVersion(activeVersion!, {
                type: '3d',
                name: '3D Generated',
                prompt: inputMode === 'text' ? currentPrompt : 'Generated from images',
                images: inputMode === 'images' ? approvalSet.map(img => img.url) : undefined,
                metadata: {
                    style: selectedStyle,
                    inputType: inputMode,
                    inputCount: inputMode === 'images' ? approvalSet.length : 1,
                    outputType: '3D Model',
                    meshyJobId: `meshy-${Date.now()}`
                }
            });

            const generateMessage: ChatMessage = {
                id: Date.now().toString(),
                type: 'ai',
                content: `🎉 3D model generated successfully! Used ${inputMode === 'text' ? 'text prompt' : `${approvalSet.length} reference images`} with Meshy.ai.`,
                versionId: newVersion.id,
                model3d: 'generated-3d-model',
                timestamp: new Date(),
            };

            setChatMessages(prev => [...prev, generateMessage]);
            setActiveProject(prev => ({
                ...prev,
                versions: [...prev.versions, newVersion],
                activeVersionId: newVersion.id,
            }));

            setIsGenerating3D(false);
        }, 3000);
    };

    const handleGenerateAngle = (angle: string) => {
        const prompt = anglePrompts[angle] || `${angle} view of ${currentPrompt}`;
        const newImageUrl = `https://readdy.ai/api/search-image?query=$%7BencodeURIComponent%28prompt%29%7D%20$%7Bangle.toLowerCase%28%29%7D%20view%20professional%20studio%20lighting%20white%20background&width=400&height=400&seq=${Date.now()}&orientation=squarish`;

        const newImageState: ImageState = {
            id: `angle-${Date.now()}`,
            url: newImageUrl,
            label: angle as any,
            origin: 'Generated',
            timestamp: new Date(),
            selected: false,
            locked: false,
            primary: false
        };

        setImageStates(prev => [...prev, newImageState]);
    };

    const handleImageSelect = (imageId: string) => {
        setImageStates(prev => prev.map(img =>
            img.id === imageId ? { ...img, selected: !img.selected } : img
        ));
    };

    const handleSetPrimary = (imageId: string) => {
        setImageStates(prev => prev.map(img => ({
            ...img,
            primary: img.id === imageId
        })));
    };

    const handleToggleLock = (imageId: string) => {
        setImageStates(prev => prev.map(img =>
            img.id === imageId ? { ...img, locked: !img.locked } : img
        ));
    };

    const handleRemoveImage = (imageId: string) => {
        const image = imageStates.find(img => img.id === imageId);
        if (image?.locked) {
            if (!confirm('This image is locked. Are you sure you want to remove it?')) {
                return;
            }
        }
        setImageStates(prev => prev.filter(img => img.id !== imageId));
    };

    const handleNewProject = () => {
        const newProject: Project = {
            id: Date.now().toString(),
            name: 'Untitled Project',
            activeVersionId: 'v1',
            versions: [{
                id: 'v1',
                name: 'v1',
                type: 'text',
                prompt: '',
                timestamp: new Date(),
                metadata: { style: 'realistic', inputType: 'text' }
            }],
            branches: {}
        };

        setProjects(prev => [...prev, newProject]);
        setActiveProject(newProject);
        setChatMessages([]);
        setImageStates([]);
        setApprovalSet([]);
        setCurrentPrompt('');
        setInputText('');
    };

    const getVersionBranchInfo = (version: Version): string => {
        if (!version.parentId) return '';
        const parent = activeProject.versions.find(v => v.id === version.parentId);
        return parent ? `Based on ${parent.name}` : '';
    };

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-['Pacifico'] text-2xl text-purple-600">
                        Dreamli
                    </Link>
                    <button
                        onClick={handleNewProject}
                        className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                        + New Project
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        value={activeProject.name}
                        onChange={(e) => setActiveProject(prev => ({ ...prev, name: e.target.value }))}
                        className="text-lg font-semibold bg-transparent border-none outline-none text-center min-w-[200px]"
                    />
                    <select className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1">
                        <option>Main Branch</option>
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        💾 Save
                    </button>
                    <button
                        onClick={() => setShowCompareModal(true)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                        🧩 Compare Versions
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        🖼️ Gallery
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap">
                        ❓ Help
                    </button>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {activeVersion?.name} · {getVersionBranchInfo(activeVersion!)}
                    </div>
                </div>
            </header>

            {/* Version Navigation Bar */}
            <div className="bg-white/60 backdrop-blur-sm border-b border-purple-100 px-6 py-3">
                <div className="flex items-center gap-3 overflow-x-auto">
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                        <i className="ri-arrow-left-s-line"></i>
                    </button>

                    {activeProject.versions.map((version) => (
                        <button
                            key={version.id}
                            onClick={() => handleVersionSelect(version.id)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                // Show context menu: Fork, Rename, Compare, Revert
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap relative ${
                                version.id === activeProject.activeVersionId
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-white/80 text-gray-600 hover:bg-white hover:shadow-md'
                            }`}
                            title={`${version.prompt || 'Image-based'} • ${version.timestamp.toLocaleString()}`}
                        >
                            {version.type === 'text' ? (
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">T</div>
                            ) : version.type === 'image' ? (
                                <img src={version.thumbnail || version.images?.[0]} alt="" className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">
                                    3D
                                </div>
                            )}
                            {version.name}
                            {version.id === activeProject.activeVersionId && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                            )}
                        </button>
                    ))}

                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                        <i className="ri-arrow-right-s-line"></i>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Projects & Version Tree */}
                <div className={`${leftSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white/40 backdrop-blur-sm border-r border-purple-100 overflow-hidden`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">My Projects</h3>
                            <button
                                onClick={() => setLeftSidebarOpen(false)}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                            >
                                <i className="ri-close-line text-sm"></i>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-white/60 rounded-lg p-3">
                                    <div className="font-medium text-gray-800 mb-2">{project.name}</div>
                                    <div className="space-y-2">
                                        {project.versions.map((version) => (
                                            <div
                                                key={version.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors relative ${
                                                    version.id === activeProject.activeVersionId ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-50'
                                                }`}
                                                onClick={() => handleVersionSelect(version.id)}
                                            >
                                                {/* Connection lines for parent-child relationships */}
                                                {version.parentId && (
                                                    <div className="absolute -left-2 top-0 w-4 h-full border-l-2 border-b-2 border-gray-300 border-dashed"></div>
                                                )}

                                                {version.type === 'text' ? (
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold">
                                                        T
                                                    </div>
                                                ) : version.type === 'image' ? (
                                                    <img src={version.thumbnail || version.images?.[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xs font-bold">
                                                        3D
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-sm">{version.name}</div>
                                                    <div className="text-xs text-gray-500 truncate">{version.prompt || 'Image-based generation'}</div>
                                                    <div className="text-xs text-gray-400">{version.timestamp.toLocaleTimeString()}</div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleForkVersion(version.id);
                                                        }}
                                                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                                        title="Fork"
                                                    >
                                                        🧬
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedVersions([version.id]);
                                                            setShowCompareModal(true);
                                                        }}
                                                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                                        title="Compare"
                                                    >
                                                        🕓
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleNewProject}
                            className="w-full mt-4 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors whitespace-nowrap"
                        >
                            + New Project
                        </button>
                    </div>
                </div>

                {/* Toggle Sidebar Button */}
                {!leftSidebarOpen && (
                    <button
                        onClick={() => setLeftSidebarOpen(true)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-white/80 backdrop-blur-sm rounded-r-lg border border-l-0 border-purple-100 flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-all z-10"
                    >
                        <i className="ri-arrow-right-s-line"></i>
                    </button>
                )}

                {/* Main Workspace - Creative Chat Timeline */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Chat Timeline */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {chatMessages.map((message) => (
                            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-2xl ${
                                        message.type === 'user' ? 'bg-purple-600 text-white' : 'bg-white/80 backdrop-blur-sm'
                                    } rounded-2xl p-4 shadow-lg`}
                                >
                                    <div className="mb-2">{message.content}</div>

                                    {/* Input type indicator for user messages */}
                                    {message.type === 'user' && message.inputType && (
                                        <div className="text-xs opacity-70 mb-2">
                                            {message.inputType === 'text' && '📝 Text prompt used'}
                                            {message.inputType === 'image' && '🖼️ Image(s) uploaded'}
                                            {message.inputType === 'both' && '📝🖼️ Text + Image input'}
                                        </div>
                                    )}

                                    {message.images && (
                                        <div className={`grid ${message.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mt-3`}>
                                            {message.images.map((img, idx) => (
                                                <img key={idx} src={img} alt="" className="rounded-lg object-cover aspect-square" />
                                            ))}
                                        </div>
                                    )}

                                    {message.model3d && (
                                        <div className="mt-3 bg-gray-100 rounded-lg p-4 aspect-video flex items-center justify-center">
                                            <div className="text-center text-gray-600">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <i className="ri-3d-view-line text-2xl text-green-600"></i>
                                                </div>
                                                <div className="font-medium">3D Model Preview</div>
                                                <div className="text-sm text-gray-500">Interactive viewer • Rotate • Zoom</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Version metadata for AI messages */}
                                    {message.type === 'ai' && message.versionId && (
                                        <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
                                            Version: {activeProject.versions.find(v => v.id === message.versionId)?.name} •
                                            Mode: {activeProject.versions.find(v => v.id === message.versionId)?.metadata?.inputType} •
                                            {message.timestamp.toLocaleString()}
                                        </div>
                                    )}

                                    {message.type === 'ai' && (
                                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 flex-wrap">
                                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                                                🔄 Regenerate
                                            </button>
                                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                                                ✏️ Edit Prompt
                                            </button>
                                            <button
                                                onClick={() => message.versionId && handleForkVersion(message.versionId)}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                                            >
                                                🧬 Fork
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedVersions([message.versionId!]);
                                                    setShowCompareModal(true);
                                                }}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                                            >
                                                🕓 Compare
                                            </button>
                                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                                                🛒 Order Print
                                            </button>
                                        </div>
                                    )}

                                    <div className="text-xs opacity-60 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}

                        {isGenerating3D && (
                            <div className="flex justify-start">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                        <div>Generating 3D model with Meshy.ai...</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div className="p-6 bg-white/40 backdrop-blur-sm border-t border-purple-100">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                            {/* Show uploaded files preview */}
                            {uploadedFiles.length > 0 && (
                                <div className="mb-3 flex gap-2">
                                    {uploadedFiles.map((file, idx) => (
                                        <div key={idx} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Input method selection for mixed input */}
                            {inputText.trim() && uploadedFiles.length > 0 && (
                                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                                    <div className="font-medium text-yellow-800 mb-2">Mixed Input Detected</div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-300 transition-colors whitespace-nowrap">
                                            Use text to modify images
                                        </button>
                                        <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors whitespace-nowrap">
                                            Send text to Meshy directly
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-end gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors"
                                >
                                    <i className="ri-attachment-2"></i>
                                </button>

                                <div className="flex-1">
                  <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Describe your idea or upload a reference image..."
                      className="w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-400"
                      rows={Math.min(Math.max(1, inputText.split('\n').length), 4)}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                          }
                      }}
                  />
                                </div>

                                <button className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <i className="ri-mic-line"></i>
                                </button>

                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputText.trim() && uploadedFiles.length === 0}
                                    className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-send-plane-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                {/* Right Sidebar - Contextual Tool Panel */}
                <div className="w-96 bg-white/40 backdrop-blur-sm border-l border-purple-100 flex flex-col">
                    {/* Panel Header */}
                    <div className="p-4 border-b border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-gray-800">{activeVersion?.name}</div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleForkVersion(activeVersion!.id)}
                                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                    title="Fork"
                                >
                                    🧬
                                </button>
                                <button
                                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                    title="Revert"
                                >
                                    ♻️
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedVersions([activeVersion!.id]);
                                        setShowCompareModal(true);
                                    }}
                                    className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                                    title="Compare"
                                >
                                    🕓
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500">{activeVersion?.timestamp.toLocaleString()}</div>
                        {activeVersion?.parentId && (
                            <div className="text-xs text-purple-600 mt-1">
                                {getVersionBranchInfo(activeVersion)}
                            </div>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-purple-100">
                        {(['prompt', 'images', 'model'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                                    activeTab === tab
                                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {activeTab === 'prompt' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prompt Editor</label>
                                    <textarea
                                        value={currentPrompt}
                                        onChange={(e) => setCurrentPrompt(e.target.value)}
                                        className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="Describe what you want to create..."
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => {
                                                // Generate from text
                                                setInputText(currentPrompt);
                                                handleSendMessage();
                                            }}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
                                        >
                                            Generate from Text
                                        </button>
                                        <button
                                            disabled={imageStates.filter(img => img.selected).length === 0}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                                        >
                                            Apply to Selected Images
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Style Controls</label>
                                    <div className="space-y-2">
                                        {['realistic', 'simple', 'detailed'].map((style) => (
                                            <label key={style} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="style"
                                                    value={style}
                                                    checked={selectedStyle === style}
                                                    onChange={(e) => setSelectedStyle(e.target.value)}
                                                    className="w-4 h-4 text-purple-600"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">{style}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="text-sm font-medium text-purple-700 mb-1">Version Note</div>
                                    <div className="text-sm text-purple-600">
                                        {activeVersion?.type === 'text'
                                            ? `This prompt generated ${activeVersion?.metadata?.inputType === 'text' ? '1 text input' : 'image outputs'} used in ${activeVersion?.name}`
                                            : activeVersion?.type === 'image'
                                                ? `Generated ${activeVersion?.images?.length || 0} images used in ${activeVersion?.name}`
                                                : `3D model created from ${activeVersion?.metadata?.inputType === 'text' ? 'text prompt' : `${activeVersion?.metadata?.inputCount} images`}`
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'images' && (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-gray-700">Reference Image Grid</label>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
                                        >
                                            + Add Image
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {imageStates.map((img) => (
                                            <div key={img.id} className="relative group">
                                                <img src={img.url} alt="" className="w-full aspect-square object-cover rounded-lg" />

                                                {/* Selection checkbox */}
                                                <div className="absolute top-2 left-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={img.selected}
                                                        onChange={() => handleImageSelect(img.id)}
                                                        className="w-4 h-4 text-purple-600 bg-white rounded"
                                                    />
                                                </div>

                                                {/* Label and status indicators */}
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <div className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                                                        {img.label}
                                                    </div>
                                                    {img.primary && (
                                                        <div className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                                                            Primary
                                                        </div>
                                                    )}
                                                    {img.locked && (
                                                        <div className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                                                            🔒
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Origin tag */}
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                                    {img.origin}
                                                </div>

                                                {/* Action buttons on hover */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleEditImage(img.url)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                                                            title="Edit via Prompt"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleSetPrimary(img.id)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                                                            title="Set as Primary"
                                                        >
                                                            ⭐
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleLock(img.id)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                                                            title={img.locked ? "Unlock" : "Lock"}
                                                        >
                                                            {img.locked ? '🔓' : '🔒'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveImage(img.id)}
                                                            className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors"
                                                            title="Remove"
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {imageStates.filter(img => img.selected).length > 0 && (
                                        <div className="flex gap-2 mb-4">
                                            <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors whitespace-nowrap">
                                                Edit via Prompt (Batch)
                                            </button>
                                            <button className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors whitespace-nowrap">
                                                Assign Angle Role
                                            </button>
                                            <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors whitespace-nowrap">
                                                Send to Approval Set
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Auto-Generate Angles</label>
                                    <div className="space-y-2">
                                        {['Front', 'Side', 'Top', '¾'].map((angle) => (
                                            <div key={angle} className="flex items-center gap-3">
                                                <div className="w-16 text-xs text-gray-600">{angle}</div>
                                                <input
                                                    type="text"
                                                    value={anglePrompts[angle]}
                                                    onChange={(e) => setAnglePrompts(prev => ({ ...prev, [angle]: e.target.value }))}
                                                    placeholder="Optional specific prompt..."
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <button
                                                    onClick={() => handleGenerateAngle(angle)}
                                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                                                >
                                                    Generate
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Approval Set for 3D</label>
                                    <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg min-h-[80px]">
                                        {approvalSet.length > 0 ? (
                                            <div className="flex gap-2 overflow-x-auto">
                                                {approvalSet.map((img, idx) => (
                                                    <div key={img.id} className="relative flex-shrink-0">
                                                        <img src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center">
                                                            {idx + 1}
                                                        </div>
                                                        {img.primary && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                                                                ⭐
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-sm text-gray-500">
                                                Select images from above to add to approval set
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                        <span>{approvalSet.length} images selected for 3D</span>
                                        <span>{approvalSet.filter(img => ['Front', 'Side', 'Top', '¾'].includes(img.label)).length} of 4 standard angles present</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Source Tracking</div>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div>Total images: {imageStates.length}</div>
                                        <div>Selected for 3D: {approvalSet.length}</div>
                                        <div>Derived from: {activeVersion?.name}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'model' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Input Mode</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="inputMode"
                                                value="text"
                                                checked={inputMode === 'text'}
                                                onChange={(e) => setInputMode(e.target.value as 'text' | 'images')}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <span className="text-sm text-gray-700">Use Text for 3D</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="inputMode"
                                                value="images"
                                                checked={inputMode === 'images'}
                                                onChange={(e) => setInputMode(e.target.value as 'text' | 'images')}
                                                className="w-4 h-4 text-purple-600"
                                            />
                                            <span className="text-sm text-gray-700">Use Images for 3D</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Preflight Summary</div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {inputMode === 'text' ? (
                                            <>
                                                <div><strong>Mode:</strong> Text-based generation</div>
                                                <div><strong>Prompt:</strong> "{currentPrompt || 'No prompt set'}"</div>
                                                <div><strong>Style:</strong> {selectedStyle}</div>
                                                <div><strong>Will send to:</strong> Meshy.ai text-to-3D</div>
                                            </>
                                        ) : (
                                            <>
                                                <div><strong>Mode:</strong> Image-based generation</div>
                                                <div><strong>Images selected:</strong> {approvalSet.length}</div>
                                                <div><strong>Angles present:</strong> {approvalSet.map(img => img.label).join(', ') || 'None'}</div>
                                                <div><strong>Primary image:</strong> {approvalSet.find(img => img.primary)?.label || 'None set'}</div>
                                                <div><strong>Will send to:</strong> Meshy.ai image-to-3D</div>
                                            </>
                                        )}
                                    </div>

                                    {/* Warnings */}
                                    {inputMode === 'images' && approvalSet.length === 0 && (
                                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                            ⚠️ No images selected for 3D generation
                                        </div>
                                    )}
                                    {inputMode === 'images' && approvalSet.length > 6 && (
                                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                            ⚠️ Too many images selected (max 6 recommended)
                                        </div>
                                    )}
                                    {inputMode === 'text' && !currentPrompt.trim() && (
                                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                                            ⚠️ No text prompt provided
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleGenerate3D}
                                    disabled={
                                        isGenerating3D ||
                                        (inputMode === 'text' && !currentPrompt.trim()) ||
                                        (inputMode === 'images' && approvalSet.length === 0)
                                    }
                                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {isGenerating3D ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating with Meshy...
                                        </div>
                                    ) : (
                                        'Create 3D Model with Meshy'
                                    )}
                                </button>

                                {activeVersion?.type === '3d' && (
                                    <div className="space-y-4">
                                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <div className="text-center text-gray-600">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <i className="ri-3d-view-line text-2xl text-green-600"></i>
                                                </div>
                                                <div className="font-medium">Interactive 3D Model</div>
                                                <div className="text-sm text-gray-500">Orbit • Zoom • Lighting Toggle</div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    Job ID: {activeVersion?.metadata?.meshyJobId}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div><strong>Input type:</strong> {activeVersion.metadata?.inputType}</div>
                                            <div><strong>Source:</strong> {activeVersion.metadata?.inputType === 'text' ? 'Text prompt' : `${activeVersion.metadata?.inputCount} images`}</div>
                                            <div><strong>Style:</strong> {activeVersion.metadata?.style}</div>
                                            <div><strong>Generated:</strong> {activeVersion.timestamp.toLocaleString()}</div>
                                            <div><strong>Parent version:</strong> {activeVersion.parentId}</div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                                                Export STL
                                            </button>
                                            <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
                                                Export GLB
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors whitespace-nowrap">
                                                Order 3D Print
                                            </button>
                                            <button className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors whitespace-nowrap">
                                                Fork to Image Stage
                                            </button>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-gray-700 mb-2">3D Generation History</div>
                                            <div className="space-y-1">
                                                {activeProject.versions.filter(v => v.type === '3d').map(version => (
                                                    <div key={version.id} className="text-xs text-gray-500 flex justify-between">
                                                        <span>{version.name}</span>
                                                        <span>{version.timestamp.toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Compare Modal */}
            {showCompareModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-semibold text-gray-800">Compare Versions</h2>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap">
                                        Side-by-Side
                                    </button>
                                    <button className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors whitespace-nowrap">
                                        Slider Overlay
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowCompareModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Select versions to compare (2-3 max)</div>
                                <div className="flex gap-2 flex-wrap">
                                    {activeProject.versions.map((version) => (
                                        <button
                                            key={version.id}
                                            onClick={() => {
                                                setSelectedVersions(prev => {
                                                    if (prev.includes(version.id)) {
                                                        return prev.filter(id => id !== version.id);
                                                    } else if (prev.length < 3) {
                                                        return [...prev, version.id];
                                                    }
                                                    return prev;
                                                });
                                            }}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                                selectedVersions.includes(version.id)
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {version.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={`grid ${selectedVersions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6`}>
                                {selectedVersions.map((versionId) => {
                                    const version = activeProject.versions.find(v => v.id === versionId)!;
                                    return (
                                        <div key={version.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="font-medium text-gray-800">{version.name}</div>
                                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                    version.type === 'text' ? 'bg-blue-100 text-blue-600' :
                                                        version.type === 'image' ? 'bg-green-100 text-green-600' :
                                                            'bg-purple-100 text-purple-600'
                                                }`}>
                                                    {version.type.toUpperCase()}
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-600 mb-3 space-y-1">
                                                <div><strong>Type:</strong> {version.metadata?.inputType || version.type}</div>
                                                <div><strong>Created:</strong> {version.timestamp.toLocaleDateString()}</div>
                                                {version.parentId && (
                                                    <div><strong>Parent:</strong> {activeProject.versions.find(v => v.id === version.parentId)?.name}</div>
                                                )}
                                            </div>

                                            {version.type === 'text' && version.prompt && (
                                                <div className="text-sm text-gray-700 mb-3 p-2 bg-white rounded border">
                                                    "{version.prompt}"
                                                </div>
                                            )}

                                            {version.images && (
                                                <div className={`grid ${version.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-3`}>
                                                    {version.images.slice(0, 4).map((img, idx) => (
                                                        <img key={idx} src={img} alt="" className="w-full aspect-square object-cover rounded-lg" />
                                                    ))}
                                                </div>
                                            )}

                                            {version.type === '3d' && (
                                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                                                    <div className="text-center text-gray-600">
                                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <i className="ri-3d-view-line text-xl text-green-600"></i>
                                                        </div>
                                                        <div className="text-sm font-medium">3D Model</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-500 mb-3">
                                                <div>Style: {version.metadata?.style || 'N/A'}</div>
                                                <div>Input Count: {version.metadata?.inputCount || 1}</div>
                                                <div>Output: {version.metadata?.outputType || version.type}</div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        handleForkVersion(version.id);
                                                        setShowCompareModal(false);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors whitespace-nowrap"
                                                >
                                                    Fork from this
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleVersionSelect(version.id);
                                                        setShowCompareModal(false);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors whitespace-nowrap"
                                                >
                                                    Set Active
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Edit Modal */}
            {showImageEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Edit Image via Prompt</h2>
                            <button
                                onClick={() => setShowImageEditModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>

                        <div className="p-6">
                            {editingImage && (
                                <div className="mb-4">
                                    <img src={editingImage} alt="" className="w-full aspect-video object-cover rounded-lg" />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your changes</label>
                                <textarea
                                    value={imageEditPrompt}
                                    onChange={(e) => setImageEditPrompt(e.target.value)}
                                    placeholder="Describe how you want to change this image..."
                                    className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="text-sm font-medium text-gray-700">Options</div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">Keep composition</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">Simplify shape</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">Add background</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm text-gray-700">Adjust perspective</span>
                                </label>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                                <div className="text-sm font-medium text-yellow-800 mb-1">Fork Decision</div>
                                <div className="text-sm text-yellow-700 mb-2">Apply change to current version or fork into a new one?</div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-lg text-xs font-medium hover:bg-yellow-300 transition-colors whitespace-nowrap">
                                        Fork into new version
                                    </button>
                                    <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors whitespace-nowrap">
                                        Modify current version
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowImageEditModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApplyImageEdit}
                                    disabled={!imageEditPrompt.trim()}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                                >
                                    Generate New Version
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
