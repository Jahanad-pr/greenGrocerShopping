import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsMutation, useUpdateProductMutation } from "../../../../services/Admin/adminApi";
import DeletePopup from "../../../parts/popups/DeletePopup";
import Recents from "../../../parts/Main/Recents";
import { ToastContainer, toast } from "react-toastify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // API mutations
  const [getProducts, { data }] = useGetProductsMutation();
  const [updateProduct, { data: accessData }] = useUpdateProductMutation();

  // Local state
  const [popup, showPopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [togglor, setToggler] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("latest"); // Changed initial sort to latest
  const [sortOrder, setSortOrder] = useState("descending"); // Changed initial order to descending

  // Show toast notification
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Initialize toggle states for products
  useEffect(() => {
    if (data?.data) {
      const toggleState = data.data.reduce((acc, cat) => ({
        ...acc,
        [cat._id]: cat.isListed
      }), {});
      setToggler(toggleState);
      
      // Sort products by latest initially
      const sortedProducts = [...data.data].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProductsData(sortedProducts);
      setIsLoading(false);
    }
  }, [data]);

  // Handle notifications
  useEffect(() => {
    if(accessData?.message) {
      showToast(accessData?.message, 'success');
    }
    if(location?.state?.message) {
      showToast(location?.state?.message, location?.state?.status);
    }
  }, [accessData, location.state]);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      await getProducts().unwrap();
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...productsData];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "amount":
          comparison = a.regularPrice - b.regularPrice;
          break;
        case "latest":
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt); // Default to latest
      }
      return sortOrder === "ascending" ? comparison : -comparison;
    });
    
    return filtered;
  };

  // Rest of the component remains the same...
  
  // Handler functions
  const handleUpdate = async (uniqeID, updateBool, action) => {
    await updateProduct({ uniqeID, updateBool, action }).unwrap();
  };

  const handleDelete = (uniqeID, updateBool, action) => {
    setDeleteData({ uniqeID, updateBool, action });
    showPopup(true);
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = getFilteredProducts().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(getFilteredProducts().length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const LoadingAnimation = () => (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5 animate-fadeIn">
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Products</h1>
        <p className="opacity-45">No user data found create a Products to continue</p>
        <p
          onClick={() => navigate("/admin/Products/manage", { state: { name: "" } })}
          className="font-bold opacity-100 text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
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
          updater={updateProduct} 
          deleteData={deleteData} 
          showPopup={showPopup} 
        />
      )}

      <div className="container w-[75%] h-full pt-[60px] my-6 animate-slideIn">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgb(237,248,255)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center pb-60 overflow-hidden mb-20">
          <div className="w-full px-4 mt-5 pb-20">
            {/* Search and Filter Section */}
            <div className="w-full h-16 flex items-center gap-4 mb-4 animate-fadeIn">
              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full">
                <input
                  className="bg-transparent outline-none w-40"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-2-line text-[20px] text-[#1F7BAD]"></i>
              </div>

              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-left text-[20px] text-[#1F7BAD]"></i>
                <select 
                  className="bg-transparent outline-none custom-selecter"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="amount">Amount</option>
                  <option value="latest">Latest</option>
                </select>
              </div>

              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-justify text-[20px] text-[#1F7BAD]"></i>
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

            {/* Products Table */}
            <div className="overflow-auto pb-96 px-20">
              {isLoading ? (
                <LoadingAnimation />
              ) : productsData?.length > 0 ? (
                <div className="animate-fadeIn">
                  <table className="w-full border-collapse">
                    {/* Table Header */}
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[linear-gradient(to_right,#498CFF24,#CBD8EE23)] font-mono text-[13px]">
                        <th className="px-3 pl-4 10 py-2 text-left font-medium text-gray-600 rounded-l-full">S.num</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Product</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Category</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Price</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">From</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Qty</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Image</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Status</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-600 rounded-r-full">Actions</th>
                      </tr>
                    </thead>
                    <tr><th>&nbsp;</th></tr>

                    {/* Table Body */}
                    <tbody>
                      {currentItems.map((product, index) => (
                        <tr 
                          key={product._id} 
                          className="hover:bg-gray-50 font-['lufga'] transition-colors animate-fadeIn"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <td className="px-3 py-2 font-bold text-gray-900 text-[20px]">{index + 1}</td>
                      <td className="px-3 py-2">
                        <div className=" text-gray-900 text-[20px] font-['lufga']">{product.name}</div>
                        <div className="text-xs text-gray-400 font-normal">{product.description||'No description'}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-gray-900 text-[20px] ">{product?.category?.name}</div>
                        <div className="text-xs text-gray-400 font-normal ">{product?.productCollection?.name||'No collection'}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-gray-500 text-[20px] font-medium font-mono">₹{product.regularPrice}</div>
                        {/* <div className="font-bold text-gray-600">₹{product.salePrice}</div> */}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">{product.from}</td>
                      <td className={`px-3 py-2 ${product.stock<=0?'text-red-600 text-[16px] font-medium':'text-gray-600 text-[20px]'}`}>{product.stock<=0?'Out of Stock':product.stock<=1000?(product.stock).toFixed(2):(product.stock/1000).toFixed(2)} 
                      { product.stock> 0 &&<span className="">{product.stock>=1000? ' Kg':'Gram'}</span>}</td>
                      <td className="px-3 py-2">
                        <img src={product?.pics?.one} alt={product.name} className="w-8 h-8 rounded-full object-cover" />
                      </td>
                      <td className="px-3 py-2">
                        {/* Toggle Switch */}
                        <div
                          onClick={() => handleUpdate(product._id, !togglor[product._id], "access")}
                          className="relative w-16 h-8 bg-gray-800 rounded-full shadow-lg cursor-pointer"
                        >
                          <div
                            className={`absolute top-1/2 w-4 h-4 ${
                              togglor[product._id] ? "left-[calc(100%_-_22px)]" : "left-2"
                            } bg-gray-700 rounded-full transform -translate-y-1/2 transition-all duration-300`}
                          />
                          <div
                            className={`absolute top-1/2 w-6 ${
                              togglor[product._id]
                                ? "bg-teal-400 h-4 right-[calc(100%_-_28px)]"
                                : "bg-red-700 h-2 right-2"
                            } rounded-full transform -translate-y-1/2 duration-500`}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          onClick={() => navigate("/admin/Products/manage", { state: { product } })}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <i className="ri-pencil-line text-xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, !togglor[product._id], "delete")}
                          className="text-red-500 hover:text-red-700"
                        >
                          <i className="ri-delete-bin-line text-xl" />
                        </button>
                      </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Enhanced Pagination */}
                  <div className="absolute bottom-8 right-[12%] flex items-center gap-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-skip-left-line text-lg" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`${
                          currentPage === number
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                        } font-bold py-2 px-4 rounded-full transition-colors`}
                      >
                        {String(number).padStart(2, '0')}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="ri-skip-right-line text-lg" />
                    </button>
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
      <Recents page="products" />
    </>
  );
};

export default Products;