export interface PIIEntity {
    type: string;
    value: string;
    start: number;
    end: number;
    score: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class PIIDetector {
    private patterns: { type: string; regex: RegExp; severity: PIIEntity['severity'] }[] = [
        {
            type: 'EMAIL',
            regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            severity: 'MEDIUM',
        },
        {
            type: 'PHONE_NUMBER',
            regex: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
            severity: 'MEDIUM',
        },
        {
            type: 'CREDIT_CARD',
            regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
            severity: 'CRITICAL',
        },
        {
            type: 'IP_ADDRESS',
            regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
            severity: 'LOW',
        },
        {
            type: 'DEVICE_ID',
            regex: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
            severity: 'MEDIUM',
        },
    ];

    detect(text: string): PIIEntity[] {
        const entities: PIIEntity[] = [];

        for (const pattern of this.patterns) {
            let match;
            while ((match = pattern.regex.exec(text)) !== null) {
                entities.push({
                    type: pattern.type,
                    value: match[0],
                    start: match.index,
                    end: match.index + match[0].length,
                    score: 1.0, // Baseline score for regex match
                    severity: pattern.severity,
                });
            }
        }

        return entities.sort((a, b) => a.start - b.start);
    }
}
