import { gql } from "@apollo/client";
import { Formik, Form } from "formik";

import useMutationAndRefetch from "../../hooks/useMutationAndRefetch";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

const CREATE_FOLDER_MUTATION = gql`
  mutation CreateFolder(
    $parentId: GID!
    $name: String!
  ) {
    currentFolderId @client @export(as: "parentId")
    createFolder(
      input: {
        parentId: $parentId,
        name: $name
      }
    ) {
      id
      name
    }
  }
`;

function NewFolderPrompt({ close }) {
  const [runCreateFolder] = useMutationAndRefetch(CREATE_FOLDER_MUTATION);

  const createFolder = ({ name }) => {
    runCreateFolder({
      variables: {
        name,
      },
    });

    if (close) close();
  };

  return (
    <Formik
      initialValues={{
        name: "",
      }}
      onSubmit={createFolder}
    >
      {({ isSubmitting }) => (
        <Form style={{marginRight: "-8px", marginLeft: "-8px"}} className="sml-flex sml-flex-row sml-space-x-2 sml-p-2 sml-border-b sml-mb-4">
          <TextInput
            name="name"
            placeholder="Folder name"
          />

          <PrimaryButton disabled={isSubmitting}>Create</PrimaryButton>
          <SecondaryButton disabled={isSubmitting} onClick={() => close()}>Cancel</SecondaryButton>
        </Form>
      )}
    </Formik>
  );
}

export default NewFolderPrompt;
