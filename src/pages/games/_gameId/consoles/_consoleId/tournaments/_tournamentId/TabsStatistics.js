import React, { useState } from "reactn";
import { Tabs } from "antd";
import styled from "styled-components";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { mediaQuery } from "../../../../../../../styles/constants";
import {
  ContentPositionTree,
  ContentTableStatistics,
} from "../../../../../../../components";
import { Image } from "../../../../../../../components/common/Image";
import { config } from "../../../../../../../firebase";
import { Teams } from "./Teams";
import { CardDates } from "./CardDates";

export const TabsStatistics = (props) => {
  const [keyTab, setKetTab] = useState("1");

  return (
    <ContainerStatisticsTabs>
      <Tabs defaultActiveKey={keyTab} onChange={(key) => setKetTab(key)}>
        {["groupko", "group"].includes(props.tournament.tournamentType) && (
          <Tabs.TabPane tab="Grupos" key="1">
            <div className="subtitle">Grupos</div>
            <ContentTableStatistics
              tournament={props.tournament}
              tournamentTeams={props.tournamentTeams}
              tournamentGroups={get(props, "tournamentGroups", []).filter(
                (groups) => get(groups, "phase") === 0
              )}
            />
          </Tabs.TabPane>
        )}
        {["knock-out", "groupko"].includes(props.tournament.tournamentType) && (
          <Tabs.TabPane tab="Eliminación Directa" key="2">
            <div className="subtitle">Eliminación Directa</div>
            {!isEmpty(props.tournamentGroups.filter(
                (groups) => get(groups, "phase") !== 0)) ? (
              <ContentPositionTree
                {...props}
                tournament={props.tournament}
                tournamentGroups={get(props, "tournamentGroups", []).filter(
                  (groups) => get(groups, "phase") !== 0
                )}
              />
            ) : (
              <div className="empty-ko">
                <div className="description">
                  {props.tournament.tournamentType === "knock-out"
                    ? "Las llaves serán generadas minutos antes del inicio del torneo."
                    : "Las llaves serán generadas después de la fase de grupos."}
                </div>
                <Image
                  src={`${config.storageUrl}/resources/tournament/empty-ko.svg`}
                  height="100px"
                  width="204px"
                  margin="1rem 0"
                />
              </div>
            )}
          </Tabs.TabPane>
        )}
        {["group", "groupko"].includes(props.tournament.tournamentType) && (
          <Tabs.TabPane tab="Fechas" key="3">
            <div className="subtitle">Fechas</div>
            <CardDates {...props} />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="Inscritos" key="4">
          <div className="subtitle">Inscritos</div>
          <Teams {...props} />
        </Tabs.TabPane>
      </Tabs>
    </ContainerStatisticsTabs>
  );
};

const ContainerStatisticsTabs = styled.section`
  background: ${(props) => props.theme.basic.default};
  width: 100%;
  height: auto;
  margin: 1rem 0;
  min-height: 300px;

  ${mediaQuery.afterTablet} {
    margin: 0;
  }

  .ant-tabs {
    color: ${(props) => props.theme.basic.white} !important;

    .empty-ko {
      padding: 0.5rem;

      .description {
        font-size: 12px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.grayLighten};
      }
    }

    .subtitle {
      color: ${(props) => props.theme.basic.primary};
      padding: 0.5rem;
      border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};
      font-weight: bold;
    }

    .ant-tabs-nav {
      margin: 0;
      padding: 0 1rem;
      background: ${(props) => props.theme.basic.blackDarken};

      &:before {
        position: absolute;
        right: 0;
        left: 0;
        border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};
        content: "";
      }

      .ant-tabs-nav-list {
        padding: 0 5px;

        .ant-tabs-ink-bar {
          background: ${(props) => props.theme.basic.whiteDarken};
        }

        .ant-tabs-tab {
          padding: 5px 0;

          .ant-tabs-tab-btn {
            color: ${(props) => props.theme.basic.grayLight};

            &:hover {
              color: ${(props) => props.theme.basic.whiteDarken};
            }
          }
        }

        .ant-tabs-tab-active {
          .ant-tabs-tab-btn {
            color: ${(props) => props.theme.basic.whiteDarken};

            &:hover {
              color: ${(props) => props.theme.basic.whiteDarken};
            }
          }
        }
      }
    }
  }
`;
