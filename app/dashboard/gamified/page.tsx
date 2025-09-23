
'use client';

import { useState, useCallback } from 'react';
import GameHeader from './components/GameHeader';
import GameSidebar from './components/GameSidebar';
import HubWorld from './components/HubWorld';
import CreateZone from './components/CreateZone';
import Workshop from './components/Workshop';
import Gallery from './components/Gallery';
import AchievementsTower from './components/AchievementsTower';
import Mailbox from './components/Mailbox';

export default function GamifiedDashboard() {
  const [activeZone, setActiveZone] = useState('hub');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Player stats with gold management
  const [playerStats, setPlayerStats] = useState({
    dreamPoints: 1250, // This is actually gold (1 euro = 10 gold)
    level: 7,
    nextLevelPoints: 1500,
    streakDays: 12,
    totalCreations: 8,
    badges: 12
  });

  // Handle gold changes from various sources
  const handleGoldChange = useCallback((newAmount: number) => {
    setPlayerStats(prev => ({
      ...prev,
      dreamPoints: Math.max(0, newAmount) // Prevent negative gold
    }));
  }, []);

  const handleZoneChange = (zone: string) => {
    setActiveZone(zone);
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const renderActiveZone = () => {
    switch (activeZone) {
      case 'create':
        return (
          <CreateZone 
            onBack={() => setActiveZone('hub')} 
            playerStats={playerStats}
            onGoldChange={handleGoldChange}
          />
        );
      case 'workshop':
        return <Workshop onBack={() => setActiveZone('hub')} />;
      case 'gallery':
        return (
          <Gallery 
            onBack={() => setActiveZone('hub')} 
            playerStats={playerStats}
            onGoldChange={handleGoldChange}
          />
        );
      case 'achievements':
        return (
          <AchievementsTower 
            onBack={() => setActiveZone('hub')} 
            playerStats={playerStats}
            onGoldChange={handleGoldChange}
          />
        );
      case 'mailbox':
        return <Mailbox onBack={() => setActiveZone('hub')} />;
      default:
        return (
          <HubWorld 
            onZoneSelect={handleZoneChange} 
            playerStats={playerStats}
            onGoldChange={handleGoldChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-green-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating clouds */}
        <div className="absolute top-10 left-20 w-32 h-20 bg-white/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-32 right-32 w-24 h-16 bg-white/20 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-40 left-40 w-28 h-18 bg-white/25 rounded-full blur-xl animate-float-slow"></div>
        
        {/* Sparkles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-40 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle-delayed"></div>
        <div className="absolute bottom-60 left-1/3 w-2.5 h-2.5 bg-purple-400 rounded-full animate-twinkle-slow"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-twinkle"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-10 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rotate-45 opacity-30 animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-6 h-6 bg-gradient-to-r from-blue-400 to-green-400 opacity-25 animate-bounce-slow"></div>
      </div>

      {/* Header */}
      <GameHeader 
        playerStats={playerStats} 
        onProfileClick={handleProfileClick}
        onCartClick={handleCartClick}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        <GameSidebar
          activeZone={activeZone}
          onZoneChange={handleZoneChange}
          playerStats={playerStats}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="h-full">
            {renderActiveZone()}
          </div>
        </div>
      </div>
    </div>
  );
}
