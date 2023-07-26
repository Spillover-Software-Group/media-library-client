import useOptions from "../hooks/useOptions";

function Icon({ name, className }) {
  const { icons } = useOptions();
  className = `${className || ""} ${icons[name]}`;

  return <i className={className} />;
}

export default Icon;
