import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";
import { ButtonAnt } from "../../../../components/form";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";

export const PlanCard = (props) => {
  const router = useRouter();
  const {userId} = router.query;

  const [activePlan, setActivePlan] = useState();
  const [subscription, setSubscription] = useState();
  const [isVisibleSeePlans, setIsVisibleSeePlans] = useState(false);

  const getUserSubscriptions = () => firestore.collection(`customers/${userId}/subscriptions`).where('status', '==', 'active').get();

  useEffect(() => {
    const getPlan = async () => {
      const activeSubscriptions = snapshotToArray(await getUserSubscriptions());
      if (activeSubscriptions.length === 0) {
        return setActivePlan(null);
      }
      setSubscription(activeSubscriptions[0]);
      return setActivePlan((await activeSubscriptions[0].product.get()).data());
    };

    return getPlan();
  }, []);

  return (
    <PlanCardStyled>
      <ModalContainer
        background={darkTheme.basic.gray}
        footer={null}
        visible={isVisibleSeePlans}
        closable={true}
        onCancel={() => setIsVisibleSeePlans(false)}
      >
        Planes
      </ModalContainer>

      <div className="status-label"><span className="dot">&bull;</span>{ subscription?.status }</div>
      <div className="subheading">Plan Actual</div>
      <div className="heading">{activePlan ? activePlan.name : 'Free'}</div>

      {activePlan && (
        <>
          <div className="no-plan-label">¿Aún no tienes un plan?</div>
          <ButtonAnt block color="secondary" className="button-see-plans" onClick={() => {setIsVisibleSeePlans(true)}}>Ver planes</ButtonAnt>
        </>
      )}
    </PlanCardStyled>
  );
};

const PlanCardStyled = styled.div`
  background: ${(props) => props.theme.basic.primary};
  border-radius: 5px;
  padding: 1rem;
  margin: 1rem 0;

  .status-label {
    float: right;
    padding: 0.25rem 0.5rem;
    background: ${(props) => props.theme.basic.secondary};
    color: ${(props) => props.theme.basic.white};
    border-radius: 2px;
    text-transform: capitalize;

    .dot {
      color: ${(props) => props.theme.basic.success};
      font-size: 24px;
      position: relative;
      top: 3px;
      line-height: 1px;
    }
  }

  .heading {
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    margin-bottom: 12px;
  }

  .subheading {
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    opacity: 0.7;
  }
  .no-plan-label {
    color: ${(props) => props.theme.basic.secondary};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }
`;

