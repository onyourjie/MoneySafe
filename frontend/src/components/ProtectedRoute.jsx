import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eeffee]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#e84797] mx-auto mb-4"></div>
          <p className="text-[#383838] font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}