/* 프로젝트 시작 가이드가 실제 작업 중 막혔을 때 바로 펼쳐 볼 수 있도록 검증·복구 절차를 더한다. */
(function () {
  const setup = (window.CURATED_STUDY || []).find((item) => item.slug === "setup");
  const add = (index, html) => { if (setup?.lessons[index]) setup.lessons[index].body += html; };

  add(0, `<h2>package.json에서 프로젝트의 실행 계약을 확인한다</h2><pre data-lang="JSON"><code>{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}</code></pre><p>명령이 안 된다고 전역으로 Vite를 설치하지 않는다. 이 프로젝트의 devDependency를 설치한 뒤 npm script로 실행해야 팀원과 CI도 같은 버전을 사용한다. package.json을 고쳤다면 lock file도 함께 변경되는지 확인하고, Node 버전은 README·<code>.nvmrc</code>·<code>engines</code> 중 팀이 선택한 한 방식으로 기록한다.</p><h3>첫 화면 이후 바로 정리할 것</h3><ul><li>예제 logo·count state·기본 CSS 중 사용하지 않는 것을 제거한다.</li><li>src 아래에 pages, components, api, assets 등 현재 규모에 맞는 책임을 정한다.</li><li>절대 경로 alias를 도입한다면 Vite와 IDE 설정을 함께 맞춘다.</li><li><code>.env.example</code>에는 값이 아닌 필요한 변수 이름만 남긴다.</li></ul>`);

  add(1, `<h2>인증 요청은 Cookie와 Header 방식을 나누어 설정한다</h2><p>JWT를 Authorization header로 보낸다면 Axios interceptor가 token을 붙이는 위치와 401 처리 방식을 정한다. Session·Refresh Token을 HttpOnly cookie로 보낸다면 <code>withCredentials</code>, backend의 credential 허용, 정확한 origin, SameSite·Secure 조건이 모두 맞아야 한다.</p><pre data-lang="JavaScript"><code>export const api = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  withCredentials: true
});</code></pre><h2>운영에서는 Reverse Proxy 계약을 같은 경로로 유지한다</h2><pre data-lang="Nginx"><code>location /api/ {
  proxy_pass http://127.0.0.1:8080;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
}</code></pre><p>개발과 운영 모두 프론트 코드가 <code>/api</code>를 사용하면 환경별 host를 component마다 바꾸지 않아도 된다. 단, proxy 뒤에서 HTTPS를 판단하거나 redirect URL을 만들 때는 forwarded header 처리도 확인한다.</p>`);

  add(2, `<h2>첫 package 구조는 요청 한 건을 따라가며 확인한다</h2><pre data-lang="Text"><code>member/
├─ controller/MemberController.java
├─ service/MemberService.java
├─ repository/MemberRepository.java
├─ dto/MemberRequest.java
└─ domain/Member.java
config/
└─ SecurityConfig.java</code></pre><p>이름만 나누고 Controller가 Repository를 직접 부르면 구조가 분리된 것이 아니다. Controller는 HTTP 변환과 검증, Service는 use case와 transaction, Repository는 저장 기술을 담당한다. 첫 endpoint를 health 또는 작은 조회로 만든 뒤 request → controller → service → repository → response를 debugger와 log로 한 번 따라간다.</p><h2>초기 자동 설정 오류를 분리하는 방법</h2><table><tr><th>메시지</th><th>확인</th></tr><tr><td>Failed to configure a DataSource</td><td>DB 의존성을 넣었지만 URL 또는 profile이 없는지</td></tr><tr><td>Port already in use</td><td>실행 중인 이전 process와 server.port</td></tr><tr><td>Bean name conflict</td><td>중복 Component와 scan 범위</td></tr><tr><td>Unsupported class version</td><td>compile Java와 실행 Java의 차이</td></tr></table>`);

  add(3, `<h2>JSP·JSTL 최소 확인 페이지로 설정을 잠근다</h2><pre data-lang="JSP"><code>&lt;%@ taglib prefix="c" uri="jakarta.tags.core" %&gt;
&lt;c:choose&gt;
  &lt;c:when test="&#36;{empty members}"&gt;회원이 없습니다.&lt;/c:when&gt;
  &lt;c:otherwise&gt;
    &lt;c:forEach var="member" items="&#36;{members}"&gt;
      &lt;c:out value="&#36;{member.name}"/&gt;
    &lt;/c:forEach&gt;
  &lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre><p>EL 한 개만 출력하는 화면과 JSTL 반복 화면을 각각 확인하면 ViewResolver 문제와 tag library 문제를 분리할 수 있다. 사용자 입력은 가능한 <code>c:out</code>으로 escape하고 JSP 안에서 DB를 호출하지 않는다.</p><h2>빌드 형태까지 확인한다</h2><p>IDE의 embedded Tomcat에서 보이는 것만 확인하지 말고 실제 배포에 사용할 jar 또는 war를 실행해 JSP가 포함되는지 본다. Spring Boot와 embedded container 조합에 따라 executable jar에서 JSP 지원 제약이 달라질 수 있으므로, 프로젝트 버전을 정한 뒤 배포 방식까지 초기에 시험한다.</p>`);

  add(4, `<h2>DB 초기화 파일을 세 부분으로 나눈다</h2><ul><li><strong>001_schema.sql:</strong> table, constraint, sequence, index</li><li><strong>002_seed.sql:</strong> local·test에서 필요한 최소 기준 데이터</li><li><strong>003_verify.sql:</strong> 객체와 행 수, 권한을 확인할 query</li></ul><p>원문처럼 SQL Developer에서 실행할 때는 블록 전체가 아니라 현재 문장만 실행되는 단축키 차이를 확인한다. DDL은 Oracle에서 implicit commit을 일으킬 수 있으므로 DML transaction과 같은 감각으로 rollback할 수 있다고 생각하면 안 된다.</p><h2>대표 오류를 메시지 그대로 분류한다</h2><table><tr><th>오류</th><th>뜻</th></tr><tr><td>ORA-01017</td><td>사용자 또는 비밀번호가 맞지 않는다.</td></tr><tr><td>ORA-12514</td><td>listener가 요청한 service를 알지 못한다.</td></tr><tr><td>ORA-12541</td><td>해당 host·port에 listener가 없다.</td></tr><tr><td>ORA-00942</td><td>현재 schema에 table이 없거나 권한이 없다.</td></tr></table><p>오류 번호를 지우지 말고 접속 문자열, 현재 USER, 실행 SQL과 함께 기록하면 다음 프로젝트에서 같은 문제를 빠르게 찾을 수 있다.</p>`);

  add(5, `<h2>등록·조회·수정·삭제의 반환값을 먼저 정한다</h2><table><tr><th>작업</th><th>권장 확인값</th></tr><tr><td>INSERT·UPDATE·DELETE</td><td>영향받은 행 수. 0이면 대상 없음 또는 조건 불일치다.</td></tr><tr><td>단건 SELECT</td><td>Optional 또는 nullable 객체. 여러 행이면 query 조건 오류다.</td></tr><tr><td>목록 SELECT</td><td>빈 List. null로 반환하지 않는다.</td></tr></table><p>자동 생성 key가 필요하면 Oracle sequence를 SQL에서 사용하거나 generated key 전략을 DB와 맞춘다. 여러 parameter는 DTO나 <code>@Param</code>으로 이름을 명확히 한다.</p><h2>동적 SQL은 결과 SQL을 확인한다</h2><pre data-lang="XML"><code>&lt;where&gt;
  &lt;if test="keyword != null and keyword != ''"&gt;
    AND title LIKE '%' || #{keyword} || '%'
  &lt;/if&gt;
&lt;/where&gt;</code></pre><p><code>#{}</code>는 값을 binding하고 <code>&#36;{}</code>는 SQL 문자열을 치환한다. 정렬 column처럼 구조를 바꿔야 할 때는 허용 목록으로 값을 제한하고, 일반 사용자 입력에는 문자열 치환을 사용하지 않는다.</p>`);

  add(6, `<h2>팀 작업의 하루 흐름을 고정한다</h2><ol><li>작업 시작 전에 main을 최신화한다.</li><li>하나의 issue 또는 기능에 대응하는 branch를 만든다.</li><li>작은 commit마다 diff와 test를 확인한다.</li><li>push 후 Pull Request 설명에 변경 이유·검증 결과·화면 또는 API 변화를 적는다.</li><li>review 반영 뒤 CI가 통과한 상태로 merge한다.</li><li>local main을 pull하고 완료 branch를 삭제한다.</li></ol><h2>충돌 해결 후 반드시 다시 검증한다</h2><p>양쪽 중 하나를 선택하고 marker만 지우면 compile은 되더라도 한쪽 기능이 사라질 수 있다. 호출부와 test까지 검색하고, DB migration 번호·package lock·공통 설정처럼 자동 merge가 위험한 파일은 담당자와 의도를 확인한다.</p><div class="note-warning"><strong>Token 보관 방식</strong><p>원문 화면의 ID와 token을 포함한 URL은 현재 사용하지 않는다. Credential Manager 또는 SSH를 사용하고, terminal history·screenshot·문서에도 token 원문을 남기지 않는다.</p></div>`);

  add(7, `<h2>Security Group은 연결 주체를 기준으로 적는다</h2><table><tr><th>대상</th><th>허용 source</th><th>원칙</th></tr><tr><td>EC2 SSH 22</td><td>관리자 현재 IP</td><td>전 세계 공개 금지</td></tr><tr><td>HTTPS 443</td><td>사용자 또는 Load Balancer</td><td>웹 공개 지점</td></tr><tr><td>Spring port</td><td>Load Balancer SG 또는 내부</td><td>직접 공개 최소화</td></tr><tr><td>RDS port</td><td>EC2 Security Group</td><td>개인 PC 전체 공개 금지</td></tr></table><h2>배포 기록은 실행 가능한 runbook으로 남긴다</h2><pre data-lang="Text"><code>VERSION=commit SHA 또는 image digest
ARTIFACT=/opt/myapp/releases/app-2026-07-17.jar
ENV_FILE=/etc/myapp/app.env
HEALTH=http://127.0.0.1:8080/actuator/health
ROLLBACK=이전 symlink 복원 후 service restart</code></pre><p>배포 시간, 실행 버전, migration, health 결과를 기록한다. 문제가 생기면 콘솔을 무작정 클릭하기보다 runbook의 process·port·health·network·DB 순서로 확인한다. 사용하지 않는 EC2, EIP, RDS snapshot, NAT Gateway가 비용을 만들지 않는지도 종료 전 확인한다.</p>`);

  add(8, `<h2>자주 사용하는 검증 명령을 한 묶음으로 둔다</h2><pre data-lang="Shell"><code># Docker
docker compose config
docker compose build --no-cache api
docker compose up -d
docker compose ps
docker compose logs -f api

# Vagrant
vagrant validate
vagrant up
vagrant status
vagrant ssh
vagrant provision</code></pre><p>image가 커지면 build context와 layer를 확인하고 <code>.dockerignore</code>에 .git, build 결과, node_modules, IDE 파일을 넣는다. DB volume을 삭제하는 <code>down -v</code>는 데이터 삭제를 의미하므로 일반 종료 명령처럼 사용하지 않는다.</p><h2>환경을 없애고 다시 만드는 시험까지 한다</h2><p>container나 VM 안에서 수동으로 설치한 package가 있다면 코드에 빠진 것이다. 새로 삭제·생성한 환경에서 provisioning이 완료되고, service가 자동 실행되며, 같은 health 응답을 내는지 본다. 공유 폴더와 Windows path 권한, line ending 차이도 새 PC 재현 과정에서 함께 확인한다.</p>`);
})();
