import React from "reactn";
import styled from "styled-components";

export const PanelBox = (props) => {
  return (
    <PanelBoxStyled {...props}>
      {props.heading && (
        <>
          <div className="heading">
            <div className="inner-heading">{props.heading}</div>
            {props.actionLink}
          </div>
          <hr className="divider" />
        </>
      )}

      {props.children}
    </PanelBoxStyled>
  );
};

const PanelBoxStyled = styled.div`
  width: 100%;
  border-radius: ${(props) => props.borderRadius ?? "2px"};
  padding: ${(props) => props.padding ?? "1rem"};
  margin: ${(props) => props.margin ?? "1rem 0"};
  background: ${(props) => props.theme.basic.whiteLight};
  ${(props) => props.elevated && `box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25)`};

  .heading {
    font-size: 15px;
    line-height: 19px;
    color: ${(props) => props.theme.basic.blackDarken};
    display: flex;

    .inner-heading {
      flex-grow: 2;
    }

    .divider {
      border-color: ${(props) => props.theme.basic.grayLighten};
      margin-bottom: 1.5rem;
    }
  }
`;
