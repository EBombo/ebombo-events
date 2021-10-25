import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { spinLoader } from "../../../components/common/loader";

export const Subscriptions = (props) => {
  const [subscriptions, setSubscriptions] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchSubscriptions = async () =>
      firestore
        .collection("settings")
        .doc("landing")
        .collection("subscriptions")
        .onSnapshot((subscriptionsSnapshop) => {
          setSubscriptions(snapshotToArray(subscriptionsSnapshop));
        });

    fetchSubscriptions();
  }, []);

  if (!subscriptions) return spinLoader();

  return (
    <SubscriptionsContainer>
      <div className="title">Conoce nuestros planes</div>
      <div className="tabs">
        {subscriptions.map((subscription, index) => (
          <div
            className={`tab ${tab === index && "active"}`}
            onClick={() => setTab(index)}
            key={index}
          >
            {subscription.type}
          </div>
        ))}
      </div>
      <div className="subscriptions">
        <div className="plan standar">
          <div className="title">{subscriptions[tab].standardPlan.name}</div>
        </div>

        <div className="plan pro"></div>
        <div className="plan presenter"></div>
      </div>
    </SubscriptionsContainer>
  );
};

const SubscriptionsContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.whiteLighten};

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.secondary};
    text-align: center;
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;

    .tab {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 10px;
      line-height: 11px;
      color: ${(props) => props.theme.basic.grayLighten};
      cursor: pointer;
    }

    .active {
      color: ${(props) => props.theme.basic.secondary};
      text-decoration: underline;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .tabs {
      margin: 2rem 0;
      .tab {
        font-size: 24px;
        line-height: 29px;
      }
    }
  }
`;
