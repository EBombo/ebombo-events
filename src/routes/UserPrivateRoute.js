import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import { spinLoader } from "../components/common/loader";

export const UserPrivateRoute = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  useEffect(() => {
    if (!authUser) router.push("/");
  }, [authUser]);

  return authUser ? props.children : spinLoader();
};
