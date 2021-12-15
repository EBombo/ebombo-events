import React, { useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";
import { ButtonAnt, Input } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";

export const ModalLicenses = (props) => {
  const [step, setStep] = useState(1);
  const [licenses, setLicenses] = useState(props.company?.licenses || 0);

  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      footer={false}
      closable={false}
      visible={props.isVisibleModalLicenses}
      padding="0"
    >
      <Content>
        {step < 3 && (
          <div className="top-container">
            <div className="title">Editar licencias</div>
            <div className="close" onClick={() => props.setIsVisibleModalLicenses(false)}>
              <Image src={`${config.storageUrl}/resources/close.svg`} width="12px" height="12px" size="contain" />
            </div>
          </div>
        )}
        {step === 1 && (
          <>
            <div className="description">
              Ajuste el número en el campo a continuación para agregar o quitar licencias para su organización
              <br />
              <br />
              Actualmente tiene 1 licencias. Todas las licencias están en uso.
            </div>

            <label htmlFor="amount">Licencias:</label>
            <div className="number-container">
              <ButtonAnt
                color="default"
                margin="0 10px 0 0"
                onClick={() => {
                  if (licenses > 0) setLicenses(licenses - 1);
                }}
              >
                -
              </ButtonAnt>

              <div className="input-container">
                <Input id="amount" type="number" value={licenses} onChange={(e) => console.log(e.target.value)} />
              </div>

              <ButtonAnt onClick={() => setLicenses(licenses + 1)} margin="0 0 0 10px">
                +
              </ButtonAnt>
            </div>
            <div className="footer">
              <ButtonAnt color="default" onClick={() => props.setIsVisibleModalLicenses(false)}>
                Cerrar
              </ButtonAnt>
              <ButtonAnt color="secondary" onClick={() => setStep(2)}>
                Actualzar licencia
              </ButtonAnt>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="description">
              A continuación, se muestra un resumen de los cambios que se aplicarán a su suscripción:
              <br />
              <br />
              Su número de licencias se cambiará de 1 a 2 El precio de su nueva suscripción será de $ 1,416.00
              (facturado anualmente)
              <br />
              <br />
              Este precio es una estimación basada en el precio actual de su plan. Para ver su precio final, revise "ver
              factura" en la pestaña de facturación.
            </div>
            <div className="footer">
              <ButtonAnt color="default" onClick={() => props.setIsVisibleModalLicenses(false)}>
                Cerrar
              </ButtonAnt>
              <ButtonAnt color="secondary" onClick={() => setStep(3)}>
                Confirmar
              </ButtonAnt>
            </div>
          </>
        )}
        {step === 3 && (
          <div className="confirmation-container">
            <Image
              src={`${config.storageUrl}/resources/rocket.svg`}
              width="53px"
              height="53px"
              size="contain"
              margin="1rem auto"
            />
            <div className="subtitle">Licencia actualizada</div>
            <div className="text">Tu licencia a sido actualizada con éxito</div>

            <div className="close" onClick={() => props.setIsVisibleModalLicenses(false)}>
              <Image src={`${config.storageUrl}/resources/close.svg`} width="12px" height="12px" size="contain" />
            </div>
          </div>
        )}
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .top-container {
    height: 64px;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: Lato;

    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .close {
      cursor: pointer;
    }
  }

  .description {
    padding: 1rem;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .number-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 5px;
    padding: 0 1rem;

    .input-container {
      width: 52px;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackDarken};
      display: flex;
      align-items: center;

      input {
        text-align: center;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }

  label {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.blackDarken};
    padding: 0 1rem;
  }

  .footer {
    margin-top: 1rem;
    box-shadow: 1px 0px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 69px;
  }

  .confirmation-container {
    padding: 1rem;
    position: relative;

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 24px;
      color: ${(props) => props.theme.basic.blackDarken};
      text-align: center;
      margin: 1rem auto;
    }

    .text {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.blackDarken};
      text-align: center;
      margin: 1rem auto;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
`;
