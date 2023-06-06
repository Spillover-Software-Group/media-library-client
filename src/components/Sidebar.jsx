import Select from "react-select";

import useCurrentMediaBrowser from "../hooks/useCurrentMediaBrowser";
import useCurrentFolderId from "../hooks/useCurrentFolderId";
import useOptions from "../hooks/useOptions";
import Icon from "./Icon";

const mediaBrowsers = [
  {
    key: "account",
    name: "My Media",
    icon: "home",
  },
  {
    key: "global",
    name: "Spillover Stock",
    icon: "globe",
  },
  {
    key: "favorites",
    name: "Favorites",
    icon: "heart",
  },
  {
    key: "deleted",
    name: "Deleted",
    icon: "trash",
  },
];

function Sidebar() {
  const { icons } = useOptions();
  const [currentBrowser, setCurrentBrowser] = useCurrentMediaBrowser();
  const [, setCurrentFolderId] = useCurrentFolderId();

  const changeBrowser = (browser) => {
    setCurrentFolderId(null);
    setCurrentBrowser(browser);
  };

  const currentBrowerSelected = mediaBrowsers.find((b) => b.key === currentBrowser);

  return (
    <div className="sml-sidebar sml-bg-gray-50">
      <div className="sml-block sm:sml-hidden sml-w-72 sml-p-4">
        <Select
          options={mediaBrowsers}
          value={currentBrowerSelected}
          getOptionValue={(option) => option.key}
          getOptionLabel={(option) => (
            <span>
              <Icon
                name={option.icon}
                iconStyle="fas"
                className="sml-browser-icon sml-mr-2 sml-text-xl"
              />
              {option.name}
            </span>
          )}
          onChange={(option) => changeBrowser(option.key)}
        />
      </div>
      <div className="sml-hidden sm:sml-block sml-w-48">
        <ul className="sml-mt-4">
          {mediaBrowsers.map((browser) => (
            <li key={browser.key}>
              <div
                onClick={() => changeBrowser(browser.key)}
                className={`${
                  currentBrowser === browser.key
                    ? "sml-text-spillover-color11 sml-font-bold"
                    : "sml-text-spillover-color10 sml-font-medium"
                } sml-py-1 sml-px-4 sml-text-sm sml-flex sml-justify-between sml-items-center sml-cursor-pointer hover:sml-bg-gray-200 sml-media-browser-name`}
              >
                <div className="sml-flex sml-items-center w-full">
                  {icons[browser.key] ? (
                    <i className={`sml-browser-icon sml-mr-2 sml-text-xl ${icons[browser.key]}`} />
                  ) : (
                    <Icon
                      name={browser.icon}
                      iconStyle="fas"
                      className="sml-browser-icon sml-mr-2 sml-text-xl"
                    />
                  )}
                  <span>{browser.name}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;