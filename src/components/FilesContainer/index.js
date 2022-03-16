import React, { useState, createRef, useCallback, useRef } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";

import config from "../../config";
import RegularIcon from "../icons/RegularIcon";
import SearchBar from "../SearchBar";
import Loading from "../Loading";
import MediaFileList from "./MediaFileList";

function FilesContainer({
  foldersList,
  activeFolderId,
  selectedBusinessId,
  userId,
  setPageNum,
  isLoading,
  mediaList,
  hasMore,
  totalFiles,
  refetch,
}) {
  const observer = useRef();
  const lastMediaFileElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const { allowedFileTypes, baseUrl } = config;
  const dropZoneRef = createRef();

  const [query, setQuery] = useState("");

  const filteredFiles = mediaList?.filter((file) => {
    if (
      file?.fileName.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ) {
      return file;
    }
  });

  const activeFolder = foldersList?.find(
    (folder) => folder.id === activeFolderId
  );

  const uploadFilesFromDrag = (files) => {
    console.log("DEBUG_FILES: ", files);

    const formData = new FormData();

    if (files && files.length > 0) {
      formData.append("businessId", selectedBusinessId);
      formData.append("folderId", activeFolderId);
      formData.append("userId", userId);

      files.forEach((file) => {
        formData.append("media-uploads", file);
      });
    }

    // TODO: We need a better way to handle API calls, refetch, etc
    // We need to change the page number to have a refetch. For now its a "ugly" solution, when
    // we implement the new back end needs to fix this.
    toast.promise(
      fetch(`${baseUrl}/upload_files`, {
        method: "post",
        body: formData,
      })
        .then(async () => {
          refetch({});
        })
        .then(() => setPageNum(0))
        .then(() => setPageNum(1))
        .catch((err) => {
          console.log(`Error occured: ${err}`);
        }),
      {
        pending: "Uploading files...",
        success: "Uploaded Susscesfully.",
        error: "Something went wrong!",
      }
    );
  };

  return (
    <div className="h-full">
      <div className="px-4 py-2 flex justify-between">
        <div>
          <div>
            <RegularIcon
              name="folder-open"
              iconStyle="fas"
              className="mr-2 text-xl text-spillover-color2"
            />
            {activeFolder?.folderName}
          </div>
          <span className="text-xs text-spillover-color3">
            {totalFiles} results
          </span>
        </div>
        <div className="w-1/3">
          <SearchBar setQuery={setQuery} />
        </div>
      </div>

      <div className="h-[calc(100%_-_3rem)] overflow-y-auto">
        <Dropzone
          onDrop={(files) => uploadFilesFromDrag(files)}
          multiple
          accept={allowedFileTypes}
          ref={() => dropZoneRef}
          noClick
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <>
              <section className="relative min-h-screen cursor-default">
                <div {...getRootProps()} className="min-h-screen">
                  <input {...getInputProps()} />

                  {isDragActive && (
                    <div
                      style={{
                        border: "solid #0E7F82 1px",
                        backgroundColor: "rgba(14,127,130,.1)",
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        height: "auto",
                      }}
                    >
                      <div className="fixed bottom-10 -ml-60 w-full text-white text-center flex flex-col justify-center">
                        <div className="animate-bounce flex justify-center">
                          <RegularIcon
                            name="cloud-upload"
                            iconStyle="fas"
                            className="text-spillover-color4 text-4xl shadow-2xl"
                          />
                        </div>
                        <div className="w-full flex justify-center">
                          <div className="bg-spillover-color4  text-sm w-fit text-center p-4 rounded-2xl">
                            <p>Drag the files to upload them to:</p>
                            <p>
                              <RegularIcon
                                name="folder"
                                className="mr-2"
                                iconStyle="fas"
                              />
                              {activeFolder?.folderName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <div className="w-full overflow-y-auto cursor-default min-h-screen">
                      <MediaFileList
                        filteredFiles={filteredFiles}
                        lastMediaFileElementRef={lastMediaFileElementRef}
                        foldersList={foldersList}
                        activeFolderId={activeFolderId}
                        userId={userId}
                        setPageNum={setPageNum}
                        refetch={refetch}
                      />

                      <div className="flex justify-center">
                        {isLoading && <Loading />}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </Dropzone>
      </div>
    </div>
  );
}

export default FilesContainer;
