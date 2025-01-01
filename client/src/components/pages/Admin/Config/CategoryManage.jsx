import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  useGetCollectionsMutation, 
  useGetProductsMutation, 
  useUpsertCategoryMutation 
} from "../../../../services/Admin/adminApi";

const CategoryManager = () => {
  // State management
  const [categoryData, setCategoryData] = useState({});
  const [dropdownStates, setDropdownStates] = useState({
    products: false,
    collections: false
  });
  const [selectedItems, setSelectedItems] = useState({
    products: [],
    collections: []
  });

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [upsertCategory,{data}] = useUpsertCategoryMutation();

  // Update form data when location state changes
  useEffect(() => {
    if (location?.state?.item) {
      setCategoryData(location.state.item);
    }
  }, [location]);

  useEffect(()=>{ 
    if(data?.message){
      navigate('/admin/category',{ state:{ message:data.message,status:'success' } })
    }
  },[data])

  const isValidCategoryName = (name) => {
    // Ensure only letters and spaces, and a minimum of 4 characters
    const minCharacters = name.trim().length >= 4;
    const noNumbersOrSymbols = /^[A-Za-z\s]+$/.test(name);
    return noNumbersOrSymbols && minCharacters;
  };
  

  // Event Handlers
  const handleInputChange = ({ target: { name, value } }) => {
    setCategoryData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryUpdate = async () => {
    const { name } = categoryData;

    // Validation: Check if the name is valid
    if (!name?.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!isValidCategoryName(name)) {
      toast.error("Category name must contain at least 4 words and no numbers or symbols");
      return;
    }

    try {
      const payload = {
        ...categoryData,
        items: {
          products: selectedItems.products.map(p => p._id),
          collections: selectedItems.collections.map(c => c._id)
        }
      };
      await upsertCategory(payload).unwrap();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  return (
    <div className="container w-[75%] h-full pt-[56px] my-8 relative">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        progressClassName="toast-progress"  // You can style this class in your CSS if desired
      />
      <div className="w-full h-full bg-[radial-gradient(circle_at_0%_1%,_rgb(182_233_175)_0%,_rgb(173,216,230,50%)_30%,_rgba(255,0,0,0)_100%)] rounded-tl-[65px] flex justify-center relative transition-all duration-300">
        {/* Back Navigation */}
        <button
          onClick={() => navigate('/admin/category')}
          className="absolute top-8 left-10 flex items-center opacity-55 hover:text-[#59A5D4] hover:opacity-100 transition-all duration-200"
        >
          <i className="ri-arrow-left-s-fill text-[35px]"></i>
          <span className="text-[13px] -translate-y-[2px] font-medium">Categories</span>
        </button>

        <div className="max-w-2xl w-full px-4">
          <div className="text-center my-8">
            <h1 className="text-3xl font-bold mb-2">Manage Category</h1>
            <p className="text-gray-600">
              Manage category details, products, and collections
            </p>
          </div>

          <div className="space-y-6">
            {/* Category Name Input */}
            <div>
              <label className="font-bold text-gray-600 block mb-2">
                Category Name
              </label>
              <input
                name="name"
                value={categoryData?.name || ""}
                onChange={handleInputChange}
                className="w-full outline-none py-3 px-5 bg-gradient-to-r from-[#BFD3E0] to-[#f5efef] rounded-full text-lg transition-all duration-200"
                placeholder="Enter category name"
              />
            </div>

            {/* Update Button */}
            <button
              onClick={handleCategoryUpdate}
              className="w-full max-w-[300px] py-[15px] bg-gradient-to-l from-[#8CC850] to-[#1F9C64] text-white font-medium rounded-full transition-all duration-300 hover:opacity-90 mx-auto block" >
              {location.state.item ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
