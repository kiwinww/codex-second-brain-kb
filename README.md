# 个人第二大脑知识库

这是一个 Markdown 优先的个人知识库，同时带一个可公网部署的静态站点。首篇内容来自微信文章《如何用codex建立个人知识库 第二大脑》的结构化整理。

## 本地使用

```powershell
python tools/build_site.py
python -m http.server 8000 -d public
```

然后打开 `http://localhost:8000`。

Windows 下也可以双击：

- `scripts/build.ps1`：重新生成静态站点数据
- `scripts/serve.ps1`：生成并启动本地预览
- `scripts/open_site.bat`：生成并打开本地页面

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
- `10_outputs/`：输出作品
- `11_templates/`：模板
- `site/`：站点源码
- `public/`：可部署静态站点
- `tools/`：生成脚本

## 部署到阿里云

本项目输出的是纯静态文件，适合部署到阿里云 OSS 静态网站托管。

1. 在阿里云 OSS 创建 Bucket。
2. 开启静态网站托管，默认首页设为 `index.html`。
3. 配置 Bucket 读权限或 CDN 域名访问策略。
4. 在本机或 CI 中配置以下环境变量：

```powershell
$env:ALIYUN_BUCKET="your-bucket"
$env:ALIYUN_ENDPOINT="oss-cn-hangzhou.aliyuncs.com"
$env:ALIYUN_ACCESS_KEY_ID="your-access-key-id"
$env:ALIYUN_ACCESS_KEY_SECRET="your-access-key-secret"
```

5. 安装并配置阿里云 OSS 命令行工具后运行：

```powershell
python tools/build_site.py
pwsh scripts/deploy_aliyun_oss.ps1
```

## GitHub 协作

开发者拿到仓库后只需要 Python 3.10+：

```powershell
git clone <repo-url>
cd <repo>
python tools/build_site.py
python -m http.server 8000 -d public
```

如果要使用 GitHub Actions 自动部署到阿里云 OSS，需要在仓库 Secrets 中配置：

- `ALIYUN_BUCKET`
- `ALIYUN_ENDPOINT`
- `ALIYUN_ACCESS_KEY_ID`
- `ALIYUN_ACCESS_KEY_SECRET`

