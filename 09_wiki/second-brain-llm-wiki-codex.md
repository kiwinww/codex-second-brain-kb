---
title: Codex 时代的个人第二大脑
type: wiki
tags: [second-brain, llm-wiki, codex, markdown, ai-context]
source: https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg
updated: 2026-07-03
public: true
---

# Codex 时代的个人第二大脑

## 核心观点

个人第二大脑的价值不只是保存资料，而是把分散输入整理成 AI 能长期读取、继续加工和用于输出的个人上下文。

## 方法框架

- 捕捉：把灵感、资料、任务、日程先收进知识库。
- 组织：按来源、Wiki、任务、项目、领域分层。
- 提炼：把来源转成短摘要、概念、行动清单和关联笔记。
- 表达：用这些内容生成文章、课程、产品方案、视频脚本或项目决策。

## LLM Wiki 分层

- 原始来源：只读，保留出处和摘要。
- Wiki：AI 整理后的长期知识层。
- Schema：告诉 Agent 如何维护知识库的规则，例如 `AGENTS.md`。

## 为什么用 Markdown

- 文件开放，容易迁移。
- Codex、Cursor、Claude Code 等工具都能读取。
- GitHub 便于版本管理和开发协作。
- 静态站点可以部署到 GitHub Pages、阿里云 OSS 或任意静态托管服务。

## 本项目采用的落地方式

- Markdown 文件夹作为知识库主体。
- Python 标准库生成公开站点数据。
- 原生 HTML/CSS/JS 构建仪表盘。
- 阿里云 OSS 负责公网访问，GitHub 负责协作和自动部署。

