import { Coupon } from './../../../parts/Cards/Coupon';
import React, { useEffect } from 'react';
import { ArrowLeft, Home, Video, ShoppingBag, Bookmark, ShoppingCart, User, Search, Copy } from 'lucide-react';
import { useGetAllCouponsMutation } from '../../../../services/User/userApi';
import HoverKing from '../../../parts/buttons/HoverKing';

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
      <p className="text-lg font-medium text-gray-600">Loading your coupons...</p>
    </div>
  </div>
);

const CouponsList = () => {

  const [getAllCoupons,{data,isLoading}] = useGetAllCouponsMutation()

  useEffect(()=>{ getAllCoupons() },[])

 

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center mt-28 pb-20 sm:pb-0 md:pb-20 justify-center flex-col text-center gap-5 relative">
      <img className="md:h-[80%] h-[40%] filter-[brightness(0)]" src='/ticket-expired.svg' alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">Sorry, No Coupons</h1>
        <p className="opacity-45 text-[13px] text-center max-w-[700px]">
          We could not find any Coupons,Your order can support us to make more productive and
          by that you can get more discounts,make support and stay tuned
        </p>
        {/* <p onClick={() => navigate("/user/products")} className="text-[20px] text-blue-600 font-medium"></p> */}
        <HoverKing event={() => navigate("/user/products")} styles={'absolute bottom-0 left-1/2 -translate-x-[50%] rounded-full border-0 font-medium text-[13px] bg-white'} Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>} >Let's breack the chain</HoverKing>
      </div>
    </div>
  );

if (isLoading) return <LoadingAnimation />;


  return (
    <div className="md:w-[96%] h-full p-4 bg-[#f2f2f2]">

    <div className="w-full h-full md:px-40 px-10">

      {/* Main Content */}
      <main className="mt-8">

      { data?.length > 0 && <h1 className="text-[35px] font-bold my-16">Coupons</h1>}


        {/* Coupons Grid */}
        { data?.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          {data?.map((coupon, index) => (
            coupon.isActive &&
            <Coupon   index={index} coupon={coupon}  />
          ))}
        </div>:
        <EmptyState />

        }
      </main>
    </div>

    </div>
  );
};

export default CouponsList;
