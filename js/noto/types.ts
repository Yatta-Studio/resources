export interface Directory {
    name: string;
    content?: string;
    files?: Directory[];
}

export type ViewMode = "editor" | "preview" | "split";
