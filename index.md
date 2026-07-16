---
title: 个人第二大脑索引
type: home
tags: [second-brain, llm-wiki, index]
updated: 2026-07-16
summary: 内容导向目录，按 LLM Wiki 的来源、Wiki、项目、输出和任务等类别组织。
public: true
---

# 个人第二大脑索引

这个文件是内容导向目录。Agent 回答问题或维护 Wiki 时，先读这里，再进入相关页面。

## LLM Wiki 三层映射

- Raw sources：`08_sources_raw/`，来源卡只读，保留出处、摘要和启发。
- Wiki：`09_wiki/`，LLM 维护结构化知识、交叉引用和综合判断。
- Schema：`AGENTS.md`，规定 ingest、query、lint、公开策略和发布检查。

## 特殊文件

- [AGENTS.md](AGENTS.md) - Agent 维护 schema。
- [log.md](log.md) - 按时间记录 ingest、query、lint、publish。
- [README.md](README.md) - 项目协作和部署入口。

## 来源层

- [LLM Wiki](08_sources_raw/2026-04-04-karpathy-llm-wiki.md) - Karpathy 提出的 LLM Wiki 模式：让 LLM 在不可变来源和用户问题之间维护一个持续生长的 Markdown Wiki。（公开，2026-07-03） 来源：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f
- [如何用codex建立个人知识库 第二大脑](08_sources_raw/2026-07-02-wechat-codex-second-brain.md) - 微信文章，介绍用 Codex/Cursor 搭建 Markdown 个人知识库和第二大脑的实践。（公开，2026-07-03） 来源：https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg

## Wiki 层

- [Codex 时代的个人第二大脑](09_wiki/second-brain-llm-wiki-codex.md) - 说明 Codex 时代的个人第二大脑如何以 Markdown、LLM Wiki 和长期上下文方式落地。（公开，2026-07-03） 来源：https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg
- [LLM Wiki 工作流](09_wiki/llm-wiki-workflow.md) - 将 Karpathy 的 LLM Wiki 模式落到本仓库：来源只读、Wiki 由 LLM 维护、AGENTS 作为 schema，操作分为 ingest、query 和 lint。（公开，2026-07-03） 来源：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f
- [知识库地图](09_wiki/knowledge-base-map.md) - 说明个人第二大脑的目录职责、公开策略和日常维护流向。（公开，2026-07-03） 来源：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f

## 项目

- [公网第二大脑站点](05_projects/public-second-brain-site.md) - 公网第二大脑站点 目标 把本地 Markdown 知识库生成成一个静态站点，支持公网访问，也方便开发者通过 GitHub 调试。 当前状态 静态站点源码位于 `site/`。 部署产物位于 `public/`。 数据由 `tools/build_site.py` 从 Markdown 生成。 GitHub Pages 已用于公网访问。 公网站点只展示明确设置（公开，2026-07-03）

## 输出

- [个人第二大脑操作手册](10_outputs/operation-manual.md) - 面向使用者和开发者的知识库维护、构建、发布和故障处理手册。（公开，2026-07-16） 来源：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f
- [输出作品](10_outputs/README.md) - 输出作品目录说明，默认不发布。（私密，2026-07-03）

## 任务

- [任务清单](03_tasks/tasks.md) - 任务清单 建立 Markdown 知识库目录。 整理《如何用codex建立个人知识库 第二大脑》来源卡。 输出第二大脑方法论 Wiki。 创建静态站点仪表盘。 优化移动端首屏、搜索和筛选体验。 将公网发布规则改为默认私密。 补全知识库模板和起始索引。 生成个人第二大脑操作手册。 配置阿里云 OSS Bucket 和访问域名。 在 GitHub 仓库配置阿里云（公开，2026-07-03）

## 日程

- [近期计划](04_calendar/upcoming.md) - 近期计划（公开，2026-07-03）

## 长期领域

- [AI 个人上下文](06_areas/ai-context.md) - 说明 AI 工具读取长期个人上下文的目标和维护内容。（公开，2026-07-03）

## 想法

- [第二大脑产品想法](02_memos/second-brain-product-ideas.md) - 第二大脑仪表盘、公开私密分层和关系图等产品想法。（公开，2026-07-03）

## 人物

- [人物索引](07_people/index.md) - 人物关系和跟进事项索引，默认不发布。（私密，2026-07-03）

## 日志

- [2026-07-03 日志](01_daily/2026-07-03.md) - 启动个人第二大脑知识库项目的当天记录，默认不公开。（私密，2026-07-03）

## 说明

- [收件箱说明](00_inbox/README.md) - 临时收件箱用于接住未整理的信息，默认不发布。（私密，2026-07-03）
