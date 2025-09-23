'use client';

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

interface CouponListProps {
  coupons: Coupon[];
  onToggleCoupon: (couponId: string) => void;
  onDeleteCoupon: (couponId: string) => void;
}

export default function CouponList({ coupons, onToggleCoupon, onDeleteCoupon }: CouponListProps) {
  const isExpired = (coupon: Coupon) => {
    return coupon.expiresAt && new Date(coupon.expiresAt) <= new Date();
  };

  const isMaxedOut = (coupon: Coupon) => {
    return coupon.maxUses && coupon.uses >= coupon.maxUses;
  };

  const getUsagePercentage = (coupon: Coupon) => {
    if (!coupon.maxUses) return 0;
    return (coupon.uses / coupon.maxUses) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (coupons.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-coupon-line text-3xl text-white"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">No Coupons Found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          No coupons match your current filter. Try adjusting your search or create a new coupon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {coupons.map((coupon) => {
        const expired = isExpired(coupon);
        const maxedOut = isMaxedOut(coupon);
        const usagePercent = getUsagePercentage(coupon);

        return (
          <div key={coupon.id} className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <code className="text-xl font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-xl">
                      {coupon.code}
                    </code>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive && !expired && !maxedOut
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {expired ? 'Expired' : maxedOut ? 'Maxed Out' : coupon.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      coupon.discountType === 'PERCENTAGE'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                        : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}>
                      <i className={`${
                        coupon.discountType === 'PERCENTAGE' ? 'ri-percentage-line' : 'ri-money-dollar-circle-line'
                      } text-white text-xl`}></i>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {coupon.discountType === 'PERCENTAGE' ? 'Percentage off' : 'Fixed amount off'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Progress */}
              {coupon.maxUses && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Usage</span>
                    <span className="text-sm font-medium text-gray-800">
                      {coupon.uses} / {coupon.maxUses}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        usagePercent >= 90 ? 'bg-red-500' :
                        usagePercent >= 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="px-6 pb-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Uses:</span>
                  <span className="font-medium text-gray-800">{coupon.uses.toLocaleString()}</span>
                </div>

                {coupon.minXp && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min XP Required:</span>
                    <span className="font-medium text-gray-800">{coupon.minXp} XP</span>
                  </div>
                )}

                {coupon.expiresAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expires:</span>
                    <span className={`font-medium ${expired ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatDate(coupon.expiresAt)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-800">{formatDate(coupon.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-gray-800">{formatDate(coupon.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => onToggleCoupon(coupon.id)}
                  disabled={expired || maxedOut}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap text-sm ${
                    coupon.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText(coupon.code)}
                  className="bg-blue-100 text-blue-700 py-3 px-4 rounded-2xl font-medium hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                  title="Copy Code"
                >
                  <i className="ri-file-copy-line text-lg"></i>
                </button>

                <button
                  onClick={() => onDeleteCoupon(coupon.id)}
                  className="bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap text-sm"
                  title="Delete Coupon"
                >
                  <i className="ri-delete-bin-line text-lg"></i>
                </button>
              </div>
            </div>

            {/* Special Indicators */}
            {(expired || maxedOut) && (
              <div className="absolute top-4 right-4">
                <div className={`w-3 h-3 rounded-full ${
                  expired ? 'bg-red-500' : 'bg-yellow-500'
                }`} title={expired ? 'Expired' : 'Usage limit reached'}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}