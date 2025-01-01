import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAddToBookmarkMutation, useCheckItemIntheBookmarkMutation, useRemoveBookmarkItmeMutation } from '../../../services/User/userApi';


export default function Product({pos,data,type,userData}) {

  const [addToBookmark, { data: addToBookmarkData,isLoading }] = useAddToBookmarkMutation();
  const [checkItemIntheBookmark, { data: bookMarkData }] = useCheckItemIntheBookmarkMutation();
  const [removeBookmarkItme, { data: removeData,isLoading:removeLoading }] = useRemoveBookmarkItmeMutation();

  // const [dPopup,setDPopup] = useState(false);
  const [isMared,setMarked] = useState(false);
  const [isUnmarked,setUnMarked] = useState(false);

  useEffect(()=>{ checkItemIntheBookmark(data._id) },[])
  useEffect(()=>{ if(addToBookmarkData){ setMarked(true) } },[addToBookmarkData])
  useEffect(()=>{ if(bookMarkData){ setMarked(true)  } },[bookMarkData])
  useEffect(()=>{ if(removeData){ setMarked(false)  } },[removeData])

  const bookmarkHandler = (id,action) => {
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


  const navigate = useNavigate()

  return (
    <div className={`h-80 md:min-w-56 min-w-44 max-w-44 md:max-w-56 flex flex-col justify-center items-center rounded-[40px] relative`}>
        <img className='max-w-[120px] h-[120px] w-[120px] object-cover max-h-[120px]  oscillater mix-blend-darken drop-shadow-2xl z-20' src={data.pic||data?.pics?.one} alt="" />
        {/* <img className="px-0 max-w-[80px] shadowed opacity-20 absolute" src={data.pic||data?.pics?.one} alt="" /> */}

        <span className='w-full h-auto bg-[linear-gradient(#ffffff40,#ffffff70)] flex flex-col px-10 rounded-[30px] md:rounded-br-[120px] rounded-br-[100px] pt-10 flex-1 justify- gap-2 pb-0'>
          <span className='mt-2'>    

        <h1 className='md:text-[28px] text-[21px] font-medium'>{data.name}</h1>
        {/* <p className='opacity-30' >{data.category.name}</p> */}
        <span className='flex flex-col'>
        <s><p className='opacity-30' >₹ {data?.regularPrice}</p></s>
        <p className='opacity-60 md:text-[25px] text-[20px] font-bold text-[#14532d]' >₹ {(data?.regularPrice - (data?.discount?.isPercentage ? (data?.regularPrice * data?.discount?.value / 100) : (data?.discount?.value || 0))).toFixed(2)}</p>

        {userData?._id &&!isLoading&&!removeLoading? <img src={isMared?'/hearted.svg':'/heart.svg'} onClick={()=>isMared?bookmarkHandler(data._id,'remove'):bookmarkHandler(data._id,'add')} className={`w-20 h-20 opacity-45 absolute top-28 right-0 rounded-full p-5 hover:scale-125 duration-500 `}></img>:isLoading||removeLoading?
        <div className="flex gap-1 absolute top-[140px] right-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}removeLoading
          ></div>
        ))}
      </div>:userData?._id?<img src={isMared?'/hearted.svg':'/heart.svg'} onClick={()=>isMared?bookmarkHandler(data._id,'remove'):bookmarkHandler(data._id,'add')} className={`w-20 h-20 opacity-45 absolute top-28 right-0 rounded-full p-5 hover:scale-125 duration-500 `}></img>:''}
        
        </span>
          </span>
        <button onClick={()=>type==='product'?(navigate('/user/productPage',{ state:{ id:data._id } })):navigate(`/user/collection/${data.name}/products`,{ state:{products:data?.products,action:'collection'} })} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 md:right-3 right-3 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[40px] h-[40px] md:w-[70px] md:h-[70px] hover:scale-125 duration-500 group'>
        <img className='group-hover:-translate-x-full w-[40px] h-[40px] md:w-[70px] md:h-[70px] md:p-4 p-2 brightness-[100]  duration-500' src="/bag-2-1.svg" alt="" />
        {/* <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
        <img className='group-hover:-translate-x-full w-[40px] h-[40px] md:w-[70px] md:h-[70px] p-2 md:p-5 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
        </button>



        </span>
    </div>
  )
}
