import React from 'react';
import {notification} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {doSignInWithProvider} from "../../firebase/authentication";
import styled from "styled-components";
import {useGlobal} from "reactn";
import {useI18n} from "../../utils";
import {ButtonAnt} from "../form";

export const LoginFacebook = () => {
    const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal("isLoadingCreateUser");
    const [globalIsLoadingUser, setGlobalIsLoadingUser] = useGlobal("isLoadingUser");
    const [globalIsLoadingFacebookAuth, setGlobalIsLoadingFacebookAuth] = useGlobal("isLoadingFacebookAuth");
    const [, setGlobalRegister] = useGlobal("register");

    const i18n = useI18n();

    const onFacebookAuthError = async error => {
        notification["error"]({
            message: "Facebook auth error",
            description: error.message
        });
        await setGlobalIsLoadingFacebookAuth(false);
    };

    const loginWithFacebook = async () => {
        try {
            await setGlobalIsLoadingFacebookAuth(true);

            const result = await doSignInWithProvider("facebook");

            if (result.additionalUserInfo.isNewUser) {
                await setGlobalIsLoadingCreateUser(true);
                const register = mapRegister(result.user);
                await setGlobalRegister(register);
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

    const mapRegister = (user) => (
        {
            id: user.uid,
            name: user.displayName.split(" ")[0],
            lastName: user.displayName.split(" ")[1],
            email: user.email,
            imageUrl: user.photoURL,
            thumbImageUrl: user.photoURL,
            providerData: [user.providerData[0]]
        }
    );

    return <ButtonFacebook>
        <ButtonAnt disabled={globalIsLoadingUser || globalIsLoadingCreateUser || globalIsLoadingFacebookAuth}
                   className={`btn-facebook ${(globalIsLoadingUser || globalIsLoadingCreateUser || globalIsLoadingFacebookAuth) && "disable"}`}
                   type="reset"
                   onClick={() =>
                       (!globalIsLoadingUser && !globalIsLoadingCreateUser && !globalIsLoadingFacebookAuth)
                       && loginWithFacebook()
                   }>
            <div className="content-items">
                <div>
                    {
                        globalIsLoadingFacebookAuth
                        && <LoadingOutlined/>
                    }
                </div>
                <div className="item-text">
                    {i18n(["login", "loginWithFacebook"])}
                </div>
            </div>
        </ButtonAnt>
    </ButtonFacebook>;
};


const ButtonFacebook = styled.div`
  .btn-facebook {
    background: ${props => props.theme.basic.facebook};
    border: none;
    border-radius: 0;
    height: 40px;
    width: 100%;

    :hover {
      background: ${props => props.theme.basic.facebook};
    }

    .content-items {
      width: 100%;
      margin: auto;
      display: grid;
      grid-template-columns: 10% 80% 10%;
      align-items: center;

      div {
        color: ${props => props.theme.basic.white};
      }

      .item-text {
        font-size: 15px;
        text-align: center;

        h6 {
          color: ${props => props.theme.basic.white} !important;
        }
      }
    }
  }

  .disable {
    background: ${props => props.theme.basic.default};

    :hover {
      background: ${props => props.theme.basic.default};
    }
  }
`;
