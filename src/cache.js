import { InMemoryCache, makeVar } from "@apollo/client";

const currentAccountIdVar = makeVar(null);
const currentMediaBrowserVar = makeVar("account");
const currentFolderIdVar = makeVar(null);
const currentFolderNameVar = makeVar("Home");

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentAccountId: {
          read() {
            return currentAccountIdVar();
          },
        },
        currentFolderName: {
          read() {
            return currentFolderNameVar();
          }
        },
        currentMediaBrowser: {
          read() {
            return currentMediaBrowserVar();
          },
        },
        currentFolderId: {
          read() {
            return currentFolderIdVar();
          },
        },
      },
    },
  },
});

export default cache;

export { currentAccountIdVar, currentMediaBrowserVar, currentFolderIdVar, currentFolderNameVar };
