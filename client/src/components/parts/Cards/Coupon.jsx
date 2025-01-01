import { Copy } from "lucide-react";
import React from "react";



export function Coupon({ index, coupon, setCode }) {


  return <div key={index} className={`min-w-60 max-w-60`}>

    <div className="h-full flex flex-col items-center relative">

      <span className="rounded-[30px] w-full rounded-br-[120px] bg-gray-200 p-6 group">

      { /* Coupon Icon */ }
      <div className="mb-4">
        <div 
          onClick={() => {
            navigator.clipboard.writeText(coupon.code);
            setCode(coupon.code)
          }}
          className="inline-flex w-16 h-16 rounded-full items-center group-hover:scale-150 duration-300 justify-center bg-gradient-to-r from-[#757775be] to-[#3c6e51] absolute right-4 bottom-0 cursor-pointer"
        >
          <Copy size={40} className="w-6 h-6 text-white text-[40px] opacity-55" />
        </div>
      </div>

      { /* Coupon Title */ }
      <h3 className="font-semibold mb-2">{coupon.title}</h3>

      { /* Coupon Code */ }
      <div className={` ${coupon.theme === 'green' ? 'text-orange-500' : 'text-[#6b7280]'} font-bold mb-2 text-[38px]`}>
        {coupon.code}
        <br />
      </div>

      { /* Description */ }
      <p className="text-gray-700 mb-4 font-medium text-[20px] opacity-65">
        Get flat <span className={coupon.theme === 'green' ? 'text-red-500' : 'text-blue-800'}>
          {coupon.discountType==='percentage' ? coupon.discountAmount+'%' : coupon.discountAmount+'₹'}
          <br />
        </span> {coupon.description}
      </p>

      </span>

      { /* Image */ }
      <div className="mt-auto">
        <img src={coupon.image} alt={coupon.title} className="w-30 h-30 rounded-lg absolute bottom-0 left-0 bg-green-500" />
      </div>


    </div>
  </div>
}
