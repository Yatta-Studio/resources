export interface FolderInfo {
    folderPath: string;
    documentCount: number;
    lastUpdatedAt?: string | number;
}
export declare function onDisplayMarkdown(callback: (path: string, markdown: string) => void): () => void;
/**
 * Invokes `listFolders` via extension messaging bridge from the web page context.
 */
export declare function listFolders(parentPath?: string): Promise<FolderInfo[]>;
