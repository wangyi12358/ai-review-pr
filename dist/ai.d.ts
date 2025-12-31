import OpenAI from 'openai';
interface GenerateReviewOptions {
    openai: OpenAI;
    prTitle: string;
    prBody: string;
    diff: string;
    model: string;
    temperature: number;
    maxTokens: number;
    reviewStyle: string;
    language: string;
}
export declare function generateReviewComment(options: GenerateReviewOptions): Promise<string>;
export {};
//# sourceMappingURL=ai.d.ts.map