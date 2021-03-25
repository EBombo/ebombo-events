import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";
import { BackButton, ButtonBombo, Input } from "../../../../components";
import { darkTheme } from "../../../../styles/theme";
import { mediaQuery } from "../../../../styles/constants";
import { useHistory, useLocation } from "react-router";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { config } from "../../../../firebase";
import { message } from "antd";
import get from "lodash/get";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "../../../../components/common/Icons";
import { Image } from "../../../../components/common/Image";

export const UserAccounts = (props) => {
  const location = useLocation();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [userAccounts] = useGlobal("userAccounts");
  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [user] = useState(authUser);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = yup.object().shape({});

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const updateUser = async (data) => {
    try {
      setLoadingUpdateUser(true);

      await updateUserAccounts(data);

      setLoadingUpdateUser(false);

      if (!location.search.includes("required=true")) return;

      setOpenSidebarMobile(false);
      history.push({
        hash: "",
        search: "",
      });
    } catch (error) {
      handleError({ ...error, action: "updateUser" });
    }
  };

  const updateUserAccounts = async (userAccounts_) => {
    try {
      await ownFetch(
        `${config.serverUrl}/users/${authUser.id}/user-accounts`,
        "PUT",
        userAccounts_
      );

      message.success("Registro actualizado.");
    } catch (error) {
      handleError({ ...error, action: "updateUserAccounts" });
    }
  };

  const goToLinkSuperCell = () =>
    window.open("https://youtu.be/Z-NY-JrSAk4", "_blank");

  return (
    <Container>
      <div className="left-content">
        <BackButton color={darkTheme.basic.blackLighten} />
        <form
          className="form-setting-user"
          onSubmit={handleSubmit(updateUser)}
          noValidate
        >
          <div className="head">
            <div className="item-title">IDs de Juegos</div>
          </div>
          {userAccounts.map((userAccount) => (
            <div key={userAccount.id}>
              <div className="subtitle">{userAccount.description}</div>
              <div className="content-item">
                <Input
                  variant="secondary"
                  type="text"
                  name={userAccount.id}
                  error={errors.name}
                  ref={register}
                  autoComplete="off"
                  defaultValue={get(user, `userAccounts.${userAccount.id}`, "")}
                  placeholder={userAccount.name}
                  addonBefore={
                    <Image
                      width="25px"
                      height="25px"
                      borderRadius="5px"
                      src={get(userAccount, "iconUrl", "")}
                    />
                  }
                  addonAfter={
                    get(user, `userAccounts.${userAccount.id}`, null)
                      ? faCheckCircle
                      : ""
                  }
                />
              </div>
            </div>
          ))}
          <div className="get-link">
            * Si no sabes como obtener tu link{" "}
            <span onClick={goToLinkSuperCell}>haz click aquí</span>
          </div>
          <div className="button-container">
            <ButtonBombo
              margin="0"
              htmlType="submit"
              loading={loadingUpdateUser}
              disabled={loadingUpdateUser}
            >
              Actualizar
            </ButtonBombo>
          </div>
        </form>
      </div>
      <div className="right-content" />
    </Container>
  );
};

const Container = styled.div`
  background: ${(props) => props.theme.basic.gray};
  height: auto;

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .right-content {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  .left-content {
    padding: 1rem;
    width: 100%;
    height: 100%;
    margin: 0;
    max-width: 550px;

    .head {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 1rem 0;

      .item-title {
        color: ${(props) => props.theme.basic.blackLighten};
        font-size: 14px;
        line-height: 16px;
        font-weight: 600;
        margin-bottom: 15px;
      }
    }

    .form-setting-user {
      .subtitle {
        color: ${(props) => props.theme.basic.blackLighten};
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
      }

      ${mediaQuery.afterTablet} {
        width: 100%;
        line-height: 35px;
      }

      .get-link {
        span {
          cursor: pointer;
          color: ${(props) => props.theme.basic.action};
        }
      }

      .content-item {
        margin-bottom: 10px;
      }

      .button-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 1rem 0;
      }
    }
  }
`;
