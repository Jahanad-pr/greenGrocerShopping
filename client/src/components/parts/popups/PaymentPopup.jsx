import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from '../../../utils/razorpay'
import { toast } from 'react-hot-toast'
import { useAddCoinToWalletMutation } from '../../../services/User/userApi'

export default function PaymentPopup({ isOpen, onClose, userData, setAmount, setTransactions, data }) {
  const [isLoading, setIsLoading] = useState(false)
  const [addCoinToWallet] = useAddCoinToWalletMutation()
  const [paymentDetails, setPaymentDetails] = useState({
    amount: data.amount,
    description: data.description
  })

  const handlePayment = async () => {
    try {
      setIsLoading(true)
      const amount = Number(paymentDetails.amount||data.amount)
      
      if (!amount || amount < 10) {
        toast.error('Minimum amount should be ₹10')
        setIsLoading(false)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load')
        return
      }

      const orderData = await createRazorpayOrder(amount)

      initializeRazorpayPayment({
        orderData,
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
        userData,
        onSuccess: async (paymentDetail) => {

          // alert(data.transaction_id);

          if(data.id){
            setTransactions( prevData =>
              prevData.filter( datas => datas.transaction_id !== data.id )
            )
          }

          try {
            const formData = {
              amount,
              description: paymentDetails.description,
              date: Date.now(),
              status: 'completed',
              transaction_id: data.id || paymentDetail.razorpay_payment_id.replace('pay_','').toUpperCase(),
              payment_method: 'razorpay',
            }
            // Add coins to wallet after successful payment
            setTransactions((prevData) => [formData,...prevData])
            await addCoinToWallet(formData).unwrap()
            
            toast.success(`Successfully purchased ${amount * 10} coins!`)
            setAmount((prevData)=> prevData + (amount))
            onClose()
            setPaymentDetails({ amount: '', description: '' })
          } catch (error) {
            // console.error('Failed to add coins to wallet:', error)
            toast.error('Payment failed')
            // alert('Payment Failed! Please try again or contact support if the issue persists.')
            onClose()
          }
        },
        onError: async (error) => {
          console.error('Payment error:', error)
          console.log(error);
          
          toast.error('Failed to process payment')          

          const formData = {
            amount,
            description: paymentDetails.description,
            date: Date.now(),
            status: 'failed',
            transaction_id: data.id || error?.metadata?.payment_id ? error.metadata.payment_id.replace('pay_', '').toUpperCase() : 'UNKNOWN',
            payment_method: 'razorpay',
          }
            await addCoinToWallet(formData).unwrap()
            setTransactions((prevData) => [formData,...prevData])

          // alert('Payment Failed! Please try again or contact support if the issue persists.')
          onClose()
        },
        modal: {
          ondismiss: () => {
            onClose()
          },
          escape: true,
        },
        retry: {
          enabled: false,
          max_count: 0,
        },
      })
    } catch (error) {
      console.error('Coin purchase error:', error)
      toast.error('Failed to initiate coin purchase')
    } finally {
      setIsLoading(false)
    }
  }


  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='w-screen h-screen absolute left-0 top-0 bg-black/20 backdrop-blur-sm z-20 grid place-items-center'
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
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
          className="w-[85%] max-w-[550px] backdrop-blur-xl py-10 bg-white/90 flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-10 shadow-xl"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-[25px] font-bold text-center text-gray-800'
          >
            Add Coins to Your Wallet
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='text-gray-500 translate-y-[-18px] text-center px-10'
          >
            Enter the amount to add coins to your wallet. Each rupee gives you 10 coins.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full space-y-4"
          >
            <div>
              <input
                type="number"
                value={data.amount}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  amount: e.target.value
                })}
                defaultValue={data.amount}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-gray-700 placeholder-gray-400"
                placeholder="Enter amount in rupees (min ₹10)"
                min="10"
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">
                Minimum amount: ₹10 (100 coins)
              </p>
              {paymentDetails.amount && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  You will receive {paymentDetails.amount * 10} coins
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                value={paymentDetails.description}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  description: e.target.value
                })}
                defaultValue={data.description}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors text-gray-700 placeholder-gray-400"
                placeholder="Enter description"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full flex gap-3 px-5 mt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 border-2 border-red-200 text-red-500 rounded-2xl grid place-items-center text-[13px] font-medium py-3 cursor-pointer hover:bg-red-50 transition-colors"
            >
              Cancel
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePayment}
              className={`
                flex-1 rounded-2xl grid place-items-center font-medium text-[13px] py-3 cursor-pointer text-white
                ${(isLoading || !paymentDetails.amount || !paymentDetails.description) && (!data.description || !data.amount)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[linear-gradient(to_left,#0bc175,#0f45ff)] hover:opacity-90'}
                transition-all
              `}
            >
              {isLoading ? 'Processing...' : 'Proceed to Pay'}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
