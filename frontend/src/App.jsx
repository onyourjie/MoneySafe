import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import Homepage from "./components/Homepage"
import Register from "./components/Register"
import Login from "./components/Login"
import Landingpage from "./components/Landingpage"
import Premium from "./components/Premium"
import Chart from "./components/chart"
import Wishlist from "./components/Wishlist"
import Budget from "./components/Budget"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuthStore } from "./stores"

export default function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe && unsubscribe();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/homepage" /> : <Landingpage />} />
        <Route path="/landingpage" element={isAuthenticated ? <Navigate to="/homepage" /> : <Landingpage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/homepage" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/homepage" /> : <Login />} />
        <Route path="/homepage" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />
        <Route path="/chart" element={<ProtectedRoute><Chart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
