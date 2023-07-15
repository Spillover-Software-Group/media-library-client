import { useState } from "react";
import { gql } from "@apollo/client";
import { Formik, Field, Form } from "formik";

import useMutationAndRefetch from "../../hooks/useMutationAndRefetch";
import LoadingSpinner from "../LoadingSpinner";

const GENERATE_IMAGE_MUTATION = gql`
  mutation GenerateImage(
    $accountId: GID!
    $prompt: String!
  ) {
    currentAccountId @client @export(as: "accountId")
    generateImage(
      input: {
        accountId: $accountId,
        prompt: $prompt
      }
    ) {
      id
      name
      size
      url
      mimetype
    }
  }
`;

function GenerateImage({ close }) {
  const [runGenerateImage] = useMutationAndRefetch(GENERATE_IMAGE_MUTATION);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [promptSize, setPromptSize] = useState(0);

  const generateImage = async ({ prompt }) => {
    const { data } = await runGenerateImage({
      variables: {
        prompt,
      },
    });

    console.log("data", data);

    if (data && data.generateImage) {
      setPreviewUrl(data.generateImage.url);
    }

    // if (close) close();
  };

  return (
    <Formik
      initialValues={{
        prompt: "",
      }}
      onSubmit={generateImage}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="sml-flex sml-flex-col sml-space-y-4 sml-border-b sml-mb-4 sml-bg-gray-200 sml-p-4 sml-absolute sml-w-full sml-z-50 sml-top-36 sml-shadow-lg sml-w-full">
          <div className="sml-flex sml-flex-row sml-space-x-2">
            <Field
              name="prompt"
              placeholder="Prompt"
              maxLength="400"
              onChange={(e) => { setPromptSize(e.target.value.length); setFieldValue("prompt", e.target.value); }}
              className="sml-w-1/2 sml-border-solid sml-bg-gray-50 sml-border sml-border-gray-300 sml-text-gray-900 sml-text-sm sml-rounded-lg sml-focus:ring-spillover-color2 sml-focus:border-spillover-color2 sml-block sml-p-2"
            />

            <button
              className="sml-bg-spillover-color2 sml-px-3 sml-py-1 sml-text-xs sml-md:text-sm sml-text-white sml-rounded-2xl sml-border-none"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <LoadingSpinner />}
              Generate
            </button>

            <button
              className="sml-bg-spillover-color3 sml-px-3 sml-py-1 sml-text-xs sml-md:text-sm sml-text-black sml-rounded-2xl sml-border-none"
              type="button"
              disabled={isSubmitting}
              onClick={() => close()}
            >
              Cancel
            </button>
          </div>

          <div className="sml-text-xs">
            {promptSize}/400
          </div>

          <div className="sml-flex sml-flex-row">
            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img src={previewUrl} alt="Generated Image" />
              </a>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default GenerateImage;
