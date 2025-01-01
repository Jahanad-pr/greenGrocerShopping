import React, { useState } from "react";
import signinImg from "../../../../assets/images/leftPlate.png";
import placeholderProfile from "../../../../assets/images/placholder_profile.png";
import grocerLogo from "../../../../assets/Logos/main.png";
import profileImage from "../../../../assets/images/pro.png";

import { IoAdd } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useSignInMutation } from "../../../../services/Admin/adminApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  // Initialize hooks
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [signIn, { error, data }] = useSignInMutation();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const userData = await signIn(form).unwrap();
      if (userData) {
        navigate("/admin/home");
      }
    } catch (err) {
      console.error("Failed to sign in:", err);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex w-full h-full">
        {/* Left panel with background image */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-100 flex-[2] min-w-[50%] rounded-l-[555px] order-2 relative"
        >
          <motion.img
            initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1.1, opacity: 1 }}
            transition={{ 
              duration: 1.2,
              type: "spring",
              stiffness: 60,
              damping: 12
            }}
            className="h-full w-full object-cover translate-y-[20px]"
            src={profileImage}
            alt="Profile Background"
          />
        </motion.div>

        {/* Right panel with form */}
        <div className="flex-[3] relative order-1 flex items-center justify-center">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-5 w-full max-w-[50%] mx-auto"
          >
            {/* App logo */}
            <motion.img
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.6 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-[80%] brightness-0"
              src={grocerLogo}
              alt="App Logo"
            />

            {/* Welcome message */}
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -10, opacity: 0.35 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-[13px]"
            >
              Welcome Back, Admin! Login to continue
            </motion.p>

            {/* Input Fields */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col gap-5 w-full max-w-[80%]"
            >
              {/* Email input */}
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full"
              >
                <i className="ri-at-line text-[28px] opacity-20"></i>
                <input
                  placeholder="Email"
                  className="flex-1 bg-transparent outline-none py-3"
                  type="text"
                  name="email"
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Password input */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="flex items-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full"
              >
                <i className="ri-key-line text-[28px] opacity-20"></i>
                <input
                  placeholder="Password"
                  className="flex-1 bg-transparent outline-none py-3"
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                />
              </motion.div>
            </motion.div>

            {/* Sign-in button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-[linear-gradient(to_left,#333399,#FF00CC)] py-5 text-white w-[80%] text-[20px] rounded-full font-bold shadow-[6px_6px_10px_#00000080_inset]"
            >
              Sign In
            </motion.button>

            {/* Error and success messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                  animate={{ opacity: 1, scale: 1, height: "auto", margin: 0, }}
                  exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                  transition={{ duration: 0.2 }} >
                  <div className=" mb-4 mx-16 px-10 rounded-3xl mt-8 bg-[linear-gradient(45deg,#ffffff,#f5efef)] border-[2px] border-gray-300 py-5">
                    <p className="text-[13px] text-red-500 font-medium">
                      {error.data?.message || error.error}
                    </p>
                  </div>
                </motion.div> )}
            </AnimatePresence>

            {data && <p>Signed in successfully!</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
