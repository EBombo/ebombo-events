import modalsEn from "./public/locales/en/modals.json";
import modalsEs from "./public/locales/es/modals.json";
import eventsEn from "./public/locales/en/pages/events.json";
import eventsEs from "./public/locales/es/pages/events.json";
import drawerEn from "./public/locales/en/drawer.json";
import drawerEs from "./public/locales/es/drawer.json";
import en from "./public/locales/en.json";
import es from "./public/locales/es.json";

export const languages = {
  en: { ...en, modals: modalsEn, drawer: drawerEn, pages: { ...en.pages, events: eventsEn } },
  es: { ...es, modals: modalsEs, drawer: drawerEs, pages: { ...es.pages, events: eventsEs } },
};
