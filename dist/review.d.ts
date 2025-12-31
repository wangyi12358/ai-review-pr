import { getOctokit } from '@actions/github';
import OpenAI from 'openai';
interface ReviewOptions {
    octokit: ReturnType<typeof getOctokit>;
    openai: OpenAI;
    owner: string;
    repo: string;
    prNumber: number;
    model: string;
    temperature: number;
    maxTokens: number;
    reviewStyle: string;
    ignoreFiles: string[];
    language: string;
}
export declare function reviewPR(options: ReviewOptions): Promise<number>;
export {};
//# sourceMappingURL=review.d.ts.map