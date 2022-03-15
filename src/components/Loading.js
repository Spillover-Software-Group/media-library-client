import React from "react";

import RegularIcon from "./icons/RegularIcon";

function Loading({ logo }) {
  return (
    <div className="flex flex-col justify-center items-center w-full my-4 px-4">
      {logo && (
        <div className="h-14 flex items-center justify-center mb-4">
          <img src={logo} className="object-none" />
        </div>
      )}
      <div className="animate-spin flex justify-center">
        <RegularIcon
          name="spinner"
          iconStyle="fas"
          className="text-spillover-color4 text-4xl shadow-2xl"
        />
      </div>
      <span className="font-semibold text-xl text-spillover-color1 mt-4">
        Loading...
      </span>
      <p className="text-center text-sm">This may take a few seconds.</p>
    </div>
  );
}

export default Loading;
