import React, { useEffect, useState } from "react";
import { ButtonAnt } from "../../../../components/form";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { mediaQuery } from "../../../../constants";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import { useTranslation } from "../../../../hooks";
import { triviaQuestionsTypes, triviaShortAnswerType } from "../../../../components/common/DataList";

const vowelsAndAccentsCharacters = /(a|e|i|o|u|A|E|I|O|U|á|é|í|ó|ú|Á|É|Í|Ó|Ú)/g;

const specialCharacters = /(\[|\]|\{|\}|\(|\)|\^|\$|\.|\||\?|\*|\+)/g;

export const TriviaQuestion = (props) => {
  const { t } = useTranslation("pages.library.trivia");

  const [optionFocus, setOptionFocus] = useState(-1);
  const [correctAns, setCorrectAns] = useState("");

  useEffect(() => {
    // Initialize answerPattern.
    const _questions = [...props.questions];

    if (_questions[props.questionIndex]?.type !== triviaShortAnswerType) return;

    if (_questions[props.questionIndex].answerPattern) return;

    _questions[props.questionIndex].answerPattern = _questions[props.questionIndex].answer.map((answer) => answer);

    props.setQuestions(_questions);
  }, [props.questions, props.questionIndex]);

  const updateInputQuiz = (number, e) => {
    const _option = e.target.value;
    const newOptions = [...props.questions[props.questionIndex].options];
    newOptions[number] = _option;

    const _questions = [...props.questions];
    _questions[props.questionIndex].options = newOptions;
    props.setQuestions(_questions);
  };

  const updateCheckboxQuiz = (number, e, uniq = false) => {
    const _questions = [...props.questions];

    if (!e.target.checked) {
      const _newAnswer = _questions[props.questionIndex].answer.filter((ans) => ans !== number);
      _questions[props.questionIndex].answer = _newAnswer;
      return props.setQuestions(_questions);
    }

    if (uniq) {
      _questions[props.questionIndex].answer = [number];
      return props.setQuestions(_questions);
    }

    _questions[props.questionIndex].answer.push(number);
    props.setQuestions(_questions);
  };

  const updateInputTrueFalse = (e, ans) => {
    if (!e.target.checked) return;

    const _questions = [...props.questions];
    _questions[props.questionIndex].answer = ans;
    props.setQuestions(_questions);
  };

  const onAddAnswer = () => {
    if (isEmpty(correctAns)) return;

    const correctAnsTrimmed = correctAns?.trim();

    let correctAnsFormatted = correctAnsTrimmed;

    correctAnsFormatted = correctAnsFormatted.replace(specialCharacters, (match) => `\\\\${match}`);

    correctAnsFormatted = correctAnsFormatted.replace(vowelsAndAccentsCharacters, (match) => {
      if (match === "a" || match === "A" || match === "á" || match === "Á") return `[a|A|á|Á]`;
      if (match === "e" || match === "E" || match === "é" || match === "É") return `[e|E|é|É]`;
      if (match === "i" || match === "I" || match === "í" || match === "Í") return `[i|I|í|Í]`;
      if (match === "o" || match === "O" || match === "ó" || match === "Ó") return `[o|O|ó|Ó]`;
      if (match === "u" || match === "U" || match === "ú" || match === "Ú") return `[u|U|ú|Ú]`;

      return match;
    });

    correctAnsFormatted = `^${correctAnsFormatted}$`;

    const _questions = [...props.questions];
    _questions[props.questionIndex].answer = [...props.questions[props.questionIndex].answer, correctAnsTrimmed];

    _questions[props.questionIndex].answerPattern = [
      ...(props.questions[props.questionIndex].answerPattern ?? []),
      correctAnsFormatted,
    ];

    props.setQuestions(_questions);
    setCorrectAns("");
  };

  const onRemoveShortAnswer = (answer, idx) => {
    const _questions = [...props.questions];

    const indexToDelete = props.questions[props.questionIndex]?.answer.findIndex((ans) => ans === answer);

    _questions[props.questionIndex].answer = props.questions[props.questionIndex]?.answer.filter(
      (_, index) => index !== indexToDelete
    );

    _questions[props.questionIndex].answerPattern = (props.questions[props.questionIndex]?.answerPattern ?? []).filter(
      (_, index) => index !== indexToDelete
    );

    props.setQuestions(_questions);
  };

  // TODO: Consider refactoring, the component is long.
  return (
    <>
      {[triviaQuestionsTypes.quiz.key, triviaQuestionsTypes.survey.key].includes(
        props.questions[props.questionIndex]?.type
      ) && (
        <div className="grid max-w-[786px] mx-auto my-4 gap-4 md:grid-cols-[1fr_1fr]">
          <div className="w-full grid grid-cols-[40px_auto_40px] md:grid-cols-[50px_auto_50px] rounded-[4px] overflow-hidden">
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

            <input
              type="text"
              className={`px-4 h-[52px] text-right text-white md:h-[102px] focus:outline-none ${
                !isEmpty(props.questions[props.questionIndex]?.options[0]) ? "bg-red" : "bg-white"
              } focus:bg-red text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]`}
              placeholder={t("write-answer")}
              value={props.questions[props.questionIndex]?.options[0] ?? ""}
              onFocus={() => setOptionFocus(0)}
              onChange={(e) => {
                updateInputQuiz(0, e);
              }}
            />

            {!isEmpty(props.questions[props.questionIndex]?.options[0]) ? (
              props.questions[props.questionIndex]?.answerOption === "uniq" ? (
                <CheckboxContainer
                  rounded
                  imageUrl={`${config.storageUrl}/resources/checked.svg`}
                  className="bg-red w-full h-full flex items-center justify-center"
                  key={props.questions[props.questionIndex].answer}
                >
                  <input
                    id="trigger-0"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(0)}
                    onChange={(e) => {
                      updateCheckboxQuiz(0, e, true);
                    }}
                  />
                  <label htmlFor="trigger-0" className="checker" />
                </CheckboxContainer>
              ) : (
                <CheckboxContainer
                  imageUrl={`${config.storageUrl}/resources/checked-square.svg`}
                  className="bg-red w-full h-full flex items-center justify-center"
                >
                  <input
                    id="trigger-0"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(0)}
                    onChange={(e) => {
                      updateCheckboxQuiz(0, e);
                    }}
                  />
                  <label htmlFor="trigger-0" className="checker" />
                </CheckboxContainer>
              )
            ) : (
              <div
                className={`${
                  optionFocus === 0 ? "bg-red" : "bg-white"
                } w-full h-full flex items-center justify-center`}
              />
            )}
          </div>

          <div className="w-full grid grid-cols-[40px_auto_40px] md:grid-cols-[50px_auto_50px] rounded-[4px] overflow-hidden">
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
            <input
              type="text"
              className={`px-4 h-[52px] text-white text-right md:h-[102px] ${
                !isEmpty(props.questions[props.questionIndex]?.options[1]) ? "bg-green" : "bg-white"
              } focus:outline-none focus:bg-green text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]`}
              placeholder={t("write-answer")}
              value={props.questions[props.questionIndex]?.options[1] ?? ""}
              onFocus={() => setOptionFocus(1)}
              onChange={(e) => {
                updateInputQuiz(1, e);
              }}
            />
            {!isEmpty(props.questions[props.questionIndex]?.options[1]) ? (
              props.questions[props.questionIndex]?.answerOption === "uniq" ? (
                <CheckboxContainer
                  rounded
                  imageUrl={`${config.storageUrl}/resources/checked.svg`}
                  className="bg-green w-full h-full flex items-center justify-center"
                  key={props.questions[props.questionIndex].answer}
                >
                  <input
                    id="trigger-1"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex]?.answer, []).includes(1)}
                    onChange={(e) => {
                      updateCheckboxQuiz(1, e, true);
                    }}
                  />
                  <label for="trigger-1" className="checker" />
                </CheckboxContainer>
              ) : (
                <CheckboxContainer
                  imageUrl={`${config.storageUrl}/resources/checked-square.svg`}
                  className="bg-green w-full h-full flex items-center justify-center"
                >
                  <input
                    id="trigger-1"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex]?.answer, []).includes(1)}
                    onChange={(e) => {
                      updateCheckboxQuiz(1, e);
                    }}
                  />
                  <label htmlFor="trigger-1" className="checker" />
                </CheckboxContainer>
              )
            ) : (
              <div
                className={`${
                  optionFocus === 1 ? "bg-green" : "bg-white"
                } w-full h-full flex items-center justify-center`}
              />
            )}
          </div>

          <div className="w-full grid grid-cols-[40px_auto_40px] md:grid-cols-[50px_auto_50px] rounded-[4px] overflow-hidden">
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
            <input
              type="text"
              className={`px-4 h-[52px] text-right text-white md:h-[102px] ${
                !isEmpty(props.questions[props.questionIndex]?.options[2]) ? "bg-orange" : "bg-white"
              } focus:outline-none focus:bg-orange text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]`}
              placeholder={t("write-answer")}
              value={props.questions[props.questionIndex]?.options[2] ?? ""}
              onFocus={() => setOptionFocus(2)}
              onChange={(e) => {
                updateInputQuiz(2, e);
              }}
            />
            {!isEmpty(props.questions[props.questionIndex]?.options[2]) ? (
              props.questions[props.questionIndex]?.answerOption === "uniq" ? (
                <CheckboxContainer
                  rounded
                  imageUrl={`${config.storageUrl}/resources/checked.svg`}
                  className="bg-orange w-full h-full flex items-center justify-center"
                  key={props.questions[props.questionIndex].answer}
                >
                  <input
                    id="trigger-2"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(2)}
                    onChange={(e) => {
                      updateCheckboxQuiz(2, e, true);
                    }}
                  />
                  <label htmlFor="trigger-2" className="checker" />
                </CheckboxContainer>
              ) : (
                <CheckboxContainer
                  imageUrl={`${config.storageUrl}/resources/checked-square.svg`}
                  className="bg-orange w-full h-full flex items-center justify-center"
                >
                  <input
                    id="trigger-2"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(2)}
                    onChange={(e) => {
                      updateCheckboxQuiz(2, e);
                    }}
                  />
                  <label htmlFor="trigger-2" className="checker" />
                </CheckboxContainer>
              )
            ) : (
              <div
                className={`${
                  optionFocus === 2 ? "bg-orange" : "bg-white"
                } w-full h-full flex items-center justify-center`}
              />
            )}
          </div>

          <div className="w-full grid grid-cols-[40px_auto_40px] md:grid-cols-[50px_auto_50px] rounded-[4px] overflow-hidden">
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
            <input
              type="text"
              className={`px-4 h-[52px] text-right text-white md:h-[102px] ${
                !isEmpty(props.questions[props.questionIndex]?.options[3]) ? "bg-blue" : "bg-white"
              } focus:outline-none focus:bg-blue text-['Lato'] font-[900] text-[15px] md:text-[20px] leading-[18px] md:leading-[23px]`}
              placeholder={t("write-answer")}
              value={props.questions[props.questionIndex]?.options[3] ?? ""}
              onFocus={() => setOptionFocus(3)}
              onChange={(e) => {
                updateInputQuiz(3, e);
              }}
            />
            {!isEmpty(props.questions[props.questionIndex]?.options[3]) ? (
              props.questions[props.questionIndex]?.answerOption === "uniq" ? (
                <CheckboxContainer
                  rounded
                  imageUrl={`${config.storageUrl}/resources/checked.svg`}
                  className="bg-blue w-full h-full flex items-center justify-center"
                  key={props.questions[props.questionIndex].answer}
                >
                  <input
                    id="trigger-3"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(3)}
                    onChange={(e) => {
                      updateCheckboxQuiz(3, e, true);
                    }}
                  />
                  <label htmlFor="trigger-3" className="checker" />
                </CheckboxContainer>
              ) : (
                <CheckboxContainer
                  imageUrl={`${config.storageUrl}/resources/checked-square.svg`}
                  className="bg-blue w-full h-full flex items-center justify-center"
                >
                  <input
                    id="trigger-3"
                    type="checkbox"
                    defaultChecked={defaultTo(props.questions[props.questionIndex].answer, []).includes(3)}
                    onChange={(e) => {
                      updateCheckboxQuiz(3, e);
                    }}
                  />
                  <label htmlFor="trigger-3" className="checker" />
                </CheckboxContainer>
              )
            ) : (
              <div
                className={`${
                  optionFocus === 3 ? "bg-blue" : "bg-white"
                } w-full h-full flex items-center justify-center`}
              />
            )}
          </div>
        </div>
      )}

      {props.questions[props.questionIndex]?.type === triviaQuestionsTypes.trueFalse.key && (
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
                {t("true")}
              </div>
            </div>
            <CheckboxContainer
              rounded
              imageUrl={`${config.storageUrl}/resources/checked.svg`}
              className="bg-blue w-full h-full flex items-center justify-center"
            >
              <input
                id="trueCheckbox"
                type="checkbox"
                checked={props.questions[props.questionIndex]?.answer === true}
                onChange={(e) => {
                  updateInputTrueFalse(e, true);
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
                {t("false")}
              </div>
            </div>
            <CheckboxContainer
              rounded
              imageUrl={`${config.storageUrl}/resources/checked.svg`}
              className="bg-red w-full h-full flex items-center justify-center"
            >
              <input
                id="falseCheckbox"
                type="checkbox"
                checked={props.questions[props.questionIndex]?.answer === false}
                onChange={(e) => {
                  updateInputTrueFalse(e, false);
                }}
              />
              <label htmlFor="falseCheckbox" className="checker" />
            </CheckboxContainer>
          </div>
        </div>
      )}

      {props.questions[props.questionIndex]?.type === triviaQuestionsTypes.shortAnswer.key && (
        <div className="grid max-w-[786px] mx-auto my-4 gap-4">
          <div className="w-full h-[55px] md:h-[85px] p-4 bg-whiteLight rounded-[4px] grid grid-cols-[auto_144px]">
            <input
              type="text"
              className="text-['Lato'] bold-[500] text-[16px] leading-[19px] h-full bg-transparent focus:outline-none"
              value={correctAns}
              onChange={(e) => setCorrectAns(e.target.value)}
              placeholder={`${t("write-answer")}..`}
            />
            <ButtonAnt
              onClick={() => {
                onAddAnswer();
              }}
            >
              {t("add-answer")}
            </ButtonAnt>
          </div>
          <div className="w-full flex flex-wrap gap-[10px]">
            {props.questions[props.questionIndex]?.answer.map((answer, idx) => (
              <div
                className="bg-green px-4 py-2 text-['Lato'] text-white bold-[900] text-[22px] leading-[26px] rounded-[5px] flex items-center text-center relative"
                key={`${answer}-${idx}`}
              >
                {props.questions[props.questionIndex]?.answer?.[idx]}
                <div
                  className="absolute w-[15px] h-[15px] top-[-7px] right-[-7px] cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    onRemoveShortAnswer(answer, idx);
                  }}
                >
                  <Image
                    src={`${config.storageUrl}/resources/delete.svg`}
                    width="15px"
                    height="15px"
                    size="contain"
                    cursor="pointer"
                    filter="brightness(0%)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
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
    border-radius: ${(props) => (props.rounded ? "50%" : "0")};

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
