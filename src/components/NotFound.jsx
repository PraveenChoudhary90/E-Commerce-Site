import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-color1 text-center px-4">
            <h1 className="lg:text-9xl md:text-6xl text-4xl  font-bold text-bg-color">404</h1>
            <h2 className="lg:text-5xl ms:text-4xl text-3xl font-semibold text-gray-800 mt-2">Page Not Found</h2>
            <p className="text-gray-600 mt-4">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="mt-6 bg-bg-color text-white px-6 py-3 rounded-lg shadow-md ">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
