import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";
import { ButtonAnt, Input, TextArea } from "../../../components/form";
import { object, string, number } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { Typography } from "antd";
import { firestore } from "../../../firebase";

export const ModalSubscriptions = (props) => {
  const { Title } = Typography;

  const schema = object().shape({
    type: string().required(),
    presenterDescription: string().required(),
    presenterPrice: number().required(),
    presenterPromo: string(),
    proDescription: string().required(),
    proPrice: number().required(),
    proPromo: string(),
    standardDescription: string().required(),
    standardPrice: number().required(),
    standardPromo: string(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveSubscription = async (data) => {
    const sub = {
      id: props.subscription.id,
      type: data.type,
      presenterPlan: {
        name: "Presentador",
        price: data.presenterPrice,
        promo: data.presenterPromo,
        description: data.presenterDescription,
      },
      proPlan: {
        name: "Pro",
        price: data.proPrice,
        promo: data.proPromo,
        description: data.proDescription,
      },
      standardPlan: {
        name: "Estandar",
        price: data.standardPrice,
        promo: data.standardPromo,
        description: data.standardDescription,
      },
    };

    if (get(props, "subscription.type", null)) {
      await firestore
        .collection("settings")
        .doc("landing")
        .collection("subscriptions")
        .doc(props.subscription.id)
        .update(sub);
    } else {
      await firestore
        .collection("settings")
        .doc("landing")
        .collection("subscriptions")
        .doc(props.subscription.id)
        .set(sub);
    }

    props.setIsVisibleModalSubscriptions(false);
  };

  return (
    <ModalContainer
      background={darkTheme.basic.white}
      visible={props.isVisibleModalSubscriptions}
      onCancel={() => props.setIsVisibleModalSubscriptions(false)}
      footer={null}
      closable={false}
      padding={"1rem"}
    >
      <Content key={props.subscription}>
        <Title>Plan de Subscripcion</Title>

        <form onSubmit={handleSubmit(saveSubscription)}>
          <Title level={5}>Nombre del Plan</Title>
          <Input
            type="text"
            defaultValue={get(props, "subscription.type", "")}
            error={errors.type}
            ref={register}
            name="type"
            placeholder="Nombre del plan"
          />
          <Title level={3}>Estandar</Title>
          <Input
            defaultValue={get(props, "subscription.standardPlan.promo", "")}
            type="text"
            error={errors.standardPromo}
            ref={register}
            name="standardPromo"
            placeholder="Mensaje promocional (Opcional)"
          />
          <Input
            defaultValue={get(props, "subscription.standardPlan.price", "")}
            error={errors.standardPrice}
            type="number"
            ref={register}
            name="standardPrice"
            placeholder="Precio del plan"
          />
          <TextArea
            defaultValue={get(
              props,
              "subscription.standardPlan.description",
              ""
            )}
            color={darkTheme.basic.blackDarken}
            error={errors.standardDescription}
            name="standardDescription"
            ref={register}
            rows="5"
            placeholder="Descripción del plan"
          />
          <Title level={3}>Pro</Title>
          <Input
            defaultValue={get(props, "subscription.proPlan.promo", "")}
            type="text"
            error={errors.proPromo}
            ref={register}
            name="proPromo"
            placeholder="Mensaje promocional (Opcional)"
          />
          <Input
            defaultValue={get(props, "subscription.proPlan.price", "")}
            error={errors.type}
            type="number"
            ref={register}
            name="proPrice"
            placeholder="Precio del plan"
          />
          <TextArea
            defaultValue={get(props, "subscription.proPlan.description", "")}
            color={darkTheme.basic.blackDarken}
            error={errors.proDescription}
            name="proDescription"
            ref={register}
            rows="5"
            placeholder="Descripción del plan"
          />
          <Title level={3}>Presentador</Title>
          <Input
            defaultValue={get(props, "subscription.presenterPlan.promo", "")}
            type="text"
            error={errors.presenterPromo}
            ref={register}
            name="presenterPromo"
            placeholder="Mensaje promocional (Opcional)"
          />
          <Input
            defaultValue={get(props, "subscription.presenterPlan.price", "")}
            error={errors.type}
            type="number"
            ref={register}
            name="presenterPrice"
            placeholder="Precio del plan"
          />
          <TextArea
            defaultValue={get(
              props,
              "subscription.presenterPlan.description",
              ""
            )}
            color={darkTheme.basic.blackDarken}
            error={errors.presenterDescription}
            name="presenterDescription"
            ref={register}
            rows="5"
            placeholder="Descripción del plan"
          />
          <div className="btns-container">
            <ButtonAnt
              htmlType="submit"
              color="default"
              onClick={() => props.setIsVisibleModalSubscriptions(false)}
            >
              Cancelar
            </ButtonAnt>
            <ButtonAnt htmlType="submit" color="primary">
              Guardar
            </ButtonAnt>
          </div>
        </form>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  input[type="number"],
  input[type="text"] {
    background: transparent;
    border: 1px solid ${(props) => props.theme.basic.primary};
    margin: 0.5rem 0;
  }
`;
