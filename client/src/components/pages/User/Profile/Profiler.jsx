import React, { useEffect, useState } from "react";
import ind from "../../../../assets/images/indicator.png";
import { motion } from 'framer-motion';
import { useUpdateProfileMutation } from "../../../../services/User/userApi";
import { Link, useNavigate } from "react-router-dom";
import { FaExclamationTriangle,FaCheckCircle,FaSave } from "react-icons/fa";
import HoverKing from "../../../parts/buttons/HoverKing";
import { showToast } from "../../../parts/Toast/Tostify";

export default function Profiler({ userData }) {

  // mutation to update user
  const [ updateProfile, { isLoading, error, data }, ] = useUpdateProfileMutation();

  const navigator = useNavigate()

  // Custom content component for the toast
const ToastContent = ({ title, message }) => 
  ( 
  <div>
    <strong>{title}</strong>
    <div>{message}</div>
  </div>
);

  

  // to show the error and success
  useEffect(()=>{
    if(data){
      showToast(data,'success' ) 
      navigator('/user/profile/12') 

    }
  },[data])
  useEffect(()=>showToast(error?.data,'error'),[error])

  // the states
  const [formData, setForm] = useState({ username: "", phone: "", email: "", place: "", gender: "" });
  const [isEditMode, setIsEditMode] = useState(false);

  // adding user data into a state when it update
  useEffect(() => {
    if (userData) setForm(userData);
  }, [userData]);

  // handle inputs
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({ ...prevData, [name]: value }));
  };

  // update data
  const updateProfileSumbmit = async()=>{
    await updateProfile(formData)
    setIsEditMode(false); // Disable edit mode after update
  }

  return (  userData &&
    <> 
      <div className="md:w-[96%] w-full h-full bg-[#f2f2f2] ">
        <div className="w-full h-full flex flex-col items-center gap-5">

          <div className="w-full h-screen font-['lufga'] overflow-scroll relative">

            <div className="w-full h-40 blur-[300px]  opacity-15">
              <img className="w-[200%] absolute inset-[-300px]" src={userData?.profileUrl||'/ph-pic.jpg'} alt="" />
              {/* <div className="w-full h-full absolute top-0 left-0"></div> */}
            </div>

              <h1 className="text-[35px] font-bold opacity-55 top-8 left-48 lg:-translate-y-20 -translate-y-32 lg:pl-40 pl-20">Profile</h1>

              {/* profile photo and the name */}

              <span className="w-full flex flex-col sm:flex-row items-center justify-center gap-10 -translate-y-20 sm:pr-40">
              <img className="w-48 h-48 rounded-full " src={userData?.profileUrl || '/ph-pic.jpg'} alt="" />

              <div onClick={() => setIsEditMode(!isEditMode)} className="inline-flex gap-2 items-center justify-center text-white bg-gradient-to-b from-[#999898] to-[#b0acacfb] hover:scale-105 hover:opacity-90 duration-300 pl-8 px-5 py-2 absolute -top-24 right-10 hover:cursor-pointer rounded-[30px] ">
                <p className="text-[20px]">{!isEditMode?'Edit profile':'View mode'}</p>
                {!isEditMode?<i className="ri-edit-circle-line text-[25px]"></i>:<i className="ri-eye-line text-[25px]"></i>}
              </div>

              <span>
              <p className="text-[45px] font-bold whitespace-pre leading-none sm:text-left text-center">{userData?.username.replace(/ /g,'\n')}</p>
              </span>

              </span>

              {/* other contents */} <span className="w-full h-full flex sm:px-20 px-12 2xl:px-40 flex-col lg:flex-row ">

                {/* The status of user */}
                <span className="xl:w-1/2 lg:w-[60%] w-full">
                <p className="text-[28px] font-bold">User Status</p>
                <p className="text-[13px] mb-8 opacity-55">The user how much active in this app <br></br> according to the transactions and the count orders</p>

                {/* The status of user */}
                <span className="justify-center inline-flex flex-row gap-16 p-6 px-12 2xl:px-20 rounded-[30px] bg-gradient-to-b from-[#dcdcdc90] to-[#d9d9d990]">
                  <span className="flex flex-col md:flex-row gap-5">
                  <span>
                    <p className="text-[20px] leading-none opacity-65 text-center mb-3"> Totel <br /> Orders</p>
                    <p className="text-[55px] text-[#8c8229] font-bold leading-none text-center">25</p>
                  </span>
                  <span>
                    <p className="text-[20px] leading-none opacity-65 text-center mb-3"> Totel <br /> Transactons</p>
                    <p className="text-[55px] text-[#192a69] font-bold leading-none text-center">40</p>
                  </span>

                  </span>
                  <span>
                    <p className="text-[20px] leading-none opacity-65 text-center mb-3"> Totel <br /> Score</p>
                    <p className="text-[55px] text-[#691919] font-bold leading-none text-center">40</p>
                  </span>
                </span>

                {/* The status of user */}
                <p className="text-[28px] font-bold mt-8">Account</p>
                <p className="text-[13px] mb-5 opacity-55">The accound details <br/> and the configaration with data</p>

                <span className="flex flex-col md:flex-row md:gap-12 gap-5 mt-12">

                <span>
                <label className="text-[20px] opacity-35 mb-4" htmlFor="">Email address</label>
                <p className="text-[23px] mb-5 opacity-55">{formData?.email.replace('.gmail','')}</p>
                </span>

                <span>
                <label className="text-[20px] opacity-35 mb-4" htmlFor="">Created at</label>
                <p className="text-[23px] mb-5 opacity-55">
                  {new Date(formData.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).split('/').join('-')}
                </p>
                </span>

                </span>

                </span>


                  {/* the filds of ueser details */}
                  <div className="xl:w-1/2 lg:w-[30%] w-full mt-20 lg:mt-0 pb-60">

                  <p className="text-[28px] font-bold">User Details</p>
                  <p className="text-[13px] mb-5 opacity-55">Users can see thier data <br></br> and change the data on your profile</p>

                  {/* fields */}
                  <span className="flex flex-col gap-5 flex-nowrap">
                  <span className="flex gap-5 lg:flex-col xl:flex-row flex-col md:flex-row">
                  <span className="inline-flex flex-col pr-5">
                  <label className="text-[20px] opacity-35 ml-2 mb-2" htmlFor="">User name</label>
                  <input placeholder="Shalu!23"
                    name="username"
                    onChange={inputHandler}
                    value={formData?.username}
                    disabled={!isEditMode}
                  className="max-w-[100%] md:max-w-[220px] 2xl:max-w-[300px] outline-none px-6 text-[13px] bg-[#6b817325] h-12 rounded-[18px] rounded-br-[100px] flex" type="text" />
                  </span>

                  <span className="inline-flex flex-col md:pl-5">
                  <label className="text-[20px] opacity-35 ml-2 mb-2" htmlFor="">Number</label>
                  <input placeholder="90XXXXXXXX"
                  value={formData?.phone}
                  name="phone"
                  onChange={inputHandler}
                  type="text"
                  disabled={!isEditMode}
                  className="max-w-[100%] md:max-w-[220px] 2xl:max-w-[300px] outline-none px-6 text-[13px] bg-[#6b817325] w-96 h-12 rounded-[18px] rounded-br-[100px] flex" />
                  </span>
                  </span>

                  <span className="flex gap-5 xl:flex-row lg:flex-col flex-col md:flex-row">
                  <span className="inline-flex flex-col pr-5">
                  <label className="text-[20px] opacity-35 ml-2 mb-2" htmlFor="">Place</label>
                  <input placeholder="Gujarat"
                  onChange={inputHandler}
                  name="place"
                  value={formData?.place}
                  disabled={!isEditMode}
                  className="max-w-[100%] md:max-w-[220px] 2xl:max-w-[300px] bg-[#6b817325] outline-none px-6 text-[13px] w-96 h-12 rounded-[18px] rounded-br-[100px] flex" type="text" />
                  </span>
                  <span className="inline-flex flex-col md:pl-5">
                  <label className="text-[20px] opacity-35 ml-2 mb-2" htmlFor="">Gender</label>
                  <select placeholder=""
                  value={formData?.gender}
                  onChange={inputHandler}
                  disabled={!isEditMode}
                  name="gender"
                  className="max-w-[100%] md:max-w-[220px] 2xl:max-w-[300px] custom-selecto bg-[#6b817325] outline-none px-6 text-[13px] w-96 h-12 rounded-[18px] rounded-br-[100px] flex" type="text" >
                    <option value="">Male</option>
                    <option value="">Female</option>
                  </select>
                  
                  </span>
                  </span>

                  <button onClick={!isEditMode?null:updateProfileSumbmit} className={`px-6 py-3 mt-5 2xl:mx-40 text-[16px] ${isEditMode?'hover:scale-105 hover:opacity-70':'opacity-30'}  duration-300 bg-[#84a190] text-white rounded-full`}>Update the profile</button>

                  <span className="flex items-center justify-center">
                    <span>
                  <p className="text-[28px] font-bold leading-none mt-5">Actions</p>
                  <p className="text-[13px]  opacity-55">Users can see thier data <br></br> and change the data on your profile</p>
                    </span>
                    <span className="flex-1"></span>
                    <span>
                    <i onClick={() => navigator('/user/profile/logout')} className="ri-logout-circle-r-line text-[35px] text-red-600 hover:scale-125 hover:opacity-70 duration-300 cursor-pointer"></i>

                    </span>
                  </span>

                  </span>

                  

                  </div>

              </span>
          </div>
        </div>
      </div>
    </>
  );
}
