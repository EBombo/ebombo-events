import React, { useEffect, useState } from "reactn";
import { FileUpload } from "../../../../components/common/FileUpload";
import { TimePicker } from "antd";
import { ButtonAnt, DatePicker, Input } from "../../../../components/form";
import moment from "moment";
import { useTranslation } from "../../../../hooks";
import { config } from "../../../../firebase";
import isEmpty from "lodash/isEmpty";

export const EventStepOne = (props) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [currentDate, setCurrentDate] = useState({});

  const [errorEventDate, setErrorEventDate] = useState(false);

  const { t } = useTranslation("pages.library.event.step-one");

  useEffect(() => {
    if (isEmpty(props.event) || !props.event) return;

    setName(props.event.name ?? "");
    setLink(props.event.link ?? "");
    setImageUrl(props.event.imageUrl ?? "");

    const month = moment(moment(props.event?.startAt?.toDate()).format("dddd DD MMMM"));
    const start = moment(moment(props.event?.startAt?.toDate()).format("h:mm a"), "h:mm a");
    const end = moment(moment(props.event?.endAt?.toDate()).format("h:mm a"), "h:mm a");

    const _currentDate = {
      month,
      start,
      end,
    };

    setCurrentDate(_currentDate);
  }, [props.event]);

  const disabledDate = (current) => current && current < moment().endOf("day");

  const saveStepOne = async () => {
    if (!currentDate.month || !currentDate.start || !currentDate.end) {
      setErrorEventDate(true);
      return props.showNotification("Error", "Completa la fecha y las horas del evento");
    }

    if (!name) {
      return props.showNotification("Error", "Completa el nombre del evento");
    }

    const _event = props.event;

    props.setEvent({
      ..._event,
      imageUrl: isEmpty(imageUrl) ? `${config.storageUrl}/resources/event-default.svg` : imageUrl,
      currentDate,
      name,
      link,
    });

    props.setCurrentStep(2);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        {t("title")}
      </div>

      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div className="m-auto md:m-0">
          <FileUpload
            width="300px"
            height="170px"
            preview={true}
            file={imageUrl}
            fileName="imageUrl"
            filePath={`/events/${props.documentId}`}
            bucket="landings"
            sizes="300x350"
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>

        <div className="flex flex-col gap-4 gap-[5px] w-full max-w-[630px]">
          <label htmlFor="name" className="text-secondary text-['Lato'] font-[400] text-[18px] leading-[22px]">
            {t("activity-title")}
          </label>
          <Input
            type="text"
            name="name"
            height="60px"
            background="white"
            value={name}
            onChange={(e) => {
              e.preventDefault();
              setName(e.target.value);
            }}
            placeholder={t("input-placeholder")}
          />
        </div>
      </div>

      <div className="my-4 text-['Lato'] font-[400] text-secondary text-[18px] leading-[22px]">{t("date-title")}</div>

      <div
        className={`p-4 ${
          errorEventDate ? "border-danger" : "border-grayLighten"
        } border-[2px] flex items-center gap-[10px] bg-white w-full md:w-fit rounded-[6px] flex-col md:flex-row`}
      >
        <div className="flex flex-col gap-[5px] w-full md:w-fit">
          <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">{t("dates.day")}</div>
          <DatePicker
            format="dddd DD MMMM"
            value={currentDate?.month ?? ""}
            disabledDate={disabledDate}
            onChange={(date, dateString) => setCurrentDate({ ...currentDate, month: dateString })}
            margin="0"
            style={{
              border: "1px solid #C4C4C4",
              borderRadius: "4px",
              height: "33px",
              width: "200px",
              background: "#FAFAFA",
            }}
          />
        </div>
        <div className="flex items-center gap-[10px] w-full md:w-fit">
          <div className="flex flex-col gap-[5px]">
            <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">{t("dates.start")}</div>

            <TimePicker
              format="h:mm a"
              value={currentDate?.start ?? ""}
              onChange={(hour) => setCurrentDate({ ...currentDate, start: hour })}
              style={{
                border: "1px solid #C4C4C4",
                borderRadius: "4px",
                height: "33px",
                width: "130px",
                background: "#FAFAFA",
              }}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">{t("dates.end")}</div>
            <TimePicker
              format="h:mm a"
              className="w-full"
              value={currentDate?.end ?? ""}
              onChange={(hour) => setCurrentDate({ ...currentDate, end: hour })}
              style={{
                border: "1px solid #C4C4C4",
                borderRadius: "4px",
                height: "33px",
                width: "130px",
                background: "#FAFAFA",
              }}
            />
          </div>
        </div>
      </div>

      <div className="my-4 text-['Lato'] font-[400] text-secondary text-[18px] leading-[22px]">{t("link-title")}</div>

      <div className="w-full max-w-[500px]">
        <Input
          type="url"
          name="link"
          height="60px"
          background="white"
          value={link}
          onChange={(e) => {
            e.preventDefault();
            setLink(e.target.value);
          }}
          placeholder={t("input-placeholder")}
        />
      </div>
      <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] mt-[5px]">{t("link-description")}</div>

      <div className="flex w-full items-center justify-end">
        <ButtonAnt onClick={() => saveStepOne()}>{t("next")}</ButtonAnt>
      </div>
    </div>
  );
};
