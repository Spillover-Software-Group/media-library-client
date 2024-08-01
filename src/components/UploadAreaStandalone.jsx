import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Wrapper from "../Wrapper";
import AccountSwitcher from "./AccountSwitcher";
import { AuthProvider } from "../hooks/useAuth";
import UploadArea from "./MediaBrowser/UploadArea";

function UploadAreaStandalone({ handleUploaded, ...props }) {
  const uploadAreaRef = useRef();
  const openFilePicker = () => uploadAreaRef.current?.openFilePicker();

  return (
    // If `ownerId` changes, the current token will be invalidated
    // and a new one will be requested.
    // This is so that our auth is in sync with the parent app's auth.
    // This could be a userId or a token, for example.
    <AuthProvider mode={props.mode} ownerId={props.ownerId}>
      <Wrapper {...props}>
        <div
          onClick={openFilePicker}
          className="spillover-media-library sml-flex sml-h-full sml-w-full"
        >
          <AccountSwitcher />
          <DndProvider backend={HTML5Backend}>
            <UploadArea ref={uploadAreaRef} handleUploaded={handleUploaded}>
              <div className="sml-h-full sml-w-full sml-flex sml-items-center sml-justify-center sml-p-4 sml-border-dashed sml-border-2 sml-border-slate-300 sml-rounded-md sml-text-sm sml-cursor-pointer sml-select-none sml-text-slate-600">
                <p>Click or drag files here to upload</p>
              </div>
            </UploadArea>
          </DndProvider>
        </div>
      </Wrapper>
    </AuthProvider>
  );
}

export default UploadAreaStandalone;
