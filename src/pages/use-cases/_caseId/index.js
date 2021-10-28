import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from 'next/router'
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { firestore } from "../../firebase";
import { mediaQuery, breakPoints } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { Pagination } from "antd";
import { HeaderLanding } from "../../home/HeaderLanding";
import { Footer } from "../../components/Footer";

export const UseCaseDetail = (props) => {

  const useCaseData = {
    "1": {
      name: "Ripley fest",
      imageUrl: "https://via.placeholder.com/350x150",
      title: "",
      text: `What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    }
  };

  
  const router = useRouter()
  const { caseId } = router.query

  return (
    <UseCaseDetailStyled>
      <HeaderLanding />
    
      <div class="main-container">
        <h1>{useCaseData[caseId].name}</h1>
        <div class="image-container">
          <Image
            width: "200px"
            height: "100px"
            src={useCaseData[caseId].imageUrl} />
        </div>
        <div>
          <p>{useCaseData[caseId].text}</p>
        </div>
      </div>
      
      <Footer />
    </UseCaseDetailStyled>
  )
};

const UseCaseDetailStyled = styled.section`
  
`;
