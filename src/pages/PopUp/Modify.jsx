import React from 'react'
import { BiSolidError } from 'react-icons/bi'
import Button from '../../components/Button'

const id = "Product ID - A15PM"
import modify from './modify.svg'


const Modify = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl shadow-lg w-11/12 md:w-2/3 lg:w-2/5 p-5 pt-10 space-y-8">
                <div className="flex items-center justify-center gap-2 text-3xl">
                    <img src={modify} alt="" />
                </div>
                <div className="">
                    <h4 className="lg:text-lg  md:text-base text-center text-sm ">
                        Are you sure to Delete <b>{id}</b> ?
                    </h4>
                </div>
                <div className='bg-[#2C6AE5]/20 py-2 after:w-4 px-10 md:text-lg text-sm after:h-full after:bg-[#2C6AE5] after:absolute relative after:top-0 after:left-0'>
                    <h1 className="text-[#2C6AE5] font-medium text-center">By modifying this product, you are able to see update data in Product Management.
                    </h1>
                </div>

                <div className="flex gap-4 flex-wrap items-center justify-center">
                    <button className='md:px-5 px-4 py-2 md:text-base text-xs border-2 border-[#2C6AE5] text-[#2C6AE5] uppercase'>Cancel</button>
                    <button className='md:px-8 px-7 py-2  md:text-base text-xs border-2 border-[#2C6AE5] bg-[#2C6AE5] text-[#fff] uppercase'>Yes , Modify</button>
                </div>
            </div>
        </div>
    )
}

export default Modify