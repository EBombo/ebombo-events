import React from "reactn";
import moment from "moment";
import { ModalContainer } from "../../../../components/common/ModalContainer";

export const ModalSuggestion = ({
  activeModalSuggestion,
  setActiveModalSuggestion,
  selectedSuggestion,
}) => {
  const {
    user: { nickname, email },
    createAt,
    content,
  } = selectedSuggestion;

  return (
    <ModalContainer
      visible={activeModalSuggestion}
      onCancel={() => setActiveModalSuggestion(!activeModalSuggestion)}
      footer={false}
      onOk={() => setActiveModalSuggestion(!activeModalSuggestion)}
    >
      <div className="container-term-and-conditions">
        <p className="MsoNormal" align="center" style={{ textAlign: "center" }}>
          <b style={{ msoBidiFontWeight: "normal" }}>
            <span
              style={{
                fontSize: "14.0pt",
                lineHeight: "115%",
              }}
            >
              Sugerencia de :
              <br />
              {nickname.toUpperCase()}
              <br />
              <span
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open(
                    `http://${window.location.host}/admin/users/${selectedSuggestion.user.id}`,
                    "_blank"
                  )
                }
              >
                {email}
              </span>
            </span>
          </b>
        </p>
        <p className="MsoNormal">
          <b>{moment(createAt.toDate()).format("DD/MM/YYYY hh:mm A")}</b>
        </p>
        <p className="MsoNormal">
          <b>{content}</b>
        </p>
      </div>
    </ModalContainer>
  );
};
