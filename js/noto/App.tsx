import { useState } from "react";
import {
    Sun,
    Moon,
    FileText,
    PanelLeftClose,
    PanelLeft,
    Edit3,
    Eye,
    Columns,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "./ThemeProvider";
import { Directory } from "./directory";
import { FileList } from "./file-list";

const INITIAL_FILES: Directory[] = [
    {
        name: "docs",
        files: [
            {
                name: "getting-started.md",
                content:
                    "# Getting Started\n\nWelcome to **Noto**! Select files from the sidebar to view or edit them.",
            },
            {
                name: "features.md",
                content:
                    "# Features\n\n- **File Tree Navigation**: Browse markdown files in a clean tree structure.\n- **View Modes**: Switch between Editor, Preview, or Split view.\n- **Dark/Light Mode**: Full theme customization.",
            },
        ],
    },
    {
        name: "notes",
        files: [
            {
                name: "todo.md",
                content:
                    "# Todo List\n\n- [x] Integrate file tree\n- [x] Add view modes\n- [ ] Add auto-save support",
            },
        ],
    },
    {
        name: "README.md",
        content:
            "# Welcome to Noto\n\nStart typing **markdown** in the editor panel to see the live preview.\n\n### Quick Start\n- Use the sidebar on the left to navigate files.\n- Use the view tabs in the header to switch between Editor, Preview, or Split mode.",
    },
];

type ViewMode = "editor" | "preview" | "split";

const App = () => {
    const { theme, toggleTheme } = useTheme();
    const [markdown, setMarkdown] = useState<string>(INITIAL_FILES[2].content!);
    const [activeFileName, setActiveFileName] = useState<string>("README.md");
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>("split");

    const handleSelectFile = (file: Directory) => {
        if (file.content !== undefined) {
            setMarkdown(file.content);
            setActiveFileName(file.name);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-surface-container overflow-hidden">
            {/* Top Header Bar */}
            <header className="flex items-center justify-between h-14 px-4 bg-surface border-b border-outline shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                        className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                        title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                        aria-label={
                            isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"
                        }
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose className="size-4" />
                        ) : (
                            <PanelLeft className="size-4" />
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-on-surface" />
                        <h3 className="text-lg font-semibold m-0 leading-none">
                            Noto
                        </h3>
                    </div>

                    <span className="text-xs text-on-surface-variant bg-surface-low px-2 py-1 rounded border border-outline hidden sm:inline-block">
                        {activeFileName}
                    </span>
                </div>

                {/* View Mode Controls */}
                <div className="flex items-center gap-1 bg-surface-low p-1 rounded-lg border border-outline">
                    <button
                        type="button"
                        onClick={() => setViewMode("editor")}
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
                        onClick={() => setViewMode("preview")}
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
                        onClick={() => setViewMode("split")}
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

                {/* Theme Toggle */}
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

            {/* Main Content Workspace */}
            <div className="flex-1 flex w-full min-h-0 overflow-hidden">
                {/* File Tree Sidebar */}
                {isSidebarOpen && (
                    <aside className="w-64 border-r border-outline bg-surface-card flex flex-col shrink-0 p-3 overflow-y-auto">
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 px-2">
                            Explorer
                        </span>
                        <FileList
                            fileList={INITIAL_FILES}
                            onSelectFile={handleSelectFile}
                        />
                    </aside>
                )}

                {/* Editor / Preview Main Area */}
                <main className="flex-1 flex w-full min-h-0 p-4 gap-4 overflow-hidden">
                    {/* Editor Pane */}
                    {(viewMode === "editor" || viewMode === "split") && (
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
                    )}

                    {/* Preview Pane */}
                    {(viewMode === "preview" || viewMode === "split") && (
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
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
