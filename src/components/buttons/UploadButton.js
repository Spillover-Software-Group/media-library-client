import React from "react";

import RegularIcon from "../icons/RegularIcon";

function UploadButton({ openFileDialog, inputRef, uploadFiles }) {
  return (
    <button
      className={`btn bg-spillover-color2 text-white hover:bg-spillover-color1 transition ease-in-out duration-300 rounded-2xl p-2 text-sm`}
      type="button"
      onClick={openFileDialog}
    >
      <RegularIcon name="upload" />
      <span className="ml-2">Upload a File</span>

      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        accept=".png,.jpg,.jpeg"
        onChange={uploadFiles}
        multiple
      />
    </button>
  );
}

export default UploadButton;
