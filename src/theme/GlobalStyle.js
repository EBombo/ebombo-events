import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  .firebase-emulator-warning {
    display: none;
  }

  body {
    margin: 0;
    background-image: url(${(props) => props.background});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-color: ${(props) => props.theme.basic.gray};
    background-blend-mode: darken;
    /*------------efectos---------------*/
    @keyframes throb {
      from {
        transform: none;
      }
      50% {
        transform: scale(1.1);
      }
      to {
        transform: none;
      }
    }

    .un-seg {
      transition: all 1s ease !important;
    }

    /*------------efectos---------------*/
  }


  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.basic.primary};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.basic.action};
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  .no-wrap {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/

  /*-------------- STYLES GENERAL ----------------*/

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    background: ${(props) => props.theme.basic.gray};
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${(props) => props.theme.basic.gray};
    font-family: Lato, sans-serif;
    overflow: auto !important;
  }

  h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  /*-------------- STYLES GENERAL ----------------*/

  /*-------------- INPUT NUMBER WITH OUT ARROWS ----------------*/
  .input-no-style {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    -moz-appearance: textfield;
  }

  /*-------------- NOTIFICATIONS ANT---------------*/
  .ant-message {
    z-index: 999999;

    .ant-message-notice-content {
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
      z-index: 999999;
    @include fontWeightFont(500);
    }
  }

  .ant-notification-notice {
    color: ${(props) => props.theme.basic.white};
    height: 100%;
    padding: 12px;
    user-select: none;
    background: ${(props) => props.theme.basic.blackDarken};
    border: 0;
    border-radius: 2px;
    pointer-events: auto;

    .ant-notification-notice-message {
      color: ${(props) => props.theme.basic.primary};
      font-size: 13px;
    }

    .ant-notification-notice-close {
      color: ${(props) => props.theme.basic.white};
    }

    .ant-notification-notice-description {
      font-size: 12px;
    }
  }

  /*-------------- NOTIFICATIONS ANT---------------*/

  /*------------ANIMATION---------------*/
  @keyframes throb {
    from {
      transform: none;
    }
    50% {
      transform: scale(1.1);
    }
    to {
      transform: none;
    }
  }

  /*------------ANIMATION---------------*/

  /*------------Switch--------------*/

  /*------------Switch--------------*/


  /*-------------- FIELDSET ---------------*/
  fieldset {
    margin: 5px;
    padding: 10px;
    border: 1px solid ${(props) => props.theme.basic.primary};
    color: 1px solid ${(props) => props.theme.basic.primary};
    border-radius: 7px;

    legend {
      width: auto;
      margin: 0;
      color: ${(props) => props.theme.basic.primary};

      .title-legend {
      @include fontWeightFont(600);
        font-size: 0.8rem;
        padding: 0 10px 0 10px;
      }
    }
  }

  /*-------------- CONTAINER ---------------*/

  /*-------------- POPOVER ---------------*/
  .ant-popover-arrow-content{
    background: ${(props) => props.theme.basic.blackDarken};
  }
  
  .ant-popover-placement-right {
    .ant-popover-content {
      .ant-popover-arrow {
        border-bottom-color: ${(props) => props.theme.basic.blackDarken};
        border-left-color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .ant-popover {
    .ant-popover-content {
      .ant-popover-inner {
        background: ${(props) => props.theme.basic.blackDarken};

        .ant-popover-title {
          color: ${(props) => props.theme.basic.white};
        }

        .ant-popover-inner-content {
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }

  /*-------------- DISABLED ---------------*/
  .disabled {
    pointer-events: none;
    filter: brightness(0.4);
  }

  /*-------------- MODAL CONFIRM ---------------*/

  /*-------------- BREADCRUMB ---------------*/
  .ant-breadcrumb {
    a:hover {
      color: ${(props) => props.theme.basic.primary};
    }
  }
  /*-------------- BREADCRUMB ---------------*/

  .ant-btn-primary{
    background: ${(props) => props.theme.basic.primary} !important;
  }
  
  .ant-btn-primary[disabled]{
    background: #f5f5f5 !important;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  .ant-picker-header-view {
    .ant-picker-month-btn, 
    .ant-picker-year-btn{
      font-size: 14px;
    }
  }
`;
