import { Field } from "formik";

function TextInput({ disabled, ...props }) {
  let className = "sml-w-full sml-h-10 sml-px-4 sml-border sml-border-solid sml-border-gray-300 sml-rounded-md";

  if (disabled) {
    className += " sml-bg-gray-100 sml-cursor-not-allowed";
  }

  return (
    <Field
      className={className}
      disabled={disabled}
      {...props}
    />
  );
}

export default TextInput;
