import React, { useGlobal, useState } from "reactn";
import { useRouter } from "next/router";
import { config } from "../../../../firebase";
import { Image } from "../../../../components/common/Image";

const steps = [
  { name: "Básico", key: "basic" },
  { name: "Invitados", key: "guests" },
  { name: "Actividades", key: "activities" },
  { name: "Resumen", key: "resume" },
];

export const Event = (props) => {
  const router = useRouter();

  const { eventId } = router.query;

  const [authUser] = useGlobal("user");

  const [currentStep, setCurrentStep] = useState("");

  return (
    <div className="w-full md:min-h-[100vh]">
      <div className="w-full h-[80px] bg-white px-4 flex items-center justify-between">
        <Image
          src={`${config.storageUrl}/resources/ebombo.svg`}
          cursor="pointer"
          height="35px"
          width="125px"
          size="contain"
          margin="0"
        />
        <div className="text-secondary text-['Lato'] font-[700] text-[18px] leading-[22px]">{`${authUser.name} ${authUser.lastName}`}</div>
      </div>
      <div>
        <div className="border-y-[1px] border-primaryLight h-[100px] px-4 bg-white flex items-end md:px-8">
          {steps.map((step, index) => (
            <div className={`py-2 px-4`} key={step.key} onClick={() => setCurrentStep(step)} >
              {step.name}
            </div>
          ))}
        </div>
        <div className="w-full h-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 md:h-[calc(100vh-180px)] md:overflow-auto">
          {
          
          }
        </div>
      </div>
    </div>
  );
};
