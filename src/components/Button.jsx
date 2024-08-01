function Button({
  children,
  type = "button",
  disabled,
  extraClasses,
  ...props
}) {
  let className = "sml-text-xs sml-px-4 sml-rounded-md sml-h-10";

  className += ` ${disabled ? "sml-opacity-80 sml-cursor-not-allowed" : "sml-opacity-100 sml-cursor-pointer"}`;

  if (extraClasses) className += ` ${extraClasses}`;

  return (
    <button type={type} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;
