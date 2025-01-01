import React from "react";



export function Order({ navigate, index, getStatusColor, order, getStatusTextColor }) {

  return <div onClick={() => navigate('/user/OrderDetails', {
    state: order
  })} key={index} className={`duration-500 relative group cursor-pointer hover:scale-[0.98] max-w-[280px] overflow-hidden`}>
    {/* {order.items.length > 1 && <div className={`absolute w-full h-1/2 -left-2 shadow rounded-tl-[109px] rounded-[30px] group-hover:scale-[1.05] duration-500 -z-10 -top-2  ${getStatusColor(order.order_status)}`}></div>}
    {order.items.length > 2 && <div className={`absolute w-full h-1/2 -left-4 shadow rounded-tl-[109px] rounded-[30px] group-hover:scale-[1.10] duration-500 -z-20 -top-4 ${getStatusColor(order.order_status)}`}></div>} */}

    <div className={`flex items-center gap-4`}>

      <div className="flex-grow items-center justify-center flex flex-col overflow-hidden "> 
      <button className={`flex justify-start items-center font-bold rounded-full text-white absolute left-3 ${getStatusColor(order.order_status)} ${order.items.length > 1 ? 'top-[220px] ': 'top-12' } top-0 overflow-hidden w-[70px] h-[70px] hover:scale-125 duration-500 group`}>
        {<i className={`font-thin rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-50 ${order.order_status==='Processed'?'ri-more-line':order.order_status==='Shipped'?'ri-truck-line':order.order_status==='Delivered'?'ri-check-double-line':order.order_status==='Pending'?'ri-close-circle-fill':order.order_status==='Cancelled'?'ri-close-line':''}`}></i>
        }
        <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
      </button>


        <span className={`flex items-center translate-y-[30%] ${order.items.length > 5 ? 'justify-end' : 'justify-center'}`}> <img src={order.items[0].product?.pics?.one} alt="Order Item" className={`max-w-[28%] max-h-[28%] object-cover rounded-[60px] -z-10 drop-shadow-2xl ${order.items.length > 1 ? 'translate-x-5 bg-gray-400 p-3 max-w-[10%] max-h-[10%]' : ''}`} />
        {order.items[1] && <img src={order.items[1].product?.pics?.two} alt="Order Item" className="w-[20%] z-0  min-w-[20%] max-h-[20%] min-h-[20%] object-cover rounded-[60px] drop-shadow-2xl p-2 bg-gray-300 -translate-x-2" /> }
        {order.items[2] && <div className="px-2 py-5 rounded-full bg-gray-300 z-10 -translate-x-6">
          {order.items.length-2} More
        </div> }
        </span>

        <div className="flex justify-between items-start">

          <div className={`w-full flex flex-col gap-1 text-center bg-white p-6 rounded-[30px] ${order.items.length > 1 ? 'rounded-bl-[120px]' : 'rounded-tl-[120px]'} px-12 pt-12 overflow-hidden`}>


            {/* status */}
            <p className={` ${getStatusTextColor(order.order_status)} text-[40px] leading-none bg-yellow-500 font-bold absolute rotate-90 bottom-1/2 group-hover:bottom-[60%] opacity-10 duration-500 group-hover:opacity-25 inline-block w-0 left-[88%]`}>
              {order.order_status.toUpperCase()}
            </p>


            <h1 className="font-bold text-[25px] text-center leading-none font-[lufga]">{order.items[0].product?.name} <br /> <span className="font-medium opacity-65 text-[13px]">{order.items[0].quantity / 1000}Kilo gram</span></h1>
            <p className="text-gray-600 text-[22px] font-mono">₹{order.price.grandPrice.toFixed(2)}</p>
          <p className="text-[13px] text-gray-500 w-full text-center">
            {order.items.length>1 && 'Orderd On'}{order.items.length>1 &&<br></br>}
            <span className={`${order.items.length>1?'opacity-0':'opacity-100'}`}>Orderd on : </span>
            <span>{new Date(order.time).toLocaleDateString()}</span>
          </p>
          </div>
        </div>


      </div>
    </div>
  </div>;
}
