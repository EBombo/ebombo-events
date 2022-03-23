import React, { useEffect, useMemo, useState } from "reactn";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input } from "../../../../components/form";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config, firestore, firestoreTrivia } from "../../../../firebase";
import {
  triviaQuestionsOptions,
  triviaQuestionsTimes,
  triviaQuestionsTypes
} from "../../../../components/common/DataList";
import { Desktop, Tablet } from "../../../../constants";
import { FileUpload } from "../../../../components/common/FileUpload";
import isEmpty from "lodash/isEmpty";
import { TriviaQuestion } from "./TriviaQuestion";
import { ModalSettings } from "./ModalSettings";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../../utils";
import { spinLoader } from "../../../../components/common/loader";
import orderBy from "lodash/orderBy";

export const Trivia = (props) => {
  const router = useRouter();

  const { gameId } = router.query;

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
          setLoading(false)
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

      if (question.type === "quiz") valid = validateQuiz(question);
      if (question.type === "trueFalse") valid = validateTrueFalse(question);
      if (question.type === "shortAnswer") valid = validateShortAnswer(question);

      if (!valid) break;
    }

    if (!valid) return props.showNotification("ERROR", "Verificar que todas las preguntas esten completas.", "error");

    await props.submitGame(_game);
  };

  const validateQuiz = (question) => {
    let valid = true;
    // check all options are filled
    question.options.forEach((option) => {
      if (isEmpty(option)) valid = false;
    });

    // check correct answer is set
    if (!question.answer) valid = false;

    if (Array.isArray(question.answer) && question.answer.length === 0) valid = false;

    return valid;
  };

  const validateTrueFalse = (question) => {
    return question.answer === true || question.answer === false;
  };

  const validateShortAnswer = (question) => {
    return question.answer.length > 0;
  };

  if (loading) return spinLoader();

  return (
    <div className="w-screen">
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
        <div className="w-full bg-primary py-2 px-4 flex items-center justufy-between">
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
          <ButtonAnt
            variant="contained"
            color="secondary"
            size="small"
            margin={"0 0 0 10px"}
            onClick={() => setIsVisibleModalSettings(true)}
            disabled={props.isLoading}
          >
            Ajustes
          </ButtonAnt>
        </div>
        <div className="w-full h-[calc(100vh-102px)] overflow-auto grid md:grid-cols-[180px_auto_260px] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
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
                      time: 20,
                      answerOption: "uniq",
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
                <ButtonAnt
                  color="success"
                  size="big"
                  htmlType="submit"
                  disabled={props.isLoading}
                  loading={props.isLoading}
                >
                  Guardar
                </ButtonAnt>
              </div>
            </Desktop>
          </div>

          <div className="w-full h-full p-4 md:p-8 md:overflow-auto">
            <input
              type="text"
              className="w-full h-[80px] rounded-[4px] bg-whiteLight text-center text-['Lato'] font-[500] text-[25px] leading-[30px] text-grayLight"
              placeholder="Escribe tu pregunta..."
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
                sizes="250x250"
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
                  Tipo de pregunta
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
                    {type.value}
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
                  Límite de tiempo
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
                  Opciones de respuesta
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
                  setQuestions(_questions);
                }}
                value={questions[questionIndex]?.answerOption}
              >
                {triviaQuestionsOptions.map((option) => (
                  <option className="py-1" key={option.key} value={option.key}>
                    {option.value}
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
                  Borrar
                </ButtonAnt>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
