import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAddToBookmarkMutation, useCheckItemIntheBookmarkMutation, useRemoveBookmarkItmeMutation } from '../../../services/User/userApi';


export default function Product({ pos, data, type, userData }) {

  const [addToBookmark, { data: addToBookmarkData, isLoading }] = useAddToBookmarkMutation();
  const [checkItemIntheBookmark, { data: bookMarkData }] = useCheckItemIntheBookmarkMutation();
  const [removeBookmarkItme, { data: removeData, isLoading: removeLoading }] = useRemoveBookmarkItmeMutation();

  // const [dPopup,setDPopup] = useState(false);
  const [isMared, setMarked] = useState(false);
  const [isUnmarked, setUnMarked] = useState(false);

  useEffect(() => { checkItemIntheBookmark(data._id) }, [])
  useEffect(() => { if (addToBookmarkData) { setMarked(true) } }, [addToBookmarkData])
  useEffect(() => { if (bookMarkData) { setMarked(true) } }, [bookMarkData])
  useEffect(() => { if (removeData) { setMarked(false) } }, [removeData])

  const bookmarkHandler = (id, action) => {
    if (action === 'remove') {

      removeBookmarkItme(id)

    } else if (action === 'add') {

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
    <div
      onClick={() => console.log(data)}
      style={{ containerType: 'inline-size', '--btn': 'clamp(40px,28cqw,70px)' }}
      className='w-full max-w-56 flex flex-col justify-center items-center rounded-[40px] relative'>
      <img className='w-[clamp(90px,55cqw,120px)] h-[clamp(90px,55cqw,120px)] object-cover oscillater mix-blend-darken drop-shadow-2xl z-20' src={data.pic || data?.pics?.one} alt="" />

      <span className='w-full h-auto bg-[linear-gradient(#ffffff40,#ffffff70)] flex flex-col px-[clamp(14px,12cqw,40px)] rounded-[30px] rounded-br-[clamp(60px,45cqw,120px)] pt-10 flex-1 gap-2 pb-7'>
        <span className='mt-2'>
          <h
            onClick={console.log(data)}
            className='block text-[clamp(16px,11cqw,28px)] leading-tight font-medium cursor-pointer break-words line-clamp-2'>{data.name}</h>
          <span className='flex flex-col'>
            <s><p className='opacity-30 text-[clamp(12px,8cqw,16px)]'>₹ {data?.regularPrice}</p></s>
            <p className='opacity-60 text-[clamp(16px,11cqw,25px)] font-bold text-[#14532d]'>₹ {data?.salePrice}</p>

            {userData?._id && !isLoading && !removeLoading ?
              <img src={isMared ? '/hearted.svg' : '/heart.svg'} onClick={() => isMared ? bookmarkHandler(data._id, 'remove') : bookmarkHandler(data._id, 'add')} className='w-[var(--btn)] h-[var(--btn)] opacity-45 absolute right-0 bottom-[calc(var(--btn)+0.25rem)] rounded-full p-[22%] hover:scale-125 duration-500' />
              : isLoading || removeLoading ?
                <div className="flex gap-1 absolute right-4 bottom-[calc(var(--btn)+1.25rem)]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-3 h-3 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} removeLoading></div>
                  ))}
                </div>
                : userData?._id ?
                  <img src={isMared ? '/hearted.svg' : '/heart.svg'} onClick={() => isMared ? bookmarkHandler(data._id, 'remove') : bookmarkHandler(data._id, 'add')} className='w-[var(--btn)] h-[var(--btn)] opacity-45 absolute right-0 bottom-[calc(var(--btn)+0.25rem)] rounded-full p-[22%] hover:scale-125 duration-500' />
                  : ''}
          </span>
        </span>

        <button onClick={() => type === 'product' ? (navigate('/user/productPage', { state: { id: data._id } })) : navigate(`/user/collection/${data.name}/products`, { state: { products: data?.products, action: 'collection' } })} className='flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-1 bg-[linear-gradient(#b4c2ba,#789985)] overflow-hidden w-[var(--btn)] h-[var(--btn)] hover:scale-125 duration-500 group'>
          <img className='shrink-0 w-full h-full p-[22%] brightness-[100] group-hover:-translate-x-full duration-500' src="/bag-2-1.svg" alt="" />
          <img className='shrink-0 w-full h-full p-[22%] brightness-[100] group-hover:-translate-x-full duration-500' src="/arrow-right.svg" alt="" />
        </button>
      </span>
    </div>
  )
}
