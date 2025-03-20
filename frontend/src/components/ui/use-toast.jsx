import { useState, useEffect, createContext, useContext } from "react";

const ToastContext = createContext({
  toast: () => {},
  dismissToast: () => {}
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default", duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant, duration }]);
    return id;
  };

  const dismissToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastContainer = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
};

const Toast = ({ id, title, description, variant, duration, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`rounded-md border p-4 shadow-md transition-all max-w-md ${
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground border-destructive"
          : "bg-background text-foreground border-border"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-medium">{title}</div>}
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
        <button
          className="text-sm opacity-70 hover:opacity-100"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};