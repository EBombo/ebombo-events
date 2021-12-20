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

export const Company = (props) => {
  const router = useRouter();
  const { companyId, currentTab } = router.query;

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

  return (
    <CompanyContainer>
      <Desktop>
        <DesktopLeftMenu {...props} />
      </Desktop>
      <div className="main-container">
        <div className="tabs-container">
          <div className={`tab left ${tab === "information" && "active"}`} onClick={() => setTab("information")}>
            Adm. de la empresa
          </div>
          {!isNewCompany && (
            <div className={`tab middle ${tab === "users" && "active"}`} onClick={() => setTab("users")}>
              Adm. de usuarios
            </div>
          )}
          {hasBillingPermissions && (
            <div className={`tab  middle ${tab === "billing" && "active"}`} onClick={() => setTab("billing")}>
              Facturación
            </div>
          )}
          <div className={`tab  right ${tab === "report" && "active"}`} onClick={() => setTab("report")}>
            Informe de uso
          </div>
        </div>

        {tab === "information" && <EditCompany company={company} {...props} />}

        {tab === "users" && <AdminCompanyUsers company={company} users={[...users, ...usersAdmin]} {...props} />}

        {tab === "report" && <CompanyReport company={company} users={users} usersAdmin={usersAdmin} {...props} />}

        {tab === "billing" && <Billing user={company} {...props} />}
      </div>
    </CompanyContainer>
  );
};

const CompanyContainer = styled.div`
  width: 100%;

  .tabs-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${(props) => props.theme.basic.whiteLight};
    border-bottom: 3px solid ${(props) => props.theme.basic.grayLighten};
    height: 45px;
    width: 100%;
    padding: 0 1rem;

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackLighten};
      height: 100%;
      position: relative;
    }

    .active {
      color: ${(props) => props.theme.basic.primary};
    }

    .active::after {
      content: "";
      position: absolute;
      height: 3px;
      width: 100%;
      bottom: -3px;
      background: ${(props) => props.theme.basic.primary};
    }
  }

  .main-container {
    background: ${(props) => props.theme.basic.whiteLight};
    min-height: calc(100vh - 50px);
    overflow: auto;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 250px auto;
    height: calc(100vh - 50px);

    .main-container {
      padding: 2rem;
      background: ${(props) => props.theme.basic.whiteDark};
      height: 100%;
      overflow: auto;
    }

    .tabs-container {
      display: flex;
      grid-template-columns: auto auto auto;
      justify-content: flex-start;
      background: transparent;
      padding: 0;
      margin: 1rem 0;
      border-bottom: none;

      .tab {
        padding: 0.5rem 1rem;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        cursor: pointer;
      }

      .left,
      .middle,
      .right {
        border-top: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-bottom: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .left {
        border-left: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-radius: 4px 0 0 4px;
      }

      .middle,
      .right {
        border-left: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .right {
        border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
        border-radius: 0 4px 4px 0;
      }

      .active {
        background: ${(props) => props.theme.basic.whiteLight};
        color: ${(props) => props.theme.basic.primary};
      }

      .active::after {
        height: 0;
      }
    }
  }
`;
