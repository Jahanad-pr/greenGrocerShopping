import React, { useEffect, useRef, useState } from "react";
import star from "../../../../../assets/images/star.png";
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

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// [label, grams needed in stock before the option is offered]
const BASE_OPTIONS = [
  ["100g", 100],
  ["250g", 250],
  ["500g", 500],
  ["1Kg", 1000],
  ["2Kg", 2000],
  ["5Kg", 5000],
  ["10Kg", 10000],
  ["25Kg", 25000],
  ["50Kg", 50000],
  ["75Kg", 75000],
  ["100Kg", 100000],
];

const ALL_OPTIONS = [...BASE_OPTIONS.map(([label]) => label), "custom"];

function convertToGrams(value) {
  if (!value || value === "custom") return null;
  const match = value.match(/^(\d+(?:\.\d+)?)(g|kg)$/i);
  if (!match) {
    console.error("Invalid value format. Expected formats: '100g', '1Kg', etc.");
    return null;
  }
  const amount = parseFloat(match[1]);
  return match[2].toLowerCase() === "kg" ? amount * 1000 : amount;
}

function formatStock(stock) {
  if (!stock) return "";
  if (stock < 1000) return `${stock} g`;
  const kg = stock / 1000;
  return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} Kg`;
}

// The better of the product discount and the category discount wins
function getPricing(product) {
  if (!product) return { label: "", finalPrice: "", hasDiscount: false };
  const regular = Number(product.regularPrice) || 0;
  const pd = product.discount;
  const cd = product.category?.discount;

  const toPercent = (d) => {
    const value = d?.value || 0;
    if (d?.isPercentage) return value;
    return regular ? (value / regular) * 100 : 0;
  };

  const best = toPercent(pd) > toPercent(cd) ? pd : cd;
  const value = best?.value || 0;
  const off = best?.isPercentage ? (regular * value) / 100 : value;

  return {
    label: `${value}${best?.isPercentage ? "%" : "₹"}`,
    finalPrice: (regular - off).toFixed(2),
    hasDiscount: off > 0,
  };
}

const ToastContent = ({ title, message }) => (
  <div>
    <strong>{title}</strong>
    <div>{message}</div>
  </div>
);

const toastBase = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const showToast = (message, type = "success") => {
  if (!message) return;
  if (type === "success") {
    toast.success(<ToastContent title="SUCCESS" message={message} />, {
      ...toastBase,
      icon: <FaCheckCircle className="text-[20px]" />,
      className: "custom-toast-success",
      bodyClassName: "custom-toast-body-success",
      progressClassName: "custom-progress-bar-success",
    });
  } else {
    toast.error(<ToastContent title="ERROR" message={message} />, {
      ...toastBase,
      icon: <FaExclamationTriangle className="text-[20px]" />,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      progressClassName: "custom-progress-bar",
    });
  }
};

const HIGHLIGHTS = [
  {
    icon: "ri-plant-line",
    title: "Straight from the farm",
    text: "Sold by the farm that grew it",
  },
  {
    icon: "ri-scissors-cut-line",
    title: "Cut to order",
    text: "Prepared after you confirm",
  },
  {
    icon: "ri-secure-payment-line",
    title: "Flexible payment",
    text: "On receipt, by card or Google Pay",
  },
];

const FONT_STACK =
  "'Manrope', 'lufga', Inter, Arial, 'Liberation Sans', 'DejaVu Sans', sans-serif";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a6a17] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ece9dd]";

function Stars({ rating = 4, size = "w-5 h-5" }) {
  return (
    <div className="flex" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          className={`${size} ${i < rating ? "" : "grayscale opacity-60"}`}
          src={star}
          alt=""
        />
      ))}
    </div>
  );
}

// round icon button; its label slides out to the left on hover / keyboard focus
function IconAction({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`group flex flex-row-reverse items-center justify-center min-h-12 min-w-12 rounded-full px-3 duration-300 hover:bg-[#ceb64955] focus-visible:bg-[#ceb64955] ${FOCUS}`}
    >
      <img className="w-8 h-8 lg:w-9 lg:h-9" src={icon} alt="" />
      <span className="hidden md:block overflow-hidden whitespace-nowrap text-sm font-medium text-[#25241f] max-w-0 opacity-0 transition-all duration-500 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:mr-3 group-focus-visible:max-w-[200px] group-focus-visible:opacity-100 group-focus-visible:mr-3">
        {label}
      </span>
    </button>
  );
}

function InfoBlock({ icon, title, children }) {
  return (
    <section className="h-full min-w-0 flex flex-col items-center text-center rounded-[28px] border border-white/60 bg-white/40 p-6 sm:p-7 shadow-[0_1px_2px_rgba(60,50,20,0.06)]">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-[#3b3933] mb-3">
        <i className={`${icon} text-lg text-[#7a6a17]`} aria-hidden="true"></i>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProductDetails({ userData }) {
  const [getProductDetails, { data }] = useGetProductDetailsMutation();
  const [getCAtegoryProducts, { data: proData }] =
    useGetCAtegoryProductsMutation();
  const [addtoCart, { error: addError, data: addData }] =
    useAddtoCartMutation();
  const [checkPorductInCart, { data: checkData }] =
    useCheckPorductInCartMutation();
  const [addToBookmark, { data: addToBookmarkData }] =
    useAddToBookmarkMutation();
  const [checkItemIntheBookmark, { data: bookMarkData }] =
    useCheckItemIntheBookmarkMutation();
  const [removeBookmarkItme, { data: removeData }] =
    useRemoveBookmarkItmeMutation();

  const [productsData, setProductsData] = useState([]);
  const [product, setProduct] = useState();
  const [popup, showPopup] = useState(false);
  const [gotoCart, setGoToCart] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [quantity, setQuantity] = useState("1Kg");
  const [currentImage, setCurrentImage] = useState();
  const [options, setOptions] = useState(ALL_OPTIONS);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const relatedRef = useRef(null);
  const selectRef = useRef(null);

  const location = useLocation();
  const navigation = useNavigate();

  /* ---------------- data loading ---------------- */

  useEffect(() => {
    if (location.state?.id) {
      getProductDetails(location.state.id).unwrap().catch(() => {});
    }
  }, [location]);

  useEffect(() => {
    if (!data) return;
    setProduct(data);
    setCurrentImage(data?.pics?.one);
    setGoToCart(false);
    checkPorductInCart(data?._id);
    checkItemIntheBookmark(data?._id);
    if (data?.category?._id) {
      getCAtegoryProducts(data.category._id).unwrap().catch(() => {});
    }
    window.scrollTo(0, 0);
  }, [data]);

  useEffect(() => {
    if (proData?.data) {
      setProductsData(proData.data.filter((d) => d._id !== data?._id));
    }
  }, [proData]);

  /* ---------------- feedback from mutations ---------------- */

  useEffect(() => {
    setIsBookmarked(Boolean(bookMarkData));
  }, [bookMarkData]);

  useEffect(() => {
    if (addToBookmarkData) {
      setIsBookmarked(true);
      showToast(addToBookmarkData, "success");
    }
  }, [addToBookmarkData]);

  useEffect(() => {
    if (removeData) {
      setIsBookmarked(false);
      showToast(removeData, "success");
    }
  }, [removeData]);

  useEffect(() => {
    if (addData) {
      setGoToCart(true);
      showToast(addData, "success");
    }
  }, [addData]);

  useEffect(() => {
    if (addError?.data) showToast(addError.data, "error");
  }, [addError]);

  /* ---------------- quantity options ---------------- */

  // rebuild the list whenever another product is opened
  useEffect(() => {
    if (!product?.stock) return;
    const list = [
      ...BASE_OPTIONS.filter(([, grams]) => grams <= product.stock).map(
        ([label]) => label
      ),
      "custom",
    ];
    setOptions(list);
    setQuantity(list.includes("1Kg") ? "1Kg" : list[list.length - 2] ?? "1Kg");
  }, [product?._id, product?.stock]);

  // "custom" always stays last; close the popup once the list changes
  useEffect(() => {
    if (options[options.length - 1] !== "custom") {
      setOptions((prev) => [...prev.filter((o) => o !== "custom"), "custom"]);
    }
    if (popup) showPopup(false);
  }, [options]);

  const addNewVlaue = (newValue) => {
    showPopup(false);
    if (newValue) {
      setOptions((prev) => [
        ...prev.filter((o) => o !== "custom" && o !== newValue),
        newValue,
        "custom",
      ]);
      setQuantity(newValue);
    }
  };

  /* ---------------- actions ---------------- */

  const addToCartItem = (id) => {
    const userId = userData._id;
    addtoCart({
      cartData: { quantity: convertToGrams(quantity), product: id },
      userId,
    });
  };

  const addToBookmarkItem = (id) => {
    const userId = userData._id;
    addToBookmark({
      bookmarkData: { user: userId, product: id },
      userId,
    });
  };

  const onCartClick = () =>
    checkData || gotoCart
      ? navigation("/user/Cart")
      : addToCartItem(product._id);

  const onBookmarkClick = () =>
    isBookmarked
      ? removeBookmarkItme(product._id)
      : addToBookmarkItem(product._id);

  /* ---------------- related products scroller ---------------- */

  const updateArrows = () => {
    const el = relatedRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [productsData]);

  const scrollRelated = (dir) => {
    const el = relatedRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  /* ---------------- derived values ---------------- */

  const { label: offerLabel, finalPrice, hasDiscount } = getPricing(product);
  const inStock = product?.stock > 0;
  const loggedIn = Boolean(userData?._id);
  const pics = [product?.pics?.one, product?.pics?.two, product?.pics?.three].filter(
    Boolean
  );
  const selectedGrams = convertToGrams(quantity);
  const totalPrice =
    selectedGrams && finalPrice
      ? ((Number(finalPrice) * selectedGrams) / 1000).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;
  const mirrorWidth = "w-44 sm:w-60 xl:w-[min(18rem,30vh)] 2xl:w-[min(300px,30vh)]";
  const mirrorHeight = "h-16 sm:h-20 xl:h-24 2xl:h-[100px]";
  const imageSize =
    "w-44 h-44 sm:w-60 sm:h-60 xl:w-[min(18rem,30vh)] xl:h-[min(18rem,30vh)] 2xl:w-[min(300px,30vh)] 2xl:h-[min(300px,30vh)] object-contain";
  const bodyText = "text-base leading-relaxed text-[#55524a] max-w-[34ch]";
  const valueText =
    "text-xl sm:text-2xl font-semibold leading-tight mb-3 break-words capitalize";

  const renderBreadcrumb = (className = "") => (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#55524a]">
        <li>
          <button
            type="button"
            onClick={() => navigation(-1)}
            aria-label="Go back"
            className={`-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-[#25241f] hover:bg-[#ceb64944] ${FOCUS}`}
          >
            <i className="ri-arrow-left-line text-xl" aria-hidden="true"></i>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => navigation("/user/Products")}
            className={`rounded px-1 hover:text-[#25241f] hover:underline ${FOCUS}`}
          >
            Products
          </button>
        </li>
        {product?.category?.name && (
          <>
            <li aria-hidden="true">/</li>
            <li className="capitalize">{product.category.name}</li>
          </>
        )}
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-medium text-[#25241f] capitalize">
          {product?.name}
        </li>
      </ol>
    </nav>
  );

  return (
    <>
      {popup && (
        <ProductQuantityPopup
          stock={product?.stock}
          setOptions={setOptions}
          onClose={addNewVlaue}
          options={setOptions}
          showPopup={showPopup}
        />
      )}

      <ToastContainer title="Error" position="bottom-left" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
      />
      <style>{`
        @keyframes pd-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pd-mirror { 0%,100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
        .pd-float, .pd-mirror { animation-duration: 4.5s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        .pd-float { animation-name: pd-float; }
        .pd-mirror { animation-name: pd-mirror; }
        @media (prefers-reduced-motion: reduce) { .pd-float, .pd-mirror { animation: none; } }
      `}</style>
      <div style={{ fontFamily: FONT_STACK }} className="relative w-full md:w-[90%] lg:h-full flex-1 bg-product text-[#25241f] overflow-hidden">
        <div className="absolute inset-0 bg-[#bd5a339c] mix-blend-screen pointer-events-none"></div>

        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden backdrop-blur-3xl">
          {/* centers the whole composition, horizontally and vertically */}
          <div className="min-h-full flex items-center justify-center px-4 sm:px-8 lg:px-10 2xl:px-20 py-8 sm:py-12">
            <div className="w-full max-w-[1500px] flex flex-col gap-8 sm:gap-10">
              {renderBreadcrumb("xl:hidden")}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16">
              {/* ================= product stage ================= */}
              <section
                aria-label="Product"
                className="order-1 xl:order-2 min-w-0 mx-auto w-full max-w-[640px] flex flex-col items-center text-center"
              >
                <header className="flex w-full flex-col items-start text-left">
                  <h1 className="text-[clamp(2rem,4vw,2.8rem)] leading-none tracking-tight font-extrabold break-words">
                    {product?.name?.toUpperCase()}
                  </h1>
                  <p className="text-lg sm:text-xl text-[#6b675c] mt-2 mb-3 capitalize">
                    {product?.category?.name}
                  </p>
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#25241f] px-4 py-2 shadow-sm">
                    <Stars rating={4} size="w-6 h-6" />
                    <span className="text-base font-bold text-white tabular-nums">
                      4.0
                    </span>
                  </div>
                </header>

                <div className="relative w-full mt-6">
                  {/* quantity chip (left) + cart / favorite (right) */}
                  <div className="flex w-full items-center justify-between gap-3 sm:absolute sm:inset-x-0 sm:top-0 sm:z-10 sm:items-start">
                    <button
                      type="button"
                      onClick={() => selectRef.current?.focus()}
                      aria-label="Change quantity"
                      className={`flex items-center gap-3 min-h-11 px-5 rounded-full border border-[#ceb64966] bg-[#ceb64933] ${FOCUS}`}
                    >
                      <img className="w-6 h-6" src="/bag.svg" alt="" />
                      {inStock ? (
                        <>
                          <span className="font-bold">{quantity}</span>
                          <i
                            className="ri-expand-vertical-fill text-sm text-[#6b675c]"
                            aria-hidden="true"
                          ></i>
                        </>
                      ) : (
                        <span className="text-sm text-red-800 font-bold">
                          Out of stock
                        </span>
                      )}
                    </button>

                    {loggedIn && (
                      <div className="flex sm:flex-col items-end gap-1">
                        {inStock && (
                          <IconAction
                            icon="/bag.svg"
                            label={
                              checkData || gotoCart
                                ? "Go to Cart"
                                : "Add to cart"
                            }
                            onClick={onCartClick}
                          />
                        )}
                        <IconAction
                          icon="/folder-favorite.svg"
                          label={
                            isBookmarked
                              ? "Remove from favorite"
                              : "Add to favorite"
                          }
                          onClick={onBookmarkClick}
                        />
                      </div>
                    )}
                  </div>

                  {/* product floating above a mirror floor */}
                  <div className="relative flex flex-col items-center pt-6 sm:pt-8">
                    <div
                      aria-hidden="true"
                      className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[380px] max-w-full aspect-square rounded-full bg-[radial-gradient(closest-side,rgba(206,182,73,0.35),transparent)] pointer-events-none"
                    ></div>

                    <div className="pd-float relative z-10">
                      <img
                        className={imageSize}
                        src={currentImage}
                        alt={product?.name || ""}
                      />
                    </div>

                    {/* mirror floor: the reflection stays fixed while the product floats */}
                    <div className={`relative w-full -mt-2 sm:-mt-3 ${mirrorHeight}`}>
                      <div
                        aria-hidden="true"
                        className={`absolute left-1/2 top-0 -translate-x-1/2 h-full overflow-hidden opacity-40 blur-[1.5px] pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)] ${mirrorWidth}`}
                      >
                        <div className="pd-mirror">
                          <img
                            className={`${imageSize} scale-y-[-1] -mt-2 sm:-mt-3`}
                            src={currentImage}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* thumbnails */}
                {pics.length > 0 && (
                  <div
                    role="group"
                    aria-label="Product photos"
                    className="mt-2 flex justify-center gap-3 sm:gap-4"
                  >
                    {pics.map((src, i) => (
                      <button
                        type="button"
                        key={src}
                        onClick={() => setCurrentImage(src)}
                        aria-label={`Show photo ${i + 1}`}
                        aria-pressed={currentImage === src}
                        className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-[22px] sm:rounded-[28px] p-2 sm:p-[10px] flex justify-center items-center duration-300 ${FOCUS} ${
                          currentImage === src
                            ? "border-[#b39a2f] bg-[#ceb64933]"
                            : "border-[#ceb64970] hover:border-[#b39a2f]"
                        }`}
                      >
                        <img
                          className="max-h-full object-contain"
                          src={src}
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* purchase card */}
                <div className="mt-8 w-full text-left rounded-[32px] border border-white/60 bg-white/45 p-5 sm:p-6 flex flex-col gap-5 shadow-[0_1px_2px_rgba(60,50,20,0.06)]">
                  <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4">
                        <p className="text-3xl font-bold leading-snug tabular-nums">
                          ₹ {finalPrice}
                        </p>
                        {hasDiscount && (
                          <s className="text-base text-[#6b675c] tabular-nums">
                            ₹ {product?.regularPrice}
                          </s>
                        )}
                        <span className="text-sm text-[#55524a] tabular-nums">
                          ₹ {(Number(finalPrice) / 10).toFixed(1)}/100g
                        </span>
                      </div>
                      <p className="text-sm text-[#6b675c]">With inc tax</p>
                    </div>

                    {inStock ? (
                      <p className="text-lg sm:text-xl font-medium border-2 border-[#b39a2f] bg-white/30 py-2 px-5 rounded-full tabular-nums">
                        {formatStock(product.stock)}
                        <span className="text-[#6b675c]"> left</span>
                      </p>
                    ) : (
                      <p className="text-lg sm:text-xl text-red-700 font-bold">
                        Out of stock
                      </p>
                    )}
                  </div>

                  {inStock && totalPrice && (
                    <div className="flex items-center justify-between border-t border-[#25241f]/10 pt-4">
                      <span className="text-sm text-[#55524a]">
                        Total for {quantity}
                      </span>
                      <span className="text-xl font-bold tabular-nums">
                        ₹ {totalPrice}
                      </span>
                    </div>
                  )}

                  {inStock && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className="flex items-center justify-between sm:justify-start gap-4">
                        <span className="text-sm font-medium text-[#3b3933]">
                          Quantity
                        </span>
                        <select
                          ref={selectRef}
                          value={quantity}
                          onChange={(e) =>
                            e.target.value === "custom"
                              ? showPopup(true)
                              : setQuantity(e.target.value)
                          }
                          className={`min-h-11 text-lg sm:text-xl text-[#25241f] font-medium bg-transparent cursor-pointer rounded-lg custom-selecter ${FOCUS}`}
                        >
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      {loggedIn && (
                        <button
                          type="button"
                          onClick={() =>
                            navigation("/user/ordersummery", {
                              state: {
                                items: [
                                  {
                                    product,
                                    quantity: convertToGrams(quantity),
                                  },
                                ],
                                qnt: quantity,
                              },
                            })
                          }
                          className={`sm:ml-auto w-full sm:w-auto min-h-12 px-10 rounded-full bg-black text-white font-medium transition hover:bg-[#3b3933] active:scale-[0.98] motion-reduce:transition-none ${FOCUS}`}
                        >
                          Buy now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* ================= details + related ================= */}
              <section
                aria-label="Product details"
                className="order-2 xl:order-1 min-w-0 mx-auto w-full max-w-[720px] flex flex-col gap-10"
              >
                {renderBreadcrumb("hidden xl:block -mb-6")}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <InfoBlock icon="ri-map-pin-line" title="From">
                    <p className={valueText}>{product?.from}</p>
                    <p className={bodyText}>
                      Who sells the product from their farm. This farm is
                      probably close to you, and grows fresh fruits and
                      vegetables for you. We are planning to add a review option
                      for all users, so stay tuned.
                    </p>
                  </InfoBlock>

                  <InfoBlock icon="ri-leaf-line" title="Quality">
                    <p className={`${valueText} text-[#2f5a41]`}>
                      {product?.freshness}
                    </p>
                    {product?.harvestedTime &&
                      !isNaN(new Date(product.harvestedTime)) && (
                        <p className="text-sm text-[#55524a] mb-2">
                          Harvested{" "}
                          {new Date(product.harvestedTime).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        </p>
                      )}
                    <p className={bodyText}>
                      Once the customer confirms their order, the wood is cut
                      specifically for that piece. This approach minimizes waste
                      and ensures fresh, custom-prepared material for every
                      order.
                    </p>
                  </InfoBlock>

                  <InfoBlock icon="ri-price-tag-3-line" title="Offer">
                    {hasDiscount ? (
                      <>
                        <p className="text-5xl font-extrabold leading-none tabular-nums">
                          {offerLabel}
                        </p>
                        <p className="text-2xl text-[#6b675c] mt-1 mb-3">
                          FLAT OFF
                        </p>
                        <p className={bodyText}>
                          The offer applies up to a maximum amount, with a
                          minimum quantity of 1 Kg.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className={`${valueText} text-[#55524a]`}>
                          No offer right now
                        </p>
                        <p className={bodyText}>
                          Offers on this product will show up here.
                        </p>
                      </>
                    )}
                  </InfoBlock>

                  <InfoBlock icon="ri-information-line" title="About">
                    <p className={bodyText}>{product?.description}</p>
                  </InfoBlock>
                </div>

                {/* why buy here */}
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {HIGHLIGHTS.map((h) => (
                    <li
                      key={h.title}
                      className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/30 px-4 py-3 text-left"
                    >
                      <i
                        className={`${h.icon} text-2xl text-[#7a6a17]`}
                        aria-hidden="true"
                      ></i>
                      <span className="text-sm leading-snug text-[#55524a]">
                        <strong className="block font-semibold text-[#25241f]">
                          {h.title}
                        </strong>
                        {h.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* related products */}
                {/* {productsData.length > 0 && (
                  <div className="relative min-w-0">
                    <h2 className="text-lg font-semibold text-center mb-4">
                      Related
                    </h2>

                    {canScrollLeft && (
                      <button
                        type="button"
                        onClick={() => scrollRelated(-1)}
                        aria-label="Previous products"
                        className={`hidden md:flex w-12 h-12 bg-[#afa570cc] hover:bg-[#afa570] absolute top-1/2 left-0 -translate-x-1/2 z-10 justify-center items-center rounded-full ${FOCUS}`}
                      >
                        <i
                          className="ri-arrow-left-s-fill text-[35px]"
                          aria-hidden="true"
                        ></i>
                      </button>
                    )}
                    {canScrollRight && (
                      <button
                        type="button"
                        onClick={() => scrollRelated(1)}
                        aria-label="Next products"
                        className={`hidden md:flex w-12 h-12 bg-[#afa570cc] hover:bg-[#afa570] absolute top-1/2 right-0 translate-x-1/2 rotate-180 z-10 justify-center items-center rounded-full ${FOCUS}`}
                      >
                        <i
                          className="ri-arrow-left-s-fill text-[35px]"
                          aria-hidden="true"
                        ></i>
                      </button>
                    )}

                    <div
                      ref={relatedRef}
                      onScroll={updateArrows}
                      className="flex gap-5 sm:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 -mx-1 px-1 [&>:first-child]:ml-auto [&>:last-child]:mr-auto"
                    >
                      {productsData.map((relatedProduct, index) => (
                        <div
                          key={relatedProduct._id ?? index}
                          className="snap-start shrink-0"
                        >
                          <Product
                            userData={userData}
                            type={"product"}
                            data={relatedProduct}
                            pos={index}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}