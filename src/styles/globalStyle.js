import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  ::-webkit-scrollbar {
    width: 5px;
    height: 3px;
  }

  ::-webkit-scrollbar-track {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.basic.grayDarken};
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.basic.action};
    cursor: pointer;
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/
  .no-wrap {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  .pre-wrap {
    white-space: pre-wrap;
  }

  /*-------------- FIX SALTO DE LINEA GENERAL ----------------*/

  /*-------------- STYLES GENERAL ----------------*/
  h1, h2, h3 {
    margin: 0 !important;
    padding: 0;
  @include fontWeightFont(600);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    background: ${(props) => props.theme.basic.blackDarken};
  }

  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background: ${(props) => props.theme.basic.blackDarken};
    font-family: 'Quicksand', sans-serif;
    overflow: auto !important;
  }

  h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  /*-------------- STYLES GENERAL ----------------*/


  /*-------------- SELECT ANT----------------*/
  .ant-select-dropdown, .ant-select-dropdown--single, .ant-select-dropdown-placement-bottomLeft {
    background: ${(props) => props.theme.basic.blackDarken};

    div:first-child {
      background: transparent;

      .ant-select-item, .ant-select-item-option {
        color: ${(props) => props.theme.basic.primary};
      }

      .ant-select-item-option-active {
        font-weight: bold;
        background: ${(props) => props.theme.basic.default};
        color: ${(props) => props.theme.basic.primary};
      }

      .ant-select-dropdown-menu-item {
        color: ${(props) => props.theme.basic.primary};

        .winner {
          color: ${(props) => props.theme.basic.white};
          font-size: 12px !important;
        }

        &:hover, &-active, &-selected {
          color: ${(props) => props.theme.basic.default};
          background: ${(props) => props.theme.basic.primary};
        !important;

          .winner {
            color: ${(props) => props.theme.basic.default};
          }
        }
      }
    }
  }

  /*-------------- SELECT ANT----------------*/

  .ant-select-dropdown, .ant-select-dropdown--single, .ant-select-dropdown-placement-bottomLeft {
    background-color: transparent !important;
  }

  .ant-select-item-option {
    background-color: black !important;
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  

  /*-----PRIMARY---- */

  .ant-select-item-option.primary {
    background-color: ${(props) => props.theme.basic.blackDarken} !important;
    
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .ant-select-item-option.primary.ant-select-item-option-active {
    background-color: ${(props) => props.theme.basic.grayDarken} !important;
  }

  .ant-select-item-option.primary.ant-select-item-option-selected {
    background-color: ${(props) => props.theme.basic.blackLighten} !important;
  }

  /*-----SECONDARY ----- */

  .ant-select-item-option.secondary {
    background-color: ${(props) => props.theme.basic.grayLighten} !important;
    
 
    .ant-select-item-option-content {
      color: ${(props) => props.theme.basic.grayLight};
    }
  }
  .ant-select-item-option.secondary.ant-select-item-option-active {
    background-color: ${(props) => props.theme.basic.grayDark} !important;
  }

  .ant-select-item-option.secondary.ant-select-item-option-selected {
    background-color: ${(props) => props.theme.basic.default} !important;
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


  /*------------ MODAL ---------------*/
  .ant-modal-ebombo {
    .ant-modal-content {
      background: ${(props) => props.theme.basic.blackDarken};
      border: 1px solid ${(props) => props.theme.basic.primary};

      .ant-modal-body {
        .ant-modal-confirm-body-wrapper {
          .ant-modal-confirm-body {
            .anticon {
              color: ${(props) => props.theme.basic.primary};
            }

            .ant-modal-confirm-title {
              color: ${(props) => props.theme.basic.white};
            }
          }

          .ant-modal-confirm-btns {
            .ant-btn {
              color: ${(props) => props.theme.basic.white};
              background: ${(props) => props.theme.basic.blackDarken};
              border: 1px solid ${(props) => props.theme.basic.primary};
            }

            .ant-btn-info {
              color: ${(props) => props.theme.basic.white};
              background: ${(props) => props.theme.basic.primary};
            }
          }
        }
      }
    }
  }

  /*------------ MODAL ---------------*/


  /*-------------- SPIN LOADER----------------*/
  .bg-spin-bombo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
    background: ${(props) => props.theme.basic.blackDarken};

    .logo-spin {
      position: relative;
      display: inline-block;

      .item-preloader {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: ${(props) => props.theme.basic.white};

        label {
          margin-top: 5px;
        }

        img {
          width: 250px;
          @media (max-width: 992px) {
            width: 150px;
          }
        }

        @media (max-width: 992px) {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }

  .spin-loader {
    background: transparent;

    .spin-version {
      color: ${(props) => props.theme.basic.primary};
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
    }

    .spin-version-icon {
      font-size: 50px;
      margin-bottom: 25px;
      width: 110px;
    }

    .avatar-uploader {
      > .ant-upload {
        margin: auto;
        width: 77%;
        border-radius: 60%;
      }
    }
  }

  /*-------------- SPIN LOADER----------------*/


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


  /*-------------- FIELDSET ---------------*/
  fieldset {
    border: 1px solid ${(props) => props.theme.basic.default};
    border-radius: 7px;

    legend {
      width: auto;
      margin: 0;
      color: ${(props) => props.theme.basic.blackDarken};

      .title-legend {
      @include fontWeightFont(600);
        font-size: 0.8rem;
        padding: 0 10px 0 10px;
      }
    }
  }

  /*-------------- CONTAINER ---------------*/
`;
