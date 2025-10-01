import { supabase } from "./supabase";

// CREATE: tambah saving
export async function addSaving(wishlistId, amount, note = "") {
  const { data, error } = await supabase
    .from("savings")
    .insert([
      { wishlist_id: wishlistId, amount, note }
    ])
    .select();

  if (error) throw error;

  // update collected di wishlist
  await supabase.rpc("increment_collected", { wid: wishlistId, amt: amount });

  return data[0];
}

// READ: ambil semua savings untuk wishlist tertentu
export async function getSavingsByWishlist(wishlistId) {
  const { data, error } = await supabase
    .from("savings")
    .select("*")
    .eq("wishlist_id", wishlistId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// DELETE: hapus saving
export async function deleteSaving(id) {
  const { error } = await supabase.from("savings").delete().eq("id", id);
  if (error) throw error;
}
