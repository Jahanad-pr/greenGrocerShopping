import React, { useState } from "react";
import picr from "../../../../assets/images/picr.png";
import ind from "../../../../assets/images/indicator.png";
import gg from "../../../../assets/Logos/gg.png";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { ToastContainer } from "react-toastify";

export default function Main({ userData}) {

  const [close,setClose] = useState(true)

  const navigator = useNavigate()

  return (
      <> 
    <div className="md:w-[96%] w-full duration-500 h-full bg-[#f2f2f2]">
      <div className="h-full duration-500 w-full flex">
          
         {/* container root */}
        <div className={`h-full flex-1 duration-500 ${close ? '2xl:px-40' : '2xl:px-20'} xl:px-20 sm:px-10 px-4 overflow-scroll flex flex-col`}>
        { userData && 
        <><span className={`flex lg:py-20 py-5 pt-28 items-center justify-center ${close?'xl:flex-row ':'xl:flex-col 2xl:flex-row'} flex-col`}>
            
            <div className={`justify-center flex-col w-full lg:w-auto lg:px-20 order-2 ${close ? 'xl:order-1' : 'xl:order-2 2xl:order-1'}`}>
              <h1 className="lg:text-[65px] text-[40px] lg:text-left mt-3 lg:mt-0 text-center leading-none whitespace-pre font-bold">{`${userData?.username.replace(/ /g,'\n')}`}</h1>
              <p className="text-[20px] text-orange-400 opacity-75">
                {/* @{userData?.username}123HK */}
              </p>
              <p className="text-[#776963] text-[20px] text-center w-full text-wrap break-words">
              {userData?.email}
              </p>
              {/* mnaage address button */}
              {/* <p onClick={()=>navigator('/user/profile/manageaddress')} className="text-[13px] text-blue-500 cursor-pointer">Manage address</p> */}
              <img className="h-16 w-16 opacity-30 mx-auto lg:mx-0" src={ind} alt="" />
            </div>

            {/* profile pic section */}
            <motion.div layoutId={'pic'}  className=" flex pl-2 items-end md:justify-start justify-center order-1">
              <img className="xl:w-[300px] xl:h-[300px] w-[200px] h-[200px] rounded-full shadow-2xl" src={userData?.profileUrl||'/ph-pic.jpg'} alt="" />
            </motion.div>
          </span>

          {/* bottom config container */}
          <div className={`w-full  py-0 gap-5 flex flex-1 ${close ? 'xl:flex-row' : 'xl:flex-col 2xl:flex-row'} flex-col-reverse items-center justify-center pb-60 lg:pb-0 sm:px-10 px-0 ${close ? 'md:px-20' : 'md:px-4'} lg:px-0`}>
            {/* user order list btn */}
            <div onClick={()=>navigator('/user/Orders')} className="lg:w-80 cursor-pointer bg-[linear-gradient(45deg,#00000020,#00000010)] hover:translate-y-10 duration-500 rounded-[65px] order-2">
              <div className="w-full flex justify-center items-center">
                <p className="text-[35px] font-bold ">
                  Your
                  <br />
                  Oders
                </p>
                <img className="h-[110px] my-8 mb-12 opacity-65" src="/box.svg" alt="" />
                {/* <i className="ri-box-3-line text-[150px] opacity-15 text-[#284936]"></i> */}
              </div>
              <p className="px-10 translate-y-[-30px] opacity-35 text-center">
                This button allows users to view and manage their past and
                current orders. By clicking, users can track order status, view
                details, and check their order history in one convenient place
              </p>
            </div>
            
            {/* user coupon list btn */}
            <div onClick={()=>navigator('/user/Coupons')} className="lg:w-80 cursor-pointer bg-[linear-gradient(#00000015,#00000005)] hover:-translate-y-10 duration-500 rounded-[65px] order-3 xl:translate-y-[19%]">
              <div className="w-full grid place-items-center  mb-5">
                <p className="text-[35px] font-bold translate-y-[30px]">
                  Coupons
                </p>
                <img className="h-[110px] my-8 mb-3 opacity-65" src="/ticket.svg" alt="" />
                {/* <i className="ri-ticket-line text-[120px] py-0 opacity-45 text-[#284936]"></i> */}
              </div>
              <p className="px-10 translate-y-[-30px] opacity-45 text-center">
                manage your available coupons. Keep an eye on them to enjoy
                discounts and special offers!"
              </p>
            </div>

            {/* manage profile btn */}
            <div onClick={()=>navigator('/user/profile/:12/manage')}  className={`lg:w-80 mb-20 cursor-pointer lg:bg-[linear-gradient(45deg,#8f9e95,#6d8475)] bg-[linear-gradient(45deg,#8f9e9590,#6d847580)] hover:-translate-y-10 duration-500 rounded-[65px] order-1 ${close ? 'translate-y-[8%]' : 'translate-y-[0%]'} text-white`}>
              <div className="w-full flex justify-center items-center mb-5">
                {/* <i className="ri-user-line text-[120px] opacity-45"></i>
                 */}
                <img className="h-[110px] my-5 brightness-[100] opacity-65" src="/user.svg" alt="" />
                <p className="text-[32px] font-bold opacity-70">
                  {" "}
                  Manage <br /> Profile{" "}
                </p>
              </div>
              <p className="px-10 translate-y-[-30px] opacity-55 text-center">
                Your profile allows you to manage details like name, contact
                info, bio, and interests, making connections simpler. You can
                also track recent activities, orders, and favorites for a more
                personalized and streamlined experience.
              </p>
            </div>
          </div>
        </>
          }
        </div>

        {/* naviagation container */}
        {/* bg-[#f2f2f2] */}
        <div onMouseEnter={()=>setClose(false)} onMouseLeave={()=>setClose(true)} className={`md:static  min-w-[100vw] md:min-w-[auto] first-line absolute ${!close?'left-0':'-left-full'}  top-0 hover:md:w-[380px] w-[100px] group duration-500 h-full backdrop-blur-3xl pl-10 md:pl-0`}>
        
          <img onClick={()=>setClose(!close)} className={`w-14 h-14  object-cover block md:hidden absolute ${close?'-right-20 -rotate-[90deg]':'rotate-[90deg] right-10'}  top-10 duration-500 `} src="/pin.svg" alt="" />

          <div className="w-full h-full flex pt-24 hover:md:pr-16 scroll-pt-14 pr-5 pl-0 flex-col gap-5 ml-8 overflow-scroll">
          {/* <img className="w-16 object-cover mb-8" src={gg} alt="" /> */}

          {/* profile */}
          <span className="group ">
                <span className="flex mb-8 md:mt-0 md:mb-0">
                  <img src='/user.svg' className=" w-[30px] text-[#758a7c]"/>
                  <p className="font-semibold md:group-hover:ml-3 text-[20px] text-[#5a695f] md:w-0 overflow-hidden md:hidden md:group-hover:w-auto ml-5 lg:ml-0 group-hover:inline">Profile</p>
                </span>

          <span className="leading-none md:opacity-0 md:group-hover:opacity-100 flex flex-col gap-3 mt-3 group-hover:pl-12 ml-3 md:h-0 md:w-0 overflow-hidden group-hover:h-32 group-hover:w-auto duration-1000" >
            <h1 onClick={()=>navigator('/user/profile/:12/manage')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Manage profile</h1>
            <h1 onClick={()=>navigator('/user/Orders')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Your orders</h1>
            <h1 onClick={()=>navigator('/user/Coupons')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Coupons</h1>
            <h1 onClick={()=>navigator('/user/profile/address')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">MAnage address</h1>
            <h1 onClick={()=>navigator('/user/profile/resetpassword')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Reset password</h1>
          </span>
          </span>

          {/* Settings */}
          <span className="duration-500 group">
            <span className="flex  mt-8 mb-8 md:mt-0 md:mb-0">
          <img src='/setting.svg' className="w-[30px] text-[#758a7c]" />
          <p className="font-semibold ml-3 group-hover:ml-3 text-[20px] text-[#718779]  md:hidden md:group-hover:inline">Configaration</p>
            </span>
          <span className="leading-none flex flex-col ml-5 gap-3 mt-5 group-hover:pl-12 md:h-0 md:w-0 overflow-hidden md:group-hover:h-32 group-hover:w-auto duration-1000" >
            <h1 className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Settings</h1>
            <h1 onClick={()=>navigator('/user/map')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Manage Location</h1>
      
            <h1 className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Appearance</h1>
            <h1 onClick={()=>navigator('/user/profile/logout')} className="text-[20px] font-medium leading-none opacity-55 hover:text-[#ff4141] hover:opacity-100 cursor-pointer">Logout</h1>
          </span>
          </span>

          {/*  about app */}
          <span className="duration-500 group">
            <span className="flex mt-8 mb-8 md:mt-0 md:mb-0">
          <img src='/category.svg' className=" w-[30px] text-[#758a7c]"></img>
          <p className="font-semibold ml-3 group-hover:ml-3 text-[20px] text-[#718779] md:hidden md:group-hover:inline">Application</p>

            </span>
          <span className="leading-none flex flex-col gap-3 mt-5 group-hover:pl-12 md:h-0 md:w-0 overflow-hidden mb-20 md:group-hover:h-24 group-hover:w-auto duration-1000" >
            <h1 className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">Contact</h1>
            <h1 className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">About site</h1>
            <h1 className="text-[20px] font-medium leading-none opacity-55 hover:text-[#284936] hover:opacity-100 cursor-pointer">About the farms</h1>
          </span>
          </span>

          

          </div>
        </div>

      </div>


    </div>
    </>
  );
}
