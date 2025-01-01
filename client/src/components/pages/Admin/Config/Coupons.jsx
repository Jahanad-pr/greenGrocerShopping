import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../../parts/Toast/Tostify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import "react-toastify/dist/ReactToastify.css";
import Recents from "../../../parts/Main/Recents";
import { useDeleteCouponMutation, useGetAllCouponsMutation, useUpdateCouponAccessMutation } from "../../../../services/Admin/adminApi";
import DeletePopup from "../../../parts/popups/DeletePopup";

const Coupons = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // API mutations
    const [togglor,setToggler] = useState(
        { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false }
      )
    const [getAllCoupons, { data: couponData }] = useGetAllCouponsMutation();
    const [deleteCoupon, { data: deleteData }] = useDeleteCouponMutation();
    const [updateCouponAccess, { data: updatedData }] = useUpdateCouponAccessMutation();

    // Local state
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState(0);
    const [couponsData, setCouponDatas] = useState([]);
    const [updateData, setUpdateData] = useState({ id: '' });
    const [popup, showPopup] = useState(false);
    // const [couponData, setCD] = useState([]);
    const [sortOrder, setSortOrder] = useState("ascending");

    useEffect(() => { if (updateData.id) { showPopup(true); } }, [updateData]);
    useEffect(() => { getAllCoupons(); }, []);
    useEffect(() => { if (updatedData) { showToast(updatedData.message, 'success') } }, [updatedData]);

    useEffect(() => { if (deleteData) { 
        showToast(deleteData, 'success')
        setCouponDatas((prevData)=>prevData.filter((item) => item._id !== updateData.id)) 
    } }, [deleteData]);

      // to prevent reload
    useEffect(()=>{
    if(couponsData){
        const toggleState = couponsData.reduce((acc, cat) => ({
        ...acc,
        [cat._id]: cat.isActive
        }), {});
        setToggler(toggleState);
    }
    },[couponsData])

    // if access updated
    useEffect(()=>{
        if(updatedData?.mission){
        setToggler((prevData)=>({...prevData,  [updatedData?.uniqeID]:!togglor[updatedData?.uniqeID]}))
        }
    },[updatedData])


    useEffect(() => {
        if (couponData) {
            setCouponDatas(() => {
                const sortedData = [...couponData];
                sortedData.sort((a, b) => {
                    const dateA = new Date(a.startDate);
                    const dateB = new Date(b.startDate);
                    if (sortOrder === "ascending") {
                        return dateA.getTime() - dateB.getTime();
                    } else {
                        return dateB.getTime() - dateA.getTime();
                    }
                });
                return sortedData;
            });
        }
    }, [couponData, sortOrder]);



    const EmptyState = () => (
        <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
            <img className="h-[70%]" src={emptyStateImage} alt="No coupons" />
            <div className="flex flex-col gap-2">
                <h1 className="text-[30px] font-bold">No Coupons</h1>
                <p className="opacity-45">No coupons found</p>
            </div>
        </div>
    );

    return (
        <>
            {popup && (
                <DeletePopup
                    updater={deleteCoupon}
                    deleteData={updateData}
                    showPopup={showPopup}
                    action="Remove the Coupon"
                    isUser={true}
                />
            )}
            <div className="container w-[75%] h-full pt-[60px] my-6">
                <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_#fffde8,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center pb-60 overflow-hidden mb-20">
                    <div className="w-full px-4 mt-5 pb-20">
                        {/* Header with Add Button */}
                        <div className="flex justify-between items-center mb-6 px-20">
                            {/* <h1 className="text-2xl font-bold">Manage Coupons</h1> */}
                        </div>

                        {/* Search and Filter Section */}
                        <div className="w-full h-16 flex items-center gap-4 mb-4 justify-center">
                            <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                                <input
                                    className="bg-transparent outline-none w-40"
                                    type="text"
                                    placeholder="Search coupons"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="ri-search-2-line text-[20px] text-[#8b8f3e]"></i>
                            </div>

                            <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                                <i className="ri-align-left text-[20px] text-[#8b8f3e]"></i>
                                <select
                                    className="bg-transparent outline-none custom-selecter"
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                >
                                    <option value="code">Code</option>
                                    <option value="discountAmount">Amount</option>
                                    <option value="expiryDate">Expiry Date</option>
                                    <option value="usedCount">Usage</option>
                                </select>
                            </div>

                            <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                                <i className="ri-align-justify text-[20px] text-[#8b8f3e]"></i>
                                <select
                                    className="bg-transparent outline-none custom-selecter"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="ascending">Ascending</option>
                                    <option value="descending">Descending</option>
                                </select>
                            </div>
                        </div>

                        {/* Coupons Table */}
                        <div className="h-[calc(100vh-250px)] overflow-auto px-20">
                            {couponsData?.length > 0 ? (
                                <div className="relative">
                                    <table className="w-full border-collapse">
                                        {/* Table Header */}
                                        <thead className="sticky top-0 z-10 py-2">
                                            <tr className="bg-[linear-gradient(to_right,#f6ebcc,#f1f5f9)]">
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600 rounded-l-full">
                                                    Code
                                                </th>
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                                                    Discount Type
                                                </th>
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                                                    Amount
                                                </th>
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                                                    Min Purchase
                                                </th>
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                                                    Period
                                                </th>
                                                <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                                                    Pic
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
                                            {couponsData?.map((coupon) => (
                                                <tr key={coupon._id} className="group">
                                                    <td className="px-3 py-2">
                                                        <p className="text-[13px] group-hover:text-green-700 text-gray-500">
                                                            {coupon.code}
                                                        </p>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <div className="font-medium text-[13px] text-gray-900 capitalize">
                                                            {coupon.discountType}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <div className="text-[13px] text-gray-500">
                                                            {coupon.discountAmount}{coupon.discountType === 'percentage' ? '%' : '₹'}
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-[13px] leading-none">
                                                        <div className="font-medium text-gray-600">
                                                            <p>₹{coupon.minimumPurchase}</p>
                                                            <p>usage :{coupon.usageLimit || '∞'}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <div className="text-[13px] text-gray-500">
                                                            <p>Start: <span className="text-black">{new Date(coupon.startDate).toLocaleDateString()}</span> </p>
                                                            <p>EXpire: <span className="text-black">{new Date(coupon.expiryDate).toLocaleDateString()}</span> </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 text-[13px]">
                                                        <div className="text-[14px] text-gray-500">
                                                            {coupon.usedCount}/{coupon.usageLimit || '∞'}
                                                        </div>
                                                    </td>

                                                    <td className="py-2 px-4 text-center">
                                                        {/* <div className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg">
                                                        <div className="absolute top-1/2 left-2 w-5 h-5  rounded-full transform -translate-y-1/2 transition-all duration-300"></div>
                                                        <div className="absolute top-1/2 right-2 w-7 h-7 bg-gray-700 rounded-full transform -translate-y-1/2"></div>
                                                       </div> */}
                                                        {
                                                            <div onClick={()=>(updateCouponAccess({id:coupon._id,state:!togglor[coupon._id]}))} className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg">
                                                                <div className={`absolute top-1/2 w-5 h-5 ${togglor[coupon._id] ? 'left-[calc(100%_-_28px)]' : 'left-2'} bg-gray-700  rounded-full transform -translate-y-1/2 transition-all duration-300`}></div>
                                                                <div className={`absolute top-1/2 w-7 ${togglor[coupon._id] ? 'bg-teal-400 h-5 right-[calc(100%_-_36px)]' : 'bg-red-700 h-2 right-2'}  rounded-full transform -translate-y-1/2 duration-500`}></div>
                                                            </div>
                                                        }
                                                    </td>

                                                    <td className="px-3 py-2">
                                                        <div className="flex gap-2">
                                                            <i
                                                                onClick={() => navigate('/admin/Coupons/manage', { state: { coupon } })}
                                                                className="ri-pencil-line text-[28px] hover:scale-125 duration-300 text-gray-500 cursor-pointer"
                                                            ></i>
                                                            <i
                                                                onClick={() => {
                                                                    setUpdateData({ id: coupon._id });
                                                                }}
                                                                className="ri-delete-bin-line text-[28px] hover:scale-125 duration-300 text-red-500 cursor-pointer"
                                                            ></i>
                                                        </div>
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
                            <button className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-full">
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

export default Coupons;
