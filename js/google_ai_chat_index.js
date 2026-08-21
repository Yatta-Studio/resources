(function () {
    // Function to extract span elements that precede the aria-label target
    function getQuestionElements() {
        const targetElements = document.querySelectorAll(
            'div[aria-label="Expand query preview"]',
        );
        const elements = [];

        targetElements.forEach((div) => {
            let prev = div.previousElementSibling;
            while (prev) {
                if (prev.tagName.toLowerCase() === "span") {
                    elements.push(prev);
                    break;
                }
                prev = prev.previousElementSibling;
            }
        });

        return elements.length > 0
            ? elements
            : Array.from(
                  document.querySelectorAll(
                      'div:has(> div[aria-label="Expand query preview"]) > span',
                  ),
              );
    }

    const initialElements = getQuestionElements();

    // Create overlay panel
    const panel = document.createElement("div");
    panel.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    max-height: 500px;
    background: #ffffff;
    color: #333333;
    border: 2px solid #007bff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    z-index: 999999;
    font-family: sans-serif;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  `;

    // Header
    const header = document.createElement("div");
    header.style.cssText =
        "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 8px; font-weight: bold;";

    const title = document.createElement("span");
    header.appendChild(title);

    // Button Controls Container
    const controls = document.createElement("div");
    controls.style.cssText = "display: flex; gap: 8px; align-items: center;";

    // Toggle (Expand/Collapse) Button
    const toggleBtn = document.createElement("button");
    toggleBtn.innerText = "–";
    toggleBtn.title = "Collapse panel";
    toggleBtn.style.cssText =
        "border: none; background: transparent; cursor: pointer; font-size: 16px; font-weight: bold; line-height: 1; padding: 0 4px; color: #555;";

    // Close Button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✕";
    closeBtn.title = "Close panel";
    closeBtn.style.cssText =
        "border: none; background: transparent; cursor: pointer; font-size: 14px; font-weight: bold; line-height: 1; padding: 0 4px; color: #555;";

    controls.appendChild(toggleBtn);
    controls.appendChild(closeBtn);
    header.appendChild(controls);
    panel.appendChild(header);

    // List Container (Scrollable)
    const listContainer = document.createElement("div");
    listContainer.style.cssText = `
    overflow-y: auto;
    max-height: 420px;
    margin-top: 8px;
    transition: all 0.2s ease-in-out;
    scroll-behavior: smooth;
  `;

    const list = document.createElement("ol");
    list.style.cssText = "padding-left: 20px; margin: 0;";
    listContainer.appendChild(list);
    panel.appendChild(listContainer);

    const seenText = new Set();

    // Function to create list item elements
    function createListItem(el) {
        const text = el.innerText.trim();
        if (!text || seenText.has(text)) return;

        seenText.add(text);

        // Maintain border styling for existing items
        if (list.lastElementChild) {
            list.lastElementChild.style.borderBottom = "1px solid #e0e0e0";
        }

        const li = document.createElement("li");
        li.style.cssText = `
      padding: 8px 0;
      border-bottom: none;
    `;

        const a = document.createElement("a");
        a.href = "#";
        a.innerText = text;
        a.title = text;
        a.style.cssText = `
      color: #007bff;
      text-decoration: none;
      cursor: pointer;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.4;
    `;

        // Smooth scroll and flash effect
        a.addEventListener("click", (e) => {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "center" });

            const originalBg = el.style.backgroundColor;
            el.style.transition = "background-color 0.3s ease";
            el.style.backgroundColor = "#fff3cd";
            setTimeout(() => {
                el.style.backgroundColor = originalBg;
            }, 1500);
        });

        li.appendChild(a);
        list.appendChild(li);
        title.innerText = `Questions List (${seenText.size})`;
        listContainer.scrollTop = listContainer.scrollHeight;
    }

    // Add initial elements
    initialElements.forEach(createListItem);

    // Collapse / Expand Toggle Logic
    let isCollapsed = false;
    toggleBtn.onclick = () => {
        isCollapsed = !isCollapsed;
        if (isCollapsed) {
            listContainer.style.display = "none";
            header.style.borderBottom = "none";
            header.style.paddingBottom = "0";
            toggleBtn.innerText = "+";
            toggleBtn.title = "Expand panel";
        } else {
            listContainer.style.display = "block";
            header.style.borderBottom = "1px solid #eee";
            header.style.paddingBottom = "8px";
            toggleBtn.innerText = "–";
            toggleBtn.title = "Collapse panel";
        }
    };

    // Set up MutationObserver to watch DOM for new items dynamically
    const observer = new MutationObserver(() => {
        const currentElements = getQuestionElements();
        currentElements.forEach(createListItem);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // Clean up observer when panel is closed
    closeBtn.onclick = () => {
        observer.disconnect();
        panel.remove();
    };

    document.body.appendChild(panel);
})();
