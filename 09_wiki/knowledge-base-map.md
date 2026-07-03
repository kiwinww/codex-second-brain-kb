---
title: 知识库地图
type: wiki
tags: [knowledge-base, workflow, markdown]
updated: 2026-07-03
summary: 说明个人第二大脑的目录职责、公开策略和日常维护流向。
public: true
---

# 知识库地图

## 目录职责

- `00_inbox/`：临时收件箱，先接住未整理的信息。
- `01_daily/`：每日记录，默认私密。
- `02_memos/`：灵感、备忘和松散想法，默认私密。
- `03_tasks/`：任务清单和下一步行动。
- `04_calendar/`：日程、里程碑和公开可见安排。
- `05_projects/`：项目说明、决策和进展。
- `06_areas/`：长期领域，例如 AI、健康、写作、财务。
- `07_people/`：人物关系和跟进事项，默认私密。
- `08_sources_raw/`：来源卡片，只放出处、摘要和启发。
- `09_wiki/`：结构化知识和方法论。
- `10_outputs/`：文章、课程、方案和操作手册。
- `11_templates/`：新内容模板。

## 公开策略

公网默认私密。只有 front matter 中明确写了 `public: true` 的 Markdown 文件，才会进入 `public/data.js` 并显示在站点上。

## 维护流向

先把碎片放进 `00_inbox/`，再定期整理到来源、Wiki、任务、项目或日程。能复用的方法沉淀为 Wiki，能交付的内容沉淀为输出。

