'use client';

import { useState } from 'react';
import Link from 'next/link';
import CouponList from './CouponList';
import CreateCouponModal from './CreateCouponModal';
import CouponStats from './CouponStats';

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minXp?: number;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'expired' | 'analytics'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'coup-001',
      code: 'WELCOME25',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minXp: 0,
      maxUses: 100,
      uses: 42,
      expiresAt: '2024-12-31',
      isActive: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-11-15'
    },
    {
      id: 'coup-002',
      code: 'SAVE10NOW',
      discountType: 'FIXED',
      discountValue: 10,
      minXp: 50,
      maxUses: 500,
      uses: 287,
      expiresAt: '2024-11-30',
      isActive: true,
      createdAt: '2024-02-10',
      updatedAt: '2024-11-10'
    },
    {
      id: 'coup-003',
      code: 'PREMIUM50',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      minXp: 200,
      maxUses: 50,
      uses: 33,
      expiresAt: '2025-03-15',
      isActive: true,
      createdAt: '2024-03-01',
      updatedAt: '2024-10-20'
    },
    {
      id: 'coup-004',
      code: 'EXPIRED20',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minXp: 0,
      maxUses: 200,
      uses: 156,
      expiresAt: '2024-10-15',
      isActive: false,
      createdAt: '2024-08-01',
      updatedAt: '2024-10-15'
    },
    {
      id: 'coup-005',
      code: 'FREESHIP',
      discountType: 'FIXED',
      discountValue: 5,
      minXp: 25,
      uses: 1247,
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-11-14'
    }
  ]);

  const handleCreateCoupon = (newCoupon: Omit<Coupon, 'id' | 'uses' | 'createdAt' | 'updatedAt'>) => {
    const coupon: Coupon = {
      ...newCoupon,
      id: `coup-${Date.now()}`,
      uses: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCoupons([coupon, ...coupons]);
    setShowCreateModal(false);
  };

  const handleToggleCoupon = (couponId: string) => {
    setCoupons(coupons.map(coupon =>
      coupon.id === couponId
        ? { ...coupon, isActive: !coupon.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : coupon
    ));
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons(coupons.filter(coupon => coupon.id !== couponId));
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'active':
        return matchesSearch && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date());
      case 'expired':
        return matchesSearch && (!coupon.isActive || (coupon.expiresAt && new Date(coupon.expiresAt) <= new Date()));
      default:
        return matchesSearch;
    }
  });

  const activeCoupons = coupons.filter(c => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date()));
  const expiredCoupons = coupons.filter(c => !c.isActive || (c.expiresAt && new Date(c.expiresAt) <= new Date()));
  const totalUses = coupons.reduce((sum, c) => sum + c.uses, 0);
  const totalSavings = coupons.reduce((sum, c) => {
    if (c.discountType === 'FIXED') {
      return sum + (c.discountValue * c.uses);
    } else {
      return sum + (c.uses * 20); // Estimated average order value calculation
    }
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-green-200 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Coupon Management</h1>
              <p className="text-gray-600">Create and manage discount coupons for your customers</p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <i className="ri-arrow-left-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Admin</span>
              </Link>

              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-add-line text-lg"></i>
                  <span>Create Coupon</span>
                </div>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <CouponStats
            totalCoupons={coupons.length}
            activeCoupons={activeCoupons.length}
            expiredCoupons={expiredCoupons.length}
            totalUses={totalUses}
            totalSavings={totalSavings}
          />

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50 inline-flex">
              {[
                { id: 'overview', label: 'All Coupons', icon: 'ri-coupon-line', count: coupons.length },
                { id: 'active', label: 'Active', icon: 'ri-check-line', count: activeCoupons.length },
                { id: 'expired', label: 'Expired', icon: 'ri-time-line', count: expiredCoupons.length },
                { id: 'analytics', label: 'Analytics', icon: 'ri-bar-chart-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`${tab.icon} text-lg`}></i>
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        activeTab === tab.id
                          ? 'bg-white/50 text-gray-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          {activeTab !== 'analytics' && (
            <div className="mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-gray-400 text-lg"></i>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search coupons by code..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {activeTab === 'analytics' ? (
            <div className="space-y-8">
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <i className="ri-coupon-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{totalUses}</h3>
                      <p className="text-gray-600 text-sm">Total Redemptions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <i className="ri-money-dollar-circle-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">${totalSavings.toFixed(0)}</h3>
                      <p className="text-gray-600 text-sm">Customer Savings</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                      <i className="ri-percentage-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{((activeCoupons.length / coupons.length) * 100).toFixed(0)}%</h3>
                      <p className="text-gray-600 text-sm">Active Rate</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{(totalUses / coupons.length).toFixed(1)}</h3>
                      <p className="text-gray-600 text-sm">Avg Uses per Coupon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Coupons */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Performing Coupons</h2>
                <div className="space-y-4">
                  {[...coupons]
                    .sort((a, b) => b.uses - a.uses)
                    .slice(0, 5)
                    .map((coupon, index) => (
                      <div key={coupon.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800">{coupon.code}</h3>
                            <p className="text-sm text-gray-600">
                              {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% off` : `$${coupon.discountValue} off`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">{coupon.uses}</p>
                          <p className="text-sm text-gray-600">uses</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <CouponList
              coupons={filteredCoupons}
              onToggleCoupon={handleToggleCoupon}
              onDeleteCoupon={handleDeleteCoupon}
            />
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <CreateCouponModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCoupon}
        />
      )}
    </div>
  );
}