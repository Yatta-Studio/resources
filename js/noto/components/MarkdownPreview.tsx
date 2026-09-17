import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error - esm.sh deep style import
import oneDark from "https://esm.sh/react-syntax-highlighter@16.1.1/dist/esm/styles/prism/one-dark?external=react";
import { useTheme } from "../ThemeProvider";
import { CopyButton } from "./CopyButton";
import "./markdown.css";

interface MarkdownPreviewProps {
    markdown: string;
}

export const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
    const { theme } = useTheme();

    return (
        <div className="flex-1 flex flex-col h-full bg-surface-card border border-outline rounded-xl p-4 shadow-sm min-w-0">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Live Preview
                </span>
            </div>
            <div className="flex-1 overflow-y-auto text-on-surface pr-1">
                <div
                    className={`gemini-markdown-container ${
                        theme === "light" ? "light" : ""
                    }`}
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(
                                    className || "",
                                );
                                const lang = match ? match[1] : "text";
                                const rawCodeString = String(children).replace(
                                    /\n$/,
                                    "",
                                );
                                const isBlock =
                                    Boolean(match) ||
                                    String(children).includes("\n");

                                if (isBlock) {
                                    return (
                                        <div className="gemini-code-block">
                                            <div className="gemini-code-header">
                                                <span className="gemini-code-lang">
                                                    {lang}
                                                </span>
                                                <CopyButton
                                                    textToCopy={rawCodeString}
                                                />
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
                                                    background: "transparent", // let the parent .gemini-code-block control the bg
                                                    borderRadius:
                                                        "0 0 10px 10px",
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
    );
};
