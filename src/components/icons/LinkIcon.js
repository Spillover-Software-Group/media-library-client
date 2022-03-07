import React from "react";

import RegularIcon from "components/icons/RegularIcon";
import Link from "components/Link";

function LinkIcon({ link, openNewTab, iconName, iconStyle, styleClasses }) {
  return (
    <Link to={link} target={openNewTab && "_blank"} className="h-full">
      <RegularIcon
        name={iconName}
        iconStyle={iconStyle || "far"}
        className={`${
          styleClasses ? styleClasses : "p-1"
        } text-spillover-color8 hover:text-spillover-color2`}
      />
    </Link>
  );
}

export default LinkIcon;
