export interface FolderInfo {
    folderPath: string;
    documentCount: number;
    lastUpdatedAt?: string | number;
}

interface WebListFoldersResponseEventData {
    type: "WEB_RAG_LIST_FOLDERS_RESPONSE";
    requestId: string;
    success: boolean;
    data?: FolderInfo[];
    error?: string;
}

/**
 * Invokes `listFolders` via extension messaging bridge from the web page context.
 */
export function listFolders(parentPath: string = ""): Promise<FolderInfo[]> {
    return new Promise((resolve, reject) => {
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        function handleResponse(
            event: MessageEvent<WebListFoldersResponseEventData>,
        ): void {
            if (
                event.source !== window ||
                event.data?.type !== "WEB_RAG_LIST_FOLDERS_RESPONSE" ||
                event.data?.requestId !== requestId
            ) {
                return;
            }

            // Clean up listener to prevent leaks
            window.removeEventListener("message", handleResponse);

            if (event.data.success && event.data.data) {
                resolve(event.data.data);
            } else {
                reject(
                    new Error(
                        event.data.error ??
                            "Failed to retrieve folders from extension.",
                    ),
                );
            }
        }

        window.addEventListener("message", handleResponse);

        // Dispatch request to content script
        window.postMessage(
            {
                type: "WEB_RAG_LIST_FOLDERS",
                requestId,
                payload: { parentPath },
            },
            "*",
        );
    });
}