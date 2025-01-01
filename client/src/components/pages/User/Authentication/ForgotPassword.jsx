import React, { useState, useEffect, useRef } from "react";
// import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import greenGrocerLogo from "../../../../assets/Logos/main.png";
import { useConformOTPMutation, useGetOTPMutation, useIsUerExistMutation, useResetPasswordMutation } from "../../../../services/User/userApi";
import { validateFormData } from "./validation/validation";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@";
const CYCLES_PER_LETTER = 1; 
const SHUFFLE_TIME = 30; 

const TextScramble = ({ text }) => {
  const [scrambledText, setScrambledText] = useState(text);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    let pos = 0;
    let startTime = Date.now();
    const TOTAL_DURATION = 3000; 
    
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime >= TOTAL_DURATION) {
        clearInterval(intervalRef.current);
        setScrambledText(text);
        return;
      }
      
      const scrambled = text.split("")
        .map((char, index) => {
          const revealThreshold = (elapsedTime / TOTAL_DURATION) * text.length;
          if (index < revealThreshold) {
            return char;
          }
          if (char === ' ') return ' ';
          const randomCharIndex = Math.floor(Math.random() * CHARS.length);
          const randomChar = CHARS[randomCharIndex];
          return randomChar;
        })
        .join("");
      
      setScrambledText(scrambled);
      pos++;
      
      if (pos >= text.length * CYCLES_PER_LETTER) {
        clearInterval(intervalRef.current);
        setScrambledText(text);
      }
    }, SHUFFLE_TIME);
    
    return () => clearInterval(intervalRef.current);
  }, [text]);
  
  return (
    <span style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
      {scrambledText}
    </span>
  );
};

export default function ForgotPassword({ setShowForgotPassword,showToast }) {

  const [getOTP, { isLoading: sendLoading, error: sendError, data: sendData }] = useGetOTPMutation(); 
  const [ isUerExist, { isLoading: isUerExistLoading, error: isUerExistError, data: isUerExistData }, ] = useIsUerExistMutation();
  const [ conformOTP, { isLoading: confirmLoading, error: confirmError, data: conformData }, ] = useConformOTPMutation();
  const [ resetPassword, { isLoading: resetLoading, error: resetError } ] = useResetPasswordMutation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(()=>{
    if(isUerExistData?.forWord){
      setErrors({ email: "Email is not registered" });
    }else if(isUerExistData){
      // Existing code
    }
  },[isUerExistData])

  useEffect(()=>{
    if(isUerExistError?.data){
      (async()=>{
        try {
          await getOTP(email).unwrap();
          showToast("OTP sent to your email", "success");
          setOtpSent(true);
          setChangingEmail(false);
          setRetryCount((prev) => prev + 1);
          const delay = Math.min(60 * (retryCount + 1), 300); 
          setTimer(delay);
        } catch (error) {
          showToast(error.message, "error");
        }
      })()
    }
  },[isUerExistError])



  const handleSubmit = async () => {
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email" });
      return;
    }

    try {
      await isUerExist({email}).unwrap();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrors({ otp: "Please enter OTP" });
      return;
    }
    if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }
    
    setVerifyingOtp(true);
    try {
      // await new Promise(resolve => setTimeout(resolve, 1000)); 
      await conformOTP({mail:email,otp}).unwrap();
      showToast("OTP verified successfully", "success");
      setOtpVerified(true);
    } catch (error) {
      showToast(error.message || "Invalid OTP", "error");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}~|/]).{8,}$/;
    
    if (!confirmPassword.trim()) {
      setErrors({ password: "Confirm password is required" });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "Password is required" });
      return;
    }
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrors({ password: "Password must contain at least one uppercase letter" });
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrors({ password: "Password must contain at least one lowercase letter" });
      return;
    }
    if (!/\d/.test(password)) {
      setErrors({ password: "Password must contain at least one number" });
      return;
    }
    if (!/[!@#$%^&*()_\-+=<>?{}~|/]/.test(password)) {
      setErrors({ password: "Password must contain at least one special symbol" });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setResettingPassword(true);
    try {
      await resetPassword({
        email,
        password,
        otp
      }).unwrap();
      
      showToast("Password reset successful", "success");
      setShowForgotPassword(false);
    } catch (error) {
      showToast(error.message || "Failed to reset password", "error");
    } finally {
      setResettingPassword(false);
    }
  };

  const handleChangeEmail = () => {
    setChangingEmail(true);
    setOtp("");
  };

  const handleBackToOtp = () => {
    setChangingEmail(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // const showToast = (message, type = "success") => {
  //   if (type === "success") {
  //     toast.success(message, {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   } else {
  //     toast.error(message, {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }
  // };

  useEffect(()=>{

    if(resetError?.data){
      showToast(resetError?.data, "error");
    }

  },[resetError])


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='w-screen h-screen absolute left-0 top-0 bg-[#00000083] backdrop-blur-sm z-20 grid place-items-center'
      >
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          onClick={() => setShowForgotPassword(false)}
        />

        <motion.div 
          initial={{ 
            scale: 0.4,
            opacity: 0,
            rotateX: 90,
            y: -60
          }}
          animate={{ 
            scale: [0.4, 1.1, 1],
            opacity: 1,
            rotateX: 0,
            y: 0
          }}
          exit={{ 
            scale: 0.4,
            opacity: 0,
            rotateX: -90,
            y: 60
          }}
          transition={{ 
            type: "spring",
            damping: 15,
            stiffness: 300,
            bounce: 0.4,
            duration: 0.6
          }}
          style={{
            transformPerspective: 1200,
            transformStyle: "preserve-3d"
          }}
          className="w-full max-w-[550px] backdrop-blur-2xl py-10 bg-[linear-gradient(45deg,#00000080,#412524)] flex items-center justify-center flex-col gap-5 rounded-3xl px-10 relative z-10"
        >
          {/* <ToastContainer position="bottom-left" /> */}
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center w-full"
          >
            <img src={greenGrocerLogo} alt="Logo" className="w-32 mb-6 brightness-0 invert" />
            <h2 className="text-2xl font-bold text-white mb-6">Forgot Password</h2>
            
            <div className="w-full space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  {otpVerified ? (
                    <div className="space-y-4">
                      <div className="w-full flex items-center justify-center bg-[#ffffff1a] py-2 px-5 gap-5 rounded-full backdrop-blur-md relative">
                        <i className="ri-lock-password-line text-[28px] text-white/50"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({});
                          }}
                          className="flex-1 w-full mx-auto py-3 bg-transparent outline-none text-white placeholder:text-white/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-white/50 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <i className="ri-eye-line text-[24px]"></i>
                          ) : (
                            <i className="ri-eye-off-line text-[24px]"></i>
                          )}
                        </button>
                      </div>

                      <div className="w-full flex items-center justify-center bg-[#ffffff1a] py-2 px-5 gap-5 rounded-full backdrop-blur-md relative">
                        <i className="ri-lock-password-line text-[28px] text-white/50"></i>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setErrors({});
                          }}
                          className="flex-1 w-full mx-auto py-3 bg-transparent outline-none text-white placeholder:text-white/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-white/50 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? (
                            <i className="ri-eye-line text-[24px]"></i>
                          ) : (
                            <i className="ri-eye-off-line text-[24px]"></i>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : !otpSent || changingEmail ? (
                    <div className="w-full flex items-center justify-center bg-[#ffffff1a] py-2 px-5 gap-5 rounded-full backdrop-blur-md">
                      <i className="ri-at-line text-[28px] text-white/50"></i>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors({});
                        }}
                        className="flex-1 w-full mx-auto py-3 bg-transparent outline-none text-white placeholder:text-white/50"
                      />
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full flex items-center justify-center bg-[#ffffff1a] py-2 px-5 gap-5 rounded-full backdrop-blur-md"
                    >
                      <i className="ri-lock-password-line absolute left-8 text-[28px] text-white/50"></i>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setOtp(value);
                          setErrors({});
                        }}
                        className="flex-1 w-full mx-auto py-3 bg-transparent outline-none text-white placeholder:text-white/50 tracking-[8px] text-center font-medium"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {errors.email && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-red-400 text-sm ml-4"
                >
                  {errors.email}
                </motion.p>
              )}

              {errors.otp && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-red-400 text-sm ml-4"
                >
                  {errors.otp}
                </motion.p>
              )}

              {errors.password && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-red-400 text-sm ml-4"
                >
                  {errors.password}
                </motion.p>
              )}

              {errors.confirmPassword && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-red-400 text-sm ml-4"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: ((timer > 0 && (!otpSent || changingEmail)) || sendLoading || resettingPassword) ? 0.5 : 1 }}
                transition={{ delay: 0.3 }}
                onClick={otpVerified ? handleResetPassword : otpSent && !changingEmail ? handleVerifyOtp : handleSubmit}
                disabled={(timer > 0 && (!otpSent || changingEmail)) || sendLoading || verifyingOtp || resettingPassword}
                className={`w-full bg-[linear-gradient(45deg,#006536,#00437b)] group py-4 duration-500 text-white rounded-full flex items-center justify-center gap-2 ${
                  ((timer > 0 && (!otpSent || changingEmail)) || sendLoading || verifyingOtp || resettingPassword) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                <p>
                  {resettingPassword ? "Resetting Password..." :
                  verifyingOtp ? "Verifying..." :
                  otpVerified ? "Reset Password" :
                  otpSent && !changingEmail ? "Confirm OTP" :
                  sendLoading ? "Sending..." : 
                  timer > 0 ? `Resend OTP in ${formatTime(timer)}` :
                  changingEmail ? "Send OTP" :
                  sendData ? "Resend OTP" : "Send OTP"}
                </p>
                <i className={`${otpVerified ? 'ri-lock-unlock-line' : otpSent && !changingEmail ? 'ri-shield-keyhole-line' : 'ri-mail-line'} font-thin text-[22px] opacity-45 ${(sendLoading || verifyingOtp || resettingPassword) ? 'animate-spin' : 'scale-0 duration-500 group-hover:scale-100'}`}></i>
              </motion.button>

              {otpSent && (
                <AnimatePresence>
                  {changingEmail ? (
                    <motion.div className="space-y-4">
                      {timer > 0 && (
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 0.7 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="text-white text-center text-sm"
                        >
                          Time remaining: {formatTime(timer)}
                        </motion.p>
                      )}
                      {  !otpVerified &&
                      <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleBackToOtp}
                        className="w-full bg-white/10 backdrop-blur-md py-4 text-white/90 rounded-full font-medium hover:bg-white/20 transition-colors"
                      >
                        <i className="ri-arrow-left-line"></i>
                        Back to OTP Verification
                      </motion.button>
                      }
                    </motion.div>
                  ) : (  !otpVerified &&
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.3 }}
                      onClick={handleChangeEmail}
                      className="w-full bg-white/10 backdrop-blur-md py-4 text-white/90 rounded-full font-medium mt-4 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Change Email or Resend OTP
                    </motion.button>
                  )}
                </AnimatePresence>
              )}

              

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-white/10 backdrop-blur-md py-4 text-white/90 rounded-full font-medium mt-4 hover:bg-white/20 transition-colors"
              >
                Back to Login
              </motion.button>

              { !otpVerified &&

              <AnimatePresence mode="wait">
                <motion.div
                  key={otpSent ? "sent" : "initial"}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="w-full text-center space-y-2 mb-4"
                >
                  {!otpSent || changingEmail ? (
                    <motion.div variants={item} className="flex flex-col gap-1 ml-3">
                      <motion.p className="text-white/50 text-[13px]">
                        <TextScramble text="Enter your email address" />
                      </motion.p>
                      <motion.p className="text-white/50 text-[13px]">
                        <TextScramble text="We'll send you an OTP to reset your password" />
                      </motion.p>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div variants={item} className="flex flex-col gap-1 ml-3">
                        <motion.p className="text-white/50 text-[13px]">
                          <TextScramble text="We've sent an OTP to:" />
                        </motion.p>
                        <motion.p className="text-white font-medium opacity-65">
                          <TextScramble text={email} />
                        </motion.p>
                      </motion.div>
                      <motion.div variants={item} className="flex flex-col ml-3">
                        <motion.p className="text-white/50 text-[13px] leading-none">
                          Please check your email and enter the 6-digit OTP code
                        </motion.p>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              }

            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
