import React, {useEffect, useGlobal, useState} from "reactn";
import {ButtonBombo} from "../common";
import {config, firestore} from "../../firebase";
import styled from "styled-components";
import {useHistory} from "react-router";
import {snapshotToArray, spinLoader} from "../../utils";
import {collectionToDate, useCoupons} from "../../hoc/useLocalStorageState";
import isEmpty from "lodash/isEmpty";

export const Coupons = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [currency] = useGlobal("currentCurrency");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [couponsLS, setCouponsLS] = useCoupons();
  const [coupons, setCoupons] = useState(collectionToDate(couponsLS));
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const couponsQuerySnapShot = await firestore
      .collection("coupons")
      .where("discountType", "==", "ebCoins")
      .where("isVisible", "==", true)
      .where("expireDate", ">", new Date())
      .get();

    setCoupons(snapshotToArray(couponsQuerySnapShot));
    setCouponsLS(snapshotToArray(couponsQuerySnapShot));
    setLoadingCoupons(false);
  };

  return loadingCoupons && isEmpty(coupons) ? (
    spinLoader()
  ) : (
    <CouponsContainer>
      <div className="title">Ofertas diarias</div>
      <div className="item-container">
        {coupons.map((coupon) => (
          <div className="item" key={`key-coupon-${coupon.id}`}>
            <div className="item-price">
              {currency} {coupon.minAmount}
            </div>
            <div className="item-img" />
            <div className="item-cost">
              Dinero real: {currency} {coupon.minAmount}
            </div>
            <div className="item-pay-money">
              +{coupon.amount} k de bonificación
            </div>
            <ButtonBombo
              onClick={() => {
                authUser
                  ? history.push({
                      hash: "right-menu",
                      search: `?tab=top-up-money&coupon=${coupon.couponCode}&amount=${coupon.minAmount}`,
                    })
                  : setIsVisibleLoginModal(true);
              }}
            >
              Comprar
            </ButtonBombo>
          </div>
        ))}
      </div>
    </CouponsContainer>
  );
};

const CouponsContainer = styled.div`
  .title {
    color: ${(props) => props.theme.basic.primary};
    font-size: 14px;
    margin: 10px;
  }

  .item-container {
    color: white;
    text-align: center;
    display: grid;
    grid-template-columns: auto auto;
    width: 100%;
    overflow-x: auto;

    .item {
      background: ${(props) => props.theme.basic.default};
      margin: 10px;
      padding: 10px;
      width: 175px;
      overflow-x: auto;
    }

    .item-price {
      color: ${(props) => props.theme.basic.primary};
      font-size: 14px;
      font-weight: bold;
    }

    .item-img {
      height: 80px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 70px;
      background-image: url(${config.storageUrl + "/resources/ebCoin.svg"});
    }

    .item-cost {
      font-size: 10px;
    }

    .item-pay-money {
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
`;
