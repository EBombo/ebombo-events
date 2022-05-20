import React, { useEffect } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { useRouter } from "next/router";
import { CheckOutlined } from "@ant-design/icons";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useTranslation } from "../../hooks";
import { SharpButton } from "../../components/common/SharpButton";

const options = ["opt1", "opt2", "opt3", "opt4"];

export const Options = (props) => {
  const router = useRouter();

  const { t } = useTranslation("landing.options");

  useEffect(() => {
    router.prefetch("/register");
  }, []);

  return (
    <OptionsStyled>
      <div className="content">
        <div className="title">{t("title")}</div>

        <div className="options">
          {options.map((option) => (
            <div className="option" key={option}>
              {" "}
              <CheckOutlined /> {t(`options.${option}`)}
            </div>
          ))}
        </div>

        <SharpButton prefixIcon="wink" onClick={() => props.createEvent()}>
          {t("book-an-event")}
        </SharpButton>

        <div className="hr">
          <div className="sub-title">{t("sub-title")}</div>
        </div>
        <div className="images">
          <Image
            src={`${config.storageUrl}/resources/companies-icon.png`}
            size={"contain"}
            width="fit-content"
            height={"55px"}
            margin="0"
          />
        </div>
      </div>
    </OptionsStyled>
  );
};

const OptionsStyled = styled.div`
  padding: 4rem 0;
  background: linear-gradient(270deg, #ececec 0%, #ffffff 31.25%, #ededed 100%);

  .content {
    margin: auto;
    max-width: 90vw;

    ${mediaQuery.afterTablet} {
      max-width: 80vw;
    }

    .title {
      font-size: 40px;
      line-height: 40px;
      font-weight: bold;
      margin-bottom: 2rem;

      ${mediaQuery.afterTablet} {
        font-size: 70px;
        line-height: 84px;
      }
    }

    .options {
      font-size: 20px;
      margin-bottom: 2rem;

      .option {
        font-size: 12px;

        ${mediaQuery.afterTablet} {
          font-size: 20px;
        }

        span {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }

    .hr {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 3px solid ${(props) => props.theme.basic.grayLighten};

      .sub-title {
        color: ${(props) => props.theme.basic.grayLighten};
      }
    }
  }
`;
