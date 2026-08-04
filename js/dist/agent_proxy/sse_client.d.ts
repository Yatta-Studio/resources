import { OpenAIContext } from './index';
declare const Express: any, Response: any;
export declare const delay: (ms: number) => Promise<unknown>;
export declare class SSEClient {
    private static instance;
    static connection: typeof Response | null;
    static getInstance(): SSEClient;
    static connect(app: typeof Express): void;
    static end(): void;
    stream_to_agent(res: typeof Response, result: OpenAIContext): Promise<void>;
    private static sendChunk;
}
export {};
