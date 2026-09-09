import { useState, useEffect } from "react";
import {
    Sun,
    Moon,
    FileText,
    PanelLeftClose,
    PanelLeft,
    Edit3,
    Eye,
    Columns,
    FileCode,
    Copy,
    Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error - esm.sh deep style import
import oneDark from "https://esm.sh/react-syntax-highlighter@16.1.1/dist/esm/styles/prism/one-dark?external=react";
import { useTheme } from "./ThemeProvider";
import { FileList } from "./file-list";
import { Directory, ViewMode } from "./types";
import { listFolders, onDisplayMarkdown } from "./api";
import "./markdown.css";

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button type="button" className="gemini-copy-btn" onClick={handleCopy}>
            {copied ? (
                <>
                    <Check className="size-3.5 text-green-500" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="size-3.5" />
                    <span>Copy code</span>
                </>
            )}
        </button>
    );
};

const App = () => {
    const { theme, toggleTheme } = useTheme();
    const [markdown, setMarkdown] = useState<string>("");
    const [activeFileName, setActiveFileName] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>("split");

    // File tree state initialized with static defaults
    const [files, setFiles] = useState<Directory[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchFolders() {
            try {
                const folderData = await listFolders();
                const remoteDirectories: Directory[] = folderData.map((f) => ({
                    name: f.folderPath,
                    files: [],
                }));
                setFiles(remoteDirectories);
            } catch (err) {
                console.error("Failed to load folders from extension API:", err);
            } finally {
                setIsLoading(false);
            }
        }

        // Fetch dynamic folder structure on mount via Messaging API
        fetchFolders();

        // Listen for markdown pushed from noto_content script
        const unsubscribe = onDisplayMarkdown((path, markdownContent) => {
            setMarkdown(markdownContent);
            setActiveFileName(path);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleSelectFile = (file: Directory) => {
        if (file.content !== undefined) {
            setMarkdown(file.content);
            setActiveFileName(file.name);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-surface-container overflow-hidden">
            <header className="flex items-center justify-between h-14 px-4 bg-surface border-b border-outline shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                        className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                        title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                        aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                    >
                        {isSidebarOpen ? (
                            <PanelLeftClose className="size-4" />
                        ) : (
                            <PanelLeft className="size-4" />
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-on-surface" />
                        <h3 className="text-lg font-semibold m-0 leading-none">Noto</h3>
                    </div>
                    <span className="text-xs text-on-surface-variant bg-surface-low px-2 py-1 rounded border border-outline hidden sm:inline-block">
                        {activeFileName ?? "No active document"}
                    </span>
                </div>

                <div className="flex items-center gap-1 bg-surface-low p-1 rounded-lg border border-outline">
                    <button
                        type="button"
                        onClick={() => setViewMode("editor")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${viewMode === "editor"
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
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${viewMode === "preview"
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
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer transition-colors ${viewMode === "split"
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
                        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                    }
                    aria-label={
                        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                    }
                >
                    {theme === "dark" ? (
                        <Sun className="size-4" />
                    ) : (
                        <Moon className="size-4" />
                    )}
                </button>
            </header>

            <div className="flex-1 flex w-full min-h-0 overflow-hidden">
                {isSidebarOpen && (
                    <aside className="w-64 border-r border-outline bg-surface-card flex flex-col shrink-0 p-3 overflow-y-auto">
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 px-2">
                            Explorer
                        </span>
                        {isLoading ? (
                            <span className="text-xs text-on-surface-variant px-2">
                                Loading folders...
                            </span>
                        ) : (
                            <FileList fileList={files} onSelectFile={handleSelectFile} />
                        )}
                    </aside>
                )}

                <main className="flex-1 flex w-full min-h-0 p-4 gap-4 overflow-hidden">
                    {!activeFileName ? (
                        /* Fallback view when no file is active */
                        <div className="flex-1 flex flex-col items-center justify-center h-full bg-surface-card border border-outline rounded-xl p-8 text-center shadow-sm">
                            <FileCode className="size-12 text-on-surface-variant/40 mb-3" />
                            <h4 className="text-base font-medium text-on-surface mb-1">
                                No Document Selected
                            </h4>
                            <p className="text-xs text-on-surface-variant max-w-xs">
                                Choose a document from the explorer on the left to start editing
                                or reading.
                            </p>
                        </div>
                    ) : (
                        /* Active document views */
                        <>
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

                            {(viewMode === "preview" || viewMode === "split") && (
                                <div className="flex-1 flex flex-col h-full bg-surface-card border border-outline rounded-xl p-4 shadow-sm min-w-0">
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline shrink-0">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                                            Live Preview
                                        </span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto text-on-surface pr-1">
                                        <div className={`gemini-markdown-container ${theme === "light" ? "light" : ""}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code: ({ node, className, children, ...props }) => {
                                                        const match = /language-(\w+)/.exec(className || "");
                                                        const lang = match ? match[1] : "text";
                                                        const rawCodeString = String(children).replace(/\n$/, "");
                                                        const isBlock = Boolean(match) || String(children).includes("\n");

                                                        if (isBlock) {
                                                            return (
                                                                <div className="gemini-code-block">
                                                                    <div className="gemini-code-header">
                                                                        <span className="gemini-code-lang">{lang}</span>
                                                                        <CopyButton textToCopy={rawCodeString} />
                                                                    </div>

                                                                    <SyntaxHighlighter
                                                                        language={lang}
                                                                        style={oneDark}
                                                                        PreTag="div"
                                                                        customStyle={{
                                                                            margin: 0,
                                                                            padding: "1rem 1.25rem",
                                                                            fontSize: "0.85rem",
                                                                            lineHeight: 1.55,
                                                                            background: "#1e1e2e",
                                                                            borderRadius: "0 0 10px 10px",
                                                                        }}
                                                                    >
                                                                        {rawCodeString}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            );
                                                        }

                                                        return (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {markdown}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
