'use client';

import { useState } from 'react';

interface GalleryProps {
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

interface Creation {
  id: string;
  name: string;
  type: 'drawing' | 'toy' | '3d-model';
  status: 'completed' | 'in-progress' | 'pending';
  image: string;
  createdDate: string;
  completionDate?: string;
  dreamPoints: number;
  likes: number;
  comments: number;
  orders: number;
  isPublic: boolean;
  badges: string[];
  goldFromLikes: number;
  goldFromComments: number;
  goldFromOrders: number;
}

interface Order {
  id: string;
  productName: string;
  status: 'printing' | 'assembly' | 'painting' | 'shipping' | 'delivered';
  image: string;
  orderDate: string;
  estimatedDelivery: string;
  trackingNumber?: string;
}

export default function Gallery({ onBack, playerStats, onGoldChange }: GalleryProps) {
  const [activeTab, setActiveTab] = useState<'creations' | 'orders'>('creations');
  const [selectedCreation, setSelectedCreation] = useState<Creation | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [likedCreations, setLikedCreations] = useState<Set<string>>(new Set());
  const [commentedCreations, setCommentedCreations] = useState<Set<string>>(new Set());

  const [creations, setCreations] = useState<Creation[]>([
    {
      id: 'cr-001',
      name: 'Rainbow Dragon Adventure',
      type: '3d-model',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=beautiful%20rainbow%20dragon%203D%20printed%20toy%20model%20colorful%20wings%20magical%20fantasy%20creature%20children%20artwork&width=400&height=300&seq=gallery1&orientation=landscape',
      createdDate: '2024-01-15',
      completionDate: '2024-01-20',
      dreamPoints: 450,
      likes: 23,
      comments: 8,
      orders: 5,
      isPublic: true,
      badges: ['First Creation', 'Dragon Master'],
      goldFromLikes: 46, // 23 likes × 2 gold
      goldFromComments: 40, // 8 comments × 5 gold  
      goldFromOrders: 250 // 5 orders × 50 gold
    },
    {
      id: 'cr-002',
      name: 'Magical Unicorn Castle',
      type: 'drawing',
      status: 'in-progress',
      image: 'https://readdy.ai/api/search-image?query=child%20drawing%20of%20magical%20unicorn%20castle%20with%20rainbow%20colors%20towers%20princess%20theme%20colorful%20crayon%20artwork&width=400&height=300&seq=gallery2&orientation=landscape',
      createdDate: '2024-01-18',
      dreamPoints: 200,
      likes: 15,
      comments: 4,
      orders: 0,
      isPublic: false,
      badges: ['Artist', 'Creative Mind'],
      goldFromLikes: 30, // 15 likes × 2 gold
      goldFromComments: 20, // 4 comments × 5 gold
      goldFromOrders: 0 // No orders (not public)
    },
    {
      id: 'cr-003',
      name: 'Space Robot Explorer',
      type: 'toy',
      status: 'completed',
      image: 'https://readdy.ai/api/search-image?query=colorful%20space%20robot%20toy%20with%20LED%20lights%20astronaut%20theme%20silver%20blue%20colors%20futuristic%20children%20creation&width=400&height=300&seq=gallery3&orientation=landscape',
      createdDate: '2024-01-10',
      completionDate: '2024-01-16',
      dreamPoints: 380,
      likes: 31,
      comments: 12,
      orders: 8,
      isPublic: true,
      badges: ['Robot Builder', 'Space Explorer'],
      goldFromLikes: 62, // 31 likes × 2 gold
      goldFromComments: 60, // 12 comments × 5 gold
      goldFromOrders: 400 // 8 orders × 50 gold
    },
    {
      id: 'cr-004',
      name: 'Fairy Garden House',
      type: '3d-model',
      status: 'pending',
      image: 'https://readdy.ai/api/search-image?query=miniature%20fairy%20garden%20house%20with%20mushrooms%20flowers%20magical%20woodland%20theme%20cute%20tiny%20details%20children%20fantasy&width=400&height=300&seq=gallery4&orientation=landscape',
      createdDate: '2024-01-22',
      dreamPoints: 0,
      likes: 8,
      comments: 2,
      orders: 1,
      isPublic: true,
      badges: [],
      goldFromLikes: 16, // 8 likes × 2 gold
      goldFromComments: 10, // 2 comments × 5 gold
      goldFromOrders: 50 // 1 order × 50 gold
    }
  ]);

  const orders: Order[] = [
    {
      id: 'ord-001',
      productName: 'Rainbow Dragon Adventure',
      status: 'painting',
      image: 'https://readdy.ai/api/search-image?query=3D%20printing%20workshop%20with%20colorful%20dragon%20model%20being%20painted%20by%20artist%20detailed%20craftsmanship%20creative%20process&width=400&height=300&seq=gallery5&orientation=landscape',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-02-01',
      trackingNumber: 'DR-2024-001'
    },
    {
      id: 'ord-002',
      productName: 'Unicorn Castle Set',
      status: 'shipping',
      image: 'https://readdy.ai/api/search-image?query=magical%20unicorn%20castle%20packaging%20box%20with%20rainbow%20colors%20ready%20for%20shipping%20delivery%20service&width=400&height=300&seq=gallery6&orientation=landscape',
      orderDate: '2024-01-12',
      estimatedDelivery: '2024-01-28',
      trackingNumber: 'UC-2024-002'
    }
  ];

  const handleLike = (creationId: string) => {
    if (likedCreations.has(creationId)) return;

    const newLikedSet = new Set(likedCreations);
    newLikedSet.add(creationId);
    setLikedCreations(newLikedSet);

    // Update creation likes and add gold
    setCreations(prev => prev.map(creation => {
      if (creation.id === creationId) {
        const newLikes = creation.likes + 1;
        const goldFromLike = 2;
        return {
          ...creation,
          likes: newLikes,
          goldFromLikes: creation.goldFromLikes + goldFromLike
        };
      }
      return creation;
    }));

    // Add gold to player
    onGoldChange(playerStats.dreamPoints + 2);

    // Show notification
    setTimeout(() => {
      alert('💰 +2 Dream Gold for receiving a like!');
    }, 500);
  };

  const handleComment = (creationId: string) => {
    if (commentedCreations.has(creationId)) return;

    const newCommentedSet = new Set(commentedCreations);
    newCommentedSet.add(creationId);
    setCommentedCreations(newCommentedSet);

    // Update creation comments and add gold
    setCreations(prev => prev.map(creation => {
      if (creation.id === creationId) {
        const newComments = creation.comments + 1;
        const goldFromComment = 5;
        return {
          ...creation,
          comments: newComments,
          goldFromComments: creation.goldFromComments + goldFromComment
        };
      }
      return creation;
    }));

    // Add gold to player
    onGoldChange(playerStats.dreamPoints + 5);

    // Show notification
    setTimeout(() => {
      alert('💰 +5 Dream Gold for receiving a comment!');
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'printing': return 'bg-purple-100 text-purple-800';
      case 'assembly': return 'bg-orange-100 text-orange-800';
      case 'painting': return 'bg-pink-100 text-pink-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'ri-check-line';
      case 'in-progress': return 'ri-loader-4-line';
      case 'pending': return 'ri-time-line';
      case 'printing': return 'ri-printer-line';
      case 'assembly': return 'ri-tools-line';
      case 'painting': return 'ri-brush-line';
      case 'shipping': return 'ri-truck-line';
      case 'delivered': return 'ri-gift-line';
      default: return 'ri-information-line';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drawing': return 'ri-pencil-line';
      case 'toy': return 'ri-toy-car-line';
      case '3d-model': return 'ri-box-3-line';
      default: return 'ri-image-line';
    }
  };

  const totalGoldEarned = creations.reduce((sum, creation) => 
    sum + creation.goldFromLikes + creation.goldFromComments + creation.goldFromOrders, 0
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-8 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
      </button>

      {/* Info Button */}
      <button
        onClick={() => setShowInfoModal(true)}
        className="absolute top-6 right-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-information-line text-gray-700 text-xl"></i>
      </button>

      {/* Current Gold Display */}
      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg z-10">
        <div className="flex items-center space-x-2">
          <i className="ri-coin-line text-orange-500 text-xl"></i>
          <span className="font-bold text-gray-800">{playerStats.dreamPoints.toLocaleString()}</span>
          <span className="text-sm text-gray-600">Gold</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
          <i className="ri-gallery-line text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Gallery</h1>
        <p className="text-gray-600">View your amazing creations and track your orders</p>
        
        {/* Gold Earnings Summary */}
        <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <i className="ri-coin-line text-orange-500 text-lg"></i>
            <span className="font-bold text-orange-600">{totalGoldEarned}</span>
            <span className="text-gray-600">Total Gold Earned from Gallery</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          <button
            onClick={() => setActiveTab('creations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'creations'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <i className="ri-palette-line"></i>
              <span>My Creations</span>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">{creations.length}</div>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <i className="ri-shopping-bag-line"></i>
              <span>My Orders</span>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">{orders.length}</div>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'creations' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {creations.map((creation) => (
            <div
              key={creation.id}
              onClick={() => setSelectedCreation(creation)}
              className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border-2 border-white/50 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={creation.image}
                  alt={creation.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(creation.status)}`}>
                  <i className={`${getStatusIcon(creation.status)} mr-1`}></i>
                  {creation.status.charAt(0).toUpperCase() + creation.status.slice(1)}
                </div>

                {/* Type Icon */}
                <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <i className={`${getTypeIcon(creation.type)} text-gray-700`}></i>
                </div>

                {/* Public/Private Indicator */}
                <div className="absolute bottom-3 right-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    creation.isPublic ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    <i className={`${creation.isPublic ? 'ri-eye-line' : 'ri-eye-off-line'} text-white text-sm`}></i>
                  </div>
                </div>

                {/* Total Gold Earned Badge */}
                <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  <i className="ri-coin-line mr-1"></i>
                  +{creation.goldFromLikes + creation.goldFromComments + creation.goldFromOrders}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg mb-3">{creation.name}</h3>
                
                {/* Engagement Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-red-500 mb-1">
                      <i className="ri-heart-line text-sm"></i>
                      <span className="font-bold text-xs">{creation.likes}</span>
                    </div>
                    <div className="text-xs text-gray-600">+{creation.goldFromLikes} gold</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-blue-500 mb-1">
                      <i className="ri-chat-3-line text-sm"></i>
                      <span className="font-bold text-xs">{creation.comments}</span>
                    </div>
                    <div className="text-xs text-gray-600">+{creation.goldFromComments} gold</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-purple-500 mb-1">
                      <i className="ri-shopping-bag-line text-sm"></i>
                      <span className="font-bold text-xs">{creation.orders}</span>
                    </div>
                    <div className="text-xs text-gray-600">+{creation.goldFromOrders} gold</div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  Created: {new Date(creation.createdDate).toLocaleDateString()}
                </div>

                {/* Interaction Buttons */}
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(creation.id);
                    }}
                    disabled={likedCreations.has(creation.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      likedCreations.has(creation.id)
                        ? 'bg-red-100 text-red-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <i className="ri-heart-line mr-1"></i>
                    {likedCreations.has(creation.id) ? 'Liked' : 'Like (+2)'}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComment(creation.id);
                    }}
                    disabled={commentedCreations.has(creation.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                      commentedCreations.has(creation.id)
                        ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <i className="ri-chat-3-line mr-1"></i>
                    {commentedCreations.has(creation.id) ? 'Commented' : 'Comment (+5)'}
                  </button>
                </div>

                {/* Badges */}
                {creation.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {creation.badges.slice(0, 2).map((badge, index) => (
                      <div key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {badge}
                      </div>
                    ))}
                    {creation.badges.length > 2 && (
                      <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        +{creation.badges.length - 2}
                      </div>
                    )}
                  </div>
                )}

                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-medium hover:from-green-600 hover:to-teal-600 transition-all cursor-pointer whitespace-nowrap">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50">
              <div className="flex items-center space-x-6">
                {/* Order Image */}
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{order.productName}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Order Date:</span>
                      <div className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estimated Delivery:</span>
                      <div className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</div>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <span className="text-sm text-gray-600">Tracking:</span>
                        <div className="font-medium text-blue-600">{order.trackingNumber}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)} mb-2`}>
                    <i className={`${getStatusIcon(order.status)} mr-1`}></i>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <i className="ri-information-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gallery Rules & Gold Earning</h2>
                    <p className="text-gray-600">Learn how to earn gold from your creations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Gold Earning Methods */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">💰 How to Earn Gold</h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <i className="ri-heart-line text-red-500 text-xl"></i>
                        <h4 className="font-bold text-red-800">Likes</h4>
                      </div>
                      <p className="text-red-700 text-sm">Earn <strong>+2 Gold</strong> for each like your creation receives from other users</p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <i className="ri-chat-3-line text-blue-500 text-xl"></i>
                        <h4 className="font-bold text-blue-800">Comments</h4>
                      </div>
                      <p className="text-blue-700 text-sm">Earn <strong>+5 Gold</strong> for each comment your creation receives from other users</p>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <i className="ri-shopping-bag-line text-purple-500 text-xl"></i>
                        <h4 className="font-bold text-purple-800">Orders</h4>
                      </div>
                      <p className="text-purple-700 text-sm">Earn <strong>+50 Gold</strong> when someone orders your public creation as a physical model</p>
                    </div>
                  </div>
                </div>

                {/* Public vs Private */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">👁️ Public vs Private Creations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <i className="ri-eye-line text-green-500"></i>
                        <h4 className="font-bold text-green-800">Public</h4>
                      </div>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• Can earn gold from likes</li>
                        <li>• Can earn gold from comments</li>
                        <li>• Can earn gold from orders</li>
                        <li>• Visible to all users</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <i className="ri-eye-off-line text-gray-500"></i>
                        <h4 className="font-bold text-gray-800">Private</h4>
                      </div>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Limited gold earning</li>
                        <li>• No orders from others</li>
                        <li>• Only you can see it</li>
                        <li>• Perfect for personal creations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <i className="ri-lightbulb-line text-orange-500 text-xl"></i>
                    <h3 className="text-xl font-bold text-orange-800">Pro Tips</h3>
                  </div>
                  <ul className="text-orange-700 text-sm space-y-2">
                    <li>• Make your best creations public to maximize gold earnings</li>
                    <li>• Engage with others' creations to encourage engagement on yours</li>
                    <li>• The more unique and creative your models, the more orders you'll receive</li>
                    <li>• Check back regularly to see your gold grow from community engagement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creation Detail Modal */}
      {selectedCreation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedCreation.name}</h2>
                <button
                  onClick={() => setSelectedCreation(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedCreation.image}
                    alt={selectedCreation.name}
                    className="w-full h-80 object-cover object-top rounded-2xl"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedCreation.status)}`}>
                      {selectedCreation.status}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedCreation.isPublic ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      <i className={`${selectedCreation.isPublic ? 'ri-eye-line' : 'ri-eye-off-line'} text-white text-sm`}></i>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dream Points Earned:</span>
                      <span className="font-bold text-orange-600">{selectedCreation.dreamPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gold from Interactions:</span>
                      <span className="font-bold text-green-600">+{selectedCreation.goldEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Likes Received:</span>
                      <span className="font-bold text-red-500">{selectedCreation.likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comments Received:</span>
                      <span className="font-bold text-blue-500">{selectedCreation.comments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created Date:</span>
                      <span className="font-medium">{new Date(selectedCreation.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selectedCreation.badges.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Badges Earned:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreation.badges.map((badge, index) => (
                          <div key={index} className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-medium">
                            <i className="ri-medal-line mr-1"></i>
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer whitespace-nowrap">
                      Share Creation
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer whitespace-nowrap">
                      Create Similar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-24 right-12 w-16 h-16 bg-teal-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-24 left-12 w-10 h-10 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
    </div>
  );
}