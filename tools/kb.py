from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CONTENT_DIRS = [
    "00_inbox",
    "01_daily",
    "02_memos",
    "03_tasks",
    "04_calendar",
    "05_projects",
    "06_areas",
    "07_people",
    "08_sources_raw",
    "09_wiki",
    "10_outputs",
]

TYPE_FOLDERS = {
    "area": "06_areas",
    "calendar": "04_calendar",
    "daily": "01_daily",
    "memo": "02_memos",
    "output": "10_outputs",
    "person": "07_people",
    "project": "05_projects",
    "source": "08_sources_raw",
    "tasks": "03_tasks",
    "wiki": "09_wiki",
}

TYPE_LABELS = {
    "area": "领域",
    "calendar": "日程",
    "daily": "日志",
    "memo": "想法",
    "note": "笔记",
    "output": "输出",
    "person": "人物",
    "project": "项目",
    "source": "来源",
    "tasks": "任务",
    "wiki": "Wiki",
}

INDEX_GROUPS = [
    ("source", "来源层"),
    ("wiki", "Wiki 层"),
    ("project", "项目"),
    ("output", "输出"),
    ("tasks", "任务"),
    ("calendar", "日程"),
    ("area", "长期领域"),
    ("memo", "想法"),
    ("person", "人物"),
    ("daily", "日志"),
    ("note", "说明"),
]

LOG_KINDS = {"ingest", "query", "lint", "publish"}


def today() -> str:
    return datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d")


def parse_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        return {}, text

    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text

    raw = text[4:end].strip()
    body = text[end + 5 :].strip()
    meta: dict[str, object] = {}

    for line in raw.splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            meta[key] = [item.strip().strip("'\"") for item in value[1:-1].split(",") if item.strip()]
        elif value.lower() in {"true", "false"}:
            meta[key] = value.lower() == "true"
        else:
            meta[key] = value.strip("'\"")

    return meta, body


def render_front_matter(meta: dict[str, object]) -> str:
    lines = ["---"]
    for key, value in meta.items():
        if isinstance(value, bool):
            rendered = "true" if value else "false"
        elif isinstance(value, list):
            rendered = "[" + ", ".join(str(item) for item in value) + "]"
        else:
            rendered = str(value)
        lines.append(f"{key}: {rendered}")
    lines.append("---")
    return "\n".join(lines)


def first_heading(body: str, fallback: str) -> str:
    match = re.search(r"^#\s+(.+)$", body, flags=re.MULTILINE)
    return match.group(1).strip() if match else fallback


def summarize(body: str) -> str:
    clean = re.sub(r"```.*?```", "", body, flags=re.DOTALL)
    clean = re.sub(r"^#+\s+", "", clean, flags=re.MULTILINE)
    clean = re.sub(r"\|.*\|", "", clean)
    clean = re.sub(r"[-*]\s+\[[ xX]\]\s+", "", clean)
    clean = re.sub(r"[-*]\s+", "", clean)
    clean = " ".join(clean.split())
    return clean[:180]


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.lower()).strip("-")
    if slug:
        return slug
    return "note-" + datetime.now(timezone(timedelta(hours=8))).strftime("%Y%m%d%H%M")


def iter_markdown_files() -> list[Path]:
    files: list[Path] = []
    for folder in CONTENT_DIRS:
        base = ROOT / folder
        if base.exists():
            files.extend(path for path in sorted(base.rglob("*.md")) if path.is_file())
    return files


def read_page(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    meta, body = parse_front_matter(text)
    rel = path.relative_to(ROOT).as_posix()
    title = str(meta.get("title") or first_heading(body, path.stem))
    page_type = str(meta.get("type") or "note")
    tags = meta.get("tags", [])
    if not isinstance(tags, list):
        tags = []
    sources = meta.get("sources", [])
    if not isinstance(sources, list):
        sources = []
    return {
        "path": path,
        "rel": rel,
        "meta": meta,
        "body": body,
        "title": title,
        "type": page_type,
        "summary": str(meta.get("summary") or summarize(body)),
        "public": meta.get("public") is True,
        "updated": str(meta.get("updated") or meta.get("date") or meta.get("captured") or meta.get("published") or ""),
        "source": str(meta.get("source") or meta.get("url") or ""),
        "sources": sources,
        "tags": tags,
    }


def collect_pages() -> list[dict]:
    return [read_page(path) for path in iter_markdown_files()]


def format_page_row(page: dict) -> str:
    status = "公开" if page["public"] else "私密"
    summary = page["summary"] or "暂无摘要"
    updated = page["updated"] or "未标注日期"
    source = page["source"] or ", ".join(page["sources"])
    suffix = f" 来源：{source}" if source else ""
    return f"- [{page['title']}]({page['rel']}) - {summary}（{status}，{updated}）{suffix}"


def render_index(pages: list[dict]) -> str:
    grouped: dict[str, list[dict]] = defaultdict(list)
    for page in pages:
        grouped[page["type"]].append(page)

    lines = [
        "---",
        "title: 个人第二大脑索引",
        "type: home",
        "tags: [second-brain, llm-wiki, index]",
        f"updated: {today()}",
        "summary: 内容导向目录，按 LLM Wiki 的来源、Wiki、项目、输出和任务等类别组织。",
        "public: true",
        "---",
        "",
        "# 个人第二大脑索引",
        "",
        "这个文件是内容导向目录。Agent 回答问题或维护 Wiki 时，先读这里，再进入相关页面。",
        "",
        "## LLM Wiki 三层映射",
        "",
        "- Raw sources：`08_sources_raw/`，来源卡只读，保留出处、摘要和启发。",
        "- Wiki：`09_wiki/`，LLM 维护结构化知识、交叉引用和综合判断。",
        "- Schema：`AGENTS.md`，规定 ingest、query、lint、公开策略和发布检查。",
        "",
        "## 特殊文件",
        "",
        "- [AGENTS.md](AGENTS.md) - Agent 维护 schema。",
        "- [log.md](log.md) - 按时间记录 ingest、query、lint、publish。",
        "- [README.md](README.md) - 项目协作和部署入口。",
        "",
    ]

    for page_type, heading in INDEX_GROUPS:
        items = sorted(grouped.get(page_type, []), key=lambda item: (item["title"], item["rel"]))
        if not items:
            continue
        lines.extend([f"## {heading}", ""])
        lines.extend(format_page_row(page) for page in items)
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def cmd_index(args: argparse.Namespace) -> int:
    rendered = render_index(collect_pages())
    index_path = ROOT / "index.md"
    if args.check:
        current = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
        if current != rendered:
            print("index.md is stale. Run: python tools/kb.py index", file=sys.stderr)
            return 1
        print("index.md is up to date")
        return 0

    index_path.write_text(rendered, encoding="utf-8")
    print("Updated index.md")
    return 0


def cmd_log(args: argparse.Namespace) -> int:
    if args.kind not in LOG_KINDS:
        print(f"Invalid kind: {args.kind}", file=sys.stderr)
        return 2

    entry = f"## [{args.date or today()}] {args.kind} | {args.title}\n\n"
    if args.note:
        entry += f"- {args.note}\n\n"
    log_path = ROOT / "log.md"
    current = log_path.read_text(encoding="utf-8").rstrip()
    log_path.write_text(current + "\n\n" + entry, encoding="utf-8")
    print(f"Appended log entry: {args.kind} | {args.title}")
    return 0


def cmd_new(args: argparse.Namespace) -> int:
    folder = TYPE_FOLDERS[args.type]
    base = ROOT / folder
    base.mkdir(parents=True, exist_ok=True)
    filename = args.path or f"{today()}-{slugify(args.title)}.md"
    path = ROOT / filename if "/" in filename or "\\" in filename else base / filename
    if path.exists():
        print(f"Refusing to overwrite existing file: {path}", file=sys.stderr)
        return 1

    meta: dict[str, object] = {
        "title": args.title,
        "type": args.type,
        "tags": [],
        "created": today(),
        "updated": today(),
        "sources": [],
        "owner": args.owner,
        "summary": "",
        "public": args.public,
    }
    body = [
        f"# {args.title}",
        "",
        "## 来源",
        "",
        "## 核心内容",
        "",
        "## 相关页面",
        "",
        "## 待验证",
        "",
    ]
    path.write_text(render_front_matter(meta) + "\n\n" + "\n".join(body), encoding="utf-8")
    print(path.relative_to(ROOT).as_posix())
    return 0


def load_public_data() -> dict:
    data_path = ROOT / "public" / "data.js"
    if not data_path.exists():
        return {}
    text = data_path.read_text(encoding="utf-8")
    prefix = "window.KB_DATA = "
    if text.startswith(prefix):
        text = text[len(prefix) :]
    if text.rstrip().endswith(";"):
        text = text.rstrip()[:-1]
    return json.loads(text)


def cmd_lint(_: argparse.Namespace) -> int:
    errors: list[str] = []
    warnings: list[str] = []
    pages = collect_pages()
    by_rel = {page["rel"]: page for page in pages}
    by_title = {page["title"]: page for page in pages}

    expected_index = render_index(pages)
    current_index = (ROOT / "index.md").read_text(encoding="utf-8") if (ROOT / "index.md").exists() else ""
    if current_index != expected_index:
        errors.append("index.md is stale. Run: python tools/kb.py index")

    for page in pages:
        if not page["meta"]:
            errors.append(f"Missing front matter: {page['rel']}")
        if "title" not in page["meta"] or "type" not in page["meta"]:
            errors.append(f"Missing title/type: {page['rel']}")
        if "Contradiction severity: hard" in page["body"] and re.search(r"Status:\s*Unresolved", page["body"]):
            errors.append(f"Unresolved hard contradiction: {page['rel']}")

    for path in sorted((ROOT / "11_templates").glob("*.md")):
        meta, _ = parse_front_matter(path.read_text(encoding="utf-8"))
        if meta.get("public") is not False:
            errors.append(f"Template must default to public: false: {path.relative_to(ROOT).as_posix()}")

    index_text = (ROOT / "index.md").read_text(encoding="utf-8") if (ROOT / "index.md").exists() else ""
    for wiki_path in sorted((ROOT / "09_wiki").glob("*.md")):
        rel = wiki_path.relative_to(ROOT).as_posix()
        page = by_rel.get(rel)
        if rel not in index_text:
            errors.append(f"Wiki page missing from index.md: {rel}")
        if page:
            for heading in ["## 来源", "## 相关页面", "## 待验证"]:
                if heading not in page["body"]:
                    errors.append(f"Wiki page missing section {heading}: {rel}")

    wiki_pages = [page for page in pages if page["type"] == "wiki"]
    wiki_titles = {page["title"] for page in wiki_pages}
    inbound = Counter()
    for page in wiki_pages:
        for target in re.findall(r"\[\[([^\]]+)\]\]", page["body"]):
            if target not in by_title:
                errors.append(f"Missing wikilink target in {page['rel']}: [[{target}]]")
            if target in wiki_titles:
                inbound[target] += 1
    for title in wiki_titles:
        if len(wiki_titles) > 1 and inbound[title] == 0:
            warnings.append(f"Wiki page has no inbound wiki links: {title}")

    log_path = ROOT / "log.md"
    if log_path.exists():
        log_text = log_path.read_text(encoding="utf-8")
        for line in log_text.splitlines():
            if line.startswith("## "):
                if not re.match(r"^## \[\d{4}-\d{2}-\d{2}\] (ingest|query|lint|publish) \| .+", line):
                    errors.append(f"Invalid log heading: {line}")

    public_data = load_public_data()
    for note in public_data.get("notes", []):
        path = note.get("path")
        page = by_rel.get(path)
        if not page:
            errors.append(f"public/data.js references unknown page: {path}")
        elif not page["public"]:
            errors.append(f"Private page leaked into public/data.js: {path}")

    if warnings:
        print("Warnings:")
        for warning in warnings:
            print(f"- {warning}")

    if errors:
        print("Errors:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("KB lint passed")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Knowledge base maintenance helpers")
    subparsers = parser.add_subparsers(dest="command", required=True)

    index_parser = subparsers.add_parser("index", help="Rebuild index.md from Markdown front matter")
    index_parser.add_argument("--check", action="store_true", help="Fail if index.md is not up to date")
    index_parser.set_defaults(func=cmd_index)

    log_parser = subparsers.add_parser("log", help="Append a parseable log entry")
    log_parser.add_argument("--kind", required=True, choices=sorted(LOG_KINDS))
    log_parser.add_argument("--title", required=True)
    log_parser.add_argument("--date")
    log_parser.add_argument("--note")
    log_parser.set_defaults(func=cmd_log)

    new_parser = subparsers.add_parser("new", help="Create a new Markdown page")
    new_parser.add_argument("--type", required=True, choices=sorted(TYPE_FOLDERS))
    new_parser.add_argument("--title", required=True)
    new_parser.add_argument("--path")
    new_parser.add_argument("--owner", choices=["llm", "human"], default="llm")
    new_parser.add_argument("--public", action="store_true")
    new_parser.set_defaults(func=cmd_new)

    subparsers.add_parser("lint", help="Run deterministic KB health checks").set_defaults(func=cmd_lint)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
