import React, { useState } from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input } from "../../../../components/form";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";

export const Trivia = (props) => {
  const [questions, setQuestions] = useState([
    {
      id: firestore.collection("questions").doc().id,
      type: "multiple",
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
          <div className="w-full h-[115px] flex items-center bg-white md:items-start md:flex-col md:h-[90%]">
            {questions.map((question, idx) => (
              <div
                className={`cursor-pointer bg-${
                  question.id === currentQuestion.id ? "gray" : "whiteLight"
                } h-full w-[115px] flex flex-col justify-center items-center md:h-[117px] md:w-full`}
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
            <div className={`p-4 bg-whiteLight h-full flex items-center w-[115px] md:h-[117px] md:w-full`}>
              <ButtonAnt
                onClick={() => {
                  const _question = {
                    id: firestore.collection("questions").doc().id,
                    type: "multiple",
                    options: ["", "", "", ""],
                  };

                  setQuestions([...questions, _question]);
                }}
                size="small"
                margin="auto"
              >
                Añadir
              </ButtonAnt>
            </div>
          </div>
          <div className=""></div>
          <div></div>
        </div>
      </form>
    </div>
  );
};
