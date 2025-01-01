import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


export default function CollectionCard({ pos, data, type }) {

  const navigate = useNavigate()

  return ( data?.name &&
    <div onClick={()=>console.log(data)} className={`h-80  min-w-44 max-w-44 md:min-w-56 md:max-w-56 flex flex-col justify-center items-center rounded-[40px] relative group`}>
      {/* <img className="px-0 max-w-[80px] shadowed opacity-20 absolute" src={data.pic} alt="" /> */}

      <span layoutId='full' className='w-full h-auto bg-[linear-gradient(#ffffff70,#ffffff30)] flex flex-col md:px-10 px-6 rounded-[30px]  md:rounded-br-[120px] rounded-br-[100px] flex-1 justify- gap-2 pb-0'>
        <span className='mt-10 flex flex-col gap-3 '>
          <h1 layoutId='oi' className='md:text-[28px] text-[21px] font-medium leading-none text-[#14532d]'>{data?.name}</h1>
          {/* <p className='opacity-30' >{data.category.name}</p> */}
          <span className='flex flex-col'>
            <><p className='opacity-30' >{data?.description}</p></>
            {/* <p className='opacity-60 text-[25px] font-bold text-[#14532d]' >{data.description}</p> */}

          </span>
        </span>
        <button onClick={() => type === 'product' ? (navigate('/user/productPage', { state: { id: data._id } })) : navigate(`/user/collection/${data.name}/products`, { state: { products: data?.products, action: 'collection', title: data?.name, img: data?.pic } })} className='flex justify-start items-center font-bold rounded-full text-white absolute top-0 -right-3 bg-[linear-gradient(45deg,#789985,#b4c2ba)] overflow-hidden  w-[40px] h-[40px] md:w-[70px] md:h-[70px] group-hover:scale-125 duration-500'>
        <img className='group-hover:-translate-x-full  w-[40px] h-[40px] md:w-[70px] md:h-[70px] md:p-5 p-2 brightness-[100]  duration-500' src="/bag-2-1.svg" alt="" />
        {/* <i className="ri-shopping-bag-line font-thin rounded-full  w-[40px] h-[40px] md:w-[70px] md:h-[70px] text-[25px]  group-hover:-translate-x-full duration-500"></i> */}
        <img className='group-hover:-translate-x-full  w-[40px] h-[40px] md:w-[70px] md:h-[70px] md:p-5 p-2 brightness-[100]  duration-500' src="/arrow-right.svg" alt="" />
        </button>

      </span>
      <img layoutId='oo' className=' h-[120px] w-[120px] object-cover max-h-[120px] -translate-y-[30%] mix-blend-darken drop-shadow-2xl z-20' src={data.pic} alt="" />
      {/* <MotionConfig></MotionConfig> */}
    </div>
  )
}
