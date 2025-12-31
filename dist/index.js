"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const openai_1 = __importDefault(require("openai"));
// OpenRouter is compatible with OpenAI SDK, just need to set baseURL
const review_1 = require("./review");
async function run() {
    try {
        // Get inputs
        const openrouterApiKey = core.getInput('openrouter_api_key', { required: true });
        const model = core.getInput('model') || 'openai/gpt-4';
        const temperature = parseFloat(core.getInput('temperature') || '0.7');
        const maxTokens = parseInt(core.getInput('max_tokens') || '2000', 10);
        const reviewStyle = core.getInput('review_style') || 'thorough';
        const ignoreFiles = core.getInput('ignore_files') || '';
        const language = core.getInput('language') || 'zh-CN';
        // Get GitHub token
        const githubToken = core.getInput('github_token') || process.env.GITHUB_TOKEN;
        if (!githubToken) {
            core.setFailed('GITHUB_TOKEN is required. Please provide github_token input or ensure GITHUB_TOKEN environment variable is set.');
            return;
        }
        // Initialize GitHub client
        const octokit = github.getOctokit(githubToken);
        // Initialize OpenRouter client (compatible with OpenAI SDK)
        const openai = new openai_1.default({
            apiKey: openrouterApiKey,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': process.env.GITHUB_SERVER_URL || 'https://github.com',
                'X-Title': 'AI Review PR',
            },
        });
        // Get context
        const context = github.context;
        const { owner, repo, number: prNumber } = context.issue;
        if (!prNumber) {
            core.setFailed('This action can only be run on pull request events');
            return;
        }
        core.info(`Reviewing PR #${prNumber} in ${owner}/${repo}`);
        // Review the PR
        const reviewComments = await (0, review_1.reviewPR)({
            octokit,
            openai,
            owner,
            repo,
            prNumber,
            model,
            temperature,
            maxTokens,
            reviewStyle,
            ignoreFiles: ignoreFiles.split(',').map((f) => f.trim()).filter((f) => f),
            language,
        });
        // Set output
        core.setOutput('review_comments', reviewComments.toString());
        core.info(`Review completed. Generated ${reviewComments} comments.`);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed('Unknown error occurred');
        }
    }
}
run();
//# sourceMappingURL=index.js.map