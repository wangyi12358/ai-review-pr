# AI Review PR

一个使用 AI 自动审查 Pull Request 的 GitHub Action。

## 功能特性

- 🤖 使用 OpenAI GPT 模型自动审查代码
- 📝 提供详细的代码审查建议
- 🌍 支持多语言（中文/英文）
- 🎨 多种审查风格（详细/简洁/友好/严格）
- 🔍 支持忽略特定文件模式
- ⚡ 批量处理多个文件，提高效率

## 使用方法

### 基本用法

在你的 `.github/workflows/ai-review.yml` 文件中添加以下内容：

```yaml
name: AI Review PR

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: AI Review
        uses: ./
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

### 高级配置

```yaml
name: AI Review PR

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: AI Review
        uses: ./
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          model: gpt-4
          temperature: 0.7
          max_tokens: 2000
          review_style: thorough
          ignore_files: "*.md,*.json,*.lock"
          language: zh-CN
```

## 输入参数

| 参数 | 描述 | 必需 | 默认值 |
|------|------|------|--------|
| `github_token` | GitHub token（通常使用 GITHUB_TOKEN） | 否 | `${{ github.token }}` |
| `openai_api_key` | OpenAI API Key | 是 | - |
| `model` | OpenAI 模型（如 gpt-4, gpt-3.5-turbo） | 否 | `gpt-4` |
| `temperature` | AI 模型的温度参数（0-1） | 否 | `0.7` |
| `max_tokens` | AI 响应的最大 token 数 | 否 | `2000` |
| `review_style` | 审查风格（thorough/concis e/friendly/strict） | 否 | `thorough` |
| `ignore_files` | 要忽略的文件模式（逗号分隔） | 否 | - |
| `language` | 审查评论的语言 | 否 | `zh-CN` |

## 审查风格

- **thorough**（详细）：详细且全面的代码审查，检查代码质量、最佳实践、潜在bug和性能问题
- **concise**（简洁）：简洁明了的代码审查，只关注关键问题和改进建议
- **friendly**（友好）：友好和建设性的代码审查，以鼓励和指导为主
- **strict**（严格）：严格的代码审查，重点关注代码质量和规范

## 设置 Secrets

在你的 GitHub 仓库中，需要设置以下 Secret：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加 `OPENAI_API_KEY`，值为你的 OpenAI API Key

## 开发

### 安装依赖

```bash
pnpm install
```

### 构建项目

```bash
pnpm run build
```

### 打包 Action

```bash
pnpm run package
```

这会生成 `dist/index.js` 文件，这是 GitHub Action 实际运行的入口文件。

## 许可证

MIT

