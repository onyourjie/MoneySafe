// ini kalau mau pakai Firebase
/* import { db, storage } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

async function uploadImage(file) {
  const storageRef = ref(storage, `wishlist/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// CREATE
export async function addWishlist(data, file) {
  let imageUrl = "";
  if (file) {
    imageUrl = await uploadImage(file);
  }

  return await addDoc(collection(db, "wishlist"), {
    ...data,
    collected: 0,
    image_url: imageUrl,
    start_date: new Date(),
  });
}

// READ
export async function getWishlists() {
  const snapshot = await getDocs(collection(db, "wishlist"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// UPDATE
export async function updateWishlist(id, newData, file) {
  const refDoc = doc(db, "wishlist", id);

  let updateData = { ...newData };

  // kalau ada file baru, upload dan replace image_url
  if (file) {
    const newUrl = await uploadImage(file);
    updateData.image_url = newUrl;
  }

  await updateDoc(refDoc, updateData);
}

// DELETE
export async function deleteWishlist(id, imageUrl) {
  const refDoc = doc(db, "wishlist", id);
  await deleteDoc(refDoc);

  // kalau ada gambar, hapus juga dari Storage
  if (imageUrl) {
    try {
      const imgRef = ref(storage, imageUrl);
      await deleteObject(imgRef);
    } catch (err) {
      console.error("Gagal hapus image dari storage:", err);
    }
  }
}   */

// ini kalau mau pakai Supabase

import { supabase } from "./supabase";

// READ (ambil semua data)
export async function getWishlists(userId) {
  if (!userId) throw new Error("User ID is required");
  
  const { data, error } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return data;
}

// CREATE (tambah data baru)
export async function addWishlist(item, file) {
  let imageUrl = "";

  // Upload file ke Storage
  if (file) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("wishlist")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Dapatkan public URL
    const { data: { publicUrl } } = supabase.storage
      .from("wishlist")
      .getPublicUrl(filePath);
    
    imageUrl = publicUrl;
  }

  if (!item.user_id) throw new Error("User ID is required");

  const { error } = await supabase.from("wishlist").insert([
    {
      name: item.name,
      target: item.target,
      type: item.type,
      daily_saving: item.daily_saving,
      collected: 0,
      start_date: new Date(),
      end_date: null,
      image_url: imageUrl,
      user_id: item.user_id,
    },
  ]);

  if (error) throw error;
}

// UPDATE (edit wishlist)
export async function updateWishlist(id, updatedData, file) {
  let imageUrl = updatedData.image_url || "";

  // kalau ada file baru, upload ulang
  if (file) {
    // Hapus gambar lama jika ada
    if (imageUrl) {
      const oldPath = extractPathFromUrl(imageUrl);
      if (oldPath) {
        await supabase.storage.from("wishlist").remove([oldPath]);
      }
    }

    // up gambar baru
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("wishlist")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("wishlist")
      .getPublicUrl(filePath);
    
    imageUrl = publicUrl;
  }

  if (!updatedData.user_id) throw new Error("User ID is required");

  const { error } = await supabase
    .from("wishlist")
    .update({
      ...updatedData,
      image_url: imageUrl,
    })
    .eq("id", id)
    .eq("user_id", updatedData.user_id);

  if (error) throw error;
}

// DELETE (hapus wishlist + gambar)
export async function deleteWishlist(id, imageUrl, userId) {
  if (!userId) throw new Error("User ID is required");
  
  // Hapus gambar dari storage jika ada
  if (imageUrl) {
    const path = extractPathFromUrl(imageUrl);
    if (path) {
      const { error: storageError } = await supabase.storage
        .from("wishlist")
        .remove([path]);
      
      if (storageError) {
        console.error("Storage delete error:", storageError);
      }
    }
  }

  // hapus data dari database
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("id", id)
    .eq("user_id", userId); // Pastikan hanya pemilik yang bisa menghapus
  if (error) throw error;
}

// helper function untuk extract path dari URL
function extractPathFromUrl(url) {
  if (!url) return null;
  
  try {
    // Format URL Supabase Storage:
    // https://[project].supabase.co/storage/v1/object/public/wishlist/filename.jpg
    const parts = url.split('/storage/v1/object/public/wishlist/');
    if (parts.length > 1) {
      return parts[1];
    }
    
    // ini fallback buat ambil bagian terakhir dari URL
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  } catch (error) {
    console.error("Error extracting path:", error);
    return null;
  }
}