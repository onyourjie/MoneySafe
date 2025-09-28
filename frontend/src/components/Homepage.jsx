const Homepage = () => {
  return (
    <div className="bg-[#eeffee] min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 left-0 w-full h-[544px] bg-gradient-to-r from-[#e84797] to-[#cb88aa] -rotate-[2.12deg]"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-8 lg:px-16 py-8">
        {/* Logo */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-16">
          <div className="flex gap-16">
            <a href="#" className="text-[#383838] font-bold text-base">
              Home
            </a>
            <a href="#" className="text-[#383838] font-bold text-base">
              Chart
            </a>
            <a href="#" className="text-[#383838] font-bold text-base">
              Budget
            </a>
            <a href="#" className="text-[#383838] font-bold text-base">
              Wishlist
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[#383838] font-bold text-xl">Login</span>
              <div className="h-0.5 bg-[#e84797] shadow-md transform -rotate-[0.106deg]"></div>
            </div>
            <span className="text-[#383838] font-bold text-xl">Sign in</span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#383838]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 lg:px-16 pb-24">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-start gap-8 mb-24">
          <div className="flex-1 max-w-[704px]">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-10 shadow-md">
              <span className="text-[#eeffee] font-bold text-base">Welcome</span>
            </div>

            <h1 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight">
              Manage your money, grow your future
            </h1>

            <p className="text-[#383838] text-lg md:text-xl mb-10 max-w-[527px] leading-relaxed">
              Track your money with ease. [Name] helps you log daily expenses, plan your monthly budget, and keep track
              of your savings goals.
            </p>

            <button className="bg-[#e84797] text-[#eeffee] font-bold text-xl md:text-2xl px-8 py-4 rounded-lg shadow-md hover:bg-[#d63d87] transition-colors">
              Get Started For Free
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative flex-shrink-0 w-full lg:w-[347px] h-[396px]">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute w-[333px] h-[396px] bg-[#e84797] rounded-full blur-[150px] transform rotate-180"></div>
              <div className="absolute w-[206px] h-[217px] bg-[#e7a0cc] rounded-full blur-[40px] transform rotate-180 top-[70px] left-[64px]"></div>
              <div className="absolute w-[92px] h-[90px] bg-[#c385f5] rounded-full blur-[25px] transform rotate-180 top-[106px] left-[7px]"></div>
            </div>
            <img
              src="/babi.png"
              alt="Savings illustration"
              className="absolute top-[34px] left-[4px] w-[339px] h-[339px] shadow-md object-cover"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-[rgba(78,124,178,0.3)] via-[rgba(255,255,255,0.6)] to-[rgba(78,124,178,0.3)] p-8 md:p-16 mb-24 rounded-lg">
          <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center">
            <div className="text-center md:text-left">
              <div className="text-[#e84797] font-semibold text-5xl md:text-7xl mb-2">100K+</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px]">
                More than 100K User active on this platform everyday
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="text-[#e84797] font-semibold text-5xl md:text-7xl mb-2">90%</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px]">
                More than 90% of our user successfully manage money.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="text-[#e84797] font-semibold text-5xl md:text-7xl mb-2">8926</div>
              <p className="text-[#383838] text-lg md:text-xl max-w-[306px]">
                Join thousands of users who've completed their wishlist.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <div className="text-center mb-14">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md">
              <span className="text-[#eeffee] font-bold text-base">Our Features</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-9">
              <img
                src="return_1.png"
                alt="Investment icon"
                className="w-[150px] h-[150px] object-cover"
              />
              <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl text-center max-w-[704px]">
                Turn Good Habits into Smart Savings
              </h2>
              <img
                src="/return_2.png"
                alt="Investment icon"
                className="w-[150px] h-[150px] object-cover"
              />
            </div>

            <p className="text-[#383838] text-lg md:text-xl text-center max-w-[704px] mx-auto">
              Build better financial habits one step at a time. With tracking, reminders, and goals, managing your money
              has never been this simple.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1180px] mx-auto">
            {/* Income/Outcome Card */}
            <div className="bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between">
              <img
                src="kucing.png"
                alt="Save money"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] shadow-md object-cover"
              />
              <div className="text-right pr-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4">
                  Income
                  <br />
                  Outcome
                </h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[220px] ml-auto">
                  "Easily log your daily income and expenses with just a few clicks"
                </p>
              </div>
            </div>

            {/* Wishlist Card */}
            <div className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between">
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4">Wishlist</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[300px]">
                  "Set saving goals and see exactly how long it takes to afford your dream items"
                </p>
              </div>
              <img
                src="/wishlist.png"
                alt="Wishlist"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] shadow-md object-cover"
              />
            </div>

            {/* Chart Card */}
            <div className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between">
              <img
                src="/image_3.png"
                alt="Chart"
                className="absolute bottom-4 left-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] shadow-md object-cover"
              />
              <div className="text-right pr-4 pt-4">
                <h3 className="text-[#383838] font-bold text-4xl md:text-6xl mb-4">Chart</h3>
                <p className="text-[#383838] text-lg md:text-xl max-w-[287px] mx-auto">
                  "Visualize your spending with clear, simple charts."
                </p>
              </div>
            </div>

            {/* Budget Card */}
            <div className="bg-[#94c2da] rounded-lg p-8 relative min-h-[310px] flex flex-col justify-between">
              <div className="text-left pl-4 pt-4">
                <h3 className="text-[#383838] font-bold text-2xl md:text-4xl mb-4">Budget</h3>
                <p className="text-[#383838] text-sm md:text-base max-w-[200px]">
                  "Plan your monthly budget and track how much you've spent in each category"
                </p>
              </div>
              <img
                src="calculator_1.png"
                alt="Calculator"
                className="absolute bottom-4 right-4 w-[120px] h-[120px] md:w-[264px] md:h-[264px] shadow-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Access Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md">
              <span className="text-[#eeffee] font-bold text-base">Access</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto">
              Start Saving Smarter in Just 3 Steps
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[704px] mx-auto">
              With just three simple steps, you can take control of your spending, set your budget, and start achieving
              your goals today.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-[#e84797] p-8 md:p-16 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1080px] mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col gap-5">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Login</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl">
                    Create your account and access your personalized money management dashboard.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col gap-5">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#eeffee] relative flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Record</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl">
                    Track your income and expenses effortlessly with categories and calendar notes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col gap-5">
                <div className="w-[70px] h-[70px] bg-[#4e7cb2] rounded-full border-2 border-[#4e7cb2] relative flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#eeffee]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Plan & Grow</h3>
                  <p className="text-[#eeffee] text-lg md:text-xl">
                    Set your budget, stay consistent, and watch your savings goals come closer every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <div className="bg-[#4e7cb2] rounded-full px-6 py-2 inline-block mb-14 shadow-md">
              <span className="text-[#eeffee] font-bold text-base">Best Offers</span>
            </div>

            <h2 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-6xl mb-9 max-w-[704px] mx-auto">
              Choose the Plan That Fits Your Goals
            </h2>

            <p className="text-[#383838] text-lg md:text-xl max-w-[700px] mx-auto">
              Whether you're just getting started or ready to unlock premium features like, we've got a plan that fits
              your financial journey.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row gap-5 justify-center max-w-[708px] mx-auto">
            {/* Starter Plan */}
            <div className="bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px]">
              <img
                src="/finance_2.png"
                alt="Finance starter"
                className="w-[176px] h-[176px] shadow-md object-cover"
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div className="flex items-center gap-5">
                  <h3 className="text-white font-bold text-3xl">Starter</h3>
                  <span className="text-[#e84797] font-bold text-base">Free</span>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl">
                  Track income, expenses, and budgets with ease.
                  <br />
                  <br />
                  Perfect for students & beginners.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl">0$</span>
                  <span className="text-[#eeffee] text-lg md:text-xl">/Monthly</span>
                </div>
              </div>
            </div>

            {/* Elite Plan */}
            <div className="bg-[#94c2da] rounded-lg p-10 flex flex-col items-center gap-10 w-full md:w-[355px] min-h-[546px]">
              <img
                src="finance_2.png"
                alt="Finance elite"
                className="w-[176px] h-[176px] shadow-md object-cover"
              />

              <div className="flex flex-col gap-5 w-full max-w-[272px]">
                <div>
                  <h3 className="text-white font-bold text-3xl">Elite</h3>
                </div>

                <p className="text-[#eeffee] text-lg md:text-xl">
                  Access the Wishlist feature, set saving targets, calculate timelines, and make your dream purchases a
                  reality.
                  <br />
                  <br />
                  Best for goal-oriented savers.
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-3xl">299$</span>
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

export default Homepage
