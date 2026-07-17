(function () {
  const groups = [
    {
      title: "개발 · API",
      description: "코드 작성과 API 요청 확인",
      tools: [
        { name: "VS Code", mark: "VS", accent: "#4776c5", description: "HTML·JavaScript·React 편집", url: "https://code.visualstudio.com/download" },
        { name: "IntelliJ IDEA", mark: "IJ", accent: "#8a5ec7", description: "Java·Spring 프로젝트 개발", url: "https://www.jetbrains.com/idea/download/" },
        { name: "Eclipse IDE", mark: "E", accent: "#5e5aa7", description: "Servlet·JSP·Java 실습", url: "https://www.eclipse.org/downloads/" },
        { name: "Postman", mark: "P", accent: "#e46f45", description: "REST API 요청·인증·응답 테스트", url: "https://www.postman.com/downloads/", featured: true }
      ]
    },
    {
      title: "런타임 · 서버",
      description: "프로젝트 실행에 필요한 기반 환경",
      tools: [
        { name: "Node.js", mark: "JS", accent: "#4f8f54", description: "npm·Vite·React 실행 환경", url: "https://nodejs.org/en/download" },
        { name: "Temurin JDK", mark: "J", accent: "#4e76a8", description: "Java·Spring용 OpenJDK", url: "https://adoptium.net/temurin/releases/" },
        { name: "Apache Tomcat", mark: "TC", accent: "#a57f35", description: "Servlet·JSP 실행 서버", url: "https://tomcat.apache.org/download-11.cgi" }
      ]
    },
    {
      title: "데이터베이스",
      description: "DB 서버와 관리 도구",
      tools: [
        { name: "Oracle Database XE", mark: "OR", accent: "#be4d50", description: "Oracle 실습용 Database", url: "https://www.oracle.com/database/technologies/xe-downloads.html" },
        { name: "Oracle SQL Developer", mark: "SQL", accent: "#c85d51", description: "Oracle 접속·SQL 실행 도구", url: "https://www.oracle.com/database/sqldeveloper/technologies/download/" },
        { name: "PostgreSQL", mark: "PG", accent: "#47769e", description: "JPA·AWS RDS 실습 Database", url: "https://www.postgresql.org/download/" },
        { name: "pgAdmin", mark: "PA", accent: "#5b7f9d", description: "PostgreSQL 관리 도구", url: "https://www.pgadmin.org/download/" }
      ]
    },
    {
      title: "협업 · 인프라",
      description: "버전 관리와 배포 환경 재현",
      tools: [
        { name: "Git", mark: "G", accent: "#d15f49", description: "소스 버전 관리", url: "https://git-scm.com/downloads/" },
        { name: "SourceTree", mark: "ST", accent: "#4f78b9", description: "Git GUI와 branch 협업", url: "https://www.sourcetreeapp.com/" },
        { name: "Docker Desktop", mark: "DK", accent: "#477db7", description: "Container build·실행", url: "https://www.docker.com/products/docker-desktop/", featured: true },
        { name: "VirtualBox", mark: "VB", accent: "#557aa2", description: "Vagrant용 가상머신 provider", url: "https://www.virtualbox.org/wiki/Downloads" },
        { name: "Vagrant", mark: "V", accent: "#6a70b2", description: "VM 환경을 코드로 재현", url: "https://developer.hashicorp.com/vagrant/install" }
      ]
    }
  ];

  const dialog = document.getElementById("toolbox-dialog");
  const trigger = document.getElementById("toolbox-trigger");
  const closeButton = document.getElementById("toolbox-close");
  const container = document.getElementById("toolbox-groups");

  container.innerHTML = groups.map((group, groupIndex) => `
    <section class="tool-group" aria-labelledby="tool-group-${groupIndex}">
      <header><span>${String(groupIndex + 1).padStart(2, "0")}</span><div><h3 id="tool-group-${groupIndex}">${group.title}</h3><p>${group.description}</p></div></header>
      <div class="tool-grid">
        ${group.tools.map((tool) => `
          <a class="tool-card${tool.featured ? " featured" : ""}" href="${tool.url}" target="_blank" rel="noopener noreferrer" style="--tool-accent:${tool.accent}" aria-label="${tool.name} 공식 다운로드 페이지 열기">
            <i class="tool-mark" aria-hidden="true">${tool.mark}</i>
            <span><strong>${tool.name}</strong><small>${tool.description}</small></span>
            ${tool.featured ? '<em>자주 사용</em>' : ""}
            <b aria-hidden="true">↗</b>
          </a>`).join("")}
      </div>
    </section>`).join("");

  function openToolbox() {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("toolbox-open");
  }

  function closeToolbox() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  trigger.addEventListener("click", openToolbox);
  closeButton.addEventListener("click", closeToolbox);
  dialog.addEventListener("click", (event) => { if (event.target === dialog) closeToolbox(); });
  dialog.addEventListener("close", () => { document.body.classList.remove("toolbox-open"); trigger.focus(); });
})();
