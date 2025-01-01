import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import greenGrocerLogo from "../../../../../assets/Logos/main.png";

export default function NotFound() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="w-screen h-screen bg-[linear-gradient(45deg,#006536,#00437b)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] backdrop-blur-2xl py-16 bg-[#ffffff1a] flex items-center justify-center flex-col gap-8 rounded-3xl px-10 relative"
      >
        <motion.img 
          src={greenGrocerLogo} 
          alt="Green Grocer Logo" 
          className="w-32 mb-4 brightness-0 invert"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-center space-y-4"
        >
          <motion.h1 
            variants={item}
            className="text-8xl font-bold text-white mb-4"
          >
            404
          </motion.h1>
          <motion.p 
            variants={item}
            className="text-2xl text-white/80 mb-8"
          >
            Oops! Page not found
          </motion.p>
          <motion.p 
            variants={item}
            className="text-lg text-white/60 mb-8"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/user/home')}
          className="bg-[linear-gradient(45deg,#006536,#00437b)] group py-4 px-8 text-white rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span>Back to Home</span>
          <i className="ri-home-line text-xl opacity-50 scale-0 duration-300 group-hover:scale-100"></i>
        </motion.button>
      </motion.div>
    </div>
  );
}
