import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { logoutUser } from "../lib/authService"
import PaymentSuccessModal from "./PaymentSuccessModal"
import Swal from 'sweetalert2'

const Premium = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        navigate("/login")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#e84797',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })

      if (result.isConfirmed) {
        await logoutUser()
        navigate('/login')
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully logged out!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'An error occurred while logging out.'
      })
    }
  }

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
        <div className="flex items-center gap-3">
          <img src="/footer/finmate.svg" alt="Finmate" className="h-30" />
        </div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-16">
          <Link to="/homepage" className="text-base font-bold text-[#383838]">
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
          <p className="text-xl font-bold text-[#383838] hidden sm:block">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </p>
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src="/profile.svg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Dropdown for logout */}
          <div className="relative profile-dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none">
              <svg
                width={25}
                height={25}
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  d="M7.01563 10.5078L12.0234 15.5L17.0156 10.4922"
                  stroke="black"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-[99999]">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.displayName || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
              Choose the Plan That Fits Your Goals
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
                <p>Track income, expenses, and budgets with ease.</p>
                <p>Perfect for students & beginners.</p>
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
                <p>Access the Wishlist feature, set saving targets, calculate timelines, and make your dream purchases a reality.</p>
                <p>Best for goal-oriented savers.</p>
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
              <span className="text-2xl font-bold text-[#efe]">Choose Plan</span>
            </button>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-[10px] pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Footer with gradient */}
      <footer 
        className="w-full mt-20 py-16 px-4 md:px-8 lg:px-28"
        style={{ background: "linear-gradient(180deg, #E84797 0%, #CB88AA 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info - Left Column */}
            <div className="md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <img src="/footer/footer.svg" alt="Finmate Icon" className="w-24 h-auto" />
              </div>
              <p className="text-white text-base leading-relaxed max-w-md">
                Track your money with ease. Finmate helps you log daily expenses, plan your monthly budget, and keep track of your savings goals.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-4 pt-4">
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Middle Columns - Navigation & Resources */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Home Links */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xl">Home</h3>
                <ul className="space-y-3">
                  <li><Link to="/homepage" className="text-white text-base hover:text-white/80 transition-colors">Income Outcome</Link></li>
                  <li><Link to="/wishlist" className="text-white text-base hover:text-white/80 transition-colors">Wishlist</Link></li>
                  <li><Link to="/chart" className="text-white text-base hover:text-white/80 transition-colors">Chaart</Link></li>
                  <li><Link to="/budget" className="text-white text-base hover:text-white/80 transition-colors">Budget</Link></li>
                </ul>
              </div>

              {/* Resources Links */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xl">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-white text-base hover:text-white/80 transition-colors">Budgeting Tips</a></li>
                  <li><a href="#" className="text-white text-base hover:text-white/80 transition-colors">Saving Strategies</a></li>
                  <li><a href="#" className="text-white text-base hover:text-white/80 transition-colors">Expense Tracker Guide</a></li>
                  <li><a href="#" className="text-white text-base hover:text-white/80 transition-colors">Investment Basics</a></li>
                </ul>
              </div>

              {/* Contact Us */}
              <div className="space-y-6">
                <h3 className="text-white font-bold text-xl">Contact Us</h3>
                <p className="text-white text-base">support@finmate.com</p>
                
                {/* Language Selector */}
                <div className="space-y-3">
                  <label className="text-white font-bold text-base block">Language</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer text-base font-medium">
                    <option value="en">ENGLISH</option>
                    <option value="id">INDONESIAN</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-wrap gap-6 justify-start pt-8">
            <a href="#" className="transform hover:scale-105 transition-transform">
              <img src="/footer/play.svg" alt="Get it on Google Play" className="h-14" />
            </a>
            <a href="#" className="transform hover:scale-105 transition-transform">
              <img src="/footer/apple.svg" alt="Download on the App Store" className="h-14" />
            </a>
          </div>
        </div>
      </footer>

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