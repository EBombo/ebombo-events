// import styled from "styled-components";
// import {centerFlexBox, colorBlack, colorPrimary, colorRed, colorWhite} from "../../constants";
//
// export const ContainerTournamentsDesktop = styled.section`
//
// `;
//
// export const ContainerTournamentsMobile = styled.section`
//      max-width: 500px;
//      margin: auto;
//     .banner-tournament-game{
//       width: 100%;
//       height: 6rem;
//       background: ${colorRed.lighten_1};
//       margin: 1rem 0;
//       ${centerFlexBox()};
//       img{
//         width: auto;
//         height: 65%;
//       }
//     }
//
//     .content-items{
//       padding: 0 1rem;
//
//      .item-banner-asd{
//         width: 100%;
//         height: 5rem;
//         border-radius: .7rem;
//         background: rebeccapurple;
//         color: ${colorWhite.white};
//         font-weight: 700;
//         font-size: 1.5rem;
//         margin: 2rem 0 1rem 0;
//         ${centerFlexBox};
//      }
//
//      .content-filters{
//         margin: 2rem 0;
//         .item-filter{
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           .item{
//             width: 111px;
//             height: 45px;
//             padding: .5rem 0;
//             margin: 0 .3rem;
//             text-align: center;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             border:1px solid ${colorPrimary.primary};
//             border-radius: 6px;
//             background: ${colorBlack.black};
//             font-size: .8rem;
//             font-weight: 600;
//             color:${colorPrimary.primary};
//             cursor: pointer;
//             span{
//                 .path{
//                   fill: red !important;
//                 }
//                img{
//                   width: 15px;
//                   height: auto;
//                   fill: red !important;
//                }
//             }
//           }
//         }
//         .item-state-filter{
//          margin: 1rem 0;
//           .list{
//             display: flex;
//             justify-content: space-around;
//             list-style: none;
//              li{
//                 width: calc(100% / 3.2);
//                 padding: .25rem 0;
//                 border:1px solid ${colorPrimary.primary};
//                 border-radius: 6px;
//                 background: ${colorBlack.black};
//                 font-size: .8rem;
//                 font-weight: 600;
//                 color:${colorPrimary.primary};
//                 cursor: pointer;
//                 text-align: center;
//              }
//           }
//         }
//      }
//
//      .container-items-tournament-cards{
//       .title-cards{
//             text-align: left;
//             color: ${colorPrimary.primary};
//             font-weight: 600;
//             margin: 1rem 0;
//         }
//      }
//
//     .item-card-levels{
//      margin: 1rem 0;
//           .title-card{
//                   font-size: 1rem;
//                   color: ${colorWhite.white};
//                   font-weight: 600;
//                   margin: .7rem 0;
//            }
//           .wrapper-tip {
//                 border-radius: 10px;
//                 padding: 1rem;
//                 border: 1px solid ${colorPrimary.primary};
//                 background: ${colorBlack.black};
//             }
//          }
//     }
// `;
//
// export const CardTournament = styled.section`
//   width: 100%;
//   height: auto;
//   display: grid;
//   grid-template-columns: 7% 50% 43%;
//   border-radius: 8px;
//   margin: 1rem 0;
//   background: #000000;
//   .item-left{
//       border-top-left-radius: 8px;
//       border-bottom-left-radius: 8px;
//       background: ${colorRed.lighten_1};
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       img{
//         width: 80%;
//         height: auto;
//         filter: brightness(0%);
//       }
//   }
//   .item-center{
//    padding: .4rem .5rem;
//    display: flex;
//    flex-direction: column;
//    justify-content: space-between;
//     .item-title{
//        .title{
//           color: ${colorPrimary.primary};
//           font-size: 15px;
//           font-weight: 700;
//           text-align: left;
//        }
//        .items-tags{
//            display: flex;
//            .tag{
//               color: ${colorWhite.white};
//               font-size: 12px;
//               margin: 0 1rem 0 0;
//               font-weight: 600;
//            }
//        }
//     }
//     .item-description{
//      padding: .4rem 0;
//      display: flex;
//      flex-direction: column;
//      justify-content: space-between;
//       .item{
//         display: flex;
//         flex-wrap: wrap;
//         color: ${colorWhite.white};
//         margin: .3rem 0;
//         font-size: 10px;
//         img{
//           width: auto;
//           height: 10px;
//           margin-right:2px;
//         }
//         span{
//           color: ${colorPrimary.primary};
//           display: flex;
//           align-items: center;
//           margin-right: 3px;
//         }
//       }
//     }
//     .item-limit-players{
//     padding: .3rem 0;
//     //**COUNT-USERS-CONTENT*//
//       .item-text{
//         font-size: 9px;
//         text-align: left;
//         color: ${colorWhite.white};
//       }
//     }
//   }
//   .item-right{
//   padding: .4rem .5rem;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//     .item-prize{
//       text-align: right;
//       font-weight: 600;
//       font-size: 14px;
//       color:${colorWhite.white};
//     }
//     .item-detail{
//     text-align: right;
//       .item{
//       margin: .3rem 0;
//         .title{
//             font-weight: 500;
//             font-size: 10px;
//             color:${colorWhite.white};
//           }
//           .description{
//             font-size: 10px;
//             font-weight: 500;
//             color:${colorPrimary.primary};
//          }
//       }
//     }
//     .item-btn-enter{
//       padding: .2rem 0;
//       display: flex;
//       justify-content: flex-end;
//     }
//   }
// `;
