import React from "react";
import styled from "styled-components";
import {config} from "../../firebase";
import {Tip, TipDescription, TipTittle} from "./TipStyle";

export const TipMoreInformation = () => (
    <Container>
        <TipTittle>¿Quieres más información?</TipTittle>
        <TipDescription>
            En caso quieras mayor información puedes ver el siguiente video haciendo
            click en el botón de abajo o escribirnos a Whatsapp.
        </TipDescription>
        <div className="content-buttons">
            <div
        className="button-video"
        onClick={() =>
          window.open("https://www.youtube.com/embed/XBfnzN1OGhY", "_blank")
        }
      >
        <div className="text">Ver video</div>
      </div>
      <div
        className="item-wsp-contact"
        onClick={() => window.open(config.wspUrl, "_blank")}
      >
          <div className="text">Haz click aquí para hablarnos por Whatsapp</div>
          <div className="icon">
              <img
                  src={`${config.storageUrl}/resources/wsp-icon.svg`}
                  alt="wsp eBombo"
              />
          </div>
      </div>
    </div>
  </Container>
);

const Container = styled(Tip)`    
    .content-buttons {
        position: relative;
        margin-top: 10px;
        display: flex;
        cursor: pointer;
        .button-video {
            width: 40%;
            height: auto;
            padding: 0.3rem;
            border: 2px solid ${(props) => props.theme.basic.primary};
            color: ${(props) => props.theme.basic.primary};
            font-size: 12px;
            border-radius: 8px;
            display: flex;
            .text{
                  padding: 0 10px;
                  display: flex;
                  align-items: center;
                }
        }
        
        .item-wsp-contact {
            width: 60%;
            height: auto;
            margin-left: 3px;
            // padding: 0.3rem;
            border: 2px solid ${(props) => props.theme.basic.primary};
            color: ${(props) => props.theme.basic.primary};
            font-size: 11px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
                .text{
                  padding: 0 10px;
                  display: flex;
                  align-items: center;
                }
                .icon{
                  padding: 0 10px;
                  display: flex;
                  align-items: center;
                  img{
                    height: auto;
                    width: 30px;
                  }
                }
         }
`;
