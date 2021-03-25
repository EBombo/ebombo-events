import React, {useGlobal} from "reactn";
import {notification} from "antd";
import {doSignInWithProvider} from "../../firebase/auth";
import {Button} from "../common";
import styled from "styled-components";
import {socialNetworkColor} from "../../styles/constants";
import {gaRegisterFacebook} from "../../utils";
import {config} from "../../firebase";
import {googleTagManagerRegisterFBArgs} from "../../utils/googleTagManager";
import {Icon} from "../common/Icons";

export const LoginFacebook = (props) => {
  const [influencer] = useGlobal("influencer");
  const [, setShowGuide] = useGlobal("showGuide");
  const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal(
    "isLoadingCreateUser"
  );
  const [globalIsLoadingUser, setGlobalIsLoadingUser] = useGlobal(
    "isLoadingUser"
  );
  const [
    globalIsLoadingFacebookAuth,
    setGlobalIsLoadingFacebookAuth,
  ] = useGlobal("isLoadingFacebookAuth");
  const [, setGlobalRegister] = useGlobal("register");

  const onFacebookAuthError = async (error) => {
    notification["error"]({
      message: "Facebook auth error",
      description: error.message,
    });
    await setGlobalIsLoadingFacebookAuth(false);
  };

  const loginWithFacebook = async () => {
    try {
      await setGlobalIsLoadingFacebookAuth(true);

      const result = await doSignInWithProvider("facebook");

      if (result.additionalUserInfo.isNewUser) {
        gaRegisterFacebook(influencer);
        await setGlobalIsLoadingCreateUser(true);
        const register = mapRegister(result.user);
        await setGlobalRegister(register);
        // await setShowGuide(true);
        googleTagManagerRegisterFBArgs();
        return await setGlobalIsLoadingFacebookAuth(false);
      }

      await setGlobalIsLoadingUser(true);
      return await setGlobalIsLoadingFacebookAuth(false);
    } catch (error) {
      await onFacebookAuthError(error);
      await setGlobalIsLoadingUser(false);
      await setGlobalIsLoadingCreateUser(false);
      await setGlobalIsLoadingFacebookAuth(false);
    }
  };

  const mapRegister = (user) => ({
    id: user.uid,
    name: user.displayName.split(" ")[0],
    firstName: user.displayName.split(" ")[0],
    lastName: user.displayName.split(" ")[1],
    email: user.email,
    imageUrl: user.photoURL,
    thumbImageUrl: user.photoURL,
    providerData: { ...user.providerData[0] },
    influencer
  });

  return (
    <ButtonFacebook>
      <Button
        disabled={
          globalIsLoadingUser ||
          globalIsLoadingCreateUser ||
          globalIsLoadingFacebookAuth
        }
        className="btn-facebook"
        type="reset"
        onClick={() => loginWithFacebook()}
      >
        <div className="content-items">
          <div>
            {globalIsLoadingFacebookAuth ? (
              <Icon type="loading" />
            ) : (
              <img src={`${config.storageUrl}/resources/facebook.svg`} alt="" />
            )}
          </div>
          <div className="item-text">
            {props.isRegister
              ? "Regístrate con Facebook"
              : "Iniciar sesión con Facebook"}
          </div>
        </div>
      </Button>
    </ButtonFacebook>
  );
};

const ButtonFacebook = styled.div`
  .btn-facebook {
    background: ${socialNetworkColor.face};
    border: none;
    border-radius: 0px;
    height: 50px;
    width: 100% !important;

    :hover {
      background: ${socialNetworkColor.face};
    }

    .content-items {
      width: 100%;
      margin: auto;
      display: grid;
      grid-template-columns: 10% 90%;
      align-items: center;

      div {
        color: ${(props) => props.theme.basic.white};
      }

      .item-text {
        font-size: 15px;
        text-align: center;
        font-family: Lucida Grande, Helvetica Neue, Helvetica, Arial, sans-serif;
        font-weight: 400;

        h6 {
          color: ${(props) => props.theme.basic.white} !important;
        }
      }
    }
  }
`;
