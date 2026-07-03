from __future__ import annotations

import json
import re
import shutil
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_DIR = ROOT / "site"
PUBLIC_DIR = ROOT / "public"

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
            items = [item.strip().strip("'\"") for item in value[1:-1].split(",") if item.strip()]
            meta[key] = items
        elif value.lower() in {"true", "false"}:
            meta[key] = value.lower() == "true"
        else:
            meta[key] = value.strip("'\"")

    return meta, body


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


def is_public(meta: dict) -> bool:
    return meta.get("public") is True


def extract_wikilinks(body: str) -> list[str]:
    return sorted(set(re.findall(r"\[\[([^\]]+)\]\]", body)))


def read_notes() -> list[dict]:
    notes = []
    for folder in CONTENT_DIRS:
        base = ROOT / folder
        if not base.exists():
            continue
        for path in sorted(base.rglob("*.md")):
            text = path.read_text(encoding="utf-8")
            meta, body = parse_front_matter(text)
            if not is_public(meta):
                continue
            rel = path.relative_to(ROOT).as_posix()
            tags = meta.get("tags", [])
            if not isinstance(tags, list):
                tags = []
            sources = meta.get("sources", [])
            if not isinstance(sources, list):
                sources = []
            notes.append(
                {
                    "title": str(meta.get("title") or first_heading(body, path.stem)),
                    "type": str(meta.get("type") or "note"),
                    "tags": tags,
                    "sources": sources,
                    "updated": str(meta.get("updated") or meta.get("captured") or meta.get("published") or ""),
                    "date": str(meta.get("date") or meta.get("published") or ""),
                    "path": rel,
                    "status": str(meta.get("status") or ""),
                    "source": str(meta.get("source") or meta.get("url") or ""),
                    "summary": str(meta.get("summary") or summarize(body)),
                    "links": extract_wikilinks(body),
                }
            )
    return notes


def build_graph(notes: list[dict]) -> dict:
    public_titles = {note["title"] for note in notes}
    edges = []
    for note in notes:
        for target in note.get("links", []):
            if target in public_titles:
                edges.append({"source": note["title"], "target": target})

    connected_titles = {edge["source"] for edge in edges} | {edge["target"] for edge in edges}
    nodes = [
        {
            "id": note["title"],
            "type": note["type"],
            "path": note["path"],
        }
        for note in notes
        if note["title"] in connected_titles
    ]
    return {"nodes": nodes, "edges": edges}


def read_tasks() -> list[dict]:
    task_file = ROOT / "03_tasks" / "tasks.md"
    if not task_file.exists():
        return []

    text = task_file.read_text(encoding="utf-8")
    meta, body = parse_front_matter(text)
    if not is_public(meta):
        return []

    tasks = []
    for line in body.splitlines():
        match = re.match(r"- \[([ xX])\] (.+)", line.strip())
        if match:
            done = match.group(1).lower() == "x"
            tasks.append({"title": match.group(2), "meta": "已完成" if done else "待办"})
    return tasks


def read_events() -> list[dict]:
    calendar_file = ROOT / "04_calendar" / "upcoming.md"
    if not calendar_file.exists():
        return []

    text = calendar_file.read_text(encoding="utf-8")
    meta, body = parse_front_matter(text)
    if not is_public(meta):
        return []

    events = []
    for line in body.splitlines():
        if not line.startswith("|") or "---" in line or "日期" in line:
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) >= 3:
            events.append({"title": cells[1], "meta": f"{cells[0]} · {cells[2]}"})
    return events


def build() -> None:
    PUBLIC_DIR.mkdir(exist_ok=True)
    for asset in ("index.html", "styles.css", "app.js"):
        shutil.copy2(SITE_DIR / asset, PUBLIC_DIR / asset)

    notes = read_notes()
    tag_counter = Counter(tag for note in notes for tag in note["tags"])
    type_counter = Counter(note["type"] for note in notes)
    data = {
        "generatedAt": datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M"),
        "notes": notes,
        "tasks": read_tasks(),
        "events": read_events(),
        "tags": [{"name": name, "count": count} for name, count in tag_counter.most_common()],
        "countsByType": dict(sorted(type_counter.items())),
        "graph": build_graph(notes),
    }

    output = "window.KB_DATA = "
    output += json.dumps(data, ensure_ascii=False, indent=2)
    output += ";\n"
    (PUBLIC_DIR / "data.js").write_text(output, encoding="utf-8")


if __name__ == "__main__":
    build()
    print(f"Built {PUBLIC_DIR}")
