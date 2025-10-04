import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { getTransactions } from "../lib/transaction"
import { listenAuth, logoutUser } from "../lib/authService"
import Swal from 'sweetalert2'

const Chart = () => {
  const [activeFilter, setActiveFilter] = useState("7 days")
  const [activeCategory, setActiveCategory] = useState("Income / Expenses")
  const [chartData, setChartData] = useState([])
  const [incomeChartData, setIncomeChartData] = useState([])
  const [expensesChartData, setExpensesChartData] = useState([])
  const [expensesByCategory, setExpensesByCategory] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [incomeByCategory, setIncomeByCategory] = useState([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [hoveredSegment, setHoveredSegment] = useState(null) // State for chart hover
  const [selectedDay, setSelectedDay] = useState(() => {
    // Get current day name
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[today.getDay()];
  })
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  // Category mapping with icons - using useMemo to prevent re-renders
  const categoryMapping = useMemo(() => ({
    'grocery': { name: 'Grocery', icon: '/selection/grocery.svg' },
    'food': { name: 'Food', icon: '/selection/food.svg' },
    'transport': { name: 'Transport', icon: '/selection/transport.svg' },
    'clothing': { name: 'Clothing', icon: '/selection/clothing.svg' },
    'entertainment': { name: 'Entertainment', icon: '/selection/ticket.svg' },
    'gifts': { name: 'Gifts', icon: '/selection/gift.svg' },
    'communication': { name: 'Communication', icon: '/selection/comunicate.svg' },
    'tax': { name: 'Tax', icon: '/selection/tax.svg' },
    'housing': { name: 'Housing', icon: '/selection/house.svg' },
    'beauty': { name: 'Beauty', icon: '/selection/beauty.svg' },
    'medical': { name: 'Medical', icon: '/selection/medical.svg' },
    'social': { name: 'Social', icon: '/selection/social.svg' }
  }), []);

  // Income category mapping
  const incomeCategoryMapping = useMemo(() => ({
    'salary': { name: 'Salary', icon: '/salary.svg' },
    'freelance': { name: 'Freelance', icon: '/selection/comunicate.svg' },
    'investment': { name: 'Investment', icon: '/invest.svg' },
    'business': { name: 'Business', icon: '/selection/house.svg' },
    'gift_income': { name: 'Gift', icon: '/selection/gift.svg' },
    'other_income': { name: 'Other', icon: '/selection/social.svg' }
  }), []);

  // Handle logout
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
      });

      if (result.isConfirmed) {
        await logoutUser();
        navigate('/');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonColor: '#e84797',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to logout. Please try again.',
        icon: 'error',
        confirmButtonColor: '#e84797'
      });
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    
    const fetchData = async () => {
      try {
        const transactions = await getTransactions();
        const userTransactions = transactions.filter(t => t.userId === user.uid);
        
        // Get current week's date range
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay); // Start from Sunday
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Group by date
        const groupedData = userTransactions.reduce((acc, transaction) => {
          const date = new Date(transaction.date);
          if (isNaN(date.getTime())) return acc;
          const dateStr = date.toLocaleDateString();
          
          if (!acc[dateStr]) {
            acc[dateStr] = {
              day: date.toLocaleDateString('en-US', { weekday: 'short' }),
              date: `${date.getMonth() + 1}/${date.getDate()}`,
              income: 0,
              expenses: 0,
              timestamp: date.getTime()
            };
          }
          
          if (transaction.type === 'income') {
            acc[dateStr].income += Number(transaction.amount);
          } else {
            acc[dateStr].expenses += Number(transaction.amount);
          }
          
          return acc;
        }, {});

        // hitung pengeluaran berdasarkan kategori untuk hari yang dipilih di minggu ini
        const calculateExpensesByDay = (dayName) => {
          const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayName);
          const targetDate = new Date(startOfWeek);
          targetDate.setDate(startOfWeek.getDate() + dayIndex);
          targetDate.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date(targetDate);
          endOfDay.setHours(23, 59, 59, 999);
          
          const categoryMap = {};
          let totalExp = 0;
          
          userTransactions
            .filter(t => {
              if (t.type !== 'expense' && t.type !== 'expenses') return false;
              const transactionDate = new Date(t.date);
              return transactionDate >= targetDate && transactionDate <= endOfDay;
            })
            .forEach(transaction => {
              const categoryValue = transaction.category?.toLowerCase() || 'other';
              const categoryInfo = categoryMapping[categoryValue] || { name: 'Other', icon: '/selection/grocery.svg' };
              const categoryName = categoryInfo.name;
              const amount = Number(transaction.amount);
              totalExp += amount;
              
              if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = {
                  amount: 0,
                  icon: categoryInfo.icon,
                  value: categoryValue
                };
              }
              categoryMap[categoryName].amount += amount;
            });

          // hitung persentase dan ubah ke array
          const categoryArray = Object.entries(categoryMap)
            .map(([category, data]) => ({
              category,
              amount: data.amount,
              icon: data.icon,
              percentage: totalExp > 0 ? ((data.amount / totalExp) * 100).toFixed(0) : 0
            }))
            .sort((a, b) => b.amount - a.amount);

          return { categories: categoryArray, total: totalExp };
        };

        // hitung data pengeluaran berdasarkan kategori untuk hari yang dipilih
        const expensesDayData = calculateExpensesByDay(selectedDay);
        setExpensesByCategory(expensesDayData.categories);
        setTotalExpenses(expensesDayData.total);

        // hitung data pemasukan berdasarkan kategori
        const calculateIncomeByCategory = () => {
          const categoryMap = {};
          let totalInc = 0;
          
          userTransactions
            .filter(t => t.type === 'income')
            .forEach(transaction => {
              const categoryValue = transaction.category?.toLowerCase() || 'salary';
              const categoryInfo = incomeCategoryMapping[categoryValue] || { name: 'Salary', icon: '/selection/salary.png' };
              const categoryName = categoryInfo.name;
              const amount = Number(transaction.amount);
              totalInc += amount;
              
              if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = {
                  amount: 0,
                  icon: categoryInfo.icon,
                  value: categoryValue
                };
              }
              categoryMap[categoryName].amount += amount;
            });

          // hitung persentase dan ubah ke array
          const categoryArray = Object.entries(categoryMap)
            .map(([category, data]) => ({
              category,
              amount: data.amount,
              icon: data.icon,
              percentage: totalInc > 0 ? ((data.amount / totalInc) * 100).toFixed(0) : 0
            }))
            .sort((a, b) => b.amount - a.amount);

          return { categories: categoryArray, total: totalInc };
        };

        const incomeBreakdownData = calculateIncomeByCategory();
        setIncomeByCategory(incomeBreakdownData.categories);
        setTotalIncome(incomeBreakdownData.total);

        // sorting by date
        const sortedEntries = Object.entries(groupedData)
          .sort(([, a], [, b]) => a.timestamp - b.timestamp);

        // hitung data untuk tampilan Income/Expenses
        const incomeExpensesData = sortedEntries.map(([, data]) => {
          // untuk tampilan Income/Expenses, sisa hanya harus berupa income - expenses untuk hari itu
          const dayLeftover = data.income - data.expenses;
          return {
            ...data,
            value: Math.max(0, dayLeftover), // pastikan tidak negatif
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${dayLeftover.toLocaleString()}`
          };
        });

        // hitung data untuk tampilan Income only view
        const incomeData = sortedEntries.map(([, data]) => {
          return {
            ...data,
            value: data.income,
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${data.income.toLocaleString()}`
          };
        });

        // hitung data untuk tampilan Expenses only view
        const expensesData = sortedEntries.map(([, data]) => {
          return {
            ...data,
            value: data.expenses,
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${data.expenses.toLocaleString()}`
          };
        });

        // filter berdasarkan periode waktu
        const filterData = (dataArray) => {
          if (activeFilter === "7 days") return dataArray.slice(-7);
          if (activeFilter === "30 days") return dataArray.slice(-30);
          if (activeFilter === "3 months") return dataArray.slice(-90);
          return dataArray; // 12 months - show all
        };

        setChartData(filterData(incomeExpensesData));
        setIncomeChartData(filterData(incomeData));
        setExpensesChartData(filterData(expensesData));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchData();
  }, [activeFilter, user, selectedDay, categoryMapping, incomeCategoryMapping]);

  // Get current chart data based on active category
  const getCurrentChartData = () => {
    if (activeCategory === "Income") return incomeChartData;
    if (activeCategory === "Expenses") return expensesChartData;
    return chartData;
  };

  const currentData = getCurrentChartData();

  // hitung nilai maksimum untuk skala chart
  const maxValue = Math.max(...currentData.map(d => d.value), 100);
  const chartHeight = 364;

  const categories = [
    { name: "Income / Expenses", color: "#4E7CB2" },
    { name: "Expenses", color: "#4E7CB2" },
    { name: "Income", color: "#4E7CB2" }
  ];

  const timeFilters = ["12 Months", "3 months", "30 days", "7 days"];
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // warna bar berdasarkan kategori
  const getBarColor = (index) => {
    if (activeCategory === "Income") return index === 0 ? '#22c55e' : '#4ade80';
    if (activeCategory === "Expenses") return index === 0 ? '#ef4444' : '#f87171';
    return index === 0 ? '#e84797' : '#4e7cb2';
  };

  return (
    <div className="w-full min-h-screen bg-[#efe] relative overflow-hidden">
      {/* Mobile Navigation - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-sm font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-sm font-bold text-[#383838]">Chart</Link>
          <Link to="/budget" className="text-sm font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-sm font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>

      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-[108px] py-8 mt-14 md:mt-0">
        <div className="w-10 h-10 rounded-full bg-[#d9d9d9]"></div>

        <nav className="hidden md:flex items-center gap-16">
          <Link to="/homepage" className="text-base font-bold text-[#383838]">Home</Link>
          <Link to="/chart" className="text-base font-bold text-[#383838] relative">
            Chart
            <div className="absolute -bottom-2 left-0 right-0">
              <svg width={63} height={11} viewBox="0 0 63 11" fill="none" className="w-full">
                <g filter="url(#filter0_d_153_1575)">
                  <line x1="4.99815" y1="1.09972" x2="57.9981" y2="1.00189" stroke="#E84797" strokeWidth={2} strokeLinecap="round" />
                </g>
                <defs>
                  <filter id="filter0_d_153_1575" x="-0.00195312" y="0.00195312" width={63} height="10.0977" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy={4} />
                    <feGaussianBlur stdDeviation={2} />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_153_1575" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_153_1575" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>
          </Link>
          <Link to="/budget" className="text-base font-bold text-[#383838]">Budget</Link>
          <Link to="/wishlist" className="text-base font-bold text-[#383838]">Wishlist</Link>
        </nav>

        <div className="relative flex items-center gap-2 profile-dropdown">
          <span className="hidden md:block text-xl font-bold text-[#383838]">
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </span>
          <button 
            className="w-[57px] h-[57px] rounded-full overflow-hidden"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src="/profile.svg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-16 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 lg:px-[108px] py-8 pb-20 md:pb-8">
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
                  <svg width={12} height={21} viewBox="0 0 12 21" fill="none" className="absolute -right-3 hidden md:block">
                    <path d="M1.72192 1.0704L9.87118 8.8536C10.8344 9.77678 10.8344 11.2731 9.87118 12.1963L1.72192 19.9795" stroke="white" strokeWidth="1.8" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Spending Report Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#383838]">
                {activeCategory === "Income" ? "Income Report" : activeCategory === "Expenses" ? "Expenses Report" : "Spending Report"}
              </h1>
              
              {/* Show weekdays filter for Expenses, time filter for others */}
              {activeCategory === "Expenses" ? (
                <div className="flex flex-wrap gap-4 md:gap-[30px]">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`text-xl md:text-2xl font-bold transition-colors ${
                        selectedDay === day 
                          ? 'text-[#383838]' 
                          : 'text-[#383838]/20 hover:text-[#383838]/60'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              ) : (
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
              )}
            </div>

            {/* Chart Container - Hide when Expenses or Income is active */}
            {activeCategory !== "Expenses" && activeCategory !== "Income" && (
              <div className="bg-white rounded-[20px] p-6 md:p-11 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="relative h-[375px] mb-4">
                    {/* Y-axis Labels */}
                    <div className="absolute left-0 top-0 flex flex-col justify-between h-full py-2">
                      {Array.from({ length: 7 }, (_, i) => {
                        const value = Math.round((maxValue * (6 - i)) / 6);
                        return (
                          <span key={i} className="text-2xl font-bold text-[#3c3c3b] w-12 text-left">
                            {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                          </span>
                        );
                      })}
                    </div>

                    {/* Grid Lines */}
                    <div className="absolute left-[52px] top-0 right-0 h-full">
                      {[0, 52, 104, 156, 208, 260, 312, 364].map((top, index) => (
                        <div key={index} className="absolute w-full border-t border-[#3c3c3b]/10" style={{ top: `${top}px` }} />
                      ))}
                    </div>

                    {/* Chart Bars */}
                    <div className="absolute left-[151px] top-0 right-0 bottom-10 flex justify-between items-end">
                      {currentData.map((data, index) => {
                        const barHeight = (data.value / maxValue) * chartHeight;
                        return (
                          <div
                            key={index}
                            className="w-14 transition-all hover:opacity-80 cursor-pointer"
                            style={{ 
                              height: `${barHeight}px`,
                              backgroundColor: getBarColor(index)
                            }}
                            title={`${data.day}: ${activeCategory === "Income" ? data.income : activeCategory === "Expenses" ? data.expenses : data.leftover}`}
                          />
                        );
                      })}
                    </div>

                    {/* X-axis Labels */}
                    <div className="absolute left-[151px] right-0 bottom-0 flex justify-between">
                      {currentData.map((data, index) => (
                        <span key={index} className="text-2xl font-bold text-[#3c3c3b] w-14 text-center">
                          {data.day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expenses Breakdown Section - hanya ditampilkan saat kategori Expenses aktif */}
            {activeCategory === "Expenses" && (
              <div className="space-y-8 md:space-y-12">
                {/* Donut Chart */}
                <div className="flex flex-col items-center gap-8 md:gap-12">
                  <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-square">
                    {/* Donut Chart SVG */}
                    <svg viewBox="0 0 400 400" className="w-full h-full transform -rotate-90">
                      {expensesByCategory.length > 0 ? (
                        expensesByCategory.map((cat, index) => {
                          const colors = ['#E84797', '#FFC300', '#203F9A', '#94C2DA', '#4E7CB2'];
                          const circumference = 2 * Math.PI * 150;
                          const dashArray = (parseFloat(cat.percentage) / 100) * circumference;
                          const prevPercentages = expensesByCategory
                            .slice(0, index)
                            .reduce((sum, c) => sum + parseFloat(c.percentage), 0);
                          const offset = -(prevPercentages / 100) * circumference;
                          
                          return (
                            <g key={index}>
                              <circle
                                cx="200"
                                cy="200"
                                r="150"
                                fill="none"
                                stroke={colors[index % colors.length]}
                                strokeWidth="100"
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={offset}
                                className="transition-all duration-300 cursor-pointer"
                                style={{ 
                                  opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.3,
                                  filter: hoveredSegment === index ? 'brightness(1.2)' : 'none'
                                }}
                                onMouseEnter={() => setHoveredSegment(index)}
                                onMouseLeave={() => setHoveredSegment(null)}
                              />
                            </g>
                          );
                        })
                      ) : (
                        <circle
                          cx="200"
                          cy="200"
                          r="150"
                          fill="none"
                          stroke="#E0E0E0"
                          strokeWidth="100"
                        />
                      )}
                    </svg>
                    
                    {/* Center Text - Dynamic based on hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300">
                      {hoveredSegment !== null && expensesByCategory[hoveredSegment] ? (
                        <>
                          <p className="text-sm md:text-base text-black/70 mb-1">{expensesByCategory[hoveredSegment].category}</p>
                          <p className="text-xl md:text-3xl font-bold" style={{ color: ['#E84797', '#FFC300', '#203F9A', '#94C2DA', '#4E7CB2'][hoveredSegment % 5] }}>
                            {expensesByCategory[hoveredSegment].percentage}%
                          </p>
                          <p className="text-lg md:text-2xl font-bold text-black mt-2">
                            Rp{expensesByCategory[hoveredSegment].amount.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base md:text-xl text-black">Total Expenses</p>
                          <p className="text-xl md:text-3xl font-bold text-black">
                            Rp{totalExpenses.toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Category List - Responsive */}
                  <div className="w-full">
                    <div className="w-full h-0.5 bg-[#aeaeae] mb-6 md:mb-12"></div>
                    
                    {expensesByCategory.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {expensesByCategory.slice(0, 4).map((cat, index) => {
                          const colors = ['#E84797', '#FFC300', '#203F9A', '#94C2DA', '#4E7CB2'];
                          return (
                            <div 
                              key={index} 
                              className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-8 p-4 md:p-6 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-l-4"
                              style={{ borderLeftColor: colors[index % colors.length] }}
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
                                <div className="text-sm font-medium">{cat.category}</div>
                                <div className="text-xs">{cat.percentage}% of total expenses</div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                  <div className="border-8 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>

                              {/* Icon and Category Name */}
                              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <div className="relative flex-shrink-0">
                                  <img 
                                    src={cat.icon} 
                                    alt={cat.category} 
                                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain transform group-hover:scale-110 transition-transform duration-300" 
                                  />
                                  {/* Animated ring on hover */}
                                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ color: colors[index % colors.length] }}></div>
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl lg:text-[32px] font-bold text-[#383838] leading-tight truncate">
                                  {cat.category.length > 10 ? `${cat.category.substring(0, 10)}...` : cat.category}
                                </p>
                              </div>

                              {/* Percentage & Amount Container */}
                              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-between sm:justify-end">
                                {/* Percentage */}
                                <div className="flex-shrink-0">
                                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold transition-colors duration-300" style={{ color: colors[index % colors.length] }}>
                                    {cat.percentage}%
                                  </p>
                                </div>

                                {/* Amount */}
                                <div className="flex-shrink-0 text-right">
                                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[40px] font-bold text-[#383838] group-hover:text-[#ef4444] transition-colors duration-300">
                                    Rp{cat.amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {/* Progress bar indicator */}
                              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent transition-all duration-300 group-hover:w-full w-0" style={{ 
                                backgroundImage: `linear-gradient(to right, transparent, ${colors[index % colors.length]})` 
                              }}></div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-xl md:text-2xl text-gray-500">No expense data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Income Breakdown Section - hanya ditampilkan saat kategori Income aktif */}
            {activeCategory === "Income" && (
              <div className="space-y-8 md:space-y-12">
                {/* Donut Chart */}
                <div className="flex flex-col items-center gap-8 md:gap-12">
                  <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-square">
                    {/* Donut Chart SVG */}
                    <svg viewBox="0 0 400 400" className="w-full h-full transform -rotate-90">
                      {incomeByCategory.length > 0 ? (
                        incomeByCategory.map((cat, index) => {
                          const colors = ['#E84797', '#203F9A', '#FFC300', '#94C2DA'];
                          const circumference = 2 * Math.PI * 150;
                          const dashArray = (parseFloat(cat.percentage) / 100) * circumference;
                          const prevPercentages = incomeByCategory
                            .slice(0, index)
                            .reduce((sum, c) => sum + parseFloat(c.percentage), 0);
                          const offset = -(prevPercentages / 100) * circumference;
                          
                          return (
                            <g key={index}>
                              <circle
                                cx="200"
                                cy="200"
                                r="150"
                                fill="none"
                                stroke={colors[index % colors.length]}
                                strokeWidth="100"
                                strokeDasharray={`${dashArray} ${circumference}`}
                                strokeDashoffset={offset}
                                className="transition-all duration-300 cursor-pointer"
                                style={{ 
                                  opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.3,
                                  filter: hoveredSegment === index ? 'brightness(1.2)' : 'none'
                                }}
                                onMouseEnter={() => setHoveredSegment(index)}
                                onMouseLeave={() => setHoveredSegment(null)}
                              />
                            </g>
                          );
                        })
                      ) : (
                        <circle
                          cx="200"
                          cy="200"
                          r="150"
                          fill="none"
                          stroke="#E0E0E0"
                          strokeWidth="100"
                        />
                      )}
                    </svg>
                    
                    {/* Center Text - Dynamic based on hover */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300">
                      {hoveredSegment !== null && incomeByCategory[hoveredSegment] ? (
                        <>
                          <p className="text-sm md:text-base text-black/70 mb-1">{incomeByCategory[hoveredSegment].category}</p>
                          <p className="text-xl md:text-3xl font-bold" style={{ color: ['#E84797', '#203F9A', '#FFC300', '#94C2DA'][hoveredSegment % 4] }}>
                            {incomeByCategory[hoveredSegment].percentage}%
                          </p>
                          <p className="text-lg md:text-2xl font-bold text-black mt-2">
                            Rp{incomeByCategory[hoveredSegment].amount.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-base md:text-xl text-black">Total Income</p>
                          <p className="text-xl md:text-3xl font-bold text-black">
                            Rp{totalIncome.toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Category List - Responsive */}
                  <div className="w-full">
                    <div className="w-full h-0.5 bg-[#aeaeae] mb-6 md:mb-12"></div>
                    
                    {incomeByCategory.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {incomeByCategory.map((cat, index) => {
                          const colors = ['#E84797', '#203F9A', '#FFC300', '#94C2DA'];
                          return (
                            <div 
                              key={index} 
                              className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-8 p-4 md:p-6 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer border-l-4"
                              style={{ borderLeftColor: colors[index % colors.length] }}
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap">
                                <div className="text-sm font-medium">{cat.category}</div>
                                <div className="text-xs">{cat.percentage}% of total income</div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                  <div className="border-8 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>

                              {/* Icon and Category Name */}
                              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                <div className="relative flex-shrink-0">
                                  <img 
                                    src={cat.icon} 
                                    alt={cat.category} 
                                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain transform group-hover:scale-110 transition-transform duration-300" 
                                  />
                                  {/* Animated ring on hover */}
                                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ color: colors[index % colors.length] }}></div>
                                </div>
                                <p className="text-lg sm:text-xl md:text-3xl lg:text-[40px] font-bold text-[#383838] leading-tight truncate">
                                  {cat.category}
                                </p>
                              </div>

                              {/* Percentage & Amount Container */}
                              <div className="flex items-center gap-4 sm:gap-6 md:gap-8 justify-between sm:justify-end">
                                {/* Percentage */}
                                <div className="flex-shrink-0">
                                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-bold transition-colors duration-300" style={{ color: colors[index % colors.length] }}>
                                    {cat.percentage}%
                                  </p>
                                </div>

                                {/* Amount */}
                                <div className="flex-shrink-0 text-right">
                                  <p className="text-lg sm:text-xl md:text-2xl lg:text-[40px] font-bold text-[#383838] group-hover:text-[#22c55e] transition-colors duration-300">
                                    Rp{cat.amount.toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {/* Progress bar indicator */}
                              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent transition-all duration-300 group-hover:w-full w-0" style={{ 
                                backgroundImage: `linear-gradient(to right, transparent, ${colors[index % colors.length]})` 
                              }}></div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-xl md:text-2xl text-gray-500">No income data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Data Table - tampilkan saat kategori Income/Expenses aktif */}
            {activeCategory === "Income / Expenses" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="w-full h-0.5 bg-gradient-to-r from-[#e84797] via-[#ffc300] to-[#4e7cb2] animate-shimmer"></div>

                <div className="overflow-x-auto">
                  <div className="min-w-[900px]">
                    {/* Table Headers with gradient and animation */}
                    <div className="flex items-center mb-8 gap-4 md:gap-8 animate-slideDown">
                      <div className="bg-gradient-to-r from-[#e84797] to-[#ff6b9d] rounded-xl px-6 py-4 min-w-[140px] shadow-lg transform hover:scale-105 transition-all duration-300">
                        <span className="text-lg md:text-2xl font-bold text-white text-center block">Date</span>
                      </div>
                      
                      <div className="flex gap-4 md:gap-6 ml-auto">
                        <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] rounded-xl px-6 py-4 min-w-[160px] shadow-lg transform hover:scale-105 hover:rotate-1 transition-all duration-300">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Income</span>
                        </div>
                        <div className="bg-gradient-to-r from-[#ef4444] to-[#dc2626] rounded-xl px-6 py-4 min-w-[160px] shadow-lg transform hover:scale-105 hover:-rotate-1 transition-all duration-300">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Expenses</span>
                        </div>
                        <div className="bg-gradient-to-r from-[#4e7cb2] to-[#3b5998] rounded-xl px-6 py-4 min-w-[160px] shadow-lg transform hover:scale-105 transition-all duration-300">
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">
                            Leftover
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Table Rows with enhanced styling */}
                    <div className="space-y-4">
                      {currentData.map((data, index) => {
                        const netAmount = parseInt(data.income.replace(/[^0-9]/g, '') || '0') - parseInt(data.expenses.replace(/[^0-9]/g, '') || '0');
                        return (
                          <div 
                            key={index} 
                            className="group flex items-center gap-4 md:gap-8 p-4 bg-white rounded-xl hover:bg-gradient-to-r hover:from-[#f0f9ff] hover:to-[#fef3c7] transition-all duration-300 hover:shadow-xl border-l-4 border-transparent hover:border-[#e84797] animate-slideUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="bg-gradient-to-br from-[#4e7cb2] to-[#5b8fd9] rounded-xl px-4 py-3 min-w-[100px] shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                                <span className="text-base md:text-xl font-bold text-white text-center block">
                                  {data.day}
                                </span>
                              </div>
                              <span className="text-base md:text-xl font-bold text-[#383838] min-w-[60px]">
                                {data.date}
                              </span>
                            </div>

                            <div className="flex gap-4 md:gap-6 ml-auto items-center">
                              {/* Income */}
                              <div className="min-w-[160px] text-center relative group/income">
                                <div className="absolute inset-0 bg-green-100 rounded-lg opacity-0 group-hover/income:opacity-100 transition-opacity duration-300"></div>
                                <span className={`relative text-base md:text-xl font-bold transition-all duration-300 ${
                                  data.income === 'Rp0' ? 'text-[#999]' : 'text-[#22c55e] group-hover/income:text-[#16a34a] group-hover/income:scale-110 inline-block'
                                }`}>
                                  {data.income === 'Rp0' ? '—' : `+${data.income}`}
                                </span>
                              </div>

                              {/* Expenses */}
                              <div className="min-w-[160px] text-center relative group/expense">
                                <div className="absolute inset-0 bg-red-100 rounded-lg opacity-0 group-hover/expense:opacity-100 transition-opacity duration-300"></div>
                                <span className={`relative text-base md:text-xl font-bold transition-all duration-300 ${
                                  data.expenses === 'Rp0' ? 'text-[#999]' : 'text-[#ef4444] group-hover/expense:text-[#dc2626] group-hover/expense:scale-110 inline-block'
                                }`}>
                                  {data.expenses === 'Rp0' ? '—' : `-${data.expenses}`}
                                </span>
                              </div>

                              {/* Leftover */}
                              <div className="min-w-[160px] text-center relative group/leftover">
                                <div className={`absolute inset-0 rounded-lg opacity-0 group-hover/leftover:opacity-100 transition-opacity duration-300 ${
                                  netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}></div>
                                <span className={`relative text-base md:text-xl font-bold transition-all duration-300 inline-block group-hover/leftover:scale-110 ${
                                  netAmount >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                                }`}>
                                  {data.leftover}
                                </span>
                              </div>
                            </div>

                            {/* Hover indicator line */}
                            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-[#e84797] to-[#ffc300] transition-all duration-500 rounded-b-xl"></div>
                          </div>
                        );
                      })}
                      
                      {/* Total Row - Enhanced */}
                      <div className="flex items-center gap-4 md:gap-8 mt-8 p-6 bg-gradient-to-r from-[#ffc300]/20 via-[#ff6b9d]/20 to-[#4e7cb2]/20 rounded-xl border-2 border-[#ffc300] shadow-xl animate-pulse-slow">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="bg-gradient-to-br from-[#ffc300] to-[#ffaa00] rounded-xl px-5 py-4 min-w-[100px] shadow-lg animate-bounce-slow">
                            <span className="text-lg md:text-2xl font-bold text-white text-center block">Total</span>
                          </div>
                          <span className="text-lg md:text-2xl font-bold text-[#383838] min-w-[60px]"></span>
                        </div>

                        <div className="flex gap-4 md:gap-6 ml-auto">
                          <div className="min-w-[160px] text-center">
                            <span className="text-lg md:text-2xl font-extrabold text-[#22c55e] drop-shadow-lg">
                              {`+Rp${currentData.reduce((sum, data) => sum + parseInt(data.income.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`}
                            </span>
                          </div>
                          <div className="min-w-[160px] text-center">
                            <span className="text-lg md:text-2xl font-extrabold text-[#ef4444] drop-shadow-lg">
                              {`-Rp${currentData.reduce((sum, data) => sum + parseInt(data.expenses.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`}
                            </span>
                          </div>
                          <div className="min-w-[160px] text-center">
                            <span className={`text-lg md:text-2xl font-extrabold drop-shadow-lg ${
                              currentData.reduce((sum, data) => {
                                const income = parseInt(data.income.replace(/[^0-9]/g, '') || '0');
                                const expenses = parseInt(data.expenses.replace(/[^0-9]/g, '') || '0');
                                return sum + (income - expenses);
                              }, 0) >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'
                            }`}>
                              {`Rp${currentData.reduce((sum, data) => {
                                const income = parseInt(data.income.replace(/[^0-9]/g, '') || '0');
                                const expenses = parseInt(data.expenses.replace(/[^0-9]/g, '') || '0');
                                return sum + (income - expenses);
                              }, 0).toLocaleString()}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-sm font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-sm font-bold text-[#383838]">Chart</Link>
          <Link to="/budget" className="text-sm font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-sm font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>

      {/* Footer with gradient */}
      <footer 
        className="w-full h-[200px] md:h-[300px] lg:h-[400px] mt-20"
        style={{ background: "linear-gradient(180deg, #E84797 0%, #CB88AA 100%)" }}
      />
    </div>
  );
};

export default Chart;