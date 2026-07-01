export interface BasePayLoad {
    id?: string;
    object: string;
    created: number;
    model: string;
}

export interface OpenAIContext extends BasePayLoad {
    object: 'chat.completion';
    choices?: ChatCompletionChoice[];
    usage?: ChatCompletionUsage;
    system_fingerprint?: string;
}

export interface ChatCompletionChoice {
    index: number;
    message: ChatCompletionMessage;
    logprobs?: ChatCompletionLogprobs | null;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call';
}

export interface ChatCompletionMessage {
    role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
    content: string | null;
    refusal?: string | null;
    tool_calls?: ToolCall[];
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}

export interface ChatCompletionLogprobs {
    content: ChatCompletionLogprobToken[] | null;
}

export interface ChatCompletionLogprobToken {
    token: string;
    logprob: number;
    bytes: number[] | null;
    top_logprobs: Array<{
        token: string;
        logprob: number;
        bytes: number[] | null;
    }>;
}

export interface ChatCompletionUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

// Define it explicitly so it doesn't conflict with the strict nested properties
export interface ChatCompletionChunkToolCall {
    index: number;
    id?: string;
    type?: 'function';
    function?: {
        name?: string;     // Perfectly fine now!
        arguments?: string;
    };
}

// Then your delta interface remains clean and flexible
export interface ChatCompletionChunkDelta {
    role?: 'system' | 'user' | 'assistant' | 'tool' | 'function';
    content?: string | null;
    refusal?: string | null;
    tool_calls?: ChatCompletionChunkToolCall[];
}