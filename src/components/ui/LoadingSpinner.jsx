import React from "react";

const LoadingSpinner = ({
  size = "h-10 w-10",
  color = "border-green-500",
  containerClassName = "flex justify-center items-center p-8",
}) => {
  return (
    <div className={containerClassName}>
      <div
        className={`${size} animate-spin rounded-full border-2 ${color} border-t-transparent`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
