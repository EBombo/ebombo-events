import React, { useState } from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input, Select } from "../../../../components/form";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";
import {
  triviaQuestionsOptions,
  triviaQuestionsTimes,
  triviaQuestionsTypes
} from "../../../../components/common/DataList";
import { Desktop, Tablet } from "../../../../constants";

export const Trivia = (props) => {
  const [questions, setQuestions] = useState([
    {
      id: firestore.collection("questions").doc().id,
      type: "quiz",
      options: ["", "", "", ""],
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  const schema = object().shape({
    name: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async () => {};

  return (
    <div className="w-screen">
      <form className="grid" onSubmit={handleSubmit(saveGame)}>
        <div className="w-full bg-primary py-2 px-4">
          <div className="max-w-[300px]">
            <Input
              defaultValue={get(props, "game.name", "")}
              variant="primary"
              type="text"
              name="name"
              ref={register}
              error={errors.name}
              placeholder="Nombre del Evento"
            />
          </div>
        </div>
        <div className="w-full h-[calc(100vh-102px)] overflow-auto grid md:grid-cols-[180px_auto_260px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-full h-[115px] md:h-full overflow-auto grid md:grid-rows-[auto_100px] bg-white">
            <div className="w-full h-[full] flex items-center md:items-start md:flex-col overflow-auto">
              {questions.map((question, idx) => (
                <div
                  className={`cursor-pointer bg-${
                    question.id === currentQuestion.id ? "gray" : "white"
                  } h-full w-[115px] min-w-[115px] flex flex-col justify-center items-center md:h-[117px] md:min-h-[117px] md:w-full`}
                  onClick={() => setCurrentQuestion(question)}
                >
                  <div>
                    <div className="text-['Lato'] font-bold text-[12px] leading-[14px] text-grayLight">
                      {idx + 1} Quiz
                    </div>
                    <Image
                      src={question.imageUrl ?? `${config.storageUrl}/resources/question.png`}
                      size="contain"
                      width="75px"
                      height="45px"
                      desktopHeight="75px"
                      desktopWidth="128px"
                    />
                  </div>
                </div>
              ))}
              <div className={`p-4 bg-white h-full flex items-center w-[115px] md:h-[117px] md:w-full`}>
                <ButtonAnt
                  onClick={() => {
                    const _question = {
                      id: firestore.collection("questions").doc().id,
                      type: "quiz",
                      options: ["", "", "", ""],
                    };

                    setQuestions([...questions, _question]);
                  }}
                  size="small"
                  margin="auto"
                >
                  Añadir Pregunta
                </ButtonAnt>
              </div>
            </div>
            <Desktop>
              <div className="grid items-center justify-center">
                <ButtonAnt htmlType="submit">Guardar</ButtonAnt>
              </div>
            </Desktop>
          </div>

          <div className=""></div>

          <div className="h-full shadow-[2px_0_4px_2px_rgba(0,0,0,0.25)] bg-whiteLight">
            <div className="p-4  border-gray border-b-[1px]">
              <div className="flex items-center justify-start mb-[5px]">
                <Image
                  src={`${config.storageUrl}/resources/type-icon.svg`}
                  width="18px"
                  height="18px"
                  size="contain"
                  margin="0 5px 0 0"
                />
                <div className="text-grayLight text-['Lato'] font-bold text-[11px] leading-[13px]">
                  Tipo de pregunta
                </div>
              </div>
              <Select
                showSearch
                virtual={false}
                height="35px"
                optionFilterProp="children"
                borderRight="1px solid #C4C4C4"
                borderLeft="1px solid #C4C4C4"
                borderTop="1px solid #C4C4C4"
                borderBottom="1px solid #C4C4C4"
                borderRadius="4px"
                defaultValue={triviaQuestionsTypes[0].key}
                optionsdom={triviaQuestionsTypes.map((type) => ({
                  key: type.key,
                  code: type.key,
                  name: type.value,
                }))}
              />
            </div>
            <div className="p-4 border-gray border-b-[1px]">
              <div className="flex items-center justify-start mb-[5px]">
                <Image
                  src={`${config.storageUrl}/resources/clock-icon.svg`}
                  width="18px"
                  height="18px"
                  size="contain"
                  margin="0 5px 0 0"
                />
                <div className="text-grayLight text-['Lato'] font-bold text-[11px] leading-[13px]">
                  Límite de tiempo
                </div>
              </div>
              <Select
                showSearch
                virtual={false}
                height="35px"
                optionFilterProp="children"
                borderRight="1px solid #C4C4C4"
                borderLeft="1px solid #C4C4C4"
                borderTop="1px solid #C4C4C4"
                borderBottom="1px solid #C4C4C4"
                borderRadius="4px"
                defaultValue={20}
                optionsdom={triviaQuestionsTimes.map((time) => ({
                  key: time.key,
                  code: time.key,
                  name: time.value,
                }))}
              />

              <div className="flex items-center justify-start mb-[5px]">
                <Image
                  src={`${config.storageUrl}/resources/options-icon.svg`}
                  width="18px"
                  height="18px"
                  size="contain"
                  margin="0 5px 0 0"
                />
                <div className="text-grayLight text-['Lato'] font-bold text-[11px] leading-[13px]">
                  Opciones de respuesta
                </div>
              </div>
              <Select
                showSearch
                virtual={false}
                height="35px"
                optionFilterProp="children"
                borderRight="1px solid #C4C4C4"
                borderLeft="1px solid #C4C4C4"
                borderTop="1px solid #C4C4C4"
                borderBottom="1px solid #C4C4C4"
                borderRadius="4px"
                defaultValue={"uniq"}
                optionsdom={triviaQuestionsOptions.map((option) => ({
                  key: option.key,
                  code: option.key,
                  name: option.value,
                }))}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-end">
                <Tablet>
                  <ButtonAnt htmlType="submit" margin="0 10px 0 0">
                    Guardar
                  </ButtonAnt>
                </Tablet>
                <ButtonAnt color="default">Borrar</ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
