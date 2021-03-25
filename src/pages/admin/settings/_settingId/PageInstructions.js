import React, {useEffect, useState} from "react";
import {message} from "antd";
import {useForm} from "react-hook-form";
import {defaultTo, get} from "lodash";
import styled from "styled-components";
import {firestore} from "../../../../firebase";
import * as yup from "yup";
import {spinLoader} from "../../../../utils";
import {ButtonBombo, Input, TextArea} from "../../../../components";

export const PageInstructions = (props) => {
  const schema = yup.object().shape({
    items: yup.array(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [howItWorks, setHowItWorks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchHowItWorks = async () => {
      const howItWorksRef = await firestore.doc("settings/howItWorks").get();

      setHowItWorks(howItWorksRef.data().items);
      setIsLoading(false);
    };

    fetchHowItWorks();
  }, []);

  const saveInstructions = async (data) => {
    setIsSaving(true);
    try {
      await firestore.doc("settings/howItWorks").update({ items: data.items });
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
      <form
        onSubmit={handleSubmit(saveInstructions)}
        autoComplete="off"
        noValidate
      >
        <FieldsetContainer>
          <legend>Instrucciones de la página</legend>
          {defaultTo(howItWorks, []).map((instruction, index) => (
            <div
              className="page-instruction"
              key={`match-instructions-${index}`}
            >
              <div className="sub-content">
                <Input
                  variant="secondary"
                  type="text"
                  onBlur={(e) => {
                    let newHowItWorks = howItWorks;
                    newHowItWorks[index].title = e.target.value;
                    setHowItWorks([...newHowItWorks]);
                  }}
                  defaultValue={get(instruction, "title")}
                  placeholder="Título"
                  ref={register}
                  name={`items[${index}].title`}
                  label={"Título"}
                />
                <div className="content-container">
                  {get(instruction, "content", []).map((item, idx) => (
                    <div key={`match-instructions-${index}-content-${idx}`}>
                      <Input
                        variant="secondary"
                        defaultValue={get(item, "subtitle", "")}
                        placeholder="Subtítulo"
                        type="text"
                        onBlur={(e) => {
                          let newHowItWorks = howItWorks;
                          newHowItWorks[index]["content"][idx].subtitle =
                            e.target.value;
                          setHowItWorks([...newHowItWorks]);
                        }}
                        ref={register}
                        name={`items[${index}]["content"][${idx}].subtitle`}
                        label={"Subtítulo"}
                      />
                      <TextArea
                        variant="secondary"
                        defaultValue={get(item, "description", "")}
                        placeholder="Descripción"
                        onBlur={(event) => {
                          let newHowItWorks = howItWorks;
                          newHowItWorks[index]["content"][idx].description =
                            event.target.value;
                          setHowItWorks([...newHowItWorks]);
                        }}
                        ref={register}
                        name={`items[${index}]["content"][${idx}].description`}
                        label={"Descripción"}
                      />
                      <ButtonBombo
                        margin="0"
                        danger
                        onClick={() => {
                          let newHowItWorks = howItWorks;
                          let newHowItWorksContent = newHowItWorks[index][
                            "content"
                          ].filter((instructions, index_) => index_ !== idx);
                          newHowItWorks[index][
                            "content"
                          ] = newHowItWorksContent;
                          reset({ items: newHowItWorks });
                          setHowItWorks([...newHowItWorks]);
                        }}
                      >
                        Eliminar
                      </ButtonBombo>
                    </div>
                  ))}
                </div>
                <ButtonBombo
                  margin="10px 0"
                  danger
                  onClick={() => {
                    let newHowItWorks = howItWorks.filter(
                      (instructions, index_) => index_ !== index
                    );
                    reset({ items: newHowItWorks });
                    setHowItWorks([...newHowItWorks]);
                  }}
                >
                  Eliminar Instrucción
                </ButtonBombo>
                <ButtonBombo
                  margin="0"
                  default
                  onClick={() => {
                    let newHowItWorks = howItWorks;
                    newHowItWorks[index]["content"] = [
                      ...newHowItWorks[index]["content"],
                      {
                        subtitle: "",
                        description: "",
                      },
                    ];
                    setHowItWorks([...newHowItWorks]);
                  }}
                >
                  Agregar Contenido
                </ButtonBombo>
              </div>
            </div>
          ))}
          <ButtonBombo
            margin="10px 0"
            type={"primary"}
            onClick={() =>
              setHowItWorks([
                ...howItWorks,
                {
                  title: "",
                  content: [
                    {
                      subtitle: "",
                      description: "",
                    },
                  ],
                },
              ])
            }
            style={{ marginTop: "1rem" }}
          >
            Agregar Instrucción
          </ButtonBombo>
        </FieldsetContainer>
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

  .content-container {
    margin-left: 2rem;
    margin-bottom: 1rem;
  }

  .sub-content {
    margin: 1rem;
  }

  .page-instruction {
    margin: 1rem 0;
  }
`;
