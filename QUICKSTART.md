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

在你的 GitHub 仓库中设置 OpenAI API Key：

1. 进入仓库：Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加 `OPENAI_API_KEY`，值为你的 OpenAI API Key

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
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

## 6. 测试

创建一个 Pull Request，GitHub Action 会自动运行并生成 AI 审查评论。

## 注意事项

- 确保在使用前运行 `pnpm run package` 打包代码
- `dist/` 目录会被提交到 Git 仓库中（这是 GitHub Action 运行所需的）
- OpenAI API 调用会产生费用，请注意使用成本
- 建议在 `.github/workflows/example.yml` 中查看完整配置示例

