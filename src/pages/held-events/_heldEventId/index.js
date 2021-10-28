import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from 'next/router'
import { Image } from "../../../components/common/Image";
import { DesktopNav } from "../../../components/nav/DesktopNav";
import { TabletNav } from "../../../components/nav/TabletNav";
import { Desktop, Tablet } from "../../../constants";
import { Footer } from "../../../components/Footer";
import { useCasesData } from "..";

export const UseCaseDetail = (props) => {

  const router = useRouter()
  const { heldEventId } = router.query

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
          <h1>{useCasesData[heldEventId].title}</h1>
        </div>
        <div className="image-container">
          <Image
            width="200px"
            height="100px"
            src={useCasesData[heldEventId].imageUrl} />
        </div>
        <div class="text-container">
          <p>{useCasesData[heldEventId].text}</p>
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
