import { useId } from "react";
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { Directory } from "./types";
import { FileList } from "./file-list";

interface FileNodeProps {
    directory: Directory;
    onSelectFile?: (file: Directory) => void;
}

export function FileNode({ directory, onSelectFile }: FileNodeProps) {
    const nodeId = useId();
    const hasSubfolders = Boolean(
        directory.files && directory.files.length > 0,
    );

    if (!hasSubfolders) {
        return (
            <li className="flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer hover:bg-surface-bright/50 text-sm text-on-surface hover:text-on-surface transition-colors">
                <button
                    type="button"
                    onClick={() => onSelectFile?.(directory)}
                    className="flex items-center gap-2 w-full text-left bg-transparent border-none p-0 cursor-pointer text-inherit font-inherit"
                >
                    <FileIcon className="h-4 w-4 shrink-0 text-sky-300" />
                    <span className="truncate">{directory.name}</span>
                </button>
            </li>
        );
    }

    return (
        <li className="relative py-0.5">
            <label
                htmlFor={nodeId}
                className="group peer flex cursor-pointer items-center gap-2 py-1 px-2 rounded-md hover:bg-surface-bright/50 text-sm text-on-surface transition-colors"
            >
                <input id={nodeId} type="checkbox" className="hidden" />

                <FolderIcon className="h-4 w-4 shrink-0 group-has-checked:hidden text-amber-500" />
                <FolderOpenIcon className="hidden h-4 w-4 shrink-0 group-has-checked:block text-amber-500" />

                <span className="truncate font-medium">{directory.name}</span>
            </label>

            <div className="hidden peer-has-checked:block border-l border-outline ml-3 pl-1 my-0.5">
                <FileList
                    fileList={directory.files!}
                    onSelectFile={onSelectFile}
                />
            </div>
        </li>
    );
}
