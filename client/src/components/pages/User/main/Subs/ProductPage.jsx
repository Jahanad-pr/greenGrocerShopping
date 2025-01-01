import React, { useEffect, useState } from "react";
import star from "../../../../../assets/images/star.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ImagesProvider, ProductImages } from "react-product-image";
import ImageZoomGallery from "../../../../parts/Main/ImageZoomGallery";
import { useGetCAtegoryProductsMutation } from "../../../../../services/User/userApi";
import Product from "../../../../parts/Cards/Product";
import ProductQuantityPopup from "../../../../parts/popups/ProductQuantityPopup";

export default function ProductPage() {
  
  const location = useLocation();
  const [form, setForm] = useState();
  const [popup, showPopup] = useState(false);
  const navigate = useNavigate();
  
  const [
    getCAtegoryProducts,
    { sLoading: proLoading, error: proError, data: proData },
  ] = useGetCAtegoryProductsMutation();

  const [options, setOptions] = useState([ "100g", "250g", "500g", "1kg", "2kg", "5kg", "10kg", "25kg", "50kg", "75kg", "100kg", "custom", ]);
  const [selectedOption, setSelectedOption] = useState(options[0]);

useEffect(()=>{
  if(form?.stock){
    const stock = form?.stock
    if(stock<100)setOptions(prevOptions => prevOptions.filter(option => option !== "100g"))
    if(stock<250)setOptions(prevOptions => prevOptions.filter(option => option !== "250g"))
    if(stock<500)setOptions(prevOptions => prevOptions.filter(option => option !== "500g"))
    if(stock<1000)setOptions(prevOptions => prevOptions.filter(option => option !== "1kg"))
    if(stock<2000)setOptions(prevOptions => prevOptions.filter(option => option !== "2kg"))
    if(stock<5000){setOptions(prevOptions => prevOptions.filter(option => option !== "5kg"))}
    if(stock<10000)setOptions(prevOptions => prevOptions.filter(option => option !== "10kg"))
    if(stock<25000)setOptions(prevOptions => prevOptions.filter(option => option !== "25kg"))
    if(stock<50000)setOptions(prevOptions => prevOptions.filter(option => option !== "50kg"))
    if(stock<75000)setOptions(prevOptions => prevOptions.filter(option => option !== "75kg"))
    if(stock<100000)setOptions(prevOptions => prevOptions.filter(option => option !== "100kg"))
  }
},[form])

useEffect(() => {
  window.scrollTo(0, 0);
}, [form]);




  useEffect(() => {
    if (location?.state) {
      setForm(location?.state);
    }
  }, [location]);

  useEffect(()=>{ 
    if(popup){
      setOptions(prevOptions => prevOptions.filter(option => option !== "custom"))
      setOptions((prev)=>([...prev,"custom"]))
      showPopup(false)
    }else{
      if(options.length===12){

        setSelectedOption(options[3])
      }else{
        setSelectedOption(options[options.length-2])
      }
    }
   },[options])


  useEffect(()=>{ selectedOption==='custom'?showPopup(true):"" },[selectedOption])

  useEffect(() => {
    (async () => {
      await getCAtegoryProducts(form?.category?._id).unwrap();
      // await getCollections(catData?.data[cPosition]._id).unwrap();
    })();
  }, [form]);

  // Handler to switch to the next option
  const switchToNextOption = (action='+') => {
    const currentIndex = options.indexOf(selectedOption);
    let nextIndex = ''
    if(action==='+'){
      nextIndex = (currentIndex + 1) % options.length;
    }else{
      nextIndex = (currentIndex + 1) % options.length;
    }
    setSelectedOption(options[nextIndex]);
  };

  return (
    <>
    { popup &&
      <ProductQuantityPopup stock={form?.stock} options={setOptions} showPopup={showPopup} />
    }
    <div className="w-[96%] h-full relative overflow-hidden overflow-y-scroll">
      <div className="w-full h-full flex pr-36 flex-col">
        <span className="flex min-h-screen">
          {/* product image nav------------------ */}
          <div className="flex-grow-[3] min-w-[30%] h-full bg-[linear-gradient(235deg,#7398bd98_0%,#00000000_60%)] flex items-center justify-center">
            <div className="w-full max-w-md">
              <ImageZoomGallery imageses={form?.pics} />
            </div>
          </div>

          {/* Product details------------ */}
          <div className="flex-grow-[4] h-full pt-1 pl-20">
            <div className="w-full h-full">
              <p className="text-[13px] font-medium my-5 mb-8 flex gap-2">
                <span
                  onClick={() => navigate("/user/home")}
                  className="opacity-45 hover:opacity-70"
                >
                  / Home
                </span>
                <span
                  onClick={() => navigate("/user/Products")}
                  className="opacity-45 hover:opacity-70"
                >
                  / Products
                </span>
                <span
                  onClick={() => navigate("/user/Products")}
                  className="opacity-45 hover:opacity-70"
                >
                  / {form?.category?.name}
                </span>
                <span className="opacity-45 hover:opacity-70">
                  / {form?.name}
                </span>{" "}
              </p>

              {/* category */}
              <p className="text-[20px] font-medium opacity-80">
                {form?.category?.name}
              </p>
              {/* name */}
              <p className="text-[40px] font-bold">{form?.name}</p>

              {/* stars and reviews */}
              <div className="inline-flex gap-5 items-center justify-center">
                <div className="flex">
                  <img className="w-8 h-8" src={star} alt="" />
                  <img className="w-8 h-8" src={star} alt="" />
                  <img className="w-8 h-8" src={star} alt="" />
                  <img className="w-8 h-8" src={star} alt="" />
                  <img className="w-8 h-8 grayscale" src={star} alt="" />
                </div>
                {/* reviews count */}
                <p className=" translate-y-[4px] font-medium opacity-55">
                  4.5 (123 reviews)
                </p>
              </div>
              {/* description */}
              <p className="min-h-16 opacity-45">{form?.description}</p>
              {/* Freshness sattus and time */}
              <p className="text-[28px] text-green-700 font-bold">
                {form?.freshness}
              </p>
              {form?.freshness === "Harvested" && (
                <p className="my-1 font-medium">
                  Time: &nbsp;&nbsp;&nbsp;
                  {new Date(form?.harvestedTime).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
              <p className="opacity-45">
                When the customer confirms their order, the material (wood from
                the tree) will be cut specifically for that order. This ensures
                that each piece is custom-prepared only after the order is
                finalized, minimizing waste and ensuring the wood is fresh and
                tailored to the customer's specifications
              </p>
              {/* Product from */}
              <p className="pt-5 text-[16px] font-medium">From</p>
              <p className={`opacity-45 ${form?.stock ? "mb-0" : "mb-10"}`}>
                {form?.from}
              </p>

              {/* offer banner */}
              {form?.stock ? (
                <div className="pb-4 flex mt-5 max-w-[90%]">
                  <div className="inline-flex items-center gap-10 bg-[#fdedb8] py-3 px-5 rounded-xl">
                    <p className="text-[22px] font-bold text-orange-700">
                      Special offer :
                    </p>
                    <div className="flex gap-3 items-center justify-center">
                      <div className="w-12 h-12 grid place-items-center rounded-xl bg-red-100 border-[2px] border-red-400">
                        {" "}
                        08{" "}
                      </div>
                      <div className="w-12 h-12 grid place-items-center rounded-xl bg-red-100 border-[2px] border-red-400">
                        {" "}
                        08{" "}
                      </div>
                      <div className="w-12 h-12 grid place-items-center rounded-xl bg-red-100 border-[2px] border-red-400">
                        {" "}
                        08{" "}
                      </div>
                      <p>:</p>
                      <div className="w-12 h-12 grid place-items-center rounded-xl bg-red-100 border-[2px] border-red-400">
                        {" "}
                        08{" "}
                      </div>
                    </div>
                    <p className="text-[13px] opacity-45">
                      Remains until <br /> the end of the offer
                    </p>
                    <p className="text-[24px] font-bold text-yellow-600">
                      30% <span className="text-black"> off</span>
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}

              {/* our features */}
              <div className="border-[2px] text-[#9b9a9a] inline-flex flex-col max-w-[70%] rounded-xl">
                <div className="border-b-[2px] text-[#9b9a9a] inline-flex justify-normal items-center pr-8 py-2">
                  <i className="ri-bank-card-2-line text-[30px] mx-5"></i>
                  <p>
                    <span className="font-bold text-center">Payment.</span>{" "}
                    Payment upon receipt of goods, Payment by card in the
                    department, Google Pay, Online card, -5% discount in case of
                    payment
                  </p>
                </div>
                <div className=" inline-flex justify-normal items-center pr-8 py-2">
                  <i className="ri-secure-payment-line text-[30px] mx-5"></i>
                  <p>
                    <span className="font-bold">quality.</span>The Consumer
                    Protection Act does not provide for the return of this
                    product of proper quality.
                  </p>
                </div>
              </div>

              <span className="flex text-blue-400 text-[20px] items-center">
                <p
                  onClick={() =>
                    navigate(`/user/productpage/${form._id}/reviews`, {
                      state: { form },
                    })
                  }
                  className="my-5  font-medium cursor-pointer"
                >
                  {" "}
                  Review the Product{" "}
                </p>
                <i className="ri-arrow-right-s-fill text-[30px]"></i>{" "}
              </span>


              {/* Config of product */}
              <div className=" inline-flex gap-5 opacity-60">
                {/* Bookmarks */}
                <div className="inline-flex gap-3 items-center justify-center">
                  <i className="ri-bookmark-line text-[20px] p-2 py-1 rounded-lg border-[2px] border-gray-600"></i>
                  <p className="text-[13px]">Bookmark</p>
                </div>
                {/* Share */}
                <div className="inline-flex gap-3 items-center justify-center">
                  <i className="ri-share-line text-[20px] p-2 py-1 rounded-lg border-[2px] border-gray-600"></i>
                  <p className="text-[13px]">Bookmark</p>
                </div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Config bar for buy and add to cartt---------- */}
          <div
            className={`absolute ${
              form?.stock ? "w-[80%]" : "w-[auto]"
            }  h-28 bottom-10 left-1/2 translate-x-[-50%] bg-slate-300 shadow-2xl flex items-center gap-8 px-10 rounded-2xl justify-center`}
          >
            {/* products image */}
            {/* <img
              className="w-20 p-2 border-[2px] border-gray-500 rounded-[10px]"
              src={banana}
              alt=""
            /> */}
            {/* title and count of cart */}
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-medium">{form?.name}</p>
              <p className="text-blue-500 translate-y-[-5px]">
                3 More cart items
              </p>
            </div>

            {/* remaining stats */}
            {form?.stock ? (
              <span className="leading-[25px] translate-y-[8px] flex flex-col gap-1">
                <p className="text-[32px] text-[#6C6C6C] font-bold font-serif calistoga-regular">
                  {parseInt(form?.stock / 1000)}&nbsp;Kg
                </p>
                <p className=" opacity-35">or {form?.stock} gram Remaining</p>
              </span>
            ) : (
              <></>
            )}

            {!form?.stock && (
              <div className="flex flex-col gap-1">
                <p className="text-[22px] font-bold text-red-500 opacity-85">
                  out of stock
                </p>
                <p className="text-blue-500 translate-y-[-5px]">
                  View other related products
                </p>
              </div>
            )}

            {/* quantity changer */}
            {form?.stock ? (
              <div className="flex gap-5 items-center">
                <div className="border-[1px] border-black flex items-center justify-center rounded-[15px] opacity-40 cursor-pointer">
                  <i onClick={()=>switchToNextOption('-')} className="ri-subtract-line flex-1 text-center text-[25px] border-r-[1px] border-black p-3 py-[0px] cursor-pointer"></i>
                  <i onClick={switchToNextOption} className="ri-add-line flex-1 text-center text-[28px] p-3 py-[0px]"></i>
                </div>

                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} 
                  className="text-[20px] text-[#6C6C6C] font-medium bg-transparent focus:outline-none cursor-pointer"
                  defaultValue="100kg"
                >
                  {options.map((option, index) => (
                    <option onClick={()=>option==='custom'?showPopup(true):null} key={index} value={option}>
                      {option}
                    </option>
                  ))}

                </select>
              </div>
            ) : (
              ""
            )}

            {/* prices */}
            <div className="flex gap-3 mx-6">
              <s>
                <p className="lemon-regular text-[26px] opacity-45">
                  {form?.regularPrice} ₹
                </p>
              </s>
              <p className="lemon-regular text-[38px] price">
                {form?.salePrice} ₹
              </p>
            </div>

            {/* Buy now btn */}
            {form?.stock ? (
              <span className="flex gap-2">
                <button className="flex px-5 py-2 gap-3 bg-black rounded-[10px] font-bold text-white justify-center items-center">
                  <i className="ri-shopping-bag-line font-light text-[20px]"></i>
                  <p>Buy now</p>
                </button>

                {/* add to cart btn */}
                <button className="flex px-5 py-2 gap-3 bg-green-700 rounded-[10px] font-bold text-white justify-center items-center">
                  <i className="ri-shopping-cart-line font-light text-[20px]"></i>
                  <p>Add to cart</p>
                </button>
              </span>
            ) : (
              ""
            )}
          </div>
        </span>

        {/* fruit collection */}
        <h1
          className={`text-[30px] $'ml-40':''} font-semibold mt-20 ml-20 ${
            proData?.data?.length > 1 ? "block" : "hidden"
          }`}
        >
          Related products
        </h1>
        <div
          className={`w-full min-h-[400px] flex my-5 mt-8 gap-5 bg-[linear-gradient(100deg,#e5e7eb_40%,white_70%)] py-10 pl-20 ${
            proData?.data?.length > 1 ? "block" : "hidden"} overflow-x-scroll`}
        >
          {proData?.data?.map((data, index) => {
            if (data.isListed) {
              if (data._id !== form?._id) {
                return <Product type={"product"} data={data} pos={index} />;
              }
            }
          })}
        </div>

        {/* reviews------------------------------------- */}
        <div className="flex-grow-[4] max-w-[35%] h-full pt-12 px-16 bg-gray-">
          {/* Head */}
          <h1 className="text-[30px] font-bold">Reviews</h1>

          {/* reviews list */}
          <div className="w-full mt-8 h-full flex gap-20">
            <div className="w-full flex flex-col gap-5">
              <div className="flex gap-4">
                {/* <img className="w-20 h-20" src={picr} alt="" /> */}
                <p>
                  The banana I tried was perfectly ripe with a bright yellow
                  peel and no blemishes. The texture was smooth and creamy,
                  making it very easy to eat. It was sweet, but not too sugary,
                  with just the right hint of freshness. I also liked how easy
                  it was to peel and take on the go as a healthy snack. Overall,
                  bananas are a convenient and nutritious option, rich in
                  potassium, making them a great choice for a quick energy boost
                </p>
              </div>
              {/* stars and reviews */}
              <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div>

              {/* photos of review */}
              <div className="w-full h-16 flex gap-5 ml-24">
                <div className="h-2full w-28 bg-orange-100 rounded-2xl p-1">
                  <img className="h-full mx-auto" src={banana} alt="" />
                </div>
                <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center"></div>
              </div>
            </div>
            {/* ------------------------------------------------ */}
            <div className="h-full w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <img
                  className="w-16 h-16 rounded-full"
                  src={
                    "https://cdn.vectorstock.com/i/preview-1x/77/17/chef-avatar-icon-vector-32077717.webp"
                  }
                  alt=""
                />
                <p>
                  This banana was just the right level of ripeness—soft, sweet,
                  and full of flavor. It was perfect for mashing with a little
                  ghee, creating a delicious and wholesome treat. The sweetness
                  balanced well with the rich flavor of ghee, making it an ideal
                  combination. Definitely a must-try for a quick and tasty
                  snack!
                </p>
              </div>
              {/* stars and reviews */}
              <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div>

              {/* photos of review */}
              <div className="w-full h-16 flex gap-5 ml-24">
                <div className="h-2full w-28 bg-orange-100 rounded-2xl overflow-hidden">
                  <img
                    className="h-full w-full mx-auto"
                    src={
                      "https://www.foodandwine.com/thmb/vYzNap2vl-aT9uDO5WYcWj_l-Gw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/amazonfreebananas-em-86304874-2000-5a276309cf1944349fb55818c98c7b1b.jpg"
                    }
                    alt=""
                  />
                </div>
                <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center"></div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            <div className="h-full w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <img
                  className="w-16 h-16 rounded-full"
                  src={
                    "https://img.freepik.com/premium-vector/chef-pan-with-spoon-pan-pasta_1087929-12778.jpg?w=826"
                  }
                  alt=""
                />
                <p>
                  This avocado was perfectly creamy and ripe, with a smooth
                  texture that practically melted in my mouth. When mixed with a
                  touch of lime juice and a sprinkle of salt, it transformed
                  into a delightfully refreshing and rich spread. The tangy lime
                  enhanced the avocado's natural flavors, making it a perfect
                  topping for toast or a quick dip for veggies. A super easy and
                  nutritious snack that’s absolutely worth trying!
                </p>
              </div>
              {/* stars and reviews */}
              <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div>

              {/* photos of review */}
              <div className="w-full h-16 flex gap-5 ml-24">
                <div className="h-2full w-28 bg-orange-100 rounded-2xl overflow-hidden">
                  <img
                    className="h-full w-full mx-auto"
                    src={
                      "https://crop-protection.basf.ph/sites/basf.co.ph/files/2023-07/banana.jpg"
                    }
                    alt=""
                  />
                </div>
                <div className="h-2full w-28 bg-orange-100 rounded-2xl overflow-hidden">
                  <img
                    className="h-full w-full mx-auto"
                    src={
                      "https://www.pureearete.com/wp-content/uploads/2020/06/banana_m.jpg"
                    }
                    alt=""
                  />
                </div>
                {/* <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center"> </div> */}
              </div>
            </div>

            {/* ------------------------------------------------ */}
            <div className="h-full w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <img
                  className="w-16 h-16 rounded-full"
                  src={
                    "https://img.freepik.com/free-vector/detailed-chef-logo-template_23-2148987940.jpg?t=st=1731312044~exp=1731315644~hmac=85d92ea46e5fd9b28d628847c2c2af1a779fcf5d8fd549cd394f2f4a411da31b&w=826"
                  }
                  alt=""
                />
                <p>
                  This avocado was perfectly creamy and ripe, with a smooth
                  texture that practically melted in my mouth. When mixed with a
                  touch of lime juice and a sprinkle of salt, it transformed
                  into a delightfully refreshing and rich spread. The tangy lime
                  enhanced the avocado's natural flavors, making it a perfect
                  topping for toast or a quick dip for veggies. A super easy and
                  nutritious snack that’s absolutely worth trying!
                </p>
              </div>
              {/* stars and reviews */}
              <div className="inline-flex gap-5 ml-24">
                <div className="inline-flex">
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5" src={star} alt="" />
                  <img className="w-5 h-5 grayscale" src={star} alt="" />span
                  <img className="w-5 h-5 grayscale" src={star} alt="" />
                </div>
              </div>

              {/* photos of review */}
              <div className="w-full h-16 flex gap-5 ml-24">
                <div className="h-2full w-28 bg-orange-100 rounded-2xl overflow-hidden">
                  <img
                    className="h-full w-full mx-auto"
                    src={
                      "https://www.fruits365.shop/cdn/shop/products/elachibanana_470x.jpg?v=1659849758"
                    }
                    alt=""
                  />
                </div>
                <div className="h-full w-28 border-[2px] border-gray-300 rounded-2xl grid place-items-center"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
