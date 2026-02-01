import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AuditLogger } from '../../../core/audit/audit.logger';

const auditLogger = new AuditLogger();

export async function auditRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get('/audits', async (request, reply) => {
        const { tenantId } = request.query as { tenantId: string };

        if (!tenantId) {
            return reply.status(400).send({ error: 'tenantId is required' });
        }

        const traces = await auditLogger.getTraces(tenantId);
        return { traces };
    });
}
