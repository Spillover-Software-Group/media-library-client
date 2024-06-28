import config from "../../../config";
import CanvaLogo from "../../../images/canva_logo.svg";

function CanvaIntegration() {
  const onConnectClick = () => {
    return new Promise((resolve, reject) => {
      try {
        const url = new URL(
          `${config.apiBaseDevEndpoint}/integrations-api/canva/v1/authorization`,
        );
        const windowFeatures = ["popup", "height=400", "width=400"];
        const authWindow = window.open(url, "", windowFeatures.join(","));

        window.addEventListener("message", (event) => {
          console.log({ event });
          if (event.data === "authorization_success") {
            console.log(event.data, "from autho");
            resolve(true);
            authWindow?.close();
          } else if (event.data === "authorization_error") {
            console.log(event.data);
            reject(new Error("Authorization failed"));
            authWindow?.close();
          }
        });
      } catch (error) {
        console.error("Authorization failed", error);
        reject(error);
      }
    });
  };

  return (
    <li>
      <div
        onClick={onConnectClick}
        className="sml-flex sml-items-center sml-text-sm w-full sml-cursor-pointer hover:sml-bg-gray-200 sml-p-2"
      >
        <img src={CanvaLogo} alt="Engage Logo" className="sml-w-8" />
        <span className="sml-ml-2">Connect To Canva</span>
      </div>
    </li>
  );
}

export default CanvaIntegration;
