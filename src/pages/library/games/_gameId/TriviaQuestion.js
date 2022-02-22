import React, { useState } from "react";
import { ButtonAnt } from "../../../../components/form";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { mediaQuery } from "../../../../constants";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";

export const TriviaQuestion = (props) => {
  const [optionFocus, setOptionFocus] = useState(0);
  const [correctAns, setCorrectAns] = useState("");

  return (
    <>
      {props.questions[props.questionIndex].type === "quiz" && (
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
                  defaultChecked={props.questions[props.questionIndex].answer === 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const _questions = [...props.questions];
                      _questions[props.questionIndex].answer = 0;
                      props.setQuestions(_questions);
                    }
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
              value={props.questions[props.questionIndex].options[0] ?? ""}
              onFocus={() => setOptionFocus(0)}
              onChange={(e) => {
                const _option = e.target.value;
                const newOptions = [...props.questions[props.questionIndex].options];
                newOptions[0] = _option;

                const _questions = [...props.questions];
                _questions[props.questionIndex].options = newOptions;
                props.setQuestions(_questions);
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
                  defaultChecked={props.questions[props.questionIndex].answer === 1}
                  onChange={(e) => {
                    const _questions = [...props.questions];
                    _questions[props.questionIndex].answer = 1;
                    props.setQuestions(_questions);
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
              value={props.questions[props.questionIndex].options[1] ?? ""}
              onFocus={() => setOptionFocus(1)}
              onChange={(e) => {
                const _option = e.target.value;
                const newOptions = [...props.questions[props.questionIndex].options];
                newOptions[1] = _option;

                const _questions = [...props.questions];
                _questions[props.questionIndex].options = newOptions;
                props.setQuestions(_questions);
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
                  defaultChecked={props.questions[props.questionIndex].answer === 2}
                  onChange={(e) => {
                    const _questions = [...props.questions];
                    _questions[props.questionIndex].answer = 2;
                    props.setQuestions(_questions);
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
              value={props.questions[props.questionIndex].options[2] ?? ""}
              onFocus={() => setOptionFocus(2)}
              onChange={(e) => {
                const _option = e.target.value;
                const newOptions = [...props.questions[props.questionIndex].options];
                newOptions[2] = _option;

                const _questions = [...props.questions];
                _questions[props.questionIndex].options = newOptions;
                props.setQuestions(_questions);
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
                  defaultChecked={props.questions[props.questionIndex].answer === 3}
                  onChange={(e) => {
                    const _questions = [...props.questions];
                    _questions[props.questionIndex].answer = 3;
                    props.setQuestions(_questions);
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
              value={props.questions[props.questionIndex].options[3] ?? ""}
              onFocus={() => setOptionFocus(3)}
              onChange={(e) => {
                const _option = e.target.value;
                const newOptions = [...props.questions[props.questionIndex].options];
                newOptions[3] = _option;

                const _questions = [...props.questions];
                _questions[props.questionIndex].options = newOptions;
                props.setQuestions(_questions);
              }}
            />
          </div>
        </div>
      )}

      {props.questions[props.questionIndex].type === "trueFalse" && (
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
                checked={props.questions[props.questionIndex].answer === true}
                onChange={(e) => {
                  if (e.target.checked) {
                    const _questions = [...props.questions];
                    _questions[props.questionIndex].answer = true;
                    props.setQuestions(_questions);
                  }
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
                checked={props.questions[props.questionIndex].answer === false}
                onChange={(e) => {
                  if (e.target.checked) {
                    const _questions = [...props.questions];
                    _questions[props.questionIndex].answer = false;
                    props.setQuestions(_questions);
                  }
                }}
              />
              <label htmlFor="falseCheckbox" className="checker" />
            </CheckboxContainer>
          </div>
        </div>
      )}

      {props.questions[props.questionIndex].type === "shortAnswer" && (
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

                const _questions = [...props.questions];
                _questions[questionIndex].answer = [...props.questions[props.questionIndex].answer, correctAns];
                props.setQuestions(_questions);
                setCorrectAns("");
              }}
            >
              Añadir respuesta
            </ButtonAnt>
          </div>
          <div className="w-full grid gap-4 grid-cols-[repeat(auto-fill,minmax(100px,auto))]">
            {props.questions[props.questionIndex]?.answer.map((answer, idx) => (
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
