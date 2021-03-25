import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import get from "lodash/get";
import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { object, string } from "yup";
import { firestore } from "../../../../firebase";
import { spinLoader } from "../../../../utils";
import { ButtonBombo } from "../../../../components";

export const AdminEbomboRules = (props) => {
  const [rule, setRule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchRule = () =>
      firestore.doc("settings/ebomboRules").onSnapshot((snapShot) => {
        setRule(snapShot.data());
        setIsLoading(false);
      });

    const subscription = fetchRule();
    return () => subscription();
  }, []);

  const schema = object().shape({
    content: string().required(),
  });

  const { errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveRule = async (data) => {
    setIsSaving(true);
    try {
      await firestore
        .doc(`settings/ebomboRules`)
        .set({ content: data.content });

      props.showNotification("SUCCESS", "Se guardo corectamente", "success");
    } catch (error) {
      console.log(error);
      props.showNotification("ERROR", "Algo salio mal");
    }
    setIsSaving(false);
  };

  if (isLoading) return spinLoader();

  return (
    <Container>
      <form onSubmit={handleSubmit(saveRule)}>
        <div className="container-editor">
          {errors.content}
          <Controller
            name="content"
            errors={errors.content}
            defaultValue={get(rule, "content", "")}
            control={control}
            as={
              <SunEditor
                setOptions={{
                  buttonList: buttonList.complex,
                }}
                defaultValue={get(rule, "content", "")}
                height="400px"
              />
            }
          />
        </div>
        <ButtonBombo
          margin="1rem 0"
          type="primary"
          htmlType="submit"
          loading={isSaving}
          disabled={isSaving}
        >
          Guardar Regla
        </ButtonBombo>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;
