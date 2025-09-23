
'use client';

import { useState } from 'react';

interface CreateZoneProps {
  onBack: () => void;
  playerStats: {
    dreamPoints: number;
    level: number;
    nextLevelPoints: number;
    streakDays: number;
    totalCreations: number;
    badges: number;
  };
  onGoldChange: (newAmount: number) => void;
}

interface CreationMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  category: 'Animals' | 'Fantasy' | 'Robots' | 'Heroes';
  ageGroup: string;
  image: string;
  popularity: number;
}

interface Toy {
  id: string;
  name: string;
  description: string;
  category: 'Cars' | 'Dolls' | 'Animals' | 'Buildings';
  ageGroup: string;
  difficulty: 'Beginner' | 'Builder' | 'Advanced';
  image: string;
}

interface AIOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  cost: number;
  color: string;
}

interface ModelSizeInfo {
  size: 'small' | 'medium' | 'large' | 'extra-large';
  dimensions: string;
  description: string;
  needsAssembly: boolean;
  baseCost: number;
}

interface PaintingOption {
  id: string;
  type: 'marker' | 'brush';
  name: string;
  description: string;
  ageRecommended: number[];
  additionalCost: number;
  icon: string;
}

export default function CreateZone({ onBack, playerStats, onGoldChange }: CreateZoneProps) {
  const [currentStep, setCurrentStep] = useState<'entry' | 'upload-form' | 'upload-options' | 'ai-generator' | 'character-library' | 'toy-library' | 'model-options' | 'confirmation'>('entry');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null);
  const [characterFilter, setCharacterFilter] = useState<string>('all');
  const [toyFilter, setToyFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ai3DModels, setAi3DModels] = useState<string[]>([]);
  const [selected3DModel, setSelected3DModel] = useState<string>('');
  const [selectedModelSize, setSelectedModelSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Upload form states
  const [uploadFormData, setUploadFormData] = useState({
    childName: '',
    childAge: '',
    description: ''
  });

  // Model customization options
  const [modelOptions, setModelOptions] = useState({
    paintingType: '' as 'marker' | 'brush' | '',
    letMeChoose: false
  });

  // Creation methods for Step 1
  const creationMethods: CreationMethod[] = [
    {
      id: 'upload-drawing',
      title: 'Upload Drawing',
      description: 'Transform your artwork into a 3D masterpiece',
      icon: 'ri-image-add-line',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'pick-character',
      title: 'Pick a Character',
      description: 'Choose from our magical character library',
      icon: 'ri-user-heart-line',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'pick-toy',
      title: 'Pick a Toy',
      description: 'Select from pre-designed toy templates',
      icon: 'ri-gift-line',
      color: 'from-green-500 to-teal-500'
    }
  ];

  // AI Generator Options
  const aiOptions: AIOption[] = [
    {
      id: 'remove-background',
      title: 'Remove Background',
      description: 'Clean up your drawing by removing the background',
      icon: 'ri-scissors-cut-line',
      cost: 25,
      color: 'from-green-400 to-blue-400'
    },
    {
      id: 'make-variant',
      title: 'Make Variant',
      description: 'Create variations of your drawing with AI prompts',
      icon: 'ri-palette-line',
      cost: 35,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'convert-3d',
      title: 'Convert to 3D Model',
      description: 'Transform your 2D drawing into a 3D model',
      icon: 'ri-cube-line',
      cost: 50,
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  // Model size information - medium is base cost (50 coins)
  const modelSizes: ModelSizeInfo[] = [
    {
      size: 'small',
      dimensions: '5×5cm',
      description: 'Perfect for quick projects - comes pre-assembled and ready to paint',
      needsAssembly: false,
      baseCost: 30
    },
    {
      size: 'medium',
      dimensions: '10×10cm',
      description: 'Great balance of detail and ease - minimal assembly required',
      needsAssembly: true,
      baseCost: 50
    },
    {
      size: 'large',
      dimensions: '25×25cm',
      description: 'Maximum detail and customization - full assembly experience',
      needsAssembly: true,
      baseCost: 80
    },
    {
      size: 'extra-large',
      dimensions: '50×50cm',
      description: 'Epic scale creation - advanced assembly required for this size',
      needsAssembly: true,
      baseCost: 150
    }
  ];

  // Painting options
  const paintingOptions: PaintingOption[] = [
    {
      id: 'marker',
      type: 'marker',
      name: 'Marker Colors',
      description: 'Easy-to-use washable markers, perfect for younger creators',
      ageRecommended: [3, 4, 5, 6, 7, 8],
      additionalCost: 0,
      icon: 'ri-pencil-line'
    },
    {
      id: 'brush',
      type: 'brush',
      name: 'Brush & Paint',
      description: 'Professional acrylic paints with brushes for detailed artwork',
      ageRecommended: [8, 9, 10, 11, 12, 13, 14, 15],
      additionalCost: 15,
      icon: 'ri-brush-line'
    }
  ];

  // Character library data
  const characters: Character[] = [
    {
      id: 'dragon-flame',
      name: 'Flame the Dragon',
      description: 'A friendly dragon who loves adventures',
      category: 'Fantasy',
      ageGroup: '6-12 years',
      image: 'https://readdy.ai/api/search-image?query=friendly%20cartoon%20dragon%20character%20colorful%20fantasy%20magical%20design%20simple%20background%20children%20toy&width=300&height=300&seq=char1&orientation=squarish',
      popularity: 95
    },
    {
      id: 'unicorn-rainbow',
      name: 'Rainbow Unicorn',
      description: 'Magical unicorn with rainbow mane',
      category: 'Fantasy',
      ageGroup: '4-10 years',
      image: 'https://readdy.ai/api/search-image?query=cute%20rainbow%20unicorn%20character%20magical%20sparkles%20colorful%20mane%20fantasy%20simple%20background%20children%20toy&width=300&height=300&seq=char2&orientation=squarish',
      popularity: 98
    },
    {
      id: 'robot-buddy',
      name: 'Buddy Bot',
      description: 'Friendly robot companion for adventures',
      category: 'Robots',
      ageGroup: '8-14 years',
      image: 'https://readdy.ai/api/search-image?query=friendly%20robot%20character%20cute%20mechanical%20design%20blue%20silver%20colors%20simple%20background%20children%20toy&width=300&height=300&seq=char3&orientation=squarish',
      popularity: 87
    },
    {
      id: 'cat-whiskers',
      name: 'Whiskers the Cat',
      description: 'Playful kitten ready for fun',
      category: 'Animals',
      ageGroup: '3-8 years',
      image: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20cat%20character%20orange%20tabby%20playful%20design%20simple%20background%20children%20toy&width=300&height=300&seq=char4&orientation=squarish',
      popularity: 92
    },
    {
      id: 'hero-captain',
      name: 'Captain Star',
      description: 'Superhero ready to save the day',
      category: 'Heroes',
      ageGroup: '7-13 years',
      image: 'https://readdy.ai/api/search-image?query=superhero%20character%20cape%20star%20emblem%20colorful%20costume%20heroic%20pose%20simple%20background%20children%20toy&width=300&height=300&seq=char5&orientation=squarish',
      popularity: 89
    },
    {
      id: 'bear-honey',
      name: 'Honey Bear',
      description: 'Cuddly bear who loves sweet adventures',
      category: 'Animals',
      ageGroup: '2-7 years',
      image: 'https://readdy.ai/api/search-image?query=cute%20teddy%20bear%20character%20brown%20fur%20honey%20pot%20friendly%20design%20simple%20background%20children%20toy&width=300&height=300&seq=char6&orientation=squarish',
      popularity: 94
    }
  ];

  // Toy library data
  const toys: Toy[] = [
    {
      id: 'race-car',
      name: 'Speed Racer',
      description: 'Fast racing car with custom paint job',
      category: 'Cars',
      ageGroup: '6-12 years',
      difficulty: 'Builder',
      image: 'https://readdy.ai/api/search-image?query=toy%20race%20car%20red%20sporty%20design%20racing%20stripes%20simple%20background%20children%20toy%20model&width=300&height=300&seq=toy1&orientation=squarish'
    },
    {
      id: 'princess-doll',
      name: 'Royal Princess',
      description: 'Beautiful princess with flowing gown',
      category: 'Dolls',
      ageGroup: '4-10 years',
      difficulty: 'Beginner',
      image: 'https://readdy.ai/api/search-image?query=princess%20doll%20character%20beautiful%20dress%20crown%20elegant%20design%20simple%20background%20children%20toy&width=300&height=300&seq=toy2&orientation=squarish'
    },
    {
      id: 'elephant-family',
      name: 'Elephant Family',
      description: 'Mother elephant with baby',
      category: 'Animals',
      ageGroup: '3-9 years',
      difficulty: 'Beginner',
      image: 'https://readdy.ai/api/search-image?query=elephant%20family%20toy%20mother%20baby%20gray%20adorable%20design%20simple%20background%20children%20toy&width=300&height=300&seq=toy3&orientation=squarish'
    },
    {
      id: 'castle-tower',
      name: 'Magic Castle',
      description: 'Medieval castle with towers and flags',
      category: 'Buildings',
      ageGroup: '8-15 years',
      difficulty: 'Advanced',
      image: 'https://readdy.ai/api/search-image?query=toy%20castle%20medieval%20towers%20flags%20fantasy%20building%20model%20kit%20simple%20background%20children%20toy&width=300&height=300&seq=toy4&orientation=squarish'
    },
    {
      id: 'fire-truck',
      name: 'Fire Rescue',
      description: 'Emergency fire truck with ladder',
      category: 'Cars',
      ageGroup: '5-11 years',
      difficulty: 'Builder',
      image: 'https://readdy.ai/api/search-image?query=fire%20truck%20toy%20red%20emergency%20vehicle%20ladder%20rescue%20simple%20background%20children%20toy%20model&width=300&height=300&seq=toy5&orientation=squarish'
    },
    {
      id: 'ballerina-doll',
      name: 'Prima Ballerina',
      description: 'Graceful ballerina in pink tutu',
      category: 'Dolls',
      ageGroup: '4-12 years',
      difficulty: 'Creative',
      image: 'https://readdy.ai/api/search-image?query=ballerina%20doll%20pink%20tutu%20graceful%20pose%20dance%20elegant%20simple%20background%20children%20toy&width=300&height=300&seq=toy6&orientation=squarish'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    if (methodId === 'upload-drawing') {
      setCurrentStep('upload-form');
    } else if (methodId === 'pick-character') {
      setCurrentStep('character-library');
    } else if (methodId === 'pick-toy') {
      setCurrentStep('toy-library');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadFormSubmit = () => {
    if (!uploadFile || !uploadFormData.childName) {
      alert('Please upload an image and fill in the child\'s name');
      return;
    }
    setCurrentStep('upload-options');
  };

  const handleAIOptionSelect = async (optionId: string, cost: number) => {
    if (playerStats.dreamPoints < cost) {
      alert(`Not enough DreamCoins! You need ${cost} coins for this option.`);
      return;
    }

    setIsProcessing(true);
    onGoldChange(playerStats.dreamPoints - cost);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (optionId === 'convert-3d') {
      // Generate 4 different 3D model variations
      const models = [
        'https://readdy.ai/api/search-image?query=3D%20model%20toy%20figure%20colorful%20plastic%20design%20option%20A%20rendered%20view%20simple%20background&width=300&height=300&seq=model1&orientation=squarish',
        'https://readdy.ai/api/search-image?query=3D%20model%20toy%20figure%20bright%20colors%20detailed%20design%20option%20B%20rendered%20view%20simple%20background&width=300&height=300&seq=model2&orientation=squarish',
        'https://readdy.ai/api/search-image?query=3D%20model%20toy%20figure%20vibrant%20design%20option%20C%20rendered%203D%20view%20simple%20background&width=300&height=300&seq=model3&orientation=squarish',
        'https://readdy.ai/api/search-image?query=3D%20model%20toy%20figure%20creative%20design%20option%20D%20rendered%20perspective%20simple%20background&width=300&height=300&seq=model4&orientation=squarish'
      ];
      setAi3DModels(models);
    }

    setIsProcessing(false);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setCurrentStep('model-options');
  };

  const handleToySelect = (toy: Toy) => {
    setSelectedToy(toy);
    setCurrentStep('model-options');
  };

  const handle3DModelSelect = (model: string) => {
    setSelected3DModel(model);
    setCurrentStep('model-options');
  };

  const getRecommendedPaintType = (): 'marker' | 'brush' => {
    const age = parseInt(uploadFormData.childAge) || 8;
    return age <= 8 ? 'marker' : 'brush';
  };

  const calculateTotalCost = (): number => {
    const sizeInfo = modelSizes.find(s => s.size === selectedModelSize);
    const baseCost = sizeInfo?.baseCost || 50;

    let paintCost = 0;
    if (modelOptions.paintingType) {
      const paintOption = paintingOptions.find(p => p.type === modelOptions.paintingType);
      paintCost = paintOption?.additionalCost || 0;
    }

    return baseCost + paintCost;
  };

  const handleStartCreation = async () => {
    const totalCost = calculateTotalCost();

    if (playerStats.dreamPoints < totalCost) {
      alert(`Not enough DreamCoins! You need ${totalCost} coins for this creation.`);
      return;
    }

    setIsProcessing(true);
    onGoldChange(playerStats.dreamPoints - totalCost);

    // Simulate creation start
    await new Promise(resolve => setTimeout(resolve, 2000));

    const creationName = selectedCharacter?.name || selectedToy?.name || `${uploadFormData.childName}'s Custom 3D Model`;
    const sizeInfo = modelSizes.find(s => s.size === selectedModelSize);
    const assemblyText = sizeInfo?.needsAssembly ? 'with assembly' : 'pre-assembled';
    const paintText = modelOptions.paintingType === 'marker' ? 'marker colors' : 'brush & paint';

    alert(` Creation Started!\n${totalCost} DreamCoins used\n\n"${creationName}" (${sizeInfo?.dimensions}, ${assemblyText})\n${paintText}\n\nYour creation will be ready soon!`);

    // Reset state
    setCurrentStep('entry');
    setSelectedMethod('');
    setSelectedCharacter(null);
    setSelectedToy(null);
    setAi3DModels([]);
    setSelected3DModel('');
    setUploadedImage('');
    setUploadFile(null);
    setUploadFormData({ childName: '', childAge: '', description: '' });
    setModelOptions({ paintingType: '', letMeChoose: false });
    setSelectedModelSize('medium');
    setIsProcessing(false);
  };

  const filteredCharacters = characterFilter === 'all'
    ? characters
    : characters.filter(char => char.category === characterFilter);

  const filteredToys = toyFilter === 'all'
    ? toys
    : toys.filter(toy => toy.category === toyFilter);

  const getModelSizeColor = (size: string) => {
    switch (size) {
      case 'small':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'large':
        return 'bg-purple-100 text-purple-800';
      case 'extra-large':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBackStep = () => {
    switch (currentStep) {
      case 'entry':
        return onBack();
      case 'upload-form':
        return setCurrentStep('entry');
      case 'upload-options':
        return setCurrentStep('upload-form');
      case 'ai-generator':
        return setCurrentStep('upload-options');
      case 'character-library':
      case 'toy-library':
        return setCurrentStep('entry');
      case 'model-options':
        if (selectedMethod === 'pick-character') return setCurrentStep('character-library');
        if (selectedMethod === 'pick-toy') return setCurrentStep('toy-library');
        if (ai3DModels.length > 0) return setCurrentStep('ai-generator');
        return setCurrentStep('upload-options');
      case 'confirmation':
        return setCurrentStep('model-options');
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 relative overflow-hidden min-h-screen">
      {/* Back Button */}
      <button
        onClick={getBackStep}
        className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
      </button>

      {/* Current Gold Display */}
      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg z-10">
        <div className="flex items-center space-x-2">
          <i className="ri-coin-line text-orange-500 text-xl"></i>
          <span className="font-bold text-gray-800">{playerStats.dreamPoints.toLocaleString()}</span>
          <span className="text-sm text-gray-600">DreamCoins</span>
        </div>
      </div>

      {/* Step 1: Entry Choice */}
      {currentStep === 'entry' && (
        <div className="pt-16">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <i className="ri-magic-line text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4"> Dreamli Create Zone</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose how you want to start your magical creation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {creationMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1 group"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:animate-bounce`}>
                  <i className={`${method.icon} text-white text-3xl`}></i>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{method.title}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Upload Form */}
      {currentStep === 'upload-form' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Drawing</h1>
            <p className="text-xl text-gray-600">Share your artwork with us to create magic</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Drawing *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="drawing-upload"
                  />
                  <label htmlFor="drawing-upload" className="cursor-pointer">
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage}
                          alt="Uploaded drawing"
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <p className="text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <i className="ri-upload-cloud-2-line text-2xl text-purple-500"></i>
                        </div>
                        <div>
                          <p className="text-gray-600 font-medium">Click to upload your drawing</p>
                          <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Child Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child's Name *
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.childName}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, childName: e.target.value })}
                    placeholder="e.g., Emma"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (optional)
                  </label>
                  <input
                    type="number"
                    value={uploadFormData.childAge}
                    onChange={(e) => setUploadFormData({ ...uploadFormData, childAge: e.target.value })}
                    placeholder="Age"
                    min="3"
                    max="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  placeholder="Tell us about this drawing..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
                />
              </div>

              <button
                onClick={handleUploadFormSubmit}
                disabled={!uploadFile || !uploadFormData.childName}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2A: Upload Drawing Options */}
      {currentStep === 'upload-options' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Path</h1>
            <p className="text-xl text-gray-600">How would you like to transform your drawing?</p>

            {uploadedImage && (
              <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
                <img src={uploadedImage} alt="Your drawing" className="w-full h-32 object-cover rounded-xl" />
                <p className="text-sm text-gray-600 mt-2">{uploadFormData.childName}'s Drawing</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              onClick={() => setCurrentStep('ai-generator')}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-magic-line text-white text-3xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">AI Generator</h3>
              <p className="text-gray-600 mb-6 text-center">Uses DreamCoins each time - fun like a slot machine!</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Multiple AI processing options</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Generate 4 different 3D models</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-coin-line text-orange-500"></i>
                  <span>Various coin costs per option</span>
                </div>
              </div>

              <div className="text-center">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold">
                  Explore AI Options
                </span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-user-heart-line text-white text-3xl"></i>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">Human Designer</h3>
              <p className="text-gray-600 mb-6 text-center">VIP quest - limited but higher quality!</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-check-line text-green-500"></i>
                  <span>Professional Dreamli team</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-check-line text-green-500"></i>
                  <span>3 iterations with feedback</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="ri-crown-line text-purple-500"></i>
                  <span>Premium quality design</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(' VIP Designer Request Submitted!\nOur Dreamli design team will create 3 amazing iterations based on your drawing. Check back in 24-48 hours!');
                  setCurrentStep('model-options');
                  setSelectedModelSize('medium');
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-2xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer whitespace-nowrap"
              >
                Request Human Design
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Options Page */}
      {currentStep === 'ai-generator' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4"> AI Processing Options</h1>
            <p className="text-xl text-gray-600">Choose how AI should transform your drawing</p>

            {uploadedImage && (
              <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
                <img src={uploadedImage} alt="Your drawing" className="w-full h-32 object-cover rounded-xl" />
                <p className="text-sm text-gray-600 mt-2">{uploadFormData.childName}'s Drawing</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {aiOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleAIOptionSelect(option.id, option.cost)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${option.icon} text-white text-2xl`}></i>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">{option.description}</p>

                <div className={`flex items-center justify-center space-x-2 font-bold text-lg ${playerStats.dreamPoints >= option.cost ? 'text-orange-600' : 'text-red-500'}`}>
                  <i className="ri-coin-line"></i>
                  <span>{option.cost} coins</span>
                </div>

                {playerStats.dreamPoints < option.cost && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-xl text-center">
                    <span className="text-red-600 text-xs font-medium">Insufficient coins</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                <i className="ri-loader-4-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AI is Working Magic...</h3>
              <p className="text-gray-600">Processing your drawing into amazing 3D models</p>
            </div>
          )}

          {/* AI 3D Model Results */}
          {ai3DModels.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-white/50 max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center"> Your 3D Models Are Ready!</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {ai3DModels.map((model, index) => (
                  <div
                    key={index}
                    onClick={() => handle3DModelSelect(model)}
                    className={`cursor-pointer rounded-2xl p-4 border-4 transition-all ${selected3DModel === model ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={model} alt={`3D Model ${index + 1}`} className="w-full h-40 object-cover rounded-xl" />
                    <div className="text-center mt-3">
                      <p className="font-medium text-gray-800">Model {index + 1}</p>
                      <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-1">
                        <i className="ri-cube-line"></i>
                        <span>3D Rendered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handleAIOptionSelect('convert-3d', 50)}
                  disabled={isProcessing || playerStats.dreamPoints < 50}
                  className="flex-1 bg-yellow-500 text-white py-3 rounded-2xl font-bold hover:bg-yellow-600 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate More (50 coins)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2B: Character Library */}
      {currentStep === 'character-library' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Character Library</h1>
            <p className="text-xl text-gray-600">Choose your magical companion</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              {['all', 'Animals', 'Fantasy', 'Robots', 'Heroes'].map((category) => (
                <button
                  key={category}
                  onClick={() => setCharacterFilter(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer capitalize ${characterFilter === category ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'text-gray-700 hover:bg-white/50'}`}
                >
                  {category === 'all' ? 'All Characters' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredCharacters.map((character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative mb-4">
                  <img src={character.image} alt={character.name} className="w-full h-48 object-cover rounded-2xl" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="flex items-center space-x-1">
                      <i className="ri-heart-fill text-red-500 text-sm"></i>
                      <span className="text-xs font-bold">{character.popularity}%</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{character.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{character.description}</p>

                <div className="flex justify-between items-center">
                  <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                    {character.category}
                  </div>
                  <div className="text-xs text-gray-500">{character.ageGroup}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2C: Toy Library */}
      {currentStep === 'toy-library' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Toy Templates</h1>
            <p className="text-xl text-gray-600">Select your perfect toy design</p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              {['all', 'Cars', 'Dolls', 'Animals', 'Buildings'].map((category) => (
                <button
                  key={category}
                  onClick={() => setToyFilter(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer capitalize ${toyFilter === category ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg' : 'text-gray-700 hover:bg-white/50'}`}
                >
                  {category === 'all' ? 'All Toys' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredToys.map((toy) => (
              <div
                key={toy.id}
                onClick={() => handleToySelect(toy)}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="relative mb-4">
                  <img src={toy.image} alt={toy.name} className="w-full h-48 object-cover rounded-2xl" />
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${getModelSizeColor(toy.modelSize)}`}>
                    {toy.modelSize}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                    {toy.difficulty}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{toy.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{toy.description}</p>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">{toy.ageGroup}</div>
                  <div className="text-xs text-purple-600 font-medium">{toy.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step: Model Options */}
      {currentStep === 'model-options' && (
        <div className="pt-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Customize Your Creation</h1>
            <p className="text-xl text-gray-600">Choose size and painting preferences</p>

            {(selectedCharacter || selectedToy || selected3DModel) && (
              <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
                {selected3DModel && (
                  <img src={selected3DModel} alt="Selected 3D model" className="w-full h-32 object-cover rounded-xl mb-2" />
                )}
                <p className="text-lg font-medium text-gray-800">
                  Creating: <span className="text-purple-600">{selectedCharacter?.name || selectedToy?.name || `${uploadFormData.childName}'s Custom 3D Model`}</span>
                </p>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Model Size Selection */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Choose Model Size</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modelSizes.map((sizeInfo) => (
                  <div
                    key={sizeInfo.size}
                    onClick={() => setSelectedModelSize(sizeInfo.size)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedModelSize === sizeInfo.size ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getModelSizeColor(sizeInfo.size).replace('text-', 'text-white ').replace('bg-', 'bg-gradient-to-r from-').replace('-100', '-400 to-').replace('-800', '-600')}`}
                    >
                      <i className="ri-cube-line text-xl text-white"></i>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mb-2 ${getModelSizeColor(sizeInfo.size)}`}>
                      {sizeInfo.dimensions}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 capitalize">{sizeInfo.size.replace('-', ' ')}</h4>
                    <p className="text-gray-600 text-sm mb-4">{sizeInfo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${sizeInfo.size === 'medium' ? 'text-blue-600' : 'text-orange-600'}`}>
                        {sizeInfo.baseCost} coins {sizeInfo.size === 'medium' && '(Base)'}
                      </span>
                      {sizeInfo.needsAssembly && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <i className="ri-tools-line"></i>
                          <span>Assembly</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {selectedModelSize === 'extra-large' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-red-600 text-lg mt-0.5"></i>
                    <div className="text-sm text-red-800">
                      <p className="font-medium mb-1">Extra Large Size Notice:</p>
                      <p>This epic 50×50cm size requires advanced assembly skills and comes with detailed instructions. Perfect for experienced builders!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current Model Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Model Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-medium text-gray-700">Size:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold capitalize ${getModelSizeColor(selectedModelSize)}`}>
                        {selectedModelSize.replace('-', ' ')}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {modelSizes.find(s => s.size === selectedModelSize)?.dimensions}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-medium text-gray-700">Assembly:</span>
                    <span className="text-gray-600">
                      {modelSizes.find(s => s.size === selectedModelSize)?.needsAssembly ? 'Required' : 'Pre-assembled'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="font-medium text-gray-700">Base Cost:</span>
                    <span className="font-bold text-orange-600">
                      {modelSizes.find(s => s.size === selectedModelSize)?.baseCost} coins
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Painting Options */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Painting Options</h3>

              {/* Let Me Choose Option */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modelOptions.letMeChoose}
                    onChange={(e) => setModelOptions({ ...modelOptions, letMeChoose: e.target.checked, paintingType: e.target.checked ? modelOptions.paintingType : '' })}
                    className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="font-medium text-gray-800">I want to choose my painting type</span>
                </label>
              </div>

              {!modelOptions.letMeChoose ? (
                /* Age-based recommendation */
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <i className="ri-lightbulb-line text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Age-Based Recommendation</h4>
                      <p className="text-gray-700 mb-4">
                        {uploadFormData.childAge ? `Based on age ${uploadFormData.childAge}, we recommend` : 'We recommend'} <strong>{getRecommendedPaintType() === 'marker' ? 'Marker Colors' : 'Brush & Paint'}</strong>
                      </p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <i className={`${getRecommendedPaintType() === 'marker' ? 'ri-pencil-line' : 'ri-brush-line'} text-lg text-gray-600`}></i>
                          <span className="font-medium">
                            {paintingOptions.find(p => p.type === getRecommendedPaintType())?.name}
                          </span>
                        </div>
                        <div className="text-orange-600 font-bold">
                          +{paintingOptions.find(p => p.type === getRecommendedPaintType())?.additionalCost} coins
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Manual selection */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paintingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setModelOptions({ ...modelOptions, paintingType: option.type })}
                      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${modelOptions.paintingType === option.type ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                          <i className={`${option.icon} text-xl text-gray-600`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{option.name}</h4>
                          <div className="text-orange-600 font-bold">+{option.additionalCost} coins</div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{option.description}</p>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Recommended for ages:</span>
                        <div className="flex space-x-1">
                          {option.ageRecommended.slice(0, 3).map(age => (
                            <span key={age} className="text-xs bg-gray-100 px-2 py-1 rounded">{age}</span>
                          ))}
                          {option.ageRecommended.length > 3 && (
                            <span className="text-xs text-gray-500">+{option.ageRecommended.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Cost & Continue */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Total Cost</h3>
                <div className="text-3xl font-bold text-orange-600">
                  {calculateTotalCost()} coins
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Base cost ({selectedModelSize} - {modelSizes.find(s => s.size === selectedModelSize)?.dimensions}):</span>
                  <span>{modelSizes.find(s => s.size === selectedModelSize)?.baseCost} coins</span>
                </div>
                {(modelOptions.letMeChoose ? modelOptions.paintingType : getRecommendedPaintType()) && (
                  <div className="flex justify-between">
                    <span>Painting ({modelOptions.letMeChoose ? modelOptions.paintingType : getRecommendedPaintType()}):</span>
                    <span>+{paintingOptions.find(p => p.type === (modelOptions.letMeChoose ? modelOptions.paintingType : getRecommendedPaintType()))?.additionalCost} coins</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleStartCreation}
                disabled={isProcessing || playerStats.dreamPoints < calculateTotalCost() || (modelOptions.letMeChoose && !modelOptions.paintingType)}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-2xl font-bold hover:from-green-600 hover:to-teal-600 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    <span>Starting...</span>
                  </div>
                ) : playerStats.dreamPoints < calculateTotalCost() ? (
                  'Not Enough DreamCoins'
                ) : (modelOptions.letMeChoose && !modelOptions.paintingType) ? (
                  'Choose Painting Type'
                ) : (
                  ' Start My Creation!'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-10 w-8 h-8 bg-blue-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>
    </div>
  );
}
