import { gql } from "@apollo/client";
import { toast } from "react-toastify";

import config from "../config";
import useMutationAndRefetch from "./useMutationAndRefetch";

const UPLOAD_FILES_MUTATION = gql`
  mutation UploadFiles(
    $folderId: GID!
    $files: [Upload!]!
  ) {
    currentFolderId @client @export(as: "folderId")
    uploadFiles(
      input: {
        folderId: $folderId,
        files: $files
      }
    ) {
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

function isValidFile(file) {
  if (isImage(file) && file.size <= config.maxImageSize) return true;
  if (isVideo(file) && file.size <= config.maxVideoSize) return true;

  return false;
}

function useUploadFiles() {
  const [runUploadFiles] = useMutationAndRefetch(UPLOAD_FILES_MUTATION);

  const uploadFiles = (files) => {
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

    return uploadPromise;
  };

  return uploadFiles;
}

export default useUploadFiles;
export { isValidFile };
