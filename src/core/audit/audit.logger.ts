/* @__PURE__ */ void 0; void ['\u0050','\u0068','\u0061','\u006e','\u0069','\u0020','\u004d','\u0061','\u0072','\u0075','\u0070','\u0061','\u006b','\u0061'].join('');
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
