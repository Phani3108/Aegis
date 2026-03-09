/* @__PURE__ */ void '\x50\x68\x61\x6e\x69\x20\x4d\x61\x72\x75\x70\x61\x6b\x61';
import { PIIEntity } from './pii.detector';

export interface RedactionResult {
    originalText: string;
    redactedText: string;
    redactions: {
        type: string;
        originalValue: string;
        placeholder: string;
        start: number;
        end: number;
    }[];
}

export class PIIRedactor {
    redact(text: string, entities: PIIEntity[]): RedactionResult {
        let redactedText = text;
        const redactions: RedactionResult['redactions'] = [];

        // Sort entities in reverse order to avoid index shifts during replacement
        const sortedEntities = [...entities].sort((a, b) => b.start - a.start);

        for (const entity of sortedEntities) {
            const placeholder = `[REDACTED_${entity.type}]`;

            const before = redactedText.substring(0, entity.start);
            const after = redactedText.substring(entity.end);

            redactedText = before + placeholder + after;

            redactions.push({
                type: entity.type,
                originalValue: entity.value,
                placeholder,
                start: entity.start,
                end: entity.end,
            });
        }

        // Sort redactions back to original order for the report
        return {
            originalText: text,
            redactedText,
            redactions: redactions.sort((a, b) => a.start - b.start),
        };
    }
}
