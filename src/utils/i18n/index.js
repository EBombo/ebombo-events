import get from "lodash/get";
import {attendance, companies, company, examples, general, home, login, register, user, users} from "./pages";
import {useGlobal} from "reactn";
import {english, spanish} from "./flags";

const i18nJson = {
    general,
    login,
    register,
    home,
    attendance,
    examples,
    companies,
    company,
    users,
    user
};

export const languages = [
    {code: "en", name: "English", flag: english},
    {code: "es", name: "Español", flag: spanish}
];

export const useI18n = () => {
    const [languageCode] = useGlobal("languageCode");

    return (findField, _default = "Not found") =>
        get(i18nJson, [...findField, languageCode], _default);
};
