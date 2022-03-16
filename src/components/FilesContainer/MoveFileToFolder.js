import React, { useState } from "react";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";

import RegularIconTooltip from "../icons/RegularIconTooltip";
import RegularIcon from "../icons/RegularIcon";

function MoveFileToFolder({ foldersList, activeFolderId, fileId, moveFile }) {
  const popperModifiers = {
    placement: "left",
    modifiers: [, { name: "offset", options: { offset: [0, 0] } }],
  };

  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    popperModifiers
  );

  const filteredFoldersList = foldersList?.filter(
    (folder) => folder.id !== activeFolderId
  );

  return (
    <Popover className="relative">
      {({ close, open }) => (
        <>
          <Popover.Button ref={setReferenceElement}>
            <RegularIconTooltip
              iconName="folder-tree"
              iconStyle="fas"
              tooltip="Move"
              placement="top"
            />
          </Popover.Button>

          {open && (
            <Popover.Panel
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              static
              className="absolute w-44 text-xs bg-white p-2 border border-spillover-color3 rounded-2xl shadow-lg"
            >
              <ul>
                {filteredFoldersList?.map((folder) => (
                  <li
                    key={folder.id}
                    className=" flex items-center justify-between hover:text-spillover-color2"
                    onClick={() => moveFile(fileId, folder.id)}
                  >
                    <span>
                      <RegularIcon name="folder" className="" />{" "}
                      <Popover.Button>{folder.folderName}</Popover.Button>
                    </span>
                    <span>
                      <RegularIcon name="angle-double-right" />
                    </span>
                  </li>
                ))}
              </ul>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
}

export default MoveFileToFolder;
