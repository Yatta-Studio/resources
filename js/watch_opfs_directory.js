/*
    If you run this inside a Manifest V3 Background Service Worker, remember that service 
    workers are ephemeral and will shut down after a period of inactivity. If they shut down, 
    your setTimeout loop terminates.
*/

/**
 * Monitors an OPFS directory for changes (additions, deletions, or modifications).
 * @param {string} path - The sub-directory path to watch (leave empty for root).
 * @param {function} onChange - Callback triggered when a change is detected.
 * @param {number} intervalMs - Polling interval in milliseconds.
 * @returns {function} A function to stop the watcher.
 */
function watchOPFSDirectory(path = '', onChange, intervalMs = 1000) {
    let isWatching = true;
    let previousSnapshot = new Map();

    // Helper to recursively scan a directory and build a state snapshot
    async function scanDirectory(dirHandle, currentPath = '') {
        const snapshot = new Map();

        for await (const entry of dirHandle.values()) {
            const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

            if (entry.kind === 'file') {
                // Get file metadata (last modified time) for change detection
                const file = await entry.getFile();
                snapshot.set(entryPath, {
                    kind: 'file',
                    lastModified: file.lastModified,
                    size: file.size
                });
            } else if (entry.kind === 'directory') {
                snapshot.set(entryPath, { kind: 'directory' });
                // Recursively scan subdirectories
                const subSnapshot = await scanDirectory(entry, entryPath);
                for (const [subPath, subMeta] of subSnapshot.entries()) {
                    snapshot.set(subPath, subMeta);
                }
            }
        }
        return snapshot;
    }

    // Deep comparison between the old snapshot and the new snapshot
    function detectChanges(oldSnap, newSnap) {
        const changes = { added: [], removed: [], modified: [] };

        // Check for additions and modifications
        for (const [path, meta] of newSnap.entries()) {
            if (!oldSnap.has(path)) {
                changes.added.push({ path, ...meta });
            } else {
                const oldMeta = oldSnap.get(path);
                if (meta.kind === 'file' && (meta.lastModified !== oldMeta.lastModified || meta.size !== oldMeta.size)) {
                    changes.modified.push({ path, ...meta });
                }
            }
        }

        // Check for deletions
        for (const path of oldSnap.keys()) {
            if (!newSnap.has(path)) {
                changes.removed.push({ path, kind: oldSnap.get(path).kind });
            }
        }

        return changes;
    }

    // Main polling loop
    async function poll() {
        if (!isWatching) return;

        try {
            // 1. Access the OPFS root directory
            let dirHandle = await navigator.storage.getDirectory();

            // 2. Navigate to the target subdirectory if specified
            if (path) {
                const parts = path.split('/').filter(Boolean);
                for (const part of parts) {
                    dirHandle = await dirHandle.getDirectoryHandle(part);
                }
            }

            // 3. Take a new snapshot of the directory
            const currentSnapshot = await scanDirectory(dirHandle);

            // 4. Compare with the previous snapshot (skip the very first run)
            if (previousSnapshot.size > 0 || currentSnapshot.size > 0) {
                const changes = detectChanges(previousSnapshot, currentSnapshot);

                if (changes.added.length > 0 || changes.removed.length > 0 || changes.modified.length > 0) {
                    onChange(changes);
                }
            }

            // 5. Update the cached snapshot
            previousSnapshot = currentSnapshot;

        } catch (error) {
            console.error("Error watching OPFS directory:", error);
        }

        // Schedule the next poll if still watching
        if (isWatching) {
            setTimeout(poll, intervalMs);
        }
    }

    // Start the polling loop
    poll();

    // Return a teardown function to stop monitoring when no longer needed
    return () => {
        isWatching = false;
    };
}

// Start watching the root OPFS directory every 2 seconds
const stopWatching = watchOPFSDirectory('', (changes) => {
  console.log('✨ Directory changes detected!');
  
  if (changes.added.length) console.log('Added:', changes.added);
  if (changes.removed.length) console.log('Removed:', changes.removed);
  if (changes.modified.length) console.log('Modified:', changes.modified);
}, 2000);

// Later, if you need to tear down the watcher to prevent memory leaks:
// stopWatching();
