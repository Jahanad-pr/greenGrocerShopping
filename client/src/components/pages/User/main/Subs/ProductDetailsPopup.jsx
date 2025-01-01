import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailsPopup = ({ product, onClose, onNext, onPrev }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-[#000000]/30"
          onClick={onClose}
        />

        {/* Navigation Buttons */}
        <motion.button 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onPrev}
          className="left-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-white/40 transition-colors shadow-lg z-50"
        >
          <i className="ri-arrow-left-s-line text-3xl text-gray-800"></i>
        </motion.button>

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
          className="bg-transparent backdrop-blur-xl rounded-[30px] p-8 max-w-2xl w-full mx-4 relative shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 z-50 before:absolute before:inset-0 before:rounded-[30px] before:bg-gradient-to-b before:from-white/60 before:to-white/30 before:-z-10"
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/50 transition-colors"
          >
            <i className="ri-close-line text-2xl text-gray-800"></i>
          </motion.button>
          
          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              key={`img-${product.name}`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="relative flex items-center justify-center"
            >
              <motion.img 
                key={`img-src-${product.imgSrc}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={product.imgSrc} 
                alt={product.name} 
                className="w-full md:w-48 h-48 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              {/* Discount Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="absolute top-2 left-2 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg border border-white/50"
              >
                {(() => {
                  const productVal = product?.discount?.value || 0;
                  const categoryVal = product?.category?.discount?.value || 0;

                  // Convert both to percentage for comparison
                  const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                  const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);

                  // Return the greater discount with its symbol
                  if (productPercent > categoryPercent) {
                    return `${productVal}${product?.discount?.isPercentage ? '%' : '₹'}`;
                  } else {
                    return `${categoryVal}${product?.category?.discount?.isPercentage ? '%' : '₹'}`;
                  }
                })()}
              </motion.div>
            </motion.div>
            
            <motion.div 
              key={`content-${product.name}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 space-y-6"
            >
              <div>
                <motion.h2 
                  key={`title-${product.name}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2 text-gray-800"
                >
                  {product.name}
                </motion.h2>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4 }}
                  className="h-1 w-20 bg-gradient-to-r from-green-400/80 to-green-500/80 rounded-full"
                ></motion.div>
              </div>

              <motion.div 
                key={`details-${product.name}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="grid gap-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#ffffff25] p-4 rounded-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:to-transparent before:-z-10"
                >
                  <p className="text-gray-800 flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <i className="ri-scales-3-line"></i>
                      Quantity
                    </span>
                    <span className="text-lg">{product.quantity/1000} Kg</span>
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#ffffff25] p-4 rounded-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b  before:to-transparent before:-z-10"
                >
                  <p className="text-gray-800 flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2 ">
                      <i className="ri-price-tag-3-line"></i>
                      Price per Kg
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">₹
                        {(() => {
                        const productVal = product?.discount?.value || 0;
                        const categoryVal = product?.category?.discount?.value || 0;
                        
                        // Convert both to percentage for comparison
                        const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                        const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);
                        
                        // Calculate final price with the higher percentage discount
                        let finalPrice;
                        if (productPercent > categoryPercent) {
                            finalPrice = product?.discount?.isPercentage ? 
                                (product?.regularPrice - (product?.regularPrice * productVal / 100)) : 
                                (product?.regularPrice - productVal);
                        } else {
                            finalPrice = product?.category?.discount?.isPercentage ? 
                                (product?.regularPrice - (product?.regularPrice * categoryVal / 100)) : 
                                (product?.regularPrice - categoryVal);
                        }
                        
                        return finalPrice.toFixed(2);
                      })()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">₹{product?.regularPrice}</span>
                    </div>
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#ffffff25] p-4 rounded-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b  before:to-transparent before:-z-10"
                >
                  <p className="text-gray-800 flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                      <i className="ri-gift-line"></i>
                      You Save
                    </span>
                    <span className="text-lg text-green-600">
                      ₹{(() => {
                        const productVal = product?.discount?.value || 0;
                        const categoryVal = product?.category?.discount?.value || 0;
                        
                        // Convert both to percentage for comparison
                        const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                        const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);
                        
                        // Calculate savings amount (the actual discount)
                        let savings;
                        if (productPercent > categoryPercent) {
                            savings = product?.discount?.isPercentage ? 
                                (product?.regularPrice * productVal / 100) : 
                                productVal;
                        } else {
                            savings = product?.category?.discount?.isPercentage ? 
                                (product?.regularPrice * categoryVal / 100) : 
                                categoryVal;
                        }
                        
                        return ((product.quantity/1000) * savings).toFixed(2);
                      })()}
                    </span>
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className=" bg-[#ffffff25] border-green-200/50 p-4 rounded-xl relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b  before:to-transparent before:-z-10"
                >
                  <p className="text-gray-800 flex justify-between items-center">
                    <span className="font-bold flex items-center gap-2">
                      <i className="ri-money-dollar-circle-line"></i>
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{(() => {
                        const productVal = product?.discount?.value || 0;
                        const categoryVal = product?.category?.discount?.value || 0;
                        
                        // Convert both to percentage for comparison
                        const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                        const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);
                        
                        // Calculate final price with the higher percentage discount
                        let finalPrice;
                        if (productPercent > categoryPercent) {
                            finalPrice = product?.discount?.isPercentage ? 
                                (product?.regularPrice - (product?.regularPrice * productVal / 100)) : 
                                (product?.regularPrice - productVal);
                        } else {
                            finalPrice = product?.category?.discount?.isPercentage ? 
                                (product?.regularPrice - (product?.regularPrice * categoryVal / 100)) : 
                                (product?.regularPrice - categoryVal);
                        }
                        
                        return ((product.quantity/1000) * finalPrice).toFixed(2);
                      })()}
                    </span>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.button 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onNext}
          className="right-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm border border-white/50  transition-colors shadow-lg z-50"
        >
          <i className="ri-arrow-right-s-line text-3xl text-gray-800"></i>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetailsPopup;
