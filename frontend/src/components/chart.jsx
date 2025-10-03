import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getTransactions } from "../lib/transaction"
import { listenAuth, logoutUser } from "../lib/authService"
import Swal from 'sweetalert2'

const Chart = () => {
  const [activeFilter, setActiveFilter] = useState("7 days")
  const [activeCategory, setActiveCategory] = useState("Income / Expenses")
  const [chartData, setChartData] = useState([])
  const [incomeChartData, setIncomeChartData] = useState([])
  const [expensesChartData, setExpensesChartData] = useState([])
  const [user, setUser] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

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

        // Sort by date
        const sortedEntries = Object.entries(groupedData)
          .sort(([, a], [, b]) => a.timestamp - b.timestamp);

        // Calculate data for Income/Expenses view
        const incomeExpensesData = sortedEntries.map(([, data]) => {
          // For Income/Expenses view, leftover should be just income - expenses for that day
          const dayLeftover = data.income - data.expenses;
          return {
            ...data,
            value: Math.max(0, dayLeftover), // Prevent negative chart heights
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${dayLeftover.toLocaleString()}`
          };
        });

        // Calculate data for Income only view
        const incomeData = sortedEntries.map(([, data]) => {
          return {
            ...data,
            value: data.income,
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${data.income.toLocaleString()}`
          };
        });

        // Calculate data for Expenses only view
        const expensesData = sortedEntries.map(([, data]) => {
          return {
            ...data,
            value: data.expenses,
            income: `Rp${data.income.toLocaleString()}`,
            expenses: `Rp${data.expenses.toLocaleString()}`,
            leftover: `Rp${data.expenses.toLocaleString()}`
          };
        });

        // Filter based on time period
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
  }, [activeFilter, user]);

  // Get current chart data based on active category
  const getCurrentChartData = () => {
    if (activeCategory === "Income") return incomeChartData;
    if (activeCategory === "Expenses") return expensesChartData;
    return chartData;
  };

  const currentData = getCurrentChartData();

  // Calculate max value for scaling the chart
  const maxValue = Math.max(...currentData.map(d => d.value), 100);
  const chartHeight = 364;

  const categories = [
    { name: "Income / Expenses", color: "#4E7CB2" },
    { name: "Expenses", color: "#4E7CB2" },
    { name: "Income", color: "#4E7CB2" }
  ];

  const timeFilters = ["12 Months", "3 months", "30 days", "7 days"];

  // Get bar color based on category
  const getBarColor = (index) => {
    if (activeCategory === "Income") return index === 0 ? '#22c55e' : '#4ade80';
    if (activeCategory === "Expenses") return index === 0 ? '#ef4444' : '#f87171';
    return index === 0 ? '#e84797' : '#4e7cb2';
  };

  return (
    <div className="w-full min-h-screen bg-[#efe] relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-[108px] py-8">
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

            {/* Data Table */}
            <div className="space-y-8">
              <div className="w-full h-0.5 bg-[#aeaeae]"></div>

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
                        <span className="text-lg md:text-2xl font-bold text-white text-center block">
                          {activeCategory === "Income" ? "Total Income" : activeCategory === "Expenses" ? "Total Expenses" : "Leftover"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-6">
                    {currentData.map((data, index) => (
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
                            <span className={`text-lg md:text-xl font-bold ${
                              data.expenses === 'Rp0' ? 'text-[#999]' : 'text-[#ef4444]'
                            }`}>
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
                          <span className="text-lg md:text-2xl font-bold text-white text-center block">Total</span>
                        </div>
                        <span className="text-lg md:text-2xl font-bold text-[#383838] min-w-[60px]"></span>
                      </div>

                      <div className="flex gap-6 ml-auto">
                        <div className="min-w-[140px] text-center">
                          <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                            {`Rp${currentData.reduce((sum, data) => sum + parseInt(data.income.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="min-w-[140px] text-center">
                          <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                            {`Rp${currentData.reduce((sum, data) => sum + parseInt(data.expenses.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="min-w-[140px] text-center">
                          <span className="text-lg md:text-xl font-bold text-[#ffc300]">
                            {activeCategory === "Income" 
                              ? `Rp${currentData.reduce((sum, data) => sum + parseInt(data.income.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`
                              : activeCategory === "Expenses"
                              ? `Rp${currentData.reduce((sum, data) => sum + parseInt(data.expenses.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString()}`
                              : `Rp${currentData.reduce((sum, data) => {
                                  const income = parseInt(data.income.replace(/[^0-9]/g, '') || '0');
                                  const expenses = parseInt(data.expenses.replace(/[^0-9]/g, '') || '0');
                                  return sum + (income - expenses);
                                }, 0).toLocaleString()}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div 
        className="absolute bottom-0 left-0 w-full h-[300px] md:h-[400px] lg:h-[544px] -z-10"
        style={{ background: "linear-gradient(-0.38deg, #e84797 -25.06%, #cb88aa 102.75%)" }}
      />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-base font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-base font-bold text-[#383838]">Chart</Link>
          <Link to="/budget" className="text-base font-bold text-[#787575]">Budget</Link>
          <Link to="/wishlist" className="text-base font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>
    </div>
  );
};

export default Chart;