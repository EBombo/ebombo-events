import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { mediaQuery } from "../../constants";
import { landingProducts } from "../../components/common/DataList";
import chunk from "lodash/chunk";
import { CheckOutlined } from "@ant-design/icons";
import { ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";
import { config } from "../../firebase";

export const Products = (props) => {
  const router = useRouter();

  const [currentTabIndex, setCurrentTabIx] = useState(0);

  useEffect(() => {
    router.prefetch("/register");
  }, []);

  return (
    <ProductsContainer tapiz={`${config.storageUrl}/resources/tapiz-v2.svg`}>
      <div className="title">UNA MANERA INCREÍBLE EN LA FORMA EN CÓMO CONECTAS CON TU EQUIPO</div>
      <div className="sub-title">
        Hemos creado una herramienta simple y sencilla que asegura la conexión de tus trabajadores en un esquema híbrido
        o remoto y el buen ambiente laboral
      </div>

      <div className="tabs">
        {landingProducts.map((product, index) => (
          <div
            className={`tab ${index === currentTabIndex ? "active" : ""}`}
            key={product.tab}
            onClick={() => setCurrentTabIx(index)}
          >
            {product.tab}
          </div>
        ))}
      </div>

      {landingProducts[currentTabIndex].content.map((product) => (
        <div className="product" data-aos="fade-right" key={product.title}>
          <div className="top-container">
            <div className="background" style={{ background: product.background }}>
              <Image
                src={product.image}
                desktopHeight="360px"
                desktopWidth="470px"
                height="160px"
                width="270px"
                size="contain"
                margin="0 -30px 0 0"
                borderRadius="15px"
              />
            </div>
          </div>

          <div className="bottom-container" data-aos="fade-right" data-aos-delay="500">
            <div className="subtitle">{product.title}</div>
            <div className="description">{product.description}</div>
            <div className="options-contain">
              {chunk(product?.options ?? [], 5)?.map((optionChunk) => {
                return (
                  <div className="options">
                    {optionChunk.map((option) => {
                      return (
                        <div className="option">
                          <CheckOutlined /> {option}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <ButtonAnt
              color="success"
              variant="contained"
              fontSize="15px"
              margin="25px 0 0 0"
              onClick={() => router.push("/contact")}
            >
              Contáctanos
            </ButtonAnt>
          </div>
        </div>
      ))}
    </ProductsContainer>
  );
};

const ProductsContainer = styled.div`
  width: 100%;
  padding: 2rem 1rem;
  background-color: ${(props) => props.theme.basic.white};
  background-image: ${(props) => `url('${props.tapiz}')`};

  .title,
  .sub-title {
    max-width: 70%;
    margin: 0 auto;
    font-size: 1.5rem;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.secondary};

    ${mediaQuery.afterTablet} {
      font-size: 80px;
      margin: 1rem auto;
    }
  }

  .sub-title {
    font-size: 1rem;
    margin-top: 2.5rem;
    line-height: normal;

    ${mediaQuery.afterTablet} {
      font-size: 20px;
    }
  }

  .tabs {
    display: grid;
    grid-gap: 10px;
    margin-top: 3rem;
    text-align: center;
    margin-bottom: 15px;
    grid-template-columns: 1fr 1fr;

    ${mediaQuery.afterTablet} {
      display: block;
    }

    .tab {
      width: auto;
      margin: 0 5px;
      font-size: 12px;
      cursor: pointer;
      display: inline;
      padding: 8px 10px;
      border-radius: 5px;
      color: ${(props) => props.theme.basic.primary};
      background: ${(props) => props.theme.basic.gray};

      ${mediaQuery.afterTablet} {
        font-size: 20px;
      }
    }

    .active {
      color: ${(props) => props.theme.basic.white};
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .product {
    display: flex;
    flex-direction: column;

    .top-container {
      margin: 0 auto;
      position: relative;

      .background {
        padding: 20px 0 20px 30px;
        border-radius: 9px;
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: ${(props) => props.theme.basic.primary};
      margin: 1rem 0;
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 17px;
      line-height: 20px;
      letter-spacing: 0.03em;
      color: ${(props) => props.theme.basic.blackDarken};
      margin: 1rem 0;
    }

    .options-contain {
      display: flex;
      grid-gap: 10px;

      .options {
        .option {
          color: ${(props) => props.theme.basic.secondary};

          span {
            color: ${(props) => props.theme.basic.primary};
          }
        }
      }
    }

    .link {
      margin: 1rem 0;

      a {
        font-weight: bold;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .product {
      display: grid;
      flex-direction: row;
      grid-template-columns: repeat(2, 1fr);
      align-items: center;
      grid-gap: 10%;
      max-width: 1350px;
      margin: 3rem auto;

      .description {
        max-width: 400px;
      }
    }
  }
`;
