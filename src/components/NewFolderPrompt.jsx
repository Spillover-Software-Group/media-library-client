import { gql, useMutation } from '@apollo/client';
import { Formik, Field, Form } from 'formik';

const CREATE_FOLDER_MUTATION = gql`
  mutation CreateFolder(
    $parentId: ID!
    $name: String!
  ) {
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

function NewFolderPrompt({ parentId, close }) {
  const [runCreateFolder] = useMutation(CREATE_FOLDER_MUTATION, {
    refetchQueries: ['GetAccountFolderWithChildrenAndFiles', 'GetGlobalFolder'],
  });

  const createFolder = ({ name }) => {
    runCreateFolder({
      variables: {
        parentId,
        name,
      },
    });

    if (close) close();
  };

  return (
    <Formik
      initialValues={{
        name: '',
      }}
      onSubmit={createFolder}
    >
      {({ isSubmitting }) => (
        <Form className="sml-flex sml-flex-row sml-space-x-2 sml-py-2 sml-border-b sml-mb-4">
          <Field
            name="name"
            placeholder="Folder name"
            className="sml-border-solid sml-bg-gray-50 sml-border sml-border-gray-300 sml-text-gray-900 sml-text-sm sml-rounded-lg sml-focus:ring-spillover-color2 sml-focus:border-spillover-color2 sml-block sml-p-2"
          />

          <button
            className="sml-bg-spillover-color2 sml-px-3 sml-py-1 sml-text-xs sml-md:text-sm sml-text-white sml-rounded-2xl sml-border-none"
            type="submit"
            disabled={isSubmitting}
          >
            Create
          </button>

          <button
            className="sml-bg-spillover-color3 sml-px-3 sml-py-1 sml-text-xs sml-md:text-sm sml-text-black sml-rounded-2xl sml-border-none"
            type="button"
            disabled={isSubmitting}
            onClick={() => close()}
          >
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default NewFolderPrompt;
