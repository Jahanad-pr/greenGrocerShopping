import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductQuantityPopup = ({ onClose, options, stock ,setOptions,showPopup}) => {
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('gram');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    let newOption;
    if(unit ==='Kg'){
      if(quantity > stock/1000){
        setError('Quantity must be less than or equal to stock')
        return;
      } else {
        if(quantity>=1){
        // alert(quantity)
        newOption = `${quantity}Kg`;
      }else{
        newOption = `${quantity*1000}g`;
      }

      }
      setOptions( prevData => [...prevData,newOption] )
    }
    if(unit ==='gram'){
      if(quantity > stock){
        setError('Quantity must be less than or equal to stock')
        return;
      } else {
        if(quantity<1000){
          newOption = `${quantity}g`;
        }else{
          newOption = `${quantity/1000}Kg`;
        }
      }
    }
    
    if (newOption) {
      onClose(newOption);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[#000000]/30"
          onClick={onClose}
        />

        <motion.div
          initial={{ 
            scale: 0.4,
            opacity: 0,
            y: -60
          }}
          animate={{ 
            scale: 1,
            opacity: 1,
            y: 0
          }}
          exit={{ 
            scale: 0.4,
            opacity: 0,
            y: 60
          }}
          transition={{ 
            type: "spring",
            damping: 15,
            stiffness: 300,
            duration: 0.6
          }}
          className="bg-transparent backdrop-blur-xl rounded-[30px] p-8 max-w-md w-full mx-4 relative shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 z-50 before:absolute before:inset-0 before:rounded-[30px] before:bg-gradient-to-b before:from-white/60 before:to-white/30 before:-z-10"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={()=>showPopup(false)}
            className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/50 transition-colors"
          >
            <i className="ri-close-line text-2xl text-gray-800"></i>
          </motion.button>

          <div className="space-y-6">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-800"
            >
              Custom Quantity
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="flex-1 p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 outline-none focus:ring-2 focus:ring-green-500/50"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="p-3 custom-selecto rounded-xl bg-white/50 backdrop-blur-sm border border-white/50 outline-none focus:ring-2 focus:ring-green-500/50"
                >
                  <option value="gram">Gram</option>
                  <option value="Kg">Kg</option>
                </select>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="w-full p-3 rounded-full bg-[#2b4f3a] text-white font-medium hover:bg-green-600 transition-colors"
              >
                Add Custom Quantity
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductQuantityPopup;