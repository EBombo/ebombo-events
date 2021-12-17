import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Desktop, Tablet } from "../../../../../constants";
import { ButtonAnt } from "../../../../../components/form";
import { bingoCard } from "../../../../../components/common/DataList";
import { CardContainer } from "../Bingo";
import { ModalMove } from "../../../../../components/common/ModalMove";

export const BingoView = (props) => {
  const showBingoCard = () => (
    <CardContainer
      backgroundColor={get(props.game, "backgroundColor", "")}
      backgroundImage={get(props.game, "backgroundImg", "")}
      titleColor={get(props.game, "titleColor", "")}
      blocksColor={get(props.game, "blocksColor", "")}
      numberColor={get(props.game, "numberColor", "")}
    >
      <ModalMove
        moveToFolder={props.moveGameToFolder}
        setIsVisibleModalMove={props.setIsVisibleModalMove}
        isVisibleModalMove={props.isVisibleModalMove}
        {...props}
      />
      <div className="card-title">{get(props.game, "title", "")}</div>
      <table>
        <thead className="thead">
          <tr>
            <th>{get(props.game, "letters.b", "")}</th>
            <th>{get(props.game, "letters.i", "")}</th>
            <th>{get(props.game, "letters.n", "")}</th>
            <th>{get(props.game, "letters.g", "")}</th>
            <th>{get(props.game, "letters.o", "")}</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {bingoCard.map((arrNums, index) => (
            <tr key={`key-${index}`}>
              {arrNums.map((num, idx) => (
                <td key={`key-${num}-${idx}`}>{num}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContainer>
  );

  return (
    <div>
      <div className="subtitle">Cartilla</div>
      <div className="specifications">
        <div>
          <Desktop>
            <div className="description">Descripcción:</div>
            <div className="amount-numbers">1- {get(props.game, "amountNumbers", 75)} números</div>
          </Desktop>
          <div className="left-container">
            <div className="color">
              <div className="label">Fondo</div>
              {get(props.game, "backgroundImg", null) ? (
                <div className="name">(Imagen)</div>
              ) : (
                <div className="name">
                  <ColorBlock color={get(props.game, "backgroundColor", "")} />
                  {get(props.game, "backgroundColor", "").toUpperCase()}
                </div>
              )}
            </div>
            <div className="color">
              <div className="label">Bloques</div>
              <div className="name">
                <ColorBlock color={get(props.game, "blocksColor", "")} />
                {get(props.game, "blocksColor", "").toUpperCase()}
              </div>
            </div>
            <div className="color">
              <div className="label">Título</div>
              <div className="name">
                <ColorBlock color={get(props.game, "titleColor", "")} />
                {get(props.game, "titleColor", "").toUpperCase()}
              </div>
            </div>
            <div className="color">
              <div className="label">Números</div>
              <div className="name">
                <ColorBlock color={get(props.game, "numberColor", "")} />
                {get(props.game, "numberColor", "").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
        <div className="right-container">{showBingoCard()}</div>
      </div>
      <Tablet>
        <div className="btn-container">
          <ButtonAnt onClick={props.createTokenToPlay}>Jugar</ButtonAnt>
        </div>
      </Tablet>
    </div>
  );
};

const ColorBlock = styled.div`
  width: 29px;
  height: 36px;
  background: ${(props) => (props.color ? props.color : props.theme.basic.whiteLight)};
  border: 1px solid ${(props) => props.theme.basic.grayLight};
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
`;
