import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetChartsDetailsMutation, useGetTopUsersMutation } from "../../../services/Admin/adminApi";

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default function Recents({datas,page}) {

  const [recentOrders, setRecentOrders] = useState([]);
  const [ getTopUsers, { data } ] = useGetTopUsersMutation()
  const [ getChartsDetails, { data:topData }] = useGetChartsDetailsMutation()
  

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if(topData){
      console.log(topData)
    }
  }, [topData]);

  useEffect(()=>{ 
    if(page==='users'){ getTopUsers() }
    if(page==='products'){ getChartsDetails('filterby=topProducts&period=custom') }
    if(page==='categories'){ getChartsDetails('filterby=topCategories&period=custom') }
  },[])

  useEffect(()=>{

    if(page==='orders'){
      const sortedOrders = [...datas]
        .sort((a, b) => b.price.grandPrice - a.price.grandPrice || b.total_quantity - a.total_quantity)
        .slice(0, 7);
      return setRecentOrders(sortedOrders);
    }
    
    if (datas && Array.isArray(datas)) {
      const sortedOrders = [...datas]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 7);
      setRecentOrders(sortedOrders);
    } else {
      setRecentOrders([]);
    }
  },[datas])


  return (
    <div className="w-[25%] h-full px-10 py-[86px]">
      {location.pathname.startsWith("/admin/Category") && (
        <div
          onClick={() => navigate("/admin/Category/manage", { state: { name: "" } }) }
          className=" bg-[linear-gradient(to_left,#b9e9b5,#d1ebe8)] my-6 flex  gap-5 items-center justify-center rounded-full" >
          <i className="ri-align-item-vertical-center-line text-[35px]"></i>
          <p className="text-[20px] font-medium">Add Category</p>
        </div>
      )}

      {location.pathname.startsWith("/admin/Collection") && (
        <div
          onClick={() => navigate("/admin/Collection/manage", { state: { name: "" } }) }
          className=" bg-[linear-gradient(to_left,#e2fff8,#e7f4f7)] my-6 flex  gap-5 items-center justify-center rounded-full" >
          <i className="ri-layout-2-line text-[35px]"></i>
          <p className="text-[20px] font-medium">Add Collection</p>
        </div>
      )}

      {location.pathname.startsWith("/admin/Products") && (
        <div
          onClick={() => navigate("/admin/Products/manage", { state: { name: false } }) }
          className=" bg-[linear-gradient(to_left,#e2fff8,#e7f4f7)] my-6 flex  gap-5 items-center justify-center rounded-full" >
          <i className="ri-layout-2-line text-[35px]"></i>
          <p className="text-[20px] font-medium">Add Products</p>
        </div>
      )}

      {location.pathname.startsWith("/admin/Offers") && (
        <div
          onClick={() => navigate("/admin/Offers/manage", { state: { name: false } })}
          className=" bg-[linear-gradient(to_left,#e2fff8,#e7f4f7)] my-6 flex  gap-5 items-center justify-center rounded-full" >
          <i className="ri-percent-fill text-[35px]"></i>
          <p className="text-[20px] font-medium">Add Offer</p>
        </div>
      )}

      {location.pathname.startsWith("/admin/Coupons") && (
        <div
          onClick={() => navigate("/admin/Coupons/manage", { state: { name: false } })}
          className=" bg-[linear-gradient(to_right,#f6ebcc,#07090c20)] my-6 flex  gap-5 items-center justify-center rounded-full" >
          <i className="ri-ticket-line text-[35px]"></i>
          <p className="text-[20px] font-medium">Add Coupon</p>
        </div>
      )}

      { <h1 className="text-[30px] font-bold my-5 mb-5 font-['lufga']">
        {page==='dash'?"Recent Orders":page==='users'?'Top users':page==='orders'?'Top Purchases':
        page==='products'?'Top Products':page==='categories'?'Top Categories':""}</h1>}

      <span className="flex flex-col gap-5">

        {
          page === 'users' && data?.length > 0 && data?.map((user,index)=>{
            return (
              <div
                key={user._id}
                style={{ animationDelay: `${index * 150}ms` }}
                className="w-full flex items-center gap-2 bg-[#f0f1f3] px-5 pr-8 py-3 rounded-[41px] grayscale-0 opacity-0 hover:scale-[0.90] duration-500 animate-[slideIn_0.5s_ease-out_forwards]"
              >
                <img
                  className="w-12 h-12 rounded-full object-cover grayscale-0 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] delay-[200ms]"
                  src={user.profileUrl}
                  alt=""
                />
                <span className="flex flex-col flex-1 leading-none">
                  <p className="font-bold text-[13px]">
                    {user.username}
                  </p>
                  <p className="opacity-45">{user.email}</p>
                  <p className="opacity-45">{user.phoneNumber}</p>
                  <span className="flex gap-5 items-center text-orange-500">
                  { user.orders ? <p>{user.orders} Orders</p>:''}
                  { user.wallet?.amount ? <p className="m-0">{user.wallet?.amount} Rs in Wallet</p>:''}
                  </span>
                </span>
              </div>
            )
          })
        }

        {
          (page === 'products'||page==='categories') && topData?.length > 0 && topData.map((order, index) => {
            return (
              <div
                key={index}
                style={{ animationDelay: `${index * 150}ms` }}
                className="w-full flex items-center gap-2 pl-10 bg-[#f0f1f3] px-5 pr-8 py-3 rounded-[41px] grayscale-0 opacity-0 hover:scale-[0.90] duration-500 animate-[slideIn_0.5s_ease-out_forwards]"
              >
                { page==='products' &&
                  <img
                    className="w-12 h-12 rounded-full object-cover grayscale-0 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] delay-[200ms]"
                    src={order.productImage}
                    alt=""
                  />

                }
                <span className="flex flex-col flex-1 leading-none">
                  <p className="font-bold text-[13px]">
                    {order.categoryName}
                  </p>
                  { page === 'products' && <p className="opacity-45">{order.categoryName}</p>}
                  <span className={`flex gap-5 mt-2 items-center ${page==='products'?'text-blue-600':'text-green-600'}`}>
                  {  <p>{order.totalOrders} Orders</p>}
                  { <p className="m-0">{order.totalRevenue} Rs revenur</p>}
                  </span>
                </span>
              </div>
            )
          })
        }

        {recentOrders.length > 0 ? (
          datas?.slice(0, 6).map((order, index) => {
            const orderTime = new Date(order.time);
            const formattedTime = `${orderTime.getDate()} ${orderTime.toLocaleString('default', { month: 'short' })} ago`;

            return (
              <div
                key={order._id}
                style={{ animationDelay: `${index * 150}ms` }}
                className="w-full flex items-center gap-2 bg-[#f0f1f3] px-5 pr-8 py-3 rounded-[41px] grayscale-0 opacity-0 hover:scale-[0.90] duration-500 animate-[slideIn_0.5s_ease-out_forwards]"
                onClick={() => navigate(`/admin/orders/${order._id}`)}
              >
                <img
                  className="w-12 h-12 rounded-full object-cover grayscale-0 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] delay-[200ms]"
                  src={order.items[0]?.product?.pics?.one || 'default-image-url'}
                  alt=""
                />
                <span className="flex flex-col flex-1 leading-none">
                  <p className="font-bold text-[13px]">
                    {order.items[0]?.product?.name}
                    <span className="opacity-65">{order.items.length > 1 && ` and ${order.items.length - 1} more`}</span>
                  </p>
                  <p className="opacity-45">{order.user.username}</p>
                  <p className="opacity-45">{formattedTime}</p>
                </span>
                <span className="text-[#168f68]">
                <p className="text-[20px] font-bold opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] delay-[600ms]">₹{order.price.grandPrice.toFixed(2)}</p>
                <p className="text-[13px] text-gray-600 font-medium opacity-0 animate-[fadeIn_0.3s_ease-out_forwards] delay-[600ms]">{order.total_quantity/1000}{order.total_quantity>=1000?'Kg':'g'}</p>
                </span>
              </div>
            );
          })
        ) : ( !recentOrders &&
          <p className="text-center text-gray-500">No recent orders</p>
        )}
      </span>
    </div>
  );
}
