import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";

export const Companies = (props) => {
  const [landing] = useGlobal("landing");

  const currentElement = (elementType) =>
    landing.filter((landing) => landing.elementType === elementType);

  return (
    <CompaniesContainer>
      <div className="main-container">
        <div className="container marquee">
          <div className="companies-container">
            {currentElement("companies").map((company, index) => (
              <Image
                src={company.companyImageUrlThumb}
                width="120px"
                height="45px"
                key={`key-companies-${index}`}
                margin="0 1rem"
              />
            ))}
          </div>
        </div>
      </div>
    </CompaniesContainer>
  );
};

const CompaniesContainer = styled.section`
  width: 100%;
  height: 130px;
  background: ${(props) => props.theme.basic.white};

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    height: 100%;
    overflow: auto;
    .container {
      max-width: 100%;
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      ::-webkit-scrollbar {
        display: none;
      }
      .companies-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
      }
    }
  }
`;
