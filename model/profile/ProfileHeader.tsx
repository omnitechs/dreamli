
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    email: string;
    bio: string;
    avatar: string;
    joinDate: string;
    totalProjects: number;
    totalLikes: number;
    totalViews: number;
  };
  isOwnProfile: boolean;
  onEditProfile?: () => void;
}

export default function ProfileHeader({ user, isOwnProfile, onEditProfile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={user.avatar}
              alt={user.username}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              {user.bio && (
                <p className="text-gray-700 mt-2 max-w-2xl">{user.bio}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            {isOwnProfile && (
              <button
                onClick={onEditProfile}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.totalProjects}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.totalLikes}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
