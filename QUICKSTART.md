# 快速开始指南

## 1. 安装依赖

```bash
pnpm install
```

## 2. 构建项目

```bash
pnpm run build
```

## 3. 打包 Action

在发布或使用前，需要将 TypeScript 代码打包成单个 JavaScript 文件：

```bash
pnpm run package
```

这会生成 `dist/index.js` 文件，这是 GitHub Action 实际运行的入口。

## 4. 配置 GitHub Secrets

在你的 GitHub 仓库中设置 OpenRouter API Key：

1. 访问 [OpenRouter](https://openrouter.ai) 并注册/登录账户
2. 在 OpenRouter 控制台生成 API Key
3. 进入 GitHub 仓库：Settings → Secrets and variables → Actions
4. 点击 "New repository secret"
5. 添加 `OPENROUTER_API_KEY`，值为你的 OpenRouter API Key

## 5. 创建 Workflow

创建 `.github/workflows/ai-review.yml`：

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
      - name: Checkout code
        uses: actions/checkout@v4

      - name: AI Review PR
        uses: ./
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
          model: openai/gpt-4
```

## 6. 测试

创建一个 Pull Request，GitHub Action 会自动运行并生成 AI 审查评论。

## 注意事项

- 确保在使用前运行 `pnpm run package` 打包代码
- `dist/` 目录会被提交到 Git 仓库中（这是 GitHub Action 运行所需的）
- OpenRouter API 调用会产生费用，费用取决于所选模型，请注意使用成本
- 支持的模型包括：OpenAI (GPT-4, GPT-3.5), Anthropic (Claude), Google (Gemini) 等
- 查看 [OpenRouter 模型列表](https://openrouter.ai/models) 了解所有可用模型
- 建议在 `.github/workflows/example.yml` 中查看完整配置示例

