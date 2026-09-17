import { ViewMode } from '../types';
interface HeaderProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}
export declare const Header: ({ viewMode, onViewModeChange }: HeaderProps) => import("react").JSX.Element;
export {};
