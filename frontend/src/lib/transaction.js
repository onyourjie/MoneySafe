import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// CREATE
export async function addTransaction(data) {
  return await addDoc(collection(db, "transactions"), data);
}

// READ
export async function getTransactions() {
  const snapshot = await getDocs(collection(db, "transactions"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// UPDATE
export async function updateTransaction(id, newData) {
  const ref = doc(db, "transactions", id);
  return await updateDoc(ref, newData);
}

// DELETE
export async function deleteTransaction(id) {
  const ref = doc(db, "transactions", id);
  return await deleteDoc(ref);
}
