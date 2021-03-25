import React, {useGlobal} from "reactn";
import styled from "styled-components";
import {ButtonBombo, Input} from "../common";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";

export default (props) => {
  const [authUser] = useGlobal("user");

  const FieldSet = (props) => (
    <FieldsetContainer>
      <legend>
        <span>{props.title}</span>
      </legend>
      <div className="content">{props.children}</div>
    </FieldsetContainer>
  );

  return (
    <>
      <FieldSet title="STREAMING URLS">
        {defaultTo(props.match.streamingUrls, [""]).map(
          (streamObject, index) => (
            <div key={`stream-url-${index}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginBottom: "10px",
                }}
              >
                <Input
                  variant="primary"
                  type="url"
                  marginBottom="0"
                  autoComplete="off"
                  defaultValue={get(
                    props,
                    `match.streamingUrls[${index}].url`,
                    ""
                  )}
                  onBlur={(event) => {
                    let newStreamUrls = defaultTo(props.match.streamingUrls, [
                      {},
                    ]);
                    newStreamUrls[index] = {
                      id: authUser.id,
                      url: event.target.value,
                    };

                    console.log(event.target.value, newStreamUrls);

                    props.setMatch({
                      ...props.match,
                      streamingUrls: [...newStreamUrls],
                    });
                  }}
                  placeholder="Ingrese url de stream"
                />
                <ButtonBombo
                  margin="0"
                  onClick={() => {
                    let newStreamUrls = defaultTo(
                      props.match.streamingUrls,
                      []
                    );
                    console.log("1", newStreamUrls);

                    newStreamUrls = newStreamUrls.filter(
                      (streamUrl) => streamUrl.url !== streamObject.url
                    );

                    console.log("2", newStreamUrls);

                    props.setMatch({
                      ...props.match,
                      streamingUrls: [...newStreamUrls],
                    });
                  }}
                >
                  Eliminar
                </ButtonBombo>
              </div>
            </div>
          )
        )}
        <ButtonBombo
          type={"primary"}
          onClick={() =>
            props.setMatch({
              ...props.match,
              streamingUrls: [...props.match.streamingUrls, ""],
            })
          }
        >
          AGREGAR URL
        </ButtonBombo>
      </FieldSet>
      <ButtonBombo
        margin="10px auto"
        onClick={() => props.saveMatch()}
        disabled={props.isDisabled}
        loading={props.isDisabled}
        type={"primary"}
      >
        GUARDAR
      </ButtonBombo>
    </>
  );
};

const FieldsetContainer = styled.fieldset`
  border: 1px solid ${(props) => props.theme.basic.default};
  width: auto;
  border-radius: 7px;
  height: 100%;

  legend {
    width: auto;
    margin: 0;
    color: ${(props) => props.theme.basic.blackDarken};

    span {
      font-family: "Encode Sans", sans-serif;
      font-size: 0.8rem;
      padding: 0 10px 0 10px;
      font-weight: 600;
    }
  }

  .content {
    label {
      padding-right: 10px;
    }

    span {
      font-family: "Encode Sans", sans-serif;
      font-weight: 600;
      overflow-wrap: anywhere;
    }
  }
`;
