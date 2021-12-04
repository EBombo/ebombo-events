import React, { useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../../constants";
import { Tabs } from "antd";
import { Anchor, ButtonAnt, Input } from "../../../components/form";
import { TabletUsers } from "./TabletUsers";
import { DesktopUsers } from "./DesktopUsers";
import { ModalLicenses } from "./ModalLicenses";
import { ModalInvite } from "./ModalInvite";

export const AdminCompanyUsers = (props) => {
  const { TabPane } = Tabs;

  const [isVisibleModalLicenses, setIsVisibleModalLicenses] = useState(false);
  const [isVisibleModalInvite, setIsVisibleModalInvite] = useState(false);

  const inviteUsers = async () => {
    console.log("invitation");
  };

  const deleteUsers = async () => {
    console.log("delete user");
  };

  const exportExcel = async () => {
    console.log("excel");
  };

  return (
    <AdminContainer>
      {isVisibleModalLicenses && (
        <ModalLicenses
          isVisibleModalLicenses={isVisibleModalLicenses}
          setIsVisibleModalLicenses={setIsVisibleModalLicenses}
          {...props}
        />
      )}
      {isVisibleModalInvite && (
        <ModalInvite
          isVisibleModalInvite={isVisibleModalInvite}
          setIsVisibleModalInvite={setIsVisibleModalInvite}
          {...props}
        />
      )}
      <div className="admin-content">
        <Tablet>
          <div className="title">Administración de usuarios</div>
        </Tablet>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Usuarios" key="users">
            <FirstTabContent>
              <div className="licenses">
                <div className="characteristic">Licencias</div>
                <div className="characteristic">
                  Total: <div className="number">1</div>
                </div>
                <div className="characteristic">
                  En uso: <div className="number">2</div>
                </div>
                <div className="characteristic">
                  Disponible: <div className="number">0</div>
                </div>

                <Anchor onClick={() => setIsVisibleModalLicenses(true)} variant="primary" underlined>
                  Administrar
                </Anchor>
              </div>

              <div className="action-container">
                <div className="search-user">
                  <Input type="search" placeholder="Buscar" />
                </div>
                <div className="actions">
                  <Desktop>
                    <ButtonAnt color="secondary" onClick={() => exportExcel()} margin="0 10px 0 0">
                      Exportar CSV
                    </ButtonAnt>
                  </Desktop>
                  <ButtonAnt onClick={() => setIsVisibleModalInvite(true)}>Invitar usuarios</ButtonAnt>
                </div>
              </div>

              <div className="description">
                Propietario: El propietario de la cuenta tiene todos los privilegios para acceder y administrar una
                cuenta de Zoom.
              </div>

              <div className="description">
                Admin: Los administradores tienen una amplia gama de privilegios para acceder y administrar una cuenta
                de Zoom.
              </div>

              <div className="description">
                Miembro: Los miembros sólo pueden participar en actividades, pero no tienen privilegios de
                administración de cuentas.
              </div>

              <Tablet>
                <TabletUsers {...props} />
              </Tablet>

              <Desktop>
                <DesktopUsers {...props} />
              </Desktop>
            </FirstTabContent>
          </TabPane>
          <TabPane tab="Pendientes" key="pending">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    </AdminContainer>
  );
};

const AdminContainer = styled.div`
  width: 100%;

  .admin-content {
    .title {
      padding: 0.5rem;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.blackLighten};
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
    }
  }

  .ant-tabs {
    .ant-tabs-nav {
      padding: 0 1rem !important;
    }

    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${(props) => props.theme.basic.primary};
      text-shadow: 0 0 0.25px ${(props) => props.theme.basic.primary};
    }
  }

  ${mediaQuery.afterTablet} {
    background: ${(props) => props.theme.basic.whiteLight};
    border-radius: 8px;
  }
`;

const FirstTabContent = styled.div`
  width: 100%;
  padding: 0.5rem;

  .licenses {
    display: flex;
    align-items: center;

    .characteristic {
      display: flex;
      align-items: center;
      margin: 0 10px 0 0;
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackDarken};

      .number {
        font-weight: 700;
        margin-left: 5px;
      }
    }

    .characteristic:first-child {
      font-weight: 700;
    }
  }

  .action-container {
    display: grid;
    grid-template-columns: 250px auto;
    grid-gap: 1rem;
    margin: 0.5rem 0;
  }

  .description {
    margin: 0.5rem 0;

    p {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .order {
    display: flex;
    align-items: center;

    label {
      margin-right: 10px;
    }

    .ant-select {
      width: 250px;
      margin-bottom: 0 !important;
    }
  }

  .users {
    .user-content {
      display: grid;
      grid-template-columns: 40px 40px 200px;
      align-items: center;
      height: 47px;
      margin: 5px 0;
      border: 1px solid ${(props) => props.theme.basic.grayLighten};
      border-radius: 5px;

      .checkbox-container {
        margin: auto;
      }
    }
  }

  .more {
    height: 52px;
    background: #fafafa;
    border: 1px solid #c4c4c4;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 4rem auto 0 0;
  }

  ${mediaQuery.afterTablet} {
    padding: 0 1rem 1rem 1rem;

    .action-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1rem 0;

      .search-user {
        min-width: 300px;
      }

      .actions {
        display: flex;
        align-items: center;
      }
    }
  }
`;
