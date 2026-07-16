(function () {
  const source = window.KB_DATA || {};
  const data = {
    notes: Array.isArray(source.notes) ? source.notes : [],
    tasks: Array.isArray(source.tasks) ? source.tasks : [],
    events: Array.isArray(source.events) ? source.events : [],
    tags: Array.isArray(source.tags) ? source.tags : [],
    countsByType: source.countsByType || {},
    graph: source.graph || { nodes: [], edges: [] },
    ideas: source.ideas || { nodes: [], edges: [] },
    healthMetrics: Array.isArray(source.healthMetrics) ? source.healthMetrics : [],
    generatedAt: source.generatedAt || "",
  };

  const local = {
    notes: [],
    tasks: [],
    events: [],
    healthMetrics: [],
    deletedNotes: new Set(),
    log: [],
  };

  const typeLabels = {
    area: "领域",
    calendar: "日程",
    daily: "日志",
    health: "健康",
    memo: "想法",
    note: "笔记",
    output: "输出",
    person: "人物",
    project: "项目",
    source: "来源",
    tasks: "任务",
    wiki: "Wiki",
  };

  const els = {
    search: document.querySelector("#search"),
    typeFilters: document.querySelector("#type-filters"),
    resultCount: document.querySelector("#result-count"),
    notesCount: document.querySelector("#notes-count"),
    notesList: document.querySelector("#notes-list"),
    tasksList: document.querySelector("#tasks-list"),
    eventsList: document.querySelector("#events-list"),
    taskCount: document.querySelector("#task-count"),
    eventCount: document.querySelector("#event-count"),
    tagCount: document.querySelector("#tag-count"),
    tagsList: document.querySelector("#tags-list"),
    calendarGrid: document.querySelector("#calendar-grid"),
    calendarTitle: document.querySelector("#calendar-title"),
    calendarPrev: document.querySelector("#calendar-prev"),
    calendarNext: document.querySelector("#calendar-next"),
    addEvent: document.querySelector("#add-event"),
    downloadIcs: document.querySelector("#download-ics"),
    mindMap: document.querySelector("#mind-map"),
    ideaCount: document.querySelector("#idea-count"),
    healthMetric: document.querySelector("#health-metric"),
    healthChart: document.querySelector("#health-chart"),
    importCount: document.querySelector("#import-count"),
    importStatus: document.querySelector("#import-status"),
    fileUpload: document.querySelector("#file-upload"),
    clearImports: document.querySelector("#clear-imports"),
    editorForm: document.querySelector("#editor-form"),
    editTitle: document.querySelector("#edit-title"),
    editType: document.querySelector("#edit-type"),
    editTags: document.querySelector("#edit-tags"),
    editDate: document.querySelector("#edit-date"),
    editSummary: document.querySelector("#edit-summary"),
    editBody: document.querySelector("#edit-body"),
    editPublic: document.querySelector("#edit-public"),
    addLocal: document.querySelector("#add-local"),
    copyMarkdown: document.querySelector("#copy-markdown"),
    downloadMarkdown: document.querySelector("#download-markdown"),
    markdownPreview: document.querySelector("#markdown-preview"),
    editorPanel: document.querySelector("#editor"),
  };

  let currentType = "";
  let selectedMetric = "";
  let calendarDate = pickInitialMonth();
  let lastTemplate = "";

  document.querySelector("#generated-at").textContent = data.generatedAt ? `更新于 ${data.generatedAt}` : "";
  els.editDate.value = todayISO();
  lastTemplate = templateForType(els.editType.value, els.editTitle.value);
  els.editBody.value = lastTemplate;

  function allNotes() {
    return data.notes.concat(local.notes).filter((note) => !local.deletedNotes.has(noteKey(note)));
  }

  function allTasks() {
    return data.tasks.concat(local.tasks);
  }

  function allEvents() {
    return data.events.concat(local.events).slice().sort((a, b) => {
      return `${a.date || ""}${a.title || ""}`.localeCompare(`${b.date || ""}${b.title || ""}`);
    });
  }

  function isDone(value) {
    const text = String(value || "");
    return text.includes("完成") || text.includes("已办") || text.toLowerCase() === "done";
  }

  function pendingTasks() {
    return allTasks().filter((task) => !isDone(task.meta || task.status));
  }

  function upcomingEvents() {
    const today = todayISO();
    return allEvents().filter((event) => {
      return parseDate(event.date) && event.date >= today && !isDone(event.status || event.meta);
    });
  }

  function allHealthMetrics() {
    return data.healthMetrics.concat(local.healthMetrics).filter((item) => Number.isFinite(Number(item.value)));
  }

  function typeName(type) {
    return typeLabels[type] || type || "笔记";
  }

  function todayISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function pickInitialMonth() {
    const today = todayISO();
    const nextEvent = data.events.find((event) => parseDate(event.date) && event.date >= today);
    return nextEvent ? parseDate(nextEvent.date) : new Date();
  }

  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
      return null;
    }
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function matches(note, query, type) {
    const haystack = [
      note.title,
      note.summary,
      note.status,
      note.source,
      note.path,
      ...(note.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return (!query || haystack.includes(query)) && (!type || note.type === type);
  }

  function renderStats() {
    const notes = allNotes();
    const ideaGraph = buildIdeaGraph();
    document.querySelector("#stat-notes").textContent = notes.length;
    document.querySelector("#stat-ideas").textContent = Math.max(0, ideaGraph.nodes.length - 1);
    document.querySelector("#stat-events").textContent = upcomingEvents().length;
    const taskStat = document.querySelector("#stat-tasks");
    if (taskStat) {
      taskStat.textContent = pendingTasks().length;
    }
  }

  function countTypes() {
    return allNotes().reduce((counts, note) => {
      const key = note.type || "note";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }

  function renderTypeFilters() {
    const counts = countTypes();
    const types = Object.keys(counts).sort();
    const filters = [{ type: "", label: "全部", count: allNotes().length }].concat(
      types.map((type) => ({ type, label: typeName(type), count: counts[type] || 0 }))
    );

    els.typeFilters.innerHTML = "";
    filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.dataset.type = filter.type;
      button.setAttribute("aria-pressed", filter.type === currentType ? "true" : "false");
      button.innerHTML = `<span>${escapeHtml(filter.label)}</span><strong>${filter.count}</strong>`;
      button.addEventListener("click", () => {
        currentType = filter.type;
        renderSearchViews();
      });
      els.typeFilters.appendChild(button);
    });
  }

  function renderSearchViews() {
    renderTypeFilters();
    renderNotes();
  }

  function renderNotes() {
    const query = els.search.value.trim().toLowerCase();
    const filtered = allNotes()
      .filter((note) => matches(note, query, currentType))
      .sort((a, b) => {
        return `${b.updated || b.date || ""}${b.title || ""}`.localeCompare(
          `${a.updated || a.date || ""}${a.title || ""}`
        );
      });
    els.resultCount.textContent = `${filtered.length} 条`;
    els.notesCount.textContent = `${filtered.length} 条`;
    els.notesList.innerHTML = "";

    if (!filtered.length) {
      els.notesList.appendChild(emptyNode("没有匹配的内容。"));
      return;
    }

    filtered.forEach((note) => {
      const item = document.createElement("article");
      item.className = "note";
      const date = note.updated || note.date || "";
      const localBadge = note.local ? '<span class="chip chip-local">本地导入</span>' : "";
      const status = note.status ? `<span>${escapeHtml(note.status)}</span>` : "";
      const externalSource = note.type === "source" && /^https?:\/\//i.test(String(note.source || ""));
      const url = noteUrl(note);
      const linkText = externalSource ? "查看来源" : "查看 Markdown";
      const noteLink = url
        ? `<a class="note-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
        : "";
      item.innerHTML = `
        <div class="note-head">
          <h3>${escapeHtml(note.title)}</h3>
          <div class="note-actions">
            ${noteLink}
            <button type="button" class="delete-note" aria-label="从本次预览隐藏 ${escapeHtml(note.title)}">本次隐藏</button>
          </div>
        </div>
        <p>${escapeHtml(note.summary || "暂无摘要")}</p>
        <div class="meta">
          <span>${escapeHtml(typeName(note.type))}</span>
          ${date ? `<span>${escapeHtml(date)}</span>` : ""}
          ${status}
          ${localBadge}
          ${(note.tags || []).map((tag) => `<button type="button" class="chip tag-chip">${escapeHtml(tag)}</button>`).join("")}
        </div>
      `;
      item.querySelectorAll(".tag-chip").forEach((button) => {
        button.addEventListener("click", () => applySearch(button.textContent || ""));
      });
      item.querySelector(".delete-note").addEventListener("click", () => deleteNote(note));
      els.notesList.appendChild(item);
    });
  }

  function renderCompact(container, items, emptyText) {
    container.innerHTML = "";
    if (!items.length) {
      container.appendChild(emptyNode(emptyText));
      return;
    }

    items.slice(0, 5).forEach((entry) => {
      const item = document.createElement("div");
      item.className = "compact-item";
      const localBadge = entry.local ? " · 本地" : "";
      item.innerHTML = `<p>${escapeHtml(entry.title)}</p><span>${escapeHtml(entry.meta || entry.status || "")}${localBadge}</span>`;
      container.appendChild(item);
    });
  }

  function renderTags() {
    const counts = new Map();
    allNotes().forEach((note) => {
      (note.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
    });
    const tags = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    els.tagCount.textContent = `${tags.length} 个`;
    els.tagsList.innerHTML = "";

    if (!tags.length) {
      els.tagsList.appendChild(emptyNode("暂无标签。"));
      return;
    }

    tags.forEach(([name, count]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${name} ${count}`;
      button.addEventListener("click", () => applySearch(name));
      els.tagsList.appendChild(button);
    });
  }

  function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthText = `${year}-${String(month + 1).padStart(2, "0")}`;
    const eventsByDate = groupBy(allEvents(), "date");
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const mondayOffset = (firstDay.getDay() + 6) % 7;

    els.calendarTitle.textContent = `${year}年 ${month + 1}月`;
    els.calendarGrid.innerHTML = "";
    ["一", "二", "三", "四", "五", "六", "日"].forEach((day) => {
      const header = document.createElement("div");
      header.className = "calendar-weekday";
      header.textContent = day;
      els.calendarGrid.appendChild(header);
    });

    for (let index = 0; index < mondayOffset; index += 1) {
      const blank = document.createElement("div");
      blank.className = "calendar-cell calendar-cell-empty";
      els.calendarGrid.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${monthText}-${String(day).padStart(2, "0")}`;
      const events = eventsByDate.get(date) || [];
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = events.length ? "calendar-cell has-event" : "calendar-cell";
      if (date === todayISO()) {
        cell.classList.add("is-today");
      }
      cell.innerHTML = `<span>${day}</span>${events.slice(0, 2).map((event) => {
        const statusClass = statusSlug(event.status || "");
        return `<em class="${statusClass}">${escapeHtml(event.title)}</em>`;
      }).join("")}`;
      cell.disabled = !events.length;
      cell.addEventListener("click", () => {
        if (events.length) {
          applySearch(events[0].title || date);
        }
      });
      els.calendarGrid.appendChild(cell);
    }
  }

  function buildIdeaGraph() {
    const ideaTags = new Set(["idea", "ideas", "brainstorm", "memo", "想法", "灵感"]);
    const notes = allNotes()
      .filter((note) => note.type === "memo" || (note.tags || []).some((tag) => ideaTags.has(String(tag).toLowerCase())))
      .slice(0, 10);
    const nodes = [{ id: "center", label: "想法", kind: "center" }];
    const edges = [];
    const seen = new Set(["center"]);

    notes.forEach((note) => {
      const noteId = `note:${note.title}`;
      if (!seen.has(noteId)) {
        nodes.push({ id: noteId, label: note.title, kind: "memo", query: note.title, summary: note.summary || "" });
        seen.add(noteId);
      }
      edges.push({ source: "center", target: noteId });

      (note.tags || []).slice(0, 4).forEach((tag) => {
        const tagId = `tag:${tag}`;
        if (!seen.has(tagId)) {
          nodes.push({ id: tagId, label: tag, kind: "tag", query: tag });
          seen.add(tagId);
        }
        edges.push({ source: noteId, target: tagId });
      });

      (note.links || []).slice(0, 3).forEach((link) => {
        const linkId = `link:${link}`;
        if (!seen.has(linkId)) {
          nodes.push({ id: linkId, label: link, kind: "wiki", query: link });
          seen.add(linkId);
        }
        edges.push({ source: noteId, target: linkId });
      });
    });

    return { nodes, edges };
  }

  function renderMindMap() {
    const graph = buildIdeaGraph();
    els.ideaCount.textContent = `${Math.max(0, graph.nodes.length - 1)} 个`;
    els.mindMap.innerHTML = "";

    if (graph.nodes.length <= 1) {
      els.mindMap.appendChild(emptyNode("暂无公开想法。"));
      return;
    }

    const width = 640;
    const height = 360;
    const center = { x: width / 2, y: height / 2 };
    const positions = new Map([["center", center]]);
    const memoNodes = graph.nodes.filter((node) => node.kind === "memo");
    const outerNodes = graph.nodes.filter((node) => node.kind !== "memo" && node.kind !== "center");

    memoNodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(memoNodes.length, 1) - Math.PI / 2;
      positions.set(node.id, {
        x: center.x + Math.cos(angle) * 118,
        y: center.y + Math.sin(angle) * 92,
      });
    });

    outerNodes.forEach((node, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(outerNodes.length, 1) + Math.PI / 8;
      positions.set(node.id, {
        x: center.x + Math.cos(angle) * 238,
        y: center.y + Math.sin(angle) * 132,
      });
    });

    const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": "想法脑图" });
    graph.edges.forEach((edge) => {
      const start = positions.get(edge.source);
      const end = positions.get(edge.target);
      if (!start || !end) {
        return;
      }
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 18;
      svg.appendChild(svgEl("path", { d: `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`, class: "mind-edge" }));
    });

    graph.nodes.forEach((node) => {
      const pos = positions.get(node.id);
      const group = svgEl("g", { class: `mind-node mind-node-${node.kind}`, tabindex: "0", role: "button" });
      group.appendChild(svgEl("circle", { cx: pos.x, cy: pos.y, r: node.kind === "center" ? 34 : node.kind === "memo" ? 26 : 20 }));
      const text = svgEl("text", { x: pos.x, y: pos.y + 4, "text-anchor": "middle" });
      text.textContent = trimLabel(node.label, node.kind === "memo" ? 7 : 5);
      group.appendChild(text);
      group.addEventListener("click", () => applySearch(node.query || node.label));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          applySearch(node.query || node.label);
        }
      });
      svg.appendChild(group);
    });

    els.mindMap.appendChild(svg);
  }

  function renderHealthOptions() {
    if (!els.healthMetric) {
      return;
    }
    const metrics = Array.from(new Set(allHealthMetrics().map((item) => item.metric).filter(Boolean))).sort();
    if (!metrics.includes(selectedMetric)) {
      selectedMetric = metrics[0] || "";
    }
    els.healthMetric.innerHTML = "";
    if (!metrics.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "暂无指标";
      els.healthMetric.appendChild(option);
      return;
    }
    metrics.forEach((metric) => {
      const option = document.createElement("option");
      option.value = metric;
      option.textContent = metric;
      option.selected = metric === selectedMetric;
      els.healthMetric.appendChild(option);
    });
  }

  function renderHealthChart() {
    if (!els.healthMetric || !els.healthChart) {
      return;
    }
    renderHealthOptions();
    els.healthChart.innerHTML = "";
    const rows = allHealthMetrics()
      .filter((item) => item.metric === selectedMetric)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));

    if (!rows.length) {
      els.healthChart.appendChild(emptyNode("暂无公开或本地健康数据。"));
      return;
    }

    const width = 640;
    const height = 260;
    const pad = { left: 48, right: 24, top: 28, bottom: 44 };
    const values = rows.map((row) => Number(row.value));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const spread = max - min || 1;
    const x = (index) => pad.left + (index * (width - pad.left - pad.right)) / Math.max(rows.length - 1, 1);
    const y = (value) => pad.top + ((max - value) * (height - pad.top - pad.bottom)) / spread;
    const path = rows.map((row, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(Number(row.value))}`).join(" ");
    const unit = rows[0].unit || "";

    const svg = svgEl("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": `${selectedMetric}趋势` });
    svg.appendChild(svgEl("line", { x1: pad.left, y1: pad.top, x2: pad.left, y2: height - pad.bottom, class: "chart-axis" }));
    svg.appendChild(svgEl("line", { x1: pad.left, y1: height - pad.bottom, x2: width - pad.right, y2: height - pad.bottom, class: "chart-axis" }));
    svg.appendChild(svgEl("path", { d: path, class: "chart-line" }));

    rows.forEach((row, index) => {
      const point = svgEl("circle", { cx: x(index), cy: y(Number(row.value)), r: 4, class: row.local ? "chart-point local-point" : "chart-point" });
      point.appendChild(svgEl("title", {}));
      point.querySelector("title").textContent = `${row.date} ${row.value}${unit ? ` ${unit}` : ""}`;
      svg.appendChild(point);
    });

    const minLabel = svgEl("text", { x: 8, y: y(min) + 4, class: "chart-label" });
    minLabel.textContent = `${min}${unit}`;
    const maxLabel = svgEl("text", { x: 8, y: y(max) + 4, class: "chart-label" });
    maxLabel.textContent = `${max}${unit}`;
    const lastLabel = svgEl("text", { x: width - pad.right, y: height - 12, class: "chart-label", "text-anchor": "end" });
    lastLabel.textContent = rows[rows.length - 1].date;
    svg.append(minLabel, maxLabel, lastLabel);

    const metricCards = document.createElement("div");
    metricCards.className = "metric-cards";
    rows.slice(-4).forEach((row) => {
      const card = document.createElement("div");
      card.className = row.local ? "metric-card metric-card-local" : "metric-card";
      card.innerHTML = `
        <span>${escapeHtml(row.date)}</span>
        <strong>${escapeHtml(row.value)}${escapeHtml(row.unit || "")}</strong>
        <em>${escapeHtml(row.note || selectedMetric)}</em>
      `;
      metricCards.appendChild(card);
    });

    const list = document.createElement("div");
    list.className = "trend-list";
    rows.slice(-4).forEach((row) => {
      const item = document.createElement("span");
      item.textContent = `${row.date} · ${row.value}${row.unit || ""}${row.local ? " · 本地" : ""}`;
      list.appendChild(item);
    });

    els.healthChart.append(metricCards, svg, list);
  }

  function noteKey(note) {
    return `${note.path || "local"}::${note.title || ""}`;
  }

  function deleteNote(note) {
    const key = noteKey(note);
    if (note.local) {
      local.notes = local.notes.filter((item) => noteKey(item) !== key);
      local.tasks = local.tasks.filter((item) => item.path !== note.path);
      local.events = local.events.filter((item) => item.path !== note.path);
      local.healthMetrics = local.healthMetrics.filter((item) => item.path !== note.path);
    } else {
      local.deletedNotes.add(key);
    }
    pushLog(`已临时隐藏：${note.title}（刷新页面可恢复）`);
    renderAll();
  }

  function statusSlug(status) {
    const text = String(status || "");
    if (text.includes("完成")) {
      return "status-done";
    }
    if (text.includes("待办") || text.includes("确认")) {
      return "status-pending";
    }
    return "status-note";
  }

  function renderImportStatus() {
    const total = local.notes.length + local.tasks.length + local.events.length + local.healthMetrics.length;
    els.importCount.textContent = total ? `${total} 本地` : "";
    els.importStatus.innerHTML = "";
    if (!local.log.length) {
      els.importStatus.appendChild(emptyNode("暂无本地导入。网页操作不会直接修改仓库。"));
      return;
    }
    local.log.slice(0, 5).forEach((message) => {
      const item = document.createElement("p");
      item.textContent = message;
      els.importStatus.appendChild(item);
    });
  }

  function renderAll() {
    const tasks = pendingTasks();
    const events = upcomingEvents();
    renderStats();
    renderSearchViews();
    renderTags();
    renderCalendar();
    renderMindMap();
    renderHealthChart();
    renderCompact(els.tasksList, tasks, "当前没有待办。可以先记录一个明确的下一步。");
    renderCompact(els.eventsList, events, "接下来没有已安排的日程。");
    els.taskCount.textContent = `${tasks.length} 项`;
    els.eventCount.textContent = `${events.length} 项`;
    renderImportStatus();
    updateMarkdownPreview();
  }

  function openEditorFor(type) {
    if (els.editorPanel && "open" in els.editorPanel) {
      els.editorPanel.open = true;
    }
    els.editType.value = type;
    if (type === "calendar") {
      els.editTitle.value = "新的日程";
      els.editTags.value = "calendar";
      els.editSummary.value = "新增日程";
    } else if (type === "tasks") {
      els.editTitle.value = "新的任务";
      els.editTags.value = "tasks";
      els.editSummary.value = "需要推进的下一步";
    } else if (type === "memo") {
      els.editTitle.value = "新的想法";
      els.editTags.value = "inbox, ideas";
      els.editSummary.value = "刚刚记录的想法";
    }
    lastTemplate = templateForType(els.editType.value, els.editTitle.value || "新的知识卡片");
    els.editBody.value = lastTemplate;
    updateMarkdownPreview();
    els.editorPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => els.editTitle.focus(), 350);
  }

  function noteUrl(note) {
    if (note.type === "source" && note.source && /^https?:\/\//i.test(String(note.source))) {
      return String(note.source);
    }
    if (!note.local && note.path) {
      const path = String(note.path)
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
      return `https://github.com/kiwinww/codex-second-brain-kb/blob/main/${path}`;
    }
    if (note.source && /^https?:\/\//i.test(String(note.source))) {
      return String(note.source);
    }
    return "";
  }

  function downloadIcs() {
    const events = allEvents().filter((event) => parseDate(event.date));
    if (!events.length) {
      pushLog("暂无可同步日程");
      renderImportStatus();
      return;
    }

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Markdown KB//Second Brain//CN",
      "CALSCALE:GREGORIAN",
    ];
    events.forEach((event, index) => {
      const date = String(event.date).replace(/-/g, "");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${date}-${index}@markdown-kb.local`,
        `DTSTAMP:${icsTimestamp(new Date())}`,
        `DTSTART;VALUE=DATE:${date}`,
        `SUMMARY:${icsEscape(event.title || "日程")}`,
        `DESCRIPTION:${icsEscape(event.meta || event.status || "")}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "second-brain-calendar.ics";
    link.click();
    URL.revokeObjectURL(link.href);
    pushLog("日程同步文件已下载");
    renderImportStatus();
  }

  function icsTimestamp(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function icsEscape(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function applySearch(value) {
    els.search.value = value;
    currentType = "";
    renderSearchViews();
    document.querySelector("#notes").scrollIntoView({ behavior: "smooth", block: "start" });
    els.search.focus();
  }

  function groupBy(items, key) {
    const map = new Map();
    items.forEach((item) => {
      const value = item[key] || "";
      if (!map.has(value)) {
        map.set(value, []);
      }
      map.get(value).push(item);
    });
    return map;
  }

  function emptyNode(text) {
    const node = document.createElement("p");
    node.className = "empty";
    node.textContent = text;
    return node;
  }

  function svgEl(name, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function trimLabel(value, limit) {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function parseFrontMatter(text) {
    if (!text.startsWith("---\n")) {
      return { meta: {}, body: text };
    }
    const end = text.indexOf("\n---\n", 4);
    if (end === -1) {
      return { meta: {}, body: text };
    }
    const raw = text.slice(4, end).trim();
    const body = text.slice(end + 5).trim();
    const meta = {};
    raw.split(/\r?\n/).forEach((line) => {
      const index = line.indexOf(":");
      if (index === -1) {
        return;
      }
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        meta[key] = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean);
      } else if (/^(true|false)$/i.test(value)) {
        meta[key] = value.toLowerCase() === "true";
      } else {
        meta[key] = value.replace(/^['"]|['"]$/g, "");
      }
    });
    return { meta, body };
  }

  function firstHeading(body, fallback) {
    const match = body.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : fallback;
  }

  function summarize(body) {
    return body
      .replace(/```[\s\S]*?```/g, "")
      .replace(/^#+\s+/gm, "")
      .replace(/\|.*\|/g, "")
      .replace(/[-*]\s+\[[ xX]\]\s+/g, "")
      .replace(/[-*]\s+/g, "")
      .split(/\s+/)
      .join(" ")
      .slice(0, 160);
  }

  function extractWikilinks(body) {
    return Array.from(new Set(Array.from(body.matchAll(/\[\[([^\]]+)\]\]/g)).map((match) => match[1])));
  }

  function parseTags(value) {
    if (Array.isArray(value)) {
      return value.map(String).filter(Boolean);
    }
    return String(value || "")
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseMarkdownTable(body) {
    return body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("|") && !line.includes("---"))
      .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
  }

  function parseMarkdownFile(text, name) {
    const parsed = parseFrontMatter(text);
    const title = parsed.meta.title || firstHeading(parsed.body, name.replace(/\.[^.]+$/, ""));
    const type = parsed.meta.type || "note";
    return {
      title,
      type,
      tags: parseTags(parsed.meta.tags),
      sources: Array.isArray(parsed.meta.sources) ? parsed.meta.sources : [],
      updated: parsed.meta.updated || parsed.meta.date || todayISO(),
      date: parsed.meta.date || parsed.meta.updated || "",
      path: `local/${name}`,
      status: parsed.meta.public === true ? "本地导入 · public:true" : "本地导入",
      source: parsed.meta.source || parsed.meta.url || "",
      summary: parsed.meta.summary || summarize(parsed.body),
      links: extractWikilinks(parsed.body),
      local: true,
      body: parsed.body,
    };
  }

  function importMarkdown(text, name) {
    const note = parseMarkdownFile(text, name);
    local.notes.push(note);

    if (note.type === "calendar") {
      local.events.push(...parseEventsFromMarkdown(note.body, name));
    }
    if (note.type === "health") {
      local.healthMetrics.push(...parseHealthFromMarkdown(note.body, name));
    }
    if (note.type === "tasks") {
      local.tasks.push(...parseTasksFromMarkdown(note.body, name));
    }

    pushLog(`${name} 已导入`);
  }

  function parseEventsFromMarkdown(body, name) {
    return parseMarkdownTable(body)
      .filter((cells) => cells.length >= 3 && cells[0] !== "日期")
      .map((cells) => ({
        date: cells[0],
        title: cells[1],
        status: cells[2],
        meta: `${cells[0]} · ${cells[2]}`,
        path: `local/${name}`,
        local: true,
      }));
  }

  function parseHealthFromMarkdown(body, name) {
    return parseMarkdownTable(body)
      .filter((cells) => cells.length >= 4 && cells[0] !== "日期")
      .map((cells) => ({
        date: cells[0],
        metric: cells[1],
        value: Number(cells[2]),
        unit: cells[3],
        note: cells[4] || "",
        path: `local/${name}`,
        local: true,
      }))
      .filter((item) => Number.isFinite(item.value));
  }

  function parseTasksFromMarkdown(body, name) {
    return body
      .split(/\r?\n/)
      .map((line) => line.trim().match(/^- \[([ xX])\] (.+)$/))
      .filter(Boolean)
      .map((match) => ({
        title: match[2],
        meta: match[1].toLowerCase() === "x" ? "已完成" : "待办",
        path: `local/${name}`,
        local: true,
      }));
  }

  function importJson(text, name) {
    const clean = text.replace(/^window\.KB_DATA\s*=\s*/, "").replace(/;\s*$/, "");
    const parsed = JSON.parse(clean);
    const notes = Array.isArray(parsed.notes) ? parsed.notes : [];
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    const events = Array.isArray(parsed.events) ? parsed.events : [];
    const healthMetrics = Array.isArray(parsed.healthMetrics) ? parsed.healthMetrics : [];

    local.notes.push(...notes.map((note) => ({ ...note, local: true, status: note.status || "本地导入", path: note.path || `local/${name}` })));
    local.tasks.push(...tasks.map((task) => ({ ...task, local: true })));
    local.events.push(...events.map((event) => ({ ...event, local: true })));
    local.healthMetrics.push(...healthMetrics.map((metric) => ({ ...metric, value: Number(metric.value), local: true })));
    pushLog(`${name} 已导入`);
  }

  function importCsv(text, name) {
    const rows = parseCsv(text);
    if (!rows.length) {
      pushLog(`${name} 没有可读取的行`);
      return;
    }
    const header = rows[0].map((cell) => cell.trim().toLowerCase());
    const hasHeader = header.some((cell) => ["date", "日期", "metric", "指标"].includes(cell));
    const bodyRows = hasHeader ? rows.slice(1) : rows;
    const index = (names, fallback) => {
      const found = header.findIndex((cell) => names.includes(cell));
      return found >= 0 ? found : fallback;
    };
    const map = {
      date: index(["date", "日期"], 0),
      metric: index(["metric", "指标"], 1),
      value: index(["value", "数值"], 2),
      unit: index(["unit", "单位"], 3),
      note: index(["note", "备注"], 4),
    };

    const imported = bodyRows
      .filter((row) => row.length >= 3)
      .map((row) => ({
        date: row[map.date] || "",
        metric: row[map.metric] || "健康指标",
        value: Number(row[map.value]),
        unit: row[map.unit] || "",
        note: row[map.note] || "",
        path: `local/${name}`,
        local: true,
      }))
      .filter((row) => row.date && Number.isFinite(row.value));

    local.healthMetrics.push(...imported);
    pushLog(`${name} 已导入 ${imported.length} 个健康点`);
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell);
        cell = "";
      } else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && next === "\n") {
          index += 1;
        }
        row.push(cell);
        if (row.some((value) => value.trim())) {
          rows.push(row);
        }
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell);
    if (row.some((value) => value.trim())) {
      rows.push(row);
    }
    return rows;
  }

  function pushLog(message) {
    local.log.unshift(message);
  }

  async function handleFiles(files) {
    for (const file of files) {
      try {
        const text = await file.text();
        const name = file.name;
        const lower = name.toLowerCase();
        if (lower.endsWith(".json")) {
          importJson(text, name);
        } else if (lower.endsWith(".csv")) {
          importCsv(text, name);
        } else {
          importMarkdown(text, name);
        }
      } catch (error) {
        pushLog(`${file.name} 导入失败`);
      }
    }
    renderAll();
  }

  function yamlScalar(value) {
    const text = String(value || "").trim();
    if (!text) {
      return "";
    }
    return /[:#\[\],]/.test(text) ? `"${text.replace(/"/g, '\\"')}"` : text;
  }

  function renderTagArray(value) {
    return `[${parseTags(value).join(", ")}]`;
  }

  function templateForType(type, title) {
    if (type === "calendar") {
      return `# ${title}\n\n| 日期 | 事项 | 状态 |\n| --- | --- | --- |\n| ${todayISO()} | 待安排 | 待办 |`;
    }
    if (type === "health") {
      return `# ${title}\n\n| 日期 | 指标 | 数值 | 单位 | 备注 |\n| --- | --- | --- | --- | --- |\n| ${todayISO()} | 指标名 | 0 | 单位 | 备注 |`;
    }
    if (type === "tasks") {
      return `# ${title}\n\n- [ ] 待办事项`;
    }
    return `# ${title}\n\n## 想法\n\n- \n\n## 下一步\n\n- [ ] `;
  }

  function makeMarkdown() {
    const title = els.editTitle.value.trim() || "新的知识卡片";
    const type = els.editType.value || "memo";
    const date = els.editDate.value || todayISO();
    const summary = els.editSummary.value.trim();
    const body = els.editBody.value.trim() || templateForType(type, title);
    const normalizedBody = body.startsWith("# ") ? body : `# ${title}\n\n${body}`;
    const lines = [
      "---",
      `title: ${yamlScalar(title)}`,
      `type: ${type}`,
      `tags: ${renderTagArray(els.editTags.value)}`,
      `created: ${date}`,
      `updated: ${date}`,
      "sources: []",
      "owner: human",
      `summary: ${yamlScalar(summary)}`,
      `public: ${els.editPublic.checked ? "true" : "false"}`,
      "---",
      "",
      normalizedBody,
      "",
    ];
    return lines.join("\n");
  }

  function updateMarkdownPreview() {
    els.markdownPreview.textContent = makeMarkdown();
  }

  function downloadMarkdown() {
    const title = els.editTitle.value.trim() || "note";
    const blob = new Blob([makeMarkdown()], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${todayISO()}-${slugify(title)}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
    pushLog("Markdown 已下载");
    renderImportStatus();
  }

  async function copyMarkdown() {
    const markdown = makeMarkdown();
    try {
      await navigator.clipboard.writeText(markdown);
      pushLog("Markdown 已复制");
    } catch (error) {
      pushLog("复制失败，可直接选中预览内容");
    }
    renderImportStatus();
  }

  function slugify(value) {
    const slug = String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return slug || "note";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  els.search.addEventListener("input", renderNotes);
  els.calendarPrev.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    renderCalendar();
  });
  els.calendarNext.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    renderCalendar();
  });
  els.addEvent?.addEventListener("click", () => openEditorFor("calendar"));
  els.downloadIcs?.addEventListener("click", downloadIcs);
  els.healthMetric?.addEventListener("change", () => {
    selectedMetric = els.healthMetric.value;
    renderHealthChart();
  });
  els.fileUpload.addEventListener("change", () => {
    handleFiles(Array.from(els.fileUpload.files || []));
    els.fileUpload.value = "";
  });
  els.clearImports.addEventListener("click", () => {
    local.notes = [];
    local.tasks = [];
    local.events = [];
    local.healthMetrics = [];
    local.log = ["本地导入已清空"];
    renderAll();
  });
  els.addLocal.addEventListener("click", () => {
    importMarkdown(makeMarkdown(), `${slugify(els.editTitle.value || "note")}.md`);
    renderAll();
  });
  els.copyMarkdown.addEventListener("click", copyMarkdown);
  els.downloadMarkdown.addEventListener("click", downloadMarkdown);
  document.querySelectorAll("[data-editor-type]").forEach((button) => {
    button.addEventListener("click", () => openEditorFor(button.dataset.editorType || "memo"));
  });
  els.editorForm.addEventListener("input", updateMarkdownPreview);
  els.editType.addEventListener("change", () => {
    if (!els.editBody.value.trim() || els.editBody.value.trim() === lastTemplate.trim()) {
      lastTemplate = templateForType(els.editType.value, els.editTitle.value || "新的知识卡片");
      els.editBody.value = lastTemplate;
    }
    updateMarkdownPreview();
  });
  els.editTitle.addEventListener("input", () => {
    if (els.editBody.value.trim() === lastTemplate.trim()) {
      lastTemplate = templateForType(els.editType.value, els.editTitle.value || "新的知识卡片");
      els.editBody.value = lastTemplate;
    }
    updateMarkdownPreview();
  });

  renderAll();
})();
