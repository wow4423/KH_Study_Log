(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const replace = (slug, index, body) => { category(slug).lessons[index].body = body; };

  replace("servlet-jsp", 0, `<h2>웹 서버와 WAS는 담당하는 일이 다르다</h2>
<p>브라우저는 HTTP 요청을 보내고 서버는 HTTP 응답을 돌려준다. 웹 서버는 HTML·CSS·이미지 같은 정적 파일을 빠르게 전달하거나 앞단에서 요청을 분배한다. WAS(Web Application Server)는 Java 코드 실행, 세션, 트랜잭션, 커넥션 풀처럼 동적 웹 애플리케이션에 필요한 실행 환경을 제공한다. Tomcat은 Servlet 컨테이너를 포함한 대표적인 WAS다.</p>
<table><tr><th>구성 요소</th><th>핵심 역할</th><th>대표 예</th></tr><tr><td>Browser</td><td>HTTP 요청 생성, HTML 해석과 화면 렌더링</td><td>Chrome</td></tr><tr><td>Web Server</td><td>정적 자원, TLS 종료, 프록시·로드밸런싱</td><td>Nginx, Apache</td></tr><tr><td>WAS</td><td>애플리케이션 코드 실행과 동적 응답</td><td>Tomcat</td></tr><tr><td>Servlet</td><td>요청을 읽고 비즈니스 로직을 호출해 응답 결정</td><td>HttpServlet 구현체</td></tr></table>
<h2>Servlet의 생명주기는 컨테이너가 관리한다</h2>
<p>컨테이너는 Servlet 객체를 만들고 한 번 <code>init()</code>을 호출한 뒤, 요청마다 <code>service()</code>를 실행한다. <code>HttpServlet</code>의 service는 HTTP 메서드에 따라 <code>doGet()</code>, <code>doPost()</code> 등으로 분기한다. 종료할 때는 <code>destroy()</code>가 호출된다.</p>
<pre data-lang="Java"><code>@WebServlet("/members")
public class MemberServlet extends HttpServlet {
    private MemberService memberService;

    @Override
    public void init() {
        memberService = AppConfig.memberService();
    }

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("members", memberService.findAll());
        request.getRequestDispatcher("/WEB-INF/views/member/list.jsp")
               .forward(request, response);
    }
}</code></pre>
<p>하나의 Servlet 인스턴스가 여러 요청 스레드에서 동시에 사용될 수 있다. 따라서 요청별 데이터를 필드에 저장하면 사용자 데이터가 섞일 수 있다. 변경 가능한 요청 상태는 지역 변수, request, session 등 수명에 맞는 공간에 둔다.</p>
<h2>요청과 응답에서 읽어야 할 것</h2>
<ul><li><code>getParameter()</code>: 쿼리 문자열과 폼 필드를 문자열로 읽는다.</li><li><code>getHeader()</code>: 인증·콘텐츠 협상 등 HTTP 헤더를 읽는다.</li><li><code>setCharacterEncoding("UTF-8")</code>: 요청 본문을 읽기 전에 문자 인코딩을 정한다.</li><li><code>setStatus()</code>, <code>setContentType()</code>: 응답의 의미와 형식을 명시한다.</li></ul>
<h2>forward와 redirect의 차이</h2>
<p><strong>forward</strong>는 서버 내부에서 처리 대상을 넘기므로 브라우저 주소가 바뀌지 않고 같은 request 속성을 공유한다. <strong>redirect</strong>는 3xx 응답으로 브라우저에게 새 요청을 보내라고 하므로 주소가 바뀌고 request 데이터는 사라진다. 조회 화면 렌더링은 forward, POST 성공 뒤 새로고침 중복 제출을 막을 때는 redirect가 자연스럽다.</p>
<div class="concept-flow"><span>POST 저장</span><i>→</i><span>DB 반영</span><i>→</i><span>redirect</span><i>→</i><span>GET 상세</span></div>
<blockquote><strong>핵심:</strong> Servlet은 화면을 직접 길게 출력하는 클래스가 아니라 HTTP와 애플리케이션 로직 사이를 연결하는 Controller다.</blockquote>`);

  replace("servlet-jsp", 1, `<h2>JSP는 서버에서 HTML을 만드는 View 기술이다</h2>
<p>JSP 파일은 실행 시 Servlet 소스와 클래스로 변환된다. 따라서 JSP 안에 Java 코드를 많이 쓰는 것은 View에 업무 로직을 넣는 것과 같다. Controller가 필요한 데이터를 request에 담고, JSP는 EL과 JSTL로 표시와 간단한 화면 분기만 담당하게 한다.</p>
<pre data-lang="Java"><code>// Controller
List&lt;Member&gt; members = memberService.findAll();
request.setAttribute("members", members);
request.getRequestDispatcher("/WEB-INF/views/member/list.jsp")
       .forward(request, response);</code></pre>
<pre data-lang="JSP"><code>&lt;%@ page contentType="text/html;charset=UTF-8" %&gt;
&lt;%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %&gt;

&lt;c:choose&gt;
  &lt;c:when test="\${empty members}"&gt;
    &lt;p&gt;등록된 회원이 없습니다.&lt;/p&gt;
  &lt;/c:when&gt;
  &lt;c:otherwise&gt;
    &lt;ul&gt;
      &lt;c:forEach var="member" items="\${members}"&gt;
        &lt;li&gt;&lt;c:out value="\${member.name}" /&gt;&lt;/li&gt;
      &lt;/c:forEach&gt;
    &lt;/ul&gt;
  &lt;/c:otherwise&gt;
&lt;/c:choose&gt;</code></pre>
<h2>EL은 저장 영역의 값을 간결하게 찾는다</h2>
<p><code>\${member.name}</code>은 보통 page → request → session → application 순으로 속성을 찾고 getter를 호출한다. 이름 충돌을 피하려면 <code>requestScope.member</code>처럼 범위를 명시할 수 있다. 파라미터는 <code>param.keyword</code>, 쿠키는 <code>cookie.name.value</code>로 접근한다.</p>
<table><tr><th>Scope</th><th>수명</th><th>적합한 데이터</th></tr><tr><td>request</td><td>한 요청과 forward 동안</td><td>조회 결과, 검증 오류</td></tr><tr><td>session</td><td>한 사용자의 여러 요청</td><td>로그인 사용자, 장바구니</td></tr><tr><td>application</td><td>애플리케이션 전체</td><td>공유 설정·통계</td></tr></table>
<h2>JSTL은 반복과 조건을 태그로 표현한다</h2>
<p><code>c:if</code>, <code>c:choose</code>, <code>c:forEach</code>, <code>c:url</code>이 대표적이다. 복잡한 계산이나 DB 조회를 JSTL 조합으로 해결하려 하지 말고 Controller 또는 Service에서 처리한 결과를 넘긴다.</p>
<h2>출력값은 XSS를 고려한다</h2>
<p>사용자가 입력한 문자열을 그대로 HTML에 삽입하면 스크립트가 실행될 수 있다. 일반 텍스트는 escaping되는 <code>c:out</code>을 사용하고, HTML 허용이 꼭 필요하면 서버에서 신뢰 가능한 정책으로 정화한다. JSP를 <code>WEB-INF</code> 아래에 두면 사용자가 View URL로 직접 접근하지 못해 Controller를 거치게 할 수 있다.</p>
<blockquote><strong>역할 기준:</strong> JSP는 “어떤 데이터를 가져올까?”가 아니라 “이미 준비된 데이터를 어떤 HTML로 보여줄까?”에만 답해야 한다.</blockquote>`);

  replace("servlet-jsp", 2, `<h2>SSR은 서버가 데이터가 채워진 HTML을 완성한다</h2>
<p>SSR(Server-Side Rendering)에서는 브라우저가 URL을 요청하면 서버가 데이터 조회와 View 렌더링을 끝낸 HTML을 응답한다. Servlet/JSP MVC에서는 Servlet이 Controller, Service와 DAO가 Model 준비, JSP가 View를 담당한다.</p>
<div class="concept-flow"><span>GET /members</span><i>→</i><span>Controller</span><i>→</i><span>Service·DAO</span><i>→</i><span>request attribute</span><i>→</i><span>JSP HTML</span></div>
<h2>목록 조회의 전체 흐름</h2>
<ol><li>브라우저가 <code>GET /members?page=1</code>을 요청한다.</li><li>Controller가 page를 숫자로 변환하고 범위를 검증한다.</li><li>Service가 목록 조회 유스케이스를 수행한다.</li><li>DAO가 SQL 결과를 객체 목록으로 매핑한다.</li><li>Controller가 결과를 request에 담아 JSP로 forward한다.</li><li>JSP가 반복 태그로 HTML을 만들고 브라우저가 렌더링한다.</li></ol>
<h2>등록은 PRG 패턴으로 중복 제출을 막는다</h2>
<div class="concept-flow"><span>GET 폼</span><i>→</i><span>POST 제출</span><i>→</i><span>검증·저장</span><i>→</i><span>Redirect</span><i>→</i><span>GET 결과</span></div>
<p>검증 실패라면 입력값과 오류 메시지를 request에 다시 담아 폼 JSP로 forward한다. 성공하면 상세나 목록 URL로 redirect한다. 성공 뒤 forward하면 사용자가 새로고침할 때 POST가 재전송될 수 있다.</p>
<pre data-lang="Java"><code>protected void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
    RegisterRequest form = RegisterRequest.from(req);
    Map&lt;String, String&gt; errors = validator.validate(form);

    if (!errors.isEmpty()) {
        req.setAttribute("form", form);
        req.setAttribute("errors", errors);
        req.getRequestDispatcher("/WEB-INF/views/member/form.jsp")
           .forward(req, resp);
        return;
    }

    Member saved = memberService.register(form.toCommand());
    resp.sendRedirect(req.getContextPath() + "/members/" + saved.getId());
}</code></pre>
<h2>SSR과 CSR은 경쟁 관계가 아니라 렌더링 위치의 선택이다</h2>
<table><tr><th>구분</th><th>SSR</th><th>CSR</th></tr><tr><td>첫 화면</td><td>완성 HTML 수신</td><td>JS 실행 후 API 데이터 결합</td></tr><tr><td>화면 이동</td><td>대체로 문서 재요청</td><td>클라이언트 라우팅</td></tr><tr><td>장점</td><td>단순한 흐름, 초기 콘텐츠·SEO</td><td>풍부한 상호작용, 부분 갱신</td></tr><tr><td>주의점</td><td>서버 렌더링 부하, View 중복</td><td>상태 관리, 초기 로딩, API 설계</td></tr></table>
<h2>Filter는 공통 전후 처리를 맡는다</h2>
<p>문자 인코딩, 인증 확인, 요청 로그처럼 여러 Controller에 반복되는 처리는 Filter 체인에 둔다. Filter가 요청을 막을 수도 있고 전처리 후 <code>chain.doFilter()</code>로 다음 단계에 넘긴 뒤 응답 후처리를 할 수도 있다.</p>
<blockquote><strong>복습 기준:</strong> URL 하나를 골라 요청값이 어느 객체로 변환되고, 어느 계층에서 규칙을 거치며, 어떤 데이터가 View까지 전달되는지 화살표로 그려 본다.</blockquote>`);

  replace("mybatis", 0, `<h2>MyBatis는 SQL을 숨기지 않고 JDBC 반복 코드를 줄인다</h2>
<p>MyBatis는 SQL 실행, 파라미터 바인딩, ResultSet 순회와 객체 매핑을 대신하는 SQL Mapper다. 개발자는 SQL을 직접 통제하면서도 Connection·PreparedStatement·ResultSet을 매번 작성하지 않아도 된다. 객체 상태를 중심으로 SQL을 생성하는 JPA와 달리, MyBatis는 작성한 SQL이 중심이다.</p>
<div class="concept-flow"><span>Mapper 메서드</span><i>→</i><span>Mapped Statement</span><i>→</i><span>SQL 실행</span><i>→</i><span>Result Mapping</span></div>
<h2>Mapper 인터페이스와 XML의 id가 연결된다</h2>
<pre data-lang="Java"><code>public interface MemberMapper {
    Member findById(long id);
    List&lt;Member&gt; findAll(MemberSearch condition);
    int insert(Member member);
}</code></pre>
<pre data-lang="XML"><code>&lt;mapper namespace="com.example.member.MemberMapper"&gt;
  &lt;select id="findById" parameterType="long" resultMap="memberMap"&gt;
    SELECT member_id, name, email
    FROM member
    WHERE member_id = #{id}
  &lt;/select&gt;
&lt;/mapper&gt;</code></pre>
<p><code>namespace + id</code>가 Mapper 메서드를 식별한다. 파라미터가 여러 개면 <code>@Param</code>으로 이름을 명확히 하거나 검색 조건 객체 하나로 묶는다.</p>
<h2>#{ }와 \${ }는 완전히 다르다</h2>
<p><code>#{value}</code>는 PreparedStatement의 <code>?</code>로 변환되어 안전하게 바인딩된다. <code>\${value}</code>는 문자열을 SQL에 그대로 삽입하므로 사용자 입력에 사용하면 SQL Injection 위험이 있다. 컬럼명·정렬 방향처럼 바인딩할 수 없는 구조는 서버가 정한 허용 목록에서만 선택한다.</p>
<h2>resultType과 resultMap을 구분한다</h2>
<p>열 이름과 프로퍼티 이름이 단순하게 맞으면 <code>resultType</code>으로 충분하다. 이름이 다르거나 생성자 매핑, 연관 객체, 중첩 컬렉션이 필요하면 <code>resultMap</code>으로 관계를 명시한다.</p>
<pre data-lang="XML"><code>&lt;resultMap id="memberMap" type="Member"&gt;
  &lt;id property="id" column="member_id" /&gt;
  &lt;result property="name" column="name" /&gt;
  &lt;result property="email" column="email" /&gt;
&lt;/resultMap&gt;</code></pre>
<h2>매퍼가 성공해도 설계 확인은 남는다</h2>
<ul><li>한 건 조회가 없을 때 null, Optional, 예외 중 무엇을 사용할지 정한다.</li><li>수정·삭제 반환값으로 영향 행 수를 확인한다.</li><li>SQL 로그에서 실제 바인딩과 실행 횟수를 확인한다.</li><li>Mapper에는 저장소 로직만 두고 업무 규칙은 Service에 둔다.</li></ul>
<blockquote><strong>선택 기준:</strong> 복잡한 조회 SQL을 세밀하게 통제해야 하고 팀이 SQL에 익숙하면 MyBatis가 강점이 있다.</blockquote>`);

  replace("mybatis", 1, `<h2>동적 SQL은 조건에 따라 SQL 구조를 조립한다</h2>
<p>검색 화면은 이름, 상태, 기간처럼 입력된 조건만 WHERE 절에 포함해야 한다. Java에서 문자열을 이어 붙이면 공백·AND 처리와 바인딩이 깨지기 쉽다. MyBatis의 <code>if</code>, <code>where</code>, <code>choose</code>, <code>foreach</code>, <code>set</code>은 이 조립을 구조화한다.</p>
<pre data-lang="XML"><code>&lt;select id="search" resultMap="memberMap"&gt;
  SELECT member_id, name, email, status
  FROM member
  &lt;where&gt;
    &lt;if test="keyword != null and keyword != ''"&gt;
      AND (name LIKE CONCAT('%', #{keyword}, '%')
           OR email LIKE CONCAT('%', #{keyword}, '%'))
    &lt;/if&gt;
    &lt;if test="status != null"&gt;
      AND status = #{status}
    &lt;/if&gt;
  &lt;/where&gt;
  ORDER BY member_id DESC
&lt;/select&gt;</code></pre>
<p><code>where</code>는 조건이 하나라도 있을 때 WHERE를 붙이고 맨 앞의 AND/OR를 정리한다. 그래서 모든 조건이 비어 있을 때 <code>WHERE</code>만 남는 문법 오류를 피할 수 있다.</p>
<h2>choose는 여러 분기 중 하나만 선택한다</h2>
<pre data-lang="XML"><code>&lt;choose&gt;
  &lt;when test="sort == 'name'"&gt;ORDER BY name ASC&lt;/when&gt;
  &lt;when test="sort == 'oldest'"&gt;ORDER BY member_id ASC&lt;/when&gt;
  &lt;otherwise&gt;ORDER BY member_id DESC&lt;/otherwise&gt;
&lt;/choose&gt;</code></pre>
<p>정렬 문자열을 <code>\${sort}</code>로 직접 넣지 않고 허용된 분기만 SQL로 출력하면 구조 삽입 공격을 차단한다.</p>
<h2>foreach는 IN 조건과 일괄 작업을 만든다</h2>
<pre data-lang="XML"><code>&lt;if test="ids != null and !ids.isEmpty()"&gt;
  AND member_id IN
  &lt;foreach collection="ids" item="id" open="(" separator="," close=")"&gt;
    #{id}
  &lt;/foreach&gt;
&lt;/if&gt;</code></pre>
<p>빈 목록으로 <code>IN ()</code>가 만들어지지 않도록 먼저 검사한다. 목록이 매우 크면 DB 파라미터 제한과 실행 계획에 부담이 되므로 배치 크기를 나누거나 다른 조회 전략을 검토한다.</p>
<h2>부분 수정에는 set을 사용한다</h2>
<pre data-lang="XML"><code>&lt;update id="update"&gt;
  UPDATE member
  &lt;set&gt;
    &lt;if test="name != null"&gt;name = #{name},&lt;/if&gt;
    &lt;if test="email != null"&gt;email = #{email},&lt;/if&gt;
  &lt;/set&gt;
  WHERE member_id = #{id}
&lt;/update&gt;</code></pre>
<p><code>set</code>은 마지막 쉼표를 제거한다. 다만 수정값이 하나도 없으면 잘못된 SQL이 되므로 Service에서 “변경할 필드가 최소 하나 있는가”를 먼저 검증한다.</p>
<h2>동적 SQL이 복잡해질 때의 기준</h2>
<p>조건문이 많아질수록 가능한 SQL 조합도 늘어난다. 대표 조합뿐 아니라 모든 조건 없음, 단일 조건, 복수 조건, 빈 목록을 테스트하고 SQL 로그를 확인한다. 반복되는 열 목록은 <code>sql/include</code>로 재사용하되 지나친 조각화로 완성 SQL을 읽기 어렵게 만들지는 않는다.</p>
<blockquote><strong>핵심:</strong> 동적 SQL의 목표는 태그를 많이 쓰는 것이 아니라, 가능한 SQL의 형태를 예측 가능하고 안전하게 제한하는 것이다.</blockquote>`);
})();
