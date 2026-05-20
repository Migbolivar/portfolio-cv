import { createContext, useContext, useState, type ReactNode } from 'react';
import { translations, type Lang } from '../i18n/translations';

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'es',
  setLang: () => {},
  t: () => '',
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Lang) || 'es';
    }
    return 'es';
  });

  const t = (key: string): string => {
    const keys = key.split('.');
    let val: any = translations[lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val ?? key;
  };

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
