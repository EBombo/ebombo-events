import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { Anchor } from "../../components/form";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { ladingProducts } from "../../components/common/DataList";

export const Products = (props) => {
  const router = useRouter();

  return (
    <ProductsContainer>
      <div className="title">
        Todo lo que necesitas
        <Tablet>
          <br />
        </Tablet>
        <Desktop>&nbsp;</Desktop>
        en un solo lugar
      </div>

      {ladingProducts.map((product) => (
        <div className="product" key={product.title}>
          <div className="top-container">
            <div className="background" style={{ background: product.background }} />
            <div className="img-container">
              <Image src={product.image} height="100%" width="100%" size="contain" margin="0" borderRadius="15px" />
            </div>
          </div>

          <div className="bottom-container">
            <div className="subtitle">{product.title}</div>

            <div className="description">{product.description}</div>

            <div className="link">
              <Anchor
                underlined
                variant="secondary"
                margin="1rem 0"
                onClick={() => router.push(product.url)}
                fontSize="14px"
              >
                Explorar <ArrowRightOutlined />
              </Anchor>
            </div>
          </div>
        </div>
      ))}
    </ProductsContainer>
  );
};

const ProductsContainer = styled.div`
  width: 100%;
  padding: 2rem 1rem;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.secondary};
    margin: 1rem 0;
  }

  .product {
    display: flex;
    flex-direction: column;

    .top-container {
      width: 100%;
      max-width: 335px;
      height: 215px;
      margin: 0 auto;
      position: relative;

      .background {
        width: 80%;
        height: 100%;
        background: ${(props) => props.theme.basic.blackDarken};
        border-radius: 9px;
      }

      .img-container {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(10%, -50%);
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
