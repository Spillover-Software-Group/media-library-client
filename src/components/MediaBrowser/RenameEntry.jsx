import { gql } from "@apollo/client";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import useMutationAndRefetch from "../../hooks/useMutationAndRefetch";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";

const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required("Required"),
});

const RENAME_ENTRY_MUTATION = gql`
  mutation RenameEntry(
    $entryId: GID!
    $name: String!
  ) {
    renameEntry(
      input: {
        entryId: $entryId
        name: $name
      }
    ) {
      id
      name
    }
  }
`;

function RenamePrompt({ entry, close }) {
  const [runRenameEntry] = useMutationAndRefetch(RENAME_ENTRY_MUTATION);

  const renameEntry = async ({ name }) => {
    await runRenameEntry({
      variables: {
        entryId: entry.id,
        name,
      },
    });

    if (close) close();
  };

  const nameWithoutExtension = entry.isDir ? entry.name : entry.name.split(".").slice(0, -1).join(".");

  return (
    <div>
      <p className="sml-text-sm sml-font-semibold sml-mb-0">Rename {entry.isDir ? "folder" : "file"} "{entry.name}"</p>
      <Formik
        initialValues={{
          name: nameWithoutExtension,
        }}
        validateOnMount
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={renameEntry}
      >
        {({ isSubmitting }) => (
          <Form style={{ marginRight: "-8px", marginLeft: "-8px" }} className="sml-flex sml-flex-row sml-space-x-2 sml-p-2 sml-border-b sml-mb-4">
            <TextInput
              name="name"
              placeholder="Name"
              autoFocus
              disabled={isSubmitting}
            />

            <PrimaryButton disabled={isSubmitting}>Save</PrimaryButton>
            <SecondaryButton disabled={isSubmitting} onClick={() => close()}>Cancel</SecondaryButton>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RenamePrompt;
