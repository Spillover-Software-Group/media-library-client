// Sits above a folder that is still shown, to say a refresh of it failed.
function FolderNotice({ children, onDismiss }) {
  return (
    <div
      role="status"
      className="sml-flex sml-items-center sml-justify-between sml-gap-3 sml-my-2 sml-px-3 sml-py-2 sml-rounded-md sml-bg-amber-50 sml-text-sm sml-text-amber-900"
    >
      <span>{children}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="sml-shrink-0 sml-bg-transparent sml-border-0 sml-cursor-pointer sml-text-amber-900 sml-text-sm sml-font-semibold"
      >
        Dismiss
      </button>
    </div>
  );
}

export default FolderNotice;
