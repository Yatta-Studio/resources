import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton = ({ textToCopy }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <button type="button" className="gemini-copy-btn" onClick={handleCopy}>
            {copied ? (
                <>
                    <Check className="size-3.5 text-green-500" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Copy className="size-3.5" />
                    <span>Copy code</span>
                </>
            )}
        </button>
    );
};
