import { gql } from "@apollo/client";

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
  mutation createCanvaDesign($assetId: String!, $name: String!) {
    createCanvaDesign(input: { assetId: $assetId, name: $name }) {
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
      name
      url
    }
  }
`;

export {
  CREATE_ASSET_UPLOAD_JOB,
  GET_ASSET_UPLOAD,
  CREATE_CANVA_DESIGN,
  CREATE_DESIGN_EXPORT_JOB,
  GET_DESIGN_EXPORT,
  UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
};
