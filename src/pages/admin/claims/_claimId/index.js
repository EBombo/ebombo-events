import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {config, firestore} from "../../../../firebase";
import {Modal} from "antd";
import {spinLoader} from "../../../../utils";
import {useHistory, useParams} from "react-router";
import {mediaQuery} from "../../../../styles/constants";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {useGlobal} from "reactn";
import {useForm} from "react-hook-form";
import {Input} from "../../../../components/common/";
import {Image} from "../../../../components/common/Image";
import * as yup from "yup";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../../utils/useFetch/useFetch";
import {ButtonBombo} from "../../../../components";

export const AdminClaim = (props) => {
  const { claimId } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [globalSettings] = useGlobal("settings");

  const [matchClaim, setMatchClaim] = useState({});
  const [isLoadingMatchClaim, setIsLoadingMatchClaim] = useState(true);
  const [, setIsLoadingSteps] = useState(false);

  const schema = yup.object().shape({
    challengedPoints: yup.array().required(),
    challengerPoints: yup.array().required(),
  });

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    fetchMatchClaim();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMatchClaim = async () => {
    const matchClaimRef = await firestore
      .collection("matches")
      .doc(claimId)
      .get();

    if (!matchClaimRef.exists) history.goBack();

    setMatchClaim(matchClaimRef.data());
    setIsLoadingMatchClaim(false);
  };

  const resolveClaim = (valueForm) => {
    Modal.confirm({
      title: `Esta seguro de ${
        get(matchClaim, "isClosed", false) ? "cambiar" : "resolver"
      } el partido?`,
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: () => updateMatch("resolve claim", valueForm),
    });
  };

  const cancelMatch = () =>
    Modal.confirm({
      title: `Esta seguro de anular el partido?`,
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: () => updateMatch("cancel match"),
    });

  const updateMatch = async (stepType, valueForm) => {
    setIsLoadingSteps(true);

    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${claimId}`,
        "POST",
        bodyUpdateMatch(stepType, valueForm)
      );

      history.goBack();
    } catch (error) {
      handleError({ ...error, action: "updateMatch" });
    }

    setIsLoadingSteps(false);
  };

  const bodyUpdateMatch = (stepType, valueForm) => ({
    step: 4,
    stepType,
    userId: authUser.id,
    challengedPoints: toNumber(get(valueForm, "challengedPoints", [])),
    challengerPoints: toNumber(get(valueForm, "challengerPoints", [])),
  });

  const toNumber = (arrayPoints) => arrayPoints.map((point) => +point);

  const findUserAccount = (user) => {
    const requiredUserAccount_ = props.findRequiredUserAccount(
      matchClaim.game.id,
      matchClaim.console.id
    );

    return (
      `${requiredUserAccount_.description} : ` +
      get(user, `userAccounts${[requiredUserAccount_.id]}`, "")
    );
  };

  const award = (matchClaim_) => (
    <div>
      <label>Monto: </label>
      <span>{get(matchClaim_, "gameEntryCost", 0)}</span>
    </div>
  );

  return isLoadingMatchClaim ? (
    spinLoader()
  ) : (
    <Container>
      {get(matchClaim, "isClosed", false) ? (
        <h3>Cambiar resultado del partido</h3>
      ) : (
        <h3>Información de la queja del partido</h3>
      )}
      <div className="users">
        <div className="container">
          {get(
            matchClaim,
            "rule.typeOfGame",
            get(matchClaim, "rule.scoreFor", "")
          ) === "team" ? (
            <FieldSet title="Usuario retado">
              <div>
                <label>Nombre: </label>
                <span>
                  {get(
                    matchClaim,
                    `challengedTeamName`,
                    get(matchClaim, "challenged[0].nickname", "-")
                  )}{" "}
                </span>
              </div>
              <div>
                <label>Puntos: </label>
                <span>{get(matchClaim, `challengedPoints[0]`, "-")} </span>
              </div>
              <div>
                <label>Mensaje: </label>
                <span>{get(matchClaim, `challengedClaim.message`, "-")} </span>
              </div>
              <div>
                <span>
                  {findUserAccount(get(matchClaim, `challenged[0]`, {}))}
                </span>
              </div>
              {!matchClaim.tournamentId && award(matchClaim)}
              <div className="image">
                {isEmpty(matchClaim.challengedClaim) ? (
                  <label>No se realizó ninguna queja</label>
                ) : (
                  <img
                    src={get(matchClaim, "challengedClaim.imageUrl", "")}
                    alt="Queja"
                  />
                )}
              </div>
            </FieldSet>
          ) : (
            Array.from(
              Array(get(matchClaim, "rule.totalPlayers", 1)).keys()
            ).map((_, index) => (
              <FieldSet title="Usuario retado" key={`key-players-${index}`}>
                <div>
                  <label>Nombre: </label>
                  <span
                    onClick={() =>
                      window.open(
                        `http://${window.location.host}/admin/users/${get(
                          matchClaim,
                          `challenged[${index}].id`,
                          "-"
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    {get(matchClaim, `challenged[${index}].name`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Apellido: </label>
                  <span>
                    {get(matchClaim, `challenged[${index}].lastName`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Nickname: </label>
                  <span>
                    {get(matchClaim, `challenged[${index}].nickname`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Puntos: </label>
                  <span>
                    {get(matchClaim, `challengedPoints[${index}]`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Mensaje: </label>
                  <span>
                    {get(matchClaim, `challengedClaim.message`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <span>
                    {findUserAccount(
                      get(matchClaim, `challenged[${index}]`, {})
                    )}
                  </span>
                </div>
                {!matchClaim.tournamentId && award(matchClaim)}
                <div className="image">
                  {isEmpty(matchClaim.challengedClaim) ? (
                    <label>No se realizó ninguna queja</label>
                  ) : (
                    <img
                      src={get(matchClaim, "challengedClaim.imageUrl", "")}
                      alt="Queja"
                    />
                  )}
                </div>
              </FieldSet>
            ))
          )}
        </div>
        <div className="container">
          {get(
            matchClaim,
            "rule.typeOfGame",
            get(matchClaim, "rule.scoreFor", "")
          ) === "team" ? (
            <FieldSet title="Usuario retador">
              <div>
                <label>Nombre: </label>
                <span>
                  {get(
                    matchClaim,
                    `challengerTeamName`,
                    get(matchClaim, `challenger[0].nickname`, "-")
                  )}{" "}
                </span>
              </div>
              <div>
                <label>Puntos: </label>
                <span>{get(matchClaim, `challengerPoints[0]`, "-")} </span>
              </div>
              <div>
                <label>Mensaje: </label>
                <span>{get(matchClaim, `challengerClaim.message`, "-")} </span>
              </div>
              <div>
                <span>
                  {findUserAccount(get(matchClaim, `challenger[0]`, {}))}
                </span>
              </div>
              {!matchClaim.tournamentId && award(matchClaim)}
              <div className="image">
                {isEmpty(matchClaim.challengerClaim) ? (
                  <label>No se realizó ninguna queja</label>
                ) : (
                  <img
                    src={get(matchClaim, "challengerClaim.imageUrl", "")}
                    alt="Queja"
                  />
                )}
              </div>
            </FieldSet>
          ) : (
            Array.from(
              Array(get(matchClaim, "rule.totalPlayers", 1)).keys()
            ).map((_, index) => (
              <FieldSet title="Usuario retador">
                <div>
                  <label>Nombre: </label>
                  <span
                    onClick={() =>
                      window.open(
                        `http://${window.location.host}/admin/users/${get(
                          matchClaim,
                          `challenger[${index}].id`,
                          "-"
                        )}`,
                        "_blank"
                      )
                    }
                  >
                    {get(matchClaim, `challenger[${index}].name`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Apellido: </label>
                  <span>
                    {get(matchClaim, `challenger[${index}].lastName`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Nickname: </label>
                  <span>
                    {get(matchClaim, `challenger[${index}].nickname`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Puntos: </label>
                  <span>
                    {get(matchClaim, `challengerPoints[${index}]`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <label>Mensaje: </label>
                  <span>
                    {get(matchClaim, `challengerClaim.message`, "-")}{" "}
                  </span>
                </div>
                <div>
                  <span>
                    {findUserAccount(
                      get(matchClaim, `challenger[${index}]`, {})
                    )}
                  </span>
                </div>
                {!matchClaim.tournamentId && award(matchClaim)}
                <div className="image">
                  {isEmpty(matchClaim.challengerClaim) ? (
                    <label>No se realizó ninguna queja</label>
                  ) : (
                    <img
                      src={get(matchClaim, "challengerClaim.imageUrl", "")}
                      alt="Queja"
                    />
                  )}
                </div>
              </FieldSet>
            ))
          )}
        </div>
        <FieldSet title="Opciones">
          <div className="options">
            <form onSubmit={handleSubmit(resolveClaim)} noValidate>
              <div className="score">
                <div className="container-result">
                  {get(
                    matchClaim,
                    "rule.typeOfGame",
                    get(matchClaim, "rule.scoreFor", "")
                  ) === "team" ? (
                    <div className="profile">
                      <Image
                        src={get(
                          matchClaim,
                          `challengedTeamImageUrlThumb`,
                          `${config.storageUrl}/resources/teams-default.svg`
                        )}
                        width={"50px"}
                        height={"50px"}
                        size={"cover"}
                        borderRadius={"5px"}
                      />
                      <div className="nickname">
                        {get(
                          matchClaim,
                          `challengedTeamName`,
                          get(matchClaim, `challenged[0].nickname`, "-")
                        )}{" "}
                      </div>
                      <Input
                        type="number"
                        ref={register}
                        defaultValue={get(
                          matchClaim,
                          `challengedPoints[0]`,
                          "-"
                        )}
                        name={`challengedPoints[0]`}
                        placeholder="Ingresar resultado"
                      />
                    </div>
                  ) : (
                    Array.from(
                      Array(get(matchClaim, "rule.totalPlayers", 1)).keys()
                    ).map((_, index) => (
                      <div className="profile">
                        <Image
                          src={get(
                            matchClaim,
                            `challenged[${index}].profileImageUrlThumb`,
                            `${config.storageUrl}/resources/perfil-icon.svg`
                          )}
                          width={"50px"}
                          height={"50px"}
                          size={"cover"}
                          borderRadius={"5px"}
                        />
                        <div className="nickname">
                          {get(
                            matchClaim,
                            `challenged[${index}].nickname`,
                            "-"
                          )}{" "}
                        </div>
                        <Input
                          type="number"
                          ref={register}
                          defaultValue={get(
                            matchClaim,
                            `challengedPoints[${index}]`,
                            "-"
                          )}
                          name={`challengedPoints[${index}]`}
                          placeholder="Ingresar resultado"
                        />
                      </div>
                    ))
                  )}
                </div>
                <div className="container-result">
                  {get(
                    matchClaim,
                    "rule.typeOfGame",
                    get(matchClaim, "rule.scoreFor", "")
                  ) === "team" ? (
                    <div className="profile">
                      <Image
                        src={get(
                          matchClaim,
                          `challengerTeamImageUrlThumb`,
                          `${config.storageUrl}/resources/teams-default.svg`
                        )}
                        width={"50px"}
                        height={"50px"}
                        size={"cover"}
                        borderRadius={"5px"}
                      />
                      <div className="nickname">
                        {get(
                          matchClaim,
                          `challengerTeamName`,
                          get(matchClaim, `challenger[0].nickname`, "-")
                        )}{" "}
                      </div>
                      <Input
                        type="number"
                        ref={register}
                        defaultValue={get(
                          matchClaim,
                          `challengerPoints[0]`,
                          "-"
                        )}
                        name={`challengerPoints[0]`}
                        placeholder="Ingresar resultado"
                      />
                    </div>
                  ) : (
                    Array.from(
                      Array(get(matchClaim, "rule.totalPlayers", 1)).keys()
                    ).map((_, index) => (
                      <div className="profile">
                        <Image
                          src={get(
                            matchClaim,
                            `challenger[${index}].profileImageUrlThumb`,
                            `${config.storageUrl}/resources/perfil-icon.svg`
                          )}
                          width={"50px"}
                          height={"50px"}
                          size={"cover"}
                          borderRadius={"5px"}
                        />
                        <div className="nickname">
                          {get(
                            matchClaim,
                            `challenger[${index}].nickname`,
                            "-"
                          )}{" "}
                        </div>
                        <Input
                          type="number"
                          ref={register}
                          defaultValue={get(
                            matchClaim,
                            `challengerPoints[${index}]`,
                            "-"
                          )}
                          name={`challengerPoints[${index}]`}
                          placeholder="Ingresar resultado"
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="buttons">
                <ButtonBombo margin=".5rem" type="primary" htmlType="submit">
                  {get(matchClaim, "isClosed", false)
                    ? "Cambiar"
                    : "Resolver partido"}
                </ButtonBombo>
                {!get(matchClaim, "isClosed", false) &&
                  !matchClaim.tournamentId && (
                    <ButtonBombo margin=".5rem" onClick={() => cancelMatch()}>
                      Cancelar partido
                    </ButtonBombo>
                  )}
              </div>
            </form>
          </div>
        </FieldSet>
      </div>
    </Container>
  );
};
const Container = styled.section`
  .users {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;

    ${mediaQuery.afterTablet} {
      grid-template-columns: 3fr 3fr 2fr;
    }

    .image {
      width: 100%;
      text-align: center;
      margin: 0.75rem 0;

      img {
        width: 100%;

        ${mediaQuery.afterTablet} {
          width: 95%;
        }
      }
    }

    .options {
      text-align: center;

      .score {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        margin: 1rem 0;
        .container-result {
          .profile {
            img {
              width: 35px;
              background: grey;
            }

            .nickname {
              font-size: 1rem;
              margin-bottom: 0.5rem;
            }

            input {
              width: 100%;
              padding: 10px 15px;
              display: inline-block;
              border: 1px solid #ccc;
              border-radius: 4px;
              box-sizing: border-box;
            }
          }
        }
      }

      .buttons {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        button {
          margin: 0.5rem;
        }
      }
    }
  }
`;

const FieldSet = (props) => (
  <FieldsetContainer>
    <legend>
      <span>{props.title}</span>
    </legend>
    <div className="content">{props.children}</div>
  </FieldsetContainer>
);

const FieldsetContainer = styled.fieldset`
  border: 1px solid #292929;
  width: auto;
  border-radius: 7px;
  height: 100%;

  legend {
    width: auto;
    margin: 0;
    color: #000000;

    span {
      font-family: "Encode Sans", sans-serif;
      font-size: 0.8rem;
      padding: 0 10px 0 10px;
      font-weight: 600;
    }
  }

  .content {
    label {
      padding-right: 10px;
    }

    span {
      font-family: "Encode Sans", sans-serif;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
  }
`;
