import styled from "styled-components";
import { fontWeightFont, mediaQuery, walletButton } from "../../constants";
import { breakPoints } from "../../utils/breakPoints";

export const ContainerWallet = styled.div`
    display: flex;
    justify-content: center;
    color: ${(props) => props.theme.basic.white};
    padding-bottom: 1rem;
    width: 100%;
    max-width: ${breakPoints.desktop};
    margin: auto;
    padding-top: 1rem;

    /*--Card Balance avaible--*/
    .menu-content-wallet {
      display: flex !important;
      justify-content: center;
      width: 95%;
      flex-direction: column;

      .card-wallet {
        width: 100%;
        border-radius: 7px;
        background: ${(props) => props.theme.basic.blackDarken};
        padding: 20px;
        display: grid;
        grid-template-rows: repeat(2, 60px);
        box-shadow: 0px 1px 12px 2px ${(props) =>
          props.theme.basic.blackDarken};
        border: 1px solid ${(props) => props.theme.basic.blackDarken};

        .items:first-child {
          border-bottom: 1px solid ${(props) => props.theme.basic.white};
        }

        .items {
          display: grid;
          grid-template-columns: 35% 1fr;
          justify-content: center;
          align-items: center;
          ${mediaQuery.afterMobile}{
            grid-template-columns: 50% 1fr;
          }

          .bombo-coins-available-num {
            color: ${(props) => props.theme.basic.white};
            text-align: center;
            font-size: 30px;
            ${fontWeightFont(700)};
            ${mediaQuery.afterMobile} {
              font-size: 1.3rem;
            }
          }

          .bombo-coins-available-text {
            color: ${(props) => props.theme.basic.white};
            text-align: left;
            font-size: 17px;
            ${fontWeightFont(300)};
            ${mediaQuery.afterMobile} {
              font-size: 13px;
            }
          }
        }
      }

      /*--items wallet-button-list--*/
      .wallet-button-list {
        width: 100%;
        margin-top: 1rem;

        .wallet-button {
          ${(props) =>
            walletButton(
              props.theme.basic.default,
              props.theme.basic.white,
              props.theme.basic.primary
            )};
          ${mediaQuery.afterTablet} {
            box-shadow: 0px 1px 12px 2px ${(props) =>
              props.theme.basic.blackDarken};
            border: 1px solid ${(props) => props.theme.basic.blackDarken};
          }
        }

        .wallet-button-selected {
          ${mediaQuery.afterTablet} {
           ${(props) =>
             walletButton(
               props.theme.basic.primary,
               props.theme.basic.white,
               props.theme.basic.default
             )};
        }
      }
    }
`;
