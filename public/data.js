window.KB_DATA = {
  "generatedAt": "2026-07-03 13:53",
  "notes": [
    {
      "title": "第二大脑产品想法",
      "type": "memo",
      "tags": [
        "ideas",
        "second-brain",
        "dashboard"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "",
      "path": "02_memos/second-brain-product-ideas.md",
      "status": "",
      "source": "",
      "summary": "第二大脑仪表盘、公开私密分层和关系图等产品想法。",
      "links": []
    },
    {
      "title": "任务清单",
      "type": "tasks",
      "tags": [
        "tasks"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "",
      "path": "03_tasks/tasks.md",
      "status": "",
      "source": "",
      "summary": "任务清单 建立 Markdown 知识库目录。 整理《如何用codex建立个人知识库 第二大脑》来源卡。 输出第二大脑方法论 Wiki。 创建静态站点仪表盘。 优化移动端首屏、搜索和筛选体验。 将公网发布规则改为默认私密。 补全知识库模板和起始索引。 生成个人第二大脑操作手册。 配置阿里云 OSS Bucket 和访问域名。 在 GitHub 仓库配置阿里云",
      "links": []
    },
    {
      "title": "近期计划",
      "type": "calendar",
      "tags": [
        "calendar"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "",
      "path": "04_calendar/upcoming.md",
      "status": "",
      "source": "",
      "summary": "近期计划",
      "links": []
    },
    {
      "title": "公网第二大脑站点",
      "type": "project",
      "tags": [
        "project",
        "static-site",
        "aliyun",
        "github"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "",
      "path": "05_projects/public-second-brain-site.md",
      "status": "active",
      "source": "",
      "summary": "公网第二大脑站点 目标 把本地 Markdown 知识库生成成一个静态站点，支持公网访问，也方便开发者通过 GitHub 调试。 当前状态 静态站点源码位于 `site/`。 部署产物位于 `public/`。 数据由 `tools/build_site.py` 从 Markdown 生成。 GitHub Pages 已用于公网访问。 公网站点只展示明确设置",
      "links": []
    },
    {
      "title": "AI 个人上下文",
      "type": "area",
      "tags": [
        "ai",
        "context",
        "second-brain"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "",
      "path": "06_areas/ai-context.md",
      "status": "",
      "source": "",
      "summary": "说明 AI 工具读取长期个人上下文的目标和维护内容。",
      "links": []
    },
    {
      "title": "LLM Wiki",
      "type": "source",
      "tags": [
        "llm-wiki",
        "raw-sources",
        "wiki",
        "schema",
        "agent-workflow"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "2026-04-04",
      "path": "08_sources_raw/2026-04-04-karpathy-llm-wiki.md",
      "status": "",
      "source": "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f",
      "summary": "Karpathy 提出的 LLM Wiki 模式：让 LLM 在不可变来源和用户问题之间维护一个持续生长的 Markdown Wiki。",
      "links": []
    },
    {
      "title": "如何用codex建立个人知识库 第二大脑",
      "type": "source",
      "tags": [
        "second-brain",
        "codex",
        "llm-wiki",
        "markdown"
      ],
      "sources": [],
      "updated": "2026-07-03",
      "date": "2026-07-02",
      "path": "08_sources_raw/2026-07-02-wechat-codex-second-brain.md",
      "status": "",
      "source": "https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg",
      "summary": "微信文章，介绍用 Codex/Cursor 搭建 Markdown 个人知识库和第二大脑的实践。",
      "links": []
    },
    {
      "title": "知识库地图",
      "type": "wiki",
      "tags": [
        "knowledge-base",
        "workflow",
        "markdown"
      ],
      "sources": [
        "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f"
      ],
      "updated": "2026-07-03",
      "date": "",
      "path": "09_wiki/knowledge-base-map.md",
      "status": "",
      "source": "",
      "summary": "说明个人第二大脑的目录职责、公开策略和日常维护流向。",
      "links": [
        "Codex 时代的个人第二大脑",
        "LLM Wiki 工作流"
      ]
    },
    {
      "title": "LLM Wiki 工作流",
      "type": "wiki",
      "tags": [
        "llm-wiki",
        "ingest",
        "query",
        "lint",
        "schema"
      ],
      "sources": [
        "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f"
      ],
      "updated": "2026-07-03",
      "date": "",
      "path": "09_wiki/llm-wiki-workflow.md",
      "status": "",
      "source": "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f",
      "summary": "将 Karpathy 的 LLM Wiki 模式落到本仓库：来源只读、Wiki 由 LLM 维护、AGENTS 作为 schema，操作分为 ingest、query 和 lint。",
      "links": [
        "Codex 时代的个人第二大脑",
        "LLM Wiki",
        "知识库地图"
      ]
    },
    {
      "title": "Codex 时代的个人第二大脑",
      "type": "wiki",
      "tags": [
        "second-brain",
        "llm-wiki",
        "codex",
        "markdown",
        "ai-context"
      ],
      "sources": [
        "https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg",
        "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f"
      ],
      "updated": "2026-07-03",
      "date": "",
      "path": "09_wiki/second-brain-llm-wiki-codex.md",
      "status": "",
      "source": "https://mp.weixin.qq.com/s/wncxlGaNEG_TS4-qufCXHg",
      "summary": "说明 Codex 时代的个人第二大脑如何以 Markdown、LLM Wiki 和长期上下文方式落地。",
      "links": [
        "LLM Wiki 工作流",
        "如何用codex建立个人知识库 第二大脑",
        "知识库地图"
      ]
    },
    {
      "title": "个人第二大脑操作手册",
      "type": "output",
      "tags": [
        "manual",
        "second-brain",
        "github",
        "aliyun"
      ],
      "sources": [
        "https://gist.github.com/Karpathy/442a6bf555914893e9891c11519de94f"
      ],
      "updated": "2026-07-03",
      "date": "",
      "path": "10_outputs/operation-manual.md",
      "status": "",
      "source": "",
      "summary": "面向使用者和开发者的知识库维护、构建、发布和故障处理手册。",
      "links": [
        "页面标题"
      ]
    }
  ],
  "tasks": [
    {
      "title": "建立 Markdown 知识库目录。",
      "meta": "已完成"
    },
    {
      "title": "整理《如何用codex建立个人知识库 第二大脑》来源卡。",
      "meta": "已完成"
    },
    {
      "title": "输出第二大脑方法论 Wiki。",
      "meta": "已完成"
    },
    {
      "title": "创建静态站点仪表盘。",
      "meta": "已完成"
    },
    {
      "title": "优化移动端首屏、搜索和筛选体验。",
      "meta": "已完成"
    },
    {
      "title": "将公网发布规则改为默认私密。",
      "meta": "已完成"
    },
    {
      "title": "补全知识库模板和起始索引。",
      "meta": "已完成"
    },
    {
      "title": "生成个人第二大脑操作手册。",
      "meta": "已完成"
    },
    {
      "title": "配置阿里云 OSS Bucket 和访问域名。",
      "meta": "待办"
    },
    {
      "title": "在 GitHub 仓库配置阿里云部署 Secrets。",
      "meta": "待办"
    },
    {
      "title": "根据真实使用情况补充项目、日程和领域笔记。",
      "meta": "待办"
    }
  ],
  "events": [
    {
      "title": "创建知识库和公网静态站点",
      "meta": "2026-07-03 · 已完成"
    },
    {
      "title": "优化移动端界面和默认私密发布规则",
      "meta": "2026-07-03 · 已完成"
    },
    {
      "title": "生成个人第二大脑操作手册",
      "meta": "2026-07-03 · 已完成"
    },
    {
      "title": "配置阿里云 OSS 静态网站托管",
      "meta": "2026-07-04 · 待办"
    },
    {
      "title": "设置阿里云部署 Secrets 并手动发布",
      "meta": "2026-07-05 · 待办"
    }
  ],
  "tags": [
    {
      "name": "second-brain",
      "count": 5
    },
    {
      "name": "llm-wiki",
      "count": 4
    },
    {
      "name": "markdown",
      "count": 3
    },
    {
      "name": "aliyun",
      "count": 2
    },
    {
      "name": "github",
      "count": 2
    },
    {
      "name": "schema",
      "count": 2
    },
    {
      "name": "codex",
      "count": 2
    },
    {
      "name": "ideas",
      "count": 1
    },
    {
      "name": "dashboard",
      "count": 1
    },
    {
      "name": "tasks",
      "count": 1
    },
    {
      "name": "calendar",
      "count": 1
    },
    {
      "name": "project",
      "count": 1
    },
    {
      "name": "static-site",
      "count": 1
    },
    {
      "name": "ai",
      "count": 1
    },
    {
      "name": "context",
      "count": 1
    },
    {
      "name": "raw-sources",
      "count": 1
    },
    {
      "name": "wiki",
      "count": 1
    },
    {
      "name": "agent-workflow",
      "count": 1
    },
    {
      "name": "knowledge-base",
      "count": 1
    },
    {
      "name": "workflow",
      "count": 1
    },
    {
      "name": "ingest",
      "count": 1
    },
    {
      "name": "query",
      "count": 1
    },
    {
      "name": "lint",
      "count": 1
    },
    {
      "name": "ai-context",
      "count": 1
    },
    {
      "name": "manual",
      "count": 1
    }
  ],
  "countsByType": {
    "area": 1,
    "calendar": 1,
    "memo": 1,
    "output": 1,
    "project": 1,
    "source": 2,
    "tasks": 1,
    "wiki": 3
  },
  "graph": {
    "nodes": [
      {
        "id": "LLM Wiki",
        "type": "source",
        "path": "08_sources_raw/2026-04-04-karpathy-llm-wiki.md"
      },
      {
        "id": "如何用codex建立个人知识库 第二大脑",
        "type": "source",
        "path": "08_sources_raw/2026-07-02-wechat-codex-second-brain.md"
      },
      {
        "id": "知识库地图",
        "type": "wiki",
        "path": "09_wiki/knowledge-base-map.md"
      },
      {
        "id": "LLM Wiki 工作流",
        "type": "wiki",
        "path": "09_wiki/llm-wiki-workflow.md"
      },
      {
        "id": "Codex 时代的个人第二大脑",
        "type": "wiki",
        "path": "09_wiki/second-brain-llm-wiki-codex.md"
      }
    ],
    "edges": [
      {
        "source": "知识库地图",
        "target": "Codex 时代的个人第二大脑"
      },
      {
        "source": "知识库地图",
        "target": "LLM Wiki 工作流"
      },
      {
        "source": "LLM Wiki 工作流",
        "target": "Codex 时代的个人第二大脑"
      },
      {
        "source": "LLM Wiki 工作流",
        "target": "LLM Wiki"
      },
      {
        "source": "LLM Wiki 工作流",
        "target": "知识库地图"
      },
      {
        "source": "Codex 时代的个人第二大脑",
        "target": "LLM Wiki 工作流"
      },
      {
        "source": "Codex 时代的个人第二大脑",
        "target": "如何用codex建立个人知识库 第二大脑"
      },
      {
        "source": "Codex 时代的个人第二大脑",
        "target": "知识库地图"
      }
    ]
  }
};
