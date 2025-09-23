'use client';

interface PaymentsSummaryProps {
  totalOrders: number;
  totalSpent: number;
  currency: string;
  creationOrders: number;
  expressOrders: number;
  pendingOrders: number;
}

export default function PaymentsSummary({ 
  totalOrders, 
  totalSpent, 
  currency, 
  creationOrders, 
  expressOrders, 
  pendingOrders 
}: PaymentsSummaryProps) {
  const summaryCards = [
    {
      id: 'total-spent',
      title: 'Total Spent',
      value: `${currency === 'EUR' ? '€' : '$'}${totalSpent.toFixed(2)}`,
      icon: 'ri-wallet-line',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700'
    },
    {
      id: 'total-orders',
      title: 'Total Orders',
      value: totalOrders.toString(),
      icon: 'ri-shopping-bag-line',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'memory-creations',
      title: 'Memory Creations',
      value: creationOrders.toString(),
      icon: 'ri-palette-line',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'express-deliveries',
      title: 'Express Deliveries',
      value: expressOrders.toString(),
      icon: 'ri-rocket-line',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br ${card.bgColor} rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                <i className={`${card.icon} text-white text-xl`}></i>
              </div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
            
            <div className={`text-3xl font-bold ${card.textColor} mb-1`}>
              {card.value}
            </div>
            
            <div className={`text-sm font-medium ${card.textColor} opacity-80`}>
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Quick Actions</h3>
            <p className="text-gray-600">Manage your orders and payments</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-4 py-2 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all cursor-pointer whitespace-nowrap shadow-lg text-sm">
              <div className="flex items-center space-x-2">
                <i className="ri-add-line"></i>
                <span>New Memory</span>
              </div>
            </button>
            
            <button className="bg-white text-gray-700 px-4 py-2 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap shadow-lg text-sm">
              <div className="flex items-center space-x-2">
                <i className="ri-download-line"></i>
                <span>Export Orders</span>
              </div>
            </button>
            
            <button className="bg-white text-gray-700 px-4 py-2 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap shadow-lg text-sm">
              <div className="flex items-center space-x-2">
                <i className="ri-customer-service-line"></i>
                <span>Support</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Orders Alert */}
      {pendingOrders > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center animate-pulse">
              <i className="ri-time-line text-white text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-800 mb-1">
                {pendingOrders} Pending Order{pendingOrders > 1 ? 's' : ''}
              </h3>
              <p className="text-yellow-700 text-sm">
                You have orders waiting for processing. Track their progress below.
              </p>
            </div>
            <button className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-2xl font-medium hover:bg-yellow-500 transition-colors cursor-pointer whitespace-nowrap">
              View Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}