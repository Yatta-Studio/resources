import { Directory } from "./directory";
import { FileNode } from "./file-node";

interface FileListProps {
    fileList: Directory[];
    onSelectFile?: (file: Directory) => void;
}

export function FileList({ fileList, onSelectFile }: FileListProps) {
    return (
        <ul className="flex flex-col list-none p-0 m-0">
            {fileList.map((directory, index) => (
                <FileNode
                    key={`${directory.name}-${index}`}
                    directory={directory}
                    onSelectFile={onSelectFile}
                />
            ))}
        </ul>
    );
}