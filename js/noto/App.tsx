import { useState } from "react";
import { Sun, Moon, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "./ThemeProvider";

const App = () => {
    const { theme, toggleTheme } = useTheme();
    const [markdown, setMarkdown] = useState<string>(
        "# Welcome to Noto\n\nStart typing **markdown** on the left panel to see the rendered preview on the right panel.\n\n### Features\n- Independent scrolling columns\n- Real-time preview\n- Light & Dark mode support"
    );

    return (
        <div className="flex flex-col w-full h-full bg-surface-container overflow-hidden">
            {/* Top Header Bar */}
            <header className="flex items-center justify-between h-14 px-4 bg-surface border-b border-outline shrink-0">
                <div className="flex items-center gap-2">
                    <FileText className="size-5 text-on-surface" />
                    <h3 className="text-lg font-semibold m-0 leading-none">Noto</h3>
                </div>

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </button>
            </header>

            {/* Main Content: 2-Column Workspace */}
            <main className="flex-1 flex w-full min-h-0 p-4 gap-4 overflow-hidden">
                {/* Column 1: Editor Pane */}
                <div className="flex-1 flex flex-col h-full bg-surface-card border border-outline rounded-xl p-4 shadow-sm min-w-0">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline shrink-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                            Markdown Source
                        </span>
                    </div>
                    <textarea
                        id="markdown-input"
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        placeholder="Write your markdown here..."
                        className="flex-1 w-full h-full resize-none border-none outline-none bg-transparent text-on-surface font-mono text-sm leading-relaxed overflow-y-auto focus:ring-0"
                    />
                </div>

                {/* Column 2: Preview Pane */}
                <div className="flex-1 flex flex-col h-full bg-surface-card border border-outline rounded-xl p-4 shadow-sm min-w-0">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline shrink-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                            Live Preview
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto text-on-surface pr-1">
                        <div className="prose max-w-none text-on-surface">
                            <ReactMarkdown>{markdown}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;