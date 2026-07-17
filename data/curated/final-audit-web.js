/* 원문에서 한 실습에 뭉쳐 있던 웹 요청·프레임워크 경계를 독립 단원으로 복원한다. */
(function () {
  const find = (slug) => (window.CURATED_STUDY || []).find((item) => item.slug === slug);
  const lesson = (slug, title, summary, body, important = false) => {
    const category = find(slug);
    if (category && !category.lessons.some((item) => item.title === title)) category.lessons.push({ title, summary, body, important });
  };

  lesson("javascript", "scope·hoisting·BOM과 모듈", "변수의 유효 범위와 선언 시점, 브라우저 객체, 파일 간 의존성을 정확히 구분한다.", `<h2>scope는 변수를 어디서 찾을 수 있는지 정한다</h2><p><code>let</code>과 <code>const</code>는 block scope이고 <code>var</code>는 function scope다. JavaScript는 현재 scope에서 이름을 찾고 없으면 바깥 lexical scope로 올라간다. 함수가 선언된 위치의 바깥 변수를 기억하는 구조가 closure다.</p>
<pre data-lang="JavaScript"><code>function createCounter() {
  let count = 0;
  return () =&gt; ++count;
}
const next = createCounter();
next(); // 1
next(); // 2</code></pre>
<h3>hoisting을 ‘위로 이동’이라고만 외우면 안 된다</h3><p>선언은 실행 전에 등록되지만 초기화 시점이 다르다. function declaration은 호출 가능하고, var는 undefined로 초기화되며, let·const는 선언 줄 전까지 TDZ에 있어 접근하면 오류가 난다. 따라서 선언 전에 사용하는 코드를 피하고 const를 기본으로 선택한다.</p>
<h3>DOM과 BOM</h3><ul><li>DOM은 document와 element처럼 문서를 다룬다.</li><li>BOM은 location, history, navigator, storage처럼 브라우저 환경을 다룬다.</li><li><code>location.href</code> 변경은 새 탐색이고 History API는 SPA URL 상태를 관리한다.</li></ul>
<h3>ES Module</h3><pre data-lang="JavaScript"><code>// api.js
export async function getMembers() { /* ... */ }
// main.js
import { getMembers } from './api.js';</code></pre><p>module은 각 파일의 scope를 분리하고 명시적으로 export·import한다. 브라우저에서는 <code>type="module"</code>을 사용하며 module script는 기본적으로 defer처럼 동작한다.</p>`, true);

  lesson("javascript", "페이지를 나눈 CRUD와 상태 전달", "등록·목록·수정 화면을 분리하고 URL·storage·서버 중 상태의 주인을 선택한다.", `<h2>페이지를 나누면 메모리 변수는 유지되지 않는다</h2><p>등록 페이지에서 목록 페이지로 이동하면 이전 문서의 JavaScript 실행 환경은 끝난다. 다음 화면에 필요한 식별자는 URL query/path에, 브라우저에 남길 작은 연습 데이터는 localStorage에, 여러 사용자와 공유할 실제 데이터는 서버 DB에 둔다.</p>
<pre data-lang="JavaScript"><code>const params = new URLSearchParams(location.search);
const id = params.get('id');
const items = JSON.parse(localStorage.getItem('items') ?? '[]');
const target = items.find(item =&gt; item.id === id);</code></pre>
<h3>CRUD 한 사이클</h3><ol><li>Create: form 값을 읽고 검증한 뒤 고유 id와 함께 저장한다.</li><li>Read: 저장소에서 읽어 화면 모델을 만들고 DOM을 렌더링한다.</li><li>Update: URL의 id로 대상을 찾고 기존 값을 form에 채운 뒤 해당 항목만 교체한다.</li><li>Delete: 정말 삭제할 대상의 id를 확인하고 filter 또는 서버 DELETE 요청 후 목록을 다시 그린다.</li></ol>
<p>DOM의 text를 다시 읽어 데이터로 쓰지 말고 데이터 배열을 기준 상태로 둔다. 사용자 문자열은 <code>innerHTML</code>로 붙이지 않고 <code>textContent</code>를 사용해 script 삽입을 막는다. localStorage는 동기 API이고 사용자가 지울 수 있으며 secret 저장소가 아니다.</p>`);

  lesson("servlet-jsp", "request·response·encoding과 parameter", "Servlet이 HTTP 요청을 Java 타입으로 읽고 상태 코드·header·body로 응답하는 과정을 익힌다.", `<h2>Servlet의 입력은 HttpServletRequest, 출력은 HttpServletResponse다</h2><p>URL path, query string, header, cookie, body는 서로 다른 위치에 있다. <code>getParameter</code>는 form-urlencoded나 query parameter를 문자열로 읽으므로 숫자 변환·필수값·범위를 직접 검증한다. JSON body는 parameter가 아니라 stream을 JSON mapper로 읽는다.</p>
<pre data-lang="Java"><code>protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    req.setCharacterEncoding("UTF-8");
    String title = req.getParameter("title");
    if (title == null || title.isBlank()) {
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "제목이 필요합니다.");
        return;
    }
    resp.setStatus(HttpServletResponse.SC_CREATED);
}</code></pre>
<h3>한글이 깨지는 위치를 구분한다</h3><ul><li>POST body를 읽기 전에 request encoding을 정한다.</li><li>response body를 쓰기 전에 content type과 charset을 정한다.</li><li>소스 파일, DB column, JDBC 연결 encoding까지 한 규칙으로 맞춘다.</li></ul>
<p><code>doGet</code>은 조회와 화면 진입, <code>doPost</code>는 생성·처리에 사용한다. 메서드 이름만 나누는 것이 아니라 새로고침과 캐시, URL 공유, 멱등성까지 HTTP 의미가 달라진다.</p>`, true);

  lesson("servlet-jsp", "forward·redirect·scope·session·cookie", "요청이 이어지는 범위와 사용자 상태가 유지되는 범위를 구분해 화면 이동을 선택한다.", `<h2>forward는 같은 요청, redirect는 새 요청이다</h2><table><tr><th>구분</th><th>forward</th><th>redirect</th></tr><tr><td>요청 수</td><td>서버 내부 이동, 1회</td><td>302 응답 후 브라우저 재요청, 2회</td></tr><tr><td>주소창</td><td>처음 URL 유지</td><td>새 URL로 변경</td></tr><tr><td>request attribute</td><td>유지</td><td>사라짐</td></tr><tr><td>대표 사용</td><td>조회 결과를 JSP에 전달</td><td>POST 성공 후 목록으로 이동</td></tr></table>
<p>POST 처리 후 redirect하는 PRG 패턴은 새로고침으로 같은 등록이 반복되는 것을 막는다. 실패한 입력을 다시 보여줘야 한다면 request에 오류와 입력값을 담아 form JSP로 forward할 수 있다.</p>
<h3>상태가 살아 있는 범위</h3><ul><li><strong>request:</strong> 한 요청과 forward 동안만</li><li><strong>session:</strong> 같은 사용자의 여러 요청 동안, 서버에 저장</li><li><strong>application:</strong> 웹 애플리케이션 전체 사용자가 공유</li><li><strong>cookie:</strong> 브라우저가 보관해 조건에 맞는 요청마다 전송</li></ul>
<p>session에는 로그인 사용자 식별자처럼 서버가 신뢰할 최소 상태를 두고, 큰 목록이나 민감한 원문 객체를 계속 쌓지 않는다. 로그아웃은 session invalidation과 인증 cookie 만료를 함께 처리한다.</p>`, true);

  lesson("servlet-jsp", "Filter·Listener와 웹 애플리케이션 생명주기", "Controller 전후의 공통 처리와 서버 시작·세션 이벤트를 적절한 확장 지점에 배치한다.", `<h2>Filter는 Servlet에 도달하기 전과 응답이 나간 뒤를 감싼다</h2><pre data-lang="Java"><code>public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {
    long start = System.currentTimeMillis();
    try {
        chain.doFilter(request, response);
    } finally {
        log.info("elapsed={}ms", System.currentTimeMillis() - start);
    }
}</code></pre>
<p>encoding, 인증 확인, 공통 logging처럼 URL 범위 전체에 적용되는 관심사에 적합하다. <code>chain.doFilter</code>를 호출하지 않으면 다음 filter와 Servlet로 진행하지 않는다. response를 이미 작성한 뒤 chain을 호출하거나, chain 이후에 status를 바꾸는 실수를 조심한다.</p>
<h3>Listener는 사건을 관찰한다</h3><ul><li>ServletContextListener: 애플리케이션 시작·종료 시 초기화와 정리</li><li>HttpSessionListener: session 생성·소멸 통계나 정리</li><li>attribute listener: 범위 객체의 속성 변경 관찰</li></ul><p>Listener에서 긴 작업을 동기 실행하면 서버 시작이나 요청을 막을 수 있다. DB 연결 자체는 container pool이 관리하게 하고 listener에는 가벼운 초기 검증만 둔다.</p>`);

  lesson("mybatis", "MyBatis 초기 설정과 Mapper 연결", "의존성·DataSource·config·mapper XML·interface가 어떤 이름으로 연결되는지 단계별로 확인한다.", `<h2>MyBatis는 SQL을 없애는 도구가 아니라 SQL 실행과 객체 매핑을 맡는다</h2><p>Spring Boot에서는 starter와 DB driver를 추가하고 DataSource 접속 정보를 설정한다. mapper XML 위치, type alias package, mapper interface scan 범위가 실제 폴더·package와 일치해야 한다.</p>
<pre data-lang="YAML"><code>spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:xe
    username: app_user
    password: \${DB_PASSWORD}
mybatis:
  mapper-locations: classpath:/mappers/**/*.xml
  type-aliases-package: com.example.member.model</code></pre>
<pre data-lang="XML"><code>&lt;mapper namespace="com.example.member.MemberMapper"&gt;
  &lt;select id="findById" parameterType="long" resultType="Member"&gt;
    SELECT member_id AS memberId, name FROM member WHERE member_id = #{id}
  &lt;/select&gt;
&lt;/mapper&gt;</code></pre>
<h3>연결 오류를 읽는 순서</h3><ol><li>namespace가 interface 전체 이름과 같은가?</li><li>statement id가 method 이름과 같은가?</li><li>XML이 mapper-locations 경로 안에 있고 build 결과에 복사됐는가?</li><li><code>#{}</code> 이름이 단일 parameter 또는 <code>@Param</code> 이름과 같은가?</li><li>DB column과 DTO property가 alias 또는 resultMap으로 연결됐는가?</li></ol>`, true);

  lesson("mybatis", "parameter binding·resultMap·동적 SQL 실전", "문자열 치환과 안전한 binding을 구분하고 복잡한 조회 결과를 명시적으로 매핑한다.", `<h2><code>#{}</code>와 <code>\${}</code>는 안전성이 완전히 다르다</h2><p><code>#{value}</code>는 PreparedStatement parameter로 binding되어 값과 SQL 구조가 분리된다. <code>\${value}</code>는 SQL 문자열에 그대로 치환되므로 사용자 입력에 사용하면 injection이 발생한다. 정렬 컬럼처럼 구조를 바꿔야 한다면 Java나 <code>choose</code>에서 허용 목록으로 선택한다.</p>
<pre data-lang="XML"><code>&lt;where&gt;
  &lt;if test="keyword != null and keyword != ''"&gt;
    AND (title LIKE '%' || #{keyword} || '%' OR content LIKE '%' || #{keyword} || '%')
  &lt;/if&gt;
  &lt;if test="status != null"&gt;AND status = #{status}&lt;/if&gt;
&lt;/where&gt;
ORDER BY created_at DESC, board_id DESC</code></pre>
<h3>resultMap을 쓰는 경우</h3><p>column명과 property명이 많이 다르거나 constructor·중첩 객체·1:N collection을 매핑할 때 resultMap을 사용한다. JOIN으로 부모 행이 반복되면 <code>&lt;id&gt;</code> 매핑이 있어야 MyBatis가 같은 부모를 합칠 수 있다. 하지만 대형 1:N 결과는 행이 폭증하므로 두 번의 제한된 query나 전용 DTO가 더 단순할 수 있다.</p>`);

  lesson("spring-mvc", "Interceptor·ControllerAdvice·요청 생명주기", "Spring MVC 안에서 공통 전후 처리와 예외 응답을 Filter와 구분해 설계한다.", `<h2>Filter와 Interceptor는 보이는 정보가 다르다</h2><p>Filter는 Servlet container 단계에서 동작해 모든 요청의 encoding·보안·저수준 logging에 적합하다. Interceptor는 DispatcherServlet이 Handler를 찾은 뒤 동작하므로 어떤 Controller method가 실행되는지 알고 로그인 사용자 검사·권한·업무 logging을 처리하기 좋다.</p>
<div class="concept-flow"><span>Filter</span><i>→</i><span>DispatcherServlet</span><i>→</i><span>Interceptor preHandle</span><i>→</i><span>Controller</span><i>→</i><span>postHandle</span><i>→</i><span>afterCompletion</span></div>
<h3>예외는 Controller마다 try-catch하지 않는다</h3><pre data-lang="Java"><code>@RestControllerAdvice
class ApiExceptionHandler {
  @ExceptionHandler(MemberNotFoundException.class)
  ResponseEntity&lt;ErrorResponse&gt; handle(MemberNotFoundException e) {
    return ResponseEntity.status(404).body(new ErrorResponse("MEMBER_NOT_FOUND", e.getMessage()));
  }
}</code></pre>
<p>업무 예외를 HTTP status와 안정적인 오류 code로 변환하고 stack trace나 내부 SQL을 client에 노출하지 않는다. Validation 오류는 어느 field가 왜 실패했는지 구조화한다. 예상하지 못한 오류는 correlation id와 함께 서버 log에 남긴다.</p>`, true);

  lesson("spring-core", "Bean 생명주기·scope·profile과 설정 분리", "Spring 객체가 생성되고 주입되는 시점과 환경별 설정의 경계를 이해한다.", `<h2>Bean은 container가 생성·연결·관리하는 객체다</h2><div class="concept-flow"><span>정의 읽기</span><i>→</i><span>인스턴스 생성</span><i>→</i><span>의존성 주입</span><i>→</i><span>초기화</span><i>→</i><span>사용</span><i>→</i><span>소멸</span></div>
<p>singleton bean은 애플리케이션에서 한 인스턴스를 공유하므로 요청별 값을 field에 보관하면 여러 사용자가 섞인다. Service는 가능한 stateless하게 만들고 요청 데이터는 method의 지역 변수로 전달한다. prototype은 요청할 때마다 새 객체지만 소멸 관리는 container가 끝까지 맡지 않는다는 점을 구분한다.</p>
<h3>생성자 주입을 기본으로 쓰는 이유</h3><ul><li>필수 의존성이 누락된 객체를 만들 수 없다.</li><li>field를 final로 두고 테스트에서 명시적으로 대체할 수 있다.</li><li>순환 의존성이 시작 단계에서 드러난다.</li></ul>
<h3>profile과 외부 설정</h3><p>공통 설정은 application.yml, 환경 차이는 profile 또는 환경 변수로 주입한다. DB 비밀번호·JWT secret·AWS key는 저장소에 commit하지 않는다. <code>@ConfigurationProperties</code>로 관련 설정을 묶고 시작 시 validation하면 잘못된 운영 설정으로 요청을 받기 전에 실패할 수 있다.</p>`);

  lesson("react", "custom hook·memoization과 렌더링 최적화", "재사용 로직을 hook으로 추출하고 useMemo·useCallback을 필요한 경우에만 적용한다.", `<h2>custom hook은 화면이 아니라 상태 로직을 재사용한다</h2><pre data-lang="JSX"><code>function useMembers(query) {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() =&gt; {
    const controller = new AbortController();
    getMembers(query, controller.signal)
      .then(data =&gt; setState({ data, loading: false, error: null }))
      .catch(error =&gt; { if (error.name !== 'AbortError') setState(s =&gt; ({ ...s, loading: false, error })); });
    return () =&gt; controller.abort();
  }, [query]);
  return state;
}</code></pre>
<p>이름은 use로 시작하고 내부에서 다른 hook을 호출할 수 있다. API 함수 자체, UI 컴포넌트, 상태 동기화 hook을 분리하면 테스트와 재사용 기준이 명확해진다.</p>
<h3>무조건 memo하면 더 빨라지지 않는다</h3><ul><li><code>useMemo</code>는 비용이 큰 계산 결과를 dependency가 같을 때 재사용한다.</li><li><code>useCallback</code>은 함수 identity를 재사용하며 memoized child나 effect dependency에 실제 영향이 있을 때 쓴다.</li><li><code>React.memo</code>는 props가 같을 때 child render를 건너뛰지만 비교 비용이 추가된다.</li></ul><p>먼저 React DevTools Profiler로 느린 component와 반복 render 원인을 확인한다. state를 필요한 위치 가까이 두고 effect로 계산 가능한 값을 다시 state에 저장하지 않는 구조 개선이 memo보다 우선이다.</p>`);

  lesson("jpa", "cascade·orphanRemoval과 도메인 상태 전이", "연관 객체의 저장·삭제 전파를 생명주기 소유권과 업무 상태 변화 기준으로 선택한다.", `<h2>cascade는 연관관계 매핑이 아니라 영속성 작업의 전파다</h2><p>부모를 저장할 때 자식도 함께 저장하는 <code>PERSIST</code>, 부모 삭제 때 자식도 삭제하는 <code>REMOVE</code> 등이 있다. 다른 Aggregate에서도 공유하는 객체에 REMOVE를 사용하면 예상하지 못한 데이터가 사라질 수 있다. 자식의 생명주기를 부모가 완전히 소유할 때만 <code>ALL</code>과 <code>orphanRemoval</code>을 고려한다.</p>
<pre data-lang="Java"><code>@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private final List&lt;OrderItem&gt; items = new ArrayList&lt;&gt;();

public void addItem(OrderItem item) {
    items.add(item);
    item.assignOrder(this);
}</code></pre>
<h3>삭제 대신 상태 전이가 필요한 데이터</h3><p>주문·결제·근태·급여처럼 이력이 중요한 데이터는 행을 지우기보다 READY → CONFIRMED → CANCELLED 같은 허용 상태 전이를 method로 제한한다. 변경 시각과 변경 주체를 기록하고 확정 뒤 수정 불가 같은 규칙을 domain과 transaction 안에서 보장한다.</p>
<h3>Master·Detail 구조</h3><p>급여 지급 건과 여러 급여 항목처럼 한 업무 단위와 상세 내역을 분리하면 합계·확정 상태는 master, 개별 금액과 계산 근거는 detail에 둔다. API DTO로 필요한 형태를 조립하고 Entity 전체를 그대로 JSON으로 내보내지 않는다.</p>`, true);

  lesson("jpa", "조회 성능·집계·이력 테이블 설계", "프로젝트 실습에서 반복된 N+1·대시보드 집계·변경 이력을 조회 목적에 맞게 설계한다.", `<h2>목록 화면은 Entity graph 전체를 필요로 하지 않는다</h2><p>직원 목록에 부서명과 직급명만 필요하다면 fetch join 또는 DTO projection으로 한 번에 가져온다. 모든 연관관계를 EAGER로 바꾸면 다른 API까지 거대한 join을 만들고 paging 결과가 깨질 수 있다. query 수와 반환 행 수를 함께 측정한다.</p>
<h3>대시보드 집계는 행 조회 후 Java 반복문만이 답이 아니다</h3><pre data-lang="SQL"><code>SELECT department_id,
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS active_count
FROM employee
GROUP BY department_id;</code></pre><p>DB가 잘하는 grouping과 조건 집계를 사용하되, 서로 기준 시각이 다른 숫자를 한 화면에 보여줄 때는 조회 기준일을 명확히 통일한다. 빈 데이터는 0인지 “집계 전”인지 업무 의미를 구분한다.</p>
<h3>현재 상태와 변경 이력을 분리한다</h3><p>employee에는 현재 부서·직급을 두고 employee_history에는 변경 전후 값, 적용일, 사유, 처리자를 남길 수 있다. 한 transaction에서 현재 상태 수정과 이력 insert가 함께 성공해야 한다. 이력은 사후 덮어쓰기보다 추가 기록을 원칙으로 해 추적 가능성을 보존한다.</p>`);
})();
