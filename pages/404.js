import { useEffect } from "react";
import styled from "styled-components";
import { timeoutPromise } from "../src/utils/promised";
import { useRouter } from "next/router";
import { Image } from "../src/components/common/Image";
import { config } from "../src/firebase";
import { ButtonAnt } from "../src/components/form";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");

    const redirect = async () => {
      await timeoutPromise(3000);

      await router.push("/");
    };

    redirect();
  }, []);

  return (
    <div className="bg-secondary bg-cover bg-no-repeat bg-pattern w-[100vw] h-[100vh] p-4 md:p-12 flex items-center">
      <div className="grid p-4 gap-4 h-[80vh] rounded-[10px] bg-secondaryDark/[0.8] md:p-8 md:grid-cols-2">
        <Image width="full" height="full" size="contain" margin="0" src={`${config.storageUrl}/resources/404.svg`} />
        <div className="flex flex-col items-center md:items-start md:justify-center">
          <div className="text-['Lato'] text-[30px] leading-[36px] font-[800] md:text-[50px] md:leading-[55px] text-white mb-4">
            Página no encontrada
          </div>
          <p className="text-['Lato'] text-[20px] leading-[24px] md:text-[30px] md:leading-[36px] text-white">
            Pero, no es culpa tuya
          </p>
          <ButtonAnt color="primary" onClick={() => router.push("/")}>
            <div className="text-['Lato'] text-[16px] leading-[20px] md:text-[20px] md:leading-[24px] text-white px-8">
              Volver al inicio
            </div>
          </ButtonAnt>
        </div>
      </div>
    </div>
  );
};

const ErrorPageStyled = styled.div`
  background: #1f1e1e;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    margin: auto;
  }

  h1 {
    color: white;
    display: inline-block;
    border-right: 1px solid white;
    margin: 0;
    margin-right: 20px;
    padding: 10px 23px 10px 0;
    font-size: 24px;
    font-weight: 500;
    vertical-align: top;
  }

  .description {
    display: inline-block;
    text-align: left;
    line-height: 49px;
    height: 49px;

    h2 {
      color: white;
      font-size: 14px;
      font-weight: normal;
      line-height: inherit;
      margin: 0;
      padding: 0;
    }
  }
`;

export default ErrorPage;
