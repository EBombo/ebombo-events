import styled from "styled-components";
import { Modal } from "antd";
import { mediaQuery } from "../../../../../styles/constants";

export const Line = styled.div`
  width: 50%;
  height: 4px;
  background: ${(props) => props.theme.basic.white};
  border-radius: 5px;
  position: absolute;
  top: 50px;
`;

export const PointsContainer = styled.div`
  .title {
    font-weight: bold;
    font-size: 16px;
    line-height: 20px;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }
  
  .line{
    position: relative;
    display: flex;
    justify-content: center;
  }

  .profiles {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 45% 10% 45%;
    grid-template-rows: repeat(
      ${(props) => (props.rows ? props.rows : 1)},
      auto
    );
    width: 100%;

    .profile {
      margin-bottom: 1rem;

      .header {
        display: flex;
        justify-content: flex-end;
      }

      .header-start {
        display: flex;
        justify-content: flex-start;
      }

      .user-information {
        display: grid;
        grid-template-columns: 70% 30%;

        .container-user {
          width: 100%;
          .name {
            text-align: left;
            color: ${(props) => props.theme.basic.white};
            font-size: 13px;
            line-height: 16px;
          }
          .type-account {
            text-align: left;
            color: ${(props) => props.theme.basic.primary};
            font-size: 11px;
            line-height: 13px;
          }
          .account-nickname {
            text-align: left;
            color: ${(props) => props.theme.basic.white};
            font-size: 11px;
            line-height: 13px;
            max-width: 100%;
          }
        }
        .container {
          display: flex;
          justify-content: flex-end;
          .points {
            font-size: 20px;
            border-radius: 5px;
            background: ${(props) => props.theme.basic.blackDarken};
            color: ${(props) => props.theme.basic.white};
            padding: 10px;
            width: 50px;
            height: 50px;
            border: none;
            text-align: center;
            direction: ltr;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        }
      }
      .reverse {
        direction: rtl;
        .container-user {
          .name {
            text-align: right;
          }
          .type-account {
            text-align: right;
          }
          .account-nickname {
            text-align: right;
          }
        }
      }
      .results {
        color: ${(props) => props.theme.basic.white};
        text-align: center;
      }
    }
  }
  .description {
    display: flex;
    flex-direction: column;
    background: ${(props) => props.theme.basic.blackDarken};
    padding: 0.5rem;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
    font-size: 0.85rem;
    border-radius: 5px;
    margin: 0.5rem 0;

    .title-danger {
      font-size: 1rem;
      color: ${(props) => props.theme.basic.action};
      margin-bottom: 0.1rem;
      font-weight: bold;
    }
  }

  .buttons-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
`;

export const ModalContainer = styled(Modal)`
  top: 10px;
  ${mediaQuery.afterTablet} {
    top: 50px;
  }

  .ant-modal-content {
    margin-bottom: 50px;
  }

  .ant-modal-close {
    color: ${(props) => props.theme.basic.primary};
  }

  .ant-modal-body {
    background: ${(props) => props.theme.basic.default};
    color: ${(props) => props.theme.basic.white};
  }
`;
