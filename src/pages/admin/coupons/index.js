import React, {useEffect, useState} from "react";
import {snapshotToArray, spinLoader} from "../../../utils/index";
import {firestore} from "../../../firebase/index";
import moment from "moment";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import {Divider, Input, List, Tooltip} from "antd";
import {wrappedLink} from "../../../utils";
import {useHistory} from "react-router";
import {discountType} from "../../../components/common/DataList";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";
import {ButtonBombo} from "../../../components";

export const AdminCoupons = () => {
  const history = useHistory();
  const { Acl } = useAcl();
  const [search, setSearch] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    !search.trim() ? fetchCoupons() : fetchCouponsByCode();
  }, [search]);

  const fetchCoupons = async () => {
    const coupons = await firestore
      .collection("coupons")
      .where("couponType", "==", "custom")
      .orderBy("createAt", "desc")
      .limit(100)
      .get();

    setCoupons(snapshotToArray(coupons));

    setLoadingCoupons(false);
  };

  const fetchCouponsByCode = async () => {
    const coupons = await firestore
      .collection("coupons")
      .where("couponType", "==", "custom")
      .where("couponCode", "==", search.toUpperCase())
      .limit(100)
      .get();

    setCoupons(snapshotToArray(coupons));

    setLoadingCoupons(false);
  };

  if (loadingCoupons) return spinLoader();

  return (
    <div>
      <h2>Cupones</h2>
      <Acl name="/admin/coupons/new">
        <ButtonBombo
          margin="0"
          style={{ marginBottom: "10px" }}
          onClick={() => history.push("/admin/coupons/new")}
        >
          AÑADIR CUPÓN
        </ButtonBombo>
      </Acl>
      <div className="content-filters">
        <Input.Search
          className="search-team"
          placeholder="Buscar cupón"
          onSearch={(value) => setSearch(value)}
        />
      </div>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={orderBy(coupons, ["createAt"], ["desc"])}
        locale={{ emptyText: "Aún no tienes cupones" }}
        renderItem={(coupon) => (
          <List.Item
            style={{ cursor: "pointer", display: "flex" }}
            actions={[
              <div
                style={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  cursor: "pointer",
                }}
              >
                <Acl name="/admin/coupons/:couponId">
                  <Tooltip title={"Add coins"}>
                    <Icon
                      onClick={() =>
                        history.push(`/admin/coupons/${coupon.id}`)
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            {wrappedLink(
              `/admin/coupons/${coupon.id}`,
              <div className="admin-coupons">
                <p>{get(coupon, "couponCode", "").toUpperCase()}</p>
                <h4>
                  Tipo:{" "}
                  {get(
                    discountType.find(
                      (type) => type.type === coupon.discountType
                    ),
                    "name",
                    ""
                  )}
                </h4>
                <h4>{`Creado: ${
                  coupon.createAt &&
                  moment(coupon.createAt.toDate()).format("DD MMM YYYY")
                }`}</h4>
                {coupon.expireDate && (
                  <h4>{`Vence: ${
                    coupon.expireDate &&
                    moment(coupon.expireDate.toDate()).format(
                      "DD MMM YYYY HH:mm:ss"
                    )
                  }`}</h4>
                )}
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};
