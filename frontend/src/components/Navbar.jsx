import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaTasks, FaUserPlus } from "react-icons/fa";

export default function Navbar() {
  const {
    currentUser,
    logout,
    isAuthenticated,
    getFullNameFromToken,
    parseTokenManually,
    debugToken,
    isAdmin,
  } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [tokenFullName, setTokenFullName] = useState("");
  const navigate = useNavigate();
  console.log("Navbar render - Auth state:", { isAuthenticated, currentUser }); // Function to get name using all available methods
  const getNameFromToken = () => {
    // Try standard method first
    const fullName = getFullNameFromToken();
    if (fullName) {
      console.log("Navbar: Found name from token:", fullName);
      return fullName;
    }

    // If that fails, try manual parsing
    if (parseTokenManually) {
      const tokenData = parseTokenManually();
      if (tokenData && tokenData.fullname) {
        console.log(
          "Navbar: Found name via manual parsing:",
          tokenData.fullname
        );
        return tokenData.fullname;
      }
    }

    // If we can't get the name, return a generic placeholder
    console.log("Navbar: Unable to extract user name from token");
    return currentUser?.fullname || currentUser?.username || "User";
  };

  // Get fullname from token when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Navbar: Getting full name from token");
      const name = getNameFromToken();
      setTokenFullName(name);

      // Check for token changes periodically
      const interval = setInterval(() => {
        console.log("Navbar: Checking for token name changes");
        const updatedName = getNameFromToken();
        if (updatedName && updatedName !== tokenFullName) {
          console.log("Navbar: Updating token full name to:", updatedName);
          setTokenFullName(updatedName);
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]); // Only depend on auth state changes

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  // Add token debug function
  // const handleDebugToken = () => {
  //   if (debugToken) {
  //     debugToken();
  //   } else if (typeof window.debugToken === 'function') {
  //     window.debugToken();
  //   } else {
  //     alert("Debug function not available");
  //   }
  // };

  return (
    <nav className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 shadow-lg">
      {/* Bubble pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large bubbles */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-10 blur-lg animate-pulse"></div>
        <div
          className="absolute top-1/2 -translate-y-1/2 left-3/4 w-16 h-16 bg-purple-500 rounded-full opacity-5 blur-md animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Additional large bubbles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-5 blur-2xl"></div>
        <div className="absolute -bottom-5 left-1/6 w-36 h-36 bg-indigo-600 rounded-full opacity-10 blur-xl"></div>
        <div
          className="absolute top-3/4 right-1/6 w-28 h-28 bg-violet-500 rounded-full opacity-5 blur-lg animate-pulse"
          style={{ animationDelay: "1.2s", animationDuration: "4s" }}
        ></div>

        {/* Medium bubbles with animations */}
        <div
          className="absolute top-1/3 right-1/2 w-12 h-12 bg-sky-400 rounded-full opacity-10 animate-bubble-float blur-md"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-10 h-10 bg-indigo-300 rounded-full opacity-15 animate-bubble-float blur-sm"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-2/3 left-1/5 w-14 h-14 bg-blue-500 rounded-full opacity-5 animate-bubble-float blur-md"
          style={{ animationDuration: "7s", animationDelay: "1s" }}
        ></div>

        {/* Spinning bubble rings */}
        <div className="absolute top-1/4 right-1/5 w-20 h-20 rounded-full border border-blue-300/20 animate-spin-slow"></div>
        <div
          className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full border border-indigo-400/10 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "10s" }}
        ></div>

        {/* Gradient bubble */}
        <div
          className="absolute top-10 left-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-500/10 blur-xl animate-pulse"
          style={{ animationDuration: "5s" }}
        ></div>

        {/* Glowing effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>

        {/* Small floating bubbles */}
        <div
          className="absolute top-1/4 left-1/6 w-3 h-3 bg-blue-300 rounded-full opacity-30 animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-2/3 right-1/4 w-2 h-2 bg-blue-200 rounded-full opacity-20 animate-ping"
          style={{ animationDuration: "2.5s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-indigo-300 rounded-full opacity-20 animate-ping"
          style={{ animationDuration: "4s", animationDelay: "0.5s" }}
        ></div>

        {/* Additional tiny bubbles */}
        <div
          className="absolute top-1/2 right-1/3 w-2 h-2 bg-white rounded-full opacity-40 animate-ping"
          style={{ animationDuration: "2s", animationDelay: "0.2s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-blue-100 rounded-full opacity-30 animate-ping"
          style={{ animationDuration: "1.8s", animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/6 w-1 h-1 bg-indigo-200 rounded-full opacity-40 animate-ping"
          style={{ animationDuration: "2.2s" }}
        ></div>

        {/* Shooting stars effect */}
        <div
          className="absolute h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-300 to-transparent top-1/4 left-1/3 opacity-0 animate-shooting-star"
          style={{ transform: "rotate(15deg)", animationDelay: "3s" }}
        ></div>
        <div
          className="absolute h-0.5 w-8 bg-gradient-to-r from-transparent via-indigo-200 to-transparent top-2/3 right-1/3 opacity-0 animate-shooting-star"
          style={{ transform: "rotate(-20deg)", animationDelay: "7s" }}
        ></div>

        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-blue-900/50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo with improved styling */}
          <Link
            to="/"
            className="text-white font-semibold flex items-center group transition-all"
          >
            <div className="relative mr-3 bg-blue-600/30 p-2 rounded-lg shadow-inner shadow-blue-800/50 transform group-hover:scale-110 transition-all duration-300 overflow-hidden">
              <FaTasks className="w-6 h-6 text-blue-200 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <div className="absolute -inset-1 bg-blue-500 opacity-20 blur-sm rounded-lg"></div>
              
              {/* Logo bubble accents */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 transition-opacity"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-0 group-hover:opacity-70 transition-opacity delay-100"></div>
              <div className="absolute top-1/2 left-0 w-1 h-1 bg-blue-100 rounded-full opacity-0 group-hover:opacity-80 transition-opacity delay-200"></div>
            </div>
            <div className="relative">
              <span className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-200 font-bold">
                TaskMaster Pro
              </span>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-indigo-300 transition-all duration-300"></div>
              
              {/* Text bubble accents */}
              <div className="absolute -top-1 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 transform group-hover:translate-y-1 transition-all delay-150"></div>
              <div className="absolute -bottom-2 left-1/3 w-1 h-1 bg-indigo-200 rounded-full opacity-0 group-hover:opacity-70 transform group-hover:translate-y-1 transition-all delay-300"></div>
            </div>
          </Link>

          {/* Always show these navigation elements */}
          <div className="flex items-center gap-3 md:gap-6">
            {isAuthenticated ? (
              <>
                {" "}
                {/* User info badge */}
                <div className="text-white bg-blue-700/30 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-600/20 hover:bg-blue-600/40 transition-colors shadow-md backdrop-blur-sm relative overflow-hidden group">
                  {/* Bubbles inside user info badge */}
                  <div className="absolute -bottom-1 left-2 w-2 h-2 bg-blue-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-1 right-4 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-150"></div>
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-indigo-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-300"></div>
                  
                  <div className="relative">
                    <FaUserCircle className="text-blue-300 h-5 w-5" />
                    <div className="absolute -inset-1 bg-blue-400 opacity-20 blur-sm rounded-full"></div>
                  </div>
                  <span className="hidden sm:inline relative z-10">
                    {tokenFullName || currentUser?.fullname || "User"}
                  </span>
                </div>
                {/* Dashboard link */}
                <Link
                  to="/dashboard"
                  className="text-white hover:text-blue-200 px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-200 backdrop-blur-sm relative group overflow-hidden"
                >
                  <FaTasks className="inline-block mr-2" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/users"
                    className="text-white hover:text-blue-200 px-4 py-2 rounded-md hover:bg-white/10 transition-all duration-200 backdrop-blur-sm relative group overflow-hidden"
                  >
                    <FaUserPlus className="inline-block mr-2" />
                    User Management
                  </Link>
                )}
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-gradient-to-r from-red-600/90 to-pink-700/90 hover:from-red-700/90 hover:to-pink-800/90 text-white px-4 py-2 text-sm rounded-md shadow-lg flex items-center gap-2 transition duration-200 disabled:opacity-70 relative overflow-hidden group"
                  aria-label="Logout"
                >
                  {/* Logout button bubbles */}
                  <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-red-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 delay-150"></div>
                  <div className="absolute bottom-1 left-3 w-1 h-1 bg-pink-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-y-1 delay-300"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {isLoggingOut ? (
                    <span className="flex items-center gap-2 relative z-10">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="hidden sm:inline relative z-10">
                        Logging out...
                      </span>
                    </span>
                  ) : (
                    <>
                      <FaSignOutAlt className="relative z-10" />
                      <span className="hidden sm:inline relative z-10">
                        Logout
                      </span>
                    </>
                  )}
                </button>
                {/* Debug token button */}
                {/* <button
                  onClick={handleDebugToken}
                  className="bg-purple-600/90 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded-md shadow transition duration-200"
                >
                  Debug Token
                </button> */}
              </>
            ) : (
              <>
                {/* Login and Register buttons with enhanced styling */}
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700/90 hover:to-blue-800/90 text-white px-5 py-2 text-sm rounded-md shadow-lg transition duration-200 relative overflow-hidden group"
                >
                  {/* Login button bubbles */}
                  <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-blue-300/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-y-1 delay-100"></div>
                  <div className="absolute bottom-1 right-3 w-2 h-2 bg-indigo-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 delay-200"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-300"></div>
                  
                  <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-green-600/90 to-emerald-700/90 hover:from-green-700/90 hover:to-emerald-800/90 text-white px-5 py-2 text-sm rounded-md shadow-lg transition duration-200 relative overflow-hidden group"
                >
                  {/* Register button bubbles */}
                  <div className="absolute bottom-1 left-2 w-2 h-2 bg-green-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-y-1 delay-100"></div>
                  <div className="absolute top-1 right-3 w-1.5 h-1.5 bg-emerald-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 delay-200"></div>
                  <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-300"></div>
                  
                  <div className="absolute inset-0 bg-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Remove the mobile menu button - we'll make a simplified responsive design */}
        </div>
      </div>
    </nav>
  );
}
