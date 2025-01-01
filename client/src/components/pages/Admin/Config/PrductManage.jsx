import React, { useEffect, useState } from "react";
import pic from "../../../../assets/images/plp.png";
import Recents from "../../../parts/Main/Recents";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useGetCategoriesMutation,
  useGetCollectionsMutation,
  useUploadImagesMutation,
  useUpsertProductsMutation,
} from "../../../../services/Admin/adminApi";
import ImagePicker from "../../../parts/popups/ImgaePicker";
import { useLocation, useNavigate } from "react-router-dom";
import ImageUploadPopup from "../../../parts/popups/ImageUploadPopup";

const ProductManage = () => {
  const navigator = useNavigate();

  const [getCategories, { data: catData }] = useGetCategoriesMutation();
  const [getCollections, { data: collData }] = useGetCollectionsMutation();
  const [upsertProducts, { isLoading, error,data }] = useUpsertProductsMutation();

  const [action, setAction] = useState("add");
  const [popup, showPopup] = useState(false);
  const [images, setImageUrls] = useState(false);
  const [urls, setUrl] = useState({});
  const [isChanged, setChaged] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    productCollection: "",
    description: "",
    regularPrice: null,
    salePrice: null,
    stock: "",
    freshness: "fresh",
    harvestedTime:new Date().toISOString().slice(0, 16),
    from: "",
    featured: false,
  });


  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  const handleImageSave = (blob) => {
    setUrl(blob);
  };

  const location = useLocation();

  // Set formData if updating an existing product
  useEffect(() => {
    if (location.state.product&&location.state.product.name) {
      setFormData( location.state.product );
      setImageUrls([[location.state.product.pics.one],[location.state.product.pics.two],[location.state.product.pics.three] ])
      setUrl({[0]:location.state.product.pics.one,[1]:location.state.product.pics.two,[2]:location.state.product.pics.three})
      setAction("update");
    }
  }, [location]);

  // Fetch categories and collections on component mount
  useEffect(() => {
    getCategories();
    getCollections();
  }, []);

  // Update formData when an input changes
  const handleChange = (e,pos=0) => {
    const { name, value } = e.target;
    if(name==='regularPrice'||name==='salePrice'){
      setFormData((prevData) => ({ ...prevData, [name]: Number(value) }));
    }else{
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  useEffect(()=>{
    // console.log(data?.category);
    
    setFormData((prevData)=>({ ...prevData, productCollection:collData?.data?.filter((data)=> formData.category._id === data.category_id )  }))
  },[formData.category])


  const isValidCategoryName = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name?.trim().length >= 4;
    const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return noNumbersOrSymbols && minCharacters;
  };

  const isInvalidDescription = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name?.trim().length >= 4;
    // const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return minCharacters;
  };

  const isInvalidOrganization = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name?.trim().length >= 4;
    // const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return minCharacters;
  };

  // Validation function for product data
  const validateFormData = (data) => {

    if(!isValidCategoryName(data.name.trim())){
      return "Product name must contain at least 4 letters and no numbers or symbols."
    } else  if (!data.name.trim()){
      return "Product name is required."
    }
      
    if (!data.category) return "Category is required.";
    // if (!data.productCollection) return "Collection is required.";

    if(!isInvalidDescription(data.description.trim())){
      return "Description must contain atleast three words."
    } else  if (!data.description.trim()) return "Description is required.";

    if (!data.regularPrice || data.regularPrice <= 0)
      return "Enter a valid regular price.";

    if (!data.salePrice || data.salePrice <= 0)
      return "Enter a valid sale price.";

    if (data.salePrice > data.regularPrice){
      // console.log(data.salePrice,'>',data.regularPrice);
      return "Sale price should be less than regular price.";
    }      

    // if (!data.stock || data.stock <= 0) return "Enter a valid stock quantity.";

    if(!isInvalidOrganization(data.from.trim())){
      return "Organization must contain atleast 4 letters and no numbers or symbols."
    } else  if (!data.from.trim()) return "Source location is required.";
    
    if (!urls || urls.length < 3) return "Please select 3 images.";
    return "";
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // useEffect(() => {
  //   if (error?.data?.message) {
  //     showToast(error.data.message, "error");
  //   }
  // }, [error]);

  useEffect(()=>{  

    if(collData?.data[0]&&!formData.productCollection){
      setFormData((prevData)=>({ ...prevData, productCollection:collData?.data[0]._id }))
    }
    if(catData?.data[0]&&!formData.category){
      setFormData((prevData)=>({ ...prevData, category:catData?.data[0]._id }))
    }
    },[catData,collData])


  useEffect(() => {
    if (error?.data?.message) {
      showToast(error.data.message, "error");
    }
  }, [error]);
  
  useEffect(() => {
    if (data?.message) {
      navigator('/admin/Products',{ state:{ message:data.message,status:'success' } })
      // navigator('/admin/Products',{ state:{message:'Collection created successfully',status:'success'} });
    }
  }, [data]);

  // Convert base64 to file for uploading
  const base64ToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };


  // useEffect(()=>{ Object.values(urls).length>=3?actuallUpload():'' },[urls])

  function areObjectsEqual(obj1, obj2) {
    // Check if both objects have the same number of keys
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    
  
    // Check if values for the same keys are equal
    for (let key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        // If the key doesn't exist in obj2, return false
        if (!obj2.hasOwnProperty(key)) {
          return false;
        }
  
        // If values are not the same, return false
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }
  
    // If all checks pass, the objects are equal
    return true;
  }

  function checkObjectValues(obj) {
    const isEmpty = Object.values(obj).every(
      (value) =>
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
    );

    return isEmpty ? false : true;
  }

  const actuallUpload = async()=>{

    let upsertData = {}

    if(!formData?.pics || setImageUrls[0]){

    upsertData = { ...formData, pics:{ one:urls[0], two:urls[1], three:urls[2] } };

    }else{

    upsertData = { ...formData,  pics:{ one:urls[0], two:urls[1], three:urls[2] } };
    }

    if(action==='update'&&areObjectsEqual(upsertData,location.state.product)&&!isChanged){
      return showToast('Nothing Changed','error')
    }


    try {

      await upsertProducts({ formData: upsertData, action });


    } catch (error) {
      console.error("Product update error:", error);

    }
  }

  const handleFormSubmit = async () => {

    if (checkObjectValues(formData)) {
      
      const errors = validateFormData(formData);
      
      if (errors) {
        return showToast(errors, "error");
      }

        // if(!formData?.pics || setImageUrls[0]){
        //   await Promise.all( Object.values(images).map((img, idx) => uploadImages(img, idx)) );
        // }else{
          actuallUpload()
        // }
      

    } else {
      showToast("please fill the fields", "error");
    }
  };

  return (
    <>
      <ToastContainer position="bottom-left" />
      <ImageUploadPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onSave={handleImageSave}
        showRemoveBg={true}
        urls={urls[0]?urls:false}
        maxImages={3}
      />
      {/* {popup && (
        <ImagePicker
        setChaged={setChaged}
          maxImages={3}
          imageses={images}
          setImageUrls={setImageUrls}
          showPopup={showPopup}
        />
      )} */}
      <div className="container w-[100%] h-full pt-[56px] my-8 relative overflow-scroll">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgb(237,248,255)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center relative">
          <div className="">

            <div
              onClick={() => navigator(-1)}
              className="flex md:absolute top-8 mt-8 md:mt-0 left-10 items-center justify-center bg-red opacity-55 hover:text-[59A5D4] hover:opacity-100 cursor-pointer"
            >
              <i className="ri-arrow-left-s-fill text-[35px]"></i>
              <p className="text-[13px] translate-y-[-2px] font-medium">
                Products
              </p>
            </div>

            {/* Head */}
            <span className="flex justify-center items-center flex-col my-8">
              <h1 className="text-[30px] font-bold">Update Product Details</h1>
              <p className="text-center opacity-45 lg:px-80 px-10">
                This message prompts the admin to carefully review and confirm
                any updates to a product's details. It serves as a final check
                to ensure accuracy in pricing, descriptions, and inventory
                before the changes are saved and displayed to users.
              </p>
            </span>

            <span className=" w-full gap-10 justify-center items-center mt-16">
              {/* Image picker */}
              <span className="flex max-w-[800px] mx-auto justify-center max-h-[300px]  min-h-[200px] gap-20 min-w-[200px] items-center self-start">
                {urls[1] && (
                  <>
                    <img
                      onClick={() => setIsImagePopupOpen(true)}
                      className="max-w-40 max-h-40 min-w-40 min-h-40 mb-10 rounded-2xl"
                      src={urls[0]}
                      alt=""
                    />
                    <img
                      onClick={() => setIsImagePopupOpen(true)}
                      className="max-w-40 max-h-40 min-w-40 min-h-40 mb-10 rounded-2xl"
                      src={urls[1]}
                      alt=""
                    />
                    <img
                      onClick={() => setIsImagePopupOpen(true)}
                      className="max-w-40 max-h-40 min-w-40 min-h-40 mb-10 rounded-2xl"
                      src={urls[2]}
                      alt=""
                    />
                  </>
                )}
                {!urls[1] && (
                  <img
                    onClick={() => setIsImagePopupOpen(true)}
                    className="w-full h-full max-h-[200px] border-2 p-6 border-gray-300 border-dashed rounded-3xl m-5"
                    src={'/box-add.svg'}
                    alt=""
                  />
                )}
              </span>

              <span className="lg:flex pb-20 justify-center pt-8">

              <div className="flex mt-8 lg:mt-0 pr-10 px-10 lg:pl-0">
                {/* Editor */}
                <div className="flex-1 w-full  flex-col items-center gap-5">
                  {/* Product Name */}
                  <div className="flex-col  gap-1">
                    <label
                      className="font-bold opacity-55 w-full max-w-[410px] ml-2"
                      htmlFor="productName"
                    >
                      Product Name
                    </label>
                    <input
                      className="w-full outline-none min-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-full text-[13px]"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Category and Collection */}
                  <div className="flex gap-8">
                    <span className="flex flex-col flex-1 gap-1">
                      <label className="font-bold opacity-55 w-full max-w-[420px] ml-2">
                        Category
                      </label>
                      <select
                        className="w-52 py-3 px-5 rounded-full text-[13px] custom-selecter bg-[#BFD3E0]"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        {catData?.data?.map(
                          (option) =>
                            option.isListed && (
                              <option key={option._id} value={option._id}>
                                {option.name}
                              </option>
                            )
                        )}
                      </select>
                    </span>

                    <span className="flex flex-col flex-1 gap-1">
                      <label className="font-bold opacity-55 w-full max-w-[420px] ml-2">
                        Collection
                      </label>
                      <select
                        className="w-52 py-3 px-5 rounded-full text-[13px] custom-selecter bg-[#BFD3E0]"
                        name="productCollection"
                        value={formData.productCollection}
                        onChange={handleChange}
                      >
                        {collData?.data?.map(
                          (option) =>
                            option.category === formData.category &&
                            option.isListed && (
                              <option key={option._id} value={option._id}>
                                {option.name}
                              </option>
                            )
                        )}
                      </select>
                    </span>
                  </div>

                  {/* Description */}
                  <div className="flex-col flex gap-1">
                    <label className="font-bold opacity-55 w-full min-w-[450px] ml-2">
                      Description
                    </label>
                    <input
                      className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-[20px] text-[13px] pb-20"
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                    />
                  </div>

                  {/* Regular Price and Sale Price */}
                  <div className="flex gap-8">
                    <span className="flex flex-col gap-1">
                      <label className="font-bold opacity-55 w-full max-w-[200px] ml-2">
                        Regular Price
                      </label>
                      <input
                        className="w-full outline-none max-w-[200px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-full text-[13px]"
                        type="number"
                        name="regularPrice"
                        value={formData.regularPrice}
                        onChange={handleChange}
                        placeholder="Enter regular price"
                      />
                    </span>

                    <span className="flex flex-col gap-1">
                      <label className="font-bold opacity-55 w-full max-w-[200px] ml-2">
                        Sale Price
                      </label>
                      <input
                        className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-full text-[13px]"
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        placeholder="Enter sale price"
                      />
                    </span>
                  </div>
                </div>

              </div>

              {/* ------------------------------------------------------------------------------- */}

              {/* Stock, Freshness, Harvested Time, and From */}
              <span className="flex pr-10 px-10 lg:px-0 flex-col gap-5 mt-8 lg:mt-0 pb-40 lg:pb-0 items-center self-start">
                {/* Stock */}
                <span className="flex flex-col gap-1">
                  <label className="font-bold opacity-55 w-full max-w-[200px] ml-2">
                    Stock in gram
                  </label>
                  <input
                    className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-full text-[13px]"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                  />
                  { formData?.stock&&
                    <p>{formData?.stock/(formData?.stock>=1000?1000:1)}{formData?.stock>=1000?'KG':'gram'}</p>
                    
                  }
                </span>

                {/* Freshness */}
                <span className="flex flex-col gap-1">
                  <label className="font-bold opacity-55 w-full max-w-[420px] ml-2">
                    Freshness
                  </label>
                  <select
                    className="w-[250px] py-3 px-5 rounded-full text-[13px] custom-selecter bg-[#BFD3E0]"
                    name="freshness"
                    value={formData.freshness}
                    onChange={handleChange}
                  >
                    <option value="Fresh">Fresh</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </span>

                {/* Harvested Time */}
                {   formData.freshness === 'Harvested' &&

                <span className="flex flex-col gap-1">
                  <label className="font-bold opacity-55 w-full max-w-[420px] ml-2">
                    Harvested Time
                  </label>
                  <input
                    className="w-[250px] py-3 px-5 rounded-full text-[13px] custom-selecter bg-[#BFD3E0]"
                    type="datetime-local"
                    name="harvestedTime"
                    value={new Date(formData.harvestedTime).toISOString().slice(0, 16)}
                    onChange={handleChange}
                  />
                </span>
                }

                {/* From */}
                <span className="flex flex-col gap-1">
                  <label className="font-bold opacity-55 w-full max-w-[420px] ml-2">
                    From
                  </label>
                  <input
                    className="w-full outline-none max-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#BFD3E0,#f5efef)] rounded-full text-[13px]"
                    type="text"
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    placeholder="Enter source location"
                  />
                </span>

                <div className="flex items-center justify-between gap-3 px-3 py-4 bg-[#ffffff10] rounded-xl">
                  <span className="text-[13px] text-black font-medium opacity-75">Featured Product</span>
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
                      formData.featured ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  >
                    <div
                      className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                        formData.featured ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                <button
                  onClick={handleFormSubmit}
                  className="px-0 py-[15px] bg-[linear-gradient(to_left,#8CC850,#1F9C64)] text-[13px] rounded-full text-white font-medium mt-5 w-full max-w-[300px]"
                >
                  {isLoading
                    ? "Saving..."
                    : action === "update"
                    ? "Update Product"
                    : "Add Product"}
                </button>
            
              </span>
              </span>
              


            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManage;
