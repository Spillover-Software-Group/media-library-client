import { forwardRef, useImperativeHandle, useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import config from "../../config";
import useUploadFiles, { isValidFile } from "../../hooks/useUploadFiles";

function UploadArea({ children, handleUploaded }, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    openFilePicker: () => inputRef.current.click(),
  }));

  const uploadFiles = useUploadFiles();

  const onChange = async (e) => {
    const { files } = e.target;
    if (!files) return;

    const { data } = await uploadFiles(Array.from(files));
    if (handleUploaded) handleUploaded(data.uploadFiles);
  };

  const [, uploadDropZoneRef] = useDrop({
    accept: [NativeTypes.FILE],

    async drop({ files }) {
      const { data } = await uploadFiles(files);
      if (handleUploaded) handleUploaded(data.uploadFiles);
    },

    canDrop({ files }) {
      return files.every(isValidFile);
    },
  });

  return (
    <div ref={uploadDropZoneRef} className="sml-h-full sml-w-full">
      {children}

      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        accept={config.acceptedFileTypes.join()}
        onChange={onChange}
        multiple
      />
    </div>
  );
}

export default forwardRef(UploadArea);
