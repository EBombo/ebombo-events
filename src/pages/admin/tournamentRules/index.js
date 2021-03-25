import React, {useEffect, useGlobal, useState} from "reactn";
import {snapshotToArray, spinLoader} from "../../../utils";
import {Divider, List, Modal, Select as AntSelect, Tooltip} from "antd";
import {firestore} from "../../../firebase";
import orderBy from "lodash/orderBy";
import {useHistory, useParams} from "react-router";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";
import styled from "styled-components";
import {ButtonBombo} from "../../../components";

export const AdminTournamentRules = (props) => {
  const history = useHistory();
  const { Acl } = useAcl();
  const [loadingTournamentRules, setLoadingTournamentRules] = useState(true);
  const [tournamentRules, setTournamentRules] = useState([]);
  const [games] = useGlobal("games");
  const { gameId } = useParams();

  const { Option } = AntSelect;

  useEffect(() => {
    const unsubscribeRules = fetchTournamentRules();
    return () => unsubscribeRules();
  }, []);

  const tournamentRulesOrder = (tournamentRules_) =>
    orderBy(
      tournamentRules_,
      [(tournamentRule_) => tournamentRule_.updateAt.toDate()],
      ["desc"]
    );

  const fetchTournamentRules = () =>
    firestore
      .collection("tournamentRules")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setTournamentRules(tournamentRulesOrder(snapshotToArray(snapshot)));
        setLoadingTournamentRules(false);
      });

  const deleteTournamentRule = (tournamentRule) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("tournamentRules")
          .doc(tournamentRule.id)
          .set({ deleted: true }, { merge: true }),
    });

  return loadingTournamentRules ? (
    spinLoader()
  ) : (
    <div>
      <Acl name="/admin/games/:gameId/tournament-rules/new">
        <ButtonBombo
          type="primary"
          icon={<Icon type="plus-circle" />}
          className="button-primary"
          onClick={() =>
            history.push(`/admin/games/${gameId}/tournament-rules/new`)
          }
        >
          AGREGAR REGLA
        </ButtonBombo>
      </Acl>
      <Divider />
      <StyledSelect
        defaultValue={gameId}
        onSelect={(currentGameId) =>
          history.push(`/admin/games/${currentGameId}/tournament-rules`)
        }
      >
        {games.map((game) => {
          return (
            <Option value={game.id} key={`key-${game.id}`}>
              {game.name}
            </Option>
          );
        })}
      </StyledSelect>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={tournamentRulesOrder(
          tournamentRules.filter((tournament) => tournament.gameId === gameId)
        )}
        renderItem={(tournamentRule) => (
          <List.Item
            style={{ cursor: "pointer", display: "flex" }}
            actions={[
              <div
                style={{
                  width: "300px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Acl name="/admin/games/:gameId/tournament-rules/:tournamentRuleId">
                  <Tooltip title={"Editar regla"}>
                    <Icon
                      onClick={() =>
                        history.push(
                          `/admin/games/${gameId}/tournament-rules/${tournamentRule.id}`
                        )
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/games/:gameId/tournament-rules#delete">
                  <Tooltip title={"Eliminar regla"}>
                    <Icon
                      onClick={() => deleteTournamentRule(tournamentRule)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            <div>
              <h3 style={{ margin: "0px" }} key={tournamentRule.id}>
                {tournamentRule.name.toUpperCase()}
              </h3>
              <h5>{tournamentRule.description.toUpperCase()}</h5>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

const StyledSelect = styled(AntSelect)`
  margin-bottom: 1rem !important;
  width: 200px;
`;
