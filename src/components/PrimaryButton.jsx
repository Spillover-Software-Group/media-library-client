import Button from "./Button";

function PrimaryButton({ type = "submit", ...props }) {
  return (
    <Button
      extraClasses="sml-bg-spillover-color11 sml-text-white"
      type={type}
      {...props}
    />
  );
}

export default PrimaryButton;
