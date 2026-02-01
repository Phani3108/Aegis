import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PIIDetector } from '../../../core/pii/pii.detector';
import { PIIRedactor } from '../../../core/pii/pii.redactor';
import { PolicyEngine, Policy } from '../../../core/policy/policy.engine';

const piiDetector = new PIIDetector();
const piiRedactor = new PIIRedactor();
const policyEngine = new PolicyEngine();

// Mock policy for implementation; in production, this would be fetched from DB/Cache
const defaultPolicy: Policy = {
    id: 'default',
    name: 'Default Enterprise Policy',
    rules: {
        maxSeverity: 'MEDIUM',
        denyOnPII: false,
        redactAllPII: true,
        allowedTools: ['search', 'calculator', 'weather'],
        requireApprovalForTools: ['bank_transfer', 'send_email'],
    },
};

export async function inspectRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/inspect', async (request, reply) => {
        const { prompt, tenantId } = request.body as { prompt: string; tenantId: string };

        if (!prompt) {
            return reply.status(400).send({ error: 'Prompt is required' });
        }

        const entities = piiDetector.detect(prompt);
        const decision = policyEngine.evaluate(prompt, entities, defaultPolicy);

        let redactedText = prompt;
        let redactions: any[] = [];

        if (decision.action === 'REDACT') {
            const result = piiRedactor.redact(prompt, entities);
            redactedText = result.redactedText;
            redactions = result.redactions;
        }

        return {
            decision: {
                action: decision.action,
                reasons: decision.reasons,
                requiresApproval: decision.requiresApproval,
            },
            pii: {
                detected: entities.length > 0,
                entities,
            },
            redaction: {
                performed: decision.action === 'REDACT',
                redactedText,
                redactions,
            },
            auditId: 'audit-' + Math.random().toString(36).substring(7),
        };
    });
}
