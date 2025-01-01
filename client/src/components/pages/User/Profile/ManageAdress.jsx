import React, { useEffect, useState, useCallback } from "react";

import { useUpsertAddressMutation } from "../../../../services/User/userApi";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import HoverKing from "../../../parts/buttons/HoverKing";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../parts/Toast/Tostify";

// Reusable Input Component
const InputField = ({ label, name, value, onChange, placeholder, type = "text",long=false }) => (
  <div className={`flex flex-col w-full ${!long?'max-w-[400px]':'max-w-full min-w-full'} gap-1`}>
    <label className="text-[16px] break-words max-w-1/2 opacity-35 ml-2">{label}</label>
    <input
      className={`${!long?'max-w-[300px]':'max-w-full min-w-full'} outline-none px-6 text-[13px] bg-[#6b817325] w-96 h-12 rounded-[18px] rounded-br-[100px] flex`}
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
);

// Reusable Select Component
const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="font-bold opacity-35 ml-2">{label}</label>
    <select
      className="w-full py-3 px-3 min-w-[200px] rounded-full text-[13px] custom-selectero bg-[#6b817325]"
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default function ManageAddress({ userData }) {
  const [upsertAddress, { isLoading, error, data }] = useUpsertAddressMutation();
  const navigate = useNavigate();
  const location = useLocation()

  // State to hold form data
  const [formData, setForm] = useState({
    user: "",
    FirstName: "",
    LastName: "",
    phone: "",
    city: "",
    streetAddress: "",
    state: "Kerala",
    pincode: "",
    locationType: "Home",
    idDefault: false,
    exactAddress: '',
    location: "",
  });

  useEffect(() => {
    if (location?.state) {
      setForm(location?.state)
    }
  }, [location])


  const validateFormData = (formData) => {
    if (!formData.FirstName.trim()) {
      return "First name is required.";
    }

    if (!formData.LastName.trim()) {
      return "Last name is required.";
    }

    if (!formData.phone) {
      return "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.toString())) {
      return "Phone number must be 10 digits.";
    }

    if (!formData.city.trim()) {
      return "City is required.";
    }

    if (!formData.streetAddress.trim()) {
      return "Street address is required.";
    }

    if (!formData.state.trim()) {
      return "State is required.";
    }

    if (!formData.pincode) {
      return "Pincode is required.";
    } else if (!/^\d{6}$/.test(formData.pincode.toString())) {
      return "Pincode must be 6 digits.";
    }

    if (!formData.locationType.trim()) {
      return "Location type is required.";
    }

    if (!formData.exactAddress.trim()) {
      return " Exact address is required.";
    }

    return ""; // No errors
  };


  // Update Input Handler
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler
  const updateProfileSubmit = async () => {
    const validationError = validateFormData(formData);
    if (validationError) {
      return showToast(validationError, "error");
    }

    const upsertData = { ...formData, user: userData?._id };
    await upsertAddress(upsertData);
  };

  // Handle success and errors
  useEffect(() => {
    if (data) {
      // showToast(data,'success')
      navigate('/user/profile/address', { state: data, replace: true });
    }
  }, [data]);

  useEffect(() => {
    if (error?.data) showToast(error.data, "error");
  }, [error]);

  return (
    userData && (
      <>
        <div className="lg:w-[96%] w-screen bg-[#f2f2f2] h-full">

          <div className="w-full h-full flex flex-col items-center gap-5 overflow-y-scroll">

            {/* new */}
            <span className="w-full h-full lg:px-20 px-12 pt-10">

              <h1 className="text-[35px] font-bold">Add new address</h1>

              <span className="w-fyll flex lg:flex-row flex-col">
                <span className="lg:w-1/2">


                  <p className="text-[28px] font-bold mt-8">Location Type</p>
                  <p className="text-[13px] mb-5 opacity-55">Choose you location type to make the<br /> selection easy for you to find</p>

                  <span className="inline-flex mt-5 gap-5 2xl:flex-row flex-col">

                    <span className="flex gap-5">

                    {/* first */}
                    <div onClick={() => setForm((prev) => ({ ...prev, locationType: 'Home' }))} className="w-1/2 p-5 cursor-pointer hover:scale-[1.04] duration-500 text-center border rounded-[30px] rounded-br-[80px] shadow relative pt-8 bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970]">
                      <img
                        src='/home-2.svg'
                        alt="Fast Delivery"
                        className=" object-cover mx-auto mb-3 rounded w-14 h-14"
                      />
                      <span>
                        <h4 className="text-[13px]">Home</h4>
                        <p className="opacity-65">Delivery within minitus,like flash</p>
                      </span>

                      <div className={`absolute left-5 top-5 w-5 h-5 rounded-full border-2 border-[#717fa8] ] p-[3px]`}>
                        <div className={`w-full h-full bg-[#4b5e97] rounded-full ${formData?.locationType === 'Home' ? "opacity-100" : 'opacity-0'}`}></div>
                      </div>
                    </div>


                    {/* second */}
                    <div onClick={() => setForm((prev) => ({ ...prev, locationType: 'Work' }))} className="w-1/2 p-5 cursor-pointer hover:scale-[1.04] duration-500 text-center border rounded-[30px] rounded-br-[80px] shadow relative pt-8 bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970]">
                      <img
                        src='/buildings.svg'
                        alt="Fast Delivery"
                        className="object-cover mb-3 mx-auto rounded w-14 h-14"
                      />
                      <span>
                        <h5 className="text-[13px] mb-1">Work</h5>
                        <p className="opacity-65">Normal delivery, more duraration for that</p>
                      </span>

                      <div className="absolute left-5 top-5 w-5 h-5 border-[#cd7fb3] border-2 p-[3px] rounded-full">
                        <div className={`w-full h-full bg-[#a83f93] rounded-full ${formData?.locationType === 'Work' ? "opacity-100" : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    </span>


                    <span className="flex gap-5">
                    <div onClick={() => setForm((prev) => ({ ...prev, locationType: 'Person' }))} className="w-1/2 pb-8 xl:pb-0 px-4 cursor-pointer hover:scale-[1.04] duration-500 text-center border rounded-[30px] bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970] rounded-br-[80px] relative pt-8">
                      <img
                        src='/user-tag.svg'
                        alt="Fast Delivery"
                        className="object-cover mx-auto w-14 h-14 rounded"
                      />
                      <span>
                        <h4 className="text-[13px]">Person</h4>
                        <p className="opacity-65">For the environment, little time consuming</p>
                      </span>

                      <div className="absolute left-5 top-5 w-5 h-5 border-[#218342] border-2 p-[3px] rounded-full">
                        <div className={`w-full h-full bg-[#4b5e97] rounded-full ${formData?.locationType === 'Person' ? "opacity-100" : 'opacity-0'}`}></div>
                      </div>
                    </div>

                    <div onClick={() => setForm((prev) => ({ ...prev, locationType: 'Other' }))} className="w-1/2 px-4 cursor-pointer hover:scale-[1.04] duration-500 text-center border rounded-[30px] bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970] rounded-br-[80px] relative pt-8">
                      <img
                        src='/location.svg'
                        alt="Fast Delivery"
                        className="object-cover mx-auto w-14 h-14 mb-1 rounded"
                      />
                      <span>
                        <h4 className="text-[13px]">Other</h4>
                        <p className="opacity-65">For the environment, little time consuming</p>
                      </span>

                      <div className="absolute left-5 top-5 w-5 h-5 border-[#cb9e35] border-2 p-[3px] rounded-full">
                        <div className={`w-full h-full bg-[#a3a13d] rounded-full ${formData?.locationType === 'Other' ? "opacity-100" : 'opacity-0'}`}></div>
                      </div>
                    </div>

                    </span>

                  </span>

                  <p className="text-[28px] font-bold mt-8">Location</p>
                  <p className="text-[13px] mb-5 opacity-55">Choose you location from map<br />To make more clarity of the location</p>

                  <div className="w-full h-40 opacity-10 rounded-[30px] bg-blue-500">

                  </div>

                </span>

                {/* form container */}
                <span className="lg:w-1/2 lg:px-16 h-auto xl:pb-36 pb-80 ">

                  <p className="text-[28px] font-bold mt-8">Address</p>
                  <p className="text-[13px] mb-5 opacity-55">Hopply fill the form To make more <br />clarity of the location wich you want</p>

                  <div className="flex w-full 2xl:flex-row flex-col max-w-[450px] gap-8 mb-5">
                  <InputField
                    label="First Name"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={inputHandler}
                    placeholder="Ali"
                  />
                  <InputField
                    label="Last Name"
                    name="LastName"
                    value={formData.LastName}
                    onChange={inputHandler}
                    placeholder="Muhammed"
                  />
                </div>
                <span className="flex gap-5 flex-wrap mb-5">
                <InputField
                  label="House no., Flat, Building, Company"
                  name="exactAddress"
                  value={formData.exactAddress}
                  onChange={inputHandler}
                  long={true}
                  placeholder="90XXXX (PO)"
                />
                <InputField
                  label="Street, Area, Sector, Village"
                  name="streetAddress"
                  long={true}
                  value={formData.streetAddress}
                  onChange={inputHandler}
                  placeholder="Football street"
                />

                <InputField
                  label="Landmark"
                  name="landmark"
                  long={true}
                  value={formData.landmark}
                  onChange={inputHandler}
                  placeholder="Near stadium"
                />

                </span>
                <div className="flex 2xl:flex-row flex-col w-full max-w-[450px] gap-8 mb-5">
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={inputHandler}
                  placeholder="London"
                />
                  <InputField
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={inputHandler}
                    type="number"
                    placeholder="69XXXX"
                  />
                </div>
                <div className="flex w-full 2xl:flex-row flex-col max-w-[450px] gap-8 mb-5">
                  <SelectField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={inputHandler}
                    options={[
                      { value: "kerala", label: "Kerala" },
                      { value: "karnataka", label: "Karnataka" },
                      // Add other states
                    ]}
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={inputHandler}
                    type="number"
                    placeholder="+91 90XXXXXXXX"absolute
                  />
                </div>
                <div className="relative bg-red-500">
                <HoverKing
                  event={updateProfileSubmit}
                  styles="absolute top-5 left-28 text-[13px] border-0 text-white -translate-x-1/2 rounded-full"
                  Icon={<i className="ri-apps-2-add-line text-[30px] rounded-full"></i>}
                >
                  Submit
                </HoverKing>
                </div>
                  

                </span>

              </span>

            </span>

          </div>
        </div>
      </>
    )
  );
}




// <span className={`w-full h-full px-64 bg-[#ffffff59] flex`}>
// {/* Image Section */}
// <div className="w-[40%] flex items-center">
//   <div className="h-[80%] w-auto bg-[linear-gradient(#ffffff50,#ffffff20)] flex flex-col duration-500 rounded-[50px] px-4 pb-16">
//     <div className="my-8 pl-8 flex gap-5 items-center justify-center">
//       <p className={`${formData.locationType === 'Home' ? 'text-[#3c6e51] font-bold' : 'opacity-45'} duration-500 cursor-pointer m-0`}>Home</p>
//       <p onClick={() => setForm((prev) => ({ ...prev, locationType: 'Work' }))} className={`${formData.locationType === 'Work' ? 'text-[#3c6e51] font-bold' : 'opacity-45'} duration-500 cursor-pointer m-0`}>Work</p>
//       <p onClick={() => setForm((prev) => ({ ...prev, locationType: 'Person' }))} className={`${formData.locationType === 'Person' ? 'text-[#3c6e51] font-bold' : 'opacity-45'} duration-500 cursor-pointer m-0`}>Person</p>
//       <p onClick={() => setForm((prev) => ({ ...prev, locationType: 'Other' }))} className={`${formData.locationType === 'Other' ? 'text-[#3c6e51] font-bold' : 'opacity-45'} duration-500 cursor-pointer m-0`}>Other</p>
//     </div>

//     <span className="flex-1"></span>
//     {
//       <img className="w-full duration-500" src={
//         formData.locationType === 'Home' ? Homeloc :
//           formData.locationType === 'Work' ? WorkLOc :
//             formData.locationType === 'Person' ? PersonLoc :
//               formData.locationType === 'Other' ? OtheLoc : ''

//       } alt="Location" />
//     }
//     <span className="flex-1"></span>
//   </div>
// </div>
// {/* { formData.locationType === 'Work' &&
//       <img className="w-full" src={WorkLOc} alt="Location" />
//     } 
//     { formData.locationType === 'Person' &&
//       <img className="w-full" src={PersonLoc} alt="Location" />
//     }
//     { formData.locationType === 'Other' &&
//       <img className="w-full" src={OtheLoc} alt="Location" />
//     } */}

// {/* <img className="w-full" src={OtheLoc} alt="Location" />
//     <img className="w-full" src={WorkLOc} alt="Location" />  */}

// {/* Form Section */}
// <div className="flex-1 h-full w-full flex flex-col items-center gap-5">
//   <h1 className="text-[30px] font-bold text-center mt-20 mb-10">Manage Address</h1>

// </div>
// </span>