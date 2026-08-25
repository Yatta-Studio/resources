import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const App = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex w-full h-full bg-surface-container">
            <div
                className="flex h-full border-r border-outline p-2 bg-surface"
                style={{ width: "320px" }}
            >
                <div className="flex flex-col w-full gap-3">
                    <div className="row lt-spring">
                        <h4 className="m-0">Noto</h4>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer"
                            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {theme === "dark" ? (
                                <Sun className="size-4" />
                            ) : (
                                <Moon className="size-4" />
                            )}
                        </button>
                    </div>
                    <p className="text-on-surface-variant m-0">
                        hello world
                    </p>
                </div>
            </div>
            <div className="flex-1 w-full h-full p-2"></div>
        </div>
    );
};

export default App;