import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import config from '../../config';
import useUploadFiles, { isValidFile } from '../../hooks/useUploadFiles';

function UploadArea({ children }, ref) {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    openFilePicker: () => inputRef.current.click(),
  }));

  const uploadFiles = useUploadFiles();

  const onChange = (e) => {
    const { files } = e.target;
    if (!files) return;

    uploadFiles(Array.from(files));
  };

  const [, uploadDropZoneRef] = useDrop({
    accept: [NativeTypes.FILE],

    drop({ files }) {
      uploadFiles(files);
    },

    canDrop({ files }) {
      return files.every(isValidFile);
    },
  });

  return (
    <div ref={uploadDropZoneRef} className="sml-h-full">
      { children }

      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept={config.acceptedFileTypes.join()}
        onChange={onChange}
        multiple
      />
    </div>
  );
}

export default forwardRef(UploadArea);
