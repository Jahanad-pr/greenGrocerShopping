import React, { useEffect, useState } from "react";
import List from "../../../parts/Main/List";
import { useGetCategoriesMutation, useGetCAtegoryCollctiionsMutation, useGetCAtegoryProductsMutation } from "../../../../services/User/userApi";
import Product from "../../../parts/Cards/Product";
import { useNavigate } from "react-router-dom";
import CollectionCard from "../../../parts/Cards/Collection";
import DeletePopup from '../../../parts/popups/DeletePopup';
import HoverKing from "../../../parts/buttons/HoverKing";

const LoadingAnimation = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-28 h-28">
        <div className="absolute w-full h-full border-8 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-8 border-green-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-4 h-4 bg-green-600 rounded-full animate-bounce" 
               style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>
      <p className="text-xl font-medium text-gray-600">Loading products...</p>
    </div>
  </div>
);

export default function Products({ userData }) {
  const [cPosition, setPosition] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const navigator = useNavigate();

  const [getCategories, { isLoading: catLoading, data: catData }] = useGetCategoriesMutation();
  const [getCAtegoryCollctiions, { data: CollData }] = useGetCAtegoryCollctiionsMutation();
  const [getCAtegoryProducts, { data: proData }] = useGetCAtegoryProductsMutation();
  const [productsData, setProductData] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (proData) {
      setFadeOut(false);
      setProductData(proData);
    }
  }, [proData]);

  const handleCategoryChange = (index) => {
    if (index === cPosition) return;
    setFadeOut(true);
    setTimeout(() => setPosition(index), 300);
  };

  useEffect(() => {
    if (catData?.data) {
      getCAtegoryProducts(catData?.data[cPosition]._id);
      getCAtegoryCollctiions(catData?.data[cPosition]._id);
    }
  }, [catData, cPosition]);

  const EmptyState = () => (
    <div className="w-full flex items-center justify-center flex-col text-center gap-5 relative">
      <img className="h-[200px] w-[] filter-[brightness(0)]" src='/bag-cross-1.svg' alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">Sorry no products!</h1>
        <p className="opacity-45 text-[13px]">
          We are looking for some changes in app or <br /> we could not find any products,<br />
          check your internet connection or refresh the page
        </p>
      </div>
    </div>
  );

  if (catLoading) return <LoadingAnimation />;

  return (
    <div className="md:w-[96%] w-full h-full bg-[#f2f2f2]">
      <div className="w-full h-full backdrop-blur-3xl xl:pl-40 sm:px-20 px-10">
        <div className={`w-full h-screen overflow-y-scroll flex flex-col ${!catData?.data?.length > 0 ? 'justify-center' : 'justify-start'} overflow-scroll`}>
          {catData?.data?.length > 0 ? (
            <>
              <h1 className="text-[35px] font-bold mt-14">Shop</h1>
              <div className="flex text-[20px] items-center py-3 my-3 font-[500] relative">
                {catData?.data?.map((data, index) => (
                  data.isListed && (
                    <p key={index} 
                      onClick={() => handleCategoryChange(index)}
                      style={{ opacity: cPosition === index ? "100%" : "40%" }}
                      className="w-40 transition-opacity capitalize duration-300 m-0 leading-none cursor-pointer">
                      {data.name}
                    </p>
                  )
                ))}
                <div style={{ left: `${160 * cPosition}px` }} 
                    className="w-16 h-1 duration-500 bg-[#44764850] absolute bottom-0" />
              </div>

              <div className={`transition-all duration-300 ${fadeOut ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"}`}>
                {CollData?.data?.length > 0 && (
                  <>
                    <h1 className="text-[30px] font-semibold mt-20">Collections</h1>
                    <div className="w-full h-auto flex my-5 mt-12 gap-5 relative flex-wrap">
                      {CollData?.data?.length > 12 && (
                        <div onClick={() => navigator(`/user/collection/${catData?.data[cPosition].name}/products`, {
                          state: {
                            products: CollData?.data,
                            action: "collections",
                            title: `Collections of ${catData?.data[cPosition].name}`
                          }
                        })}
                        className="px-8 items-center justify-center group flex duration-500 absolute font-medium right-0 top-[-65px] py-2 bg-[linear-gradient(to_left,#7e9d8a,#14532d)] hover:scale-125 text-white tex-[20px] gap-2 rounded-[20px] rounded-bl-[40px]">
                          <p className="duration-500">VIEW ALL</p>
                          <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
                        </div>
                      )}
                      {CollData?.data?.map((data, index) => (
                        index < 12 &&
                        data.isListed && <CollectionCard key={index} type="collection" data={data} pos={index} />
                      ))}
                    </div>
                  </>
                )}

                {productsData?.data?.length > 0 && (
                  <>
                    <h1 className="text-[30px] font-semibold mt-20">Products</h1>
                    <div className="w-full h-auto flex my-5 mt-8 gap-5 mb-80 relative flex-wrap">
                      {productsData?.data?.length > 12 && (
                        <div onClick={() => navigator(`/user/collection/${catData?.data[cPosition].name}/products`, {
                          state: {
                            products: productsData?.data,
                            action: "products",
                            title: `${catData?.data[cPosition].name}`
                          }
                        })}
                        className="px-8 items-center justify-center group flex duration-500 absolute font-medium right-0 top-[-65px] py-2 bg-[linear-gradient(to_left,#7e9d8a,#14532d)] hover:scale-125 text-white tex-[20px] gap-2 rounded-[20px] rounded-bl-[40px]">
                          <p className="duration-500">VIEW ALL</p>
                          <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
                        </div>
                      )}
                      {productsData?.data?.map((data, index) => (
                        index < 12 &&
                        <Product userData={userData} key={index} type="product" data={data} pos={index} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : <EmptyState />}
        </div>
      </div>
    </div>
  );
}