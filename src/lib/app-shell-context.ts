import { createContext, useContext } from "react";

export type Lang = "ar" | "en";

export interface AppShellCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (v: boolean) => void;
}

export const AppShellContext = createContext<AppShellCtx | null>(null);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used within AppShell");
  return ctx;
}
