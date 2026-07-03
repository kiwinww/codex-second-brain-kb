---
title: LLM Wiki
type: source
source_type: gist
author: Andrej Karpathy
published: 2026-04-04
captured: 2026-07-03
url: https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f
tags: [llm-wiki, raw-sources, wiki, schema, agent-workflow]
created: 2026-07-03
owner: human
summary: Karpathy 提出的 LLM Wiki 模式：让 LLM 在不可变来源和用户问题之间维护一个持续生长的 Markdown Wiki。
public: true
---

# LLM Wiki

## 来源

- 标题：LLM Wiki
- 作者：Andrej Karpathy
- 发布时间：2026-04-04
- 链接：https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f

## 摘要

这篇 Gist 提出一种个人知识库模式：不要只在提问时临时检索原始资料，而是让 LLM 持续维护一层结构化、互相链接的 Markdown Wiki。新增来源后，LLM 读取来源、提炼要点、更新相关页面、记录矛盾与缺口，并把结果沉淀为可复用的长期知识。

## 可行动启发

- 把 `08_sources_raw/` 视为只读来源层，保留出处和摘要。
- 把 `09_wiki/` 视为 LLM 维护层，负责综合、链接、更新和待验证项。
- 把 `AGENTS.md` 视为 schema，规定 ingest、query、lint 和发布流程。
- 每次 ingest 都更新 `index.md` 和 `log.md`。
- 小规模时先用 Markdown 索引和确定性 lint，不急着引入向量搜索。

