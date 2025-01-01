import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import necessary hooks
import pic from "../../../../assets/images/pico.jpeg"; // User profile image
import Recents from "../../../parts/Main/Recents"; // Importing Recents component
import picr from "../../../../assets/images/picr.png"; // Unused image import (can be removed if not used)
import ind from "../../../../assets/images/indicator.png";

const UserManage = () => {
  const [formData, setForm] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  // Sample user data
  const users = [
    {
      id: "01",
      name: "Devloper",
      email: "Devloper@gmail.com",
      number: "+91 8978453458",
      access: true,
      update: true,
    },
    {
      id: "02",
      name: "Shubham",
      email: "shubham@gmail.com",
      number: "+91 87453342312",
      access: false,
      update: true,
    },
  ];

  const formHandler = (event) => {
    const { name, value } = event.target;
    setForm({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="container w-full h-full pt-[56px] my-8 relative">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgba(246,237,231,1)_0%,rgba(255,0,0,0)_100%)] rounded-tl-[65px] flex items-center justify-center flex-col relative">
          
          {/* Header Section */}
          <span className="flex justify-center items-center flex-col my-8">
            <h1 className="text-[30px] font-bold">Manage Profile</h1>
            <p className="text-center opacity-45">
              Make sure your information is accurate and up to date.
              <br />
              You can edit your details below and save the changes when you're ready.
            </p>
          </span>
          {/* User Profile Image */}
          <img className="w-32 h-32 mb-10 rounded-full" src={pic} alt="User Profile" />
          
          {/* Profile Editor */}
          <div className="flex-1 w-full flex flex-col items-center gap-5">
            {/* User Name Input */}
            <div className="flex-col flex gap-1">
              <label className="font-bold opacity-55 w-full max-w-[410px] ml-2" htmlFor="user-name">
                User Name
              </label>
              <input onChange={formHandler}
                className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#D6D1D1,#f5efef)] rounded-full text-[13px]"
                type="text"
                value={location.state.user.username}
                disabled={true}
                id="user-name"
                placeholder="shalu"
                name="name"
              />
            </div>

            {/* Tag Name and Phone Input */}
            <div className="flex gap-8">
              {/* Tag Name Input */}
              <span className="flex flex-col gap-1">
                <label className="font-bold opacity-55 w-full max-w-[200px] ml-2" htmlFor="tag-name">
                  Tag Name
                </label>
                <input onChange={formHandler}
                  className="w-full outline-none max-w-[200px] py-3 px-5 bg-[linear-gradient(45deg,#D6D1D1,#f5efef)] rounded-full text-[13px]"
                  type="text"
                  value={location.state.user.username}
                  disabled={true}
                  id="tag-name"
                  placeholder="@shalu"
                  name="tag_name"
                />
              </span>

              {/* Phone Input */}
              <span className="flex flex-col flex-1 gap-1">
                <label className="font-bold opacity-55 w-full max-w-[420px] ml-2" htmlFor="phone">
                  Phone
                </label>
                <input onChange={formHandler}
                  className="w-full outline-none max-w-[200px] py-3 px-5 bg-[linear-gradient(45deg,#D6D1D1,#f5efef)] rounded-full text-[13px]"
                  type="text"
                  id="phone"
                  value={location.state.user.phone}
                  disabled={true}
                  placeholder="+918978XXXXXX"
                  name="phone"
                />
              </span>
            </div>

            {/* Email Input */}
            <div className="flex-col flex gap-1">
              <label className="font-bold opacity-55 w-full max-w-[420px] ml-2" htmlFor="email">
                Email
              </label>
              <input onChange={formHandler}
                className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#D6D1D1,#f5efef)] rounded-full text-[13px]"
                type="email"
                value={location.state.user.email}
                disabled={true}
                id="email"
                placeholder="shalu@gmail.com"
                name="email"
              />
            </div>

            {/* Place and Gender Input */}
            <div className="flex gap-8">
              {/* Place Input */}
              <span className="flex flex-col gap-1">
                <label className="font-bold opacity-55 w-full max-w-[200px] ml-2" htmlFor="place">
                  Place
                </label>
                <input onChange={formHandler}
                  className="w-full outline-none max-w-[200px] py-3 px-5 bg-[linear-gradient(45deg,#D6D1D1,#f5efef)] rounded-full text-[13px]"
                  type="text"
                  value={location.state.user.place}
                  disabled={true}
                  id="place"
                  placeholder="Techno"
                  name="place"
                />
              </span>

              {/* Gender Selection */}
              <span className="flex flex-col flex-1 gap-1">
                <label className="font-bold opacity-55 w-full max-w-[420px] ml-2" htmlFor="gender">
                  Gender
                </label>
                <select onChange={formHandler}
                  name="gender"
                  value={location.state.user.gender}
                  disabled={true}
                  className="w-52 py-3 px-5 rounded-full text-[13px] custom-select"
                  id="gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </span>
            </div>

            {/* Logout Button */}
            <button className="px-0 hidden py-[15px] bg-[linear-gradient(to_left,#DDBE95,#A07601)] text-[13px] rounded-full text-white font-medium mt-5 w-full max-w-[300px]">
              Logout
            </button>
          </div>

          {/* Navigation Back to Customers */}
          <div onClick={() => navigate(-1)} className="flex absolute top-8 left-10 items-center justify-center bg-red opacity-55 hover:text-orange-800 hover:opacity-100 cursor-pointer">
            <i className="ri-arrow-left-s-fill text-[35px]"></i>
            <p className="text-[13px] translate-y-[-2px] font-medium">Customers</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManage;
