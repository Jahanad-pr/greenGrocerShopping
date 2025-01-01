import React, { useEffect, useState } from "react";
import { useDeleteAddressMutation, useGetAdressesMutation } from "../../../../services/User/userApi";
import HoverKing from "../../../parts/buttons/HoverKing";
import { useLocation, useNavigate } from "react-router-dom";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { showToast } from "../../../parts/Toast/Tostify";

const EmptyState = ({ navigateTo }) => (
  <div className="w-full h-full mt-40 flex items-center justify-center flex-col pb-28 text-center gap-5 relative">
    <img className="h-[80%] filter-[brightness(0)]" src="/receipt.svg" alt="No categories" />
    <div className="flex flex-col gap-2">
      <h1 className="text-[30px] font-bold">No address added yet!</h1>
      <p className="opacity-45 text-[13px] max-w-[700px]">
        Add your products to cart to buy them. You can purchase multiple products in one order.
      </p>
      <HoverKing
        event={() => navigateTo("/user/profile/manageaddress")}
        styles="absolute bottom-0 left-1/2 -translate-x-[50%] rounded-full border-0 font-medium text-[16px] bg-white"
        Icon={<i className="ri-apps-2-add-line text-[30px]" />}
      >
        Let's add an address
      </HoverKing>
    </div>
  </div>
);

const LoadingAnimation = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <div className="absolute w-full h-full border-8 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-8 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
      <p className="text-lg font-medium text-gray-600">Loading your addresses...</p>
    </div>
  </div>
);

function AddressCard({ address, navigate, showToast, setaddressData, addressData }) {
  const [deleteAddress] = useDeleteAddressMutation();
  const [popup, showPopup] = useState(false);

  useEffect(() => {
    if (deleteAddress.data) {
      showToast(deleteAddress.data, "success");
      setaddressData(addressData.filter((item) => item._id !== address._id));
    }
  }, [deleteAddress.data]);

  return (
    <>
      {popup && (
        <DeletePopup
          updater={deleteAddress}
          deleteData={{ id: address._id }}
          showPopup={showPopup}
          action="Delete Address"
          isUser={true}
        />
      )}
      <div
        onClick={() => navigate("/user/profile/manageaddress", { state: address })}
        className="sm:w-[330px] w-[280px] hover:scale-105 duration-500 mt-5 pb-12 md:pb-16 pt-16 bg-gradient-to-b from-[#dcdcdc50] to-[#d9d9d930] rounded-[30px] rounded-tl-[120px] flex flex-col p-10 py-4 gap-5 relative group"
      >
        <span className="flex items-center gap-3">
          <img
            className={`w-20 group-hover:scale-125 duration-500 absolute -left-2 -top-5 ${
              address.locationType === "Work" ? "p-1" : ""
            }`}
            src={
              address.locationType === "Home"
                ? "/home.svg"
                : address.locationType === "Work"
                ? "/buildings.svg"
                : address.locationType === "Person"
                ? "/user-tag.svg"
                : "/location.svg"
            }
            alt=""
          />
          <p
            className={`text-[50px] ${
              address.locationType === "Work"
                ? "text-[#ff0000]"
                : address.locationType === "Home"
                ? "text-[#1c7721]"
                : address.locationType === "Person"
                ? "text-[#0d32e9]"
                : "text-[#706e1b]"
            } absolute font-bold mb-2 ml-14 top-0 right-5 group-hover:-translate-x-10 duration-500 opacity-25 group-hover:opacity-60`}
          >
            {address.locationType}
          </p>
        </span>
        <span className="text-[17px] leading-none opacity-65">
          <p>
            {address.FirstName} {address.LastName}
          </p>
          <p>{address.exactAddress}</p>
          <p>{address.streetAddress}</p>
          <p className="font-medium md:text-nowrap">
            {address.city.toUpperCase()}, {address.state.toUpperCase()} {address.pincode}
          </p>
        </span>
        <span>
          <p className="font-medium text-[13px] font-mono text-[#6c8073]">
            <span>+91</span> {address?.phone}
          </p>
        </span>
        <span className="flex absolute right-5 bottom-5 justify-end gap-5">
          <img
            onClick={(e) => {
              e.stopPropagation();
              showPopup(true);
            }}
            className="w-[32px] filter brightness-100 hover:scale-125 duration-500 saturate-100 hue-rotate-[0deg]"
            src="/trash.svg"
            alt=""
          />
        </span>
      </div>
    </>
  );
}

export default function Address({ userData }) {
  const [getAdresses, { isLoading, error, data }] = useGetAdressesMutation();
  const [addressData, setaddressData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.data) showToast(location.state, "success");
  }, [location]);

  useEffect(() => {
    if (data) setaddressData(data);
  }, [data]);

  useEffect(() => {
    if (error) showToast(error.data, "error");
  }, [error]);

  useEffect(() => {
    if (userData) getAdresses(userData._id);
  }, [userData]);

  if (isLoading) return <LoadingAnimation />;

  return (
    userData && (
      <div className="md:w-[90%] h-full">
        <div className="w-full h-full flex flex-col items-center backdrop-blur-3xl">
          <span className="w-screen h-full md:px-64 px-10 relative overflow-scroll pb-96">
            {addressData.length > 0 ? (
              <>
                <h1 className="text-[35px] font-bold my-16 mb-8 leading-tight pt-14 md:pt-0">
                  Manage Address
                </h1>
                
                <div className="w-full flex flex-wrap gap-12 md:justify-start justify-center">
                  {addressData.map((address, index) => (
                    <AddressCard
                      key={index}
                      address={address}
                      navigate={navigate}
                      showToast={showToast}
                      setaddressData={setaddressData}
                      addressData={addressData}
                    />
                  ))}
                </div>
                {addressData?.length > 0 && 
            <span className="">
              <HoverKing event={() => navigate('/user/profile/manageaddress')} styles={'fixed text-[13px]  font-bold text-white/50 bottom-[90%] md:bottom-28 scale-75 2xl:right-64 right-10 md:right-28 rounded-full'} Icon={<i className="ri-apps-2-add-line text-[30px]"></i>} >Add address</HoverKing>
            </span>}
              </>
            ) : (
              <EmptyState navigateTo={navigate} />
            )}
          </span>
        </div>
      </div>
    )
  );
}
