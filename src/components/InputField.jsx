import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeSharp } from "react-icons/io5";

const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    maxLength,
    error,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-normal text-gray-700">
                {label}
            </label>
            <input
                placeholder={placeholder || label}
                type={type === "password" && showPassword ? "text" : type}
                name={name}
                value={type === "file" ? undefined : value}
                onChange={onChange}
                maxLength={maxLength}
                className={`mt-1 block w-full text-xs bg-bg-color1/50 border-gray-300 rounded shadow-sm border ${
                    type === "file" ? "p-2" : "p-3"
                } outline-none pr-10`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {type === "password" && (
                <button
                    type="button"
                    onClick={handleToggle}
                    className="absolute right-2 top-[68%] transform -translate-y-1/2 text-gray-500"
                >
                    {showPassword ? <IoEyeSharp /> : <IoEyeOffOutline />}
                </button>
            )}
        </div>
    );
};

export default InputField;
