import React from 'react';
import Button from '../../components/Button';

const FullVideoSection = () => {
    return (
        <div className="flex flex-col gap-4">

            <div className="bg-bg-color1 md:p-10 p-4 rounded-xl flex flex-col lg:flex-row items-center gap-6">
                <div className="lg:w-1/2 flex-col flex gap-2">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold">Product Name</h2>
                    <p className="text-gray-600 md:text-xl">
                        Aenean aliquet lectus vestibulum gravida sed vulputate vitae.
                    </p>
                </div>

                <div className="lg:w-1/2 w-full relative rounded-xl overflow-hidden">
                    <iframe 
                        className="w-full h-56 md:h-64 lg:h-72 rounded-xl" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="Product Video"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default FullVideoSection;
