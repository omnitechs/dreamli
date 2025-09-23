
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  subscription: 'free' | 'premium' | 'family';
  joinDate: string;
  lastActive: string;
  location?: string;
  totalMemories: number;
  totalOrders: number;
  totalSpent: number;
  role: 'admin' | 'user';
}

interface Memory {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'text' | 'audio';
  createdAt: string;
  isPublic: boolean;
  accessToken?: string;
  timeCapsuleDate?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  total: number;
  items: string[];
  shippingAddress: string;
  trackingNumber?: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma.johnson@email.com',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20portrait%20business%20casual%20friendly%20smile%20office%20environment%20modern%20photography%20clean%20background&width=150&height=150&seq=emma1&orientation=squarish',
    status: 'active',
    subscription: 'premium',
    joinDate: '2024-01-15',
    lastActive: '2024-12-20',
    location: 'Amsterdam, Netherlands',
    totalMemories: 45,
    totalOrders: 8,
    totalSpent: 249.99,
    role: 'user'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20asian%20man%20portrait%20business%20casual%20confident%20smile%20modern%20office%20background%20clean%20professional%20photography&width=150&height=150&seq=michael2&orientation=squarish',
    status: 'active',
    subscription: 'family',
    joinDate: '2023-11-08',
    lastActive: '2024-12-19',
    location: 'Rotterdam, Netherlands',
    totalMemories: 127,
    totalOrders: 15,
    totalSpent: 589.75,
    role: 'admin'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20woman%20portrait%20curly%20hair%20friendly%20smile%20business%20environment%20modern%20clean%20background%20photography&width=150&height=150&seq=sarah3&orientation=squarish',
    status: 'inactive',
    subscription: 'free',
    joinDate: '2024-03-22',
    lastActive: '2024-12-10',
    location: 'Utrecht, Netherlands',
    totalMemories: 12,
    totalOrders: 2,
    totalSpent: 39.98,
    role: 'user'
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@email.com',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20man%20portrait%20beard%20friendly%20smile%20business%20casual%20modern%20office%20environment%20clean%20background&width=150&height=150&seq=david4&orientation=squarish',
    status: 'active',
    subscription: 'premium',
    joinDate: '2023-09-14',
    lastActive: '2024-12-20',
    location: 'The Hague, Netherlands',
    totalMemories: 89,
    totalOrders: 12,
    totalSpent: 423.88,
    role: 'user'
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@email.com',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20latina%20woman%20portrait%20warm%20smile%20business%20casual%20modern%20office%20environment%20professional%20photography%20clean%20background&width=150&height=150&seq=lisa5&orientation=squarish',
    status: 'active',
    subscription: 'family',
    joinDate: '2024-02-11',
    lastActive: '2024-12-18',
    location: 'Eindhoven, Netherlands',
    totalMemories: 76,
    totalOrders: 9,
    totalSpent: 312.45,
    role: 'admin'
  }
];

const mockMemories: Record<string, Memory[]> = {
  '1': [
    {
      id: 'm1',
      title: 'First Day at School',
      type: 'photo',
      createdAt: '2024-09-01',
      isPublic: true,
      accessToken: 'abc123def456'
    },
    {
      id: 'm2',
      title: 'Birthday Celebration',
      type: 'video',
      createdAt: '2024-10-15',
      isPublic: false,
      timeCapsuleDate: '2025-10-15'
    }
  ],
  '2': [
    {
      id: 'm3',
      title: 'Family Vacation Photos',
      type: 'photo',
      createdAt: '2024-08-20',
      isPublic: true,
      accessToken: 'xyz789uvw012'
    },
    {
      id: 'm4',
      title: 'Graduation Speech',
      type: 'audio',
      createdAt: '2024-06-30',
      isPublic: false
    },
    {
      id: 'm5',
      title: 'Wedding Anniversary',
      type: 'video',
      createdAt: '2024-11-12',
      isPublic: true,
      accessToken: 'qwe345rty678'
    }
  ],
  '3': [
    {
      id: 'm6',
      title: 'Pet Stories',
      type: 'text',
      createdAt: '2024-05-18',
      isPublic: false,
      timeCapsuleDate: '2025-05-18'
    }
  ]
};

const mockOrders: Record<string, Order[]> = {
  '1': [
    {
      id: 'o1',
      date: '2024-12-10',
      status: 'completed',
      total: 129.99,
      items: ['Premium Subscription (1 Year)', 'Memory Book Print'],
      shippingAddress: 'Prinsengracht 123, 1015 Amsterdam',
      trackingNumber: 'TN123456789'
    },
    {
      id: 'o2',
      date: '2024-11-15',
      status: 'completed',
      total: 120.00,
      items: ['Family Memory Package'],
      shippingAddress: 'Prinsengracht 123, 1015 Amsterdam',
      trackingNumber: 'TN987654321'
    }
  ],
  '2': [
    {
      id: 'o3',
      date: '2024-12-05',
      status: 'pending',
      total: 199.99,
      items: ['Family Subscription (1 Year)', 'Custom Photo Album'],
      shippingAddress: 'Coolsingel 45, 3011 Rotterdam',
      trackingNumber: 'TN456789123'
    },
    {
      id: 'o4',
      date: '2024-10-20',
      status: 'completed',
      total: 389.76,
      items: ['Premium Features Bundle', 'Memory Storage Expansion'],
      shippingAddress: 'Coolsingel 45, 3011 Rotterdam',
      trackingNumber: 'TN789123456'
    }
  ]
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<'all' | 'free' | 'premium' | 'family'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'memories' | 'orders'>('profile');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesSubscription = subscriptionFilter === 'all' || user.subscription === subscriptionFilter;
    
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'user') => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    ));
    setShowRoleModal(false);
    setRoleChangeUser(null);
  };

  const openRoleModal = (user: User) => {
    setRoleChangeUser(user);
    setShowRoleModal(true);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const premiumUsers = users.filter(u => u.subscription === 'premium' || u.subscription === 'family').length;
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage users, view their memories and order history</p>
            </div>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
              Back to Admin
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-check-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-vip-crown-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Premium Users</p>
                  <p className="text-2xl font-bold text-gray-900">{premiumUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-money-euro-circle-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700">
                      Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </button>
                </div>

                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700">
                      Plan: {subscriptionFilter === 'all' ? 'All' : subscriptionFilter.charAt(0).toUpperCase() + subscriptionFilter.slice(1)}
                    </span>
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Subscription</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Memories</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                          }`}></div>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.subscription === 'premium' ? 'bg-purple-100 text-purple-800' :
                          user.subscription === 'family' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{user.totalMemories}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-900">{user.totalOrders}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-medium text-gray-900">€{user.totalSpent.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => openRoleModal(user)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Change Role"
                          >
                            <i className="ri-user-settings-line"></i>
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user.id)}
                            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                              user.status === 'active' 
                                ? 'text-gray-600 hover:text-red-600 hover:bg-red-50' 
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <i className={user.status === 'active' ? 'ri-user-forbid-line' : 'ri-user-add-line'}></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-search-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-600">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className="flex border-b">
              {['profile', 'memories', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'memories' && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {mockMemories[selectedUser.id]?.length || 0}
                    </span>
                  )}
                  {tab === 'orders' && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {mockOrders[selectedUser.id]?.length || 0}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Status</label>
                        <p className="font-medium">{selectedUser.status}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Subscription</label>
                        <p className="font-medium">{selectedUser.subscription}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Role</label>
                        <p className="font-medium">{selectedUser.role}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Join Date</label>
                        <p className="font-medium">{selectedUser.joinDate}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Last Active</label>
                        <p className="font-medium">{selectedUser.lastActive}</p>
                      </div>
                      {selectedUser.location && (
                        <div>
                          <label className="text-sm text-gray-600">Location</label>
                          <p className="font-medium">{selectedUser.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Total Memories</label>
                        <p className="font-medium">{selectedUser.totalMemories}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Total Orders</label>
                        <p className="font-medium">{selectedUser.totalOrders}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Total Spent</label>
                        <p className="font-medium">€{selectedUser.totalSpent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'memories' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">User Memories</h3>
                  {mockMemories[selectedUser.id]?.length > 0 ? (
                    <div className="space-y-4">
                      {mockMemories[selectedUser.id].map((memory) => (
                        <div key={memory.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                memory.type === 'photo' ? 'bg-green-100' :
                                memory.type === 'video' ? 'bg-blue-100' :
                                memory.type === 'audio' ? 'bg-purple-100' :
                                'bg-yellow-100'
                              }`}>
                                <i className={`${
                                  memory.type === 'photo' ? 'ri-image-line text-green-600' :
                                  memory.type === 'video' ? 'ri-video-line text-blue-600' :
                                  memory.type === 'audio' ? 'ri-mic-line text-purple-600' :
                                  'ri-file-text-line text-yellow-600'
                                }`}></i>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{memory.title}</h4>
                                <p className="text-sm text-gray-600">Created on {memory.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                memory.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {memory.isPublic ? 'Public' : 'Private'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                memory.type === 'photo' ? 'bg-green-100 text-green-800' :
                                memory.type === 'video' ? 'bg-blue-100 text-blue-800' :
                                memory.type === 'audio' ? 'bg-purple-100 text-purple-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {memory.type}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            {memory.accessToken && (
                              <span>Access Token: {memory.accessToken}</span>
                            )}
                            {memory.timeCapsuleDate && (
                              <span>Time Capsule: {memory.timeCapsuleDate}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-image-line text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-600">No memories found for this user</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Order History</h3>
                  {mockOrders[selectedUser.id]?.length > 0 ? (
                    <div className="space-y-4">
                      {mockOrders[selectedUser.id].map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">Ordered on {order.date}</p>
                              <div className="text-sm text-gray-600">
                                <strong>Items:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {order.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Shipping:</strong> {order.shippingAddress}</p>
                            {order.trackingNumber && (
                              <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-shopping-cart-line text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-600">No orders found for this user</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && roleChangeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-settings-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Change User Role</h3>
                  <p className="text-gray-600 text-sm">Update role for {roleChangeUser.name}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Select the new role for this user:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleRoleChange(roleChangeUser.id, 'user')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      roleChangeUser.role === 'user'
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i className="ri-user-line text-gray-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">User</p>
                        <p className="text-sm text-gray-600">Standard user with basic permissions</p>
                      </div>
                      {roleChangeUser.role === 'user' && (
                        <div className="ml-auto">
                          <i className="ri-check-line text-blue-600"></i>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleChange(roleChangeUser.id, 'admin')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      roleChangeUser.role === 'admin'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="ri-shield-user-line text-red-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Admin</p>
                        <p className="text-sm text-gray-600">Full access to admin dashboard and user management</p>
                      </div>
                      {roleChangeUser.role === 'admin' && (
                        <div className="ml-auto">
                          <i className="ri-check-line text-red-600"></i>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setRoleChangeUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
