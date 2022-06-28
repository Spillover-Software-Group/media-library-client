import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

function useFolderQuery(query, extractFolder, variables = {}, options = {}) {
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const { loading, data } = useQuery(query, {
    variables: { ...variables, folderId: currentFolderId },
  });

  const folder = data ? extractFolder(data) : null;

  useEffect(() => {
    if (folder) {
      setCurrentFolderId(folder.id);
    }
  }, [folder, setCurrentFolderId]);

  if (loading) return { loading: true };

  const { children: folders, files } = folder;

  const chonkyFolders = folders.map((f) => ({
    id: `folder${f.id}`,
    name: f.name,
    childrenCount: f.totalChildrenCount,
    modDate: f.updatedAt,
    realId: f.id,
    isDir: true,
  }));

  const isSelectable = (f) => {
    if (
      options.selectableFileTypes
      && (
        (
          Array.isArray(options.selectableFileTypes)
          && !options.selectableFileTypes.includes(f.mimetype)
        ) || (
          typeof options.selectableFileTypes === 'function'
          && !options.selectableFileTypes(f)
        )
      )
    ) {
      return false;
    }

    if (
      options.maxSelectableSize
      && (
        (
          Number.isInteger(options.maxSelectableSize)
          && f.size > options.maxSelectableSize
        ) || (
          typeof options.maxSelectableSize === 'function'
          && !options.maxSelectableSize(f)
        )
      )
    ) {
      return false;
    }

    return true;
  };

  const chonkyFiles = files.map((f) => ({
    id: `file${f.id}`,
    name: f.name,
    modDate: f.updatedAt,
    realId: f.id,
    size: f.size,
    url: f.url,
    thumbnailUrl: f.thumbnailUrl,
    type: f.mimetype,
    selectable: isSelectable(f),
  }));

  const chonkyFoldersAndFiles = [...chonkyFolders, ...chonkyFiles];

  const folderChain = [];

  const { parent } = folder;

  if (parent) {
    folderChain.push({
      id: parent.id,
      name: parent.name,
      modDate: parent.updatedAt,
      childrenCount: parent.totalChildrenCount,
      isDir: true,
    });
  }

  if (folder.id) {
    folderChain.push({
      id: folder.id,
      name: folder.name,
      modDate: folder.updatedAt,
      childrenCount: folder.totalChildrenCount,
      isDir: true,
    });
  }

  return {
    loading: false,
    folders,
    files,
    chonkyFolders,
    chonkyFiles,
    chonkyFoldersAndFiles,
    folderChain,
    folder,
    currentFolderId,
    setCurrentFolderId,
  };
}

export default useFolderQuery;
