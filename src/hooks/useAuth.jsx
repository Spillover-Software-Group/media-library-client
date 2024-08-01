import { useContext, useCallback, createContext, useRef } from "react";
import { DateTime } from "luxon";

import config from "../config";
import useLocalStorage from "./useLocalStorage";
import useEventListener from "./useEventListener";

class TokenData {
  constructor(data) {
    this.accessToken = data.accessToken;
    this.expiresAt = data.expiresAt;
    this.ownerId = data.ownerId;
  }

  static fromOAuthResponse(data, ownerId) {
    return new TokenData({
      accessToken: data.access_token,
      expiresAt: DateTime.now().plus({ seconds: data.expires_in }),
      ownerId,
    });
  }

  static fromStored(data) {
    return new TokenData({
      ...data,
      expiresAt: DateTime.fromISO(data.expiresAt),
    });
  }

  get dataForStorage() {
    return {
      accessToken: this.accessToken,
      expiresAt: this.expiresAt.toISO(),
      ownerId: this.ownerId,
    };
  }

  get expiresIn() {
    return this.expiresAt.diffNow();
  }

  get isExpired() {
    return this.expiresIn.as("milliseconds") <= 0;
  }

  get isValid() {
    return !this.isExpired;
  }
}

function SSOFrame({ mode, onComplete }) {
  const iframeRef = useRef();

  const handleSSOMessage = useCallback(
    (e) => {
      if (iframeRef.current?.contentWindow !== e.source) return;
      if (config.isDev) console.log("Received message", e);

      const {
        data: { type, payload },
      } = e;

      if (onComplete && type == "SSO_CALLBACK") onComplete(payload);
    },
    [iframeRef, onComplete],
  );

  useEventListener("message", handleSSOMessage);

  return (
    <iframe
      ref={iframeRef}
      src={mode === "development" ? config.ssoDevUrl : config.ssoUrl}
      className="sml-w-full sml-h-full sml-border-0"
    />
  );
}

const authContext = createContext({
  isAuthenticated: false,
  tokenData: null,
  reauth: () => {},
  ssoCompleteHandler: () => {},
});

// Provider component that wraps your app and makes auth object
// available to any child component that calls useAuth().
function AuthProvider({ children, mode, ownerId }) {
  const auth = useProvideAuth({ ownerId });

  if (auth.isAuthenticated) {
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }

  return <SSOFrame mode={mode} onComplete={auth.ssoCompleteHandler} />;
}

// Hook for child components to get the auth object
// and re-render when it changes.
function useAuth() {
  return useContext(authContext);
}

const tokenDataStorageKey = "mediaLibraryTokenData";

// Provider hook that creates auth object and handles state.
function useProvideAuth({ ownerId }) {
  let tokenData;

  const [storedTokenData, storeTokenData] =
    useLocalStorage(tokenDataStorageKey);

  const ssoCompleteHandler = (data) => {
    if (data.error) {
      console.error("SSO callback error", data.error);
      return;
    }

    const newTokenData = TokenData.fromOAuthResponse(data, ownerId);
    storeTokenData(newTokenData.dataForStorage);
  };

  const reauth = () => {
    if (config.isDev) console.log("Reauthenticating...");
    storeTokenData(null);
  };

  if (storedTokenData) {
    if (ownerId !== storedTokenData.ownerId) {
      reauth();
    } else {
      tokenData = TokenData.fromStored(storedTokenData);
    }
  }

  const isAuthenticated = !!tokenData?.accessToken;

  return {
    accessToken: tokenData?.accessToken,
    isAuthenticated,
    reauth,
    ssoCompleteHandler,
  };
}

export default useAuth;

export { useAuth, AuthProvider };
