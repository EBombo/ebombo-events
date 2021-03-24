import React, {useEffect, useGlobal, useRef, useState} from "reactn";
import {auth, config, firestore} from "../firebase";
import {notification} from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import UrlAssembler from "url-assembler";
import {isMobileDevice} from "../utils";
import {useUser} from "../hoc";
import {timeoutPromise} from "../utils/promised";

export const withAuthentication = Component =>
    () => {
        const [, setGlobalUser] = useGlobal("user");
        const [globalRegister, setGlobalRegister] = useGlobal("register");
        const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal("isLoadingCreateUser");
        const [globalIsLoadingUser, setGlobalIsLoadingUser] = useGlobal("isLoadingUser");
        const [createUserError, setCreateUserError] = useState(null);
        const [isUserExists, setIsUserExists] = useState(true);
        const [, setAuthUserLocalStorage] = useUser();

        const unSubScribeAuthUser = useRef(null);

        useEffect(() => {
            const mapRegister = (user) => (
                {
                    id: user.uid,
                    name: user.displayName.split(" ")[0],
                    lastName: user.displayName.split(" ")[1],
                    email: user.email,
                    imageUrl: user.photoURL,
                    thumbImageUrl: user.photoURL,
                    providerData: {...user.providerData[0]},
                }
            );

            const onFacebookAuthError = async error =>
                notification["error"]({
                    message: "Facebook auth error",
                    description: error.message
                });

            const getRedirectResultUser = async () => {
                try {
                    const result = await auth.getRedirectResult();

                    if (!result.user) return;

                    if (get(result, "additionalUserInfo.isNewUser", false)) {
                        await setGlobalIsLoadingCreateUser(true);
                        const register = mapRegister(result.user);
                        return setGlobalRegister(register);
                    }

                    return await setGlobalIsLoadingUser(true);
                } catch (error) {
                    await onFacebookAuthError(error);
                }
            };

            if (isMobileDevice) getRedirectResultUser();
        }, [setGlobalRegister, setGlobalIsLoadingUser, setGlobalIsLoadingCreateUser]);

        useEffect(() => {
            const setUserApi = async (user) => {
                try {
                    const response = await fetch(urlApiSetUser(user.id), {
                        method: "PUT",
                        body: JSON.stringify(user),
                        headers: {
                            "content-Type": "application/json",
                            "Accept": "application/json",
                        }
                    });

                    if (!response.ok) {
                        const responseJSON = await response.json();
                        console.log(responseJSON);
                        throw get(responseJSON, "message", "ha ocurrido un problema");
                    }

                    return user;
                } catch (error) {
                    console.log(error);
                    setCreateUserError(error);
                }
            };

            const urlApiSetUser = userId =>
                new UrlAssembler(`${config.serverUrl}/api`)
                    .template("/users/:userId")
                    .param({userId})
                    .toString();

            const fetchUserFromFirestore = async authUser => {
                await timeoutPromise(2000);
                console.log("llamado al fetch de firebase user");
                try {
                    unSubScribeAuthUser.current = firestore
                        .collection("users")
                        .doc(authUser.uid)
                        .onSnapshot(userSnapShop => {
                            setIsUserExists(userSnapShop.exists);

                            if (!userSnapShop.exists) {
                                notification["error"]({
                                    message: "Facebook auth error",
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

            const unsubscribeAuthStateChanged = auth.onAuthStateChanged(async authUser => {
                if (globalIsLoadingCreateUser && get(authUser, "uid", "uid") === get(globalRegister, "id", "id")) {
                    const user = await setUserApi(globalRegister);

                    await setGlobalRegister(null);
                    await setGlobalUser(user);
                    return await setGlobalIsLoadingCreateUser(false);
                }

                if (authUser && !globalIsLoadingCreateUser)
                    return fetchUserFromFirestore(authUser);

                if (!authUser && !globalIsLoadingCreateUser && !globalIsLoadingUser) {
                    setAuthUserLocalStorage.reset();
                    !isEmpty(unSubScribeAuthUser.current) && unSubScribeAuthUser.current();
                    await setGlobalRegister(null);
                    return setGlobalUser(null);
                }
            });
            return () => unsubscribeAuthStateChanged();
        }, [globalRegister, globalIsLoadingCreateUser, globalIsLoadingUser, setGlobalIsLoadingUser, setGlobalIsLoadingCreateUser, setGlobalUser, setGlobalRegister]);

        useEffect(() => {
            if (createUserError) {
                notification["error"]({
                    message: "Authentication error",
                    description: createUserError,
                });
                auth.currentUser.delete();
                setCreateUserError(false);
            }
        }, [createUserError]);

        useEffect(() => {
            if (!isUserExists) {
                notification["error"]({
                    message: "Authentication error",
                    description: "There is a problem with your account.",
                });
            }
        }, [isUserExists]);

        return <Component/>;

    };
