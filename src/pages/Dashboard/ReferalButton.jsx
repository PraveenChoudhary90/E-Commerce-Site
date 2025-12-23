import React from 'react';
import Swal from 'sweetalert2';

const ReferalButton = () => {
 
    const referCode = `${window.location.origin}/register?referral=MAIN_REF_12345`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referCode)
            .then(() => Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Referral link has been copied.',
                timer: 2000,
                showConfirmButton: false
            }))
            .catch(err => console.error('Failed to copy:', err));
    };

    return (
        <div>
            {/* <div className='w-full flex sm:flex-row flex-col justify-between bg-white rounded-2xl p-3'> */}
                <div>
                {/* <h1 className='text-lg font-medium'>👋</h1>
                    <h1 className='text-lg font-medium'>  Invite new customers to join on board!</h1> */}
                  
                {/* </div> */}
                {/* <div className='flex items-center justify-between gap-3'>
                    <p className='font-normal text-sm'>Referral Code: MAIN_REF_12345</p>
                    <button 
                        onClick={handleCopy} 
                        className='w-12 h-12 flex items-center justify-center text-white text-xs bg-bg-color rounded-full'
                    >
                        Copy
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default ReferalButton;