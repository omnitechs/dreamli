"use client";

import { useState } from "react";
import ProfileHeader from "@/model/profile/ProfileHeader";
import EditProfileModal from "@/model/profile/EditProfileModal";
import CreditOverview from "@/model/profile/CreditOverview";
import TransactionHistory from "@/model/profile/TransactionHistory";
import UserProjects from "@/model/profile/UserProjects";

export type ProfileUserView = {
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

export type ProfileCredits = {
  current: number;
  earned: number;
  spent: number;
};

export type ProfileTransaction = {
  id: string;
  type: 'earned' | 'spent' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  projectId?: string;
  projectName?: string;
};

export type ProfileProject = {
  id: string;
  name: string;
  thumbnail: string;
  likes: number;
  views: number;
  comments: number;
  createdAt: string;
  isPublic: boolean;
  representativeModelId?: string;
  userLiked?: boolean;
};

export default function ProfileClient({ initialUser, initialCredits, initialTransactions, initialProjects, baseLang }: { initialUser: ProfileUserView; initialCredits: ProfileCredits; initialTransactions: ProfileTransaction[]; initialProjects: ProfileProject[]; baseLang: string }) {
  const [user, setUser] = useState<ProfileUserView>(initialUser);
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState<ProfileCredits>(initialCredits);
  const [transactions, setTransactions] = useState<ProfileTransaction[]>(initialTransactions);
  const [projects, setProjects] = useState<ProfileProject[]>(initialProjects);

  async function handleSave(data: { username: string; bio: string; avatar: string }) {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data.username, bio: data.bio, image: data.avatar }),
      });
      const js = await res.json();
      if (!res.ok) {
        // Optionally display error UI; keep local state unchanged
        console.error('Failed to save profile', js?.error || js);
        return;
      }
      setUser(prev => ({
        ...prev,
        username: data.username || prev.username,
        bio: data.bio ?? prev.bio,
        avatar: data.avatar || prev.avatar,
      }));
    } catch (e) {
      console.error('Save profile failed', e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProfileHeader user={user} isOwnProfile={true} onEditProfile={() => setOpen(true)} />

        <CreditOverview credits={credits} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TransactionHistory transactions={transactions} viewAllHref={`/${baseLang}/auth/account/credits`} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <a href={`/${baseLang}/ai`} className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-add-line text-blue-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Create New Project</div>
                  <div className="text-sm text-gray-600">Start a new AI-generated 3D model</div>
                </div>
              </a>

              <a href={`/${baseLang}/marketplace`} className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-upload-line text-green-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Upload Model</div>
                  <div className="text-sm text-gray-600">Share your own 3D creations</div>
                </div>
              </a>

              <a href={`/${baseLang}/marketplace`} className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-store-line text-purple-600"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Browse Marketplace</div>
                  <div className="text-sm text-gray-600">Discover amazing community projects</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <UserProjects projects={projects as any} isOwnProfile={true} baseLang={baseLang} />

        <EditProfileModal isOpen={open} onClose={() => setOpen(false)} user={{ username: user.username, bio: user.bio, avatar: user.avatar }} onSave={handleSave} />
      </div>
    </div>
  );
}
