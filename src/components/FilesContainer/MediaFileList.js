import React from "react";

import EmptyFolder from "./EmptyFolder";
import MediaFile from "./MediaFile";

const allowedImageTypes = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];

function MediaFileList({
  filteredFiles,
  lastMediaFileElementRef,
  foldersList,
  activeFolderId,
  userId,
  setPageNum,
  refetch,
}) {
  const isImage = (item) =>
    allowedImageTypes.includes(`.${item.fileName.split(".").pop()}`);

  return (
    <div className="flex flex-wrap justify-center p-2">
      {filteredFiles?.length <= 0 ? (
        <EmptyFolder />
      ) : (
        filteredFiles?.map((file, i) => {
          if (filteredFiles?.length === i + 1) {
            return (
              <div key={i} ref={lastMediaFileElementRef}>
                <MediaFile
                  file={file}
                  isImage={isImage(file)}
                  mediaSrc={file.url}
                  foldersList={foldersList}
                  fileIsDeleted={false}
                  activeFolderId={activeFolderId}
                  userId={userId}
                  setPageNum={setPageNum}
                  refetch={refetch}
                />
              </div>
            );
          } else {
            return (
              <div key={i}>
                <MediaFile
                  file={file}
                  isImage={isImage(file)}
                  mediaSrc={file.url}
                  foldersList={foldersList}
                  fileIsDeleted={false}
                  activeFolderId={activeFolderId}
                  userId={userId}
                  setPageNum={setPageNum}
                  refetch={refetch}
                />
              </div>
            );
          }
        })
      )}
    </div>
  );
}

export default MediaFileList;
