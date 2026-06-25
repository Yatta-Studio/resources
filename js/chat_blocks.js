function distinguishChatBlocks() {
    // Target the main chat body container or all potential content blocks
    // Adjust the selector if targeting a specific message element
    const blocks = document.querySelectorAll('.message-content, [data-message-author] .markdown, p, pre, div[role="region"]');

    const categorizedBlocks = [];

    blocks.forEach((block, index) => {
        // 1. Check if it's explicitly a code block container
        // The UI wraps code blocks in a container with a copy button and language banner
        const isCodeBlockContainer = block.tagName === 'PRE' ||
            block.querySelector('pre') !== null ||
            block.querySelector('button[aria-label*="Copy"]') !== null;

        if (isCodeBlockContainer) {
            // Extract the code content and language if available
            const preElement = block.tagName === 'PRE' ? block : block.querySelector('pre');
            const codeText = preElement ? preElement.textContent.trim() : block.textContent.trim();

            // Attempt to find the language header text (e.g., "JavaScript", "HTML")
            const headerElement = block.querySelector('.code-lang, span, div'); // Adjust based on precision needed
            const language = headerElement ? headerElement.textContent.trim() : 'Unknown';

            categorizedBlocks.push({
                index,
                type: 'code',
                language: language,
                content: codeText,
                element: block
            });
        }
        // 2. Otherwise, treat it as regular text if it contains text and isn't part of a code block's internal structure
        else if (block.textContent.trim() && !block.closest('pre')) {
            // Ensure we aren't double-counting nested paragraphs inside text containers
            if (block.tagName === 'P' || block.children.length === 0 || block.classList.contains('markdown')) {
                categorizedBlocks.push({
                    index,
                    type: 'text',
                    content: block.textContent.trim(),
                    element: block
                });
            }
        }
    });

    return categorizedBlocks;
}

// Example usage:
const currentUiBlocks = distinguishChatBlocks();
console.log(currentUiBlocks);