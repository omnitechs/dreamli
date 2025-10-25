'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, TrendingUp, Clock } from 'lucide-react';

type Project = {
  id: string;
  name: string;
  thumbnail: string;
  likes: number;
  comments: number;
  creator: string;
  createdAt: string;
  isLiked: boolean;
};

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Futuristic Spaceship',
    thumbnail: 'https://readdy.ai/api/search-image?query=detailed%20futuristic%20spaceship%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace1&orientation=squarish',
    likes: 342,
    comments: 28,
    creator: 'Alex Chen',
    createdAt: '2024-01-15',
    isLiked: false
  },
  {
    id: '2',
    name: 'Medieval Castle',
    thumbnail: 'https://readdy.ai/api/search-image?query=detailed%20medieval%20castle%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace2&orientation=squarish',
    likes: 289,
    comments: 45,
    creator: 'Sarah Miller',
    createdAt: '2024-01-14',
    isLiked: true
  },
  {
    id: '3',
    name: 'Modern Chair Design',
    thumbnail: 'https://readdy.ai/api/search-image?query=modern%20minimalist%20chair%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace3&orientation=squarish',
    likes: 456,
    comments: 67,
    creator: 'David Park',
    createdAt: '2024-01-13',
    isLiked: false
  },
  {
    id: '4',
    name: 'Cyberpunk Vehicle',
    thumbnail: 'https://readdy.ai/api/search-image?query=cyberpunk%20futuristic%20vehicle%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace4&orientation=squarish',
    likes: 523,
    comments: 89,
    creator: 'Emma Wilson',
    createdAt: '2024-01-12',
    isLiked: true
  },
  {
    id: '5',
    name: 'Fantasy Sword',
    thumbnail: 'https://readdy.ai/api/search-image?query=fantasy%20magical%20sword%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace5&orientation=squarish',
    likes: 198,
    comments: 34,
    creator: 'Michael Brown',
    createdAt: '2024-01-11',
    isLiked: false
  },
  {
    id: '6',
    name: 'Organic Sculpture',
    thumbnail: 'https://readdy.ai/api/search-image?query=organic%20abstract%20sculpture%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace6&orientation=squarish',
    likes: 412,
    comments: 56,
    creator: 'Lisa Anderson',
    createdAt: '2024-01-10',
    isLiked: false
  },
  {
    id: '7',
    name: 'Robot Character',
    thumbnail: 'https://readdy.ai/api/search-image?query=cute%20robot%20character%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace7&orientation=squarish',
    likes: 678,
    comments: 123,
    creator: 'James Taylor',
    createdAt: '2024-01-09',
    isLiked: true
  },
  {
    id: '8',
    name: 'Architectural Model',
    thumbnail: 'https://readdy.ai/api/search-image?query=modern%20architectural%20building%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace8&orientation=squarish',
    likes: 234,
    comments: 41,
    creator: 'Sophia Lee',
    createdAt: '2024-01-08',
    isLiked: false
  },
  {
    id: '9',
    name: 'Dragon Figurine',
    thumbnail: 'https://readdy.ai/api/search-image?query=detailed%20dragon%20figurine%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace9&orientation=squarish',
    likes: 891,
    comments: 156,
    creator: 'Ryan Martinez',
    createdAt: '2024-01-07',
    isLiked: true
  },
  {
    id: '10',
    name: 'Vintage Camera',
    thumbnail: 'https://readdy.ai/api/search-image?query=vintage%20retro%20camera%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace10&orientation=squarish',
    likes: 367,
    comments: 72,
    creator: 'Olivia Garcia',
    createdAt: '2024-01-06',
    isLiked: false
  },
  {
    id: '11',
    name: 'Sci-Fi Helmet',
    thumbnail: 'https://readdy.ai/api/search-image?query=science%20fiction%20helmet%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace11&orientation=squarish',
    likes: 445,
    comments: 63,
    creator: 'Daniel Kim',
    createdAt: '2024-01-05',
    isLiked: false
  },
  {
    id: '12',
    name: 'Nature Tree',
    thumbnail: 'https://readdy.ai/api/search-image?query=detailed%20nature%20tree%203d%20model%20render%20on%20clean%20white%20background%20professional%20studio%20lighting%20high%20quality%20product%20photography%20style%20centered%20composition&width=400&height=400&seq=marketplace12&orientation=squarish',
    likes: 312,
    comments: 48,
    creator: 'Isabella White',
    createdAt: '2024-01-04',
    isLiked: true
  }
];

export default function MarketplacePage() {
  const [projects, setProjects] = useState(mockProjects);
  const [sortBy, setSortBy] = useState<'likes' | 'comments' | 'recent'>('likes');

  const handleLike = (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'likes') return b.likes - a.likes;
    if (sortBy === 'comments') return b.comments - a.comments;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">3D Model Marketplace</h1>
          <p className="text-lg text-gray-600">Discover amazing 3D models created by our community</p>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('likes')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sortBy === 'likes'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              Most Liked
            </button>
            <button
              onClick={() => setSortBy('comments')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sortBy === 'comments'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              Most Discussed
            </button>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                sortBy === 'recent'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              Most Recent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/marketplace/${project.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                    {project.creator.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600">{project.creator}</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleLike(project.id, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                      project.isLiked
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-sm font-medium">{project.likes}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/marketplace/${project.id}`;
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all whitespace-nowrap"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{project.comments}</span>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
