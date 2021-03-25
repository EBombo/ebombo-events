import React from "react";
import styled from "styled-components";
import { config } from "../../../../../../../firebase";
import { Icon } from "../../../../../../../components/common/Icons";
import get from "lodash/get";
import { BackButton } from "../../../../../../../components";

export const LeagueDescription = (props) =>
  props.isMembers ? (
    <Container>
      <BackButton />
      <br />
      <br />
      <div className="title">
        <h3>Miembros</h3>
        <UserIcon type="user" />
      </div>
      <div className="members">
        {[
          `${get(props, "team.players[0].name", "")} ${get(
            props,
            "team.players[0].lastName",
            ""
          )}`,
        ]
          .concat(props.requirements)
          .map((member, index) => (
            <h4
              className={"pre-wrap " + (index === 0 && "captain")}
              key={`key-member-${index}`}
            >
              {member}
            </h4>
          ))}
      </div>
    </Container>
  ) : (
    <Container isLeague={props.isLeague}>
      <div className="title">
        {props.isLeague && (
          <img
            src={`${config.storageUrl}/resources/cup.svg`}
            alt=""
            style={{ filter: "grayscale(1)" }}
          />
        )}
        <h3>Descripción del {props.isLeague ? "Torneo" : "Equipo"}</h3>
      </div>
      <div className="description-requirements pre-wrap">
        {props.requirements}
      </div>
    </Container>
  );

const Container = styled.div`
  min-height: ${(props) => (props.isLeague ? "100vh" : "auto")};
  padding: ${(props) => (props.isLeague ? "30px" : "10px")};

  .title {
    display: flex;
    align-items: center;

    h3 {
      color: ${(props) => props.theme.basic.primary};
      font-weight: 400;
      font-size: 15px;
      line-height: 19px;
    }

    img {
      margin-right: 10px;
    }

    i {
      margin-left: 10px;
    }
  }

  .members {
    .captain {
      color: ${(props) => props.theme.basic.action};
    }
  }

  h4 {
    color: ${(props) => props.theme.basic.white};
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    margin: 10px 0;
  }

  .description-requirements {
    h4 {
      margin: 10px 0;
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.primary};
    }

    p {
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.white};
      text-align: justify;
    }
  }
`;

const UserIcon = styled(Icon)`
  font-size: 15px;
  color: ${(props) => props.theme.basic.primary};
`;
