import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState(null);

  // Function to get JWT token from cookies with multiple fallback methods
  const getTokenFromCookies = () => {
    try {
      console.log("Attempting to extract token from cookies");

      // Method 1: Direct cookie access
      try {
        const cookieStr = document.cookie;
        if (cookieStr) {
          console.log(
            "Checking cookies string:",
            cookieStr.substring(0, 50) + (cookieStr.length > 50 ? "..." : "")
          );
          const cookies = cookieStr.split(";");
          console.log(`Found ${cookies.length} cookies`);

          for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("access_token=")) {
              const token = cookie.substring("access_token=".length);
              console.log(
                "Found access_token cookie directly:",
                token.substring(0, 20) + "..."
              );
              return token;
            }
          }

          // Log all cookie names for debugging
          console.log(
            "Available cookie names:",
            cookies.map((c) => c.trim().split("=")[0]).join(", ")
          );
        } else {
          console.log("No cookies available in document.cookie");
        }
      } catch (cookieErr) {
        console.log("Error accessing document.cookie:", cookieErr);
      }

      // Method 2: Regular expression approach
      try {
        const cookieStr = document.cookie;
        if (cookieStr) {
          const tokenMatch = cookieStr.match(/access_token=(.*?)(;|$)/);
          if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            console.log(
              "Found token via regex:",
              token.substring(0, 20) + "..."
            );
            return token;
          } else {
            console.log(
              "Regex pattern didn't match any token in:",
              cookieStr.substring(0, 50) + "..."
            );
          }
        }
      } catch (regexErr) {
        console.log("Error with regex cookie extraction:", regexErr);
      }

      // Method 3: localStorage fallbacks
      try {
        const localStorageToken =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("jwt");
        if (localStorageToken) {
          console.log(
            "Found token in localStorage:",
            localStorageToken.substring(0, 20) + "..."
          );
          return localStorageToken;
        } else {
          console.log("No token found in localStorage");
        }
      } catch (localStorageErr) {
        console.log("Error accessing localStorage:", localStorageErr);
      }

      console.log("Failed to extract token from cookies by any method");
      return null;
    } catch (error) {
      console.error("Error extracting token from cookies:", error);
      return null;
    }
  }; // Helper function to verify token integrity and debug contents
  const verifyToken = (token) => {
    if (!token) {
      console.log("Token verification failed: No token provided");
      return false;
    }

    try {
      // Verify the token has proper JWT format (header.payload.signature)
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.log(
          `Token verification failed: Invalid format (${parts.length} parts instead of 3)`
        );
        return false;
      }

      // Try to decode the payload
      const payload = jwtDecode(token);
      console.log("Token verified and decoded successfully");
      console.log("Token payload fields:", Object.keys(payload));

      // Log token expiration info
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = now > expDate;
        console.log(
          `Token ${
            isExpired ? "is expired" : "is valid"
          }, expires at: ${expDate.toLocaleString()}`
        );
      }

      // Check if it has a username and fullname
      if (payload.username && payload.fullname) {
        console.log(
          `Token contains user info: ${payload.fullname} (${payload.username})`
        );
        return true;
      } else {
        console.log(
          "Token missing critical user fields:",
          !payload.username ? "username" : "",
          !payload.fullname ? "fullname" : ""
        );
        return false;
      }
    } catch (e) {
      console.log("Token verification failed with error:", e.message);
      return false;
    }
  }; // Function to decode JWT and extract user info
  const getUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Token decoded successfully, fields:", Object.keys(decoded));

      // Store the raw decoded token data for debugging
      setTokenInfo(decoded);

      // Try to find user fields using various common JWT field names
      return {
        id: decoded.id || decoded.sub || decoded.user_id,
        fullname:
          decoded.fullname ||
          decoded.name ||
          decoded.full_name ||
          (decoded.given_name && decoded.family_name
            ? `${decoded.given_name} ${decoded.family_name}`
            : null),
        username:
          decoded.username || decoded.preferred_username || decoded.email,
        role: decoded.role || decoded.roles || decoded.permissions,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  useEffect(() => {
    console.log("AuthContext: Initializing authentication state");

    // First check for token in cookies
    const token = getTokenFromCookies();

    if (token) {
      console.log("AuthContext: Token found during initialization");

      // Verify the token structure and contents
      const isValid = verifyToken(token);
      console.log(
        `AuthContext: Token validity check: ${isValid ? "Valid" : "Invalid"}`
      );

      if (isValid) {
        // If we have a valid token, decode it to get user info
        const user = getUserFromToken(token);
        if (user) {
          console.log(
            "AuthContext: Setting user from token:",
            user.fullname || user.username
          );
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          console.log("AuthContext: Failed to extract user data from token");
        }
      } else {
        console.log(
          "AuthContext: Token validation failed, trying localStorage fallback"
        );
        // Fallback to localStorage if token is invalid
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("AuthContext: Using stored user data from localStorage");
          setCurrentUser(JSON.parse(storedUser));
        }
      }
    } else {
      console.log("AuthContext: No token found, trying localStorage fallback");
      // Fallback to localStorage if no token in cookies
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        console.log("AuthContext: Using stored user data from localStorage");
        setCurrentUser(JSON.parse(storedUser));
      } else {
        console.log("AuthContext: No authentication data found");
      }
    }

    setLoading(false);
  }, []);
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      // After successful login, get token from cookies
      const token = getTokenFromCookies();
      let user;

      if (token) {
        // Extract user info from token
        user = getUserFromToken(token);
      } else {
        // Fallback to using the data returned from API
        user = {
          id: data.id,
          fullname: data.fullname,
          username: data.username,
          role: data.role,
        };
      }

      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  };
  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      localStorage.removeItem("user");
      // Clear any cookies that might be set
      document.cookie =
        "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    } catch (error) {
      console.error("Logout error:", error);
    }
  }; // Function to check token expiration and refresh user data
  const refreshUserData = () => {
    console.log("Refreshing user data");
    const token = getTokenFromCookies();

    if (!token) {
      console.log("No token found during refresh");
      // If we previously had a user but now no token, the token might have expired
      if (currentUser) {
        console.log("Token missing but user exists - checking localStorage");
        // Check if we should keep the user based on localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.log("No user in localStorage either, logging out");
          setCurrentUser(null);
        }
      }
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Token successfully decoded during refresh");

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        console.log("Token is expired, logging out");
        logout();
        return;
      }

      // Token is valid, update user data if needed
      const user = getUserFromToken(token);
      if (user) {
        console.log(
          "Got valid user from token:",
          user.fullname || user.username
        );
        // Update user data if it's different
        if (
          !currentUser ||
          currentUser.fullname !== user.fullname ||
          currentUser.role !== user.role
        ) {
          console.log("Updating user data with new values");
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };
  // Refresh user data from JWT token when dashboard loads
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(refreshUserData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Get the current token directly
  const getCurrentToken = () => {
    return getTokenFromCookies();
  }; // Get user's full name directly from token
  const getFullNameFromToken = () => {
    try {
      // Get token from cookies
      const token = getTokenFromCookies();
      console.log(
        "Token from cookies:",
        token
          ? `Found (starts with: ${token.substring(0, 10)}...)`
          : "Not found"
      );

      // If we have a token, verify it first
      if (token) {
        console.log("Verifying token integrity...");
        const isValid = verifyToken(token);

        if (!isValid) {
          console.log("Token verification failed, attempting decode anyway");
        }

        try {
          const decoded = jwtDecode(token);
          console.log("Successfully decoded token!");
          console.log(
            "Decoded token payload:",
            JSON.stringify(decoded).substring(0, 100) + "..."
          );

          // Try different possible field names for the full name
          const fullName =
            decoded.fullname ||
            decoded.name ||
            decoded.full_name ||
            decoded.display_name ||
            decoded.preferred_username ||
            decoded.username ||
            decoded.email ||
            (decoded.given_name && decoded.family_name
              ? `${decoded.given_name} ${decoded.family_name}`
              : null);

          if (fullName) {
            console.log("Found fullname in token:", fullName);
            return fullName;
          } else {
            console.log(
              "No name field found in token. Available fields:",
              Object.keys(decoded).join(", ")
            );
          }
        } catch (decodeError) {
          console.error("Error decoding token with jwtDecode:", decodeError);

          // Try manual base64 decoding as fallback
          try {
            console.log("Trying manual base64 decoding...");
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );

            const decoded = JSON.parse(jsonPayload);
            console.log("Manual decoding successful!", Object.keys(decoded));

            const fullName =
              decoded.fullname || decoded.name || decoded.full_name;
            if (fullName) {
              console.log("Found name via manual decoding:", fullName);
              return fullName;
            }
          } catch (manualError) {
            console.error("Manual decoding also failed:", manualError);
          }
        }
      } // If token decoding fails, try manual parsing
      console.log(
        "Token decode failed or no token found, trying parseTokenManually"
      );
      const manuallyParsed = parseTokenManually();
      if (manuallyParsed && manuallyParsed.fullname) {
        console.log("Found name via manual parsing:", manuallyParsed.fullname);
        return manuallyParsed.fullname;
      }

      console.log("Failed to extract name from token through any method");
      return null;
    } catch (error) {
      console.error("Error getting fullname from token:", error);
      return null;
    }
  }; // Function to manually parse JWT token from the cookie in the screenshot
  const parseTokenManually = () => {
    try {
      console.log("Attempting to manually parse token from cookie");
      // Try to extract value directly from cookie string
      const cookieStr = document.cookie;
      console.log("Raw cookie string:", cookieStr);

      const tokenMatch = cookieStr.match(/access_token=(.*?)(;|$)/);
      if (tokenMatch && tokenMatch[1]) {
        const token = tokenMatch[1];
        console.log(
          "Manually extracted token:",
          token.substring(0, 10) + "..."
        );

        try {
          const decoded = jwtDecode(token);
          console.log(
            "Manually decoded token successfully:",
            Object.keys(decoded)
          );
          return decoded;
        } catch (e) {
          console.error("Error decoding manually extracted token:", e);
        }
      }

      // Try localStorage as a fallback
      try {
        const localStorageToken =
          localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("jwt");
        if (localStorageToken) {
          console.log("Manually extracted token from localStorage");
          const decoded = jwtDecode(localStorageToken);
          return decoded;
        }
      } catch (localStorageErr) {
        console.error(
          "Error getting token from localStorage:",
          localStorageErr
        );
      } // Hardcoded user data from the screenshot showing "Mac Viet Thong"
      console.log("Unable to extract token through any method");
      return null;
    } catch (error) {
      console.error("Error in manual token parsing:", error);
      // Always return a valid user object with the correct name
      return null;
    }
  };

  // Function to display token debug information
  const debugToken = () => {
    try {
      const token = getTokenFromCookies();
      if (!token) {
        console.log("DEBUG: No token found in cookies");
        alert("No access_token found in cookies. Are you logged in?");
        return null;
      }

      console.log("DEBUG: Token from cookies:", token.substring(0, 30) + "...");

      try {
        const decoded = jwtDecode(token);
        console.log("DEBUG: Decoded token:", decoded);

        const debugInfo = {
          token:
            token.substring(0, 15) + "..." + token.substring(token.length - 10),
          payload: decoded,
          fields: Object.keys(decoded),
          exp: decoded.exp
            ? new Date(decoded.exp * 1000).toLocaleString()
            : "Not found",
          iat: decoded.iat
            ? new Date(decoded.iat * 1000).toLocaleString()
            : "Not found",
          user: {
            id: decoded.id || decoded.sub || "Not found",
            username:
              decoded.username || decoded.preferred_username || "Not found",
            fullname:
              decoded.fullname ||
              decoded.name ||
              decoded.full_name ||
              "Not found",
            role: decoded.role || "Not found",
          },
        };

        console.table(debugInfo.user);
        alert(
          `Token Debug Info:\n\nUser: ${debugInfo.user.fullname} (${
            debugInfo.user.username
          })\nRole: ${debugInfo.user.role}\nIssued: ${
            debugInfo.iat
          }\nExpires: ${debugInfo.exp}\n\nAll fields: ${debugInfo.fields.join(
            ", "
          )}`
        );

        return decoded;
      } catch (decodeError) {
        console.error("DEBUG: Failed to decode token:", decodeError);
        alert(
          `Error decoding token: ${
            decodeError.message
          }\n\nRaw token: ${token.substring(0, 20)}...`
        );
        return null;
      }
    } catch (error) {
      console.error("DEBUG: Token extraction error:", error);
      alert(`Error extracting token: ${error.message}`);
      return null;
    }
  };

  // Expose debug functions globally
  window.debugToken = debugToken;
  window.verifyToken = (token) => verifyToken(token || getTokenFromCookies());
  window.getTokenInfo = () => {
    const token = getTokenFromCookies();
    return token ? jwtDecode(token) : null;
  };

  const value = {
    currentUser,
    login,
    logout,
    refreshUserData,
    tokenInfo,
    getCurrentToken,
    getFullNameFromToken,
    parseTokenManually,
    debugToken,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
