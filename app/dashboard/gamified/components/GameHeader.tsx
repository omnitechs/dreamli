
'use client';

import { useState } from 'react';

interface GameHeaderProps {
  playerStats: {
    dreamPoints: number;
    level: number;
    nextLevelPoints: number;
    streakDays: number;
    totalCreations: number;
    badges: number;
  };
  onProfileClick: () => void;
  onCartClick: () => void;
}

export default function GameHeader({ playerStats, onProfileClick, onCartClick }: GameHeaderProps) {
  const [showGoldShop, setShowGoldShop] = useState(false);
  const [showGoldMiner, setShowGoldMiner] = useState(false);

  const goldPackages = [
    { id: 1, gold: 100, price: 10, popular: false, bonus: 0 },
    { id: 2, gold: 250, price: 25, popular: false, bonus: 25 },
    { id: 3, gold: 500, price: 50, popular: true, bonus: 75 },
    { id: 4, gold: 1000, price: 100, popular: false, bonus: 200 },
    { id: 5, gold: 2500, price: 250, popular: false, bonus: 750 }
  ];

  const goldEarningMethods = [
    {
      icon: 'ri-heart-line',
      title: 'Get Likes',
      description: 'Receive likes on your creations',
      reward: '+2 Gold per like',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: 'ri-chat-3-line',
      title: 'Get Comments',
      description: 'Receive comments on your memories',
      reward: '+5 Gold per comment',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: 'ri-trophy-line',
      title: 'Complete Achievements',
      description: 'Unlock badges and milestones',
      reward: '+50-500 Gold',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Daily Streak',
      description: 'Visit daily to maintain streaks',
      reward: '+10 Gold per day',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: 'ri-share-line',
      title: 'Share Memories',
      description: 'Share your creations publicly',
      reward: '+25 Gold per share',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'ri-user-add-line',
      title: 'Invite Friends',
      description: 'Invite others to join Dreamli',
      reward: '+100 Gold per friend',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleBuyGold = (packageData: any) => {
    // In real implementation, this would integrate with Stripe
    console.log('Buying gold package:', packageData);
    alert(`This would redirect to payment for ${packageData.gold + packageData.bonus} gold (€${packageData.price})`);
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl mx-6 mt-6 p-4 border border-white/50">
        <div className="flex items-center justify-between">
          {/* Left: Dream Points & Level */}
          <div className="flex items-center space-x-6">
            {/* Dream Points with Buy Button */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="ri-coin-line text-white text-xl"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <i className="ri-add-line text-white text-xs"></i>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-orange-600">{playerStats.dreamPoints.toLocaleString()}</span>
                  <button
                    onClick={() => setShowGoldShop(true)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:from-green-600 hover:to-teal-600 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Buy Gold
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Dream Gold</span>
                  <button
                    onClick={() => setShowGoldMiner(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    How to earn?
                  </button>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">{playerStats.level}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">Level {playerStats.level}</div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(playerStats.dreamPoints / playerStats.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="ri-fire-line text-white text-xl animate-bounce"></i>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{playerStats.streakDays} Days</div>
                <div className="text-xs text-gray-500">Streak</div>
              </div>
            </div>
          </div>

          {/* Right: Cart & Profile */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCartClick}
              className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <i className="ri-shopping-cart-line text-white text-xl"></i>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">2</span>
              </div>
            </button>

            <button
              onClick={onProfileClick}
              className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <i className="ri-user-line text-white text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Gold Shop Modal */}
      {showGoldShop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <i className="ri-coin-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gold Shop</h2>
                    <p className="text-gray-600">Get more Dream Gold to unlock amazing creations</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoldShop(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goldPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border-4 ${
                      pkg.popular ? 'border-yellow-400 shadow-lg scale-105' : 'border-yellow-200'
                    } hover:shadow-xl transition-all duration-300`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                          MOST POPULAR
                        </div>
                      </div>
                    )}

                    {pkg.bonus > 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          +{pkg.bonus} Priceless!
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <i className="ri-coin-line text-white text-3xl"></i>
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold text-gray-800">
                          {(pkg.gold + pkg.bonus).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Dream Gold</div>
                        {pkg.bonus > 0 && (
                          <div className="text-xs text-green-600 font-medium">
                            ({pkg.gold} + {pkg.bonus} bonus)
                          </div>
                        )}
                      </div>

                      <div className="text-2xl font-bold text-orange-600 mb-6">
                        €{pkg.price}
                      </div>

                      <button
                        onClick={() => handleBuyGold(pkg)}
                        className={`w-full py-3 rounded-2xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                          pkg.popular
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                            : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500'
                        }`}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <i className="ri-shield-check-line text-blue-600 text-xl"></i>
                  <h3 className="font-bold text-blue-800">Secure Payment</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  All payments are processed securely. Your Dream Gold will be added instantly to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gold Miner (How to Earn) Modal */}
      {showGoldMiner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <i className="ri-pick-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gold Miner</h2>
                    <p className="text-gray-600">Learn how to earn Dream Gold for free!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoldMiner(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goldEarningMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <i className={`${method.icon} text-white text-2xl`}></i>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold inline-block">
                      {method.reward}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border border-yellow-200">
                <div className="flex items-center space-x-3 mb-3">
                  <i className="ri-lightbulb-line text-orange-600 text-xl"></i>
                  <h3 className="font-bold text-orange-800">Pro Tip</h3>
                </div>
                <p className="text-orange-700 text-sm">
                  The more you engage with the Dreamli community, the more Gold you earn! 
                  Create amazing memories, interact with others, and watch your Gold grow naturally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
