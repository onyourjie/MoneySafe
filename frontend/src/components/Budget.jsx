import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { addBudget, getBudgets, updateBudget, deleteBudget } from '../lib/budgets';
import { logoutUser } from '../lib/authService';
import Swal from 'sweetalert2';

const Budget = () => {
  const [user, setUser] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    amount: '',
    period: '',
    date: ''
  });
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

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
        navigate('/login');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully logged out!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'An error occurred while logging out.'
      });
    }
  };

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

  const loadBudgets = async () => {
    if (user) {
      const userBudgets = await getBudgets();
      setBudgets(userBudgets.filter(budget => budget.userId === user.uid));
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (user) {
        const userBudgets = await getBudgets();
        setBudgets(userBudgets.filter(budget => budget.userId === user.uid));
      }
    };
    
    fetchBudgets();
  }, [user]);

  const handleCreateBudget = () => {
    setFormData({
      name: '',
      icon: '',
      amount: '',
      period: '',
      date: ''
    });
    setEditingBudget(null);
    setShowForm(true);
  };

  const handleEditBudget = (budget) => {
    setFormData({
      name: budget.name,
      icon: budget.icon,
      amount: budget.amount.toString(),
      period: budget.period,
      date: budget.date
    });
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e84797',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteBudget(budgetId);
        await loadBudgets();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your budget has been deleted.',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete budget'
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIconSelect = (iconValue) => {
    setFormData(prev => ({
      ...prev,
      icon: iconValue
    }));
    setShowIconModal(false);
  };

  const handlePeriodSelect = (period) => {
    setFormData(prev => ({
      ...prev,
      period: period
    }));
    setShowPeriodModal(false);
  };

  const handleSaveBudget = async () => {
    // Validation
    if (!formData.name || !formData.icon || !formData.amount || !formData.period || !formData.date) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all fields'
      });
      return;
    }

    try {
      const budgetData = {
        name: formData.name,
        icon: formData.icon,
        amount: parseFloat(formData.amount),
        period: formData.period,
        date: formData.date,
        userId: user.uid,
        createdAt: editingBudget ? editingBudget.createdAt : new Date().toISOString()
      };

      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
      }

      await loadBudgets();
      setShowForm(false);
      setFormData({
        name: '',
        icon: '',
        amount: '',
        period: '',
        date: ''
      });

      Swal.fire({
        icon: 'success',
        title: editingBudget ? 'Budget updated!' : 'Budget created!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save budget'
      });
    }
  };

  const getIconForCategory = (iconValue) => {
    const category = expenseCategories.find(cat => cat.value === iconValue);
    return category ? category.icon : '/selection/food.svg';
  };

  return (
    <div className="w-full min-h-screen bg-[#EEFFEE]">
      {/* Mobile Navigation - Top */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="flex justify-around">
          <Link to="/homepage" className="text-sm font-bold text-[#787575]">Home</Link>
          <Link to="/chart" className="text-sm font-bold text-[#787575]">Chart</Link>
          <Link to="/budget" className="text-sm font-bold text-[#383838]">Budget</Link>
          <Link to="/wishlist" className="text-sm font-bold text-[#787575]">Wishlist</Link>
        </div>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 mt-14 md:mt-0">
        <svg width={39} height={40} viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0" preserveAspectRatio="none">
          <circle cx="19.5" cy={20} r="19.5" fill="#D9D9D9" />
        </svg>
        <div className="hidden md:flex justify-center items-center gap-6">
          <Link to="/" className="text-sm md:text-base font-bold text-[#383838]">Home</Link>
          <Link to="/chart" className="text-sm md:text-base font-bold text-[#383838]">Chart</Link>
          <Link to="/budget" className="text-sm md:text-base font-bold text-[#383838] relative">
            Budget
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-16 h-[2px] bg-[#e84797] rounded-full shadow-md"></div>
          </Link>
          <Link to="/wishlist" className="text-sm md:text-base font-bold text-[#383838]">Wishlist</Link>
        </div>
        <div className="flex items-center gap-2 relative profile-dropdown">
          <p className="text-sm md:text-lg font-bold text-[#383838]">{user?.displayName || 'Nina'}</p>
          <div 
            className="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src="/profile.svg" alt="Profile" className="w-full h-full object-cover" />
          </div>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-[#383838] hover:bg-[#FFF0F8] flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="#E84797" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.333 14.1666L17.4997 9.99992L13.333 5.83325" stroke="#E84797" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 10H7.5" stroke="#E84797" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {/* Empty State or Form/Budget List */}
        {!showForm && budgets.length === 0 ? (
          <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-300 rounded-lg shadow-lg p-6 md:p-12">
            <div className="relative flex flex-col items-center gap-6">
              <div className="relative w-20 h-20 md:w-32 md:h-32">
                <img src="/circle.svg" alt="Circle Icon" className="absolute inset-0 w-full h-full" />
                <img src="/dana.svg" alt="Dana Icon" className="absolute inset-0 w-8 h-8 md:w-12 md:h-12 m-auto" />
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-[#383838] mb-4">Budget</p>
                <p className="text-sm md:text-lg text-[#383838] mb-8">
                  "Plan your monthly budget and track how much you've spent in each category."
                </p>
                <button
                  onClick={handleCreateBudget}
                  className="px-8 py-3 bg-[#e84797] text-white rounded-lg hover:bg-opacity-90 transition-colors text-lg font-semibold"
                >
                  Create your first budget
                </button>
              </div>
            </div>
          </div>
        ) : showForm ? (
          // Budget Form
          <div className="w-full max-w-4xl mx-auto">
            {/* Header with bear illustration */}
            <div className="bg-[#9DC3E6] rounded-2xl p-8 mb-8 relative overflow-hidden">
              <div className="max-w-xl">
                <h1 className="text-3xl font-bold text-[#383838] mb-2">Budget</h1>
                <p className="text-sm text-[#383838]">
                  "Organize your monthly budget and keep track of each category to see how much you've already spent. With the right planning, you can reach your savings goals more easily and maintain financial stability."
                </p>
              </div>
              <img 
                src="/kucing.png" 
                alt="Bear with calculator" 
                className="absolute right-8 bottom-0 h-40 object-contain"
              />
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
              {/* Budget Name */}
              <div className="flex items-center gap-4 bg-[#FFF0F8] rounded-xl p-4">
                <div className="w-12 h-12 bg-[#9DC3E6] rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#383838] mb-1">Budget Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full bg-transparent border-none outline-none text-[#383838] placeholder-[#999]"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div 
                className="flex items-center gap-4 bg-[#FFF0F8] rounded-xl p-4 cursor-pointer"
                onClick={() => setShowIconModal(true)}
              >
                <div className="w-12 h-12 bg-[#9DC3E6] rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="#383838" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="#383838" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="#383838" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="#383838" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#383838] mb-1">Icon</label>
                  <div className="flex items-center justify-between">
                    {formData.icon ? (
                      <div className="flex items-center gap-2">
                        <img src={getIconForCategory(formData.icon)} alt="Selected icon" className="w-8 h-8" />
                        <span className="capitalize text-[#383838]">{formData.icon}</span>
                      </div>
                    ) : (
                      <span className="text-[#999]">Select icon</span>
                    )}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Budget Amount */}
              <div className="flex items-center gap-4 bg-[#FFF0F8] rounded-xl p-4">
                <div className="w-12 h-12 bg-[#9DC3E6] rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="#383838" strokeWidth="2"/>
                    <path d="M7 6V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V6" stroke="#383838" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#383838] mb-1">Budget Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="w-full bg-transparent border-none outline-none text-[#383838] placeholder-[#999]"
                  />
                </div>
              </div>

              {/* Period Selection */}
              <div 
                className="flex items-center gap-4 bg-[#FFF0F8] rounded-xl p-4 cursor-pointer"
                onClick={() => setShowPeriodModal(true)}
              >
                <div className="w-12 h-12 bg-[#9DC3E6] rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#383838] mb-1">Period</label>
                  <div className="flex items-center justify-between">
                    <span className={formData.period ? "text-[#383838] capitalize" : "text-[#999]"}>
                      {formData.period || "Select period"}
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div 
                className="flex items-center gap-4 bg-[#FFF0F8] rounded-xl p-4 cursor-pointer"
                onClick={() => setShowDatePicker(true)}
              >
                <div className="w-12 h-12 bg-[#9DC3E6] rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#383838" strokeWidth="2"/>
                    <path d="M3 10H21M8 2V6M16 2V6" stroke="#383838" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#383838] mb-1">Date</label>
                  <div className="flex items-center justify-between">
                    <span className={formData.date ? "text-[#383838]" : "text-[#999]"}>
                      {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : "Select date"}
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="#383838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center pt-8">
                <div className="relative">
                  <img src="/babi.png" alt="Piggy bank left" className="absolute -left-32 bottom-0 w-24 h-24 object-contain" />
                  <button
                    onClick={handleSaveBudget}
                    className="px-32 py-4 bg-[#e84797] text-white rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-colors"
                  >
                    Save
                  </button>
                  <img src="/babi.png" alt="Piggy bank right" className="absolute -right-32 bottom-0 w-24 h-24 object-contain transform scale-x-[-1]" />
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-8 py-2 text-[#383838] hover:text-[#e84797] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ini budget List
          <div className="w-full max-w-6xl mx-auto animate-fadeIn">
            {/* Header with bear illustration */}
            <div className="bg-gradient-to-br from-[#9DC3E6] to-[#7db3d4] rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group animate-slideDown">
              <div className="max-w-xl relative z-10">
                <h1 className="text-3xl font-bold text-[#383838] mb-2 group-hover:scale-105 transition-transform">Budget</h1>
                <p className="text-sm text-[#383838] group-hover:scale-105 transition-transform">
                  "Organize your monthly budget and keep track of each category to see how much you've already spent. With the right planning, you can reach your savings goals more easily and maintain financial stability."
                </p>
              </div>
              <img 
                src="/calculator_1.png" 
                alt="Bear with calculator" 
                className="absolute right-8 bottom-0 h-40 object-contain group-hover:animate-bounce"
              />
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none"></div>
            </div>

            <div className="flex justify-end mb-6 animate-slideInRight">
              <button
                onClick={handleCreateBudget}
                className="px-6 py-3 bg-[#e84797] text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold shadow-md hover:shadow-xl transform hover:scale-110 hover:rotate-2"
              >
                Add New Budget
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget, index) => (
                <div 
                  key={budget.id} 
                  className="bg-gradient-to-br from-[#FFF0F8] to-[#ffe6f3] rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all transform hover:scale-105 hover:-rotate-1 group animate-slideUp cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                      <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md group-hover:animate-bounce">
                        <img src={getIconForCategory(budget.icon)} alt={budget.name} className="w-12 h-12" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-[#383838]">{budget.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">📅 {budget.period}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="text-[#e84797] hover:text-opacity-80 hover:scale-125 transition-all"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M14.166 2.5C14.3849 2.28113 14.6447 2.10752 14.9307 1.98906C15.2167 1.87061 15.5232 1.80969 15.8327 1.80969C16.1422 1.80969 16.4487 1.87061 16.7347 1.98906C17.0206 2.10752 17.2805 2.28113 17.4993 2.5C17.7182 2.71887 17.8918 2.97871 18.0103 3.26468C18.1287 3.55064 18.1897 3.85714 18.1897 4.16667C18.1897 4.47619 18.1287 4.78269 18.0103 5.06865C17.8918 5.35462 17.7182 5.61446 17.4993 5.83333L6.24935 17.0833L1.66602 18.3333L2.91602 13.75L14.166 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-red-500 hover:text-opacity-80"
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2.5 5H4.16667H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15.8333 5V16.6667C15.8333 17.1087 15.6577 17.5326 15.3452 17.8452C15.0326 18.1577 14.6087 18.3333 14.1667 18.3333H5.83333C5.39131 18.3333 4.96738 18.1577 4.65482 17.8452C4.34226 17.5326 4.16667 17.1087 4.16667 16.6667V5M6.66667 5V3.33333C6.66667 2.89131 6.84226 2.46738 7.15482 2.15482C7.46738 1.84226 7.89131 1.66667 8.33333 1.66667H11.6667C12.1087 1.66667 12.5326 1.84226 12.8452 2.15482C13.1577 2.46738 13.3333 2.89131 13.3333 3.33333V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#e84797] mb-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M2 6H14M5 3V1M11 3V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm">
                      {new Date(budget.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#383838]">
                      Rp {parseFloat(budget.amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Icon Selection Modal */}
      {showIconModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowIconModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#383838] mb-6 text-center">Select Icon</h3>
            <div className="grid grid-cols-4 gap-4">
              {expenseCategories.map(category => (
                <button
                  key={category.value}
                  onClick={() => handleIconSelect(category.value)}
                  className={`p-4 rounded-xl hover:bg-[#EEFFEE] transition-colors ${
                    formData.icon === category.value ? 'bg-[#EEFFEE] ring-2 ring-[#e84797]' : ''
                  }`}
                >
                  <img src={category.icon} alt={category.name} className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-xs text-center text-[#383838]">{category.name}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowIconModal(false)}
              className="mt-6 w-full py-3 bg-gray-200 text-[#383838] rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Period Selection Modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPeriodModal(false)}>
          <div className="bg-[#9DC3E6] rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Select Period Type</h3>
            <div className="space-y-3">
              {['Daily', 'Weekly', 'Monthly'].map(period => (
                <button
                  key={period}
                  onClick={() => handlePeriodSelect(period.toLowerCase())}
                  className="w-full py-4 bg-white text-[#383838] rounded-xl hover:bg-opacity-90 transition-colors text-lg font-medium"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDatePicker(false)}>
          <div className="bg-[#9DC3E6] rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-t-xl px-4 py-2 mb-4">
              <h3 className="text-center font-bold text-white bg-[#e84797] rounded-lg py-2">
                {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'September 2025'}
              </h3>
            </div>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  date: e.target.value
                }));
              }}
              className="w-full p-4 rounded-xl text-[#383838] text-center text-lg"
            />
            <button
              onClick={() => setShowDatePicker(false)}
              className="mt-4 w-full py-3 bg-[#e84797] text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;