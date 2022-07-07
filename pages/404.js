import { useEffect } from "react";
import { useRouter } from "next/router";
import { Image } from "../src/components/common/Image";
import { config } from "../src/firebase";
import { SharpButton } from "../src/components/common/SharpButton";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
  }, []);

  return (
    <div className="bg-secondary bg-cover bg-no-repeat bg-pattern w-[100vw] h-[100vh] p-4 md:p-12 flex items-center">
      <div className="grid p-4 gap-4 h-[80vh] rounded-[10px] bg-secondaryDark/[0.8] md:p-8 md:grid-cols-2">
        <Image width="full" height="full" size="contain" margin="0" src={`${config.storageUrl}/resources/404.svg`} />
        <div className="flex flex-col items-center md:items-start md:justify-center">
          <div className="text-['Lato'] text-[30px] leading-[36px] font-[800] md:text-[50px] md:leading-[55px] text-white mb-4">
            Página no encontrada
          </div>
          <div className="text-['Lato'] text-[20px] leading-[24px] md:text-[30px] md:leading-[36px] text-white mb-4">
            Pero, no es culpa tuya
          </div>
          <SharpButton
            color="primary"
            prefixIcon="wink"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <span className="text-['Lato'] text-[16px] leading-[20px] md:text-[20px] md:leading-[24px] text-white px-8">
              Volver al inicio
            </span>
          </SharpButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
