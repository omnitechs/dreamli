
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalMemories: number;
  isActive: boolean;
}

interface Memory {
  id: string;
  productName: string;
  childName: string;
  userId?: string;
  userName?: string;
  createdDate: string;
  accessToken: string;
  isPublic: boolean;
  totalMemories: number;
  lastUpdated: string;
  coverImage: string;
  timeCapsuleCode?: string;
  timeCapsuleDate?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'memories' | 'users' | 'timecapsules' | 'calendar'>('overview');
  const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);
  const [showCreateCodeModal, setShowCreateCodeModal] = useState(false);
  const [selectedMemoryForCode, setSelectedMemoryForCode] = useState<Memory | null>(null);

  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-001',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      createdAt: '2024-06-15',
      totalMemories: 2,
      isActive: true
    },
    {
      id: 'user-002',
      name: 'Mike Anderson',
      email: 'mike@example.com',
      createdAt: '2024-07-10',
      totalMemories: 1,
      isActive: true
    },
    {
      id: 'user-003',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      createdAt: '2024-05-20',
      totalMemories: 3,
      isActive: false
    }
  ]);

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 'mem-001',
      productName: 'Magical Unicorn',
      childName: 'Adam',
      userId: 'user-001',
      userName: 'Sarah Johnson',
      createdDate: '2024-06-15',
      accessToken: 'ADAM-UNICORN-2024',
      isPublic: false,
      totalMemories: 12,
      lastUpdated: '2 days ago',
      coverImage: 'https://readdy.ai/api/search-image?query=cute%20magical%20unicorn%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20pastel%20colors%2C%20dreamy%20atmosphere&width=400&height=300&seq=admin1&orientation=landscape',
      timeCapsuleCode: 'TC-ADAM-2024',
      timeCapsuleDate: '2025-06-15'
    },
    {
      id: 'mem-002',
      productName: 'Brave Dragon',
      childName: 'Emma',
      userId: 'user-002',
      userName: 'Mike Anderson',
      createdDate: '2024-07-10',
      accessToken: 'EMMA-DRAGON-2024',
      isPublic: true,
      totalMemories: 8,
      lastUpdated: '5 days ago',
      coverImage: 'https://readdy.ai/api/search-image?query=friendly%20cute%20dragon%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20green%20and%20blue%20colors%2C%20magical%20atmosphere&width=400&height=300&seq=admin2&orientation=landscape'
    },
    {
      id: 'mem-003',
      productName: 'Wise Owl',
      childName: 'Lucas',
      createdDate: '2024-05-25',
      accessToken: 'LUCAS-OWL-2024',
      isPublic: false,
      totalMemories: 15,
      lastUpdated: '1 week ago',
      coverImage: 'https://readdy.ai/api/search-image?query=adorable%20wise%20owl%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20warm%20brown%20and%20orange%20colors%2C%20cozy%20atmosphere&width=400&height=300&seq=admin3&orientation=landscape'
    }
  ]);

  const [newMemory, setNewMemory] = useState({
    productName: '',
    childName: '',
    userId: '',
    isPublic: true
  });

  const [newTimeCapsuleCode, setNewTimeCapsuleCode] = useState({
    code: '',
    returnDate: ''
  });

  const generateRandomToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [];
    for (let i = 0; i < 3; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    return segments.join('-');
  };

  const generateTimeCapsuleCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TC-';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateMemory = () => {
    if (!newMemory.productName.trim() || !newMemory.childName.trim()) return;

    const selectedUser = users.find(u => u.id === newMemory.userId);
    const memory: Memory = {
      id: `mem-${Date.now()}`,
      productName: newMemory.productName,
      childName: newMemory.childName,
      userId: newMemory.userId || undefined,
      userName: selectedUser?.name,
      createdDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      accessToken: generateRandomToken(),
      isPublic: newMemory.isPublic,
      totalMemories: 0,
      lastUpdated: 'Just created',
      coverImage: 'https://readdy.ai/api/search-image?query=cute%20magical%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20pastel%20colors%2C%20dreamy%20atmosphere%2C%20high%20quality&width=400&height=300&seq=' + Date.now() + '&orientation=landscape'
    };

    setMemories([...memories, memory]);
    setNewMemory({ productName: '', childName: '', userId: '', isPublic: true });
    setShowCreateMemoryModal(false);

    // Update user's memory count if assigned to a user
    if (newMemory.userId) {
      setUsers(users.map(user =>
        user.id === newMemory.userId
          ? { ...user, totalMemories: user.totalMemories + 1 }
          : user
      ));
    }
  };

  const handleCreateTimeCapsuleCode = () => {
    if (!selectedMemoryForCode || !newTimeCapsuleCode.returnDate) return;

    const code = newTimeCapsuleCode.code.trim() || generateTimeCapsuleCode();

    setMemories(memories.map(memory =>
      memory.id === selectedMemoryForCode.id
        ? {
          ...memory,
          timeCapsuleCode: code,
          timeCapsuleDate: newTimeCapsuleCode.returnDate
        }
        : memory
    ));

    setNewTimeCapsuleCode({ code: '', returnDate: '' });
    setSelectedMemoryForCode(null);
    setShowCreateCodeModal(false);
  };

  const openCreateCodeModal = (memory: Memory) => {
    setSelectedMemoryForCode(memory);
    setNewTimeCapsuleCode({
      code: memory.timeCapsuleCode || '',
      returnDate: memory.timeCapsuleDate || ''
    });
    setShowCreateCodeModal(true);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const deleteMemory = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    setMemories(memories.filter(m => m.id !== memoryId));

    // Update user's memory count
    if (memory?.userId) {
      setUsers(users.map(user =>
        user.id === memory.userId
          ? { ...user, totalMemories: Math.max(0, user.totalMemories - 1) }
          : user
      ));
    }
  };

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 30);
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);

  const totalStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalMemories: memories.length,
    totalTimeCapsules: memories.filter(m => m.timeCapsuleCode).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, memories, and time capsules</p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-home-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Home</span>
              </Link>

              <button
                onClick={() => setShowCreateMemoryModal(true)}
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-add-line text-lg"></i>
                  <span>Create Memory</span>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50 inline-flex">
              {[
                { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line' },
                { id: 'memories', label: 'Memories', icon: 'ri-heart-line' },
                { id: 'users', label: 'Users', icon: 'ri-user-line' },
                { id: 'timecapsules', label: 'Time Capsules', icon: 'ri-time-line' },
                { id: 'calendar', label: 'Calendar', icon: 'ri-calendar-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${tab.icon} text-lg`}></i>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{totalStats.totalUsers}</h3>
                      <p className="text-gray-600 text-sm">Total Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                      <i className="ri-user-smile-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{totalStats.activeUsers}</h3>
                      <p className="text-gray-600 text-sm">Active Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
                      <i className="ri-heart-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{totalStats.totalMemories}</h3>
                      <p className="text-gray-600 text-sm">Total Memories</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="ri-time-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{totalStats.totalTimeCapsules}</h3>
                      <p className="text-gray-600 text-sm">Time Capsules</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {memories.slice(0, 5).map((memory) => (
                    <div key={memory.id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-2xl">
                      <Image
                        src={memory.coverImage}
                        alt={memory.productName}
                        width={48}
                        height={48}
                        className="rounded-xl object-cover object-top"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {memory.productName} for {memory.childName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {memory.userName ? `Created by ${memory.userName}` : 'Unassigned'} • {memory.lastUpdated}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        memory.isPublic
                          ? 'bg-gradient-to-r from-[#FFB067] to-[#F3E8FF]'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {memory.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Memories Tab */}
          {activeTab === 'memories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <div key={memory.id} className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={memory.coverImage}
                      alt={memory.productName}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        memory.isPublic
                          ? 'bg-gradient-to-r from-[#FFB067] to-[#F3E8FF]'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {memory.isPublic ? 'Public' : 'Private'}
                      </div>
                      {memory.timeCapsuleCode && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Time Capsule
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{memory.productName}</h3>
                      <p className="text-gray-600">For {memory.childName}</p>
                      {memory.userName && (
                        <p className="text-sm text-gray-500">Owned by {memory.userName}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>Created:</span>
                        <span>{memory.createdDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Memories:</span>
                        <span>{memory.totalMemories} items</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Access Token:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{memory.accessToken}</code>
                      </div>
                    </div>

                    {/* Time Capsule Info */}
                    {memory.timeCapsuleCode && (
                      <div className="bg-purple-50 rounded-2xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-800">Time Capsule</span>
                          <i className="ri-time-line text-purple-600"></i>
                        </div>
                        <div className="space-y-1 text-xs text-purple-700">
                          <div className="flex justify-between">
                            <span>Code:</span>
                            <code className="bg-purple-100 px-2 py-1 rounded">{memory.timeCapsuleCode}</code>
                          </div>
                          {memory.timeCapsuleDate && (
                            <div className="flex justify-between">
                              <span>Return Date:</span>
                              <span>{new Date(memory.timeCapsuleDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Link
                        href={`/memory?id=${memory.id}`}
                        className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-2 px-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap text-center text-sm"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => openCreateCodeModal(memory)}
                        className="bg-purple-100 text-purple-700 py-2 px-3 rounded-2xl font-medium hover:bg-purple-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                        title="Time Capsule"
                      >
                        <i className="ri-time-line text-sm"></i>
                      </button>

                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="bg-red-100 text-red-700 py-2 px-3 rounded-2xl font-medium hover:bg-red-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          user.isActive ? 'bg-gradient-to-r from-[#FFB067] to-[#F3E8FF]' : 'bg-gray-400'
                        }`}
                      >
                        <i className="ri-user-line text-white text-xl"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()} • {user.totalMemories} memories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-[#FFB067] text-[#F3E8FF]' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-[#FFB067] text-[#F3E8FF] hover:bg-[#F3E8FF]'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Capsules Tab */}
          {activeTab === 'timecapsules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.filter(m => m.timeCapsuleCode).map((memory) => (
                <div key={memory.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="ri-time-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{memory.productName}</h3>
                      <p className="text-gray-600">For {memory.childName}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-800">Time Capsule Code</span>
                        <i className="ri-key-line text-purple-600"></i>
                      </div>
                      <code className="text-lg font-mono text-purple-900 bg-purple-100 px-3 py-2 rounded-xl block text-center">
                        {memory.timeCapsuleCode}
                      </code>
                    </div>

                    {memory.timeCapsuleDate && (
                      <div className="bg-blue-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">Return Date</span>
                          <i className="ri-calendar-line text-blue-600"></i>
                        </div>
                        <p className="text-lg font-bold text-blue-900 text-center">
                          {new Date(memory.timeCapsuleDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}

                    <div className="text-sm text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Owner:</span>
                        <span>{memory.userName || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{memory.createdDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => openCreateCodeModal(memory)}
                      className="w-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 py-3 rounded-2xl font-medium hover:from-purple-200 hover:to-purple-300 transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      Edit Time Capsule
                    </button>
                  </div>
                </div>
              ))}
              {memories.filter(m => m.timeCapsuleCode).length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-time-line text-3xl text-white"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No Time Capsules Yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Create time capsule codes for memories to enable the magical time capsule feature.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Time Capsule Calendar</h2>
                <Link
                  href="/calendar"
                  className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-line text-lg"></i>
                    <span>View Full Calendar</span>
                  </div>
                </Link>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="ri-calendar-line text-3xl text-white"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Admin Calendar View</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    View all time capsule return dates across all users in a comprehensive calendar format. Perfect for managing and tracking all scheduled returns.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-purple-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-archive-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xl">{totalStats.totalTimeCapsules}</h4>
                    <p className="text-gray-600 text-sm">Total Time Capsules</p>
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-calendar-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xl">1</h4>
                    <p className="text-gray-600 text-sm">This Month</p>
                  </div>

                  <div className="text-center p-6 bg-yellow-50 rounded-2xl">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center mx-auto mb-3">
                      <i className="ri-time-line text-white text-xl"></i>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xl">2</h4>
                    <p className="text-gray-600 text-sm">Next 30 Days</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <i className="ri-shield-check-line text-blue-600 text-xl"></i>
                    <h4 className="font-semibold text-blue-800">Admin Calendar Features</h4>
                  </div>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li className="flex items-center space-x-2">
                      <i className="ri-check-line text-blue-600"></i>
                      <span>View all users' time capsule return dates</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="ri-check-line text-blue-600"></i>
                      <span>Filter by user, date range, or capsule status</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="ri-check-line text-blue-600"></i>
                      <span>Quick access to modify or manage time capsules</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <i className="ri-check-line text-blue-600"></i>
                      <span>Export calendar data for logistics planning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Memory Modal */}
      {showCreateMemoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Memory</h3>
                <button
                  onClick={() => setShowCreateMemoryModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newMemory.productName}
                    onChange={(e) => setNewMemory({ ...newMemory, productName: e.target.value })}
                    placeholder="e.g., Magical Unicorn, Brave Dragon"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Name
                  </label>
                  <input
                    type="text"
                    value={newMemory.childName}
                    onChange={(e) => setNewMemory({ ...newMemory, childName: e.target.value })}
                    placeholder="e.g., Emma, Lucas, Sophie"
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to User (Optional)
                  </label>
                  <select
                    value={newMemory.userId}
                    onChange={(e) => setNewMemory({ ...newMemory, userId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm pr-8"
                  >
                    <option value="">Unassigned</option>
                    {users.filter(u => u.isActive).map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNewMemory({ ...newMemory, isPublic: !newMemory.isPublic })}
                    className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                      newMemory.isPublic ? 'bg-gradient-to-r from-[#FFB067] to-[#F3E8FF]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        newMemory.isPublic ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    ></div>
                  </button>
                  <span className="text-sm text-gray-700">
                    {newMemory.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateMemoryModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateMemory}
                    disabled={!newMemory.productName.trim() || !newMemory.childName.trim()}
                    className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Memory
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Time Capsule Code Modal */}
      {showCreateCodeModal && selectedMemoryForCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Time Capsule Code</h3>
                <button
                  onClick={() => setShowCreateCodeModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {selectedMemoryForCode.productName} for {selectedMemoryForCode.childName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedMemoryForCode.userName ? `Owned by ${selectedMemoryForCode.userName}` : 'Unassigned'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Capsule Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTimeCapsuleCode.code}
                      onChange={(e) => setNewTimeCapsuleCode({ ...newTimeCapsuleCode, code: e.target.value.toUpperCase() })}
                      placeholder="Leave empty to auto-generate"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm font-mono"
                    />
                    <button
                      onClick={() => setNewTimeCapsuleCode({ ...newTimeCapsuleCode, code: generateTimeCapsuleCode() })}
                      className="px-4 py-3 bg-purple-100 text-purple-700 rounded-2xl hover:bg-purple-200 transition-colors cursor-pointer"
                      title="Generate Code"
                    >
                      <i className="ri-refresh-line"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={newTimeCapsuleCode.returnDate}
                    onChange={(e) => setNewTimeCapsuleCode({ ...newTimeCapsuleCode, returnDate: e.target.value })}
                    min={minDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Choose a date between 30 days and 5 years from now
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-information-line text-purple-600 text-lg mt-0.5"></i>
                    <div className="text-sm text-purple-800">
                      <p className="font-medium mb-1">Time Capsule Feature:</p>
                      <p>Users can use this code to schedule their physical product to be returned on the specified date, creating a magical time capsule experience.</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateCodeModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTimeCapsuleCode}
                    disabled={!newTimeCapsuleCode.returnDate}
                    className="flex-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white py-3 rounded-2xl font-medium hover:from-purple-500 hover:to-purple-700 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedMemoryForCode.timeCapsuleCode ? 'Update Code' : 'Create Code'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
