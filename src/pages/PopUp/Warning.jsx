import React from 'react'
import { BiSolidError } from 'react-icons/bi'
import Button from '../../components/Button'

const id = "Product ID - A15PM"

const Warning = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-2/5 p-5 pt-10 space-y-8">
                <div className="flex items-center  text-[#771505] justify-center gap-2 text-3xl">
                    <div className="text-6xl">
                        <BiSolidError />
                    </div>
                    <h1>Warning</h1>
                </div>
                <div className="">
                    <h4 className="lg:text-lg  md:text-base text-center text-sm">
                        Are you sure to Delete <b>{id}</b> ?
                    </h4>
                </div>
                <div className='bg-[#FFE9D9] py-2 after:w-4 px-10 md:text-lg text-sm after:h-full after:bg-[#FA703F] after:absolute relative after:top-0 after:left-0'>
                    <h1 className="text-[#BC4C2E] font-medium text-center">By rejecting this product , you won’t be able to see data in dashboard.</h1>
                </div>

                <div className="flex gap-4 flex-wrap items-center justify-center">
                    <button className='md:px-5 px-4 py-2 md:text-base text-xs border-2 border-[#DF7272] text-[#DF7272] uppercase'>Cancel</button>
                    <button className='md:px-8 px-7 py-2 md:text-base text-xs border-2 border-[#DF7272] bg-[#DF7272] text-[#fff] uppercase'>Yes , Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Warning