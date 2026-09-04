import { Directory } from './types';
interface FileNodeProps {
    directory: Directory;
    onSelectFile?: (file: Directory) => void;
}
export declare function FileNode({ directory, onSelectFile }: FileNodeProps): import("react").JSX.Element;
export {};
