import React, { useState } from 'react'
import img from '../../assets/images/login1.png'
import { MainContent } from '../../constants/mainContent'

const Register = () => {

    return (
        <div
            className="w-screen h-screen flex items-center justify-center md:justify-start xl:p-20 lg:p-16 md:p-10 p-4 bg-red-100"
            style={{
                backgroundImage: `url(${img})`,
                // backgroundSize: 'cover',
                // backgroundPosition:"center"
            }}
        >
            <div className='max-w-lg p-7 bg-[#ffffff6a] backdrop-blur-md rounded-xl border'>
                <div className="flex justify-center mb-6">
                    <img
                        src={MainContent.logo}
                        alt="Rivo Logo"
                        className="w-[200px] h-auto"
                    />
                </div>
                <h1 className="text-2xl text-bg-color font-medium text-center mb-6">
                    Sign Up Now
                </h1>
                <form className='grid grid-cols-1 gap-5'>
                    <div className='grid grid-cols-2 gap-5'>
                        <input
                            type="text"
                            placeholder="First name"
                            className="w-full p-2 border rounded-md focus:outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            className="w-full p-2 border rounded-md focus:outline-none"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full p-2 border rounded-md focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded-md focus:outline-none"
                    />
                    <p className='text-xs'>Use 8 or more characters with a mix of letters, numbers & symbols</p>
                    <div className='flex gap-4 items-start'>
                        <input type="checkbox" />
                        <p className='text-sm'>By creating an account, I agree to our Terms of use and Privacy Policy </p>
                    </div>
                    <div className='flex gap-4 items-start'>
                        <input type="checkbox" />
                        <p className='text-sm'>By creating an account, I am also consenting to receive SMS
                            messages and emails, including product new feature updates,
                            events, and marketing promotions. </p>
                    </div>

                    <div className='flex items-center gap-5'>
                        <button className=" whitespace-nowrap py-2 px-10 bg-bg-color text-white font-medium rounded-full ">
                            Sign Up
                        </button>
                        <p className='text-sm'>Already have an account? <span className="text-bg-color cursor-pointer">Sign in</span>  </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register