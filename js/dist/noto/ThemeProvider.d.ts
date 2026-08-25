import { ReactNode } from 'react';
type ThemeMode = "light" | "dark";
interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}
export declare function ThemeProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare function useTheme(): ThemeContextType;
export {};
