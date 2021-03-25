import React, { useEffect, useGlobal, useState } from "reactn";
import { auth, config, firestore } from "../firebase";
import { notification } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import UrlAssembler from "url-assembler";
import ReactPixel from "react-facebook-pixel";
import { gaRegister, gaRegisterFacebook, timeoutPromise } from "../utils";
import { isMobileDevice } from "../utils/deviceType";
import { useRef } from "react";
import { useUser } from "../hoc/useLocalStorageState";
import {
  googleTagManagerRegisterArgs,
  googleTagManagerRegisterFBArgs,
} from "../utils/googleTagManager";

export const withAuthentication = (Component) => () => {
  const [, setGlobalUser] = useGlobal("user");
  const [, setShowGuide] = useGlobal("showGuide");
  const [influencer] = useGlobal("influencer");
  const [globalRegister, setGlobalRegister] = useGlobal("register");
  const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal(
    "isLoadingCreateUser"
  );
  const [globalIsLoadingUser, setGlobalIsLoadingUser] = useGlobal(
    "isLoadingUser"
  );
  const [createUserError, setCreateUserError] = useState(null);
  const [isUserExists, setIsUserExists] = useState(true);
  const [, setAuthUserLocalStorage] = useUser();

  const unSubScribeAuthUser = useRef(null);

  useEffect(() => {
    const mapRegister = (user) => ({
      id: user.uid,
      firstName: user.displayName.split(" ")[0],
      name: user.displayName.split(" ")[0],
      lastName: user.displayName.split(" ")[1],
      email: user.email,
      imageUrl: user.photoURL,
      thumbImageUrl: user.photoURL,
      providerData: { ...user.providerData[0] },
      influencer
    });

    const onFacebookAuthError = (error) =>
      notification["error"]({
        message: "Facebook auth error",
        description: error.message,
      });

    const getRedirectResultUser = async () => {
      try {
        const result = await auth.getRedirectResult();

        if (!result.user) return;

        if (get(result, "additionalUserInfo.isNewUser", false)) {
          gaRegisterFacebook(influencer);
          await setGlobalIsLoadingCreateUser(true);
          const register = mapRegister(result.user);
          // await setShowGuide(true);
          googleTagManagerRegisterFBArgs();
          return setGlobalRegister(register);
        }

        return await setGlobalIsLoadingUser(true);
      } catch (error) {
        onFacebookAuthError(error);
      }
    };

    if (isMobileDevice) getRedirectResultUser();
  }, [setGlobalRegister, setGlobalIsLoadingUser, setGlobalIsLoadingCreateUser]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const setUserApi = async (user) => {
      try {
        const response = await fetch(urlApiSetUser(user.id), {
          method: "PUT",
          body: JSON.stringify(user),
          headers: {
            "content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const responseJSON = await response.json();
          console.log(responseJSON);
          throw get(responseJSON, "message", "ha ocurrido un problema");
        }

        return user;
      } catch (error) {
        console.error(error);
        setCreateUserError(error);
      }
    };

    const urlApiSetUser = (userId) =>
      new UrlAssembler(`${config.serverUrl}`)
        .template("/users/:userId")
        .param({ userId })
        .toString();

    const fetchUserFromFirestore = async (authUser) => {
      await timeoutPromise(2000);
      try {
        unSubScribeAuthUser.current = firestore
          .collection("users")
          .doc(authUser.uid)
          .onSnapshot((userSnapShop) => {
            setIsUserExists(userSnapShop.exists);

            if (!userSnapShop.exists) {
              notification["error"]({
                message: "Error de autenticación",
                description: "Error al inciar sesión",
              });
              return setGlobalIsLoadingUser(false);
            }

            setGlobalUser(userSnapShop.data());
            setGlobalIsLoadingUser(false);
            setAuthUserLocalStorage(userSnapShop.data());
          });
      } catch (error) {
        setCreateUserError(error.message);
      }
    };

    const unsubscribeAuthStateChanged = auth.onAuthStateChanged(
      async (authUser) => {
        if (
          globalIsLoadingCreateUser &&
          get(authUser, "uid", "uid") === get(globalRegister, "id", "id")
        ) {
          ReactPixel.track("Subscribe", {
            value: 1.0,
            currency: "PEN",
          });
          gaRegister(influencer);
          const user = await setUserApi(globalRegister);

          await setGlobalRegister(null);
          await setGlobalUser(user);
          googleTagManagerRegisterArgs();
          return await setGlobalIsLoadingCreateUser(false);
        }

        if (authUser && !globalIsLoadingCreateUser)
          return fetchUserFromFirestore(authUser);

        if (!authUser && !globalIsLoadingCreateUser && !globalIsLoadingUser) {
          setAuthUserLocalStorage.reset();
          !isEmpty(unSubScribeAuthUser.current) &&
            unSubScribeAuthUser.current();
          await setGlobalRegister(null);
          return setGlobalUser(null);
        }
      }
    );
    return () => unsubscribeAuthStateChanged();
  }, [
    globalRegister,
    globalIsLoadingCreateUser,
    globalIsLoadingUser,
    setGlobalIsLoadingUser,
    setGlobalIsLoadingCreateUser,
    setGlobalUser,
    setGlobalRegister,
  ]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (createUserError) {
      notification["error"]({
        message: "Authentication error",
        description: createUserError,
      });
      console.log(
        "auth.currentUser->",
        auth.currentUser,
        "createUserError->",
        createUserError
      );
      auth.currentUser.delete();
      setCreateUserError(false);
    }
  }, [createUserError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isUserExists) {
      notification["error"]({
        message: "Authentication error",
        description: "There is a problem with your account.",
      });
    }
  }, [isUserExists]); //eslint-disable-line react-hooks/exhaustive-deps

  return <Component />;
};
