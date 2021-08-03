import { darkTheme } from "../../theme";
import { config } from "../../firebase";
import { BarChartOutlined, HomeOutlined } from "@ant-design/icons";
import React from "reactn";

export const userLinks = [];

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

export const menus = [
  {
    name: "Librería",
    url: "/library",
    src: `${config.storageUrl}/resources/footer/library-icon.svg`,
  },
  {
    name: "Crear",
    url: "/games/new",
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
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
  },
  {
    name: "Lista de juegos",
    url: "/admin/games",
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
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
