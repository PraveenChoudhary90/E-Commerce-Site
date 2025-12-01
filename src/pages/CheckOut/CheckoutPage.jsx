import React, { useState } from "react";
import img from '../../assets/productlist/img.jpg'
const CheckoutPage = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Gradient Graphic T-shirt",
            manufacturer: "Bionova Healthcare Company",
            composition: "Amiodarone (100mg)",
            price: 500,
            quantity: 1,
            image: img,
        },
        {
            id: 2,
            name: "Gradient Graphic T-shirt",
            manufacturer: "Bionova Healthcare Company",
            composition: "Amiodarone (100mg)",
            price: 500,
            quantity: 1,
            image: img,
        },
        {
            id: 3,
            name: "Gradient Graphic T-shirt",
            manufacturer: "Bionova Healthcare Company",
            composition: "Amiodarone (100mg)",
            price: 500,
            quantity: 1,
            image: img,
        },
    ]);

    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const updateQuantity = (id, increment) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id
                    ? {
                        ...product,
                        quantity: Math.max(product.quantity + increment, 1),
                    }
                    : product
            )
        );
    };

    const removeProduct = (id) => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    };

    const subtotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    const total = subtotal - discount;

    const applyPromoCode = () => {
        if (promoCode === "SAVE20") {
            setDiscount(subtotal * 0.2);
        } else {
            alert("Invalid promo code");
        }
    };

    return (
        <div className="p-4 rounded-xl min-h-screen bg-white ">
            <h1 className="md:text-2xl text-xl  font-medium mb-6">Check Out Products</h1>

            <div className="flex flex-col h-fit lg:flex-row gap-6">
                <div className="lg:w-2/3 bg-white  p-4 rounded-xl shadow">
                    {products.map((product) => (
                        <div key={product.id} className="flex md:items-center items-start md:flex-row flex-col justify-between border-b pb-4 mb-4">
                            <div className="flex gap-5 items-start md:items-center">
                                <div>
                                    <div className="w-20 h-20">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className=" w-full h-full object-cover rounded"
                                        />
                                    </div>
                                </div>

                                <div className="">
                                    <h2 className="md:text-lg text-base font-medium">{product.name}</h2>
                                    <p className="md:text-sm text-xs  text-gray-600">
                                        Manufactured By: {product.manufacturer}
                                    </p>
                                    <p className="md:text-sm text-xs  text-gray-600">Composition: {product.composition}</p>
                                    <p className="font-medium mt-2">₹{product.price}/-</p>
                                </div>
                            </div>

                            <div className="flex flex-col justify-end items-start md:items-center gap-2">
                                <button
                                    onClick={() => removeProduct(product.id)}
                                    className=" w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-100 rounded"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                                <div className="flex items-center bg-bg-color1 rounded-full overflow-hidden">
                                    <button
                                        onClick={() => updateQuantity(product.id, -1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-bg-color hover:text-white rounded"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{product.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(product.id, 1)}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-bg-color hover:text-white rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-1/3 bg-white h-fit p-5 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-red-500">-₹{discount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="text-green-500">Free</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-lg font-medium">₹{total}</span>
                    </div>

                    <div className="mt-4 flex gap-2 items-center">
                        <label htmlFor="promo" className="sr-only">
                            Add Promo Code
                        </label>
                        <input
                            type="text"
                            id="promo"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Add promo code"
                            className="w-full px-3 py-3 border rounded-md  text-sm"
                        />
                        <button
                            onClick={applyPromoCode}
                            className="w-full bg-black text-white text-sm py-3 rounded-full font-medium hover:bg-gray-800"
                        >
                            Apply
                        </button>
                    </div>

                    <button
                        className="mt-6 w-full bg-black text-white text-sm py-3 rounded-full font-medium hover:bg-gray-800"
                    >
                        Payment →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
