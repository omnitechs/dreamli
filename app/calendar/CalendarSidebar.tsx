'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TimeCapsule {
  id: string;
  productName: string;
  childName: string;
  returnDate: string;
  code: string;
  coverImage: string;
  isActive: boolean;
}

interface CalendarSidebarProps {
  selectedDate?: Date;
  timeCapsules: TimeCapsule[];
  onTimeCapsuleClick: (capsule: TimeCapsule) => void;
}

export default function CalendarSidebar({ selectedDate, timeCapsules, onTimeCapsuleClick }: CalendarSidebarProps) {
  // Get time capsules for selected date
  const selectedDateCapsules = selectedDate 
    ? timeCapsules.filter(tc => {
        const tcDate = new Date(tc.returnDate);
        const selDate = new Date(selectedDate);
        return tcDate.toDateString() === selDate.toDateString();
      })
    : [];

  // Get upcoming time capsules (next 30 days)
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const upcomingCapsules = timeCapsules
    .filter(tc => {
      const tcDate = new Date(tc.returnDate);
      return tcDate >= today && tcDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime());

  // Get all time capsules sorted by date
  const allCapsules = [...timeCapsules]
    .sort((a, b) => new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime());

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const returnDate = new Date(dateStr);
    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date < today;
  };

  return (
    <div className="space-y-6">
      {/* Selected Date Section */}
      {selectedDate && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center">
              <i className="ri-calendar-line text-white text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Selected Date</h3>
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {selectedDateCapsules.length > 0 ? (
            <div className="space-y-3">
              {selectedDateCapsules.map((capsule) => (
                <div
                  key={capsule.id}
                  onClick={() => onTimeCapsuleClick(capsule)}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={capsule.coverImage}
                      alt={capsule.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-800">{capsule.productName}</h4>
                      <p className="text-sm text-purple-600">for {capsule.childName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <i className="ri-key-line text-xs text-purple-500"></i>
                        <code className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
                          {capsule.code}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <i className="ri-calendar-line text-2xl mb-2"></i>
              <p className="text-sm">No time capsules return on this date</p>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Time Capsules */}
      {upcomingCapsules.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FFB067] to-[#F3E8FF] rounded-full flex items-center justify-center">
              <i className="ri-time-line text-white text-lg"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Upcoming Returns</h3>
              <p className="text-sm text-gray-600">Next 30 days</p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingCapsules.slice(0, 5).map((capsule) => (
              <div
                key={capsule.id}
                onClick={() => onTimeCapsuleClick(capsule)}
                className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                  isToday(capsule.returnDate)
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 hover:from-yellow-100 hover:to-orange-100'
                    : 'bg-gray-50/50 border-gray-200 hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={capsule.coverImage}
                    alt={capsule.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{capsule.productName}</h4>
                    <p className="text-sm text-gray-600">for {capsule.childName}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{formatDate(capsule.returnDate)}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isToday(capsule.returnDate)
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getDaysUntil(capsule.returnDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {upcomingCapsules.length > 5 && (
              <p className="text-center text-sm text-gray-500 pt-2">
                +{upcomingCapsules.length - 5} more upcoming
              </p>
            )}
          </div>
        </div>
      )}

      {/* All Time Capsules */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <i className="ri-archive-line text-white text-lg"></i>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">All Time Capsules</h3>
            <p className="text-sm text-gray-600">{allCapsules.length} total</p>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {allCapsules.map((capsule) => (
            <div
              key={capsule.id}
              onClick={() => onTimeCapsuleClick(capsule)}
              className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                isPast(capsule.returnDate)
                  ? 'bg-gray-50 hover:bg-gray-100 opacity-75'
                  : 'bg-purple-50/50 hover:bg-purple-100/50'
              }`}
            >
              <Image
                src={capsule.coverImage}
                alt={capsule.title}
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 truncate text-sm">{capsule.productName}</h4>
                <p className="text-xs text-gray-600">for {capsule.childName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{formatDate(capsule.returnDate)}</p>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isPast(capsule.returnDate)
                    ? 'bg-gray-200 text-gray-600'
                    : isToday(capsule.returnDate)
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {getDaysUntil(capsule.returnDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}