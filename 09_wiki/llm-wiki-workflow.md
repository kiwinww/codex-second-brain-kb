---
title: LLM Wiki 工作流
type: wiki
tags: [llm-wiki, ingest, query, lint, schema]
source: https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f
sources: [https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f]
created: 2026-07-03
updated: 2026-07-03
owner: llm
summary: 将 Karpathy 的 LLM Wiki 模式落到本仓库：来源只读、Wiki 由 LLM 维护、AGENTS 作为 schema，操作分为 ingest、query 和 lint。
public: true
---

# LLM Wiki 工作流

## 来源

- 来源卡：[[LLM Wiki]]
- 原始链接：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f

## 核心观点

LLM Wiki 的重点不是多存资料，而是把来源编译成持续生长的知识层。用户负责选择来源、提出问题和判断方向；LLM 负责提炼、交叉引用、更新页面和维护日志。

## 三层架构

- Raw sources：本仓库对应 `08_sources_raw/`，只保存来源卡、摘要、链接和启发，避免随意改写来源原意。
- Wiki：本仓库对应 `09_wiki/`，由 LLM 维护结构化页面、概念页、综合页和关系。
- Schema：本仓库对应 `AGENTS.md`，规定 Agent 该如何 ingest、query、lint、构建和发布。

## 操作循环

- Ingest：新增来源后，先建来源卡，再更新相关 Wiki 页面、`index.md` 和 `log.md`。
- Query：回答问题时先读 `index.md`，再读相关 Wiki 和来源卡；有价值的答案可沉淀为 Wiki 或 output。
- Lint：周期性检查未解决矛盾、孤立 Wiki、缺失内链、公开泄露和日志格式。

## 索引和日志

`index.md` 是内容目录，帮助 Agent 快速定位页面。`log.md` 是时间线，使用 `## [YYYY-MM-DD] ingest|query|lint|publish | 标题` 格式，便于脚本和人类读取。

## 自动化边界

首版只使用确定性脚本：`python tools/kb.py index` 重建索引，`python tools/kb.py lint` 检查健康状态，`python tools/kb.py log` 追加日志。向量搜索、Obsidian 插件和 MCP 可以以后再引入。

## 相关页面

- [[知识库地图]]
- [[Codex 时代的个人第二大脑]]

## 待验证

- 随着来源增多，是否需要为 `09_wiki/` 增加二级目录或主题 MOC。
- 是否需要引入本地 Markdown 搜索工具来替代纯 `index.md`。

