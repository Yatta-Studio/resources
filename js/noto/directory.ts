export interface Directory {
    name: string;
    content?: string;
    files?: Directory[];
}