import React, { createContext, useCallback, useContext, useState } from 'react';
import { ToastType } from './types';
import ToastComponent from 'src/components/Toast/Toast';

interface ToastProps {
  renderToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastProps | null>(null);

interface IToast {
  type: ToastType;
  message: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<{ type: ToastType; message: string }[]>([]);

  const renderToast = useCallback((type: ToastType, message: string) => {
    setToasts((prevToasts: IToast[]) => [...prevToasts, { type, message }]);
    setTimeout(() => {
      setToasts((prevToasts: IToast[]) => prevToasts.slice(1));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ renderToast }}>
      {children}
      <div className='fixed bottom-4 right-4'>
        {toasts.map((toast: IToast, index: number) => (
          <ToastComponent key={index} type={toast.type} message={toast.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
