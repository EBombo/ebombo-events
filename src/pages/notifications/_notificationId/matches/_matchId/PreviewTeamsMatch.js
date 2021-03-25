import React from "reactn";
import styled from "styled-components";
import { Image } from "../../../../../components/common/Image";
import { config } from "../../../../../firebase";
import { mediaQuery } from "../../../../../styles/constants";

export const PreviewTeamsMatch = (props) => {
  return (
    <PreviewTeamsToMatchCss>
      <div className="preview-team-a-container">
        <div>
          <div className="name">{props[`${props.iAm}TeamName`]}</div>
          {props[`${props.opponentIs}StreamUrl`] && (
            <a
              href={props[`${props.opponentIs}StreamUrl`]}
              className="stream-url"
            >
              Ver Stream
            </a>
          )}
        </div>
        <Image
          src={
            props[`${props.iAm}TeamImageUrlThumb`]
              ? props[`${props.iAm}TeamImageUrlThumb`]
              : `${config.storageUrl}/resources/teams-default.svg`
          }
          size={props[`${props.iAm}TeamImageUrlThumb`] ? "cover" : "contain"}
          height={"50px"}
          width={"50px"}
          desktopWidth={"60px"}
          desktopHeight={"60px"}
          borderRadius={"50%"}
        />
      </div>
      <div className="preview-team-b-container">
        <Image
          src={
            props[`${props.opponentIs}TeamImageUrlThumb`]
              ? props[`${props.opponentIs}TeamImageUrlThumb`]
              : `${config.storageUrl}/resources/teams-default.svg`
          }
          size={
            props[`${props.opponentIs}TeamImageUrlThumb`] ? "cover" : "contain"
          }
          height={"50px"}
          width={"50px"}
          desktopWidth={"60px"}
          desktopHeight={"60px"}
          borderRadius={"50%"}
        />
        <div>
          <div className="name">{props[`${props.opponentIs}TeamName`]}</div>
          {props[`${props.opponentIs}StreamUrl`] && (
            <a
              href={props[`${props.opponentIs}StreamUrl`]}
              className="stream-url"
            >
              Ver Stream
            </a>
          )}
        </div>
      </div>
    </PreviewTeamsToMatchCss>
  );
};

const PreviewTeamsToMatchCss = styled.div`
  margin-top: 15px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, auto);
  padding: 0 1rem;
  ${mediaQuery.afterTablet} {
    padding: 0 2rem;
  }

  .preview-team-a-container,
  .preview-team-b-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    align-items: center;

    .name {
      color: ${(props) => props.theme.basic.white};
      margin: 0;
    }

    a {
      max-width: 100%;
    }
  }

  .preview-team-b-container {
    .name,
    a {
      display: flex;
      justify-content: flex-end;
    }
  }
`;
