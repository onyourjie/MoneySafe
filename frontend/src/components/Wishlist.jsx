import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addWishlist, getWishlists, deleteWishlist, updateWishlist } from "../lib/wishlist";
import { addSaving, getSavingsByWishlist } from "../lib/saving";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logoutUser } from "../lib/authService";

const Wishlist = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    target: "",
    type: "days",
    daily_saving: "",
    file: null,
    image_url: "",
  });
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [savings, setSavings] = useState([]);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData();
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  async function fetchData() {
    try {
      const userId = auth.currentUser?.uid;
      console.log("User ID:", userId); // Tambahkan ini untuk melihat ID
      if (!userId) {
        throw new Error("User not logged in");
      }
      const data = await getWishlists(userId);
      setWishlists(data);
    } catch (err) {
      console.error("Failed to load wishlists:", err);
      Swal.fire("Error!", "Failed to load wishlist items.", "error");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  // ✅ CREATE or UPDATE Wishlist
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target || !formData.type || !formData.daily_saving) {
      return Swal.fire("Oops!", "Please fill all fields.", "warning");
    }

    Swal.fire({ title: "Saving...", didOpen: () => Swal.showLoading() });

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("User not logged in");
      }

      if (formData.id) {
        await updateWishlist(formData.id, {
          name: formData.name,
          target: Number(formData.target),
          type: formData.type,
          daily_saving: Number(formData.daily_saving),
          image_url: formData.image_url,
          user_id: userId,
        }, formData.file);
        Swal.fire("Updated!", "Wishlist updated successfully", "success");
      } else {
        await addWishlist(
          {
            name: formData.name,
            target: Number(formData.target),
            type: formData.type,
            daily_saving: Number(formData.daily_saving),
            user_id: userId,
          },
          formData.file
        );
        Swal.fire("Added!", `"${formData.name}" added to wishlist`, "success");
      }

      fetchData();
      setFormData({ id: null, name: "", target: "", type: "", daily_saving: "", file: null, image_url: "" });
    } catch (err) {
      console.error("Failed to save wishlist:", err);
      Swal.fire("Error!", "Failed to save wishlist.", "error");
    }
  };

  // DELETE Wishlist
  const handleDelete = async (id, imageUrl) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will also delete all savings related to this wishlist!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("User not logged in");
        }
        await deleteWishlist(id, imageUrl, userId);
        setWishlists(wishlists.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Wishlist removed.", "success");
      } catch (err) {
        console.error("Failed to delete wishlist:", err);
        Swal.fire("Error!", "Failed to delete item.", "error");
      }
    }
  };

  // EDIT Wishlist
  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      target: item.target,
      type: item.type,
      daily_saving: item.daily_saving,
      file: null,
      image_url: item.image_url,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#EEFFEE]">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E84797]"></div>
        </div>
      ) : (
        <>
          {/* Mobile Navigation - Top */}
          <nav className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
            <div className="flex justify-around">
              <Link to="/homepage" className="text-sm font-bold text-[#787575]">Home</Link>
              <Link to="/chart" className="text-sm font-bold text-[#787575]">Chart</Link>
              <Link to="/budget" className="text-sm font-bold text-[#787575]">Budget</Link>
              <Link to="/wishlist" className="text-sm font-bold text-[#383838]">Wishlist</Link>
            </div>
          </nav>

          {/* Header */}
          <div className="flex justify-between items-center px-6 md:px-28 py-4 mt-14 md:mt-0">
            <div className="flex items-center gap-3">
              <img src="/footer/finmate.svg" alt="Finmate" className="h-30 md:h-30" />
            </div>
            <div className="hidden md:flex justify-center items-center gap-16">
              <Link to="/homepage" className="text-base font-bold text-[#383838] hover:text-[#E84797]">Home</Link>
              <Link to="/chart" className="text-base font-bold text-[#383838] hover:text-[#E84797]">Chart</Link>
              <Link to="/budget" className="text-base font-bold text-[#383838] hover:text-[#E84797]">Budget</Link>
              <Link to="/wishlist" className="text-base font-bold text-[#383838] relative">
                Wishlist
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-5px] w-16 h-[2px] bg-[#e84797] rounded-full shadow-md"></div>
              </Link>
            </div>
            <div className="flex items-center gap-4 relative profile-dropdown">
              <p className="text-xl font-bold text-[#383838]">{user?.displayName || user?.email || 'Nina'}</p>
              <div 
                className="w-14 h-14 rounded-full overflow-hidden cursor-pointer"
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

          {/* Hero Section */}
          <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#e7a0cc] to-[#fffcfe] rounded-[40px] p-12 shadow-lg relative overflow-hidden">
              <div className="max-w-md">
                <h1 className="text-[64px] font-bold text-[#383838] mb-6">Wishlist</h1>
                <p className="text-xl text-[#383838]">
                  Turn your dreams into plans. Add the things you want, and we'll calculate how much you need to save and when you can make it happen.
                </p>
              </div>
              <img 
                src="/wishlist.png" 
                alt="Wishlist illustration" 
                className="absolute right-12 top-12 w-64 h-64 object-contain"
              />
            </div>

            {/* Form or Wishlist Display */}
            {showForm || wishlists.length === 0 ? (
              // Form Section
              <div className="max-w-5xl mx-auto mt-8">
                <div className="bg-[#94c2da] rounded-[40px] p-8 shadow-lg relative overflow-hidden mb-8">
                  <div className="h-[400px] flex items-center justify-center bg-gray-200 rounded-xl">
                    {formData.file ? (
                      <img 
                        src={URL.createObjectURL(formData.file)} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : formData.image_url ? (
                      <img 
                        src={formData.image_url} 
                        alt="Wishlist item" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <label className="cursor-pointer text-center">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <div className="text-[#383838] text-xl">
                          📸 Click to upload image
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Name Input */}
                  <div className="bg-[#fdf5f5] rounded-[10px] shadow-md">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-transparent text-xl font-extralight text-black outline-none"
                    />
                  </div>

                  {/* Target Input */}
                  <div className="bg-[#fdf5f5] rounded-[10px] shadow-md">
                    <input
                      type="number"
                      name="target"
                      placeholder="Target"
                      value={formData.target}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-transparent text-xl font-extralight text-black outline-none"
                    />
                  </div>

                  {/* Type Dropdown */}
                  <div className="bg-[#fdf5f5] rounded-lg border border-[#d3d3d3] shadow-lg">
                    <div className="flex justify-between items-center px-8 py-6">
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-transparent text-xl font-extralight text-black outline-none cursor-pointer"
                      >
                        <option value="">Tipe</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                      </select>
                    </div>
                  </div>

                  {/* Daily Saving Input */}
                  <div className="bg-[#fdf5f5] rounded-[10px] shadow-md">
                    <input
                      type="number"
                      name="daily_saving"
                      placeholder="Amount of Saving"
                      value={formData.daily_saving}
                      onChange={handleInputChange}
                      className="w-full px-8 py-6 bg-transparent text-xl font-extralight text-black outline-none"
                    />
                  </div>

                  {/* Submit Button with Piggy Banks */}
                  <div className="flex justify-center items-center gap-8 mt-12">
                    <div className="relative w-48 h-48">
                      <img src="/babi.png" alt="Piggy bank"/>
                    </div>
                    <button
                      type="submit"
                      className="px-20 py-4 bg-[#E84797] rounded-[10px] shadow-md text-[32px] font-bold text-[white]/50 hover:text-[#E84797] hover:bg-white transition-colors"
                    >
                      Change
                    </button>
                    <div className="relative w-48 h-48">
                      <img src="/babi.png" alt="Piggy bank"/>
                    </div>
                  </div>

                  {wishlists.length > 0 && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setFormData({ id: null, name: "", target: "", type: "days", daily_saving: "", file: null, image_url: "" });
                        }}
                        className="text-[#383838] hover:text-[#E84797] font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : showDetailView && selectedWishlist ? (
              // Detail View
              <div className="max-w-5xl mx-auto mt-8">
                {/* Image Section */}
                <div className="bg-[#94c2da] rounded-[40px] p-8 shadow-lg mb-8">
                  <img 
                    src={selectedWishlist.image_url || '/wishlist.png'} 
                    alt={selectedWishlist.name} 
                    className="w-full h-[400px] object-cover rounded-xl"
                  />
                </div>

                {/* Info Section */}
                <div className="bg-[#94c2da] rounded-[40px] p-8 shadow-lg space-y-4 mb-6">
                  <h2 className="text-4xl font-bold text-[#383838]">{selectedWishlist.name}</h2>
                  <p className="text-3xl font-bold text-[#22C55E]">
                    Rp {selectedWishlist.target?.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xl text-[#383838]">
                    Rp {selectedWishlist.daily_saving?.toLocaleString('id-ID')} /{selectedWishlist.type}
                  </p>
                  
                  <div className="h-px bg-white/30 my-4"></div>
                  
                  <div className="grid grid-cols-2 gap-4 text-[#383838]">
                    <div>
                      <p className="text-sm text-[#383838]/70 mb-1">Start Date</p>
                      <p className="font-semibold">
                        {new Date(selectedWishlist.start_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[#383838]/70 mb-1">End Date</p>
                      <p className="font-semibold">
                        {(() => {
                          const remaining = selectedWishlist.target - (selectedWishlist.collected || 0);
                          const daysLeft = Math.ceil(remaining / selectedWishlist.daily_saving);
                          const endDate = new Date(selectedWishlist.start_date);
                          endDate.setDate(endDate.getDate() + daysLeft);
                          return endDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
                        })()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSavingsModal(true)}
                    className="w-full mt-4 py-4 bg-[#E84797] text-white rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-colors"
                  >
                    Add Saving
                  </button>
                </div>

                {/* Collected and Less Section */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#94c2da] rounded-[20px] p-6 text-center shadow-lg">
                    <p className="text-[#383838] text-lg mb-2">Collected</p>
                    <p className="text-3xl font-bold text-[#22C55E]">
                      Rp {(selectedWishlist.collected || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="bg-[#94c2da] rounded-[20px] p-6 text-center shadow-lg">
                    <p className="text-[#383838] text-lg mb-2">Less</p>
                    <p className="text-3xl font-bold text-[#EF4444]">
                      Rp {(selectedWishlist.target - (selectedWishlist.collected || 0)).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Savings History */}
                <div className="space-y-4">
                  {savings.length === 0 ? (
                    <div className="bg-white/50 rounded-xl p-8 text-center text-[#383838]">
                      <p>No savings yet. Start saving now!</p>
                    </div>
                  ) : (
                    savings.map((saving) => (
                      <div key={saving.id} className="flex items-center justify-between bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#FEF3C7] rounded-lg flex items-center justify-center text-2xl">
                            📅
                          </div>
                          <div>
                            <p className="font-semibold text-[#383838] text-lg">
                              {new Date(saving.created_at).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'numeric', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                            {saving.note && <p className="text-sm text-gray-600 italic">{saving.note}</p>}
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-[#22C55E]">
                          +Rp{saving.amount?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => {
                      setShowDetailView(false);
                      setSelectedWishlist(null);
                      setSavings([]);
                    }}
                    className="text-[#383838] hover:text-[#E84797] font-semibold text-lg"
                  >
                    ← Back to Wishlist
                  </button>
                </div>
              </div>
            ) : (
              // Wishlist Grid
              <div className="max-w-6xl mx-auto mt-12 animate-fadeIn">
                <div className="flex justify-center mb-8 animate-slideDown">
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-4 bg-[#E84797] text-white rounded-xl font-semibold text-lg hover:bg-opacity-90 transition-all transform hover:scale-110 hover:shadow-xl hover:rotate-2 shadow-lg"
                  >
                    Add Wishlist
                  </button>
                </div>

                {/* Wishlist Cards Carousel */}
                <div className="relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    {wishlists.slice(currentSlide, currentSlide + 2).map((item, index) => (
                      <div 
                        key={item.id} 
                        className="bg-gradient-to-br from-[#94c2da] to-[#7db3d4] rounded-[40px] shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 hover:-rotate-1 group animate-slideUp"
                        style={{ animationDelay: `${index * 0.2}s` }}
                        onClick={async () => {
                          setSelectedWishlist(item);
                          const data = await getSavingsByWishlist(item.id);
                          setSavings(data);
                          setShowDetailView(true);
                        }}>
                        <div className="h-80 bg-gray-300 relative overflow-hidden">
                          <img 
                            src={item.image_url || '/wishlist.png'} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Image overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#94c2da]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-8 relative group-hover:bg-white/30 transition-colors">
                          <h3 className="text-2xl font-bold text-[#383838] mb-2 group-hover:scale-105 transition-transform">{item.name}</h3>
                          <p className="text-3xl font-bold text-[#22C55E] mb-2 group-hover:scale-110 transition-transform">
                            Rp {item.target?.toLocaleString('id-ID')}
                          </p>
                          <p className="text-lg text-[#383838] mb-4 group-hover:scale-105 transition-transform">
                            Rp {item.daily_saving?.toLocaleString('id-ID')} /{item.type}
                          </p>
                          <p className="text-sm text-gray-600 mb-2 group-hover:scale-105 transition-transform">
                            Start Date {new Date(item.start_date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="flex items-center gap-4 my-4 group-hover:scale-105 transition-transform">
                            <div className="flex-1 bg-white rounded-full h-3 relative shadow-inner">
                              <div 
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#E84797] to-[#ff6b9d] rounded-full flex items-center justify-center transition-all duration-500 group-hover:animate-shimmer shadow-md"
                                style={{ width: `${Math.min((item.collected / item.target) * 100, 100)}%` }}
                              >
                                <span className="absolute left-2 text-xs font-bold text-white">
                                  Rp{item.collected?.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <span className="absolute right-2 top-0 text-xs font-bold text-[#383838]">
                                {Math.round((item.collected / item.target) * 100)}%
                              </span>
                              <span className="absolute right-2 top-4 text-xs text-gray-600">
                                Rp{item.target?.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>

                          <p className="text-center text-sm text-gray-600 mt-4 group-hover:scale-105 transition-transform">
                            Estimation {(() => {
                              const remaining = item.target - (item.collected || 0);
                              const daysLeft = Math.ceil(remaining / item.daily_saving);
                              return `${daysLeft} ${item.type}`;
                            })()}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                              className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id, item.image_url);
                              }}
                              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Dots */}
                  {wishlists.length > 2 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {Array.from({ length: Math.ceil(wishlists.length / 2) }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index * 2)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            currentSlide === index * 2 ? 'bg-[#E84797]' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Add Saving Modal */}
          {showSavingsModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowSavingsModal(false)}>
              <div className="bg-white rounded-3xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-3xl font-bold text-[#383838] mb-8 text-center">Saving</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const amount = e.target.amount.value;
                  const note = e.target.note.value;
                  
                  if (!amount || amount <= 0) {
                    Swal.fire({
                      icon: "warning",
                      title: "Oops!",
                      text: "Please enter a valid amount",
                      confirmButtonColor: '#E84797'
                    });
                    return;
                  }

                  try {
                    await addSaving(selectedWishlist.id, Number(amount), note);
                    await fetchData();
                    
                    if (showDetailView) {
                      const updatedSavings = await getSavingsByWishlist(selectedWishlist.id);
                      setSavings(updatedSavings);
                      const updatedWishlist = wishlists.find(w => w.id === selectedWishlist.id);
                      setSelectedWishlist(updatedWishlist);
                    }
                    
                    setShowSavingsModal(false);
                    Swal.fire({
                      icon: "success",
                      title: "Success!",
                      text: `Rp ${Number(amount).toLocaleString('id-ID')} added to savings!`,
                      confirmButtonColor: '#E84797',
                      timer: 2000
                    });
                  } catch (error) {
                    console.error(error);
                    Swal.fire({
                      icon: "error",
                      title: "Error!",
                      text: "Failed to add saving",
                      confirmButtonColor: '#E84797'
                    });
                  }
                }} className="space-y-6">
                  {/* Amount Input */}
                  <div className="bg-[#FFF0F8] rounded-xl p-4 border border-[#FADADD]">
                    <input
                      type="number"
                      name="amount"
                      placeholder="Rp50.000"
                      className="w-full bg-transparent outline-none text-[#383838] text-lg placeholder-[#383838]/50"
                      required
                    />
                  </div>
                  
                  {/* Note Input */}
                  <div className="bg-[#FFF0F8] rounded-xl p-4 border border-[#FADADD]">
                    <input
                      type="text"
                      name="note"
                      placeholder="Note (Optional)"
                      className="w-full bg-transparent outline-none text-[#383838] placeholder-[#383838]/50"
                    />
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowSavingsModal(false)}
                      className="flex-1 py-3 text-[#E84797] font-semibold hover:bg-gray-100 rounded-xl transition-colors text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#E84797] text-white rounded-xl font-semibold hover:bg-opacity-90 transition-colors text-lg"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

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
                <img src="/footer/footer.svg" alt="Finmate Icon" className="w-32 h-auto" />
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
        </>
      )}
    </div>
  )
}

export default Wishlist;