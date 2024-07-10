import { useEffect, useRef, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";

import useMutationAndRefetch from "../../useMutationAndRefetch";

const CREATE_ASSET_UPLOAD = gql`
  mutation createAssetUpload($fileId: GID!) {
    createAssetUpload(input: { fileId: $fileId }) {
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

function useOpenOnCanvaAction() {
  const [jobId, setJobId] = useState();
  const [assetData, setAssetData] = useState(null);
  const toastId = useRef(null);

  const startCreateDesignToast = () =>
    (toastId.current = toast.loading("Sending file to Canva.com..."));

  const createdDesignToast = () =>
    toast.update(toastId.current, {
      render: "File successfully uploaded to your Canva Account.",
      type: "success",
      isLoading: false,
    });

  const [runUploadAsset] = useMutationAndRefetch(CREATE_ASSET_UPLOAD);

  const [runCreateDesign, { data: designData }] =
    useMutationAndRefetch(CREATE_CANVA_DESIGN);

  const [_pollAssetUpload, { data, startPolling, stopPolling }] = useLazyQuery(
    GET_ASSET_UPLOAD,
    {
      variables: {
        jobId,
      },
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    if (data?.account?.integrations?.canva?.assetUpload?.assetId) {
      setAssetData(data?.account?.integrations?.canva?.assetUpload);
      stopPolling();
    }
  }, [data, stopPolling]);

  useEffect(() => {
    if (assetData) {
      runCreateDesign({
        variables: {
          assetId: assetData.assetId,
          name: assetData.name,
        },
      });
    }
  }, [assetData]);

  useEffect(() => {
    if (designData) {
      createdDesignToast();
      setTimeout(() => {
        toast.dismiss();
        setAssetData();
        setJobId();
      }, 5000);
      window.open(designData?.createCanvaDesign?.editUrl, "");
    }
  }, [designData]);

  return async (action) => {
    const { selectedFilesForAction } = action.state;

    const file = selectedFilesForAction[0];
    if (selectedFilesForAction.length) {
      startCreateDesignToast();

      const jobUpload = await runUploadAsset({
        variables: {
          fileId: file.id,
        },
      });

      const jobUploadId = await jobUpload?.data?.createAssetUpload?.jobId;
      setJobId(jobUploadId);

      if (jobUploadId) {
        startPolling(1500);
      }
    }
  };
}

export default useOpenOnCanvaAction;
