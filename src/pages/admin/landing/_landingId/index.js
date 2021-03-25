import React, { useEffect, useState } from "react";
import { Button, Divider, message, Radio } from "antd";
import { firestore } from "../../../../firebase";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ButtonBombo, Input } from "../../../../components";
import { spinLoader } from "../../../../utils";
import get from "lodash/get";
import { object, string } from "yup";
import { useHistory } from "react-router";

const newLanding = {
  deleted: false,
};

const RadioGroup = Radio.Group;

export default () => {
  const schema = object().shape({
    titleSlider: string(),
    descriptionSlider: string(),
    buttonTextSlider: string(),
    buttonLinkSlider: string(),

    headingSection: string(),
    titleSection: string(),
    descriptionSection: string(),
    buttonTextSection: string(),
    buttonLinkSection: string(),

    titleTips: string(),
    descriptionTips: string(),

    companyName: string(),
  });

  const params = useParams();
  const history = useHistory();

  const [isSavingLanding, setIsSavingLanding] = useState(false);
  const [isLoadingLanding, setIsLoadingLanding] = useState(true);
  const [elementType, setElementType] = useState("slider");

  const [landing, setLanding] = useState({});

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchLanding();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const fetchLanding = async () => {
    if (params.landingId === "new") {
      const new_id = firestore.collection("landing").doc().id;
      setLanding({ ...newLanding, id: new_id });
    } else {
      const landingRef = await firestore
        .collection("landing")
        .doc(params.landingId)
        .get();

      if (!landingRef.exists) return history.push("/notFound");

      setLanding(landingRef.data());
      landingRef.data().elementType &&
        setElementType(landingRef.data().elementType);
    }
    setIsLoadingLanding(false);
  };

  const mapLanding = (data) => {
    let landing_;

    if (elementType === "slider") {
      landing_ = {
        titleSlider: data.titleSlider,
        descriptionSlider: data.descriptionSlider,
        buttonTextSlider: data.buttonTextSlider,
        buttonLinkSlider: data.buttonLinkSlider,
      };
    } else if (elementType === "first-section") {
      landing_ = {
        headingSection: data.headingSection,
        titleSection: data.titleSection,
        descriptionSection: data.descriptionSection,
        buttonTextSection: data.buttonTextSection,
        buttonLinkSection: data.buttonLinkSection,
      };
    } else if (elementType === "companies") {
      landing_ = {
        companyName: data.companyName,
      };
    } else {
      landing_ = {
        titleTips: data.titleTips,
        descriptionTips: data.descriptionTips,
      };
    }

    return {
      id: landing.id,
      ...landing_,
      elementType: elementType,
      createAt: landing.createAt ? landing.createAt : moment().toDate(),
      updateAt: landing.updateAt ? landing.updateAt : moment().toDate(),
      deleted: landing.deleted,
    };
  };

  const saveLanding = async (data) => {
    setIsSavingLanding(true);
    try {
      let currentLanding = mapLanding(data);
      if (params !== "new")
        currentLanding = { ...currentLanding, updateAt: moment().toDate() };

      await firestore
        .doc("landing/" + landing.id)
        .set(currentLanding, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingLanding(false);
  };

  return isLoadingLanding ? (
    spinLoader()
  ) : (
    <section>
      <h2 className="text-decoration-h2">ELEMENTO LANDING</h2>
      <Divider />
      <RadioGroup
        defaultValue={elementType}
        style={{ marginBottom: "1rem" }}
        onChange={(event) => setElementType(event.target.value)}
      >
        <Radio
          value="slider"
          disabled={
            landing.elementType === "first-section" ||
            landing.elementType === "tips" ||
            landing.elementType === "companies"
          }
        >
          Slider
        </Radio>
        <Radio
          value="first-section"
          disabled={
            landing.elementType === "slider" ||
            landing.elementType === "tips" ||
            landing.elementType === "companies"
          }
        >
          Sección
        </Radio>
        <Radio
          value="tips"
          disabled={
            landing.elementType === "first-section" ||
            landing.elementType === "slider" ||
            landing.elementType === "companies"
          }
        >
          Tips
        </Radio>
        <Radio
          value="companies"
          disabled={
            landing.elementType === "slider" ||
            landing.elementType === "tips" ||
            landing.elementType === "first-section"
          }
        >
          Empresas
        </Radio>
      </RadioGroup>
      <form onSubmit={handleSubmit(saveLanding)} noValidate>
        <section>
          <section
            hidden={
              elementType === "first-section" ||
              elementType === "tips" ||
              elementType === "companies"
            }
          >
            <div>Titulo</div>
            <Input
              variant="secondary"
              error={errors.titleSlider}
              ref={register}
              type="text"
              name="titleSlider"
              defaultValue={get(landing, "titleSlider", "")}
              placeholder="Ingrese titulo slider"
            />

            <div>Descripción</div>
            <Input
              variant="secondary"
              error={errors.descriptionSlider}
              ref={register}
              type="text"
              name="descriptionSlider"
              defaultValue={get(landing, "descriptionSlider", "")}
              placeholder="Ingrese descripción slider"
            />

            <div>Texto de boton</div>
            <Input
              variant="secondary"
              error={errors.buttonTextSlider}
              ref={register}
              type="text"
              name="buttonTextSlider"
              defaultValue={get(landing, "buttonTextSlider", "")}
              placeholder="Ingrese texto de boton slider"
            />

            <div>Link boton</div>
            <Input
              variant="secondary"
              error={errors.buttonLinkSlider}
              ref={register}
              type="text"
              name="buttonLinkSlider"
              defaultValue={get(landing, "buttonLinkSlider", "")}
              placeholder="Ingrese link boton slider"
            />
          </section>

          <section
            hidden={
              elementType === "slider" ||
              elementType === "tips" ||
              elementType === "companies"
            }
          >
            <div>Titulo de encabezado</div>
            <Input
              variant="secondary"
              error={errors.headingSection}
              ref={register}
              type="text"
              name="headingSection"
              defaultValue={get(landing, "headingSection", "")}
              placeholder="Ingrese titulo de encabezado"
            />
            <div>Titulo</div>
            <Input
              variant="secondary"
              error={errors.titleSection}
              ref={register}
              type="text"
              name="titleSection"
              defaultValue={get(landing, "titleSection", "")}
              placeholder="Ingrese titulo"
            />
            <div>Descripción</div>
            <Input
              variant="secondary"
              error={errors.descriptionSection}
              ref={register}
              type="text"
              name="descriptionSection"
              defaultValue={get(landing, "descriptionSection", "")}
              placeholder="Ingrese descripción"
            />
            <div>Texto de boton card</div>
            <Input
              variant="secondary"
              error={errors.buttonTextSection}
              ref={register}
              type="text"
              name="buttonTextSection"
              defaultValue={get(landing, "buttonTextSection", "")}
              placeholder="Ingrese texto de boton"
            />
            <div>Link de boton card</div>
            <Input
              variant="secondary"
              error={errors.buttonLinkSection}
              ref={register}
              type="text"
              name="buttonLinkSection"
              defaultValue={get(landing, "buttonLinkSection", "")}
              placeholder="Ingrese link de boton"
            />
          </section>

          <section
            hidden={
              elementType === "slider" ||
              elementType === "first-section" ||
              elementType === "companies"
            }
          >
            <div>Titulo</div>
            <Input
              variant="secondary"
              error={errors.titleTips}
              ref={register}
              type="text"
              name="titleTips"
              defaultValue={get(landing, "titleTips", "")}
              placeholder="Ingrese titulo tips"
            />
            <div>Descripción</div>
            <Input
              variant="secondary"
              error={errors.descriptionTips}
              ref={register}
              type="text"
              name="descriptionTips"
              defaultValue={get(landing, "descriptionTips", "")}
              placeholder="Ingrese descripción tips"
            />
          </section>

          <section
            hidden={
              elementType === "slider" ||
              elementType === "first-section" ||
              elementType === "tips"
            }
          >
            <div>Empresa</div>
            <Input
              variant="secondary"
              error={errors.companyName}
              ref={register}
              type="text"
              name="companyName"
              defaultValue={get(landing, "companyName", "")}
              placeholder="Ingrese nombre de la empresa"
            />
          </section>

          <div style={{ display: "flex" }}>
            <ButtonBombo
              margin="0"
              type="secondary"
              disabled={isSavingLanding}
              onClick={() => history.goBack()}
            >
              CANCELAR
            </ButtonBombo>
            <ButtonBombo
              margin="0"
              type="primary"
              loading={isSavingLanding}
              style={{ marginLeft: "10px" }}
              disabled={isSavingLanding}
              htmlType="submit"
            >
              GUARDAR
            </ButtonBombo>
          </div>
        </section>
      </form>
    </section>
  );
};
