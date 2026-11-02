import PrimaryButton from "../PrimaryButton";

// Takes the folder list's place when the folder query failed.
function FolderError({ title, body, onRetry }) {
  return (
    <div
      role="alert"
      className="sml-mt-32 sml-flex sml-flex-col sml-items-center sml-w-full sml-my-4 sml-px-4 sml-text-center"
    >
      <span className="sml-text-xl sml-text-gray-700">{title}</span>
      <p className="sml-text-sm sml-text-[#a8a8a8] sml-mt-1 sml-mb-4">{body}</p>
      <PrimaryButton type="button" onClick={onRetry}>
        Try again
      </PrimaryButton>
    </div>
  );
}

export default FolderError;
