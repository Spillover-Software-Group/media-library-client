import CanvaIntegration from "./CanvaIntegration";

function ExternalIntegrations({ changeBrowser }) {
  return (
    <div>
      <h6 className="sml-ml-4 sml-mb-3 sml-mt-10">External Integrations</h6>
      <ul>
        <CanvaIntegration changeBrowser={changeBrowser} />
      </ul>
    </div>
  );
}

export default ExternalIntegrations;
