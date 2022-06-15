import React, { useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt, Input, TextArea } from "../../../components/form";
import { config, firestore } from "../../../firebase";
import { gifts, goals, interactions } from "./DetailsEvent";
import get from "lodash/get";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { useSendError, useTranslation } from "../../../hooks";
import { useRouter } from "next/router";
import moment from "moment";
import { timeoutPromise } from "../../../utils/promised";
import { gaEvent } from "../../../utils";

const eventBy = {
  participants: "asistente",
  events: "evento",
};

export const ResumeEvent = (props) => {
  const validationSchema = object().shape({
    name: string().required(),
    lastName: string().required(),
    email: string()
      .required()
      .email()
      .test("", "Email invalid!", (email_) => !email_.includes("yopmail.com")),
    password: string().required().min(6),
  });

  const router = useRouter();
  const { eventId } = router.query;

  const { signUp } = useAuth();

  const { sendError } = useSendError();

  const { t } = useTranslation("pages.events");

  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("adminGames");
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");

  const signUpUser = async (user) => {
    const eventMapped = {
      size: props.size,
      budget: props.budget,
      details: props.details,
      dates: props.dates.map((date) => {
        const startDateFormatted = `${date.month.format("DD/MM/YYYY")} ${date.start.format("h:mm a")}`;
        const endDateFormatted = `${date.month.format("DD/MM/YYYY")} ${date.end.format("h:mm a")}`;

        return {
          startAt: moment(startDateFormatted, "DD/MM/YYYY h:mm a").toDate(),
          endAt: moment(endDateFormatted, "DD/MM/YYYY h:mm a").toDate(),
        };
      }),
      resume: props.resume,
    };

    // Register event on firebase.
    if (authUser) {
      await registerEvent(eventMapped);
      return router.push("/library/events");
    }

    // Create account and register event on backend side.
    await signUp({
      ...user,
      event: eventMapped,
    });

    props.showNotification("OK", "Event was created!", "success");

    // TODO: Consider use listener to redirect after the account is created.
    await timeoutPromise(5000);

    await router.push("/library/events");

    setIsVisibleModal(true);
  };

  const registerEvent = async (event) => {
    try {
      setIsLoading(true);
      const eventRef = firestore.collection("events");

      const eventId_ = eventId === "new" ? eventRef.doc().id : eventId;

      await eventRef.doc(eventId_).set(
        {
          ...event,
          ...event.dates[0],
          userId: authUser.id,
          manageByUser: false,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
          id: eventId_,
        },
        { merge: true }
      );

      /** Google event. **/
      gaEvent("user", "create-event", "create-event-manage-by-ebombo");
    } catch (error) {
      sendError(error, "registerEvent");
    }
    setIsLoading(false);
  };

  const { register, errors, handleSubmit } = useForm({
    validationSchema: authUser ? null : validationSchema,
    reValidateMode: "onSubmit",
  });

  return (
    <div>
      {/*TODO: Add modal to redirect events list page.*/}
      {/*String(isVisibleModal)*/}
      <div className="text-secondary mb-4 text-base">{t("send-your-summary")}</div>

      <div className="text-primary text-4xl mb-6">{t("summary-event")}</div>

      <div className="grid md:grid-cols-2 gap-5 mb-4">
        <div className="block">
          <div className="w-full grid md:flex gap-4 mb-4">
            <div className="w-full text-base text-center bg-white rounded-md border-2 border-grayLighten py-4 px-1 grid grid-cols-[1fr_4fr]">
              <img src={`${config.storageUrl}/resources/events/user.svg`} className=" w-6 h-6 mx-3" />

              <div>
                {props.size} {eventBy.participants}s
              </div>
            </div>

            <div className="w-full text-base text-center bg-white rounded-md border-2 border-grayLighten py-4 px-1 grid grid-cols-[1fr_4fr]">
              <img src={`${config.storageUrl}/resources/events/event.svg`} className=" w-6 h-6 mx-3" />
              {props.budget.budget} por {eventBy[props.budget.currentTab]}
            </div>
          </div>

          <div className="w-full h-auto rounded-md border-2 border-grayLighten py-4 px-1 grayLighten px-3">
            <div className="grid grid-cols-2">
              <div>
                <div className="text-secondary">{t("details")}</div>
                <div className="text-xl text-secondary">
                  {t(interactions.find((interaction) => interaction.key === props.details.interaction)?.title)}
                </div>
              </div>

              <div>
                <div className="text-secondary">{t("resume-gift")}</div>
                <div className="text-xl text-secondary">
                  {t(gifts.find((gift) => gift.key === props.details.gift)?.title)}
                </div>
              </div>
            </div>

            {goals
              .filter((goal) => props.details.goals.includes(goal.key))
              .map((goal) => (
                <div key={goal.title} className="flex text-secondary">
                  <div className="bg-primary w-2 h-2 mt-2 mr-2 ml-4 rounded-md" /> {t(goal.title)}
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">{t("additional-comment")}</div>
          <TextArea rows={7} disabled variant="primary" defaultValue={props.details.additional} />
        </div>
      </div>

      <div className="text-secondary mb-4 text-base">{t("tentative-dates")}.</div>

      <div className="grid md:flex gap-3">
        {props.dates.map((date) => (
          <div
            key={date.id}
            className="w-full md:w-[200px] text-base text-center bg-white rounded-md border-2 border-grayLighten py-2 px-1 mb-4"
          >
            <div className="text-secondary font-bold">{date.month.format("DD MMMM YYYY")}</div>
            <div className="text-secondary">
              {date.start.format("h:mm a")} - {date.end.format("h:mm a")}
            </div>
          </div>
        ))}
      </div>

      <div className="text-secondary mb-4 text-base mt-4">{t("chosen-dynamics")}</div>

      <div className="grid md:flex gap-3">
        {games
          .filter((game) => props.details.games.includes(game.id))
          .map((game) => (
            <div
              key={game.id}
              className="w-full md:w-[300px] text-base bg-white rounded-md border-2 border-grayLighten py-2 px-1 mb-4 grid grid-cols-[1fr_3fr]"
            >
              <img
                src={`${config.storageUrl}/resources/games/${get(game, "name", "")}-icon.svg`}
                className=" w-6 h-6 mx-3"
              />

              {game.name}
            </div>
          ))}
      </div>

      {authUser ? null : <div className="text-secondary mb-4 text-base mt-4">{t("register-and-send-summary")}</div>}

      <form onSubmit={handleSubmit(signUpUser)} autoComplete="off" className="form-container" noValidate>
        {authUser ? null : (
          <div className="grid md:grid-cols-2 gap-2 md:w-9/12">
            <Input
              error={errors.name}
              type="text"
              ref={register}
              height="40px"
              name="name"
              background="white"
              autoComplete="off"
              placeholder={t("name")}
            />
            <Input
              error={errors.lastName}
              type="text"
              ref={register}
              height="40px"
              name="lastName"
              background="white"
              autoComplete="off"
              placeholder={t("last-name")}
            />
            <Input
              error={errors.email}
              defaultValue={props.email}
              type="email"
              ref={register}
              name="email"
              height="40px"
              background="white"
              autoComplete="off"
              placeholder={t("email")}
            />
            <Input
              error={errors.password}
              type="password"
              ref={register}
              height="40px"
              name="password"
              autoComplete="off"
              background="white"
              placeholder={t("password")}
            />
          </div>
        )}

        <div className="flex mt-4">
          <Anchor
            underlined
            margin="auto 0"
            variant="secondary"
            onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1]?.key)}
          >
            {t("back")}
          </Anchor>

          <ButtonAnt
            htmlType="submit"
            color="primary"
            variant="contained"
            fontSize="18px"
            size="big"
            margin="1rem 0 auto auto"
            loading={isLoadingCreateUser || isLoading}
            disabled={isLoadingUser || isLoadingCreateUser || isLoading}
          >
            {eventId === "new" ? t("send") : t("update")}
          </ButtonAnt>
        </div>
      </form>
    </div>
  );
};
