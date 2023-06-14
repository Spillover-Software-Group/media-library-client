import { InMemoryCache, makeVar } from "@apollo/client";

const currentAccountIdVar = makeVar(null);
const currentMediaBrowserVar = makeVar("account");
const currentFolderIdVar = makeVar(null);
const marketTypeVar = makeVar("restaurant");

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentAccountId: {
          read() {
            return currentAccountIdVar();
          },
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
        marketType: {
          read() {
            return marketTypeVar();
          }
        },
      },
    },
  },
});

export default cache;

export { currentAccountIdVar, currentMediaBrowserVar, currentFolderIdVar, marketTypeVar };
