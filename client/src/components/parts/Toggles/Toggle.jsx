import React, { useState } from "react";

const Toggle = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onClick={handleCheckboxChange}
            className="sr-only"
          />
          <div className="h-5 w-14 rounded-full bg-[#E5E7EB] shadow-inner"></div>
          <div
            className={`dot shadow-switch-1 absolute -top-1 flex h-7 w-7 items-center justify-center rounded-full duration-300 ${
              isChecked ? "!bg-white right-0" : "bg-white right-7"
            }`}
          >
            <span
              className={`active h-4 w-4 rounded-full duration-500  ${
                isChecked ? "bg-[yellow]" : "bg-[red]"
              }`}
            ></span>
          </div>
        </div>
      </label>
    </>
  );
};

export default Toggle;
