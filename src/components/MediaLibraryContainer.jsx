import { ToastContainer } from "react-toastify";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import AccountSwitcher from "./AccountSwitcher";
import Sidebar from "./Sidebar";
import MediaBrowser from "./MediaBrowser";

import "react-toastify/dist/ReactToastify.min.css";

function MediaLibraryContainer() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="spillover-media-library sml-flex sml-h-full sml-justify-center sml-items-center">
        <div className="sml-w-full sml-h-full sml-flex">
          <div className="sml-w-full sml-h-full">
            <div className="sml-flex sml-bg-gray-50 sml-flex-col sml-items-center sml-pb-0.5 sml-border-b sml-border-spillover-color3">
              <div className="sml-flex sml-justify-evenly sml-py-2 sml-flex-col sm:sml-flex-row sml-w-full sml-items-center">
                <div className="sml-font-bold sml-flex sml-items-center sml-text-spillover-color2">
                  <span className="sml-title sml-ml-4 sml-uppercase">Media Library</span>
                </div>
                <AccountSwitcher />
              </div>
            </div>

            <div className="sml-h-[calc(100%_-_4rem)] sml-flex sml-flex-col sm:sml-flex-row">
              <Sidebar />
              <div className="sml-p-2 sml-w-full sml-h-[calc(100%_-_4rem)]">
                <MediaBrowser />
              </div>
            </div>
          </div>

          <ToastContainer position="bottom-right" autoClose={2500} />
        </div>
      </div>
    </DndProvider>
  );
}

export default MediaLibraryContainer;
