import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { pino } from 'pino';
import * as dotenv from 'dotenv';
import { inspectRoutes } from './gateway/http/routes/inspect';
import { proxyLlmRoutes } from './gateway/http/routes/proxy_llm';
import { proxyToolRoutes } from './gateway/http/routes/proxy_tool';
import { auditRoutes } from './gateway/http/routes/audits';

dotenv.config();

const fastify = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    },
});

async function start() {
    try {
        await fastify.register(cors);
        await fastify.register(rateLimit, {
            max: 100,
            timeWindow: '1 minute',
        });

        // Register routes
        await fastify.register(inspectRoutes, { prefix: '/v1' });
        await fastify.register(proxyLlmRoutes, { prefix: '/v1' });
        await fastify.register(proxyToolRoutes, { prefix: '/v1' });
        await fastify.register(auditRoutes, { prefix: '/v1' });

        fastify.get('/health', async () => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });

        const port = Number(process.env.PORT) || 3001;
        await fastify.listen({ port, host: '0.0.0.0' });

        console.log(`🚀 Aegis Security Layer running on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
