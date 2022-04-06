import get from "lodash/get";
import { useRouter } from "next/router";
import en from "../../public/locales/en.json";
import es from "../../public/locales/es.json";

const TRANSLATIONS = { en, es };

// TODO: Support capitalize.
export const useTranslation = (path) => {
  const router = useRouter();
  const { locale, asPath } = router;

  // Current languages.
  const locales = Object.keys(TRANSLATIONS);

  // Update language an redirect.
  const setLocale = (locale) => router.push(asPath, asPath, { locale });

  // You can use:
  // const {t} = useTranslation("landing") or t("landing.title")
  const t = (keyString) => get(TRANSLATIONS[locale], `${path ? `${path}.` : ""}${keyString}`);

  return { t, locales, locale, setLocale };
};
