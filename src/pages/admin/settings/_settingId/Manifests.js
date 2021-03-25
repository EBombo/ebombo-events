import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { firestore } from "../../../../firebase";
import * as yup from "yup";
import { spinLoader } from "../../../../utils";
import { Input } from "../../../../components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import mapKeys from "lodash/mapKeys";

export const Manifests = (props) => {
  const schema = yup.object().shape({});

  const [isLoading, setIsLoading] = useState(true);
  const [manifests, setManifests] = useState({});

  const { register, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchManifests = async () => {
      const manifestsRef = await firestore.doc("settings/manifest").get();

      setManifests(defaultTo(manifestsRef.data(), {}));
      setIsLoading(false);
    };

    fetchManifests();
  }, []);

  const mapManifest = (data) =>
    mapKeys(data, (value) => value.domain.replaceAll(".", "&"));

  const saveManifests = async (data) => {
    try {
      const newManifest = mapManifest(data);
      await firestore.doc("settings/manifest").set(newManifest);
      props.showNotification("REGISTRADO", "Registro actualizado.", "success");
    } catch (error) {
      console.error(error);
      props.showNotification("ERROR", "Algo salio mal, intente nuevamente.");
    }
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      <form
        onSubmit={handleSubmit(saveManifests)}
        autoComplete="off"
        noValidate
      >
        <div>
          <FieldsetContainer>
            <legend>Manifest por dominio</legend>
            {Object.keys(manifests).map((domain, index) => (
              <div className={"manifests"} key={`instruction-${domain}`}>
                <div>
                  <Input
                    variant="secondary"
                    label="Dominio"
                    type="text"
                    defaultValue={domain.replaceAll("&", ".")}
                    placeholder="Dominio"
                    ref={register}
                    name={`domain${index}.domain`}
                  />
                  <Input
                    variant="secondary"
                    label="Name"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain].name = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    defaultValue={get(manifests[domain], "name", "")}
                    placeholder="Nombre de la aplicación"
                    ref={register}
                    name={`domain${index}.name`}
                  />
                  <Input
                    variant="secondary"
                    label="Short Name"
                    defaultValue={get(manifests[domain], "short_name", "")}
                    placeholder="Nombre corto usado en apps"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["short_name"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.short_name`}
                  />
                  <Input
                    variant="secondary"
                    label="Start URL"
                    defaultValue={get(manifests[domain], "start_url", "")}
                    placeholder="Url donde inicia la app"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["start_url"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.start_url`}
                  />
                  <Input
                    variant="secondary"
                    label="Display"
                    defaultValue={get(manifests[domain], "display", "")}
                    placeholder="Orientación"
                    type="text"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["display"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.display`}
                  />
                  <Input
                    variant="secondary"
                    label="Theme color"
                    defaultValue={get(manifests[domain], "theme_color", "")}
                    placeholder="Color de tema de la aplicación"
                    className="color-input"
                    type="color"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["theme_color"] = event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.theme_color`}
                  />
                  <Input
                    variant="secondary"
                    label="Background Color"
                    defaultValue={get(
                      manifests[domain],
                      "background_color",
                      ""
                    )}
                    placeholder="Color de fondo"
                    className="color-input"
                    type="color"
                    onBlur={(event) => {
                      let newManifests = manifests;
                      newManifests[domain]["background_color"] =
                        event.target.value;
                      setManifests({ ...newManifests });
                    }}
                    ref={register}
                    name={`domain${index}.background_color`}
                  />
                  <Button
                    danger
                    onClick={() => {
                      let newManifests = manifests;
                      delete newManifests[domain];
                      setManifests({ ...newManifests });
                    }}
                  >
                    Eliminar Manifest
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type={"primary"}
              onClick={() => {
                setManifests({
                  ...manifests,
                  ...{
                    [`domain${Object.keys(manifests).length}`]: {},
                  },
                });
              }}
            >
              Agregar Manifest
            </Button>
          </FieldsetContainer>
        </div>
        <Button htmlType="submit" type={"primary"}>
          GUARDAR
        </Button>
      </form>
    </div>
  );
};

const FieldsetContainer = styled.fieldset`
  border: 1px solid ${(props) => props.theme.basic.blackDarken};
  width: auto;
  border-radius: 7px;
  padding: 15px 20px;
  height: 100%;
  margin-top: 1rem;

  .color-input {
    width: 20%;
  }

  legend {
    width: auto;
    margin: 0;
    color: ${(props) => props.theme.basic.black};
  }

  .manifests {
    margin: 1rem 0;
  }
`;
