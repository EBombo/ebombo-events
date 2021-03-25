import React from "react";
import {Tabs} from "antd";
import {useParams} from "react-router";
import {PageInstructions} from "./PageInstructions";
import {GeneralSettings} from "./GeneralSettings";
import {MatchInstructions} from "./MatchInstructions";
import {Characteristics} from "./Characteristics";
import {SocialNetworks} from "./SocialNetworks";
import {Banners} from "./Banners";
import {Manifests} from "./Manifests";
import {AdminEbomboRules} from "./AdminEbomboRules";

export default (props) => {
  const { TabPane } = Tabs;
  const { settingId } = useParams();

  return (
    <Tabs defaultActiveKey={`${settingId === "default" ? 1 : 2}`}>
      <TabPane tab="Configuración inicial" key="1">
        <GeneralSettings {...props} />
      </TabPane>
      <TabPane tab="Instrucciones del partido" key="2">
        <MatchInstructions {...props} />
      </TabPane>
      <TabPane tab="Características" key="3">
        <Characteristics {...props} />
      </TabPane>
      <TabPane tab="¿Cómo jugar?" key="4">
        <PageInstructions {...props} />
      </TabPane>
      <TabPane tab="Redes Sociales" key="5">
        <SocialNetworks {...props} />
      </TabPane>
      <TabPane tab="Banners" key="6">
        <Banners {...props} />
      </TabPane>
      <TabPane tab="Manifests" key="7">
        <Manifests {...props} />
      </TabPane>
      <TabPane tab="Reglas eBombo" key={"8"}>
        <AdminEbomboRules {...props} />
      </TabPane>
    </Tabs>
  );
};
