import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from 'next/router'
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { Icon } from "../../../components/common/Icons";
import { DesktopNav } from "../../../components/nav/DesktopNav";
import { TabletNav } from "../../../components/nav/TabletNav";
import { firestore } from "../../../firebase";
import { mediaQuery, breakPoints } from "../../../constants";
import { Desktop, Tablet } from "../../../constants";
import { Pagination } from "antd";
import { HeaderLanding } from "../../home/HeaderLanding";
import { Footer } from "../../../components/Footer";
import { useCasesData } from "../../use-cases";

export const UseCaseDetail = (props) => {

  const router = useRouter()
  const { caseId } = router.query

  return (
    <UseCaseDetailStyled>
      <Desktop>
        <DesktopNav {...props} />
      </Desktop>
      <Tablet>
        <TabletNav {...props} />
      </Tablet>
    
      <div className="main-container">
        <div className="title-container">
          <h1>{useCasesData[caseId].name}</h1>
        </div>
        <div className="image-container">
          <Image
            width="200px"
            height="100px"
            src={useCasesData[caseId].imageUrl} />
        </div>
        <div class="text-container">
          <p>{useCasesData[caseId].text}</p>
        </div>
      </div>
      
      <Footer />
    </UseCaseDetailStyled>
  )
};

const UseCaseDetailStyled = styled.section`
  margin-top: 50px;

  .title-container {
    background: ${props => props.theme.basic.secondary};
    padding: 66px 0;
    text-align: center;

    h1 {
      color: ${props => props.theme.basic.whiteLight};
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 26px;
      letter-spacing: 0.03em;
    }
  }

  .image-container {
    margin-top: -36px;
    margin-bottom: 36px;
  }
  .text-container{
    margin: 0 2rem 4rem 2rem;
  }
`;
