import { darkTheme } from "../../theme";
import { config } from "../../firebase";
import React from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export const skippedWords = ";:!¡?¿ ";

export const tildes = {
  a: "á",
  e: "é",
  i: "í",
  o: "ó",
  u: "ú",
  A: "Á",
  E: "É",
  I: "Í",
  O: "Ó",
  U: "Ú",
};

export const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

export const landingHeaderMenu = [
  {
    title: "Características",
    url: "/features",
  },
  {
    title: "Uso",
    url: "/use",
  },
  {
    title: "Experiencia",
    url: "/experience",
  },
  {
    title: "Precio",
    url: "/price",
  },
  {
    title: "Subscripción",
    url: "/subscriptions",
  },
];

export const triviaQuestionsTypes = [
  {
    key: "quiz",
    value: "Quiz",
  },
  {
    key: "trueFalse",
    value: "Verdadero o Falso",
  },
  {
    key: "shortAnswer",
    value: "Respuesta corta",
  },
];

export const questionTypes = {
  quiz: "Quiz",
  trueFalse: "Verdadero o Falso",
  shortAnswer: "Respuesta corta",
};

export const triviaQuestionsOptions = [
  {
    key: "uniq",
    value: "Única respuesta",
  },
  {
    key: "multiple",
    value: "Respuesta multiple",
  },
];

export const triviaQuestionsTimes = [
  {
    key: 10,
    value: 10,
  },
  {
    key: 20,
    value: 20,
  },
  {
    key: 30,
    value: 30,
  },
  {
    key: 60,
    value: 60,
  },
  {
    key: 120,
    value: 120,
  },
];

export const headers = [
  {
    label: "Correo electrónico",
    key: "email",
  },
  {
    label: "Nombre",
    key: "name",
  },
  {
    label: "Usuario",
    key: "nickname",
  },
  {
    label: "Rol",
    key: "role",
  },
  {
    label: "Estado",
    key: "status",
  },
];

export const adsOptions = [
  { label: "Reuniones grandes", value: "meets" },
  { label: "Webinar", value: "webinar" },
  { label: "Amor", value: "love" },
  { label: "Fuerza", value: "strength" },
  { label: "Destreza", value: "skill" },
];

export const usersOrder = [
  {
    id: 1,
    name: "Correo electrónico",
    code: "email",
  },
  {
    id: 2,
    name: "Nombre",
    code: "name",
  },
  {
    id: 3,
    name: "Usuario",
    code: "nickname",
  },
  {
    id: 4,
    name: "Rol",
    code: "role",
  },
  {
    id: 5,
    name: "Estado",
    code: "status",
  },
];

export const reasons = [
  {
    id: 1,
    description: "Ya no necesito el servicio que ofrecen.",
  },
  {
    id: 2,
    description: "No me gusta los juegos que ofrecen.",
  },
  {
    id: 3,
    description: "Simplemente deseo eliminar la cuenta.",
  },
  {
    id: 4,
    description: "Mi empresa ha cerrado.",
  },
];

export const landingProducts = [
  {
    tab: "Actividades virtuales",
    content: [
      {
        title: "Actividades virtuales",
        description:
          "Ebombo cuenta con más de 20 actividades virtuales para que puedas conectar con tus trabajadores. Contamos con dinámicas de integraciones, entretenimiento, onboarding, capacitaciones para nuevos trabajadores, juegos, aniversarios, premiaciones, ceremonias y mucho más.",
        background: darkTheme.basic.blackDarken,
        image: `${config.storageUrl}/resources/videos-landing/video-2.gif`,
        url: "/products/eventos-virtuales",
      },
    ],
  },
  {
    tab: "Formas de interactuar",
    content: [
      {
        title: "Formas de interactuar",
        options: [
          "Happy Hours",
          "Ice breakers",
          "Onboardings",
          "Celebración de días festivos",
          "Networking",
          "Capacitaciones",
          "Talleres",
          "Premiaciones",
          "Torneos",
          "Ceremonias",
        ],
        background: darkTheme.basic.blackDarken,
        image: `${config.storageUrl}/resources/videos-landing/video-3.gif`,
        url: "/products/eventos-virtuales",
      },
    ],
  },
  {
    tab: "Planes",
    content: [
      {
        title: "Planes",
        description: "Tenemos planes para acomodarnos a tus necesidades:",
        options: ["Eventos únicos", "Planes semanales/mensuales/anuales", "Planes personalizados"],
        background: darkTheme.basic.secondary,
        image: `${config.storageUrl}/resources/videos-landing/video-4.gif`,
        url: "/products/juegos-de-integracion",
      },
    ],
  },
];

export const plans = [
  {
    name: "Gratis",
    price: 0,
    users: 10,
    games: 1,
    color: "#956DFC",
    background: "#956DFC",
    description: "Free",
    specs: [10, <CloseOutlined />, <CloseOutlined />, <CloseOutlined />, <CloseOutlined />],
  },
  {
    name: "Básico",
    price: 9,
    users: 20,
    games: 1,
    color: "#956DFC",
    background: "#956DFC",
    description: "por admin al mes\n" + "($108 anualmente)",
    specs: [20, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />],
  },
  {
    name: "Avanzado",
    price: 29,
    users: 50,
    games: 2,
    color: "#242424",
    background: "#242424",
    description: "por admin al mes\n" + "($348 anualmente)",
    specs: [50, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />],
  },
  {
    name: "Pro",
    price: 39,
    users: 500,
    games: 2,
    color: "#956DFC",
    background: "#956DFC",
    description: "por admin al mes\n" + "($468 anualmente)",
    specs: [500, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />],
  },
  {
    name: "Exclusivo",
    price: "Contáctanos",
    users: "500+",
    games: "Todos",
    color: "#D2A137",
    background: "linear-gradient(90.24deg, #D2A137 -3.57%, #EECA5A 23.9%, #D2A137 99.85%)",
    description: "Contacta al área de ventas",
    specs: ["501+", <CheckOutlined />, <CheckOutlined />, <CheckOutlined />, <CheckOutlined />],
  },
];

export const freePlan = {
  ...plans[0],
  prices: [
    {
      currency: "usd",
      amount: 0,
      interval: "month",
    },
    {
      currency: "usd",
      amount: 0,
      interval: "year",
    },
  ],
  metadata: {
    color: plans[0].color,
    background: plans[0].background,
    users: plans[0].users,
    games: plans[0].games,
    recommended: true,
    live_chat: "yes",
    progress_tracking: "yes",
    players_identity: "yes",
    reporting: "yes",
  },
  currentPrice: {
    amount: plans[0].price,
    currency: "usd",
  },
};

export const products = [
  {
    id: "eventos-virtuales",
    title: "Eventos Virtuales",
    imageUrl: `${config.storageUrl}/resources/product-virtual-events.png`,
    content: [
      "Hemos hecho más de 240 eventos virtuales de todo tipo cómo:",
      <ul>
        <li>Integraciones con juegos</li>
        <li>Speakers Motivacionales</li>
        <li>Olimpiadas</li>
        <li>Eventos temáticos</li>
        <li>Deportes virtuales</li>
        <li>Cuenta cuentos</li>
        <li>Muchos más</li>
      </ul>,
      `Nos adecuamos a las necesidades de cada empresa. Sabemos que cada organización tiene su propia cultura y clima laboral. Dinos que necesitas y lo haremos realidad.`,
      `Tenemos un estudio de grabación con cámaras, luces, pantalla verde, animadores, moderadores, streamers, speakers y todo lo que necesitas para tener el mejor evento que te puedas imaginar.`,
    ],
  },
  {
    id: "eventos-presenciales",
    title: "Eventos Presenciales",
    imageUrl: `${config.storageUrl}/resources/product-face-to-face.png`,
    content: [
      "Hemos hecho eventos presenciales de todo tipo cómo:  ",
      <ul>
        <li>Torneos deportivos</li>
        <li>Eventos de aniversarios</li>
        <li>Olimpiadas</li>
        <li>Eventos temáticos</li>
        <li>Torneos de esports</li>
        <li>Activaciones</li>
        <li>Muchos más</li>
      </ul>,
      "Nos adecuamos a las necesidades de cada empresa. Sabemos que cada organización tiene su propia cultura y clima laboral. Dinos que necesitas y lo haremos realidad.",
      "Contamos con locales en diferentes lugares de la ciudad y animadores que se encarguen de mantener viva la emoción del evento.",
    ],
  },
  {
    id: "juegos-de-integracion",
    title: "Juegos de integración",
    imageUrl: `${config.storageUrl}/resources/product-games.png`,
    content: [
      "Tenemos una amplia gama de juegos virtuales e inclusivos para todo tipo de público. Además, nos encontramos en constante desarrollo de nuevos juegos para poder darte la actividad perfecta para tus colaboradores.",
      //"Mira nuestros juegos aquí",
    ],
  },
];

export const infoGamesData = [
  {
    id: "_",
    menuLabel: "_",
    title: "Juegos de integración",
    imageUrl: `${config.storageUrl}/resources/product-games.png`,
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
 It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more re`,
  },
  // TODO: uncomment when /games/[gameId] is in use
  //  {
  //    id: "bingo",
  //    menuLabel: "Bingo",
  //    title: "Bingo",
  //    imageUrl: "https://via.placeholder.com/274x130",
  //    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
  // It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more re`,
  //  },
];

export const heldEventsData = [
  {
    id: "ripley-fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "festival-ulima",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "Festival online Ulima",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "vu-games-udep",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "VU Games UDEP",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "4-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "4 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "5-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "5 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "6-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "6 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "7-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "7 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "8-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "8 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "9-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "9 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "10-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "10 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  },
  {
    id: "11-Ripley-Fest",
    imageUrl: "https://via.placeholder.com/274x130",
    title: "11 Ripley Fest",
    date: "12 Ene 21",
    text: `What is Lorem Ipsum?
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
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
  /*
  {
    name: "Reportes",
    url: "/reports",
    src: `${config.storageUrl}/resources/footer/reports-icon.svg`,
  },
   */
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

export const getCurrencySymbol = {
  usd: "$",
};

export const getTypePaymentPrice = {
  recurring: "Renovación Automática",
};

export const stripeDateFormat = "DD MMM YYYY";

export const BrandCardIcon = {
  visa: "https://storage.googleapis.com/ebombo-events-dev.appspot.com/resources/visa.svg",
  mastercard: "https://storage.googleapis.com/ebombo-events-dev.appspot.com/resources/visa.svg",
};

export const PlanIntervals = {
  month: "mensual",
  year: "anual",
};

export const TeamBuildingLiterals = {
  header: {
    subheading: "Házlo como nadie",
    heading: "TEAM BUILDING",
    description: "Creado por profesionales que se toman la diversión seria, nuestro equipo virtual de team building events crea ese tipo de enlaces que demorarían años en crearse en una forma de trabajo remoto. ",
  },
  whyItWorks: {
    title: "¿Por qué ebombo funciona?",
    description: `Un desafío del trabajo remoto es la falta de conexión. Nuestra plataforma brinda momentos de colaboración para que los equipos remotos se diviertan juntos y conecten de mejor manera.`,
    description2: `Usamos el poder de activdades para fortalecer la cultura de la empresa, crear relaciones de trabajo más productivas y mejorar el compromiso del equipo, lo que conduce a una mayor retención de empleados y una mayor satisfacción en el lugar de trabajo.`,
  },
  activities: {
    title: "ACTIVIDADES DE TEAM BULDING VIRTUALES ",
    description: `¿Buscas los mejores actividades virtuales para involucrar a los empleados y facilitar la vinculación del equipo? Te tenemos cubierto. ¡Elige entre más de 25 actividades en nuestra biblioteca inigualables o pídenos algo personalizado!`,
  },

  games: [
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Trivia", description: "Reúne a tu equipo para actividades de preguntas dándole el enfoque que tu quieras: películas, deportes o hasta temas onboarding y capacitaciones." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "BINGO", description: "Juega de manera virtual un Bingo interactivo con tus colaborades. Usa nuestra plataforma para que tus trabajadores tengan sus cartillas y lo jueguen desde sus casas o en el trabajo." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Ruleta", description: "Haz sorteos en vivo o con una lista ya hecha de presentes que quisieras regalar a tus trabajadores por una fecha importante." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Ruleta rompehielo", description: "Usa la ruleta rompehielo para romper el ambiente. Saldrán preguntas que escojas y los colaboradores tendrán que responderlas de manera divertida." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Ahorcado", description: "Escoje palabras o frases que desees. Pueden ser relacionadas a la cultura de la empresa o dale el enfoque que quieras." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "2 verdades y 1 mentira", description: "Menciona tres enunciados sobre el tema que quieras y el jugador deberá adivinar cuál es la mentira. Perfecto para capacitaciones." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Zoom a la imagen", description: "Danos una imagen completa de lo que quieras y mostraremos una parte a los colaboradores. Quien adivine de qué trata la imagen ganará." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Adivina la película", description: "Te daremos datos de una película y el jugador que pueda adivinar cuál es primero, ganará." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Letras revueltas", description: "Te mostraremos ordenigmas de las frases o palabras que quieras y los colaboradores deberán competir para ver quién puede ordenar las letras primero." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Charadas", description: "Haz que tus colaboradores se paren de su asiento, muevan sus cuerpos y actúen lo que se les muestre en pantalla. Los otros trabajadores deberán adivinar de qué se trata." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Adivina la canción", description: "Reproduciremos un extracto de una canción y el colaborador que adivine el nombre primero ganará un punto y si canta, uno adicional." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Lenguaje Emoji", description: "Mostraremos tres emojis y los colaboradores deberán interpretarlos y encontrar la frase o palabra oculta." },
    { img: "https://via.placeholder.com/300x300", placeholderUrl: "", title: "Película doméstica", description: "Reproduciremos una pequeña escena de una película y acto seguido dos colaboradores deberán imitar las actuaciones." },
  ],

  virtualEvents: {
    title: "Eventos virtuales y juegos que fortalecerán tu equipo",
    items: [
      {img: "https://via.placeholder.com/500x300", title: "Miles de opciones de dinámicas de teambuilding", description: "Nuestras actividades de equipos remoto están diseñadas para mejorar las conexiones, funcionan tan bien con grupos que se conocen como con equipos que se reúnen por primera vez."},
      {img: "https://via.placeholder.com/500x300", title: "Eventos de team building personalizado", description: "Nuestras actividades funcionan tan bien con grupos que se conocen como con equipos que se reúnen por primera vez. Nuestra variedad de contenido le permite planificar un evento para colegas de toda la vida o con colegas nuevos."},
      {img: "https://via.placeholder.com/500x300", title: "UNA PLATAFORMA DE TEAM BUILDING DIFERENTE", description: "Utilice la actividad adecuada para cada ocasión. No importa el tamaño de la empresa, todos los colaboradores pueden participar de una manera divertida. Desde una happy hour, hasta una conferencia es fácil planificar. Estamos aquí para acercarlos virtualmente."},
    ],
  },
  virtualEventYouLove: {
    title: "El evento virtual que amarás",
  }
};


