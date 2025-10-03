import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { addWishlist, getWishlists, deleteWishlist, updateWishlist } from "../lib/wishlist";
import { addSaving, getSavingsByWishlist, deleteSaving } from "../lib/saving";

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    target: "",
    type: "",
    daily_saving: "",
    file: null,
    image_url: "",
  });
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [savings, setSavings] = useState([]);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getWishlists();
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
      if (formData.id) {
        await updateWishlist(formData.id, {
          name: formData.name,
          target: Number(formData.target),
          type: formData.type,
          daily_saving: Number(formData.daily_saving),
          image_url: formData.image_url,
        }, formData.file);
        Swal.fire("Updated!", "Wishlist updated successfully 🎉", "success");
      } else {
        await addWishlist(
          {
            name: formData.name,
            target: Number(formData.target),
            type: formData.type,
            daily_saving: Number(formData.daily_saving),
          },
          formData.file
        );
        Swal.fire("Added!", `"${formData.name}" added to wishlist 🎉`, "success");
      }

      fetchData();
      setFormData({ id: null, name: "", target: "", type: "", daily_saving: "", file: null, image_url: "" });
    } catch (err) {
      console.error("Failed to save wishlist:", err);
      Swal.fire("Error!", "Failed to save wishlist.", "error");
    }
  };

  // ✅ DELETE Wishlist
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
        await deleteWishlist(id, imageUrl);
        setWishlists(wishlists.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Wishlist removed.", "success");
      } catch (err) {
        console.error("Failed to delete wishlist:", err);
        Swal.fire("Error!", "Failed to delete item.", "error");
      }
    }
  };

  // ✅ EDIT Wishlist
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ ADD Saving
  const handleAddSaving = async (wishlistId) => {
    const { value: formValues } = await Swal.fire({
      title: "Add Saving",
      html: `
        <input id="amount" type="number" class="swal2-input" placeholder="Amount (Rp)">
        <textarea id="note" class="swal2-textarea" placeholder="Note (optional)"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Add",
      preConfirm: () => {
        const amount = document.getElementById("amount").value;
        const note = document.getElementById("note").value;
        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Please enter a valid amount");
          return false;
        }
        return { amount: Number(amount), note };
      },
    });

    if (formValues) {
      try {
        await addSaving(wishlistId, formValues.amount, formValues.note);
        await fetchData();
        Swal.fire("Success!", `Rp ${formValues.amount.toLocaleString()} added to savings! 💰`, "success");
      } catch (err) {
        console.error("Failed to add saving:", err);
        Swal.fire("Error!", "Failed to add saving.", "error");
      }
    }
  };

  // ✅ VIEW Savings History
  const handleViewSavings = async (wishlist) => {
    setSelectedWishlist(wishlist);
    try {
      const data = await getSavingsByWishlist(wishlist.id);
      setSavings(data);
      setShowSavingsModal(true);
    } catch (err) {
      console.error("Failed to load savings:", err);
      Swal.fire("Error!", "Failed to load savings history.", "error");
    }
  };

  // ✅ DELETE Saving
  const handleDeleteSaving = async (savingId) => {
    const result = await Swal.fire({
      title: "Delete this saving?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteSaving(savingId);
        const updatedSavings = savings.filter((s) => s.id !== savingId);
        setSavings(updatedSavings);
        await fetchData();
        Swal.fire("Deleted!", "Saving entry removed.", "success");
      } catch (err) {
        console.error("Failed to delete saving:", err);
        Swal.fire("Error!", "Failed to delete saving.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex justify-between items-center w-full px-6 py-4 shadow bg-white">
        <Link to="/homepage" className="font-bold text-[#383838] hover:text-[#E84797]">Home</Link>
        <h1 className="text-2xl font-bold text-[#383838]">Wishlist</h1>
        <Link to="/profile" className="font-bold text-[#383838] hover:text-[#E84797]">Profile</Link>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded-lg p-6">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" />
          <input type="number" name="target" placeholder="Target (Rp)" value={formData.target} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" />
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border px-4 py-2 rounded">
            <option value="">Type</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="year">Year</option>
          </select>
          <input type="number" name="daily_saving" placeholder="Saving / day" value={formData.daily_saving} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" />
          <input type="file" onChange={handleFileChange} className="w-full border px-4 py-2 rounded" />
          <button type="submit" className="w-full bg-gradient-to-r from-[#E84797] to-[#C385F5] text-white py-2 rounded font-bold">
            {formData.id ? "Update Wishlist ✏️" : "Add to Wishlist ✨"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-12">
        {wishlists.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover rounded" />}
            <h3 className="font-bold mt-2 text-[#383838]">{item.name}</h3>
            <p className="text-gray-600">Target: Rp {item.target?.toLocaleString()}</p>
            <p className="text-gray-600">Type: {item.type}</p>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Collected: Rp {item.collected?.toLocaleString()}</p>
              <p className="text-red-500 font-semibold">Less: Rp {(item.target - (item.collected || 0)).toLocaleString()}</p>
              
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Started: {new Date(item.start_date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600 text-sm">
                  Estimated completion: {(() => {
                    const remaining = item.target - (item.collected || 0);
                    const daysLeft = Math.ceil(remaining / item.daily_saving);
                    const completionDate = new Date();
                    completionDate.setDate(completionDate.getDate() + daysLeft);
                    return completionDate.toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  })()}
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  {(() => {
                    const remaining = item.target - (item.collected || 0);
                    const daysLeft = Math.ceil(remaining / item.daily_saving);
                    return `${daysLeft} days remaining`;
                  })()}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-[#E84797] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((item.collected / item.target) * 100, 100)}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{Math.round((item.collected / item.target) * 100)}% collected</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-3">
              <button onClick={() => handleAddSaving(item.id)} className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold">
                💰 Add Saving
              </button>
              <button onClick={() => handleViewSavings(item)} className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold">
                📊 View History
              </button>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDelete(item.id, item.image_url)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Savings History Modal */}
      {showSavingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#383838]">
                💰 Savings History: {selectedWishlist?.name}
              </h2>
              <button onClick={() => setShowSavingsModal(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold">
                ×
              </button>
            </div>
            
            <div className="p-6">
              {savings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No savings yet. Start saving now! 💪</p>
              ) : (
                <div className="space-y-3">
                  {savings.map((saving) => (
                    <div key={saving.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                      <div>
                        <p className="font-bold text-green-600">+ Rp {saving.amount?.toLocaleString()}</p>
                        {saving.note && <p className="text-sm text-gray-600 italic">{saving.note}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(saving.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button onClick={() => handleDeleteSaving(saving.id)} className="text-red-500 hover:text-red-700 font-bold">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;