"use client";

import { useTranslation } from "@/lib/i18n/context";
import { languages } from "@/lib/i18n/dictionary";

export default function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  const nextLang = lang === "id" ? "en" : "id";

  return (
    <button
      onClick={() => setLang(nextLang)}
      className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
      title={lang === "id" ? "Switch to English" : "Ganti ke Indonesia"}
    >
      {languages[lang].flag}
    </button>
  );
}
