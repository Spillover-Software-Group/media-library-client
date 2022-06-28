import RegularIcon from "../icons/RegularIcon";

function Sidebar({
  libraries,
  activeLibrary,
  setActiveLibrary,
  icons,
}) {
  return (
    <div className="sml-sidebar sml-w-72 sml-bg-gray-50">
      <p className="sml-border-b sml-border-spillover-color3 sml-my-2 sml-p-3 sml-font-bold sml-flex sml-items-center sml-justify-between sml-text-spillover-color2">
        <span className="sml-title sml-uppercase">Media Library</span>
      </p>
      <div>
        <h5 className="sml-libraries-title sml-px-4 sml-py-3 sml-mt-2 sml-font-medium sml-text-sm">Libraries</h5>
        <ul>
          {libraries.map((library) => (
            <li key={library.key}>
              <div
                className={`${
                  activeLibrary.key === library.key
                    ? "sml-text-spillover-color11 sml-font-bold"
                    : "sml-text-spillover-color10 sml-font-medium"
                } sml-py-1 sml-px-4 sml-text-sm sml-flex sml-justify-between sml-items-center sml-cursor-pointer hover:sml-bg-gray-200 sml-library-name`}
              >
                <div
                  className="sml-flex sml-items-center w-full"
                  onClick={() => setActiveLibrary(library)}
                >
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
