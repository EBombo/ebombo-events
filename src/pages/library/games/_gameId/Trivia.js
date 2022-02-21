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
  triviaQuestionsTypes,
} from "../../../../components/common/DataList";
import { Desktop, mediaQuery, Tablet } from "../../../../constants";
import { FileUpload } from "../../../../components/common/FileUpload";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
export const Trivia = (props) => {
  const [questions, setQuestions] = useState([
    {
      question: "",
      id: firestore.collection("questions").doc().id,
      type: "quiz",
      options: ["", "", "", ""],
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [optionFocus, setOptionFocus] = useState(0);
  const [correctAns, setCorrectAns] = useState("");

  const schema = object().shape({
    name: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const updateQuestions = () => {
    const _questions = questions.map((question) => {
      if (question.id !== currentQuestion.id) {
        return question;
      }
      return currentQuestion;
    });

    setQuestions(_questions);
  };

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
                  key={question.id}
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
                      question: "",
                      fileUrl: "",
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

          <div className="w-full h-full p-4 md:p-8 md:overflow-auto">
            <input
              type="text"
              className="w-full h-[80px] rounded-[4px] bg-whiteLight text-center text-['Lato'] font-[500] text-[25px] leading-[30px] text-grayLight"
              placeholder="Escribe tu pregunta..."
              value={currentQuestion.question}
              onChange={(e) => {
                setCurrentQuestion({ ...currentQuestion, question: e.target.value });
                updateQuestions();
              }}
            />
            <div className="mx-auto my-4 max-w-[786px]">
              <FileUpload
                file={get(currentQuestion, `fileUrl`, null)}
                fileName="coverUrl"
                filePath={`questions/${currentQuestion.id}`}
                preview={true}
                sizes="250x250"
                width="100%"
                height="131px"
                desktopHeight="260px"
                afterUpload={(filesUrls) => {
                  setCurrentQuestion({
                    ...currentQuestion,
                    fileUrl: filesUrls[0].url,
                  });
                  updateQuestions();
                }}
              />
            </div>
            {currentQuestion.type === "quiz" && (
              <div className="grid max-w-[786px] mx-auto my-4 gap-4 md:grid-cols-[1fr_1fr]">
                <div className="w-full grid grid-cols-[40px_auto] md:grid-cols-[50px_auto] rounded-[4px] overflow-hidden">
                  {optionFocus === 0 ? (
                    <CheckboxContainer
                      imageUrl={`${config.storageUrl}/resources/checked.svg`}
                      className="bg-red w-full h-full flex items-center justify-center"
                    >
                      <input
                        id="trigger"
                        type="checkbox"
                        defaultChecked={currentQuestion.answer === 0}
                        onChange={(e) => {
                          if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: 0 });
                          updateQuestions();
                        }}
                      />
                      <label htmlFor="trigger" className="checker" />
                    </CheckboxContainer>
                  ) : (
                    <div className="bg-red w-full h-full flex items-center justify-center">
                      <Image
                        src={`${config.storageUrl}/resources/shapes/star.svg`}
                        width="16px"
                        height="16px"
                        desktopWidth="33px"
                        desktopHeight="33px"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    className="px-4 h-[52px] text-right md:h-[102px] focus:outline-none focus:bg-red focus:text-white text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]"
                    placeholder="Escribir respuesta"
                    value={currentQuestion.options[0] ?? ""}
                    onFocus={() => setOptionFocus(0)}
                    onChange={(e) => {
                      const _option = e.target.value;
                      const newOptions = [...currentQuestion.options];
                      newOptions[0] = _option;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      updateQuestions();
                    }}
                  />
                </div>
                <div className="w-full grid grid-cols-[40px_auto] md:grid-cols-[50px_auto] rounded-[4px] overflow-hidden">
                  {optionFocus === 1 ? (
                    <CheckboxContainer
                      imageUrl={`${config.storageUrl}/resources/checked.svg`}
                      className="bg-red w-full h-full flex items-center justify-center"
                    >
                      <input
                        id="trigger"
                        type="checkbox"
                        defaultChecked={currentQuestion.answer === 1}
                        onChange={(e) => {
                          if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: 1 });
                          updateQuestions();
                        }}
                      />
                      <label for="trigger" className="checker" />
                    </CheckboxContainer>
                  ) : (
                    <div className="bg-green w-full h-full flex items-center justify-center">
                      <Image
                        src={`${config.storageUrl}/resources/shapes/circle.svg`}
                        width="16px"
                        height="16px"
                        desktopWidth="33px"
                        desktopHeight="33px"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    className="px-4 h-[52px] text-right md:h-[102px] focus:outline-none focus:bg-red focus:text-white text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]"
                    placeholder="Escribir respuesta"
                    value={currentQuestion.options[1] ?? ""}
                    onFocus={() => setOptionFocus(1)}
                    onChange={(e) => {
                      const _option = e.target.value;
                      const newOptions = [...currentQuestion.options];
                      newOptions[1] = _option;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      updateQuestions();
                    }}
                  />
                </div>
                <div className="w-full grid grid-cols-[40px_auto] md:grid-cols-[50px_auto] rounded-[4px] overflow-hidden">
                  {optionFocus === 2 ? (
                    <CheckboxContainer
                      imageUrl={`${config.storageUrl}/resources/checked.svg`}
                      className="bg-red w-full h-full flex items-center justify-center"
                    >
                      <input
                        id="trigger"
                        type="checkbox"
                        defaultChecked={currentQuestion.answer === 2}
                        onChange={(e) => {
                          if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: 2 });
                          updateQuestions();
                        }}
                      />
                      <label htmlFor="trigger" className="checker" />
                    </CheckboxContainer>
                  ) : (
                    <div className="bg-orange w-full h-full flex items-center justify-center">
                      <Image
                        src={`${config.storageUrl}/resources/shapes/triangle.svg`}
                        width="16px"
                        height="16px"
                        desktopWidth="33px"
                        desktopHeight="33px"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    className="px-4 h-[52px] text-right md:h-[102px] focus:outline-none focus:bg-red focus:text-white text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]"
                    placeholder="Escribir respuesta"
                    value={currentQuestion.options[2] ?? ""}
                    onFocus={() => setOptionFocus(2)}
                    onChange={(e) => {
                      const _option = e.target.value;
                      const newOptions = [...currentQuestion.options];
                      newOptions[2] = _option;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      updateQuestions();
                    }}
                  />
                </div>
                <div className="w-full grid grid-cols-[40px_auto] md:grid-cols-[50px_auto] rounded-[4px] overflow-hidden">
                  {optionFocus === 3 ? (
                    <CheckboxContainer
                      imageUrl={`${config.storageUrl}/resources/checked.svg`}
                      className="bg-red w-full h-full flex items-center justify-center"
                    >
                      <input
                        id="trigger"
                        type="checkbox"
                        defaultChecked={currentQuestion.answer === 3}
                        onChange={(e) => {
                          if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: 3 });
                          updateQuestions();
                        }}
                      />
                      <label htmlFor="trigger" className="checker" />
                    </CheckboxContainer>
                  ) : (
                    <div className="bg-blue w-full h-full flex items-center justify-center">
                      <Image
                        src={`${config.storageUrl}/resources/shapes/square.svg`}
                        width="16px"
                        height="16px"
                        desktopWidth="33px"
                        desktopHeight="33px"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    className="px-4 h-[52px] text-right md:h-[102px] focus:outline-none focus:bg-red focus:text-white text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]"
                    placeholder="Escribir respuesta"
                    value={currentQuestion.options[3] ?? ""}
                    onFocus={() => setOptionFocus(3)}
                    onChange={(e) => {
                      const _option = e.target.value;
                      const newOptions = [...currentQuestion.options];
                      newOptions[3] = _option;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      updateQuestions();
                    }}
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "trueFalse" && (
              <div className="grid max-w-[786px] mx-auto my-4 gap-4 md:grid-cols-[1fr_1fr]">
                <div className="w-full grid grid-cols-[auto_40px] md:grid-cols-[auto_50px] rounded-[4px] overflow-hidden">
                  <div className="bg-white px-4 h-[52px] flex items-center justify-center md:h-[102px]">
                    <Image
                      src={`${config.storageUrl}/resources/true.svg`}
                      width="26px"
                      height="22px"
                      desktopWidth="36px"
                      desktopHeight="29px"
                      size="contain"
                      margin="0 10px 0 0"
                    />
                    <div className="text-blackDarken text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]">
                      Verdadero
                    </div>
                  </div>
                  <CheckboxContainer
                    imageUrl={`${config.storageUrl}/resources/checked.svg`}
                    className="bg-blue w-full h-full flex items-center justify-center"
                  >
                    <input
                      id="trueCheckbox"
                      type="checkbox"
                      checked={currentQuestion.answer === true}
                      onChange={(e) => {
                        if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: true });
                      }}
                    />
                    <label htmlFor="trueCheckbox" className="checker" />
                  </CheckboxContainer>
                </div>
                <div className="w-full grid grid-cols-[auto_40px] md:grid-cols-[auto_50px] rounded-[4px] overflow-hidden">
                  <div className="bg-white px-4 h-[52px] flex items-center justify-center md:h-[102px]">
                    <Image
                      src={`${config.storageUrl}/resources/false.svg`}
                      width="26px"
                      height="22px"
                      desktopWidth="36px"
                      desktopHeight="29px"
                      size="contain"
                      margin="0 10px 0 0"
                    />
                    <div className="text-blackDarken text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]">
                      Falso
                    </div>
                  </div>
                  <CheckboxContainer
                    imageUrl={`${config.storageUrl}/resources/checked.svg`}
                    className="bg-red w-full h-full flex items-center justify-center"
                  >
                    <input
                      id="falseCheckbox"
                      type="checkbox"
                      checked={currentQuestion.answer === false}
                      onChange={(e) => {
                        if (e.target.checked) setCurrentQuestion({ ...currentQuestion, answer: false });
                      }}
                    />
                    <label htmlFor="falseCheckbox" className="checker" />
                  </CheckboxContainer>
                </div>
              </div>
            )}

            {currentQuestion.type === "shortAnswer" && (
              <div className="grid max-w-[786px] mx-auto my-4 gap-4">
                <div className="w-full h-[55px] md:h-[85px] p-4 bg-whiteLight rounded-[4px] grid grid-cols-[auto_144px]">
                  <input
                    type="text"
                    className="text-['Lato'] bold-[500] text-[16px] leading-[19px] h-full bg-transparent focus:outline-none"
                    value={correctAns}
                    onChange={(e) => setCorrectAns(e.target.value)}
                    placeholder="Escribe una respuesta..."
                  />
                  <ButtonAnt
                    onClick={() => {
                      if (isEmpty(correctAns)) return;
                      setCurrentQuestion({ ...currentQuestion, answer: [...currentQuestion.answer, correctAns] });
                      setCorrectAns("");
                    }}
                  >
                    Añadir respuesta
                  </ButtonAnt>
                </div>
                <div className="w-full grid gap-4 grid-cols-[repeat(auto-fill,minmax(100px,auto))]">
                  {currentQuestion?.answer.map((answer, idx) => (
                    <div
                      className="bg-green px-4 py-2 text-['Lato'] text-white bold-[900] text-[22px] leading-[26px] rounded-[5px] flex items-center text-center"
                      key={`${answer}-${idx}`}
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
                onChange={(value) => {
                  setCurrentQuestion({ ...currentQuestion, type: value, answer: [] });
                }}
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

const CheckboxContainer = styled.div`
  label {
    cursor: pointer;
    position: relative;
    width: 32px;
    height: 32px;

    ${mediaQuery.afterMobile} {
      width: 40px;
      height: 40px;
    }
  }

  label:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 32px;
    height: 32px;
    border: 2px solid #ffffff;
    border-radius: 50%;

    ${mediaQuery.afterMobile} {
      width: 40px;
      height: 40px;
    }
  }

  input[type="checkbox"] {
    display: none;
  }

  input[type="checkbox"]:checked + label:before {
    background: url(${(props) => props.imageUrl}) center no-repeat;
  }
`;
