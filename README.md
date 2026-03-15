<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 余烬编年（Vite + React）

## 本地运行

**Prerequisites:** Node.js 18+

1. 安装依赖
   ```bash
   npm install
   ```
2. 配置环境变量
   ```bash
   cp .env.example .env.local
   ```
3. 启动开发服务器
   ```bash
   npm run dev
   ```

## Vercel 部署（GitHub 授权后）

1. 在 Vercel 导入该 GitHub 仓库。
2. 在项目 Settings → Environment Variables 配置以下变量：
   - `APP_URL`：你的线上地址（例如 `https://xxx.vercel.app`）
   - `OPENAI_OAUTH_CLIENT_ID`
   - `OPENAI_OAUTH_CLIENT_SECRET`
   - `OPENAI_TEXT_MODEL`（默认 `gpt-4.1-mini`）
   - `OPENAI_IMAGE_MODEL`（默认 `sora-1`）
   - `OPENAI_VIDEO_MODEL`（默认 `sora-1`）
3. 点击 Deploy。

项目内已包含 `vercel.json`，并配置了 SPA 路由回退到 `index.html`。

## AI 能力说明

- 文本生成：通过 `/api/generate-text` 调 OpenAI Responses API。
- 图片生成：通过 `/api/generate-image` 调 OpenAI 图像生成接口，模型默认 `sora-1`。
- 视频生成：通过 `/api/generate-video` 调 OpenAI 视频生成接口，模型默认 `sora-1`。
- 认证方式：前端通过 `/api/oauth-login` 发起 OpenAI OAuth，回调 `/api/oauth-callback`，服务端把访问令牌写入 HttpOnly Cookie。

> 注：OpenAI OAuth 的具体权限和可用模型以你的 OpenAI 账号开通情况为准。
