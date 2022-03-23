import React from "react";
import RegularIcon from "../icons/RegularIcon";

function EmptyFolder() {
  return (
    <div className="flex flex-col w-full justify-center items-center text-spillover-color3">
      <div className="flex flex-col mt-64 justify-center items-center">
        <p className="flex items-center mb-10 text-2xl">
          <span className="uppercase">Empty Folder</span>
        </p>
        <RegularIcon name="file-alt" iconStyle="fal" className="text-5xl" />

        <p>Drop files here</p>
        <p>or user the Upload File button</p>
      </div>
    </div>
  );
}

export default EmptyFolder;
