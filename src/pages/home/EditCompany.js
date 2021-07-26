import React, { useState } from "reactn";
import styled from "styled-components";
import { Input, TextArea, ButtonAnt } from "../../components/form";
import { useForm } from "react-hook-form";
import { string, object } from "yup";
import get from "lodash/get";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

export default (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    name: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveIntegrationGame = async (data) => {
    setLoading(true);

    let companies;

    if (
      defaultTo(get(props, "home.companies"), []).some(
        (company) => company.id === props.currentCompany.id
      )
    ) {
      companies = defaultTo(get(props, "home.companies"), []).map((company) =>
        company.id === props.currentCompany.id
          ? mapCompany(data, company)
          : company
      );
    } else {
      companies = defaultTo(get(props, "home.companies"), []);
      companies.push(mapCompany(data));
    }

    await firestore.doc(`landings/events`).update({
      companies,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapCompany = (data, oldCompany = null) => {
    if (oldCompany) {
      const company = {
        ...props.currentCompany,
        name: data.name,
      };

      if (imageUrl) company["imageUrl"] = imageUrl;

      return company;
    }

    return {
      ...props.currentCompany,
      name: data.name,
      imageUrl,
    };
  };

  return (
    <Container>
      <div className="title">Empresa</div>
      <form onSubmit={handleSubmit(saveIntegrationGame)}>
        <Input
          variant="primary"
          name="name"
          ref={register}
          error={errors.name}
          required
          label="Nombre:"
          defaultValue={get(props, "currentCompany.name", "")}
          placeholder="Nombre del juego"
        />
        <div className="image-component">
          <FileUpload
            file={get(props, "currentCompany.imageUrl", "")}
            fileName="imageUrl"
            filePath={`/events/integration-games/${props.currentCompany.id}`}
            bucket="landings"
            sizes="300x150"
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>
        <div className="buttons-container">
          <ButtonAnt
            variant="contained"
            color="primary"
            loading={loading}
            disabled={loading}
            htmlType="submit"
          >
            Guardar
          </ButtonAnt>
          <ButtonAnt
            variant="outlined"
            color="danger"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonAnt>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;

  .title {
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.white};
  }

  form {
    margin-top: 1rem;

    .buttons-container {
      display: flex;
      justify-content: space-around;
    }

    .image-component {
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
