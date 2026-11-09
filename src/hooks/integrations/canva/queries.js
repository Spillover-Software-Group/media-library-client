import { gql } from "@apollo/client";

import HANDED_FILE_FIELDS from "../../handedFileFields";

// The Canva browser's folder, as both the folder query and refreshCanvaDesigns select it.
const CANVA_FOLDER_FIELDS = gql`
  fragment CanvaFolderFields on CanvaFolder {
    id
    name
    folderChain {
      id
      name
      isDir
    }
    entries {
      id
      name
      isDir
      editUrl
      thumbnailUrl
    }
  }
`;

const REFRESH_CANVA_DESIGNS = gql`
  ${CANVA_FOLDER_FIELDS}
  mutation refreshCanvaDesigns {
    refreshCanvaDesigns(input: {}) {
      folder {
        ...CanvaFolderFields
      }
    }
  }
`;

const CREATE_ASSET_UPLOAD_JOB = gql`
  mutation createAssetUploadJob($fileId: GID!) {
    createAssetUploadJob(input: { fileId: $fileId }) {
      status
      jobId
    }
  }
`;

const GET_ASSET_UPLOAD = gql`
  query getAssetUpload($accountId: GID!, $jobId: String!) {
    currentAccountId @client @export(as: "accountId")
    account(accountId: $accountId) {
      id
      integrations {
        canva {
          assetUpload(jobId: $jobId) {
            status
            jobId
            assetId
            name
          }
        }
      }
    }
  }
`;

const CREATE_CANVA_DESIGN = gql`
  mutation createCanvaDesign(
    $assetId: String!
    $name: String!
    $width: Int!
    $height: Int!
  ) {
    createCanvaDesign(
      input: { assetId: $assetId, name: $name, width: $width, height: $height }
    ) {
      editUrl
    }
  }
`;

// A job is read the same way when it is created and each time it is polled.
const DESIGN_EXPORT_FIELDS = gql`
  fragment DesignExportFields on CanvaDesignExport {
    jobId
    status
    urls
    errorCode
  }
`;

const CREATE_DESIGN_EXPORT_JOB = gql`
  ${DESIGN_EXPORT_FIELDS}
  mutation createDesignExportJob(
    $designId: String!
    $format: CanvaExportFormat!
  ) {
    createDesignExportJob(input: { designId: $designId, format: $format }) {
      ...DesignExportFields
    }
  }
`;

const GET_DESIGN_EXPORT = gql`
  ${DESIGN_EXPORT_FIELDS}
  query getDesignExport($accountId: GID!, $jobId: String!) {
    currentAccountId @client @export(as: "accountId")
    account(accountId: $accountId) {
      id
      integrations {
        canva {
          designExport(jobId: $jobId) {
            ...DesignExportFields
          }
        }
      }
    }
  }
`;

const UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY = gql`
  ${HANDED_FILE_FIELDS}
  mutation uploadCanvaDesignFromUrl(
    $accountId: GID!
    $fileUrl: FileUrlInput!
    $format: CanvaExportFormat!
  ) {
    currentAccountId @client @export(as: "accountId")
    uploadCanvaDesignFromUrl(
      input: { accountId: $accountId, fileUrl: $fileUrl, format: $format }
    ) {
      ...HandedFileFields
    }
  }
`;

export {
  CANVA_FOLDER_FIELDS,
  CREATE_ASSET_UPLOAD_JOB,
  CREATE_CANVA_DESIGN,
  CREATE_DESIGN_EXPORT_JOB,
  GET_ASSET_UPLOAD,
  GET_DESIGN_EXPORT,
  REFRESH_CANVA_DESIGNS,
  UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
};
