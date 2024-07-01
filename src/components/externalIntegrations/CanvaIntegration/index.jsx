import { useState } from "react";

import config from "../../../config";
import CanvaLogo from "../../../images/canva_logo.svg";

function CanvaIntegration({ changeBrowser }) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  // const [connected, setConnected] = useState(true);

  const onConnectClick = async () => {
    try {
      setLoading(true);
      await authorization();
      setConnected(true);
    } catch (error) {
      alert("Something went wrong, please, try again.");
    } finally {
      setLoading(false);
    }
  };

  const authorization = () => {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(
          `${config.apiBaseDevEndpoint}/integrations-api/canva/v1/authorization`,
        );
        const windowFeatures = ["popup", "height=400", "width=400"];
        const authWindow = window.open(url, "", windowFeatures.join(","));

        window.addEventListener("message", (event) => {
          if (event.data === "authorization_success") {
            resolve(true);
            authWindow?.close();
          } else if (event.data === "authorization_error") {
            reject(new Error("Authorization failed"));
            authWindow?.close();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const loadCanva = () => {
    changeBrowser("canva");
  };

  return (
    <li>
      {connected ? (
        <div
          onClick={loadCanva}
          className="sml-flex sml-items-center sml-pl-4 sml-text-sm w-full sml-cursor-pointer hover:sml-bg-gray-200 sml-p-2"
        >
          <img src={CanvaLogo} alt="Engage Logo" className="sml-w-6" />
          <span className="sml-ml-2">Canva</span>
        </div>
      ) : (
        <div
          onClick={onConnectClick}
          className="sml-flex sml-items-center sml-pl-4 sml-text-sm w-full sml-cursor-pointer hover:sml-bg-gray-200 sml-p-2"
        >
          <img src={CanvaLogo} alt="Engage Logo" className="sml-w-6" />

          <span className="sml-ml-2">
            {loading ? "Connecting..." : "Connect To Canva"}
          </span>
        </div>
      )}
    </li>
  );
}

export default CanvaIntegration;
