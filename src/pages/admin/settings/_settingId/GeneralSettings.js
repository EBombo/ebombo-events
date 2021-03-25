import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, message } from "antd";
import { ButtonBombo, Input } from "../../../../components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { config, firestore } from "../../../../firebase";
import { spinLoader } from "../../../../utils";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";

export const GeneralSettings = () => {
  const schema = yup.object().shape({
    defaultExpirationOfMoney: yup.number().required(),
    entryCosts: yup.array(),
    playMoneyEntryCosts: yup.array(),
    registerMoney: yup.number().required(),
    smsMessage: yup.string().required(),
    minimumChargeAmount: yup.number().required(),
    videoUrl: yup.string().url().required(),
    minWithdrawAmount: yup.number().required(),
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [welcomeSettings, setWelcomeSettings] = useState({});

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const settingsRef = await firestore.doc("settings/default").get();
    setWelcomeSettings(settingsRef.data());
    setIsLoadingSettings(false);
  };

  const mapSettings = (data) => ({
    commission: +data.commission,
    registerMoney: +data.registerMoney,
    defaultExpirationOfMoney: +data.defaultExpirationOfMoney,
    smsMessage: data.smsMessage,
    playMoneyEntryCosts: welcomeSettings.playMoneyEntryCosts.map(
      (entryCost) => +entryCost
    ),
    entryCosts: welcomeSettings.entryCosts.map((entryCost) => +entryCost),
    minimumChargeAmount: +data.minimumChargeAmount,
    minWithdrawAmount: +data.minWithdrawAmount,
    videoUrl: data.videoUrl,
  });

  const saveSettings = async (data) => {
    try {
      setIsDisabled(true);

      await ownFetch(
        `${config.serverUrl}/admin/welcome-settings`,
        "POST",
        mapSettings(data)
      );

      message.success("Registro actualizado.");
    } catch (error) {
      handleError({ ...error, action: "saveSettings" });
    }
    setIsDisabled(false);
  };

  return isLoadingSettings ? (
    spinLoader()
  ) : (
    <SettingsContainer>
      <form onSubmit={handleSubmit(saveSettings)} autoComplete="off" noValidate>
        <Input
          variant="secondary"
          label="Comisión %"
          type="number"
          name={"commission"}
          error={errors.commission}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "commission", 0)}
          placeholder="Comision para Ebombo"
        />
        <Input
          variant="secondary"
          label="Video"
          type="url"
          name="videoUrl"
          error={errors.videoUrl}
          ref={register}
          defaultValue={get(welcomeSettings, "videoUrl", "")}
          placeholder="Link del video  (youtbe => compartir => 'embed' => copiar url del src='') formato: https://www.youtube.com/embed/RIrlWaVj4Rc"
        />
        <Input
          variant="secondary"
          label="Monto minimo para retirar"
          type="number"
          name="minWithdrawAmount"
          error={errors.minWithdrawAmount}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "minWithdrawAmount", 0)}
          placeholder="Monto minimo de retiro"
        />
        <Input
          variant="secondary"
          label="Dinero de bienvenida"
          type="number"
          name="registerMoney"
          error={errors.registerMoney}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "registerMoney", 0)}
          placeholder="Dinero de bienvenida"
        />
        <Input
          variant="secondary"
          label="Vigencia del dinero regalado en días"
          type="number"
          name="defaultExpirationOfMoney"
          error={errors.defaultExpirationOfMoney}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "defaultExpirationOfMoney", 0)}
          placeholder="Vigencia del dinero regalado en días"
        />
        <Input
          variant="secondary"
          label="Monto minimo de recarga"
          type="number"
          name="minimumChargeAmount"
          error={errors.minimumChargeAmount}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "minimumChargeAmount", 0)}
          placeholder="Monto minimo de recarga"
        />
        <Input
          variant="secondary"
          type="text"
          label="Mensaje de confirmación SMS"
          name="smsMessage"
          error={errors.smsMessage}
          ref={register}
          min={0}
          defaultValue={get(welcomeSettings, "smsMessage", "")}
          placeholder="Mensaje de confirmación SMS"
        />
        <EntriesCostsContainer>
          {
            <FieldsetContainer
              className="container-entry-costs"
              key={`values-${defaultTo(welcomeSettings.entryCosts, [0])}`}
            >
              <legend>COSTOS DE ENTRADA DINERO REAL</legend>
              {defaultTo(welcomeSettings.entryCosts, [0]).map(
                (entryCost, index) => (
                  <div key={`entry-costs-${index}`}>
                    <div style={{ display: "flex" }}>
                      <Input
                        variant="secondary"
                        type="number"
                        min={0}
                        onBlur={(event) => {
                          let newEntryCosts = welcomeSettings.entryCosts;
                          newEntryCosts[index] = +event.target.value;

                          console.log(event.target.value, newEntryCosts);

                          setWelcomeSettings({
                            ...welcomeSettings,
                            entryCosts: [...newEntryCosts],
                          });
                        }}
                        defaultValue={get(
                          welcomeSettings,
                          `entryCosts[${index}]`,
                          0
                        )}
                        placeholder="Costo de entrada"
                      />
                      <ButtonBombo
                        margin="0"
                        type="secondary"
                        height="32px"
                        onClick={() => {
                          let newEntryCosts = welcomeSettings.entryCosts;
                          console.log("1", newEntryCosts);

                          newEntryCosts = newEntryCosts.filter(
                            (newEntryCost) => newEntryCost !== entryCost
                          );

                          console.log("2", newEntryCosts);

                          setWelcomeSettings({
                            ...welcomeSettings,
                            entryCosts: [...newEntryCosts],
                          });
                        }}
                      >
                        Eliminar
                      </ButtonBombo>
                    </div>
                  </div>
                )
              )}
              <ButtonBombo
                margin="0"
                onClick={() =>
                  setWelcomeSettings({
                    ...welcomeSettings,
                    entryCosts: [...welcomeSettings.entryCosts, 0],
                  })
                }
              >
                AGREGAR COSTO DE ENTRADA
              </ButtonBombo>
            </FieldsetContainer>
          }
          {
            <FieldsetContainer
              className="container-play-money-entry-costs"
              key={`values-${defaultTo(welcomeSettings.playMoneyEntryCosts, [
                0,
              ])}`}
            >
              <legend>COSTOS DE ENTRADA DINERO JUGABLE</legend>
              {defaultTo(welcomeSettings.playMoneyEntryCosts, [0]).map(
                (playMoneyEntryCost, index) => (
                  <div key={`play-money-entry-costs-${index}`}>
                    <div style={{ display: "flex" }}>
                      <Input
                        variant="secondary"
                        type="number"
                        min={0}
                        onBlur={(event) => {
                          let newPlayMoneyEntryCosts =
                            welcomeSettings.playMoneyEntryCosts;
                          newPlayMoneyEntryCosts[index] = +event.target.value;

                          console.log(
                            event.target.value,
                            newPlayMoneyEntryCosts
                          );

                          setWelcomeSettings({
                            ...welcomeSettings,
                            playMoneyEntryCosts: [...newPlayMoneyEntryCosts],
                          });
                        }}
                        defaultValue={get(
                          welcomeSettings,
                          `playMoneyEntryCosts[${index}]`,
                          0
                        )}
                        placeholder="Costo de entrada"
                      />
                      <ButtonBombo
                        margin="0"
                        type="secondary"
                        height="32px"
                        onClick={() => {
                          let newPlayMoneyEntryCosts =
                            welcomeSettings.playMoneyEntryCosts;
                          console.log("1", newPlayMoneyEntryCosts);

                          newPlayMoneyEntryCosts = newPlayMoneyEntryCosts.filter(
                            (newEntryCost) =>
                              newEntryCost !== playMoneyEntryCost
                          );

                          console.log("2", newPlayMoneyEntryCosts);

                          setWelcomeSettings({
                            ...welcomeSettings,
                            playMoneyEntryCosts: [...newPlayMoneyEntryCosts],
                          });
                        }}
                      >
                        Eliminar
                      </ButtonBombo>
                    </div>
                  </div>
                )
              )}
              <ButtonBombo
                margin="0"
                onClick={() =>
                  setWelcomeSettings({
                    ...welcomeSettings,
                    playMoneyEntryCosts: [
                      ...get(welcomeSettings, "playMoneyEntryCosts", []),
                      0,
                    ],
                  })
                }
              >
                AGREGAR COSTO DE ENTRADA
              </ButtonBombo>
            </FieldsetContainer>
          }
        </EntriesCostsContainer>
        <ButtonBombo
          margin="0"
          htmlType="submit"
          disabled={isDisabled}
          loading={isDisabled}
          type={"primary"}
        >
          GUARDAR
        </ButtonBombo>
      </form>
    </SettingsContainer>
  );
};

const SettingsContainer = styled.div`
  .container-entry-costs {
    border: 1px solid gray;
    border-radius: 10px;
    padding: 15px 20px;
  }
`;

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

const EntriesCostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 4rem;
  margin: 10px 0;
`;
