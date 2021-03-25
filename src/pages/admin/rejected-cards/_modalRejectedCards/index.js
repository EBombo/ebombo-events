import React from "reactn";
import moment from "moment";
import { ModalContainer } from "../../../../components/common/ModalContainer";

export const ModalRejectedCards = ({
  setActiveModalRejectedCards,
  selectedRejectedCard,
  activeModalRejectedCards,
  currentCurrency,
}) => {
  const {
    user: { nickname, email, phoneNumber, dialCode },
    createAt,
    amount,
  } = selectedRejectedCard;

  return (
    <ModalContainer
      visible={activeModalRejectedCards}
      onCancel={() => setActiveModalRejectedCards(!activeModalRejectedCards)}
      footer={false}
      onOk={() => setActiveModalRejectedCards(!activeModalRejectedCards)}
    >
      <div className="container-term-and-conditions">
        <p className="MsoNormal" style={{ textAlign: "center" }}>
          <b style={{ msoBidiFontWeight: "normal" }}>
            <span
              style={{
                fontSize: "14.0pt",
                lineHeight: "115%",
              }}
            >
              {nickname.toUpperCase()}
              <br />
            </span>
          </b>
        </p>
        <p className="MsoNormal">
          <span>
            {email}{" "}
            <span
              style={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() =>
                window.open(
                  `http://${window.location.host}/admin/users/${selectedRejectedCard.user.id}`,
                  "_blank"
                )
              }
            >
              [ Ver usuario ]
            </span>
          </span>
          <br />
          <span>
            {dialCode} {phoneNumber}
          </span>
        </p>
        <p className="MsoNormal">
          <b>
            El usuario iba a recargar {currentCurrency} {amount} pero su tarjeta
            fue rechazada.
          </b>
        </p>
        <p className="MsoNormal">
          <b>{moment(createAt.toDate()).format("DD/MM/YYYY hh:mm A")}</b>
        </p>
      </div>
    </ModalContainer>
  );
};
