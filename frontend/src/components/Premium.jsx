import { Link } from "react-router-dom"
import { useState } from "react"
import PaymentSuccessModal from "./PaymentSuccessModal"

const Premium = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleChoosePlan = () => {
    setShowPaymentModal(true)
  }
  return (
    <div className="w-full min-h-screen bg-[#efe] relative overflow-hidden">
      {/* Mobile Navigation - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-sm font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-sm font-bold text-[#787575]">Chart</Link>
          <Link to="/budget" className="text-sm font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-sm font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-28 py-8 mt-14 md:mt-0">
        {/* Logo */}
        <div className="w-10 h-10 rounded-full bg-[#d9d9d9]"></div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-16">
          <Link to="/" className="text-base font-bold text-[#383838]">
            Home
          </Link>
          <Link to="/premium" className="text-base font-bold text-[#383838]">
            Premium
          </Link>
          <Link to="/budget" className="text-base font-bold text-[#383838]">
            Budget
          </Link>
          <Link to="/wishlist" className="text-base font-bold text-[#383838]">
            Wishlist
          </Link>
        </nav>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <p className="text-xl font-bold text-[#383838] hidden sm:block">Nina</p>
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src="/profile.svg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-28 py-8 pb-20 md:pb-8">
        {/* Back Button & Title Section */}
        <div className="flex flex-col gap-6 mb-12 animate-slideDown">
          <Link to="/homepage" className="flex items-center justify-center w-10 h-10 rounded-[20px] bg-[#383838] border border-[#efe] cursor-pointer hover:bg-[#525252] transition-all hover:scale-110 hover:rotate-12 shadow-md hover:shadow-xl">
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                d="M5 12.5L11 6.5M5 12.5L11 18.5M5 12.5H19"
                stroke="#EEFFEE"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          
          <div className="max-w-[400px] animate-slideInLeft" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-[#383838] leading-tight hover:scale-105 transition-transform">
              🎯 Choose the Plan That Fits Your Goals
            </h1>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-5 mb-20">
          {/* Starter Plan */}
          <div className="flex flex-col items-center w-full max-w-[355px] h-auto lg:h-[626px] bg-gradient-to-br from-[#94c2da] to-[#7db3d4] rounded-[10px] p-10 gap-10 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group animate-slideUp cursor-pointer">
            <img
              src="/finance_1.png"
              alt="Finance Starter"
              className="w-44 h-44 object-cover group-hover:animate-bounce"
            />
            
            <div className="flex flex-col gap-5 w-full max-w-[272px]">
              <div className="flex items-center gap-5 group-hover:scale-110 transition-transform">
                <h2 className="text-[32px] font-bold text-white">Starter</h2>
                <span className="text-base font-bold text-[#e84797] bg-white/20 px-2 py-1 rounded animate-pulse-slow">
                  Free
                </span>
              </div>
              
              <div className="text-xl text-[#efe] space-y-4 group-hover:scale-105 transition-transform">
                <p>✅ Track income, expenses, and budgets with ease.</p>
                <p>🎓 Perfect for students & beginners.</p>
              </div>
              
              <div className="flex items-center gap-3 group-hover:scale-110 transition-transform">
                <span className="text-[32px] font-bold text-white">0$</span>
                <span className="text-xl text-[#efe]">/Monthly</span>
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-[10px] pointer-events-none"></div>
          </div>

          {/* Elite Plan */}
          <div className="flex flex-col items-center w-full max-w-[355px] h-auto lg:h-[626px] bg-gradient-to-br from-[#94c2da] to-[#7db3d4] rounded-[10px] p-10 gap-10 relative shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group animate-slideUp cursor-pointer" style={{ animationDelay: '0.2s' }}>
            <img
              src="/finance_2.png"
              alt="Finance Elite"
              className="w-44 h-44 object-cover group-hover:animate-bounce"
            />
            
            <div className="flex flex-col gap-5 w-full max-w-[272px]">
              <div className="flex items-center gap-5 group-hover:scale-110 transition-transform">
                <h2 className="text-[32px] font-bold text-white">Elite</h2>
              </div>
              
              <div className="text-xl text-[#efe] space-y-4 group-hover:scale-105 transition-transform">
                <p>🎯 Access the Wishlist feature, set saving targets, calculate timelines, and make your dream purchases a reality.</p>
                <p>💎 Best for goal-oriented savers.</p>
              </div>
              
              <div className="flex items-center gap-3 group-hover:scale-110 transition-transform">
                <span className="text-[32px] font-bold text-white">299$</span>
                <span className="text-xl text-[#efe]">/Monthly</span>
              </div>
            </div>

            {/* Choose Plan Button */}
            <button 
              onClick={handleChoosePlan}
              className="w-[217px] h-14 bg-[#e84797] rounded-[10px] flex items-center justify-center hover:bg-[#d63384] transition-all hover:scale-110 hover:shadow-xl animate-pulse-slow shadow-md"
            >
              <span className="text-2xl font-bold text-[#efe]">✨ Choose Plan</span>
            </button>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-[10px] pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Footer with gradient */}
      <footer 
        className="w-full h-[200px] md:h-[300px] lg:h-[400px] mt-20"
        style={{ background: "linear-gradient(180deg, #E84797 0%, #CB88AA 100%)" }}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        email="nina@gmail.com"
      />
    </div>
  )
}

export default Premium