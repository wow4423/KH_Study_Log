/* 원문에서 프로젝트를 다시 시작하려고 남긴 설치·설정·검증 기록을 현재 기준의 실행 가이드로 재구성한다. */
(function () {
  const category = (window.CURATED_STUDY || []).find((item) => item.slug === "setup");
  if (!category) return;
  const set = (index, body) => { if (category.lessons[index]) category.lessons[index].body = body; };

  set(0, `<h2>먼저 Node·npm·Vite의 역할을 나누어 이해한다</h2>
  <p>React를 설치한다는 말은 React 프로그램 하나를 내려받는다는 뜻이 아니다. <strong>Node.js</strong>는 JavaScript 도구를 실행하는 환경이고, <strong>npm</strong>은 프로젝트가 사용할 패키지와 명령을 관리하며, <strong>Vite</strong>는 React 개발 서버와 production build를 담당한다. 이 세 역할을 구분하면 설치 오류가 발생했을 때 어디부터 확인해야 하는지가 보인다.</p>
  <table><tr><th>구성 요소</th><th>확인할 것</th><th>문제가 생기면</th></tr><tr><td>Node.js</td><td><code>node -v</code></td><td>터미널을 다시 열고 PATH를 확인한다.</td></tr><tr><td>npm</td><td><code>npm -v</code></td><td>Node 설치 상태와 현재 사용자 권한을 확인한다.</td></tr><tr><td>Vite</td><td><code>npm run dev</code></td><td>현재 폴더와 package.json의 scripts를 확인한다.</td></tr></table>
  <h2>Windows에서 처음 만드는 순서</h2>
  <ol class="aws-steps"><li><b>01 · Node 설치</b><span>수업 화면의 버전 숫자를 그대로 찾지 말고 프로젝트가 요구하는 LTS 버전을 설치한다. 기존 터미널과 VS Code는 환경 변수 변경을 알지 못할 수 있으므로 모두 닫았다가 다시 연다.</span></li><li><b>02 · 버전 확인</b><span>일반 CMD와 VS Code 터미널에서 각각 <code>node -v</code>, <code>npm -v</code>가 같은 결과를 내는지 확인한다.</span></li><li><b>03 · 작업 폴더 이동</b><span>터미널의 현재 경로가 프로젝트를 만들 상위 폴더인지 확인한다. 잘못된 폴더에서 만들면 나중에 저장소가 중첩된다.</span></li><li><b>04 · 프로젝트 생성</b><span><code>npm create vite@latest my-app -- --template react</code>를 실행한다. 대화형 화면이라면 React와 JavaScript 또는 TypeScript를 목적에 맞게 고른다.</span></li><li><b>05 · 의존성 설치</b><span>생성된 폴더로 이동해 <code>npm install</code>을 실행한다. 다른 사람이 만든 저장소를 받았다면 lock file을 보존하고 <code>npm ci</code>를 우선한다.</span></li><li><b>06 · 개발·배포 검증</b><span><code>npm run dev</code>로 화면을 보고, 이어서 <code>npm run build</code>까지 통과시킨다. 개발 서버만 열린다고 프로젝트 준비가 끝난 것은 아니다.</span></li></ol>
  <figure class="console-shot"><img src="assets/setup-guide/node-version.png" alt="Windows 명령 프롬프트에서 Node 버전을 확인한 원문 화면" loading="lazy"><figcaption>원문에서 먼저 남긴 확인 화면이다. 버전 숫자보다 중요한 것은 새 터미널에서 node 명령이 인식되는지다.</figcaption></figure>
  <figure class="console-shot"><img src="assets/setup-guide/vite-command.png" alt="프로젝트 폴더에서 npm create vite를 실행하는 원문 화면" loading="lazy"><figcaption>명령 앞의 현재 경로를 함께 본다. 프로젝트 폴더가 중첩되거나 엉뚱한 위치에 생기는 실수를 여기서 막을 수 있다.</figcaption></figure>
  <h2>생성 직후 폴더를 읽는 법</h2>
  <pre data-lang="Text"><code>my-app/
├─ src/
│  ├─ main.jsx      # React 시작점
│  ├─ App.jsx       # 최상위 화면
│  └─ assets/       # 번들에 포함되는 자원
├─ public/          # 주소 그대로 제공할 정적 파일
├─ package.json     # 명령과 직접 의존성
└─ package-lock.json# 설치 버전 고정</code></pre>
  <p><code>node_modules</code>는 다시 설치할 수 있으므로 Git에 올리지 않는다. 반대로 lock file은 팀원이 같은 의존성 조합을 설치하는 기준이므로 함께 커밋한다. 첫 확인은 App.jsx의 예제 코드를 모두 지우는 것이 아니라, import와 return의 관계를 이해한 뒤 작은 제목 하나로 바꾸고 저장했을 때 HMR이 반영되는지 보는 것이다.</p>
  <div class="note-warning"><strong>자주 막히는 지점</strong><p><code>node</code>를 찾지 못하면 설치보다 터미널 재시작과 PATH부터 확인한다. <code>Missing script: dev</code>라면 package.json이 있는 폴더가 아니다. 주소가 열리지 않으면 terminal에 표시된 실제 port와 오류 메시지를 먼저 본다.</p></div>
  <blockquote><strong>준비 완료 기준:</strong> 새 clone에서도 버전 확인 → 의존성 설치 → dev 실행 → build 생성의 네 단계가 README만 보고 재현되어야 한다.</blockquote>`);

  set(1, `<h2>Proxy가 필요한 상황부터 그린다</h2>
  <p>개발 중에는 React가 보통 <code>localhost:5173</code>, Spring Boot가 <code>localhost:8080</code>처럼 서로 다른 origin에서 실행된다. 브라우저가 React 화면에서 백엔드로 직접 요청하면 CORS 규칙을 적용한다. Vite proxy는 브라우저가 같은 origin의 <code>/api</code>로 요청한 것처럼 만들고, 개발 서버가 그 요청을 백엔드로 전달한다.</p>
  <div class="concept-flow"><span>Browser :5173</span><i>/api 요청</i><span>Vite dev server</span><i>target 전달</i><span>Spring :8080</span></div>
  <h2>설정 파일과 프론트 요청을 한 쌍으로 맞춘다</h2>
  <pre data-lang="JavaScript"><code>// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});</code></pre>
  <pre data-lang="JavaScript"><code>// 요청 코드에는 백엔드 host를 직접 쓰지 않는다.
const response = await axios.get('/api/members');</code></pre>
  <p><code>/api</code>를 그대로 백엔드에 보낼지, <code>rewrite</code>로 제거할지는 Controller mapping과 함께 결정한다. 예를 들어 Controller가 <code>/api/members</code>를 받는다면 rewrite가 필요 없고, <code>/members</code>만 받는다면 proxy에서 앞의 <code>/api</code>를 제거해야 한다.</p>
  <h2>적용 순서와 확인 위치</h2>
  <ol><li><code>vite.config.js</code>를 수정한다.</li><li>실행 중인 Vite 서버를 완전히 종료하고 다시 시작한다.</li><li>브라우저 Network에서 실제 요청 URL, status, response를 확인한다.</li><li>같은 시각 Spring log에 요청이 들어왔는지 확인한다.</li><li>404라면 Controller mapping, 401이면 인증, CORS라면 응답 header를 각각 분리해 본다.</li></ol>
  <h2>개발 Proxy와 운영 배포는 다르다</h2>
  <p>Vite proxy는 <code>npm run dev</code>에서만 동작한다. build 결과는 정적 파일이므로 운영에서는 Nginx·로드밸런서가 <code>/api</code>를 백엔드로 넘기거나, <code>VITE_API_BASE_URL</code> 같은 빌드 환경 변수로 API 주소를 주입해야 한다. 환경 변수 이름과 값은 기록하되 실제 secret은 프론트 번들에 넣지 않는다.</p>
  <table><tr><th>증상</th><th>먼저 확인할 것</th></tr><tr><td>설정을 바꿔도 이전 주소로 요청</td><td>Vite 서버 재시작 여부</td></tr><tr><td>Vite에서 404</td><td>요청 경로가 proxy key인 <code>/api</code>로 시작하는지</td></tr><tr><td>백엔드 404</td><td>rewrite 결과와 Controller mapping</td></tr><tr><td>Cookie가 전달되지 않음</td><td><code>withCredentials</code>, SameSite, 허용 origin</td></tr></table>
  <blockquote><strong>설명할 수 있어야 하는 것:</strong> 브라우저가 누구에게 요청하고, Vite가 어느 주소로 바꾸며, 운영에서는 그 역할을 누가 대신하는지 한 줄로 이어서 말한다.</blockquote>`);

  set(2, `<h2>Initializr에서는 버전보다 조합을 선택한다</h2>
  <p>Spring Initializr는 빈 폴더를 만들어 주는 화면이 아니라 빌드 도구, Java, Spring Boot, package 이름과 첫 의존성을 서로 호환되는 조합으로 생성한다. 수업 캡처의 버전을 그대로 복사하기보다 현재 프로젝트의 Java와 라이브러리 호환성을 먼저 확인한다.</p>
  <figure class="console-shot"><img src="assets/notion-guide/spring-initializr.png" alt="Spring Initializr에서 프로젝트 정보와 의존성을 선택하는 원문 화면" loading="lazy"><figcaption>화면의 숫자를 외우지 말고 Build tool·Language·Java·Packaging·Dependencies가 한 프로젝트 규칙으로 맞는지 확인한다.</figcaption></figure>
  <h2>화면에서 결정하는 항목</h2>
  <table><tr><th>항목</th><th>선택 기준</th></tr><tr><td>Project</td><td>팀이 사용하는 Gradle 또는 Maven. 생성 후 wrapper를 함께 커밋한다.</td></tr><tr><td>Language</td><td>수업과 프로젝트 코드가 Java라면 Java.</td></tr><tr><td>Spring Boot</td><td>안정 버전과 Java·주요 library 호환성을 확인한다.</td></tr><tr><td>Group / Artifact</td><td>기본 package와 결과물 이름이 된다. 임시 이름을 그대로 두지 않는다.</td></tr><tr><td>Packaging</td><td>내장 서버를 쓰는 일반 API는 Jar. 외부 WAS 배포 요구가 있을 때만 War를 검토한다.</td></tr><tr><td>Java</td><td>개발 PC, CI, 배포 서버에서 모두 제공할 수 있는 버전으로 고정한다.</td></tr></table>
  <h2>기능에 따라 의존성을 고른다</h2>
  <ul><li><strong>REST API:</strong> Spring Web, Validation</li><li><strong>MyBatis:</strong> MyBatis Framework와 사용할 DB driver</li><li><strong>JPA:</strong> Spring Data JPA와 DB driver</li><li><strong>로그인·권한:</strong> Spring Security. JWT library는 설계가 정해진 뒤 별도로 추가한다.</li><li><strong>개발 편의:</strong> Lombok은 IDE plugin·annotation processing까지 맞출 수 있을 때 사용한다.</li></ul>
  <p>MyBatis와 JPA를 무조건 동시에 고르지 않는다. 둘 다 필요하다면 어떤 조회와 변경을 어느 기술이 담당하는지 먼저 적는다. DB driver를 넣은 순간 Spring은 DataSource 자동 설정을 시도하므로, 아직 DB가 없다면 test profile이나 임시 설정 없이 애플리케이션이 실패할 수 있다.</p>
  <h2>압축을 푼 뒤 최초 검증</h2>
  <ol class="aws-steps"><li><b>01 · JDK 확인</b><span>IDE Project SDK와 Gradle JVM이 같은 Java 버전을 보는지 확인한다.</span></li><li><b>02 · Gradle 동기화</b><span>의존성 다운로드가 끝날 때까지 기다리고 붉은 import가 남는지 본다.</span></li><li><b>03 · Test</b><span><code>./gradlew test</code>로 빈 context가 올라오는지 확인한다.</span></li><li><b>04 · Run</b><span><code>./gradlew bootRun</code>으로 port와 active profile을 확인한다.</span></li><li><b>05 · Build</b><span><code>./gradlew clean bootJar</code> 후 build/libs에 실행 가능한 jar가 만들어지는지 본다.</span></li></ol>
  <h2>처음부터 분리해 둘 설정</h2>
  <pre data-lang="Properties"><code># application.properties
spring.application.name=my-app
spring.profiles.active=local

# application-local.properties
server.port=8080</code></pre>
  <p>공통값과 환경별 값을 분리한다. DB 비밀번호·JWT secret·AWS key는 Git에 들어가는 properties에 직접 넣지 않는다. package는 controller, service, repository 같은 기술 이름만이 아니라 프로젝트 규모에 따라 member, board 같은 기능 단위도 함께 고려한다.</p>
  <div class="note-warning"><strong>부팅 실패를 읽는 순서</strong><p>가장 아래 stack trace만 보지 말고 처음 등장한 <code>Caused by</code>, 실패한 bean 이름, port 충돌, DataSource URL, active profile을 순서대로 확인한다.</p></div>
  <blockquote><strong>초기화 완료 기준:</strong> IDE 실행 버튼뿐 아니라 wrapper 명령으로 test·bootRun·bootJar가 모두 성공하고, 필요한 환경 변수 목록이 README에 남아 있어야 한다.</blockquote>`);

  set(3, `<h2>JSP 프로젝트는 일반 REST 프로젝트와 구조가 다르다</h2>
  <p>Spring Boot에서 JSP를 사용하려면 Controller가 문자열을 JSON으로 반환하는 구조와 구분해야 한다. <code>@Controller</code>가 View 이름을 반환하고, ViewResolver가 prefix와 suffix를 붙여 WEB-INF 아래 JSP를 찾는다. JSP는 서버에서 HTML을 완성하므로 React를 화면으로 쓰는 프로젝트에는 이 설정을 넣지 않는다.</p>
  <h2>의존성과 폴더를 먼저 맞춘다</h2>
  <pre data-lang="Gradle"><code>dependencies {
  implementation 'org.springframework.boot:spring-boot-starter-web'
  implementation 'org.apache.tomcat.embed:tomcat-embed-jasper'
  implementation 'jakarta.servlet.jsp.jstl:jakarta.servlet.jsp.jstl-api'
  implementation 'org.glassfish.web:jakarta.servlet.jsp.jstl'
}</code></pre>
  <pre data-lang="Text"><code>src/main/
├─ java/com/example/app/
├─ resources/application.properties
└─ webapp/WEB-INF/views/
   └─ home.jsp</code></pre>
  <figure class="console-shot"><img src="assets/notion-guide/jsp-web-inf.png" alt="WEB-INF 아래에 JSP 화면을 생성하는 원문 화면" loading="lazy"><figcaption>JSP의 실제 위치와 ViewResolver의 prefix가 정확히 일치해야 한다. WEB-INF 아래에 두면 사용자가 JSP 주소로 바로 접근하지 못한다.</figcaption></figure>
  <h2>ViewResolver와 첫 요청을 연결한다</h2>
  <pre data-lang="Properties"><code>spring.mvc.view.prefix=/WEB-INF/views/
spring.mvc.view.suffix=.jsp</code></pre>
  <pre data-lang="Java"><code>@Controller
public class HomeController {
  @GetMapping("/")
  public String home(Model model) {
    model.addAttribute("message", "설정 확인 완료");
    return "home"; // /WEB-INF/views/home.jsp
  }
}</code></pre>
  <pre data-lang="JSP"><code>&lt;%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %&gt;
&lt;!doctype html&gt;
&lt;html lang="ko"&gt;
&lt;body&gt;&lt;h1&gt;&#36;{message}&lt;/h1&gt;&lt;/body&gt;
&lt;/html&gt;</code></pre>
  <h2>DB·MyBatis·업로드 설정은 기능별로 추가한다</h2>
  <p>원문처럼 모든 설정을 한 번에 붙여넣으면 아직 사용하지 않는 자동 설정 때문에 부팅이 실패할 수 있다. DB 기능을 시작할 때 DataSource와 driver, MyBatis를 사용할 때 mapper location과 alias package, 파일 업로드가 필요할 때 multipart 제한을 차례로 추가한다. alias package는 예전 프로젝트 값을 복사하지 말고 현재 DTO package로 반드시 바꾼다.</p>
  <table><tr><th>증상</th><th>원인 후보</th></tr><tr><td>JSP 대신 문자열이 그대로 보임</td><td><code>@RestController</code> 사용 여부</td></tr><tr><td>404</td><td>Controller mapping 또는 JSP 실제 경로</td></tr><tr><td>JSP compile 오류</td><td>Jasper·JSTL 의존성과 jakarta 버전</td></tr><tr><td>한글 깨짐</td><td>page directive와 HTML charset</td></tr><tr><td>변경이 반영되지 않음</td><td>Gradle reload와 서버 재시작</td></tr></table>
  <blockquote><strong>완료 기준:</strong> URL → Controller → Model → ViewResolver → JSP → HTML 응답의 경로를 파일 위치와 함께 설명할 수 있어야 한다.</blockquote>`);

  set(4, `<h2>Oracle Database와 접속 도구를 구분한다</h2>
  <p>Oracle Database는 데이터를 저장하고 SQL을 실행하는 서버다. SQL Developer나 DBeaver는 그 서버에 명령을 보내는 client다. 접속 화면이 열린다고 DB가 설치된 것이 아니며, DB service와 listener가 실행되고 있어야 한다.</p>
  <figure class="console-shot"><img src="assets/setup-guide/oracle-connect.png" alt="Oracle 연결 이름과 사용자, host, port, SID를 입력하는 원문 화면" loading="lazy"><figcaption>원문 수업 계정 연결 화면이다. 사용자 이름만 복사하지 말고 host·port·SID 또는 service name이 현재 설치 환경과 맞는지 확인한다.</figcaption></figure>
  <h2>접속 정보를 한 항목씩 읽는다</h2>
  <table><tr><th>항목</th><th>의미</th><th>local 예</th></tr><tr><td>Host</td><td>DB 서버 주소</td><td>localhost</td></tr><tr><td>Port</td><td>listener가 기다리는 port</td><td>1521</td></tr><tr><td>SID / Service</td><td>접속할 DB 서비스 식별자</td><td>xe 또는 xepdb1</td></tr><tr><td>User</td><td>객체를 소유할 schema 계정</td><td>APP_USER</td></tr></table>
  <p>수업 화면은 XE의 SID 방식을 사용하지만 설치 버전에 따라 service name을 사용한다. JDBC URL도 <code>@host:port:SID</code>와 <code>@host:port/service</code> 형식이 다르므로 현재 접속 도구에서 성공한 정보를 기준으로 맞춘다.</p>
  <h2>관리자 계정과 애플리케이션 계정을 분리한다</h2>
  <pre data-lang="SQL"><code>-- 관리자 계정에서 한 번만 실행
CREATE USER APP_USER IDENTIFIED BY "change-me";
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO APP_USER;
ALTER USER APP_USER QUOTA UNLIMITED ON USERS;

-- 이후 테이블 생성과 CRUD는 APP_USER로 접속해 실행</code></pre>
  <p>애플리케이션을 SYSTEM이나 SYS로 연결하지 않는다. 필요한 권한만 가진 전용 사용자를 만들고, 실제 비밀번호는 환경 변수나 private profile로 전달한다.</p>
  <h2>초기 스키마는 반복 실행 가능한 기록으로 남긴다</h2>
  <pre data-lang="SQL"><code>CREATE TABLE member (
  member_id NUMBER PRIMARY KEY,
  email VARCHAR2(200) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE SEQUENCE member_seq START WITH 1 INCREMENT BY 1;</code></pre>
  <p>DDL을 SQL 창에서 한 번 실행하고 잊지 말고 migration 또는 <code>schema.sql</code>로 관리한다. FK, UNIQUE, index, sequence와 테스트 seed를 구분하고, production 데이터를 지우는 DROP이나 create 옵션은 별도 절차로 둔다.</p>
  <h2>연결 실패 진단 순서</h2>
  <ol><li>DB service와 listener가 실행 중인지 확인한다.</li><li>client에서 같은 host·port·service·user로 접속한다.</li><li>JDBC driver가 프로젝트에 포함됐는지 확인한다.</li><li>JDBC URL 형식과 active profile을 확인한다.</li><li>접속 후 <code>SELECT USER FROM DUAL</code>로 현재 schema를 확인한다.</li></ol>
  <blockquote><strong>완료 기준:</strong> 새 PC에서도 DB 실행 → 전용 계정 생성 → schema 적용 → client 접속 → Spring 연결을 같은 순서로 재현할 수 있어야 한다.</blockquote>`);

  set(5, `<h2>MyBatis는 설치보다 연결 구조가 핵심이다</h2>
  <p>원문에서는 MyBatis jar를 직접 받아 프로젝트에 추가하는 과정을 기록했지만, Spring Boot 프로젝트에서는 starter와 dependency 관리로 설치한다. 중요한 것은 DataSource, 설정, Mapper interface, mapper XML, DTO가 같은 이름 규칙으로 연결되는지다.</p>
  <div class="concept-flow"><span>Service</span><i>호출</i><span>Mapper interface</span><i>namespace·id</i><span>mapper.xml</span><i>SQL</i><span>DB</span></div>
  <h2>의존성과 application 설정</h2>
  <pre data-lang="Gradle"><code>dependencies {
  implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter'
  runtimeOnly 'com.oracle.database.jdbc:ojdbc11'
}</code></pre>
  <pre data-lang="Properties"><code>spring.datasource.url=jdbc:oracle:thin:@localhost:1521/xe
spring.datasource.username=APP_USER
spring.datasource.password=&#36;{DB_PASSWORD}

mybatis.mapper-locations=classpath:/mybatis/mapper/**/*.xml
mybatis.type-aliases-package=com.example.app.member.dto
mybatis.configuration.map-underscore-to-camel-case=true
mybatis.configuration.jdbc-type-for-null=NULL</code></pre>
  <figure class="console-shot"><img src="assets/setup-guide/mybatis-folders.png" alt="resources 아래 MyBatis config와 mapper 폴더를 분리한 원문 화면" loading="lazy"><figcaption>원문에서 기억하려고 남긴 폴더 구조다. 현재 Spring Boot에서는 경로 이름의 대소문자와 application 설정의 mapper location을 정확히 맞추는 것이 핵심이다.</figcaption></figure>
  <h2>Interface와 XML을 같은 계약으로 만든다</h2>
  <pre data-lang="Java"><code>@Mapper
public interface MemberMapper {
  Optional&lt;MemberDto&gt; findById(long memberId);
  int insert(MemberDto member);
}</code></pre>
  <pre data-lang="XML"><code>&lt;mapper namespace="com.example.app.member.MemberMapper"&gt;
  &lt;resultMap id="memberMap" type="MemberDto"&gt;
    &lt;id property="memberId" column="member_id"/&gt;
    &lt;result property="email" column="email"/&gt;
  &lt;/resultMap&gt;

  &lt;select id="findById" resultMap="memberMap"&gt;
    SELECT member_id, email FROM member WHERE member_id = #{memberId}
  &lt;/select&gt;
&lt;/mapper&gt;</code></pre>
  <p>namespace는 interface의 전체 package 이름, id는 method 이름, parameter 이름은 <code>#{}</code>, 결과 열은 DTO property와 맞아야 한다. 하나라도 다르면 애플리케이션 시작 시 statement를 찾지 못하거나 실행 뒤 매핑 값이 비게 된다.</p>
  <h2>처음 연결할 때는 작은 조회 하나로 검증한다</h2>
  <ol><li>DataSource 연결 test를 통과시킨다.</li><li>parameter 없는 <code>SELECT 1</code> 또는 한 행 조회를 만든다.</li><li>SQL log와 바인딩 값을 확인한다.</li><li>단건은 Optional, 목록은 List, 변경은 영향받은 행 수로 반환한다.</li><li>Service에서 여러 변경을 묶을 때 <code>@Transactional</code>을 적용한다.</li></ol>
  <table><tr><th>오류</th><th>먼저 볼 곳</th></tr><tr><td>Invalid bound statement</td><td>namespace, method id, XML resource 경로</td></tr><tr><td>ORA-17004</td><td>null의 JDBC type과 parameter type</td></tr><tr><td>값이 null로 매핑</td><td>column alias, camel-case 설정, resultMap</td></tr><tr><td>조회 건수가 급증</td><td>반복문 안의 Mapper 호출과 N+1</td></tr></table>
  <blockquote><strong>완료 기준:</strong> Mapper method 하나를 가리키며 interface → XML → SQL parameter → result mapping → transaction의 연결을 전부 설명할 수 있어야 한다.</blockquote>`);

  set(6, `<h2>새 저장소를 만들기 전에 책임을 정한다</h2>
  <p>원문은 형상관리자가 저장소를 만들고 팀원이 SourceTree로 clone한 뒤 기능 branch를 push하는 화면을 단계별로 남겼다. 지금도 흐름은 같지만 token을 URL 문자열에 넣는 방식은 사용하지 않는다. Git Credential Manager나 SSH key처럼 자격 증명을 안전하게 보관하는 방식을 사용한다.</p>
  <h2>관리자와 팀원의 첫 단계</h2>
  <table><tr><th>역할</th><th>처음 할 일</th></tr><tr><td>저장소 관리자</td><td>저장소, 기본 branch, .gitignore, README, branch rule, 권한을 준비한다.</td></tr><tr><td>팀원</td><td>정확한 URL을 clone하고 build·test를 실행한 뒤 개인 기능 branch를 만든다.</td></tr></table>
  <figure class="console-shot"><img src="assets/setup-guide/git-clone.png" alt="SourceTree에서 저장소 주소와 local 폴더를 입력하는 원문 화면" loading="lazy"><figcaption>clone 화면에서는 원격 URL뿐 아니라 local 대상 폴더를 본다. 이미 Git 저장소인 상위 폴더 안에 다시 clone하지 않도록 주의한다.</figcaption></figure>
  <h2>처음 저장소를 만드는 순서</h2>
  <pre data-lang="Shell"><code>git init
git status
git add .gitignore README.md
git commit -m "chore: initialize project"
git branch -M main
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main</code></pre>
  <p><code>.gitignore</code>에는 node_modules, build, dist, IDE 설정, <code>.env</code>, private properties, pem, keystore를 넣는다. 이미 commit된 secret은 ignore만 추가해도 history에서 사라지지 않으므로 즉시 폐기·교체하고 history 정리를 별도로 판단한다.</p>
  <h2>기능 작업은 main에서 바로 시작하지 않는다</h2>
  <pre data-lang="Shell"><code>git switch main
git pull --ff-only
git switch -c feature/member-login

# 작업 후
git status
git diff
git add src/
git commit -m "feat: add member login"
git push -u origin feature/member-login</code></pre>
  <p>Pull Request를 만들기 전에 최신 main과의 차이, test, build, migration 충돌을 확인한다. merge 후에는 local main으로 돌아와 pull하고 완료한 branch를 정리한다. SourceTree를 사용하더라도 각 버튼이 어떤 Git 명령과 상태 변화를 만드는지 연결해서 본다.</p>
  <h2>README가 답해야 할 질문</h2>
  <ul><li>필요한 Java·Node·DB 버전은 무엇인가?</li><li>설치, test, 개발 실행, production build 명령은 무엇인가?</li><li>필요한 환경 변수 이름과 example 값은 무엇인가?</li><li>DB schema와 seed는 어떤 순서로 적용하는가?</li><li>사용 port와 health URL은 무엇인가?</li></ul>
  <blockquote><strong>협업 준비 완료 기준:</strong> 새 폴더에서 clone한 팀원이 개인 연락 없이 README만 보고 실행하고 첫 branch를 push할 수 있어야 한다.</blockquote>`);

  set(7, `<h2>AWS 설정은 서비스 생성 순서보다 연결 지도를 먼저 만든다</h2>
  <p>프로젝트 시작 단계에서는 EC2 버튼을 누르기 전에 애플리케이션이 무엇을 필요로 하는지 적는다. Spring Boot 실행 파일, Java runtime, DB, 파일 저장소, 외부 API, secret, domain, HTTPS, log와 backup의 관계가 정해져야 Security Group과 환경 변수를 정확히 만들 수 있다.</p>
  <div class="deploy-architecture"><span>Browser</span><i>HTTPS</i><span>EC2 · Spring</span><i>private 연결</i><span>RDS</span></div>
  <h2>배포 전 로컬에서 고정할 계약</h2>
  <ul><li><strong>artifact:</strong> 어떤 명령으로 jar 또는 image를 만들고 파일 이름은 무엇인지</li><li><strong>runtime:</strong> Java·Docker 버전과 실행 user</li><li><strong>configuration:</strong> 환경 변수 이름, profile, port, 외부 endpoint</li><li><strong>health:</strong> 인증 없이 내부에서 확인할 최소 health URL</li><li><strong>data:</strong> migration, seed, backup, rollback 절차</li></ul>
  <h2>처음 배포하는 순서</h2>
  <ol class="aws-steps"><li><b>01 · IAM</b><span>장기 Access Key를 서버에 복사하기보다 EC2 Role로 S3 등 필요한 권한만 부여한다.</span></li><li><b>02 · Network</b><span>SSH는 내 IP, 웹은 필요한 port만 열고 RDS는 EC2 Security Group에서만 접근하게 한다.</span></li><li><b>03 · RDS</b><span>DB, 사용자, backup, subnet, Security Group을 만들고 EC2에서 연결을 test한다.</span></li><li><b>04 · Runtime</b><span>Java 또는 Docker를 설치하고 전용 실행 user와 폴더 권한을 준비한다.</span></li><li><b>05 · Config</b><span>DB URL, password, JWT secret, S3 bucket과 region을 Git 밖의 환경 파일이나 secret 저장소로 주입한다.</span></li><li><b>06 · Service</b><span>systemd 또는 container restart policy로 재부팅 뒤 자동 실행되게 한다.</span></li><li><b>07 · Verify</b><span>내부 health → 외부 HTTPS → DB CRUD → 파일 업로드 → log·metric 순서로 확인한다.</span></li></ol>
  <pre data-lang="INI"><code>[Service]
User=myapp
WorkingDirectory=/opt/myapp
EnvironmentFile=/etc/myapp/app.env
ExecStart=/usr/bin/java -jar /opt/myapp/app.jar
Restart=on-failure</code></pre>
  <h2>배포 실패는 범위를 좁혀 확인한다</h2>
  <pre data-lang="Shell"><code>systemctl status myapp
journalctl -u myapp -n 200 --no-pager
ss -lntp
curl -f http://127.0.0.1:8080/actuator/health</code></pre>
  <p>외부에서 안 열린다고 즉시 애플리케이션 코드를 고치지 않는다. process → local port → local health → Security Group → load balancer 또는 DNS 순서로 범위를 넓힌다. 배포 전 artifact를 보관하고 health 실패 시 이전 버전으로 되돌리는 명령도 함께 기록한다.</p>
  <div class="note-warning"><strong>절대 저장소에 넣지 않는 것</strong><p>AWS Access Key, pem, DB 비밀번호, JWT secret, application-private.properties. 노출되었다면 삭제만 하지 말고 즉시 폐기하고 새 값으로 교체한다.</p></div>
  <blockquote><strong>시작 가이드의 역할:</strong> AWS 카테고리의 콘솔 단계로 들어가기 전에 이 프로젝트가 요구하는 자원·port·환경 변수·검증·rollback 표를 먼저 완성한다.</blockquote>`);

  set(8, `<h2>Docker와 Vagrant는 해결하는 층이 다르다</h2>
  <p>Docker는 애플리케이션과 의존성을 image로 묶어 process를 격리한다. Vagrant는 VirtualBox 같은 provider 위에 VM 자체를 만들고, Ansible은 그 VM 안의 package와 설정을 반복 가능하게 적용한다. 단순한 웹 애플리케이션 실행은 Docker Compose가 가볍고, OS와 서버 provisioning까지 수업 환경처럼 재현해야 하면 Vagrant·Ansible이 유용하다.</p>
  <figure class="console-shot"><img src="assets/setup-guide/vagrant-ansible.png" alt="Vagrant가 VM을 만들고 Ansible이 OS와 패키지를 설정하는 원문 구조 그림" loading="lazy"><figcaption>원문 그림의 핵심: Vagrant는 VM의 CPU·RAM·OS를 만들고, Ansible은 그 안을 사용 가능한 서버 상태로 설정한다.</figcaption></figure>
  <h2>Spring Boot를 Docker로 시작하는 최소 구조</h2>
  <pre data-lang="Dockerfile"><code>FROM eclipse-temurin:21-jre
WORKDIR /app
COPY build/libs/app.jar app.jar
USER 10001
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>
  <pre data-lang="YAML"><code>services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-only
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 3s
      retries: 10
    volumes: ["db-data:/var/lib/postgresql/data"]

  api:
    build: .
    env_file: [.env]
    ports: ["8080:8080"]
    depends_on:
      db: { condition: service_healthy }

volumes: { db-data: {} }</code></pre>
  <p><code>depends_on</code>만으로 DB가 query 가능한 상태를 보장하지 못하므로 healthcheck를 둔다. container 안의 <code>localhost</code>는 그 container 자신이므로 API는 DB host를 service 이름인 <code>db</code>로 사용한다.</p>
  <h2>Vagrant와 Ansible로 VM까지 재현한다</h2>
  <pre data-lang="Ruby"><code>Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.network "private_network", ip: "192.168.56.10"
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end
  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "provision/site.yml"
  end
end</code></pre>
  <p>Ansible task는 여러 번 실행해도 같은 결과가 되는 멱등성을 지켜야 한다. shell 명령을 무조건 실행하기보다 package, service, template module로 원하는 상태를 선언한다.</p>
  <h2>재현성 검증은 깨끗한 상태에서 한다</h2>
  <ol><li><code>docker compose config</code> 또는 <code>vagrant validate</code>로 문법을 검사한다.</li><li>기존 container·VM에 기대지 않고 새로 생성한다.</li><li>health, port, DB migration과 data volume을 확인한다.</li><li>종료 후 다시 시작해 데이터와 자동 실행 여부를 확인한다.</li><li>필요한 버전, 명령, 환경 변수와 삭제 시 영향까지 README에 남긴다.</li></ol>
  <blockquote><strong>완료 기준:</strong> “내 PC에서는 된다”가 아니라 새로운 PC 또는 새 VM에서 같은 명령으로 같은 상태가 만들어져야 한다.</blockquote>`);
})();
