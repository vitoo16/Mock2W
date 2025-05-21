/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        sky: {
          100: "#e0f2fe",
          200: "#bae6fd",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
        float: "float 6s ease-in-out infinite",
        "shooting-star": "shooting-star 5s ease-in-out infinite",
        "bubble-float": "bubble-float 8s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "shooting-star": {
          "0%": { transform: "translateX(-100px)", opacity: 0 },
          "10%": { opacity: 1 },
          "20%": { opacity: 0 },
          "100%": { transform: "translateX(100px)", opacity: 0 },
        },
        "bubble-float": {
          "0%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: 0.5,
          },
          "25%": {
            transform: "translateY(-15px) translateX(15px) scale(1.05)",
            opacity: 0.7,
          },
          "50%": {
            transform: "translateY(0) translateX(30px) scale(1)",
            opacity: 0.5,
          },
          "75%": {
            transform: "translateY(15px) translateX(15px) scale(0.95)",
            opacity: 0.7,
          },
          "100%": {
            transform: "translateY(0) translateX(0) scale(1)",
            opacity: 0.5,
          },
        },
      },
    },
  },
  plugins: [],
};
