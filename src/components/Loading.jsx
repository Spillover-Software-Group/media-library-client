import LoadingSpinner from "./LoadingSpinner";

function Loading() {
  return (
    <div className="sml-mt-32 sml-flex sml-flex-col sml-justify-center sml-items-center sml-w-full sml-my-4 sml-px-4">
      
      <LoadingSpinner />
      <span className="sml-text-xl sml-text-[#a8a8a8] sml-mt-4">Loading...</span>
      <p className="sml-text-center sml-text-sm sml-text-[#a8a8a8]">This may take a few seconds.</p>
    </div>
  );
}

export default Loading;
