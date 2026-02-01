import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ToolFirewall, ToolCall } from '../../../core/firewall/tool.validator';

const toolFirewall = new ToolFirewall(['search', 'calculator', 'weather']);

export async function proxyToolRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/tool', async (request, reply) => {
        const toolCall = request.body as ToolCall;

        const decision = toolFirewall.validate(toolCall);

        if (decision.action === 'DENY') {
            return reply.status(403).send({
                error: 'Tool Firewall Block',
                reasons: decision.reasons,
            });
        }

        // In a real system, we would forward to the actual tool execution here
        return {
            status: 'success',
            decision: {
                action: decision.action,
                reasons: decision.reasons,
                requiresApproval: decision.requiresApproval,
            },
            mockToolResult: `Executed ${toolCall.toolName} with parameters ${JSON.stringify(toolCall.parameters)}`,
        };
    });
}
