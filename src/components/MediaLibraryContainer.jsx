import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

import AccountSwitcher from "./AccountSwitcher";
import Sidebar from "./Sidebar";
import MediaBrowser from "./MediaBrowser";
import useOptions from "../hooks/useOptions";
import Icon from "./Icon";

import "react-toastify/dist/ReactToastify.min.css";

function MediaLibraryContainer() {
  const { icons, showAccountSelector } = useOptions();

  // SEE: https://chonky.io/docs/2.x/basics/icons#defining-a-custom-icon-component
  const IconComponent = (props) => {
    // If we have a custom icon, use it.
    const icon = icons[props.icon];
    if (icon) return <Icon name={props.icon} />;

    return <ChonkyIconFA {...props} />;
  }

  setChonkyDefaults({ iconComponent: IconComponent });

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
                {showAccountSelector && <AccountSwitcher />}
              </div>
            </div>

            <div className="sml-h-[calc(100%_-_4rem)] sml-flex sml-flex-col sm:sml-flex-row">
              <Sidebar />
              <div className="sml-p-2 sml-w-full sml-h-[calc(100%_-_4rem)]">
                <MediaBrowser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default MediaLibraryContainer;
