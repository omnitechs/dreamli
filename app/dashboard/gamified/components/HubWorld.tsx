
'use client';

import { useState, useEffect } from 'react';

type ActiveZone = 'hub' | 'create' | 'workshop' | 'gallery' | 'achievements' | 'mailbox';

interface HubWorldProps {
  onZoneSelect: (zone: ActiveZone) => void; // Changed from onZoneClick to onZoneSelect
  playerStats: {
    dreamPoints: number;
    level: number;
    nextLevelPoints: number;
    streakDays: number;
    totalCreations: number;
    badges: number;
  };
  onGoldChange?: (newAmount: number) => void; // Added optional prop
}

interface WorldZone {
  id: ActiveZone;
  name: string;
  description: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  isNew?: boolean;
  notification?: number;
}

export default function HubWorld({ onZoneSelect, playerStats, onGoldChange }: HubWorldProps) {
  const [hoveredZone, setHoveredZone] = useState<ActiveZone | null>(null);
  const [clouds, setClouds] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: string;
    duration: string;
  }>>([]);

  // Generate floating clouds
  useEffect(() => {
    const cloudElements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${10 + Math.random() * 30}%`,
      size: `${20 + Math.random() * 40}px`,
      duration: `${30 + Math.random() * 20}s`
    }));
    setClouds(cloudElements);
  }, []);

  const worldZones: WorldZone[] = [
    {
      id: 'create',
      name: 'Create Zone',
      description: 'Start your magical creation journey',
      icon: 'ri-magic-line',
      color: 'from-purple-500 to-pink-500',
      position: { x: 25, y: 35 },
      size: 'large',
      isNew: true
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Discover amazing kits and tools',
      icon: 'ri-hammer-line',
      color: 'from-orange-500 to-red-500',
      position: { x: 60, y: 25 },
      size: 'medium'
    },
    {
      id: 'gallery',
      name: 'Gallery',
      description: 'View your creations and orders',
      icon: 'ri-gallery-line',
      color: 'from-green-500 to-teal-500',
      position: { x: 75, y: 55 },
      size: 'medium'
    },
    {
      id: 'achievements',
      name: 'Achievements Tower',
      description: 'Climb the tower of success',
      icon: 'ri-trophy-line',
      color: 'from-yellow-500 to-orange-500',
      position: { x: 15, y: 65 },
      size: 'large'
    },
    {
      id: 'mailbox',
      name: 'Mailbox',
      description: 'Check your updates and messages',
      icon: 'ri-mail-line',
      color: 'from-pink-500 to-purple-500',
      position: { x: 45, y: 70 },
      size: 'small'
    }
  ];

  const getZoneSize = (size: string) => {
    switch (size) {
      case 'small': return 'w-20 h-20';
      case 'medium': return 'w-24 h-24';
      case 'large': return 'w-28 h-28';
      default: return 'w-24 h-24';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-200 via-sky-100 to-green-200 rounded-3xl overflow-hidden">
      {/* Sky with Clouds */}
      <div className="absolute inset-0" suppressHydrationWarning={true}>
        {clouds.map((cloud) => (
          <div
            key={cloud.id}
            className="absolute bg-white/60 rounded-full opacity-80 animate-float-slow"
            style={{
              left: cloud.x,
              top: cloud.y,
              width: cloud.size,
              height: `calc(${cloud.size} * 0.6)`,
              animationDuration: cloud.duration
            }}
          ></div>
        ))}
      </div>

      {/* Welcome Message */}
      <div className="absolute top-8 left-8 right-8 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-yellow-300">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
              <i className="ri-sun-line text-white text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome to Dreamli World!</h2>
              <p className="text-gray-600">Click on any zone to start your adventure</p>
            </div>
          </div>
        </div>
      </div>

      {/* World Map with Zones */}
      <div className="relative w-full h-full pt-32">
        {worldZones.map((zone) => (
          <div
            key={zone.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${zone.position.x}%`,
              top: `${zone.position.y}%`
            }}
          >
            {/* Zone Button */}
            <button
              onClick={() => onZoneSelect(zone.id)} // Changed from onZoneClick to onZoneSelect
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`relative ${getZoneSize(zone.size)} bg-gradient-to-br ${zone.color} rounded-3xl shadow-2xl border-4 border-white cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-3 group`}
            >
              {/* Zone Icon */}
              <div className="w-full h-full flex items-center justify-center">
                <i className={`${zone.icon} text-white text-3xl group-hover:animate-bounce`}></i>
              </div>

              {/* New Badge */}
              {zone.isNew && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs font-bold">NEW</span>
                </div>
              )}

              {/* Notification Badge - Removed since we cleaned this up */}

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${zone.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>
            </button>

            {/* Zone Info Popup */}
            {hoveredZone === zone.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-30">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border-2 border-gray-200 min-w-[200px] animate-slideUp">
                  <h3 className="font-bold text-gray-800 mb-1">{zone.name}</h3>
                  <p className="text-sm text-gray-600">{zone.description}</p>
                  <div className="mt-2 text-xs text-purple-600 font-medium">Click to explore!</div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-400 to-transparent"></div>
        
        {/* Trees and Decorations */}
        <div className="absolute bottom-4 left-10">
          <div className="w-8 h-16 bg-amber-600 rounded-full"></div>
          <div className="w-16 h-16 bg-green-500 rounded-full -mt-8 mx-auto"></div>
        </div>
        
        <div className="absolute bottom-4 right-20">
          <div className="w-6 h-12 bg-amber-600 rounded-full"></div>
          <div className="w-12 h-12 bg-green-500 rounded-full -mt-6 mx-auto"></div>
        </div>

        {/* Path/Road */}
        <div className="absolute bottom-0 left-0 w-full h-4 bg-yellow-400 opacity-60 rounded-full transform rotate-1"></div>
      </div>

      {/* Recent Activity Panel */}
      <div className="absolute bottom-8 right-8 w-80 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-4 border-blue-300">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <i className="ri-history-line text-blue-500 mr-2"></i>
            Recent Adventures
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <i className="ri-magic-line text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Created Rainbow Dragon</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
              <div className="text-yellow-600 font-bold">+150 ⭐</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-trophy-line text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">Earned "Master Builder" badge</div>
                <div className="text-xs text-gray-500">Yesterday</div>
              </div>
              <div className="text-yellow-600 font-bold">+300 ⭐</div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <i className="ri-fire-line text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">7-day streak achieved!</div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
              <div className="text-yellow-600 font-bold">+500 ⭐</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateX(-20px); }
          50% { transform: translateX(20px); }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-float-slow {
          animation: float-slow var(--duration, 30s) ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
