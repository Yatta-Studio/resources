export interface FolderInfo {
    folderPath: string;
    documentCount: number;
    lastUpdatedAt?: string | number;
}
/**
 * Invokes `listFolders` via extension messaging bridge from the web page context.
 */
export declare function listFolders(parentPath?: string): Promise<FolderInfo[]>;
