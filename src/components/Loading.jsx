import LoadingSpinner from "./LoadingSpinner";

function Loading() {
  return (
    <div className="sml-mt-32 sml-flex sml-flex-col sml-justify-center sml-items-center sml-w-full sml-my-4 sml-px-4">
      
      <LoadingSpinner />
      <span className="sml-font-semibold sml-text-xl sml-text-black sml-mt-4">Loading...</span>
      <p className="sml-text-center sml-text-sm">This may take a few seconds.</p>
    </div>
  );
}

export default Loading;
