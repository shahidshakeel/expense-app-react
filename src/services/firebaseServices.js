import {
  doc,
  query,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  writeBatch,
} from 'firebase/firestore';

import { db } from './firebase';

// Fetch all employees
export const fetchEmployees = async () => {
  const employeesCollection = collection(db, 'users');
  const employeesSnapshot = await getDocs(employeesCollection);
  const employees = employeesSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  // Simply return the employees data without expenses
  return employees;
};

export const fetchExpenses = async () => {
  const response = await fetch('http://localhost:3000/getAllUserExpenses');
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
};

export const addEmployeeToDatabase = async (employeeData) => {
  try {
    const docRef = doc(collection(db, 'users'));
    await setDoc(docRef, employeeData);
    console.log('Document written with ID: ', docRef.id);
    return { id: docRef.id }; // Return the document ID
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e; // Rethrow the error to handle it in the calling function
  }
};

export const deleteEmployeeFromDatabase = async (id) => {
  const employeeRef = doc(db, 'users', id);
  await deleteDoc(employeeRef);
};

// Function to update an employee
export const updateEmployeeInDatabase = async (id, updates) => {
  const employeeRef = doc(db, 'users', id);
  await updateDoc(employeeRef, updates);
};

// Function to delete multiple employees by their document IDs
export const deleteMultipleEmployeesFromDatabase = async (ids) => {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    const docRef = doc(db, 'users', id);
    batch.delete(docRef);
  });
  await batch.commit();
};

// Helper function to fetch data
export const fetchData = async (collectionName, queries = []) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queries);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
};