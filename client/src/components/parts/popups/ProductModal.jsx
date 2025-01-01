import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = ({ isOpen, onClose, products, onSelect, selectedProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 flex items-center justify-center z-50'
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-[#494d4ad5] mix-blend-screen"
          onClick={onClose}
        />

        <motion.div 
          initial={{ 
            scale: 0.4,
            opacity: 0,
            rotateX: 90,
            y: -60
          }}
          animate={{ 
            scale: [0.4, 1.1, 1],
            opacity: 1,
            rotateX: 0,
            y: 0
          }}
          exit={{ 
            scale: 0.4,
            opacity: 0,
            rotateX: -90,
            y: 60
          }}
          transition={{ 
            type: "spring",
            damping: 15,
            stiffness: 300,
            bounce: 0.4,
            duration: 0.6
          }}
          style={{
            transformPerspective: 1200,
            transformStyle: "preserve-3d"
          }}
          className="w-full max-w-[850px] backdrop-blur-3xl py-8 bg-[linear-gradient(45deg,#ffffff90,#ffffff70)] flex flex-col gap-5 rounded-3xl px-8 relative z-10"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center"
          >
            <h2 className="text-2xl font-bold text-[#14532d]">Select Product</h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#14532d]/10 hover:bg-[#14532d]/20 flex items-center justify-center transition-colors"
            >
              <i className="ri-close-line text-xl text-[#14532d]"></i>
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-xl border border-[#14532d]/20 focus:border-[#14532d]/30 outline-none transition-all text-[#14532d] placeholder:text-[#14532d]/50"
            />
            <i className="ri-search-line absolute right-4 top-3.5 text-[#14532d]/50"></i>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {filteredProducts?.map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                key={product._id}
                onClick={() => {
                  onSelect(product);
                  onClose();
                }}
                className="h-52 min-w-40 max-w-full flex flex-col justify-center items-center rounded-[30px] relative group"
              >
                <img 
                  className='max-w-[80px] -translate-y-[-25px] h-[80px] w-[80px] object-cover max-h-[80px] mix-blend-darken drop-shadow-2xl z-20' 
                  src={product.pics?.one || "https://via.placeholder.com/300"} 
                  alt={product.name} 
                />
                <img 
                  className="px-0 max-w-[50px] shadowed opacity-20 absolute" 
                  src={product.pics?.one || "https://via.placeholder.com/300"} 
                  alt="" 
                />

                <span className='w-full h-auto bg-[linear-gradient(#ffffff40,#ffffff70)] flex flex-col px-5 rounded-t-[25px] rounded-bl-[25px] rounded-br-[90px] pt-8 flex-1 justify- gap-2 pb-0'>
                  <span className='mt-1'>    
                    <h1 className='text-[20px] font-medium leading-tight'>{product.name}</h1>
                    <span className='flex flex-col'>
                      <p className='opacity-60 text-[14px] font-medium text-[#14532d]'>Stock: {product.stock}g</p>
                    </span>
                  </span>

                  {selectedProduct === product._id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-20 right-0 bg-[#14532d] rounded-full p-1 w-5 h-5 flex items-center justify-center"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
