import React, { useEffect, useState } from "react";

import { useGetAdressesMutation, useGetAllCouponsMutation } from "../../../../../services/User/userApi";
import { useLocation, useNavigate } from "react-router-dom";
import HoverKing from "../../../../parts/buttons/HoverKing";
import ProductDetailsPopup from "./ProductDetailsPopup";
import { Coupon } from "../../../../parts/Cards/Coupon";
import AddressSelectionPopup from '../AddressSelectionPopup'; // Adjust the import path as necessary
// import useData from "rsuite/esm/InputPicker/hooks/useData";
import { showToast } from '../../../../parts/Toast/Tostify';

export default function OrderSummary({userData}) {

  const [ getAdresses, { isLoading, error, data }, ] = useGetAdressesMutation();
  const [getAllCoupons,{data:couponData}] = useGetAllCouponsMutation()

  useEffect(()=>{ getAllCoupons() },[])
  
  const [adressData,setaddressData] = useState()
  const [itemses,setItems] = useState()
  const navigate = useNavigate()
  const location = useLocation()

  const [cart, setCart] = useState([]);
  const [delivery, setDelivery] = useState('Fast Delivery');
  const [address, setAddress] = useState();
  const [couponCode, setCode] = useState();
  const [applyCoupon, setApplyCoupon] = useState(false);
  const [CouponDatas, setCouponData] = useState();
  const [originalCouponData, setOriginalCouponData] = useState();
  const [number, setNumber] = useState();
  const [grandTotal, setGrandTotel] = useState();
  const [counDiscount, setCouponDiscount] = useState(0);

  const [summary, setSummary] = useState({
    items: 0,
    discount: 0,
    taxes: 5.3,
    deliveryFee: 40,
    coupon:0,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };
  
  const closePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };
  
  const handleNextProduct = () => {
    const currentIndex = cart.findIndex(item => item.id === selectedProduct.id);
    const nextIndex = (currentIndex + 1) % cart.length;
    setSelectedProduct(cart[nextIndex]);
  };

  const handlePrevProduct = () => {
    const currentIndex = cart.findIndex(item => item.id === selectedProduct.id);
    const prevIndex = (currentIndex - 1 + cart.length) % cart.length;
    setSelectedProduct(cart[prevIndex]);
  };
  
  const resetcoupons = () => {
    
  }

  useEffect(() => {
    if (couponCode) {
      couponApplyHandler()
    }
  }, [couponCode]);
  
  useEffect(()=>{ 
    resetcoupons()
    setCouponData(couponData)
  },[userData])

  useEffect(() => {
    
    if (location?.state?.items) {
      setItems(location?.state?.items)
      console.log(location?.state?.items);
      
      const items = location?.state?.items
    
      items?.map((data) => {  
        setCart((prevData) => {
          // Check if the item already exists in the cart
          const isItemExists = prevData.some(
            (item) => item.name === data.product.name && item.quantity === data.quantity
          );
      
          // If item doesn't exist, add it; otherwise, return the previous data
          if (!isItemExists) {
            setSummary((prevData) => ({ 
              ...prevData, 
              items: prevData.items + ((data.quantity/1000)*data.product?.regularPrice),
              discount: prevData.discount + ((data.quantity/1000) * (() => {
                const productVal = data.product?.discount?.value || 0;
                const categoryVal = data.product?.category?.discount?.value || 0;
                
                // Convert both to percentage for comparison
                const productPercent = data.product?.discount?.isPercentage ? productVal : (productVal / data.product?.regularPrice * 100);
                const categoryPercent = data.product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / data.product?.regularPrice * 100);
                
                // Use the discount with higher percentage
                if (productPercent > categoryPercent) {
                    return data.product?.discount?.isPercentage ? 
                        (data.product?.regularPrice * productVal / 100) : productVal;
                } else {
                    return data.product?.category?.discount?.isPercentage ? 
                        (data.product?.regularPrice * categoryVal / 100) : categoryVal;
                }
              })())
            }))
            
            return [
              ...prevData,
              {
                id: prevData.length + 1,
                name: data.product.name,
                quantity: data.quantity || "1 unit",
                price: data.product.regularPrice,
                freshness: data.product.freshness,
                cat: data.product.category,
                imgSrc: data.product.pics.one,
                regularPrice: data.product.regularPrice,
                discount: {
                  value: data.product?.discount?.value || 0,
                  isPercentage: data.product?.discount?.isPercentage || false
                },
                category: {
                  discount: {
                    value: data.product?.category?.discount?.value || 0,
                    isPercentage: data.product?.category?.discount?.isPercentage || false
                  }
                }
              },
            ];
          }
          return prevData;
        });
      })
    }
  }, [location?.state?.items])

    useEffect(()=>{
    setGrandTotel((summary.items - summary.discount + (summary.taxes + summary.deliveryFee) - summary.coupon - counDiscount ).toFixed(2))

  },[summary,counDiscount])


  useEffect(()=>{ (async()=>{ if(userData){ await getAdresses(userData?._id) } })() },[userData])

    
  useEffect(()=>{ if(data){
    setaddressData(data) 
    setAddress(data[0])
    } 
  },[data])

  useEffect(()=>{
    if(applyCoupon){
      setCouponData(couponData.filter( data => data.code !== couponCode ))
    }
  },[applyCoupon,couponCode])

  const couponApplyHandler = ()=>{
    if(couponCode.length<=0){
      return showToast('enter coupon code', 'error')
    }
    if(couponCode.length<6){
      return showToast('code should be 6 digit', 'error')
    }
    if(CouponDatas.filter( data => data.code === couponCode ).length>0){
      showToast('coupon applied', 'success')
      console.log(CouponDatas.filter( data => data.code !== couponCode ));
      setApplyCoupon(couponData.filter( data => data.code === couponCode )[0])
    }else{
      showToast('invalid coupon', 'error')
    }
  }

  useEffect(()=>{
    if(applyCoupon){
      // alert(grandTotal-applyCoupon.discountAmount)
      setCouponDiscount((applyCoupon.discountType==='fixed'?applyCoupon.discountAmount:(grandTotal/100)*applyCoupon.discountAmount))
    }
  },[applyCoupon])

  const onQuantityChange = (e, id) => {
    const newQuantity = parseInt(e.target.value);
    setCart((prevData) => {
      const updatedCart = prevData.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity * 1000 };
        }
        return item;
      });
      return updatedCart;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddressPopup(false);
  };

  return (
    <> 
    <div className="md:w-[94%] h-full flex flex-col 2xl:flex-row bg-[#f2f2f2] overflow-scroll">
    {/* from-[#e7ecef] via-[#e6ebee] to-[#c8ccce] */}
      {/* <div className="absolute w-full h-full overflow-scroll"></div> */}

          {/* new one */}
          <div className="min-w-[80%] sm:px-20 px-10 2xl:pb-80 pb-0 sm:pb-40">


          <h1 onClick={()=>console.log(applyCoupon)} className="text-[35px] font-bold my-8">Order Summary</h1>

          {/* info conatianer */}
          <span className="flex gap-20 w-full flex-col lg:flex-row">

          {/* basic informations */}
          <span className="min-w-[40%]">
          <span className="flex flex-col justify-between w-full">
          <p className="text-[28px] font-bold mb-8">Informations</p>
          
          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Date</p>
            <p className="opacity-65">{new Date().toDateString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Time</p>
            <p  className="opacity-65">{new Date().toLocaleTimeString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Items count</p>
            <p  className="opacity-65"p>10</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Delivery methode</p>
            <p  className="opacity-65">Eco ddelivery</p>
          </span>
            </span>

          </span>

          {/* deal informations */}
          <span className="min-w-[50%] flex flex-col md:flex-row pb-20 md:pb-">
            <span>
          <p className="text-[28px] font-bold">Deal info</p>
          <p className="text-[13px] opacity-40 mb-8 max-w-[320px]">May happen slight changes according to your distunse the products</p>
            </span>

          <span className=" inline-flex flex-col justify-end">
          <span className="flex gap-16 text-[13px] items-center justify-between">
            <p className="text-[13px]">Arrive date</p>
            <p  className="opacity-65">{new Date().toDateString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Arrive time</p>
            <p  className="opacity-65">{new Date().toLocaleTimeString()}</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Distens</p>
            <p  className="opacity-65">10</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Duration</p>
            <p  className="opacity-65">3 Hourse</p>
          </span>

          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Cancel until</p>
            <p  className="opacity-65">Shipping</p>
          </span>
          <span className="flex gap-10 text-[13px] items-center justify-between">
            <p className="text-[13px]">Return period</p>
            <p  className="opacity-65">24 hourse</p>
          </span>
            </span>

          </span>
          </span>


          {/* product info container */}
          <span className="flex flex-col 2xl:flex-row gap-8 pb-10">
          {/* product list */}
          <div className="2xl:w-1/2 h-80 mt-8 overflow-scroll bg-gradient-to-b from-[#dcdcdc90] to-[#d9d9d970] p-6 px-5 sm:px-10  rounded-[30px]">
          <p className="text-[28px] font-bold leading-none">Products</p>
          <p className="text-[13px] opacity-45">Products and its additional informations</p>

          <div className="w-full mt-5 ">
          <div className="mt-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mt-2 cursor-pointer hover:bg-[#ffffff90] p-2 rounded-[30px] transition-all" onClick={() => handleProductClick(item)}>
              <div className="flex items-center space-x-2">
                <img src={item.imgSrc} alt={item.name} className="w-16 h-16 mr-8 object-cover" />
                <span className="flex flex-col ml-8">
                <p className="opacity-40">{item.cat.name}</p>
                <span className="text-[13px]">{item.name}</span>
                <span className="flex items-center gap-3">
                <div className={`h-2 w-2 ${item.freshness === 'fresh' ? 'bg-green-500' : 'bg-orange-500'} rounded-full`}></div>
                <p className="opacity-40 inline">{item.freshness}</p>
                </span>
                {/* <span className="text-gray-500 text-[13px]">{item.quantity>=1000?item.quantity/1000:item.quantity} {item.quantity>=1000?'Kg':'g'}</span> */}
                </span>
              </div>
              <span className="flex items-center gap-10 pr-10">
              <select disabled={true} className="max-w-[100px] p-2 border rounded custom-selecter bg-transparent" name="quantity" id="quantity" onChange={(e) => onQuantityChange(e, item.id)}>
                {Array.from({length: item.quantity/1000}, (_, i) => i + 1).map((option, index) => (
                  <option key={index} value={item.quantity>=1000?item.quantity/1000:item.quantity}>{item.quantity>=1000?item.quantity/1000:item.quantity}  {item.quantity>=1000?'Kg':'g'}</option>
                ))}
              </select>
              <span onClick={()=>console.log(item)} className="text-green-600 font-mono text-[22px]">₹{(item.quantity/1000)*item.price}</span>
              <img className="w-8 h-8" src="/trash.svg" alt="" />
              </span>
            </div>
          ))}
        </div>  
          </div>
          </div>

          {/* payment totel info */}
          <div className="2xl:w-1/2 mt-8 pl-10  bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d990] p-5 rounded-[30px]">
          <p className="text-[28px] font-bold leading-none">Payment</p>
          <p className="text-[13px] opacity-45">The payment bill additional informations</p>

          <span className="text-[13px] flex flex-col mt-4 gap-1">
          <div className="flex justify-between ">
            <span>Items</span>
            <span className="font-bold font-mono w-28">₹ {summary.items}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="font-bold font-mono  w-28">-₹ {summary.discount}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="font-bold font-mono  w-28">₹ {summary.taxes}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-bold font-mono  w-28">₹ {summary.deliveryFee}</span>
          </div>
          <div className="flex justify-between">
            
            <span>Coupon</span>
            <span className="font-bold font-mono  w-28">-₹ {counDiscount.toFixed(2)||0}</span>
          </div>
          <div className="flex justify-between mt-4 text-xl font-bold">
            <span>Grand Total</span>
            <span className="text-green-600 font-mono  w-28">₹{grandTotal}</span>
          </div>
          </span>
        
          </div>

            

          </span>

          <span className="flex flex-col gap-16 xl:gap-0 xl:flex-row pb-40">
          {/* coupons */}
          <div className="xl:w-1/2 mt-3">
          <p onClick={()=>console.log(applyCoupon)} className="text-[25px] font-bold leading-none">Coupons</p>
          <p className="text-[13px] opacity-45">Available coupons for you</p>

          { CouponDatas?.length > 0 ?
          <div className="inline-flex gap-5 mt-8 overflow-x-scroll pb-10">
                  {CouponDatas?.map((coupon, index) => (
                    <Coupon setCode={setCode} index={index} coupon={coupon} />
                    
                  ))}

                </div>:
                <>
                  <img className="h-[80%] min-h-[200px] xl:min-h-[auto] filter-[brightness(0)] mx-auto mt-10" src='/ticket-expired.svg' alt="No categories" />
                  <p className=" w-full text-center text-[20px] leading-none font-mediumbg-red-200 flex-1 flex items-center justify-center">No Coupons Found</p>
                  <p className="mx-auto text-center text-[13px] opacity-45 leading-none">No coupons for you for this price range</p>
                </>
              }

          
          </div>
          
          {/* delivery methode */}
          <div className="xl:w-1/2 sm:h-44  mt-3">
          <p className="text-[25px] font-bold leading-none">Delivery method</p>
          <p className="text-[13px] opacity-45  mb-8">Choose according to your preference,<br />Perfect time for you</p>

          
                  <span className="flex flex-col sm:flex-row gap-5">

              {/* first */}
              <div onClick={()=>setDelivery('Fast Delivery')} className="sm:w-1/3 p-5 cursor-pointer hover:scale-[1.04] duration-500 text-center border hover:shadow-[0px_0px_20px_#d5dfff] rounded-[30px] rounded-br-[80px] shadow relative pt-8 bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970]">
                <img
                  src='/flash-1.svg'
                  alt="Fast Delivery"
                  className=" object-cover mx-auto mb-3 rounded w-14 h-14"
                />
                <span>
                  <h4 className="text-[13px]">Fast delivery</h4>
                  <p className="opacity-65">Delivery within minitus,like flash</p>
                </span>
              
                <div className={`absolute left-5 top-5 w-5 h-5 rounded-full border-2 border-[#717fa8] ] p-[3px]`}>
                  <div className={`w-full h-full bg-[#4b5e97] rounded-full ${delivery==='Fast Delivery'?"opacity-100":'opacity-0'}`}></div>
                </div>
              </div>


              {/* second */}
              <div onClick={()=>setDelivery('Normal Delivery')} className="sm:w-1/3 p-5 cursor-pointer hover:scale-[1.04] duration-500 text-center border hover:shadow-[0px_0px_20px_#fcffd1] rounded-[30px] rounded-br-[80px] shadow relative pt-8 bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970]">
                <img
                  src='/group.svg'
                  alt="Fast Delivery"
                  className="object-cover mb-3 mx-auto rounded w-14 h-14"
                />
              <span>
                  <h5 className="text-[13px] mb-1">Normal delivery</h5>
                  <p className="opacity-65">Normal delivery, more duraration for that</p>
                </span>

                <div className="absolute left-5 top-5 w-5 h-5 border-[#6f7430] border-2 p-[3px] rounded-full">
                <div className={`w-full h-full bg-[#4b5e97] rounded-full ${delivery==='Normal Delivery'?"opacity-100":'opacity-0'}`}></div>
                </div>
              </div>


              {/* third */}
              <div onClick={()=>setDelivery('Eco Delivery')} className="sm:w-1/3 px-4 pb-8 sm:pb-0 cursor-pointer hover:scale-[1.04] duration-500 text-center border rounded-[30px] bg-gradient-to-b from-[#dcdcdc70] to-[#d9d9d970] rounded-br-[80px] hover:shadow-[0px_0px_20px_#ceffde] relative pt-8">
                <img
                  src='/sun-fog.svg'
                  alt="Fast Delivery"
                  className="object-cover mx-auto w-14 h-14 rounded"
                />
              <span>
                  <h4 className="text-[13px]">Eco delivery</h4>
                  <p className="opacity-65">For the environment, little time consuming</p>
                </span>
                
                <div className="absolute left-5 top-5 w-5 h-5 border-[#218342] border-2 p-[3px] rounded-full">
                <div className={`w-full h-full bg-[#4b5e97] rounded-full ${delivery==='Eco Delivery'?"opacity-100":'opacity-0'}`}></div>
                </div>
              </div>
                  </span>
          
          
          </div>
          </span>

          </div>

          <div className="2xl:py-10 md:px-40 px-10 2xl:px-0">
            <div className="w-full h-full px-8 md:pt-10 flex flex-col gap-10 pb-80">

            {/* constact */}
            <div className="w-full h-auto pb-12 border-2 pl-12 rounded-[30px] relative rounded-bl-[120px] bg-gradient-to-b from-[#dcdcdc90] to-[#d9d9d970] px-5 py-3"> 
              <p className="text-[20px] font-bold mb-3">Contact info</p>

              <span className="flex gap-10 text-[13px] items-center justify-between">
                <p className="text-[13px]">Name</p>
                <p className="opacity-65">{userData?.username}</p>
              </span>
              <span className="flex gap-10 text-[13px] flex- items-center max-w-full justify-between">
                <p className="text-[13px]">Mail</p>
                <p className="opacity-65 text-wrap block whitespace-normal max-w-[100px] break-words">
                  {userData?.email?.replace('.gmail', '')}
                </p>

              </span>
              <span className="flex gap-10 text-[13px] items-center justify-between">
                <p className="text-[13px]">Phone</p>
                <p className="opacity-65">{adressData && adressData.length > 0 && adressData[0]?.phone}</p>
              </span>

            

            </div>
            
               {/* address */}
              <div className="w-full h-auto pb-12 border-black/15 border-2 rounded-[30px] relative rounded-bl-[120px]  px-5 pl-12 py-3">
              <p className="text-[20px] font-bold mb-3">Shipping address</p>

              <p className="text-[13px] opacity-65">
                {
                  adressData && adressData?.length > 0 &&
                  <h3 className={`font-semibold text-[25px] opacity-55 ${
                  selectedAddress?.locationType === "Work"
                    ? "text-[#ff0000]"
                    : selectedAddress?.locationType === "Home"
                    ? "text-[#1c7721]"
                    : selectedAddress?.locationType === "Person"
                    ? "text-[#0d32e9]"
                    : "text-[#706e1b]"
                }`}>{selectedAddress?.locationType||adressData[0]?.locationType}</h3>
                }

              {selectedAddress
                ? `${selectedAddress.exactAddress},  ${selectedAddress.streetAddress}, ${selectedAddress.state}, ${selectedAddress.pincode}`
                : adressData && adressData.length > 0
                ? `${adressData[0]?.exactAddress || 'N/A'}, ${adressData[0]?.streetAddress || 'N/A'}, ${adressData[0]?.state || 'N/A'}, ${adressData[0]?.pincode || 'N/A'}`
                : 'No address available'}
              </p>

              <button onClick={() => setShowAddressPopup(true)} className='flex justify-start items-center font-bold rounded-full text-white absolute -bottom-6 left-2 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group'>
                <img className='group-hover:-translate-x-full min-w-[70px] p-4 brightness-[100]  duration-500' src="/edit.svg" alt="" />
                {/* <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
                <img className='group-hover:-translate-x-full min-w-[70px] p-5 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
              </button>

            </div>

              {/* coupon */}
            <div className="w-full h-auto pb-12 border-2 pl-12 rounded-[30px] relative rounded-bl-[120px]  bg-gradient-to-b from-[#dcdcdc90] to-[#d9d9d970] px-5 py-3"> 
              {
                applyCoupon ?
                <>
              <p className="text-[20px] font-bold mb-3">Coupon info</p>

              <span className="flex gap-10 text-[13px] items-center justify-between">
                <p className="text-[13px]">Code</p>
                <p className="opacity-65">{applyCoupon?.code}</p>
              </span>
              <span className="flex gap-10 text-[13px] items-center justify-between">
                <p className="text-[13px]">Amount</p>
                <p className="opacity-65">{applyCoupon?.discountAmount}</p>
              </span>
              <span className="flex gap-10 text-[13px] items-center justify-between">
                <p className="text-[13px]">Expiry date</p>
                <p className="opacity-65">{formatDate(applyCoupon?.expiryDate)}</p>
            </span>
                </>:<p className="pt-5 text-[13px] pl-8">No coupon applyed</p>
              }

            {/* {!applyCoupon &&<button onClick={couponApplyHandler} className={`px-6 py-3 bg-[#498f53] text-white rounded-full ${applyCoupon?'opacity-45':'opacity-100'} absolute -bottom-5 right-2 font-bold`}>
                {applyCoupon?.code?'Applied':'Apply'} 
                </button>} */}

            {applyCoupon &&<button onClick={()=> {
                  if(applyCoupon) {
                    // Restore original coupons with filters
                    setCouponData(couponData)
                    setApplyCoupon(false);
                    setCode('');
                    setCouponDiscount(0);
                  }
                }} className="px-6 py-3 absolute -bottom-5 right-2 bg-gray-500 text-gray-100 rounded-full font-bold">
                  Cancel
                </button>}


            </div>

          
            <div className="mt-8 flex justify-end">
            { adressData && adressData.length > 0 ? (
              <span className="relative">
              <HoverKing 
                event={()=>navigate('/user/payment',{ state:{ add:{ totelProducts:summary.items/2,taxes:summary.taxes,deliveryFee:summary.deliveryFee }, order:{ offerPrice:summary.discount/2,address,price:grandTotal,deliveryMethod:delivery,items:itemses,qnt:location?.state?.qnt,coupon:{ code:applyCoupon?.code, amount: counDiscount,usage:(userData?.couponApplyed?.[applyCoupon?.code] || 0) } } } })} 
                styles={'absolute border-0 right-1/2  rounded-full bg-[linear-gradient(to_left,#0bc175,#0f45ff)] font-bold'} 
                Icon={<i className="ri-arrow-right-line text-[30px] rounded-full text-white"></i>}
              >
                Checkout
              </HoverKing>
              </ span>
            ) : (
              <span className="relative">
              <HoverKing 
                event={()=>navigate('/user/profile/address')} 
                // event={()=>navigate('/user/profile/address', { state: { items: location?.state?.items } })} 
                styles={'absolute border-0 right-1/2  rounded-full bg-[linear-gradient(to_left,#0bc175,#0f45ff)] font-bold'} 
                Icon={<i className="ri-arrow-left-line text-[30px] rounded-full text-white"></i>}
              >
                Add address
              </HoverKing>
              </span>
            )}
          </div>

            </div>
          </div>
    </div>

  
    {showPopup && selectedProduct && (
      <ProductDetailsPopup 
        product={selectedProduct}
        onClose={closePopup}
        onNext={handleNextProduct}
        onPrev={handlePrevProduct}
      />
    )}
    {showAddressPopup && (
        <AddressSelectionPopup userData={userData} onClose={() => setShowAddressPopup(false)} onSelect={handleAddressSelect} />
      )}
    </>
  );
}
