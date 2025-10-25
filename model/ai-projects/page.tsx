
'use client';

import { useState } from 'react';
import { Plus, MessageSquare, Upload, Cpu, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data for user projects
const mockUserProjects = [
  {
    id: 1,
    name: "Dragon Figurine",
    description: "A detailed fantasy dragon model for tabletop gaming",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    chatCount: 12,
    uploadedFiles: 8,
    generatedFiles: 3
  },
  {
    id: 2,
    name: "Custom Phone Case",
    description: "Personalized phone case with geometric patterns",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-22",
    chatCount: 6,
    uploadedFiles: 4,
    generatedFiles: 1
  },
  {
    id: 3,
    name: "Architectural Model",
    description: "",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    chatCount: 2,
    uploadedFiles: 0,
    generatedFiles: 0
  },
  {
    id: 4,
    name: "Jewelry Design",
    description: "Modern minimalist ring design",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-23",
    chatCount: 15,
    uploadedFiles: 12,
    generatedFiles: 5
  }
];

// Mock data for community projects (reusing marketplace data)
const mockCommunityProjects = [
  {
    id: 9,
    name: "Cyberpunk Helmet",
    creator: "Alex Chen",
    avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20young%20asian%20designer%20with%20modern%20studio%20background%20clean%20lighting%20minimalist%20aesthetic&width=40&height=40&seq=avatar9&orientation=squarish",
    image: "https://readdy.ai/api/search-image?query=futuristic%20cyberpunk%20helmet%20design%20with%20neon%20accents%20sleek%20metallic%20surface%20glowing%20visor%20high%20tech%20aesthetic%20clean%20white%20background&width=300&height=200&seq=helmet9&orientation=landscape",
    likes: 234,
    comments: 45,
    views: 1200,
    isLiked: false
  },
  {
    id: 10,
    name: "Organic Vase",
    creator: "Maria Santos",
    avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20latina%20artist%20with%20creative%20studio%20background%20warm%20lighting%20artistic%20aesthetic&width=40&height=40&seq=avatar10&orientation=squarish",
    image: "https://readdy.ai/api/search-image?query=elegant%20organic%20ceramic%20vase%20with%20flowing%20curves%20natural%20textures%20earth%20tones%20minimalist%20design%20clean%20white%20background&width=300&height=200&seq=vase10&orientation=landscape",
    likes: 189,
    comments: 32,
    views: 890,
    isLiked: true
  },
  {
    id: 11,
    name: "Steampunk Gear",
    creator: "David Wilson",
    avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20bearded%20engineer%20with%20workshop%20background%20industrial%20lighting%20maker%20aesthetic&width=40&height=40&seq=avatar11&orientation=squarish",
    image: "https://readdy.ai/api/search-image?query=intricate%20steampunk%20mechanical%20gear%20with%20brass%20details%20vintage%20industrial%20design%20copper%20accents%20clean%20white%20background&width=300&height=200&seq=gear11&orientation=landscape",
    likes: 156,
    comments: 28,
    views: 720,
    isLiked: false
  },
  {
    id: 12,
    name: "Abstract Sculpture",
    creator: "Emma Taylor",
    avatar: "https://readdy.ai/api/search-image?query=professional%20portrait%20of%20contemporary%20artist%20with%20gallery%20background%20soft%20lighting%20creative%20aesthetic&width=40&height=40&seq=avatar12&orientation=squarish",
    image: "https://readdy.ai/api/search-image?query=modern%20abstract%20sculpture%20with%20geometric%20forms%20smooth%20surfaces%20contemporary%20art%20piece%20neutral%20colors%20clean%20white%20background&width=300&height=200&seq=sculpture12&orientation=landscape",
    likes: 203,
    comments: 38,
    views: 950,
    isLiked: true
  }
];

export default function AIProjectsPage() {
  const [userProjects, setUserProjects] = useState(mockUserProjects);
  const [communityProjects, setCommunityProjects] = useState(mockCommunityProjects);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    setIsCreating(true);
    
    // Simulate project creation
    setTimeout(() => {
      const newProject = {
        id: userProjects.length + 1,
        name: newProjectName,
        description: newProjectDescription,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        chatCount: 0,
        uploadedFiles: 0,
        generatedFiles: 0
      };
      
      setUserProjects([newProject, ...userProjects]);
      setNewProjectName('');
      setNewProjectDescription('');
      setIsCreating(false);
    }, 1500);
  };

  const toggleLike = (projectId: number) => {
    setCommunityProjects(projects =>
      projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              isLiked: !project.isLiked,
              likes: project.isLiked ? project.likes - 1 : project.likes + 1
            }
          : project
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Project Studio</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create, collaborate, and bring your ideas to life with AI-powered 3D generation. 
              Start a new project or continue working on your existing creations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Creation Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
          
          <form onSubmit={handleCreateProject} className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter your project name..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="projectDescription"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                placeholder="Describe your project idea..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{newProjectDescription.length}/500 characters</p>
            </div>
            
            <button
              type="submit"
              disabled={!newProjectName.trim() || isCreating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </button>
          </form>
        </div>

        {/* Your Projects Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Projects</h2>
            <span className="text-sm text-gray-500">{userProjects.length} projects</span>
          </div>
          
          {userProjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500">Create your first AI project to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                  
                  {/* Project Metrics */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{project.chatCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Upload className="w-4 h-4" />
                      <span>{project.uploadedFiles}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" />
                      <span>{project.generatedFiles}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Created {project.createdAt}</span>
                    <span>Updated {project.updatedAt}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Community Highlights Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Highlights</h2>
              <p className="text-gray-600">Discover amazing projects created by our community</p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              Explore All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/marketplace/${project.id}`} className="block">
                  <div className="aspect-[3/2] bg-gray-100 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/marketplace/${project.id}`} className="block mb-3">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={project.avatar}
                      alt={project.creator}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">{project.creator}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleLike(project.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          project.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>{project.likes}</span>
                      </button>
                      
                      <Link
                        href={`/marketplace/${project.id}`}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{project.comments}</span>
                      </Link>
                    </div>
                    
                    <span className="text-xs text-gray-400">{project.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
