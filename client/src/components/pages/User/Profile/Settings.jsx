import React from "react";
import Toggle from "../../../parts/Toggles/Toggle";

export default function Settings() {
  return (
    <div className="w-[96%] h-full">
      <div className="w-full h-full px-96 flex flex-col items-center gap-5">
        {/* Head */}
        <h1 className="text-[30px] font-bold my-16">Settings</h1>

        {/* items of settings         */}

        {/* icon-------------------- */}
        <div className="w-full h-40 bg-red-200 rounded-[56px] flex px-20 gap-20 items-center">
          <i className="ri-moon-line text-[46px]"></i>
          {/* title and dec text */}
          <div className="flex-1">
            <p className="text-[25px] font-bold">Change theme</p>
            <p className="opacity-45">
              Switch it up! Change your app theme for a fresh look.
            </p>
          </div>
          {/* toggle */}
          <Toggle />
        </div>

        {/* icon-------------------- */}
        <div className="w-full h-40 bg-red-200 rounded-[56px] flex px-20 gap-20 items-center">
          <i className="ri-history-line text-[46px]"></i>
          {/* title and dec text */}
          <div className="flex-1">
            <p className="text-[25px] font-bold">Clear the Order History</p>
            <p className="opacity-45">
            Clear order history and start fresh!
            </p>
          </div>
          {/* toggle */}
          <div className="py-2 px-5 rounded-3xl bg-red-600 text-white">
            Clear History
          </div>
        </div>
      </div>
    </div>
  );
}
