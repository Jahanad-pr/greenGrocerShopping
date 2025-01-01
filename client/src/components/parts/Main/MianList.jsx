import React from 'react'
import Bookmark from '../Cards/Bookmarks'
import Carts from '../Cards/Carts'

export default function MianList({ child, type }) {
    return (
        <div className='w-full h-80 flex flex-wrap gap-5'>

            {
                type==='marks' &&
                <>
                    <Bookmark />
                    <Bookmark col={true} />
                </>
            }

{
                type==='carts' &&
                <>
                    <Carts />
                    <Carts col={true} />
                </>
            }

        </div>
    )
}
