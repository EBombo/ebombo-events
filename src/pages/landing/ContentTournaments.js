import React from "reactn";
import styled from "styled-components";
import { Games } from "../../components";
import { Consoles } from "../../components/common/Consoles";
import { ItemCardTournament } from "../../components/tournaments/ItemCardTournament";
import { mediaQuery } from "../../styles/constants";
import { config } from "../../firebase";

export const ContentTournaments = (props) => (
  <ContainerContentTournaments>
    <div className="title-content-left">
      <span>Torneos</span>
    </div>
    <div className="content-header">
      <div className="item-left">
        <Games
          isDesktop
          borderRadius="6px"
          selectedGame={props.selectedGame}
          onClick={props.setSelectedGame}
        />
        <Consoles
          isDesktop
          borderRadius="6px"
          selectedGame={props.selectedGame}
          selectedConsole={props.selectedConsole}
          onClick={props.setSelectedConsole}
        />
      </div>
      <div className="item-right">
        <div className="content-item-filter">
          <div className="title">Equipos</div>
          <div className="item-filters">
            <div
              className={`item ${props.isSinglePlayer && "item-selected"}`}
              onClick={() => props.setIsSinglePlayer(true)}
            >
              <span>
                <img
                  src={`${config.storageUrl}/resources/b2bLanding/single-user.svg`}
                  alt=""
                />
              </span>
              <span>Individual</span>
            </div>
            <div
              className={`item ${!props.isSinglePlayer && "item-selected"}`}
              onClick={() => props.setIsSinglePlayer(false)}
            >
              <span>
                <img
                  src={`${config.storageUrl}/resources/b2bLanding/green-users.svg`}
                  alt=""
                />
              </span>
              <span>Grupal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="content-items-card">
      {props.tournaments.map((tournament) => (
        <ItemCardTournament tournament={tournament} />
      ))}
    </div>
  </ContainerContentTournaments>
);

const ContainerContentTournaments = styled.section`
  margin-right: 10px;
  .title-content-left {
    font-weight: 500;
    font-size: 21px;
    line-height: 26px;
    text-align: left;
    color: ${(props) => props.theme.basic.white};
    display: none;
    ${mediaQuery.afterTablet} {
      display: inherit;
    }
  }
  .content-header {
    display: flex;
    margin: 1rem;
    flex-wrap: wrap;
    ${mediaQuery.afterTablet} {
      margin: 1rem 0 2rem 0;
    }
    .item-left {
      display: flex;
      align-items: center;
      div {
        flex-direction: column;
        align-items: flex-start;
        font-size: 11px;
        ${mediaQuery.afterTablet} {
          font-size: 12px;
        }
      }
    }
    .item-right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .content-item-filter {
        margin-top: 1rem;
        color: ${(props) => props.theme.basic.white};
        ${mediaQuery.afterTablet} {
          margin-top: 0.3rem;
        }
        .title {
          font-weight: bold;
          margin: 5px 0px;
          font-size: 11px;
          ${mediaQuery.afterTablet} {
            font-size: 12px;
          }
        }
        .item-filters {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto auto 0 auto;
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
          .item-selected {
            background: ${(props) => props.theme.basic.primary};
            color: ${(props) => props.theme.basic.blackDarken};
            span {
              img {
                width: 15px;
                height: auto;
                filter: brightness(0%);
              }
            }
          }
        }
      }
    }
  }

  .content-items-card {
    width: 100%;
    max-height: 600px;
    overflow-y: scroll;
    padding: 0 0.7rem;
  }
`;
