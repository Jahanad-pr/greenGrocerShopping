import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gg from '../../../assets/Logos/gg.png'

export default function Navigator({userData}) {

  const [expanded, setExpanded] = useState(false);
  

  const navigator = useNavigate()
  const location = useLocation()

  return (
    <div className={`md:h-full overflow-scroll ${expanded ? 'w-[100vw]' : 'md:w-32 w-[calc(100vw_-_40px)]'} md:bg-gradient-to-b bg-[#4f5c511d] backdrop-blur-xl fixed bottom-0 md:relative from-[#e2e7ea] via-[#ecf1f4] pt-6 pb-2 to-[#c8ccce] md:pb-8 md:pt-6 z-50 duration-500 md:rounded-none
    rounded-[30px] rounded-br-[80px] m-[20px] md:m-0`}>

      <> 
        <div className={`w-full overflow-scroll  gap-6 duration-500 md:h-full flex flex-col px-5 md:px-10`}>

        <div className={`w-full h-36 group md:inline-flex hidden  items-center duration-500 gap-4 border-b-2 ${expanded && 'border-gray-400/30'}`}>
          <img onClick={()=>navigator('/user/home')} className='h-14 w-14 object-cover cursor-pointer rounded-full brightness-0' src={gg} alt="" />
          <p className={`text-[25px]  ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'} duration-500 font-bold overflow-hidden`}>Greengrocer</p>

          { 
          <div onClick={()=> setExpanded(!expanded)} className={`w-12 h-12 cursor-pointer ${ expanded && 'bg-gray-300 rotate-180'} ${!expanded && 'group-hover:opacity-100 hover:scale-110 opacity-25 translate-y-5'} grid duration-500 place-items-center rounded-full absolute right-4`}>
            <i className='ri-arrow-right-s-fill text-[30px] leading-none'></i>
          </div>
          }
            
        </div>


        {/* { !location.pathname.startsWith('/user/home')&&!location.pathname.startsWith('/user/products') ?
        <i onClick={()=>navigator(-1)} className="ri-arrow-left-s-fill text-[35px]"></i>:
        <i className="ri-menu-line text-[30px]"></i>
        } */}

        <span className={`flex md:flex-col md:justify-normal justify-between md:items-start items-center duration-500 ${expanded ? 'gap-5' : 'gap-5 md:gap-8'}`}>

        {/* <i onClick={()=>navigator('/user/search')} className="ri-search-line text-[30px] cursor-pointer transition-colors"></i> */}
        <span onClick={()=>navigator('/user/home')} className='flex items-center gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer'>
          <img className='w-8 h-8 duration-500' src="/home.svg" alt="" /> 
        <p className={`text-[20px] font-medium ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'} overflow-hidden duration-500`} >Home</p>
        </span>

        {/* <i className="ri-movie-line text-[30px] cursor-pointer transition-colors"></i> */}
      

        <span onClick={()=>navigator('/user/products')} className='flex items-center gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer'>
        <img className='w-8 h-8 duration-500' src="/bag-2.svg" alt="" />
        {/* <i  className="ri-shopping-bag-line text-[25px] cursor-pointer transition-colors"></i> */}
        <p className={`text-[20px] font-medium  ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'} overflow-hidden duration-500`} >Store</p>
        </span>

        {userData &&
          <>
        <span onClick={()=>navigator('/user/wallet')}  className='hidden md:flex items-center cursor-pointer gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer0'>
        <img className='w-8 h-8 duration-500'  src="/wallet-3.svg" alt="" />
        {/* <i className="ri-wallet-line text-[25px] cursor-pointer transition-colors"></i> */}
        <p className={`text-[20px] font-medium text-nowrap  ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'} overflow-hidden duration-500`}>Wallet</p>
        </span>

        <span onClick={()=>navigator('/user/cart')}  className='hidden md:flex items-center gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer'>
        <img className='w-8 h-8 duration-500'  src="/bag.svg" alt="" />
        {/* <i className="ri-shopping-cart-line text-[25px] cursor-pointer transition-colors"></i> */}
        <p className={`text-[20px] font-medium text-nowrap ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'}  overflow-hidden duration-500`} >Cart list</p>
        </span>

        <span onClick={()=>navigator('/user/bookmarks')} className='hidden md:flex  items-center gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer'>
        <img className='w-8 h-8 duration-500' src="/folder-favorite.svg" alt="" />
        {/* <i onClick={()=>navigator('/user/bookmarks')} className="ri-bookmark-line text-[25px] cursor-pointer transition-colors"></i> */}
        <p className={`text-[20px] font-medium text-nowrap ${!expanded ? 'w-0 opacity-0 ' : 'w-[200px] opacity-100'}  overflow-hidden duration-500`} >Favorites</p>
        </span>

        </>
        }
        <span onClick={()=>navigator('/user/search')} className='flex  items-center gap-6 hover:translate-x-5 hover:opacity-80 duration-500 hover:scale-110 cursor-pointer'>
        <img className='w-8 h-8 duration-500' src="/search-normal.svg" alt="" />
        {/* <i onClick={()=>navigator('/user/bookmarks')} className="ri-bookmark-line text-[25px] cursor-pointer transition-colors"></i> */}
        <p className={`text-[20px] font-medium text-nowrap ${!expanded ? 'w-0 opacity-0 ' : 'w-[200px] opacity-100'}  overflow-hidden duration-500`} >Find</p>
        </span>

        { userData?._id &&
        <div onClick={()=>navigator(`/user/profile/${userData._id}`)} className="md:w-full w-20 md:hidden duration-500  flex items-center gap-4 cursor-pointer">
          <img className='h-10 w-10 object-cover rounded-full' src={userData?.profileUrl||'/ph-pic.jpg'} alt="" />
        </div>

        }


        </span>

        
        <span className='flex-1 duration-500'></span>

        {/* { location.pathname.startsWith('/user/profile') && <i onClick={()=>navigator('/user/profile/logout')} className="ri-logout-circle-r-line text-[30px] text-red-600 hover:scale-110 duration-500 cursor-pointer"></i>}
        { location.pathname.startsWith('/user/profile') && <i onClick={()=>navigator('/user/Wallet')} className="ri-wallet-line text-[30px] text-green-600 hover:scale-110 duration-500 cursor-pointer"></i>} */}
        {/* { userData &&  <i onClick={()=>navigator(`/user/profile/${userData._id}`)} className="ri-user-line text-[30px] cursor-pointer transition-colors"></i>}
        { userData && <i onClick={()=>navigator(`/user/Cart`)}  className="ri-shopping-cart-line text-[30px] cursor-pointer transition-colors"></i>} */}

        { userData?._id &&
        <div onClick={()=>navigator(`/user/profile/${userData._id}`)} className="w-40  duration-500  hidden md:flex items-center gap-4 cursor-pointer">
          <img className='h-14 w-14 object-cover rounded-full' src={userData?.profileUrl||'/ph-pic.jpg'} alt="" />
          <span className={` ${!expanded ? 'w-0 opacity-0' : 'w-[200px] opacity-100'}  overflow-hidden duration-500`}>
          <p className='text-[20px] leading-none font-bold duration-500 text-nowrap'>{userData?.username}</p>
          <p className='text-[13px] leading-none opacity-65 duration-500 text-nowrap'>{userData?.email}</p>
          </span>
        </div>

        }
          
        </div>
      </>


        
    </div>
  )
}
