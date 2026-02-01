import { PIIEntity } from '../pii/pii.detector';

export type PolicyAction = 'ALLOW' | 'REDACT' | 'DENY' | 'WARN';

export interface PolicyDecision {
    action: PolicyAction;
    reasons: string[];
    redactions?: any[];
    requiresApproval: boolean;
    auditId?: string;
}

export interface Policy {
    id: string;
    name: string;
    rules: {
        maxSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        denyOnPII: boolean;
        redactAllPII: boolean;
        allowedTools: string[];
        requireApprovalForTools: string[];
    };
}

export class PolicyEngine {
    evaluate(prompt: string, entities: PIIEntity[], policy: Policy): PolicyDecision {
        const reasons: string[] = [];
        let action: PolicyAction = 'ALLOW';
        let requiresApproval = false;

        // Check PII severity
        const highestSeverity = this.getHighestSeverity(entities);
        if (this.isSeverityViolated(highestSeverity, policy.rules.maxSeverity)) {
            if (policy.rules.denyOnPII) {
                return {
                    action: 'DENY',
                    reasons: [`PII severity ${highestSeverity} exceeds policy limit ${policy.rules.maxSeverity}`],
                    requiresApproval: false,
                };
            }
            action = 'WARN';
            reasons.push(`High severity PII detected: ${highestSeverity}`);
        }

        if (entities.length > 0) {
            if (policy.rules.redactAllPII) {
                action = 'REDACT';
                reasons.push(`${entities.length} PII entities found and redacted`);
            } else if (action !== 'WARN') {
                action = 'WARN';
                reasons.push(`${entities.length} PII entities found`);
            }
        }

        return {
            action,
            reasons,
            requiresApproval,
        };
    }

    private getHighestSeverity(entities: PIIEntity[]): PIIEntity['severity'] {
        const weights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        let maxWeight = 0;
        let maxSeverity: PIIEntity['severity'] = 'LOW';

        for (const entity of entities) {
            if (weights[entity.severity] > maxWeight) {
                maxWeight = weights[entity.severity];
                maxSeverity = entity.severity;
            }
        }
        return maxSeverity;
    }

    private isSeverityViolated(current: PIIEntity['severity'], limit: PIIEntity['severity']): boolean {
        const weights = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
        return weights[current] > weights[limit];
    }
}
