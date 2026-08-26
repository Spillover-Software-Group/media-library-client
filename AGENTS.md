# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` is a symlink to this file.

## Before you branch

This checkout is shared with other people and with coding agents, so it may be sitting on someone
else's feature branch with uncommitted work. Never branch off whatever `HEAD` happens to be.
Confirm where you are, then branch off the remote default, which in this repo is **`master`**:

```shell
git status -sb
git fetch origin && git switch -c <ticket> origin/master
```

Default branches are not uniform across the Spillover repos: `main` in `oo`, `media-library`
and `printer_manager`, `master` everywhere else, so a hardcoded `git checkout master` fails in
three of them.

## What this is

`@spillover/media-library`: an **embeddable React component library, not a standalone app**. Other Spillover apps (SENALYSIS, ENGAGE, Accounts) import the default `MediaLibrary` component, or the `GenerateImageStandalone` / `UploadAreaStandalone` exports, from `src/main.jsx`, and mount it inside their own pages. It talks to the media-library Rails API (`../api`) over GraphQL. Both repos are submodules of the `media-library` orchestrator, which owns the Docker/dip dev environment.

Being embedded is the central constraint here, and it has its own section below. Read it before touching forms, styling, or anything React-version-sensitive.

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

## Maintaining this file

This is orientation for someone who has never seen the repo, not a changelog. A reader should get through
the whole thing in a few minutes, and it should still be accurate a year from now.

**Add an entry only if it is** an architectural fact spanning several files, an invariant that new code
must not break (the embedding constraints above are the clearest examples), or a command you cannot guess.
Write the rule, not its history.

**Do not add**: the reasoning behind a particular bug fix, how a feature evolved, the behavior of one
component, or a rule that lives inside one file. Those go in a comment next to the code or in the PR.

**Two smells.** An entry only a reader who already knows the feature can follow is a code comment. A
section longer than a screenful has a code comment hiding in it. When you add something, look for
something to delete.

`README.md` covers how to run, build and release the library; keep it current for the same reasons.
