import React from "react";
import {useHistory} from "react-router";
import styled from "styled-components";
import {useErrorHandler} from "react-error-boundary";
import {darkTheme} from "../../styles/theme";

export const BackButton = (props) => {
    const history = useHistory();

    const handleError = useErrorHandler();

    const onClick = () => {
        try {
            if (props.onClick) return props.onClick();
        } catch (error) {
      handleError({ ...error, action: "back button onClick" });
    }
    return history.goBack();
  };

  return (
    <BackButtonContainer onClick={onClick} {...props}>
        <svg width="15" height="14" viewBox="0 0 15 14" fill="none">
            <path
                d="M13.6541 5.65647L13.6767 5.66204H3.9958L7.03911 2.22389C7.18813 2.05603 7.26988 1.82864 7.26988 1.58998C7.26988 1.35132 7.18813 1.12553 7.03911 0.957272L6.56557 0.423205C6.41666 0.255348 6.21824 0.162537 6.00664 0.162537C5.79492 0.162537 5.59638 0.254686 5.44747 0.422543L0.230657 6.30271C0.0811611 6.47123 -0.00058495 6.6957 3.15121e-06 6.93449C-0.00058495 7.17461 0.0811611 7.39921 0.230657 7.56747L5.44747 13.4482C5.59638 13.6159 5.7948 13.7082 6.00664 13.7082C6.21824 13.7082 6.41666 13.6158 6.56557 13.4482L7.03911 12.9141C7.18813 12.7465 7.26988 12.5227 7.26988 12.284C7.26988 12.0455 7.18813 11.8335 7.03911 11.6658L3.96145 8.2084H13.6649C14.1009 8.2084 14.4673 7.78478 14.4673 7.29354V6.53818C14.4673 6.04694 14.0901 5.65647 13.6541 5.65647Z"
                fill={props.color || darkTheme.basic.white}
            />
        </svg>
      Volver
    </BackButtonContainer>
  );
};

const BackButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 60px;
  color: ${(props) => (props.color ? props.color : props.theme.basic.white)};
  font-size: 12px;
  font-weight: bold;

  svg {
    margin-right: 0.5rem;
    margin-bottom: 0;
  }
`;
