import { config } from "../firebase";
import { darkTheme } from "../styles/theme";

export const services = [
  {
    title: "Eventos virtuales",
    text:
      "Organización, moderación, narración y \n" +
      "hasta transmisión en vivo del evento\n" +
      "o torneo que la empresa solicite. \n" +
      "También hacemos premiaciones o integraciones para sus colaboradores\n",
    color: darkTheme.basic.danger,
    logoUrl: `${config.storageUrl}/resources/b2bLanding/laptop.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/events.svg`,
  },
  {
    title: "Nos adaptamos a tu empresa",
    text:
      "Trabajamos con cualquier tipo \n" +
      "de empresa que este dispuesta a \n" +
      "hacer un evento para su gente. \n" +
      "Dínos que necesitas y veremos que podemos hacer",
    color: "#FFD00D",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/house.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/adapt.svg`,
  },
  {
    title: "Moderadores y Organizadores",
    text:
      "Contamos con una amplía base de \n" +
      "datos con moderadores, narradores \n" +
      "y streamers para tu evento",
    color: "#6C63FF",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/referi.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/organization.svg`,
  },
];
