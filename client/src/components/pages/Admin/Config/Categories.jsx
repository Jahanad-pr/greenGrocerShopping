import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetCategoriesMutation,
  useUpdateCategoryMutation,
} from "../../../../services/Admin/adminApi";
import Recents from "../../../parts/Main/Recents";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { showToast } from "../../../parts/Toast/Tostify"; // Import the showToast

// Constants
const SORT_OPTIONS = {
  NAME: "name",
  AMOUNT: "amount",
  LATEST: "latest",
  OLDEST: "oldest",
};

const ORDER_OPTIONS = {
  ASCENDING: "ascending",
  DESCENDING: "descending",
};

const Categories = () => {
  // State management
  const [toggleStates, setToggleStates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NAME);
  const [orderBy, setOrderBy] = useState(ORDER_OPTIONS.ASCENDING);
  const [popup, showPopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null)
  const [categories,setCategories] = useState([])

  const navigate = useNavigate();
  const location = useLocation();

  // API mutations
  const [getCategories, { isLoading, error, data: categoryData }] =
    useGetCategoriesMutation();
  const [
    updateCategory,
    { isLoading: isUpdateLoading, error: updateError, data: updateResponse },
  ] = useUpdateCategoryMutation();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Update toggle states when category data changes
  useEffect(() => {
    if (categoryData?.data) {
      const newToggleStates = categoryData.data.reduce(
        (acc, cat) => ({
          ...acc,
          [cat._id]: cat.isListed,
        }),
        {}
      );
      setToggleStates(newToggleStates);
      setCategories(categoryData?.data)
    }
  }, [categoryData]);

  useEffect(()=>{
    if(updateResponse?.message){
      showToast(updateResponse?.message,'success')
    }
  },[updateResponse])

  // Handle category updates
  useEffect(() => {
    if (updateResponse?.mission) {
      if (updateResponse.action === "access") {
        setToggleStates((prev) => ({
          ...prev,
          [updateResponse.uniqeID]: !prev[updateResponse.uniqeID],
        }));
      } else if (updateResponse.action === "delete") {
        // fetchCategories();
        const updatedArray = categories.filter(product => product._id !== deleteData.uniqeID);
        setCategories(updatedArray)
      }
    }
  }, [updateResponse]);

  // Helper functions
  const fetchCategories = async () => {
    try {
      await getCategories().unwrap();
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleCategoryUpdate = async (categoryId, newState, action) => {
    try {
      await updateCategory({
        uniqeID: categoryId,
        updateBool: newState,
        action,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update category:", err);
    }
  };

  const handleDelete = (uniqeID, updateBool, action) => {
    setDeleteData({ uniqeID, updateBool, action });
    showPopup(true);
  };

  useEffect(()=>{  
    console.log(location?.state?.message);
    if(location?.state?.message){
      showToast(location?.state?.message,location?.state?.status)  
    }
  },[location.state])

  const navigateToManage = (item) => {
    navigate("/admin/Category/manage", { state: { item } });
  };

  // UI Components
  const SearchBar = () => (
    <div className="bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full">
      <input
        className="bg-transparent outline-none"
        type="text"
        placeholder="Search here"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <i className="ri-search-2-line text-[25px] text-[#1B453A]" />
    </div>
  );

  const SortSelector = () => (
    <div className="bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full items-center">
      <i className="ri-align-left text-[25px] text-[#1B453A]" />
      <p className="font-medium opacity-45">Sort by</p>
      <select
        className="bg-transparent outline-none custom-selecter"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        {Object.entries(SORT_OPTIONS).map(([key, value]) => (
          <option key={key} value={value}>
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );

  const OrderSelector = () => (
    <div className="bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full items-center">
      <i className="ri-align-justify text-[25px] text-[#1B453A]" />
      <p className="font-medium opacity-45">Order</p>
      <select
        className="bg-transparent outline-none custom-selecter"
        value={orderBy}
        onChange={(e) => setOrderBy(e.target.value)}
      >
        {Object.entries(ORDER_OPTIONS).map(([key, value]) => (
          <option key={key} value={value}>
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </div>
  );

  const ToggleSwitch = ({ categoryId, isActive }) => (
    <div
      onClick={() => handleCategoryUpdate(categoryId, !isActive, "access")}
      className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg"
    >
      <div
        className={`absolute top-1/2 w-5 h-5 ${
          isActive ? "left-[calc(100%_-_28px)]" : "left-2"
        } bg-gray-700  rounded-full transform -translate-y-1/2 transition-all duration-300`}
      ></div>
      <div
        className={`absolute top-1/2 w-7 ${
          isActive
            ? "bg-teal-400 h-5 right-[calc(100%_-_36px)]"
            : "bg-red-700 h-2 right-2"
        }  rounded-full transform -translate-y-1/2 duration-500`}
      ></div>
    </div>
  );

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Greens Category</h1>
        <p className="opacity-45">
          You have the power to add the greens for people's good health. Add
          some category of green
        </p>
        <p
          onClick={() =>
            navigate("/admin/Category/manage", { state: { name: "" } })
          }
          className="font-bold opacity-100 text-blue-500 cursor-pointer"
        >
          Let's go
        </p>
      </div>
    </div>
  );

  return (
    <>
        {/* Delete Confirmation Popup */}
          {popup && (
        <DeletePopup
          updater={updateCategory} 
          deleteData={deleteData} 
          showPopup={showPopup} 
        />
      )}
      <div className="container w-[75%] h-full pt-[56px] my-8 relative">
        <div className="w-full h-full bg-[radial-gradient(circle_at_0%_1%,_rgb(182_233_175)_0%,_rgb(173,216,230,50%)_30%,_rgba(255,0,0,0)_100%)] rounded-tl-[65px] flex justify-center">
          <div>
            {/* Filters */}
            <div className="w-full h-20 flex items-center gap-8">
              <SearchBar />
              <SortSelector />
              <OrderSelector />
            </div>

            {/* Categories Table */}
            {!error?.data?.data ? (
              <table className="w-full border-collapse rounded-full mt-5">
                <thead>
                  <tr className="bg-[linear-gradient(to_right,#60C3A850,#C5D4ED40)] rounded-full text-[#00000070]">
                    <th className="px-4 py-3 text-left text-sm text-gray-600 rounded-l-full">
                      S. Number
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600 rounded-r-full">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4">
                      <p>&nbsp;</p>
                    </td>
                  </tr>
                  {categories?.map((item, index) => (
                    <tr key={item._id} className="border-t">
                      <td className="px-4 py-3 text-gray-900 text-[20px] font-bold">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-[13px] font-medium">
                        {item.name}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <ToggleSwitch
                          categoryId={item._id}
                          isActive={toggleStates[item._id]}
                        />
                      </td>
                      <td className="text-center">
                        <Edit2
                          className="inline-block mr-4 cursor-pointer opacity-45"
                          size={24}
                          onClick={() => navigateToManage(item)}
                        />
                        <Trash2
                          className="inline-block cursor-pointer text-[#F0491B]"
                          size={24}
                          onClick={() =>
                            handleDelete(
                              item._id,
                              !toggleStates[item._id],
                              "delete"
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState />
            )}

            {/* Pagination */}
            <div className="flex justify-end mt-4 absolute bottom-20 left-1/2 translate-x-[-50%]">
              <button className="bg-gray-200 hover:bg-gray-400 text-gray-500 font-bold py-2 px-6 rounded-full">
                Page 01
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full ml-2">
                <i className="ri-skip-right-line text-[22px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Recents page={'categories'} />
    </>
  );
};

export default Categories;
