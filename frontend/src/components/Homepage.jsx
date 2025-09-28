import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 font-nunito">
      {/* Header - centered as requested */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">MoneySafe</h1>
        <p className="text-xl text-gray-600 text-center">Turn good habits into smart saving</p>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Income/Outcome Card */}
          <div className="relative flex items-center justify-between min-h-[200px]">
            <div className="text-left pr-4 max-w-[280px] z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Income & Outcome</h3>
              <p className="text-gray-600">Track your daily expenses and income with ease</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐻</span>
              </div>
            </div>
          </div>

          {/* Wishlist Card */}
          <div className="relative flex items-center justify-between min-h-[200px]">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-pink-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐱</span>
              </div>
            </div>
            <div className="text-right pl-4 max-w-[280px] ml-auto z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Wishlist</h3>
              <p className="text-gray-600">Save for the things you want most</p>
            </div>
          </div>

          {/* Chart Card - Enhanced visibility for text */}
          <div className="relative flex items-center justify-between min-h-[200px]">
            <div className="text-left pr-6 max-w-[280px] z-10 bg-white/90 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Charts & Analytics</h3>
              <p className="text-gray-600">Visualize your spending patterns and financial growth</p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-green-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="relative flex items-center justify-between min-h-[200px]">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-yellow-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="text-right pl-4 max-w-[280px] ml-auto z-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Budget Planning</h3>
              <p className="text-gray-600">Plan your monthly budget effectively</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500">Start your financial journey today</p>
      </div>
    </div>
  );
};

export default Homepage;