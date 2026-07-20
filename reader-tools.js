(function () {
  const reader = document.getElementById("reader");
  if (!reader) return;

  const exitButton = document.createElement("button");
  exitButton.type = "button";
  exitButton.className = "focus-exit";
  exitButton.setAttribute("aria-label", "집중 읽기 종료");
  exitButton.innerHTML = '<i aria-hidden="true">⤡</i><span>집중 모드 종료</span><kbd>F</kbd>';
  document.body.appendChild(exitButton);

  function syncFocusButton() {
    const active = document.body.classList.contains("focus-reading");
    const button = reader.querySelector("[data-focus-toggle]");
    if (!button) return;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "집중 읽기 종료" : "집중 읽기 시작");
    button.title = active ? "집중 읽기 종료 (F)" : "집중 읽기 (F)";
    button.querySelector("i").textContent = active ? "⤡" : "⤢";
  }

  function enhanceReader() {
    const actions = reader.querySelector(".note-actions");
    if (actions && !actions.querySelector("[data-focus-toggle]")) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reader-focus-button";
      button.dataset.focusToggle = "";
      button.innerHTML = '<i aria-hidden="true">⤢</i>';
      actions.prepend(button);
    }
    reader.querySelectorAll(".note-body pre").forEach((pre) => {
      if (pre.querySelector(".code-copy-button")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "code-copy-button";
      button.textContent = "복사";
      button.setAttribute("aria-label", "코드 복사");
      pre.appendChild(button);
    });
    syncFocusButton();
  }

  function toggleFocus(force) {
    const anchor = [...reader.querySelectorAll(".note-body h2,.note-body h3,.note-body p,.note-body pre")]
      .find((el) => el.getBoundingClientRect().bottom > 90);
    const before = anchor?.getBoundingClientRect().top;
    const active = typeof force === "boolean" ? force : !document.body.classList.contains("focus-reading");
    document.body.classList.toggle("focus-reading", active);
    syncFocusButton();
    if (anchor && Number.isFinite(before)) requestAnimationFrame(() => window.scrollBy(0, anchor.getBoundingClientRect().top - before));
  }

  async function copyCode(button) {
    const code = button.closest("pre")?.querySelector("code");
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = code.textContent;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = "복사됨";
    button.classList.add("copied");
    window.setTimeout(() => { button.textContent = "복사"; button.classList.remove("copied"); }, 1500);
  }

  reader.addEventListener("click", (event) => {
    const copy = event.target.closest(".code-copy-button");
    if (copy) { copyCode(copy); return; }
    if (event.target.closest("[data-focus-toggle]")) toggleFocus();
  });
  exitButton.addEventListener("click", () => toggleFocus(false));
  document.addEventListener("keydown", (event) => {
    const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) || event.target.isContentEditable;
    if (typing || event.ctrlKey || event.metaKey || event.altKey || document.querySelector("dialog[open]")) return;
    if (event.key.toLowerCase() === "f") { event.preventDefault(); toggleFocus(); }
    else if (event.key === "Escape" && document.body.classList.contains("focus-reading")) toggleFocus(false);
  });

  new MutationObserver(enhanceReader).observe(reader, { childList: true });
  enhanceReader();
})();
