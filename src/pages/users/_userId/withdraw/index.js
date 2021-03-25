import React, { useEffect, useGlobal, useState } from "reactn";
import get from "lodash/get";
import { firestore } from "../../../../firebase";
import { Desktop, spinLoader } from "../../../../utils";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { BackButton, ButtonBombo } from "../../../../components";
import { darkTheme } from "../../../../styles/theme";
import { WithdrawMethods } from "./WithdrawMethods";
import { withdrawMethods } from "../../../../components/common/DataList";
import { BankTransfer } from "./BankTransfer";
import { Rapyd } from "./Rapyd";
import { Paypal } from "./Paypal";
import { mediaQuery } from "../../../../styles/constants";

export default (props) => {
  const history = useHistory();
  const { userId } = useParams();
  const [authUser] = useGlobal("user");

  const [transactionExist, setTransactionExist] = useState(null);
  const [loadingTransaction, setLoadingTransaction] = useState(true);
  const [methodWithdraw, setMethodWithdraw] = useState(withdrawMethods[0]);

  useEffect(() => {
    if (userId !== authUser.id) return history.push("/");
    const validateTransactionExist = async () => {
      const transactionQuerySnapShot = await firestore
        .collection("transactions")
        .where("user.id", "==", authUser.id)
        .where("action", "==", "charge")
        .where("amount", ">", 1)
        .get();

      setTransactionExist(!transactionQuerySnapShot.empty);
      setLoadingTransaction(false);
    };

    validateTransactionExist();
  }, []);

  const renderWithDraw = (money) => {
    if (!money) return <div>No cuentas con saldo disponible para retirar.</div>;

    if (!authUser.phoneNumber)
      return (
        <div className="text-balance text-balance-center">
          <div>
            <div>Para retirar debes completar tus datos</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ButtonBombo
                primary="true"
                bgColorEvents={darkTheme.basic.primary}
                colorEvents={darkTheme.basic.blackLighten}
                color={darkTheme.basic.blackLighten}
                fontWeight="500"
                fontSize="12px"
                margin="0"
                width="8rem"
                height="2.3rem"
                onClick={() => history.push(`/users/${authUser.id}/edit`)}
              >
                Actualizar
              </ButtonBombo>
            </div>
          </div>
        </div>
      );

    if (!transactionExist)
      return (
        <div>
          <div>Para retirar debes haber recargado al menos una vez</div>
          <ButtonBombo
            margin="0"
            onClick={() =>
              history.push({
                hash: "right-menu",
                search: `?tab=top-up-money`,
              })
            }
          >
            Depositar
          </ButtonBombo>
        </div>
      );

    if (!authUser.documentImageUrl)
      return (
        <div>
          <div>Para retirar debes validar tu cuenta en Ajustes</div>
          <div>(solo tienes que hacerlo una vez)</div>
          <div>
            <ButtonBombo
              primary="true"
              bgColorEvents={darkTheme.basic.primary}
              colorEvents={darkTheme.basic.blackLighten}
              color={darkTheme.basic.blackLighten}
              fontWeight="500"
              fontSize="12px"
              margin="0"
              width="8rem"
              height="2.3rem"
              onClick={() => history.push(`/users/${authUser.id}/edit`)}
            >
              Validar cuenta
            </ButtonBombo>
          </div>
        </div>
      );

    if (authUser.documentImageUrl && !authUser.verifiedDocument)
      return (
        <div className="text-balance">
          <div>
            <div>
              Tu cuenta esta siendo validada por un administrador de Bombo. Esta
              operación puede durar 24 horas.
            </div>
          </div>
        </div>
      );

    if (methodWithdraw.value === "paypal") return <Paypal />;
    if (methodWithdraw.value === "bankTransfer") return <BankTransfer />;
    // if (methodWithdraw.value === "rapyd") return <Rapyd />;
  };

  return loadingTransaction ? (
    spinLoader()
  ) : (
    <HeadWithDraw>
      <div className="left-content">
        <BackButton color={darkTheme.basic.blackLighten} />
        <h1>Retirar:</h1>

        <div className="methods-container">
          <WithdrawMethods
            onClick={(method) => setMethodWithdraw(method)}
            selectedWithdrawMethod={methodWithdraw}
          />
          {renderWithDraw(+get(authUser, "money", 0))}
        </div>

        <div className="note">
          *Los depósitos se demoran hasta 5 días hábiles
          <br />
          <span>
            *En caso un usuario haga un retiro y la cuenta de destino cobre
            comisión, el usuario tendrá que asumir dicha comisión establecida
            por el banco.
          </span>
        </div>
        <div className="important">
          <h3>IMPORTANTE:</h3>
          <p>
            Para hacer efectivo el retiro, ebombo se toma 24 horas para evaluar
            su partida y de no encontrar ninguna sospecha, se le comunicará la
            aprobación del mismo.
          </p>
          <p>
            Recuerde que los requisitos para retirar el dinero de su cuenta de
            ebombo a su cuenta de banco o paypal son:
          </p>
          <p>-Solo debe haber realizado una recarga previa.</p>
          <p>- Validar su cuenta mediante una foto del DNI.</p>
          <p>- Monto mínimo de retiro 10 dólares.</p>
          <p>
            -Un moderador revisará que las partidas de su perfil estén en orden.
          </p>
          <p>
            Una vez aprobado el retiro, el dinero llegará a su cuenta luego de 5
            días hábiles.
          </p>
        </div>
      </div>
      <Desktop>
        <div className="right-content" />
      </Desktop>
    </HeadWithDraw>
  );
};

const HeadWithDraw = styled.div`
  min-height: 100vh;
  height: auto;
  background: ${(props) => props.theme.basic.gray};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .left-content {
    color: ${(props) => props.theme.basic.blackLighten};
    padding: 1rem;

    .methods-container {
      max-width: 550px;
    }

    h1 {
      font-weight: bold;
      font-size: 14px;
      color: ${(props) => props.theme.basic.blackLighten};
      margin: 1rem 0 !important;
    }

    bottom: 0;

    .note {
      font-size: 11px;
      line-height: 14px;
      margin: 1rem 0;
      span {
        color: ${(props) => props.theme.basic.danger};
      }
    }

    .important {
      padding: 1rem 0;
      border-top: 3px solid ${(props) => props.theme.basic.whiteDarken};
      h3 {
        font-size: 11px;
        line-height: 14px;
        font-weight: bold;
        color: ${(props) => props.theme.basic.blackLighten};
      }
      p {
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.theme.basic.blackLighten};
      }
    }
  }

  .right-content {
    background: ${(props) => props.theme.basic.blackDarken};
  }
`;
