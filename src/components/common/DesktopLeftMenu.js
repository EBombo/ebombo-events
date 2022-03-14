import React, { useEffect } from "reactn";
import get from "lodash/get";
import { Image } from "./Image";
import styled from "styled-components";
import { useRouter } from "next/router";
import { config } from "../../firebase";

export const DesktopLeftMenu = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/library/games");
    router.prefetch("/library/folders");
  }, []);

  return (
    <LeftMenuContent>
      <div className="subtitle">Libreria</div>
      <div
        className={`item games ${get(router, "asPath", "") === "/library/games" ? "active" : ""}`}
        onClick={() => router.push("/library/games")}
      >
        <Image
          src={`${config.storageUrl}/resources/purple-puzzle.svg`}
          width="20px"
          height="25px"
          className="icon"
          margin="0 20px 0 0"
        />
        <div className="name">Mis juegos</div>
      </div>

      <div
        className={`item favorites ${get(router, "asPath", "").includes("/library/folders") ? "active" : ""}`}
        onClick={() => router.push("/library/folders")}
      >
        <Image
          src={`${config.storageUrl}/resources/purple-folder.svg`}
          width="20px"
          height="25px"
          className="icon"
          margin="0 20px 0 0"
        />
        <div className="name">Folders</div>
      </div>

      {/*
        <div
          className={`item favorites ${get(router, "asPath", "").includes("/library/folders") ? "active" : ""}`}
          onClick={() => router.push("/library/folders")}
        >
          <CameraOutlined />
          <div className="name">Crear evento</div>
        </div>
        */}
    </LeftMenuContent>
  );
};

const LeftMenuContent = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  color: ${(props) => props.theme.basic.grayLight};
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.25);

  .subtitle {
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 18px;
    padding: 0.5rem;
  }

  .item {
    font-family: Lato;
    font-size: 15px;
    line-height: 18px;
    padding: 0.5rem 1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    height: 42px;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;

    .anticon {
      margin-right: 1.5rem;
      font-size: 1rem;
      font-weight: bold;
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .item:hover {
    background: ${(props) => props.theme.basic.whiteDark};
  }

  .active {
    background: ${(props) => props.theme.basic.whiteDark};
  }

  .selected {
    background: #f2f2f2;
  }
`;
