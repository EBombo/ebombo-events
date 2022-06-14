import React from "reactn";
import { Progress } from "antd";
import { useTranslation } from "../../../../hooks";

export const TriviaUsers = (props) => {
  const { t } = useTranslation("pages.reports.trivia");

  const calculateHits = (user) => {
    if (user.stats?.correct) return user.stats?.correct.length / props.questions?.length;

    return 0;
  };

  return (
    <div className="max-w-[90vw] overflow-auto mx-auto no-scrollbar">
      <div className="p-4 lg:p-8 gap-4 mx-auto min-w-[700px] max-w-[875px] w-full">
        <table className="w-full rounded-[6px] overflow-hidden shadow-[0_0_7px_rgb(0,0,0,0.25)]">
          <thead className="w-full">
            <tr className="w-full bg-whiteDark grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr] h-[60px] border-b-[1px] border-grayLighten px-4">
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("hits")}</th>
              <th>{t("points")}</th>
              <th>{t("answers")}</th>
            </tr>
          </thead>
          <tbody>
            {props.users.map((user, index) => (
              <tr
                className="w-full bg-whiteLight grid items-center grid-cols-[1fr_2fr_1fr_1fr_1fr] h-[60px] px-4"
                key={user.id}
              >
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">{user.nickname}</td>
                <td className="text-center text-blackDarken text-[14px] leading-[17px] font-[400]">{user.email}</td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  <Progress
                    type="circle"
                    showInfo={false}
                    percent={calculateHits(user)}
                    width={20}
                    strokeWidth={20}
                    strokeColor="#56EEA5"
                    trailColor="#FB4646"
                  />
                  <span className="text-blackDarken text-[14px] leading-[17px] font-[800]">{calculateHits(user)}%</span>
                </td>
                <td className="text-blackDarken text-[14px] leading-[17px] font-[400] flex items-center justify-center gap-2">
                  {user.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};