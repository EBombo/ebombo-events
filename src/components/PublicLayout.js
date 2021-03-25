import React, {Component} from "react";
import {Layout} from "antd";
import {withRouter} from "react-router-dom";
import {config} from "../firebase/index";
import styled from "styled-components";
import {mediaQuery} from "../styles/constants";

const publicLayout = class PublicLayout extends Component {
  childWithProperties = (props) =>
    React.Children.map(this.props.children, (child) =>
      React.cloneElement(child, { ...props })
    );

  render() {
    return (
      <PublicLayout>
        <Header>
          <img
            src={`${config.storageUrl}/resources/logo-white.svg`}
            alt="Logo Bombo"
            onClick={() => this.props.history.push("/")}
          />
        </Header>
        <Layout.Content>{this.childWithProperties(this.props)}</Layout.Content>
      </PublicLayout>
    );
  }
};

export default withRouter(publicLayout);

const Header = styled.div`
  background: transparent;
  display: flex;
  justify-content: center;
  padding: 1rem 0 0 1rem;
  ${mediaQuery.afterTablet} {
    display: flex;
    justify-content: left;
    max-height: 70px;
    max-width: 90%;
    width: 90%;
    margin: auto;
  }
  ${mediaQuery.afterTablet} {
    padding-top: 1rem;
    max-height: 80px;
  }
  img {
    width: 160px;
    max-width: 58px;
    ${mediaQuery.afterMobile} {
      width: 68px;
      max-width: 60px;
    }
  }
`;
