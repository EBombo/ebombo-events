import styled from "styled-components";
import { fontWeightFont, mediaQuery } from "../../constants";
import { Drawer, Input as AntInput, Modal } from "antd";
import sizes from "../../constants/sizes";

export const TopUpMoneyContainer = styled.section`
  padding: 1.25rem 1.5rem;

  h1 {
    font-weight: bold;
    font-size: 14px;
    color: ${(props) => props.theme.basic.blackLighten};
    margin: 1rem 0 !important;
  }

  h3 {
    font-weight: 500;
    font-size: 12px;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 1rem;
  }

  .icon-pay {
    height: 100px;
    width: auto;
  }

  .bombo-message {
    border-radius: 5px;
    padding: 10px 0px;
    margin: 10px 5px;
    color: ${(props) => props.theme.basic.primary};
    border: 1px solid ${(props) => props.theme.basic.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .failed {
    color: ${(props) => props.theme.basic.danger};
    border: 1px solid ${(props) => props.theme.basic.danger};
  }
`;

export const AmountContainer = styled.section`
  .content-primary {
    display: flex;
    justify-content: space-between;
    margin-top: 1.7rem;
    flex-wrap: wrap;

    ${mediaQuery.afterTablet} {
      flex-wrap: nowrap;
    }

    .item-coupon {
      width: 100%;

      ${mediaQuery.afterTablet} {
        width: auto;
      }

      .coupon-button {
        background: ${(props) => props.theme.basic.primary} !important;
        color: ${(props) => props.theme.basic.blackDarken};
        ${fontWeightFont(600)};
        border: none;
      }
    }

    .item-amount {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 100%;
      margin-top: 1rem;

      ${mediaQuery.afterTablet} {
        width: auto;
        margin: 0;
      }

      .amount {
        display: table;
        color: ${(props) => props.theme.basic.white};

        input {
          margin-right: 10px;
        }

        .ant-select {
          color: ${(props) => props.theme.basic.white} !important;
          outline: none !important;

          .ant-select-selection {
            background: ${(props) => props.theme.basic.blackDarken} !important;
            border: 1px solid ${(props) => props.theme.basic.primary} !important;
            outline: none !important;
          }

          .ant-select-arrow {
            color: ${(props) => props.theme.basic.primary} !important;
          }
        }
      }

      label {
        color: ${(props) => props.theme.basic.white};
        font-size: 12px;
        margin: 8px 0 15px 0;
      }
    }
  }

  //TABLE RESUMEN DE RECARGA
  .content-summary {
    margin: 16px 0;

    .summary-table {
      width: 100%;
      color: ${(props) => props.theme.basic.white};

      .summary-amounts {
        text-align: right;
        width: 24%;

        &-equals {
          text-align: right;
          width: 8%;
          min-width: 20px;
        }

        ${mediaQuery.afterDesktop} {
          width: 135px;

          &-equals {
            width: 35px;
          }
        }
      }

      .summary-row {
        .summary-coupon {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        td {
          padding-bottom: 15px;

          &:nth-child(1) {
            ${fontWeightFont(600)};
          }

          font-size: 1rem;

          ${mediaQuery.afterTablet} {
            font-size: 14px;
          }
        }
      }

      .summary-result {
        border-top: 1px ${(props) => props.theme.basic.white} solid;

        td {
          padding-bottom: 0;
          line-height: 50px;
          font-size: 1rem;
          ${fontWeightFont(600)};

          ${mediaQuery.afterTablet} {
            ${fontWeightFont(700)};
            font-size: 14px;
          }
        }
      }
    }

    padding: 0.6rem 0.6rem 0 0.6rem;
    background: ${(props) => props.theme.basic.default};
    border-radius: 7px;
  }
`;

export const DrawerTopUpMoney = styled(Drawer)`
  color: ${(props) => props.theme.basic.white};

  .ant-drawer-header {
    background: ${(props) => props.theme.basic.blackDarken};

    .ant-drawer-title {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .ant-drawer-wrapper-body {
    background: ${(props) => props.theme.basic.blackDarken};

    .text-item {
      margin: 10px 0;
    }
  }

  .container-select {
    .free-coupon {
      div {
        margin-bottom: 1rem;

        input {
          background: ${(props) => props.theme.basic.default} !important;
          color: ${(props) => props.theme.basic.white};
          border: 1px solid ${(props) => props.theme.basic.default};
          margin: 0 !important;
          width: 100%;
          text-align: left;
          padding: 9px;

          :focus {
            border: 1px solid ${(props) => props.theme.basic.primary};
            border-radius: 10px;
          }
        }
      }
    }

    button {
      font-size: 0.8rem;
      background: ${(props) => props.theme.basic.primary} !important;
      color: ${(props) => props.theme.basic.blackDarken};
      ${fontWeightFont(600)};
      border: none;
      width: 100%;
    }
  }
`;

export const Input = styled(AntInput)`
  margin-left: 0.5rem;
  width: 157px;
  height: 34px;
  background: ${(props) => props.theme.basic.default};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid ${(props) => props.theme.basic.whiteDarken};
  border-radius: 0;
  text-align: right;
  color: ${(props) => props.theme.basic.white};

  :focus {
    border: 1px solid ${(props) => props.theme.basic.primary};
    border-radius: 10px;
  }

  ::placeholder {
    color: ${(props) => props.theme.basic.default};
  }
`;

export const PaymentContainer = styled.div`
  text-align: left;
  color: ${(props) => props.theme.basic.white};

  .terms-conditions {
    color: ${(props) => props.theme.basic.action};
  }

  .container-wsp {
    display: grid;
    grid-template-columns: 100%;
    margin: 1rem 0;

    ${mediaQuery.afterTablet} {
      grid-template-columns: 50% 50%;
    }

    .item-num-wsp {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 1rem 0;

      ${mediaQuery.afterTablet} {
        margin-left: 10px;
      }

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
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 10px;

      .input-link-wsp {
        cursor: pointer;
        width: auto;
        border: 1px solid ${(props) => props.theme.basic.primary};
        border-radius: 12px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.blackDarken};
        padding: 11px 14px;
        margin-bottom: 8px;
      }
    }
  }

  .payments-info {
    margin-top: 1rem;

    .sub-title {
      padding: 10px 0;
      color: ${(props) => props.theme.basic.blackLighten};
    }

    ol {
      list-style-position: inside;

      li {
        font-size: 12px;
        margin-bottom: 5px;
        color: ${(props) => props.theme.basic.blackLighten};
      }
    }
  }
`;

export const MethodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  background: ${(props) => props.theme.basic.blackDarken};
  border: 1px solid ${(props) => props.theme.basic.primary};
  border-radius: 8px;

  .list-methods-items {
    width: 100%;
    margin: 0;
    padding: 0;

    .methods-item {
      display: grid;
      grid-template-columns: 80% 20%;
      text-align: center;
      padding: 14px 0;
      margin: 8px 0;
      border-right: 1px solid ${(props) => props.theme.basic.primary};
      cursor: pointer;
      width: 100%;
      height: 50px;
      border: 1px solid ${(props) => props.theme.basic.white};
      border-radius: 10px;

      .text-payment {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-left: 10px;
      }

      .item-radio {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;

        input {
          width: 17px;
          height: 17px;

          &:checked {
            width: 17px;
            height: 17px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: 4px solid ${(props) => props.theme.basic.white};
            border-radius: 50%;
            background: ${(props) => props.theme.basic.primary};
          }
        }
      }
    }
  }

  .selected {
    background: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .input-select-payment {
    width: auto;
    border: 1px solid ${(props) => props.theme.basic.primary};
    border-radius: 12px;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.blackDarken};
    padding: 11px 14px;
    margin-bottom: 8px;
    cursor: pointer;

    i {
      margin-left: 7px;
    }
  }
`;

export const ContainerModalMethodPayment = styled(Modal)`
  padding-bottom: 0;
  color: ${(props) => props.theme.basic.white};

  .ant-modal-content {
    background: ${(props) => props.theme.basic.blackDarken};
    border-radius: 0;
    padding: 0;

    ${mediaQuery.afterTablet} {
      padding: 10px;
    }

    .ant-modal-close {
      padding-bottom: 1rem;
      color: ${(props) => props.theme.basic.white};
      font-size: 20px;
    }

    .ant-modal-footer {
      display: none;
    }
  }

  .header-modal {
    .item-title-modal {
      text-align: center;
      color: ${(props) => props.theme.basic.primary};
      font-size: 1.2rem;
      margin: 0 0 1rem 0;
    }
  }

  .body-modal {
    .container-images-payment {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;

      img {
        width: 120px;
        height: auto;
        padding: 10px;
      }
    }

    .text-divider {
      text-align: center;
      font-size: 1rem;
      margin: 1rem 0;
    }

    .text-exchange-rate {
      text-align: center;
      font-size: 0.9rem;
      color: ${(props) => props.theme.basic.action};
      margin: 1rem 0;
    }

    .container-payment-steps {
      width: 100%;
      margin: 5px 0;
      display: flex;
      justify-content: center;

      ul {
        width: 100%;
        margin: 0;

        ${mediaQuery.afterTablet} {
          width: 80%;
        }

        li {
          display: grid;
          grid-template-columns: 20% 80%;
          margin: 5px;

          .item-step-num {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding-left: 5px;

            img {
              width: 60px;
              height: auto;
            }
          }

          .item-step-text {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 0 0 15px;

            span {
              font-size: 1rem;
              text-align: left;
            }
          }
        }
      }
    }

    .account-bank {
      margin: 1rem 0px;

      div {
        input {
          background: none;
          color: ${(props) => props.theme.basic.white};
          border: none;
          width: 200px;
        }

        font-size: 0.8rem;

        ${mediaQuery.afterTablet} {
          font-size: 1rem;
        }

        margin: 10px 0px;

        .anticon-copy {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }

  .footer-modal {
    .container-wsp {
      display: grid;
      grid-template-columns: 100%;
      margin: 1rem 0;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 50% 50%;
      }

      .item-num-wsp {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 1rem 0;

        ${mediaQuery.afterTablet} {
          margin-left: 10px;
        }

        img {
          width: auto;
          height: 30px;
          margin: 0;
        }

        span {
          margin-left: 10px;
          font-size: 1rem;
          cursor: pointer;
        }
      }

      .item-link-wsp {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-right: 10px;

        .input-link-wsp {
          width: auto;
          border: 1px solid ${(props) => props.theme.basic.primary};
          border-radius: 12px;
          color: ${(props) => props.theme.basic.white};
          background: ${(props) => props.theme.basic.blackDarken};
          padding: 11px 14px;
          margin-bottom: 8px;
          cursor: pointer;
        }
      }
    }
  }
`;

export const VisanetContainer = styled.div`
  margin-top: 10px;
  font-size: 12px;

  fieldset {
    margin: 1rem 0 !important;
    padding: 0 !important;
    border: none;

    select {
      margin: 6px 0;
      background: ${(props) => props.theme.basic.whiteDarken};
      border: none;
      border-radius: 5px;
      padding: 7px 10px;
      color: ${(props) => props.theme.basic.blackLighten};
    }

    .container-card {
      color: ${(props) => props.theme.basic.blackLighten};
      position: relative;
      font-weight: bold;
    }

    .amount-container:before {
      content: "$";
      position: absolute;
      top: 26px;
      left: -10px;
      font-weight: bold;
      font-size: ${sizes.font.normal};
      line-height: 14px;
    }

    .coupon-validation {
      color: ${(props) => props.theme.basic.primary};
      font-size: 10px;
    }

    .pre-order {
      width: 60%;
      margin: 0;
      margin: 1rem 0 !important;
      
      ${mediaQuery.afterMobile} {
        width: 50%;
      }

      .deposit-money{
        display: flex;
        justify-content: space-between;
        font-size: ${sizes.font.normal};
        color: ${(props) => props.theme.basic.grayLight};
        font-weight: bold;
        line-height: 14px;
      }

      .receive-money {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        color: ${(props) => props.theme.basic.blackLighten};
        font-size: ${sizes.font.extraLarge};
        line-height: 17px;
      }

      .receive-money {
        font-weight: bold;

        .eb-coin {
          white-space: nowrap;
        }
      }
    }

    .logo {
      width: 50%;
      margin: 1rem 0;
    }

    form {
      margin: 10px 0;

      .start-js-btn {
        background: ${(props) => props.theme.basic.primary} !important;
        color: ${(props) => props.theme.basic.blackDarken};
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
      }

      .start-js-btn:after {
        content: "Paga con Visa";
      }
    }
  }

  .visa-secure {
    display: flex;
    align-items: center;

    img {
      height: 40px;
      width: 40px;
    }

    p {
      margin: 0;
      padding-left: 7px;
      font-weight: bold;
      color: ${(props) => props.theme.basic.blackLighten};
      font-size: 11px;

      ${mediaQuery.afterTablet} {
        font-size: 14px;
      }
    }
  }
`;

export const MercadoPagoForm = styled.form`
  margin-top: 10px;
  font-size: 12px;

  fieldset {
    display: contents;

    input,
    select {
      margin: 6px 0;
      background: ${(props) => props.theme.basic.blackDarken};
      border: none;
      border-radius: 5px;
      padding: 7px 10px;
      color: ${(props) => props.theme.basic.white};
    }

    input[type="submit"]:disabled {
      background: ${(props) => props.theme.basic.blackLighten};
      cursor: not-allowed !important;
    }

    .container-security {
      display: grid;
      grid-template-columns: repeat(2, calc(100% / 2));

      .security-expiration {
        input {
          width: 70px;
        }
      }
    }

    .container-document {
      display: grid;
      grid-template-columns: 40% 60%;

      .documents {
        padding: 0 15px 0 0;
      }

      input,
      select {
        width: 100%;
        height: 32px;
      }
    }

    .container-information,
    .container-document,
    .container-card,
    .container-security {
      margin: 5px 0;
    }

    .coupon-validation {
      color: ${(props) => props.theme.basic.primary};
      font-size: 10px;
    }

    .pre-order {
      width: 60%;
      margin: 1rem 0;

      ${mediaQuery.afterMobile} {
        width: 50%;
      }

      .deposit-money,
      .receive-money {
        display: flex;
        justify-content: space-between;
        color: #e5e5e5;
        font-size: 12px;
      }

      .receive-money {
        font-weight: bold;

        .eb-coin {
          white-space: nowrap;
        }
      }
    }

    .logo {
      width: 70px;
      margin: 1rem 0;
    }
  }
`;
