---
title: 个人第二大脑操作手册
type: output
tags: [manual, second-brain, github, aliyun]
sources: [https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f]
created: 2026-07-03
updated: 2026-07-03
owner: human
summary: 面向使用者和开发者的知识库维护、构建、发布和故障处理手册。
public: true
---

# 个人第二大脑操作手册

## 1. LLM Wiki 分工

- Raw sources：`08_sources_raw/`，保存来源卡、摘要、链接和启发，默认不改写来源原意。
- Wiki：`09_wiki/`，由 LLM 维护结构化知识、交叉引用、综合判断和待验证项。
- Schema：`AGENTS.md`，约束 Agent 的 ingest、query、lint、公开和发布流程。

## 2. 日常记录

- 临时想法先放到 `00_inbox/` 或 `02_memos/`，不要一开始就过度分类。
- 每天的记录放到 `01_daily/YYYY-MM-DD.md`，默认 `public: false`。
- 明确要推进的事项同步到 `03_tasks/tasks.md`。
- 有具体日期的安排同步到 `04_calendar/upcoming.md`。

## 3. Ingest：资料归档

- 外部文章、视频、网页和书籍先建来源卡，放到 `08_sources_raw/`。
- 来源卡只保存标题、作者、时间、链接、摘要和启发，不保存整篇受版权保护的原文。
- 能沉淀成长期知识的内容，整理到 `09_wiki/`。
- 能产出文章、课程、方案或说明书的内容，放到 `10_outputs/`。
- 每次 ingest 后运行：

```powershell
python tools/kb.py index
python tools/kb.py index --check
python tools/kb.py log --kind ingest --title "来源或主题"
python tools/kb.py lint
python tools/build_site.py
```

## 4. Query：提问和沉淀

- 回答知识库问题时，先读 `index.md`，再读相关 Wiki 和来源卡。
- 如果答案有复用价值，沉淀到 `09_wiki/` 或 `10_outputs/`。
- 使用 `python tools/kb.py log --kind query --title "问题主题"` 记录重要查询。

## 5. Lint：健康检查

运行：

```powershell
python tools/kb.py lint
```

它会检查 front matter、模板默认私密、硬矛盾、Wiki 标准区块、内链、索引和公开数据泄露。

`python tools/kb.py index --check` 会检查 `index.md` 是否和当前 Markdown 内容一致，适合部署前使用。

## 6. 公开与隐私

- 默认私密：缺少 `public: true` 的文件不会进入公网数据。
- 模板默认 `public: false`，新增内容要先保持私密。
- 发布前检查健康、财务、客户、联系方式、证件、私人关系等敏感信息。
- 只有适合公开的 Wiki、项目说明、来源摘要和手册才设置 `public: true`。

## 7. 本地构建与预览

在仓库根目录运行：

```powershell
python tools/kb.py index
python tools/kb.py index --check
python tools/kb.py lint
python tools/build_site.py
python -m http.server 8000 -d public
```

然后打开：

```text
http://localhost:8000
```

Windows 也可以使用：

- `scripts/build.ps1`：生成站点数据。
- `scripts/serve.ps1`：生成并启动本地预览。
- `scripts/open_site.bat`：生成并打开本地页面。

## 8. GitHub 协作

开发者调试流程：

```powershell
git clone https://github.com/kiwinww/codex-second-brain-kb.git
cd codex-second-brain-kb
python tools/build_site.py
python -m http.server 8000 -d public
```

提交前建议检查：

```powershell
python tools/kb.py index
python tools/kb.py index --check
python tools/kb.py lint
python tools/build_site.py
git status --short
```

## 9. GitHub Pages 发布

推送到 `main` 后，GitHub Actions 会运行 `Deploy to GitHub Pages`。

公网地址：

```text
https://kiwinww.github.io/codex-second-brain-kb/
```

如果页面没有更新，先查看 GitHub Actions 最近一次运行是否成功，再确认 `public/data.js` 是否由最新 Markdown 生成。

## 10. 阿里云 OSS 发布

阿里云发布保持手动触发。需要在 GitHub 仓库 Secrets 中配置：

- `ALIYUN_BUCKET`
- `ALIYUN_ENDPOINT`
- `ALIYUN_ACCESS_KEY_ID`
- `ALIYUN_ACCESS_KEY_SECRET`

本地发布前需要安装 `ossutil`，然后设置环境变量：

```powershell
$env:ALIYUN_BUCKET="your-bucket"
$env:ALIYUN_ENDPOINT="oss-cn-hangzhou.aliyuncs.com"
$env:ALIYUN_ACCESS_KEY_ID="your-access-key-id"
$env:ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
pwsh scripts/deploy_aliyun_oss.ps1
```

没有 Bucket、Endpoint 和密钥时，不要尝试实际上传。

## 11. 故障处理

- 页面空白：确认 `public/data.js` 存在，并查看浏览器控制台。
- 搜索没有结果：确认对应 Markdown 已写 `public: true`，并重新运行 `python tools/build_site.py`。
- Wiki 关系为空：确认公开 Wiki 页面之间使用了 `[[页面标题]]` 内链，并重新构建站点。
- 中文乱码：确认文件以 UTF-8 保存，不要用非 UTF-8 编码重写 Markdown。
- 手机横向滚动：检查长链接、表格和未换行文本，必要时缩短摘要或改成列表。
- GitHub Pages 未更新：检查 Actions 是否成功，必要时手动运行 `Deploy to GitHub Pages`。
- Lint 报未解决硬矛盾：先修正文档中的矛盾说明，再重新运行 `python tools/kb.py lint`。
