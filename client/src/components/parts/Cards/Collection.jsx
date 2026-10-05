import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CollectionCard({ pos, data, type }) {
  const navigate = useNavigate()

  return (data?.name &&
    <div
      style={{ containerType: 'inline-size', '--btn': 'clamp(40px,28cqw,70px)' }}
      className=" w-full max-w-56 flex flex-col justify-center items-center rounded-[40px] relative group">

      <span layoutId='full' className='w-full h-auto bg-[linear-gradient(#ffffff70,#ffffff30)] flex flex-col px-[clamp(14px,12cqw,40px)] pb-10 rounded-[30px] rounded-br-[clamp(60px,45cqw,120px)] flex-1 gap-2'>
        <span className='mt-10 flex flex-col gap-2'>
          <h1 layoutId='oi' className='text-[clamp(17px,12cqw,28px)] font-medium leading-tight text-[#14532d] break-words line-clamp-2'>{data?.name}</h1>
          <p className='opacity-30 text-[clamp(12px,8cqw,16px)] leading-snug line-clamp-2 break-words'>{data?.description}</p>
        </span>
        <button
          onClick={() => type === 'product' ? (navigate('/user/productPage', { state: { id: data._id } })) : navigate(`/user/collection/${data.name}/products`, { state: { products: data?.products, action: 'collection', title: data?.name, img: data?.pic } })}
          className='flex justify-start items-center font-bold rounded-full text-white absolute top-0 -right-1 bg-[linear-gradient(45deg,#789985,#b4c2ba)] overflow-hidden w-[var(--btn)] h-[var(--btn)] group-hover:scale-125 duration-500'>
          <img className='shrink-0 w-full h-full p-[22%] brightness-[100] group-hover:-translate-x-full duration-500' src="/bag-2-1.svg" alt="" />
          <img className='shrink-0 w-full h-full p-[22%] brightness-[100] group-hover:-translate-x-full duration-500' src="/arrow-right.svg" alt="" />
        </button>
      </span>

      <img layoutId='oo' className='w-[clamp(90px,55cqw,120px)] h-[clamp(90px,55cqw,120px)] object-cover -translate-y-[30%] mix-blend-darken drop-shadow-2xl z-20' src={data.pic} alt="" />
    </div>
  )
}