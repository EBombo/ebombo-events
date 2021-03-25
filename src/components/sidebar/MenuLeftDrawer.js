import React, {useEffect, useState} from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import {config} from "../../firebase";
import {MenuLeftOptions} from "../common/DataList";
import {Leagues} from "./Leagues";
import {Platforms} from "./Platforms";
import {currentUrlQuery} from "../../utils/queryUrl";
import {HowItWorks} from "./HowItWorks";

export default (props) => {
  const [tab, setTab] = useState("howItWorks");

  useEffect(() => {
    const newTab = currentUrlQuery("tab");
    newTab && setTab(newTab);
  }, [window.location.search]);

  const containerTab = () => {
    switch (tab) {
      case "leagues":
        return <Leagues />;
      case "platforms":
        return <Platforms />;
      case "howItWorks":
        return <HowItWorks {...props} />;
      default:
        return <Leagues />;
    }
  };

  return (
    <>
      <ContainerClose>
        <div onClick={() => props.close()} className="close">
          X
        </div>
      </ContainerClose>
      <ContainerMenu>
        {MenuLeftOptions.map((option) => (
          <ContentOption
            key={`key-menu-${option.name}`}
            selected={option.key === tab}
            onClick={() => setTab(option.key)}
            src={`${config.storageUrl}${get(option, "img", "-")}`}
            className={`${tab === option.key ? "option active" : "option"}`}
          >
            <div className="item-img" />
            <div className="item-name"> {get(option, "name", "name")} </div>
          </ContentOption>
        ))}
      </ContainerMenu>
      {containerTab()}
    </>
  );
};

const ContainerMenu = styled.section`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};

  .option {
    position: relative;
  }

  .active {
    color: ${(props) => props.theme.basic.white};

    &:after {
      position: absolute;
      content: "";
      border-bottom: 2px solid ${(props) => props.theme.basic.white};
      width: 100%;
      transform: translateX(-50%);
      bottom: -2px;
      left: 50%;
    }
  }
`;

const ContainerClose = styled.div`
  position: absolute;
  right: 10px;
  top: 5px;
  padding: 10px;
  z-index: 9999;

  .close {
    cursor: pointer;
    color: ${(props) => props.theme.basic.white};
    font-size: 20px;
  }
`;

const ContentOption = styled.div`
  width: auto;
  height: inherit;
  padding: 0 20px;
  cursor: pointer;

  .item-img {
    height: 40px;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-position: center;
  }

  .item-name {
    font-size: 9px;
    text-align: center;
    color: ${(props) => props.theme.basic.white};
  }
`;
