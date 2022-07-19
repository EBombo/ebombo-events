import React, { useEffect, useMemo, useState } from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input } from "../../../../components/form";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config, firestore, firestoreTrivia } from "../../../../firebase";
import {
  questionTypes,
  questionTypesToLiterals,
  triviaQuestionsOptions,
  triviaQuestionsTimes,
  triviaQuestionsTypes,
} from "../../../../components/common/DataList";
import { AfterMobile, Desktop, Mobile, Tablet } from "../../../../constants";
import { FileUpload } from "../../../../components/common/FileUpload";
import isEmpty from "lodash/isEmpty";
import { TriviaQuestion } from "./TriviaQuestion";
import { ModalSettings } from "./ModalSettings";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../../utils";
import { spinLoader } from "../../../../components/common/loader";
import orderBy from "lodash/orderBy";
import { LeftOutlined } from "@ant-design/icons";
import { useTranslation } from "../../../../hooks";
import { WarningIconTooltip } from "./WarningIconTooltip";

export const Trivia = (props) => {
  const router = useRouter();
  const { gameId } = router.query;

  const { t } = useTranslation("pages.library.trivia");

  const [questions, setQuestions] = useState([
    {
      question: "",
      id: firestore.collection("questions").doc().id,
      type: "quiz",
      options: ["", "", "", ""],
      time: 20,
      answerOption: "uniq",
    },
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isVisibleModalSettings, setIsVisibleModalSettings] = useState(false);
  const [coverImgUrl, setCoverImgUrl] = useState(props.game ? props.game.coverImgUrl : null);
  const [ownBranding, setOwnBranding] = useState(props.game ? props.game.ownBranding : false);
  const [video, setVideo] = useState(props.game ? props.game.video : null);
  const [allowDuplicate, setAllowDuplicate] = useState(!!props.game?.ownBranding);
  const [visibility, setVisibility] = useState(props.game ? props.game.visibility : true);
  const [audio, setAudio] = useState(props.game ? props.game.audio : null);
  const [loading, setLoading] = useState(false);
  const [questionErrors, setQuestionErrors] = useState({});

  useEffect(() => {
    if (!props.game) return;

    setLoading(true);

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

  const newId = useMemo(() => {
    return props.game?.id ?? firestore.collection("hanged").doc().id;
  }, [props.game]);

  const schema = object().shape({
    name: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const deleteQuestion = () => {
    if (questions.length <= 1) return props.showNotification("Warning", "El minimo de preguntas es 1", "warning");

    const _questions = [...questions];

    _questions.splice(questionIndex, 1);

    setQuestionIndex(0);
    setQuestions(_questions);
  };

  const saveGame = async (data) => {
    setQuestionErrors({});

    const _game = {
      ...data,
      id: newId,
      questions,
      coverImgUrl,
      ownBranding,
      video,
      allowDuplicate,
      visibility,
      audio,
    };

    let valid = true;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      let isValidQuestion = true;

      if (question.type === "quiz") isValidQuestion = validateQuiz(question);
      if (question.type === "trueFalse") isValidQuestion = validateTrueFalse(question);
      if (question.type === "shortAnswer") isValidQuestion = validateShortAnswer(question);

      if (!isValidQuestion) {
        valid = isValidQuestion;
        setQuestionErrors((oldValue) => ({ ...oldValue, [i]: { message: "error-incomplete-form-question" } }));
      }
    }

    if (!valid) return;

    await props.submitGame(_game);
  };

  const validateQuiz = (question) => {
    let valid = true;
    // Check all options are filled.

    if (isEmpty(question.question)) valid = false;

    question.options.forEach((option) => {
      if (isEmpty(option)) valid = false;
    });

    // Check correct answer is set.
    if (!question.answer) valid = false;

    if (Array.isArray(question.answer) && question.answer.length === 0) valid = false;

    return valid;
  };

  const validateTrueFalse = (question) => {
    if (isEmpty(question.question)) return false;

    return question.answer === true || question.answer === false;
  };

  const validateShortAnswer = (question) => {
    if (isEmpty(question.question)) return false;

    return question.answer.length > 0;
  };

  if (loading) return spinLoader();

  // TODO: Consider refactoring, the component is long.
  return (
    <div className="w-screen h-full">
      {isVisibleModalSettings && (
        <ModalSettings
          isVisibleModalSettings={isVisibleModalSettings}
          setIsVisibleModalSettings={setIsVisibleModalSettings}
          setCoverImgUrl={setCoverImgUrl}
          coverImgUrl={coverImgUrl}
          setOwnBranding={setOwnBranding}
          ownBranding={ownBranding}
          setVideo={setVideo}
          video={video}
          setVisibility={setVisibility}
          visibility={visibility}
          setAudio={setAudio}
          audio={audio}
          setAllowDuplicate={setAllowDuplicate}
          allowDuplicate={allowDuplicate}
          newId={newId}
          path={`/games/trivia/${props.newId}`}
          {...props}
        />
      )}
      <form className="grid" onSubmit={handleSubmit(saveGame)}>
        <div className="w-full bg-primary py-2 px-4 flex items-center gap-[5px] md:gap-4">
          <Mobile>
            <LeftOutlined width="18px" height="25px" style={{ color: "white" }} onClick={() => router.back()} />
          </Mobile>
          <AfterMobile>
            <Image
              src={`${config.storageUrl}/resources/ebombo-white.png`}
              height="auto"
              width="125px"
              size="contain"
              margin="0"
              cursor="pointer"
              onClick={() => router.back()}
            />
          </AfterMobile>
          <div className=" w-full max-w-[300px] ">
            <Input
              defaultValue={get(props, "game.name", "")}
              variant="primary"
              type="text"
              name="name"
              ref={register}
              error={errors.name}
              placeholder={t("event-name")}
            />
          </div>
          <ButtonAnt
            variant="contained"
            color="secondary"
            size="small"
            margin={"0 0 0 10px"}
            onClick={() => setIsVisibleModalSettings(true)}
            disabled={props.isLoading}
          >
            {t("settings")}
          </ButtonAnt>
          <ButtonAnt color="default" size="small" margin={"0 0 0 10px"} onClick={() => router.back()}>
            {t("cancel")}
          </ButtonAnt>
        </div>

        <div className="w-full h-[calc(100vh-50px)] overflow-auto grid md:grid-cols-[180px_auto_260px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
          <div className="w-full h-[115px] md:h-full overflow-auto grid md:grid-rows-[auto_100px] bg-white">
            <div className="w-full h-[full] flex items-center md:items-start md:flex-col overflow-auto">
              {questions.map((question, idx) => (
                <div
                  className={`cursor-pointer bg-${
                    question.id === questions[questionIndex]?.id ? "gray" : "white"
                  } h-full w-[115px] min-w-[115px] flex flex-col justify-center items-center md:h-[117px] md:min-h-[117px] md:w-full`}
                  onClick={() => setQuestionIndex(idx)}
                  key={question.id}
                >
                  <div className="relative">
                    <div className="text-['Lato'] font-bold text-[12px] leading-[14px] text-grayLight mb-[5px]">
                      {idx + 1}. {t(questionTypesToLiterals[question.type])}
                    </div>
                    <Image
                      src={question.imageUrl ?? `${config.storageUrl}/resources/question-${question?.type}.svg`}
                      size="contain"
                      width="75px"
                      height="45px"
                      desktopHeight="75px"
                      desktopWidth="128px"
                    />
                    <div className="absolute top-2/4 -right-2">
                      <WarningIconTooltip
                        visible={idx in questionErrors}
                        message={t(questionErrors[idx]?.message)}
                        duration={3000}
                      />
                    </div>
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
                      time: 20,
                      answerOption: "uniq",
                    };

                    setQuestions([...questions, _question]);
                    setQuestionIndex(questions.length);
                  }}
                  size="small"
                  margin="auto"
                >
                  {t("add-question")}
                </ButtonAnt>
              </div>
            </div>
            <Desktop>
              <div className="grid items-center justify-center">
                <ButtonAnt
                  color="success"
                  size="big"
                  htmlType="submit"
                  disabled={props.isLoading}
                  loading={props.isLoading}
                >
                  {t("save")}
                </ButtonAnt>
              </div>
            </Desktop>
          </div>

          <div className="w-full h-full p-4 md:p-8 md:overflow-auto">
            <input
              type="text"
              className="w-full h-[80px] rounded-[4px] bg-whiteLight text-center text-['Lato'] font-[500] text-[25px] leading-[30px] text-grayLight"
              placeholder={`${t("write-question")}...`}
              value={questions[questionIndex]?.question || ""}
              onChange={(e) => {
                const _questions = [...questions];
                _questions[questionIndex].question = e.target.value;
                setQuestions(_questions);
              }}
            />

            <div className="mx-auto my-4 max-w-[786px]" key={questions[questionIndex]?.fileUrl ?? ""}>
              <FileUpload
                file={questions[questionIndex]?.fileUrl ?? null}
                fileName="questionImage"
                filePath={`questions/${questions[questionIndex]?.id}`}
                preview={true}
                sizes="550x550"
                width="100%"
                height="131px"
                desktopHeight="260px"
                afterUpload={(filesUrls) => {
                  const _questions = [...questions];
                  _questions[questionIndex].fileUrl = filesUrls[0].url;
                  setQuestions(_questions);
                }}
              />
            </div>

            <TriviaQuestion
              questions={questions}
              setQuestions={setQuestions}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
            />
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
                  {t("question-type")}
                </div>
              </div>
              <select
                className="w-full border border-grayLighten border-[1px] bg-white rounded px-3 py-2 outline-none"
                onChange={(event) => {
                  const value = event.target.value;
                  const _questions = [...questions];
                  _questions[questionIndex].type = value;
                  _questions[questionIndex].answer = [];
                  _questions[questionIndex].answerOption = value === "shortAnswer" ? "multiple" : "uniq";
                  setQuestions(_questions);
                }}
                value={questions[questionIndex]?.type}
              >
                {triviaQuestionsTypes.map((type) => (
                  <option className="py-1" key={type.key} value={type.key}>
                    {t(type.value)}
                  </option>
                ))}
              </select>
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
                  {t("time-limit")}
                </div>
              </div>
              <select
                className="w-full border border-grayLighten border-[1px] bg-white rounded px-3 py-2 outline-none mb-2"
                onChange={(event) => {
                  const value = event.target.value;
                  const _questions = [...questions];
                  _questions[questionIndex].time = parseInt(value);
                  setQuestions(_questions);
                }}
                value={questions[questionIndex]?.time}
              >
                {triviaQuestionsTimes.map((time) => (
                  <option className="py-1" key={time.key} value={time.key}>
                    {time.value}
                  </option>
                ))}
              </select>
              <div className="flex items-center justify-start mb-[5px]">
                <Image
                  src={`${config.storageUrl}/resources/options-icon.svg`}
                  width="18px"
                  height="18px"
                  size="contain"
                  margin="0 5px 0 0"
                />
                <div className="text-grayLight text-['Lato'] font-bold text-[11px] leading-[13px]">
                  {t("answer-options")}
                </div>
              </div>
              <select
                className="w-full border border-grayLighten border-[1px] bg-white rounded px-3 py-2 outline-none"
                disabled={
                  questions[questionIndex]?.type === "shortAnswer" || questions[questionIndex]?.type === "trueFalse"
                }
                onChange={(event) => {
                  const value = event.target.value;
                  const _questions = [...questions];
                  _questions[questionIndex].answerOption = value;
                  _questions[questionIndex].answer = [];
                  _questions[questionIndex].answerPattern = [];
                  setQuestions(_questions);
                }}
                value={questions[questionIndex]?.answerOption}
              >
                {triviaQuestionsOptions.map((option) => (
                  <option className="py-1" key={option.key} value={option.key}>
                    {t(option.value)}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-end">
                <Tablet>
                  <ButtonAnt htmlType="submit" margin="0 10px 0 0" disabled={props.isLoading} loading={props.isLoading}>
                    Guardar
                  </ButtonAnt>
                </Tablet>
                <ButtonAnt color="default" onClick={() => deleteQuestion()}>
                  {t("delete")}
                </ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
