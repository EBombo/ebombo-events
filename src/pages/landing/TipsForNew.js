import React from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";
import { ButtonBombo } from "../../components/common";
import { mediaQuery } from "../../styles/constants";

export const TipsForNew = () => {
  return (
    <ContainerTipsForNew>
      <div className="content-tips">
        <div className="title-tips">Tips para nuevos</div>
        <div className="container-items-cards">
          <div className="content-items">
            <div className="item-card">
              <div className="content-card-one">
                <div className="title-card">
                  <span className="num">1</span>
                  Niveles
                </div>
                <div className="description-card">
                  Los jugadores obtienen su level dependiendo de las victorias y
                  derrotas que obtengan dentro de nuestra plataforma. Mientas
                  más victorias obtienen mejor es su Level.
                </div>
                <div className="buttons-level">
                  <div className="item-lv">Level 0</div>
                  <div className="item-lv">Level 1</div>
                  <div className="item-lv">Level 2</div>
                  <div className="item-lv">Level 3</div>
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-two">
                <div className="title-card">
                  <span className="num">2</span>
                  ¿Cómo nos aseguramos que un usuario te pague?
                </div>
                <div className="description-card">
                  Nosotros nos encargamos de que recibas tu dinero si has ganado
                  la partida. ebombo recibe el dinero de los dos usuarios antes
                  de empezar el encuentro, de esa manera nos aseguramos el pago
                  se vaya a realizar. Una vez finalizada la partida le daremos
                  el dinero al usuario ganador. En caso de empates o cancelación
                  de la partida ebombo devolverá el dinero correspondiente.
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-three">
                <div className="title-card">
                  <span className="num">3</span>
                  Pagos y depósitos
                </div>
                <div className="sub-title-card">Pagos</div>
                <div className="description-card">
                  El pago mínimo por la plataforma es de s/. 20, mientras que
                  por Yape, Plin, transferencia bancaria y Pay Pal es de s/. 10.
                </div>
                <Spacing height="1rem" />
                <div className="sub-title-card">Depósitos</div>
                <div className="description-card">
                  El pago mínimo por la plataforma es de s/. 20, mientras que
                  por Yape, Plin, transferencia bancaria y Pay Pal es de s/. 10.
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-for">
                <div className="title-card">
                  <span className="num">4</span>
                  Encuentra un rival
                </div>
                <div className="sub-title-card">Crea una sala</div>
                <div className="description-card">
                  Selecciona el juego, la consola y las reglas del encuentro y
                  crea tu sala. Los oponentes verán tu sala en la página de
                  inicio y podrán decidir si jugar o no.
                </div>
                <Spacing height=".5rem" />
                <div className="sub-title-card">Encuentra una sala</div>
                <div className="description-card">
                  Encuentra una sala ya creada por otro usuario y entra para
                  jugar.
                </div>
                <Spacing height=".5rem" />
                <div className="sub-title-card">Usa el chat</div>
                <div className="description-card">
                  Coordina por el chat de cada juego e invita a un usuario a
                  jugar haciéndole click a su nombre de usuario.
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-five">
                <div className="title-card">
                  <span className="num">5</span>
                  Evidencia
                </div>
                <div className="description-card">
                  Recomendamos ver los videos de como pueden mostrarnos
                  evidencia antes de jugar en caso ocurra un incidente (en todos
                  los juegos queda evidencia de quien gano, asi que no se
                  preocupe) De igual solo el 2%-3% de los encuentros tienen
                  problemas.
                </div>
                <Spacing height="1rem" />
                <div className="content-icon-card">
                  <div className="item-icon">
                    <img
                      src={`${config.storageUrl}/resources/icon-evidence.svg`}
                      alt="icon eBombo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-fix">
                <div className="title-card">
                  <span className="num">6</span>
                  Abandonos
                </div>
                <div className="description-card">
                  Si un jugador abandona la partida, el encuentro seguirá y se
                  tomarán como válidos los resultados ingresados por el usuario
                  que permaneció en el encuentro cuando el tiempo haya
                  finalizado.
                </div>
                <Spacing height="1rem" />
                <div className="content-icon-card">
                  <div className="item-icon">
                    <img
                      src={`${config.storageUrl}/resources/icon-abandonment.svg`}
                      alt="icon eBombo"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="item-card">
              <div className="content-card-seven">
                <div className="title-card">
                  <span className="num">7</span>
                  ¿Quieres más información?
                </div>
                <div className="description-card">
                  En caso quieras mayor información puedes ver el siguiente
                  video haciendo click en el botón de abajo o escribirnos a
                  Whatsapp.
                </div>
                <Spacing height="1rem" />
                <div className="content-buttons">
                  <ButtonBombo
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/embed/XBfnzN1OGhY",
                        "_blank"
                      )
                    }
                  >
                    Ver video
                  </ButtonBombo>
                  <div
                    className="content-button-wsp"
                    onClick={() => window.open(config.wspUrl, "_blank")}
                  >
                    <div className="description">
                      Haz click aquí para hablarnos por Whatsapp
                    </div>
                    <div className="item-icon">
                      <img
                        src={`${config.storageUrl}/resources/wsp-icon.svg`}
                        alt="wsp eBombo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContainerTipsForNew>
  );
};

const Spacing = styled.section`
  width: 100%;
  height: ${(props) => props.height};
`;

const ContainerTipsForNew = styled.section`
  width: 100%;
  padding: 1rem;
  ${mediaQuery.afterTablet} {
    padding: 3rem 2.5rem;
  }
  background: ${(props) => props.theme.basic.blackDarken};
  .content-tips {
    width: 100%;
    height: auto;
    .title-tips {
      color: ${(props) => props.theme.basic.white};
      font-weight: 500;
      font-size: 21px;
      line-height: 26px;
    }
    .container-items-cards {
      width: 100%;
      overflow: hidden;
    }

    .content-items {
      display: -webkit-inline-box;
      width: 100%;
      max-width: 100%;
      overflow-x: scroll;
      padding: 2rem 0;

      .item-card {
        width: 290px;
        height: 240px;
        background: ${(props) => props.theme.basic.default};
        border-radius: 11px;
        margin-right: 0.8rem;
        padding: 1rem;
      }

      .title-card {
        color: ${(props) => props.theme.basic.white};
        font-weight: 800;
        font-size: 16px;
        margin-bottom: 1rem;
        .num {
          color: ${(props) => props.theme.basic.primary};
          margin-right: 0.5rem;
        }
      }

      .sub-title-card {
        font-weight: 800;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
        margin-bottom: 0.3rem;
      }

      .description-card {
        color: ${(props) => props.theme.basic.white};
        font-size: 10px;
        line-height: 12px;
      }

      .content-icon-card {
        margin: 1rem 0;
        display: flex;
        justify-content: center;
        .item-icon {
          width: 65px;
          height: auto;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .content-card-one {
        .buttons-level {
          display: grid;
          grid-template-columns: repeat(2, 40%);
          justify-content: center;
          grid-gap: 20px;
          margin-top: 10px;
          .item-lv {
            width: 71px;
            height: 33px;
            background: ${(props) => props.theme.basic.blackDarken};
            border: 1px solid ${(props) => props.theme.colorLevels.level0};
            color: ${(props) => props.theme.basic.white};
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 11px;
            &:nth-child(2) {
              border: 1px solid ${(props) => props.theme.colorLevels.level1};
              color: ${(props) => props.theme.colorLevels.level1};
            }
            &:nth-child(3) {
              border: 1px solid ${(props) => props.theme.colorLevels.level2};
              color: ${(props) => props.theme.colorLevels.level2};
            }
            &:nth-child(4) {
              border: 1px solid ${(props) => props.theme.colorLevels.level3};
              color: ${(props) => props.theme.colorLevels.level3};
            }
          }
        }
      }

      .content-card-seven {
        .content-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          .content-button-wsp {
            margin: 1rem 0;
            width: 190px;
            height: 36px;
            border: 1px solid ${(props) => props.theme.basic.primary};
            border-radius: 6px;
            padding: 0.2rem 0.3rem;
            background: ${(props) => props.theme.basic.blackDarken};
            cursor: pointer;
            display: grid;
            grid-template-columns: 70% 30%;
            .description {
              color: ${(props) => props.theme.basic.primary};
              font-size: 11px;
              line-height: 14px;
            }
            .item-icon {
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding-right: 0.3rem;
              img {
                width: auto;
                height: 95%;
              }
            }
          }
        }
      }
    }
  }
`;
