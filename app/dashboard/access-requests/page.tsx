'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  dreamliId: string;
  dreamliName: string;
  childName: string;
  requestDate: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestType: 'view' | 'edit' | 'admin';
}

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([
    {
      id: 'req-001',
      requesterId: 'user-456',
      requesterName: 'Sarah Johnson',
      requesterEmail: 'sarah.johnson@example.com',
      dreamliId: 'mem-001',
      dreamliName: 'Magische Eenhoorn',
      childName: 'Adam',
      requestDate: '2024-01-15',
      message: 'Hi! I\'m Adam\'s grandmother and would love to see his magical unicorn memories. Could you please grant me access?',
      status: 'pending',
      requestType: 'view'
    },
    {
      id: 'req-002',
      requesterId: 'user-789',
      requesterName: 'Michael Thompson',
      requesterEmail: 'michael.t@example.com',
      dreamliId: 'mem-002',
      dreamliName: 'Dappere Draak',
      childName: 'Emma',
      requestDate: '2024-01-14',
      message: 'Hello! I\'m Emma\'s uncle and I heard about her dragon project. I would love to help add some memories if possible.',
      status: 'pending',
      requestType: 'edit'
    },
    {
      id: 'req-003',
      requesterId: 'user-321',
      requesterName: 'Lisa Chen',
      requesterEmail: 'lisa.chen@example.com',
      dreamliId: 'mem-001',
      dreamliName: 'Magische Eenhoorn',
      childName: 'Adam',
      requestDate: '2024-01-13',
      message: 'Hi there! I\'m Adam\'s teacher and we\'re working on a class project. Could I have viewing access to see his wonderful creation?',
      status: 'approved',
      requestType: 'view'
    },
    {
      id: 'req-004',
      requesterId: 'user-654',
      requesterName: 'David Wilson',
      requesterEmail: 'david.w@example.com',
      dreamliId: 'mem-003',
      dreamliName: 'Wijze Uil',
      childName: 'Lucas',
      requestDate: '2024-01-12',
      message: 'I\'m Lucas\'s father and I\'m traveling. Would love to see his owl project progress remotely.',
      status: 'rejected',
      requestType: 'admin'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setIsProcessing(requestId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update request status
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
        : request
    ));
    
    setIsProcessing(null);
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction(null);
  };

  const openActionModal = (request: AccessRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setModalAction(action);
    setShowModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ri-time-line';
      case 'approved':
        return 'ri-check-line';
      case 'rejected':
        return 'ri-close-line';
      default:
        return 'ri-question-line';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'view':
        return 'ri-eye-line';
      case 'edit':
        return 'ri-edit-line';
      case 'admin':
        return 'ri-admin-line';
      default:
        return 'ri-user-line';
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'view':
        return 'bg-blue-100 text-blue-800';
      case 'edit':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F0F8FF] to-[#F5F5DC]">
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line text-xl text-gray-600"></i>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Access Requests</h1>
                  <p className="text-gray-600">Manage who can access your Dreamlis</p>
                </div>
              </div>

              {pendingCount > 0 && (
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
                  {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <i className="ri-mail-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{requests.length}</h3>
                  <p className="text-gray-600 text-sm">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <i className="ri-time-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{pendingCount}</h3>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{approvedCount}</h3>
                  <p className="text-gray-600 text-sm">Approved</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <i className="ri-close-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{rejectedCount}</h3>
                  <p className="text-gray-600 text-sm">Rejected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 mb-8">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[#FFB6C1] to-[#B9E4C9] text-gray-800 shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Requests ({requests.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  filter === 'pending'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  filter === 'approved'
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  filter === 'rejected'
                    ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
            </div>
          </div>

          {/* Requests List */}
          <div className="space-y-6">
            {filteredRequests.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-inbox-line text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No {filter !== 'all' ? filter + ' ' : ''}requests found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'You haven\'t received any access requests yet.'
                    : `You don't have any ${filter} requests at the moment.`}
                </p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    {/* Request Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="ri-user-line text-white text-xl"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{request.requesterName}</h3>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                              <i className={`${getStatusIcon(request.status)} text-sm`}></i>
                              <span className="capitalize">{request.status}</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getRequestTypeColor(request.requestType)}`}>
                              <i className={`${getRequestTypeIcon(request.requestType)} text-sm`}></i>
                              <span className="capitalize">{request.requestType} Access</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{request.requesterEmail}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Dreamli: <strong>{request.dreamliName}</strong> (for {request.childName})</span>
                            <span>•</span>
                            <span>Requested on {new Date(request.requestDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-gray-50 rounded-2xl p-4 ml-16">
                        <h4 className="font-medium text-gray-800 mb-2">Message from requester:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">"{request.message}"</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {request.status === 'pending' && (
                      <div className="flex space-x-3 lg:ml-6">
                        <button
                          onClick={() => openActionModal(request, 'approve')}
                          disabled={isProcessing === request.id}
                          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-2xl font-medium hover:from-green-500 hover:to-green-700 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center space-x-2">
                            <i className="ri-check-line text-lg"></i>
                            <span>Approve</span>
                          </div>
                        </button>
                        <button
                          onClick={() => openActionModal(request, 'reject')}
                          disabled={isProcessing === request.id}
                          className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-2xl font-medium hover:from-red-500 hover:to-red-700 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center space-x-2">
                            <i className="ri-close-line text-lg"></i>
                            <span>Reject</span>
                          </div>
                        </button>
                      </div>
                    )}

                    {request.status !== 'pending' && (
                      <div className="lg:ml-6">
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          <div className="flex items-center space-x-2">
                            <i className={`${getStatusIcon(request.status)} text-sm`}></i>
                            <span>Request {request.status}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Processing State */}
                  {isProcessing === request.id && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <div className="flex items-center space-x-3">
                        <i className="ri-loader-4-line animate-spin text-blue-600"></i>
                        <span className="text-blue-800 font-medium">Processing request...</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedRequest && modalAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalAction === 'approve' ? 'Approve Access Request' : 'Reject Access Request'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-2xl ${
                  modalAction === 'approve' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <i className={`${modalAction === 'approve' ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'} text-xl`}></i>
                    <div>
                      <h4 className={`font-medium ${modalAction === 'approve' ? 'text-green-800' : 'text-red-800'}`}>
                        {modalAction === 'approve' ? 'Grant Access' : 'Deny Access'}
                      </h4>
                      <p className={`text-sm ${modalAction === 'approve' ? 'text-green-700' : 'text-red-700'}`}>
                        {modalAction === 'approve' 
                          ? `${selectedRequest.requesterName} will be able to ${selectedRequest.requestType} your Dreamli "${selectedRequest.dreamliName}".`
                          : `${selectedRequest.requesterName} will be notified that their request has been declined.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h5 className="font-medium text-gray-800 mb-2">Request Details:</h5>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Requester:</strong> {selectedRequest.requesterName}</p>
                    <p><strong>Email:</strong> {selectedRequest.requesterEmail}</p>
                    <p><strong>Dreamli:</strong> {selectedRequest.dreamliName} (for {selectedRequest.childName})</p>
                    <p><strong>Access Type:</strong> {selectedRequest.requestType}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleAction(selectedRequest.id, modalAction)}
                    disabled={isProcessing === selectedRequest.id}
                    className={`flex-1 ${
                      modalAction === 'approve' 
                        ? 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700' 
                        : 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700'
                    } text-white py-3 rounded-2xl font-medium transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing === selectedRequest.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <i className={`${modalAction === 'approve' ? 'ri-check-line' : 'ri-close-line'}`}></i>
                        <span>{modalAction === 'approve' ? 'Approve Request' : 'Reject Request'}</span>
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isProcessing === selectedRequest.id}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}