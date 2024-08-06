import React from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
}

const Toast: React.FC<ToastProps> = ({ type, message }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 text-white rounded-md transition-opacity duration-300 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
      style={{ opacity: 1 }}>
      {message}
    </div>
  );
};

export default Toast;
