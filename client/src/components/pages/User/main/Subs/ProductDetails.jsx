import React, { useEffect, useState } from "react";
import star from "../../../../../assets/images/star.png";
import carbg from "../../../../../assets/images/carbg.jpeg";
import { Scale } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import {
    useAddToBookmarkMutation,
    useAddtoCartMutation,
    useCheckItemIntheBookmarkMutation,
    useCheckPorductInCartMutation,
    useGetCAtegoryProductsMutation,
    useGetProductDetailsMutation,
    useRemoveBookmarkItmeMutation,
} from "../../../../../services/User/userApi";
import Product from "../../../../parts/Cards/Product";
import { toast, ToastContainer } from "react-toastify";
import ProductQuantityPopup from "../../../../parts/popups/ProductQuantityPopup";

export default function ProductDetails({ userData }) {
    const [getProductDetails, { error, data }] = useGetProductDetailsMutation();
    const [getCAtegoryProducts, { error: proError, data: proData }] = useGetCAtegoryProductsMutation();
    const [addtoCart, { error: addError, data: addData }] = useAddtoCartMutation();
    const [checkPorductInCart, { data: checkData }] = useCheckPorductInCartMutation();
    const [addToBookmark, { data: addToBookmarkData }] = useAddToBookmarkMutation();
    const [checkItemIntheBookmark, { data: bookMarkData }] = useCheckItemIntheBookmarkMutation();
    const [removeBookmarkItme, { data: removeData }] = useRemoveBookmarkItmeMutation();

    const [productsData, setProductsData] = useState([]);
    const [product, setProduct] = useState();
    const [cartStatus, setCartStatus] = useState();
    const [showRelateCount, setShowRelateCount] = useState(0);
    const [popup, showPopup] = useState(false);
    const [qnto, setQnt] = useState(null);
    const [qnt, showQnt] = useState(true);
    const [gotoCart, setGoToCart] = useState(false);
    const [remover, setRemover] = useState(false);
    const [quantity, setQuantity] = useState('1Kg');
    const [cirrentImage, setCurrentImage] = useState();
    const [options, setOptions] = useState(["100g", "250g", "500g", "1Kg", "2Kg", "5Kg", "10Kg", "25Kg", "50Kg", "75Kg", "100Kg", "custom",]);

    const location = useLocation();
    const navigation = useNavigate();

    // Custom content component for the toast
    const ToastContent = ({ title, message }) => (
        <div>
            <strong>{title}</strong>
            <div>{message}</div>
        </div>
    );




    // Show toast notification function
    const showToast = (message, type = "success") => {
        if (type === "success" && message) {
            toast.success(
                type && <ToastContent title={"SUCCESS"} message={message} />,
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
            toast.error(<ToastContent title={"ERROR"} message={message} />, {
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
            });
        }
    };

    // console.log(checkData);

    useEffect((checkData) => {
        if (checkData) {
            setCartStatus(checkData)
        }

    }, [checkData])

    useEffect(() => {
        if (addToBookmarkData) {
            // alert('jss')
            setRemover(true)
        }

    }, [addToBookmarkData])

    useEffect(() => {
        if (removeData) {
            // alert('jss')
            showToast(removeData, 'success')
            setRemover(false)
        }

    }, [removeData])

    useEffect(() => {
        if (addData) {
            setGoToCart(true)
            showToast(addData, 'success')

        }
    }, [addData])

    useEffect(() => {
        if (addToBookmarkData) {
            showToast(addToBookmarkData, 'success')
        }
    }, [addToBookmarkData])


    useEffect(() => {
        if (addError?.data) {
            showToast(addError.data, 'error')
        }
    }, [addError])

    useEffect(() => {
        if (location.state?.id) {
            getProductDetails(location.state.id).unwrap();
        }
    }, [location]);
    useEffect(() => {
        if (data?.category?._id) {
            getCAtegoryProducts(data.category._id).unwrap();
        }
        setCurrentImage(data?.pics?.one);
    }, [data]);

    useEffect(() => {
        if (data) {
            setProduct(data)
            checkPorductInCart(data?._id)
            checkItemIntheBookmark(data?._id)
        };
    }, [data]);

    useEffect(() => {
        if (proData?.data) {
            setProductsData(proData.data.filter((datas) => datas._id !== data._id));
        }
    }, [proData]);

    useEffect(() => {
        if (popup) {
            setOptions(prevOptions => prevOptions.filter(option => option !== "custom"))
            setOptions((prev) => ([...prev, "custom"]))
            showPopup(false)
        } else {
            //   if(options.length===12){

            //     setSelectedOption(options[3])
            //   }else{
            //     setSelectedOption(options[options.length-2])
            //   }
        }
    }, [options])

    function convertToGrams(value) {
        // Check if the value is "custom"
        if (value === "custom") {
            console.error("Custom input detected. Please handle this case separately.");
            return null;
        }

        // Extract the numeric part and the unit (g or kg)
        const match = value.match(/^(\d+)(g|Kg)$/);
        if (!match) {
            console.error("Invalid value format. Expected formats: '100g', '1kg', etc.");
            return null;
        }

        const amount = parseInt(match[1], 10); // Numeric part
        const unit = match[2]; // Unit

        // Convert to grams
        return unit === "Kg" ? amount * 1000 : amount;
    }

    useEffect(() => {
        if (product?.stock) {
            const quantity = product.stock;
            const thresholds = [
                { value: 100, option: "100g" },
                { value: 250, option: "250g" },
                { value: 500, option: "500g" },
                { value: 1000, option: "1Kg" },
                { value: 2000, option: "2Kg" },
                { value: 5000, option: "5Kg" },
                { value: 10000, option: "10Kg" },
                { value: 25000, option: "25Kg" },
                { value: 50000, option: "50Kg" },
                { value: 75000, option: "75Kg" },
                { value: 100000, option: "100Kg" }
            ];

            setOptions(prevOptions => {
                return prevOptions.filter(option => {
                    if (option === "custom") return true;
                    const threshold = thresholds.find(t => t.option === option);
                    return threshold ? threshold.value <= quantity : false;
                });
            });
        }
    }, [product])

    const addNewVlaue = (newValue) => {
        showPopup(false);
        if (newValue) {
            // Add to options and set as selected
            setOptions(prev => [...prev, newValue]);
            setQnt(newValue);
            const gramsValue = convertToGrams(newValue);

            setQuantity(newValue)
        }
    }

    function deconvertToGrams(value) {
        if (value >= 1000) {
            return `${value / 1000}Kg`;
        } else {
            return `${value}g`;
        }
    }

    const addToCartItem = (id) => {

        const userId = userData._id
        const cartData = {
            quantity: convertToGrams(quantity),
            product: id,
        }
        
        addtoCart({ cartData, userId })
    }


    const addToBookmarkItem = (id) => {

        const userId = userData._id
        const bookmarkData = {
            user: userData._id,
            product: id,
        }
        addToBookmark({ bookmarkData, userId })
    }

    return (
        <> {popup &&
            <ProductQuantityPopup stock={product?.stock} setOptions={setOptions} onClose={addNewVlaue} options={setOptions} showPopup={showPopup} />
        }

            <ToastContainer title="Error" position="bottom-left" />
            <div className={`md:w-[90%] w-screen lg:h-full flex-1 bg-product font-['lufga'] 2x:overflow-hidden`}>
                <div className="bg-[#ceb6499c] mix-blend-screen absolute `md:w-[96%] w-screen h-full"></div>
                <div className="w-full h-full sm:px-10 px-8 2xl:px-40 py-12 backdrop-blur-3xl overflow-scroll overflow-x-hidden">
                    {/* main container */}
                    <div className="w-full lg:h-full flex flex-col 2xl:flex-row py-2">
                        <div className="2xl:w-[45%] w-full mt-20 2xl:mt-0 pb-80 h-full flex flex-col order-2 2xl:order-1 min-h-[50%]">
                            <span>


                                {/* <p className="text-[20px] mb-5 font-medium">Highlites</p> */}
                                {/* Highlights of product */}

                                <div className="w-full flex flex-col sm:flex-row flex-wrap xl:pr-16">

                                    <div className=" h-full sm:w-1/2 relative py-3">
                                        <p className="text-[13px] mb-2 font-medium">From</p>
                                        <h1 className="text-[22px] font-medium leading-none mb-4">
                                            {product?.from}
                                        </h1>
                                        <p className="opacity-45 mb-2 mr-5 max-w-[500px]">
                                            Who selling the product from their farm, this farm
                                            probebly your nearby farm,wich making fresh fruits
                                            and vegetables to you. We are planning to give
                                            the review option for all users,so stay tuned
                                        </p>
                                        {/* <i className="ri-caravan-fill text-[30px] font-medium"></i> */}
                                    </div>





                                    <div className=" sm:w-1/2 h-full py-3">
                                        <p className="text-[13px] mb-2 font-medium">Quality</p>
                                        <p className="text-[22px] font-medium leading-none mb-4 text-[#3c6e51]">
                                            {product?.freshness}
                                        </p>
                                        <p className="opacity-45 mr-5 max-w-[500px]">
                                            Once the customer confirms their order, the wood is cut
                                            specifically for that piece. This approach minimizes waste
                                            and ensures fresh, custom-prepared material for every
                                            order.
                                        </p>
                                    </div>

                                    <div className=" sm:w-1/2 h-full py-3 relative">
                                        <p className="text-[13px] font-medium">Offer</p>
                                        <p className="text-[40px] leading-10 mt-5">
                                            {(() => {
                                                const productVal = product?.discount?.value || 0;
                                                const categoryVal = product?.category?.discount?.value || 0;

                                                // Convert both to percentage for comparison
                                                const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                                                const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);

                                                // Return the greater discount with its symbol
                                                if (productPercent > categoryPercent) {
                                                    return `${productVal}${product?.discount?.isPercentage ? '%' : '₹'}`;
                                                } else {
                                                    return `${categoryVal}${product?.category?.discount?.isPercentage ? '%' : '₹'}`;
                                                }
                                            })()}
                                        </p>
                                        {/* <p className="text-[40px] leading-10 mt-5">{product?.category?.discount?.value}</p> */}
                                        <p className="text-[28px] leadin opacity-45">
                                            FLAT OFF
                                        </p>
                                        <p className="opacity-45 mb-2 mr-20">The offer should be maximum amound and min quantity of 1 Kg</p>
                                        {/* <p className="text-[38px] mt-3 text-left opacity-35 font-bold">
                                            OFF
                                        </p> */}
                                        {/* <p className="absolute bottom-4 font-medium opacity-75 left-4">
                                            00:00:00 <span className="opacity-45">remaining</span>
                                        </p> */}

                                    </div>

                                    <div className=" h-full sm:w-1/2 flex flex-1 flex-col py-3 relative">
                                        <p className="text-[13px] mb-2 font-medium">About</p>
                                        <p className="opacity-45 mb-2 mr-20">{product?.description}</p>

                                        <div className="flex-1 "></div>
                                        {/* stars and reviews */}

                                    </div>

                                </div>
                            </span>


                            {/* the realted product section */}

                            {productsData.length > 0 && (
                                <span className="relative">
                                    {showRelateCount !== 0 &&
                                        <div onClick={() => setShowRelateCount(showRelateCount - 3)} className="w-12 hover:opacity-55 cursor-pointer h-12 bg-[#afa57046] absolute md:top-1/2 2xl:-left-20 -left-5 z-10 justify-center items-center flex rounded-full">
                                            <i className="ri-arrow-left-s-fill text-[35px] -translate-x-[1px]"></i>
                                        </div>

                                    }

                                    {productsData.length > 3 && (productsData.length > showRelateCount + 3) &&
                                        <div onClick={() => setShowRelateCount(showRelateCount + 3)} className="w-12 h-12 bg-[#afa57046] cursor-pointer hover:opacity-55 absolute md:top-1/2 2xl:-right-20 right-5 rotate-180 z-10 justify-center items-center flex rounded-full">
                                            <i className="ri-arrow-left-s-fill text-[35px] -translate-x-[1px]"></i>
                                        </div>

                                    }

                                    {/* <div className="h-[80%] w-20 bg-[#ceb6499c] absolute right-16 top-[54%] rounded-r-3xl -translate-y-1/2"></div>
                                <div className="h-[80%] w-20 bg-[#ceb6499c] absolute left-0 top-[54%] rounded-l-3xl -translate-y-1/2"></div> */}

                                    {/* <p className="text-[20px] mt-8 font-bold">Related</p> */}
                                    {/* related */}
                                    <div className="overflow-hidden w-[828px] max-w-[100%] bg-red-1 h-auto ">
                                        <div className="w-full flex flex-col relative xl:scale-90 2xl:translate-x-[-30px]">
                                            <span className="flex-grow-[7] w-[120%] flex gap-8 list flex-wrap">
                                                {productsData?.map((relatedProduct, index) => {
                                                    return (
                                                        (index >= showRelateCount && index < showRelateCount + 3) &&
                                                        // <div className=" min-w-[200px] hover:ml-3 h-full item py-4 px-5 rounded-[22px]  bg-[linear-gradient(#ffffff65,#ffffff40)]">
                                                        //     <p className="text-[23px] text-black mb-1 font-medium leading-none">
                                                        //         {relatedProduct.name}
                                                        //     </p>
                                                        //     <p className="text-[13px] text-black mb-2 font-medium opacity-45">
                                                        //         Apple, {relatedProduct.category.name}
                                                        //     </p>
                                                        //     <img
                                                        //         className="w-28 aspect-square object-cover mx-auto p-2"
                                                        //         src={relatedProduct?.pics?.one}
                                                        //         alt=""
                                                        //     />
                                                        // </div>
                                                        <Product userData={userData} key={index} type={'product'} data={relatedProduct} pos={index} />
                                                    );
                                                })}

                                                {/* <div className=" min-w-[200px] h-full item py-4 px-5 rounded-[22px] bg-[linear-gradient(#ffffff65,#ffffff40)]">
                                                <p className="text-[23px] text-black mb-1 font-medium leading-none" >Gavi</p>
                                                <p className="text-[13px] text-black mb-2 font-medium opacity-45">Apple, Fruit</p>
                                                <img className="w-36" src="https://png.pngtree.com/png-clipart/20230126/original/pngtree-fresh-red-apple-png-image_8930987.png" alt="" />
                                            </div>

                                            <div className=" min-w-[200px] h-full item py-4 px-5 rounded-[22px] bg-[linear-gradient(#ffffff65,#ffffff40)]">
                                                <p className="text-[23px] text-black mb-1 font-medium leading-none" >Gavi</p>
                                                <p className="text-[13px] text-black mb-2 font-medium opacity-45">Apple, Fruit</p>
                                                <img className="w-36" src="https://png.pngtree.com/png-clipart/20230126/original/pngtree-fresh-red-apple-png-image_8930987.png" alt="" />
                                            </div>


                                            <div className=" min-w-[200px] h-full item py-4 px-5 rounded-[22px] bg-[linear-gradient(#ffffff65,#ffffff40)]">
                                                <p className="text-[23px] text-black mb-1 font-medium leading-none" >Gavi</p>
                                                <p className="text-[13px] text-black mb-2 font-medium opacity-45">Apple, Fruit</p>
                                                <img className="w-36" src="https://png.pngtree.com/png-clipart/20230126/original/pngtree-fresh-red-apple-png-image_8930987.png" alt="" />
                                            </div> */}
                                            </span>
                                        </div>
                                    </div>
                                </span>
                            )}
                        </div>

                        {/* product image container */}
                        <div className="2xl:w-[55%]  md:min-h-[86vh] min-h-[76vh] 2xl:min-h-[60vh]  flex flex-col order-1 2xl:order-2 relative">
                            {/* products titlrs */}
                            <span className="flex">

                            <span>
                            <h1 className="text-[45px] leading-none font-normal">
                                {product?.name.toUpperCase()}
                            </h1>
                            <p className="text-[22px] opacity-45 mb-3 capitalize">
                                {product?.category?.name}
                            </p>
                            <span className="flex gap-5">
                                <div className="flex ">
                                    <img className="w-5 h-5" src={star} alt="" />
                                    <img className="w-5 h-5" src={star} alt="" />
                                    <img className="w-5 h-5" src={star} alt="" />
                                    <img className="w-5 h-5" src={star} alt="" />
                                    <img className="w-5 h-5 grayscale" src={star} alt="" />
                                </div>
                                <p className="text-[13px] font-medium">
                                    4.0
                                </p>
                            </span>
                            </span>

                                

                            <span className="flex-1"></span>

                            <span className="flex flex-col xl:gap-8 gap-3 lg:translate-x-0 translate-x-[30%] items-end">
                            {userData?._id &&
                                <>
                                    {product?.stock > 0 &&
                                        <span onClick={() => checkData || gotoCart ? navigation('/user/Cart') : addToCartItem(product._id)} className=" text-[25px] group duration-500 w-auto rounded-full px-8 py-2 items-center gap-5  hover:bg-[#ceb64950] flex">
                                            {/* <i className={`ri-shopping-cart-${checkData || gotoCart ? 'fill' : 'line'} duration-500 py-2`}></i> */}
                                            <img className="lg:w-10 lg:h-10 w-8 h-8" src="/bag.svg" alt="" />
                                            <p className="text-[13px] text-nowrap group-hover:w-[100px] opacity-0 py-2 group-hover:opacity-100 w-0 duration-700 transition-all right-8">{checkData || gotoCart ? 'Go to Cart' : 'Add to cart'}</p>
                                        </span>

                                    }
                                    <span onClick={() => remover || bookMarkData ? removeBookmarkItme(product._id) : addToBookmarkItem(product._id)} className="py-3 text-[25px] group w-auto duration-500 rounded-full px-8 items-center gap-5  hover:bg-[#ceb64950] flex">
                                        {/* <i className={`ri-bookmark-${remover || bookMarkData ? 'fill' : 'line'} line duration-500 py-2`}></i> */}
                                            <img className="lg:w-10 lg:h-10 w-8 h-8" src={"/folder-favorite.svg"} alt="" />

                                        <p className="text-[13px] text-nowrap group-hover:w-[190px] opacity-0 py-2 group-hover:opacity-100 w-0 duration-700 transition-all right-8">{remover || bookMarkData ? 'Remove from favorite' : 'Add to favorite'}</p>
                                    </span>

                                    {/* <i className="ri-bookmark-line absolute top-28 right-10 text-[25px] rounded-full p-5 py-3 "></i> */}
                                    {/* <i className="ri-share-line absolute top-48 right-10 text-[25px] rounded-full p-5 py-3 "></i> */}
                                </>

                            }
                            </span>
                            </span>


                            <span onClick={() => showQnt(!qnt)} className="inline-flex z-50 cursor-pointer justify-center items-center gap-5 absolute md:bottom-28 bottom-48 2xl:left-[10vw] left-5">
                                    <span className="flex items-center justify-center gap-5 bg-[#ceb64925] px-5 rounded-full py-2">
                                        {/* <i className="ri-shopping-basket-line text-[22px] opacity-70"></i> */}
                                        <img src="/bag.svg" alt="" />
                                        {
                                            product?.stock > 0 ?
                                                <>
                                                    <p className="font-bold">{quantity}</p>
                                                    <i className="ri-expand-vertical-fill text-[13px] opacity-35"></i>
                                                </> :
                                                <p className="text-[13px] text-red-900 opacity-75 font-bold">Out of stock<span className="opacity-45"></span></p>
                                        }

                                    </span>
                                </span>


                            {/* <span cnlassName="flex-1"></span> */}

                            <span className="flex-1 xl:flex-none"></span>


                            <img className="mx-auto 2xl:h-[300px] w-[130px] h-[130px] 2xl:w-[300px] oscillate" src={cirrentImage} alt="" />
                            <img className="left-1/2 2xl:h-[300px] w-[130px] h-[130px] 2xl:w-[300px] shadower opacity-40 absolute" src={cirrentImage} alt="" />
                            {/* <span cnlassName="flex-1"></span> */}

                            
                            <span className="flex-1"></span>
                            <div className="w-full max-h-40  md:max-h-20 flex gap-5 overflow-hidden relative">

                                <span className="2xl:flex-1"></span>
                            
                                <div onClick={() => setCurrentImage(product?.pics?.one)} className="min-w-20 max-w-20 h-20 border-2 border-[#ceb649] rounded-[32px] p-[10px] flex justify-center items-center" >
                                    <img src={product?.pics?.one} alt="" />
                                </div>

                                <span className={`flex h-40 ${!qnt?'-translate-y-full md:-translate-y-1/2':'translate-y-0'} duration-500 flex-col cursor-pointer`}>


                                    <span className="max-h-40 md:mx-h-20 flex-1 flex flex-col md:flex-row md:items-center gap-5">
                                        <span className="flex gap-3">
                                        <div onClick={() => setCurrentImage(product?.pics?.two)} className="w-20 border-2 h-20 border-[#ceb649] rounded-[22px] p-[10px] flex justify-center items-center cursor-pointer" >
                                            <img src={product?.pics?.two} alt="" />
                                        </div>
                                        <div onClick={() => setCurrentImage(product?.pics?.three)} className="w-20 border-2 h-20 border-[#ceb649] rounded-[22px] p-[10px] mr-8  flex justify-center items-center cursor-pointer" >
                                            <img src={product?.pics?.three} alt="" />
                                        </div>

                                        </span>
                                        <div className="flex min-w-[60vw] sm:min-w-[auto] -translate-x-[50%] sm:translate-x-0">
                                            <span className="flex-1"></span>


                                            <span>

                                                <h1 className="font-bold text-[24px] leading-snug">₹ {(() => {
                                                const productVal = product?.discount?.value || 0;
                                                const categoryVal = product?.category?.discount?.value || 0;

                                                // Convert both to percentage for comparison
                                                const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                                                const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);

                                                // Use the discount with higher percentage
                                                if (productPercent > categoryPercent) {
                                                    return (product?.regularPrice - (product?.discount?.isPercentage ?
                                                        (product?.regularPrice * productVal / 100) : productVal)).toFixed(2);
                                                } else {
                                                    return (product?.regularPrice - (product?.category?.discount?.isPercentage ?
                                                        (product?.regularPrice * categoryVal / 100) : categoryVal)).toFixed(2);
                                                }
                                            })()}</h1>
                                            <p className="opacity-55">With inc tax</p>

                                        </span>
                                        {userData?._id && product?.stock > 0 ?
                                            <button
                                                onClick={() => navigation("/user/ordersummery", { state: { items: [{ product: product, quantity: convertToGrams(quantity) }], qnt: quantity } })}
                                                className="p-5 bg-black rounded-full text-white px-10 ml-5"
                                            >
                                                Buy now
                                            </button> : ""

                                        }
                                    </div>
                                        </span>


                                    <span className="min-h-40 min-w-[95vw] sm:min-w-[auto] bg-[#e6e4d9] rounded-[40px] sm:bg-transparent  -translate-x-[50%] sm:translate-x-0 md:min-h-20 flex-1 flex-col md:flex-row gap-8 sm:pl-5 pl-12  flex items-center justify-center">
                                        {/* <p className="font-medium ml-4">Offer Price</p> */}
                                        {/* <span className="flex-1 gap-2"></span> */}
                                        <span>
                                            <span className="flex gap-4 items-center">
                                                <p className="text-[20px] font-bold">₹ {(() => {
                                                    const productVal = product?.discount?.value || 0;
                                                    const categoryVal = product?.category?.discount?.value || 0;

                                                    // Convert both to percentage for comparison
                                                    const productPercent = product?.discount?.isPercentage ? productVal : (productVal / product?.regularPrice * 100);
                                                    const categoryPercent = product?.category?.discount?.isPercentage ? categoryVal : (categoryVal / product?.regularPrice * 100);

                                                    // Use the discount with higher percentage
                                                    if (productPercent > categoryPercent) {
                                                        return (product?.regularPrice - (product?.discount?.isPercentage ?
                                                            (product?.regularPrice * productVal / 100) : productVal)).toFixed(2);
                                                    } else {
                                                        return (product?.regularPrice - (product?.category?.discount?.isPercentage ?
                                                            (product?.regularPrice * categoryVal / 100) : categoryVal)).toFixed(2);
                                                    }
                                                })()}</p>&nbsp;&nbsp;&nbsp;

                                                <s>
                                                    <p className="text-[16px] mt-2 opacity-45">₹ {product?.regularPrice}</p>
                                                </s>
                                            <span className="flex opacity-45">
                                                <p>₹ {product?.salePrice / 10}/100g</p>
                                            </span>
                                                </span>


                                        </span>
                                        <span className="flex gap-5 ">

                                        <span className="">
                                            {product?.stock > 0 ?
                                                <p className="text-[20px] font-medium border-[#ceb649] bg-[#d8d5c520] border-2 p-2 rounded-full px-5">{product?.stock / 1000}<span className="opacity-45"> Kg left</span></p> :
                                                <p className="text-[20px] text-red-500 font-bold">Out of stock<span className="opacity-45"></span></p>

                                            }
                                        </span>
                                        {
                                            product?.stock > 0 ?
                                                <select value={qnto}
                                                    className="text-[20px] text-[#6C6C6C] font-medium focus:outline-none cursor-pointer custom-selecter"
                                                    defaultValue="1Kg"
                                                    onChange={(e) => { e.target.value === 'custom' ? showPopup(true) : setQuantity(e.target.value) }}
                                                >
                                                    {options.map((option, index) => (
                                                        <option value={option}>
                                                            {option}
                                                        </option>
                                                    ))}

                                                </select> : ''
                                        }
                                        </span>


                                    </span>


                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
