import { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";

import useMutationAndRefetch from "../../useMutationAndRefetch";
import {
  CREATE_ASSET_UPLOAD_JOB,
  CREATE_CANVA_DESIGN,
  GET_ASSET_UPLOAD,
} from "./queries";

function useOpenOnCanvaAction() {
  const [jobId, setJobId] = useState();
  const [assetData, setAssetData] = useState(null);
  const toastId = useRef(null);
  const [createdDesign, setCreatedDesign] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({});

  const startCreateDesignToast = () =>
    (toastId.current = toast.loading("Sending file to Canva.com..."));

  const createdDesignToast = () =>
    toast.update(toastId.current, {
      render: "File successfully uploaded to your Canva Account.",
      type: "success",
      isLoading: false,
    });

  const [runUploadAsset] = useMutationAndRefetch(CREATE_ASSET_UPLOAD_JOB);
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

  // Upload the asset and polling until we got the assetId back from Canva
  useEffect(() => {
    if (data?.account?.integrations?.canva?.assetUpload?.assetId) {
      setAssetData(data?.account?.integrations?.canva?.assetUpload);
      stopPolling();
    }
  }, [data, stopPolling]);

  // Create the Canva Design when we get the assetId
  useEffect(() => {
    if (assetData) {
      runCreateDesign({
        variables: {
          assetId: assetData.assetId,
          name: assetData.name,
          height: imageDimensions.height,
          width: imageDimensions.width,
        },
      });
    }
  }, [assetData]);

  useEffect(() => {
    if (designData) {
      setCreatedDesign(designData);
    }
  }, [designData]);

  // Open the user's Canva in a new tab
  useEffect(() => {
    if (createdDesign) {
      createdDesignToast();
      setTimeout(() => {
        toast.dismiss();
        setAssetData();
        setJobId();
        setCreatedDesign();
      }, 1000);
      window.open(createdDesign?.createCanvaDesign?.editUrl, "_blank");
    }
  }, [createdDesign]);

  return async (action) => {
    const { selectedFilesForAction } = action.state;

    if (selectedFilesForAction.length) {
      const file = selectedFilesForAction[0];

      // We save the dimensions of the image to create the Canva Design
      const img = new Image();
      img.src = file.url;
      img.onload = () => {
        setImageDimensions({
          width: img.width,
          height: img.height,
        });
      };

      if (file?.editUrl) {
        return window.open(file?.editUrl, "_blank");
      }

      startCreateDesignToast();

      try {
        const jobUpload = await runUploadAsset({
          variables: {
            fileId: file.id,
          },
        });

        const jobUploadId = await jobUpload?.data?.createAssetUploadJob?.jobId;

        if (jobUploadId) {
          setJobId(jobUploadId);
          startPolling(500);
        }
      } catch (error) {
        toast.update(toastId.current, {
          render: "Failed to upload file to Canva.",
          type: "error",
          isLoading: false,
        });
      }
    }
  };
}

export default useOpenOnCanvaAction;
