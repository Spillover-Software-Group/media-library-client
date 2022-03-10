import React from "react";

import RegularIcon from "../icons/RegularIcon";

function CreateFolderButton() {
  return (
    <button
      className={`text-base btn bg-spillover-color2 text-white hover:bg-spillover-color1 transition ease-in-out duration-300 rounded-2xl py-2 px-4 flex items-center`}
      type="button"
    >
      <RegularIcon name="folder-plus" className="text-lg" />
      <span className="ml-2">New Folder</span>
    </button>
  );
}

export default CreateFolderButton;
