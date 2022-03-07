import React, { useState } from "react";
import { usePopper } from "react-popper";

import Link from "components/Link";

const LinkIconTooltip = ({
  iconStyle,
  iconName,
  iconSize,
  tooltip,
  placement,
  classes,
  link,
  openNewTab,
}) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [show, setShow] = useState(false);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement,
  });

  const showTooltip = () => {
    setShow(!show);
  };

  return (
    <>
      <Link to={link} target={openNewTab && "_blank"} rel="noreferrer">
        <i
          ref={setReferenceElement}
          onMouseOver={showTooltip}
          onMouseLeave={showTooltip}
          className={`fa-${iconName} ${iconStyle ? iconStyle : "far"} ${
            iconSize ? iconSize : "text-base"
          } text-spillover-color4 hover:text-spillover-color2 cursor-pointer mx-1`}
        ></i>
      </Link>

      {show && (
        <span
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={
            classes
              ? classes
              : "bg-white text-black border border-spillover-color1 text-2xs p-1 rounded-md"
          }
        >
          {tooltip}
        </span>
      )}
    </>
  );
};

export default LinkIconTooltip;
