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

export const MatchInstructions = (props) => {
  const schema = yup.object().shape({
    items: yup.array(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [matchInstructions, setMatchInstructions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchMatchInstructions = async () => {
      const matchInstructionsRef = await firestore
        .doc("settings/matchInstructions")
        .get();

      setMatchInstructions(matchInstructionsRef.data().items);
      setIsLoading(false);
    };

    fetchMatchInstructions();
  }, []);

  const saveSettings = async (data) => {
    setIsSaving(true);
    try {
      await firestore
        .doc("settings/matchInstructions")
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
            <legend>Instrucciones del Partido</legend>
            {defaultTo(matchInstructions, []).map((matchInstruction, index) => (
              <div className={"match-instruction"} key={`instruction-${index}`}>
                <div>
                  <div>Instrucción {`${index + 1}`}</div>
                  <Input
                    variant="secondary"
                    type="text"
                    onBlur={(e) => {
                      let newMatchInstructions = matchInstructions;
                      newMatchInstructions[index].title = e.target.value;
                      setMatchInstructions([...newMatchInstructions]);
                    }}
                    defaultValue={get(matchInstruction, "title")}
                    placeholder="Título"
                    ref={register}
                    name={`items[${index}].title`}
                  />
                  <TextArea
                    variant="secondary"
                    defaultValue={get(matchInstruction, "content", "")}
                    placeholder="Contenido"
                    onBlur={(event) => {
                      let newMatchInstructions = matchInstructions;
                      newMatchInstructions[index].content = event.target.value;
                      setMatchInstructions([...newMatchInstructions]);
                    }}
                    ref={register}
                    name={`items[${index}].content`}
                  />
                  <ButtonBombo
                    margin="0"
                    danger
                    onClick={() => {
                      let newMatchInstructions = matchInstructions.filter(
                        (instructions, index_) => index_ !== index
                      );
                      reset({ items: newMatchInstructions });
                      setMatchInstructions([...newMatchInstructions]);
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
                setMatchInstructions([
                  ...matchInstructions,
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
  margin-top: 1rem;

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

  .match-instruction {
    margin: 1rem 0;
  }
`;
