import { darkTheme } from "../../theme";
import { config, firestoreBingo, firestoreHanged, firestoreRoulette, firestoreTrivia } from "../../firebase";
import React from "react";
import { CloseOutlined } from "@ant-design/icons";

export const gamesFirestore = (name) => {
  switch (name) {
    case "bingo":
      return firestoreBingo;
    case "trivia":
      return firestoreTrivia;
    case "hanged":
      return firestoreHanged;
    case "roulette":
      return firestoreRoulette;
    case "rouletteQuestions":
      return firestoreRoulette;
    default:
      return firestoreBingo;
  }
};

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

export const triviaQuestionsTypes = {
  quiz: {
    key: "quiz",
    value: "quiz",
  },
  trueFalse: {
    key: "trueFalse",
    value: "true-false",
  },
  shortAnswer: {
    key: "shortAnswer",
    value: "short-answer",
  },
  survey: {
    key: "survey",
    value: "survey",
  },
  brainstorm: {
    key: "brainstorm",
    value: "brainstorm",
  },
  slide: {
    key: "slide",
    value: "slide",
  },
};

export const triviaShortAnswerType = triviaQuestionsTypes.shortAnswer.key;

export const questionTypes = {
  quiz: "Quiz",
  trueFalse: "Verdadero o Falso",
  shortAnswer: "Respuesta corta",
};

//TODO: Consider refactor type names on firestore so it is easy to get its locales.
export const questionTypesToLiterals = {
  quiz: "quiz",
  trueFalse: "true-false",
  shortAnswer: "short-answer",
};

export const triviaQuestionsOptions = [
  {
    key: "uniq",
    value: "only-answer",
  },
  {
    key: "multiple",
    value: "multiple-answer",
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
    tab: "virtual-activities",
    content: [
      {
        title: "virtual-activities",
        description: "virtual-activities",
        background: darkTheme.basic.blackDarken,
        image: `${config.storageUrl}/resources/videos-landing/video-2.gif`,
        url: "/products/eventos-virtuales",
      },
    ],
  },
  {
    tab: "ways-to-interact",
    content: [
      {
        title: "ways-to-interact",
        options: [
          "Happy Hours",
          "Ice breakers",
          "Onboardings",
          "holiday-party",
          "Networking",
          "Trainings",
          "workshops",
          "awards",
          "tournaments",
          "ceremonies",
        ],
        background: darkTheme.basic.blackDarken,
        image: `${config.storageUrl}/resources/videos-landing/video-3.gif`,
        url: "/products/eventos-virtuales",
      },
    ],
  },
  {
    tab: "plans",
    content: [
      {
        title: "plans",
        description: "plans",
        options: ["unique-events", "seasonal-plans", "custom-plans"],
        background: darkTheme.basic.secondary,
        image: `${config.storageUrl}/resources/videos-landing/video-4.gif`,
        url: "/products/juegos-de-integracion",
      },
    ],
  },
];

export const plans = [
  {
    name: "Free",
    price: 0,
    users: 10,
    games: "all",
    color: "#956DFC",
    background: "#956DFC",
    description: "Free",
    specs: [10, <CloseOutlined />, <CloseOutlined />, <CloseOutlined />, <CloseOutlined />],
  },
  {
    name: "Básico",
  },
  {
    name: "Avanzado",
  },
  {
    name: "Pro",
  },
  {
    name: "Exclusivo",
  },
];

// This list sets the order (from left to right) when displaying plans.
export const plansInOrder = [
  plans[0].name, // Free plan.
  "Basic",
  "Advanced",
  "Pro",
  "Platinum",
  "Exclusive",
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
    progress_tracking: "no",
    players_identity: "no",
    reporting: "no",
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
  {
    name: "Lista de contactos",
    url: "/admin/contacts",
    isAdmin: true,
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

export const MostPopularGames = [
  {
    img: `${config.storageUrl}/resources/trivia-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-game_12x12.png`,
    title: "landing.games-descriptions.trivia.title",
    description: "landing.games-descriptions.trivia.description",
  },
  {
    img: `${config.storageUrl}/resources/bingo-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/bingo-game_12x12.png`,
    title: "landing.games-descriptions.bingo.title",
    description: "landing.games-descriptions.bingo.description",
  },
  {
    img: `${config.storageUrl}/resources/roulette-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/ruleta-game_12x12.png`,
    title: "landing.games-descriptions.roulette.title",
    description: "landing.games-descriptions.roulette.description",
  },
  {
    img: `${config.storageUrl}/resources/pelicula-domestica-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/pelicula-domestica-game_12x12.png`,
    title: "landing.games-descriptions.domestic-movie.title",
    description: "landing.games-descriptions.domestic-movie.description",
  },
];

export const BetweenCompaniesGames = [
  {
    img: `${config.storageUrl}/resources/trivia-crack-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-crack-game_12x12.webp`,
    title: "landing.games-descriptions.trivia-crack.title",
    description: "landing.games-descriptions.trivia-crack.description",
  },
  {
    img: `${config.storageUrl}/resources/song-guess-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/song-guess-game_12x12.png`,
    title: "landing.games-descriptions.song-guess.title",
    description: "landing.games-descriptions.song-guess.description",
  },
  {
    img: `${config.storageUrl}/resources/letras-revueltas-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/letras-revueltas-game_12x12.png`,
    title: "landing.games-descriptions.scrambled-letters.title",
    description: "landing.games-descriptions.scrambled-letters.description",
  },
  {
    img: `${config.storageUrl}/resources/zoom-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/zoom-game_12x12.png`,
    title: "landing.games-descriptions.zoom.title",
    description: "landing.games-descriptions.zoom.description",
  },
];

export const TeamBuildingGames = [
  {
    img: `${config.storageUrl}/resources/roulette-icebreaker-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/ruleta-rompehielo-game_12x12.png`,
    title: "landing.games-descriptions.roulette-icebreaker.title",
    description: "landing.games-descriptions.roulette-icebreaker.description",
  },
  {
    img: `${config.storageUrl}/resources/trivia-onboarding-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-onboarding-game_12x12.webp`,
    title: "landing.games-descriptions.trivia-onboarding.title",
    description: "landing.games-descriptions.trivia-onboarding.description",
  },
  {
    img: `${config.storageUrl}/resources/charadas-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/charadas-game_12x12.png`,
    title: "landing.games-descriptions.charadas.title",
    description: "landing.games-descriptions.charadas.description",
  },
  {
    img: `${config.storageUrl}/resources/emoji-language-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/emoji-language-game_12x12.webp`,
    title: "landing.games-descriptions.emoji-language.title",
    description: "landing.games-descriptions.emoji-language.description",
  },
];

export const LandingGames = [
  {
    img: `${config.storageUrl}/resources/trivia-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-game_12x12.webp`,
    title: "landing.games-descriptions.trivia.title",
    description: "landing.games-descriptions.trivia.description",
  },
  {
    img: `${config.storageUrl}/resources/bingo-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/bingo-game_12x12.webp`,
    title: "landing.games-descriptions.bingo.title",
    description: "landing.games-descriptions.bingo.description",
  },
  {
    img: `${config.storageUrl}/resources/roulette-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/ruleta-game_12x12.webp`,
    title: "landing.games-descriptions.roulette.title",
    description: "landing.games-descriptions.roulette.description",
  },
  {
    img: `${config.storageUrl}/resources/roulette-icebreaker-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/ruleta-rompehielo-game_12x12.webp`,
    title: "landing.games-descriptions.roulette-icebreaker.title",
    description: "landing.games-descriptions.roulette-icebreaker.description",
  },
  {
    img: `${config.storageUrl}/resources/ahorcado-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/ahorcado-game_12x12.webp`,
    title: "landing.games-descriptions.hangman.title",
    description: "landing.games-descriptions.hangman.description",
  },
  {
    img: `${config.storageUrl}/resources/2-true-1-false-game.png`,
    placeholderUrl: `${config.storageUrl}/resources/2-true-1-false-game_12x12.webp`,
    title: "landing.games-descriptions.2-true-1-false.title",
    description: "landing.games-descriptions.2-true-1-false.description",
  },
  {
    img: `${config.storageUrl}/resources/zoom-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/zoom-game_12x12.webp`,
    title: "landing.games-descriptions.zoom.title",
    description: "landing.games-descriptions.zoom.description",
  },
  {
    img: `${config.storageUrl}/resources/movie-guess-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/movie-guess-game_12x12.webp`,
    title: "landing.games-descriptions.movie-guess.title",
    description: "landing.games-descriptions.movie-guess.description",
  },
  {
    img: `${config.storageUrl}/resources/letras-revueltas-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/letras-revueltas-game_12x12.webp`,
    title: "landing.games-descriptions.scrambled-letters.title",
    description: "landing.games-descriptions.scrambled-letters.description",
  },
  {
    img: `${config.storageUrl}/resources/charadas-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/charadas-game_12x12.webp`,
    title: "landing.games-descriptions.charadas.title",
    description: "landing.games-descriptions.charadas.description",
  },
  {
    img: `${config.storageUrl}/resources/song-guess-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/song-guess-game_12x12.webp`,
    title: "landing.games-descriptions.song-guess.title",
    description: "landing.games-descriptions.song-guess.description",
  },
  {
    img: `${config.storageUrl}/resources/emoji-language-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/emoji-language-game_12x12.webp`,
    title: "landing.games-descriptions.emoji-language.title",
    description: "landing.games-descriptions.emoji-language.description",
  },
  {
    img: `${config.storageUrl}/resources/pelicula-domestica-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/pelicula-domestica-game_12x12.webp`,
    title: "landing.games-descriptions.domestic-movie.title",
    description: "landing.games-descriptions.domestic-movie.description",
  },

  {
    img: `${config.storageUrl}/resources/pinta-acierta-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/pinta-acierta-game_12x12.webp`,
    title: "landing.games-descriptions.song-guess.title",
    description: "landing.games-descriptions.song-guess.description",
  },
  {
    img: `${config.storageUrl}/resources/trivia-crack-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-crack-game_12x12.webp`,
    title: "landing.games-descriptions.trivia-crack.title",
    description: "landing.games-descriptions.trivia-crack.description",
  },
  {
    img: `${config.storageUrl}/resources/trivia-onboarding-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/trivia-onboarding-game_12x12.webp`,
    title: "landing.games-descriptions.trivia-onboarding.title",
    description: "landing.games-descriptions.trivia-onboarding.description",
  },
  {
    img: `${config.storageUrl}/resources/sing-and-win-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/sing-and-win-game_12x12.webp`,
    title: "landing.games-descriptions.sing-and-win.title",
    description: "landing.games-descriptions.sing-and-win.description",
  },
  {
    img: `${config.storageUrl}/resources/whom-brings-to-me-game.svg`,
    placeholderUrl: `${config.storageUrl}/resources/whom-brings-to-me-game_12x12.webp`,
    title: "landing.games-descriptions.whom-brings-to-me.title",
    description: "landing.games-descriptions.whom-brings-to-me.description",
  },
];

export const TeamBuildingLiterals = {
  header: {
    subheading: "landing.team-building.intro-subheading",
    heading: "landing.team-building.intro-team-building-title",
    description: "landing.team-building.intro-team-building-description",
  },
  whyItWorks: {
    title: "landing.team-building.why-ebombo-works.title",
    description: "landing.team-building.why-ebombo-works.description",
    description2: "landing.team-building.why-ebombo-works.description-paragraph-2",
  },
  activities: {
    title: "landing.team-building.activities.title",
    description: "landing.team-building.activities.description",
  },
  virtualEvents: {
    title: "landing.team-building.virtual-events.title",
    items: [
      {
        img: `${config.storageUrl}/resources/TEAM_BUILDING_1.jpg`,
        placeholder: `${config.storageUrl}/resources/TEAM_BUILDING_1_12x12.webp`,
        title: "landing.team-building.virtual-events.items-1.title",
        description: "landing.team-building.virtual-events.items-1.description",
      },
      {
        img: `${config.storageUrl}/resources/TEAM_BUILDING_2.jpg`,
        placeholder: `${config.storageUrl}/resources/TEAM_BUILDING_2_12x12.webp`,
        title: "landing.team-building.virtual-events.items-2.title",
        description: "landing.team-building.virtual-events.items-2.description",
      },
      {
        img: `${config.storageUrl}/resources/TEAM_BUILDING_3.jpg`,
        placeholder: `${config.storageUrl}/resources/TEAM_BUILDING_3_12x12.webp`,
        title: "landing.team-building.virtual-events.items-3.title",
        description: "landing.team-building.virtual-events.items-3.description",
      },
    ],
  },
  virtualEventYouLove: {
    title: "landing.team-building.virtual-event-you-love.title",
  },
};

export const CorporateEventsLiterals = {
  header: {
    subheading: "landing.corporate-events.intro-subheading",
    heading: "landing.corporate-events.intro-title",
    description: "landing.corporate-events.intro-description",
  },
  whyItWorks: {
    title: "landing.corporate-events.why-ebombo-works.title",
    description: "landing.corporate-events.why-ebombo-works.description",
    description2: "landing.corporate-events.why-ebombo-works.description-paragraph-2",
  },
  activities: {
    title: "landing.corporate-events.activities.title",
    description: "landing.corporate-events.activities.description",
  },
  virtualEvents: {
    title: "landing.corporate-events.virtual-events.title",
    items: [
      {
        img: `${config.storageUrl}/resources/CORPORATE_EVENT_1.svg`,
        placeholder: `${config.storageUrl}/resources/CORPORATE_EVENT_1_12x12.webp`,
        title: "landing.corporate-events.virtual-events.items-1.title",
        description: "landing.corporate-events.virtual-events.items-1.description",
      },
      {
        img: `${config.storageUrl}/resources/CORPORATE_EVENT_2.svg`,
        placeholder: `${config.storageUrl}/resources/CORPORATE_EVENT_2_12x12.webp`,
        title: "landing.corporate-events.virtual-events.items-2.title",
        description: "landing.corporate-events.virtual-events.items-2.description",
      },
      {
        img: `${config.storageUrl}/resources/CORPORATE_EVENT_3.svg`,
        placeholder: `${config.storageUrl}/resources/CORPORATE_EVENT_3_12x12.webp`,
        title: "landing.corporate-events.virtual-events.items-3.title",
        description: "landing.corporate-events.virtual-events.items-3.description",
      },
    ],
  },
  virtualEventYouLove: {
    title: "landing.corporate-events.virtual-event-you-love.title",
  },
};

export const OnBoardingLiterals = {
  virtualEvents: {
    items: [
      {
        img: `${config.storageUrl}/resources/ON-BOARDING-1.jpg`,
        placeholder: `${config.storageUrl}/resources/ON-BOARDING-1_12x12.webp`,
        title: "landing.on-boarding.virtual-events.items-1.title",
        description: "landing.on-boarding.virtual-events.items-1.description",
      },
      {
        img: `${config.storageUrl}/resources/ON-BOARDING-2.jpg`,
        placeholder: `${config.storageUrl}/resources/ON-BOARDING-2_12x12.webp`,
        title: "landing.on-boarding.virtual-events.items-2.title",
        description: "landing.on-boarding.virtual-events.items-2.description",
      },
      {
        img: `${config.storageUrl}/resources/ON-BOARDING-3.jpg`,
        placeholder: `${config.storageUrl}/resources/ON-BOARDING-3_12x12.webp`,
        title: "landing.on-boarding.virtual-events.items-3.title",
        description: "landing.on-boarding.virtual-events.items-3.description",
      },
    ],
  },
};

export const kickOffLiterals = {
  virtualEvents: {
    items: [
      {
        img: `${config.storageUrl}/resources/KICK-OFF-1.jpg`,
        placeholder: `${config.storageUrl}/resources/KICK-OFF-1_12x12.webp`,
        title: "landing.kick-off.virtual-events.items-1.title",
        description: "landing.kick-off.virtual-events.items-1.description",
      },
      {
        img: `${config.storageUrl}/resources/KICK-OFF-2.jpg`,
        placeholder: `${config.storageUrl}/resources/KICK-OFF-2_12x12.webp`,
        title: "landing.kick-off.virtual-events.items-2.title",
        description: "landing.kick-off.virtual-events.items-2.description",
      },
      {
        img: `${config.storageUrl}/resources/KICK-OFF-3.jpg`,
        placeholder: `${config.storageUrl}/resources/KICK-OFF-3_12x12.webp`,
        title: "landing.kick-off.virtual-events.items-3.title",
        description: "landing.kick-off.virtual-events.items-3.description",
      },
    ],
  },
};

export const ContentLiterals = {
  virtualEvents: {
    items: [
      {
        img: `${config.storageUrl}/resources/CONTENT-1.jpg`,
        placeholder: `${config.storageUrl}/resources/CONTENT-1_12x12.webp`,
        title: "landing.content.virtual-events.items-1.title",
        description: "landing.content.virtual-events.items-1.description",
      },
      {
        img: `${config.storageUrl}/resources/CONTENT-2.jpg`,
        placeholder: `${config.storageUrl}/resources/CONTENT-2_12x12.webp`,
        title: "landing.content.virtual-events.items-2.title",
        description: "landing.content.virtual-events.items-2.description",
      },
      {
        img: `${config.storageUrl}/resources/CONTENT-3.jpg`,
        placeholder: `${config.storageUrl}/resources/CONTENT-3_12x12.webp`,
        title: "landing.content.virtual-events.items-3.title",
        description: "landing.content.virtual-events.items-3.description",
      },
    ],
  },
};

export const tableEventsColumns = (t) => {
  return [
    {
      title: t("email"),
      dataIndex: "email",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">{text}</div>
      ),
    },
    {
      title: t("role"),
      dataIndex: "role",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">
          {text === "member" ? t("member") : text === "visitor" ? t("visitor") : t("admin")}
        </div>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">
          {text === "Active" ? t("active") : t("inactive")}
        </div>
      ),
    },
  ];
};

export const interests = [
  {
    title: "virtual-event",
    key: "virtual-event",
  },
  {
    title: "corporative-gifts",
    key: "corporative-gifts",
  },
  {
    title: "face-to-face-event",
    key: "face-to-face-event",
  },
  {
    title: "hybrid-event",
    key: "hybrid-event",
  },
  {
    title: "platform",
    key: "platform",
  },
  {
    title: "other",
    key: "other",
  },
];
