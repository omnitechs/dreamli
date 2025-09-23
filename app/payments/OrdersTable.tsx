'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  type: 'creation' | 'express_delivery';
  status: 'pending' | 'processing' | 'completed' | 'shipped' | 'delivered' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  memoryName?: string;
  memoryImage?: string;
  childName?: string;
  originalDeliveryDate?: string;
  expeditedDeliveryDate?: string;
  trackingNumber?: string;
  paymentMethod: string;
  sessionId?: string;
}

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
}

export default function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  const [filter, setFilter] = useState<'all' | 'creation' | 'express_delivery'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'creation' ? 'ri-palette-line' : 'ri-rocket-line';
  };

  const getTypeLabel = (type: string) => {
    return type === 'creation' ? 'Memory Creation' : 'Express Delivery';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.type !== filter) return false;
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Orders', icon: 'ri-list-line' },
              { id: 'creation', label: 'Memory Creations', icon: 'ri-palette-line' },
              { id: 'express_delivery', label: 'Express Delivery', icon: 'ri-rocket-line' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setFilter(type.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filter === type.id
                    ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <i className={type.icon}></i>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B9E4C9] pr-8"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Left: Order Info */}
                <div className="flex items-start space-x-4 flex-1">
                  {/* Order Image/Icon */}
                  <div className="flex-shrink-0">
                    {order.memoryImage ? (
                      <img
                        src={order.memoryImage}
                        alt={order.memoryName}
                        className="w-16 h-16 rounded-2xl object-cover object-top"
                      />
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        order.type === 'creation' 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                          : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}>
                        <i className={`${getTypeIcon(order.type)} text-white text-2xl`}></i>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {order.memoryName || getTypeLabel(order.type)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          {getTypeLabel(order.type)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2">
                          <i className="ri-calendar-line"></i>
                          <span>Ordered: {formatDate(order.createdAt)}</span>
                        </div>
                        
                        {order.childName && (
                          <div className="flex items-center space-x-2">
                            <i className="ri-user-heart-line"></i>
                            <span>For: {order.childName}</span>
                          </div>
                        )}

                        {order.trackingNumber && (
                          <div className="flex items-center space-x-2">
                            <i className="ri-truck-line"></i>
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Delivery Info for Express Orders */}
                      {order.type === 'express_delivery' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mt-2">
                          <div className="flex items-center space-x-2 text-orange-700 text-sm">
                            <i className="ri-rocket-line"></i>
                            <span className="font-medium">Express Delivery:</span>
                          </div>
                          <div className="mt-1 text-xs text-orange-600 space-y-1">
                            {order.originalDeliveryDate && (
                              <div>Original: {formatDate(order.originalDeliveryDate)}</div>
                            )}
                            {order.expeditedDeliveryDate && (
                              <div className="font-medium">New Date: {formatDate(order.expeditedDeliveryDate)}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 lg:flex-col lg:space-x-0 lg:space-y-3">
                  <div className="text-right lg:text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {order.currency === 'EUR' ? '€' : '$'}{order.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all cursor-pointer whitespace-nowrap text-sm"
                    >
                      View Details
                    </button>
                    
                    {order.memoryName && (
                      <Link
                        href={`/memory?id=${order.id}`}
                        className="bg-white text-gray-700 px-4 py-2 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap text-sm"
                      >
                        View Memory
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-shopping-bag-line text-3xl text-white"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {filter === 'all' 
              ? "You haven't placed any orders yet. Start creating magical memories!"
              : `No ${getTypeLabel(filter).toLowerCase()} orders found.`
            }
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all cursor-pointer whitespace-nowrap shadow-lg"
          >
            <i className="ri-add-line"></i>
            <span>Create Your First Memory</span>
          </Link>
        </div>
      )}
    </div>
  );
}