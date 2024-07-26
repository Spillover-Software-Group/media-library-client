import useFolder from "./useFolder";

function useRefreshFolder() {
  const { refetch } = useFolder();

  return () => {
    refetch();
  };
}

export default useRefreshFolder;
