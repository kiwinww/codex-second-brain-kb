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
- front matter 统一优先使用：`title`、`type`、`tags`、`updated`/`date`、`public`、`status`、`source`、可选 `summary`。
- `08_sources_raw/` 存放来源卡片，只记录元数据、链接和短摘要，不保存整篇受版权保护的原文。
- `09_wiki/` 存放 AI 整理后的结构化知识，可以跨来源综合，但要保留来源链接。
- `03_tasks/` 存放任务和下一步行动。
- `04_calendar/` 存放日程、里程碑和公开可见安排。
- `05_projects/` 存放项目说明、决策和进展。
- `06_areas/` 存放长期领域，例如健康、AI、写作、财务。公开站点默认只展示非敏感摘要。
- 日期统一使用 `YYYY-MM-DD`，当前时区按 `Asia/Hong_Kong` 理解。

## 站点维护

- 修改 Markdown 后运行 `python tools/build_site.py` 生成 `public/data.js`。
- `site/` 是静态站点源码，`public/` 是可部署产物。
- 不要手写 `public/data.js`；它由脚本生成。
- 新增页面或脚本时优先使用标准库和原生浏览器能力，避免增加构建依赖。
- 移动端按 375px、768px、1024px、1440px 四个宽度检查，不允许出现非预期横向滚动。
- 发布前确认搜索、类型筛选、标签点击、任务和近期计划都能正常显示。
- 阿里云 OSS workflow 保持手动触发；缺少 Bucket、Endpoint 和密钥时不要尝试实际上传。

## 操作手册

- 日常维护、构建预览、GitHub 协作、GitHub Pages 发布、阿里云 OSS 发布和故障处理见 `10_outputs/operation-manual.md`。
