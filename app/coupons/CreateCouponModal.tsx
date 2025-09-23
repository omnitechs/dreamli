'use client';

import { useState } from 'react';

interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minXp?: number;
  maxUses?: number;
  expiresAt?: string;
  isActive: boolean;
}

interface CreateCouponModalProps {
  onClose: () => void;
  onCreate: (coupon: Coupon) => void;
}

export default function CreateCouponModal({ onClose, onCreate }: CreateCouponModalProps) {
  const [formData, setFormData] = useState<Coupon>({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minXp: undefined,
    maxUses: undefined,
    expiresAt: undefined,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      newErrors.code = 'Code must be at least 3 characters';
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only uppercase letters and numbers';
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    } else if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    if (formData.minXp !== undefined && formData.minXp < 0) {
      newErrors.minXp = 'Minimum XP cannot be negative';
    }

    if (formData.maxUses !== undefined && formData.maxUses <= 0) {
      newErrors.maxUses = 'Maximum uses must be greater than 0';
    }

    if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
      newErrors.expiresAt = 'Expiration date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        minXp: formData.minXp || undefined,
        maxUses: formData.maxUses || undefined,
        expiresAt: formData.expiresAt || undefined
      };
      onCreate(couponData);
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Create New Coupon</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Enter coupon code"
                  className={`flex-1 px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm font-mono ${
                    errors.code ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="px-4 py-3 bg-purple-100 text-purple-700 rounded-2xl hover:bg-purple-200 transition-colors cursor-pointer whitespace-nowrap"
                  title="Generate Random Code"
                >
                  <i className="ri-refresh-line"></i>
                </button>
              </div>
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              )}
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm pr-8"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max={formData.discountType === 'PERCENTAGE' ? '100' : undefined}
                    step={formData.discountType === 'PERCENTAGE' ? '1' : '0.01'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm ${
                      errors.discountValue ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">
                      {formData.discountType === 'PERCENTAGE' ? '%' : '$'}
                    </span>
                  </div>
                </div>
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
                )}
              </div>
            </div>

            {/* Requirements & Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum XP Required
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minXp || ''}
                  onChange={(e) => setFormData({ ...formData, minXp: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="No minimum (optional)"
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm ${
                    errors.minXp ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.minXp && (
                  <p className="text-red-500 text-xs mt-1">{errors.minXp}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Uses
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Unlimited (optional)"
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm ${
                    errors.maxUses ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.maxUses && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxUses}</p>
                )}
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                min={minDate}
                max={maxDateStr}
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value || undefined })}
                className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-[#B9E4C9] focus:border-[#B9E4C9] outline-none transition-colors text-sm ${
                  errors.expiresAt ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.expiresAt && (
                <p className="text-red-500 text-xs mt-1">{errors.expiresAt}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for no expiration date
              </p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                  formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
              <span className="text-sm text-gray-700">
                {formData.isActive ? 'Active immediately' : 'Create as inactive'}
              </span>
            </div>

            {/* Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <i className="ri-eye-line text-blue-600 text-xl"></i>
                <h4 className="font-semibold text-blue-800">Coupon Preview</h4>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <code className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                      {formData.code || 'YOUR_CODE'}
                    </code>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.discountType === 'PERCENTAGE' 
                        ? `Get ${formData.discountValue}% off your order`
                        : `Save $${formData.discountValue} on your purchase`
                      }
                    </p>
                    {formData.minXp && (
                      <p className="text-xs text-purple-600 mt-1">
                        Requires {formData.minXp} XP to redeem
                      </p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    formData.discountType === 'PERCENTAGE'
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  }`}>
                    <i className={`${
                      formData.discountType === 'PERCENTAGE' ? 'ri-percentage-line' : 'ri-money-dollar-circle-line'
                    } text-white text-xl`}></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 py-4 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}