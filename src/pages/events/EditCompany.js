import React, { useState } from "reactn";
import styled from "styled-components";
import { Input, TextArea } from "../../components";
import { useForm } from "react-hook-form";
import { string, object } from "yup";
import get from "lodash/get";
import { ButtonBombo } from "../../components";
import { firestore } from "../../firebase";
import { useResizeImage } from "../../utils/useHooks";
import defaultTo from "lodash/defaultTo";
import { useUploadToStorage } from "../../utils/useHooks";

export default (props) => {
    const [imgBase64, setImgBase64] = useState(null);
    const [fileSuffix, setFileSuffix] = useState(null);
    const [loading, setLoading] = useState(false);

    const { resize } = useResizeImage();
    const { uploadToStorageAndGetURL } = useUploadToStorage();

    const schema = object().shape({
        name: string().required()
    });

    const { register, handleSubmit, errors } = useForm({
        validationSchema: schema,
        reValidateMode: "onSubmit",
    });

    const saveIntegrationGame = async (data) => {
        setLoading(true);
        let imageUrl = null;

        if (imgBase64 && fileSuffix) {
            imageUrl = await uploadToStorageAndGetURL(
                imgBase64,
                `/events/integration-games/${props.currentCompany.id}`,
                `backgroundImage`,
                fileSuffix
            );
        }

        let companies;

        if (
            defaultTo(get(props, "events.companies"), []).some(
                (company) => company.id === props.currentCompany.id
            )
        ) {
            companies = defaultTo(
                get(props, "events.companies"),
                []
            ).map((company) =>
                company.id === props.currentCompany.id ? mapCompany(data, imageUrl, company) : company
            );
        } else {
            companies = defaultTo(get(props, "events.companies"), []);
            companies.push(mapCompany(data, imageUrl));
        }

        await firestore.doc(`landings/events`).update({
            companies,
        });

        props.setIsVisibleModal(false);
        setLoading(false);
    };

    const mapCompany = (data, imageUrl, oldCompany = null) => {
        if (oldCompany) {
            const company = {
                ...props.currentCompany,
                name: data.name
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

    const manageImage = (event) => {
        if (event.target.files[0]) {
            setFileSuffix(event.target.files[0].name.split(".")[1]);
            resize(event, 300, 300).then((imageBase64_) =>
                setImgBase64(imageBase64_.split(",")[1])
            );
        }
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
                <Input
                    type="file"
                    variant="primary"
                    error={errors.imageUrl}
                    name="imageUrl"
                    onChange={manageImage}
                />
                <div className="buttons-container">
                    <ButtonBombo
                        type="primary"
                        margin="0"
                        loading={loading}
                        disabled={loading}
                        htmlType="submit"
                    >
                        Guardar
                    </ButtonBombo>
                    <ButtonBombo
                        type="secondary"
                        margin="0"
                        loading={loading}
                        disabled={loading}
                        onClick={() => props.setIsVisibleModal(false)}
                    >
                        Cancelar
                    </ButtonBombo>
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
  }
`;
