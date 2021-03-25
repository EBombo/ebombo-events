import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Icon } from "../../../../../../../components/common/Icons";

export const MatchHeadersBattleRoyale = (props) => {
  return (
    <MatchHeadersBattleRoyaleCss>
      {props.listMatches &&
        Array.apply(null, Array(3)).map((value, index) => (
          <div className="option" key={`option-key-${index}`}>
            <div
              onClick={() => {
                props.setIndexMatch(index);
                props.setCurrentScore({});
                props.setIsVisibleModalPoints(true);
              }}
              className={`btn-update-points ${
                index !== get(props, "currentTeam.score", []).length
                  ? "disabled"
                  : ""
              }`}
            >
              Partida {index + 1}
            </div>
            <div className="label">
              {index < get(props, "currentTeam.score", []).length && (
                <>
                  Partida subida correctamente <Icon type="check-circle" />
                </>
              )}
            </div>
          </div>
        ))}
    </MatchHeadersBattleRoyaleCss>
  );
};

const MatchHeadersBattleRoyaleCss = styled.div`
  display: inline-grid;

  .option {
    display: grid;
    grid-template-columns: auto auto;
    margin: 10px 3px;

    .btn-update-points {
      color: ${(props) => props.theme.basic.primary};
      text-decoration: underline ${(props) => props.theme.basic.primary};
      cursor: pointer;
    }

    .disabled {
      color: ${(props) => props.theme.basic.whiteDarken} !important;
      text-decoration: underline ${(props) => props.theme.basic.whiteDarken} !important;
      pointer-events: none;
    }

    .label {
      width: 100%;
      margin: auto 5px;
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;
