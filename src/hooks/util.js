function splitFilesAndFolders(array) {
  const fileIds = array.filter((f) => !f.isDir).map((f) => f.id);
  const folderIds = array.filter((f) => f.isDir).map((f) => f.id);

  return { fileIds, folderIds };
}

export { splitFilesAndFolders };
