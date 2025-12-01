import React from 'react';

const SelectComponent = ({ options, value, onChange, label, placeholder, name }) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label htmlFor={name} className="block text-sm font-normal text-gray-700">{label}</label>}
            <select
                name={name}
                value={value || ""}
                onChange={onChange}
                className="p-3 border text-xs bg-bg-color1/50 border-gray-300 rounded-md outline-none"
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options?.map((option, index) => (
                    <option key={index} value={option.value || option}>
                        {option.label || option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectComponent;