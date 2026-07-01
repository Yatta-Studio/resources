import express from 'express';

const app = express();
app.use(express.json());

app.post('/proxy-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        // 2. Request data from the upstream SSE endpoint
        const upstreamResponse = await fetch('https://upstream.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        if (!upstreamResponse.body) {
            res.write("data: Error: No readable stream from upstream\n\n");
            return res.end();
        }

        // 3. Obtain a stream reader to process raw byte chunks
        const reader = upstreamResponse.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // 4. Forward the incoming raw string chunks immediately 
            const chunk = decoder.decode(value, { stream: true });
            res.write(chunk);

            // Required if using compression middleware (like gzip)
            if (typeof res.flush === 'function') res.flush();
        }
    } catch (error) {
        res.write(`data: Error: ${error.message}\n\n`);
    } finally {
        res.end();
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
