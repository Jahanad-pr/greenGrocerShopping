import React, { useEffect, useState } from "react";
import { useGetOTPMutation, useConformOTPMutation, useAddDetailsMutation } from "../../../../services/User/userApi";
import { useLocation, useNavigate } from "react-router-dom";


const SignDetails = ({dataForm,showPopup,setMission,setVerifyData,showToast,method}) => {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [gender, setGender] = useState("Male");
  const [place, setPlace] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [second, setSecond] = useState(false);
  const [button, showButton] = useState(false);

  const [getOTP, { isLoading: sendLoading, error: sendError, data: sendData }] = useGetOTPMutation(); 
  const [ conformOTP, { isLoading: confirmLoading, error: confirmError, data: conformData }, ] = useConformOTPMutation();
  // const [ addDetails, { isLoading: updateLoading, error: updateError, data: updateData }, ] = useAddDetailsMutation();

  // const location = useLocation()
  // const navigator = useNavigate()

  // ()

  const formValidator = ()=>{

    if(!phoneNumber.toString().trim()){
      showButton(false)
      return 'Number Required'
  }else if(phoneNumber.toString().length!=10){
    showButton(false)
      return 'Number should be 10 numers'
  }
    if(!place.trim()){
      showButton(false)
      return 'Place required'
  }else if(place.trim().length<3){
    showButton(false)
      return 'Place should contain 3 charecters'
  }

    if(!accepted){
      showButton(false)
      return 'Accept Terms and Conditions'
    }

    showButton(true)
    return false

  }

  // useEffect(()=> console.log(dataForm),[dataForm])

useEffect(() => {
  setSecond(30);

  if (sendData) {
    const intervalId = setInterval(() => {
      setSecond((prevSecond) => {
        if (prevSecond <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevSecond - 1;
      });
    }, 1000);

    // Cleanup function to clear interval when component unmounts or sendData changes
    return () => clearInterval(intervalId);
  }
}, [sendData]);


  // useEffect(()=>{ },[updateData])


  useEffect(()=>{
    if(confirmError?.data){
      showToast(confirmError?.data,'error')
    }
  },[confirmError,sendError])

  useEffect(()=>{
    if(sendError?.data){
      showToast(sendError?.data,'error')
    }
  },[confirmError,sendError])

  useEffect(()=>{
    if(sendData){
      showToast(sendData,'success')
    }
  },[sendData])

  useEffect(()=>{
    if(conformData){
      showToast(conformData,'success')
    }
  },[conformData])


  // update user
  const addUserDetails = async () => {

    if(true){
      const error = formValidator()
  
      if(error){
  
        showToast(error,'error')
  
      }else{

        const formData = {
          phone: phoneNumber,
          gender: gender,
          place: place,
          uniqueId: dataForm._id
        };

          setMission(false)
          setVerifyData(formData)
          showPopup(false)
      }
    }

  };


  // to get otp
  const getOTPnumber = () => {
    (async () => {
      await getOTP(dataForm.email).unwrap();
    })();
  };

  // to conform otp
  const confirmOtp = () => {
    (async () => {
      await conformOTP({mail:dataForm.email,otp}).unwrap();
    })();    

  };

  return (
    <>
    <div className="w-screen  h-screen backdrop-blur-lg bg-[#000000bd] flex items-center justify-center p-4 py-0 mx-auto absolute z-50 left-1/2 -translate-x-1/2">
      {/* Background Images
      <div className="fixed left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <img src={leftImg} alt="Vegetables bowl" className="rounded" />
      </div>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
        <img src={leftImg} alt="Fruits bowl" className="rounded" />
      </div> */}

      {/* Form Container */}
      <div className="space-y-6 relative bg-[#ffffff31] h-[88%] flex items-center flex-col justify-center md:px-32 px-10 rounded-[30px] text-white">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 bg-purple-400 rounded-full mx-auto mb-4 opacity-80 flex items-center justify-center">
            <div className="w-3 h-12 flex flex-col justify-between">
              <div className="w-3 h-3 bg-[#ffffff90] rounded-full" />
              <div className="w-3 h-3 bg-[#ffffff90] rounded-full" />
              <div className="w-3 h-3 bg-[#ffffff90] rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold">Fill Your Details</h1>
          <p className="">and Continue</p>
        </div>

        {/* Form */}
        <form className="space-y-4">


          {/* Phone Input */}
          {
            
          }
          <div className={`${conformData?'opacity-20':'opacity-100'} ${method==='google'?'hidden':'block'}`}><button
            onClick={()=>!sendLoading&&!(sendData&&second)?!conformData?getOTPnumber():'':''}
            type="button"
            className={`w-full ${sendLoading?"opacity-25":sendData&&second?'opacity-25':'opacity-100'} py-4 bg-[linear-gradient(to_left,#87336a,red)] text-white rounded-full hover:bg-rose-800 transition-colors`}
          >
            {sendLoading?'sending......':!sendData?'Send OTP And Verify':'Resend OTP'}
          </button></div>

          <span className={`${sendData?'opacity-100':conformData?'opacity-50':"opacity-50"} flex flex-col gap-5 ${method==='google'?'hidden':'block'}`}>

          {/* OTP Input */}
          
          <div className={`${conformData?'opacity-20':'opacity-100'}`}>
          <div className="space-y-2">
            { !conformData &&
            <p className="text-sm opacity-50 ml-2">
              {!sendData&!sendLoading?' ':sendLoading?'request sent wait for it..':second?'you can resend the OTP after '+second+' second':'Enter the OTP, check yor mail to the code'}
            </p>
            }
            <div className="flex gap-2">
              <input
                type="text"
                disabled={conformData?true:sendData?false:true}
                value={!conformData?otp:''}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#ffffff50] rounded-full focus:outline-none text-black"
                placeholder="0 X X X X X"
              />
              <button
                onClick={()=>!conformData&&sendData?confirmOtp():''}
                type="button"
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
            </div>
            {/* <button type="button" className="text-blue-500 text-sm">
              Resend OTP
            </button> */}
          </div>
          </div>
          </span>

          <span className={`${conformData||method==='google'?'opacity-100':'opacity-20'} flex flex-col gap-5`}>

          <div className="space-y-4">
            <div className="relative bg-[#ffffff90] rounded-full flex ic justify-center items-center gap-[2px] pl-4 overflow-hidden">
            <p className="text-black">+91</p>
              <input 
                type="number"
                disabled={conformData?false:method==='google'?false:true}
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => (setPhoneNumber(e.target.value))}
                className="w-full px-4 py-3 focus:outline-none text-black bg-transparent"
              />
            </div>
          </div>

          {/* Gender Select */}
          <div className="relative">
            <select
              value={gender}
              disabled={conformData?false:method==='google'?false:true}
              onChange={(e) => (setGender(e.target.value))}
              className="w-full px-4 py-3 bg-[#ffffff90] rounded-full appearance-none focus:outline-none text-black"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Place Input */}
          <input
            type="text"
            placeholder="Place"
            disabled={conformData?false:method==='google'?false:true}
            value={place}
            onChange={(e) => (setPlace(e.target.value))}
            className="w-full px-4 py-3 bg-[#ffffff90] rounded-full focus:outline-none text-black"
          />

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={accepted}
              disabled={conformData?false:method==='google'?false:true}
              onChange={(e) => ( setAccepted(e.target.checked), !accepted?showButton(true):showButton(false)  )}
              className="w-4 h-4"
            />
            <p className="text-sm text-gray-300">
              Yes, I accept the{" "}
              <a href="#" className="text-blue-500">
                terms of use
              </a>{" "}
              and the{" "}
              <a href="#" className="text-blue-500">
                Terms & Conditions
              </a>
            </p>
          </div> 


          {/* Submit Button */}
          <button
            type="button"
            onClick={addUserDetails}
            style={{opacity:!button?'45%':'100%'}}
            className={`w-full py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full hover:opacity-90 transition-opacity`}
          >
            Continue
          </button>

          </span>
        </form>
      </div>
    </div>
    </>
  );
};

export default SignDetails;
