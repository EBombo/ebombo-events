import React, { useEffect, useState } from "reactn";
import { snapshotToArray, spinLoader, wrappedLink } from "../../../utils";
import { Button, Divider, List, Modal, Tag, Tooltip } from "antd";
import { firestore } from "../../../firebase";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { useHistory } from "react-router";
import { ButtonBombo, Upload } from "../../../components";
import { useAcl } from "../../../acl";
import { Icon } from "../../../components/common/Icons";

export default () => {
  const [loadingLanding, setLoadingLanding] = useState(true);
  const [landing, setLoading] = useState([]);
  const history = useHistory();
  const { Acl } = useAcl();

  useEffect(() => {
    const unsubscribeLanding = fetchLanding();
    return () => unsubscribeLanding();
  }, []);

  const landingOrder = (landing_) =>
    orderBy(landing_, [(landing_) => landing_.updateAt.toDate()], ["desc"]);

  const fetchLanding = () =>
    firestore
      .collection("landing")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setLoading(landingOrder(snapshotToArray(snapshot)));
        setLoadingLanding(false);
      });

  const deleteLanding = (landing) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("landing")
          .doc(landing.id)
          .set({ ...landing, deleted: true }, { merge: true }),
    });

  const updateLandingImage = async (landing_, landingId) =>
    await firestore
      .doc(`landing/${landingId}`)
      .set({ ...landing_ }, { merge: true });

  return loadingLanding ? (
    spinLoader()
  ) : (
    <section>
      <Acl name="/admin/landing/new">
        <ButtonBombo
          margin="0"
          icon={<Icon type="plus-circle" />}
          className="button-primary"
          onClick={() => history.push("/admin/landing/new")}
        >
          AGREGAR ELEMENTO
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={landingOrder(landing)}
        renderItem={(landing) => (
          <List.Item
            style={{ cursor: "pointer", display: "flex" }}
            actions={[
              <div
                style={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Acl name="/admin/landing/:landingId">
                  <Tooltip title="Editar elemento">
                    <Icon
                      onClick={() =>
                        history.push(`/admin/landing/${landing.id}`)
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/landing#delete">
                  <Tooltip title="Eliminar elemento">
                    <Icon
                      onClick={() => deleteLanding(landing)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            {
              <div style={{ width: "100%" }}>
                <>
                  <h3 style={{ margin: "0px" }} key={landing.id}>
                    {landing.elementType === "slider"
                      ? get(landing, "titleSlider", "").toUpperCase()
                      : landing.elementType === "first-section"
                      ? get(landing, "titleSection", "").toUpperCase()
                      : landing.elementType === "tips"
                      ? get(landing, "titleTips", "").toUpperCase()
                      : get(landing, "companyName", "").toUpperCase()}
                  </h3>
                  {landing.elementType === "slider" ? (
                    <Tag color="#2db7f5">slider</Tag>
                  ) : landing.elementType === "tips" ? (
                    <Tag color="#FFB703">tips</Tag>
                  ) : landing.elementType === "first-section" ? (
                    <Tag color="#87d068">seccion</Tag>
                  ) : (
                    <Tag color="#B22222">company</Tag>
                  )}
                </>
                <div
                  className="content-uploads"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "60%",
                  }}
                >
                  {!(landing.elementType === "tips") && (
                    <Upload
                      isImage={true}
                      accept="image/*"
                      bucket="landing"
                      filePath={`landing/${landing.id}`}
                      fileName={
                        landing.elementType === "slider"
                          ? "slider"
                          : landing.elementType === "companies"
                          ? "company"
                          : "first-section"
                      }
                      name={
                        landing.elementType === "slider"
                          ? "sliderImageUrl"
                          : landing.elementType === "companies"
                          ? "companyImageUrl"
                          : "firstSectionImageUrl"
                      }
                      buttonText={
                        landing.elementType === "slider"
                          ? "slider IMG"
                          : landing.elementType === "companies"
                          ? "Logo de empresa"
                          : "First Section IMG"
                      }
                      document={landing}
                      afterUpload={(landing_) =>
                        updateLandingImage(landing_, landing.id)
                      }
                      sizeResized={
                        landing.elementType === "slider"
                          ? "1300x500"
                          : landing.elementType === "companies"
                          ? "460x600"
                          : "580x260"
                      }
                    />
                  )}
                  {landing.elementType === "slider" && (
                    <Upload
                      isImage={true}
                      accept="image/*"
                      bucket="landing"
                      filePath={`landing/${landing.id}`}
                      fileName={"slider-mobile"}
                      name={"sliderImageUrlMobile"}
                      buttonText={"slider Image Mobile"}
                      document={landing}
                      afterUpload={(landing_) =>
                        updateLandingImage(landing_, landing.id)
                      }
                      sizeResized={"460x600"}
                    />
                  )}
                </div>
              </div>
            }
          </List.Item>
        )}
      />
    </section>
  );
};
