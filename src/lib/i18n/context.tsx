"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Language, dictionary } from "./dictionary";

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  lang: "id",
  setLang: () => {},
  t: (key: string) => key,
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Language | null;
    if (stored === "id" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dictionary[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
