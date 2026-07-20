(function () {
  const nav = window.StudyNav;
  if (!nav) return;

  const dialog = document.getElementById("search-dialog");
  const trigger = document.getElementById("search-trigger");
  const closeButton = document.getElementById("search-close");
  const input = document.getElementById("search-input");
  const resultsBox = document.getElementById("search-results");

  const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const index = [];
  nav.categoryDefs.forEach((category, categoryIndex) => {
    nav.getNotes(categoryIndex).forEach((note) => {
      const title = nav.cleanTitle(note.title);
      const summary = note.summary || "";
      const text = nav.plain(note.content || "");
      index.push({
        sourceIndex: note.sourceIndex,
        categoryTitle: category.title,
        title,
        summary,
        text,
        titleLower: title.toLowerCase(),
        summaryLower: summary.toLowerCase(),
        textLower: text.toLowerCase(),
      });
    });
  });

  function highlight(text, tokens) {
    let result = escapeHtml(text);
    tokens.forEach((token) => {
      if (!token) return;
      const re = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
      result = result.replace(re, "<mark>$1</mark>");
    });
    return result;
  }

  function search(query) {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return { tokens, results: [] };
    const results = index
      .filter((entry) => tokens.every((t) => entry.titleLower.includes(t) || entry.summaryLower.includes(t) || entry.textLower.includes(t)))
      .map((entry) => {
        let score = 0;
        tokens.forEach((t) => {
          if (entry.titleLower.includes(t)) score += 5;
          if (entry.summaryLower.includes(t)) score += 3;
          if (entry.textLower.includes(t)) score += 1;
        });
        return { entry, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
    return { tokens, results };
  }

  function resultSnippet(entry, tokens) {
    const summaryMatch = tokens.some((token) => entry.summaryLower.includes(token));
    if (summaryMatch && entry.summary) return entry.summary;
    const positions = tokens.map((token) => entry.textLower.indexOf(token)).filter((position) => position >= 0);
    if (!positions.length) return entry.summary || entry.text.slice(0, 90);
    const start = Math.max(0, Math.min(...positions) - 34);
    const end = Math.min(entry.text.length, start + 110);
    return `${start > 0 ? "…" : ""}${entry.text.slice(start, end).trim()}${end < entry.text.length ? "…" : ""}`;
  }

  let currentResults = [];
  let activeIndex = -1;

  function updateActive() {
    resultsBox.querySelectorAll(".search-result").forEach((el, i) => el.classList.toggle("active", i === activeIndex));
    resultsBox.querySelector(".search-result.active")?.scrollIntoView({ block: "nearest" });
  }

  function renderResults(query) {
    const { tokens, results } = search(query);
    currentResults = results;
    activeIndex = results.length ? 0 : -1;

    if (!query.trim()) {
      resultsBox.innerHTML = `<p class="search-hint"><strong>${index.length}개 학습 개념</strong>에서 제목과 본문을 함께 검색해요.<span>예: JWT, N+1, useEffect, 트랜잭션</span></p>`;
      return;
    }
    if (!results.length) {
      resultsBox.innerHTML = `<p class="search-empty">일치하는 개념이 없어요.</p>`;
      return;
    }
    resultsBox.innerHTML = results
      .map(
        (r, i) => `<button class="search-result${i === 0 ? " active" : ""}" data-source="${r.entry.sourceIndex}">
          <span class="search-result-category">${escapeHtml(r.entry.categoryTitle)}</span>
          <b>${highlight(r.entry.title, tokens)}</b>
          <small>${highlight(resultSnippet(r.entry, tokens), tokens)}</small>
        </button>`
      )
      .join("");
  }

  function goTo(sourceIndex) {
    nav.goToSource(sourceIndex);
    closeSearch();
  }

  function openSearch() {
    if (dialog.open) return;
    if (document.querySelector("dialog[open]:not(#search-dialog)")) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("search-open");
    input.value = "";
    renderResults("");
    requestAnimationFrame(() => input.focus());
  }

  function closeSearch() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  trigger.addEventListener("click", openSearch);
  closeButton.addEventListener("click", closeSearch);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeSearch(); });
  dialog.addEventListener("close", () => { document.body.classList.remove("search-open"); trigger.focus(); });

  input.addEventListener("input", () => renderResults(input.value));
  resultsBox.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-source]");
    if (btn) goTo(btn.dataset.source);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!currentResults.length) return;
      activeIndex = Math.min(activeIndex + 1, currentResults.length - 1);
      updateActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!currentResults.length) return;
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && currentResults[activeIndex]) goTo(currentResults[activeIndex].entry.sourceIndex);
    }
  });

  document.addEventListener("keydown", (e) => {
    const isTyping = ["INPUT", "TEXTAREA"].includes(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "/" && !isTyping) {
      e.preventDefault();
      openSearch();
    }
  });
})();
