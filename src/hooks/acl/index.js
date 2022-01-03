import React, { useGlobal, useMemo } from "reactn";
import { Acl } from "./Acl";
import { AclLink } from "./AclLink";
import { aclMenus } from "./aclMenus";
import { aclRoutes } from "./aclRoutes";
import get from "lodash/get";
import flatMap from "lodash/flatMap";
import { collectionToDate, useUser } from "../useLocalStorageState";

export const useAcl = () => {
  const [authUser] = useGlobal("user");
  const [authUserLS] = useUser();

  const currentUser = useMemo(() => {
    return authUser ?? collectionToDate(authUserLS);
  }, [authUser, authUserLS]);

  const userAcls = flatMap(Object.values(get(currentUser, "acls", {})));

  return {
    Acl: (props) => Acl({ ...props, userAcls }),
    AclLink: (props) => AclLink({ ...props, userAcls }),
    aclMenus: (props) => aclMenus({ ...props, userAcls }),
    aclRoutes: aclRoutes({ userAcls }),
    userAcls,
  };
};
