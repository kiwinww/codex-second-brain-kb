(function () {
  const data = window.KB_DATA || { notes: [], tasks: [], events: [], tags: [], generatedAt: "" };
  const notesList = document.querySelector("#notes-list");
  const tasksList = document.querySelector("#tasks-list");
  const eventsList = document.querySelector("#events-list");
  const tagsList = document.querySelector("#tags-list");
  const searchInput = document.querySelector("#search");
  const typeFilter = document.querySelector("#type-filter");
  const resultCount = document.querySelector("#result-count");

  const uniqueTypes = [...new Set(data.notes.map((note) => note.type).filter(Boolean))].sort();
  uniqueTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });

  document.querySelector("#stat-notes").textContent = data.notes.length;
  document.querySelector("#stat-tags").textContent = data.tags.length;
  document.querySelector("#stat-tasks").textContent = data.tasks.length;
  document.querySelector("#generated-at").textContent = data.generatedAt ? `更新于 ${data.generatedAt}` : "";

  function matches(note, query, type) {
    const haystack = `${note.title} ${note.summary} ${note.tags.join(" ")} ${note.path}`.toLowerCase();
    return (!query || haystack.includes(query)) && (!type || note.type === type);
  }

  function renderNotes() {
    const query = searchInput.value.trim().toLowerCase();
    const type = typeFilter.value;
    const filtered = data.notes.filter((note) => matches(note, query, type));
    resultCount.textContent = `${filtered.length} 条`;
    notesList.innerHTML = "";

    filtered.forEach((note) => {
      const item = document.createElement("article");
      item.className = "note";
      item.innerHTML = `
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.summary || "暂无摘要")}</p>
        <div class="meta">
          <span>${escapeHtml(note.type || "note")}</span>
          <span>${escapeHtml(note.updated || note.date || "")}</span>
          ${note.tags.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
      `;
      notesList.appendChild(item);
    });
  }

  function renderCompact(container, items, emptyText) {
    container.innerHTML = "";
    if (!items.length) {
      container.textContent = emptyText;
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
  typeFilter.addEventListener("change", renderNotes);

  renderNotes();
  renderTags();
  renderCompact(tasksList, data.tasks, "暂无任务");
  renderCompact(eventsList, data.events, "暂无日程");
})();

