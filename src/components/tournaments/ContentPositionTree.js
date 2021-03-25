import React, {useEffect, useState} from "reactn";
import styled from "styled-components";
import {ItemTree} from "./ItemTree";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import {config} from "../../firebase";
import {idealMatchesKnockOut} from "../common/DataList";
import {getPhasesPerTournament, searchIdeaMatches} from "../../business";
import {useErrorHandler} from "react-error-boundary";

export const ContentPositionTree = (props) => {
  const [groupsPerPhases, setGroupsPerPhases] = useState([]);
  const [isEven, setIsEven] = useState(false);
  const handleError = useErrorHandler();

  const order = (tournamentGroups_) =>
    orderBy(tournamentGroups_, ["phase", "index"], ["asc", "asc"]);

  useEffect(() => {
    let totalTeams =
      props.tournament.tournamentType === "groupko"
        ? isEmpty(props.tournamentGroups)
          ? props.tournament.countTournamentTeams
          : props.tournamentGroups.filter((group) => get(group, "phase") === 1)
              .length * 2
        : props.tournament.countTournamentTeams;

    let tournamentGroups_ = order(props.tournamentGroups).filter(
      (group) => !group.additionalMatch
    );

    if (!idealMatchesKnockOut.includes(totalTeams)) {
      totalTeams = searchIdeaMatches(totalTeams);
      setIsEven(true);
    }

    const phases_ = getPhasesPerTournament(totalTeams);

    console.log("phases_->", phases_);

    const groupsPerPhases_ = phases_.map((phase_) => {
      const phaseTournamentGroups_ = tournamentGroups_.slice(0, phase_);
      tournamentGroups_ = tournamentGroups_.slice(phase_);
      return isEmpty(phaseTournamentGroups_)
        ? [...mapEmptyGroup(phase_)]
        : phaseTournamentGroups_;
    });

    console.log("groupsPerPhases_->", groupsPerPhases_);

    setGroupsPerPhases(groupsPerPhases_);
  }, [props.tournamentGroups]);

  const mapEmptyGroup = (size) => Array.from(Array(size).keys());

  const isEdit = (tournamentGroup) => {
    try {
      if (!tournamentGroup.matchIds) return false;

      const indexNextGroup = Math.floor(tournamentGroup.index / 2);
      const phase = tournamentGroup.phase;

      const nextGroup = groupsPerPhases[phase][indexNextGroup];

      return nextGroup ? !nextGroup.winnerId : false;
    } catch (error) {
      handleError({ ...error, action: "isEdit" });
      return false;
    }
  };

  const hiddeTreeLine = (tournamentGroup, previousPhase) => {
    const indexPreviousGroup = Math.floor(tournamentGroup.index * 2);

    const firstGroup = get(
      previousPhase[indexPreviousGroup],
      "tournamentTeams",
      []
    ).some((team) => team.id === null);

    const secondGroup = get(
      previousPhase[indexPreviousGroup + 1],
      "tournamentTeams",
      []
    ).some((team) => team.id === null);

    console.log(firstGroup && secondGroup);
    return firstGroup && secondGroup;
  };

  return (
    <ContainerContentPositionTree
      distribution={groupsPerPhases.length}
      isEven={isEven}
      groupsPerPhases={groupsPerPhases}
      imgLine={`${config.storageUrl}/resources/tournament/line-semi-position-tree.svg`}
    >
      <section className="content-tree">
        {groupsPerPhases.map((phaseGroups, indexPhase) => (
          <div
            className={`content-first ${
              isEven &&
              indexPhase === 0 &&
              phaseGroups.length !==
                get(groupsPerPhases, `[${indexPhase + 1}]`, []).length &&
              "simple-order"
            }`}
            key={`key-tree-content-${indexPhase}`}
          >
            <div className="round">
              {groupsPerPhases.length === indexPhase + 1
                ? "Final"
                : groupsPerPhases.length - 1 === indexPhase + 1
                ? "Semifinal"
                : `Ronda ${indexPhase + 1}`}
            </div>
            {phaseGroups.map((tournamentGroup, index) =>
              phaseGroups.length === 1 &&
              indexPhase > 0 &&
              props.tournament.additionalMatch ? (
                <React.Fragment
                  key={`key-tree-${index}-${get(tournamentGroup, "id")}`}
                >
                  <ItemTree
                    {...props}
                    tournamentGroup={tournamentGroup}
                    displayBefore
                    displayAfter
                    visibilityHidden
                  />
                  <ItemTree
                    {...props}
                    tournamentGroup={tournamentGroup}
                    displayAfter
                    contents
                    isEdit={true}
                  />
                  <ItemTree
                    {...props}
                    tournamentGroup={defaultTo(
                      props.tournamentGroups.find(
                        (group) => group.additionalMatch
                      ),
                      {}
                    )}
                    displayBefore
                    displayAfter
                    titlePosition="Tercer Puesto"
                    isEdit={true}
                  />
                </React.Fragment>
              ) : phaseGroups.length === 1 && indexPhase > 0 ? (
                <ItemTree
                  {...props}
                  tournamentGroup={tournamentGroup}
                  displayAfter
                  contents
                  key={`key-tree-${index}-${get(tournamentGroup, "id")}`}
                  // titlePosition="Final"
                  isEdit={true}
                />
              ) : (
                <ItemTree
                  {...props}
                  key={`key-tree-${index}-${get(tournamentGroup, "id")}`}
                  tournamentGroup={tournamentGroup}
                  isEdit={isEdit(tournamentGroup)}
                  hiddeTreeLine={
                    indexPhase > 0 &&
                    tournamentGroup &&
                    groupsPerPhases[indexPhase - 1] &&
                    hiddeTreeLine(
                      tournamentGroup,
                      groupsPerPhases[indexPhase - 1]
                    )
                  }
                  visibilityHidden={
                    tournamentGroup.tournamentTeams &&
                    tournamentGroup.tournamentTeams.some(
                      (team) => team.id === null
                    )
                  }
                />
              )
            )}
          </div>
        ))}
      </section>
    </ContainerContentPositionTree>
  );
};

const ContainerContentPositionTree = styled.section`
  overflow: auto;
  margin: auto;
  padding: 0 1.2rem;

  .text-red {
    color: ${(props) => props.theme.basic.danger};
  }

  .text-primary {
    color: ${(props) => props.theme.basic.primary};
  }

  .content-tree {
    width: auto;
    min-height: 700px;
    display: grid;
    grid-template-columns: repeat(${(props) => props.distribution}, 190px);
    margin: calc(1rem + 25px) auto;
    position: relative;

    .round {
      width: 100%;
      background: ${(props) => props.theme.basic.blackLighten};
      color: ${(props) => props.theme.basic.white};
      font-weight: 600;
      font-size: 11px;
      line-height: 14px;
      position: absolute;
      top: -25px;
      border-right: 1px solid ${(props) => props.theme.basic.white};
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content-first {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      position: relative;
    }

    .simple-order {
      justify-content: flex-start;

      .tree-container {
        //height: auto;
      }
    }

    .content-first:first-child {
      section {
        ${(props) =>
          props.isEven &&
          get(props, "groupsPerPhases[0]", []).length <=
            get(props, "groupsPerPhases[1]", []).length &&
          "&::after{border-right: none;}"}
        .item-match {
          &::before {
            display: none;
          }

          &::after {
            display: none;
          }
        }
      }
    }

    .content-first:nth-child(2) {
      section {
        .item-match {
          &::before {
            ${(props) => props.isEven && "display: none;"}
          }

          &::after {
            ${(props) => props.isEven && "border-left: none;"}
          }
        }
      }
    }

    .content-first:last-child {
      justify-content: center;

      section {
        height: 65px;

        .item-match {
          justify-content: center;
          height: auto;
        }
      }
    }

    .content-third {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
`;
