interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
    return (
        <div className="flex-1 flex flex-col h-full bg-surface-card border border-outline rounded-xl p-4 shadow-sm min-w-0">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline shrink-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Markdown Source
                </span>
            </div>
            <textarea
                id="markdown-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your markdown here..."
                className="flex-1 w-full h-full resize-none border-none outline-none bg-transparent text-on-surface font-mono text-sm leading-relaxed overflow-y-auto focus:ring-0"
            />
        </div>
    );
};
