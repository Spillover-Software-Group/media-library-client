# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@spillover/media-library` — an embeddable React component library (not a standalone app). Other Spillover apps (Senalysis, Engage, etc.) import the default `MediaLibrary` component, or the `GenerateImageStandalone` / `UploadAreaStandalone` exports, from `src/main.jsx`. It talks to the media-library Rails API (`../api`) over GraphQL.

## Commands

```shell
npm start          # Vite dev server on :1234, serves the dummy harness app
npm run build      # builds dist/media-library.es.js + dist/style.css (ES lib)
npm run lint       # biome check --write (Biome is the linter/formatter)
```

Or via Docker/DIP from the `media-library/` repo root: `dip provision` (once), `dip up -d`, `dip c s` (client dev server), `dip c npm <cmd>`, `dip a s` (API server on :3030). There is no test suite.

Local development uses the dummy app (`index.html` → `dummy/App.jsx`), which mounts the components with `mode="development"` so they hit the local API at `localhost:3030` instead of production. Endpoints are hardcoded in `src/config/index.js` and switched by the `mode` prop.

## Releasing

`dist/` is committed — it IS the consumable artifact (consumers install from this git repo). To release: bump `version` in `package.json`, run `npm run build`, and commit `dist/` along with the source. The `postbuild` script is a `sed` hack that hides `useInsertionEffect` from bundlers so the build stays compatible with React 16 hosts (`sed -i ''` is macOS-flavored). React/ReactDOM are externals/peer deps (>= 16) — never bundle them.

## Architecture

**Provider stack** (`src/main.jsx` → `src/Wrapper.jsx`): `AuthProvider` → `OptionsProvider` → `ApolloProvider` → `AccountsProvider`. All host-app props (`handleSelected`, `selectableFileTypes`, `maxSelectableSize`, `autoSelect`, `icons`, …) flow into `OptionsProvider` and are read anywhere via `useOptions()`. Several options accept a value or a predicate function.

**Auth** (`src/hooks/useAuth.jsx`): self-contained SSO. If no valid token, `AuthProvider` renders an iframe pointing at the API's `/sso` endpoint; the iframe posts an `SSO_CALLBACK` message with an OAuth token, which is stored in localStorage keyed to the `ownerId` prop. Changing `ownerId` invalidates the token (keeps auth in sync with the host app); a GraphQL 401 triggers `reauth()` via the Apollo error link. The Apollo link chain uses `createUploadLink` so mutations can carry multipart file uploads.

**Client-side state** (`src/cache.js`): Apollo reactive vars — `currentAccountId`, `currentMediaBrowser`, `currentFolderId`, `currentFolderName` — exposed as `@client` Query fields. GraphQL operations inject them with the `field @client @export(as: "var")` pattern, so queries/mutations automatically target the current account/folder without prop drilling. The `useCurrentX` hooks return `[value, reactiveVar]` — the var itself is the setter.

**Media browsers**: the sidebar switches `currentMediaBrowser` between `account` (My Media), `global` (Spillover Stock), `favorites`, `deleted`, and `canva`. Each key maps to a `{ query, extractFolder }` pair in `src/hooks/useFolder/queries.js`; `useFolder` runs the active one (polling every 1.5s, but only while inside the "Exported from Canva" folder). Adding a browser means adding a query there, a sidebar entry, and an actions list in `useFileActions`.

**File browser UI**: built on Chonky. `src/hooks/useFileActions.jsx` defines custom actions (`defineFileAction`) and maps action ids → handler hooks (`useDeleteFilesAction`, `useMoveFilesAction`, etc.), with the available action set varying per media browser. Mutation hooks go through `useMutationAndRefetch`, which auto-refetches the current browser's folder query. Chonky's built-in DnD provider is disabled; `MediaLibraryContainer` creates its own `DndProvider` so `UploadArea` can use `useDrop` (two HTML5 backends would conflict).

## Constraints from being embedded in host apps

- **Never use native `<form>` or default-submit buttons.** The library gets nested inside host-app forms (Senalysis), and a real form/submit would submit the parent form. `GenerateImage.jsx` uses a `role="form"` div, `type="button"`, and manual Enter-key/submit handling — follow that pattern.
- **Tailwind classes must use the `sml-` prefix**, and preflight is disabled (`tailwind.config.js`) so styles don't leak into or clash with the host page. Spillover brand colors are defined there as `spillover-color1..11`.
- Icons are Font Awesome class strings resolved through the `icons` map in `useOptions` (hosts can override them); the host page provides Font Awesome — it's only a devDependency here for the dummy app.
- Keep code React 16-compatible (no APIs newer than the peer-dep floor); the dummy app itself uses the legacy `react-dom` `render`.
