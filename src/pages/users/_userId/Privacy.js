import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Switch } from "antd";
import { firestore } from "../../../firebase";
import { mediaQuery } from "../../../constants";
import defaultTo from "lodash/defaultTo";

export const Privacy = (props) => {
  const [authUser] = useGlobal("user");

  const toggleSwitch = async (key) => {
    const user = props.user;

    let terms = defaultTo(user.terms, false);
    let marketing = defaultTo(user.marketing, false);

    if (key === "terms") terms = !terms;
    if (key === "marketing") marketing = !marketing;

    await firestore.doc(`/users/${user.id}`).update({
      terms,
      marketing,
    });
  };

  return (
    <PrivacyContainer>
      <div className="privacy-content">
        <div className="title">Privacidad y markeing</div>
        <div className="option">
          <div className="text">
            ¡He leído y estoy de acuerdo con el ebombo! términos y condiciones y política de privacidad y estoy de
            acuerdo con ebombo! recopilar y procesar mis datos personales como se describe en la política de privacidad.
          </div>
          <div className="switch">
            <Switch
              checked={props.user.terms ?? false}
              onChange={() => toggleSwitch("terms")}
              disabled
            />
          </div>
        </div>
        <div className="option">
          <div className="text">
            ¡Quiero recibir mensajes de marketing con recomendaciones y otra información relevante de ebombo!.
          </div>
          <div className="switch">
            <Switch
              checked={props.user.marketing ?? false}
              onChange={() => toggleSwitch("marketing")}
              disabled={defaultTo(authUser.id, "") !== props.user.id}
            />
          </div>
        </div>
      </div>
    </PrivacyContainer>
  );
};

const PrivacyContainer = styled.div`
  width: 100%;
  padding: 1rem;

  .privacy-content {
    background: ${(props) => props.theme.basic.whiteLigth};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 2px;
    padding: 10px;
    max-width: 380px;

    .title {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
      height: 25px;
      color: ${(props) => props.theme.basic.blackLighten};
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
    }

    .option {
      display: grid;
      grid-template-columns: auto 50px;
      grid-gap: 1rem;
      align-items: center;
      margin: 1rem 0;

      .text {
        text-align: justify;
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    border-radius: 8px;
    background: ${(props) => props.theme.basic.whiteLight};
    padding: 1rem 1rem 5rem 1rem;
  }
`;
