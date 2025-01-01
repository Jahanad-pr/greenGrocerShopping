import React, { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { RangeSlider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './Search.css';
import { 
  useAddToBookmarkMutation, 
  useAddtoCartMutation, 
  useCheckItemIntheBookmarkMutation, 
  useCheckPorductInCartMutation, 
  useGetAllCollectionMutation, 
  useGetAllProductMutation, 
  useRemoveBookmarkItmeMutation,
  useGetFilteredProductsMutation

} from '../../../../services/User/userApi';
import CollectionCard from '../../../parts/Cards/Collection';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center absolute bottom-4 right-12 items-center gap-2 my-8 px-3 py-3  bg-[#00000020] rounded-full backdrop-blur-xl">
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#809e8c] text-white hover:bg-[#52aa57]'}`}
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-full ${currentPage === page ? 'bg-[#52aa57] text-white' : 'bg-[#809e8c] text-white hover:bg-[#52aa57]'}`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#809e8c] text-white hover:bg-[#52aa57]'}`}
      >
        Next
      </button>
    </div>
  );
};

const Search = ({userData}) => {
  const [getAllProduct, { isLoading, error, data }] = useGetAllProductMutation();
  const [getAllCollection, { data: collData }] = useGetAllCollectionMutation();
  const [addtoCart, { error: addError, data: addData }] = useAddtoCartMutation();
  const [getFilteredProducts, { data: filterdData,isLoading:IsLOading }] = useGetFilteredProductsMutation();

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(true);
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([10, 2500]);
  const [showProducts, setShowProducts] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [activeCategory, setActiveCategory] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(productData);
  const [collections, setCollections] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [popularityData, setPopularityData] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const LoadingAnimation = () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <div className="absolute w-full h-full border-8 border-gray-200 rounded-full"></div>
          <div className="absolute w-full h-full border-8 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <p className="text-lg font-medium text-gray-600">Loading your products...</p>
      </div>
    </div>
  );
  const categories = [
    'All Categories',
    'Vegetables',
    'Fruits'
  ];

  useEffect(() => { getAllProduct() }, []);
  useEffect(() => { getAllCollection() }, []);

  useEffect(()=>{
    getFilteredProducts({searchQuery,sortBy,priceRange:priceRange,showInStock,showFeatured,category:selectedCategory,page:currentPage,isCollection:showCollections})
  },[sortBy,searchQuery,priceRange,showInStock,showFeatured,showCollections,currentPage])

  useEffect(() => {
    if (data?.productDetails) {
      setProductData(data.productDetails);
      setFilteredProducts(data.productDetails);

    }
    if (data?.pipeline) {
      const popularityMap = data.pipeline.reduce((acc, item) => {
        acc[item._id] = item.totalOrders;
        return acc;
      }, {});
      setPopularityData(popularityMap);
    }
  }, [data]);

  useEffect(()=>{
    if(filterdData){
      console.log(filterdData)
      setFilteredProducts(filterdData.productDetails)
      if(showCollections&&filterdData?.collections){
        setCollections(filterdData?.collections)
      }
    }
  },[filterdData])

  // const handleSort = async (sortType) => {
  //   let sorted = [...filteredProducts];
  //   switch (sortType) {
  //     case 'name-asc': {
  //       const data = await getFilteredProducts({ sortBy: 'name-asc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'name-desc': {
  //       const data = await getFilteredProducts({ sortBy: 'name-desc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'price-asc': {
  //       const data = await getFilname-ascteredProducts({ sortBy: 'price-asc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'price-desc': {
  //       const data = await getFilteredProducts({ sortBy: 'price-desc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'date-asc': {
  //       const data = await getFilteredProducts({ sortBy: 'date-asc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'date-desc': {
  //       const data = await getFilteredProducts({ sortBy: 'date-desc' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     case 'popularity': {
  //       const data = await getFilteredProducts({ sortBy: 'popularity' });
  //       setFilteredProducts(data?.data?.productDetails);
  //       setSortBy(sortType);
  //       setCurrentPage(1);
  //       break;
  //     }
  //     default:pagination
  //       break;
  //   }
    
  //   // setFilteredProducts(sorted);
  //   // setSortBy(sortType);
  //   // setCurrentPage(1);
  // };

  const clearfilter = ()=>{
    setSortBy('date-desc')
    setPriceRange([10,2500])
    setShowFeatured(false)
    setShowInStock(false)
  }

  useEffect(() => {
    if (collData) {
      setCollections(collData);
    }
  }, [collData]);

  const handleSearch = async(query) => {
    setSearchQuery(query);
    // const datas = await getFilteredProducts({searchQuery:query})
    // console.log(datas?.data?.productDetails)
    // setSearchQuery
    // // const filtered = productData?.filter(product =>
    // //   (product.name.toLowerCase().includes(query.toLowerCase()) ||
    // //   product.description.toLowerCase().includes(query.toLowerCase()) ||
    // //   product.category.name.toLowerCase().includes(query.toLowerCase())) &&
    // //   (!showInStock || product.stock > 0) &&
    // //   (!showFeatured || product.featured === true)
    // // );
    // setFilteredProducts(datas?.data?.productDetails);
    // setCurrentPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    // const filtered = productData.filter(product =>
    //   product.salePrice >= newValue[0] && product.salePrice <= newValue[1]
    // );
    // setFilteredProducts(filtered);
    // setCurrentPage(1);
  };

  const getTotalPages = (items) => {
    console.log(items)
    return Math.ceil(items  / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ToastContent = ({ title, message }) => (
    <div>
      <strong>{title}</strong>
      <div>{message}</div>
    </div>
  );

  const showToast = (message, type = "success") => {
    if (type === "success" && message) {
      toast.success(
        <ToastContent title="SUCCESS" message={message} />,
        {
          icon: <FaCheckCircle className="text-[20px]" />,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast-success",
          bodyClassName: "custom-toast-body-success",
          progressClassName: "custom-progress-bar-success",
        }
      );
    } else if (message) {
      toast.error(
        <ToastContent title="ERROR" message={message} />,
        {
          icon: <FaExclamationTriangle className="text-[20px]" />,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
          progressClassName: "custom-progress-bar",
        }
      );
    }
  };
  // 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

  if (isLoading||IsLOading&&setSearchQuery==='') return <LoadingAnimation />;
  

  return (
    <>
      <ToastContainer title="Error" position="bottom-left" />
      <div className="w-full lg:w-[94%] h-full bg-[#f2f2f2]">
        <div className="w-full h-full">
          <div className="w-full h-full overflow-y-scroll flex relative">
            {/* Filter Toggle Button */}
            <div 
              style={{opacity: !expanded ? 1 : 0}} 
              onClick={() => setExpanded(!expanded)} 
              className={`w-8 h-8 duration-500 absolute z-50 mt-5 ml-10 `}
            >
              <img className={`w-full h-full p-1`} src='/setting-5.svg' alt="" />
            </div>

            {/* Filter Sidebar */}
            <div className={`lg:w-[400px] md:w-[100%] w-full pb-20 z-10 md:px-20 lg:px-10 backdrop-blur-3xl ${!expanded ? '-left-full' : 'left-0'} absolute h-full mr-6 duration-500 overflow-scroll`}>
              <div className=" w-full backdrop-blur-md px-20 md:px-0 pb-40">
                <img 
                  onClick={() => setExpanded(!expanded)} 
                  className='w-8 absolute rotate-90 top-10 right-6 cursor-pointer' 
                  src="/pin.svg" 
                  alt="" 
                />
                <h2 onClick={() => getAllCollection()} className="text-[30px] mt-8 font-bold mb-6">Filters</h2>

                {/* View Options */}
                <div className="mb-6">
                  <h3 className="text-[20px] opacity-45 font-medium mb-4">View Options</h3>
                  <div className="flex flex-col gap-3">
                    <label className="category-label">
                      <input
                        type="radio"
                        name="viewOption"
                        checked={showProducts}
                        onChange={() => {
                          setShowProducts(true);
                          setShowCollections(false);
                          setCurrentPage(1);
                        }}
                        className="category-radio"
                      />
                      Show Products
                    </label>
                    <label className="category-label">
                      <input
                        type="radio"
                        name="viewOption"
                        checked={showCollections}
                        onChange={() => {
                          setShowProducts(false);
                          setShowCollections(true);
                          setCurrentPage(1);
                        }}
                        className="category-radio"
                      />
                      Show Collections
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-[20px] opacity-45 font-medium mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-4">
                    {categories?.map((category, index) => (
                      <label key={index} className="category-label">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            if(e.target.value === 'All Categories') setFilteredProducts(productData);
                            else setFilteredProducts((prev)=> productData?.filter((data,index)=> data?.category?.name?.toLowerCase() === e.target.value?.toLowerCase() ) );          
                            setCurrentPage(1);
                          }}
                          className="category-radio"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className={`mb-6 ${!showProducts ? 'opacity-35' : 'opacity-100'}`}>
                  <h3 className="text-[20px] opacity-45 font-medium mb-8 mt-8">Price Range</h3>
                  <div className="px-2">
                    <RangeSlider
                      value={priceRange}
                      onChange={value => handlePriceChange(null, value)}
                      min={10}
                      max={2500}
                      step={250}
                      disabled={!showProducts}
                      progress
                      className="py-4"
                      graduated
                      renderMark={mark => {
                        if ([10, 500, 1000, 1500, 2000, 2500].includes(mark)) {
                          return `₹${mark}`;
                        }
                        return null;
                      }}
                      tooltip={false}
                    />
                    <div className="flex justify-between mt-6">
                      <input 
                        type="number" 
                        value={priceRange[0]} 
                        disabled={!showProducts}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setPriceRange([0, priceRange[1]]);
                            return;
                          }
                          const newValue = parseInt(value);
                          if (newValue <= priceRange[1]) {
                            setPriceRange([newValue, priceRange[1]]);
                            handlePriceChange(null, [newValue, priceRange[1]]);
                          }
                        }}
                        className="w-24 px-4 py-2 rounded-[10px] bg-[#3f6b5130] text-black outline-none text-center"
                        min={10}
                        max={priceRange[1]}
                      />
                      <input 
                        type="number" 
                        value={priceRange[1]} 
                        disabled={!showProducts}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setPriceRange([priceRange[0], 0]);
                            return;
                          }
                          const newValue = parseInt(value);
                          if (newValue >= priceRange[0] && newValue <= 2500) {
                            setPriceRange([priceRange[0], newValue]);
                            handlePriceChange(null, [priceRange[0], newValue]);
                          }
                        }}
                        className="w-24 px-4 py-2 rounded-[10px] bg-[#3f6b5130] text-black outline-none text-center"
                        min={priceRange[0]}
                        max={2500}
                      />
                    </div>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h3 className="text-[20px] opacity-45 font-medium mb-8 mt-8">Sort by</h3>
                  <span className={`${!showProducts ? 'opacity-35' : 'opacity-100'}`}>
                    <label className="category-label flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={showInStock}
                        disabled={!showProducts}
                        onChange={(e) => {
                          setShowInStock(e.target.checked);
                          setCurrentPage(1);
                          const filtered = productData?.filter(product =>
                            (!e.target.checked || product.stock > 0) &&
                            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          );
                          setFilteredProducts(filtered);
                        }}
                        className="category-checkbox"
                      />
                      Show In-Stock Only
                    </label>

                    <label className="category-label flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        checked={showFeatured}
                        disabled={!showProducts}
                        onChange={(e) => {
                          setShowFeatured(e.target.checked);
                          setCurrentPage(1);
                          const filtered = productData?.filter(product =>
                            (!showInStock || product.stock > 0) &&
                            (!e.target.checked || product.featured === true) &&
                            (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          );
                          setFilteredProducts(filtered);
                        }}
                        className="category-checkbox"
                      />
                      Show Featured Only
                    </label>
                  </span>
                  <select
                    value={sortBy}
                    // disabled={!showProducts}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-[#809e8c] custom-selectero text-white rounded-[10px] focus:outline-none"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    {  !showCollections &&
                      <>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                      <option value="date-asc">Date (Oldest First)</option>
                      <option value="date-desc">Date (Newest First)</option>
                    </>
                    }
                    {/* <option value="popularity">Popularity</option> */}
                  </select>
                </div>

                    <button onClick={clearfilter} className='px-10 py-2 bg-gradient-to-r text-white from-[#fd5350] to-[#502020] rounded-full'>Clear filters</button>

              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-16 overflow-scroll">
              {/* Search input */}
              <div className="relative mt-6 w-3/4 mb-10 mx-auto">
                <div className="search-container relative mb-5">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input bg-white/10 border border-[#8aa595] rounded-lg py-3 px-5 w-full text-[#14532d] text-base transition-all duration-300 ease-in-out hover:bg-white/15 focus:bg-white/20 focus:border-[#52aa57] focus:shadow-lg outline-none placeholder:text-[#14532d]/60"
                  />
                  <FiSearch className="search-icon absolute right-5 top-1/2 transform -translate-y-1/2 text-[#8aa595] transition-all duration-300 ease-in-out hover:text-[#52aa57]" />
                </div>
              </div>

              {/* Products Grid */}
              {showProducts && (
                <>
                  <div className="w-full h-auto flex pb-32 my-5 gap-5 relative flex-wrap product-grid items-center justify-center xl:px-10 xl:justify-start">
                    {filteredProducts.map((product,index) => (
                      // console.log(product?.category?.name)
                      
                      (product?.category?.name.toLowerCase() === selectedCategory?.toLowerCase() || 
                      selectedCategory === 'All Categories' || 
                      selectedCategory === 'all') && index < itemsPerPage &&
                      <div key={product._id} className="animate-card">
                        <ProductCard 
                          key={product._id} 
                          showToast={showToast} 
                          product={product} 
                          navigate={navigate} 
                          userData={userData} 
                        />
                      </div>
                    ))}
                  </div>
                  
                  { (filterdData?.pagination?.pages > 1 || currentPage > 1) && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={getTotalPages(filterdData?.pagination?.total)}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Collections Grid */}
              {showCollections && (
                <>
                  <div className="w-full h-auto flex my-5 gap-8 relative flex-wrap product-grid justify-center">
                    {collections.map((collection, index) => (
                      (collection?.category?.name?.toLowerCase() === selectedCategory.toLowerCase() || 
                      selectedCategory === 'All Categories' || 
                      selectedCategory === 'all') &&
                      <div key={index} className="animate-card">
                        <CollectionCard type={'collection'} data={collection} pos={index} />
                      </div>
                    ))}
                  </div>
                  
                  {collections.length > itemsPerPage && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={getTotalPages(collections)}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}

              {/* Legend */}
              {!showProducts && filteredProducts.length !== 0 && (
                <div className="mb-8 flex gap-4 ml-4 text-[13px] absolute bottom-0 right-20">
                  <span className='flex gap-3 items-center'>
                    <div className="h-4 w-4 bg-[#89a494] rounded-full"></div>
                    <p>In stocking</p>
                  </span>
                  <span className='flex gap-3 items-center'>
                    <div className="h-4 w-4 bg-[#d27876] rounded-full"></div>
                    <p>Out of stock</p>
                  </span>
                  <span className='flex gap-3 items-center'>
                    <div className="h-4 w-4 bg-[#cda686] rounded-full"></div>
                    <p>Featured</p>
                  </span>
                </div>
              )}

              {/* No Results Message */}
              {showProducts && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex flex-col gap-2">
                    <img className="w-[30%] mx-auto filter-[brightness(0)]" src='/bag-cross-1.svg' alt="No categories" />
                    <h1 className="text-[30px] font-bold">Sorry no products!</h1>
                    <p className="opacity-45 text-[13px]">
                      We cant find the product, check internet or <br />
                      make sure you typed the product name correctly
                      <br/>
                      and try again, if you think this is a mistake
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


function ProductCard({ navigate, product, userData, showToast }) {

  const [addtoCart, { error: addError, data: addData }] = useAddtoCartMutation()
  const [checkPorductInCart, { data: checkData }] = useCheckPorductInCartMutation();
  const [gotoCart, setGoToCart] = useState(false);
  const [addToBookmark, { data: addToBookmarkData,isLoading }] = useAddToBookmarkMutation();
  const [checkItemIntheBookmark, { data: bookMarkData }] = useCheckItemIntheBookmarkMutation();
  const [removeBookmarkItme, { data: removeData,isLoading:removeLoading }] = useRemoveBookmarkItmeMutation();



    // const [dPopup,setDPopup] = useState(false);
    const [isMared,setMarked] = useState(false);
    const [isUnmarked,setUnMarked] = useState(false);
  
    useEffect(()=>{ checkItemIntheBookmark(product._id) },[])
    useEffect(()=>{ if(addToBookmarkData){ setMarked(true) } },[addToBookmarkData])
    useEffect(()=>{ if(bookMarkData){ setMarked(true)  } },[bookMarkData])
    useEffect(()=>{ if(removeData){ setMarked(false)  } },[removeData])

  useEffect(() => {
    if (addData) {
        setGoToCart(true)
        showToast(addData, 'success')
    }
}, [addData])

// useEffect(()=>{
//   console.log(checkData)
// },[checkData])


  useEffect(() => {
    if (product&&userData?._id) {
      // alert('jh')
        checkPorductInCart(product?._id)
    };
}, [product]);

  const addToCartItem = (id) => {

    const userId = userData._id
    const cartData = {
        quantity: product?.quantity>1000?1000:500,
        product: id,
    }
    addtoCart({ cartData, userId })
  }

  const handleAddToCart = (e) => {
   e.stopPropagation()
  //  console.log(checkData)
   if(checkData||gotoCart){
     navigate('/user/Cart')
    }else{
     addToCartItem(product._id)
   }
  }

  const bookmarkHandler = (e,id,action) => {
    e.stopPropagation()
    if(action==='remove'){

      removeBookmarkItme(id)

    }else if(action==='add'){

      const userId = userData._id

      const bookmarkData = {
          user: userData._id,
          product: id,
      }
      addToBookmark({ bookmarkData, userId })
    }

  }
  
  return (
    <div onClick={()=> navigate('/user/productPage',{ state:{ id:product._id } })} className="h-80 min-w-56 max-w-56 flex flex-col justify-center items-center rounded-[40px] relative group cursor-pointer">

      {userData?._id && !isLoading && !removeLoading ? <img src={isMared ? '/hearted.svg' : '/heart.svg'} onClick={(e) => isMared ? bookmarkHandler(e, product._id, 'remove') : bookmarkHandler(e, product._id, 'add')} className={`w-20 h-20 opacity-45 absolute top-28 right-0 rounded-full p-5 hover:scale-125 duration-500 `}></img> : isLoading || removeLoading ?
        <div className="flex gap-1 absolute top-[140px] right-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }} removeLoading
            ></div>
          ))}
        </div> :userData?._id? <img src={isMared ? '/hearted.svg' : '/heart.svg'} onClick={(e) => isMared ? bookmarkHandler(e, product._id, 'remove') : bookmarkHandler(e, product._id, 'add')} className={`w-20 h-20 opacity-45 absolute top-28 right-0 rounded-full p-5 hover:scale-125 duration-500 `}></img>:''}

    <img className="max-w-[120px] h-[120px] w-[120px] object-cover max-h-[120px] oscillater mix-blend-darken drop-shadow-2xl z-20" src={product.pics.one} alt={product.name} />
    <img className="px-0 max-w-[80px] shadowed opacity-20 absolute" src={product.pic} alt="" />
    <span className="w-full h-auto bg-[linear-gradient(#ffffff40,#ffffff70)] flex flex-col px-10 rounded-t-[30px] rounded-bl-[30px] rounded-br-[120px] pt-10 flex-1 justify- gap-2 pb-10">
      <span className="mt-2">
        <h1 className="text-[28px] font-medium">{product.name}</h1>
        <span className="flex flex-col">
          <s>
            <p className="opacity-30">₹ {product.regularPrice}</p>
          </s>
          <p className={`opacity-60 text-[25px]  font-bold ${product?.stock>0?'text-[#14532d]':'text-red-600'}`}>
            ₹ {product.salePrice}
          </p>
          <p className={`${product?.stock>0?'text-[#14532d]':'text-red-900'} font-medium text-[17px] opacity-55`}>{product?.stock>0?(product.stock/1000).toFixed(0):'Out of Stock'}{product?.stock>1000?" Kg left":product?.stock>0?" g":""}</p>
        
        </span>
      </span>
      { userData?._id && product?.stock>0 ?
      <button onClick={handleAddToCart} className={`flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-3 ${product?.featured&&product?.stock>0?'bg-[linear-gradient(#f8982f,#789985)]':product?.stock>0?'bg-[linear-gradient(#b4c2ba,#789985)]':'bg-[linear-gradient(45deg,#e07373,#ad867c)]'} overflow-hidden w-[70px] h-[70px] group-hover:scale-125 duration-500`}>
        <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
        { !product?.stock>0?
          <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>:
          <i className="ri-shopping-cart-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
        }
      </button>:
      <button className={`flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-3 ${product?.featured&&product?.stock<=0?'bg-[linear-gradient(#f8982f,#d47875)]':product?.stock>0?'bg-[linear-gradient(#b4c2ba,#789985)]':'bg-[linear-gradient(45deg,#e07373,#ad867c)]'} overflow-hidden w-[70px] h-[70px] group-hover:scale-125 duration-500`}>
      <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
      <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
    </button>
      }
    </span>
    
  </div>);
}

export default Search;