import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { Icon } from "../../components/common/Icons";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { LinkedinOutlined } from "@ant-design/icons";

const founders = [
  {
    img: `${config.storageUrl}/resources/founders/mateo.png`,
    name: "Mateo Suarez Stewart",
    position: "CEO",
    linkedin: "https://www.linkedin.com/in/mateo-suarez-stewart-a3bb05b5/",
  },
  {
    img: `${config.storageUrl}/resources/founders/santiago.png`,
    name: "Santiago Suarez Stewart",
    position: "COO - Product Manager",
    linkedin: "https://www.linkedin.com/in/santiago-suarez-stewart/",
  },
  {
    img: `${config.storageUrl}/resources/founders/gonzalo.png`,
    name: "Gonzalo Herrera Medina",
    position: "CPO - UX/UI Designer",
    linkedin: "https://www.linkedin.com/in/ghherreramedina/",
  },
];

export const Founders = (props) => {
  const router = useRouter();

  return (
    <FoundersContainer>
      <div className="title-container">
        <div className="back-container">
          <Icon className="back-icon" type="left" onClick={() => router.back()} />
        </div>
        <div className="title">Fundadores</div>
      </div>
      <div className="founders">
        {founders.map((founder, index) => (
          <div className="founder" key={`${index}-${founder.name}`}>
            <Image
              src={founder.img}
              height="325px"
              width="325px"
              margin="0.5rem auto"
              size="cover"
              borderRadius="4px"
            />
            <div className="name">{founder.name}</div>
            <div className="position">{founder.position}</div>
            <a href={founder.linkedin} target="_blank">
              <LinkedinOutlined />
            </a>
          </div>
        ))}
      </div>
    </FoundersContainer>
  );
};

const FoundersContainer = styled.div`
  width: 100%;
  background: linear-gradient(180deg, #382079 0%, #241254 100%);

  .title-container {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    background: ${(props) => props.theme.basic.whiteLighten};

    .title {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 28px;
      line-height: 32px;
      color: ${(props) => props.theme.basic.secondary};
    }

    .back-container {
      margin: 0 1rem 0 0;

      span {
        border-radius: 50%;
        padding: 8px;
        background: ${(props) => props.theme.basic.primary};
        cursor: pointer;
        vertical-align: bottom;
        color: ${(props) => props.theme.basic.white};
        svg {
          font-size: 18px;
        }
      }
    }
  }

  .founders {
    padding: 1rem;

    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 2rem;

    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(3, 1fr);
    }

    .founder {
      display: flex;
      flex-direction: column;
      max-width: 325px;
      margin: auto;

      .name {
        font-family: Lato;
        font-style: normal;
        font-weight: 900;
        font-size: 25px;
        line-height: 30px;
        color: ${(props) => props.theme.basic.whiteLighten};
        margin: 0.5rem 0;
      }

      .position {
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 25px;
        line-height: 30px;
        color: ${(props) => props.theme.basic.primary};
        margin: 0.5rem 0;
      }

      svg {
        color: ${(props) => props.theme.basic.whiteLighten};
        font-size: 32px;
      }
    }

    ${mediaQuery.afterTablet} {
      padding: 3rem;
    }
  }
`;
