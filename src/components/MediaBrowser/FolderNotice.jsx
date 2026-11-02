// Sits above a folder that is still shown, to say a fetch of it failed or is under way.
function FolderNotice({ children, actionLabel, onAction }) {
  return (
    <div
      role="status"
      className="sml-flex sml-items-center sml-justify-between sml-gap-3 sml-my-2 sml-px-3 sml-py-2 sml-rounded-md sml-bg-amber-50 sml-text-sm sml-text-amber-900"
    >
      <span>{children}</span>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="sml-shrink-0 sml-bg-transparent sml-border-0 sml-p-0 sml-cursor-pointer sml-text-amber-900 sml-text-sm sml-font-semibold"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default FolderNotice;
