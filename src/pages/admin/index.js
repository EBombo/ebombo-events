import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import Link from "next/link";
import { useAcl } from "../../hooks";
import { menus } from "../../components/common/DataList";
import { sizes } from "../../constants";
import { firestore } from "../../firebase";

const aclUserList = "/admin/users";
const aclContactList = "/admin/contacts";

export const AdminPage = () => {
  const { aclMenus, Acl, userAcls } = useAcl();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!userAcls.includes(aclUserList) && !userAcls.includes(aclContactList)) return;

    const fetchAnalytics = () =>
      firestore
        .collection("settings")
        .doc("analytics")
        .onSnapshot((snapshotAnalytics) => {
          const analytics_ = snapshotAnalytics.data();
          setAnalytics(analytics_);
        });

    const sub = fetchAnalytics();
    return () => sub && sub();
  }, [userAcls]);

  return (
    <WelcomeContainer>
      <div className="title">Bienvenido Administrador</div>

      <div className="list-subtitle">Lista de permisos otorgados</div>

      <ul>
        {aclMenus({ menus: menus.filter((menu) => menu.isAdmin) }).map((menu) => (
          <li key={menu.url}>
            <Link href={menu.url}>
              <span>{menu.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {analytics ? (
        <>
          <hr />

          <Acl name={aclUserList}>
            <div className="list-subtitle">Usuarios registrados: {analytics.totalUsers ?? 0}</div>
            <div className="list-subtitle">Usuarios registrados por Bdev: {analytics.totalUsersBdev ?? 0}</div>
          </Acl>

          <Acl name={aclContactList}>
            <div className="list-subtitle">Registro contactanos: {analytics.totalContacts ?? 0}</div>
            <div className="list-subtitle">Registro contactanos por Bdev: {analytics.totalContactsBdev ?? 0}</div>
          </Acl>
        </>
      ) : null}
    </WelcomeContainer>
  );
};

const WelcomeContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin: auto;
  color: ${(props) => props.theme.basic.black};

  .title {
    margin: 1rem 0;
    text-align: center;
    font-size: ${sizes.font.normal};
    font-weight: bold;
  }

  .list-subtitle {
    margin: 1rem 0;
    text-align: left;
    font-size: ${sizes.font.normal};
    font-weight: bold;
  }

  ul {
    li {
      cursor: pointer;
      list-style-position: inside;
      font-size: ${sizes.font.normal};
      color: ${(props) => props.theme.basic.primary};

      span {
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
