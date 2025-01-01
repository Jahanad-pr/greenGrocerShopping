import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DeletePopup from "../../../parts/popups/DeletePopup";
import Recents from "../../../parts/Main/Recents";
import { ToastContainer, toast } from "react-toastify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import "react-toastify/dist/ReactToastify.css";
import { useCancelOrderMutation, useGetAllOrdersMutation,useUpdateOrderStatusMutation } from "../../../../services/Admin/adminApi";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // API mutations
  const [getAllOrders, { data }] = useGetAllOrdersMutation();
  const [updateOrderStatus, { data: statusData }] =
    useUpdateOrderStatusMutation();
  const [cancelOrder, { data: cancelData }] = useCancelOrderMutation();

  // Local state
  const [popup, showPopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [togglor, setToggler] = useState({});
  const [ordersData, setOrdersData] = useState([]);
  const [updateData, setUpdateData] = useState({});

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

  // Initialize toggle states for orders
  useEffect(() => {
    console.log(data);
    if (data) {
      setOrdersData(()=>{
        return [...data].sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        })
      });
    }
  }, [data]);

  useEffect(() => {
    if (statusData) {
      showToast(statusData, "success");
      setOrdersData((prevArray) =>
        prevArray.map((item, index) =>
          index === updateData.index
            ? { ...item, order_status: updateData.value }
            : item
        )
      );
    }
  }, [statusData]);

  useEffect(() => {
    if (cancelData) {
      setOrdersData((prevArray) =>
        prevArray.map((item, index) =>
          index === deleteData.index
            ? { ...item, order_status: "Cancelled" }
            : item
        )
      );
      showToast(cancelData, "success");
    }
  }, [cancelData]);

  useEffect(() => {
    if (location?.state?.message) {
      showToast(location?.state?.message, location?.state?.status);
    }
  }, [location.state]);

  // Fetch orders on component mount
  useEffect(() => {
    const fetchorders = async () => {
      await getAllOrders().unwrap();
    };
    fetchorders();
  }, []);

  const datCoverter = (timestamp) => {
    const date = new Date(timestamp);

    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const splitCode = (inputString, line) => {
    const parts = inputString.split("-");
    // Display the fir part and the second part on separate lines
    if (line == 1) {
      return `${parts[0]}`;
    }
    return `${parts[1]}`;
  };

  const updateOrdersStatus = (statusData) => {
    updateOrderStatus(statusData).unwrap();
    setUpdateData(statusData);
  };

  const colorProvider = (staus) => {
    if (staus == "Pending") {
        return '#aa8800'
    } else if (staus == "Processed") {
      return "#00aa74";
    } else if (staus == "Shipped") {
        return '#aa5200'
    } else if (staus == "Delivered") {
        return '#3eaa00'
    } else if (staus == "Cancelled") {
        return '#aa003e'
    }
  };

  //   // Handle order updates
  //   useEffect(() => {
  //     if (accessData?.mission && accessData?.action === "access") {
  //       setToggler((prev) => ({
  //         ...prev,
  //         [accessData.uniqeID]: !prev[accessData.uniqeID],
  //       }));
  //     } else if (accessData?.action === "delete") {
  //       // getorders().unwrap();
  //       const updatedArray = ordersData.filter(
  //         (order) => order._id !== deleteData.uniqeID
  //       );
  //       setOrdersData(updatedArray);
  //     }
  //   }, [accessData]);

  //   // Handler functions
  //   const handleUpdate = async (uniqeID, updateBool, action) => {
  //     await updateorder({ uniqeID, updateBool, action }).unwrap();
  //   };

  const handleCancel = (id, index) => {
    setDeleteData({ id, index });
    showPopup(true);
  };

  const EmptyState = () => (
    <div className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5">
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No orders</h1>
        <p className="opacity-45">No orders found</p>
        {/* <p
          onClick={() =>
            navigate("/admin/orders/manage", { state: { name: "" } })
          }
          className="font-bold opacity-100 text-blue-500 cursor-pointer"
        >
          Let's go
        </p> */}
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer position="bottom-left" />
      {/* Delete Confirmation Popup */}
      {popup && (
        <DeletePopup
          updater={cancelOrder}
          deleteData={deleteData}
          showPopup={showPopup}
          action="Cancel order"
          isUser={true}
        />
      )}

      <div className="container w-[75%] h-full pt-[60px] my-6">
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_#f1faeb,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center pb-60 overflow-hidden mb-20">
          <div className="w-full px-4 mt-5 pb-20">
            {/* Search and Filter Section */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Orders Management</h2>
              
              </div>

              <div className="w-full flex items-center gap-4 justify-center">
                {/* Search Field */}
                <div className="bg-[#00000008] py-[10px] px-4 flex gap-4 rounded-full items-center">
                  <input
                    className="bg-transparent outline-none w-40"
                    type="text"
                    placeholder="Search here"
                  />
                  <i className="ri-search-2-line text-[20px] text-[#1fad63]"></i>
                </div>

                {/* Sort Selector */}
                <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                  <i className="ri-align-left text-[20px] text-[#1fad63]"></i>
                  <select className="bg-transparent outline-none custom-selecter">
                    <option value="">Name</option>
                    <option value="">Amount</option>
                    <option value="">Latest</option>
                    <option value="">Oldest</option>
                  </select>
                </div>

                {/* Order Selector */}
                <div className="bg-[#00000008] py-1 px-4 flex gap-4 rounded-full items-center">
                  <i className="ri-align-justify text-[20px] text-[#1fad63]"></i>
                  <select className="bg-transparent outline-none custom-selecter">
                    <option value="">Ascending</option>
                    <option value="">Descending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* orders Table */}
            <div className="h-[calc(100vh-250px)] overflow-auto px-20">
              {ordersData?.length > 0 ? (
                <div className="relative">
                  <table className="w-full border-collapse">
                    {/* Table Header */}
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[linear-gradient(to_right,#c5ebd1,#f1f5f9)]">
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600 rounded-l-full">
                          Order ID & Method
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Product
                        </th>

                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Sale Details
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Pic
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Address
                        </th>
                        <th className="px-3 py-2 text-left text-[16px] font-medium text-gray-600">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-sm font-medium text-gray-600 rounded-r-full">
                          Cancel
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th>&nbsp;</th>
                    </tr>

                    {/* Table Body */}

                    <tbody className="overflow-scroll">
                      {ordersData?.map((order, index) => (
                        <tr key={order._id} className="">
                          <td className="px-3 py-2">
                            <p className=" font-medium text-[13px]">
                              {splitCode(order.order_id, 1)}
                            </p>
                            <p>{splitCode(order.order_id, 2)}</p>
                            <p className="opacity-45">{order.payment_method}</p>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-gray-900 text-[13px]">
                              {order.items.product?.name}
                            </div>
                            <div className="font-medium text-gray-500 text-[13px]">
                              {order.items.product?.from}
                            </div>
                            <div className="text-[16px] text-gray-500">
                              {order.total_quantity / 1000} kilo gram
                            </div>
                          </td>

                          <td className="px-3 py-2">
                            <div className="text-[14px] text-gray-500 line-through">
                              ₹{order.price.discountPrice}
                            </div>

                            <div className="font-bold text-gray-600">
                            ₹{order.price.grandPrice}
                            </div>

                            <div className="text-gray-600">
                              {datCoverter(order.time)}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <img
                              src={order?.items[0]?.product?.pics?.one}
                              alt={order.name}
                              className="w-12 h-12 object-cover"
                            />
                          </td>
                          <td className="Sansation-font">
                            <p className="font-bold">{order.user.username} </p>
                            <span className="opacity-65">
                              <p>
                                {order.delivery_address.locationType},{" "}
                                {order.delivery_address.streetAddress}
                              </p>
                              {/* <p>{order.delivery_address.exactAddress}</p> */}
                              <p>
                                {order.delivery_address.state?.toUpperCase()},
                                {order.delivery_address.pincode}
                              </p>
                            </span>
                          </td>
                          <td className="px-3 py-2 space-x-2">
                            <span
                            style={{background:`linear-gradient(215deg,#4a4d4c,${colorProvider(order.order_status)})`}}
                              className={`p-1 rounded-full bg-[] py-4`}
                            >
                              {/*  */}

                              <select
                                className={`px-3 py-2 bg-transparent rounded-full text-white ${order.order_status!=='Cancelled'&&order.order_status!=='Delivered'?'opacity-100 custom-selectero':'opacity-65 custom-selecteror'}`}
                                name=""
                                disabled={order.order_status!=='Cancelled'&&order.order_status!=='Delivered'?false:true}
                                value={order.order_status}
                                defaultValue={order.order_status}
                                onChange={(e) => {
                                  updateOrdersStatus({
                                    id: order._id,
                                    value: e.target.value,
                                    index,
                                  });
                                }}
                                id=""
                              >
                                <option
                                  style={{
                                    backgroundColor: "#aa880050",
                                    color: "black",
                                  }}
                                  value="Pending"
                                >
                                  Pending
                                </option>
                                <option
                                  style={{
                                    backgroundColor: "#00aa7450",
                                    color: "black",
                                  }}
                                  value="Processed"
                                >
                                  Processed
                                </option>
                                <option
                                  style={{
                                    backgroundColor: "#aa520050",
                                    color: "white",
                                  }}
                                  value="Shipped"
                                >
                                  Shipped
                                </option>
                                <option
                                  style={{
                                    backgroundColor: "#3eaa0050",
                                    color: "black",
                                  }}
                                  value="Delivered"
                                >
                                  Delivered
                                </option>
                                <option
                                  style={{
                                    backgroundColor: "#aa003e50",
                                    color: "black",
                                  }}
                                  value="Cancelled"
                                >
                                  Cancelled
                                </option>
                              </select>
                            </span>
                          </td>
                          <td onClick={() => order.order_status!=='Cancelled'&&order.order_status!=='Delivered'?handleCancel(order._id, index):showToast(`Order already ${order.order_status}`,'error')}>
                            <i className={`ri-close-circle-fill text-[30px] text-center pl-5 ${order.order_status!=='Cancelled'&&order.order_status!=='Delivered'?'opacity-100':'opacity-25'}`}></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Pagination */}
            <div className="absolute bottom-8 right-[12%] translate-x-[100px]">
              <button className="bg absolute-gray-200 bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-full">
                Page 01
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full ml-2">
                <i className="ri-skip-right-line text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Recents page={'orders'} datas={ordersData} />
    </>
  );
};

export default Orders;
