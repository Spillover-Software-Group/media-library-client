import { useState } from "react";
import { gql } from "@apollo/client";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import useMutationAndRefetch from "../../hooks/useMutationAndRefetch";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import Icon from "../Icon";

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
      image {
        id
        name
        url
        mimetype
      }
      errors {
        message
      }
    }
  }
`;

const MAX_PROMPT_LENGTH = 400;

const VALIDATION_SCHEMA = Yup.object().shape({
  prompt: Yup.string()
    .required("Prompt is required")
    .max(MAX_PROMPT_LENGTH, "Prompt must be less than 400 characters"),
});

function GenerateImage({ close, useImage }) {
  const [runGenerateImage] = useMutationAndRefetch(GENERATE_IMAGE_MUTATION);
  const [image, setImage] = useState(null);
  const [promptSize, setPromptSize] = useState(0);

  const initialValues = {
    prompt: "",
  };

  const generateImage = async ({ prompt }) => {
    const { data } = await runGenerateImage({ variables: { prompt }});

    if (data.generateImage.errors) {
      data.generateImage.errors.forEach((error) => {
        toast.error(error.message, { autoClose: false });
      });
    } else {
      toast.success("Image generated!");
      setImage(data.generateImage.image);
    }
  };

  const use = () => {
    if (useImage) useImage(image);
    close();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={generateImage}
      validationSchema={VALIDATION_SCHEMA}
    >
      {({ isSubmitting, setFieldValue, submitForm }) => (
        <div className="sml-flex sml-flex-col sml-gap-4">
          <Form className="sml-w-full sml-flex sml-flex-row sml-gap-2">
            {/* Input and validation */}
            <div className="sml-flex sml-grow sml-flex-col sml-gap-1">
              <div className="sml-grow">
                <TextInput
                  name="prompt"
                  placeholder="Describe your image..."
                  maxLength={MAX_PROMPT_LENGTH}
                  onChange={(e) => { setPromptSize(e.target.value.length); setFieldValue("prompt", e.target.value); }}
                />
              </div>

              <div className="sml-flex sml-shrink sml-flex-row sml-text-xs">
                <div className="sml-grow sml-text-red-500">
                  <ErrorMessage name="prompt" />
                </div>

                <div className="sml-shrink sml-text-gray-500">
                  {promptSize}/{MAX_PROMPT_LENGTH}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="sml-flex sml-shrink sml-flex-row sml-gap-2">
              <PrimaryButton disabled={isSubmitting}>
                <Icon name="magic-wand-sparkles" iconStyle="fa-solid" className={`sml-mr-1 ${isSubmitting && "fa-shake"}`} />
                Generate
              </PrimaryButton>

              {close && (
                <SecondaryButton onClick={close}>
                  Close
                </SecondaryButton>
              )}
            </div>
          </Form>

          {/* Preview */}
          {image && (
            <div className="sml-w-full sml-flex sml-flex-col sml-gap-4 sml-items-center">
              <div>
                <a href={image.url} target="_blank" rel="noreferrer" title="Open image in new tab">
                  <img src={image.url} alt="Generated image" className="sml-max-w-full sml-max-h-96" />
                </a>
              </div>

              <div className="sml-flex sml-flex-row sml-gap-2">
                <PrimaryButton onClick={use}>
                  <Icon name="circle-check" iconStyle="fa-solid" className="sml-mr-1" />
                  Use this image
                </PrimaryButton>

                <SecondaryButton onClick={submitForm} disabled={isSubmitting}>
                  <Icon name="rotate-right" iconStyle="fa-solid" className={`sml-mr-1 ${isSubmitting && "fa-spin"}`} />
                  Generate another
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      )}
    </Formik>
  );
}

export default GenerateImage;
