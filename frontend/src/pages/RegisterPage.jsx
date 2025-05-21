import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserPlus,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Create payload without confirmPassword and with default role
      const payload = {
        fullname: formData.fullname,
        username: formData.username,
        password: formData.password,
        role: "user", // Default role is user
      };

      await registerUser(payload);

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 opacity-20 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full space-y-8 bg-white/95 p-10 rounded-[2rem] shadow-xl border border-blue-100 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4 mb-3 shadow-lg">
            <FaUserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Join TaskMaster Pro and boost your productivity!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl flex items-center">
            <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm">
              Registration successful! Redirecting to login...
            </span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full pl-10 rounded-xl border border-gray-300 px-4 py-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm transition-all duration-200 focus:shadow-md"
                  placeholder="Your full name"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full pl-10 rounded-xl border border-gray-300 px-4 py-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm transition-all duration-200 focus:shadow-md"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 rounded-xl border border-gray-300 px-4 py-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm transition-all duration-200 focus:shadow-md"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1 ml-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full pl-10 rounded-xl border border-gray-300 px-4 py-3 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm transition-all duration-200 focus:shadow-md"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="group relative w-full flex justify-center py-3 px-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg transition-all duration-200 disabled:from-blue-400 disabled:to-indigo-400"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaUserPlus
                className={`h-5 w-5 ${
                  isLoading ? "animate-pulse" : "group-hover:animate-bounce"
                }`}
              />
            </span>
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Registering...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
