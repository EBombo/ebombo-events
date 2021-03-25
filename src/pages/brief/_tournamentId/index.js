import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import {LoginModal} from "../../../components";
import {ForgotPassword} from "../../forgot-password";
import {Registration} from "../../registration";
import {ItemCardTournament} from "../../../components/tournaments/ItemCardTournament";
import {useParams} from "react-router-dom";
import {firestore} from "../../../firebase";
import {useHistory} from "react-router";
import {spinLoader} from "../../../utils";
import {CompleteInscription} from "./CompleteInscription";
import {mediaQuery} from "../../../styles/constants";
import isEmpty from "lodash/isEmpty";
import {BusinessInscription} from "./BusinessInscription";
import defaultTo from "lodash/defaultTo";
import {PasswordModal} from "../../../components/common/PasswordModal";
import get from "lodash/get";

export default (props) => {
  const { tournamentId } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [isVisiblePasswordModal, setIsVisiblePasswordModal] = useGlobal(
    "isVisiblePasswordModal"
  );
  const [, setCurrentTournament] = useGlobal("currentTournament");
  const [isLogin, setIsLogin] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [requiredUserAccount, setRequiredUserAccount] = useState(null);

  useEffect(() => {
    const fetchTournament = () =>
      firestore.doc(`tournaments/${tournamentId}`).onSnapshot((snapShot) => {
        if (!snapShot.exists) return history.push("/");
        setTournament(snapShot.data());
        setLoadingTournament(false);
      });

    const sub = fetchTournament();
    return () => sub();
  }, []);

  useEffect(() => {
    if (isEmpty(tournament)) return;

    const requiredUserAccount_ = props.findRequiredUserAccount(
      tournament.game.id,
      tournament.console.id
    );
    setRequiredUserAccount(requiredUserAccount_);
  }, [tournament]);

  const validatePassword = () => {
    if (
      !tournament ||
      isEmpty(tournament.password) ||
      get(tournament, "playerIds").includes(get(authUser, "id"))
    )
      return true;

    let localTournaments = defaultTo(
      JSON.parse(localStorage.getItem("tournaments")),
      []
    );

    const localTournament = localTournaments.some(
      (localTournament) =>
        localTournament.id === tournament.id &&
        localTournament.password === tournament.password
    );

    if (!localTournament) {
      setCurrentTournament(tournament);
      setIsVisiblePasswordModal(true);
      return false;
    }

    return true;
  };

  const loginContainer = () =>
    forgotPasswordVisible ? (
      <ForgotPassword
        {...props}
        forgotPasswordVisible={() =>
          setForgotPasswordVisible(!forgotPasswordVisible)
        }
      />
    ) : (
      <LoginModal
        {...props}
        forgotPasswordVisible={() =>
          setForgotPasswordVisible(!forgotPasswordVisible)
        }
      />
    );

  return (
    <TournamentContainerBriefCss>
      {isVisiblePasswordModal && <PasswordModal />}
      {authUser ? (
        <div className="container-with-auth">
          {loadingTournament ? (
            spinLoader()
          ) : tournament.linkType === "university" ||
            tournament.linkType === "business" ? (
            <BusinessInscription
              {...props}
              validatePassword={validatePassword}
              tournament={tournament}
              requiredUserAccount={requiredUserAccount}
            >
              <ItemCardTournament tournament={tournament} isMobile />
            </BusinessInscription>
          ) : (
            <CompleteInscription
              {...props}
              validatePassword={validatePassword}
              tournament={tournament}
              requiredUserAccount={requiredUserAccount}
            >
              <ItemCardTournament tournament={tournament} isMobile />
            </CompleteInscription>
          )}
        </div>
      ) : (
        <div className="container-no-auth">
          <div className="title">
            LINK
            <b> INSCRIPCIÓN</b>
          </div>
          <div className="menu">
            <div
              className={`item ${isLogin && "active"}`}
              onClick={() => setIsLogin(true)}
            >
              Iniciar sesión
            </div>
            <div
              className={`item ${!isLogin && "active"}`}
              onClick={() => setIsLogin(false)}
            >
              Registrarte
            </div>
          </div>
          <div className="access-container">
            {isLogin ? loginContainer() : <Registration />}
          </div>
        </div>
      )}
    </TournamentContainerBriefCss>
  );
};

const TournamentContainerBriefCss = styled.div`
  background: ${(props) => props.theme.basic.default};
  min-height: 100vh;
  padding: 15px;

  .container-no-auth {
    .title {
      text-align: center;
      font-size: 12px;
      color: ${(props) => props.theme.basic.white};
      font-weight: bold;
      margin: 15px;

      b {
        color: ${(props) => props.theme.basic.action};
      }
    }

    .menu {
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.blackLighten};
      display: flex;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;

      .item {
        padding: 10px 0;
        margin: 0 15px;
      }

      .active {
        color: ${(props) => props.theme.basic.primary};
        border-bottom: 1px solid ${(props) => props.theme.basic.primary};
      }
    }

    .access-container {
      margin: 0 auto;
      max-width: 400px;
    }
  }

  .container-with-auth {
    margin: 0 auto;
    max-width: 400px;

    ${mediaQuery.afterTablet} {
      margin: 0 auto;
      width: 100%;
    }
  }
`;
