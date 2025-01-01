import React, { useEffect, useState } from 'react'
import tick from '../../../../../assets/images/tick.webp'
import cross from '../../../../../assets/images/cross.png'
import { useLocation, useNavigate } from 'react-router-dom';


export default function OrderSuccess() {

  const [data, setData] = useState({});

  const navigator = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setData(location?.state?.data);
  }, [location])


  return (
    <div className='md:w-[96%] bg-[#f5f5f5] mx-auto overflow-scroll'>
      <div className="w-full px-4 md:px-20 lg:px-80 gap-5 fade-in pb-40">

        <img className='bg-blend-darken mx-auto mt-28 mb-12 rounded-lg w-28 h-28' src={data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? tick : cross} alt="" />
        <span className='flex flex-col items-center gap-4'>
          <span className='leading-[32px] text-center'>
            <p onClick={()=>console.log(data)} className='md:text-[40px] text-[28px] mb-8 font-["lufga"]'>
              {data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? 'Thank you for your purchase':'Payment Failed'}</p>
              {
                data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery'&&
            <p className='md:text-[20px] text-[13px] opacity-75 ["lufga"]'>We've received your order will ship in 3-4 hours.<br />
              Your order ID is <span className=''>{data?.order_id}</span></p>
              }
              {
                data?.payment_status === 'pending' || data?.payment_method !==  'Cash on Delivery' &&
                <p className='md:text-[20px] text-[13px] opacity-75 ["lufga"] leading-tight'>You can check your order status in your account. And you can continue with your paynment</p> 
              }
          </span>

          {/* <div className="flex items-center gap-5 relative">
                    <p className='text-[200px] absolute opacity-[3%] right-0'>+</p>
                    <img className='w-28' src={coin} alt="" />
                    <p className='text-[24px] text-gray-400'><span className='font-bold text-yellow-700'>8</span> Coin added</p>
                </div> */}

          <div className="mt-8 max-w-[700px] bg-white p-6 px-10 rounded-[30px] rounded-br-[120px] w-full relative">
            <p className="text-[32px] mb-6 font-['lufga']">Order Summary</p>
            <span className='flex gap-8 pb-6'>

              <div className="flex-1 text-[16px] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="opacity-65">Total for Products</span>
                  <span className="font-medium">₹{data?.price?.others.totel.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-65">Delivery charge</span>
                  <span className="font-medium">₹{location.state?.data?.price.others.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-65">Tax amount</span>
                  <span className="font-medium">₹{location.state?.data?.price.others.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-65">Discount amount</span>
                  <span className="font-medium">₹{location.state?.data?.price?.discountPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex-1 text-[16px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="opacity-75">Shipping address</span>
                </div>
                <div className="opacity-50">
                  <span className="font-medium">{location?.state?.data?.delivery_address?.FirstName}</span>
                  <br />
                  <span className="font-medium text-wrap">{location?.state?.data?.delivery_address?.exactAddress}</span>
                  <span className="font-medium text-wrap">{location?.state?.data?.delivery_address?.streetAddress}</span>
                  <br />
                  <span className="font-medium text-wrap">{location?.state?.data?.delivery_address?.city}, </span>
                  <span className="font-medium text-wrap">{location?.state?.data?.delivery_address?.state}</span>
                  <span> ,INDIA</span>
                  <span className="font-medium text-wrap">  {location?.state?.data?.delivery_address?.pincode}</span>
                </div>
              </div>
            </span>

            <button onClick={() => navigator('/user/Order/Invoice', { state: { norma:true, data } })}  className={`flex justify-start group items-center font-bold rounded-full text-white absolute bottom-0 right-3 ${data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? 'bg-[linear-gradient(#b4c2ba,#789985)]' : 'bg-[linear-gradient(#ff000080,#ff000090)]'} overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group`}>
              <img src='/receipt-item.svg' className="p-4 brightness-[100] font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></img>
              <img src='/arrow-right.svg' className="ri-arrow-right-line p-5 brightness-[100] rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></img>
            </button>

          </div>

          {/* <span className='flex items-center justify-center cursor-pointer group text-blue-500'>
            <p className='text-[20px] font-bold'>See The Invoice Page</p>
            <i className='ri-arrow-right-s-fill inline-block text-[28px] relative left-0 group-hover:left-8 duration-500 group-hover:text-[35px]'></i>
          </span> */}

          <div className="flex flex-col md:flex-row gap-3 mt-5 ['lufga'] justify-center">
            <button onClick={() => navigator('/user/Orders',{replace:true})} className={`group text-[13px] px-14 py-4 ${data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? 'bg-[#85a290]' : 'bg-[linear-gradient(to_left,#ee3241,#f8858c)]'} rounded-full text-white`}>View Orders</button>
            <button onClick={() => navigator('/user/Wallet',{replace:true})} className={`mt-5 md:mt-0 text-[13px] font-medium  ${data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? 'bg-[#85a290]' : 'bg-[linear-gradient(to_left,#ee3241,#f8858c)]'} rounded-full p-[2px]`}>
              <p className={`py-4 ${data?.payment_status !== 'pending' || data?.payment_method ===  'Cash on Delivery' ? 'bg-[#85a290]' : 'text-[#e65757]'}  bg-white w-full h-full px-12 text-center flex items-center rounded-full font-medium`}>View Wallet</p>
            </button>
          </div>
        </span>
      </div>
    </div>
  )
}
