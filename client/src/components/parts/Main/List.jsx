import React, { useEffect } from 'react'
import Product from '../Cards/Product'

export default function List({listData}) {

  // useEffect(()=>{ console.log(listData.data) },[listData.data])

  return (
    <div className='w-full auto'>
        <div className="w-full h-full flex flex-col justify-between">

            <div className='flex my-10 mt-20 items-center justify-center'>
            <h1 className={`text-[30px] ${listData.ml?'ml-40':''} font-semibold`}>{''}</h1>
            <span className='flex-1'></span>
            </div>

            <div className={`flex w-full h-auto gap-10 overflow-x-scroll flex-wrap`}>
              {
                listData?.data?.map((data)=>{
                  
                  <Product />
                })
              }
            {/* <Product pos={listData.ml?1:0} /> */}
  
            </div>
        </div>
    </div>
  )
}
