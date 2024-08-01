import Button from "./Button";

function SecondaryButton({ ...props }) {
  return <Button extraClasses="sml-bg-gray-200 sml-text-gray-700" {...props} />;
}

export default SecondaryButton;
