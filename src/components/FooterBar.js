import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery, sizes } from "../constants";
import { useRouter } from "next/router";
import { useTranslation } from "../hooks";
import { Image } from "./common/Image";
import { config } from "../firebase";
import { PopTypeGame } from "./createGame/PopTypeGame";

const FooterBar = (props) => {
  const router = useRouter();

  const { t } = useTranslation("userLayout");

  const [authUser] = useGlobal("user");

  const isSelected = (path) => (path === window.location.pathname ? "item item-selected" : "item");

  return (
    <ContainerFooter authUser={authUser}>
      <div className="footer-items">
        <PopTypeGame>
          <div className="item">
            <Image
              width="auto"
              size="contain"
              height="30px"
              className="icon"
              src={`${config.storageUrl}/resources/footer/create-icon.svg`}
            />
            <div className="text-center text-white">{t("create")}</div>
          </div>
        </PopTypeGame>

        <div
          className={isSelected("/library")}
          onClick={(e) => {
            e.preventDefault();

            if (!authUser) {
              return router.push("/login");
            }

            router.push("/library");
          }}
        >
          <Image
            width="auto"
            height="30px"
            size="contain"
            className="icon"
            src={`${config.storageUrl}/resources/footer/library-icon.svg`}
          />
          <div className="text-center text-white">{t("library")}</div>
        </div>
      </div>
    </ContainerFooter>
  );
};

const ContainerFooter = styled.section`
  position: fixed;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;

  .footer-items {
    height: 55px;
    display: grid;
    width: 100%;
    background: ${(props) => props.theme.basic.secondary};
    grid-template-columns: repeat(2, 1fr);

    .item {
      display: flex;
      cursor: pointer;
      position: relative;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      color: ${(props) => props.theme.basic.white};

      .label {
        font-size: ${sizes.font.small};
        text-align: center;
      }
    }

    .item-selected {
      position: relative;
      color: ${(props) => props.theme.basic.primaryLight};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .icon {
        filter: opacity(0.5);
      }
    }

    .notification {
      .img-content {
        position: relative;
      }

      .img-content:after {
        content: "";
        background: ${(props) => props.theme.basic.danger};
        width: 15px;
        height: 15px;
        position: absolute;
        top: -5px;
        left: -5px;
        border-radius: 10px;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    width: 61px;
    height: 100vh;
    padding-top: 50px;
    //z-index: 998;
    align-items: flex-start;

    .footer-items {
      display: flex;
      flex-direction: column;
      background: none;
      height: auto;

      .item,
      .item-selected {
        height: 65px;

        :hover {
          background-color: ${(props) => props.theme.basic.blackLighten};
        }
      }
    }
  }
`;

export default FooterBar;
