import { AgentSession } from '@earendil-works/pi-coding-agent';
import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

/*
curl -X POST http://localhost:9999/api/execute-tool \
     -H "Content-Type: application/json" \
     -d '{
       "toolName": "bash",
       "arguments": { "command": "git status --short" }
    }'

curl -X POST http://localhost:9999/api/execute-tool \
     -H "Content-Type: application/json" \
     -d '{
       "toolName": "edit",
       "arguments": {
         "path": "src/config.ts",
         "oldText": "const VERSION = \"1.0.0\";",
         "newText": "const VERSION = \"1.1.0\";"
       }
    }'
*/

// Initialize a static, long-lived workspace session
const session = new AgentSession({
    provider: 'anthropic',
    model: 'claude-3-5-sonnet'
});

/**
 * POST /api/execute-tool
 * Body Schema: { toolName: string, arguments: object }
 */
app.post('/api/execute-tool', async (req: Request, res: Response): Promise<void> => {
    try {
        const { toolName, arguments: toolArgs } = req.body;

        // 1. Validate parameters
        if (!toolName || !toolArgs) {
            res.status(400).json({ error: "Missing required fields: 'toolName' or 'arguments'" });
            return;
        }

        // 2. Fetch the target tool from the active session dictionary
        const targetTool = session.tools.get(toolName);

        if (!targetTool) {
            res.status(404).json({
                error: `Tool '${toolName}' not found. Available tools: ${Array.from(session.tools.keys()).join(', ')}`
            });
            return;
        }

        // 3. Execute the tool directly bypassing the LLM
        const toolResult = await targetTool.execute(toolArgs);

        // 4. Return structural outcomes back to your client
        res.status(200).json({
            success: !toolResult.isError,
            output: toolResult
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal Agent runtime failure' });
    }
});

const PORT = 9999;
app.listen(PORT, () => {
    console.log(`🚀 Pi Tool Bridge server live at http://localhost:${PORT}`);
});
