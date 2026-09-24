"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AppUser = { name: string };

export type ScoreEntry = { game: string; score: number; name: string };

type AppValue = {
  user: AppUser | null;
  ready: boolean;
  login: (user: AppUser | null) => void;
  signOut: () => void;
  saveScore: (entry: ScoreEntry) => void;
};

const AppContext = createContext<AppValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  // El usuario vive en localStorage: se lee después de montar para no romper la hidratación.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- se publica una única vez el valor leído de localStorage; arrancar en null y rellenarlo en un efecto es justo lo que evita el mismatch de hidratación */
    try {
      const raw = window.localStorage.getItem("av_user");
      if (raw) setUser(JSON.parse(raw) as AppUser);
    } catch {
      // localStorage no disponible (modo privado): se sigue con la sesión en memoria.
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback((next: AppUser | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem("av_user", JSON.stringify(next));
      else window.localStorage.removeItem("av_user");
    } catch {
      // Sin persistencia: la sesión solo dura lo que dure la pestaña.
    }
  }, []);

  const signOut = useCallback(() => login(null), [login]);

  const saveScore = useCallback((entry: ScoreEntry) => {
    try {
      const raw = window.localStorage.getItem("av_scores");
      const all = raw ? (JSON.parse(raw) as unknown[]) : [];
      all.push({ ...entry, at: Date.now() });
      window.localStorage.setItem("av_scores", JSON.stringify(all));
    } catch {
      // Sin persistencia: la puntuación se pierde al recargar.
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, ready, login, signOut, saveScore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return value;
}