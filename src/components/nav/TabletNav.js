import React, { useEffect, useGlobal, useState } from "reactn";
import { Image } from "../common/Image";
import { FreeTrialStatus } from "../FreeTrialStatus";
import { config } from "../../firebase";
import { Anchor } from "../form";
import { useRouter } from "next/router";
import { useAcl, useTranslation } from "../../hooks";

export const TabletNav = (props) => {
  const router = useRouter();

  const { userAcls } = useAcl();

  const { t } = useTranslation("userLayout");

  const [authUser] = useGlobal("user");
  const [openRightDrawer, setOpenRightDrawer] = useGlobal("openRightDrawer");

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/admin");
    router.prefetch("/library/games");
  }, []);

  return (
    <div className="h-[50px] fixed top-0 left-0 right-0 bg-secondary flex items-center gap-[10px] justify-end z-30 px-4">
      <div className="absolute left-2 top-[50%] translate-y-[-50%]">
        <Image
          src={`${config.storageUrl}/resources/ebombo-white.svg`}
          onClick={(e) => {
            e.preventDefault();
            userAcls.some((acl) => acl.includes("admin"))
              ? router.push("/admin")
              : authUser
              ? router.push("/library/games")
              : router.push("/");
          }}
          height="23px"
          width="88px"
          size="contain"
        />
      </div>
      <FreeTrialStatus/>
      {!authUser && (
        <Anchor url="/login" variant="primary" fontSize={"1rem"}>
          {t("login")}
        </Anchor>
      )}
      {authUser && (
        <div className="cursor-pointer block" onClick={() => setOpenRightDrawer(!openRightDrawer)}>
          <Image
            src={`${config.storageUrl}/resources/user-profile.svg`}
            height="31px"
            width="31px"
            borderRadius="50%"
            size="contain"
            cursor="pointer"
          />
        </div>
      )}
    </div>
  );
};
