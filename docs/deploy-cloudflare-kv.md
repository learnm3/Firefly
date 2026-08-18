# 部署到 Cloudflare Pages + KV（完整迁移指南）

本指南把博客从 GitHub Pages 迁移到 Cloudflare Pages，启用 KV 打卡后端：
- 免费、国内访问快
- **任何人访问都看到最新打卡**（面试官可看进步历程）
- **只有持密钥**才能写入（访客无法污染）

---

## 一、准备工作（10 分钟）

### 1. 注册 Cloudflare 账号
访问 https://dash.cloudflare.com/sign-up 注册（免费）。如有账号直接登录。

### 2. 本地安装 wrangler CLI（用于创建 KV 和部署）
```bash
# 在博客项目目录执行
pnpm dlx wrangler login
# 会打开浏览器让你授权 Cloudflare 账号
```

---

## 二、创建 KV Namespace（一次性）

```bash
pnpm dlx wrangler kv namespace create LEETCODE_KV
```

输出类似：
```
🌀 Creating namespace with title "firefly-LEETCODE_KV"
✨ Success!
Add the following to your configuration file:
kv_namespaces = [
  { binding = "LEETCODE_KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
]
```

**把输出的 `id` 复制下来**，下一步要填进配置。

---

## 三、配置 wrangler.jsonc

编辑 `wrangler.jsonc`，把 `YOUR_KV_NAMESPACE_ID` 替换成你上一步拿到的真实 id：

```jsonc
{
	"name": "firefly",
	"compatibility_date": "2025-01-01",
	"compatibility_flags": ["nodejs_compat"],
	"main": "./worker/index.js",
	"assets": {
		"directory": "./dist"
	},
	"kv_namespaces": [
		{
			"binding": "LEETCODE_KV",
			"id": "在这里填入你的真实namespace id"
		}
	]
}
```

---

## 四、设置打卡密钥（防访客污染数据）

```bash
pnpm dlx wrangler secret put CHECKIN_KEY
# 按提示输入你的密码（例如 mysecret123，自己记住）
```

> 不设置的话，任何访问者都能打卡（公开可写）。**强烈建议设置**。

---

## 五、构建并部署

### 方式一：命令行部署（最简单）

```bash
# 1. 构建静态站点
pnpm build

# 2. 部署到 Cloudflare（自动上传静态资源 + Worker + KV binding）
pnpm dlx wrangler deploy
```

部署完成后会输出一个 `https://firefly.你的子域.workers.dev` 地址，或你的自定义域名。

## 方式二：Cloudflare Pages + GitHub 自动部署（推荐，push 即上线）

1. 打开 https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 授权 GitHub，选择你的 `learnm3/Firefly` 仓库
3. 构建设置：
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. 点击 **Save and Deploy** —— 首次部署完成
5. **配置 KV binding 和密钥**：进入 Pages 项目 → **Settings** → **Functions** → **KV namespace bindings** → 添加 `LEETCODE_KV`（选你创建的 namespace）
6. 同样在 Settings → **Environment variables** 添加 `CHECKIN_KEY`
7. 之后每次 `git push` 到 master，Cloudflare Pages 自动重新构建部署

> ⚠️ 方式二下，`wrangler.jsonc` 的 binding 配置可能被 Pages 项目的 KV 绑定设置覆盖——**两种配置二选一**，以 Pages 控制台设置为准。方式一（CLI）则完全用 wrangler.jsonc。

---

## 方式三：GitHub Actions 自动部署到 Workers（push 即上线，推荐）

项目已内置 `.github/workflows/deploy-cloudflare.yml`，配置好密钥后，每次 `git push` 到 master 自动构建并部署到 Cloudflare Workers。

### 1. 创建 Cloudflare API Token

1. 打开 https://dash.cloudflare.com/profile/api-tokens → **Create Token**
2. 选择模板 **Edit Cloudflare Workers**（或自定义）：
   - **Account** → 你的账号 → **Workers Scripts** → **Edit**
   - **Account** → 你的账号 → **Workers KV Storage** → **Edit**
   - **Zone** → `nofinallevel.space` → **Workers Routes** → **Edit**
3. 创建后**复制 token**（只显示一次）

### 2. 在 GitHub 配置 Secrets

打开 GitHub 仓库 `learnm3/Firefly` → **Settings** → **Secrets and variables** → **Actions** → 添加：

| Secret 名称 | 值 |
|---|---|
| `CF_API_TOKEN` | 上一步创建的 Cloudflare API Token |
| `CF_ACCOUNT_ID` | 你的 Cloudflare Account ID（`3d21b55e2b7a8e9c49e7a10534238b18`，可在 `wrangler whoami` 查看） |
| `CHECKIN_KEY` | 你的打卡密钥（与线上一致） |

### 3. 之后每次发布

```bash
git add .
git commit -m "feat: 更新内容"
git push origin master
```

GitHub Actions 自动执行：**构建 → 部署 → 上线**，无需手动操作（手机 GitHub App 也能提交）。

> 注意：如果本地 `wrangler.jsonc` 的 KV id 与线上不同，CI 会用仓库里的配置部署，确保 KV binding 一致。

---

## 六、验证

1. 浏览器访问 `https://你的域名/api/leetcode` → 应返回 `{"ok":true,"records":{...}}`
2. 打开博客 `/leetcode/` 页面 → 热力图正常显示
3. 点击「+1 打卡」→ 输入密钥 → 确认 → 刷新（换手机/设备）→ 数据仍在

---

## 七、切换旧域名（可选）

如果原来 GitHub Pages 有域名（如 `learnm3.github.io/Firefly`），可在 Cloudflare Pages → Custom domains 添加自定义域名，或继续用 `*.pages.dev` 免费域名。

---

## 工作原理

```
浏览器 /leetcode/ 页面
   ├── GET  /api/leetcode  （公开读，无需密钥）
   │        └── Worker → KV("records") → 返回最新打卡
   └── POST /api/leetcode  （需 X-Checkin-Key 头）
            └── Worker 校验密钥 → 合并写入 KV("records")
```

- **读取公开**：任何人（含面试官）打开博客都看到最新进度
- **写入需密钥**：只有你知道密钥，访客无法污染
- **降级策略**：云端不可用时自动回退到本地 localStorage + 配置文件

---

## 常见问题

| 问题 | 解决 |
|---|---|
| `/api/leetcode` 404 | 确认已部署（CLI `wrangler deploy` 或 Pages 连接 Git），且 `main` 指向 `./worker/index.js` |
| 打卡提示密钥错误 | 确认 `CHECKIN_KEY` 已设置且输入一致 |
| Pages 方式下 KV 不生效 | 到 Pages 控制台 Settings → Functions → KV namespace bindings 手动绑定 |
| 部署后没有云端数据 | 清浏览器缓存；确认 KV namespace id 正确 |
| 想重置打卡数据 | Cloudflare 控制台 → KV → 删除 `records` key |
| 原 GitHub Pages 还能访问吗 | 会继续存在，直到你关闭 Pages 或改域名；建议迁移后停用避免混淆 |
