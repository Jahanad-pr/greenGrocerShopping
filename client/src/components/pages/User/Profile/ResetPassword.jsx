import React, { useEffect, useState } from "react";
import rpi from "../../../../assets/images/rpillu.png";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation, useMatchPasswordMutation, useResetPasswordMutation } from "../../../../services/User/userApi";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
import { useUpdateProfileMutation } from "../../../../services/User/userApi";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { showToast } from '../../../parts/Toast/Tostify'


export default function ResetPassword({ userData }) {

  // mutation to check the passowrd
  const [matchPassword, { isLoading, error, data }] =
    useMatchPasswordMutation();
  const [resetPassword, { isLoading:resetLoading, error:resetError, data:resetData }] =
    useResetPasswordMutation();
  const [logoutUser,{ data:logData }] = useLogoutUserMutation()


    // states
    const navigaror = useNavigate();
    const [currentPassowrd, setCurrentPassowrd] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);
  const [popup, showPopup] = useState(false);


      // Password validation
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}~|/]).{8,}$/;

      const validatePassword = ()=>{
        if (!newPassword) {
          return  "New Password is required.";
        } else if (newPassword.length < 8) {
          return  "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(newPassword)) {
          return  "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(newPassword)) {
          return  "Password must contain at least one lowercase letter.";
        } else if (!/\d/.test(newPassword)) {
          return  "Password must contain at least one number.";
        } else if (!/[!@#$%^&*()_\-+=<>?{}~|/]/.test(newPassword)) {
          return  "Password must contain at least one special symbol.";
        } else if(newPassword!==confirmPassword){
          return 'Password do not match'
        }
        return false
      }



  // to show the error and success
  useEffect(() => { if(resetData){
    navigaror(`/user/profile/${userData?._id}`,{ state:{ message:'resetData' } }) 
    showToast(resetData,'seccess')
    } 
    } , [resetData]);
  useEffect(() => (showToast(data, "success"), setSuccess(true)), [data]);

  useEffect( () => (showToast(error?.data, "error"), setSuccess(false)), [error] );
  useEffect( () => (showToast(resetError?.data, "error")), [resetError] );

  // check the current password
  const matchCurrectPassword = async () => {
    const userDatas = { _id: userData._id, password: currentPassowrd };
    await matchPassword(userDatas).unwrap();
  };

  // onSubmit new password
  const resetPasswordSubmit = async()=>{
    const isNotValidPassword = validatePassword()
    if(isNotValidPassword){
      return showToast(isNotValidPassword, "error")
    }
    // sending New password
    const sendUserData = {_id: userData._id, password: newPassword,email:userData.email }
    return resetPassword(sendUserData).unwrap

  }

  useEffect(()=>{
    
    if(logData){
        setTimeout(()=>{
        navigaror('/user/signup')
      },2000)
      }
  },[logData])

  return (
    <>{popup && (
      <DeletePopup
        updater={logoutUser}
        deleteData={{id:userData._id}}
        showPopup={showPopup}
        action="Logout and reset the password"
        isUser={true}
      />
    )}
      {" "}
      <div className="w-[96%] h-full bg-prof">
        <div className="w-full h-full backdrop-blur-3xl">
          <span className="h-full px-40 flex flex-col justify-center items-center gap-5 w-full bg-[#ffffff69]">
            {/* Haead */}
            <h1 className="text-[30px] font-bold">Reset Password</h1>
            {/* illustration */}
            <img className="w-[400px]" src={rpi} alt="" />
            {/* old password */}
            <input
              disabled={success}
              onChange={(e) => setCurrentPassowrd(e.target.value)}
              value={currentPassowrd}
              className={`w-full max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] ${
                success ? "opacity-35" : "opacity-100"
              } rounded-full text-[13px]`}
              type="password"
              placeholder="Old Password"
            />

            <p onClick={() => showPopup(true)} className="max-w-[410px] w-full text-blue-500 font-medium">
              Forget password ?
            </p>


            {/* new password */}
            <span
              className={`flex-col w-full max-w-[450px] flex justify-center items-center gap-5  ${
                !success ? "opacity-35" : "opacity-100"
              } `}
            >
              <input
              value={newPassword}
              onChange={(e)=>setNewPassword(e.target.value)}
                 disabled={!success}
                className="w-full py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-full text-[13px]"
                type="text"
                placeholder="New Password"
              />
              {/* confirm password */}
              <input
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
                disabled={!success}
                className="w-full max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#f5efef,#f5efef)] rounded-full text-[13px]"
                type="password"
                placeholder="Confirm Password"
              />
              {/* procced button */}
            </span>
            <button
              onClick={() => !success? matchCurrectPassword():resetPasswordSubmit()}
              className={`px-16 py-[15px] ${
                success
                  ? "bg-[linear-gradient(to_left,#0bc175,#0f45ff)] text-[13px]"
                  : "bg-[linear-gradient(to_left,#1b1e20,#5d6362)] text-[13px]"
              } rounded-full text-white font-medium mt-10 w-full max-w-[300px]`}
            >
              Confirm
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
