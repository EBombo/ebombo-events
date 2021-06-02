import { config } from "../firebase";
import { darkTheme } from "../styles/theme";

export const services = [
  {
    title: "Eventos virtuales",
    text:
      "Hacemos más de 20 tipos de eventos virtuales. Como Integraciones, Speakers Motivacionales, Olimpiadas, Eventos Temáticos, Deportes Virtuales y más.",
    color: darkTheme.basic.danger,
    logoUrl: `${config.storageUrl}/resources/b2bLanding/laptop.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/events.svg`,
  },
  {
    title: "Nos adaptamos a tu empresa",
    text:
      "Nos adecuamos a las necesidades de cada empresa. Sabemos que cada organización, tiene su propia cultura y clima laboral. Dinos que necesitas y lo haremos realidad",
    color: "#FFD00D",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/house.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/adapt.svg`,
  },
  {
    title: "Nos encargamos de todo el evento",
    text:
      "Tenemos un estudio de grabación con cámaras, luces, pantalla verde, animadores, moderadores, streamers, speakers y todo lo que necesitas para tener el mejor evento que te puedas imaginar.",
    color: "#6C63FF",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/referi.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/organization.svg`,
  },
];
