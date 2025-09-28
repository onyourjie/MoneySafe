import { Link } from "react-router-dom"
import { useState } from "react"

const Chart = () => {
  const [activeFilter, setActiveFilter] = useState("7 days")
  const [activeCategory, setActiveCategory] = useState("Income / Expenses")

  // Sample data for the chart
  const chartData = [
    { day: "Sun", value: 286, date: "9/10", income: "Rp750.000", expenses: "Rp110.000", leftover: "Rp640.000" },
    { day: "Mon", value: 208, date: "9/11", income: "Rp0", expenses: "Rp75.000", leftover: "Rp565.000" },
    { day: "Tue", value: 176, date: "9/12", income: "Rp0", expenses: "Rp52.000", leftover: "Rp513.000" },
    { day: "Wed", value: 138, date: "9/13", income: "Rp0", expenses: "Rp48.000", leftover: "Rp465.000" },
    { day: "Thr", value: 88, date: "9/14", income: "Rp0", expenses: "Rp18.000", leftover: "Rp447.000" },
    { day: "Fri", value: 178, date: "9/15", income: "Rp0", expenses: "Rp52.000", leftover: "Rp395.000" },
    { day: "Sat", value: 244, date: "9/16", income: "Rp0", expenses: "Rp98.000", leftover: "Rp297.000" }
  ]

  // Expenses breakdown data
  const expenseCategories = [
    {
      id: 'grocery',
      name: 'Grocery',
      percentage: 50,
      amount: 'Rp24.000',
      icon: 'food.svg',
      color: '#E84797'
    },
    {
      id: 'entertainment',
      name: 'Entertain...',
      percentage: 20,
      amount: 'Rp9.600',
      icon: 'ticket.svg',
      color: '#203F9A'
    },
    {
      id: 'food',
      name: 'Food',
      percentage: 20,
      amount: 'Rp9.600',
      icon: 'food_2.svg',
      color: '#FFC300'
    },
    {
      id: 'transport',
      name: 'Transport...',
      percentage: 10,
      amount: 'Rp4.800',
      icon: 'car.svg',
      color: '#94C2DA'
    }
  ]

  // Income breakdown data
  const incomeCategories = [
    {
      id: 'salary',
      name: 'Salary',
      percentage: 80,
      amount: 'Rp600.000',
      icon: 'salary-1.png',
      color: '#E84797'
    },
    {
      id: 'invest',
      name: 'Invest',
      percentage: 20,
      amount: 'Rp150.000',
      icon: 'invest-(1)-1.png',
      color: '#203F9A'
    }
  ]

  const totalExpenses = 'Rp48.000'
  const totalIncome = 'Rp750.000'

  const categories = [
    { name: "Income / Expenses", color: "#4E7CB2" },
    { name: "Expenses", color: "#4E7CB2" },
    { name: "Income", color: "#4E7CB2" }
  ]

  const timeFilters = ["12 Months", "3 months", "30 days", "7 days"]

  return (
    <div className="min-h-screen bg-[#efe] relative">
      {/* Header */}
      <header className="px-4 md:px-8 lg:px-[108px] py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-[250px]">
          {/* Profile Avatar */}
          <div className="w-10 h-10 bg-[#D9D9D9] rounded-full flex-shrink-0 md:order-first"></div>
          
          {/* Navigation */}
          <nav className="flex gap-8 md:gap-16 md:order-2">
            <Link to="/" className="text-base font-bold text-[#383838] hover:text-[#e84797] transition-colors">Home</Link>
            <span className="text-base font-bold text-[#383838]">Chart</span>
            <Link to="/budget" className="text-base font-bold text-[#383838] hover:text-[#e84797] transition-colors">Budget</Link>
            <Link to="/wishlist" className="text-base font-bold text-[#383838] hover:text-[#e84797] transition-colors">Wishlist</Link>
          </nav>
          
          {/* User Info */}
          <div className="flex items-center gap-4 md:order-3">
            <span className="text-xl font-bold text-[#383838]">Nina</span>
            <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
              <img
                src="gambar-pengusaha-wanita-asia-yang-percaya-diri-memegang-tablet-_-fotografi-png-unduhan-gratis---pikbest-1.jpeg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Decorative Line */}
      <div className="absolute left-[499.5px] top-[74.6px] hidden md:block">
        <svg width={63} height={11} viewBox="0 0 63 11" fill="none">
          <line x1="4.99815" y1="1.09972" x2="57.9981" y2="1.00189" stroke="#E84797" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>

      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-[108px] py-8">
        <div className="max-w-[1069px] mx-auto">
          {/* Category Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-7 mb-16">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`w-full md:w-[304px] h-24 rounded-[14px] flex items-center justify-center relative transition-all duration-300 ${
                  activeCategory === category.name 
                    ? 'transform scale-105 shadow-lg' 
                    : 'hover:transform hover:scale-102 hover:opacity-80'
                }`}
                style={{ 
                  backgroundColor: activeCategory === category.name ? '#203F9A' : category.color 
                }}
              >
                <span className="text-lg md:text-2xl font-bold text-white text-center px-4">
                  {category.name}
                </span>
                {index < categories.length - 1 && (
                  <svg
                    width={12}
                    height={21}
                    viewBox="0 0 12 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -right-3 hidden md:block"
                  >
                    <path
                      d="M1.72192 1.0704L9.87118 8.8536C10.8344 9.77678 10.8344 11.2731 9.87118 12.1963L1.72192 19.9795"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeMiterlimit={10}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Content based on active category */}
          {activeCategory === "Income" ? (
            <div className="space-y-8">
              {/* Title and Time Filter */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#383838]">
                  Income Report
                </h1>
                
                {/* Time Filter Buttons */}
                <div className="flex flex-wrap gap-4 md:gap-[30px]">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`text-xl md:text-2xl font-bold transition-colors ${
                        activeFilter === filter 
                          ? 'text-[#383838]' 
                          : 'text-[#383838]/20 hover:text-[#383838]/60'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pie Chart Container */}
              <div className="flex justify-center mb-16">
                <div className="relative w-[400px] h-[400px] md:w-[663px] md:h-[663px]">
                  {/* Income Pie Chart */}
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 700 700"
                    className="absolute inset-0"
                  >
                    {/* Salary segment - Large pink section (80%) */}
                    <path
                      d="M350 35 A315 315 0 1 1 126 518 L350 350 Z"
                      fill="#E84797"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Investment segment - Blue section (20%) */}
                    <path
                      d="M350 350 L350 35 A315 315 0 0 1 126 518 Z"
                      fill="#203F9A"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Inner white circle for center text */}
                    <circle
                      cx="350"
                      cy="350"
                      r="148"
                      fill="white"
                      className="drop-shadow-lg"
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg md:text-xl font-normal text-black mb-2">Total Income</p>
                      <p className="text-2xl md:text-[28px] font-bold text-black">{totalIncome}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Income Breakdown */}
              <div className="space-y-8">
                {/* Separator Line */}
                <div className="w-full h-0.5 bg-[#aeaeae]"></div>

                {/* Income Categories List */}
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-1 gap-6">
                      {incomeCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                          {/* Icon and Name */}
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                              <img
                                src={category.icon}
                                alt={category.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[200px]">
                              {category.name}
                            </h3>
                          </div>
                          
                          {/* Percentage and Amount */}
                          <div className="flex items-center gap-8 md:gap-16">
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[80px] text-center">
                              {category.percentage}%
                            </div>
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[150px] text-right">
                              {category.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeCategory === "Expenses" ? (
            <div className="space-y-8">
              {/* Title and Day Filter */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#383838]">
                  Expenses Report
                </h1>
                
                {/* Day Filter Buttons */}
                <div className="flex flex-wrap gap-4 md:gap-[30px]">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'].map((day) => (
                    <button
                      key={day}
                      className={`text-xl md:text-2xl font-bold transition-colors ${
                        day === 'Wed' 
                          ? 'text-[#383838]' 
                          : 'text-[#383838]/20 hover:text-[#383838]/60'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pie Chart Container */}
              <div className="flex justify-center mb-16">
                <div className="relative w-[400px] h-[400px] md:w-[663px] md:h-[663px]">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 700 700"
                    className="absolute inset-0"
                  >
                    {/* Grocery segment - Large pink section (50%) */}
                    <path
                      d="M350 35 A315 315 0 0 1 665 350 A315 315 0 0 1 350 665 L350 350 Z"
                      fill="#E84797"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Entertainment segment - Blue section (20%) */}
                    <path
                      d="M350 350 L350 35 A315 315 0 0 1 574 135 Z"
                      fill="#203F9A"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Food segment - Yellow section (20%) */}
                    <path
                      d="M350 350 L574 135 A315 315 0 0 1 574 565 Z"
                      fill="#FFC300"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Transport segment - Light blue section (10%) */}
                    <path
                      d="M350 350 L574 565 A315 315 0 0 1 350 665 Z"
                      fill="#94C2DA"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    
                    {/* Inner white circle for center text */}
                    <circle
                      cx="350"
                      cy="350"
                      r="148"
                      fill="white"
                      className="drop-shadow-lg"
                    />
                  </svg>
                  
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg md:text-xl font-normal text-black mb-2">Total Expenses</p>
                      <p className="text-2xl md:text-[28px] font-bold text-black">{totalExpenses}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expenses Breakdown */}
              <div className="space-y-8">
                {/* Separator Line */}
                <div className="w-full h-0.5 bg-[#aeaeae]"></div>

                {/* Expense Categories List */}
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-1 gap-6">
                      {expenseCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                              <img
                                src={category.icon}
                                alt={category.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[200px]">
                              {category.name}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-8 md:gap-16">
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[80px] text-center">
                              {category.percentage}%
                            </div>
                            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-[#383838] min-w-[150px] text-right">
                              {category.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Title and Filters */}
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#383838]">
                  Spending Report
                </h1>
                
                {/* Time Filter Buttons */}
                <div className="flex flex-wrap gap-4 md:gap-[30px]">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`text-xl md:text-2xl font-bold transition-colors ${
                        activeFilter === filter 
                          ? 'text-[#383838]' 
                          : 'text-[#383838]/20 hover:text-[#383838]/60'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Container */}
              <div className="bg-white rounded-[20px] p-6 md:p-11 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="relative h-[375px] mb-4">
                    {/* Y-axis Labels */}
                    <div className="absolute left-0 top-0 flex flex-col justify-between h-full py-2">
                      {[200, 100, 80, 50, 20, 10, 0].map((value) => (
                        <span key={value} className="text-2xl font-bold text-[#3c3c3b] w-12 text-left">
                          {value}
                        </span>
                      ))}
                    </div>

                    {/* Grid Lines */}
                    <div className="absolute left-[52px] top-0 right-0 h-full">
                      {[0, 52, 104, 156, 208, 260, 312, 364].map((top, index) => (
                        <div
                          key={index}
                          className="absolute w-full border-t border-[#3c3c3b]/10"
                          style={{ top: `${top}px` }}
                        />
                      ))}
                    </div>

                    {/* Chart Bars */}
                    <div className="absolute left-[151px] top-0 right-0 bottom-10 flex justify-between items-end">
                      {chartData.map((data, index) => (
                        <div
                          key={data.day}
                          className={`w-14 transition-all hover:opacity-80 ${
                            index === 0 ? 'bg-[#e84797]' : 'bg-[#4e7cb2]'
                          }`}
                          style={{ height: `${data.value}px` }}
                          title={`${data.day}: ${data.expenses}`}
                        />
                      ))}
                    </div>

                    {/* X-axis Labels */}
                    <div className="absolute left-[151px] right-0 bottom-0 flex justify-between">
                      {chartData.map((data) => (
                        <span key={data.day} className="text-2xl font-bold text-[#3c3c3b] w-14 text-center">
                          {data.day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-8">
                {/* Separator Line */}
                <div className="w-full h-0.5 bg-[#aeaeae]"></div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    {/* Table Headers */}
                    <div className="flex items-center mb-8 gap-8">
                      <div className="bg-[#e84797] rounded-[10px] px-6 py-3 min-w-[117px]">
                        <span className="text-lg md:text-2xl font-bold text-white text-center block">Date</span>
                      </div>
                      
                      <div className="flex gap-6 ml-auto">
                        <div className="bg-[#e84797] rounded-[10px] px-6 py-3 min-w-[140px]">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Income</span>
                        </div>
                        <div className="bg-[#e84797] rounded-[10px] px-6 py-3 min-w-[140px]">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Expenses</span>
                        </div>
                        <div className="bg-[#e84797] rounded-[10px] px-6 py-3 min-w-[140px]">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Leftover</span>
                        </div>
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="space-y-6">
                      {chartData.map((data, index) => (
                        <div key={index} className="flex items-center gap-8">
                          <div className="flex items-center gap-4">
                            <div className="bg-[#4e7cb2] rounded-[10px] px-4 py-3 min-w-[117px]">
                              <span className="text-lg md:text-2xl font-bold text-white text-center block">
                                {data.day}
                              </span>
                            </div>
                            <span className="text-lg md:text-2xl font-bold text-[#383838] min-w-[60px]">
                              {data.date}
                            </span>
                          </div>

                          <div className="flex gap-6 ml-auto">
                            <div className="min-w-[140px] text-center">
                              <span className={`text-lg md:text-xl font-bold ${
                                data.income === 'Rp0' ? 'text-[#999]' : 'text-[#22c55e]'
                              }`}>
                                {data.income}
                              </span>
                            </div>
                            <div className="min-w-[140px] text-center">
                              <span className="text-lg md:text-xl font-bold text-[#ef4444]">
                                {data.expenses}
                              </span>
                            </div>
                            <div className="min-w-[140px] text-center">
                              <span className="text-lg md:text-xl font-bold text-[#383838]">
                                {data.leftover}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Total Row */}
                      <div className="flex items-center gap-8 mt-8">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#ffc300] rounded-[10px] px-4 py-3 min-w-[117px]">
                            <span className="text-lg md:text-2xl font-bold text-white text-center block">
                              Total
                            </span>
                          </div>
                          <span className="text-lg md:text-2xl font-bold text-[#383838] min-w-[60px]">
                          </span>
                        </div>

                        <div className="flex gap-6 ml-auto">
                          <div className="min-w-[140px] text-center">
                            <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                              Rp750.000
                            </span>
                          </div>
                          <div className="min-w-[140px] text-center">
                            <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                              Rp453.000
                            </span>
                          </div>
                          <div className="min-w-[140px] text-center">
                            <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                              Rp297.000
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Gradient Background */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[300px] md:h-[400px] lg:h-[544px] -z-10"
        style={{ 
          background: "linear-gradient(-0.38deg, #e84797 -25.06%, #cb88aa 102.75%)" 
        }}
      />

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          <Link to="/" className="text-base font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-base font-bold text-[#383838]">Chart</Link>
          <Link to="/budget" className="text-base font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-base font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>
    </div>
  )
}

export default Chart