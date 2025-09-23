
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '../hooks/useNotifications';

interface Memory {
  id: string;
  productName: string;
  childName: string;
  createdDate: string;
  accessToken: string;
  isPublic: boolean;
  totalMemories: number;
  lastUpdated: string;
  coverImage: string;
}

export default function DashboardPage() {
  const {
    notifications,
    unreadCount,
    isConnected
  } = useNotifications('user-123'); // Replace with actual user ID

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: 'mem-001',
      productName: 'Magische Eenhoorn',
      childName: 'Adam',
      createdDate: '15 juni 2024',
      accessToken: 'ADAM-UNICORN-2024',
      isPublic: false,
      totalMemories: 12,
      lastUpdated: '2 dagen geleden',
      coverImage: 'https://readdy.ai/api/search-image?query=cute%20magical%20unicorn%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20pastel%20colors%2C%20dreamy%20atmosphere&width=400&height=300&seq=dashboard1&orientation=landscape'
    },
    {
      id: 'mem-002',
      productName: 'Dappere Draak',
      childName: 'Emma',
      createdDate: '10 juli 2024',
      accessToken: 'EMMA-DRAGON-2024',
      isPublic: true,
      totalMemories: 8,
      lastUpdated: '5 dagen geleden',
      coverImage: 'https://readdy.ai/api/search-image?query=friendly%20cute%20dragon%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20green%20and%20blue%20colors%2C%20magical%20atmosphere&width=400&height=300&seq=dashboard2&orientation=landscape'
    },
    {
      id: 'mem-003',
      productName: 'Wijze Uil',
      childName: 'Lucas',
      createdDate: '25 mei 2024',
      accessToken: 'LUCAS-OWL-2024',
      isPublic: false,
      totalMemories: 15,
      lastUpdated: '1 week geleden',
      coverImage: 'https://readdy.ai/api/search-image?query=adorable%20wise%20owl%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20warm%20brown%20and%20orange%20colors%2C%20cozy%20atmosphere&width=400&height=300&seq=dashboard3&orientation=landscape'
    }
  ]);

  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 15 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 2}s`
    }));
    setStars(generatedStars);
  }, []);

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

  const handleRegenerateToken = async (memoryId: string) => {
    setIsRegenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const newToken = generateRandomToken();
    setMemories(memories.map(memory => 
      memory.id === memoryId 
        ? { ...memory, accessToken: newToken }
        : memory
    ));

    if (selectedMemory && selectedMemory.id === memoryId) {
      setSelectedMemory({ ...selectedMemory, accessToken: newToken });
    }

    setIsRegenerating(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Clipboard API failed, falling back to execCommand:', err);
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const openTokenModal = (memory: Memory) => {
    setSelectedMemory(memory);
    setShowTokenModal(true);
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: 'ri-dashboard-line', count: null },
    { id: 'memories', label: 'My Dreamlis', icon: 'ri-heart-line', count: memories.length },
    { id: 'calendar', label: 'Time Capsule Calendar', icon: 'ri-calendar-line', count: null },
    { id: 'access-requests', label: 'Access Requests', icon: 'ri-user-shared-line', count: 2 },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-line', count: unreadCount },
    { id: 'settings', label: 'Settings', icon: 'ri-settings-line', count: null },
    { id: 'help', label: 'Help & Support', icon: 'ri-question-line', count: null },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Connection Status Banner */}
            {!isConnected && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-red-800">Real-time Connection Lost</h4>
                    <p className="text-red-600 text-sm">You may not receive live notifications. Please refresh the page.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                    <i className="ri-heart-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color: '#333333'}}>{memories.length}</h3>
                    <p className="text-gray-600 text-sm">Total Dreamlis</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-full flex items-center justify-center">
                    <i className="ri-image-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color: '#333333'}}>{memories.reduce((sum, m) => sum + m.totalMemories, 0)}</h3>
                    <p className="text-gray-600 text-sm">Total Memories</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center">
                    <i className="ri-eye-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color: '#333333'}}>{memories.filter(m => m.isPublic).length}</h3>
                    <p className="text-gray-600 text-sm">Public Dreamlis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Recent Activity</h2>
                <div className="flex items-center space-x-2">
                  {isConnected && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded-full text-xs text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Live</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                {memories.slice(0, 3).map((memory) => (
                  <div key={memory.id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-2xl">
                    <img
                      src={memory.coverImage}
                      alt={memory.productName}
                      className="w-12 h-12 rounded-xl object-cover object-top"
                    />
                    <div className="flex-1">
                      <p className="font-medium" style={{color: '#333333'}}>
                        {memory.productName} for {memory.childName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last updated {memory.lastUpdated}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${memory.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {memory.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>
                ))}
                <Link href="/notifications" className="block w-full text-center py-3 hover:opacity-80 font-medium transition-colors" style={{color: '#8472DF'}}>
                  View all notifications
                </Link>
              </div>
            </div>
          </div>
        );

      case 'memories':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{color: '#333333'}}>My Dreamlis</h2>
              <Link
                href="/claim"
                className="text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                style={{backgroundColor: '#8472DF'}}
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-add-line text-lg"></i>
                  <span>Create New</span>
                </div>
              </Link>
            </div>

            {/* Memories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <div key={memory.id} className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={memory.coverImage}
                      alt={memory.productName}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${memory.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {memory.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{color: '#333333'}}>{memory.productName}</h3>
                      <p className="text-gray-600">For {memory.childName}</p>
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
                        <span>Last updated:</span>
                        <span>{memory.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Access Token Preview */}
                    <div className="bg-gray-50 rounded-2xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Access Token</p>
                          <code className="text-sm font-mono" style={{color: '#333333'}}>{memory.accessToken}</code>
                        </div>
                        <button
                          onClick={() => openTokenModal(memory)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                          title="Manage Token"
                        >
                          <i className="ri-key-line text-gray-600 text-sm"></i>
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Link
                        href={`/memory?id=${memory.id}`}
                        className="flex-1 text-white py-3 px-4 rounded-2xl font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
                        style={{backgroundColor: '#8472DF'}}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <i className="ri-eye-line text-sm"></i>
                          <span>View</span>
                        </div>
                      </Link>

                      <button
                        onClick={() => openTokenModal(memory)}
                        className="bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                        title="Manage Access"
                      >
                        <i className="ri-settings-3-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {memories.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-heart-line text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>No Dreamlis Yet</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start creating beautiful memories with your first Dreamli. Each one becomes a unique digital memory book for your child.
                </p>
                <Link
                  href="/claim"
                  className="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                  style={{backgroundColor: '#8472DF'}}
                >
                  <i className="ri-add-line text-lg"></i>
                  <span>Create Your First Dreamli</span>
                </Link>
              </div>
            )}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Time Capsule Calendar</h2>
              <Link
                href="/calendar"
                className="text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                style={{backgroundColor: '#8472DF'}}
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-calendar-line text-lg"></i>
                  <span>View Full Calendar</span>
                </div>
              </Link>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-time-line text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{color: '#333333'}}>Track Your Time Capsules</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  View all your scheduled time capsule return dates in a beautiful calendar format. Never miss when your magical memories are coming back!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-archive-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>3</h4>
                  <p className="text-gray-600 text-sm">Total Time Capsules</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-calendar-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>1</h4>
                  <p className="text-gray-600 text-sm">This Month</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-time-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>2</h4>
                  <p className="text-gray-600 text-sm">Next 30 Days</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-information-line text-xl" style={{color: '#8472DF'}}></i>
                  <h4 className="font-semibold" style={{color: '#8472DF'}}>About Time Capsules</h4>
                </div>
                <p className="text-sm" style={{color: '#333333'}}>
                  Time capsules allow you to schedule your physical Dreamli to be returned on a special future date, creating magical surprise moments for you and your child. View the full calendar to see all your scheduled returns and never miss a magical moment!
                </p>
              </div>
            </div>
          </div>
        );

      case 'access-requests':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Access Requests</h2>
              <Link
                href="/dashboard/access-requests"
                className="text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                style={{backgroundColor: '#8472DF'}}
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-external-link-line text-lg"></i>
                  <span>View All Requests</span>
                </div>
              </Link>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-time-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>2</h4>
                  <p className="text-gray-600 text-sm">Pending Requests</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-check-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>1</h4>
                  <p className="text-gray-600 text-sm">Approved</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="ri-close-line text-white text-xl"></i>
                  </div>
                  <h4 className="font-bold text-xl" style={{color: '#333333'}}>1</h4>
                  <p className="text-gray-600 text-sm">Rejected</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                    <i className="ri-time-line text-white"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{color: '#333333'}}>Sarah Johnson wants to view "Magische Eenhoorn"</p>
                    <p className="text-sm text-gray-600">Grandmother requesting access • 1 day ago</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                    <i className="ri-time-line text-white"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{color: '#333333'}}>Michael Thompson wants to edit "Dappere Draak"</p>
                    <p className="text-sm text-gray-600">Uncle requesting edit access • 2 days ago</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </div>
                </div>

                <Link href="/dashboard/access-requests" className="block w-full text-center py-3 hover:opacity-80 font-medium transition-colors" style={{color: '#8472DF'}}>
                  View all access requests
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-white/20 rounded-2xl p-6 mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="ri-information-line text-xl" style={{color: '#8472DF'}}></i>
                  <h4 className="font-semibold" style={{color: '#8472DF'}}>About Access Requests</h4>
                </div>
                <p className="text-sm" style={{color: '#333333'}}>
                  Family members and friends can request access to view or contribute to your Dreamlis. You have full control over who gets access and what level of permissions they receive. Review each request carefully before approving or rejecting.
                </p>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Notifications</h2>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{isConnected ? 'Live' : 'Offline'}</span>
                </div>
              </div>
              <Link
                href="/notifications"
                className="text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                style={{backgroundColor: '#8472DF'}}
              >
                View All
              </Link>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="space-y-4">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-4 p-4 rounded-2xl border-l-4 ${notification.type === 'milestone' ? 'bg-green-50/50 border-green-400' : notification.type === 'comment' ? 'bg-blue-50/50 border-blue-400' : notification.type === 'update' ? 'bg-purple-50/50 border-purple-400' : 'bg-gray-50/50 border-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'milestone' ? 'bg-green-400' : notification.type === 'comment' ? 'bg-blue-400' : notification.type === 'update' ? 'bg-purple-400' : 'bg-gray-400'}`}>
                      <i className={`${notification.type === 'milestone' ? 'ri-flag-line' : notification.type === 'comment' ? 'ri-chat-3-line' : notification.type === 'update' ? 'ri-information-line' : 'ri-notification-line'} text-white`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold" style={{color: '#333333'}}>{notification.title}</h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message.substring(0, 100)}...</p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <i className="ri-notification-off-line text-3xl mb-3"></i>
                    <p>No recent notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Settings</h2>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium" style={{color: '#333333'}}>Real-time Notifications</h4>
                        <p className="text-sm text-gray-600">Receive instant updates via Pusher</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full relative ${isConnected ? 'bg-[#8472DF]' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isConnected ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium" style={{color: '#333333'}}>Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates about your Dreamlis</p>
                      </div>
                      <button className="w-12 h-6 rounded-full relative" style={{backgroundColor: '#8472DF'}}>
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-6 transition-transform"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium" style={{color: '#333333'}}>Browser Notifications</h4>
                        <p className="text-sm text-gray-600">Show desktop notifications</p>
                      </div>
                      <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-0.5 transition-transform"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <h4 className="font-medium" style={{color: '#333333'}}>Public Sharing</h4>
                        <p className="text-sm text-gray-600">Allow others to view your public Dreamlis</p>
                      </div>
                      <button className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-0.5 transition-transform"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{color: '#333333'}}>Privacy</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left bg-red-50 hover:bg-red-100 p-4 rounded-2xl transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <i className="ri-delete-bin-line text-red-600"></i>
                        <div>
                          <h4 className="font-medium text-red-800">Delete Account</h4>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold" style={{color: '#333333'}}>Help & Support</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-r from-[#93C4FF] to-[#ACEEF3] rounded-full flex items-center justify-center mb-4">
                  <i className="ri-question-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{color: '#333333'}}>FAQ</h3>
                <p className="text-gray-600 mb-4">Find answers to commonly asked questions</p>
                <button className="hover:opacity-80 font-medium transition-colors cursor-pointer" style={{color: '#8472DF'}}>
                  Browse FAQ →
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                <div className="w-12 h-12 bg-gradient-to-r from-[#8472DF] to-[#C293F6] rounded-full flex items-center justify-center mb-4">
                  <i className="ri-customer-service-line text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{color: '#333333'}}>Contact Support</h3>
                <p className="text-gray-600 mb-4">Get help from our support team</p>
                <Link href="/contact" className="hover:opacity-80 font-medium transition-colors cursor-pointer" style={{color: '#8472DF'}}>
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning={true}>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          >
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                  <i className="ri-heart-line text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl" style={{color: '#333333'}}>Dreamli</h1>
                  <p className="text-sm text-gray-600">Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer whitespace-nowrap ${activeTab === item.id ? 'text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
                  style={activeTab === item.id ? {backgroundColor: '#8472DF'} : {}}
                >
                  <div className="flex items-center space-x-3">
                    <i className={`${item.icon} text-lg`}></i>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count && item.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeTab === item.id ? 'bg-white/30 text-white' : 'bg-red-500 text-white'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-home-line text-lg"></i>
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          {/* Top Header */}
          <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-menu-line text-xl text-gray-600"></i>
              </button>

              <h1 className="font-semibold" style={{color: '#333333'}}>
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>

              <div className="w-10 h-10"></div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{color: '#333333'}}>
                    {activeTab === 'overview' ? 'My Dreamli Dashboard' :
                      activeTab === 'memories' ? 'My Dreamlis' :
                        activeTab === 'notifications' ? 'Notifications' :
                          activeTab === 'settings' ? 'Settings' :
                            activeTab === 'help' ? 'Help & Support' : 'Dashboard'}
                  </h1>
                  <p className="text-gray-600">
                    {activeTab === 'overview' ? 'Manage your memory collections and access tokens' :
                      activeTab === 'memories' ? 'View and manage all your Dreamli creations' :
                        activeTab === 'notifications' ? 'Stay updated with your Dreamli progress' :
                          activeTab === 'settings' ? 'Customize your account preferences' :
                            activeTab === 'help' ? 'Get help and find answers to your questions' : ''}
                  </p>
                </div>

                {activeTab === 'overview' && (
                  <Link
                    href="/claim"
                    className="text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
                    style={{backgroundColor: '#8472DF'}}
                  >
                    <div className="flex items-center space-x-2">
                      <i className="ri-add-line text-lg"></i>
                      <span>Create New Dreamli</span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Dynamic Content */}
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      {/* Token Management Modal */}
      {showTokenModal && selectedMemory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold" style={{color: '#333333'}}>Access Token Management</h3>
                <button
                  onClick={() => setShowTokenModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2" style={{color: '#333333'}}>{selectedMemory.productName}</h4>
                  <p className="text-gray-600 text-sm">For {selectedMemory.childName}</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Current Access Token</label>
                    <button
                      onClick={() => copyToClipboard(selectedMemory.accessToken)}
                      className="flex items-center space-x-2 hover:opacity-80 transition-colors cursor-pointer"
                      style={{color: '#8472DF'}}
                    >
                      <i className="ri-file-copy-line text-sm"></i>
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                  <div className="bg-white rounded-xl p-3 border">
                    <code className="text-lg font-mono break-all" style={{color: '#333333'}}>{selectedMemory.accessToken}</code>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <i className="ri-alert-line text-yellow-600 text-lg mt-0.5"></i>
                    <div>
                      <h5 className="font-medium text-yellow-800 mb-1">Important</h5>
                      <p className="text-yellow-700 text-sm">
                        Regenerating the token will invalidate the current one. Anyone using the old token will lose access.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleRegenerateToken(selectedMemory.id)}
                    disabled={isRegenerating}
                    className="w-full bg-orange-100 text-orange-800 py-3 rounded-2xl font-medium hover:bg-orange-200 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Regenerating Token...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-refresh-line"></i>
                        <span>Regenerate Token</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setShowTokenModal(false)}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Close
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
