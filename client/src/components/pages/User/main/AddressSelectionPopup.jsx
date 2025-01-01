import React, { useEffect } from "react";
import { useGetAdressesMutation } from "../../../../services/User/userApi";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const AddressSelectionPopup = ({ onClose, onSelect, userData }) => {
  const [getAdresses, { data: addresses }] = useGetAdressesMutation();

  useEffect(() => {
    getAdresses(userData?._id); // Fetch addresses when the component mounts
  }, [getAdresses]);

  const navigate = useNavigate()


  useEffect(() => {
    console.log(addresses); // Log the addresses to see if they are fetched correctly
  }, [addresses]);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='w-screen h-screen absolute left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center'
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="bg-white/70 rounded-[30px] relative rounded-br-[120px] shadow-lg p-10 w-full max-w-md pb-20"
        >
          <h2 className="text-[38px] font-bold mb-4">Select Shipping Address</h2>
          <ul className="mb-4 flex flex-col gap-4">
            {addresses?.map((address) => (
              <li key={address._id} className="cursor-pointer text-[16px] hover:bg-gray-100 bg-white/30 px-5 py-3 rounded-[15px]" onClick={() => onSelect(address)}>
                <h3 className={`font-semibold text-[25px] opacity-55 ${
              address.locationType === "Work"
                ? "text-[#ff0000]"
                : address.locationType === "Home"
                ? "text-[#1c7721]"
                : address.locationType === "Person"
                ? "text-[#0d32e9]"
                : "text-[#706e1b]"
            }`}>{address?.locationType}</h3>

                {address.exactAddress}, {address.streetAddress}, {address.state}, {address.pincode}, +91 {address.phone}
              </li>
            ))}
          </ul>
          <button className="w-full text-[13px] bg-[#7b8a82] text-white max-w-[70%] py-3 mt-5 rounded-full" onClick={onClose}>Close</button>

          <button onClick={() => navigate('/user/profile/address')} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom- right-2 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group'>
            <img className='group-hover:-translate-x-full min-w-[70px] p-4 brightness-[100]  duration-500' src="/receipt-item.svg" alt="" />
            {/* <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
            <img className='group-hover:-translate-x-full min-w-[70px] p-5 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressSelectionPopup;