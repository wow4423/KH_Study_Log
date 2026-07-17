/* 원문 필기에서 반복해 풀어 쓴 순서와 실수 지점을 기준으로 웹 백엔드 장을 보강한다. */
(function () {
  const find = (slug, index) => (window.CURATED_STUDY || []).find((c) => c.slug === slug)?.lessons[index];
  const add = (slug, index, html) => { const lesson = find(slug, index); if (lesson) lesson.body += html; };

  add("jdbc", 0, `<h2>처음에는 일곱 단계를 순서대로 손으로 써 본다</h2>
  <p>JDBC는 문법 하나가 아니라 Java 프로그램이 DB에 질문하고 답을 돌려받는 전체 절차다. 처음부터 Template이나 framework로 감추면 어느 단계에서 실패했는지 알기 어렵다. 아래 순서를 한 번은 직접 구현해 보는 것이 중요하다.</p>
  <ol><li>JDBC driver를 준비한다.</li><li><code>DriverManager</code> 또는 <code>DataSource</code>에서 Connection을 얻는다.</li><li>SQL을 문자열로 작성한다.</li><li><code>PreparedStatement</code>를 만들고 물음표 자리에 값을 binding한다.</li><li><code>executeUpdate</code> 또는 <code>executeQuery</code>로 실행한다.</li><li>조회라면 ResultSet cursor를 이동하며 Java 객체로 옮긴다.</li><li>ResultSet·Statement·Connection을 역순으로 닫는다.</li></ol>
  <pre data-lang="Java"><code>String sql = "SELECT book_no, title, price FROM book WHERE book_no = ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement pstmt = conn.prepareStatement(sql)) {
  pstmt.setLong(1, bookNo);
  try (ResultSet rs = pstmt.executeQuery()) {
    if (rs.next()) {
      return new Book(rs.getLong("book_no"), rs.getString("title"), rs.getInt("price"));
    }
  }
}
return null;</code></pre>
  <h3>executeUpdate와 executeQuery를 결과 모양으로 구분한다</h3>
  <p>INSERT·UPDATE·DELETE는 table을 변경하고 영향받은 행 수를 정수로 돌려준다. SELECT는 행과 열로 된 ResultSet을 돌려준다. 단건 조회는 <code>if (rs.next())</code>, 여러 건 조회는 <code>while (rs.next())</code>로 cursor 이동 방식이 달라진다.</p>
  <div class="note-warning"><strong>PreparedStatement의 핵심</strong><p>값을 SQL 문자열에 직접 더하지 않는다. SQL 구조와 값을 분리해야 따옴표 실수와 SQL injection을 막고 타입에 맞게 전달할 수 있다.</p></div>`);

  add("jdbc", 1, `<h2>한 요청이 세 계층을 통과하는 모습을 먼저 그린다</h2>
  <div class="concept-flow"><span>사용자 입력</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>DAO</span><i>→</i><span>DB</span></div>
  <p>Controller는 입력을 받고 결과를 출력하는 창구다. Service는 회원가입 가능 여부, 작성자만 수정 가능 같은 업무 규칙을 판단하는 관리자다. DAO는 전달받은 값으로 SQL을 실행하는 DB 전담 계층이다. VO·DTO는 이 사이에서 데이터를 묶어 운반한다.</p>
  <h3>왜 한 클래스에 전부 넣지 않을까?</h3>
  <p>처음에는 메뉴 출력과 SQL을 한 메서드에 넣는 편이 짧아 보인다. 하지만 DB가 바뀌거나 검증 규칙이 추가되면 입력 코드와 SQL까지 함께 흔들린다. 역할을 나누면 화면 입력 방식이 바뀌어도 DAO는 유지되고, SQL이 바뀌어도 Controller는 영향을 덜 받는다.</p>
  <pre data-lang="Java"><code>// Controller
int result = memberService.join(new Member(email, password, nickname));

// Service
if (memberDao.existsByEmail(conn, member.getEmail())) return DUPLICATED;
return memberDao.insert(conn, member);

// DAO
return pstmt.executeUpdate();</code></pre>
  <p>계층을 나눴다는 사실보다 요청 하나를 골라 ‘누가 입력을 받고, 누가 규칙을 판단하고, 누가 SQL을 실행하는가’를 말할 수 있어야 한다.</p>`);

  add("jdbc", 2, `<h2>CRUD마다 달라지는 부분과 반복되는 부분을 분리한다</h2>
  <table><tr><th>기능</th><th>SQL 결과</th><th>Java에서 확인할 것</th></tr><tr><td>Create</td><td>INSERT 영향 행 수</td><td>1이면 등록 성공</td></tr><tr><td>Read one</td><td>ResultSet 0~1행</td><td>없을 때 null·Optional·예외 중 정책</td></tr><tr><td>Read list</td><td>ResultSet 여러 행</td><td>while로 List에 누적</td></tr><tr><td>Update/Delete</td><td>영향 행 수</td><td>대상이 없거나 권한이 없을 때 구분</td></tr></table>
  <p>SQL 문장만 바뀌고 Connection 준비, parameter binding, 실행, 결과 해석, 자원 반환은 반복된다. 그래서 JDBCTemplate 같은 공통 도구를 만들지만, 업무 규칙까지 DAO 공통 코드에 넣지는 않는다.</p>
  <h3>게시판 실습에서 CRUD보다 중요했던 규칙</h3>
  <p>수정과 삭제는 번호가 존재하는지만 보면 부족하다. 현재 로그인 사용자가 작성자인지도 검사해야 한다. 상세 조회 시에만 조회수를 증가시키는 규칙도 목록 조회 DAO가 아니라 상세조회 use case 안에서 다뤄야 한다. 이런 조건이 Service가 존재하는 이유다.</p>
  <div class="note-warning"><strong>ORA-01722 같은 오류를 만났다면</strong><p>문자열을 숫자 열과 비교했는지, binding 순서가 물음표 순서와 같은지, VO field 타입과 DB column 타입이 맞는지부터 확인한다.</p></div>`);

  add("jdbc", 3, `<h2>트랜잭션은 SQL 한 줄이 아니라 업무 한 건의 경계다</h2>
  <p>계좌 이체는 출금 UPDATE와 입금 UPDATE 두 줄이지만 사용자에게는 하나의 업무다. 둘 중 하나만 반영되면 데이터가 깨진다. 따라서 Service가 Connection 하나를 열고 auto commit을 끈 뒤 두 DAO에 같은 Connection을 전달해야 한다.</p>
  <pre data-lang="Java"><code>Connection conn = null;
try {
  conn = dataSource.getConnection();
  conn.setAutoCommit(false);
  accountDao.withdraw(conn, from, amount);
  accountDao.deposit(conn, to, amount);
  conn.commit();
} catch (Exception e) {
  if (conn != null) conn.rollback();
  throw e;
} finally {
  if (conn != null) conn.close();
}</code></pre>
  <p>각 DAO가 자기 Connection을 만들면 서로 다른 트랜잭션이 되어 한쪽만 commit될 수 있다. 조회는 데이터를 바꾸지 않아 commit이 필요 없지만, 같은 업무 안에서 변경과 조회가 섞이면 전체 경계를 Service 기준으로 본다.</p>
  <h3>Connection Pool은 Connection을 없애는 기술이 아니다</h3>
  <p>DB 연결 생성 비용이 크기 때문에 미리 만든 연결을 빌리고 반납한다. <code>close()</code>는 실제 socket을 반드시 끊는다는 뜻이 아니라 pool 구현에서는 반납을 의미한다. 닫지 않으면 pool이 고갈되어 처음에는 되다가 어느 순간 모든 요청이 기다리게 된다.</p>`);

  add("servlet-jsp", 0, `<h2>Web Server·WAS·Servlet을 한 요청 안에서 구분한다</h2>
  <p>Web Server는 HTML·CSS·이미지 같은 정적 파일을 그대로 전달하는 데 강하다. WAS는 Java 코드 실행, Session, DB 연동처럼 동적인 처리를 맡는다. Servlet은 WAS 안에서 URL 요청을 받아 Java로 처리하는 객체다.</p>
  <div class="concept-flow"><span>브라우저 요청</span><i>→</i><span>WAS</span><i>→</i><span>URL mapping</span><i>→</i><span>Servlet</span><i>→</i><span>응답</span></div>
  <h3>Servlet 객체는 요청마다 새로 만드는 것이 아니다</h3>
  <p>Container가 Servlet을 생성하고 초기화한 뒤 여러 요청에서 재사용한다. 요청마다 request와 response는 달라지지만 Servlet instance field는 여러 thread가 함께 볼 수 있으므로 사용자별 값을 field에 저장하면 안 된다. 로그인 상태는 Session, 요청 중간 값은 request attribute를 사용한다.</p>
  <p>GET은 주로 조회이며 parameter가 URL에 보인다. POST는 body로 데이터를 보내 등록·변경에 사용한다. 둘의 차이를 보안 수준으로만 외우지 말고 HTTP 의미와 mapping을 함께 본다.</p>`);

  add("servlet-jsp", 1, `<h2>JSP가 필요한 이유부터 다시 연결한다</h2>
  <p>Servlet에서 <code>out.println("&lt;html&gt;...")</code>로 화면을 만들면 Java 로직과 HTML이 뒤섞여 수정하기 어렵다. JSP는 Controller가 준비한 데이터를 받아 HTML 중심으로 출력하기 위해 나온 View 기술이다. JSP 안에서 다시 DB를 조회하거나 업무 규칙을 실행하면 분리한 의미가 사라진다.</p>
  <h3>Controller에서 JSP까지 데이터가 이동하는 순서</h3>
  <pre data-lang="Java"><code>List&lt;Member&gt; members = memberService.findAll();
request.setAttribute("members", members);
request.getRequestDispatcher("/WEB-INF/views/member/list.jsp")
       .forward(request, response);</code></pre>
  <pre data-lang="JSP"><code>&lt;c:forEach var="member" items="\${members}"&gt;
  &lt;li&gt;\${member.nickname}&lt;/li&gt;
&lt;/c:forEach&gt;</code></pre>
  <p><code>setAttribute</code>는 request라는 운반 상자에 값을 넣는다. forward는 같은 request를 JSP에 넘기므로 EL로 값을 꺼낼 수 있다. WEB-INF 아래에 JSP를 두면 사용자가 JSP 주소를 직접 열지 못하고 Controller를 거치게 된다.</p>
  <figure class="console-shot"><img src="assets/notion-guide/jsp-web-inf.png" alt="Eclipse에서 WEB-INF 아래에 JSP 파일을 만드는 화면" loading="lazy"><figcaption>원문에서 위치를 기억하려고 남긴 화면이다. JSP는 WEB-INF 아래의 views 폴더에 두고 Controller가 view 이름으로 forward하게 한다. 실제 폴더명은 프로젝트의 ViewResolver 설정과 반드시 맞춘다.</figcaption></figure>
  <h3>EL과 JSTL의 역할</h3>
  <p>EL은 attribute와 객체 property를 간단히 읽고, JSTL은 조건과 반복을 태그로 표현한다. scriptlet Java 코드를 JSP에 늘리기보다 Controller·Service에서 계산을 끝내고 View에는 표시 판단만 남긴다.</p>`);

  add("servlet-jsp", 2, `<h2>SSR 목록 요청을 처음부터 끝까지 따라간다</h2>
  <ol><li>브라우저가 <code>GET /boards</code>를 요청한다.</li><li>Controller가 요청을 받고 Service의 목록 use case를 호출한다.</li><li>Service가 DAO를 통해 DB 결과를 List로 받는다.</li><li>Controller가 List를 request attribute에 넣는다.</li><li>JSP로 forward하면 server에서 완성된 HTML이 만들어진다.</li><li>브라우저는 완성된 HTML을 받아 화면에 그린다.</li></ol>
  <h3>forward와 redirect는 목적이 다르다</h3>
  <p>조회 결과를 JSP에 보여 줄 때는 같은 요청을 내부에서 넘기는 forward가 어울린다. 등록 POST가 성공한 뒤 forward로 목록을 보여 주면 새로고침할 때 등록 요청이 다시 전송될 수 있다. 그래서 등록 후에는 목록 URL로 redirect하고 브라우저가 새 GET 요청을 하게 만드는 PRG 패턴을 사용한다.</p>
  <div class="concept-flow"><span>POST 등록</span><i>→</i><span>DB commit</span><i>→</i><span>redirect /boards</span><i>→</i><span>GET 목록</span></div>
  <p>SSR은 ‘오래된 기술’이라는 뜻이 아니라 HTML을 어디에서 완성하느냐의 구분이다. React CSR과 비교할 때도 요청·데이터·화면 생성 위치로 설명한다.</p>`);

  add("mybatis", 0, `<h2>JDBC에서 무엇을 대신해 주는지 정확히 본다</h2>
  <p>MyBatis는 DB나 JPA가 아니라 SQL mapper다. Connection과 PreparedStatement 반복 코드, ResultSet을 객체로 옮기는 코드를 줄여 주지만 SQL 자체는 개발자가 작성한다. 따라서 SQL을 직접 제어하면서 Java 계층의 반복을 줄이고 싶을 때 적합하다.</p>
  <div class="concept-flow"><span>Mapper interface 메서드</span><i>↔</i><span>namespace + id</span><i>↔</i><span>SQL</span><i>↔</i><span>resultMap</span></div>
  <h3>연결 규칙 네 가지</h3>
  <ol><li>XML namespace는 Mapper interface의 전체 이름과 맞춘다.</li><li>statement id는 interface method 이름과 맞춘다.</li><li>parameter 이름은 <code>#{}</code> binding 이름과 맞춘다.</li><li>DB column과 Java field가 다르면 alias 또는 resultMap을 사용한다.</li></ol>
  <p>이 중 하나가 틀리면 application은 시작돼도 특정 메서드를 호출할 때 statement를 찾지 못하거나 값이 null로 매핑된다. 오류 문구에서 namespace·id·property 이름을 그대로 비교한다.</p>`);

  add("mybatis", 1, `<h2>동적 SQL은 Java에서 SQL 문자열을 더하지 않기 위한 기능이다</h2>
  <p>검색어, 상태, 날짜가 선택적으로 들어오는 화면에서 모든 조합의 SQL을 따로 만들 수는 없다. MyBatis의 <code>if</code>·<code>where</code>·<code>set</code>·<code>foreach</code>가 조건에 맞는 조각만 안전하게 조립한다.</p>
  <pre data-lang="XML"><code>&lt;select id="search" resultMap="boardMap"&gt;
  SELECT board_no, title, writer_no
  FROM board
  &lt;where&gt;
    &lt;if test="keyword != null and keyword != ''"&gt;
      AND title LIKE '%' || #{keyword} || '%'
    &lt;/if&gt;
    &lt;if test="writerNo != null"&gt;
      AND writer_no = #{writerNo}
    &lt;/if&gt;
  &lt;/where&gt;
&lt;/select&gt;</code></pre>
  <p><code>where</code>는 조건이 있을 때만 WHERE를 붙이고 첫 AND·OR를 정리한다. <code>set</code>은 동적 UPDATE의 마지막 쉼표를 처리한다. 구조를 직접 넣는 <code>\${}</code>는 injection 위험이 있으므로 정렬 column도 허용 목록으로 변환한다.</p>`);

  add("mybatis", 2, `<h2>Mapper가 commit을 결정하지 않는다</h2>
  <p>MyBatis가 SQL 실행을 편하게 만들어도 트랜잭션의 의미는 바뀌지 않는다. 회원 등록과 프로필 등록이 하나의 업무라면 Service method 하나의 transaction 안에서 두 Mapper를 호출한다. 중간 예외가 바깥으로 전달돼야 Spring이 rollback할 수 있다.</p>
  <pre data-lang="Java"><code>@Transactional
public Long join(JoinRequest request) {
  if (memberMapper.existsByEmail(request.email())) {
    throw new DuplicateEmailException();
  }
  memberMapper.insertMember(request);
  memberMapper.insertProfile(request);
  return request.memberNo();
}</code></pre>
  <p>예외를 catch한 뒤 성공처럼 반환하면 transaction interceptor는 실패를 알 수 없다. 복구할 수 없는 예외는 의미 있는 업무 예외로 바꿔 다시 던지고, ControllerAdvice가 HTTP 응답으로 번역하게 한다.</p>`);

  add("mybatis", 3, `<h2>N+1은 화면이 아니라 SQL 로그에서 발견한다</h2>
  <p>게시글 목록 20건을 한 번 조회한 뒤 각 글의 작성자를 찾는 SELECT가 20번 더 실행되면 총 21번의 query가 발생한다. 화면은 정상이라 놓치기 쉽지만 데이터가 늘면 급격히 느려진다.</p>
  <p>JOIN으로 한 번에 가져올지, 필요한 ID를 모아 IN query로 가져올지, 화면 DTO에 필요한 열만 조회할지 선택한다. 무조건 모든 관계를 JOIN하면 중복 행과 paging 문제가 생길 수 있어 실제 화면의 데이터 모양을 기준으로 한다.</p>
  <h3>페이징 query는 목록과 전체 개수를 나눈다</h3>
  <p>현재 페이지 content를 가져오는 query와 전체 페이지 수 계산을 위한 count query는 목적이 다르다. 정렬 순서는 중복되지 않도록 PK 같은 보조 기준을 함께 두고, SQL log에서 parameter·실행 횟수·실행 계획을 확인한다.</p>
  <div class="note-warning"><strong>진단 순서</strong><p>기능 체감만 보지 말고 SQL 로그 → 호출 횟수 → parameter → 실행 계획 → index 순으로 원인을 좁힌다.</p></div>`);

  add("spring-mvc", 0, `<h2>Spring이 객체를 대신 만들고 연결한다는 뜻</h2>
  <p>Controller 안에서 <code>new MemberService()</code>, Service 안에서 <code>new MemberDao()</code>를 직접 만들면 구현 교체와 test가 어렵다. Spring Container가 Bean을 만들고 생성자 parameter에 필요한 Bean을 넣어 주는 것이 IoC와 DI의 실제 모습이다.</p>
  <pre data-lang="Java"><code>@RestController
@RequiredArgsConstructor
class MemberController {
  private final MemberService memberService;
}</code></pre>
  <h3>요청은 DispatcherServlet부터 시작한다</h3>
  <div class="concept-flow"><span>Request</span><i>→</i><span>DispatcherServlet</span><i>→</i><span>HandlerMapping</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>Repository</span></div>
  <p>DispatcherServlet은 모든 요청의 로직을 처리하지 않고 URL에 맞는 Controller를 찾아 호출하는 중앙 관제 역할을 한다. Controller는 HTTP 입력·출력, Service는 use case와 transaction, Repository는 저장소 접근을 담당한다.</p>`);

  add("spring-mvc", 1, `<h2>REST 응답은 JSON만 뜻하지 않는다</h2>
  <p>REST API는 resource를 URL로 표현하고 HTTP method로 행동을 구분하며 상태 코드로 결과를 전달한다. 같은 <code>/members</code>에서 GET은 조회, POST는 등록, <code>/members/{id}</code>의 PATCH는 일부 수정, DELETE는 삭제 의미를 갖는다.</p>
  <table><tr><th>상황</th><th>대표 상태</th></tr><tr><td>조회·수정 성공</td><td>200</td></tr><tr><td>등록 성공</td><td>201</td></tr><tr><td>본문 없는 삭제 성공</td><td>204</td></tr><tr><td>요청값 오류</td><td>400</td></tr><tr><td>인증 필요</td><td>401</td></tr><tr><td>권한 부족</td><td>403</td></tr><tr><td>대상 없음</td><td>404</td></tr></table>
  <p><code>ResponseEntity</code>는 body뿐 아니라 status와 header를 함께 명확히 만들 때 사용한다. 모든 실패를 200과 문자열 메시지로 돌려주면 client가 HTTP 의미를 활용할 수 없다.</p>`);

  add("spring-mvc", 2, `<h2>파일 업로드 요청은 일반 JSON 요청과 모양이 다르다</h2>
  <p>파일은 큰 binary 데이터라 <code>multipart/form-data</code>로 여러 part를 나눠 보낸다. Form 방식과 fetch 방식 모두 server의 MultipartFile로 받을 수 있지만, fetch에서 FormData를 보낼 때 Content-Type boundary는 browser가 만들게 두어야 한다.</p>
  <pre data-lang="JavaScript"><code>const formData = new FormData();
formData.append('file', input.files[0]);
formData.append('memberNo', memberNo);
await fetch('/api/files', { method: 'POST', body: formData });</code></pre>
  <p>server에서는 원본 파일명을 그대로 저장 경로로 사용하지 않고 새 이름을 만든다. 크기·확장자·실제 content type을 검증하고 저장 실패 시 DB 기록도 rollback하거나 정리한다.</p>
  <h3>페이징 계산은 네 값을 순서대로 만든다</h3>
  <p>전체 행 수로 maxPage를 구하고, 현재 page와 pageLimit로 startPage·endPage를 계산한 뒤 maxPage를 넘지 않게 보정한다. DB query에는 <code>offset=(page-1)*boardLimit</code>과 limit을 전달한다. 화면 번호와 DB offset을 같은 값으로 착각하지 않는다.</p>`);

  add("spring-mvc", 3, `<h2>DispatcherServlet 뒤에서 자동으로 일어나는 것</h2>
  <p>요청 URL과 method에 맞는 HandlerMethod를 찾고, HandlerAdapter가 parameter를 해석해 Controller method를 호출한다. 반환값이 View 이름이면 ViewResolver가 JSP 같은 View를 찾고, 객체라면 HttpMessageConverter가 JSON으로 직렬화한다.</p>
  <p><code>@Controller</code>에서 문자열 반환은 기본적으로 View 이름이지만 <code>@ResponseBody</code>가 있으면 response body가 된다. <code>@RestController</code>는 모든 method에 ResponseBody 의미가 적용된다. 같은 문자열이라도 annotation에 따라 결과가 다른 이유다.</p>
  <div class="note-warning"><strong>404를 만났을 때</strong><p>요청 URL·HTTP method·Controller package scan·mapping path를 확인한다. 500이면 mapping 이후 Controller 또는 하위 계층 예외일 가능성이 크므로 상태 코드만 보고 같은 문제로 다루지 않는다.</p></div>`);

  add("spring-mvc", 4, `<h2>요청값이 Java 객체가 되는 세 가지 길</h2>
  <table><tr><th>입력 위치</th><th>Spring annotation</th><th>예</th></tr><tr><td>URL path</td><td>@PathVariable</td><td>/members/7의 7</td></tr><tr><td>query·form</td><td>@RequestParam / @ModelAttribute</td><td>?page=2</td></tr><tr><td>JSON body</td><td>@RequestBody</td><td>{"email":"..."}</td></tr></table>
  <p>JSON key와 DTO field가 맞아야 MessageConverter가 값을 넣는다. Content-Type이 application/json이 아니거나 body 모양이 다르면 Controller 진입 전에 400이 날 수 있다.</p>
  <pre data-lang="Java"><code>record JoinRequest(
  @NotBlank @Email String email,
  @Size(min = 8, max = 50) String password,
  @NotBlank String nickname
) {}</code></pre>
  <p><code>@Valid</code>는 형식과 필수값을 검사하지만 email 중복처럼 DB 조회가 필요한 업무 규칙은 Service에서 검사한다. 검증 실패 응답에는 어느 field가 왜 실패했는지 client가 사용할 수 있는 구조를 준다.</p>`);

  add("spring-mvc", 5, `<h2>예외를 사용자 응답으로 번역하는 계층을 둔다</h2>
  <p>DAO의 SQLException이나 JPA 예외를 그대로 client에 노출하면 내부 구조와 SQL 정보가 새어 나간다. Service는 의미 있는 업무 예외를 던지고, ControllerAdvice가 예외 종류별 상태 코드와 공통 오류 body로 변환한다.</p>
  <pre data-lang="Java"><code>@RestControllerAdvice
class GlobalExceptionHandler {
  @ExceptionHandler(MemberNotFoundException.class)
  ResponseEntity&lt;ErrorResponse&gt; notFound(MemberNotFoundException e) {
    return ResponseEntity.status(404)
      .body(new ErrorResponse("MEMBER_NOT_FOUND", e.getMessage()));
  }
}</code></pre>
  <h3>관찰 가능성은 오류 메시지를 많이 찍는 것이 아니다</h3>
  <p>요청 ID, method·path, 핵심 식별자, 처리 시간, exception stack을 level에 맞게 남긴다. 비밀번호·token·주민번호는 log에 남기지 않는다. client 응답은 이해 가능한 code를 주되 내부 stack trace는 server log에서만 확인한다.</p>
  <p>Interceptor는 Controller 전후의 로그인 검사·공통 model·처리 시간처럼 MVC 요청 흐름에 적용하고, Filter는 그보다 앞단의 servlet 요청·응답 수준 처리에 사용한다.</p>`);
})();
