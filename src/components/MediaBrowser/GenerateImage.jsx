import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import useMutationAndRefetch from "../../hooks/useMutationAndRefetch";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import Icon from "../Icon";
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
      imageUrl
      errors {
        message
      }
    }
  }
`;

const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadGeneratedImage(
    $accountId: GID!
    $prompt: String!
    $imageUrl: String!
  ) {
    currentAccountId @client @export(as: "accountId")
    uploadGeneratedImages(
      input: {
        accountId: $accountId,
        images: [
          {
            prompt: $prompt,
            url: $imageUrl
          }
        ]
      }
    ) {
      id
      name
      url
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
  const [runGenerateImage] = useMutation(GENERATE_IMAGE_MUTATION);
  const [runUploadGeneratedImage] = useMutationAndRefetch(UPLOAD_IMAGE_MUTATION);
  const [imageUrl, setImageUrl] = useState(null);
  const [promptSize, setPromptSize] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const initialValues = {
    prompt: "",
  };

  const generateImage = async ({ prompt }) => {
    setImageUrl(null);

    const { data } = await runGenerateImage({ variables: { prompt }});

    if (data.generateImage.errors) {
      data.generateImage.errors.forEach((error) => {
        toast.error(error.message, { autoClose: false });
      });
    } else {
      toast.success("Image generated!");
      setImageUrl(data.generateImage.imageUrl);
    }
  };

  const save = async (prompt) => {
    try {
      setIsSaving(true);
      const { data } = await runUploadGeneratedImage({ variables: { prompt, imageUrl }});
      setIsSaving(false);
      return data.uploadGeneratedImages[0];
    } catch (e) {
      setIsSaving(false);
      toast.error("Failed to save image", { autoClose: false });
      return false;
    }
  };

  const saveAndUse = async (prompt) => {
    const image = await save(prompt);

    if (useImage && image) {
      useImage(image);
      if (close) close();
    }
  };

  const saveAndResubmit = async (prompt, submitForm) => {
    const image = await save(prompt);
    if (image) submitForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={generateImage}
      validationSchema={VALIDATION_SCHEMA}
    >
      {({ isSubmitting, setFieldValue, submitForm, values }) => (
        <div className="sml-flex sml-flex-col sml-gap-4">
          <Form className="sml-w-full sml-flex sml-flex-row sml-gap-2">
            {/* Input and validation */}
            <div className="sml-flex sml-grow sml-flex-col sml-gap-1">
              <div className="sml-grow">
                <TextInput
                  name="prompt"
                  placeholder="Describe your image..."
                  maxLength={MAX_PROMPT_LENGTH}
                  disabled={isSubmitting || isSaving}
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
                <Icon name="generateImage" className={`sml-mr-1 ${isSubmitting && "fa-shake"}`} />
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
          <div className="sml-w-full sml-flex sml-flex-col sml-gap-4 sml-items-center">
            {imageUrl && (
              <>
                <div>
                  <a href={imageUrl} target="_blank" rel="noreferrer" title="Open image in new tab">
                    <img src={imageUrl} alt="Generated image" className="sml-max-w-full sml-max-h-96" />
                  </a>
                </div>

                <div className="sml-flex sml-flex-row sml-gap-2">
                  <PrimaryButton disabled={isSubmitting || isSaving} onClick={() => saveAndUse(values.prompt)}>
                    <Icon name="confirm" className="sml-mr-1" />
                    Use this image
                  </PrimaryButton>

                  <SecondaryButton disabled={isSubmitting || isSaving} onClick={() => saveAndResubmit(values.prompt, submitForm)}>
                    <Icon name="save" className="sml-mr-1" />
                    Save and generate another
                  </SecondaryButton>

                  <SecondaryButton onClick={submitForm} disabled={isSubmitting || isSaving}>
                    <Icon name="reload" className={`sml-mr-1 ${isSubmitting && "fa-spin"}`} />
                    Discard and generate another
                  </SecondaryButton>
                </div>
              </>
            )}

            {(isSubmitting || isSaving) && (
              <>
                <div className="sml-text-gray-500">
                  {isSaving ? "Saving image..." : "Generating image..."}
                </div>
                <LoadingSpinner />
              </>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
}

export default GenerateImage;
