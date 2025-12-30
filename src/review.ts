import { Octokit } from '@actions/github';
import OpenAI from 'openai';
import { generateReviewComment } from './ai';

interface ReviewOptions {
  octokit: Octokit;
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

interface FileDiff {
  filename: string;
  patch: string;
  additions: number;
  deletions: number;
  status: string;
}

export async function reviewPR(options: ReviewOptions): Promise<number> {
  const {
    octokit,
    openai,
    owner,
    repo,
    prNumber,
    model,
    temperature,
    maxTokens,
    reviewStyle,
    ignoreFiles,
    language,
  } = options;

  // Get PR details
  const { data: pr } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  // Get files changed in the PR
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
  });

  // Filter out ignored files
  const filesToReview = files.filter(file => {
    if (!ignoreFiles || ignoreFiles.length === 0) {
      return true;
    }
    return !ignoreFiles.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(file.filename);
    });
  });

  if (filesToReview.length === 0) {
    console.log('No files to review after filtering');
    return 0;
  }

  // Organize files by diff
  const fileDiffs: FileDiff[] = filesToReview.map(file => ({
    filename: file.filename,
    patch: file.patch || '',
    additions: file.additions,
    deletions: file.deletions,
    status: file.status,
  }));

  let totalComments = 0;

  // Review each file (or batch small files together)
  const batchSize = 3;
  for (let i = 0; i < fileDiffs.length; i += batchSize) {
    const batch = fileDiffs.slice(i, i + batchSize);
    
    // Skip deleted files
    const filesToAnalyze = batch.filter(f => f.status !== 'removed');
    if (filesToAnalyze.length === 0) {
      continue;
    }

    const batchDiff = filesToAnalyze
      .map(f => `File: ${f.filename}\n${f.patch}`)
      .join('\n\n---\n\n');

    // Generate review comment using AI
    const reviewText = await generateReviewComment({
      openai,
      prTitle: pr.title,
      prBody: pr.body || '',
      diff: batchDiff,
      model,
      temperature,
      maxTokens,
      reviewStyle,
      language,
    });

    if (!reviewText || reviewText.trim().length === 0) {
      console.log(`No review comments generated for batch starting at file ${i}`);
      continue;
    }

    // Create review comment on the PR
    await octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      body: reviewText,
      event: 'COMMENT',
    });

    totalComments += 1;
    console.log(`Review comment created for batch ${Math.floor(i / batchSize) + 1}`);
  }

  return totalComments;
}

