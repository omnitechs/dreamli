'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PaymentsSummary from './PaymentsSummary';
import OrdersTable from './OrdersTable';
import OrderDetailsModal from './OrderDetailsModal';

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
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export default function PaymentsPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [stars, setStars] = useState<Array<{left: string, top: string, delay: string, duration: string}>>([]);

  // Generate stars only on client side to avoid hydration mismatch
  useEffect(() => {
    const generatedStars = Array.from({ length: 15 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 2}s`
    }));
    setStars(generatedStars);
  }, []);

  // Mock orders data - in real app, this would come from API
  const orders: Order[] = [
    {
      id: 'DRM-2024-001',
      type: 'creation',
      status: 'shipped',
      amount: 29.99,
      currency: 'EUR',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z',
      memoryName: 'Magical Unicorn Adventure',
      memoryImage: 'https://readdy.ai/api/search-image?query=magical%20unicorn%20adventure%20colorful%20fantasy%20children%20drawing%20come%20to%20life%203D%20creation%20beautiful%20sparkles&width=400&height=300&seq=payment1&orientation=landscape',
      childName: 'Emma Thompson',
      paymentMethod: 'Credit Card',
      trackingNumber: 'DRM123456789',
      sessionId: 'cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6',
      shippingAddress: {
        name: 'Sarah Thompson',
        street: '123 Maple Street',
        city: 'Amsterdam',
        postalCode: '1012 AB',
        country: 'Netherlands'
      }
    },
    {
      id: 'EXP-2024-002',
      type: 'express_delivery',
      status: 'delivered',
      amount: 15.99,
      currency: 'EUR',
      createdAt: '2024-01-12T08:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      memoryName: 'Dragon Castle Kingdom',
      childName: 'Lucas Johnson',
      originalDeliveryDate: '2024-01-25T12:00:00Z',
      expeditedDeliveryDate: '2024-01-18T12:00:00Z',
      paymentMethod: 'PayPal',
      trackingNumber: 'EXP987654321',
      sessionId: 'cs_test_z9Y8x7W6v5U4t3S2r1Q0p9O8n7M6',
      shippingAddress: {
        name: 'Michael Johnson',
        street: '456 Oak Avenue',
        city: 'Rotterdam',
        postalCode: '3011 BC',
        country: 'Netherlands'
      }
    },
    {
      id: 'DRM-2024-003',
      type: 'creation',
      status: 'processing',
      amount: 29.99,
      currency: 'EUR',
      createdAt: '2024-01-18T14:22:00Z',
      updatedAt: '2024-01-19T09:30:00Z',
      memoryName: 'Space Explorer Robot',
      memoryImage: 'https://readdy.ai/api/search-image?query=space%20explorer%20robot%20colorful%20children%20drawing%20astronaut%20rocket%20stars%20planets%203D%20creation%20adventure&width=400&height=300&seq=payment2&orientation=landscape',
      childName: 'Olivia Martinez',
      paymentMethod: 'Credit Card',
      sessionId: 'cs_test_f5G6h7I8j9K0l1M2n3O4p5Q6r7S8'
    },
    {
      id: 'EXP-2024-004',
      type: 'express_delivery',
      status: 'processing',
      amount: 15.99,
      currency: 'EUR',
      createdAt: '2024-01-20T11:45:00Z',
      updatedAt: '2024-01-20T16:20:00Z',
      memoryName: 'Fairy Garden Palace',
      childName: 'Sophia Chen',
      originalDeliveryDate: '2024-02-05T12:00:00Z',
      expeditedDeliveryDate: '2024-01-28T12:00:00Z',
      paymentMethod: 'Credit Card',
      sessionId: 'cs_test_t3U4v5W6x7Y8z9A0b1C2d3E4f5G6'
    },
    {
      id: 'DRM-2024-005',
      type: 'creation',
      status: 'pending',
      amount: 29.99,
      currency: 'EUR',
      createdAt: '2024-01-21T16:30:00Z',
      updatedAt: '2024-01-21T16:30:00Z',
      memoryName: 'Rainbow Bridge Adventure',
      memoryImage: 'https://readdy.ai/api/search-image?query=rainbow%20bridge%20adventure%20colorful%20fantasy%20children%20drawing%20magical%20clouds%20sky%203D%20creation%20beautiful%20vibrant&width=400&height=300&seq=payment3&orientation=landscape',
      childName: 'Noah Wilson',
      paymentMethod: 'Credit Card',
      sessionId: 'cs_test_h7I8j9K0l1M2n3O4p5Q6r7S8t9U0'
    }
  ];

  // Calculate summary statistics
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const creationOrders = orders.filter(order => order.type === 'creation').length;
  const expressOrders = orders.filter(order => order.type === 'express_delivery').length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" suppressHydrationWarning={true}>
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-200/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-200/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-200/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Stars */}
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
            <div className="w-1 h-1 bg-yellow-200 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Orders & Payments</h1>
              <p className="text-gray-600">Track your memory creations and express deliveries</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-dashboard-line text-gray-700"></i>
                <span className="text-gray-700 font-medium">Dashboard</span>
              </Link>
              
              <Link
                href="/"
                className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-full font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all duration-300 cursor-pointer whitespace-nowrap shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <i className="ri-add-line"></i>
                  <span>Create New Memory</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Payment Summary */}
          <PaymentsSummary
            totalOrders={totalOrders}
            totalSpent={totalSpent}
            currency="EUR"
            creationOrders={creationOrders}
            expressOrders={expressOrders}
            pendingOrders={pendingOrders}
          />

          {/* Orders Table */}
          <div className="mt-8">
            <OrdersTable
              orders={orders}
              onViewOrder={handleViewOrder}
            />
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-200 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-question-line text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Your Orders?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Have questions about your orders, payments, or delivery? Our support team is here to help you every step of the way.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer whitespace-nowrap shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-customer-service-line"></i>
                    <span>Contact Support</span>
                  </div>
                </Link>
                
                <button className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <i className="ri-phone-line"></i>
                    <span>Call Us: 1-800-DREAMLI</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}