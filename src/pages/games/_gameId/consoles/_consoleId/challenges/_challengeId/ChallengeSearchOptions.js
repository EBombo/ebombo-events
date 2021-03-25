import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../../../../styles/constants";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import sortBy from "lodash/sortBy";
import { useParams } from "react-router";
import {
  ButtonBombo,
  EBomboRules,
  Select,
} from "../../../../../../../components";
import { ModalContainer } from "../../../../../../../components/common/ModalContainer";

export const ChallengeSearchOptions = (props) => {
  const { gameId } = useParams();
  const [settings] = useGlobal("settings");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [visibleSettingsMatches, setVisibleSettingsMatches] = useGlobal(
    "visibleSettingsMatches"
  );
  const [rules] = useGlobal("rules");
  const [gameRuleId, setGameRuleId] = useGlobal("gameRuleId");
  const [gameEntryCost, setGameEntryCost] = useGlobal("gameEntryCost");
  const [realMoney] = useGlobal("realMoney");
  const [isVisibleEBomboRules, setIsVisibleEBomboRules] = useState(false);

  useEffect(() => {
    realMoney
      ? setGameEntryCost(orderEntryCost()[0])
      : setGameEntryCost(orderPlayMoneyEntryCosts()[0]);
  }, [realMoney]);

  const orderEntryCost = () => sortBy(get(settings, "entryCosts", []));

  const orderPlayMoneyEntryCosts = () =>
    sortBy(get(settings, "playMoneyEntryCosts", []));

  return (
    <OptionsContainer isDesktop={props.isDesktop}>
      <div className="rules-container">
        <div className="game-rule">
          <span>Reglas del juego</span>
          <div className="body">
            {defaultTo(rules, [])
              .filter((rule) => get(rule, "gameId", "") === gameId)
              .map((rule) => (
                <div key={rule.id}>
                  <SpecialInput
                    onClick={() => {
                      setGameRuleId(rule.id);
                      setVisibleSettingsMatches(false);
                    }}
                    selected={gameRuleId === rule.id}
                  >
                    <div>
                      <h3>{rule.name}</h3>
                      <h4>
                        {get(rule, "description", "")
                          .split("-")
                          .filter((description) => description.length > 2)
                          .map((description) => (
                            <div key={description}>-{description}</div>
                          ))}
                      </h4>
                    </div>
                    <span />
                  </SpecialInput>
                  <br />
                </div>
              ))}
          </div>
        </div>
        <div className="general-rules">
          <ButtonBombo
            onClick={() => setIsVisibleEBomboRules(true)}
            margin="0.5rem 0"
            type="secondary"
            fontSize=".7rem"
            width="100%"
          >
            Reglas ebombo
          </ButtonBombo>
        </div>
      </div>

      <div className="game-entry-cost">
        <label>Costo de entrada</label>

        <EntryCostContainer>
          <Select
            defaultValue={gameEntryCost}
            key={gameEntryCost + "select"}
            onSelect={(value) => setGameEntryCost(+value)}
            optionsdom={orderEntryCost().map((entryCost, index) => ({
              key: index,
              name: `${currentCurrency}${entryCost}`,
              code: entryCost,
            }))}
          />
          <div className="other-container">
            <span>Otro:</span>
            <div className="other">
              <span>{currentCurrency}</span>
              <EntryCostInput
                required
                key={gameEntryCost}
                type="number"
                autoComplete="off"
                name="entryCost"
                className="input-name-team"
                defaultValue={gameEntryCost}
                onBlur={(event) => setGameEntryCost(+event.target.value)}
                placeholder="Costo de entrada.."
              />
            </div>
          </div>
        </EntryCostContainer>

        <ButtonBombo
          width="100%"
          onClick={() => props.createChallenge()}
          loading={props.creatingChallenge}
          disabled={props.creatingChallenge}
          margin={"1rem 0"}
        >
          {props.challenged ? "INVITAR" : "PUBLICAR DESAFIO"}
        </ButtonBombo>
      </div>
      <ModalContainer
        footer={null}
        visible={isVisibleEBomboRules}
        onCancel={() => setIsVisibleEBomboRules(false)}
      >
        <EBomboRules />
      </ModalContainer>
    </OptionsContainer>
  );
};

const EntryCostContainer = styled.div`
  .entry-cost-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .entry-cost {
      width: auto;
      height: 26px;
      background: ${(props) => props.theme.basic.blackLighten};
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;

      span {
        font-size: 9px;
        color: ${(props) => props.theme.basic.white};
      }
    }

    .selected {
      border: 1px solid ${(props) => props.theme.basic.primary};

      span {
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }

  .other-container {
    color: ${(props) => props.theme.basic.white};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 0.5rem;

    .other {
      display: flex;
      align-items: center;
      max-width: 150px;
      margin-left: 5px;

      span {
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;

const EntryCostInput = styled.input`
  background: ${(props) => props.theme.basic.blackLighten};
  color: ${(props) => props.theme.basic.primary};
  text-align: right;
  padding: 5px 3px;
  border-radius: 5px;
  width: 100%;
  border: none;
`;

const OptionsContainer = styled.div`
  margin: 1rem 0;
  padding: 0 1rem;
  border-top: 1px solid #636262;
  border-bottom: 1px solid #636262;

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem;
  }

  .rules-container {
    padding: 10px;
    margin: 0 !important;

    ${(props) =>
      props.isDesktop
        ? "display: grid; grid-template-columns: repeat(2, 1fr);"
        : ""}
    .game-rule {
      span {
        font-size: 12px;
        color: ${(props) => props.theme.basic.white};
      }

      .body {
        .option {
          border: 2px solid ${(props) => props.theme.basic.primary};
          padding: 10px 10px;
          margin: 20px 10px;
          border-radius: 10px;
        }
      }
    }
  }

  .game-entry-cost {
    padding: 10px;

    label {
      color: ${(props) => props.theme.basic.white};
      font-size: 12px;
    }
  }
`;

const SpecialInput = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  border: 1px solid ${(props) => props.theme.basic.primary};
  border-radius: 6px;
  color: ${(props) => props.theme.basic.white};
  padding: 0.5rem;

  :hover {
    box-shadow: 0px 0px 0px 1px ${(props) => props.theme.basic.primary};
  }

  h3 {
    font-size: 11px;
    line-height: 14px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 5px;

    ${mediaQuery.afterTablet} {
      font-size: 14px;
      line-height: 17px;
    }
  }

  h4,
  li {
    font-size: 10px;
    line-height: 12px;
    margin-bottom: 0;
    color: ${(props) => props.theme.basic.white};

    ${mediaQuery.afterTablet} {
      font-size: 11px;
      line-height: 14px;
    }
  }

  img {
    height: 10px;
    width: 15px;
  }

  span {
    position: relative;
    height: 14px;
    width: 14px;
    background-color: transparent;
    justify-self: center;
    border-radius: 2px;
    border: 1px solid ${(props) => props.theme.basic.primary};

    :before {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      ${(props) =>
        props.selected
          ? `content: "✓"; color: ${(props) => props.theme.basic.blackDarken};`
          : `content: ""; color: transparent;`}
      height: 14px;
      width: 14px;
      background-color: ${(props) =>
        props.selected ? props.theme.basic.primary : "transparent"};
      border-radius: 2px;
    }
  }
`;
