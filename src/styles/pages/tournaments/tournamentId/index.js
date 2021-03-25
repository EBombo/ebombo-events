import styled from "styled-components";
import { centerFlexBox, mediaQuery } from "../../../constants";

export const ContainerTournamentsDesktop = styled.section``;

export const ContainerTournamentsMobile = styled.section`
  max-width: 500px;
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

    .section-two {
      color: ${(props) => props.theme.basic.white};
      margin: 1rem 0;
      .item-primary {
        display: grid;
        grid-template-columns: 50% 50%;
        font-size: 13px;
        font-weight: 600;
        .item-left {
          text-align: left;
        }
        .item-right {
          text-align: right;
          font-weight: 400;
          span {
            padding-left: 0.5rem;
            font-weight: 600;
            color: ${(props) => props.theme.basic.action};
          }
        }
      }
    }

    .content-filters {
      display: grid;
      grid-template-columns: repeat(4, auto);
      max-width: 500px;
      margin: auto;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.2rem;
        div {
          width: 80%;
          color: ${(props) => props.theme.basic.blackDarken};
          font-size: 7px;
          margin: 0.5rem auto;
          text-align: center;
          ${mediaQuery.afterTablet} {
            font-size: 9px;
          }
        }
      }
    }

    .container-button-inscription {
      display: flex;
      justify-content: center;
      margin: 1.5rem 0;
    }

    .section-text-footer {
      color: ${(props) => props.theme.basic.white};
      margin: 1rem 0;
      .title-footer {
        font-size: 12px;
        font-weight: 600;
        text-align: left;
        margin: 0.5rem 0;
      }
      .text-description {
        text-align: left;
        font-weight: 500;
        font-size: 10.5px;
      }
    }
  }
`;

export const CardTournament = styled.section`
  width: 100%;
  height: auto;
  display: grid;
  grid-template-columns: 50% 50%;
  border-radius: 8px;
  margin: 1rem 0;
  background: ${(props) => props.theme.basic.blackDarken};
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
      .item {
        display: flex;
        flex-wrap: wrap;
        color: ${(props) => props.theme.basic.white};
        margin: 0.1rem 0;
        font-size: 10px;
        img {
          width: auto;
          height: 10px;
          margin-right: 2px;
          cursor: pointer;
        }
        span {
          color: ${(props) => props.theme.basic.primary};
          display: flex;
          align-items: center;
          margin-right: 3px;
        }
      }
    }
    .item-limit-players {
      padding: 0.2rem 0;
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
    .item-prize {
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: ${(props) => props.theme.basic.white};
      display: flex;
      justify-content: flex-end;
      align-items: center;
      img {
        width: auto;
        height: 10px;
        margin-right: 2px;
        cursor: pointer;
      }
    }
    .item-detail {
      text-align: right;
      margin-top: 0.3rem;
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
  }
`;
