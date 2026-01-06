# AI Review PR

一个使用 AI 自动审查 Pull Request 的 GitHub Action。

## 功能特性

- 🤖 使用 OpenRouter AI 模型自动审查代码（支持多种模型：GPT-4、Claude、Gemini 等）
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
        uses: wangyi12358/ai-review-pr@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
```

> **提示**：`GITHUB_TOKEN` 是 GitHub Actions 自动提供的，无需手动设置。

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
        uses: wangyi12358/ai-review-pr@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
          model: openai/gpt-4
          temperature: 0.7
          max_tokens: 2000
          review_style: thorough
          ignore_files: "*.md,*.json,*.lock"
          language: zh-CN
          batch_size: 3
```

## 输入参数

| 参数 | 描述 | 必需 | 默认值 |
|------|------|------|--------|
| `github_token` | GitHub token（通常使用 GITHUB_TOKEN）<br>**注意**：GitHub Actions 会自动提供 `GITHUB_TOKEN`，无需手动设置。可以省略此参数，代码会自动从环境变量读取。 | 否 | 自动从环境变量 `GITHUB_TOKEN` 读取 |
| `openrouter_api_key` | OpenRouter API Key（从 https://openrouter.ai 获取） | 是 | - |
| `model` | 模型名称（如 openai/gpt-4, openai/gpt-3.5-turbo, anthropic/claude-3-sonnet）<br>查看 [可用模型列表](https://openrouter.ai/models) | 否 | `openai/gpt-4` |
| `temperature` | AI 模型的温度参数（0-1） | 否 | `0.7` |
| `max_tokens` | AI 响应的最大 token 数 | 否 | `2000` |
| `review_style` | 审查风格 | 否 | `thorough` |
| `ignore_files` | 要忽略的文件模式（逗号分隔） | 否 | - |
| `language` | 审查评论的语言 | 否 | `zh-CN` |
| `batch_size` | 批量处理的文件数量（每次一起审查的文件数） | 否 | `3` |

## 审查风格

- **thorough**（详细）：详细且全面的代码审查，检查代码质量、最佳实践、潜在bug和性能问题
- **concise**（简洁）：简洁明了的代码审查，只关注关键问题和改进建议
- **friendly**（友好）：友好和建设性的代码审查，以鼓励和指导为主
- **strict**（严格）：严格的代码审查，重点关注代码质量和规范

## 设置 Secrets

在你的 GitHub 仓库中，需要设置以下 Secret：

### 1. OpenRouter API Key（必需）

1. 访问 [OpenRouter](https://openrouter.ai) 并注册/登录账户
2. 在 OpenRouter 控制台生成 API Key
3. 进入 GitHub 仓库 Settings → Secrets and variables → Actions
4. 点击 "New repository secret"
5. 添加 `OPENROUTER_API_KEY`，值为你的 OpenRouter API Key

### 2. GitHub Token

**`GITHUB_TOKEN` 是 GitHub Actions 自动提供的，无需手动设置！**

#### 重要说明：

- ✅ **无需在 GitHub Secrets 中添加** - `GITHUB_TOKEN` 是系统自动提供的
- ✅ **无需手动创建** - GitHub Actions 会在每次运行时自动创建
- ✅ **自动过期** - 每次运行结束后自动失效，安全性高
- ✅ **权限自动配置** - 根据 workflow 中的 `permissions` 自动授予权限

> **只有在需要跨仓库访问或特殊权限时，才需要创建 Personal Access Token**。详情请查看 [GitHub Token 文档](./docs/GITHUB_TOKEN.md)。

### 为什么使用 OpenRouter？

OpenRouter 是一个统一的 AI 模型 API 网关，支持多种模型：
- **OpenAI**: GPT-4, GPT-3.5-turbo 等
- **Anthropic**: Claude 3 Sonnet, Claude 3 Opus 等
- **Google**: Gemini Pro 等
- 更多模型请查看 [OpenRouter 模型列表](https://openrouter.ai/models)

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

