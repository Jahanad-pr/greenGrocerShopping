import React, { useEffect, useState } from "react";
import pic from "../../../../assets/images/pico.jpeg";
import Recents from "../../../parts/Main/Recents";
import { useNavigate } from "react-router-dom";
import { useGetCustomersMutation, useUpdateUserAccessMutation } from "../../../../services/Admin/adminApi";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";

const UserTable = () => {

  const navigator = useNavigate()
  const [togglor,setToggler] = useState(
    { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false }
  )

  const [getCustomers, { isLoading, error, data }] = useGetCustomersMutation();
  const [updateUserAccess, { isLoading:accessLoading, error:accessError, data:accessData }] = useUpdateUserAccessMutation();
  

  const navigate = useNavigate()

  // update user access
  const accessUpdater = async(uniqeID,updateBool)=>{
    await updateUserAccess({uniqeID,updateBool}).unwrap()
  }
  
  // get all access 
  // to prevent reload
  useEffect(()=>{
    if(data?.data){
        const toggleState = data.data.reduce((acc, cat) => ({
          ...acc,
          [cat._id]: cat.isListed
        }), {});
        setToggler(toggleState);
      }
  },[data])


  // if access updated
  useEffect(()=>{
    if(accessData?.mission){
      setToggler((prevData)=>({...prevData,  [accessData?.uniqeID]:!togglor[accessData?.uniqeID]}))
    }
  },[accessData])


  // get users
  useEffect(()=>{
    (async()=>{ await getCustomers().unwrap() })()
  },[])




  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Users</h1>
        <p className="opacity-45">
         No user data found create a user yurself to continue
        </p>
        <p
          onClick={() =>
            navigate("/user/signup", { state: { name: "" } })
          }
          className="font-bold opacity-100 text-blue-500 cursor-pointer"
        >
          Let's go
        </p>
      </div>
    </div>
  );


  return (
    <>
      <div className="container w-[75%] h-full pt-[56px] my-8 relative ">
        <div className=" w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgba(246,237,231,1)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center">
          <div className="">



            {/* filter container-------------------------------- */}
            <div className="w-full h-20 flex items-center gap-8">
              {/* saerch field */}
              <div className=" bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full">
                <input
                  className="bg-transparent outline-none"
                  type="text"
                  placeholder="search here"
                />
                <i className="ri-search-2-line text-[25px] text-[#ED7F10]"></i>
              </div>

              {/* sort selector */}
              <div className=" bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full items-center">
                <i className="ri-align-left text-[25px] text-[#ED7F10]"></i>
                <p className="font-medium opacity-45">Sort by</p>
                <select
                  className="bg-transparent outline-none custom-selecter"
                  name=""
                  id=""
                >
                  <option value="">Name</option>
                  <option value="">Amount</option>
                  <option value="">Latest</option>
                  <option value="">Oldest</option>
                </select>
              </div>

              {/* order selctor */}
              <div className=" bg-[#ffffff70] py-1 px px-5 inline-flex gap-8 rounded-full items-center">
                <i className="ri-align-justify text-[25px] text-[#ED7F10]"></i>
                <p className="font-medium opacity-45">Order</p>
                <select
                  className="bg-[transparent] outline-none custom-selecter"
                  name=""
                  id=""
                >
                  <option value="">Ascending</option>
                  <option value="">Descending</option>
                </select>
              </div>
            </div>



            {/* table------------------------------ */}
            { data?.data?.length>0 ?

            <table className="w-full border-collapse rounded-full mt-5">
              <thead className="py-10">
                <tr className="bg-[linear-gradient(to_right,#fbdcc9,#fbf5f2)] font-mono text-[13px] rounded-full text-[#00000070]">
                  <th className="py-2 px-4 pl-12 text-left rounded-l-full">
                    S. Number
                  </th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Number</th>
                  <th className="py-2 px-4 text-center">Access</th>
                  <th className="py-2 px-4 text-center rounded-r-full"> Action </th>
                </tr>
              </thead>
              <tbody>
                <tr>&nbsp;</tr>


                {/* table contant maper----------------------------------------- */}
                {data?.data?.map((user,index) => 

                (
                  <tr key={user._id} className="border-b">
                    <td className="py-4 px-4 rounded-l-full flex items-center gap-5 text-[20px] font-bold">
                      <img
                        className="w-[55px] h-[55px] object-cover rounded-full"
                        src={ user?.profileUrl ||
                          "data:image/jpeg;base64,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"
                        }
                        alt=""
                      />
                      {index+1}
                    </td>
                    <td className="py-2 px-4 text-[20px] font-medium font-['lufga']">
                      {user.username}
                    </td>
                    <td className="py-2 px-4 text-[13px] opacity-55">{user.email}</td>
                    <td className="py-2 px-4">{user.phone}</td>
                    
                    {/* btn access */}
                    <td className="py-2 px-4 text-center">
                      {/* <div className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg">
                        <div className="absolute top-1/2 left-2 w-5 h-5  rounded-full transform -translate-y-1/2 transition-all duration-300"></div>
                        <div className="absolute top-1/2 right-2 w-7 h-7 bg-gray-700 rounded-full transform -translate-y-1/2"></div>
                      </div> */}
                      {
                      <div onClick={()=>(accessUpdater(user._id,!togglor[user._id]))} className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg">
                        <div className={`absolute top-1/2 w-5 h-5 ${togglor[user._id]?'left-[calc(100%_-_28px)]':'left-2'} bg-gray-700  rounded-full transform -translate-y-1/2 transition-all duration-300`}></div>
                        <div className={`absolute top-1/2 w-7 ${togglor[user._id]?'bg-teal-400 h-5 right-[calc(100%_-_36px)]':'bg-red-700 h-2 right-2'}  rounded-full transform -translate-y-1/2 duration-500`}></div>
                      </div>
                      }
                    </td>

                    <td className="py-2 px-4 text-center items-center justify-center">
                      <i onClick={()=>navigator('/admin/Customers/manage',{ state:{user} })} className="ri-eye-line text-[30px] opacity-45"></i>
                      &nbsp;&nbsp;&nbsp;
                      {/* <i className="ri-delete-bin-line text-[30px] text-[#F0491B] opacity-0"></i> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>:<EmptyState />
            }

            
            {/* pagination nav */}
            <div className="flex justify-end mt-4 absolute bottom-20 left-1/2 translate-x-[-50%]">
              <button className="bg-gray-200 hover:bg-gray-400 text-gray-500 font-bold py-2 px-6 rounded-full">
                Page 01
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full ml-2">
              <i className="ri-skip-right-line text-[22px]"></i>
              </button>
            </div>


          </div>
        </div>
      </div>
      <Recents page={'users'} />
    </>
  );
};

export default UserTable;
