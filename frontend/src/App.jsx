import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Homepage from "./components/Homepage"
import Register from "./components/Register"
import Login from "./components/Login"
import Landingpage from "./components/Landingpage"
import Premium from "./components/Premium"
import Chart from "./components/chart"
import Wishlist from "./components/Wishlist"
import Budget from "./components/Budget"
import ProtectedRoute from "./components/ProtectedRoute"
import { listenAuth } from "./lib/authService"

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/homepage" /> : <Landingpage />} />
        <Route path="/landingpage" element={user ? <Navigate to="/homepage" /> : <Landingpage />} />
        <Route path="/register" element={user ? <Navigate to="/homepage" /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/homepage" /> : <Login />} />
        <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="/chart" element={<ProtectedRoute><Chart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
