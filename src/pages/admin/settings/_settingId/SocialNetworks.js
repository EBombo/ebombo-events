import React, {useEffect, useState} from "react";
import {message} from "antd";
import {useForm} from "react-hook-form";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import styled from "styled-components";
import {firestore} from "../../../../firebase";
import * as yup from "yup";
import {spinLoader} from "../../../../utils";
import {ButtonBombo, Input} from "../../../../components";

export const SocialNetworks = (props) => {
  const schema = yup.object().shape({
    items: yup.array(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    const fetchSocialNetworks = async () => {
      const socialNetworksRef = await firestore
        .doc("settings/socialNetworks")
        .get();

      setSocialNetworks(socialNetworksRef.data().items);
      setIsLoading(false);
    };

    fetchSocialNetworks();
  }, []);

  const saveSettings = async (data) => {
    setIsSaving(true);
    try {
      await firestore
        .doc("settings/socialNetworks")
        .update({ items: data.items });
      message.success("Registro actualizado.");
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente.");
    }
    setIsSaving(false);
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      <form onSubmit={handleSubmit(saveSettings)} autoComplete="off" noValidate>
        <div>
          <FieldsetContainer>
            <legend>Redes Sociales</legend>
            {defaultTo(socialNetworks, []).map((socialNetwork, index) => (
              <div className={"social-network"} key={`instruction-${index}`}>
                <div>
                  <div>Red Social {`${index + 1}`}</div>
                  <Input
                    variant="secondary"
                    type="text"
                    onBlur={(e) => {
                      let newSocialNetworks = socialNetworks;
                      newSocialNetworks[index].title = e.target.value;
                      setSocialNetworks([...newSocialNetworks]);
                    }}
                    defaultValue={get(socialNetwork, "name")}
                    placeholder="Nombre"
                    ref={register}
                    name={`items[${index}].name`}
                  />
                  <Input
                    variant="secondary"
                    defaultValue={get(socialNetwork, "url", "")}
                    placeholder="Url"
                    type="url"
                    onBlur={(event) => {
                      let newSocialNetworks = socialNetworks;
                      newSocialNetworks[index].content = event.target.value;
                      setSocialNetworks([...newSocialNetworks]);
                    }}
                    ref={register}
                    name={`items[${index}].url`}
                  />
                  <ButtonBombo
                    margin="0"
                    danger
                    onClick={() => {
                      let newSocialNetworks = socialNetworks.filter(
                        (instructions, index_) => index_ !== index
                      );
                      reset({ items: newSocialNetworks });
                      setSocialNetworks([...newSocialNetworks]);
                    }}
                  >
                    Eliminar
                  </ButtonBombo>
                </div>
              </div>
            ))}
            <ButtonBombo
              margin="0"
              type={"primary"}
              onClick={() =>
                setSocialNetworks([
                  ...socialNetworks,
                  {
                    name: "",
                    url: "",
                  },
                ])
              }
            >
              Agregar Red Social
            </ButtonBombo>
          </FieldsetContainer>
        </div>
        <ButtonBombo
          margin="10px 0"
          htmlType="submit"
          type={"primary"}
          loading={isSaving}
          disabled={isSaving}
        >
          GUARDAR
        </ButtonBombo>
      </form>
    </div>
  );
};

const FieldsetContainer = styled.fieldset`
  border: 1px solid #292929;
  width: auto;
  border-radius: 7px;
  padding: 15px 20px;
  height: 100%;
  margin-top: 1rem;

  legend {
    width: auto;
    margin: 0;
    color: #000000;

    span {
      font-family: "Encode Sans", sans-serif;
      font-size: 0.8rem;
      padding: 0 10px 0 10px;
      font-weight: 600;
    }
  }

  .social-network {
    margin: 1rem 0;
  }
`;
