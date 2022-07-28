import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { useRouter } from "next/router";

export const HeldEvent = (props) => {
  const router = useRouter();

  return (
    <HelpEventStyled
      onClick={(e) => {
        e.preventDefault();
        router.push(`/held-events/${props.heldEvent.id}`);
      }}
    >
      <div className="image-wrapper">
        <Image src={props.heldEvent.imageUrl} />
      </div>
      <h3>{props.heldEvent.title}</h3>
      <p>{props.heldEvent.date}</p>
    </HelpEventStyled>
  );
};

const HelpEventStyled = styled.div`
  background: ${(props) => props.theme.basic.white};
  border-radius: 8px;
  padding: 9px 9px 27px 9px;
  cursor: pointer;

  .image-wrapper {
    margin-bottom: 18px;
  }

  h3 {
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: 800;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: 0.03em;

    margin: 0 22px 4px 27px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  p {
    font-family: Lato, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.blackDarken};
    margin: 0 22px 4px 27px;
  }
`;
