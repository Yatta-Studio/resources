import { Directory } from './directory';
interface FileListProps {
    fileList: Directory[];
    onSelectFile?: (file: Directory) => void;
}
export declare function FileList({ fileList, onSelectFile }: FileListProps): import("react").JSX.Element;
export {};
