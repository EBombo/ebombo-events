import React from "react";
import {MatchHistory} from "../../../../components";
import {useHistory, useParams} from "react-router";
import styled from "styled-components";
import {useEffect, useState} from "reactn";
import {firestore} from "../../../../firebase";
import {SpinLoader} from "../../../../styles/utils";
import {spinLoader} from "../../../../utils";
import {Button} from "antd";
import {useAcl} from "../../../../acl";

export const AdminMatchHistory = () => {
  const history = useHistory();
  const { Acl } = useAcl();
  const { matchHistoryId } = useParams();

  const [match, setMatch] = useState({});
  const [isLoadingMatch, setIsLoadingMatch] = useState(true);

  useEffect(() => {
    fetchMatch();
  }, []);

  const fetchMatch = async () => {
    const matchQuerySnapShot = await firestore
      .collection("matches")
      .doc(matchHistoryId)
      .get();

    if (!matchQuerySnapShot.exists) history.goBack();

    setMatch(matchQuerySnapShot.data());
    setIsLoadingMatch(false);
  };

  return isLoadingMatch ? (
    <SpinLoader>{spinLoader()}</SpinLoader>
  ) : (
    <Container>
      <div>
        <h2 className="title-information-user">Información</h2>
      </div>
      <Acl name="/admin/matches-history/:claimId/edit">
        <div style={{ display: "flex", margin: "5px" }}>
          <Button
            onClick={() =>
              history.push(`/admin/matches-history/${matchHistoryId}/edit`)
            }
            type="primary"
            style={{ margin: "auto" }}
          >
            CAMBIAR RESULTADO
          </Button>
        </div>
      </Acl>
      <WrapperMatchHistory>
        <MatchHistory match={match} />
      </WrapperMatchHistory>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const WrapperMatchHistory = styled.div`
  background: ${(props) => props.theme.basic.black};
  padding: 2rem;
  max-width: 400px;
  margin: auto;
`;
