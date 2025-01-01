import React from 'react';
import { IoSend } from 'react-icons/io5';

// Utility function to join class names (simple replacement for `cn`)
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

 const HoverKing = ({ children, Icon,event,styles,redish, ...rest }) => {
  return (
    <button 
    onClick={()=>event()}
      {...rest}
      className={classNames(
        `overflow-hidden border shadow group w-60 rounded-ful h-16 flex ${styles}`,
        // light mode
        'border-zinc-300 text-whitw',
        // dark mode
        `  ${redish?'dark:bg-[linear-gradient(45deg,#00000099,#ff000099)]':'bg-gradient-to-l from-[#687e70] to-[#a1a3a5]'} dark:text-zinc-100 `,
        rest.className
      )}
    >
      <span className="absolute inset-0 rounded-sm flex items-center justify-center w-full h-full duration-[600ms] ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 dark:text-zinc-800">
        {Icon}
      </span>
      <span className="absolute flex items-center justify-center w-full h-full transition-all duration-500 ease transform group-hover:translate-x-full text-white">
        {/* ADD ADDRESS */}
      {children}
      </span>
    </button>
  );
};

export default HoverKing