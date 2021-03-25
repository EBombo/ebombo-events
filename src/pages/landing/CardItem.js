import React from "reactn";
import { ButtonBombo } from "../../components/common";
import styled from "styled-components";
import get from "lodash/get";
import { useHistory } from "react-router";

export const CardItem = (props) => {
  const history = useHistory();

  return (
    <ContainerCardItem
      background={props.card.firstSectionImageUrlThumb}
      numItem={props.numItem}
    >
      <div className="content-items">
        <ul className="list-card">
          <li className="item heading-title">
            <span>{get(props, "card.headingSection", "")}</span>
          </li>
          <li className="item title">
            <span>{get(props, "card.titleSection", "")}</span>
          </li>
          <li className="item description">
            <span>{get(props, "card.descriptionSection", "")}</span>
          </li>
          <li className="item button-card">
            <ButtonBombo
              onClick={() => history.push(`${props.card.buttonLinkSection}`)}
              margin="0"
              fontSize="1rem"
              borderRadius="8px"
            >
              {get(props, "card.buttonTextSection", "")}
            </ButtonBombo>
          </li>
        </ul>
      </div>
    </ContainerCardItem>
  );
};

const ContainerCardItem = styled.section`
  background-image: url(${(props) => props.background});
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: ${(props) => (props.numItem === 1 ? "left" : "right")};
  min-width: 340px;
  width: 50%;
  height: 300px;
  border-radius: 15px;
  margin: 1rem;

  .content-items {
    width: 100%;
    height: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .list-card {
      padding: 0;
      margin: 0;
      list-style: none;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      li {
        width: 100%;
        margin: 0.3rem 0;
      }
    }
    .item {
      display: flex;
      justify-content: ${(props) =>
        props.numItem === 1 ? "flex-end" : "flex-start"};
      text-align: ${(props) => (props.numItem === 1 ? "right" : "left")};
    }
    .heading-title {
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.default};
    }
    .title {
      font-weight: 800;
      font-size: 34px;
      line-height: 44px;
      color: ${(props) => props.theme.basic.white};
    }
    .description {
      font-weight: 500;
      font-size: 14px;
      color: ${(props) => props.theme.basic.white};
      span {
        width: 300px;
      }
    }
    .button-card {
      padding: 0.7rem 0;
    }
  }
`;
