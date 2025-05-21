import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagement from './pages/UserManager.jsx';
import Task from "./pages/TaskManager.jsx";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaHeart,
  FaTasks,
  FaEnvelope,
} from "react-icons/fa";
import "./index.css"; 

// Protected route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-blue-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/task" element={<Task />} />
            <Route path="/users" element={<UserManagement />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-800 text-white py-16 shadow-xl relative overflow-hidden">
          {/* Background pattern - Main */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V4h-2V0h-4v2h4v4h2V2h4V0h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "24px 24px",
              }}
            ></div>
          </div>

          {/* Secondary wave pattern */}
          <div className="absolute bottom-0 left-0 w-full h-40 opacity-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="absolute bottom-0"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,202.7C672,213,768,203,864,181.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-20"></div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Company info and links */}
            <div className="flex flex-col items-center text-center">
              {/* Logo and company name with enhanced glow */}
              <div className="flex items-center space-x-2 mb-6 relative">
                <div className="absolute -inset-2 bg-blue-400 opacity-10 blur-lg rounded-full"></div>
                <FaTasks className="h-8 w-8 text-blue-200 relative z-10" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent relative z-10">
                  TaskMaster Pro
                </span>
              </div>

              {/* Quick links in a horizontal row with enhanced styling */}
              <div className="flex flex-wrap justify-center gap-8 my-6">
                <Link
                  to="/"
                  className="text-blue-100 hover:text-white text-sm font-medium transition-all duration-300 hover:underline hover:scale-105"
                >
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="text-blue-100 hover:text-white text-sm font-medium transition-all duration-300 hover:underline hover:scale-105"
                >
                  Dashboard
                </Link>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white text-sm font-medium transition-all duration-300 hover:underline hover:scale-105"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white text-sm font-medium transition-all duration-300 hover:underline hover:scale-105"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white text-sm font-medium transition-all duration-300 hover:underline hover:scale-105"
                >
                  Terms
                </a>
              </div>

              {/* Social media icons - enhanced with better hover effects */}
              <div className="flex space-x-8 my-6">
                <a
                  href="#"
                  className="bg-blue-700/80 hover:bg-blue-500 p-3 rounded-full text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transform"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="bg-blue-700/80 hover:bg-blue-500 p-3 rounded-full text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transform"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="#"
                  className="bg-blue-700/80 hover:bg-blue-500 p-3 rounded-full text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transform"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="mailto:support@taskmasterpro.com"
                  className="bg-blue-700/80 hover:bg-blue-500 p-3 rounded-full text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110 transform"
                >
                  <FaEnvelope size={20} />
                </a>
              </div>

              {/* Copyright with enhanced styling */}
              <div className="mt-8 border-t border-blue-700/50 pt-6 text-blue-200 text-sm w-full max-w-2xl">
                <p className="mb-2 text-blue-100">
                  © {new Date().getFullYear()} TaskMaster Pro. All rights
                  reserved.
                </p>
                <p className="flex items-center justify-center text-blue-200/80">
                  Made with{" "}
                  <FaHeart
                    className="text-pink-400 mx-2 animate-pulse"
                    size={14}
                  />{" "}
                  by Group 1
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced decorative elements */}
          {/* Top left circle */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>

          {/* Bottom right circle */}
          <div
            className="absolute bottom-10 right-10 w-36 h-36 bg-indigo-300 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Middle left circle */}
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Middle right circle */}
          <div
            className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-blue-300 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Added additional decorative elements */}
          {/* Top right glowing orb */}
          <div
            className="absolute top-1/4 right-1/4 w-12 h-12 bg-cyan-300 rounded-full opacity-10 animate-pulse"
            style={{ animationDelay: "0.7s" }}
          ></div>

          {/* Bottom left floating rectangle */}
          <div
            className="absolute bottom-20 left-1/3 w-16 h-8 bg-blue-200 rounded-lg opacity-10 animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>

          {/* Small sparkles */}
          <div
            className="absolute top-1/3 left-1/6 w-3 h-3 bg-white rounded-full opacity-30 animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/6 w-3 h-3 bg-white rounded-full opacity-30 animate-ping"
            style={{ animationDuration: "2.5s", animationDelay: "1s" }}
          ></div>

          {/* Subtle diagonal line */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <div className="absolute top-0 right-0 w-1/2 h-full transform rotate-45 origin-top-right border-t-2 border-white/20"></div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
