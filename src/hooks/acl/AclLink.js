import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";

export const AclLink = (props) => {
  const router = useRouter();

  const isEnabled = props.userAcls.some((acl) => acl === props.name);

  const onClick = () => (isEnabled && props.onClick ? props.onClick() : router.push(props.to));

  return (
    <Link isEnabled={isEnabled} onClick={onClick}>
      {props.children}
    </Link>
  );
};

const Link = styled.div`
  cursor: ${({ isEnabled }) => (isEnabled ? "pointer" : "default")};

  :hover {
    opacity: ${({ isEnabled }) => isEnabled && "0.75"};
  }
`;
