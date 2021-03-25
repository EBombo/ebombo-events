import styled from "styled-components";
import { centerFlexBox } from "../../../constants";

export const ContainerTournamentsDesktop = styled.section``;

export const ContainerTournamentsRegMobile = styled.section`
  max-width: 1000px;
  margin: auto;
  .banner-tournament-game {
    width: 100%;
    height: 6rem;
    background: ${(props) => props.theme.basic.danger};
    margin: 1rem 0;
    ${centerFlexBox()};
    img {
      width: auto;
      height: 65%;
    }
  }

  .content-items {
    padding: 0 1rem;

    .item-banner-asd {
      width: 100%;
      height: 5rem;
      border-radius: 0.7rem;
      background: rebeccapurple;
      color: ${(props) => props.theme.basic.white};
      font-weight: 700;
      font-size: 1.5rem;
      margin: 2rem 0 1rem 0;
      ${centerFlexBox};
    }

    .content-filters {
      margin: 2rem 0;
      .item-filter {
        display: flex;
        justify-content: center;
        align-items: center;
        .item {
          width: 111px;
          height: 45px;
          padding: 0.5rem 0;
          margin: 0 0.3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid ${(props) => props.theme.basic.primary};
          border-radius: 6px;
          background: ${(props) => props.theme.basic.blackDarken};
          font-size: 0.8rem;
          font-weight: 600;
          color: ${(props) => props.theme.basic.primary};
          cursor: pointer;
          span {
            .path {
              fill: ${(props) => props.theme.basic.danger} !important;
            }
            img {
              width: 15px;
              height: auto;
              fill: ${(props) => props.theme.basic.danger} !important;
            }
          }
        }
      }
      .item-state-filter {
        margin: 1rem 0;
        .list {
          display: flex;
          justify-content: space-around;
          list-style: none;
          li {
            width: calc(100% / 3.2);
            padding: 0.25rem 0;
            border: 1px solid ${(props) => props.theme.basic.primary};
            border-radius: 6px;
            background: ${(props) => props.theme.basic.blackDarken};
            font-size: 0.8rem;
            font-weight: 600;
            color: ${(props) => props.theme.basic.primary};
            cursor: pointer;
            text-align: center;
          }
        }
      }
    }

    .container-items-tournament-cards {
      .title-cards {
        text-align: left;
        color: ${(props) => props.theme.basic.primary};
        font-weight: 600;
        margin: 1rem 0;
      }
    }

    .item-card-levels {
      margin: 1rem 0;
      .title-card {
        font-size: 1rem;
        color: ${(props) => props.theme.basic.white};
        font-weight: 600;
        margin: 0.7rem 0;
      }
      .wrapper-tip {
        border-radius: 10px;
        padding: 1rem;
        border: 1px solid ${(props) => props.theme.basic.primary};
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }
`;

export const CardTournament = styled.section`
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 7% 50% 43%;
  border-radius: 8px;
  margin: 1rem 0;
  background: ${(props) => props.theme.basic.blackDarken};
  .item-left {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: ${(props) => props.theme.basic.danger};
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
      height: auto;
    }
  }
  .item-center {
    padding: 0.4rem 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item-title {
      .title {
        color: ${(props) => props.theme.basic.primary};
        font-size: 15px;
        font-weight: 700;
        text-align: left;
      }
      .items-tags {
        display: flex;
        .tag {
          color: ${(props) => props.theme.basic.white};
          font-size: 12px;
          margin: 0 1rem 0 0;
          font-weight: 600;
        }
      }
    }
    .item-description {
      padding: 0.4rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        display: flex;
        flex-wrap: wrap;
        color: ${(props) => props.theme.basic.white};
        margin: 0.3rem 0;
        font-size: 10px;
        img {
          width: auto;
          height: 10px;
          margin-right: 2px;
        }
        span {
          color: ${(props) => props.theme.basic.primary};
          display: flex;
          align-items: center;
        }
      }
    }
    .item-limit-players {
      padding: 0.3rem 0;
      .item-graphic {
        width: 80%;
        height: 5px;
        background: ${(props) => props.theme.basic.blackDarken};
        border: 1px solid ${(props) => props.theme.basic.primary};
        margin: 0.1rem 0;
        overflow: hidden;
        .item-progress {
          width: 50%;
          height: 100%;
          background: ${(props) => props.theme.basic.primary};
        }
      }
      .item-text {
        font-size: 9px;
        text-align: left;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
  .item-right {
    padding: 0.4rem 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item-prize {
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: ${(props) => props.theme.basic.white};
    }
    .item-detail {
      text-align: right;
      .item {
        margin: 0.3rem 0;
        .title {
          font-weight: 500;
          font-size: 10px;
          color: ${(props) => props.theme.basic.white};
        }
        .description {
          font-size: 10px;
          font-weight: 500;
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }
    .item-btn-enter {
      padding: 0.2rem 0;
      display: flex;
      justify-content: flex-end;
    }
  }
`;
