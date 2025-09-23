'use client';

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
  orderItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    return type === 'creation' ? 'Memory Creation' : 'Express Delivery';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderStatusSteps = () => {
    const steps = order.type === 'creation' 
      ? [
          { id: 'pending', label: 'Order Placed', icon: 'ri-check-line' },
          { id: 'processing', label: 'Creating Memory', icon: 'ri-palette-line' },
          { id: 'completed', label: 'Creation Complete', icon: 'ri-star-line' },
          { id: 'shipped', label: 'Shipped', icon: 'ri-truck-line' },
          { id: 'delivered', label: 'Delivered', icon: 'ri-home-line' }
        ]
      : [
          { id: 'pending', label: 'Express Requested', icon: 'ri-rocket-line' },
          { id: 'processing', label: 'Processing', icon: 'ri-settings-line' },
          { id: 'shipped', label: 'Express Shipped', icon: 'ri-speed-line' },
          { id: 'delivered', label: 'Delivered Early', icon: 'ri-medal-line' }
        ];

    const currentStepIndex = steps.findIndex(step => step.id === order.status);
    
    return steps.map((step, index) => {
      const isCompleted = index <= currentStepIndex;
      const isCurrent = index === currentStepIndex;
      const isCancelled = order.status === 'cancelled';
      
      return (
        <div key={step.id} className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            isCancelled && index > 0
              ? 'bg-gray-100 border-gray-300 text-gray-400'
              : isCompleted 
                ? 'bg-green-500 border-green-500 text-white'
                : isCurrent
                  ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                  : 'bg-white border-gray-300 text-gray-400'
          }`}>
            <i className={step.icon}></i>
          </div>
          <span className={`font-medium ${
            isCancelled && index > 0
              ? 'text-gray-400'
              : isCompleted || isCurrent
                ? 'text-gray-800'
                : 'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <p className="text-gray-600">Order #{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-600"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{getTypeLabel(order.type)}</span>
                  </div>
                  
                  {order.memoryName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Memory:</span>
                      <span className="font-medium">{order.memoryName}</span>
                    </div>
                  )}
                  
                  {order.childName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Child:</span>
                      <span className="font-medium">{order.childName}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium">{formatDate(order.updatedAt)}</span>
                  </div>
                  
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking:</span>
                      <span className="font-medium font-mono bg-white px-2 py-1 rounded text-sm">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Express Delivery Info */}
              {order.type === 'express_delivery' && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <h3 className="font-bold text-orange-800 mb-4 flex items-center space-x-2">
                    <i className="ri-rocket-line"></i>
                    <span>Express Delivery Details</span>
                  </h3>
                  <div className="space-y-3 text-orange-700">
                    {order.originalDeliveryDate && (
                      <div className="flex justify-between">
                        <span>Original Delivery:</span>
                        <span className="font-medium">{formatDate(order.originalDeliveryDate)}</span>
                      </div>
                    )}
                    {order.expeditedDeliveryDate && (
                      <div className="flex justify-between">
                        <span>New Delivery Date:</span>
                        <span className="font-bold">{formatDate(order.expeditedDeliveryDate)}</span>
                      </div>
                    )}
                    <div className="bg-orange-100 rounded-xl p-3 mt-3">
                      <div className="flex items-center space-x-2 text-orange-800 text-sm">
                        <i className="ri-time-line"></i>
                        <span className="font-medium">Time Saved:</span>
                        <span>5-7 business days</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center space-x-2">
                    <i className="ri-map-pin-line"></i>
                    <span>Shipping Address</span>
                  </h3>
                  <div className="text-blue-700 space-y-1">
                    <div className="font-medium">{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Memory Image */}
              {order.memoryImage && (
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Memory Preview</h3>
                  <img
                    src={order.memoryImage}
                    alt={order.memoryName}
                    className="w-full h-48 object-cover object-top rounded-xl shadow-lg"
                  />
                </div>
              )}

              {/* Order Status Timeline */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-6">Order Progress</h3>
                <div className="space-y-4">
                  {orderStatusSteps()}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 mb-4 flex items-center space-x-2">
                  <i className="ri-credit-card-line"></i>
                  <span>Payment Details</span>
                </h3>
                <div className="space-y-3 text-green-700">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="text-2xl font-bold">
                      {order.currency === 'EUR' ? '€' : '$'}{order.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  {order.sessionId && (
                    <div className="flex justify-between text-sm">
                      <span>Session ID:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded">
                        {order.sessionId.slice(0, 12)}...
                      </span>
                    </div>
                  )}
                  <div className="bg-green-100 rounded-xl p-3 mt-3">
                    <div className="flex items-center space-x-2 text-green-800 text-sm">
                      <i className="ri-shield-check-line"></i>
                      <span>Payment Confirmed & Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            {order.trackingNumber && (
              <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all cursor-pointer whitespace-nowrap">
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-truck-line"></i>
                  <span>Track Shipment</span>
                </div>
              </button>
            )}
            
            {order.memoryName && (
              <button className="bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 px-6 py-3 rounded-2xl font-medium hover:from-[#FFA0B4] hover:to-[#a8d9b8] transition-all cursor-pointer whitespace-nowrap">
                <div className="flex items-center justify-center space-x-2">
                  <i className="ri-eye-line"></i>
                  <span>View Memory</span>
                </div>
              </button>
            )}
            
            <button className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer whitespace-nowrap">
              <div className="flex items-center justify-center space-x-2">
                <i className="ri-customer-service-line"></i>
                <span>Contact Support</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}