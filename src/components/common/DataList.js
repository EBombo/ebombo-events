import { darkTheme } from "../../theme";
import { config } from "../../firebase";
import React from "reactn";

export const userLinks = [];

export const services = [
  {
    title: "Eventos virtuales",
    text: "Hacemos más de 20 tipos de eventos virtuales. Como integraciones, speakers motivacionales, olimpiadas, eventos temáticos, deportes virtuales y más.",
    color: darkTheme.basic.danger,
    logoUrl: `${config.storageUrl}/resources/b2bLanding/laptop.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/events.svg`,
  },
  {
    title: "Nos adaptamos a tu empresa",
    text: "Nos adecuamos a las necesidades de cada empresa. Sabemos que cada organización tiene su propia cultura y clima laboral. Dinos que necesitas y lo haremos realidad.",
    color: "#FFD00D",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/house.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/adapt.svg`,
  },
  {
    title: "Nos encargamos de todo el evento",
    text: "Tenemos un estudio de grabación con cámaras, luces, pantalla verde, animadores, moderadores, streamers, speakers y todo lo que necesitas para tener el mejor evento que te puedas imaginar.",
    color: "#6C63FF",
    logoUrl: `${config.storageUrl}/resources/b2bLanding/referi.svg`,
    imageUrl: `${config.storageUrl}/resources/b2bLanding/organization.svg`,
  },
];

export const menus = [
  {
    name: "Librería",
    url: "/library",
    src: `${config.storageUrl}/resources/footer/library-icon.svg`,
  },
  {
    name: "Crear",
    url: "/library/games/new",
    onClick: (setIsVisibleModalGame) => setIsVisibleModalGame(true),
    src: `${config.storageUrl}/resources/footer/create-icon.svg`,
  },
  {
    name: "Reportes",
    url: "/reports",
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
  },
  {
    name: "Lista de usuarios",
    url: "/admin/users",
    isAdmin: true,
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
  },
  {
    name: "Lista de juegos",
    url: "/admin/games",
    isAdmin: true,
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
  },
  {
    name: "Lista de audios",
    url: "/admin/audios",
    isAdmin: true,
    src: `${config.storageUrl}/resources/footer/audio-icon.svg`,
  },
];

export const emailTemplates = [
  {
    id: "newAccount",
    name: "Nuevo usuario",
    to: "user",
  },
  {
    id: "verifyCode",
    name: "Codigo de Verificación para nuevo usuario",
    to: "user",
  },
];

export const templatesLegend = [
  { name: "userName", value: "Nombre del usuario" },
  { name: "userEmail", value: "Email del usuario" },
  { name: "userNickname", value: "Nickname del usuario" },
  { name: "userImage", value: "Imagen del usuario" },
  { name: "secondUserName", value: "Nombre del segundo usuario" },
  { name: "secondUserEmail", value: "Email del segundo usuario" },
  { name: "secondUserNickname", value: "Nickname del segundo usuario" },
  { name: "secondUserImage", value: "Imagen del segundo usuario" },
  { name: "amount", value: "Monto" },
  { name: "additionalAmount", value: "Monto Adicional" },
  { name: "documentType", value: "Tipo de documento" },
  { name: "documentNumber", value: "Numero de documento" },
  { name: "accountNumber", value: "Numero de cuenta" },
  { name: "expiredDate", value: "Dia de expiración" },
  { name: "message", value: "Mensaje del formulario de contacto" },
  {
    name: "companyEmail",
    value: "Email de la compañia del formulariode contacto",
  },
  {
    name: "companyPhone",
    value: "Telefono de la compañia del formulario de contacto",
  },
  { name: "link", value: "Link" },
  { name: "verifyAccountLink", value: "Link de verificación" },
  { name: "code", value: "Verification code" },
];

export const days = [
  {
    key: "01",
    value: "01",
  },
  {
    key: "02",
    value: "02",
  },
  {
    key: "03",
    value: "03",
  },
  {
    key: "04",
    value: "04",
  },
  {
    key: "05",
    value: "05",
  },
  {
    key: "06",
    value: "06",
  },
  {
    key: "07",
    value: "07",
  },
  {
    key: "08",
    value: "08",
  },
  {
    key: "09",
    value: "09",
  },
  {
    key: "10",
    value: "10",
  },
  {
    key: "11",
    value: "11",
  },
  {
    key: "12",
    value: "12",
  },
  {
    key: "13",
    value: "13",
  },
  {
    key: "14",
    value: "14",
  },
  {
    key: "15",
    value: "15",
  },
  {
    key: "16",
    value: "16",
  },
  {
    key: "17",
    value: "17",
  },
  {
    key: "18",
    value: "18",
  },
  {
    key: "19",
    value: "19",
  },
  {
    key: "20",
    value: "20",
  },
  {
    key: "21",
    value: "21",
  },
  {
    key: "22",
    value: "22",
  },
  {
    key: "23",
    value: "23",
  },
  {
    key: "24",
    value: "24",
  },
  {
    key: "25",
    value: "25",
  },
  {
    key: "26",
    value: "26",
  },
  {
    key: "27",
    value: "27",
  },
  {
    key: "28",
    value: "28",
  },
  {
    key: "29",
    value: "29",
  },
  {
    key: "30",
    value: "30",
  },
  {
    key: "31",
    value: "31",
  },
];

export const months = [
  {
    key: "01",
    value: "Enero",
  },
  {
    key: "02",
    value: "Febrero",
  },
  {
    key: "03",
    value: "Marzo",
  },
  {
    key: "04",
    value: "Abril",
  },
  {
    key: "05",
    value: "Mayo",
  },
  {
    key: "06",
    value: "Junio",
  },
  {
    key: "07",
    value: "Julio",
  },
  {
    key: "08",
    value: "Agosto",
  },
  {
    key: "09",
    value: "Septiembre",
  },
  {
    key: "10",
    value: "Octubre",
  },
  {
    key: "11",
    value: "Noviembre",
  },
  {
    key: "12",
    value: "Diciembre",
  },
];

export const years = [
  {
    key: "2003",
    value: "2003",
  },
  {
    key: "2002",
    value: "2002",
  },
  {
    key: "2001",
    value: "2001",
  },
  {
    key: "2000",
    value: "2000",
  },
  {
    key: "1999",
    value: "1999",
  },
  {
    key: "1998",
    value: "1998",
  },
  {
    key: "1997",
    value: "1997",
  },
  {
    key: "1996",
    value: "1996",
  },
  {
    key: "1995",
    value: "1995",
  },
  {
    key: "1994",
    value: "1994",
  },
  {
    key: "1993",
    value: "1993",
  },
  {
    key: "1992",
    value: "1992",
  },
  {
    key: "1991",
    value: "1991",
  },
  {
    key: "1990",
    value: "1990",
  },
  {
    key: "1989",
    value: "1989",
  },
  {
    key: "1988",
    value: "1988",
  },
  {
    key: "1987",
    value: "1987",
  },
  {
    key: "1986",
    value: "1986",
  },
  {
    key: "1985",
    value: "1985",
  },
  {
    key: "1984",
    value: "1984",
  },
  {
    key: "1983",
    value: "1983",
  },
  {
    key: "1982",
    value: "1982",
  },
  {
    key: "1981",
    value: "1981",
  },
  {
    key: "1980",
    value: "1980",
  },
  {
    key: "1979",
    value: "1979",
  },
  {
    key: "1978",
    value: "1978",
  },
  {
    key: "1977",
    value: "1977",
  },
  {
    key: "1976",
    value: "1976",
  },
  {
    key: "1975",
    value: "1975",
  },
  {
    key: "1974",
    value: "1974",
  },
  {
    key: "1973",
    value: "1973",
  },
  {
    key: "1972",
    value: "1972",
  },
];

export const bingoCard = [
  [2, 4, 8, 13, 15],
  [16, 22, 25, 27, 30],
  [31, 33, 36, 38, 45],
  [46, 48, 56, 59, 60],
  [61, 63, 68, 72, 75],
];
