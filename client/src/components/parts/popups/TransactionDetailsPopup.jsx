import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionDetailsPopup({ isOpen, onClose, transaction, onRetry }) {
  if (!isOpen || !transaction) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isFailedTransaction = transaction.status === 'failed';

  return (
    <AnimatePresence>
      {isOpen && (
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
              onClick={onClose}
              className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/50 transition-colors"
            >
              <i className="ri-close-line text-2xl text-gray-800"></i>
            </motion.button>

            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-800 mb-6"
            >
              Transaction Details
            </motion.h2>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center text-[17px] py-2 border-b border-white/20">
                <span className="text-gray-600">Transaction ID</span>
                <span className="text-gray-800 font-medium">{transaction.transaction_id}</span>
              </div>

              <div className="flex justify-between items-center text-[17px] py-2 border-b border-white/20">
                <span className="text-gray-600">Amount</span>
                <span className="text-gray-800 font-medium">₹{transaction.amount?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-[17px] py-2 border-b border-white/20">
                <span className="text-gray-600">Status</span>
                <span className={`font-medium ${
                  transaction.status === 'completed' ? 'text-green-600' :
                  transaction.status === 'failed' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {transaction.status}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b text-[17px] border-white/20">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-800 font-medium">{formatDate(transaction.date)}</span>
              </div>

              {transaction.description && (
                <div className="flex justify-between items-center py-2 text-[17px] border-b border-white/20">
                  <span className="text-gray-600">Description</span>
                  <span className="text-gray-800 font-medium">{transaction.description}</span>
                </div>
              )}
            </motion.div>

            {isFailedTransaction && (
              <motion.div  
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
              >
                <p className="text-red-600 mb-4">This transaction failed. Would you like to try again?</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onClose();
                    onRetry(transaction.amount,transaction.description,transaction.transaction_id);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Retry Payment
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
