import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" }
];

export default function LangSwitcher() {
  const { i18n: i18next } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);

    // si tu veux ajouter auto direction RTL pour l'arabe :
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLang(lang.code)}
          className={`px-3 py-1 rounded border text-sm
            ${i18next.language === lang.code
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
