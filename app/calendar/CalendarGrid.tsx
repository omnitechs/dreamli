'use client';

import { useState } from 'react';

interface TimeCapsule {
  id: string;
  productName: string;
  childName: string;
  returnDate: string;
  code: string;
  coverImage: string;
  isActive: boolean;
}

interface CalendarGridProps {
  timeCapsules: TimeCapsule[];
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

export default function CalendarGrid({ timeCapsules, currentDate, onDateSelect, selectedDate }: CalendarGridProps) {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day to display (might be from previous month)
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());
  
  // Get the last day to display (might be from next month)
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  // Generate calendar days
  const calendarDays = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Function to get time capsules for a specific date
  const getTimeCapsules = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return timeCapsules.filter(tc => {
      const returnDateStr = new Date(tc.returnDate).toISOString().split('T')[0];
      return returnDateStr === dateStr;
    });
  };

  // Function to check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Function to check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  // Function to check if date is selected
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (viewMode === 'year') {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{currentDate.getFullYear()}</h2>
          <button
            onClick={() => setViewMode('month')}
            className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Month View
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {months.map((month, index) => {
            const monthDate = new Date(currentDate.getFullYear(), index, 1);
            const monthCapsules = timeCapsules.filter(tc => {
              const tcDate = new Date(tc.returnDate);
              return tcDate.getMonth() === index && tcDate.getFullYear() === currentDate.getFullYear();
            });

            return (
              <div
                key={month}
                onClick={() => {
                  onDateSelect(monthDate);
                  setViewMode('month');
                }}
                className="bg-gray-50/50 rounded-2xl p-4 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800 mb-2">{month}</h3>
                <div className="space-y-1">
                  {monthCapsules.slice(0, 3).map((capsule) => (
                    <div key={capsule.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      <span className="text-xs text-gray-600 truncate">
                        {capsule.productName} - {capsule.childName}
                      </span>
                    </div>
                  ))}
                  {monthCapsules.length > 3 && (
                    <p className="text-xs text-gray-500">+{monthCapsules.length - 3} more</p>
                  )}
                  {monthCapsules.length === 0 && (
                    <p className="text-xs text-gray-400">No time capsules</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => setViewMode('year')}
          className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
        >
          Year View
        </button>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((date, index) => {
          const dayTimeCapsules = getTimeCapsules(date);
          const hasTimeCapsules = dayTimeCapsules.length > 0;
          
          return (
            <div
              key={index}
              onClick={() => onDateSelect(date)}
              className={`
                relative min-h-[120px] p-2 rounded-2xl border-2 cursor-pointer transition-all duration-300
                ${isSelected(date) 
                  ? 'border-[#B9E4C9] bg-gradient-to-br from-[#FFF5F5] to-[#F0F8FF] shadow-lg scale-105' 
                  : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }
                ${!isCurrentMonth(date) ? 'opacity-40' : ''}
                ${isToday(date) ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
              `}
            >
              {/* Date number */}
              <div className={`
                text-sm font-medium mb-2
                ${isToday(date) ? 'text-yellow-600 font-bold' : 'text-gray-800'}
                ${!isCurrentMonth(date) ? 'text-gray-400' : ''}
              `}>
                {date.getDate()}
              </div>

              {/* Time capsules for this date */}
              <div className="space-y-1">
                {dayTimeCapsules.slice(0, 2).map((capsule) => (
                  <div
                    key={capsule.id}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-1.5 text-xs"
                  >
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                      <div className="truncate">
                        <span className="font-medium text-purple-800">{capsule.productName}</span>
                      </div>
                    </div>
                    <div className="text-purple-600 truncate ml-3">
                      for {capsule.childName}
                    </div>
                  </div>
                ))}
                
                {dayTimeCapsules.length > 2 && (
                  <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-1 text-center">
                    +{dayTimeCapsules.length - 2} more
                  </div>
                )}
              </div>

              {/* Today indicator */}
              {isToday(date) && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
              )}

              {/* Has time capsules indicator */}
              {hasTimeCapsules && (
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Time Capsule Return</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 border-2 border-[#B9E4C9] rounded-full"></div>
          <span className="text-sm text-gray-600">Selected Date</span>
        </div>
      </div>
    </div>
  );
}