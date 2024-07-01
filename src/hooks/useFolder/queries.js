import { gql } from "@apollo/client";

const folderFieldsFragment = gql`
  fragment FolderFields on Folder {
    id
    folderChain {
      id
      name
      isDir
    }
    entries {
      id
      name
      isDir
      modDate
      ... on FileEntry {
        size
        url
        thumbnailUrl
        mimetype
      }
      ... on FolderEntry {
        childrenCount
      }
    }
  }
`;

const account = {
  extractFolder: (data) => data.account.folder,
  query: gql`
    ${folderFieldsFragment}
    query GetAccountFolder($accountId: GID!, $folderId: GID) {
      currentAccountId @client @export(as: "accountId")
      currentFolderId @client @export(as: "folderId")
      account(accountId: $accountId) {
        id
        folder(folderId: $folderId) {
          ...FolderFields
        }
      }
    }
  `,
};

const global = {
  extractFolder: (data) => data.globalFolder,
  query: gql`
    ${folderFieldsFragment}
    query GetGlobalFolder($accountId: GID!, $folderId: GID) {
      currentAccountId @client @export(as: "accountId")
      currentFolderId @client @export(as: "folderId")
      globalFolder(accountId: $accountId, folderId: $folderId) {
        ...FolderFields
      }
    }
  `,
};

const favorites = {
  extractFolder: (data) => data.account.favorites,
  query: gql`
    ${folderFieldsFragment}
    query GetFavoritesFolder($accountId: GID!) {
      currentAccountId @client @export(as: "accountId")
      account(accountId: $accountId) {
        id
        favorites {
          ...FolderFields
        }
      }
    }
  `,
};

const deleted = {
  extractFolder: (data) => data.account.trashBin,
  query: gql`
    ${folderFieldsFragment}
    query GetTrashBinFolder($accountId: GID!, $folderId: GID) {
      currentAccountId @client @export(as: "accountId")
      currentFolderId @client @export(as: "folderId")
      account(accountId: $accountId) {
        id
        trashBin(folderId: $folderId) {
          ...FolderFields
        }
      }
    }
  `,
};

const canva = {
  extractFolder: (data) => {
    console.log({ data });
  },
  query: gql`
    query GetCanvaFolders($accountId: GID!) {
      currentAccountId @client @export(as: "accountId")
      account(accountId: $accountId) {
        id
        name
        canva {
          test
        }
      }
    }
  `,
};

export { account, global, favorites, deleted, canva };
