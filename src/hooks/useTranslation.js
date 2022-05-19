import get from "lodash/get";
import { useCallback, useRef } from "reactn";
import { useRouter } from "next/router";
import en from "../../public/locales/en.json";
import es from "../../public/locales/es.json";
import modalsEn from "../../public/locales/en/modals.json";
import modalsEs from "../../public/locales/es/modals.json";
import eventsEn from "../../public/locales/en/pages/events.json";
import eventsEs from "../../public/locales/es/pages/events.json";
import drawerEn from "../../public/locales/en/drawer.json";
import drawerEs from "../../public/locales/es/drawer.json";
import { Switch } from "../components/form";

// TODO: Consider chunk the json files.
const TRANSLATIONS = {
  en: { ...en, modals: modalsEn, drawer: drawerEn, pages: { ...en.pages, events: eventsEn } },
  es: { ...es, modals: modalsEs, drawer: drawerEs, pages: { ...es.pages, events: eventsEs } },
};

// TODO: Support capitalize.
export const useTranslation = (path) => {
  const router = useRouter();

  const inputRef = useRef(null);

  const { locale, asPath } = router;

  // Current languages.
  const locales = Object.keys(TRANSLATIONS);

  // Update language and redirect.
  const setLocale = useCallback(
    (locale) => {
      router.push(asPath, asPath, { locale });
    },
    [asPath, router, locale]
  );

  // You can use:
  // t("landing.title"); OR const {t} = useTranslation("landing");
  // You can define a default value: t("landing.title","defaultValue");
  const t = useCallback(
    (keyString, defaultValue = "") => {
      const route = path ? `${path}.` : "";

      return get(TRANSLATIONS[locale], `${route}${keyString}`, defaultValue ?? keyString);
    },
    [TRANSLATIONS, locale, path]
  );

  const SwitchTranslation = useCallback(
    () => (
      <Switch
        size="small"
        variant="switcher"
        label1="En"
        label2="Es"
        defaultChecked={locale === locales[1]}
        onChange={(event) => {
          event.preventDefault();
          setLocale(event.target.checked ? locales[1] : locales[0]);
        }}
      />
    ),
    [locale]
  );

  return { t, locales, locale, setLocale, SwitchTranslation };
};

// References:
// https://betterprogramming.pub/build-your-own-usetranslation-hook-with-next-js-2c65017d323a
// https://nextjs.org/docs/advanced-features/i18n-routing#limits-for-the-i18n-config
// https://github.com/a-chris/use-translation-example
