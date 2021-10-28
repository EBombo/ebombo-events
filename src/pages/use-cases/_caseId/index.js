import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import { useWindowSize } from "../../hooks";
import { firestore } from "../../firebase";
import { mediaQuery, breakPoints } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { Pagination } from "antd";

export const UseCaseDetail = (props) => {

  return (
    <UseCaseDetailStyled>
    </UseCaseDetailStyled>
  )
};

const UseCaseDetailStyled = styled.section`
`;
