function useSaveOnMyMedia() {
  return (action) => {
    const { selectedFilesForAction } = action.state;

    console.log({ selectedFilesForAction });
  };
}

export default useSaveOnMyMedia;
