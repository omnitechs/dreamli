
'use client';

import Link from 'next/link';

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'refund';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  projectId?: string;
  projectName?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  viewAllHref?: string;
}

export default function TransactionHistory({ transactions, viewAllHref }: TransactionHistoryProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return 'ri-arrow-up-circle-fill text-green-500';
      case 'spent':
        return 'ri-arrow-down-circle-fill text-red-500';
      case 'refund':
        return 'ri-refund-2-fill text-blue-500';
      default:
        return 'ri-exchange-line text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        ) : (
          <span className="text-blue-600 text-sm font-medium opacity-60 cursor-default">View All</span>
        )}
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <i className={`${getTransactionIcon(transaction.type)} text-xl`}></i>
              </div>
              
              <div>
                <div className="font-medium text-gray-900">{transaction.description}</div>
                {transaction.projectName && (
                  <div className="text-sm text-gray-600">Project: {transaction.projectName}</div>
                )}
                <div className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-semibold ${
                transaction.type === 'earned' ? 'text-green-600' : 
                transaction.type === 'spent' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {transaction.type === 'earned' ? '+' : transaction.type === 'spent' ? '-' : '+'}
                {transaction.amount} DC
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-history-line text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">Your transaction history will appear here once you start earning or spending credits.</p>
        </div>
      )}
    </div>
  );
}
