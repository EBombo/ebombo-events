import React, { useGlobal } from "reactn";
import get from "lodash/get";
import moment from "moment";
import { ButtonBombo } from "../../../../../../../components";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";
import { Desktop } from "../../../../../../../styles/utils";
import { Icon } from "../../../../../../../components/common/Icons";
import { config } from "../../../../../../../firebase";
import { Anchor } from "../../../../../../../components/common/Anchor";
import sizes from "../../../../../../../styles/constants/sizes";

export const InscriptionIndividual = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCurrency] = useGlobal("currentCurrency");

  return (
    <InscriptionContainer>
      {(!props.tournamentTeam ||
        (get(props, "tournamentTeam.inscriptionUrl") &&
          !get(props, "tournamentTeam.isPayed"))) &&
        moment().isBefore(props.tournament.inscriptionDate.toDate()) && (
          <>
            <Desktop>
              <div className="left-side" />
            </Desktop>
            <div className="right-side">
              <ButtonBombo
                type="primary"
                width="100%"
                loading={props.loadingInscription}
                margin="3px"
                disabled={
                  !authUser ||
                  (get(props, "tournamentTeam.inscriptionUrl") &&
                    !get(props, "tournamentTeam.isPayed")) ||
                  moment().isAfter(props.tournament.inscriptionDate.toDate()) ||
                  props.loadingInscription ||
                  !isEmpty(props.tournamentTeam) ||
                  get(props, "tournament.countTournamentTeams", 0) >=
                    props.tournament.playersLimit
                }
                onClick={() => props.userInscription()}
              >
                {get(props, "tournamentTeam.inscriptionUrl") &&
                !get(props, "tournamentTeam.isPayed") ? (
                  "ESPERA DE CONFIRMACION"
                ) : (
                  <>
                    Inscripción (
                    {`${currentCurrency}${get(
                      props,
                      "tournament.entryCost",
                      0
                    )}`}
                    )
                  </>
                )}
              </ButtonBombo>
            </div>
          </>
        )}
      {props.tournamentTeam && (
        <>
          <div className="success-inscription">
            Te has inscrito al torneo correctamente
            <Icon type="check-circle" />
          </div>
          <div className="join">
            Por favor únete al grupo de Whatsapp o Discord para
            <br />
            indicaciones o anuncios del torneo.
          </div>
          {props.tournament.whatsappUrl && (
            <Anchor
              underlined
              fontSize={sizes.font.extraLarge}
              type={"primary"}
              textAlign={"left"}
              url={props.tournament.whatsappUrl}
              className="group-link"
            >
              {props.tournament.whatsappUrl.includes("whatsapp") ? (
                <>
                  Grupo de Whatsapp
                  <img
                    src={`${config.storageUrl}/resources/wsp-icon.svg`}
                    alt=""
                  />
                </>
              ) : (
                <>
                  Grupo de Discord
                  <img
                    src={`${config.storageUrl}/resources/green-discord.svg`}
                    alt=""
                  />
                </>
              )}
            </Anchor>
          )}
        </>
      )}
    </InscriptionContainer>
  );
};

export const InscriptionContainer = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  div {
    font-weight: normal;
    font-size: 11px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.whiteDarken};
  }

  img {
    margin-left: 8px;
    width: 13px;
    height: 13px;
  }

  .success-inscription {
    display: flex;
    align-items: center;
    font-weight: normal;
    font-size: 11px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.primary};
    svg {
      margin-left: 8px;
    }
  }

  .join {
    padding: 0.5rem 0;
  }

  .group-link {
    display: flex;
    align-items: center;
    width: fit-content;
    img {
      height: 20px;
      width: 20px;
    }
  }
`;
