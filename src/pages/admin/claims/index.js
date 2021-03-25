import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { snapshotToArray } from "../../../utils";
import { firestore } from "../../../firebase";
import orderBy from "lodash/orderBy";
import { Divider, Input, List as ListAntd } from "antd";
import { useAcl } from "../../../acl";

export const AdminClaims = (props) => {
  const { AclLink } = useAcl();

  const [searchMatchClaim, setSearchMatchClaim] = useState("");
  const [matchesClaims, setMatchesClaims] = useState([]);
  const [isLoadingMatchesClaims, setIsLoadingMatchesClaims] = useState(true);
  const [notFound, setNotFound] = useState(null);

  useEffect(() => {
    fetchMatchesClaims();
  }, []);

  useEffect(() => {
    !searchMatchClaim.trim() ? fetchMatchesClaims() : fetchMatchClaim();
  }, [searchMatchClaim]);

  const fetchMatchesClaims = async () => {
    try {
      setNotFound(null);
      setIsLoadingMatchesClaims(true);

      const matchesClaimsRef = await firestore
        .collection("matches")
        .where("hasClaim", "==", true)
        .where("isClosed", "==", false)
        .orderBy("finishAt", "desc")
        .limit(100)
        .get();

      setMatchesClaims(snapshotToArray(matchesClaimsRef));
    } catch (error) {
      console.error("Fetch matches claims", error);
    } finally {
      setIsLoadingMatchesClaims(false);
    }
  };

  const fetchMatchClaim = async () => {
    try {
      setNotFound(null);
      setIsLoadingMatchesClaims(true);

      const matchClaimRef = await firestore
        .collection("matches")
        .doc(searchMatchClaim)
        .get();

      if (!matchClaimRef.exists)
        throw Error("match doesn't exist: " + searchMatchClaim);

      setMatchesClaims([matchClaimRef.data()]);
    } catch (error) {
      console.error("Fetch match claim", error);

      setNotFound("No existe la queja: " + searchMatchClaim);
    } finally {
      setIsLoadingMatchesClaims(false);
    }
  };

  const matchesClaims_ = () => orderBy(matchesClaims, ["finishAt"], ["desc"]);

  return (
    <Container>
      <h2>Quejas de partidos</h2>
      <br />
      <div>
        <Input.Search
          placeholder="Buscar reclamo"
          onSearch={(value) => setSearchMatchClaim(value)}
        />
      </div>
      <Divider />
      {notFound ? (
        <div className="not-found">{notFound}</div>
      ) : (
        <List
          locale={{ emptyText: "Sin quejas" }}
          loading={isLoadingMatchesClaims}
          itemLayout="vertical"
          size="large"
          dataSource={matchesClaims_()}
          renderItem={(matchClaim) => (
            <List.Item>
              <AclLink
                name="/admin/claims/:claimId"
                to={`/admin/claims/${matchClaim.id}`}
              >
                <div className="match-claim">
                  <p>{matchClaim.id}</p>
                  <span>Jugador: {matchClaim.challenged[0].nickname}</span>
                  <span>Retador: {matchClaim.challenger[0].nickname}</span>
                  <h4>{`Fecha de inicio: ${moment(
                    matchClaim.claimCreateAt.toDate()
                  ).format("DD MMM YYYY hh:mm A")}`}</h4>
                  <h4>{`Fecha de fin: ${moment(
                    matchClaim.finishAt.toDate()
                  ).format("DD MMM YYYY hh:mm A")}`}</h4>
                </div>
              </AclLink>
            </List.Item>
          )}
        />
      )}
    </Container>
  );
};

const Container = styled.section`
  .not-found {
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
  }
`;

const List = styled(ListAntd)`
  .ant-spin-dot {
    width: 2em;
    height: 2em;

    .ant-spin-dot-item {
      width: 20px;
      height: 20px;
    }
  }

  .ant-list-item {
    cursor: pointer;
  }

  .match-claim {
    display: flex;
    flex-direction: column;

    span {
      color: gray;
      font-size: 0.8rem;
    }
  }
`;
