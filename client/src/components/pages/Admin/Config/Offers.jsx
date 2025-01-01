import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DeletePopup from "../../../parts/popups/DeletePopup";
import Recents from "../../../parts/Main/Recents";
import { showToast } from "../../../parts/Toast/Tostify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import "react-toastify/dist/ReactToastify.css";
import { useCancelOrderMutation, useGetAllDiscountsMutation } from "../../../../services/Admin/adminApi";
import {
  useGetOdersMutation,
  useUpdateOrderStatusMutation,
} from "../../../../services/User/userApi";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const Offers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // API mutations
  const [getAllDiscounts, { data: discountDatas }] = useGetAllDiscountsMutation();


  // Local state
  const [popup, showPopup] = useState(false);
  const [discountData, setDiscountData] = useState(null);
  const [offersData, setOffersData] = useState([
    {
      id: '01',
      productName: 'Fresh Watermelon',
      category: 'Fruit',
      offerType: 'Buy 1 Get 1',
      mainQuantity: '1 kg',
      maxAmount: '2 kg',
      status: 'List'
    },
    {
      id: '02',
      productName: 'Organic Potatoes',
      category: 'Vegetable',
      offerType: 'Discount',
      mainQuantity: '2 kg',
      maxAmount: '5 kg',
      status: 'List'
    },
    {
      id: '03',
      productName: 'Red Apples',
      category: 'Fruit',
      offerType: 'Combo Pack',
      mainQuantity: '500 g',
      maxAmount: '1.5 kg',
      status: 'Unlist'
    }
  ]);

  useEffect(() => {
    getAllDiscounts();
  }, []);
 
  useEffect(()=>{
    if(discountDatas)
      setDiscountData(discountDatas)
      console.log(discountDatas)
  },[discountDatas])

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No offers" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No offers</h1>
        <p className="opacity-45">No offers found</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="container w-[75%] h-full pt-[60px] my-6">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_#f1faeb,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center pb-60 overflow-hidden mb-20">
          <div className="w-full px-4 mt-5 pb-20">
            {/* Search and Filter Section */}
            <div className="w-full h-16 flex items-center gap-4 mb-4 justify-center">
              {/* Search Field */}
              <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                <input
                  className="bg-transparent outline-none w-40"
                  type="text"
                  placeholder="Search offers"
                />
                <i className="ri-search-2-line text-[20px] text-[#1fad63]"></i>
              </div>

              {/* Sort Selector */}
              <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-left text-[20px] text-[#1fad63]"></i>
                <select className="bg-transparent outline-none custom-selecter">
                  <option value="">Name</option>
                  <option value="">Category</option>
                  <option value="">Latest</option>
                  <option value="">Oldest</option>
                </select>
              </div>

              {/* Order Selector */}
              <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-justify text-[20px] text-[#1fad63]"></i>
                <select className="bg-transparent outline-none custom-selecter">
                  <option value="">Ascending</option>
                  <option value="">Descending</option>
                </select>
              </div>
            </div>

            {/* Offers Table */}
            <div className="h-[calc(100vh-250px)] overflow-auto px-20">
              {offersData?.length > 0 ? (
                <div className="relative">
                  <table className="w-full border-collapse">
                    {/* Table Header */}
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[linear-gradient(to_right,#c5ebd1,#f1f5f9)]">
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600 rounded-l-full">
                          Product ID
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Category
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Offer Type
                        </th>
                        <th className="px-3 py-2 text-left text-[13px] font-medium text-gray-600">
                        Min Quantity/<br></br>Max Amount
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                         amount
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600 rounded-r-full">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th>&nbsp;</th>
                    </tr>

                    {/* Table Body */}
                    <tbody className="overflow-scroll">
                      {discountData?.map((offer, index) => (
                        <tr key={offer.id} className="">
                          <td className="px-3 py-2">
                            <p className="font-medium ml-6 text-[13px]">
                              {index+1}
                            </p>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900 text-[13px] flex gap-4">
                              {offer?.category?.name?
                                <img className="w-10 h-10 object-cover" src={offer.pics?.one} alt="" />:
                                <i className="ri-dashboard-horizontal-line text-[30px] mt-2 opacity-65"></i>
                              }
                              <span>
                            <p className="font-medium text-[13px] opacity-45">{offer?.category?.name?'product':'category'}</p>
                              {offer?.name}

                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className={`font-medium ${offer?.category?.name?'text-green-700':'text-red-700'} text-[13px]`}>
                              {offer?.category?.name?offer?.category?.name:'Category'}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-[16px] text-gray-500">
                              {offer.discount.type}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-600">
                              {offer.discount.minQuantity} Gram<br></br>
                              {offer.discount.maxAmount} rupees
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="text-[14px] text-gray-500">
                            {offer.discount.value} {offer.discount.isPercentage ? '%' : '₹'}
                            </div>
                          </td>
                          <td className="px-3 py-2 space-x-2">
                            <span
                              className={`p-1 rounded-full bg-black py-4`}
                            >
                              <select
                                className="px-3 py-2 bg-transparent rounded-full text-white custom-selectero"
                                value={offer.status}
                                
                              >
                                <option className="bg-slate-900" value="List">List</option>
                                <option className="bg-slate-900" value="Unlist">Unlist</option>
                              </select>
                            </span>
                          </td>
                          <td>
                            <span>
                              <i 
                                onClick={() => navigate('/admin/Offers/manage', { state: { offer } })}
                                className="ri-pencil-line text-[24px] hover:scale-150 duration-500 pl-5 text-blue-500 cursor-pointer"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Pagination */}
            <div className="absolute bottom-8 right-[12%] translate-x-[100px]">
              <button className="bg absolute-gray-200 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-full">
                Page 01
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full ml-2">
                <i className="ri-skip-right-line text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Recents />
    </>
  );
};

export default Offers;
