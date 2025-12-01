import React from 'react'
import Button from './Button'

const Section = ({ title, children }) => {
    return (
        <div className=" p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-normal">{title}</h2>
                {/* <Button title={"Edit"} /> */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {children}
            </div>
        </div>
    )
}

export default Section