"use client";
import { motion } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

export const Timeline = ({ currentStatus }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  const mainStatusData = [
    { title: 'Pending', content: 'Order has been placed' },
    { title: 'Processed', content: 'Order is being processed' },
    { title: 'Shipped', content: 'Order has been shipped' },
    { title: 'Delivered', content: 'Order has been delivered' }
  ];

  const cancelledStatus = { 
    title: 'Cancelled', 
    content: 'Order was cancelled'
  };

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [ref]);

  const getStatusIndex = (status) => {
    return mainStatusData.findIndex(s => s.title.toLowerCase() === status?.toLowerCase());
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus?.toLowerCase() === 'cancelled';
  const progress = isCancelled ? 0 : (currentIndex === -1 ? 0 : (currentIndex + 1) / mainStatusData.length);

  return (
    <div className="w-full bg- font-sans 2xl:px-8">
      {!isCancelled ? (
        <div ref={ref} className="relative max-w-7xl mx-auto">
          <div className="flex overflow-x-auto gap-8 px-4">
            {mainStatusData.map((item, index) => {
              const isPastCurrent = index > currentIndex;
              return (
                <div key={index} className={`flex flex-col min-w-[180px] relative ${isPastCurrent ? 'opacity-50' : ''}`}>
                  <div className="sticky z-40 flex flex-col items-center">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shadow-sm
                      ${item.title.toLowerCase() === 'delivered' && currentIndex === 3 ? 'bg-green-500' : 'bg-[#555151]'}`}>
                      <div className={`h-4 w-4 rounded-full border
                        ${item.title.toLowerCase() === 'delivered' && currentIndex === 3 ? 'border-white' : 'border-neutral-300'}`} />
                    </div>
                    <h3 className={`text-lg font-bold text-center mt-3
                      ${item.title.toLowerCase() === 'delivered' && currentIndex === 3 ? 'text-green-500' : 'text-neutral-600'}`}>
                      {item.title}
                    </h3>
                  </div>
                  <div className="mt-2 text-center px-3 text-sm text-neutral-500">
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute left-[90px] right-[90px] top-4 h-[2px] overflow-hidden bg-[#00000010]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 h-full bg-gradient-to-r 
                ${currentStatus?.toLowerCase() === 'delivered' ? 'from-green-500 via-green-500' : 'from-purple-500 via-blue-500'} 
                to-transparent`}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="h-9 w-9 rounded-full bg-red-500 flex items-center justify-center shadow-sm">
              <div className="h-4 w-4 rounded-full border border-white" />
            </div>
            <h3 className="text-lg font-bold text-center mt-3 text-red-500">
              {cancelledStatus.title}
            </h3>
            <div className="mt-2 text-center px-3 text-sm text-neutral-500">
              {cancelledStatus.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
