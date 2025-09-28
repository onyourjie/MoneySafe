import { Link } from "react-router-dom"

const Homepage = () => {
  return (
    <div className="w-full min-h-screen bg-[#efe] overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-16 py-4">
        {/* Logo */}
        <div className="w-[174px] h-12 bg-[#d9d9d9] rounded"></div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-16">
          <Link to="#" className="text-base font-bold text-[#383838]">
            Home
          </Link>
          <Link to="/chart" className="text-base font-bold text-[#787575]">
            Chart
          </Link>
          <Link to="#" className="text-base font-bold text-[#787575]">
            Budget
          </Link>
          <Link to="#" className="text-base font-bold text-[#787575]">
            Wishlist
          </Link>
        </nav>

        {/* Right side - Add Book, Notification, Profile */}
        <div className="flex items-center gap-3">
          {/* Add Book Button - Hidden on small screens */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white/[0.22] border border-[#787575]">
            <span className="text-base font-bold text-[#787575]">+ Add Book</span>
          </button>

          {/* Notification Icon */}
          <svg
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer"
          >
            <path
              d="M10 20.5H14C14 21.6 13.1 22.5 12 22.5C10.9 22.5 10 21.6 10 20.5ZM14 9.5C14 12.11 15.67 14.33 18 15.16V17.5H19C19.55 17.5 20 17.95 20 18.5C20 19.05 19.55 19.5 19 19.5H5C4.45 19.5 4 19.05 4 18.5C4 17.95 4.45 17.5 5 17.5H6V10.5C6 7.71 7.91 5.36 10.5 4.7V4C10.5 3.17 11.17 2.5 12 2.5C12.83 2.5 13.5 3.17 13.5 4V4.7C14.21 4.88 14.86 5.19 15.45 5.6C14.5091 6.68078 13.9937 8.06705 14 9.5ZM23 8.5H21V6.5C21 5.95 20.55 5.5 20 5.5C19.45 5.5 19 5.95 19 6.5V8.5H17C16.45 8.5 16 8.95 16 9.5C16 10.05 16.45 10.5 17 10.5H19V12.5C19 13.05 19.45 13.5 20 13.5C20.55 13.5 21 13.05 21 12.5V10.5H23C23.55 10.5 24 10.05 24 9.5C24 8.95 23.55 8.5 23 8.5Z"
              fill="#4E7CB2"
            />
          </svg>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="w-[57px] h-[57px] rounded-full overflow-hidden">
              <img
                src="/profile.svg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
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
          </div>
        </div>
      </header>

      {/* Home underline */}
      <div className="hidden md:block ml-[415px] mb-8">
        <svg
          width={63}
          height={11}
          viewBox="0 0 63 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_146_555)">
            <line
              x1="4.99815"
              y1="1.09972"
              x2="57.9981"
              y2="1.00189"
              stroke="#E84797"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_146_555"
              x="-0.00183105"
              y="0.00195312"
              width="62.9999"
              height="10.0977"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity={0} result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy={4} />
              <feGaussianBlur stdDeviation={2} />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_146_555" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_146_555" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-16">
        {/* Left Sidebar - Budget Section */}
        <aside className="w-full lg:w-[263px] flex flex-col gap-6">
          {/* Budget Card */}
          <div className="bg-[#94c2da] rounded-[10px] p-6">
            <div className="flex flex-col gap-5">
              <p className="text-sm font-semibold text-[#efe]">Anggaran Bulan Ini</p>
              <div className="w-full h-[7px] rounded-[60px] bg-[#e2e2e2]"></div>
              <p className="text-sm text-[#efe]">Total Budget Rp.0</p>
              <button className="w-[109px] h-8 bg-[#e84797] rounded-[10px] flex items-center justify-center">
                <span className="text-sm font-medium text-[#efe]">Edit Budget</span>
              </button>
            </div>
          </div>

          {/* Additional Budget Card */}
          <div className="bg-[#94c2da] rounded-[10px] h-[168px]"></div>
        </aside>

        {/* Center Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Card */}
            <div className="bg-[#e3efe3] rounded-[10px] p-4 flex flex-col items-center justify-center h-[124px]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[14.51px] h-[14.51px]"
                >
                  <path
                    d="M6.23895 9.67406V4.83708C6.23895 4.51637 6.36635 4.20879 6.59313 3.98201C6.81991 3.75524 7.12749 3.62783 7.4482 3.62783H12.8898V3.02321C12.8898 2.35813 12.3456 1.81396 11.6806 1.81396H3.21584C2.89513 1.81396 2.58755 1.94137 2.36077 2.16814C2.13399 2.39492 2.00659 2.7025 2.00659 3.02321V11.4879C2.00659 11.8086 2.13399 12.1162 2.36077 12.343C2.58755 12.5698 2.89513 12.6972 3.21584 12.6972H11.6806C12.3456 12.6972 12.8898 12.153 12.8898 11.4879V10.8833H7.4482C7.12749 10.8833 6.81991 10.7559 6.59313 10.5291C6.36635 10.3024 6.23895 9.99477 6.23895 9.67406ZM8.05282 4.83708C7.72028 4.83708 7.4482 5.10916 7.4482 5.4417V9.06944C7.4482 9.40198 7.72028 9.67406 8.05282 9.67406H13.4944V4.83708H8.05282ZM9.86669 8.1625C9.36485 8.1625 8.95975 7.75741 8.95975 7.25557C8.95975 6.75373 9.36485 6.34864 9.86669 6.34864C10.3685 6.34864 10.7736 6.75373 10.7736 7.25557C10.7736 7.75741 10.3685 8.1625 9.86669 8.1625Z"
                    fill="#C5C1C1"
                  />
                </svg>
                <span className="text-sm font-semibold text-[#c5c1c1]">Total</span>
              </div>
              <p className="text-sm font-semibold text-[#383838]">Rp0</p>
            </div>

            {/* Income Card */}
            <div className="bg-[#e3efe3] rounded-[10px] p-4 flex flex-col items-center justify-center h-[124px]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width={10}
                  height={12}
                  viewBox="0 0 10 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.96635 0.170516L0.689219 4.51461C0.604853 4.60029 0.53793 4.70202 0.49227 4.81397C0.44661 4.92593 0.423108 5.04592 0.423105 5.1671C0.423103 5.28829 0.446599 5.40828 0.492254 5.52024C0.537909 5.6322 0.604828 5.73393 0.689189 5.81962C0.773551 5.90531 0.873703 5.97328 0.983928 6.01966C1.09415 6.06603 1.21229 6.0899 1.3316 6.08991C1.45091 6.08991 1.56905 6.06604 1.67928 6.01967C1.7895 5.9733 1.88966 5.90533 1.97402 5.81965L4.05761 3.70344L4.05746 10.7047C4.05745 10.9495 4.15318 11.1842 4.32358 11.3573C4.49398 11.5304 4.7251 11.6277 4.96609 11.6277C5.20708 11.6277 5.4382 11.5304 5.60861 11.3574C5.77902 11.1843 5.87476 10.9495 5.87476 10.7048L5.87492 3.70348L7.95841 5.81978C8.0426 5.90579 8.1427 5.97404 8.25295 6.02061C8.3632 6.06719 8.48142 6.09117 8.60083 6.09117C8.72023 6.09117 8.83846 6.0672 8.94871 6.02063C9.05896 5.97406 9.15906 5.90581 9.24325 5.81981C9.4136 5.64674 9.5093 5.41204 9.50931 5.16732C9.50931 4.92259 9.41362 4.68788 9.24328 4.5148L4.96635 0.170516Z"
                    fill="#C5C1C1"
                  />
                </svg>
                <span className="text-sm font-semibold text-[#c5c1c1]">Income</span>
              </div>
              <p className="text-sm font-semibold text-[#3aa233]">Rp0</p>
            </div>

            {/* Expense Card */}
            <div className="bg-[#e3efe3] rounded-[10px] p-4 flex flex-col items-center justify-center h-[124px]">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[21.01px] h-[21.01px]"
                >
                  <path
                    d="M12.1326 16.8808L8.01545 12.7606C7.93424 12.6794 7.86983 12.5829 7.82591 12.4767C7.78198 12.3706 7.75939 12.2568 7.75943 12.1419C7.75948 12.027 7.78215 11.9133 7.82615 11.8071C7.87016 11.701 7.93464 11.6046 8.01591 11.5234C8.09717 11.4422 8.19364 11.3778 8.2998 11.3338C8.40596 11.2899 8.51974 11.2673 8.63462 11.2674C8.74951 11.2674 8.86327 11.2901 8.9694 11.3341C9.07553 11.3781 9.17195 11.4426 9.25316 11.5238L11.2588 13.5309L11.2612 6.89319C11.2613 6.66113 11.3536 6.4386 11.5177 6.27457C11.6819 6.11053 11.9045 6.01843 12.1366 6.01851C12.3686 6.0186 12.5911 6.11087 12.7552 6.27502C12.9192 6.43918 13.0113 6.66177 13.0112 6.89383L13.0088 13.5316L15.0159 11.5259C15.097 11.4444 15.1934 11.3798 15.2996 11.3357C15.4058 11.2915 15.5196 11.2689 15.6346 11.2689C15.7496 11.2689 15.8634 11.2917 15.9696 11.3359C16.0757 11.3801 16.1721 11.4448 16.2532 11.5264C16.4171 11.6905 16.5092 11.9131 16.5091 12.1451C16.509 12.3771 16.4168 12.5996 16.2527 12.7637L12.1326 16.8808Z"
                    fill="#C5C1C1"
                  />
                </svg>
                <span className="text-sm font-semibold text-[#c5c1c1]">Expense</span>
              </div>
              <p className="text-sm font-semibold text-[#e65252]">Rp0</p>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-[10px] p-8 relative">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-4xl font-bold text-[#383838] mb-4">Welcome to .....</h2>
              <p className="text-sm text-[#383838] max-w-[407px]">
                "Let's start taking control of your finances today. Your first entry is just one click away!"
              </p>
            </div>

            {/* Add First Expense Button */}
            <div className="flex justify-center mt-6">
              <button className="bg-[#4e7cb2] rounded-[10px] px-6 py-3 flex items-center gap-2">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path
                    d="M18 12.998H13V17.998C13 18.2633 12.8946 18.5176 12.7071 18.7052C12.5196 18.8927 12.2652 18.998 12 18.998C11.7348 18.998 11.4804 18.8927 11.2929 18.7052C11.1054 18.5176 11 18.2633 11 17.998V12.998H6C5.73478 12.998 5.48043 12.8927 5.29289 12.7052C5.10536 12.5176 5 12.2633 5 11.998C5 11.7328 5.10536 11.4785 5.29289 11.2909C5.48043 11.1034 5.73478 10.998 6 10.998H11V5.99805C11 5.73283 11.1054 5.47848 11.2929 5.29094C11.4804 5.1034 11.7348 4.99805 12 4.99805C12.2652 4.99805 12.5196 5.1034 12.7071 5.29094C12.8946 5.47848 13 5.73283 13 5.99805V10.998H18C18.2652 10.998 18.5196 11.1034 18.7071 11.2909C18.8946 11.4785 19 11.7328 19 11.998C19 12.2633 18.8946 12.5176 18.7071 12.7052C18.5196 12.8927 18.2652 12.998 18 12.998Z"
                    fill="#EEFFEE"
                  />
                </svg>
                <span className="text-base font-bold text-[#efe]">Add First Expense</span>
              </button>
            </div>

            {/* Bear Image */}
            <img
              src="/homepage.svg"
              alt="Save Money"
              className="w-[111px] h-[111px] absolute top-4 left-4 object-cover shadow-md"
            />
          </div>

          {/* Weekly Overview */}
          <div className="bg-white/10 rounded-[10px] p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Mo</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Tu</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">We</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Thu</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Fr</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Sa</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[#c5c1c1]">Su</p>
              </div>
            </div>

            {/* Week Icons */}
            <div className="flex justify-between items-center">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="w-8 h-8 bg-[#d9d9d9] rounded-full flex items-center justify-center">
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      d="M8 14C11.314 14 14 12 14 8.5C14 7 13.5 4.5 11.5 2.5C11.75 4 10.25 4.5 10.25 4.5C11 2 9 -1.5 6 -2C6.357 0 6.5 2 4 4C2.75 5 2 6.729 2 8.5C2 12 4.686 14 8 14ZM8 13C6.343 13 5 12 5 10.25C5 9.5 5.25 8.25 6.25 7.25C6.125 8 7 8.5 7 8.5C6.625 7.25 7.5 5.25 9 5C8.821 6 8.75 7 10 8C10.625 8.5 11 9.364 11 10.25C11 12 9.657 13 8 13Z"
                      fill="#BAB9B9"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Calendar */}
        <aside className="w-full lg:w-[312px]">
          <div className="bg-[#94c2da] rounded-[10px] p-4 h-[350px]">
            <div className="flex flex-col h-full">
              {/* Calendar Header */}
              <div className="flex justify-center mb-4">
                <div className="bg-[#e84797] rounded px-2 py-1">
                  <span className="text-[11px] text-[#e2e2e2]">September</span>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                <span className="text-[11px] text-[#efe]">Mo</span>
                <span className="text-[11px] text-[#efe]">Tu</span>
                <span className="text-[11px] text-[#efe]">We</span>
                <span className="text-[11px] text-[#efe]">Th</span>
                <span className="text-[11px] text-[#efe]">Fr</span>
                <span className="text-[11px] text-[#efe]">Sa</span>
                <span className="text-[11px] text-[#4e7cb2]">Su</span>
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 text-center flex-grow">
                {/* Week 1 */}
                <span className="text-[11px] text-[#efe]">1</span>
                <span className="text-[11px] text-[#efe]">2</span>
                <span className="text-[11px] text-[#efe]">3</span>
                <span className="text-[11px] text-[#efe]">4</span>
                <span className="text-[11px] text-[#efe]">5</span>
                <span className="text-[11px] text-[#efe]">6</span>
                <span className="text-[11px] text-[#203f9a]">7</span>

                {/* Week 2 */}
                <span className="text-[11px] text-[#efe]">8</span>
                <span className="text-[11px] text-[#efe]">9</span>
                <span className="text-[11px] text-[#efe]">10</span>
                <span className="text-[11px] text-[#efe]">11</span>
                <span className="text-[11px] text-[#efe]">12</span>
                <span className="text-[11px] text-[#efe]">13</span>
                <span className="text-[11px] text-[#203f9a]">14</span>

                {/* Week 3 */}
                <span className="text-[11px] text-[#efe]">15</span>
                <span className="text-[11px] text-[#efe]">16</span>
                <span className="text-[11px] text-[#efe]">17</span>
                <span className="text-[11px] text-[#efe]">18</span>
                <span className="text-[11px] text-[#efe]">19</span>
                <span className="text-[11px] text-[#efe]">20</span>
                <span className="text-[11px] text-[#203f9a]">21</span>

                {/* Week 4 */}
                <span className="text-[11px] text-[#efe]">22</span>
                <span className="text-[11px] text-[#efe]">23</span>
                <span className="text-[11px] text-[#efe]">24</span>
                <span className="text-[11px] text-[#efe]">25</span>
                <span className="bg-[#e84797] rounded w-6 h-6 flex items-center justify-center">
                  <span className="text-[11px] text-[#e2e2e2]">26</span>
                </span>
                <span className="text-[11px] text-[#efe]">27</span>
                <span className="text-[11px] text-[#203f9a]">28</span>

                {/* Week 5 */}
                <span className="text-[11px] text-[#efe]">29</span>
                <span className="text-[11px] text-[#efe]">30</span>
                <span className="text-[11px] text-[#dbdbdb]">1</span>
                <span className="text-[11px] text-[#dbdbdb]">2</span>
                <span className="text-[11px] text-[#dbdbdb]">3</span>
                <span className="text-[11px] text-[#dbdbdb]">4</span>
                <span className="text-[11px] text-[#6398bc]">5</span>

                {/* Week 6 */}
                <span className="text-[11px] text-[#dbdbdb]">6</span>
                <span className="text-[11px] text-[#dbdbdb]">7</span>
                <span className="text-[11px] text-[#dbdbdb]">8</span>
                <span className="text-[11px] text-[#dbdbdb]">9</span>
                <span className="text-[11px] text-[#dbdbdb]">10</span>
                <span className="text-[11px] text-[#dbdbdb]">11</span>
                <span className="text-[11px] text-[#6398bc]">12</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-base font-bold text-[#383838]">Home</Link>
          <Link to="/chart" className="text-base font-bold text-[#787575]">Chart</Link>
          <Link to="/budget" className="text-base font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-base font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>
    </div>
  )
}

export default Homepage