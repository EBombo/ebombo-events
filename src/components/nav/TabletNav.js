import React, { useEffect, useGlobal } from "reactn";
import styled from "styled-components";
import { Image } from "../common/Image";
import { config } from "../../firebase";
import { Anchor, Switch } from "../form";
import { useRouter } from "next/router";
import { useAcl, useTranslation } from "../../hooks";
import { darkTheme } from "../../theme";

export const TabletNav = (props) => {
  const router = useRouter();

  const { userAcls } = useAcl();

  const { t, locale, locales, setLocale } = useTranslation("userLayout");

  const [authUser] = useGlobal("user");
  const [openRightDrawer, setOpenRightDrawer] = useGlobal("openRightDrawer");

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/admin");
    router.prefetch("/library/games");
  }, []);

  return (
    <TabletNavContainer>
      <div />
      <Image
        src={`${config.storageUrl}/resources/ebombo-white-logo.svg`}
        onClick={() =>
          userAcls.some((acl) => acl.includes("admin"))
            ? router.push("/admin")
            : authUser
            ? router.push("/library/games")
            : router.push("/")
        }
        height="23px"
        width="88px"
        size="contain"
      />
      <Switch
        margin="auto 15px"
        onChange={(event) => setLocale(event ? locales[1] : locales[0])}
        defaultChecked={locale === locales[1]}
        checkedChildren={locales[1]}
        unCheckedChildren={locales[0]}
        inactiveBackgroundColor={darkTheme.basic.primary}
        activeBackgroundColor={darkTheme.basic.primary}
      />
      {!authUser && (
        <Anchor url="/login" variant="primary" fontSize={"1rem"}>
          {t("login")}
        </Anchor>
      )}
      {authUser && (
        <div className="hamburger" onClick={() => setOpenRightDrawer(!openRightDrawer)}>
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
    </TabletNavContainer>
  );
};

const TabletNavContainer = styled.div`
  width: 100%;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  background: ${(props) => props.theme.basic.secondary};

  .hamburger {
    display: block;
    cursor: pointer;
    margin: 0;
  }
`;
