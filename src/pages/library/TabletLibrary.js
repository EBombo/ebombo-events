import React from "reactn";
import styled from "styled-components";

export const TabletLibrary = (props) => {
  return (
    <TabletLibraryContainer>
      <div className="subtitle">Librería</div>

      <div className="main-content">
        <div className="recents">Recientes</div>
      </div>
    </TabletLibraryContainer>
  );
};

const TabletLibraryContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  .subtitle {
    width: 100%;
    padding: 0.5rem;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.primary};
  }

  .main-content {
    padding: 1rem;
  }
`;
