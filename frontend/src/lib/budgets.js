import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const budgetsCollection = collection(db, 'budgets');

// Add a new budget
export const addBudget = async (budget) => {
  const docRef = await addDoc(budgetsCollection, budget);
  return docRef.id;
};

// Get all budgets
export const getBudgets = async () => {
  const querySnapshot = await getDocs(budgetsCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update a budget by id
export const updateBudget = async (id, updatedBudget) => {
  const budgetDoc = doc(db, 'budgets', id);
  await updateDoc(budgetDoc, updatedBudget);
};

// Delete a budget by id
export const deleteBudget = async (id) => {
  const budgetDoc = doc(db, 'budgets', id);
  await deleteDoc(budgetDoc);
};
