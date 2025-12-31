"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReviewComment = generateReviewComment;
const REVIEW_STYLES = {
    thorough: '详细且全面的代码审查，检查代码质量、最佳实践、潜在bug和性能问题',
    concise: '简洁明了的代码审查，只关注关键问题和改进建议',
    friendly: '友好和建设性的代码审查，以鼓励和指导为主',
    strict: '严格的代码审查，重点关注代码质量和规范',
};
const LANGUAGE_PROMPTS = {
    'zh-CN': '请使用中文进行代码审查和评论。',
    'en-US': 'Please conduct code review and comments in English.',
};
async function generateReviewComment(options) {
    const { openai, prTitle, prBody, diff, model, temperature, maxTokens, reviewStyle, language, } = options;
    const stylePrompt = REVIEW_STYLES[reviewStyle] || REVIEW_STYLES.thorough;
    const languagePrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['zh-CN'];
    const systemPrompt = `你是一位资深的代码审查专家。${languagePrompt}

你的任务是审查 Pull Request 的代码变更，提供专业的、建设性的反馈。

审查风格：${stylePrompt}

请按照以下格式提供审查意见：
1. 总体评价（简洁总结代码变更的优缺点）
2. 具体建议（列出需要关注的问题和改进建议，使用列表格式）
3. 代码质量（评估代码可读性、可维护性等）
4. 潜在问题（指出可能的bug、性能问题或安全隐患）

如果代码质量很好，请给出正面的反馈和鼓励。
如果发现问题，请明确指出问题所在并提供改进建议。`;
    const userPrompt = `请审查以下 Pull Request：

**PR 标题**: ${prTitle}

**PR 描述**: ${prBody || '(无描述)'}

**代码变更**:
\`\`\`diff
${diff}
\`\`\`

请提供详细的代码审查意见。`;
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
    }
    catch (error) {
        console.error('Error generating review comment:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate review: ${error.message}`);
        }
        throw error;
    }
}
function formatReviewComment(text) {
    // Add emoji prefix for better readability
    let formatted = `## 🤖 AI Code Review\n\n${text}`;
    // Ensure proper formatting
    if (!formatted.endsWith('\n')) {
        formatted += '\n';
    }
    return formatted;
}
//# sourceMappingURL=ai.js.map