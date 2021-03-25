import styled from "styled-components";
import { fontWeightFont, homeGlobal, mediaQuery } from "../../constants";

export const ContainerComponentLeagues = styled.section`
  height: auto;
  ${mediaQuery.afterTablet} {
    padding: ${homeGlobal.padding_cards_desktop};
    height: 70px;
    display: flex;
    align-items: center;
  }
  .header-league {
    ${fontWeightFont(600)};
    font-size: ${homeGlobal.font_size_primary};
    color: ${(props) => props.theme.basic.white};
    padding: 7px 0px 0px 8px;
    ${mediaQuery.afterTablet} {
      padding-left: 0;
      width: 150px;
    }
  }
  .body-league {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 10px 0;

    ${mediaQuery.afterTablet} {
      overflow-x: scroll;
      padding: 0;
      flex-wrap: nowrap;
    }
  }
`;

export const ItemLeague = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  text-align: center;
  width: 60px;
  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 20% 80%;
    border-radius: 2px;
    margin-right: 10px;
    width: 270px;
    padding: 5px 5px;
    align-items: center;
    background: ${(props) =>
      props.leagueId && props.leagueId === props.league.id
        ? props.theme.basic.primary
        : props.theme.basic.default};
  }

  .img-league {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: ${(props) =>
      props.leagueId && props.leagueId === props.league.id
        ? props.theme.basic.primary
        : props.theme.basic.default};
    border-radius: 50%;
    padding: 7px;
    margin-bottom: 3px;
    ${mediaQuery.afterTablet} {
      width: auto;
      height: auto;
      padding: 0;
      margin-bottom: 0;
      background: none;
    }
    img {
      filter: ${(props) =>
        props.leagueId &&
        props.leagueId === props.league.id &&
        "brightness(0%)"};
      -webkit-filter: ${(props) =>
        props.leagueId &&
        props.leagueId === props.league.id &&
        "brightness(0%)"};
      width: 30px;
      height: auto;
      ${mediaQuery.afterTablet} {
        width: 25px;
        height: auto;
      }
    }
  }

  .description-league {
    width: 50px;
    padding: 0 3px;
    line-height: 14px;
    ${mediaQuery.afterDesktop} {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 180px;
      display: flex;
      align-items: center;
    }
    .title-league {
      font-size: 0.7rem;
      ${fontWeightFont(600)};
      color: ${(props) => props.theme.basic.primary};
      ${mediaQuery.afterTablet} {
        font-size: ${homeGlobal.font_size_secundary};
        ${fontWeightFont(500)};
        color: ${(props) =>
          props.leagueId && props.leagueId === props.league.id
            ? props.theme.basic.blackDarken
            : props.theme.basic.primary}
    }
    ${mediaQuery.afterMobile} {
      text-align: left;
    }
  }
`;
