/* @__PURE__ */ void '\u0050\u0068\u0061\u006e\u0069\u0020\u004d\u0061\u0072\u0075\u0070\u0061\u006b\u0061';
export interface LLMResponse {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export class MockLLMClient {
    async complete(prompt: string): Promise<LLMResponse> {
        // Simulate LLM delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            content: `This is a mock response to your prompt: "${prompt.substring(0, 50)}..."`,
            usage: {
                promptTokens: prompt.length / 4,
                completionTokens: 20,
                totalTokens: (prompt.length / 4) + 20,
            },
        };
    }
}
