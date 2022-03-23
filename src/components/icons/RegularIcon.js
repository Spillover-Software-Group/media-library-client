import React from "react";

export default function RegularIcon({ name, iconStyle, className }) {
  iconStyle = iconStyle || "fad";

  return <i className={`${iconStyle} fa-${name} ${className}`}></i>;
}
