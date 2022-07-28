import React, { useGlobal, useMemo, useState } from "reactn";
import { ButtonAnt } from "../form";
import { Popover } from "antd";
import { Desktop, Tablet } from "../../constants";
import { darkTheme } from "../../theme";
import { ModalContainer } from "../common/ModalContainer";
import { useTranslation } from "../../hooks";
import { config } from "../../firebase";
import { Image } from "../common/Image";

export const PopTypeGame = (props) => {
  const { t } = useTranslation("userLayout");

  const [, setIsVisibleModalGame] = useGlobal("isVisibleModalGame");
  const [, setIsVisibleModalDynamics] = useGlobal("isVisibleModalDynamics");

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleModalContent, setIsVisibleModalContent] = useState(false);

  const options = useMemo(() => {
    return (
      <div className="grid gap-2">
        <div className="rounded-[5px] bg-whiteDark p-2 flex">
          <Image
            src={`${config.storageUrl}/resources/ebombo-icon-new-game.svg`}
            width="auto"
            height="30px"
            size="contain"
            margin="0 1.5rem 0 0"
          />

          <ButtonAnt
            variant="contained"
            color="secondary"
            width="140px"
            onClick={() => {
              setIsVisible(false);
              setIsVisibleModalContent(false);
              setIsVisibleModalGame(true);
            }}
          >
            Ebombo
          </ButtonAnt>
        </div>

        <div className="rounded-[5px] bg-whiteDark p-2 flex">
          <Image
            src={`${config.storageUrl}/resources/dynamic-icon-new-game.svg`}
            width="auto"
            height="30px"
            size="contain"
            margin="0 1.5rem 0 0"
          />

          <ButtonAnt
            variant="contained"
            color="secondary"
            width="140px"
            onClick={() => {
              setIsVisible(false);
              setIsVisibleModalContent(false);
              setIsVisibleModalDynamics(true);
            }}
          >
            {t("dynamics")}
          </ButtonAnt>
        </div>
      </div>
    );
  }, []);

  return (
    <>
      <Desktop>
        <Popover
          trigger="click"
          color="#FFFFFF"
          content={options}
          visible={isVisible}
          placement={props.placement ?? "bottom"}
          onVisibleChange={(event) => setIsVisible(event)}
        >
          {props.children}
        </Popover>
      </Desktop>

      <Tablet>
        <div onClick={() => setIsVisibleModalContent(true)}>{props.children}</div>

        {isVisibleModalContent ? (
          <ModalContainer
            top="30%"
            footer={null}
            closable={false}
            width="fit-content"
            padding={"0 0 0 0"}
            visible={isVisibleModalContent}
            background={darkTheme.basic.whiteLight}
            onCancel={() => setIsVisibleModalContent(false)}
          >
            <div className="p-2">{options}</div>
          </ModalContainer>
        ) : null}
      </Tablet>
    </>
  );
};
