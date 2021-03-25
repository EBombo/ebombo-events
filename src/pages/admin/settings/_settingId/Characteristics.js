import React, {useEffect, useState} from "react";
import {message} from "antd";
import {useForm} from "react-hook-form";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import styled from "styled-components";
import {firestore} from "../../../../firebase";
import * as yup from "yup";
import {spinLoader} from "../../../../utils";
import {ButtonBombo, Input, TextArea} from "../../../../components";

export const Characteristics = (props) => {
  const schema = yup.object().shape({
    items: yup.array(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [characteristics, setCharacteristics] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchCharacteristicsSettings = async () => {
      const characteristicsRef = await firestore
        .doc("settings/characteristics")
        .get();

      setCharacteristics(characteristicsRef.data().items);
      setIsLoading(false);
    };

    fetchCharacteristicsSettings();
  }, []);

  const saveSettings = async (data) => {
    setIsSaving(true);
    try {
      await firestore
        .doc("settings/characteristics")
        .update({ items: data.items });
      message.success("Registro actualizado.");
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente.");
    }
    setIsSaving(false);
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      <form onSubmit={handleSubmit(saveSettings)} autoComplete="off" noValidate>
        <div>
          <FieldsetContainer>
            <legend>Caracteristicas eBombo</legend>
            {defaultTo(characteristics, []).map((characteristic, index) => (
              <div className={"characteristic"} key={`characteristic-${index}`}>
                <div>Característica {`${index + 1}`}</div>
                <div>
                  <Input
                    variant="secondary"
                    type="text"
                    onBlur={(e) => {
                      let newCharacteristic = characteristics;
                      newCharacteristic[index].title = e.target.value;
                      setCharacteristics([...newCharacteristic]);
                    }}
                    defaultValue={get(characteristic, "title")}
                    placeholder="Título"
                    ref={register}
                    name={`items[${index}].title`}
                  />
                  <TextArea
                    variant="secondary"
                    defaultValue={get(characteristic, "content", "")}
                    placeholder="Contenido"
                    onBlur={(event) => {
                      let newCharacteristic = characteristics;
                      newCharacteristic[index].content = event.target.value;
                      setCharacteristics([...newCharacteristic]);
                    }}
                    ref={register}
                    name={`items[${index}].content`}
                  />
                  <ButtonBombo
                    margin="0"
                    danger
                    onClick={() => {
                      let newCharacteristic = characteristics.filter(
                        (instructions, index_) => index_ !== index
                      );
                      reset({ items: newCharacteristic });
                      setCharacteristics([...newCharacteristic]);
                    }}
                  >
                    Eliminar
                  </ButtonBombo>
                </div>
              </div>
            ))}
            <ButtonBombo
              margin="0"
              type={"primary"}
              onClick={() =>
                setCharacteristics([
                  ...characteristics,
                  {
                    title: "",
                    content: "",
                  },
                ])
              }
            >
              Agregar Instrucción
            </ButtonBombo>
          </FieldsetContainer>
        </div>
        <ButtonBombo
          margin="10px 0"
          htmlType="submit"
          type={"primary"}
          loading={isSaving}
          disabled={isSaving}
        >
          GUARDAR
        </ButtonBombo>
      </form>
    </div>
  );
};

const FieldsetContainer = styled.fieldset`
  border: 1px solid #292929;
  width: auto;
  border-radius: 7px;
  padding: 15px 20px;
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

  .characteristic {
    margin: 1rem 0;
  }
`;
