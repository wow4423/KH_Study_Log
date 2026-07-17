const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const rows = JSON.parse(fs.readFileSync(path.join(root, "data/content.json"), "utf8")).rows;
const imageOutput = path.join(root, "assets/notion-detail");
fs.mkdirSync(imageOutput, { recursive: true });

const curriculum = {
  java: [11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 31],
  sql: [33, 34, 35, 36, 37, 38, 39],
  jdbc: [40, 41, 42, 43, 44],
  javascript: [45, 47, 48, 49, 50, 51, 53, 54, 55],
  "servlet-jsp": [57, 58, 60, 61],
  mybatis: [62, 63, 64],
  "spring-mvc": [66, 67, 68, 69, 70, 71, 72, 88, 91, 92],
  "spring-core": [73, 74, 75],
  react: [79, 80, 81, 82, 83, 84, 93, 94, 95, 98, 113],
  jpa: [96, 97, 104, 111],
  security: [105, 106, 107]
};

const titles = {
  11: "Java 개발 환경·변수·자료형",
  12: "연산자·조건문과 실행 분기",
  15: "반복문을 읽고 설계하는 순서",
  16: "반복문 실습과 배열 입문",
  17: "배열·다차원 배열·Class",
  18: "메서드·접근제한자·캡슐화",
  19: "static·생성자와 객체 초기화",
  22: "상속과 오버라이딩",
  23: "다형성·추상화·인터페이스",
  24: "Collection과 도서관리 구조",
  25: "Generic·Java API·프로세스·예외",
  26: "예외 처리와 Stream API",
  29: "Thread 생성과 실행 원리",
  31: "Thread 동기화와 Network 기초",
  33: "Oracle 시작·계정·SELECT·WHERE",
  34: "NULL·함수·ORDER BY 실습",
  35: "GROUP BY와 JOIN 완전 해부",
  36: "서브쿼리와 DDL 설계",
  37: "DDL·DML·VIEW와 권한",
  38: "SEQUENCE와 PL/SQL 입문",
  39: "PROCEDURE·FUNCTION·TRIGGER",
  40: "JDBC 연결·PreparedStatement·CRUD",
  41: "JDBC 도서·회원·게시판 실습",
  42: "VO·DAO 분리와 JDBCTemplate",
  43: "Controller·Service·DAO 분리",
  44: "JDBC 계층 구조 종합 실습",
  45: "JavaScript와 웹 요청의 출발점",
  47: "변수·연산자·배열·함수",
  48: "함수·배열 메서드·객체",
  49: "DOM·BOM과 동적 카드 만들기",
  50: "이벤트·정규표현식·폼 검증",
  51: "브라우저 페이지 제작과 호스팅",
  53: "JSON과 localStorage",
  54: "localStorage CRUD와 메뉴 인터랙션",
  55: "CRUD 페이지 분리와 데이터 전달",
  57: "Web Server·WAS·Servlet 기초",
  58: "JSP·EL·JSTL과 MVC 역할",
  60: "SSR 요청 흐름과 PRG 패턴",
  61: "WAS 기반 웹 애플리케이션 종합",
  62: "MyBatis 설치·설정·Mapper 연결",
  63: "MyBatis 회원가입·로그인 실습",
  64: "MyBatis 동적 SQL",
  66: "Spring 시작·JSTL·MVC 전체 구조",
  67: "Model·VO·Controller 역할",
  68: "AJAX·Promise·fetch 연결",
  69: "fetch와 JSON 요청·응답 실습",
  70: "REST API와 fetch CRUD",
  71: "Multipart 파일 업로드",
  72: "프로필 이미지 업로드·미리보기",
  88: "Spring Boot 프로젝트 초기 설정",
  91: "목록 페이징 구현",
  92: "ControllerAdvice·Interceptor",
  73: "Logging·BCrypt·IoC·DI·Bean",
  74: "Filter·Scheduler·Transactional",
  75: "AOP와 공통 관심사",
  79: "React 프로젝트 설치와 시작 구조",
  80: "React Router·state·Layout",
  81: "컴포넌트·styled-components",
  82: "JSX·props·state·목록 렌더링",
  83: "useEffect·axios·서버 동기화",
  84: "Context·Reducer·Redux Toolkit",
  93: "React 입문과 컴포넌트 사고",
  94: "Hook·불변성·렌더링 흐름",
  95: "React 실전 기능 연결",
  98: "React·Spring 도서관리 통합 실습",
  113: "Vite Proxy와 개발 CORS",
  96: "useRef와 JPA Entity 입문",
  97: "JPA CRUD와 Repository",
  104: "JPA 연관관계와 조회",
  111: "Entity·DTO·Service 경계",
  105: "JWT 인증과 Security 구성 요소",
  106: "로그인·토큰 발급·검증 전체 흐름",
  107: "JWT 권한 처리와 인증 테스트"
};

const banned = /(과제|제출|발표|스피치|면접|세미\s*프로젝트|파이널\s*프로젝트|트렐로|파일\s*목록|학원\s*홈페이지|주말에\s*할|숙제)/i;
const tagText = (html) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

function matchingDetailsRanges(html) {
  const stack = [];
  const ranges = [];
  const tags = [...html.matchAll(/<\/?details\b[^>]*>/gi)];
  for (const match of tags) {
    if (!match[0].startsWith("</")) {
      stack.push({ start: match.index });
      continue;
    }
    const open = stack.pop();
    if (!open) continue;
    const end = match.index + match[0].length;
    const chunk = html.slice(open.start, end);
    const summary = chunk.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i);
    if (summary && banned.test(tagText(summary[1]))) ranges.push([open.start, end]);
  }
  return ranges.filter(([start, end], index, all) => !all.some(([a, b], other) => other !== index && a <= start && b >= end));
}

function removeRanges(html, ranges) {
  return ranges.sort((a, b) => b[0] - a[0]).reduce((result, [start, end]) => result.slice(0, start) + result.slice(end), html);
}

function removeBannedSections(html) {
  return html.replace(/<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (whole, level, inner) => banned.test(tagText(inner)) ? "" : whole);
}

function normalizeHeading(inner) {
  return tagText(inner)
    .replace(/^[\s\d]+[.)️⃣]*\s*/, "")
    .replace(/^[^가-힣A-Za-z0-9@]+\s*/u, "")
    .replace(/[⭐🔥✅❌📌🔹🔸✔💥🚨🎯🧠📘📎]+/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function balanceHtml(html) {
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  const optionalClose = new Set(["li", "p", "dt", "dd", "tr", "th", "td"]);
  const stack = [];
  let output = "";
  for (const token of html.split(/(<[^>]+>)/g)) {
    if (!token.startsWith("<") || /^<!--|^<!DOCTYPE/i.test(token)) {
      output += token;
      continue;
    }
    const match = token.match(/^<\/?\s*([a-z][\w-]*)/i);
    if (!match) {
      output += token;
      continue;
    }
    const tag = match[1].toLowerCase();
    if (token.startsWith("</")) {
      const found = stack.lastIndexOf(tag);
      if (found < 0) continue;
      while (stack.length - 1 > found) output += `</${stack.pop()}>`;
      stack.pop();
      output += token;
      continue;
    }
    if (optionalClose.has(tag) && stack.at(-1) === tag) output += `</${stack.pop()}>`;
    output += token;
    if (!voidTags.has(tag) && !token.endsWith("/>")) stack.push(tag);
  }
  while (stack.length) output += `</${stack.pop()}>`;
  return output;
}

function copyImages(raw, title) {
  return raw.replace(/<img\b[^>]*src="([^"]+)"[^>]*>/gi, (whole, src) => {
    if (!src.startsWith("data/images/")) return "";
    const name = path.basename(src);
    const source = path.join(root, src);
    if (!fs.existsSync(source)) return "";
    fs.copyFileSync(source, path.join(imageOutput, name));
    return `<img src="assets/notion-detail/${name}" alt="${title} 실습 화면" loading="lazy">`;
  });
}

function polish(raw, title) {
  let html = raw || "";
  html = copyImages(html, title);
  html = removeRanges(html, matchingDetailsRanges(html));
  html = removeBannedSections(html);
  html = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<div\b[^>]*class="[^"]*file-block[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<(?:video|audio|iframe)\b[^>]*>/gi, "")
    .replace(/\son[a-z]+=("[^"]*"|'[^']*')/gi, "")
    .replace(/<del\b[^>]*>[\s\S]*?<\/del>/gi, "")
    .replace(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi, (whole, tag, inner) => banned.test(tagText(inner)) && tagText(inner).length < 180 ? "" : whole)
    .replace(/<h1\b[^>]*>/gi, "<h2>").replace(/<\/h1>/gi, "</h2>")
    .replace(/<h4\b[^>]*>/gi, "<h3>").replace(/<\/h4>/gi, "</h3>")
    .replace(/<h([2-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (whole, level, inner) => {
      const text = normalizeHeading(inner);
      return text ? `<h${level}>${text}</h${level}>` : "";
    })
    .replace(/Servelt/gi, "Servlet")
    .replace(/매서드/g, "메서드")
    .replace(/쓰레드/g, "스레드")
    .replace(/JAVA Script/gi, "JavaScript")
    .replace(/Envrionment/g, "Environment")
    .replace(/\blone\b/g, "long")
    .replace(/웹개발에 최적화된 언어/g, "웹 서버 개발을 포함해 여러 분야에서 사용하는 범용 언어")
    .replace(/JVM 위에서 직접 동작하기 때문/g, "컴파일된 바이트코드가 운영체제별 JVM 위에서 실행되기 때문")
    .replace(/자바를 이용하여 개발을 해주는\s*<\/li>/g, "자바 컴파일러와 실행·개발 도구를 묶은 개발 키트</li>")
    .replace(/\bCREATEUSER\b/g, "CREATE USER")
    .replace(/IDENTIFIED BY 1234/g, 'IDENTIFIED BY "CHANGE_ME"')
    .replace(/\bDROPTABLE\b/g, "DROP TABLE")
    .replace(/\bSELECT\*/g, "SELECT *")
    .replace(/CREATED_ATTIMESTAMP/g, "CREATED_AT TIMESTAMP")
    .replace(/파일은 무조건 POST/g, "파일 생성 업로드에는 보통 POST를 사용하며 API 설계에 따라 PUT·PATCH도 사용할 수 있음")
    .replace(/Fetch\(AJAX\) 방식 사용/g, "Fetch를 이용한 비동기 방식 사용")
    .replace(/실무 방식/g, "JavaScript 비동기 방식")
    .replace(/실무 = AJAX 90%/g, "비동기 업로드는 화면 전환 없이 결과를 처리할 때 자주 사용")
    .replace(/거의 씀/g, "자주 사용")
    .replace(/거의 안씀/g, "단순 폼에서 사용")
    .replace(/UX 구림/g, "전체 페이지 이동 가능")
    .replace(/Fetch 방식이 표준이다/g, "Fetch 방식은 비동기 화면에서 자주 사용한다")
    .replace(/파일명이 절대 겹치지 않게 만들기 위함/g, "파일명 충돌 가능성을 매우 낮추기 위함")
    .replace(/# application-xxx\.properties\?{4} \?{4}/g, "# application-xxx.properties 파일 활성화")
    .replace(/# mapper xml \?{2}/g, "# Mapper XML 위치")
    .replace(/# camelCase \?{2}/g, "# snake_case를 camelCase로 자동 변환")
    .replace(/# type alias \?{3} \(\?{2} \?{4} \?{4} \?{2} \?{2}!\)/g, "# Type Alias 패키지 (실제 VO·DTO 패키지로 변경)")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/<hr\s*\/?>/gi, "")
    .replace(/<figure\b[^>]*>\s*<\/figure>/gi, "")
    .replace(/(?:<p>\s*<\/p>|<ul>\s*<\/ul>|<ol>\s*<\/ol>|<details[^>]*>\s*<\/details>)/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return balanceHtml(html);
}

function outline(body) {
  const headings = [...body.matchAll(/<h[2-3]>([\s\S]*?)<\/h[2-3]>/gi)]
    .map((match) => tagText(match[1]))
    .filter((text, index, all) => text && all.indexOf(text) === index)
    .slice(0, 7);
  return headings;
}

function lesson(rowNumber) {
  const row = rows[rowNumber - 1];
  const title = titles[rowNumber] || row.title.replace(/^\d+(?:\.\d+)?\s*/, "").trim();
  const source = polish(row.content, title);
  const headings = outline(source);
  const guide = `<section class="detail-bridge"><span>원문 수준 상세 학습</span><h2>${title} 다시 학습하기</h2><p>이 노트는 용어를 이미 알고 있다고 가정하지 않는다. 원문 필기의 세부 순서와 실습 맥락은 살리고, 학습 외 안내와 반복 문장은 걷어냈다. 코드에서는 입력값이 어디서 오고, 어떤 객체와 메서드를 지나며, 실행 뒤 무엇이 달라지는지 순서대로 확인한다.</p>${headings.length ? `<ol>${headings.map((heading) => `<li>${heading}</li>`).join("")}</ol>` : ""}</section>`;
  const checks = headings.slice(0, 3);
  const review = checks.length ? `<section class="detail-review"><span>혼자 설명해 보기</span><ul>${checks.map((heading) => `<li>‘${heading}’ 항목이 필요한 이유와 실행 결과를 코드 없이 설명할 수 있는가?</li>`).join("")}</ul></section>` : "";
  return {
    title: `${title} · 상세`,
    summary: `원문 필기의 설명 밀도를 유지해 ${title}의 준비, 실행 흐름, 코드와 실수 지점을 단계별로 다시 정리한다.`,
    body: guide + source + review,
    detail: true,
    sourceRow: rowNumber
  };
}

const output = {};
for (const [slug, rowNumbers] of Object.entries(curriculum)) {
  output[slug] = rowNumbers.map(lesson).filter((item) => tagText(item.body).length > 350);
}

const code = `/* data/content.json에서 학습 외 기록을 제거하고 개념별 상세 복습 단위로 생성 */\n(function () {\n  const detail = ${JSON.stringify(output, null, 2)};\n  Object.entries(detail).forEach(([slug, lessons]) => {\n    const category = window.CURATED_STUDY.find((item) => item.slug === slug);\n    if (!category) return;\n    category.lessons = [...category.lessons, ...lessons];\n  });\n})();\n`;

fs.writeFileSync(path.join(root, "data/curated/notion-level-detail.js"), code, "utf8");
console.log(Object.entries(output).map(([slug, lessons]) => `${slug}: ${lessons.length}`).join("\n"));
