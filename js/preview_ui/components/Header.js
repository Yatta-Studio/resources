/* Dashboard header — extracted from index.html.
 *
 * IMPORTANT: this file is loaded by the browser as a real ES module.
 * Babel standalone does NOT transform imports, so no JSX here — we use
 * `htm` (JSX-like tagged templates) instead:
 *     html`<h1 className="text-heading-md">${title}</h1>`
 * Class names are unchanged, so dist.css works as-is.
 */
import React from "react";
import htm from "htm";
import { Bell, Moon, Sun } from "lucide-react";

const html = htm.bind(React.createElement);

const iconBtn =
    "btn-round-icon p-2 border-[var(--color-outline)] " +
    "bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] " +
    "transition-colors duration-200 " +
    "hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-on-surface)]";

function Header({
    title = "Dashboard",
    subtitle,
    theme = "light",
    onToggleTheme,
    onNotificationsClick,
    children, // extra actions rendered before the icon buttons
}) {
    const ThemeIcon = theme === "dark" ? Sun : Moon;

    return html`
        <header className="surface-header shrink-0">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-heading-md truncate">${title}</h1>
                    ${subtitle &&
                    html`<p className="text-ui-meta truncate">${subtitle}</p>`}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    ${children}

                    <button
                        type="button"
                        className=${iconBtn}
                        aria-label="Notifications"
                        onClick=${onNotificationsClick}
                    >
                        <${Bell} className="size-4" />
                    </button>

                    <button
                        type="button"
                        className=${iconBtn}
                        aria-label=${theme === "dark"
                            ? "Switch to light theme"
                            : "Switch to dark theme"}
                        onClick=${onToggleTheme}
                    >
                        <${ThemeIcon} className="size-4" />
                    </button>
                </div>
            </div>
        </header>
    `;
}

export default Header;
