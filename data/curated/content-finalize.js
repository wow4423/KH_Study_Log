(function () {
  for (const category of window.CURATED_STUDY || []) {
    for (const lesson of category.lessons || []) {
      if (!/<blockquote\b/i.test(lesson.body || "")) {
        const recap = lesson.summary || `${lesson.title}에서 다룬 정의, 동작 원리, 적용 기준과 주의점을 실제 예제 흐름과 함께 다시 설명할 수 있어야 한다.`;
        lesson.body += `<blockquote><strong>이 장의 정리:</strong> ${recap}</blockquote>`;
      } else if (!/<\/blockquote>\s*$/i.test(lesson.body)) {
        const blocks = [...lesson.body.matchAll(/<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi)];
        const last = blocks.at(-1)?.[0];
        if (last) lesson.body = lesson.body.replace(last, "") + last;
      }
    }
  }
})();
