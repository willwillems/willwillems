/**
 * AI usage labels (https://ai-label.org), set per note with the `ai`
 * frontmatter field: `no`, `assisted` or `made`.
 */
export const AI_LABELS = ['no', 'assisted', 'made'] as const;

export type AiLabel = (typeof AI_LABELS)[number];

export function isAiLabel(value: unknown): value is AiLabel {
	return AI_LABELS.includes(value as AiLabel);
}
