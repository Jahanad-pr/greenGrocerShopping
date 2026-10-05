import React, { useEffect, useState } from "react";
import List from "../../../parts/Main/List";
import { useGetCategoriesMutation, useGetCAtegoryCollctiionsMutation, useGetCAtegoryProductsMutation } from "../../../../services/User/userApi";
import Product from "../../../parts/Cards/Product";
import { useNavigate } from "react-router-dom";
import CollectionCard from "../../../parts/Cards/Collection";
import DeletePopup from '../../../parts/popups/DeletePopup';
import HoverKing from "../../../parts/buttons/HoverKing";

const LoadingAnimation = () => (
  <div className="w-full h-[100dvh] flex items-center justify-center px-4">
    <div className="flex flex-col items-center gap-5 sm:gap-6">
      <div className="relative w-20 h-20 sm:w-28 sm:h-28">
        <div className="absolute w-full h-full border-[6px] sm:border-8 border-gray-200 rounded-full"></div>
        <div className="absolute w-full h-full border-[6px] sm:border-8 border-green-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>
      <p className="text-lg sm:text-xl font-medium text-gray-600 text-center">Loading products...</p>
    </div>
  </div>
);

// Shared "VIEW ALL" button classes (responsive size + position, same look)
const viewAllClass =
  "px-4 sm:px-8 items-center justify-center group flex duration-500 absolute font-medium right-0 top-[-50px] sm:top-[-65px] py-1.5 sm:py-2 text-sm sm:text-base origin-right bg-[linear-gradient(to_left,#7e9d8a,#14532d)] hover:scale-110 sm:hover:scale-125 text-white gap-2 rounded-[16px] sm:rounded-[20px] rounded-bl-[28px] sm:rounded-bl-[40px] z-10";

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

  const handleCategoryChange = (index, e) => {
    if (index === cPosition) return;
    setFadeOut(true);
    // keep the tapped tab visible in the scrollable tab bar on small screens
    e?.currentTarget?.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "nearest" });
    setTimeout(() => setPosition(index), 300);
  };

  useEffect(() => {
    if (catData?.data) {
      getCAtegoryProducts(catData?.data[cPosition]._id);
      getCAtegoryCollctiions(catData?.data[cPosition]._id);
    }
  }, [catData, cPosition]);

  const EmptyState = () => (
    <div className="w-full flex items-center justify-center flex-col text-center gap-4 sm:gap-5 relative px-2">
      <img className="h-32 sm:h-[200px] filter-[brightness(0)]" src='/bag-cross-1.svg' alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] sm:text-[30px] font-bold">Sorry no products!</h1>
        <p className="opacity-45 text-[12px] sm:text-[13px]">
          We are looking for some changes in app or <br className="hidden sm:block" /> we could not find any products,<br className="hidden sm:block" />{" "}
          check your internet connection or refresh the page
        </p>
      </div>
    </div>
  );

  if (catLoading) return <LoadingAnimation />;

  return (
    <div
      className="md:w-[96%] w-full h-full bg-[#f2f2f2]">
      <div className="w-full h-full backdrop-blur-3xl px-4 sm:px-8 md:px-12 lg:px-16 xl:pl-40 xl:pr-20">
        <div className={`w-full h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col ${!catData?.data?.length > 0 ? 'justify-center' : 'justify-start'}`}>
          {catData?.data?.length > 0 ? (
            <>
              <h1
                onClick={() => console.log(CollData?.data)}
                className="text-[28px] sm:text-[35px] font-bold mt-8 sm:mt-14">Shop</h1>

              {/* Category tabs: scrolls sideways on small screens, indicator tracks tab width */}
              <div
                className="flex text-[16px] sm:text-[20px] items-center py-3 my-2 sm:my-3 font-[500] relative overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [--tab-w:7rem] sm:[--tab-w:10rem]">
                {catData?.data?.map((data, index) => (
                  data.isListed && (
                    <p key={index}
                      onClick={(e) => handleCategoryChange(index, e)}
                      style={{ opacity: cPosition === index ? "100%" : "40%" }}
                      className="w-28 sm:w-40 shrink-0 truncate transition-opacity capitalize duration-300 m-0 leading-none cursor-pointer">
                      {data.name}
                    </p>
                  )
                ))}
                <div style={{ left: `calc(var(--tab-w) * ${cPosition})` }}
                  className="w-10 sm:w-16 h-1 duration-500 bg-[#44764850] absolute bottom-0" />
              </div>

              <div className={`transition-all duration-300 ${fadeOut ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"}`}>
                {CollData?.data?.length > 0 && (
                  <>
                    <h1 className="text-[22px] sm:text-[30px] font-semibold mt-6 sm:mt-8">Collections</h1>
                    <div className="w-full h-auto flex my-5 mt-12 gap-0 relative flex-wrap justify-center md:justify-start items-center">
                      {CollData?.data?.length > 12 && (
                        <div onClick={() => navigator(`/user/collection/${catData?.data[cPosition].name}/products`, {
                          state: {
                            products: CollData?.data,
                            action: "collections",
                            title: `Collections of ${catData?.data[cPosition].name}`
                          }
                        })}
                          className={viewAllClass}>
                          <p className="duration-500">VIEW ALL</p>
                          <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[20px] sm:text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
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
                    <h1 className="text-[22px] sm:text-[30px] font-semibold mt-12 sm:mt-20">Products</h1>
                    <div className="w-full h-auto flex my-5 mt-8 gap-3 sm:gap-5 mb-40 sm:mb-80 relative flex-wrap justify-center sm:justify-start">
                      {productsData?.data?.length > 12 && (
                        <div onClick={() => navigator(`/user/collection/${catData?.data[cPosition].name}/products`, {
                          state: {
                            products: productsData?.data,
                            action: "products",
                            title: `${catData?.data[cPosition].name}`
                          }
                        })}
                          className={viewAllClass}>
                          <p className="duration-500">VIEW ALL</p>
                          <i className="ri-arrow-right-line rounded-full overflow-hidden -translate-x-5 opacity-0 text-[20px] sm:text-[25px] group-hover:translate-x-0 group-hover:opacity-100 duration-500"></i>
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