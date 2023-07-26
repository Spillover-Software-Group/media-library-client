import Icon from "./Icon";

function LoadingSpinner({ size = "2xl", color = "[#a8a8a8]" }) {
  return (
    <Icon name="circle-notch" className={`sml-text-${color} fa-spin fa-${size}`} iconStyle="fa-solid" />
  );
}

export default LoadingSpinner;
