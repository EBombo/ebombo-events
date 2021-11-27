import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { firestore } from "../../../firebase";
import { spinLoader } from "../../../components/common/loader";
import { Desktop, mediaQuery } from "../../../constants";
import { DesktopLeftMenu } from "../../../components/common/DesktopLeftMenu";
import { EditProfile } from "./EditProfile";
import { Privacy } from "./Privacy";

export const UserProfile = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  const [tab, setTab] = useState("edit");
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = () =>
      firestore
        .collection("users")
        .doc(userId)
        .onSnapshot((userOnSnapShot) => {
          if (!userOnSnapShot.exists) return router.back();

          setUser(userOnSnapShot.data());
          setLoadingUser(false);
        });

    const unSub = fetchUser();
    return () => unSub && unSub();
  }, [userId]);

  if (loadingUser) return spinLoader();

  return (
    <UserContainer>
      <Desktop>
        <DesktopLeftMenu {...props} />
      </Desktop>

      <div className="main-container">
        <div className="tabs-container">
          <div className={`tab left ${tab === "edit" && "active"}`} onClick={() => setTab("edit")}>
            Editar Perfil
          </div>
          <div className={`tab middle ${tab === "privacy" && "active"}`} onClick={() => setTab("privacy")}>
            Privacidad
          </div>
          <div className={`tab  right ${tab === "password" && "active"}`} onClick={() => setTab("password")}>
            Cambiar contraseña
          </div>
        </div>

        {tab === "edit" && <EditProfile user={user} {...props} />}

        {tab === "privacy" && <Privacy user={user} {...props} />}
      </div>
    </UserContainer>
  );
};

const UserContainer = styled.div`
  width: 100%;

  .tabs-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${(props) => props.theme.basic.whiteLight};
    border-bottom: 3px solid ${(props) => props.theme.basic.grayLighten};
    height: 45px;
    width: 100%;
    padding: 0 1rem;

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackLighten};
      height: 100%;
      position: relative;
    }

    .active {
      color: ${(props) => props.theme.basic.primary};
    }

    .active::after {
      content: "";
      position: absolute;
      height: 3px;
      width: 100%;
      bottom: -3px;
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .main-container {
    background: ${(props) => props.theme.basic.whiteLight};
    min-height: calc(100vh - 50px);
    overflow: auto;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 250px auto;
    height: calc(100vh - 50px);

    .main-container {
      padding: 2rem;
      background: ${(props) => props.theme.basic.whiteDark};
      height: 100%;
      overflow: auto;
    }

    .tabs-container {
      display: flex;
      grid-template-columns: auto auto auto;
      justify-content: flex-start;
      background: transparent;
      padding: 0;
      margin: 1rem 0;
      border-bottom: none;

      .tab {
        padding: 0.5rem 1rem;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        cursor: pointer;
      }

      .left,
      .middle,
      .right {
        border-top: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-bottom: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .left {
        border-left: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-radius: 4px 0 0 4px;
      }

      .middle {
        border-left: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .right {
        border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-radius: 0 4px 4px 0;
      }

      .active {
        background: ${(props) => props.theme.basic.whiteLight};
        color: ${(props) => props.theme.basic.primary};
      }

      .active::after {
        height: 0;
      }
    }
  }
`;
