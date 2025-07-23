import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = (props) => {
  return <button className="bg-black rounded-md p-4" {...props} />;
};
