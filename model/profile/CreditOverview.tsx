
'use client';

interface CreditOverviewProps {
  credits: {
    current: number;
    earned: number;
    spent: number;
  };
}

export default function CreditOverview({ credits }: CreditOverviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Credit Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-wallet-3-line text-green-600 text-xl"></i>
          </div>
          <div className="text-2xl font-bold text-green-600">{credits.current} DC</div>
          <div className="text-sm text-gray-600">Current Balance</div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-arrow-up-circle-line text-blue-600 text-xl"></i>
          </div>
          <div className="text-2xl font-bold text-blue-600">{credits.earned} DC</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-arrow-down-circle-line text-red-600 text-xl"></i>
          </div>
          <div className="text-2xl font-bold text-red-600">{credits.spent} DC</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
      </div>
    </div>
  );
}
