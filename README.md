# 个人第二大脑知识库

这是一个 Markdown 优先的个人知识库，同时带一个可公网部署的静态站点。内容默认私密，只有明确设置 `public: true` 的 Markdown 文件才会进入公网站点。

公网地址：https://kiwinww.github.io/codex-second-brain-kb/

## LLM Wiki 架构

本仓库参考 Karpathy 的 LLM Wiki 模式，采用三层结构：

- Raw sources：`08_sources_raw/`，来源卡和摘要，尽量不可变。
- Wiki：`09_wiki/`，LLM 维护的结构化知识层。
- Schema：`AGENTS.md`，Agent 的维护规则和工作流。

## 快速开始

```powershell
python tools/kb.py index
python tools/kb.py index --check
python tools/kb.py lint
python tools/build_site.py
python -m http.server 8000 -d public
```

然后打开 `http://localhost:8000`。

Windows 下也可以使用：

- `scripts/build.ps1`：重新生成静态站点数据
- `scripts/serve.ps1`：生成并启动本地预览
- `scripts/open_site.bat`：生成并打开本地页面

## HTML 仪表盘

`site/` 和 `public/` 提供一个无前端框架的静态仪表盘：

- 搜索、类型筛选、标签筛选和公开笔记列表。
- 日历月视图，支持添加日程和导出 `.ics` 同步文件。
- 近期计划、任务短列表和可从当前视图移除的知识卡片。
- 想法脑图，来自公开 memo、标签和 Wiki 内链。
- 编辑与本地上传默认折叠，展开后可生成 Markdown，支持复制、下载和填充到当前浏览器视图。
- 本地上传支持 `.md`、`.json`、`.csv`，只在当前浏览器临时合并，不会自动写入仓库、硬盘或 GitHub。

## 操作手册

完整手册见 `10_outputs/operation-manual.md`，包含：

- 日常记录和资料归档
- LLM Wiki 的 ingest、query、lint
- 任务、日程、项目和 Wiki 维护
- 默认私密与公开发布规则
- 本地构建和移动端检查
- GitHub 协作、GitHub Pages 发布
- 阿里云 OSS 发布和故障处理

## 目录

- `00_inbox/`：临时收件箱
- `01_daily/`：每日记录
- `02_memos/`：灵感和备忘
- `03_tasks/`：任务
- `04_calendar/`：日程
- `05_projects/`：项目
- `06_areas/`：长期领域
- `07_people/`：人物和关系
- `08_sources_raw/`：来源卡片
- `09_wiki/`：结构化知识
- `10_outputs/`：输出作品和操作手册
- `11_templates/`：模板
- `site/`：站点源码
- `public/`：可部署静态站点
- `tools/`：生成脚本

## 内容公开规则

Markdown front matter 建议使用：

```yaml
---
title:
type:
tags: []
updated:
sources: []
owner: llm
summary:
public: false
---
```

缺少 `public: true` 的内容不会发布到公网。模板默认都是 `public: false`。

健康数据仍可使用 `type: health` 存放在 `06_areas/`，表格字段固定为：

```markdown
| 日期 | 指标 | 数值 | 单位 | 备注 |
| --- | --- | --- | --- | --- |
```

健康模板 `11_templates/health.md` 默认 `public: false`，只有确认脱敏后才改为 `public: true`。当前首页仪表盘不展示健康状态栏。

## GitHub 协作

开发者拿到仓库后只需要 Python 3.10+：

```powershell
git clone https://github.com/kiwinww/codex-second-brain-kb.git
cd codex-second-brain-kb
python tools/build_site.py
python -m http.server 8000 -d public
```

推送到 `main` 后，GitHub Pages 会自动发布。

常用维护命令：

```powershell
python tools/kb.py new --type wiki --title "新主题"
python tools/kb.py index
python tools/kb.py index --check
python tools/kb.py log --kind ingest --title "新来源"
python tools/kb.py lint
```

GitHub Pages 和阿里云 OSS workflow 会在部署前运行索引检查、构建、知识库 lint 和 Python 语法检查。

## 部署到阿里云

本项目输出的是纯静态文件，适合部署到阿里云 OSS 静态网站托管。阿里云部署保持手动触发。

需要在 GitHub Secrets 中配置：

- `ALIYUN_BUCKET`
- `ALIYUN_ENDPOINT`
- `ALIYUN_ACCESS_KEY_ID`
- `ALIYUN_ACCESS_KEY_SECRET`

本地发布前需要安装阿里云 OSS 命令行工具，然后运行：

```powershell
python tools/build_site.py
pwsh scripts/deploy_aliyun_oss.ps1
```

没有 Bucket、Endpoint 和密钥时不要执行实际上传。
