import get from "lodash/get";
import { useCallback } from "reactn";
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

  // Update language and redirect.
  const setLocale = useCallback(
    (locale) => {
      router.push(asPath, asPath, { locale });
    },
    [asPath]
  );

  // You can use:
  // const {t} = useTranslation("landing") or t("landing.title")
  const t = useCallback(
    (keyString) => {
      return get(TRANSLATIONS[locale], `${path ? `${path}.` : ""}${keyString}`);
    },
    [TRANSLATIONS, locale]
  );

  return { t, locales, locale, setLocale };
};

// References:
// https://betterprogramming.pub/build-your-own-usetranslation-hook-with-next-js-2c65017d323a
// https://nextjs.org/docs/advanced-features/i18n-routing#limits-for-the-i18n-config
// https://github.com/a-chris/use-translation-example
