import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderDetailsPopup({ showPopup, order }) {
    if (!order) return null;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toFixed(2)}`;
    };

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-screen h-screen fixed left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center'
            >
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                    onClick={() => showPopup(false)}
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
                    className="w-full max-w-[750px] backdrop-blur-2xl py-8 bg-[#f2f2f2] flex flex-col gap-6 rounded-3xl px-8 relative z-10 shadow-2xl"
                >
                    {/* Header */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-between items-center border-b border-gray-200 pb-4"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                            <p className="text-gray-500">Order ID: {order.order_id}</p>
                        </div>
                        <button 
                            onClick={() => showPopup(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <i className="ri-close-line text-2xl"></i>
                        </button>
                    </motion.div>

                    {/* Order Info Grid */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div>
                            <h3 className="text-gray-500 mb-1 text-[13px] font-medium">Order Date</h3>
                            <p className="font-medium text-gray-800">{formatDate(order.time)}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 mb-1 text-[13px] font-medium">Payment Method</h3>
                            <p className="font-medium text-gray-800">{order.payment_method}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 mb-1 text-[13px] font-medium">Order Status</h3>
                            <p className="font-medium text-gray-800">{order.order_status}</p>
                        </div>
                        <div>
                            <h3 className="text-gray-500 mb-1 text-[13px] font-medium">Payment Status</h3>
                            <p className="font-medium text-gray-800">{order.payment_status}</p>
                        </div>
                    </motion.div>

                    {/* Items Section */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Order Items</h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            {order.items?.map((item, index) => (
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                    key={index} 
                                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={item?.product.pics?.one} 
                                            alt={item.product.name} 
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className='leading-none'>
                                            <p className="font-medium text-gray-800">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity/1000}Kg</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-800">{formatCurrency(item?.product.regularPrice || 0)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Price Summary */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="border-t border-gray-200 pt-4"
                    >
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Regular Price:</span>
                            <span className="font-medium text-gray-800">{formatCurrency(order.price.grandPrice + order.price.discountPrice + (order.coupon?.amount || 0))}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Offer Discount:</span>
                            <span className="font-medium text-red-500">-{formatCurrency(order.price.discountPrice)}</span>
                        </div>
                        {order.coupon?.amount > 0 && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Coupon Discount:</span>
                                <span className="font-medium text-red-500">-{formatCurrency(order.coupon.amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold mt-2">
                            <span className="text-gray-800">Total Payment:</span>
                            <span className="text-gray-800">{formatCurrency(order.price.grandPrice)}</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
