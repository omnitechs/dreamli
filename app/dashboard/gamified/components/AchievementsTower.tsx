
'use client';

import { useState } from 'react';

interface AchievementsTowerProps {
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  goldReward: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
  category: 'creator' | 'social' | 'special' | 'streak';
  goldReward: number;
}

export default function AchievementsTower({ onBack, playerStats, onGoldChange }: AchievementsTowerProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'leaderboard'>('achievements');
  const [claimedAchievements, setClaimedAchievements] = useState<Set<string>>(new Set());
  
  const achievements: Achievement[] = [
    {
      id: 'first-creation',
      title: 'First Creation',
      description: 'Create your very first Dreamli',
      icon: 'ri-star-line',
      color: 'from-yellow-400 to-orange-400',
      goldReward: 100,
      unlocked: true,
      unlockedDate: '2024-01-15',
      rarity: 'common'
    },
    {
      id: 'dragon-master',
      title: 'Dragon Master',
      description: 'Create 5 dragon-themed creations',
      icon: 'ri-fire-line',
      color: 'from-red-500 to-orange-500',
      goldReward: 500,
      unlocked: true,
      progress: 3,
      maxProgress: 5,
      unlockedDate: '2024-01-20',
      rarity: 'rare'
    },
    {
      id: 'speed-creator',
      title: 'Speed Creator',
      description: 'Complete a creation in under 10 minutes',
      icon: 'ri-flashlight-line',
      color: 'from-blue-500 to-purple-500',
      goldReward: 300,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'epic'
    },
    {
      id: 'master-builder',
      title: 'Master Builder',
      description: 'Reach level 10 and create 25 items',
      icon: 'ri-building-line',
      color: 'from-purple-600 to-pink-600',
      goldReward: 1000,
      unlocked: true,
      unlockedDate: '2024-01-25',
      rarity: 'legendary'
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Get 100 likes on your creations',
      icon: 'ri-heart-line',
      color: 'from-pink-500 to-red-500',
      goldReward: 750,
      unlocked: false,
      progress: 69,
      maxProgress: 100,
      rarity: 'epic'
    },
    {
      id: 'streak-champion',
      title: 'Streak Champion',
      description: 'Maintain a 30-day creation streak',
      icon: 'ri-fire-line',
      color: 'from-orange-500 to-red-600',
      goldReward: 2000,
      unlocked: false,
      progress: playerStats.streakDays,
      maxProgress: 30,
      rarity: 'legendary'
    }
  ];

  const badges: Badge[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Welcome to Dreamli!',
      icon: 'ri-footprint-line',
      color: 'from-green-400 to-teal-400',
      earnedDate: '2024-01-15',
      category: 'special',
      goldReward: 50
    },
    {
      id: 'artistic-vision',
      name: 'Artistic Vision',
      description: 'Upload your first drawing',
      icon: 'ri-palette-line',
      color: 'from-purple-400 to-pink-400',
      earnedDate: '2024-01-15',
      category: 'creator',
      goldReward: 75
    },
    {
      id: 'weekly-warrior',
      name: 'Weekly Warrior',
      description: '7-day creation streak',
      icon: 'ri-calendar-check-line',
      color: 'from-orange-400 to-red-400',
      earnedDate: '2024-01-22',
      category: 'streak',
      goldReward: 150
    },
    {
      id: 'community-favorite',
      name: 'Community Favorite',
      description: 'Get 10 likes on a creation',
      icon: 'ri-thumb-up-line',
      color: 'from-blue-400 to-indigo-400',
      earnedDate: '2024-01-18',
      category: 'social',
      goldReward: 100
    },
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Join during beta testing',
      icon: 'ri-rocket-line',
      color: 'from-yellow-400 to-orange-400',
      earnedDate: '2024-01-10',
      category: 'special',
      goldReward: 200
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Rainbow Creator', points: 15420, avatar: '🌈' },
    { rank: 2, name: 'Dragon Master Pro', points: 14280, avatar: '🐉' },
    { rank: 3, name: 'Magic Builder', points: 13950, avatar: '✨' },
    { rank: 4, name: 'You', points: playerStats.dreamPoints, avatar: '👑' },
    { rank: 5, name: 'Unicorn Lover', points: 12650, avatar: '🦄' },
    { rank: 6, name: 'Space Explorer', points: 11890, avatar: '🚀' },
    { rank: 7, name: 'Castle Architect', points: 11230, avatar: '🏰' }
  ];

  const handleClaimReward = (achievement: Achievement) => {
    if (claimedAchievements.has(achievement.id) || !achievement.unlocked) return;

    const newClaimedSet = new Set(claimedAchievements);
    newClaimedSet.add(achievement.id);
    setClaimedAchievements(newClaimedSet);

    // Add gold to player
    onGoldChange(playerStats.dreamPoints + achievement.goldReward);

    // Show reward notification
    setTimeout(() => {
      alert(`🏆 Achievement Unlocked!\n💰 +${achievement.goldReward} Dream Gold earned!`);
    }, 500);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50 shadow-lg';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-yellow-200';
      case 'epic': return 'shadow-purple-200';
      case 'rare': return 'shadow-blue-200';
      default: return '';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creator': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'special': return 'bg-yellow-100 text-yellow-800';
      case 'streak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGoldFromAchievements = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.goldReward, 0);
  const totalGoldFromBadges = badges.reduce((sum, b) => sum + b.goldReward, 0);
  const claimedGold = Array.from(claimedAchievements).reduce((sum, achId) => {
    const ach = achievements.find(a => a.id === achId);
    return sum + (ach ? ach.goldReward : 0);
  }, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer z-10"
      >
        <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
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
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce">
          <i className="ri-trophy-line text-white text-3xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Achievements Tower</h1>
        <p className="text-gray-600">Climb the tower of success and earn amazing gold rewards</p>
      </div>

      {/* Gold Stats */}
      <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Gold Earnings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalGoldFromAchievements.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Available from Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{claimedGold.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Gold Claimed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalGoldFromBadges.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total from Badges</div>
          </div>
        </div>
      </div>

      {/* Player Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-yellow-600">{playerStats.level}</div>
          <div className="text-sm text-gray-600">Level</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-orange-600">{playerStats.dreamPoints.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Gold</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.unlocked).length}</div>
          <div className="text-sm text-gray-600">Unlocked</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg">
          <div className="text-2xl font-bold text-green-600">{badges.length}</div>
          <div className="text-sm text-gray-600">Badges</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {['achievements', 'badges', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} transform transition-all duration-300 hover:scale-105 ${
                achievement.unlocked ? '' : 'grayscale opacity-70'
              }`}
            >
              {/* Rarity & Claim Button */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                  achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                  achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {achievement.rarity}
                </div>
                {achievement.unlocked && !claimedAchievements.has(achievement.id) && (
                  <button
                    onClick={() => handleClaimReward(achievement)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:from-green-600 hover:to-teal-600 transition-all cursor-pointer whitespace-nowrap animate-pulse"
                  >
                    Claim Reward
                  </button>
                )}
                {achievement.unlocked && claimedAchievements.has(achievement.id) && (
                  <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                    Claimed ✓
                  </div>
                )}
                {achievement.unlocked && !claimedAchievements.has(achievement.id) && (
                  <i className="ri-check-line text-green-500 text-xl animate-bounce"></i>
                )}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                achievement.unlocked ? 'animate-pulse' : ''
              }`}>
                <i className={`${achievement.icon} text-white text-2xl`}></i>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>

                {/* Progress Bar */}
                {achievement.maxProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress || 0}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Gold Reward & Date */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1 text-orange-600 font-bold">
                    <i className="ri-coin-line text-sm"></i>
                    <span>{achievement.goldReward}</span>
                  </div>
                  {achievement.unlockedDate && (
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-white/50 text-center hover:scale-105 transition-transform"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}>
                <i className={`${badge.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{badge.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(badge.category)}`}>
                  {badge.category}
                </div>
                <div className="flex items-center space-x-1 text-orange-600 font-bold text-sm">
                  <i className="ri-coin-line"></i>
                  <span>+{badge.goldReward}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Earned: {new Date(badge.earnedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Global Leaderboard</h2>
              <p className="text-yellow-100">Top Dream Creators this month</p>
            </div>
            
            <div className="p-6 space-y-4">
              {leaderboard.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-2xl ${
                    player.name === 'You' 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                      : 'bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    player.rank === 1 ? 'bg-yellow-400 text-yellow-800' :
                    player.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    player.rank === 3 ? 'bg-orange-400 text-orange-800' :
                    player.name === 'You' ? 'bg-purple-400 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                  </div>

                  {/* Avatar */}
                  <div className="text-2xl">{player.avatar}</div>

                  {/* Name & Points */}
                  <div className="flex-1">
                    <div className={`font-bold ${player.name === 'You' ? 'text-purple-800' : 'text-gray-800'}`}>
                      {player.name}
                      {player.name === 'You' && <span className="ml-2 text-purple-600">(You!)</span>}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-1">
                      <i className="ri-coin-line text-orange-500"></i>
                      <span>{player.points.toLocaleString()} Dream Gold</span>
                    </div>
                  </div>

                  {/* Trophy for top 3 */}
                  {player.rank <= 3 && (
                    <div className="animate-bounce">
                      <i className="ri-trophy-line text-yellow-500 text-xl"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-32 right-8 w-12 h-12 bg-yellow-300 rounded-full opacity-20 animate-spin" style={{animationDuration: '15s'}}></div>
      <div className="absolute bottom-32 left-8 w-8 h-8 bg-orange-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute top-1/2 right-16 w-6 h-6 bg-red-300 rounded-full opacity-20 animate-pulse"></div>
    </div>
  );
}
