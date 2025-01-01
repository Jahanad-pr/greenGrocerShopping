// Bismillah
import React, { useEffect } from "react"
import { Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import Login from './components/pages/Admin/Authentication/Login'
import Header from './components/parts/Main/Header'
import AdminNav from './components/parts/Main/AdminNav'
import DashHome from './components/pages/Admin/Main/DashHome'
import Users from './components/pages/Admin/Config/Users'
import UserManage from './components/pages/Admin/Config/UserManage'
import Signup from './components/pages/User/Authentication/Signup'
import Home from './components/pages/User/main/Home'
import Categories from './components/pages/Admin/Config/Categories'
import CategoryManage from './components/pages/Admin/Config/CategoryManage'
import Navigator from './components/parts/Main/Navigator'
import UserProtecter from "./components/pages/User/Authentication/UserProtecter"
import SignDetails from "./components/pages/User/Authentication/signDetails"
import Collections from "./components/pages/Admin/Config/Collections"
import CollectionManage from "./components/pages/Admin/Config/CollectionManage"
import Product from "./components/parts/Cards/Product"
import Products from "./components/pages/User/main/Products"
import ProductManage from "./components/pages/Admin/Config/PrductManage"
import Productes from "./components/pages/Admin/Config/Product"
import ProductPage from './components/pages/User/main/Subs/ProductPage'
import AdminProtucter from "./components/pages/Admin/Authentication/AdminProtucter"
import ResetPassword from "./components/pages/User/Profile/ResetPassword"
import Logout from "./components/pages/User/Profile/Logout"
import ProductReview from "./components/pages/User/main/Subs/ProductReview"
import ProductsAll from "./components/pages/User/main/Subs/ProductsAll"
import ProductDetails from "./components/pages/User/main/Subs/ProductDetails"
import Main from "./components/pages/User/Profile/Main"
import Profiler from "./components/pages/User/Profile/Profiler"
import Address from "./components/pages/User/Profile/Address"
import ManageAddress from "./components/pages/User/Profile/ManageAdress"
import OrderSummary from "./components/pages/User/main/Subs/OrderSummary"
import OrderSuccess from "./components/pages/User/main/Subs/OrderSuccess"
import OrderPayment from "./components/pages/User/main/Subs/OrderPayment"
import OrderList from "./components/pages/User/Profile/OrderList"
import Orders from "./components/pages/Admin/Config/Orders"
import OrderDetails from "./components/pages/User/Profile/OrderDetails"
import Cart from "./components/pages/User/main/Cart"
import Search from "./components/pages/User/main/Search"
import NotFound from "./components/pages/User/main/Subs/NotFound"
import Bookmark from "./components/pages/User/main/Bookmark"
import Offers from "./components/pages/Admin/Config/Offers";
import OfferManage from "./components/pages/Admin/Config/Offermanage";
import { Tostify } from "./components/parts/Toast/Tostify";
import Coupons from "./components/pages/Admin/Config/Coupons";
import CouponManage from "./components/pages/Admin/Config/CouponManage";
import CouponsList from "./components/pages/User/Profile/CouponsList";
import Wallet from "./components/pages/User/Profile/Wallet";
import SalesReport from "./components/pages/Admin/Config/SalesReport";
import InvoicePage from "./components/pages/User/main/Subs/InvoicePage";
import Map from "./components/pages/User/main/Map";

export default function App() {

  
  const location = useLocation()
  const navigator = useNavigate()
  
  useEffect(()=>{
    if(location.pathname==='/'||location.pathname==='/user'){
      navigator('/user/home')
    }
  },[location])

  return (
    <>
      <Tostify title="Error" position="bottom-left" />
      <Toaster position="top-center" />
      <div className="w-screen h-screen flex overflow-hidden font-['lufga']">
        {location.pathname.startsWith('/user/') && !location.pathname.startsWith('/user/sign') && <UserProtecter><Navigator /></UserProtecter>}
        {location.pathname.startsWith('/admin/') && <AdminProtucter><Header /></AdminProtucter>}
        {location.pathname.startsWith('/admin/') && <><AdminNav /></>}

          <Routes>
            <Route path="/auth/admin/login" element={<AdminProtucter><Login /></AdminProtucter>} />
            <Route path="/admin/home" element={<AdminProtucter><DashHome /></AdminProtucter>} />
            <Route path="/admin/Customers" element={<AdminProtucter><Users /></AdminProtucter>} />
            <Route path="/admin/Customers/manage" element={<AdminProtucter><UserManage /></AdminProtucter>} />
            <Route path="/admin/Products" element={<AdminProtucter><Productes /></AdminProtucter>} />
            <Route path="/admin/Products/manage" element={<AdminProtucter><ProductManage /></AdminProtucter>} />
            <Route path="/admin/Category" element={<AdminProtucter><Categories /></AdminProtucter>} />
            <Route path="/admin/Category/manage" element={<AdminProtucter><CategoryManage /></AdminProtucter>} />
            <Route path="/admin/Collection" element={<AdminProtucter><Collections /></AdminProtucter>} />
            <Route path="/admin/Collection/manage" element={<AdminProtucter><CollectionManage /></AdminProtucter>} />
            <Route path="/admin/Offers/manage" element={<AdminProtucter><OfferManage /></AdminProtucter>} /> 
            <Route path="/admin/Offers" element={<AdminProtucter><Offers /></AdminProtucter>} /> 
            <Route path="/admin/Orders" element={<AdminProtucter><Orders /></AdminProtucter>} />
            <Route path="/admin/sales" element={<AdminProtucter><SalesReport /></AdminProtucter>} />
            <Route path="/admin/Coupons" element={<AdminProtucter><Coupons /></AdminProtucter>} />
            <Route path="/admin/Coupons/manage" element={<AdminProtucter><CouponManage /></AdminProtucter>} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/user/signup" element={ <UserProtecter><Signup /></UserProtecter> } />
          <Route path="/user/home" element={ <UserProtecter><Home /></UserProtecter> } />
          <Route path="/user/products" element={ <UserProtecter><Products /></UserProtecter> } />
          <Route path="/user/search" element={ <UserProtecter><Search /></UserProtecter> } />
          <Route path="/user/productpage" element={ <UserProtecter><ProductDetails /></UserProtecter> } />
          <Route path="/user/collection/:name/products" element={ <UserProtecter><ProductsAll /></UserProtecter> } />
          <Route path="/user/productpage/:id/reviews" element={ <UserProtecter><ProductReview /></UserProtecter> } />
          <Route path="/user/profile/logout" element={ <UserProtecter><Logout /></UserProtecter> } />
          <Route path="/user/profile/:id" element={ <UserProtecter><Main /></UserProtecter> } />
          <Route path="/user/profile/:id/manage" element={ <UserProtecter><Profiler /></UserProtecter> } />
          <Route path="/user/profile/resetpassword" element={ <UserProtecter><ResetPassword /></UserProtecter> } />
          <Route path="/user/profile/address" element={ <UserProtecter><Address /></UserProtecter> } />
          <Route path="/user/profile/manageaddress" element={ <UserProtecter><ManageAddress /></UserProtecter> } />
          <Route path="/user/ordersummery" element={ <UserProtecter><OrderSummary /></UserProtecter> } />
          <Route path="/user/payment" element={ <UserProtecter><OrderPayment /></UserProtecter> } />
          <Route path="/user/success" element={ <UserProtecter><OrderSuccess /></UserProtecter> } />
          <Route path="/user/Orders" element={ <UserProtecter><OrderList /></UserProtecter> } />
          <Route path="/user/OrderDetails" element={ <UserProtecter><OrderDetails/></UserProtecter> } />
          <Route path="/user/cart" element={ <UserProtecter><Cart/></UserProtecter> } />
          <Route path="/user/bookmarks" element={ <UserProtecter><Bookmark/></UserProtecter> } />
          <Route path="/user/Coupons" element={ <UserProtecter><CouponsList/></UserProtecter> } />
          <Route path="/user/Wallet" element={ <UserProtecter><Wallet/></UserProtecter> } />
          <Route path="/user/Order/Invoice" element={ <UserProtecter><InvoicePage /></UserProtecter> } />
          <Route path="/user/map" element={ <UserProtecter><Map /></UserProtecter> } />
          </Routes>

        <Routes>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>

      </div>

    </>
  );
}
