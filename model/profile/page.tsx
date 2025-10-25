
'use client';

import { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import CreditOverview from './CreditOverview';
import TransactionHistory from './TransactionHistory';
import UserProjects from './UserProjects';
import EditProfileModal from './EditProfileModal';

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState({
    id: '1',
    username: 'Alex Chen',
    email: 'alex.chen@example.com',
    bio: 'Passionate 3D designer and AI enthusiast. Love creating innovative models and exploring the intersection of technology and art. Always excited to collaborate on creative projects!',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20creative%20designer%20with%20modern%20style%2C%20clean%20background%2C%20friendly%20expression%2C%20high%20quality%20portrait%20photography&width=200&height=200&seq=profile1&orientation=squarish',
    joinDate: '2023-08-15',
    totalProjects: 24,
    totalLikes: 1847,
    totalViews: 12543
  });

  const credits = {
    current: 2450,
    earned: 8920,
    spent: 6470,
    pending: 340
  };

  const transactions = [
    {
      id: '1',
      type: 'earned' as const,
      amount: 150,
      description: 'Model sale commission',
      date: '2024-01-15T10:30:00Z',
      status: 'completed' as const,
      projectId: '12',
      projectName: 'Futuristic Robot Arm'
    },
    {
      id: '2',
      type: 'spent' as const,
      amount: 50,
      description: 'AI generation credits',
      date: '2024-01-14T15:45:00Z',
      status: 'completed' as const,
      projectId: '15',
      projectName: 'Space Station Module'
    },
    {
      id: '3',
      type: 'earned' as const,
      amount: 200,
      description: 'Model sale commission',
      date: '2024-01-13T09:20:00Z',
      status: 'completed' as const,
      projectId: '8',
      projectName: 'Vintage Car Collection'
    },
    {
      id: '4',
      type: 'spent' as const,
      amount: 75,
      description: 'Premium features unlock',
      date: '2024-01-12T14:15:00Z',
      status: 'completed' as const
    },
    {
      id: '5',
      type: 'earned' as const,
      amount: 120,
      description: 'Model sale commission',
      date: '2024-01-11T11:30:00Z',
      status: 'pending' as const,
      projectId: '18',
      projectName: 'Modern Architecture Set'
    },
    {
      id: '6',
      type: 'refund' as const,
      amount: 25,
      description: 'Failed generation refund',
      date: '2024-01-10T16:45:00Z',
      status: 'completed' as const
    }
  ];

  const projects = [
    {
      id: '12',
      name: 'Futuristic Robot Arm',
      thumbnail: 'https://readdy.ai/api/search-image?query=futuristic%20robotic%20arm%203D%20model%20render%2C%20metallic%20silver%20finish%2C%20clean%20white%20background%2C%20professional%20product%20photography%2C%20high%20detail%20mechanical%20joints&width=400&height=300&seq=project12&orientation=landscape',
      likes: 234,
      views: 1847,
      comments: 45,
      createdAt: '2024-01-10T10:30:00Z',
      isPublic: true
    },
    {
      id: '15',
      name: 'Space Station Module',
      thumbnail: 'https://readdy.ai/api/search-image?query=space%20station%20module%203D%20model%2C%20sci-fi%20design%20with%20solar%20panels%2C%20white%20and%20blue%20color%20scheme%2C%20floating%20in%20space%20background&width=400&height=300&seq=project15&orientation=landscape',
      likes: 189,
      views: 1234,
      comments: 32,
      createdAt: '2024-01-08T14:20:00Z',
      isPublic: true
    },
    {
      id: '8',
      name: 'Vintage Car Collection',
      thumbnail: 'https://readdy.ai/api/search-image?query=vintage%20classic%20car%203D%20model%20collection%2C%20red%20and%20chrome%20finish%2C%20garage%20setting%20background%2C%20nostalgic%20automotive%20design&width=400&height=300&seq=project8&orientation=landscape',
      likes: 456,
      views: 3421,
      comments: 78,
      createdAt: '2024-01-05T09:15:00Z',
      isPublic: true
    },
    {
      id: '18',
      name: 'Modern Architecture Set',
      thumbnail: 'https://readdy.ai/api/search-image?query=modern%20architectural%20building%203D%20model%2C%20minimalist%20design%20with%20glass%20and%20concrete%2C%20urban%20setting%20background%2C%20contemporary%20style&width=400&height=300&seq=project18&orientation=landscape',
      likes: 167,
      views: 987,
      comments: 23,
      createdAt: '2024-01-03T16:45:00Z',
      isPublic: false
    },
    {
      id: '21',
      name: 'Fantasy Weapon Set',
      thumbnail: 'https://readdy.ai/api/search-image?query=fantasy%20medieval%20weapon%20set%203D%20models%2C%20magical%20sword%20and%20shield%2C%20mystical%20blue%20glow%20effects%2C%20dark%20fantasy%20background&width=400&height=300&seq=project21&orientation=landscape',
      likes: 298,
      views: 2156,
      comments: 56,
      createdAt: '2024-01-01T12:00:00Z',
      isPublic: true
    },
    {
      id: '24',
      name: 'Organic Furniture Design',
      thumbnail: 'https://readdy.ai/api/search-image?query=organic%20curved%20furniture%203D%20model%2C%20natural%20wood%20texture%2C%20flowing%20design%2C%20modern%20interior%20background%2C%20sustainable%20design&width=400&height=300&seq=project24&orientation=landscape',
      likes: 134,
      views: 756,
      comments: 19,
      createdAt: '2023-12-28T08:30:00Z',
      isPublic: true
    }
  ];

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (data: { username: string; bio: string; avatar: string }) => {
    setUser(prev => ({
      ...prev,
      username: data.username,
      bio: data.bio,
      avatar: data.avatar
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader 
          user={user}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
        />

        <CreditOverview credits={credits} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TransactionHistory transactions={transactions} />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-add-line text-blue-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Create New Project</div>
                  <div className="text-sm text-gray-600">Start a new AI-generated 3D model</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-upload-line text-green-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Upload Model</div>
                  <div className="text-sm text-gray-600">Share your own 3D creations</div>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-store-line text-purple-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Browse Marketplace</div>
                  <div className="text-sm text-gray-600">Discover amazing community projects</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <UserProjects projects={projects} isOwnProfile={true} />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}
