
'use client';

import { useState } from 'react';

interface GameSidebarProps {
  activeZone: string;
  onZoneChange: (zone: string) => void;
  playerStats: {
    dreamPoints: number;
    level: number;
    nextLevelPoints: number;
    streakDays: number;
    totalCreations: number;
    badges: number;
  };
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface ZoneItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  goldInfo?: string;
}

export default function GameSidebar({
  activeZone,
  onZoneChange,
  playerStats,
  isCollapsed,
  onToggleCollapse
}: GameSidebarProps) {
  const [showGoldMiner, setShowGoldMiner] = useState(false);

  const zones: ZoneItem[] = [
    {
      id: 'hub',
      name: 'Hub World',
      icon: 'ri-home-line',
      color: 'from-blue-500 to-indigo-500',
      description: 'Your magical home base'
    },
    {
      id: 'create',
      name: 'Create Zone',
      icon: 'ri-magic-line',
      color: 'from-purple-500 to-pink-500',
      description: 'Start new creations',
      goldInfo: 'Costs gold to create'
    },
    {
      id: 'workshop',
      name: 'Workshop',
      icon: 'ri-tools-line',
      color: 'from-orange-500 to-red-500',
      description: 'Shop for materials and upgrades'
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: 'ri-gallery-line',
      color: 'from-green-500 to-teal-500',
      description: 'View your creations and orders',
      goldInfo: 'Earn gold from likes & comments'
    },
    {
      id: 'achievements',
      name: 'Achievements Tower',
      icon: 'ri-trophy-line',
      color: 'from-yellow-500 to-orange-500',
      description: 'Unlock badges and rewards',
      goldInfo: 'Earn gold from achievements'
    },
    {
      id: 'mailbox',
      name: 'Mailbox',
      icon: 'ri-mail-line',
      color: 'from-pink-500 to-purple-500',
      description: 'Messages and updates'
    },
    {
      id: 'gold-miner',
      name: 'Gold Miner',
      icon: 'ri-pick-line',
      color: 'from-green-600 to-yellow-500',
      description: 'Learn how to earn Dream Gold',
      goldInfo: 'Discover gold earning methods'
    }
  ];

  const handleZoneClick = (zoneId: string) => {
    if (zoneId === 'gold-miner') {
      setShowGoldMiner(true);
    } else {
      onZoneChange(zoneId);
    }
  };

  const goldEarningMethods = [
    {
      icon: 'ri-heart-line',
      title: 'Get Likes',
      description: 'Receive likes on your creations',
      reward: '+2 Gold per like',
      color: 'from-pink-500 to-red-500',
      where: 'Gallery'
    },
    {
      icon: 'ri-chat-3-line',
      title: 'Get Comments',
      description: 'Receive comments on your memories',
      reward: '+5 Gold per comment',
      color: 'from-blue-500 to-indigo-500',
      where: 'Gallery'
    },
    {
      icon: 'ri-trophy-line',
      title: 'Complete Achievements',
      description: 'Unlock badges and milestones',
      reward: '+50-500 Gold',
      color: 'from-yellow-500 to-orange-500',
      where: 'Achievements Tower'
    },
    {
      icon: 'ri-calendar-check-line',
      title: 'Daily Streak',
      description: 'Visit daily to maintain streaks',
      reward: '+10 Gold per day',
      color: 'from-green-500 to-teal-500',
      where: 'Hub World'
    },
    {
      icon: 'ri-share-line',
      title: 'Share Memories',
      description: 'Share your creations publicly',
      reward: '+25 Gold per share',
      color: 'from-purple-500 to-pink-500',
      where: 'Gallery'
    },
    {
      icon: 'ri-user-add-line',
      title: 'Invite Friends',
      description: 'Invite others to join Dreamli',
      reward: '+100 Gold per friend',
      color: 'from-orange-500 to-red-500',
      where: 'Hub World'
    }
  ];

  return (
    <>
      <div className={`bg-white/90 backdrop-blur-sm shadow-lg rounded-3xl m-6 border border-white/50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">👑</span>
                </div>
                <div>
                  <div className="font-bold text-gray-800">Level {playerStats.level}</div>
                  <div className="text-sm text-gray-600">{playerStats.dreamPoints.toLocaleString()} Gold</div>
                  <div className="text-xs text-orange-600 font-medium">{playerStats.badges} badges</div>
                </div>
              </div>
            )}
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className={`${isCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-xl text-gray-600`}></i>
            </button>
          </div>

          {!isCollapsed && (
            <>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress to Level {playerStats.level + 1}</span>
                  <span>{playerStats.dreamPoints}/{playerStats.nextLevelPoints}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(playerStats.dreamPoints / playerStats.nextLevelPoints) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-800">{playerStats.streakDays}</div>
                  <div className="text-xs text-blue-600">Day Streak</div>
                </div>
                <div className="bg-gradient-to-r from-green-100 to-teal-100 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-green-800">{playerStats.totalCreations}</div>
                  <div className="text-xs text-green-600">Creations</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} p-4 rounded-2xl transition-all duration-300 cursor-pointer group ${
                activeZone === zone.id
                  ? `bg-gradient-to-r ${zone.color} text-white shadow-lg scale-105`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {/* Icon */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeZone === zone.id 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-r ${zone.color}`
                }`}>
                  <i className={`${zone.icon} text-xl ${
                    activeZone === zone.id ? 'text-white' : 'text-white'
                  }`}></i>
                </div>
              </div>

              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <div className="font-medium">{zone.name}</div>
                  <div className={`text-xs ${
                    activeZone === zone.id ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {zone.description}
                  </div>
                  {zone.goldInfo && (
                    <div className={`text-xs font-medium ${
                      activeZone === zone.id ? 'text-yellow-200' : 'text-orange-600'
                    }`}>
                      💰 {zone.goldInfo}
                    </div>
                  )}
                </div>
              )}

              {!isCollapsed && activeZone !== zone.id && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick Create Button */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => onZoneChange('create')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>
              Quick Create
            </button>
          </div>
        )}
      </div>

      {/* Gold Miner Modal */}
      {showGoldMiner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <i className="ri-pick-line text-white text-2xl"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Gold Miner Guide</h2>
                    <p className="text-gray-600">Learn all the ways to earn Dream Gold for free!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGoldMiner(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              {/* Current Gold Display */}
              <div className="mb-8 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <i className="ri-coin-line text-white text-xl"></i>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{playerStats.dreamPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Your Current Dream Gold</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goldEarningMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      if (method.where === 'Gallery') {
                        setShowGoldMiner(false);
                        onZoneChange('gallery');
                      } else if (method.where === 'Achievements Tower') {
                        setShowGoldMiner(false);
                        onZoneChange('achievements');
                      } else if (method.where === 'Hub World') {
                        setShowGoldMiner(false);
                        onZoneChange('hub');
                      }
                    }}
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <i className={`${method.icon} text-white text-2xl`}></i>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
                        {method.reward}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        → {method.where}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <i className="ri-lightbulb-line text-blue-600 text-xl"></i>
                  <h3 className="font-bold text-blue-800">Pro Tips</h3>
                </div>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• The more you engage with the community, the more gold you earn!</li>
                  <li>• Check back daily to maintain your streak and earn bonus gold</li>
                  <li>• Complete achievements to unlock big gold rewards</li>
                  <li>• Share your creations to get more likes and comments</li>
                  <li>• Invite friends to join and earn 100 gold per successful referral</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
