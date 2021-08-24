import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Tooltip } from "antd";
import { Image } from "../common/Image";
import { config } from "../../firebase";
import { Anchor } from "../form";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useAcl } from "../../hooks";

export const TabletNav = (props) => {
  const router = useRouter();
  const { userAcls } = useAcl();
  const [authUser] = useGlobal("user");
  const [, setOpenRightDrawer] = useGlobal("openRightDrawer");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");

  return (
    <TabletNavContainer>
      <div />
      <Image
        src={`${config.storageUrl}/resources/ebombo-white.svg`}
        onClick={() =>
          userAcls.some((acl) => acl.includes("admin"))
            ? router.push("/admin")
            : authUser
            ? router.push("/library/games")
            : router.push("/")
        }
        height="23px"
        width="88px"
      />
      {!authUser && (
        <Anchor
          onClick={() => setIsVisibleLoginModal(true)}
          variant="primary"
          fontSize={"1rem"}
        >
          Ingresa
        </Anchor>
      )}
      {authUser && (
        <div className="menu-icon-nav" onClick={() => setOpenRightDrawer(true)}>
          <MenuOutlined />
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

  .menu-icon-nav {
    color: ${(props) => props.theme.basic.white};
  }
`;
