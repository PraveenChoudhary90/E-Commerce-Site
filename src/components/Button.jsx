import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ onClick, title, icon, bgcolor, link ,className="" }) => {
  return (
    <Link
      to={link}
      onClick={onClick}
      className={`px-4 flex items-center justify-center text-center gap-1 py-2 text-xs ${className} ${
        bgcolor ? bgcolor : "bg-bg-color"
        } rounded-md`}
    >
      {icon}
      {title}
    </Link>
  );
};

export default Button;
