import { Sun, Moon, FileText, Edit3, Eye, Columns } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { ViewMode } from "../types";

interface HeaderProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export const Header = ({ viewMode, onViewModeChange }: HeaderProps) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-between h-14 px-4 bg-surface border-b border-outline shrink-0">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <FileText className="size-5 text-on-surface" />
                    <h3 className="text-lg font-semibold m-0 leading-none">
                        Noto
                    </h3>
                </div>
            </div>

            <div className="flex items-center gap-1 bg-surface-low p-1 rounded-lg border border-outline">
                <button
                    type="button"
                    onClick={() => onViewModeChange("editor")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                        viewMode === "editor"
                            ? "bg-surface-card text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    <Edit3 className="size-3.5" />
                    <span className="hidden sm:inline">Editor</span>
                </button>
                <button
                    type="button"
                    onClick={() => onViewModeChange("preview")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                        viewMode === "preview"
                            ? "bg-surface-card text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    <Eye className="size-3.5" />
                    <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                    type="button"
                    onClick={() => onViewModeChange("split")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${
                        viewMode === "split"
                            ? "bg-surface-card text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                    <Columns className="size-3.5" />
                    <span className="hidden sm:inline">Split</span>
                </button>
            </div>

            <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                title={
                    theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                }
                aria-label={
                    theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                }
            >
                {theme === "dark" ? (
                    <Sun className="size-4" />
                ) : (
                    <Moon className="size-4" />
                )}
            </button>
        </header>
    );
};
