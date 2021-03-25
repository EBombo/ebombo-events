import React, {useGlobal} from "reactn";
import defaultTo from "lodash/defaultTo";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";
import {btnPrimaryGeneral, mediaQuery} from "../../styles/constants";
import {config} from "../../firebase";
import {ButtonBombo} from "../common";

export const ModalAwards = (props) => {
  const [currency] = useGlobal("currentCurrency");

  const variableAwards = (tournament) => {
    if (
      tournament.awardType === "variable" &&
      tournament.variableAwards.length >= 1
    ) {
      return tournament.variableAwards
        .map((award) => +(props.totalAward * award) / 100)
        .reduce((a, b) => a + b, 0);
    }
  };

  return (
    <AwardsContent>
      <div className="title">Premios</div>
      <div className="items">
        {props.tournament.awardType === "fixed" ? (
          isEmpty(props.tournament.fixedAwards) ? (
            <>Premio por definir</>
          ) : (
            props.tournament.fixedAwards.map((award, index) => (
              <div key={index} className="item-prize">
                <span className="item-left">
                  Puesto
                  <span className="item-num-position">{index + 1}º :</span>
                </span>
                <span className="item-right">
                  {award.awardType.includes("ebCoins") ? (
                    <div>
                      {award.amount}
                      <img
                        src={`${config.storageUrl}/resources/ebCoin.svg`}
                        alt=""
                      />
                    </div>
                  ) : (
                    `${
                      award.awardType.includes("credit") ? "*" : ""
                    } ${currency} ${award.amount}`
                  )}
                </span>
              </div>
            ))
          )
        ) : (
          <>
            {defaultTo(props.tournament.variableAwards, []).map(
              (award, index) => (
                <div key={index} className="item-prize">
                  <span className="item-left">
                    Puesto
                    <span className="item-num-position">{index + 1}º :</span>
                  </span>
                  <span className="item-right">
                    {props.tournament.awardType === "variable"
                      ? `${currency} ${+(
                          (variableAwards(props.tournament) * award) /
                          100
                        ).toFixed(2)}`
                      : award}
                  </span>
                </div>
              )
            )}
            {props.tournament.awardType === "variable" && (
              <div
                style={{ marginTop: "10px", color: "gray", fontSize: "12px" }}
              >
                RECUERDA QUE A MÁS EQUIPOS MAYOR ES EL PREMIO
              </div>
            )}
          </>
        )}
      </div>
      <ButtonBombo
        className="button-primary"
        onClick={() => {
          props.setIsVisibleAwardsModal(false);
        }}
      >
        Entendido
      </ButtonBombo>
    </AwardsContent>
  );
};

const AwardsContent = styled.div`
  text-align: center;

  .button-primary {
    margin-top: 10px !important;
    ${(props) =>
      btnPrimaryGeneral(
        "1rem",
        600,
        0,
        "100%",
        "50px",
        props.theme.basic.blackDarken,
        props.theme.basic.primary
      )};
  }

  .title {
    color: ${(props) => props.theme.basic.primary};
  }

  .dollar {
    width: 25%;
  }

  .items {
    .item-prize {
      display: flex;
      justify-content: space-between;
      padding: 1px 0;
      align-items: center;

      img {
        margin-left: 5px;
        width: 13px;
        ${mediaQuery.afterTablet} {
          img {
            width: 15px;
          }
        }
      }

      &:nth-child(1) {
        font-weight: bold;
        font-size: 18px;
        img {
          width: 18px;
        }
        ${mediaQuery.afterTablet} {
          font-size: 25px;
          img {
            width: 25px;
          }
        }
      }
      &:nth-child(2) {
        font-weight: bold;
        font-size: 17px;
        img {
          width: 17px;
        }
        ${mediaQuery.afterTablet} {
          font-size: 20px;
          img {
            width: 20px;
          }
        }
      }
      &:nth-child(3) {
        font-weight: bold;
        font-size: 15px;
        margin-bottom: 10px;
        img {
          width: 15px;
        }
        ${mediaQuery.afterTablet} {
          font-size: 17px;
          img {
            width: 17px;
          }
        }
      }

      .item-left {
        text-align: right;
        width: 40%;

        .item-num-position {
          padding: 0 5px;
        }
      }

      .item-right {
        text-align: left;
        width: 40%;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        overflow: hidden;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
