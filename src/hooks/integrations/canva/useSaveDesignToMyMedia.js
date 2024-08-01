import { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";

import useMutationAndRefetch from "../../useMutationAndRefetch";
import {
  CREATE_DESIGN_EXPORT_JOB,
  GET_DESIGN_EXPORT,
  UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
} from "./queries";

function useSaveDesignToMyMedia() {
  const toastId = useRef(null);
  const [jobId, setJobId] = useState();
  const [fileName, setFileName] = useState("");
  const [mediaLibraryFile, setMediaLibraryFile] = useState(null);

  const startCreateDesignToast = () =>
    (toastId.current = toast.loading(
      "Saving design on your My Media folder...",
    ));

  const exportedDesignToast = () =>
    toast.update(toastId.current, {
      render: "Design successfully saved on your My Media folder.",
      type: "success",
      isLoading: false,
    });

  const [runExportDesign] = useMutationAndRefetch(CREATE_DESIGN_EXPORT_JOB);
  const [_pollExportDesign, { data, startPolling, stopPolling }] = useLazyQuery(
    GET_DESIGN_EXPORT,
    {
      variables: {
        jobId,
      },
      fetchPolicy: "network-only",
    },
  );

  const [runUploadFileToMediaLibrary] = useMutationAndRefetch(
    UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
  );

  useEffect(() => {
    const uploadFile = async () => {
      const url = data?.account?.integrations?.canva?.designExport?.urls[0];

      const uploadedFile = await runUploadFileToMediaLibrary({
        variables: {
          fileUrl: {
            url,
            name: fileName,
          },
        },
      });

      if (uploadedFile) {
        const file = uploadedFile.data.uploadCanvaDesignFromUrl;

        setMediaLibraryFile({ ...file });
        exportedDesignToast();
        setTimeout(() => {
          toast.dismiss();
          setJobId();
        }, 400);
      }

      stopPolling();
    };

    if (data?.account?.integrations?.canva?.designExport?.urls) {
      uploadFile();
    }
  }, [data, stopPolling]);

  const saveOnMyMedia = async (design) => {
    if (design) {
      setFileName(design.name);
      startCreateDesignToast();

      try {
        const exportJob = await runExportDesign({
          variables: {
            designId: design.id,
          },
        });

        const jobExportId = await exportJob?.data?.createDesignExportJob?.jobId;

        if (jobExportId) {
          setJobId(jobExportId);
          startPolling(500);
        }
      } catch {
        toast.update(toastId.current, {
          render: "Failed to upload file to Canva.",
          type: "error",
          isLoading: false,
        });
      }
    }
  };

  return { saveOnMyMedia, mediaLibraryFile };
}

export default useSaveDesignToMyMedia;
