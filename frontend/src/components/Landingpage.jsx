import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import Swal from 'sweetalert2'
import { useAuthStore } from "../stores"

const Landingpage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const sectionRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const isVisible = (id) => visibleSections.has(id)

  // ada annimasi lottie nih
  const showLoginPopup = () => {
  Swal.fire({
      title: 'Oops!',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
          <div id="lottie-container" style="width: 250px; height: 250px;"></div>
          <p style="font-size: 18px; color: #383838; font-weight: 600; margin: 0;">
            Anda harus login terlebih dahulu!
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#e84797',
      cancelButtonColor: '#94c2da',
      confirmButtonText: 'Login Sekarang',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-6 py-3 rounded-full font-semibold',
        cancelButton: 'px-6 py-3 rounded-full font-semibold'
      },
      background: '#EEFFEE',
      didOpen: () => {
        // Load Lottie library and animation
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js';
        script.onload = () => {
          if (window.bodymovin) {
            window.bodymovin.loadAnimation({
              container: document.getElementById('lottie-container'),
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: '/Prepare Food.json'
            });
          }
        };
        document.head.appendChild(script);
      },
      showClass: {
        popup: 'animate__animated animate__bounceIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/login');
      }
    });
  };

  // Handle navigation with auth check
  const handleNavClick = (path, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showLoginPopup();
    } else {
      navigate(path);
    }
  };

  return (
    <div className="bg-[#eeffee] min-h-screen relative overflow-x-hidden">
      {/* Header */}
      <header 
        className="relative z-10 flex items-center justify-between px-4 md:px-8 lg:px-16 py-8 transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      >
        {/* Logo */}
        <Link to="/" className="transform transition-all duration-300 hover:scale-110">
          <img 
            src="/footer/finmate.svg" 
            alt="Finmate Logo" 
            className="h-45 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-16">
          <div className="flex gap-16">
            <a 
              href="#" 
              onClick={(e) => handleNavClick('/homepage', e)}
              className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3 cursor-pointer"
            >
              Home
            </a>
            <a 
              href="#" 
              onClick={(e) => handleNavClick('/chart', e)}
              className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3 cursor-pointer"
            >
              Chart
            </a>
            <a 
              href="#" 
              onClick={(e) => handleNavClick('/budget', e)}
              className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3 cursor-pointer"
            >
              Budget
            </a>
            <a 
              href="#" 
              onClick={(e) => handleNavClick('/wishlist', e)}
              className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3 cursor-pointer"
            >
              Wishlist
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col transform transition-all duration-300 hover:scale-105">
              <span className="text-[#383838] font-bold text-xl">Login</span>
              <div className="h-0.5 bg-[#e84797] shadow-md transform -rotate-[0.106deg]"></div>
            </div>
            <Link to="/register" className="text-[#383838] font-bold text-xl hover:text-[#e84797] transition-all duration-300 transform hover:scale-110 hover:rotate-3">Sign up</Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#383838] transform transition-all duration-300 hover:scale-110 hover:rotate-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 lg:px-16 pb-40 mb-20">
        {/* Hero Section */}
        <section 
          id="hero"
          ref={(el) => (sectionRefs.current.hero = el)}
          className="flex flex-col lg:flex-row items-start gap-8 mb-24"
        >
          <div 
            className={`flex-1 max-w-[704px] transition-all duration-1000 ease-out ${
              isVisible('hero') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}
            style={{
              transform: `translateX(${-scrollY * 0.1}px)`
            }}
          >
            <div className="rounded-full px-6 py-2 inline-block mb-10 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3 bg-gradient-to-r from-[#4e7cb2] via-[#cb88aa] to-[#e84797] animate-gradient">
              <span className="text-[#eeffee] font-bold text-base drop-shadow-lg">Welcome</span>
            </div>

            <h1 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
              <span className="inline-block transform hover:rotate-2 hover:text-[#e84797] transition-all duration-300 drop-shadow-sm">Manage</span>{' '}
              <span className="inline-block transform hover:rotate-2 hover:text-[#e84797] transition-all duration-300 drop-shadow-sm">your</span>{' '}
              <span className="inline-block transform hover:rotate-2 hover:text-[#e84797] transition-all duration-300 drop-shadow-sm">money,</span>{' '}
              <span className="inline-block transform hover:rotate-2 hover:text-[#e84797] transition-all duration-300 drop-shadow-sm">grow</span>{' '}
              <span className="inline-block animate-pulse-slow text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] to-[#4e7cb2] drop-shadow-lg font-extrabold">your</span>{' '}
              <span className="inline-block animate-pulse-slow text-transparent bg-clip-text bg-gradient-to-r from-[#4e7cb2] to-[#e84797] drop-shadow-lg font-extrabold">future</span>
            </h1>

            <p className="text-[#383838] text-lg md:text-xl mb-10 max-w-[527px] leading-relaxed transform transition-all duration-300 hover:scale-105 hover:text-[#e84797] drop-shadow-sm">
              Track your money with ease. Moneyers, helps you log daily expenses, plan your monthly budget, and keep track
              of your savings goals.
            </p>

            <Link to="/register" className="bg-[#e84797] text-[#eeffee] font-bold text-xl md:text-2xl px-8 py-4 rounded-lg shadow-lg hover:bg-[#d63d87] transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-block drop-shadow-lg">
              Get Started For Free
            </Link>
          </div>

          {/* Hero Image */}
          <div 
            className={`relative flex-shrink-0 w-full lg:w-[347px] h-[396px] lg:ml-16 transition-all duration-1000 ease-out ${
              isVisible('hero') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}
            style={{
              transform: `translateX(${scrollY * 0.15}px) translateY(${-scrollY * 0.05}px)`
            }}
          >
            <div className="absolute inset-0 opacity-60">
              <div 
                className="absolute w-[333px] h-[396px] bg-[#e84797] rounded-full blur-[150px] transform rotate-180 right-4 transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `translateY(${scrollY * 0.1}px) rotate(180deg)`
                }}
              ></div>
              <div 
                className="absolute w-[206px] h-[217px] bg-[#e7a0cc] rounded-full blur-[40px] transform rotate-180 top-[90px] right-[64px] transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `translateY(${-scrollY * 0.08}px) rotate(180deg)`
                }}
              ></div>
              <div 
                className="absolute w-[92px] h-[90px] bg-[#c385f5] rounded-full blur-[25px] transform rotate-180 top-[126px] right-[47px] transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `translateY(${scrollY * 0.12}px) rotate(180deg)`
                }}
              ></div>
            </div>
            <img
              src="/babi.png"
              alt="Savings illustration"
              className="absolute top-[64px] right-[24px] w-[339px] h-[339px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-3 animate-float drop-shadow-2xl"
              style={{
                transform: `translateY(${-scrollY * 0.05}px) scale(1)`
              }}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section 
          id="stats"
          ref={(el) => (sectionRefs.current.stats = el)}
          className="bg-gradient-to-r from-[rgba(78,124,178,0.3)] via-[rgba(255,255,255,0.6)] to-[rgba(78,124,178,0.3)] p-8 md:p-16 mb-24 rounded-lg transition-all duration-1000 ease-out will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.08}px)`,
            opacity: isVisible('stats') ? 1 : 0
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center">
            <div 
              className={`text-center md:text-left transform transition-all duration-700 hover:scale-110 ${
                isVisible('stats') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{
                transform: `translateX(${-scrollY * 0.05}px)`,
                transitionDelay: '100ms'
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] via-[#cb88aa] to-[#4e7cb2] animate-gradient drop-shadow-lg">100K+</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797] font-medium">
                More than 100K User active on this platform everyday
              </p>
            </div>

            <div 
              className={`text-center md:text-left transform transition-all duration-700 hover:scale-110 ${
                isVisible('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transform: `translateY(${-scrollY * 0.03}px)`,
                transitionDelay: '200ms'
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#4e7cb2] via-[#cb88aa] to-[#e84797] animate-gradient drop-shadow-lg">90%</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797] font-medium">
                More than 90% of our user successfully manage money.
              </p>
            </div>

            <div 
              className={`text-center md:text-left transform transition-all duration-700 hover:scale-110 ${
                isVisible('stats') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{
                transform: `translateX(${scrollY * 0.05}px)`,
                transitionDelay: '300ms'
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] via-[#4e7cb2] to-[#e84797] animate-gradient drop-shadow-lg">8926</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797] font-medium">
                Join thousands of users who've completed their wishlist.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          id="features"
          ref={(el) => (sectionRefs.current.features = el)}
          className="mb-24 transition-all duration-1000 ease-out will-change-transform"
          style={{
            transform: `translateY(${-scrollY * 0.05}px)`
          }}
        >
          <div className={`text-center mb-14 transition-all duration-1000 ${
            isVisible('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3 bg-gradient-to-r from-[#e84797] via-[#4e7cb2] to-[#e84797] animate-gradient">
              <span className="text-[#eeffee] font-bold text-base drop-shadow-lg">Our Features</span>
            </div>

            <div 
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-9 transition-transform duration-200 ease-out will-change-transform"
              style={{
                transform: `translateX(${scrollY * 0.03}px)`
              }}
            >
              <img
                src="return_1.png"
                alt="Investment icon"
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover flex-shrink-0 transform transition-all duration-300 hover:scale-125 hover:rotate-12 animate-float drop-shadow-xl"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.005) * 5}px) rotate(${scrollY * 0.05}deg)`
                }}
              />
              <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl text-center max-w-[704px] px-4 transform transition-all duration-300 hover:text-[#e84797] drop-shadow-md">
                Turn Good Habits into Smart Savings
              </h2>
              <img
                src="/return_2.png"
                alt="Investment icon"
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover flex-shrink-0 transform transition-all duration-300 hover:scale-125 hover:rotate-12 animate-float drop-shadow-xl"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.005 + Math.PI) * 5}px) rotate(${-scrollY * 0.05}deg)`,
                  animationDelay: '1.5s'
                }}
              />
            </div>

            <p className="text-[#383838] text-lg md:text-xl text-center max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 font-medium drop-shadow-sm">
              Build better financial habits one step at a time. With tracking, reminders, and goals, managing your money
              has never been this simple.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1180px] mx-auto transition-all duration-1000 ${
            isVisible('features') ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Income/Outcome Card */}
            <div 
              className={`bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-rotate-1 ${
                isVisible('features') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <img
                src="kucing.png"
                alt="Save money"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
              />
              <div className="text-right pr-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4 transform transition-all duration-300 hover:text-white drop-shadow-md">
                  Income
                  <br />
                  Outcome
                </h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[220px] ml-auto transform transition-all duration-300 hover:text-white font-medium drop-shadow-sm">
                  "Easily log your daily income and expenses with just a few clicks"
                </p>
              </div>
            </div>

            {/* Wishlist Card */}
            <div 
              className={`bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:rotate-1 ${
                isVisible('features') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4 transform transition-all duration-300 hover:text-[#e84797] drop-shadow-md">Wishlist</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[300px] transform transition-all duration-300 hover:text-[#e84797] font-medium drop-shadow-sm">
                  "Set saving goals and see exactly how long it takes to afford your dream items"
                </p>
              </div>
              <img
                src="/wishlist.png"
                alt="Wishlist"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
              />
            </div>

            {/* Chart Card */}
            <div 
              className={`bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:rotate-1 ${
                isVisible('features') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <img
                src="/image_3.png"
                alt="Chart"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
              />
              <div className="text-right pr-4 pt-4 z-10 relative">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4 transform transition-all duration-300 hover:text-[#e84797] drop-shadow-md">Chart</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[287px] ml-auto transform transition-all duration-300 hover:text-[#e84797] font-medium drop-shadow-sm">
                  "Visualize your spending with clear, simple charts."
                </p>
              </div>
            </div>

            {/* Budget Card */}
            <div 
              className={`bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-rotate-1 ${
                isVisible('features') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4 transform transition-all duration-300 hover:text-white drop-shadow-md">Budget</h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[200px] transform transition-all duration-300 hover:text-white font-medium drop-shadow-sm">
                  "Plan your monthly budget and track how much you've spent in each category"
                </p>
              </div>
              <img
                src="calculator_1.png"
                alt="Calculator"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Access Section */}
        <section 
          id="access"
          ref={(el) => (sectionRefs.current.access = el)}
          className="mb-24"
        >
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible('access') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <span className="text-[#eeffee] font-bold text-base animate-bounce drop-shadow-lg">Access</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 drop-shadow-md">
              Start Saving Smarter in Just 3 Steps
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 font-medium drop-shadow-sm">
              With just three simple steps, you can take control of your spending, set your budget, and start achieving
              your goals today.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-[#e84797] p-8 md:p-16 rounded-lg shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1080px] mx-auto">
              {/* Step 1 */}
              <div className={`flex flex-col gap-5 transition-all duration-700 ${
                isVisible('access') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{ transitionDelay: '100ms' }}
              >
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12 shadow-lg">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-x-2 drop-shadow-md">Login</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2 drop-shadow-sm">
                    Create your account and access your personalized money management dashboard.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex flex-col gap-5 transition-all duration-700 ${
                isVisible('access') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
              >
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12 shadow-lg">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-y-[-4px] drop-shadow-md">Record</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-4px] drop-shadow-sm">
                    Track your income and expenses effortlessly with categories and calendar notes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex flex-col gap-5 transition-all duration-700 ${
                isVisible('access') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{ transitionDelay: '300ms' }}
              >
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12 shadow-lg">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-x-[-8px] drop-shadow-md">Plan & Grow</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-[-8px] drop-shadow-sm">
                    Set your budget, stay consistent, and watch your savings goals come closer every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section 
          id="pricing"
          ref={(el) => (sectionRefs.current.pricing = el)}
          className="mb-24 transition-all duration-1000 ease-out will-change-transform"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`
          }}
        >
          <div className={`text-center mb-12 transition-all duration-1000 ${
            isVisible('pricing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <span className="text-[#eeffee] font-bold text-base drop-shadow-lg">Best Offers</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 drop-shadow-md">
              Choose the Plan That Fits Your Goals
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[700px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 font-medium drop-shadow-sm">
              Whether you're just getting started or ready to unlock premium features like, we've got a plan that fits
              your financial journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-5 justify-center max-w-[708px] mx-auto">
            {/* Starter Plan */}
            <div 
              className={`bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px] transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:-rotate-2 ${
                isVisible('pricing') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
              style={{
                transform: `translateX(${-scrollY * 0.03}px) translateY(${scrollY * 0.04}px)`,
                transitionDelay: '100ms'
              }}
            >
              <img
                src="/finance_2.png"
                alt="Finance starter"
                className="w-[176px] h-[176px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.003) * 4}px) scale(1)`
                }}
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div className="flex items-center gap-5">
                  <h3 className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-105 drop-shadow-md">Starter</h3>
                  <span className="text-[#e84797] font-bold text-base transform transition-all duration-300 hover:scale-125 drop-shadow-md">Free</span>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl transform transition-all duration-300 hover:scale-105 drop-shadow-sm">
                  Track income, expenses, and budgets with ease.
                  <br />
                  <br />
                  Perfect for students & beginners.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] drop-shadow-lg">0$</span>
                  <span className="text-[#eeffee] text-lg md:text-xl drop-shadow-sm">/Monthly</span>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div 
              className={`bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px] transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:rotate-2 ${
                isVisible('pricing') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{
                transform: `translateX(${scrollY * 0.03}px) translateY(${scrollY * 0.04}px)`,
                transitionDelay: '200ms'
              }}
            >
              <img
                src="finance_1.png"
                alt="Finance elite"
                className="w-[176px] h-[176px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-xl"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.003 + Math.PI) * 4}px) scale(1)`
                }}
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div>
                  <h3 className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-105 drop-shadow-md">Elite</h3>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl transform transition-all duration-300 hover:scale-105 drop-shadow-sm">
                  Access the Wishlist feature, set saving targets, calculate timelines, and make your dream purchases a
                  reality.
                  <br />
                  <br />
                  Best for goal-oriented savers.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] drop-shadow-lg">299$</span>
                  <span className="text-[#eeffee] text-lg md:text-xl drop-shadow-sm">/Monthly</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Straight design without rotation */}
      <footer className="relative z-10 bg-gradient-to-r from-[#e84797] to-[#cb88aa] px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img 
              src="/footer/finmate.svg" 
              alt="Finmate Logo" 
              className="h-30 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white text-base leading-relaxed max-w-[300px]">
              Track your money with ease. Finmate helps you log daily expenses, plan your monthly budget, and keep track of your savings goals.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 border-2 border-white rounded flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#e84797]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-white rounded flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#e84797]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-white rounded flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#e84797]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 border-2 border-white rounded flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#e84797]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Home Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4">Home</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick('/homepage', e)}
                  className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block"
                >
                  Income Outcome
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick('/wishlist', e)}
                  className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block"
                >
                  Wishlist
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick('/chart', e)}
                  className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block"
                >
                  Chart
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  onClick={(e) => handleNavClick('/budget', e)}
                  className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block"
                >
                  Budget
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block">
                  Budgeting Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block">
                  Saving Strategies
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block">
                  Expense Tracker Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-[#eeffee] transition-all duration-300 transform hover:translate-x-1 inline-block">
                  Investment Basics
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl mb-4">Contact Us</h3>
            <p className="text-white">
              <a href="mailto:support@finmate.com" className="hover:text-[#eeffee] transition-all duration-300">
                support@finmate.com
              </a>
            </p>
            
            {/* Language Selector */}
            <div className="pt-4">
              <label className="text-white font-bold text-sm block mb-2">Language</label>
              <select className="w-full bg-white text-[#383838] px-4 py-2 rounded border-2 border-white focus:outline-none focus:border-[#4e7cb2] transition-all duration-300">
                <option>ENGLISH</option>
                <option>INDONESIAN</option>
                <option>SPANISH</option>
                <option>FRENCH</option>
              </select>
            </div>
          </div>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-wrap gap-4 justify-start pt-8 border-t border-white/30">
          <a href="#" className="transform transition-all duration-300 hover:scale-105">
            <img 
              src="/footer/play.svg" 
              alt="Get it on Google Play" 
              className="h-12 w-auto"
            />
          </a>
          <a href="#" className="transform transition-all duration-300 hover:scale-105">
            <img 
              src="/footer/apple.svg" 
              alt="Download on the App Store" 
              className="h-12 w-auto"
            />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Landingpage