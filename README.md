# Media Library React Client

`@spillover/media-library`: the embeddable React component library for the Spillover Media Library. It is
**not a standalone app** — SENALYSIS, ENGAGE and Accounts install it from this git repo and mount its
components inside their own pages. It talks to the
[media-library API](https://github.com/Spillover-Software-Group/media-library-api) over GraphQL, and both
are submodules of the [media-library](https://github.com/Spillover-Software-Group/media-library)
orchestrator repo, which owns the Docker/dip dev environment.

## What consumers import

From `src/main.jsx`: the default `MediaLibrary` component, plus the `GenerateImageStandalone` and
`UploadAreaStandalone` exports. Host apps pass in their own props (selection handlers, allowed file types,
size limits, icons) and an `ownerId` that scopes the stored auth token.

## Running it

```shell
npm install
npm start          # Vite dev server on :1234, serving the dummy harness app
```

Or from the orchestrator repo: `dip up -d`, then `dip c s` for this dev server and `dip c npm …` for any
npm command.

There is no way to run the library by itself, so local development goes through the **dummy harness**
(`index.html` → `dummy/App.jsx`), which mounts the components with `mode="development"` so they hit the
local API at `localhost:3030` instead of production. The endpoints are hardcoded in `src/config/index.js`
and switched by that `mode` prop, so the API (and Accounts, for sign-in) has to be running.

## Scripts

```shell
npm start          # Vite dev server on :1234
npm run build      # dist/media-library.es.js + dist/style.css
npm run lint       # biome check --write (lint + format, autofix)
```

There is no test suite.

## Releasing

**`dist/` is committed, and it is the artifact consumers install.** A source change reaches no host app
until you rebuild and commit it:

1. Bump `version` in `package.json`.
2. `npm run build`.
3. Commit the source **and** `dist/`.
4. Bump the lockfile in each consuming app.

Two details to be aware of: the `postbuild` script is a `sed` hack that hides `useInsertionEffect` from
bundlers so the build stays compatible with React 16 hosts (and it is macOS-flavored `sed -i ''`), and
React and ReactDOM are peer dependencies and externals — **never bundle them**.

## Working inside a host page

The embedding is the source of most of this library's unusual rules: no native `<form>` or default-submit
buttons, Tailwind classes prefixed `sml-` with preflight disabled, Font Awesome class strings supplied by
the host, and React 16 compatibility. [`AGENTS.md`](AGENTS.md) has the full list and the reasons, along
with the provider stack, the SSO iframe flow, the Apollo reactive-var state, and how the media browsers
and file actions fit together. `CLAUDE.md` is a symlink to it.
