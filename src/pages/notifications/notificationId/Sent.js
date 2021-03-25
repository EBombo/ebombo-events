import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { ChallengeView } from "./ChallengeView";
import { ButtonBombo } from "../../../components";
import isEmpty from "lodash/isEmpty";
import { firestore } from "../../../firebase";
import { snapshotToArray, spinLoader } from "../../../utils";
import { useHistory } from "react-router";
import { Icon } from "../../../components/common/Icons";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { Anchor } from "../../../components/common/Anchor";

export const Sent = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    fetchChallenges();
  }, [props.challenges, limit]);

  const fetchChallenges = async () => {
    const challengesSentQuery = await firestore
      .collection("challenges")
      .where("deleted", "==", false)
      .where("isClosed", "==", false)
      .where("challenged", "!=", null)
      .where("challenger.id", "==", get(authUser, "id", null))
      .limit(limit)
      .get();

    const challengesReceived = orderBy(
      snapshotToArray(challengesSentQuery),
      ["createAt"],
      ["desc"]
    );

    setChallenges(challengesReceived);
    setIsLoading(false);
  };

  if (isLoading) return spinLoader();

  return (
    <SentContainer>
      {challenges.map((challenge) => (
        <div className="container-challenge" key={challenge.id}>
          <ChallengeView challenge={challenge} sent />
        </div>
      ))}
      {!isEmpty(challenges) && limit <= challenges.length && (
        <Anchor
          margin="10px auto"
          display="block"
          type="primary"
          disabled={isLoading}
          loading={isLoading}
          onClick={() => {
            setIsLoading(true);
            setLimit(limit + 4);
          }}
        >
          VER MÁS
        </Anchor>
      )}
      <div className="button-container">
        <ButtonBombo
          margin="0"
          onClick={() =>
            history.push({
              hash: "#right-menu",
              search: "?tab=search-user",
            })
          }
        >
          Invitar Usuario
          <Icon type="user" />
        </ButtonBombo>
      </div>
      {isEmpty(challenges) && (
        <div className="empty-container">
          No tienes invitaciones enviadas por el momento
        </div>
      )}
    </SentContainer>
  );
};

const SentContainer = styled.div`
  width: 100%;
  padding: 1rem 0;

  .container-challenge {
    padding: 1rem 0;
    border-bottom: 1px solid ${(props) => props.theme.basic.blackLighten};
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 1rem;
  }

  .empty-container {
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    font-weight: normal;
    text-align: left;
    margin: 1rem;
  }
`;
