'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalendarGrid from './CalendarGrid';
import CalendarSidebar from './CalendarSidebar';
import TimeCapsuleModal from './TimeCapsuleModal';

interface TimeCapsule {
  id: string;
  productName: string;
  childName: string;
  returnDate: string;
  code: string;
  coverImage: string;
  isActive: boolean;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedCapsule, setSelectedCapsule] = useState<TimeCapsule | null>(null);
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);

  // Mock time capsule data - in a real app, this would come from an API
  const [timeCapsules] = useState<TimeCapsule[]>([
    {
      id: 'tc-001',
      productName: 'Magical Unicorn',
      childName: 'Adam',
      returnDate: '2025-06-15',
      code: 'TC-ADAM-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=cute%20magical%20unicorn%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20pastel%20colors%2C%20dreamy%20atmosphere&width=400&height=300&seq=calendar1&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-002',
      productName: 'Brave Dragon',
      childName: 'Emma',
      returnDate: '2025-03-20',
      code: 'TC-EMMA-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=friendly%20cute%20dragon%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20soft%20green%20and%20blue%20colors%2C%20magical%20atmosphere&width=400&height=300&seq=calendar2&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-003',
      productName: 'Wise Owl',
      childName: 'Lucas',
      returnDate: '2024-12-25',
      code: 'TC-LUCAS-2024',
      coverImage: 'https://readdy.ai/api/search-image?query=adorable%20wise%20owl%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20warm%20brown%20and%20orange%20colors%2C%20cozy%20atmosphere&width=400&height=300&seq=calendar3&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-004',
      productName: 'Rainbow Butterfly',
      childName: 'Sophie',
      returnDate: '2025-01-10',
      code: 'TC-SOPHIE-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=beautiful%20rainbow%20butterfly%20plush%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20vibrant%20rainbow%20colors%2C%20magical%20and%20delicate%20atmosphere&width=400&height=300&seq=calendar4&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-005',
      productName: 'Space Rocket',
      childName: 'Max',
      returnDate: '2025-04-01',
      code: 'TC-MAX-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=colorful%20space%20rocket%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20bright%20red%20and%20blue%20colors%2C%20adventurous%20atmosphere&width=400&height=300&seq=calendar5&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-006',
      productName: 'Fairy Castle',
      childName: 'Lily',
      returnDate: '2025-02-14',
      code: 'TC-LILY-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=magical%20fairy%20castle%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20pink%20and%20purple%20colors%2C%20enchanted%20atmosphere&width=400&height=300&seq=calendar6&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-007',
      productName: 'Pirate Ship',
      childName: 'Jake',
      returnDate: '2025-07-04',
      code: 'TC-JAKE-2025',
      coverImage: 'https://readdy.ai/api/search-image?query=adventurous%20pirate%20ship%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20brown%20and%20gold%20colors%2C%20nautical%20adventure%20atmosphere&width=400&height=300&seq=calendar7&orientation=landscape',
      isActive: true
    },
    {
      id: 'tc-008',
      productName: 'Magic Wand',
      childName: 'Isabella',
      returnDate: '2024-12-31',
      code: 'TC-ISABELLA-2024',
      coverImage: 'https://readdy.ai/api/search-image?query=sparkling%20magic%20wand%20toy%20on%20white%20background%2C%20studio%20lighting%2C%20product%20photography%2C%20gold%20and%20purple%20colors%2C%20mystical%20atmosphere&width=400&height=300&seq=calendar8&orientation=landscape',
      isActive: true
    }
  ]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 20 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 2}s`
    }));
    setStars(generatedStars);
  }, []);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setFullYear(prev.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // If the selected date is in a different month, navigate to that month
    if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const handleTimeCapsuleClick = (capsule: TimeCapsule) => {
    setSelectedCapsule(capsule);
  };

  const getStats = () => {
    const today = new Date();
    const thisMonth = timeCapsules.filter(tc => {
      const tcDate = new Date(tc.returnDate);
      return tcDate.getMonth() === today.getMonth() && tcDate.getFullYear() === today.getFullYear();
    }).length;

    const upcoming30Days = timeCapsules.filter(tc => {
      const tcDate = new Date(tc.returnDate);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return tcDate >= today && tcDate <= thirtyDaysFromNow;
    }).length;

    return {
      total: timeCapsules.length,
      thisMonth,
      upcoming30Days
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
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
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Time Capsule Calendar</h1>
              <p className="text-gray-600">Track when your magical time capsules will return</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-dashboard-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Dashboard</span>
              </Link>
              
              <Link
                href="/"
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-home-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Home</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <i className="ri-archive-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                  <p className="text-gray-600 text-sm">Total Time Capsules</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                  <i className="ri-calendar-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.thisMonth}</h3>
                  <p className="text-gray-600 text-sm">This Month</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
                  <i className="ri-time-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.upcoming30Days}</h3>
                  <p className="text-gray-600 text-sm">Next 30 Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <button
                onClick={() => navigateYear('prev')}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-skip-back-line text-gray-700"></i>
              </button>
              <button
                onClick={() => navigateMonth('prev')}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-700"></i>
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-arrow-right-line text-gray-700"></i>
              </button>
              <button
                onClick={() => navigateYear('next')}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-skip-forward-line text-gray-700"></i>
              </button>
            </div>

            <button
              onClick={goToToday}
              className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <i className="ri-today-line text-lg"></i>
                <span>Today</span>
              </div>
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <CalendarGrid
                timeCapsules={timeCapsules}
                currentDate={currentDate}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CalendarSidebar
                selectedDate={selectedDate}
                timeCapsules={timeCapsules}
                onTimeCapsuleClick={handleTimeCapsuleClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Capsule Modal */}
      <TimeCapsuleModal
        capsule={selectedCapsule}
        onClose={() => setSelectedCapsule(null)}
      />
    </div>
  );
}