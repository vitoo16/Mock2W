import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length) {
        focusableElements[0].focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Close when clicking overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      onClick={handleOverlayClick}
    >
      {/* Backdrop overlay with blur and enhanced effects */}
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity animate-fadeIn overflow-hidden">
        {/* Bubble effects in the backdrop */}
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }}></div>
        <div className="absolute top-2/3 left-1/4 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-bubble-float" style={{ animationDuration: "10s" }}></div>
        
        {/* Floating tiny bubbles */}
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-300/40 rounded-full animate-ping" style={{ animationDuration: "3s" }}></div>
        <div className="absolute bottom-1/3 left-2/3 w-2 h-2 bg-indigo-200/30 rounded-full animate-ping" style={{ animationDuration: "2.5s", animationDelay: "1s" }}></div>
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-purple-300/20 rounded-full animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }}></div>
      </div>

      {/* Modal container */}
      <div
        ref={modalRef}
        className="relative z-10 max-w-lg w-full mx-4 animate-modalPop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Bubble accents inside modal */}
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-400/20 rounded-full blur-md"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-indigo-300/10 rounded-full blur-lg"></div>
          
          {/* Small decorative bubbles */}
          <div className="absolute top-6 right-12 w-2 h-2 bg-blue-400/30 rounded-full"></div>
          <div className="absolute bottom-8 left-10 w-1.5 h-1.5 bg-indigo-300/40 rounded-full"></div>
          <div className="absolute top-1/2 left-6 w-1 h-1 bg-purple-400/30 rounded-full"></div>
          
          {/* Close button with bubble effect */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 z-10 group"
          >
            <FaTimes size={16} />
            <div className="absolute -inset-1 scale-0 group-hover:scale-100 bg-gray-200/50 rounded-full blur-sm transition-transform"></div>
            <div className="absolute top-0 right-0 w-1 h-1 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Modal body */}
          <div className="p-6 relative z-10">{children}</div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-modalPop {
          animation: modalPop 0.25s cubic-bezier(0.4, 2, 0.6, 1) both;
        }
      `}</style>
    </div>
  );
}
