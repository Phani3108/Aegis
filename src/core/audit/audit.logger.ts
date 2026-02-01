export interface TraceData {
    requestId: string;
    tenantId: string;
    prompt: string;
    redactedPrompt?: string;
    decision: string;
    reasons: string[];
    redactions?: any;
    toolCalls?: any;
    decisionDetails?: any;
}

export class AuditLogger {
    async logTrace(data: TraceData) {
        // Console logging for demo purposes
        console.log(`[Audit] [${data.requestId}] Decision: ${data.decision} | Reasons: ${data.reasons.join(', ')}`);
        if (data.redactedPrompt) {
            console.log(`[Audit] [${data.requestId}] Redacted Prompt: ${data.redactedPrompt.substring(0, 50)}...`);
        }
    }

    async getTraces(tenantId: string) {
        // In demo, return empty list or mock data
        return [];
    }
}
