import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetCategoriesMutation,
  useGetProductsMutation,
  useUpdateOfferMutation,
} from "../../../../services/Admin/adminApi";
import { motion } from "framer-motion";
import ProductModal from "../../../parts/popups/ProductModal";
import { showToast,Tostify } from "../../../parts/Toast/Tostify";

const INITIAL_FORM_STATE = {
  offerFor: "Product",
  productName: "",
  productId: "",
  category: "",
  offerType: "Discount",
  minQuantity: "500",
  minQuantityUnit: "g",
  maxAmount: "600",
  discountType: "percentage",
  discountValue: "",
};

const PRODUCT_OFFER_TYPES = ["Buy 1 Get 1", "Discount", "Combo Pack"];
const CATEGORY_OFFER_TYPES = ["Discount"];
const OFFER_FOR_TYPES = ["Product", "Category"];
const QUANTITY_UNITS = ["g", "kg"];
const DISCOUNT_TYPES = ["percentage", "amount"];

const OfferManage = () => {
  const [getCategories, { data: categoriesData }] = useGetCategoriesMutation();
  const [getProducts, { data: productsData }] = useGetProductsMutation();
  const [updateOffer, { data: updateData }] = useUpdateOfferMutation();


  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.offer) {
      const offer = location.state.offer;
      const isProductOffer = offer.category?.name;
      setFormState({
        offerFor: isProductOffer ? 'Product' : 'Category',
        productName: isProductOffer ? offer.name : '',
        productId: isProductOffer ? offer._id : '',
        category: isProductOffer ? offer.category?._id : offer._id,
        offerType: offer.discount.type,
        minQuantity: offer.discount.minQuantity,
        minQuantityUnit: 'g',
        maxAmount: offer.discount.maxAmount,
        discountType: offer.discount.isPercentage ? 'percentage' : 'amount',
        discountValue: offer.discount.value
      });
    }
  }, [location]);

  useEffect(() => {
    if (categoriesData?.data?.length > 0 && !formState.category && formState.offerFor === 'Category') {
      setFormState(prev => ({
        ...prev,
        category: categoriesData.data[0]._id
      }));
    }
  }, [categoriesData]);

  useEffect(()=>{ 
    if(updateData){
      showToast(updateData)
      setTimeout(() => {
        navigate('/admin/Offers') 
        
      }, 2000);
    }  
  },[updateData])

  useEffect(() => {
    getCategories();
    getProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => {
      const newState = { ...prev, [name]: value };
      
      if (name === 'offerFor') {
        newState.productId = '';
        newState.productName = '';
        newState.category = '';
        newState.offerType = value === 'Category' ? 'Discount' : 'Buy 1 Get 1';
        newState.discountType = 'percentage';
        newState.discountValue = '';
      }

      if (name === 'discountType') {
        newState.discountValue = '';
      }

      if (name === 'offerType') {
        newState.discountType = 'percentage';
        newState.discountValue = '';
      }
      
      return newState;
    });
  };

  const handleProductSelect = (product) => {
    setFormState(prev => ({
      ...prev,
      productId: product._id,
      productName: product.name,
      category: product.category._id
    }));
  };

  const handleDiscountProductSelect = (product) => {
    setFormState(prev => ({
      ...prev,
      discountProductId: product._id,
      discountProductName: product.name
    }));
  };


  const validateFormData = (data) => {
    
    if (!data.offerFor) return "Please select offer type (Product/Category)";
    if (data.offerFor === "Product" && !data.productId) return "Please select a product";
    if (!data.offerType) return "Offer type is required.";
    if (!data.minQuantity || isNaN(parseFloat(data.minQuantity))) {
      return "Min quantity must be a valid number.";
    }
    if (!data.minQuantityUnit) return "Min quantity unit is required.";
    if (!data.maxAmount || isNaN(parseFloat(data.maxAmount))) {
      return "Max amount must be a valid number.";
    }
    if (data.offerType === 'Discount') {
      if (!data.discountType || !data.discountValue) {
        return "Please select discount type and enter discount value.";
      }

      const discountValue = parseFloat(data.discountValue);
      if (isNaN(discountValue) || discountValue <= 0) {
        return "Please enter a valid discount value greater than 0";
      }

      if (data.discountType === 'percentage') {
        if (discountValue >= 90) {
          return "Discount percentage must be less than 90%";
        }
      } else if (data.discountType === 'amount' && data.offerFor === 'Product') {
        const selectedProduct = productsData?.data?.find(p => p._id === data.productId);
        if (selectedProduct) {
          const maxAllowedDiscount = selectedProduct.regularPrice * 0.9;
          if (discountValue > maxAllowedDiscount) {
            return `Discount amount (₹${discountValue}) cannot exceed 90% of product price (₹${maxAllowedDiscount.toFixed(2)})`;
          }
        }
      }
    }
    return "";
  };

  const handleOfferUpdate = () => {
    const error = validateFormData(formState);
    if (error) {
      showToast(error, "error");
      return;
    }
    updateOffer(formState);
    
  };

  const getOfferTypes = () => {
    return formState.offerFor === 'Category' ? CATEGORY_OFFER_TYPES : PRODUCT_OFFER_TYPES;
  };

  return (
    <>
      <Tostify position="bottom-left" />
      <div className="container w-[105%] h-full pt-[56px] my-8 relative ">
        <div className="w-full min-h-screen bg-[radial-gradient(circle_at_10%_10%,_rgb(222,255,247)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center relative">
          <div
            onClick={() => navigate("/admin/Offers")}
            className="absolute top-8 left-10 flex items-center cursor-pointer opacity-55 hover:text-[#59A5D4] hover:opacity-100 transition-all duration-300"
          >
            <i className="ri-arrow-left-s-fill text-[35px]" />
            <p className="text-[13px] -translate-y-[2px] font-medium">Offers</p>
          </div>

          <div className="w-full">
            <div className="flex justify-center items-center flex-col my-8">
              <h1 className="text-[30px] font-bold">Manage Offer</h1>
              <p className="text-center opacity-45 px-80">
                Manage offer details including product name, offer type, and quantities.
              </p>
            </div>

            <div className="max-w-[800px] mx-auto mb-10">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  {/* Offer For Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-55 ml-2">
                      Offer For
                    </label>
                    <select
                      name="offerFor"
                      value={formState.offerFor}
                      onChange={handleInputChange}
                      className="outline-none w-full py-3 px-5 rounded-full text-[13px] transition-all focus:shadow-lg custom-selectero"
                    >
                      {OFFER_FOR_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Product Selection Button */}
                  {formState.offerFor === "Product" && (
                    <div className="flex flex-col gap-1">
                      <label className="font-bold opacity-55 ml-2">
                        Select Product
                      </label>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 px-5 bg-white border-2 border-dashed border-gray-300 rounded-full text-[13px] hover:border-green-500 hover:text-green-500 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="ri-add-line"></i>
                        {formState.productName || "Choose a product"}
                      </button>
                    </div>
                  )}

                  {/* Category Selection Dropdown */}
                  {formState.offerFor === "Category" && (
                    <div className="flex flex-col gap-1">
                      <label className="font-bold opacity-55 ml-2">
                        Select Category
                      </label>
                      <select
                        name="category"
                        value={formState.category}
                        onChange={handleInputChange}
                        className="outline-none w-full py-3 px-5 rounded-full text-[13px] transition-all focus:shadow-lg custom-selectero"
                      >
                        {categoriesData?.data?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-55 ml-2">
                      Offer Type
                    </label>
                    <select
                      name="offerType"
                      value={formState.offerType}
                      onChange={handleInputChange}
                      className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg custom-selectero"
                    >
                      {getOfferTypes().map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formState.offerType === "Discount" && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold opacity-55 ml-2">
                          Discount Type
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange({ target: { name: 'discountType', value: 'percentage' }})}
                            className={`flex-1 py-3 px-5 rounded-full text-[13px] transition-all ${
                              formState.discountType === 'percentage'
                                ? 'bg-[linear-gradient(45deg,#AAEACD,#f5efef)] font-medium'
                                : 'bg-white border-2 border-dashed border-gray-300 hover:border-green-500 hover:text-green-500'
                            }`}
                          >
                            Percentage
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange({ target: { name: 'discountType', value: 'amount' }})}
                            className={`flex-1 py-3 px-5 rounded-full text-[13px] transition-all ${
                              formState.discountType === 'amount'
                                ? 'bg-[linear-gradient(45deg,#AAEACD,#f5efef)] font-medium'
                                : 'bg-white border-2 border-dashed border-gray-300 hover:border-green-500 hover:text-green-500'
                            }`}
                          >
                            Amount
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  {formState.offerType === "Discount" && (
                    <div className="flex flex-col gap-1">
                      <label className="font-bold opacity-55 ml-2">
                        {formState.discountType === 'percentage' ? 'Percentage Off' : 'Amount Off'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[13px] opacity-70">
                          {formState.discountType === 'percentage' ? '%' : '₹'}
                        </span>
                        <input
                          name="discountValue"
                          value={formState.discountValue}
                          onChange={handleInputChange}
                          type="number"
                          step={formState.discountType === 'percentage' ? '1' : '0.01'}
                          min="0"
                          max={formState.discountType === 'percentage' ? '100' : undefined}
                          className="outline-none w-full py-3 pl-10 pr-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                          placeholder={`Enter ${formState.discountType === 'percentage' ? 'percentage' : 'amount'} off`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-55 ml-2">
                      Min Quantity
                    </label>
                    <div className="flex gap-2">
                      <input
                        name="minQuantity"
                        value={formState.minQuantity}
                        onChange={handleInputChange}
                        type="number"
                        step="0.1"
                        className="outline-none w-full py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                        placeholder="Enter min quantity"
                      />
                      <select
                        name="minQuantityUnit"
                        value={formState.minQuantityUnit}
                        onChange={handleInputChange}
                        className="outline-none w-[120px] py-3 px-5 rounded-full text-[13px] transition-all focus:shadow-lg custom-selectero"
                      >
                        {QUANTITY_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-55 ml-2">
                      Max Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[13px] opacity-70">₹</span>
                      <input
                        name="maxAmount"
                        value={formState.maxAmount}
                        onChange={handleInputChange}
                        type="number"
                        step="1"
                        min="0"
                        className="outline-none w-full py-3 pl-10 pr-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                        placeholder="Enter max amount"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOfferUpdate}
                className="px-0 py-[15px] bg-[linear-gradient(to_left,#8CC850,#1F9C64)] text-[13px] rounded-full text-white font-medium mt-8 w-full transition-transform hover:scale-105"
              >
                Update Offer
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={productsData?.data}
        onSelect={handleProductSelect}
        selectedProduct={formState.productId}
      />
    </>
  );
};

export default OfferManage;