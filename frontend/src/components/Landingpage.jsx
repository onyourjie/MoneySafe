import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const Landingpage = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-[#eeffee] min-h-screen relative overflow-x-hidden">
      {/* Background Elements */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[544px] bg-gradient-to-r from-[#e84797] to-[#cb88aa] -rotate-[2.12deg]"
        style={{
          transform: `translateY(${scrollY * 0.3}px) rotate(-2.12deg)`
        }}
      ></div>

      {/* Header */}
      <header 
        className="relative z-10 flex items-center justify-between px-4 md:px-8 lg:px-16 py-8"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      >
        {/* Logo */}
        <div className="w-10 h-10 bg-gray-300 rounded-full transform transition-all duration-300 hover:scale-110 hover:rotate-180"></div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-16">
          <div className="flex gap-16">
            <a href="#" className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
              Home
            </a>
            <a href="#" className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
              Chart
            </a>
            <a href="#" className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
              Budget
            </a>
            <a href="#" className="text-[#383838] font-bold text-base transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
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
      <main className="relative z-10 px-4 md:px-8 lg:px-16 pb-24">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-start gap-8 mb-24">
          <div 
            className="flex-1 max-w-[704px]"
            style={{
              transform: `translateX(${-scrollY * 0.2}px)`
            }}
          >
            <div className="rounded-full px-6 py-2 inline-block mb-10 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3 bg-gradient-to-r from-[#4e7cb2] via-[#cb88aa] to-[#e84797] animate-gradient">
              <span className="text-[#eeffee] font-bold text-base">Welcome</span>
            </div>

            <h1 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight transform transition-all duration-300 hover:scale-105">
              <span className="inline-block transform hover:rotate-3 hover:text-[#e84797] transition-all duration-300">Manage</span>{' '}
              <span className="inline-block transform hover:rotate-3 hover:text-[#e84797] transition-all duration-300">your</span>{' '}
              <span className="inline-block transform hover:rotate-3 hover:text-[#e84797] transition-all duration-300">money,</span>{' '}
              <span className="inline-block transform hover:rotate-3 hover:text-[#e84797] transition-all duration-300">grow</span>{' '}
              <span className="inline-block animate__animated animate__pulse animate__infinite animate__slow text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] to-[#4e7cb2]">your</span>{' '}
              <span className="inline-block animate__animated animate__pulse animate__infinite animate__slow text-transparent bg-clip-text bg-gradient-to-r from-[#4e7cb2] to-[#e84797]">future</span>
            </h1>

            <p className="text-[#383838] text-lg md:text-xl mb-10 max-w-[527px] leading-relaxed transform transition-all duration-300 hover:scale-105 hover:text-[#e84797]">
              Track your money with ease. [Name] helps you log daily expenses, plan your monthly budget, and keep track
              of your savings goals.
            </p>

            <Link to="/register" className="bg-[#e84797] text-[#eeffee] font-bold text-xl md:text-2xl px-8 py-4 rounded-lg shadow-md hover:bg-[#d63d87] transition-all duration-300 transform hover:scale-110 hover:shadow-xl inline-block">
              Get Started For Free
            </Link>
          </div>

          {/* Hero Image */}
          <div 
            className="relative flex-shrink-0 w-full lg:w-[347px] h-[396px] lg:ml-16"
            style={{
              transform: `translateX(${scrollY * 0.3}px) translateY(${-scrollY * 0.1}px)`
            }}
          >
            <div className="absolute inset-0 opacity-60">
              <div 
                className="absolute w-[333px] h-[396px] bg-[#e84797] rounded-full blur-[150px] transform rotate-180 right-4"
                style={{
                  transform: `translateY(${scrollY * 0.2}px) rotate(180deg)`
                }}
              ></div>
              <div 
                className="absolute w-[206px] h-[217px] bg-[#e7a0cc] rounded-full blur-[40px] transform rotate-180 top-[90px] right-[64px]"
                style={{
                  transform: `translateY(${-scrollY * 0.15}px) rotate(180deg)`
                }}
              ></div>
              <div 
                className="absolute w-[92px] h-[90px] bg-[#c385f5] rounded-full blur-[25px] transform rotate-180 top-[126px] right-[47px]"
                style={{
                  transform: `translateY(${scrollY * 0.25}px) rotate(180deg)`
                }}
              ></div>
            </div>
            <img
              src="/babi.png"
              alt="Savings illustration"
              className="absolute top-[64px] right-[24px] w-[339px] h-[339px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-3"
              style={{
                transform: `translateY(${-scrollY * 0.1}px) scale(1)`
              }}
            />
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="bg-gradient-to-r from-[rgba(78,124,178,0.3)] via-[rgba(255,255,255,0.6)] to-[rgba(78,124,178,0.3)] p-8 md:p-16 mb-24 rounded-lg"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center">
            <div 
              className="text-center md:text-left transform transition-all duration-300 hover:scale-110"
              style={{
                transform: `translateX(${-scrollY * 0.1}px)`
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 animate__animated animate__fadeIn animate__slow text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] via-[#cb88aa] to-[#4e7cb2] animate-gradient">100K+</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797]">
                More than 100K User active on this platform everyday
              </p>
            </div>

            <div 
              className="text-center md:text-left transform transition-all duration-300 hover:scale-110"
              style={{
                transform: `translateY(${-scrollY * 0.05}px)`
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 animate__animated animate__fadeIn animate__slow text-transparent bg-clip-text bg-gradient-to-r from-[#4e7cb2] via-[#cb88aa] to-[#e84797] animate-gradient">90%</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797]">
                More than 90% of our user successfully manage money.
              </p>
            </div>

            <div 
              className="text-center md:text-left transform transition-all duration-300 hover:scale-110"
              style={{
                transform: `translateX(${scrollY * 0.1}px)`
              }}
            >
              <div className="font-semibold text-5xl md:text-7xl mb-2 animate__animated animate__fadeIn animate__slow text-transparent bg-clip-text bg-gradient-to-r from-[#e84797] via-[#4e7cb2] to-[#e84797] animate-gradient">8926</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px] transform transition-all duration-300 hover:text-[#e84797]">
                Join thousands of users who've completed their wishlist.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className="mb-24"
          style={{
            transform: `translateY(${-scrollY * 0.1}px)`
          }}
        >
          <div className="text-center mb-14">
            <div className="rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3 bg-gradient-to-r from-[#e84797] via-[#4e7cb2] to-[#e84797] animate-gradient">
              <span className="text-[#eeffee] font-bold text-base">Our Features</span>
            </div>

            <div 
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-9"
              style={{
                transform: `translateX(${scrollY * 0.05}px)`
              }}
            >
              <img
                src="return_1.png"
                alt="Investment icon"
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover flex-shrink-0 transform transition-all duration-300 hover:scale-125 hover:rotate-12"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px) rotate(${scrollY * 0.1}deg)`
                }}
              />
              <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl text-center max-w-[704px] px-4 transform transition-all duration-300 hover:text-[#e84797]">
                Turn Good Habits into Smart Savings
              </h2>
              <img
                src="/return_2.png"
                alt="Investment icon"
                className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover flex-shrink-0 transform transition-all duration-300 hover:scale-125 hover:rotate-12"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.01 + Math.PI) * 10}px) rotate(${-scrollY * 0.1}deg)`
                }}
              />
            </div>

            <p className="text-[#383838] text-lg md:text-xl text-center max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105">
              Build better financial habits one step at a time. With tracking, reminders, and goals, managing your money
              has never been this simple.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1180px] mx-auto">
            {/* Income/Outcome Card */}
            <div 
              className="bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
            >
              <img
                src="kucing.png"
                alt="Save money"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
              />
              <div className="text-right pr-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4 transform transition-all duration-300 hover:text-white">
                  Income
                  <br />
                  Outcome
                </h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[220px] ml-auto transform transition-all duration-300 hover:text-white">
                  "Easily log your daily income and expenses with just a few clicks"
                </p>
              </div>
            </div>

            {/* Wishlist Card */}
            <div 
              className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
            >
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4 transform transition-all duration-300 hover:text-[#e84797]">Wishlist</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[300px] transform transition-all duration-300 hover:text-[#e84797]">
                  "Set saving goals and see exactly how long it takes to afford your dream items"
                </p>
              </div>
              <img
                src="/wishlist.png"
                alt="Wishlist"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
              />
            </div>

            {/* Chart Card */}
            <div 
              className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
            >
              <img
                src="/image_3.png"
                alt="Chart"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
              />
              <div className="text-right pr-4 pt-4 z-10 relative">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4 transform transition-all duration-300 hover:text-[#e84797]">Chart</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[287px] ml-auto transform transition-all duration-300 hover:text-[#e84797]">
                  "Visualize your spending with clear, simple charts."
                </p>
              </div>
            </div>

            {/* Budget Card */}
            <div 
              className="bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
            >
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4 transform transition-all duration-300 hover:text-white">Budget</h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[200px] transform transition-all duration-300 hover:text-white">
                  "Plan your monthly budget and track how much you've spent in each category"
                </p>
              </div>
              <img
                src="calculator_1.png"
                alt="Calculator"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
              />
            </div>
          </div>
        </section>

        {/* Access Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <span className="text-[#eeffee] font-bold text-base animate-bounce">Access</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 animate-fade-in">
              Start Saving Smarter in Just 3 Steps
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105 animate-slide-up">
              With just three simple steps, you can take control of your spending, set your budget, and start achieving
              your goals today.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-[#e84797] p-8 md:p-16 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1080px] mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col gap-5 animate-fade-in-left">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-x-2">Login</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2">
                    Create your account and access your personalized money management dashboard.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-5 animate-fade-in-up [animation-delay:200ms]">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-y-[-4px]">Record</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-4px]">
                    Track your income and expenses effortlessly with categories and calendar notes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-5 animate-fade-in-right [animation-delay:400ms]">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center transform transition-all duration-300 hover:scale-125 hover:rotate-12">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
                <div className="group">
                  <h3 className="text-white font-bold text-2xl mb-2 transition-all duration-300 group-hover:translate-x-[-8px]">Plan & Grow</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-[-8px]">
                    Set your budget, stay consistent, and watch your savings goals come closer every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section 
          className="mb-24"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        >
          <div className="text-center mb-12">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md transform transition-all duration-300 hover:scale-110 hover:rotate-3">
              <span className="text-[#eeffee] font-bold text-base">Best Offers</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105">
              Choose the Plan That Fits Your Goals
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[700px] mx-auto transform transition-all duration-300 hover:text-[#e84797] hover:scale-105">
              Whether you're just getting started or ready to unlock premium features like, we've got a plan that fits
              your financial journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-5 justify-center max-w-[708px] mx-auto">
            {/* Starter Plan */}
            <div 
              className="bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
              style={{
                transform: `translateX(${-scrollY * 0.05}px) translateY(${scrollY * 0.08}px)`
              }}
            >
              <img
                src="/finance_2.png"
                alt="Finance starter"
                className="w-[176px] h-[176px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.006) * 8}px) scale(1)`
                }}
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div className="flex items-center gap-5">
                  <h3 className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-105">Starter</h3>
                  <span className="text-[#e84797] font-bold text-base transform transition-all duration-300 hover:scale-125">Free</span>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl transform transition-all duration-300 hover:scale-105">
                  Track income, expenses, and budgets with ease.
                  <br />
                  <br />
                  Perfect for students & beginners.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-110 hover:text-[#e84797]">0$</span>
                  <span className="text-[#eeffee] text-lg md:text-xl">/Monthly</span>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div 
              className="bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px] transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:rotate-3"
              style={{
                transform: `translateX(${scrollY * 0.05}px) translateY(${scrollY * 0.08}px)`
              }}
            >
              <img
                src="finance_1.png"
                alt="Finance elite"
                className="w-[176px] h-[176px] object-cover transform transition-all duration-300 hover:scale-110 hover:rotate-6"
                style={{
                  transform: `translateY(${Math.sin(scrollY * 0.006 + Math.PI) * 8}px) scale(1)`
                }}
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div>
                  <h3 className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-105">Elite</h3>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl transform transition-all duration-300 hover:scale-105">
                  Access the Wishlist feature, set saving targets, calculate timelines, and make your dream purchases a
                  reality.
                  <br />
                  <br />
                  Best for goal-oriented savers.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl transform transition-all duration-300 hover:scale-110 hover:text-[#e84797]">299$</span>
                  <span className="text-[#eeffee] text-lg md:text-xl">/Monthly</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landingpage