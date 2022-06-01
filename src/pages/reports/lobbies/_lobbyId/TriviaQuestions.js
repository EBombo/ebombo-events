import React, { useEffect } from "reactn";
import { useTranslation } from "../../../../hooks";

export const TriviaQuestions = (props) => {

  const { t } = useTranslation("pages.reports.trivia");

  useEffect(() => {

  },[])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>{t("number")}</th>
            <th>{t("question")}</th>
            <th>{t("type")}</th>
            <th>{t("hits")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
