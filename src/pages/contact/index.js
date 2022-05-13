import React, { useState } from "reactn";
import { config } from "../../firebase";
import { Input, TextArea } from "../../components/form";
import { Image } from "ebombo-components";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { useSendError, useTranslation } from "../../hooks";
import { SharpButton } from "../../components/common/SharpButton";
import { interests } from "../../components/common/DataList";
import isEmpty from "lodash/isEmpty";

export const ContactForm = (props) => {
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const { t } = useTranslation("pages.contact-us");

  const [loadingSendingEmail, setLoadingSendingEmail] = useState(false);
  const [currentInterests, setCurrentInterests] = useState([]);

  const schema = object().shape({
    phoneNumber: string().required(),
    message: string().required(),
    email: string().required(),
    name: string().required(),
  });

  const { register, handleSubmit, errors, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const sendEmail = async (data) => {
    if (isEmpty(currentInterests)) props.showNotification("Error", t("interests-selected"));

    setLoadingSendingEmail(true);
    try {
      const { error } = await Fetch(`${config.serverUrl}/api/contact`, "POST", {
        ...data,
        interests: currentInterests,
      });

      if (error) throw Error(error);

      reset({
        message: null,
        email: null,
        phoneNumber: null,
        name: null,
      });

      setCurrentInterests([]);
      // TODO: Mostrar un mensaje de success.
    } catch (error) {
      sendError(error, "sendEmail");
    }
    setLoadingSendingEmail(false);
  };

  return (
    <div ref={props.refProp} className="bg-secondary bg-cover bg-no-repeat bg-pattern">
      <div className="px-8 py-4 md:py-8 md:px-12 max-w-[680px] mx-auto">
        <div className="text-['Lato'] text-whiteLight font-[700] text-[32px] leading-[36px] md:text-[48px] md:leading-[52px] w-full text-center my-4">
          {t("title")}
        </div>

        <div className="text-['Lato'] text-whiteLight font-[600] text-[16px] leading-[20px] w-full text-center my-4">
          {t("description")}
        </div>

        <div className="my-4 flex items-center flex-col md:flex-row md:justify-between">
          <div
            className="flex flex-row items-center gap-[5px] md:flex-col hover:bg-orangeLight w-full p-2 rounded-[10px] cursor-pointer md:w-[120px]"
            onClick={() => {
              if (typeof window === "undefined") return;
              window.open("mailto:events@ebombo.com.pe");
            }}
          >
            <Image
              src={`${config.storageUrl}/resources/email-white.svg`}
              size="contain"
              width="25px"
              height="25px"
              margin="0"
            />
            <div className="w-full text-white font-['Lato'] text-[16px] leading-[19px] md:text-center no-wrap">
              events@ebombo.com
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5px] md:flex-col hover:bg-orangeLight w-full p-2 rounded-[10px] cursor-pointer md:w-[120px]">
            <Image
              cursor="pointer"
              onClick={() => window.open("https://www.instagram.com/ebombo_/")}
              src={`${config.storageUrl}/resources/instagram-white.svg`}
              size="contain"
              width="25px"
              height="25px"
              margin="0"
            />
            <div className="w-full text-white font-['Lato'] text-[16px] leading-[19px] md:text-center no-wrap">
              linkedin.com/company/ebombo
            </div>
          </div>

          <div className="flex flex-row items-center gap-[5px] md:flex-col hover:bg-orangeLight w-full p-2 rounded-[10px] cursor-pointer md:w-[120px]">
            <Image
              cursor="pointer"
              onClick={() => window.open("https://www.linkedin.com/company/ebombo/?viewAsMember=true")}
              src={`${config.storageUrl}/resources/linkedin-white.svg`}
              size="contain"
              width="25px"
              height="25px"
              margin="0"
            />
            <div className="w-full text-white font-['Lato'] text-[16px] leading-[19px] md:text-center no-wrap">
              ebombo_
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(sendEmail)} className="w-full bg-white rounded-[10px] p-4 md:p-8">
          <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-secondary mb-4">{t("write-us")}</div>
          <div className="grid md:gap-4 md:grid-cols-[1fr_1fr]">
            <div className="mb-4">
              <div className="mb-4">
                <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-grayLight mb-[5px]">
                  {t("name")}
                </div>
                <Input
                  prefix={
                    <Image
                      className="inline-block"
                      height="18px"
                      width="18px"
                      src={`${config.storageUrl}/resources/user-icon-gray.svg`}
                    />
                  }
                  error={errors.name}
                  type="text"
                  ref={register}
                  name="name"
                  placeholder={t("input-name-placeholder")}
                />
              </div>

              <div className="mb-4">
                <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-grayLight mb-[5px]">
                  {t("email")}
                </div>
                <Input
                  prefix={
                    <Image
                      className="inline-block"
                      height="18px"
                      width="18px"
                      src={`${config.storageUrl}/resources/email-icon-gray.svg`}
                    />
                  }
                  error={errors.email}
                  type="email"
                  ref={register}
                  name="email"
                  placeholder={t("input-email-placeholder")}
                />
              </div>

              <div className="mb-4">
                <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-grayLight mb-[5px]">
                  {t("phone")}
                </div>
                <Input
                  prefix={
                    <Image
                      className="inline-block"
                      height="18px"
                      width="18px"
                      src={`${config.storageUrl}/resources/phone-icon-gray.svg`}
                    />
                  }
                  error={errors.phoneNumber}
                  type="text"
                  ref={register}
                  name="phoneNumber"
                  placeholder={t("input-phone-placeholder")}
                />
              </div>
            </div>
            <div>
              <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-grayLight mb-[5px]">
                {t("message")}
              </div>
              <TextArea
                color="#00000"
                border="1px solid #C4C4C4"
                background="#FAFAFA"
                error={errors.message}
                name="message"
                ref={register}
                rows="8"
                placeholder={t("textarea-placeholder")}
              />
            </div>
          </div>

          <div className="text-['Lato'] font-[800] text-[16px] leading-[19px] text-grayLight mb-4">{t("service")}</div>

          <div className="mb-4">
            <div className="text-secondary mb-4">{t("event-objectives")}</div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interests.map((interest) => (
                <div
                  key={interest.key}
                  onClick={() => {
                    if (!currentInterests.includes(interest.key))
                      return setCurrentInterests([...currentInterests, interest.key]);

                    const currentGoalsUpdated = currentInterests.filter((interest_) => interest_ !== interest.key);
                    return setCurrentInterests(currentGoalsUpdated);
                  }}
                  className={`text-xm text-center bg-white rounded-md border-2 py-2 px-1 cursor-pointer relative ${
                    currentInterests.includes(interest.key) ? "border-primary" : "border-grayLighten"
                  }`}
                >
                  {t(interest.title)}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-center">
            <SharpButton
              prefixIcon="wink"
              loading={loadingSendingEmail}
              disabled={loadingSendingEmail}
              htmlType="submit"
            >
              {t("send")}
            </SharpButton>
          </div>
        </form>
      </div>
    </div>
  );
};
