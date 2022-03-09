import React, { useState } from "react";
import { Transition } from "@headlessui/react";

import RegularIcon from "./icons/RegularIcon";
import RegularIconTooltip from "./icons/RegularIconTooltip";

function MediaFile({
  fileId,
  fileName,
  isImage,
  mediaSrc,
  fileIsDeleted,
  handleFileRecover,
  handleMediaClick,
  handleFileFavoriteSetClick,
  isFavorite,
  setSubMenuVisibility,
  subMenuVisible,
  handleMoveFileClick,
  handleDeleteFileClick,
  foldersList,
}) {
  const [showActions, setShowActions] = useState(false);

  const filteredFoldersList = foldersList?.filter(
    (folder) => folder.id !== activeFolder
  );

  return (
    <div
      className="border border-spillover-color7 flex flex-col justify-between rounded-2xl w-64 sm:w-36 md:w-56 h-52 m-2 pb-2"
      id={`file-template-${fileId}`}
      key={`file-template-key-${fileId}`}
    >
      <div
        className={`relative ${showActions && "opacity-80"}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {isImage ? (
          // <img src={mediaSrc} alt="some media file" className="object-fill p-4" />
          <>
            <img
              src="https://images.unsplash.com/photo-1646697525966-50a59fa433dc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="some media file"
              className="object-cover h-40 w-full rounded-tl-2xl rounded-tr-2xl"
            />
          </>
        ) : (
          <div>
            <video className="p-4 h-40" controls width="320" height="240">
              <source src={mediaSrc} />
            </video>
          </div>
        )}

        {/* {showActions && ( */}
        <Transition
          show={showActions}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute bg-black bottom-0 text-center w-full transition-all duration-300 p-2">
            <ul className="flex justify-evenly items-center text-spillover-color3">
              <li
                className="cursor-pointer"
                onClick={() => handleMediaClick(mediaSrc)}
              >
                <RegularIconTooltip
                  iconName="plus-square"
                  iconStyle="fas"
                  tooltip="Create Post"
                  placement="top"
                />
              </li>
              <li
                className="cursor-pointer"
                onClick={() => handleFileFavoriteSetClick(fileId)}
              >
                <RegularIconTooltip
                  iconName="heart"
                  iconStyle="fas"
                  tooltip="Favorite"
                  placement="top"
                />
              </li>
              <li className="cursor-pointer">
                <RegularIconTooltip
                  iconName="folder-tree"
                  iconStyle="fas"
                  tooltip="Move"
                  placement="top"
                />

                {/* TODO: Menu to move the file to another folder */}
                {/* <div
                  className="border border-yellow-700 h-10 w-10 move-file-menu file-icon-menu-item"
                  onClick={() => setSubMenuVisibility(!subMenuVisible)}
                  onMouseLeave={() => setSubMenuVisibility(false)}
                >
                  {subMenuVisible && (
                    <div className="folders-list-submenu">
                      {filteredFoldersList?.map((folder) => (
                        <div
                          className="submenu-folders-list-item list-item-text"
                          onClick={() => handleMoveFileClick(fileId, folder.id)}
                        >
                          {folder.folderName}
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}
              </li>
              <li className="cursor-pointer">
                <RegularIconTooltip
                  iconName="eye"
                  iconStyle="fas"
                  tooltip="Image"
                  placement="top"
                />
              </li>
              <li
                className="cursor-pointer"
                onClick={() => handleDeleteFileClick(fileId)}
              >
                <RegularIconTooltip
                  iconName="trash-alt"
                  iconStyle="fas"
                  tooltip="Delete"
                  placement="top"
                />
              </li>
            </ul>
          </div>
        </Transition>

        {/* TODO: recover functionality */}
        {/*       
        {fileIsDeleted && (
              <div
                className="fa fa-undo restore-file file-icon-menu-item"
                onClick={() => handleFileRecover(fileId)}
              />) */}
      </div>
      <div className="px-4">
        <span className="flex items-center text-xs">
          <RegularIcon
            name={isImage ? "file-image" : "file-video"}
            className={`${
              isImage ? "text-spillover-color4" : "text-spillover-color2"
            } mr-2 text-xl`}
          />
          {/* TODO: If more than X characters, slice and ... */}
          {fileName.slice(0, 20)}...
        </span>
      </div>
    </div>
  );
}

export default MediaFile;
