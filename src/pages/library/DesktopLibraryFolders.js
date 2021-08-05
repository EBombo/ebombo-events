import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";

export const DesktopLibraryFolders = (props) => {

    const [authUser] = useGlobal("user")

  return <FoldersContainer>
      <div className="nav-container">
          <div className="path">
              {get(authUser, "company.name", "")}
          </div>
          
      </div>
  </FoldersContainer>;
};

const FoldersContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: ${(props) => props.theme.basic.whiteDark};
  height: 100%;
  overflow: auto;
`;
