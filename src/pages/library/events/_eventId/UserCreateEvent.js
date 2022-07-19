import React, { useState } from "reactn";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { EventStepOne } from "./EventStepOne";
import { EventStepTwo } from "./EventStepTwo";
import { EventStepThree } from "./EventStepThree";
import { EventStepFour } from "./EventStepFour";
import { useTranslation } from "../../../../hooks";

export const UserCreateEvent = (props) => {
  const { t } = useTranslation("pages.library.event");

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { name: t("step-one.name"), key: "basic" },
    { name: t("step-two.name"), key: "guests" },
    { name: t("step-three.name"), key: "activities" },
    { name: t("step-four.name"), key: "resume" },
  ];

  return (
    <div>
      <div className="border-y-[1px] border-primaryLight h-[60px] md:h-[100px] px-2 bg-white flex items-end md:px-8">
        {steps.map((step, index) => (
          <div
            className={`py-2 px-2 md:px-4 flex items-center text-['Lato'] text-[14px] leading-[17px] md:text-[18px] md:leading-[22px] font-[500] ${index + 1 > currentStep && "text-primaryLight"
              } ${index + 1 < currentStep && "text-[#1CF68D]"} ${currentStep === index + 1 && "text-secondary border-b-[2px] border-secondary"
              }`}
            key={step.key}
          >
            {index + 1 < currentStep && (
              <Image
                src={`${config.storageUrl}/resources/check-icon.svg`}
                width="18px"
                height="14px"
                size="contain"
                margin="0 5px 0 0"
              />
            )}
            {step.name}
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 h-[calc(100vh-180px)] overflow-auto">
        {currentStep === 1 && <EventStepOne {...props} currentStep={currentStep} setCurrentStep={setCurrentStep} />}
        {currentStep === 2 && <EventStepTwo currentStep={currentStep} setCurrentStep={setCurrentStep} {...props} />}
        {currentStep === 3 && <EventStepThree currentStep={currentStep} setCurrentStep={setCurrentStep} {...props} />}
        {currentStep === 4 && <EventStepFour currentStep={currentStep} setCurrentStep={setCurrentStep} {...props} />}
      </div>
    </div>
  );
};
