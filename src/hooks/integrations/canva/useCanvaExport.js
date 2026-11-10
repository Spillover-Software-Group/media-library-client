import { useApolloClient } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { canvaKindsFor, MEDIA } from "../../../media";
import useHandOverFiles from "../../useHandOverFiles";
import useMutationAndRefetch from "../../useMutationAndRefetch";
import useOptions from "../../useOptions";
import { CanvaExportError, exportErrorSentence } from "./exportErrorCopy";
import {
  CREATE_DESIGN_EXPORT_JOB,
  GET_DESIGN_EXPORT,
  UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
} from "./queries";

// Canva allows 120 export job reads a minute per user. One read every 2 seconds is a quarter of
// that, which leaves room for a second export or a second tab. An MP4 takes Canva far longer than
// a JPEG, so the wait is long, but it ends: a job still running after 5 minutes is given up on.
const POLL_INTERVAL_MS = 2000;
const GIVE_UP_AFTER_MS = 5 * 60 * 1000;

// A loading toast turns off closing and auto closing; null hands those back to the container.
const SETTLED = {
  isLoading: false,
  autoClose: null,
  closeOnClick: null,
  closeButton: null,
  draggable: null,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Brings a Canva design into My Media as what the host takes: exports it, waits for Canva, stores
// the export, and, when the design was opened, hands the stored file to the host. A host that takes
// both videos and pictures is asked which one through `awaitingKind`.
function useCanvaExport() {
  const client = useApolloClient();
  const { selectableMedia } = useOptions();
  const handOver = useHandOverFiles();
  const [runExport] = useMutationAndRefetch(CREATE_DESIGN_EXPORT_JOB);
  const [runUpload] = useMutationAndRefetch(
    UPLOAD_CANVA_DESIGN_TO_MEDIA_LIBRARY,
  );
  const [awaiting, setAwaiting] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Every step after a wait checks the widget is still there, so a host that closed it is never
  // handed a file, and no more reads go out.
  const stillOpen = () => {
    if (!mounted.current) throw new CanvaExportError("CLOSED");
  };

  // Reads the job until Canva finishes it, one read at a time.
  const finished = async (job, deadline) => {
    stillOpen();
    if (job.urls) return job;
    if (job.errorCode) throw new CanvaExportError(job.errorCode);
    if (Date.now() > deadline) throw new CanvaExportError("TIMED_OUT");

    await wait(POLL_INTERVAL_MS);
    stillOpen();

    const { data } = await client.query({
      query: GET_DESIGN_EXPORT,
      variables: { jobId: job.jobId },
      fetchPolicy: "network-only",
    });
    const next = data.account.integrations?.canva?.designExport;
    if (!next) throw new CanvaExportError("CANVA_EXPORT_FAILED");

    return finished(next, deadline);
  };

  const store = async (url, name, format) => {
    try {
      const { data } = await runUpload({
        variables: { fileUrl: { url, name }, format },
      });
      return data.uploadCanvaDesignFromUrl;
    } catch {
      throw new CanvaExportError("SAVE_FAILED");
    }
  };

  const bringIn = async (design, kind, handsOver) => {
    const { canvaFormat: format, noun } = MEDIA[kind];
    const toastId = toast.loading(
      `Getting "${design.name}" from Canva as a ${noun}...`,
    );

    try {
      const { data } = await runExport({
        variables: { designId: design.id, format },
      });
      const job = await finished(
        data.createDesignExportJob,
        Date.now() + GIVE_UP_AFTER_MS,
      );

      // Only the first page is kept (media-library-client#29).
      const file = await store(job.urls[0], design.name, format);
      stillOpen();
      toast.update(toastId, {
        ...SETTLED,
        render: `"${design.name}" was saved on your My Media folder as a ${noun}.`,
        type: "success",
      });
      if (handsOver) handOver([file]);
    } catch (error) {
      if (!mounted.current) return;
      toast.update(toastId, {
        ...SETTLED,
        render: exportErrorSentence(error),
        type: "error",
        autoClose: false,
      });
    }
  };

  // `handsOver` is false for "Save on my media", which stores the design and selects nothing.
  const exportDesign = (design, { handsOver }) => {
    const kinds = canvaKindsFor(selectableMedia);

    if (kinds.length > 1) {
      setAwaiting({ design, handsOver, kinds });
    } else {
      bringIn(design, kinds[0], handsOver);
    }
  };

  const awaitingKind = awaiting && {
    design: awaiting.design,
    kinds: awaiting.kinds,
    choose: (kind) => {
      setAwaiting(null);
      bringIn(awaiting.design, kind, awaiting.handsOver);
    },
    cancel: () => setAwaiting(null),
  };

  return { exportDesign, awaitingKind };
}

export default useCanvaExport;
