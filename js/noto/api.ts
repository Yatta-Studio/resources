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

interface DisplayMarkdownEventData {
    type: "DISPLAY_MARKDOWN";
    requestId: string;
    data: Record<string, any>;
}

/**
 * Listens for incoming DISPLAY_MARKDOWN pushes originating from the noto_content script.
 */
export function onDisplayMarkdown(
    callback: (path: string, markdown: string) => void,
): () => void {
    function handleMessage(event: MessageEvent<DisplayMarkdownEventData>) {
        // Ensure message comes from the window and matches the pushed type
        if (
            event.source !== window ||
            event.data?.type !== "DISPLAY_MARKDOWN"
        ) {
            return;
        }

        const storageData = event.data.data;
        if (storageData) {
            // Find the path and extract markdown content from storage object
            const keys = Object.keys(storageData);
            if (keys.length > 0) {
                const path = keys[0];
                const storedValue = storageData[path];

                const markdownText =
                    typeof storedValue === "object" && storedValue !== null
                        ? (storedValue as any).markdown || ""
                        : storedValue || "";

                callback(path, markdownText);
            }
        }
    }

    window.addEventListener("message", handleMessage);

    // Return cleanup function to remove the event listener
    return () => {
        window.removeEventListener("message", handleMessage);
    };
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
                console.log("WEB_RAG_LIST_FOLDERS_RESPONSE", event.data);
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
