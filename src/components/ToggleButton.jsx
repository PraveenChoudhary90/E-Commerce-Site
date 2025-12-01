import React, { useEffect, useState } from 'react';

const ToggleButton = ({ isEnabled = false, onToggle }) => {
    const [enabled, setEnabled] = useState(isEnabled);

    useEffect(()=>{
       setEnabled(isEnabled)
    },[isEnabled])

    const handleToggle = () => {
       const newValue = !enabled;
        setEnabled(newValue);
        if (onToggle) onToggle(newValue);
    };

    return (
        <div>
            <div
                className={`w-10 h-6 flex border items-center rounded-full p-1 cursor-pointer ${enabled ? 'bg-bg-color' : 'bg-bg-color1'
                    }`}
                onClick={handleToggle}
            >
                <div
                    className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${enabled ? 'translate-x-4 bg-bg-color1' : 'translate-x-0 bg-white'
                        }`}
                ></div>
            </div>
        </div>
    );
};

export default ToggleButton;
