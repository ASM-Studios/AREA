import en_language from "../../public/locales/en";
import fr_language from "../../public/locales/fr";
import { Translation } from "@Config/translation.types";

type TranslationKeys = 'en' | 'fr';

const translation: Record<TranslationKeys, Translation> = {
    en: en_language,
    fr: fr_language,
};

const getTranslation = (language: TranslationKeys): Translation => {
    return translation[language];
}
