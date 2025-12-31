import OpenAI from 'openai';
// OpenRouter is compatible with OpenAI SDK

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

const REVIEW_STYLES: Record<string, string> = {
  thorough: 'Thorough and comprehensive code review, checking code quality, best practices, potential bugs, and performance issues',
  concise: 'Concise and clear code review, focusing only on key issues and improvement suggestions',
  friendly: 'Friendly and constructive code review, focusing on encouragement and guidance',
  strict: 'Strict code review, focusing on code quality and standards',
};

const LANGUAGE_PROMPTS: Record<string, string> = {
  'zh-CN': 'Please use Chinese for code review and comments.',
  'en-US': 'Please conduct code review and comments in English.',
};

export async function generateReviewComment(
  options: GenerateReviewOptions
): Promise<string> {
  const {
    openai,
    prTitle,
    prBody,
    diff,
    model,
    temperature,
    maxTokens,
    reviewStyle,
    language,
  } = options;

  const stylePrompt = REVIEW_STYLES[reviewStyle] || REVIEW_STYLES.thorough;
  const languagePrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['zh-CN'];

  const systemPrompt = `You are a senior code review expert.${languagePrompt}

Your task is to review the code changes in the Pull Request, providing professional and constructive feedback.

Review style: ${stylePrompt}

Please provide the review comments in the following format:
1. Overall evaluation (briefly summarize the advantages and disadvantages of the code changes)
2. Specific suggestions (list the issues and improvement suggestions that need attention, using list format)
3. Code quality (evaluate the readability, maintainability, etc. of the code)
4. Potential problems (point out possible bugs, performance problems, or security issues)

If the code quality is good, please give positive feedback and encouragement.
If problems are found, please clearly point out the problems and provide improvement suggestions.`;

  const userPrompt = `Please review the following Pull Request:

**PR title**: ${prTitle}

**PR description**: ${prBody || '(no description)'}

**code changes**:
\`\`\`diff
${diff}
\`\`\`

Please provide detailed code review comments.`;

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const reviewText = completion.choices[0]?.message?.content || '';
    
    if (!reviewText) {
      return '';
    }

    // Format the review text
    return formatReviewComment(reviewText);
  } catch (error) {
    console.error('Error generating review comment:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate review: ${error.message}`);
    }
    throw error;
  }
}

function formatReviewComment(text: string): string {
  // Add emoji prefix for better readability
  let formatted = `## 🤖 AI Code Review\n\n${text}`;
  
  // Ensure proper formatting
  if (!formatted.endsWith('\n')) {
    formatted += '\n';
  }
  
  return formatted;
}

