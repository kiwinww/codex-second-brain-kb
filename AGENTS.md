# AGENTS.md

本仓库是一个 Markdown 优先的个人知识库和静态站点。所有 Agent 维护它时，应优先保证内容可追溯、结构简单、改动克制。

## 行为准则

- 先说明假设；不确定时先问，不要默默猜。
- 选择能解决问题的最少代码和最少文件。
- 只改和任务直接相关的文件，不顺手重构、不美化无关内容。
- 每个任务都要有可验证的结果，例如生成站点、打开页面、确认链接可用。
- 不把私人健康、财务、客户等敏感信息写进公开站点，除非用户明确要求。

## 知识库规则

- 公网默认私密：只有 front matter 中明确写了 `public: true` 的 Markdown 文件，才允许进入 `public/data.js`。
- 新建内容一律先使用 `public: false`，确认适合公开后再改为 `true`。
- front matter 统一优先使用：`title`、`type`、`tags`、`created`、`updated`/`date`、`public`、`status`、`source`、`sources`、`owner`、可选 `summary`。
- `08_sources_raw/` 是 raw sources 层。它只记录元数据、链接、短摘要和启发，不保存整篇受版权保护的原文；除修正错别字和元数据外，不改写来源原意。
- `09_wiki/` 是 LLM 维护层。AI 可以创建和更新结构化知识页、概念页、综合页和交叉引用，但要保留来源链接。
- `AGENTS.md` 是 schema 层。它规定本知识库的目录、元数据、ingest、query、lint、公开和发布规则。
- `03_tasks/` 存放任务和下一步行动。
- `04_calendar/` 存放日程、里程碑和公开可见安排。
- `05_projects/` 存放项目说明、决策和进展。
- `06_areas/` 存放长期领域，例如健康、AI、写作、财务。公开站点默认只展示非敏感摘要。
- 日期统一使用 `YYYY-MM-DD`，当前时区按 `Asia/Hong_Kong` 理解。

## LLM Wiki 工作流

- Ingest：新增来源时，先在 `08_sources_raw/` 建来源卡，再更新相关 `09_wiki/` 页面，必要时创建新 Wiki 页；最后运行 `python tools/kb.py index`，追加 `log.md`，再运行 lint。
- Query：回答知识库问题时，先读 `index.md`，再读相关 Wiki 和来源卡；有复用价值的答案应沉淀到 `09_wiki/` 或 `10_outputs/`。
- Lint：定期运行 `python tools/kb.py lint`，检查 front matter、模板默认私密、未解决硬矛盾、Wiki 区块、内链、索引和公开泄露。
- Wiki 页面正文应包含 `## 来源`、`## 相关页面`、`## 待验证`，并优先使用 `[[页面标题]]` 形式连接相关页面。
- 如果发现硬矛盾，写入 `Contradiction severity: hard` 和 `Status: Unresolved`，停止发布，等待人工解决。
- `index.md` 是内容目录，`log.md` 是按时间追加的维护记录；每次 ingest、query 沉淀、lint 或 publish 后都要更新。

## 站点维护

- 修改 Markdown 后运行 `python tools/build_site.py` 生成 `public/data.js`。
- `site/` 是静态站点源码，`public/` 是可部署产物。
- 不要手写 `public/data.js`；它由脚本生成。
- 自动化入口：`python tools/kb.py new`、`python tools/kb.py index`、`python tools/kb.py log`、`python tools/kb.py lint`。
- 新增页面或脚本时优先使用标准库和原生浏览器能力，避免增加构建依赖。
- 移动端按 375px、768px、1024px、1440px 四个宽度检查，不允许出现非预期横向滚动。
- 发布前确认搜索、类型筛选、标签点击、任务和近期计划都能正常显示。
- 阿里云 OSS workflow 保持手动触发；缺少 Bucket、Endpoint 和密钥时不要尝试实际上传。

## 操作手册

- 日常维护、构建预览、GitHub 协作、GitHub Pages 发布、阿里云 OSS 发布和故障处理见 `10_outputs/operation-manual.md`。
