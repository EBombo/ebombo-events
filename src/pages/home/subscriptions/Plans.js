import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { spinLoader } from "../../../components/common/loader";
import get from "lodash/get";
import { Icon } from "../../../components/common/Icons";
import { Anchor, ButtonAnt } from "../../../components/form";
import { ModalSubscriptions } from "./ModalSubscriptions";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export const Plans = (props) => {
  const router = useRouter();
  const [authUser] = useGlobal("user");
  const [isVisibleModalSubscriptions, setIsVisibleModalSubscriptions] =
    useState(false);
  const [subscriptions, setSubscriptions] = useState(null);
  const [tab, setTab] = useState(0);
  const [currentSubscription, setCurrentSubscription] = useState(null);

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
    <PlansContainer>
      <ModalSubscriptions
        isVisibleModalSubscriptions={isVisibleModalSubscriptions}
        setIsVisibleModalSubscriptions={setIsVisibleModalSubscriptions}
        subscription={currentSubscription}
        {...props}
      />
      <div className="title">Conoce nuestros planes</div>
      <div className="tabs">
        {subscriptions.map((subscription, index) => (
          <div
            className={`tab ${tab === index && "active"}`}
            onClick={() => setTab(index)}
            key={index}
          >
            {subscription.type}
            {get(authUser, "isAdmin") && (
              <div className="container-edit">
                <Icon
                  className="icon"
                  type="edit"
                  onClick={() => {
                    setCurrentSubscription(subscription);
                    setIsVisibleModalSubscriptions(true);
                  }}
                />
                <Icon
                  className="icon-delete"
                  type="delete"
                  onClick={() => {
                    console.log("Delete");
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {get(authUser, "isAdmin") && (
          <ButtonAnt
            variant="outlined"
            color="warning"
            onClick={() => {
              setCurrentSubscription({
                id: firestore
                  .collection("settings")
                  .doc("landing")
                  .collection("subscriptions")
                  .doc().id,
              });
              setIsVisibleModalSubscriptions(true);
            }}
          >
            Añadir
          </ButtonAnt>
        )}
      </div>
      <div className="subscriptions">
        <div className="plan standard">
          <div className="name">
            {subscriptions[tab]?.standardPlan?.name || "Estandar"}
          </div>
          <div className="promo">
            {subscriptions[tab]?.standardPlan?.promo || ""}
          </div>
          <div className="price">
            $ {subscriptions[tab]?.standardPlan?.price || ""}
          </div>
          <div className="divider" />
          <div className="description">
            {subscriptions[tab]?.standardPlan?.description || ""}
          </div>
          <button className="btn standard">Comprar ahora</button>
        </div>

        <div className="plan pro">
          <div className="name">
            {subscriptions[tab]?.proPlan?.name || "Estandar"}
          </div>
          <div className="promo">
            {subscriptions[tab]?.proPlan?.promo || ""}
          </div>
          <div className="price">
            $ {subscriptions[tab]?.proPlan?.price || ""}
          </div>
          <div className="divider" />
          <div className="description">
            {subscriptions[tab]?.proPlan?.description || ""}
          </div>

          <button className="btn standard">Comprar ahora</button>
        </div>
        <div className="plan presenter">
          <div className="name">
            {subscriptions[tab]?.presenterPlan?.name || "Estandar"}
          </div>
          <div className="promo">
            {subscriptions[tab]?.presenterPlan?.promo || ""}
          </div>
          <div className="price">
            $ {subscriptions[tab]?.presenterPlan?.price || ""}
          </div>
          <div className="divider" />
          <div className="description">
            {subscriptions[tab]?.presenterPlan?.description || ""}
          </div>

          <button className="btn standard">Comprar ahora</button>
        </div>
      </div>
      <div className="more-info">
        <button
          className="btn-subs"
          onClick={() => router.push("/subscriptions")}
        >
          Ver más planes <ArrowRightOutlined />
        </button>
      </div>
    </PlansContainer>
  );
};

const PlansContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.whiteLighten};

  .more-info {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-subs {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 23px;
      color: ${(props) => props.theme.basic.secondary};
      background: none;
      border: none;
    }
  }

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
      position: relative;

      .container-edit {
        position: absolute;
        height: 15px;
        cursor: pointer;
        top: -15px;
        right: -30px;

        svg {
          width: 15px;
          height: 15px;
          color: ${(props) => props.theme.basic.action};
        }

        .icon-delete {
          margin-left: 5px;

          svg {
            color: ${(props) => props.theme.basic.danger};
          }
        }
      }
    }

    .active {
      color: ${(props) => props.theme.basic.secondary};
      text-decoration: underline;
    }
  }

  .subscriptions {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;

    .plan {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: -7px 5px 30px -2px rgba(0, 0, 0, 0.14);
      border-radius: 8px;
      width: 250px;
      height: 315px;
      margin: 1rem 0;

      .name {
        font-family: Lato;
        font-style: normal;
        font-weight: 800;
        font-size: 17px;
        line-height: 21px;
        text-align: center;
        color: ${(props) => props.theme.basic.primary};
      }

      .price {
        font-family: Lato;
        font-style: normal;
        font-weight: 800;
        font-size: 47.2172px;
        line-height: 57px;
      }

      .divider {
        height: 1px;
        background: #e4e4e4;
        width: 90%;
      }

      .description {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.black};
        text-align: center;
        max-width: 80%;
      }

      .promo {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Lato;
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
      }

      .btn {
        width: 90%;
        height: 45px;
        top: 3031.43px;
        background: ${(props) => props.theme.basic.primary};
        border-radius: 5px;
        border: none;
        font-family: Lato;
        font-style: normal;
        font-weight: 800;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.whiteLight};
      }
    }

    .standard {
      .promo {
        width: 125px;
        height: 25px;
        background: ${(props) => props.theme.basic.primary};
        border-radius: 15px;
        color: ${(props) => props.theme.basic.whiteLight};
      }
    }

    .pro {
      width: 295px;
      height: 377px;

      .name {
        font-family: Lato;
        font-style: normal;
        font-weight: 800;
        font-size: 27px;
        line-height: 32px;
        color: ${(props) => props.theme.basic.blackDarken};
      }

      .promo {
        width: 132px;
        height: 28px;
        background: ${(props) => props.theme.basic.blackDarken};
        border-radius: 15px;
        font-family: Lato;
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .btn {
        background: ${(props) => props.theme.basic.blackDarken};
      }
    }

    .presenter {
      .name {
        color: ${(props) => props.theme.basic.primaryLighten};
      }

      .price {
        color: ${(props) => props.theme.basic.primaryLighten};
      }

      .promo {
        width: 125px;
        height: 25px;
        background: ${(props) => props.theme.basic.primaryLighten};
        border-radius: 15px;
        color: ${(props) => props.theme.basic.whiteLight};
      }

      .btn {
        background: ${(props) => props.theme.basic.primaryLighten};
      }
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

    .subscriptions {
      flex-direction: row;
      .plan {
        width: 336px;
        height: 429px;

        .price {
          font-size: 64px;
          line-height: 77px;
        }
      }

      .standard,
      .presenter {
        .name {
          font-size: 24px;
          line-height: 29px;
        }

        .promo {
          width: 172px;
          height: 32px;
          border-radius: 20px;
          font-size: 16px;
          line-height: 19px;
        }
      }

      .pro {
        width: 400px;
        height: 511px;

        .name {
          font-size: 36px;
          line-height: 43px;
        }

        .promo {
          width: 178px;
          height: 38px;
          font-size: 18px;
          line-height: 22px;
        }
      }
    }
  }
`;
