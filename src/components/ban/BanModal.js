import React from "reactn";
import styled from "styled-components";
import {btnPrimary, mediaQuery} from "../../styles/constants";
import {config} from "../../firebase";
import {ButtonBombo} from "../common";

export const BanModal = (props) => (
  <BanModalContent>
    <div className="title">Cuenta Bloqueada</div>
    <div className="subtitle-between-lines-desktop">
      <hr />
    </div>
    <div className="content-btn-desktop">
      <p>Para más información comunicarse al número de whatsapp</p>
      <div className="container-wsp">
        <div className="item-num-wsp">
          <img
            src={`${config.storageUrl}/resources/wsp-icon.svg`}
            alt="eBombo whatshap"
          />
          <span onClick={() => window.open(config.wspUrl, "_blank")}>
            +51 924 793 558
          </span>
        </div>
        <div className="item-link-wsp">
          <ButtonBombo onClick={() => window.open(config.wspUrl, "_blank")}>
            Haz click aquí para hablarnos por Whatsapp
          </ButtonBombo>
        </div>
      </div>

      <ButtonBombo onClick={() => props.logOut()}>Cerrar Sesión</ButtonBombo>
    </div>
  </BanModalContent>
);

const BanModalContent = styled.div`
  padding-top: 1.5rem;

  .title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
    color: ${(props) => props.theme.basic.danger};
  }

  .content-btn-desktop {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0px 10px;
    p {
      color: ${(props) => props.theme.basic.white};
      font-size: 12px;
    }
    .btn-logout {
      width: 100%;
      border: 1px solid ${(props) => props.theme.basic.primary} !important;
      ${btnPrimary("1rem", 600, 0, "100%", "50px")};
      align-items: center;
      margin-top: 10px;

      &:active {
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .subtitle-between-lines-desktop {
    align-items: center;
    margin-bottom: 10px;

    hr {
      background-color: ${(props) => props.theme.basic.primary};
      color: ${(props) => props.theme.basic.primary};
      border: none;
      width: 100%;
      height: 1px;
    }
  }
  .container-wsp {
    display: grid;
    grid-template-columns: 100%;
    grid-gap: 10px;
    margin: 1rem 0;

    .item-num-wsp {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
      color: ${(props) => props.theme.basic.white};
      img {
        width: auto;
        height: 20px;
        margin: 0;
      }
      span {
        margin-left: 10px;
        font-size: 0.8rem;
        cursor: pointer;
      }
    }

    .item-link-wsp {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .input-link-wsp {
        cursor: pointer;
        width: 100%;
        border: 1px solid ${(props) => props.theme.basic.primary};
        border-radius: 12px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.blackDarken};
        padding: 6px 9px;
        margin-bottom: 5px;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .title {
      margin-bottom: 20px;
      font-size: 30px;
    }
    .content-btn-desktop {
      width: 100%;
      padding: 0px 50px;
      p {
        color: ${(props) => props.theme.basic.white};
        font-size: 18px;
      }
    }
    .container-wsp {
      .item-num-wsp {
        margin-left: 10px;
        img {
          width: auto;
          height: 30px;
          margin: 0;
        }
        span {
          margin-left: 10px;
          font-size: 1.3rem;
          cursor: pointer;
        }
      }
      .item-link-wsp {
        margin-right: 10px;
        .input-link-wsp {
          width: auto;
          padding: 11px 14px;
          margin-bottom: 8px;
        }
      }
    }
  }
`;
