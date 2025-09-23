'use client';

interface CouponStatsProps {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUses: number;
  totalSavings: number;
}

export default function CouponStats({ 
  totalCoupons, 
  activeCoupons, 
  expiredCoupons, 
  totalUses, 
  totalSavings 
}: CouponStatsProps) {
  const activeRate = totalCoupons > 0 ? (activeCoupons / totalCoupons) * 100 : 0;
  const avgUsesPerCoupon = totalCoupons > 0 ? totalUses / totalCoupons : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {/* Total Coupons */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <i className="ri-coupon-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{totalCoupons}</h3>
            <p className="text-gray-600 text-sm">Total Coupons</p>
          </div>
        </div>
      </div>

      {/* Active Coupons */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <i className="ri-check-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{activeCoupons}</h3>
            <p className="text-gray-600 text-sm">Active Coupons</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div
                className="bg-green-500 h-1 rounded-full transition-all duration-500"
                style={{ width: `${activeRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Expired/Inactive */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
            <i className="ri-time-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{expiredCoupons}</h3>
            <p className="text-gray-600 text-sm">Expired/Inactive</p>
          </div>
        </div>
      </div>

      {/* Total Uses */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <i className="ri-shopping-cart-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{totalUses.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Total Redemptions</p>
            <p className="text-xs text-gray-500 mt-1">
              {avgUsesPerCoupon.toFixed(1)} avg per coupon
            </p>
          </div>
        </div>
      </div>

      {/* Customer Savings */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <i className="ri-money-dollar-circle-line text-white text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">${totalSavings.toLocaleString()}</h3>
            <p className="text-gray-600 text-sm">Customer Savings</p>
            <p className="text-xs text-gray-500 mt-1">
              ${totalUses > 0 ? (totalSavings / totalUses).toFixed(2) : '0'} avg per use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}