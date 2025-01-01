import React from 'react'
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";


export function Tostify() {
  return (
    <>
    <ToastContainer title="Error" position="bottom-left" />
    </>
  )
}

// Custom content component for the toast
 const ToastContent = ({ title, message }) => (
        <div>
            <strong>{title}</strong>
            <div>{message}</div>
        </div>
    );
    
  
    // Show toast notification function
    export const showToast = (message, type = "success") => {
    if (type === "success" && message) {
        toast.success(
            type && <ToastContent title={"SUCCESS"} message={message} />,
            {
                icon: <FaCheckCircle className="text-[20px]" />,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "custom-toast-success",
                bodyClassName: "custom-toast-body-success",
                progressClassName: "custom-progress-bar-success",
            }
        );
    } else if (message) {
        toast.error(<ToastContent title={"ERROR"} message={message} />, {
            icon: <FaExclamationTriangle className="text-[20px]" />,
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "custom-toast",
            bodyClassName: "custom-toast-body",
            progressClassName: "custom-progress-bar",
        });
    }
  };