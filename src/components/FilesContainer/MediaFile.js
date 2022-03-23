import React, { useState } from "react";
import { Transition } from "@headlessui/react";

import RegularIcon from "../icons/RegularIcon";
import FilesActions from "./FilesActions";

function MediaFile({
  file,
  isImage,
  mediaSrc,
  foldersList,
  activeFolderId,
  getFilesForFolder,
  userId,
  setPageNum,
  refetch,
}) {
  const [showActions, setShowActions] = useState(false);

  const fileName = file?.fileName?.split(".")[0];

  return (
    <div
      className="border border-spillover-color7 flex flex-col justify-between rounded-2xl w-64 sm:w-36 md:w-44 h-48 m-2 pb-2"
      id={`file-template-${file.id}`}
      key={`file-template-key-${file.id}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div>
        {/* TODO: Replace the static image with mediaSrc prop */}
        {isImage ? (
          // <img src={mediaSrc} alt="some media file" className="object-fill p-4" />
          <>
            <img
              src="https://images.unsplash.com/photo-1646697525966-50a59fa433dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="some media file"
              className="object-cover h-36 w-full rounded-tl-2xl rounded-tr-2xl z-10"
            />
          </>
        ) : (
          <div>
            <video
              className="h-36 rounded-tl-2xl rounded-tr-2xl"
              controls
              width="320"
              height="240"
            >
              <source src={file.url} />
            </video>
          </div>
        )}
      </div>

      <div>
        {showActions ? (
          <Transition
            show={showActions}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="text-center w-full transition-all duration-300 py-2">
              <FilesActions
                fileId={file.id}
                activeFolderId={activeFolderId}
                getFilesForFolder={getFilesForFolder}
                userId={userId}
                mediaSrc={mediaSrc}
                foldersList={foldersList}
                setPageNum={setPageNum}
                refetch={refetch}
              />
            </div>
          </Transition>
        ) : (
          <span className="flex items-center text-xs px-4">
            <RegularIcon
              name={isImage ? "file-image" : "file-video"}
              className={`${
                isImage ? "text-spillover-color4" : "text-spillover-color2"
              } mr-2 text-xl z-0`}
            />
            {fileName.length < 15 ? fileName : `${fileName.slice(0, 15)} ...`}
          </span>
        )}
      </div>
    </div>
  );
}

export default MediaFile;
