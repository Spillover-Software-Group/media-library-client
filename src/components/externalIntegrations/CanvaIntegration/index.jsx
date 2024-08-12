import { useState } from "react";
import { gql } from "@apollo/client";

import config from "../../../config";
import CanvaLogo from "../../../images/canva_logo.svg";
import useAccounts from "../../../hooks/useAccounts";
import useAuth from "../../../hooks/useAuth";
import useMutationAndRefetch from "../../../hooks/useMutationAndRefetch";

const DESTROY_CANVA_INTEGRATION = gql`
  mutation destroyCanvaIntegration($accountId: GID!) {
    currentAccountId @client @export(as: "accountId")
    destroyCanvaIntegration(
      input: {
        accountId: $accountId
      }
    ) {
      id
    }
  }
`;

function CanvaIntegration({ currentBrowser, changeBrowser }) {
  const { currentAccount, loading, refetch } = useAccounts();
  const { accessToken } = useAuth();
  const [connecting, setConnecting] = useState(false);

  const [disconnectCanva] = useMutationAndRefetch(DESTROY_CANVA_INTEGRATION);

  const onConnectClick = async () => {
    try {
      setConnecting(true);
      await authorization();
    } catch (error) {
      alert("Something went wrong, please, try again.");
    } finally {
      setConnecting(false);
    }
  };

  const authorization = () => {
    return new Promise((resolve, reject) => {
      try {
        const apiBaseEndpoint = config.isDev
          ? config.apiBaseDevEndpoint
          : config.apiBaseEndpoint;

        const url = new URL(
          `${apiBaseEndpoint}/integrations-api/canva-account/v1/oauth2/authorize?access_token=${accessToken}`,
        );
        const windowFeatures = ["popup", "height=400", "width=400"];
        const authWindow = window.open(url, "", windowFeatures.join(","));

        window.addEventListener("message", (event) => {
          if (event.data === "authorization_success") {
            resolve(true);
            refetch(); // Refetch the currentUser to access the Canva Int details
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

  const disconnect = async () => {
    await disconnectCanva();
  };

  return (
    <li>
      {loading ? (
        <div className="sml-pl-4">Loading...</div>
      ) : currentAccount?.integrations?.canva ? (
        <div
          onClick={loadCanva}
          className="sml-flex sml-flex-col sml-items-start sml-pl-4 sml-text-sm w-full sml-cursor-pointer hover:sml-bg-gray-200 sml-p-2"
        >
          <div className="sml-w-full sml-flex sml-justify-between">
           <div className="sml-flex">
            <img src={CanvaLogo} alt="Engage Logo" className="sml-w-6" />
              <span
                className={`${currentBrowser === "canva" ? "sml-text-spillover-color11 sml-font-bold" : "sml-text-spillover-color10 sml-font-medium"} sml-ml-2`}
              >
                Canva
              </span>
           </div>
           <div>
            <span onClick={disconnect} className="sml-text-xs hover:sml-text-spillover-color11 hover:sml-underline">Disconnect</span>
           </div>
          </div>
          <div className="sml-text-2xs sml-mt-2">
            Connected as:
            <span className="sml-block sml-text-xs sml-font-semibold">
              {currentAccount?.integrations?.canva?.userDisplayName}
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={onConnectClick}
          className="sml-flex sml-items-center sml-pl-4 sml-text-sm w-full sml-cursor-pointer hover:sml-bg-gray-200 sml-p-2"
        >
          <img src={CanvaLogo} alt="Engage Logo" className="sml-w-6" />

          <span className="sml-ml-2">
            {connecting ? "Connecting..." : "Connect To Canva"}
          </span>
        </div>
      )}
    </li>
  );
}

export default CanvaIntegration;
