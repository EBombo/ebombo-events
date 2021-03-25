import React from "reactn";
import get from "lodash/get";
import { Image } from "../../../../../components/common/Image";
import { Line, ModalContainer, PointsContainer } from "./styledModalPoints";
import { config } from "../../../../../firebase";
import { ButtonBombo } from "../../../../../components/common";
import { darkTheme } from "../../../../../styles/theme/darkTheme";

export const ModalAcceptResult = (props) => (
  <ModalContainer
    footer={null}
    visible={props.isVisibleModalResult}
    onCancel={() => props.setIsVisibleModalResult(false)}
  >
    <PointsContainer
      rows={
        get(props, "match.rule.typeOfGame", null) === "team"
          ? 1
          : props.match.challenger.length > props.match.challenged.length
          ? props.match.challenger.length
          : props.match.challenged.length
      }
    >
      <div className="title">Verifica el resultado</div>
      <br />
      <div className="profiles">
        {get(props, "match.rule.typeOfGame", null) === "team" ? (
          <div className="profile">
            <div className="header">
              {get(props, "match.rule.typeOfScore", "-")}
            </div>
            <div className="user-information">
              <div className="container-user">
                <div>
                  <Image
                    size="cover"
                    src={
                      props.match.challenger[0].profileImageUrlThumb
                        ? props.match.challenger[0].profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                    height="50px"
                    width="50px"
                    borderRadius="5px"
                    margin="0"
                  />
                  <div className="name">
                    {get(props, `match.challenger[0].nickname`, "-")}
                  </div>
                  <div className="type-account">
                    {get(props, "requiredUserAccount.description", "")}
                  </div>
                  <div className="account-nickname">
                    {get(props, `match.challenger[0].nickname`, "-")}
                  </div>
                </div>
              </div>
              <div className="container">
                <input
                  className="points"
                  type="number"
                  defaultValue={get(props, `match.challengerPoints[0]`, "-")}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {Array.from(Array(props.match.challenger.length).keys()).map(
              (value, index) => (
                <div className="profile" key={`key-result-${index}`}>
                  <div className="header">
                    {get(props, "match.rule.typeOfScore", "-")}
                  </div>
                  <div className="user-information">
                    <div className="container-user">
                      <div>
                        <Image
                          size="cover"
                          src={
                            props.match.challenger[index].profileImageUrlThumb
                              ? props.match.challenger[index]
                                  .profileImageUrlThumb
                              : `${config.storageUrl}/resources/perfil-icon.svg`
                          }
                          height="50px"
                          width="50px"
                          borderRadius="5px"
                          margin="0"
                        />
                        <div className="name">
                          {get(
                            props,
                            `match.challenger[${index}].nickname`,
                            "-"
                          )}
                        </div>
                        <div className="type-account">
                          {get(props, "requiredUserAccount.description", "")}
                        </div>
                        <div className="account-nickname">
                          {get(
                            props,
                            `match.challenger[${index}].userAccounts.${get(
                              props,
                              "requiredUserAccount.id",
                              null
                            )}`,
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <input
                        className="points"
                        type="number"
                        defaultValue={get(
                          props,
                          `match.challengerPoints[${index}]`,
                          "-"
                        )}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
            {props.match.challenged.length > props.match.challenger.length
              ? Array.apply(null, {
                  length:
                    props.match.challenged.length -
                    props.match.challenger.length,
                }).map((e) => <div />)
              : null}
          </>
        )}
        {get(props.match, "rule.typeOfGame", null) === "team" ? (
          <div className="line">
            <Line />
          </div>
        ) : (
          Array.from(Array(props.match.challenged.length).keys()).map(
            (value, index) => (
              <div className="line">
                <Line />
              </div>
            )
          )
        )}
        {get(props, "match.rule.typeOfGame", null) === "team" ? (
          <div className="profile">
            <div className="header-start">
              {get(props, "match.rule.typeOfScore", "-")}
            </div>
            <div className="user-information reverse">
              <div className="container-user">
                <div>
                  <Image
                    size="cover"
                    src={
                      props.match.challenged[0].profileImageUrlThumb
                        ? props.match.challenged[0].profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                    height="50px"
                    width="50px"
                    borderRadius="5px"
                    margin="0"
                  />
                  <div className="name">
                    {get(props, `match.challenged[0].nickname`, "-")}
                  </div>
                  <div className="type-account">
                    {get(props, "requiredUserAccount.description", "")}
                  </div>
                  <div className="account-nickname">
                    {get(
                      props,
                      `match.challenged[0].userAccounts.${get(
                        props,
                        "requiredUserAccount.id",
                        null
                      )}`,
                      "-"
                    )}
                  </div>
                </div>
              </div>
              <div className="container">
                <input
                  className="points"
                  type="number"
                  defaultValue={get(props, `match.challengedPoints[0]`, "-")}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {Array.from(Array(props.match.challenged.length).keys()).map(
              (value, index) => (
                <div className="profile">
                  <div className="header-start">
                    {get(props, "match.rule.typeOfScore", "-")}
                  </div>
                  <div className="user-information reverse">
                    <div className="container-user">
                      <div>
                        <Image
                          size="cover"
                          src={
                            props.match.challenged[index].profileImageUrlThumb
                              ? props.match.challenged[index]
                                  .profileImageUrlThumb
                              : `${config.storageUrl}/resources/perfil-icon.svg`
                          }
                          height="50px"
                          width="50px"
                          borderRadius="5px"
                          margin="0"
                        />
                        <div className="name">
                          {get(
                            props,
                            `match.challenged[${index}].nickname`,
                            "-"
                          )}
                        </div>
                        <div className="type-account">
                          {get(props, "requiredUserAccount.description", "")}
                        </div>
                        <div className="account-nickname">
                          {get(
                            props,
                            `match.challenged[${index}].userAccounts.${get(
                              props,
                              "requiredUserAccount.id",
                              null
                            )}`,
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <input
                        className="points"
                        type="number"
                        defaultValue={get(
                          props,
                          `match.challengedPoints[${index}]`,
                          "-"
                        )}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
            {props.match.challenger.length > props.match.challenged.length
              ? Array.apply(null, {
                  length:
                    props.match.challenger.length -
                    props.match.challenged.length,
                }).map((e) => <div />)
              : null}
          </>
        )}
      </div>
      <br />
      <div className="buttons-container">
        <ButtonBombo
          width="90%"
          margin="0 auto"
          disabled={
            props.stepSuccess(
              "challengerAcceptResult",
              "challengedAcceptResult"
            ) ||
            props.loadingSteps ||
            !props.isCaptain()
          }
          onClick={() => props.updateMatch(4, "accept result")}
          loading={props.loadingSteps}
        >
          {props.userMatchStatus()}
        </ButtonBombo>
        <ButtonBombo
          color={darkTheme.basic.blackDarken}
          background={darkTheme.basic.danger}
          bgColorEvents={`${darkTheme.basic.danger}CC`}
          colorEvents={darkTheme.basic.black}
          width="90%"
          margin="0 auto"
          onClick={() => {
            props.setIsVisibleModalResult(false);
            props.setClaim(props.match);
          }}
          disabled={props.loadingSteps}
        >
          Proceder a queja
        </ButtonBombo>
      </div>
      <div className="description">
        <span className="title-danger">¡Cuidado!</span>
        <span>
          Introducir un resultado falso tendrá automáticamente penalidades
          financieras.
        </span>
        <span>- 1er vez = $5</span>
        <span>- 2da vez = $25</span>
        <span>- 3era vez = $100 + bloqueo de cuenta</span>
      </div>
    </PointsContainer>
  </ModalContainer>
);
