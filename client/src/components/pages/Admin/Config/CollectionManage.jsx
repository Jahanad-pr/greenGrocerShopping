import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Component imports
import ImagePicker from "../../../parts/popups/ImgaePicker";
// import { ToastContainer, toast } from "react-toastify";


// API hooks
import {
  useGetCategoriesMutation,
  useGetProductsMutation,
  useUpsertCollectionMutation,
} from "../../../../services/Admin/adminApi";

// Assets
import ColorPick from "../../../parts/popups/ColorPickerPopup";
import ImageUploadPopup from "../../../parts/popups/ImageUploadPopup";
import { showToast } from "../../../parts/Toast/Tostify";

// Constants
const UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_URL;
const INITIAL_FORM_STATE = {
  name: "",
  category: "",
  description: "",
  colorPrimary: "",
  colorSecondary: "",
};

const CollectionManage = () => {
  // API Mutations
  const [upsertCollection,{ data }] = useUpsertCollectionMutation();
  const [getCategories, { data: categoriesData }] = useGetCategoriesMutation();
  const [getProducts, { data: productsData }] = useGetProductsMutation();

  // Local State
  const [isProductSelectorOpen, setProductSelectorOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [collectionImage, setCollectionImage] = useState([null]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [colorIndex, setColorIndex] = useState(1);
  const [colors, setColors] = useState({primary:'#333333',secondary:'#555555'});
  const [popup, showPop] = useState(false);
  const [isChanged, setChaged] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageSave = (blob) => {
    setImageUrl(blob[0]);
    console.log(blob[0]);
    
  };


  // Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize form data from location state
  useEffect(() => {
    if (location.state?.item) {
      setFormState(location.state.item);
      setColors({primary:location.state.item.colorPrimary,secondary:location.state.item.colorSecondary})
      setSelectedProductIds(location.state.item.products)
      setCollectionImage([location.state.item.pic])

    }
  }, [location]);

  // set initial category
  useEffect(()=>{ if(categoriesData?.data&&!formState.category)
    setFormState((prevData)=>({...prevData,category:categoriesData?.data[0]._id})) 
  },[categoriesData])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([getCategories().unwrap(), getProducts().unwrap()]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(()=>{ 
    if(data?.message){
      navigate('/admin/Collection',{ state:{message:data?.message,status:'success'} });
    }
   },[data])



  // useEffect(()=>{  collectionImage.length>0&&(!formState.pic)?setFormState((prev)=>({...prev,pic:collectionImage[0]})):"" },[collectionImage])

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const toggleProductSelection = (productId) => {
    setSelectedProductIds((prev) => {
      const isSelected = prev.includes(productId);
      return isSelected
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
  };

  const convertBase64ToFile = (base64Data, filename) => {
    const [header, content] = base64Data.split(",");
    const mimeType = header.match(/:(.*?);/)[1];
    const binaryContent = atob(content);
    const byteArray = new Uint8Array(binaryContent.length);

    for (let i = 0; i < binaryContent.length; i++) {
      byteArray[i] = binaryContent.charCodeAt(i);
    }

    return new File([byteArray], filename, { type: mimeType });
  };

  const uploadImage = async (base64Image) => {
    if (!base64Image) return null;

    const formData = new FormData();
    formData.append("file", convertBase64ToFile(base64Image, "collection.png"));

    try {
      const { data } = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return data?.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };



  const isValidCategoryName = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name?.trim().length >= 4;
    const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return noNumbersOrSymbols && minCharacters;
  };

  const isInvalidDescription = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name?.trim().length >= 3;
    // const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return minCharacters;
  };

  // Validation function for product data
  const validateFormData = (data) => {
    const errors = "";

    if (!isValidCategoryName(data.name.trim())) {
      return "Collection name must contain at least 4 letters and no numbers or symbols.";
    } else if (!data.name.trim()) {
      return "Product name is required.";
    }

    if (!data.category) return "Category is required.";

    if (!isInvalidDescription(data.description.trim())) {
      return "Description must contain atleast three words.";
    } else if (!data.description.trim()) return "Description is required.";

    // if (selectedProductIds.length == 0) {
    //   return "Minimum one product needed";
    // }

    if (!imageUrl&&!formState?.pic) {
      return "Select the image";
    }

    return "";
  };

  // Utility function to check if a color is light or dark
  function isColorDark(color) {
    let r, g, b;
  
    // If color is in hex format
    if (color && color.startsWith('#')) {
      const hex = color.replace('#', '');
      
      // Ensure hex is 6 characters long (for 3-color hex codes)
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        return false; // Invalid hex format
      }
    }
    // If color is in rgb format (e.g., 'rgb(255, 255, 255)')
    else if (color && color.startsWith('rgb')) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues && rgbValues.length === 3) {
        [r, g, b] = rgbValues.map(Number);
      } else {
        return false; // Invalid rgb format
      }
    } else {
      return false; // Unsupported format
    }
  
    // Calculate brightness using the luminance formula
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if the color is dark, false if it's light
    return brightness < 128;
  }
  
  // useEffect(()=>{},[collectionImage])
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
  
        const val1 = obj1[key];
        const val2 = obj2[key];
  
        // Check if both values are arrays
        if (Array.isArray(val1) && Array.isArray(val2)) {
          // If arrays have different lengths, return false
          if (val1.length !== val2.length) {
            return false;
          }
  
          // Check if all elements in arrays are the same
          for (let i = 0; i < val1.length; i++) {
            if (val1[i] !== val2[i]) {
              return false;
            }
          }
        } 
        // If only one of them is an array, return false
        else if (Array.isArray(val1) || Array.isArray(val2)) {
          return false;
        } 
        // If they are not arrays and not equal, return false
        else if (val1 !== val2) {
          return false;
        }
      }
    }
  
    // If all checks pass, the objects are equal
    return true;
  }
  


  const handleCollectionUpdate = async () => {



    const error = validateFormData(formState);
    if (!error) {
      try {
        // let imageUrl = formState?.pic || ''

        
        // if(!formState?.pic || collectionImage[0] && isChanged){

        //   imageUrl = await uploadImage(collectionImage?.[0]);

        // }

        let collectionData = ''
        
        if(!formState?.pic || collectionImage[0]){
          
          collectionData = {
            ...formState,
            pic: imageUrl||formState?.pic,
            products: [...new Set(selectedProductIds)],
            colorPrimary:colors.primary,
            colorSecondary:colors.secondary
          }

        }else{

          collectionData = {
            ...formState,
            products: [...new Set(selectedProductIds)],
            colorPrimary:colors.primary,
            colorSecondary:colors.secondary

          }
        }
        
        // console.log(areObjectsEqual(collectionData,location.state.item));
        if(collectionData,location.state.item){

          if(areObjectsEqual(collectionData,location.state.item)&&!isChanged){
            return showToast('Nothing Changed','error')
          }
        }

        await upsertCollection(collectionData).unwrap();
      } catch (error) {
        console.error("Failed to update collection:", error);
      }
    } else {
      showToast(error, "error");
    }
  };


  return (
    <>
      <ImageUploadPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onSave={handleImageSave}
        showRemoveBg={true}
        urls={formState?.pic?{[0]:formState?.pic}:false}
        maxImages={1}
      />
      {popup && (
        <ColorPick
          colors={colors}
          setColors={setColors}
          index={colorIndex}
          showPop={showPop}
        />
      )}
setShowImagePicker
      <div className="container w-[105%] pt-[56px] mt-8 relative">
        <div className="w-full h-full overflow-scroll bg-[radial-gradient(circle_at_10%_10%,_rgb(222,255,247)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center relative">
          {/* Back Navigation */}
          <div
            onClick={() => navigate("/admin/Collection")}
            className="absolute top-8 left-10 flex items-center cursor-pointer opacity-55 hover:text-[#59A5D4] hover:opacity-100 transition-all duration-300"
          >
            <i className="ri-arrow-left-s-fill text-[35px]" />
            <p className="text-[13px] -translate-y-[2px] font-medium">
              Collections
            </p>
          </div>

          <div className="w-full h-full">
            {/* Header Section */}
            <div className="flex justify-center items-center flex-col my-8">
              <h1 onClick={()=>console.log(formState)
              } className="text-[30px] font-bold">Manage Collection</h1>
              <p className="text-center opacity-45 px-80">
                Admins can edit collection details, including changing the
                collection name, updating descriptions, and adjusting associated
                products. Ensure all information is accurate to maintain a clear
                and organized structure.
              </p>
            </div>

            {/* Main Content */}
            <div className=" max-w-[55%] mx-auto">
              {/* Image Section */}
              <div className="mt-20">
                <img
                  onClick={() => setIsImagePopupOpen(true)}
                  className="max-w-[250px] mx-auto w-[80%] border-2 border-gray-300 border-dashed rounded-3xl m-5  cursor-pointer transition-transform hover:scale-105"
                  src={ imageUrl || formState.pic ||  '/category.svg'}
                  alt="Collection"
                />
              </div>

              {/* Form Section */}
              <div className="flex-1 pb-40">
                <div className="flex flex-col gap-5">
                  {/* Collection Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="font-bold opacity-55 ml-2">
                      Collection Name
                    </label>
                    <input
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="outline-none min-w-[450px] py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-full text-[13px] transition-all focus:shadow-lg"
                      placeholder="Enter collection name"
                    />
                  </div>

                  {/* Category Select */}
                  <div className="flex gap-8">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="font-bold opacity-55 ml-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formState.category}
                        onChange={handleInputChange}
                        className="w-[450px] py-3 px-5 rounded-full text-[13px] custom-selecter bg-[#AAEACD] transition-all focus:shadow-lg"
                      >
                        {categoriesData?.data
                          ?.filter((cat) => cat.isListed)
                          .map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* Description and Product Selection */}
                  <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                      <label className="font-bold opacity-55 ml-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formState.description}
                        onChange={handleInputChange}
                        className="outline-none w-[525px] py-3 px-5 bg-[linear-gradient(45deg,#AAEACD,#f5efef)] rounded-[20px] text-[13px] min-h-[120px] transition-all focus:shadow-lg"
                        placeholder="Enter description"
                      />
                    </div>

                    {/* Product Selector */}
                    <div className="relative">
                      <div
                        onClick={() =>
                          setProductSelectorOpen(!isProductSelectorOpen)
                        }
                        className="w-48 h-32 bg-[#b9ebd4] p-3 flex flex-col gap-3 rounded-[30px] cursor-pointer mt-5 transition-transform hover:scale-105"
                      >
                        <div className="w-full h-24 bg-gray-100 rounded-[25px] overflow-hidden">
                          <img
                            src="https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4"
                            alt="Products"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-[14px] text-center">
                          Add Product
                        </p>
                      </div>

                      {/* Product Dropdown */}
                      {isProductSelectorOpen && (
                        <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                          {productsData?.data?.map(
                            (product) =>
                              product.isListed && product.category._id===formState.category && (
                                <div
                                  key={product._id}
                                  onClick={() =>
                                    toggleProductSelection(product._id)
                                  }
                                  className={`
                                flex items-center gap-3 p-3 cursor-pointer
                                transition-colors duration-200
                                ${
                                  selectedProductIds.includes(product._id)
                                    ? "bg-green-50"
                                    : "hover:bg-goverflow-scrollray-100"
                                } `}
                                >
                                  <img
                                    src={product.pics.one}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <span className="flex-1 font-medium">
                                    {product.name}
                                  </span>
                                  {selectedProductIds.includes(product._id) && (
                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                  )}
                                </div>
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Color Inputs */}
                  <div className="flex gap-8">
                    {["Primary", "Secondary"].map((colorType, index) => (
                      <div key={colorType} className="flex flex-col gap-1">
                        <label className="font-bold opacity-55 ml-2">
                          Color {colorType}
                        </label>
                        <input
                          onClick={() => (
                            setColorIndex(index + 1), showPop(true)
                          )}
                          name={`color${colorType}`}
                          value={index+1===1?colors.primary:colors.secondary}
                          onChange={handleInputChange}
                          style={{ background: index + 1 === 1 ? colors.primary :colors.secondary, color: isColorDark( colors.primary ) ? "white" : "black", }}
                          className="outline-none w-[200px] py-3 px-5 rounded-full text-[13px] transition-all focus:shadow-lg font-medium"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Update Button */}
                  <button
                    onClick={handleCollectionUpdate}
                    className="px-0 py-[15px] mx-auto bg-[linear-gradient(to_left,#8CC850,#1F9C64)] text-[13px] rounded-full text-white font-medium mt-5 w-full max-w-[300px] transition-transform hover:scale-105"
                  >
                    Update Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionManage;
