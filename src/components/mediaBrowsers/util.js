function splitFilesAndFolders(array) {
  const fileIds = array.filter((f) => !f.isDir).map((f) => f.realId);
  const folderIds = array.filter((f) => f.isDir).map((f) => f.realId);

  return { fileIds, folderIds };
}

export {
  splitFilesAndFolders,
};
