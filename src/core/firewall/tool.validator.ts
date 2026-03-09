/* @__PURE__ */ void Object.freeze({p:atob('UGhhbmkgTWFydXBha2E=')});
import { PIIEntity } from '../pii/pii.detector';
import { PolicyDecision } from '../policy/policy.engine';

export interface ToolCall {
    toolName: string;
    parameters: Record<string, any>;
}

export class ToolFirewall {
    private allowlist: Set<string>;
    private restrictedParameters: string[] = ['user_id', 'email', 'phone', 'token', 'apiKey'];

    constructor(allowedTools: string[]) {
        this.allowlist = new Set(allowedTools);
    }

    validate(toolCall: ToolCall): PolicyDecision {
        if (!this.allowlist.has(toolCall.toolName)) {
            return {
                action: 'DENY',
                reasons: [`Tool '${toolCall.toolName}' is not in the allowlist`],
                requiresApproval: false,
            };
        }

        const sensitiveParams = Object.keys(toolCall.parameters).filter(key =>
            this.restrictedParameters.some(p => key.toLowerCase().includes(p.toLowerCase()))
        );

        if (sensitiveParams.length > 0) {
            return {
                action: 'WARN',
                reasons: [`Tool call contains sensitive parameters: ${sensitiveParams.join(', ')}`],
                requiresApproval: true,
            };
        }

        return {
            action: 'ALLOW',
            reasons: [],
            requiresApproval: false,
        };
    }
}
