import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

export default function StatisticPopup({ type, onClose }) {
    // Filter out unwanted keys
    const excludedKeys = ['id', 'createdAt', 'updatedAt', 'deletedAt', '__v', '_id'];
    const filteredEntries = Object.entries(type || {}).filter(([key]) => 
        !excludedKeys.some(excluded => key.toLowerCase().includes(excluded))
    );

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-screen h-screen absolute left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center text-white'
            >
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
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
                    className="w-full max-w-[550px] backdrop-blur-2xl py-10 bg-[linear-gradient(45deg,#00000080,#412524)] flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-10"
                >
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-[25px] font-bold text-center'
                    >
                        Statistics Details
                    </motion.h1>
                    
                    <div className='w-full flex flex-col gap-4'>
                        {filteredEntries.map(([key, value], index) => (
                            key !== 'title' && (
                                <motion.div 
                                    key={key}
                                    initial={{ 
                                        x: -50,
                                        opacity: 0
                                    }}
                                    animate={{ 
                                        x: 0,
                                        opacity: 1
                                    }}
                                    transition={{
                                        delay: 0.3 + (index * 0.1),
                                        type: "spring",
                                        damping: 12,
                                        stiffness: 200
                                    }}
                                    className="bg-white/10 p-4 rounded-2xl"
                                >
                                    <h3 className="text-lg opacity-70 capitalize font-thin">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                                    <p className="text-2xl font-bold mt-1">
                                        {key.toLowerCase().includes('revenue') ? '₹' : ''}{value}
                                    </p>
                                </motion.div>
                            )
                        ))}
                    </div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + (filteredEntries.length * 0.1) }}
                        className="w-full flex gap-3 px-5"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose} 
                            className="flex-1 bg-[linear-gradient(to_left,#7c165a,#dc262670)] rounded-2xl grid place-items-center font-medium text-[13px] py-3 cursor-pointer"
                        >
                            Close
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
