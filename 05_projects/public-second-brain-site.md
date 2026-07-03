---
title: 公网第二大脑站点
type: project
status: active
tags: [project, static-site, aliyun, github]
updated: 2026-07-03
public: true
---

# 公网第二大脑站点

## 目标

把本地 Markdown 知识库生成成一个静态站点，支持公网访问，也方便开发者通过 GitHub 调试。

## 当前状态

- 静态站点源码位于 `site/`。
- 部署产物位于 `public/`。
- 数据由 `tools/build_site.py` 从 Markdown 生成。

## 下一步

- 配置阿里云 OSS Bucket。
- 配置 GitHub Actions Secrets。
- 绑定自定义域名或 CDN。

