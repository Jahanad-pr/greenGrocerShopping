import React, { useEffect, useRef, useState } from "react";
import siginImg from "../../../../assets/images/sign.jpeg";
import logImg from "../../../../assets/images/log.jpeg";
import placeholder from "../../../../assets/images/placholder_profile.png";
import greenGrocerLogo from "../../../../assets/Logos/main.png";
import { IoAdd } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
// import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "./ForgotPassword";
import { showToast, Tostify } from '../../../parts/Toast/Tostify'

import {
  useLoginMutation,
  useSignUpMutation,
  useGoogleLogMutation,
  useIsUerExistMutation,
} from "../../../../services/User/userApi";
import { useFetcher, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { validateFormData } from "./validation/validation";
import { auth, googleProvider } from "../../../../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import SignDetails from "./signDetails";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ImageUploadPopup from "../../../parts/popups/ImageUploadPopup";

export default function Signup({ setSign }) {
  // Form data state for signup and login
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [upData, setUpData] = useState({ email: "", password: "" });
  const [mission, setMission] = useState(true); // Toggle between signup and login screens
  const [showPassword, setShowPassword] = useState(false);
  const [popup, showPopup] = useState(false);
  const [profileUrl, setProfileUrl] = useState('')
  const [dataForm, setData] = useState(false);
  const [method, setMethode] = useState("");
  const [verifiedData, setVerifyData] = useState(false);
  const [googleDATA, setGoogleData] = useState();
  // const [verifyData, setVerif] = useState(false);
  const navigator = useNavigate();
  const scroller = useRef();
  const [errors, setErrors] = useState({}); // Error state
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const handleImageSave = (blob) => {
    setProfileUrl(blob[0])
  };

  // data form etk query api
  const [
    signUp,
    { isLoading: isSignUpLoading, error: signUpError, data: data },
  ] = useSignUpMutation();
  const [login, { isLoading: isLoginLoading, error: loginError, data: loginData }] =
    useLoginMutation();
  const [
    googleLog,
    { isLoading: isGoogleLoading, error: googleError, data: googleData },
  ] = useGoogleLogMutation();

  const [
    isUerExist,
    { isLoading: isUerExistLoading, error: isUerExistError, data: isUerExistData },
  ] = useIsUerExistMutation();

  // Custom content component for the toast
  const ToastContent = ({ title, message }) => (
    <div>
      <strong>{title}</strong>
      <div>{message}</div>
    </div>
  );




  useEffect(() => {
    if (signUpError?.data?.message) {
      showToast(signUpError?.data?.message, 'error')
    }
  }, [signUpError])


  useEffect(() => {
    console.log(loginError);

    if (loginError?.data?.message) {
      showToast(loginError?.data?.message, 'error')
    }
  }, [loginError])

  useEffect(() => {
    if (googleError) {
      showToast(googleError.data.message, 'error')
    }
  }, [googleError])

  useEffect(() => {
    console.log(isUerExistError);

    if (isUerExistError?.data) {
      showToast(isUerExistError?.data, 'error')
    }
  }, [isUerExistError])

  useEffect(() => {

    if (isUerExistData?.forWord) {
      setData(formData);
      setMethode("normal");
      showPopup(true);
    }
  }, [isUerExistData])

  useEffect(() => {
    if (loginData) {
      console.log(loginData);const token = loginData.token;
      localStorage.setItem('authToken', token);

      navigator('/user/home', { state: { userData: loginData.user, message: loginData.message } })

    }
  }, [loginData])

  // login with google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      setGoogleData(result.user);

      const data = result.user;
      const dataForm = {
        username: data.displayName,
        email: data.email,
        password: import.meta.env.VITE_GOOGLE_PASSWORD,
        confirmPassword: import.meta.env.VITE_GOOGLE_PASSWORD,

      };
      await googleLog(dataForm).unwrap();

      // You can also store the user info or token in your app state
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    console.log(googleData);

    if (
      googleData?.isNew ||
      (!googleData?.data?.isVerified && googleData?.data)
    ) {
      setData(googleData?.data);
      setMethode("google");
      showPopup(true);
    } else if (!googleData?.isNew && googleData?.data?.isVerified) {
      // After login
      const token = googleData.token;
      localStorage.setItem('authToken', token);

      navigator("/user/home");
    }
  }, [googleData]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  // Handles signup and login functionality
  const signUpUser = async () => {
    setMethode("normal");
    const validationErrors = validateFormData(
      mission ? formData : upData,
      mission
    );
    console.log(validationErrors)

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (mission) {
          setMethode('normal')
          await isUerExist(formData).unwrap()

        } else {
          await login({ ...upData, profileUrl: profileUrl }).unwrap();
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  // Transition effect on mission state change
  // useEffect(() => {
  //   scroller.current.style.transform = mission
  //     ? "translateX(0vw)"
  //     : "translateX(-50vw)";
  // }, [mission]);

  useEffect(() => {
    if (verifiedData) {
      console.log(verifiedData);

      // showToast("account created successfully", "success");
      if (method === "google") {

        (async () => {
          const data = googleDATA;
          console.log(data);
          const dataForm = {
            username: data.displayName,
            email: data.email,
            gmail: data.email,
            password: "Google@123",
            confirmPassword: "Google@123",
            gender: verifiedData.gender,
            phone: verifiedData.phone,
            place: verifiedData.place,
            profileUrl: data.photoURL
          };
          await googleLog(dataForm).unwrap();

          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        })();
      } else if (method === "normal") {
        (async () => {
          const dataForm = {
            ...formData,
            nder: verifiedData.gender,
            phone: verifiedData.phone,
            place: verifiedData.place,
            profileUrl: profileUrl
          };
          await signUp(dataForm).unwrap();
          // setSign(true);
        })()
      }
    }
  }, [verifiedData]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    mission
      ? setFormData((prevData) => ({
        ...prevData,
        [name]: name === "password" ? value.trim() : value,
      }))
      : setUpData((prevData) => ({
        ...prevData,
        [name]: name === "password" ? value.trim() : value,
      }));
  };

  return (
    <>
      <ImageUploadPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onSave={handleImageSave}
        maxImages={1}
      />
      {popup && (
        <SignDetails
          method={method}
          showToast={showToast}
          setVerifyData={setVerifyData}
          setMission={setMission}
          showPopup={showPopup}
          dataForm={dataForm}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword showToast={showToast} setShowForgotPassword={setShowForgotPassword} />
      )}
      {/* <div ref={scroller} className="w-[150%] h-full  flex duration-500"> */}
      <div ref={scroller} className={`w-[200%] duration-500
      bg-[linear-gradient(#d2d2d0,#d1d1cf,#cecece,#c6c8c7,#c6c7c699,#c3c4c399,#b5b9b899)] h-full flex`}>

        <div
          onClick={() => navigator("/user/home")}
          className={`bg-gray-200/40 font-medium backdrop-blur-3xl absolute right-10 duration-700 top-10 px-5 py-1 rounded-full flex gap-3 items-center justify-center z-10`}
        >
          <i className="ri-user-4-line text-[20px]"></i>
          <p>Gust accound</p>
        </div>

        <div className="w-full h-full flex duration-300 flex-col overflow-scroll pb-20">



          {/* new */}
          <div className="w-full max-h-[100vh] p-8 xl:p-10 xl:px-60">

            <div className="w-full md:h-full max-w-[1500px] flex flex-col xl:rounded-[60px] md:flex-row rounded-[30px] bg-[#ffffff60] rounded-br-[120px] xl:rounded-br-[180px] relative">

              {/* img */}
              <div className={`w-full ${mission ? "h-[30%] md:h-full" : "h-[50%] md:h-full"} overflow-hidden duration-500`}>
                <img className="w-full h-60 md:h-full object-bottom object-cover xl:rounded-l-[60px]  md:object-center rounded-[30px] rounded-br-[120px] md:rounded-l-[30px] md:rounded-r-[0px]" src={mission ? "/fruto.jpg" : "/vego.jpg"} alt="" />
              </div>

              {/* contents */}
              <div className="w-full h-[60%] flex items-center pt-4 md:justify-center md:h-full flex-col xl:gap-16 gap-8">
                <img className="max-w-[200px]" src={greenGrocerLogo} alt="" />

                {/* Input Fields */}
                <div className="flex flex-col  w-full max-w-[80%] xl:px-10 duration-500 xl:gap-3">
                  {/* Username Input */}
                  <AnimatePresence>
                    {mission && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          height: "auto",
                          margin: 0,
                        }}
                        exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-1 px-5 gap-5 rounded-[30px] rounded-br-[120px] mb-5">
                          <i className="ri-user-line text-[28px] opacity-20"></i>
                          <input
                            name="username"
                            placeholder="User Name"
                            className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Input */}
                  <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-1 px-5 gap-5 rounded-[30px] rounded-br-[120px] duration-700 mb-5">
                    <i className="ri-at-line text-[28px] opacity-20"></i>
                    <input
                      name="email"
                      placeholder="Email"
                      className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                      type="email"
                      value={mission ? formData.email : upData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-1 px-5 gap-5 rounded-[30px] rounded-br-[120px] mb-5 relative">
                    <i className="ri-key-line text-[28px] opacity-20"></i>
                    <input
                      name="password"
                      placeholder="Password"
                      className="flex-1 w-full mx-auto py-3 bg-transparent outline-none select-none"
                      type={showPassword ? "text" : "password"}
                      value={mission ? formData.password : upData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute right-9 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? (
                        <i className="ri-eye-line text-[24px]"></i>
                      ) : (
                        <i className="ri-eye-off-line text-[24px]"></i>
                      )}
                    </button>
                  </div>



                  {/* Confirm Password Input */}
                  <AnimatePresence>
                    {mission && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          height: "auto",
                          margin: 0,
                        }}
                        exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-1 px-5 gap-5 rounded-[30px] rounded-br-[120px]">
                          <i className="ri-lock-line text-[28px] opacity-20"></i>
                          <input
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-[13px] xl:mt-12 text-gray-500 text-center xl:text-[13px] mt-4">{mission ? 'Already have an account?' : 'New to GreenGrocer?'}<span className="text-blue-500 cursor-pointer" onClick={() => setMission(!mission)}>{mission ? ' login' : ' signup'}</span></p>

                  {/* error message */}
                  <AnimatePresence>
                    {Object.keys(errors).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          height: "auto",
                          margin: 0,
                        }}
                        exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className=" mx-16 px-10 rounded-3xl mt-8 bg-[linear-gradient(45deg,#ffffff50,#f5efef50)] border-[1px] border-gray-300 py-2">
                          {Object.values(errors).map(
                            (error, index) =>
                              index === 0 && (
                                <p
                                  key={index}
                                  className="text-[13px] text-red-500 font-medium text-nowrap"
                                >
                                  {error}
                                </p>
                              )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>



                <button onClick={signUpUser} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom-3 -right-3 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[150px] h-[70px] hover:scale-125 duration-500 group'>
                  {/* <img className='group-hover:-translate-x-full min-w-[70px] p-4 brightness-[100]  duration-500' src="/bag-2-1.svg" alt="" />
                   */}
                  <p className="text-[20px] min-w-[150px]">{!mission ? "Login" : "Signup"}</p>
                  {/* <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
                  <img className='group-hover:-translate-x-[80%] min-w-[70px] p-5 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
                </button>

                <FcGoogle className="mt-3 mb-14" onClick={loginWithGoogle} size={45} />

                {/* 
              Sign Up Button
              <button
                onClick={signUpUser}
                className="bg-[linear-gradient(to_left,#f7085a,#bc4a97)] py-5 text-white w-[80%] text-[20px] rounded-full font-bold shadow-[6px_6px_10px_#00000080_inset] duration-700 mt-8"
              >
                Signup
              </button> */}



              </div>

            </div>

          </div>

























        </div>
      </div>
    </>
  );
}
