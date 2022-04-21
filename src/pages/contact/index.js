import React, { useState } from "reactn";
import { config } from "../../firebase";
import { Input, TextArea } from "../../components/form";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useFetch } from "../../hooks/useFetch";
import { useSendError, useTranslation } from "../../hooks";
import { SharpButton } from "../../components/common/SharpButton";
import { interests } from "../../components/common/DataList";
import isEmpty from "lodash/isEmpty";
import { MailOutlined } from "@ant-design/icons";
import { Image } from "../../components/common/Image";

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
    } catch (error) {
      sendError({ error, action: "sendEmail" });
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

        <div className="my-4 flex items-center justify-between">
          <div
            className="email text-white flex flex-col items-center"
            onClick={() => {
              if (typeof window === "undefined") return;
              window.open("mailto:events@ebombo.com.pe");
            }}
          >
            <Image
              src={`${config.storageUrl}/resources/email-white.svg`}
              size="contain"
              width="35px"
              height="35px"
              margin="5px 10px 0 0"
            />
          </div>

          <Image
            cursor="pointer"
            onClick={() => window.open("https://www.instagram.com/ebombo_/")}
            src={`${config.storageUrl}/resources/instagram-white.svg`}
            size="contain"
            width="35px"
            height="35px"
            margin="0"
          />

          <Image
            cursor="pointer"
            onClick={() => window.open("https://www.linkedin.com/company/ebombo/?viewAsMember=true")}
            src={`${config.storageUrl}/resources/linkedin-white.svg`}
            size="contain"
            width="35px"
            height="35px"
            margin="0 10px"
          />
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
                  prefix={<MailOutlined />}
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
                      setCurrentInterests([...currentInterests, interest.key]);

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

const ContactFormSection = styled.section`
  width: 100%;
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  background: ${(props) => props.theme.basic.white};

  .title {
    font-family: Lato, sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.secondary};
    margin-bottom: 16px;
    font-style: normal;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: 100;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.secondary};
    margin-bottom: 24px;
    font-style: normal;
  }

  .submit-container {
    text-align: center;

    button {
      display: inline-block;
    }

    ${mediaQuery.afterTablet} {
      text-align: left;
    }
  }

  form {
    max-width: 660px;

    input,
    textarea {
      padding-left: 24px;
      border-radius: 4px;
      margin: 7px 0;
      padding: 8px;
    }

    input {
      background: ${(props) => props.theme.basic.whiteDark};
      color: ${(props) => props.theme.basic.grayLight};
    }

    textarea {
      margin-top: 0.5rem;
      width: 100%;
      background: ${(props) => props.theme.basic.whiteDark};
      color: ${(props) => props.theme.basic.grayLight};
      border-radius: 6px;
      border: none;
      padding: 1rem;
      height: 100px;
    }
  }

  .img-contact {
    align-self: center;
    height: 80%;
    background-image: url(${`${config.storageUrl}/resources/event.svg`});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: right;
  }

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr 1fr;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .info-contact {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1rem;
    }
  }
`;
