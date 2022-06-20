import React, { useState } from "reactn";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { config, firestoreTrivia } from "../../../../../firebase";
import { spinLoader } from "../../../../../components/common/loader";
import { snapshotToArray } from "../../../../../utils";
import { Collapse, Space } from "antd";
import { Image } from "../../../../../components/common/Image";
import { questionTypes } from "../../../../../components/common/DataList";
import orderBy from "lodash/orderBy";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";

const { Panel } = Collapse;

export const TriviaView = (props) => {
  const router = useRouter();
  const { gameId } = router.query;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = () =>
      firestoreTrivia
        .collection("games")
        .doc(gameId)
        .collection("questions")
        .onSnapshot((questionsSnapshot) => {
          const questions = snapshotToArray(questionsSnapshot);

          setQuestions(orderBy(questions, "questionNumber"));
          setLoading(false);
        });

    fetchQuestions();
  }, [props.game]);

  if (loading) return spinLoader();

  return (
    <TriviaContainer className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern">
      <div className="grid gap-4 m-2 p-2 bg-[#221545] rounded-[4px] bg-opacity-50 overflow-auto md:m-8 md:p-8">
        <div className="flex flex-col items-center justify-center overflow-auto md:justify-start md:items-start">
          <div className="text-['Lato'] font-bold text-[15px] leading-[18px] my-4 text-whiteDark">Preguntas</div>

          <Space direction="vertical" className="w-full">
            {questions.map((question, index) => (
              <Collapse className="w-full" key={`${question.id}-${index}`}>
                <Panel
                  showArrow={false}
                  header={
                    <div className="w-full h-[92px] grid grid-cols-[auto_100px]">
                      <div className="grid gap-[10px] p-4">
                        <div className="flex items-center">
                          <div className="text-blackDarken text-['Lato'] text-[12px] leading-[14px] mr-5px">
                            {index + 1}.
                          </div>
                          <Image
                            src={`${config.storageUrl}/resources/${question.type}.svg`}
                            width="18px"
                            height="18px"
                            size="contain"
                            margin="0 5px"
                          />
                          <div className="text-['Lato'] text-[12px] leading-[14px] text-grayLight">
                            {questionTypes[question.type]}
                          </div>
                        </div>
                        <div className="text-['Lato'] text-[14px] leading-[17px] font-bold text-blackDarken">
                          {question.question}
                        </div>
                      </div>

                      <Image
                        src={
                          isEmpty(question.fileUrl)
                            ? `${config.storageUrl}/resources/empty-cover.svg`
                            : question.fileUrl
                        }
                        className="min-h-full"
                        width="100%"
                        height="100%"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  }
                  key={question.id}
                >
                  {question.type === "quiz" ? (
                    <div>
                      {question.options.map((option, index) => (
                        <div className="flex items-center justify-between h-[48px] px-4 py-2 border-whiteDark border-b-[1px]">
                          <div className="flex items-center">
                            <Image
                              src={`${config.storageUrl}/resources/trivia/${(index + 1) % 4}.svg`}
                              width="25px"
                              height="27px"
                              size="contain"
                              margin="0 10px 0 0"
                            />
                            <div className="text-['Lato'] text-[11px] leading-[13px] text-grayLight">{option}</div>
                          </div>
                          <Image
                            src={`${config.storageUrl}/resources/${
                              question.answer[0] === index ? "checked" : "wrong"
                            }.svg`}
                            width="25px"
                            height="25px"
                            size="contain"
                            margin="0"
                          />
                        </div>
                      ))}
                    </div>
                  ) : question.type === "shortAnswer" ? (
                    <div>
                      {question.answer.map((option, index) => (
                        <div className="flex items-center justify-between h-[48px] px-4 py-2 border-whiteDark border-b-[1px]">
                          <div className="flex items-center">
                            <Image
                              src={`${config.storageUrl}/resources/trivia/${(index + 1) % 4}.svg`}
                              width="25px"
                              height="27px"
                              size="contain"
                              margin="0 10px 0 0"
                            />
                            <div className="text-['Lato'] text-[11px] leading-[13px] text-grayLight">{option}</div>
                          </div>
                          <Image
                            src={`${config.storageUrl}/resources/checked.svg`}
                            width="25px"
                            height="25px"
                            size="contain"
                            margin="0"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between h-[48px] px-4 py-2 border-whiteDark border-b-[1px]">
                        <div className="flex items-center">
                          <Image
                            src={`${config.storageUrl}/resources/trivia/true.svg`}
                            width="25px"
                            height="27px"
                            size="contain"
                            margin="0 10px 0 0"
                          />
                          <div className="text-['Lato'] text-[11px] leading-[13px] text-grayLight">Verdadero</div>
                        </div>
                        <Image
                          src={`${config.storageUrl}/resources/${question.answer ? "checked" : "wrong"}.svg`}
                          width="25px"
                          height="25px"
                          size="contain"
                          margin="0"
                        />
                      </div>
                      <div className="flex items-center justify-between h-[48px] px-4 py-2 border-whiteDark border-b-[1px]">
                        <div className="flex items-center">
                          <Image
                            src={`${config.storageUrl}/resources/trivia/false.svg`}
                            width="25px"
                            height="27px"
                            size="contain"
                            margin="0 10px 0 0"
                          />
                          <div className="text-['Lato'] text-[11px] leading-[13px] text-grayLight">Falso</div>
                        </div>
                        <Image
                          src={`${config.storageUrl}/resources/${!question.answer ? "checked" : "wrong"}.svg`}
                          width="25px"
                          height="25px"
                          size="contain"
                          margin="0"
                        />
                      </div>
                    </div>
                  )}
                </Panel>
              </Collapse>
            ))}
          </Space>
        </div>
      </div>
    </TriviaContainer>
  );
};

const TriviaContainer = styled.div`
  .ant-collapse-header,
  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-collapse {
    border: 0 !important;
  }

  .ant-collapse-item {
    border: 0 !important;
  }
`;
