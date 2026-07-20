(function () {
  const nav = window.StudyNav;
  if (!nav) return;

  const progressText = document.getElementById("course-progress-text");
  const progressBar = document.getElementById("course-progress-bar");
  const bookmarkCounts = [...document.querySelectorAll("[data-bookmark-count]")];
  const libraryBookmarkCount = document.getElementById("library-bookmark-count");
  const libraryDialog = document.getElementById("library-dialog");
  const libraryTriggers = [...document.querySelectorAll("[data-open-library]")];
  const libraryClose = document.getElementById("library-close");
  const libraryList = document.getElementById("library-list");
  const tabs = [...document.querySelectorAll("[data-library-tab]")];
  let activeTab = "bookmarks";

  const escapeHtml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function stateEntries(keys, state) {
    return keys.map((source) => state.entries.find((entry) => entry.sourceIndex === source)).filter(Boolean);
  }

  function renderLibrary() {
    const state = nav.getStudyState();
    const entries = stateEntries(activeTab === "bookmarks" ? state.bookmarks : state.recent, state);
    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.libraryTab === activeTab)));
    if (!entries.length) {
      libraryList.innerHTML = activeTab === "bookmarks"
        ? `<div class="library-empty"><i aria-hidden="true">◇</i><strong>아직 저장한 개념이 없어요</strong><p>학습 노트 상단의 ‘북마크’를 누르면 여기에 모아둘 수 있어요.</p></div>`
        : `<div class="library-empty"><i aria-hidden="true">↝</i><strong>최근 학습 기록이 없어요</strong><p>개념을 읽기 시작하면 최근 12개가 자동으로 기록돼요.</p></div>`;
      return;
    }
    libraryList.innerHTML = entries.map((entry, index) => `
      <button class="library-item" type="button" data-library-source="${entry.sourceIndex}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <div><small>${escapeHtml(entry.categoryTitle)}</small><strong>${escapeHtml(entry.title)}</strong>${entry.summary ? `<p>${escapeHtml(entry.summary)}</p>` : ""}</div>
        <i aria-hidden="true">→</i>
      </button>`).join("");
  }

  function renderState() {
    const state = nav.getStudyState();
    const visited = new Set(state.visited.filter((source) => state.entries.some((entry) => entry.sourceIndex === source))).size;
    const total = state.entries.length;
    const percent = total ? Math.round((visited / total) * 100) : 0;
    progressText.textContent = `${visited} / ${total}`;
    progressBar.style.width = `${percent}%`;
    bookmarkCounts.forEach((element) => { element.textContent = state.bookmarks.length; });
    libraryBookmarkCount.textContent = state.bookmarks.length;
    if (libraryDialog.open) renderLibrary();
  }

  function openLibrary() {
    renderLibrary();
    if (typeof libraryDialog.showModal === "function") libraryDialog.showModal();
    else libraryDialog.setAttribute("open", "");
    document.body.classList.add("library-open");
  }

  function closeLibrary() {
    if (typeof libraryDialog.close === "function") libraryDialog.close();
    else libraryDialog.removeAttribute("open");
  }

  libraryTriggers.forEach((trigger) => trigger.addEventListener("click", openLibrary));
  libraryClose.addEventListener("click", closeLibrary);
  libraryDialog.addEventListener("click", (event) => { if (event.target === libraryDialog) closeLibrary(); });
  libraryDialog.addEventListener("close", () => { document.body.classList.remove("library-open"); });
  tabs.forEach((tab) => tab.addEventListener("click", () => { activeTab = tab.dataset.libraryTab; renderLibrary(); }));
  libraryList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-library-source]");
    if (!item) return;
    closeLibrary();
    nav.goToSource(item.dataset.librarySource, true);
  });
  document.getElementById("random-note").addEventListener("click", () => {
    const state = nav.getStudyState();
    const candidates = state.entries.filter((entry) => entry.sourceIndex !== state.current);
    if (!candidates.length) return;
    const entry = candidates[Math.floor(Math.random() * candidates.length)];
    nav.goToSource(entry.sourceIndex, true);
  });
  window.addEventListener("study:statechange", renderState);
  renderState();
})();
