import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';

export default function DeletePopup({showPopup,redish=true,deleteData={},updater,action='delete',isUser=false,isCart,setDeleteData,normal=false}) {
    const cancelHandler = ()=>{
        showPopup(false)
    }

    const deleteHanler = async()=>{
        if(normal){
        await updater(deleteData)
        return showPopup(false)
        }
        if(!isUser){
            const uniqeID = deleteData.uniqeID
            const updateBool = deleteData.updateBool
            const action = deleteData.action
            await updater({uniqeID, updateBool, action}).unwrap();
            showPopup(false)
        }else if(isUser&&!isCart){
            await updater(deleteData.id)
            showPopup(false)
        }else{
            await updater({id:deleteData.id})
            showPopup(false)
            setDeleteData(deleteData.id)
        }
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='w-screen h-screen fixed left-0 font-["lufga"] top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center text-white'
            >
                {/* Backdrop with blur */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                    onClick={cancelHandler}
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
                    className={`w-[calc(100%_-_40px)] max-w-[550px] backdrop-blur-2xl py-10 ${redish ? ' bg-gradient-to-r from-[#3b3636] to-[#6e1919]' :'bg-[linear-gradient(to_left,#4e9b55,#3d7251)]'} flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-10`}
                >
                    <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-[25px] font-bold text-center leading-none pt-6'
                    >
                        Are You sure to {action} ?
                    </motion.h1>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: .50 }}
                        transition={{ delay: 0.3 }}
                        className='opacity-45 text-center px-10'
                    >
                        Your desition may reduce the items, make sure your ok with it, press confirm to {action}
                    </motion.p>
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-full flex gap-3 px-5"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelHandler} 
                            className={`flex-1 border-2 0 ${redish ? 'border-red-300/30' :'border-green-900'} rounded-2xl grid place-items-center text-[13px] font-medium py-3 text-white cursor-pointer`}
                        >
                            Cancel
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={deleteHanler} 
                            className={`flex-1 ${redish ? 'bg-[linear-gradient(to_right,#7c165a,#dc262670)]' :'bg-[linear-gradient(to_left,#246239,#3d7251)]'} rounded-2xl grid place-items-center font-medium text-[13px] py-3 cursor-pointer`}
                        >
                            Confirm
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
