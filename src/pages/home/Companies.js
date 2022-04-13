import React from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { mediaQuery } from "../../constants";
import { useTranslation } from "../../hooks";

const companies = [
  [
    {
      icon: `${config.storageUrl}/resources/companies/bbva-icon.svg`,
      url: "https://www.bbva.com",
    },
    {
      icon: `${config.storageUrl}/resources/companies/adidas-icon.svg`,
      url: "https://www.adidas.com",
    },
    {
      icon: `${config.storageUrl}/resources/companies/cabify-icon.png`,
      url: "https://www.cabify.com",
    },
    {
      icon: `${config.storageUrl}/resources/companies/interbank-icon.svg`,
      url: "https://www.interbank.pe",
    },
  ],
  [
    {
      icon: `${config.storageUrl}/resources/companies/mapfre-icon.svg`,
      url: "https://www.mapfre.es",
    },
    {
      icon: `${config.storageUrl}/resources/companies/puma-icon.svg`,
      url: "https://es-us.puma.com",
    },
    {
      icon: `${config.storageUrl}/resources/companies/cisco-icon.svg`,
      url: "https://www.cisco.com",
    },
  ],
];

export const Companies = (props) => {
  const { t } = useTranslation("landing.companies");

  return (
    <CompaniesStyled>
      <Image
        src={`${config.storageUrl}/resources/planet-1.svg`}
        size="contain"
        desktopWidth="200px"
        desktopHeight="200px"
        width="100px"
        height="100px"
        margin="24px"
        className="planet-1"
      />
      <Image
        src={`${config.storageUrl}/resources/planet-2.svg`}
        size="contain"
        desktopWidth="200px"
        desktopHeight="200px"
        width="100px"
        height="100px"
        margin="24px"
        className="planet-2"
      />

      <div className="content">
        <div className="title">{t("title")}</div>

        {/* Companies are chunked.*/}
        {companies.map((companiesChunk) => (
          <div
            className={`companies-imgs rows-${companiesChunk.length}`}
            key={`companies-chunk ${companiesChunk.length}`}
          >
            {/* Companies list.*/}
            {companiesChunk.map((company) => (
              <Image
                onClick={() => {
                  if (typeof window === "undefined") return;

                  window.open(company.url, "_blank");
                }}
                key={company.url}
                src={company.icon}
                size={"contain"}
                width="90px"
                height="auto"
                margin="20px auto"
              />
            ))}
          </div>
        ))}
      </div>
    </CompaniesStyled>
  );
};

const CompaniesStyled = styled.div`
  padding: 1.5rem 0;
  position: relative;
  background: linear-gradient(276.15deg, #331e6d 0%, #6646b7 100%);

  .content {
    ${mediaQuery.afterTablet} {
      margin: auto;
      max-width: 80vw;
    }

    .title {
      font-size: 24px;
      text-align: center;
      margin-bottom: 15px;
      color: ${(props) => props.theme.basic.white};
    }

    .companies-imgs {
      display: grid;
      padding: 0 2rem 0 2rem;
      grid-template-columns: 1fr 1fr;
    }

    ${mediaQuery.afterTablet} {
      .rows-4 {
        grid-template-columns: 1fr 1fr 1fr 1fr;
      }

      .rows-3 {
        grid-template-columns: 1fr 1fr 1fr;
      }
    }
  }

  .planet-1 {
    position: absolute;
    left: 1rem;
    top: -5rem;
  }

  .planet-2 {
    position: absolute;
    bottom: -6rem;
    right: 1rem;
  }
`;
