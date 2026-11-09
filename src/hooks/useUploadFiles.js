import { gql } from "@apollo/client";
import { toast } from "react-toastify";

import config from "../config";
import useHandOverFiles from "./useHandOverFiles";
import useMutationAndRefetch from "./useMutationAndRefetch";
import useOptions from "./useOptions";

const UPLOAD_FILES_MUTATION = gql`
  mutation UploadFiles($folderId: GID!, $files: [Upload!]!) {
    currentFolderId @client @export(as: "folderId")
    uploadFiles(input: { folderId: $folderId, files: $files }) {
      id
      name
      mimetype
      updatedAt
      url
      thumbnailUrl
      size
      favoritedAt
    }
  }
`;

function isImage(file) {
  return config.acceptedImageTypes.includes(file.type);
}

function isVideo(file) {
  return config.acceptedVideoTypes.includes(file.type);
}

function isDocument(file) {
  return config.acceptedDocumentTypes.includes(file.type);
}

function isValidFile(file) {
  if (isImage(file) && file.size <= config.maxImageSize) return true;
  if (isVideo(file) && file.size <= config.maxVideoSize) return true;
  if (isDocument(file) && file.size <= config.maxDocumentSize) return true;

  return false;
}

function useUploadFiles() {
  const { autoSelect } = useOptions();
  const handOver = useHandOverFiles();
  const [runUploadFiles] = useMutationAndRefetch(UPLOAD_FILES_MUTATION);

  const uploadFiles = async (files) => {
    if (!files.every(isValidFile)) {
      toast.error("Invalid files!");
      return false;
    }

    const uploadPromise = runUploadFiles({
      variables: {
        files,
      },
    });

    toast.promise(uploadPromise, {
      pending: "Uploading files...",
      success: "Files uploaded!",
      error: "Error uploading files!",
    });

    try {
      const { data } = await uploadPromise;

      if (autoSelect) handOver(data.uploadFiles, { capped: true });
    } catch (e) {
      console.error(e);
    }

    return uploadPromise;
  };

  return uploadFiles;
}

export default useUploadFiles;
export { isValidFile };
