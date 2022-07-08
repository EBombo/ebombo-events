import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery } from "../../../constants";
import { DesktopLeftMenu } from "../../../components/common/DesktopLeftMenu";
import { useRouter } from "next/router";
import { firestore } from "../../../firebase";
import { EditCompany } from "./EditCompany";
import { spinLoader } from "../../../components/common/loader";
import { AdminCompanyUsers } from "./AdminCompanyUsers";
import { snapshotToArray } from "../../../utils";
import { CompanyReport } from "./CompanyReport";
import { Billing } from "./Billing";
import { useTranslation } from "../../../hooks";

export const Company = (props) => {
  const router = useRouter();
  const { companyId, currentTab } = router.query;

  const { t } = useTranslation("pages.companies");

  const [authUser] = useGlobal("user");

  const [company, setCompany] = useState(null);
  const [users, setUsers] = useState(null);
  const [usersAdmin, setUsersAdmin] = useState(null);
  const [tab, setTab] = useState(currentTab ?? "information");
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingUsersAdmin, setLoadingUsersAdmin] = useState(true);
  const [isNewCompany, setIsNewCompany] = useState(null);
  const [hasBillingPermissions, setHasBillingPermissions] = useState(false);

  useEffect(() => {
    const fetchCompany = () =>
      firestore
        .collection("companies")
        .doc(companyId)
        .onSnapshot((companyOnSnapShot) => {
          setIsNewCompany(!companyOnSnapShot.exists);
          if (!companyOnSnapShot.exists) {
            setCompany({
              id: companyId,
            });
            return setLoadingCompany(false);
          }

          const _company = companyOnSnapShot.data();
          setHasBillingPermissions(_company.usersIds.includes(authUser.id));

          setCompany(_company);
          setLoadingCompany(false);
        });

    const unSub = fetchCompany();
    return () => unSub && unSub();
  }, [companyId]);

  useEffect(() => {
    const fetchUsers = () =>
      firestore
        .collection("companies")
        .doc(companyId)
        .collection("members")
        .onSnapshot((membersOnSnapShot) => {
          setUsers(snapshotToArray(membersOnSnapShot));
          setLoadingUsers(false);
        });

    const unSub = fetchUsers();
    return () => unSub && unSub();
  }, [companyId]);

  useEffect(() => {
    if (!company) return;

    const fetchUsersAdmin = () =>
      firestore
        .collection("users")
        .where("companyId", "==", companyId)
        .onSnapshot((adminsOnSnapShot) => {
          const currentAdmins = snapshotToArray(adminsOnSnapShot).map((admin) => ({
            ...admin,
            role: company.usersIds.includes(admin.id) ? "Owner" : "admin",
            status: "Active",
            key: admin.id,
          }));

          setUsersAdmin(currentAdmins);
          setLoadingUsersAdmin(false);
        });

    const unSub = fetchUsersAdmin();
    return () => unSub && unSub();
  }, [companyId, company]);

  if (loadingCompany || loadingUsers || loadingUsersAdmin) return spinLoader();


  const Tab = (props) => (<div className={`
    relative text-center flex items-center text-md text-blackLighen h-full px-2
    lg:py-2 lg:px-4 lg:font-bold lg:text-base lg:cursor-pointer
    lg:border-y-[2px] lg:border-y-grayLighten lg:border-l-[2px] lg:border-l-grayLighten
    ${props.left && "rounded-l-[4px]" }
    ${props.middle && "" }
    ${props.right && "lg:border-r-[2px] lg:border-r-grayLighten rounded-r-[4px]" }
    ${props.active && "text-primary lg:bg-whiteLight after:content-[''] after:absolute after:h-[3px] lg:after:h-0 after:w-full after:bottom-[-3px] after:bg-primary" }
  `} {...props}>
    {props.children}
  </div>);

  return (
    <div className="w-full lg:grid lg:grid-cols-[auto] lg:h-[calc(100vh-50px)]">
      <div className="bg-whiteLight min-h-[calc(100vh-50px)] overflow-auto lg:p-8 lg:bg-whiteDark lg:h-full lg:overflow-auto">
        <div className={`flex items-center justify-between bg-whiteLight h-[45px] w-full lg:px-4 border-b-[3px] border-b-grayLighten
          lg:justify-start lg:p-0 lg:my-4 lg:border-none lg:bg-transparent
        `}>
          <Tab
            active={tab === "information"}
            left
            onClick={() => setTab("information")}
          >{t("company-management")}</Tab>

          {!isNewCompany && (
            <Tab
              middle
              active={tab === "users"}
              onClick={() => setTab("users")}
            >{t("users-management")}</Tab>
          )}

          {hasBillingPermissions && (
            <Tab
              middle
              active={tab === "billing"}
              onClick={() => setTab("billing")}
            >{t("invoicing")}</Tab>
          )}

          <Tab
            right
            active={tab === "report"}
            onClick={() => setTab("report")}
          >{t("usage-report")}</Tab>
        </div>

        {tab === "information" && <EditCompany company={company} {...props} />}

        {tab === "users" && <AdminCompanyUsers company={company} users={[...users, ...usersAdmin]} {...props} />}

        {tab === "report" && <CompanyReport company={company} users={users} usersAdmin={usersAdmin} {...props} />}

        {tab === "billing" && <Billing user={company} {...props} />}
      </div>
    </div>
  );
};

