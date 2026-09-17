import { PanelLeftClose, PanelLeft } from "lucide-react";
import { FileList } from "../file-list";
import { Directory } from "../types";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    files: Directory[];
    isLoading: boolean;
    onSelectFile: (file: Directory) => void;
}

export const Sidebar = ({
    isOpen,
    onToggle,
    files,
    isLoading,
    onSelectFile,
}: SidebarProps) => {
    return (
        <aside
            className={`border-r border-outline bg-surface-card flex flex-col shrink-0 transition-[width] duration-200 ${
                isOpen ? "w-64" : "w-12"
            }`}
        >
            {isOpen ? (
                <>
                    <div className="flex-1 overflow-y-auto p-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2 px-2 block">
                            Explorer
                        </span>
                        {isLoading ? (
                            <span className="text-xs text-on-surface-variant px-2">
                                Loading folders...
                            </span>
                        ) : (
                            <FileList
                                fileList={files}
                                onSelectFile={onSelectFile}
                            />
                        )}
                    </div>
                    <div className="flex items-center justify-end border-t border-outline bg-surface p-2 shadow-md shrink-0">
                        <button
                            type="button"
                            onClick={onToggle}
                            className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                            title="Hide Sidebar"
                            aria-label="Hide Sidebar"
                        >
                            <PanelLeftClose className="size-4" />
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="flex-1" />
                    <div className="flex items-center justify-center border-t border-outline bg-surface p-2 shadow-md shrink-0">
                        <button
                            type="button"
                            onClick={onToggle}
                            className="flex items-center justify-center size-8 rounded-md border border-outline bg-surface-card text-on-surface hover:bg-surface-bright cursor-pointer transition-colors"
                            title="Show Sidebar"
                            aria-label="Show Sidebar"
                        >
                            <PanelLeft className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
};
