import React from "react";
import gg from '../../../../assets/Logos/main.png'

export default function About() {
  return (
    <>
      <div className="w-[96%] h-full">
        <div className="w-full h-full px-[500px] flex flex-col items-center gap-5">

          {/* Head */}
          <h1 className="text-[30px] font-bold my-16 mb-8">About us</h1>

          <img className="w-[25%]" src={gg} alt="" />

          <p className="text-center mt-2 text-[20px] opacity-60">We are an organization dedicated to bringing you the freshest fruits and vegetables directly from local farmers. Once you confirm your order, the produce is freshly harvested, ensuring you get the best in quality and nutrition. Our mission is to provide healthy, natural food, full of nutrients, straight to your table.
          In addition to this, we also care for the environment by offering a waste collection service. This ensures responsible disposal of organic waste</p>


          <h1 className="text-[30px] font-bold my-8 w-full">Contact us</h1>

          <div className="flex w-full gap-10">
           {/* name */}
          <input className=' w-full  py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-full text-[13px]' type="text" placeholder='Full Name' />
            {/* email */}
            <input className='w-full py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-full text-[13px]' type="text" placeholder='Email' />
            {/* phone */}
            <input className='w-full  py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-full text-[13px]'  type="text" placeholder='Phone' />

          </div>

            {/* feedback input */}
          <div className="bg-[linear-gradient(45deg,#f5efef,#f5efef)] w-full h-auto rounded-[35px] pb-20 pt-4 px-4 text-[20px]">
            <input className='w-full outline-none  py-3 px-5 text-[13px] bg-transparent'  type="text" placeholder='Phone' />
          </div>

          {/* button proced */}

          <button className="px-16 py-[15px] bg-[linear-gradient(to_left,#0bc175,#0f45ff)] text-[13px] rounded-full text-white font-medium mt-10 w-full max-w-[300px]">Send feedbacck</button>
    
        </div>
      </div>
    </>
  );
}
