import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Desktop, Tablet, mediaQuery } from "../../constants";
import { ButtonAnt, Input } from "../../components/form";
import { darkTheme } from "../../theme";

export const ModalNewFolder = (props) => {
  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalFolder}
      padding={"1rem"}
      top={"40%"}
      background={darkTheme.basic.whiteLight}
      onCancel={() =>
        props.setIsVisibleModalFolder(!props.isVisibleModalFolder)
      }
    >
      <NewFolderContainer>
        <Desktop>
          <div className="title">Crear folder</div>
          <div className="subtitle">Nombre</div>
          <form action="">
            <Input variant="clear" placeholder="Folder sin nombre" />
            <div className="buttons-container">
              <ButtonAnt
                variant="contained"
                color="gray"
                size="big"
                onClick={() => props.setIsVisibleModalFolder(false)}
              >
                Cerrar
              </ButtonAnt>
              <ButtonAnt variant="contained" color="primary" size="big">
                Crear
              </ButtonAnt>
            </div>
          </form>
        </Desktop>
        <Tablet>
          <div className="title">Nuevo Folder</div>
          <form action="">
            <Input variant="clear" placeholder="Folder sin nombre" />
            <div className="buttons-container">
              <ButtonAnt
                variant="contained"
                color="gray"
                size="big"
                onClick={() => props.setIsVisibleModalFolder(false)}
              >
                Cerrar
              </ButtonAnt>
              <ButtonAnt variant="contained" color="primary" size="big">
                Crear
              </ButtonAnt>
            </div>
          </form>
        </Tablet>
      </NewFolderContainer>
    </ModalContainer>
  );
};

const NewFolderContainer = styled.div`
  width: 100%;

  .title {
    width: 100%;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.basic.grayLight};
  }

  .buttons-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  ${mediaQuery.afterTablet} {
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    text-align: left;
  }
`;
