import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { EmptyState } from "./components/EmptyState";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { MarkdownPreview } from "./components/MarkdownPreview";
import { Directory, ViewMode } from "./types";
import { listFolders, onDisplayMarkdown } from "./api";

const App = () => {
    const [markdown, setMarkdown] = useState<string>("");
    const [activeFileName, setActiveFileName] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [viewMode, setViewMode] = useState<ViewMode>("editor");
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
                console.error(
                    "Failed to load folders from extension API:",
                    err,
                );
            } finally {
                setIsLoading(false);
            }
        }

        fetchFolders();

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
            <Header viewMode={viewMode} onViewModeChange={setViewMode} />

            <div className="flex-1 flex w-full min-h-0 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setIsSidebarOpen((prev) => !prev)}
                    files={files}
                    isLoading={isLoading}
                    onSelectFile={handleSelectFile}
                />

                <main className="flex-1 flex w-full min-h-0 p-4 gap-4 overflow-hidden">
                    {(viewMode === "editor" || viewMode === "split") && (
                        <MarkdownEditor
                            value={markdown}
                            onChange={setMarkdown}
                        />
                    )}

                    {(viewMode === "preview" || viewMode === "split") &&
                        (markdown.trim() || activeFileName ? (
                            <MarkdownPreview markdown={markdown} />
                        ) : (
                            <EmptyState />
                        ))}
                </main>
            </div>
        </div>
    );
};

export default App;
