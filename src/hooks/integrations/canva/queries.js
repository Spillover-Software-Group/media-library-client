import { gql } from "@apollo/client";

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

const CREATE_DESIGN_EXPORT_JOB = gql`
  mutation createDesignExportJob($designId: String!) {
    createDesignExportJob(input: { designId: $designId }) {
      jobId
      status
    }
  }
`;

const GET_DESIGN_EXPORT = gql`
  query getDesignExport($accountId: GID!, $jobId: String!) {
    currentAccountId @client @export(as: "accountId")
    account(accountId: $accountId) {
      id
      integrations {
        canva {
          designExport(jobId: $jobId) {
            status
            jobId
            urls
          }
        }
      }
    }
  }
`;

const UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY = gql`
  mutation uploadCanvaDesignFromUrl($accountId: GID!, $fileUrl: FileUrlInput!) {
    currentAccountId @client @export(as: "accountId")
    uploadCanvaDesignFromUrl(
      input: { accountId: $accountId, fileUrl: $fileUrl }
    ) {
      id
      name
      url
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
