(function () {
  const data = window.KB_DATA || {
    notes: [],
    tasks: [],
    events: [],
    tags: [],
    countsByType: {},
    generatedAt: "",
  };

  const typeLabels = {
    area: "领域",
    calendar: "日程",
    daily: "日志",
    memo: "想法",
    note: "笔记",
    output: "输出",
    person: "人物",
    project: "项目",
    source: "来源",
    tasks: "任务",
    wiki: "Wiki",
  };

  const notesList = document.querySelector("#notes-list");
  const tasksList = document.querySelector("#tasks-list");
  const eventsList = document.querySelector("#events-list");
  const tagsList = document.querySelector("#tags-list");
  const typeFilters = document.querySelector("#type-filters");
  const searchInput = document.querySelector("#search");
  const resultCount = document.querySelector("#result-count");
  const notesCount = document.querySelector("#notes-count");
  const taskCount = document.querySelector("#task-count");
  const eventCount = document.querySelector("#event-count");
  let currentType = "";

  document.querySelector("#stat-notes").textContent = data.notes.length;
  document.querySelector("#stat-tags").textContent = data.tags.length;
  document.querySelector("#stat-tasks").textContent = data.tasks.length;
  document.querySelector("#generated-at").textContent = data.generatedAt ? `更新于 ${data.generatedAt}` : "";
  taskCount.textContent = `${data.tasks.length} 条`;
  eventCount.textContent = `${data.events.length} 条`;

  function typeName(type) {
    return typeLabels[type] || type || "笔记";
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

  function renderTypeFilters() {
    const types = [...new Set(data.notes.map((note) => note.type).filter(Boolean))].sort();
    const filters = [{ type: "", label: "全部", count: data.notes.length }].concat(
      types.map((type) => ({ type, label: typeName(type), count: data.countsByType?.[type] || 0 }))
    );

    typeFilters.innerHTML = "";
    filters.forEach((filter) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.dataset.type = filter.type;
      button.setAttribute("aria-pressed", filter.type === currentType ? "true" : "false");
      button.innerHTML = `<span>${escapeHtml(filter.label)}</span><strong>${filter.count}</strong>`;
      button.addEventListener("click", () => {
        currentType = filter.type;
        renderTypeFilters();
        renderNotes();
      });
      typeFilters.appendChild(button);
    });
  }

  function renderNotes() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = data.notes.filter((note) => matches(note, query, currentType));
    resultCount.textContent = `${filtered.length} 条`;
    notesCount.textContent = `${filtered.length} 条`;
    notesList.innerHTML = "";

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "没有匹配的公开笔记。";
      notesList.appendChild(empty);
      return;
    }

    filtered.forEach((note) => {
      const item = document.createElement("article");
      item.className = "note";
      const date = note.updated || note.date || "";
      const status = note.status ? `<span>${escapeHtml(note.status)}</span>` : "";
      item.innerHTML = `
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.summary || "暂无摘要")}</p>
        <div class="meta">
          <span>${escapeHtml(typeName(note.type))}</span>
          ${date ? `<span>${escapeHtml(date)}</span>` : ""}
          ${status}
          ${(note.tags || []).map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
      `;
      notesList.appendChild(item);
    });
  }

  function renderCompact(container, items, emptyText) {
    container.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = emptyText;
      container.appendChild(empty);
      return;
    }

    items.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "compact-item";
      item.innerHTML = `<p>${escapeHtml(entry.title)}</p><span>${escapeHtml(entry.meta || "")}</span>`;
      container.appendChild(item);
    });
  }

  function renderTags() {
    tagsList.innerHTML = "";
    data.tags.forEach((tag) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${tag.name} ${tag.count}`;
      button.addEventListener("click", () => {
        searchInput.value = tag.name;
        renderNotes();
        searchInput.focus();
      });
      tagsList.appendChild(button);
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  searchInput.addEventListener("input", renderNotes);

  renderTypeFilters();
  renderNotes();
  renderTags();
  renderCompact(tasksList, data.tasks, "暂无任务");
  renderCompact(eventsList, data.events, "暂无日程");
})();
