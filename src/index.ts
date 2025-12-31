import * as core from '@actions/core';
import * as github from '@actions/github';
import OpenAI from 'openai';
// OpenRouter is compatible with OpenAI SDK, just need to set baseURL
import { reviewPR } from './review';

async function run(): Promise<void> {
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
    const openai = new OpenAI({
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
    const reviewComments = await reviewPR({
      octokit,
      openai,
      owner,
      repo,
      prNumber,
      model,
      temperature,
      maxTokens,
      reviewStyle,
      ignoreFiles: ignoreFiles.split(',').map((f: string) => f.trim()).filter((f: string) => f),
      language,
    });

    // Set output
    core.setOutput('review_comments', reviewComments.toString());

    core.info(`Review completed. Generated ${reviewComments} comments.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Unknown error occurred');
    }
  }
}

run();

