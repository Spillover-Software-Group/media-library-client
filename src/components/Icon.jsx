function Icon({ name, iconStyle, className }) {
  return <i className={`${iconStyle || 'fad'} fa-${name} ${className}`} />;
}

export default Icon;
