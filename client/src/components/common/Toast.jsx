import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import './Toast.css';

const icons = { success: <FaCheckCircle />, error: <FaTimesCircle />, info: <FaInfoCircle /> };

const Toast = ({ message, type = 'info', visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => onClose && onClose(), 4000);
      return () => clearTimeout(t);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type} toast-enter`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
    </div>
  );
};

export default Toast;
