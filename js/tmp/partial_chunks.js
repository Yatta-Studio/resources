res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
});



// 1. Step One: Initialize all choices at the same time
// This lets the client allocate the choice arrays instantly
const completionId = basePayload.id || `chatcmpl-${Math.random().toString(36).substr(2, 9)}`;
const createdTimestamp = basePayload.created || Math.floor(Date.now() / 1000);
const initialSetupChunk = {
    id: completionId,
    object: "chat.completion.chunk",
    created: createdTimestamp,
    model: basePayload.model,
    choices: choices.map(choice => ({
        index: choice.index,
        delta: { role: choice.message.role },
        finish_reason: null
    }))
};
res.write(`data: ${JSON.stringify(initialSetupChunk)}\n\n`);



// Chunk 1: Initialize the role
res.write(`data: ${JSON.stringify({
    choices: [{ index: 0, delta: { role: "assistant" }, finish_reason: null }]
})}\n\n`);

// Chunk 2: First piece of text
res.write(`data: ${JSON.stringify({
    choices: [{ index: 0, delta: { content: "Hello " }, finish_reason: null }]
})}\n\n`);

// Chunk 3: Second piece of text
res.write(`data: ${JSON.stringify({
    choices: [{ index: 0, delta: { content: "world" }, finish_reason: null }]
})}\n\n`);

// Chunk 4: Stop signal
res.write(`data: ${JSON.stringify({
    choices: [{ index: 0, delta: {}, finish_reason: "stop" }]
})}\n\n`);



// Chunk 1: Initialize the tool call (Send ID and Function Name)
res.write(`data: ${JSON.stringify({
    choices: [{
        index: 0,
        delta: {
            tool_calls: [{ index: 0, id: "call_123", type: "function", function: { name: "get_weather" } }]
        },
        finish_reason: null
    }]
})}\n\n`);

// Chunk 2: Stream the first half of the JSON arguments string
res.write(`data: ${JSON.stringify({
    choices: [{
        index: 0,
        delta: {
            tool_calls: [{ index: 0, function: { arguments: '{"location": "San Fr' } }]
        },
        finish_reason: null
    }]
})}\n\n`);

// Chunk 3: Stream the second half of the JSON arguments string
res.write(`data: ${JSON.stringify({
    choices: [{
        index: 0,
        delta: {
            tool_calls: [{ index: 0, function: { arguments: 'ancisco", "unit": "celsius"}' } }]
        },
        finish_reason: null
    }]
})}\n\n`);

// Chunk 4: Close the tool call stream
res.write(`data: ${JSON.stringify({
    choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }]
})}\n\n`);