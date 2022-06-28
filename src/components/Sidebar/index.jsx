import RegularIcon from "../icons/RegularIcon";

function Sidebar({
  libraries,
  activeLibrary,
  setActiveLibrary,
  icons,
}) {
  return (
    <div className="sml-sidebar sml-w-72 sml-bg-gray-50">
      <div className="sml-border-b sml-border-spillover-color3 sml-font-bold sml-flex sml-items-center sml-justify-between sml-text-spillover-color2 sml-h-14">
        <span className="sml-title sml-ml-4 sml-uppercase">Media Library</span>
      </div>
      <div>
        <h5 className="sml-libraries-title sml-px-4 sml-py-3 sml-mt-2 sml-font-medium sml-text-sm">Libraries</h5>
        <ul>
          {libraries.map((library) => (
            <li key={library.key}>
              <div
                onClick={() => setActiveLibrary(library)}
                className={`${
                  activeLibrary.key === library.key
                    ? "sml-text-spillover-color11 sml-font-bold"
                    : "sml-text-spillover-color10 sml-font-medium"
                } sml-py-1 sml-px-4 sml-text-sm sml-flex sml-justify-between sml-items-center sml-cursor-pointer hover:sml-bg-gray-200 sml-library-name`}
              >
                <div className="sml-flex sml-items-center w-full">
                  {icons[library.key] ? (
                    <i className={`sml-library-icon sml-mr-2 sml-text-xl ${icons[library.key]}`} />
                  ) : (
                    <RegularIcon
                      name={library.icon}
                      iconStyle="fas"
                      className="sml-library-icon sml-mr-2 sml-text-xl"
                    />
                  )}
                  <span>{library.name}</span>
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
