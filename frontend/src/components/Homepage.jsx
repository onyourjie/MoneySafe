import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { listenAuth, logoutUser } from "../lib/authService"
import { addTransaction, getTransactions, updateTransaction, deleteTransaction } from "../lib/transaction"
import Swal from 'sweetalert2'

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    name: '',
    type: 'expense',
    amount: '',
    date: '',
    category: ''
  });
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDateActivitiesModal, setShowDateActivitiesModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Edit transaction state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const navigate = useNavigate();

  // Calendar functions
  const expenseCategories = [
    { name: 'Grocery', value: 'grocery', icon: '/selection/grocery.svg' },
    { name: 'Food', value: 'food', icon: '/selection/food.svg' },
    { name: 'Transport', value: 'transport', icon: '/selection/transport.svg' },
    { name: 'Clothing', value: 'clothing', icon: '/selection/clothing.svg' },
    { name: 'Entertainment', value: 'entertainment', icon: '/selection/ticket.svg' },
    { name: 'Gifts', value: 'gifts', icon: '/selection/gift.svg' },
    { name: 'Communication', value: 'communication', icon: '/selection/comunicate.svg' },
    { name: 'Tax', value: 'tax', icon: '/selection/tax.svg' },
    { name: 'Housing', value: 'housing', icon: '/selection/house.svg' },
    { name: 'Beauty', value: 'beauty', icon: '/selection/beauty.svg' },
    { name: 'Medical', value: 'medical', icon: '/selection/medical.svg' },
    { name: 'Social', value: 'social', icon: '/selection/social.svg' }
  ];

  const incomeCategories = [
    { name: 'Salary', value: 'salary', icon: '/salary.svg' },
    { name: 'Freelance', value: 'freelance', icon: '/selection/comunicate.svg' },
    { name: 'Investment', value: 'investment', icon: '/invest.svg' },
    { name: 'Business', value: 'business', icon: '/selection/house.svg' },
    { name: 'Gift', value: 'gift_income', icon: '/selection/gift.svg' },
    { name: 'Other', value: 'other_income', icon: '/selection/social.svg' }
  ];

  // Helper function to handle category selection
  const handleCategorySelect = (categoryValue) => {
    handleFormChange('category', categoryValue);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6), and make Monday = 0
  };
  
  const generateCalendarDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      days.push({ day, isToday });
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Handle date click
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowDateActivitiesModal(true);
  };

  // Get transactions for selected date
  const getTransactionsForDate = (date) => {
    if (!date || !user?.uid) return [];
    
    const userTransactions = transactions.filter(t => t.userId === user?.uid);
    const dateStr = date.toDateString();
    
    return userTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.toDateString() === dateStr;
    });
  };

  // Check if date has transactions
  const hasTransactions = (day) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getTransactionsForDate(checkDate).length > 0;
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction) => {
    setIsEditMode(true);
    setEditingTransaction(transaction);
    setTransactionForm({
      name: transaction.name,
      type: transaction.type,
      amount: transaction.amount.toString(),
      date: new Date(transaction.date).toISOString().slice(0, 16),
      category: transaction.category
    });
    setShowDateActivitiesModal(false);
    setShowAddTransactionModal(true);
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (transactionId, transactionName) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Transaction?',
        html: `
          <div style="text-align: left; margin: 10px 0;">
            <p>Are you sure you want to delete this transaction?</p>
            <p><strong>Name:</strong> ${transactionName}</p>
            <br>
            <p style="color: #e65252;">⚠️ This action cannot be undone!</p>
          </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e65252',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });

      if (result.isConfirmed) {
        await deleteTransaction(transactionId);
        await loadTransactions();

        Swal.fire({
          icon: 'success',
          title: 'Transaction Deleted!',
          text: 'The transaction has been successfully deleted.',
          confirmButtonColor: '#e84797',
          timer: 2000,
          showConfirmButton: false,
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          }
        });
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        confirmButtonColor: '#e84797',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
    }
  };

  // Calculate totals from transactions
  const calculateTotals = () => {
    const userTransactions = transactions.filter(t => t.userId === user?.uid);
    
    const totalIncome = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const total = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, total };
  };

  const { totalIncome, totalExpense, total } = calculateTotals();

  // Calculate monthly data for the current calendar month
  const calculateMonthlyData = () => {
    const userTransactions = transactions.filter(t => t.userId === user?.uid);
    
    // Filter transactions for the current calendar month/year
    const monthTransactions = userTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentDate.getMonth() && 
             transactionDate.getFullYear() === currentDate.getFullYear();
    });
    
    const monthlyIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyTotal = monthlyIncome - monthlyExpense;
    
    // Calculate expense percentage of income
    const expensePercentage = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;
    
    return { 
      monthlyIncome, 
      monthlyExpense, 
      monthlyTotal, 
      expensePercentage: Math.min(expensePercentage, 100) // Cap at 100%
    };
  };

  const { monthlyIncome, monthlyExpense, expensePercentage } = calculateMonthlyData();

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Load transactions when user changes
  useEffect(() => {
    if (user?.uid) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const allTransactions = await getTransactions();
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

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
        
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          confirmButtonColor: '#e84797',
          timer: 2000,
          showConfirmButton: false,
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          },
          hideClass: {
            popup: 'animate__animated animate__bounceOut'
          }
        });
        
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#e84797',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut'
        }
      });
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleAddTransaction = () => {
    setShowAddTransactionModal(true);
  };

  const handleCloseModal = () => {
    setShowAddTransactionModal(false);
    setIsEditMode(false);
    setEditingTransaction(null);
    setTransactionForm({
      name: '',
      type: 'expense',
      amount: '',
      date: '',
      category: ''
    });
  };

  const handleFormChange = (field, value) => {
    setTransactionForm(prev => {
      // Reset category when transaction type changes
      if (field === 'type') {
        return {
          ...prev,
          [field]: value,
          category: '' // Reset category when type changes
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSubmitTransaction = async () => {
    // Validation
    if (!transactionForm.name || !transactionForm.amount || !transactionForm.date || !transactionForm.category) {
      Swal.fire({
        icon: 'error',
        title: 'Please fill all fields',
        text: 'All fields are required to save a transaction',
        confirmButtonColor: '#e84797',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      return;
    }

    // Check if expense amount exceeds current balance (only for new expenses)
    if (!isEditMode && transactionForm.type === 'expense' && parseInt(transactionForm.amount) > total) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Insufficient Balance!',
        html: `
          <div style="text-align: left; margin: 10px 0;">
            <p><strong>Current Balance:</strong> Rp${total.toLocaleString()}</p>
            <p><strong>Expense Amount:</strong> Rp${parseInt(transactionForm.amount).toLocaleString()}</p>
            <p><strong>Shortage:</strong> Rp${(parseInt(transactionForm.amount) - total).toLocaleString()}</p>
            <br>
            <p style="color: #e65252;">⚠️ This expense will make your balance negative!</p>
            <p>Do you want to proceed anyway?</p>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: '#e84797',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, Add Anyway',
        cancelButtonText: 'Cancel',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });

      if (!result.isConfirmed) {
        return; // User cancelled, don't proceed
      }
    }

    try {
      // Create transaction object with proper formatting
      const transactionData = {
        name: transactionForm.name,
        type: transactionForm.type,
        amount: parseInt(transactionForm.amount),
        date: new Date(transactionForm.date).toISOString(),
        category: transactionForm.category,
        userId: user?.uid || 'anonymous',
      };

      if (isEditMode && editingTransaction) {
        // Update existing transaction
        transactionData.updatedAt = new Date().toISOString();
        
        console.log('Updating transaction:', editingTransaction.id, transactionData);
        await updateTransaction(editingTransaction.id, transactionData);
        
        // Reload transactions to update the UI
        await loadTransactions();

        Swal.fire({
          icon: 'success',
          title: 'Transaction Updated Successfully!',
          html: `
            <div style="text-align: left; margin: 10px 0;">
              <p><strong>Name:</strong> ${transactionForm.name}</p>
              <p><strong>Type:</strong> ${transactionForm.type}</p>
              <p><strong>Amount:</strong> Rp${parseInt(transactionForm.amount).toLocaleString()}</p>
              <p><strong>Category:</strong> ${transactionForm.category}</p>
              <p><strong>Date:</strong> ${new Date(transactionForm.date).toLocaleDateString()}</p>
            </div>
          `,
          confirmButtonColor: '#e84797',
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          }
        });
      } else {
        // Add new transaction
        transactionData.createdAt = new Date().toISOString();
        
        console.log('Adding transaction to Firebase:', transactionData);
        const docRef = await addTransaction(transactionData);
        console.log('Transaction added with ID:', docRef.id);

        // Reload transactions to update the UI
        await loadTransactions();

        // Show success message with transaction details and balance update
        const newBalance = transactionForm.type === 'expense' ? 
          total - parseInt(transactionForm.amount) : 
          total + parseInt(transactionForm.amount);

        Swal.fire({
          icon: 'success',
          title: 'Transaction Added Successfully!',
          html: `
            <div style="text-align: left; margin: 10px 0;">
              <p><strong>Name:</strong> ${transactionForm.name}</p>
              <p><strong>Type:</strong> ${transactionForm.type}</p>
              <p><strong>Amount:</strong> Rp${parseInt(transactionForm.amount).toLocaleString()}</p>
              <p><strong>Category:</strong> ${transactionForm.category}</p>
              <p><strong>Date:</strong> ${new Date(transactionForm.date).toLocaleDateString()}</p>
              <hr style="margin: 10px 0;">
              <p><strong>Previous Balance:</strong> Rp${total.toLocaleString()}</p>
              <p><strong>New Balance:</strong> <span style="color: ${newBalance >= 0 ? '#3aa233' : '#e65252'}">Rp${newBalance.toLocaleString()}</span></p>
            </div>
          `,
          confirmButtonColor: '#e84797',
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          }
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving transaction to Firebase:', error);
      
      // Show detailed error message
      Swal.fire({
        icon: 'error',
        title: `Failed to ${isEditMode ? 'Update' : 'Save'} Transaction`,
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        confirmButtonColor: '#e84797',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
    }
  };
  return (
    <div className="w-full min-h-screen bg-[#efe] overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 lg:px-16 py-4 animate__animated animate__fadeInDown">
        {/* Logo */}
        <div className="w-[174px] h-12 bg-[#d9d9d9] rounded transform transition-all duration-300 hover:scale-110 hover:rotate-3 animate__animated animate__bounceIn"></div>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-16 relative animate__animated animate__fadeInDown animate__delay-1s">
          <div className="relative">
            <Link to="/homepage" className="text-base font-bold text-[#383838] transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
              Home
            </Link>
            {/* Home underline */}
            <div className="absolute top-6 left-0 animate__animated animate__pulse animate__infinite">
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
          </div>
          <Link to="/chart" className="text-base font-bold text-[#787575] transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
            Chart
          </Link>
          <Link to="#" className="text-base font-bold text-[#787575] transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
            Budget
          </Link>
          <Link to="/wishlist" className="text-base font-bold text-[#787575] transform transition-all duration-300 hover:scale-110 hover:text-[#e84797] hover:rotate-3">
            Wishlist
          </Link>
        </nav>

        {/* Right side - Add Book, Notification, Profile */}
        <div className="flex items-center gap-3 animate__animated animate__fadeInRight animate__delay-1s">
          {/* Add Book Button - Hidden on small screens */}
          <Link to="/premium" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white/[0.22] border border-[#787575] transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/[0.4] animate__animated animate__pulse animate__infinite animate__slow">
            <img 
              src="/book.svg" 
              alt="Book" 
              className="w-5 h-5 transform transition-all duration-300 hover:rotate-12"
            />
            <span className="text-lg font-bold text-[#787575]">+</span>
            <span className="text-base font-bold text-[#787575]">Add Book</span>
          </Link>

          {/* Notification Icon */}
          <svg
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 cursor-pointer transform transition-all duration-300 hover:scale-125 hover:rotate-12 animate__animated animate__tada animate__infinite animate__slow"
          >
            <path
              d="M10 20.5H14C14 21.6 13.1 22.5 12 22.5C10.9 22.5 10 21.6 10 20.5ZM14 9.5C14 12.11 15.67 14.33 18 15.16V17.5H19C19.55 17.5 20 17.95 20 18.5C20 19.05 19.55 19.5 19 19.5H5C4.45 19.5 4 19.05 4 18.5C4 17.95 4.45 17.5 5 17.5H6V10.5C6 7.71 7.91 5.36 10.5 4.7V4C10.5 3.17 11.17 2.5 12 2.5C12.83 2.5 13.5 3.17 13.5 4V4.7C14.21 4.88 14.86 5.19 15.45 5.6C14.5091 6.68078 13.9937 8.06705 14 9.5ZM23 8.5H21V6.5C21 5.95 20.55 5.5 20 5.5C19.45 5.5 19 5.95 19 6.5V8.5H17C16.45 8.5 16 8.95 16 9.5C16 10.05 16.45 10.5 17 10.5H19V12.5C19 13.05 19.45 13.5 20 13.5C20.55 13.5 21 13.05 21 12.5V10.5H23C23.55 10.5 24 10.05 24 9.5C24 8.95 23.55 8.5 23 8.5Z"
              fill="#4E7CB2"
            />
          </svg>

          {/* Profile */}
          <div className="relative flex items-center gap-2 profile-dropdown">
            <span className="hidden md:block text-xl font-bold text-[#383838]">
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </span>
            <div className="w-[57px] h-[57px] rounded-full overflow-hidden">
              <img
                src="/profile.svg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button onClick={toggleDropdown} className="focus:outline-none">
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
              <div className="absolute top-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[150px] z-50">
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
      <main className="px-4 md:px-8 lg:px-16">
        {/* Stats Cards - Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
            <p className={`text-sm font-semibold ${total >= 0 ? 'text-[#3aa233]' : 'text-[#e65252]'}`}>
              Rp{total.toLocaleString()}
            </p>
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
            <p className="text-sm font-semibold text-[#3aa233]">Rp{totalIncome.toLocaleString()}</p>
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
            <p className="text-sm font-semibold text-[#e65252]">Rp{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        {/* Bottom Section - Budget, Welcome, Calendar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Budget Section */}
          <aside className="w-full lg:w-[263px] flex flex-col gap-6">
            {/* Budget Card with Bear */}
            <div className="bg-[#94c2da] rounded-[10px] p-6 relative">
              <div className="flex flex-col gap-5">
                {/* Bear Image */}
                <img
                  src="/homepage.svg"
                  alt="Save Money"
                  className="w-[90px] h-[90px] object-cover absolute -top-2 -right-2 z-10"
                />
                
                <div className="pt-4 relative z-20">
                  <p className="text-sm font-semibold text-[#efe]">
                    Anggaran {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-[7px] rounded-[60px] bg-[#e2e2e2] overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#e84797] to-[#ff6b9d] transition-all duration-500 ease-out rounded-[60px]"
                        style={{ width: `${expensePercentage}%` }}
                      ></div>
                    </div>
                    
                    {/* Budget Details */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#efe] opacity-90">Income:</span>
                        <span className="text-[#efe] font-medium">Rp{monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#efe] opacity-90">Expense:</span>
                        <span className="text-[#efe] font-medium">Rp{monthlyExpense.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-[#7db3d4] pt-1 mt-2">
                        <span className="text-[#efe] opacity-90">Usage:</span>
                        <span className="text-[#efe] font-medium">{expensePercentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-4 font-semibold ${total >= 0 ? 'text-[#efe]' : 'text-[#ffcccb]'}`}>
                    Sisa Budget Rp{total.toLocaleString()}
                  </p>
                  <Link to="/budget" className="w-[109px] h-8 bg-[#e84797] rounded-[10px] flex items-center justify-center mt-4 hover:bg-[#d63d87] transition-colors">
                    <span className="text-sm font-medium text-[#efe]">Edit Budget</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Budget Card */}
            <div className="bg-[#94c2da] rounded-[10px] h-[168px]"></div>
          </aside>

          {/* Center Content - Welcome Section */}
          <div className="flex-1">
            <div className="bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-[10px] p-8 relative">
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold text-[#383838] mb-4">Welcome to MoneySafe</h2>
                <p className="text-sm text-[#383838] max-w-[407px]">
                  "Let's start taking control of your finances today. Your first entry is just one click away!"
                </p>
              </div>

              {/* Add First Expense Button */}
              <div className="flex justify-center mt-6">
                <button 
                  onClick={handleAddTransaction}
                  className="bg-[#4e7cb2] rounded-[10px] px-6 py-3 flex items-center gap-2 hover:bg-[#3e6ca2] transition-colors transform hover:scale-105"
                >
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
                  <span className="text-base font-bold text-[#efe]">Add Transaction</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Calendar */}
          <aside className="w-full lg:w-[312px]">
            <div className="bg-[#94c2da] rounded-[10px] p-4 h-[350px]">
              <div className="flex flex-col h-full">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => navigateMonth(-1)}
                    className="p-1 hover:bg-[#7db3d4] rounded transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.5 9L4.5 6L7.5 3" stroke="#efe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <div className="bg-[#e84797] rounded px-3 py-1">
                    <span className="text-[11px] text-[#e2e2e2] font-medium">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => navigateMonth(1)}
                    className="p-1 hover:bg-[#7db3d4] rounded transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.5 3L7.5 6L4.5 9" stroke="#efe" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                  <span className="text-[11px] text-[#efe] font-medium">Mo</span>
                  <span className="text-[11px] text-[#efe] font-medium">Tu</span>
                  <span className="text-[11px] text-[#efe] font-medium">We</span>
                  <span className="text-[11px] text-[#efe] font-medium">Th</span>
                  <span className="text-[11px] text-[#efe] font-medium">Fr</span>
                  <span className="text-[11px] text-[#efe] font-medium">Sa</span>
                  <span className="text-[11px] text-[#4e7cb2] font-medium">Su</span>
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1 text-center flex-grow">
                  {generateCalendarDays().map((dayObj, index) => {
                    if (!dayObj) {
                      return <div key={index}></div>;
                    }
                    
                    const { day, isToday } = dayObj;
                    const isWeekend = (index % 7 === 6); // Sunday
                    const dayHasTransactions = hasTransactions(day);
                    
                    return (
                      <div key={index} className="flex items-center justify-center relative">
                        <button
                          onClick={() => handleDateClick(day)}
                          className="relative w-6 h-6 flex items-center justify-center hover:bg-[#7db3d4] rounded transition-colors"
                        >
                          {isToday ? (
                            <div className="bg-[#e84797] rounded w-6 h-6 flex items-center justify-center">
                              <span className="text-[11px] text-[#e2e2e2] font-medium">{day}</span>
                            </div>
                          ) : (
                            <span className={`text-[11px] font-medium ${
                              isWeekend ? 'text-[#203f9a]' : 'text-[#efe]'
                            }`}>
                              {day}
                            </span>
                          )}
                          
                          {/* Transaction indicator */}
                          {dayHasTransactions && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="w-1 h-1 bg-[#ffe066] rounded-full"></div>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
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

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
          <div className="bg-[#efe] rounded-lg p-8 w-full max-w-2xl mx-4 animate__animated animate__bounceIn">
            <h2 className="text-2xl font-bold text-[#383838] mb-6 text-center">
              {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={transactionForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 placeholder-gray-400 text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#e84797] focus:border-transparent"
                />
              </div>

              {/* Type Dropdown */}
              <div>
                <select
                  value={transactionForm.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#e84797] focus:border-transparent"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={transactionForm.amount}
                  onChange={(e) => handleFormChange('amount', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 placeholder-gray-400 text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#e84797] focus:border-transparent"
                />
              </div>

              {/* Date Input */}
              <div>
                <input
                  type="datetime-local"
                  value={transactionForm.date}
                  onChange={(e) => handleFormChange('date', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-white/70 text-[#383838] focus:outline-none focus:ring-2 focus:ring-[#e84797] focus:border-transparent"
                />
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-[#383838] font-medium mb-3">Select Category</label>
                <div className="bg-white/90 rounded-xl p-4 border border-gray-200">
                  <div className="grid grid-cols-4 gap-3">
                    {(transactionForm.type === 'expense' ? expenseCategories : incomeCategories).map((category) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => handleCategorySelect(category.value)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          transactionForm.category === category.value
                            ? 'bg-[#e84797] text-white shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100 text-[#383838]'
                        }`}
                      >
                        <img 
                          src={category.icon} 
                          alt={category.name}
                          className={`w-8 h-8 mb-2 ${
                            transactionForm.category === category.value ? 'filter brightness-0 invert' : ''
                          }`}
                        />
                        <span className="text-xs font-medium text-center">{category.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Next Button for Category Selection */}
                  {transactionForm.category && (
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="bg-[#e84797] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#d63d87] transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTransaction}
                className="flex-1 px-4 py-3 bg-[#e84797] text-white rounded-lg font-bold hover:bg-[#d63d87] transition-colors"
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Activities Modal */}
      {showDateActivitiesModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate__animated animate__fadeIn">
          <div className="bg-[#efe] rounded-lg p-6 w-full max-w-md mx-4 animate__animated animate__bounceIn max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#383838]">
                Activities - {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <button
                onClick={() => setShowDateActivitiesModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {(() => {
              const dayTransactions = getTransactionsForDate(selectedDate);
              
              if (dayTransactions.length === 0) {
                return (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-gray-600">No transactions on this date</p>
                    <button
                      onClick={() => {
                        setShowDateActivitiesModal(false);
                        setShowAddTransactionModal(true);
                        // Pre-fill the date
                        const formattedDate = selectedDate.toISOString().slice(0, 16);
                        setTransactionForm(prev => ({ ...prev, date: formattedDate }));
                      }}
                      className="mt-4 px-4 py-2 bg-[#e84797] text-white rounded-lg font-medium hover:bg-[#d63d87] transition-colors"
                    >
                      Add Transaction
                    </button>
                  </div>
                );
              }

              const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
              const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
              const netAmount = income - expense;

              return (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Income</p>
                        <p className="text-sm font-bold text-[#3aa233]">+Rp{income.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Expense</p>
                        <p className="text-sm font-bold text-[#e65252]">-Rp{expense.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Net</p>
                        <p className={`text-sm font-bold ${netAmount >= 0 ? 'text-[#3aa233]' : 'text-[#e65252]'}`}>
                          {netAmount >= 0 ? '+' : ''}Rp{netAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transactions List */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#383838] mb-2">Transactions ({dayTransactions.length})</h3>
                    {dayTransactions.map((transaction, index) => (
                      <div key={index} className="bg-white/70 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${
                                transaction.type === 'income' ? 'bg-[#3aa233]' : 'bg-[#e65252]'
                              }`}></div>
                              <p className="text-sm font-medium text-[#383838]">{transaction.name}</p>
                            </div>
                            <p className="text-xs text-gray-600 capitalize">{transaction.category}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold mb-2 ${
                              transaction.type === 'income' ? 'text-[#3aa233]' : 'text-[#e65252]'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}Rp{transaction.amount.toLocaleString()}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEditTransaction(transaction)}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Edit Transaction"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6.36844 2.89844L2.89844 6.36844V11.1016H7.63156L11.1016 7.63156M6.36844 2.89844L8.86844 0.398438L13.6016 5.13156L11.1016 7.63156M6.36844 2.89844L11.1016 7.63156" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTransaction(transaction.id, transaction.name)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Delete Transaction"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.75 3.5H12.25M5.25 6.125V9.625M8.75 6.125V9.625M2.625 3.5L3.5 12.25H10.5L11.375 3.5M5.25 3.5V1.75C5.25 1.51789 5.34219 1.29537 5.50628 1.13128C5.67037 0.967186 5.89289 0.875 6.125 0.875H7.875C8.10711 0.875 8.32963 0.967186 8.49372 1.13128C8.65781 1.29537 8.75 1.51789 8.75 1.75V3.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Transaction Button */}
                  <button
                    onClick={() => {
                      setShowDateActivitiesModal(false);
                      setShowAddTransactionModal(true);
                      // Pre-fill the date
                      const formattedDate = selectedDate.toISOString().slice(0, 16);
                      setTransactionForm(prev => ({ ...prev, date: formattedDate }));
                    }}
                    className="w-full px-4 py-3 bg-[#4e7cb2] text-white rounded-lg font-medium hover:bg-[#3e6ca2] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Transaction for This Date
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage