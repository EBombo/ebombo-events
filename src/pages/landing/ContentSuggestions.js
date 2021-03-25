import React from "react";
import { homeGlobal, mediaQuery } from "../../styles/constants";
import { config } from "../../firebase";
import styled from "styled-components";
import { VideoTips } from "../../components/tips";

export const ContentSuggestions = () => {
  return (
    <ContainerSuggestions>
      <div className="content-cards">
        <div className="video-container">
          <VideoTips height={"30vh !important"} />
        </div>
      </div>
    </ContainerSuggestions>
  );
};

const ContainerSuggestions = styled.section`
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 3rem 0;
  .content-cards {
    display: grid;

    ${mediaQuery.afterTablet} {
      padding: 1rem 2rem;
      grid-template-columns: repeat(2, 50%);
    }
    .card-content {
      padding: 0 1rem;

      .title {
        font-size: ${homeGlobal.font_size_primary};
        text-align: left;
        color: ${(props) => props.theme.basic.white};
        font-weight: 600;
        width: 100%;
        height: auto;
        padding: 8px;
        min-height: 50px;
        display: flex;
        align-items: center;
      }
      .card-description {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .card-image {
          max-width: 300px;
        }
        ${mediaQuery.afterTablet} {
          flex-direction: row;
          .card-image {
            width: 50%;
          }
        }
      }
    }
  }
`;
