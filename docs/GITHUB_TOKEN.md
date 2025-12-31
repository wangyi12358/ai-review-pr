# GitHub Token 说明

## 什么是 GITHUB_TOKEN？

`GITHUB_TOKEN` 是 GitHub Actions 在每个 workflow 运行中**自动创建和提供**的认证令牌。你**不需要手动获取或配置**这个 token。

## 特点

- ✅ **自动提供**：每个 workflow run 都会自动创建
- ✅ **自动过期**：每次运行结束后自动失效，安全性高
- ✅ **自动权限**：根据 workflow 中配置的 `permissions` 自动授予相应权限
- ✅ **无需配置**：不需要在 Secrets 中手动添加

## 在 GitHub 中如何使用

### 方法一：使用自动提供的 GITHUB_TOKEN（推荐）

**步骤：**

1. 在 GitHub 仓库中，创建或编辑 workflow 文件（`.github/workflows/ai-review.yml`）

2. 在 workflow 文件中使用 `${{ secrets.GITHUB_TOKEN }}` 或 `${{ github.token }}`：

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
          github_token: ${{ secrets.GITHUB_TOKEN }}  # 直接使用，无需配置
          openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
```

3. **无需任何额外操作** - GitHub 会自动提供 token！

### 方法二：完全省略（如果 Action 支持）

如果你的 Action 支持从环境变量自动读取，可以完全省略：

```yaml
steps:
  - uses: your-action
    with:
      # github_token 可以省略，代码会自动从环境变量 GITHUB_TOKEN 读取
      openrouter_api_key: ${{ secrets.OPENROUTER_API_KEY }}
```

### 方法三：使用 Personal Access Token（高级场景）

如果你需要更多权限或跨仓库访问，可以创建 Personal Access Token：

**步骤：**

1. 登录 GitHub，点击右上角头像 → **Settings**

2. 左侧菜单 → **Developer settings**

3. 点击 **Personal access tokens** → **Tokens (classic)**

4. 点击 **Generate new token** → **Generate new token (classic)**

5. 填写信息：
   - **Note**: 输入描述（如 "GitHub Actions Token"）
   - **Expiration**: 选择过期时间
   - **Select scopes**: 勾选所需权限（通常需要 `repo` 权限）

6. 点击 **Generate token**

7. **重要**：复制生成的 token（只显示一次！）

8. 在仓库中添加到 Secrets：
   - 进入仓库 → **Settings** → **Secrets and variables** → **Actions**
   - 点击 **New repository secret**
   - **Name**: `GITHUB_TOKEN`（或自定义名称）
   - **Value**: 粘贴刚才复制的 token
   - 点击 **Add secret**

9. 在 workflow 中使用：
```yaml
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}  # 使用你创建的 secret
```

> **注意**：对于大多数场景，**方法一（使用自动提供的 GITHUB_TOKEN）就足够了**，无需创建 Personal Access Token。

## 权限配置

在 workflow 的 `permissions` 部分配置所需权限：

```yaml
jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read      # 读取仓库内容
      pull-requests: write # 写入 PR 评论
```

## 常见问题

**Q: 我需要手动创建 GITHUB_TOKEN 吗？**  
A: 不需要。GitHub Actions 会自动为每个 workflow run 创建。

**Q: 我需要在 Secrets 中添加 GITHUB_TOKEN 吗？**  
A: 不需要。这是系统自动提供的，不能手动添加。

**Q: 如何查看 GITHUB_TOKEN 的值？**  
A: 你无法直接查看 token 的值，但可以在 workflow 中使用 `${{ secrets.GITHUB_TOKEN }}` 或 `${{ github.token }}`。

**Q: GITHUB_TOKEN 的权限是什么？**  
A: 权限由 workflow 文件中的 `permissions` 部分决定。默认情况下，`GITHUB_TOKEN` 具有该仓库的读写权限。

## 相关链接

- [GitHub Actions 文档 - 自动令牌认证](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [GitHub Actions 文档 - 权限](https://docs.github.com/en/actions/using-jobs/assigning-permissions-to-jobs)
-