import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {Image} from "../../components/common/Image";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import {ButtonBombo} from "../../components";
import {firestore} from "../../firebase";
import {ModalContainer} from "../../components/common/ModalContainer";
import {lazy, Suspense} from "react";
import {spinLoader} from "../../utils";
import {Icon} from "../../components/common/Icons";

const EditCompany = lazy(() => import("./EditCompany"));

export const Companies = (props) => {
    const [authUser] = useGlobal("user");
    const [currentCompany, setCurrentCompany] = useState(null);
    const [isVisibleModal, setIsVisibleModal] = useState(false);

    return (
        <CompaniesContainer>
            {isVisibleModal && get(authUser, "isAdmin") && <ModalContainer
                footer={null}
                visible={isVisibleModal}
                onCancel={() => setIsVisibleModal(!isVisibleModal)}
            >
                <Suspense fallback={spinLoader()}>
                    <EditCompany
                        setIsVisibleModal={setIsVisibleModal}
                        isVisibleModal={isVisibleModal}
                        currentCompany={currentCompany}
                        {...props}
                    />
                </Suspense>
            </ModalContainer>}
            <div className="main-container">
                <div className="container marquee">
                    <div className="companies-container">
                        {defaultTo(get(props, "events.companies"), []).map((company, index) => (
                            <div className="company-container" key={`${company.name}`}>
                                <Image
                                    src={company.imageUrl}
                                    width="140px"
                                    height="70px"
                                    margin="0 1rem"
                                />
                                {get(authUser, "isAdmin") && (
                                    <div className="container-edit">
                                        <Icon
                                            className="icon"
                                            type="edit"
                                            onClick={() => {
                                                setCurrentCompany(company);
                                                setIsVisibleModal(true);
                                            }}
                                        />
                                        <Icon
                                            className="icon-delete"
                                            type="delete"
                                            onClick={() => {
                                                props.deleteElement(company, "companies");
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        {get(authUser, "isAdmin") && <ButtonBombo
                            type="action"
                            onClick={() => {
                                setCurrentCompany({
                                    id: firestore.collection("events").doc().id,
                                });
                                setIsVisibleModal(true);
                            }}
                        >
                            Añadir
                        </ButtonBombo>}
                    </div>
                </div>
            </div>
        </CompaniesContainer>
    );
};

const CompaniesContainer = styled.section`
  width: 100%;
  height: 130px;
  background: ${(props) => props.theme.basic.white};

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    height: 100%;
    overflow: auto;

    .container {
      max-width: 100%;
      height: 100%;
      overflow: auto;
      display: flex;
      align-items: center;

      ::-webkit-scrollbar {
        display: none;
      }

      .companies-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;

        .company-container {
          position: relative;
          
          .container-edit {
            position: absolute;
            height: 15px;
            cursor: pointer;
            top: 0;
            right: 15px;
            width: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            svg {
              width: 15px;
              height: 15px;
              color: ${(props) => props.theme.basic.black};
            }

            .icon-delete {
              svg {
                color: ${(props) => props.theme.basic.danger};
              }
            }
          }
        }
      }
    }
  }
`;
