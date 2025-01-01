import React, { useEffect, useState } from "react";
import greenGrocerLogo from "../../../../assets/Logos/main.png";
import siginImg from "../../../../assets/images/leftPlate.png";
import fru from "../../../../assets/images/fru.png";
import veg from "../../../../assets/images/veg.png";
import homi from "../../../../assets/images/homi.png";
import farm from "../../../../assets/images/farmer.jpeg";
import List from "../../../parts/Main/List";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useGetCAtegoryCollctiionsMutation,
  useGetCAtegoryProductsMutation,
} from "../../../../services/User/userApi";
import Product from "../../../parts/Cards/Product";
import CollectionCard from "../../../parts/Cards/Collection";

export default function Home({ userData }) {
  const [
    getCAtegoryProducts,
    { sLoading: proLoading, error: proError, data: proData },
  ] = useGetCAtegoryProductsMutation();
  const [
    getCAtegoryCollctiions,
    { sLoading: colllLooading, error: collEroor, data: CollData },
  ] = useGetCAtegoryCollctiionsMutation();

  const [fruits, setFruits] = useState(null);
  const [fruitColl, setFRuitColl] = useState(null);

  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    (async () => {
      // alert()
      const fru = await getCAtegoryCollctiions("6768d170c569781368212324");
      console.log(fru?.data?.data)
      
      setFRuitColl(fru?.data?.data);
      await getCAtegoryCollctiions("67652a45d4a625f5b2f074fc");

      const log = await getCAtegoryProducts("6768d170c569781368212324");
      setFruits(log?.data?.data);
      // await getCAtegoryProducts("6768d170c569781368212324");
      await getCAtegoryProducts("67652a45d4a625f5b2f074fc");
    })();
  }, []);

  // useEffect(()=>{
  //   if(proData&&CollData){
  //     let i = 0

  //     while (i<7&&CollData?.data?.length>i&&proData?.data?.length>i) {
  //       let products = proData?.data[i]
  //       let collections = CollData?.data[i]
  //       setVegData((prevData)=>[...prevData,products])
  //       setVegData((prevData)=>[...prevData,collections])
  //       i++
  //     }
  //   }
  // },[proData,CollData])

  const text = "Fresh Veggies Delivered to You".split(" ");

  useEffect(() => {
    if (location?.state?.userData) {
      console.log(location?.state?.userData);
    }
  }, [location]);

  return (
    <div className="flex-1 max-w-[100%] md:max-w-[94%]">
      {/* */}
      <div className="w-full h-full overflow-x-hidden  bg-[linear-gradient(to_bottom,#5f606150,#f5fafd_70%)] md:bg-[linear-gradient(to_bottom,#f5fafd,#ebf0f3,#d2d8da)]">
        {/* welcome message */}
        <div className="w-full h-full flex flex-col md:flex-row">
          <div className="flex-1 justify-center flex flex-col pl-10 xl:pl-20 gap-5 py-8  md:py-0 order-2 md:order-1 -translate-y-10 md:translate-y-0 ">
            <img className="w-[40%] md:w-[40%] " src={greenGrocerLogo} alt="" />
            <p className="text-[16px] md:text-[20px] text-[#555721] pr-40 md:pr-0 opacity-50 font-['lufga']">
              Eat Fresh, Stay Healthy
            </p>
            <h1 className="text-[40px] xl:text-[60px] pr-20 md:mr-32  md:10  lg:text-[50px] duration-500 font-bold leading-none text-[#52AA57] font-['lufga']">
              Fresh Fruits &<br />
              <span className="text-[#3C6E51]">
                {text.map((el, i) => (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.75,
                      delay: i / 10,
                    }}
                    key={i}
                  >
                    {el}{" "}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className=" md:pr-0 opacity-45 pr-10 sm:pr-40 2xl:pr-60 xl:text-[13px] 2xl:text[18px] text-[13px]">
              Enjoy fresh, healthy fruits and vegetables delivered straight to
              your door. Our selection is packed with nutrients to help you live
              healthier while making it easy to eat fresh every day. Start your
              wellness journey with the convenience of farm-to-table produce.
            </p>
            <div className="h-[2px] w-full mt-2  sm:mt-12 md:w-[70%] bg-[#e3dbc2] md:mr-60" />
            {!userData && location?.state?.message && (
              <div className="mb-4 px-4 md:px-10 md:mr-60 rounded-3xl mt-8 border-[2px] border-gray-300 py-3">
                <p className="text-[13px] text-red-500 font-medium">
                  {" "}
                  {location.state.message}{" "}
                </p>
              </div>
            )}
            <span className="flex gap-5 md:flex-col xl:flex-row">

              <button
                onClick={() =>
                  !userData
                    ? navigator("/user/signup")
                    : navigator("/user/Products")
                }
                className="bg-[#3a8049] self-start px-8 py-3  flex gap-5 rounded-full text-white items-center shadow-2xl"
              >
                {userData && (
                  <img src="/bag-2-1.svg" className="ri-shopping-cart-line brightness-[100] h-[32px]"></img>
                )}
                {!userData && <img src="/user-add.svg" className="h-[32px] brightness-[100]" />}
                <p className="font-medium">{userData ? "Shop" : "sign now"}</p>
              </button>
              {/* {!userData?.location?.one &&
                <button onClick={() => navigator("/user/map")} className="bg-[#6b8274]  hidden md:flex self-start px-8 py-3 gap-5 rounded-full text-white items-center shadow-2xl" >
                  <i className="ri-focus-3-line text-[22px]"></i>
                  <p className="font-medium hidden xl:block">Add your current location</p>
                </button>
              } */}
            </span>
          </div>
          <div className="flex-1 order-1 rounded-t-full md:rounded-l-full relative min-w-[100%] md:min-w-[50%] h-[300px] md:h-auto mt-8 md:mt-0">
            <img
              className="h-full w-full object-cover drop-shadow-[0px_-15px_30px_#00000089] md:drop-shadow-[110px_10px_30px_#000000]  object-bottom bg-blend-overlay md:object-[-220px] md:translate-y-0 md:rotate-0 rotate-[95deg] sm:translate-x-20 md:translate-x-0 sm:-translate-y-[150%] -translate-y-[100%] md:scale-100 scale-[240%]"
              src={homi}
              alt=""
            />
          </div>
        </div>

        {/* Banners */}
        {/* <div className="w-full h-40 md:h-60 bg-gray-700"></div> */}
        {/* fruit collection */}
        { fruits?.length>0 && <h1
          onClick={() => console.log(fruits)}
          className={`$'ml-40':''} font-semibold mt-20 md:pl-20 pl-10 md:text-[35px] text-[30px] font-['lufga']`}
        >
          Fruits
        </h1>}
        <div className="w-full px-10 h-auto flex my-5 mt-8 gap-5 items-center justify- mb-10 relative flex-wrap">
        
          {true && (
            <div onClick={() => navigator(`/user/Products`, {
              state: {
                products: CollData?.data,
                action: "collections",
                title: `Vegetables`
              }
            })}
              className="px-8 items-center justify-center mr-10 group flex duration-500 absolute font-medium right-0 top-[-65px] py-2 bg-[linear-gradient(to_left,#7e9d8a,#14532d)] hover:scale-125 text-white tex-[20px] gap-2 rounded-[20px] rounded-bl-[40px]">
              <p className="duration-500">Shop Now</p>
              <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
            </div>
          )}


          {fruits?.map((data, index) => {
            if (data?.pics && fruitColl[index]) {
              return (  fruitColl[index].isListed &&
                <>
                  <Product
                    key={index}
                    type={"product"}
                    data={data}
                    pos={index}
                  />
                  <CollectionCard
                    key={index}
                    type={"collection"}
                    data={fruitColl[index]}
                    pos={index}
                  />
                  
                </>
              );
            } else if (data?.pics) {
              return (
                <Product key={index} type={"product"} data={data} pos={index} />
              );
            } else if (fruitColl[index]) {
              return (  fruitColl[index].isListed &&
                <CollectionCard
                  key={index}
                  type={"collection"}
                  data={fruitColl[index]}
                  pos={index}
                />
              );
            }
          })}
        </div>
        {/* Message of fruits with statistics */}
        <div className="w-full flex flex-col xl:flex-row px-4 2xl:px-20 my-10 md:my-20 py-5 md:py-10">
          <div className="w-[50%] md:w-[40%]  xl:hidden grid place-items-center">
            <img className="w-full md:w-auto " src={fru} alt="" />
          </div>
          {/* Importance */}
          <div className="gap-2 flex flex-col px-4 md:px-20 mt-8 md:mt-0">
            <img className="w-[25%] hidden xl:block" src={fru} alt="" />
            <p className="text-[16px] md:text-[20px] opacity-45">
              Why fruits are healthy for us ?
            </p>
            <h1 className="text-[30px] md:text-[30px] font-bold leading-tight">
              The Power of Fruits:{" "}
              <span className="text-[30px] md:text-[30px] font-bold text-[#52AA57]">
                <br />
                Nature’s Gift to Your Health
              </span>
            </h1>
            <p className="text-[16px] md:text-[20px] pr-4 2xl:pr-64 opacity-45">
              Fruits are a powerhouse of essential vitamins, minerals, and
              antioxidants that contribute to a healthier and stronger body.
              They help in boosting your immune system, improving digestion, and
              reducing the risk of chronic diseases like heart disease and
              diabetes
            </p>
          </div>
          {/* statisticts */}
          <div className="grid w-full xl:w-20 place-items-center grid-cols-2 xl:min-w-[600px] text-center py-20 xl:py-0 mt-8 md:mt-0">
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#52AA57]">30%</p>
              <p className="leading-none opacity-45">
                reduce the <br /> risk of heart
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#52AA57]">25%</p>
              <p className="leading-none opacity-45">
                decrease the <br /> risk of stroke
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#52AA57]">70%</p>
              <p className="leading-none opacity-45">
                people report <br /> higher energy
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#52AA57]">35%</p>
              <p className="leading-none opacity-45">
                improve gut <br /> health
              </p>
            </span>
          </div>
        </div>

        {/* fruit collection */}
        {CollData && (
          <>
            <h1
              onClick={() => console.log(CollData?.data)}
              className={`$'ml-40':''} font-semibold mt-20 md:pl-20 pl-10 text-[30px] md:text-[35px] font-['lufga']`}
            >
              Vegetables
            </h1>
            <div className="w-full h-auto  flex my-5 mt-8 gap-5 items-center justify px-10 mb-10 relative flex-wrap">
            {  true&& (
                        <div onClick={() => navigator(`/user/Products`, {
                          state: {
                            products: CollData?.data,
                            action: "collections",
                            title: `Vegetables`
                          }
                        })}
                        className="px-8 items-center justify-center mr-10 group flex duration-500 absolute font-medium right-0 top-[-65px] py-2 bg-[linear-gradient(to_left,#7e9d8a,#14532d)] hover:scale-125 text-white tex-[20px] gap-2 rounded-[20px] rounded-bl-[40px]">
                          <p className="duration-500">Shop Now</p>
                          <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
                        </div>
                      )}
              
              {proData?.data?.map((data, index) => {
                if (proData?.data && CollData?.data[index]) {
                  return (
                    <>
                      <Product
                        key={index}
                        type={"product"}
                        data={data}
                        pos={index}
                      />
                      <CollectionCard
                        key={index}
                        type={"collection"}
                        data={CollData?.data[index]}
                        pos={index}
                      />
                    </>
                  );
                } else if (data?.pics) {
                  return (
                    <Product
                      key={index}
                      type={"product"}
                      data={data}
                      pos={index}
                    />
                  );
                } else if (CollData?.data[index]) {
                  return (
                    <CollectionCard
                      key={index}
                      type={"collection"}
                      data={CollData?.data[index]}
                      pos={index}
                    />
                  )
                }
              })}
            </div>
          </>
        )}

        {/* Message of veg with statistics */}
        <div className="w-full flex flex-col xl:flex-row px-4 overflow-hidden 2xl:px-20 my-10 md:my-28 py-5 md:py-10">
          <div className="w-full md:w-[45%] xl:hidden grid  order-1 md:order-2 md:ml-16">
            <img className="w-[50%] md:w-[60%] ml-10 xl:hidden grid" src={veg} alt="" />
          </div>
          {/* Importance */}
          <div className="gap-2 flex flex-col px-4 order-2 md:order-3 mt-8 md:mt-0">
          <img className="w-[25%] hidden xl:block ml-16" src={veg} alt="" />

            <p className="text-[16px] md:text-[20px] px-10 md:px-20 opacity-45">
              Why Vegetables are healthy for us ?
            </p>
            <h1 className="text-[30px] md:text-[30px] px-10 md:px-20 font-bold leading-tight">
              The Power of Vegetables:{" "}
              <span className="text-[30px] md:text-[30px] font-bold text-[#3C6E51]">
                <br />A Key to Lasting Health
              </span>
            </h1>
            <p className="text-[16px] md:text-[20px] px-10 md:px-20 2xl:pr-64 opacity-45">
              Vegetables are packed with essential nutrients that support
              overall health, including vitamins, minerals, and fiber. Whether
              eaten raw, cooked, or blended into meals, vegetables are crucial
              for maintaining a balanced and healthy diet
            </p>
          </div>
          {/* statisticts */}
          <div className="grid w-full xl:w-20 place-items-center grid-cols-2 xl:min-w-[600px] text-center py-20 xl:py-0 mt-8 md:mt-0">
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#3C6E51]">30%</p>
              <p className="leading-none opacity-45">
                reduce the <br /> risk of heart
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#3C6E51]">25%</p>
              <p className="leading-none opacity-45">
                reduces the <br /> likelihood of stroke
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#3C6E51]">80%</p>
              <p className="leading-none opacity-45">
                spinach <br /> can provide
              </p>
            </span>
            <span className=" place-items-center py-2">
              <p className="text-[40px] font-bold text-[#3C6E51]">35%</p>
              <p className="leading-none opacity-45">
                enhance <br /> digestive health
              </p>
            </span>
          </div>
        </div>

          {/* awairness of farmerse */}
          <div className="w-ful xl:mt-0 mt-40 relative flex flex-col">
            <img className="w-full mix-blend-multiply object-cover bg-red-500 order-2" src={farm} alt="" />
            <div className="xl:w-[50%] w-full static xl:absolute xl:left-[40%] top-20 xl:-top-[20%] 2xl:-top-[0%] order-1">
              <h1 className="mb-8 text-[28px] md:text-[50px] px-16 xl:px-0 xl:leading-none leading-tight">Empowering Local Farmers for a Sustainable Future</h1>
              <p className="opacity-65 text-[13px] px-16 xl:px-0">We believe in supporting our local farmers by sourcing fresh vegetables and fruits directly from their fields. This initiative not only ensures the quality of produce but also strengthens the community's economy. By connecting consumers with farmers, we promote sustainable practices that benefit both parties. Our commitment to transparency and fairness helps farmers thrive while providing you with the freshest ingredients. Join us in making a positive impact on the agricultural landscape and enjoy the taste of locally grown produce</p>
            </div>
            <div className="md:hidden block min-h-36 w-full bg-gradient-to-r from-[#757753] via-[#a9a778] to-[#8b8e5e] order-3"></div>
          </div>


      </div>
    </div>
  );
}
