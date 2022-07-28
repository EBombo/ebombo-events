import React from "reactn";
import { darkTheme } from "../../../../theme";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { useTranslation } from "../../../../hooks";
import styled from "styled-components";

export const ModalUserCards = (props) => {
  const { t } = useTranslation("pages.reports.bingo.modal-cards");

  return (
    <ModalContainer
      width={"700px"}
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={true}
      onCancel={() => props.setIsVisibleModalCards(false)}
      visible={props.isVisibleModalCards}
      padding="0"
    >
      <div className="h-[60px] p-4 border-b-[1px] border-whiteDark font-[700] text-[24px] leading-[29px] text-grayLight">
        {t("cards")}
      </div>
      <div className="my-4 text-blackDarken text-[14px] leading-[17px] px-4 md:text-[20px] md:leading-[24px]">
        {props.user.nickname}
      </div>
      <div className="p-4 gap-4 flex flex-wrap">
        {props.user?.rounds?.map((round) => (
          <CardContainer
            backgroundColor={props.lobby.game.backgroundColor}
            backgroundImg={props.lobby.game.backgroundImg}
            titleColor={props.lobby.game.titleColor}
            blocksColor={props.lobby.game.blocksColor}
            numberColor={props.lobby.game.numberColor}
          >
            <div className="card-title no-wrap">{props.lobby.game.title}</div>
            <table>
              <thead className="thead">
                <tr>
                  <th>{props.lobby?.game?.letters?.b}</th>
                  <th>{props.lobby?.game?.letters?.i}</th>
                  <th>{props.lobby?.game?.letters?.n}</th>
                  <th>{props.lobby?.game?.letters?.g}</th>
                  <th>{props.lobby?.game?.letters?.o}</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {JSON.parse(round.card).map((arrNums, row) => (
                  <tr key={`key-${row}`}>
                    {arrNums.map((num, col) => (
                      <td key={`key-${num}-${col}`}>
                        <div className={`${round.myWinningCard.includes(num) && "active"} number`}>{num}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContainer>
        ))}
      </div>
    </ModalContainer>
  );
};

const CardContainer = styled.div`
  width: 100%;
  aspect-ratio: 6/ 8;
  max-width: 215px;
  background: ${(props) => {
    if (props.backgroundImg) return `url(${props.backgroundImg})`;
    if (props.backgroundColor) return props.backgroundColor;

    return props.theme.basic.secondary;
  }};
  background-position: center;
  border-radius: 3px;
  padding: ${(props) => (props.full ? "1rem" : "0.5rem")};
  margin: 0 auto;
  display: grid;
  grid-template-rows: 10% 85%;
  grid-gap: 5%;

  .card-title {
    font-family: Lato;
    font-weight: bold;
    color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
    text-align: center;
    font-size: 26px;
    line-height: 29px;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 5px;
    margin: 0 auto;

    thead {
      tr {
        th {
          width: 20%;
          aspect-ratio: 1 / 1;
          text-align: center;
          font-family: Lato;
          font-weight: 700;
          font-size: 26px;
          line-height: 29px;
          font-style: normal;
          color: ${(props) => (props.titleColor ? props.titleColor : props.theme.basic.secondary)};
        }
      }
    }

    tbody {
      tr {
        td {
          width: 20%;
          aspect-ratio: 1 / 1;
          margin-right: 5px;
          text-align: center;
          font-family: Lato;
          font-weight: 400;
          font-size: 20px;
          line-height: 24px;
          font-style: normal;
          color: ${(props) => (props.numberColor ? props.numberColor : props.theme.basic.white)};
          background: ${(props) => (props.blocksColor ? props.blocksColor : props.theme.basic.secondary)};
          justify-content: center;

          .active {
            border-radius: 50%;
            background: ${(props) => props.theme.basic.success};
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${(props) => props.theme.basic.blackDarken};
            margin: 0 auto;
          }

          .number {
            cursor: pointer;
            width: 80%;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: auto;
            text-align: center;
          }
        }
      }
    }
  }
`;
