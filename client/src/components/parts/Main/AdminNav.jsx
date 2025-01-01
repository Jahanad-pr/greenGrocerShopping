import React from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Image,
  Ticket,
  CreditCard,
  Grid,
  ListTree,
  Gift,
  Zap,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminNav(){

  const navigator = useNavigate()

  const navigateToPage = (label)=>{
    navigator(`admin/${label}`)
  }

  const menuItems = [
    { icon: (<i className="ri-dashboard-fill text-[24px]"></i>), label: 'home' },
    { icon: (<i className={`ri-user-line text-[24px]`}></i>), label: 'Customers',colors:['#fbdcc9','#d7d6d8'] },
    { icon: (<i className="ri-box-3-line text-[24px]"></i>), label: 'Products' },
    { icon: (<i className="ri-shopping-cart-2-line text-[24px]"></i>), label: 'Orders' },
    { icon: (<i className="ri-image-line text-[24px]"></i>), label: 'Banners' },
    { icon: (<i className="ri-ticket-line text-[24px]"></i>), label: 'Coupons' },
    { icon: (<i className="ri-bank-card-line text-[24px]"></i>), label: 'Payments' },
    { icon: (<i className="ri-dashboard-horizontal-line text-[24px]"></i>), label: 'Collection' },
    { icon: (<i className="ri-align-item-left-line text-[24px]"></i>), label: 'Category' },
    { icon: (<i className="ri-percent-line text-[24px]"></i>), label: 'Offers' },
    { icon: (<i className="ri-customer-service-line text-[24px]"></i>), label: 'Service' },
    { icon: (<i className="ri-chat-3-line text-[24px]"></i>), label: 'Messages' }
  ];

  return (
    <div className="h-screen w-64 bg-white flex pl-8 flex-col py-4 pt-32">
      {menuItems.map((item, index) => (
        <button
          onClick={()=>navigateToPage(item.label)}
          key={index}
          className={`flex items-center space-x-3 px-6 py-3 w-full ${item.colors?`bg-[linear-gradient(${item.colors[0]},${item.colors[1]})]`:''} hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200`}
        >
          {item.icon}
          <span className="text-sm font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};