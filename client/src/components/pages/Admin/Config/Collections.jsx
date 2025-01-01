import React, { useEffect, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCollectionsMutation, useUpdateCollectionMutation } from "../../../../services/Admin/adminApi";
import Recents from "../../../parts/Main/Recents";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { ToastContainer, toast } from "react-toastify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";


// Constants
const INITIAL_TOGGLE_STATE = Array(11).fill(false).reduce((acc, _, idx) => {
  acc[idx] = false;
  return acc;
}, {});

const Collections = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const [popup, showPopup] = useState(false);
  const [collectionData, setCollectionData] = useState([]);
  const [deleteData, setDeleteData] = useState(null)
  

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


  
  // API Mutations
  const [fetchCollections, { data: collectionsData }] = useGetCollectionsMutation();
  const [updateCollection, { data: updateData }] = useUpdateCollectionMutation();
  
  // Local State
  const [toggleStates, setToggleStates] = useState(INITIAL_TOGGLE_STATE);
  
  // Handlers
  const handleCollectionUpdate = async (collectionId, newState, actionType) => {
    await updateCollection({ 
      uniqeID: collectionId, 
      updateBool: newState, 
      action: actionType 
    }).unwrap();
  };


  useEffect(()=>{
    if(updateData?.message){
      showToast(updateData?.message,'success')
    }
  },[updateData])

  const handleEditClick = (item) => {
    navigate("/admin/Collection/manage", { state: { item } });
  };

  // Effects
  useEffect(() => {
    const loadCollections = async () => {
      await fetchCollections().unwrap();
    };
    loadCollections();
  }, []);

  useEffect(()=>{  
    if(location?.state?.message){
      showToast(location?.state?.message,location?.state?.status)  
    }
  },[location.state])

  useEffect(() => {
    if (collectionsData?.data) {
      const newToggleStates = collectionsData.data.reduce((acc, cat) => {
        acc[cat._id] = cat.isListed;
        return acc;
      }, {});
      setToggleStates(newToggleStates);
      setCollectionData(collectionsData?.data)
    }
  }, [collectionsData]);

  useEffect(() => {
    if (updateData?.mission && updateData?.action === "access") {
      setToggleStates(prev => ({
        ...prev,
        [updateData.uniqeID]: !prev[updateData.uniqeID]
      }));
    } else if (updateData?.action === "delete") {
      // fetchCollections().unwrap();
      const updatedArray = collectionData.filter(collection => collection._id !== deleteData.uniqeID);
      setCollectionData(updatedArray)
    }
  }, [updateData]);

  const handleDelete = (uniqeID, updateBool, action) => {
    setDeleteData({ uniqeID, updateBool, action });
    showPopup(true);
  };

  // UI Components
  const SearchBar = () => (
    <div className="bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full">
      <input
        className="bg-transparent outline-none"
        type="text"
        placeholder="Search collections..."
      />
      <i className="ri-search-2-line text-[25px] text-[#1B453A]" />
    </div>
  );

  const FilterDropdown = ({ icon, label, options }) => (
    <div className="bg-[#ffffff70] py-1 px-5 inline-flex gap-8 rounded-full items-center">
      <i className={`${icon} text-[25px] text-[#1B453A]`} />
      <p className="font-medium opacity-45">{label}</p>
      <select className="bg-transparent outline-none custom-selecter">
        {options.map((opt, idx) => (
          <option key={idx} value={opt.toLowerCase()}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const ToggleSwitch = ({ id, isActive, onToggle }) => (
    <div
      onClick={() => onToggle(id, !isActive, "access")}
      className="relative w-20 h-10 bg-gray-800 rounded-full shadow-lg cursor-pointer"
    >
      <div
        className={`absolute top-1/2 w-5 h-5 ${
          isActive ? "left-[calc(100%_-_28px)]" : "left-2"
        } bg-gray-700 rounded-full transform -translate-y-1/2 transition-all duration-300`}
      />
      <div
        className={`absolute top-1/2 w-7 ${
          isActive
            ? "bg-teal-400 h-5 right-[calc(100%_-_36px)]"
            : "bg-red-700 h-2 right-2"
        } rounded-full transform -translate-y-1/2 transition-all duration-500`}
      />
    </div>
  );

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Greens Collections</h1>
        <p className="opacity-45">
          You have the power to add the greens for people's good health. Add
          some Collections of green
        </p>
        <p
          onClick={() =>
            navigate("/admin/Collection/manage", { state: { name: "" } })
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
    <ToastContainer position="bottom-left" />
    {popup && (
        <DeletePopup
          updater={updateCollection} 
          deleteData={deleteData} 
          showPopup={showPopup} 
        />
      )}
      <div className="container w-[75%] h-full pt-[56px] my-8 relative">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgb(222,255,247)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center">
          <div>
            {/* Filters Section */}
            <div className="w-full h-20 flex items-center gap-8">
              <SearchBar />
              <FilterDropdown 
                icon="ri-align-left"
                label="Sort by"
                options={["Name", "Amount", "Latest", "Oldest"]}
              />
              <FilterDropdown 
                icon="ri-align-justify"
                label="Order"
                options={["Ascending", "Descending"]}
              />
            </div>

            {/* Collections Table */}
            { collectionData.length>0 ?

      <table className="w-full border-collapse rounded-full mt-5">
              <thead>
                <tr className="bg-[linear-gradient(to_right,#60C3A850,#C5D4ED40)] rounded-full text-[#00000070]">
                  <th className="px-4 py-3 text-left text-sm text-gray-600 rounded-l-full">No.</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Image</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm text-gray-600 rounded-r-full">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collectionData?.map((item, index) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-3 text-gray-900 text-[20px] font-bold">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-900 text-[13px] font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-[13px] font-medium">{item.category?.name}</td>
                    <td className="px-4 py-3">
                      <img 
                        src={item.pic} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <ToggleSwitch 
                        id={item._id}
                        isActive={toggleStates[item._id]}
                        onToggle={handleCollectionUpdate}
                      />
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-[30px] opacity-45 hover:opacity-100 transition-opacity"
                      >
                        <i className="ri-pencil-line" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, !toggleStates[item._id], "delete")}
                        className="text-[30px] text-[#F0491B] ml-6 hover:opacity-75 transition-opacity"
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>:<EmptyState />
            }

            {/* Pagination */}
            <div className="flex justify-end mt-4 absolute bottom-20 left-1/2 translate-x-[-50%]">
              <button className="bg-gray-200 hover:bg-gray-400 text-gray-500 font-bold py-2 px-6 rounded-full transition-colors">
                Page 01
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full ml-2 transition-colors">
                <i className="ri-skip-right-line text-[22px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Recents />
    </>
  );
};

export default Collections;