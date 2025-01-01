import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../../parts/Toast/Tostify";
import "react-toastify/dist/ReactToastify.css";
import { useUpdateCouponMutation } from "../../../../services/Admin/adminApi";
import ImagePicker from "../../../parts/popups/ImgaePicker";


const INITIAL_FORM_STATE = {
    code: "",
    discountType: "percentage",
    discountAmount: "",
    minimumPurchase: "0",
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    isActive: true,
    usageLimit: "",
    description: "",
};

const CouponManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [updateCoupon, { data: updateData }] = useUpdateCouponMutation();

    // Local state
    const [formState, setFormState] = useState(INITIAL_FORM_STATE);
    const [showImagePicker, setShowImagePicker] = useState(false);


    // Initialize form data from location state
    useEffect(() => {
        if (location.state?.coupon) {
            const coupon = location.state.coupon;
            setFormState({
                ...coupon,
                startDate: new Date(coupon.startDate).toISOString().split('T')[0],
                expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
            });
        }
    }, [location]);

    useEffect(() => {
        if (updateData) {
            showToast(updateData,'success');
            setTimeout(() => {
                navigate('/admin/Coupons');
            }, 2000);
        }
    }, [updateData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateFormData = (data) => {
        // Validate coupon code
        if (!data.code.trim()) {
            return "Coupon code is required";
        }

        // Check if code is exactly 6 characters
        if (data.code.length !== 6) {
            return "Coupon code must be exactly 6 characters long";
        }

        // Check if code is uppercase and contains both letters and numbers
        const hasLetters = /[a-zA-Z]/.test(data.code);
        const hasNumbers = /[0-9]/.test(data.code);
        const hasOnlyValidChars = /^[A-Z0-9a-z]+$/.test(data.code);

        if (!hasLetters || !hasNumbers) {
            return "Coupon code must contain both letters and numbers";
        }
        if (!hasOnlyValidChars) {
            return "Coupon code can only contain letters and numbers";
        }

        if (!data.discountAmount || isNaN(parseFloat(data.discountAmount)) || parseFloat(data.discountAmount) <= 0) {
            return "Please enter a valid discount amount";
        }

        if (data.discountType === 'percentage' && parseFloat(data.discountAmount) > 90) {
            return "Percentage discount cannot exceed 90%";
        }

        if (!data.minimumPurchase || isNaN(parseFloat(data.minimumPurchase))) {
            return "Please enter a valid minimum purchase amount";
        }

        // Check minimum purchase amount for percentage discount
        if (data.discountType === 'percentage' && parseFloat(data.minimumPurchase) < 50) {
            return "Minimum purchase amount must be at least ₹50 for percentage discounts";
        }

        // Check if fixed discount amount is greater than minimum purchase
        if (data.discountType === 'fixed' && parseFloat(data.discountAmount) >= parseFloat(data.minimumPurchase)) {
            return "Fixed discount amount must be less than minimum purchase amount";
        }

        if (!data.expiryDate) {
            return "Expiry date is required";
        }

        const today = new Date();
        const expiry = new Date(data.expiryDate);
        if (expiry <= today) {
            return "Expiry date must be in the future";
        }

        if (data.usageLimit && (isNaN(parseInt(data.usageLimit)) || parseInt(data.usageLimit) < 1)) {
            return "Usage limit must be a positive number";
        }

        if (!data.description.trim()) {
            return "Description is required";
        }

        return "";
    };

    const handleCouponUpdate = async () => {
        const error = validateFormData(formState);
        if (error) {
            showToast(error, "error");
            return;
        }

 
            await updateCoupon(formState).unwrap();
       
    };

    return (
        <>
            <ToastContainer position="bottom-left" />
            {showImagePicker && (
                <ImagePicker
                    // setChaged={setChaged}
                    // imageses={collectionImage}
                    maxImages={1}
                    // setImageUrls={setCollectionImage}
                    showPopup={setShowImagePicker}
                />
            )}
            <div className="container w-[105%] h-full pt-[56px] my-8 relative">
                <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgb(222,255,247)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center relative">
                    <div
                        onClick={() => navigate("/admin/Coupons")}
                        className="absolute top-8 left-10 flex items-center cursor-pointer opacity-55 hover:text-[#59A5D4] hover:opacity-100 transition-all duration-300"
                    >
                        <i className="ri-arrow-left-s-fill text-[35px]" />
                        <p className="text-[13px] -translate-y-[2px] font-medium">Coupons</p>
                    </div>

                    <div className="w-full">
                        <div className="flex justify-center items-center flex-col my-8">
                            <h1 className="text-[30px] font-bold">
                                {location.state?.coupon ? 'Edit Coupon' : 'Create Coupon'}
                            </h1>
                            <p className="text-center opacity-45 px-80">
                                {location.state?.coupon
                                    ? 'Update your coupon details including code, discount value, and validity period.'
                                    : 'Create a new coupon by filling in the details below.'}
                            </p>
                        </div>

                        <div className="max-w-[800px] mx-auto mb-10">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="flex flex-col gap-6">
                                    {/* Coupon Code */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Coupon Code
                                        </label>
                                        <input
                                            name="code"
                                            value={formState.code}
                                            onChange={handleInputChange}
                                            className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] uppercase transition-all focus:shadow-lg"
                                            placeholder="Enter coupon code"
                                        />
                                    </div>

                                    {/* Discount Type */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Discount Type
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange({ target: { name: 'discountType', value: 'percentage' } })}
                                                className={`flex-1 py-3 px-5 rounded-full text-[13px] transition-all ${formState.discountType === 'percentage'
                                                        ? 'bg-[linear-gradient(45deg,#AAEACD,#f5efef)] font-medium'
                                                        : 'bg-white border-2 border-dashed border-gray-300 hover:border-green-500 hover:text-green-500'
                                                    }`}
                                            >
                                                Percentage
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange({ target: { name: 'discountType', value: 'fixed' } })}
                                                className={`flex-1 py-3 px-5 rounded-full text-[13px] transition-all ${formState.discountType === 'fixed'
                                                        ? 'bg-[linear-gradient(45deg,#AAEACD,#f5efef)] font-medium'
                                                        : 'bg-white border-2 border-dashed border-gray-300 hover:border-green-500 hover:text-green-500'
                                                    }`}
                                            >
                                                Fixed Amount
                                            </button>
                                        </div>
                                    </div>

                                    {/* Discount Amount */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Discount Value
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[13px] opacity-70">
                                                {formState.discountType === 'percentage' ? '%' : '₹'}
                                            </span>
                                            <input
                                                name="discountAmount"
                                                value={formState.discountAmount}
                                                onChange={handleInputChange}
                                                type="number"
                                                className="outline-none w-full py-3 pl-10 pr-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                                                placeholder={`Enter discount ${formState.discountType === 'percentage' ? 'percentage' : 'amount'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col gap-6">
                                    {/* Minimum Purchase */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Minimum Purchase Amount
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[13px] opacity-70">₹</span>
                                            <input
                                                name="minimumPurchase"
                                                value={formState.minimumPurchase}
                                                onChange={handleInputChange}
                                                type="number"
                                                className="outline-none w-full py-3 pl-10 pr-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                                                placeholder="Enter minimum purchase amount"
                                            />
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="font-bold opacity-55 ml-2">Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formState.startDate}
                                                onChange={handleInputChange}
                                                className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <label className="font-bold opacity-55 ml-2">Expiry Date</label>
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={formState.expiryDate}
                                                onChange={handleInputChange}
                                                className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Usage Limit */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Usage Limit (Optional)
                                        </label>
                                        <input
                                            name="usageLimit"
                                            value={formState.usageLimit}
                                            onChange={handleInputChange}
                                            type="number"
                                            className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                                            placeholder="Enter usage limit (leave empty for unlimited)"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col gap-1">
                                        <label className="font-bold opacity-55 ml-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formState.description}
                                            onChange={handleInputChange}
                                            className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-[20px] text-[13px] min-h-[100px] transition-all focus:shadow-lg"
                                            placeholder="Enter coupon description"
                                        />
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formState.isActive}
                                            onChange={handleInputChange}
                                            className="w-4 h-4"
                                        />
                                        <label className="font-medium">Active Coupon</label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleCouponUpdate}
                                className="px-0 py-[15px] bg-[linear-gradient(to_left,#8CC850,#1F9C64)] text-[13px] rounded-full text-white font-medium mt-8 w-full transition-transform hover:scale-105"
                            >
                                {location.state?.coupon ? 'Update Coupon' : 'Create Coupon'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CouponManage;