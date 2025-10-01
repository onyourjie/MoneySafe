import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, resetPassword, signInWithGoogle } from "../lib/authService";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  const handleForgotPassword = async () => {
    if (!form.email.trim()) {
      setError("Please enter your email address first");
      return;
    }

    try {
      await resetPassword(form.email);
      alert("Password reset email sent! Check your inbox.");
    } catch (resetError) {
      console.error("Password reset error:", resetError);
      setError("Failed to send password reset email");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      await signInWithGoogle();
      // Navigate to homepage
      navigate("/homepage", { replace: true });
    } catch (googleError) {
      console.error("Google login error:", googleError);
      
      let errorMessage = "Google login failed. Please try again.";
      
      if (googleError.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled by user.";
      } else if (googleError.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please allow popups for this site.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!form.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      
      // Navigate to homepage
      navigate("/homepage", { replace: true });
    } catch (firebaseError) {
      console.error("Login error:", firebaseError);
      
      // Handle specific Firebase errors
      let errorMessage = "Login failed. Please try again.";
      
      if (firebaseError.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (firebaseError.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (firebaseError.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (firebaseError.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeffee] relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-8 lg:px-16 py-8">
        {/* Logo */}
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-16">
          <div className="flex gap-16">
            <Link to="/" className="text-[#383838] font-bold text-base hover:text-[#e84797] transition-colors">
              Home
            </Link>
            <a href="#" className="text-[#383838] font-bold text-base hover:text-[#e84797] transition-colors">
              Chart
            </a>
            <a href="#" className="text-[#383838] font-bold text-base hover:text-[#e84797] transition-colors">
              Budget
            </a>
            <a href="#" className="text-[#383838] font-bold text-base hover:text-[#e84797] transition-colors">
              Wishlist
            </a>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[#383838] font-bold text-xl">Login</span>
              <div className="h-0.5 bg-[#e84797] shadow-md transform -rotate-[0.106deg]"></div>
            </div>
            <Link to="/register" className="text-[#383838] font-bold text-xl hover:text-[#e84797] transition-colors">Sign up</Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#383838]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-4 md:px-8 lg:px-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-[600px]">
          
          {/* Left Side - Hero Content */}
          <div className="flex-1 max-w-[600px] text-center lg:text-left lg:pr-8">
            <h1 className="text-[#383838] font-bold text-4xl md:text-5xl lg:text-[55px] mb-8 leading-tight">
              Manage your money, grow your future
            </h1>
            
            <p className="text-[#383838] text-lg md:text-xl mb-12 max-w-[360px] mx-auto lg:mx-0">
              Track your spending, plan your budget, and achieve your goals with us.
            </p>

            <Link to="/homepage" className="inline-block bg-[#4e7cb2] text-[#eeffee] font-bold text-xl md:text-2xl px-8 py-4 rounded-lg shadow-lg hover:bg-[#3d6399] transition-colors">
              Start Managing
            </Link>

            {/* Hero Image for Mobile */}
            <div className="lg:hidden mt-12 flex justify-center">
              <div className="relative">
                <div className="w-[300px] h-[300px] bg-[#e84797]/[0.38] rounded-full"></div>
                <img
                  src="/naik.svg"
                  alt="Financial illustration"
                  className="absolute top-0 left-0 w-[300px] h-[300px] object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-auto lg:min-w-[400px] bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 lg:p-10 relative z-20 lg:ml-8">
            <h2 className="text-2xl font-bold text-[#e84797] mb-2">Join Us!</h2>
            <p className="text-sm font-medium text-black mb-8">Fill this form to create an account</p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="nina@gmail.com"
                  value={form.email}
                  onChange={onChange}
                  className="w-full h-14 px-4 bg-[#fdf5f5] rounded-lg shadow-lg border-none outline-none text-sm"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="************"
                  value={form.password}
                  onChange={onChange}
                  className="w-full h-14 px-4 bg-[#fdf5f5] rounded-lg shadow-lg border-none outline-none text-sm font-medium"
                  disabled={loading}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 bg-[#fdf5f5] rounded border-none shadow-lg appearance-none checked:bg-[#e84797]"
                    />
                    {rememberMe && (
                      <svg className="w-3 h-3 absolute top-0.5 left-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-black">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-black hover:text-[#e84797] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#e84797] text-white text-[32px] font-bold rounded-lg shadow-lg hover:bg-[#d63d87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Social Login Divider */}
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#e32d2d]/60"></div>
              <span className="text-sm font-light text-black">Or connect with</span>
              <div className="flex-1 h-px bg-[#e32d2d]/60"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-16 h-16 bg-[#fdf5f5] rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#F85F5F" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              
              <button className="w-16 h-16 bg-[#fdf5f5] rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
              
              <button className="w-16 h-16 bg-[#fdf5f5] rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0047FF">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-black">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#e84797] font-bold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>

          {/* Hero Image for Desktop (Behind form) */}
          <div className="hidden lg:block absolute left-[8%] top-[20%] -z-10">
            <div className="relative">
              <div className="w-[350px] h-[350px] bg-[#e84797]/[0.25] rounded-full"></div>
              <img
                src="/naik.svg"
                alt="Financial illustration"
                className="absolute -top-8 -left-8 w-[400px] h-[400px] object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
