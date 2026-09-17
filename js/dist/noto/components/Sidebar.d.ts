import { Directory } from '../types';
interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    files: Directory[];
    isLoading: boolean;
    onSelectFile: (file: Directory) => void;
}
export declare const Sidebar: ({ isOpen, onToggle, files, isLoading, onSelectFile, }: SidebarProps) => import("react").JSX.Element;
export {};
