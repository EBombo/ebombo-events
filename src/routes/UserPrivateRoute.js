import React, { useEffect, useGlobal, useMemo } from "reactn";
import { useRouter } from "next/router";
import { spinLoader } from "../components/common/loader";
import { collectionToDate, useUser } from "../hooks";

export const UserPrivateRoute = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");
  const [isLoadingUser] = useGlobal("isLoadingUser");

  const [authUserLS] = useUser();

  const currentUser = useMemo(() => {
    return authUser ?? collectionToDate(authUserLS);
  }, [authUser, authUserLS]);

  useEffect(() => {
    if (!currentUser) router.push("/");
  }, [currentUser]);

  if (isLoadingUser) return spinLoader();

  return authUser ? props.children : spinLoader();
};
