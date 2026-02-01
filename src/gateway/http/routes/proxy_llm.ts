import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { PIIDetector } from '../../../core/pii/pii.detector';
import { PIIRedactor } from '../../../core/pii/pii.redactor';
import { PolicyEngine, Policy } from '../../../core/policy/policy.engine';
import { MockLLMClient } from '../../../adapters/llm/llm.client';

const piiDetector = new PIIDetector();
const piiRedactor = new PIIRedactor();
const policyEngine = new PolicyEngine();
const llmClient = new MockLLMClient();

const defaultPolicy: Policy = {
    id: 'default',
    name: 'Default Enterprise Policy',
    rules: {
        maxSeverity: 'MEDIUM',
        denyOnPII: false,
        redactAllPII: true,
        allowedTools: ['search'],
        requireApprovalForTools: [],
    },
};

export async function proxyLlmRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/llm', async (request, reply) => {
        const { prompt } = request.body as { prompt: string };

        const entities = piiDetector.detect(prompt);
        const decision = policyEngine.evaluate(prompt, entities, defaultPolicy);

        if (decision.action === 'DENY') {
            return reply.status(403).send({
                error: 'Policy Violation',
                reasons: decision.reasons,
            });
        }

        let finalPrompt = prompt;
        if (decision.action === 'REDACT') {
            const { redactedText } = piiRedactor.redact(prompt, entities);
            finalPrompt = redactedText;
        }

        const response = await llmClient.complete(finalPrompt);

        return {
            ...response,
            aegis: {
                action: decision.action,
                reasons: decision.reasons,
                piiCount: entities.length,
            },
        };
    });
}
