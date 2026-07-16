(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const replace = (slug, index, body) => { category(slug).lessons[index].body = body; };

  replace("jdbc", 0, `<h2>JDBC는 Java와 관계형 데이터베이스 사이의 표준 통로다</h2>
<p>JDBC(Java Database Connectivity)는 특정 DB 제품의 사용법을 애플리케이션 전체에 퍼뜨리지 않고, Java 표준 인터페이스로 연결·SQL 실행·결과 조회를 처리하게 해 준다. 애플리케이션은 JDBC API를 호출하고, MySQL·Oracle·PostgreSQL용 드라이버가 그 호출을 각 DB의 통신 규약으로 바꾼다.</p>
<div class="concept-flow"><span>Java 애플리케이션</span><i>→</i><span>JDBC API</span><i>→</i><span>JDBC Driver</span><i>→</i><span>DBMS</span></div>
<h2>한 번의 조회가 끝나는 순서</h2>
<ol><li><strong>Connection 획득:</strong> DB와 대화할 세션을 연다.</li><li><strong>PreparedStatement 생성:</strong> 실행할 SQL의 틀과 입력값을 준비한다.</li><li><strong>SQL 실행:</strong> 조회는 <code>executeQuery()</code>, 변경은 <code>executeUpdate()</code>를 사용한다.</li><li><strong>ResultSet 매핑:</strong> 행과 열로 온 결과를 Java 객체로 옮긴다.</li><li><strong>자원 반환:</strong> ResultSet, Statement, Connection을 닫는다.</li></ol>
<pre data-lang="Java"><code>String sql = "SELECT member_id, name, email FROM member WHERE member_id = ?";

try (Connection con = dataSource.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setLong(1, memberId);
    try (ResultSet rs = ps.executeQuery()) {
        if (!rs.next()) return Optional.empty();
        Member member = new Member(
            rs.getLong("member_id"),
            rs.getString("name"),
            rs.getString("email")
        );
        return Optional.of(member);
    }
}</code></pre>
<p><code>try-with-resources</code>를 쓰면 정상 종료뿐 아니라 예외가 발생한 경우에도 자원이 역순으로 닫힌다. 연결을 반환하지 않으면 커넥션 풀이 고갈되어 새 요청이 대기하므로, 자원 정리는 기능 구현의 부가 작업이 아니라 안정성의 핵심이다.</p>
<h2>Statement보다 PreparedStatement를 기본으로 선택한다</h2>
<p>문자열 연결로 SQL을 만들면 값과 SQL 문법의 경계가 무너져 SQL Injection에 취약하다. <code>?</code> 바인딩은 SQL 구조와 데이터를 분리하고 문자열 따옴표·날짜·숫자 변환도 드라이버에 맡긴다. 단, 테이블명이나 정렬 방향처럼 SQL 구조 자체는 바인딩할 수 없으므로 허용 목록으로 검증해야 한다.</p>
<pre data-lang="Java"><code>// 잘못된 방식: 사용자 입력이 SQL 문법이 될 수 있다.
String unsafe = "SELECT * FROM member WHERE name = '" + keyword + "'";

// 권장 방식: 입력은 끝까지 데이터로 취급된다.
PreparedStatement ps = con.prepareStatement(
    "SELECT * FROM member WHERE name = ?"
);
ps.setString(1, keyword);</code></pre>
<h2>ResultSet은 현재 행을 가리키는 커서다</h2>
<p>처음에는 첫 행 이전에 있으므로 반드시 <code>next()</code>로 이동해야 한다. 단건 조회는 <code>if</code>, 목록 조회는 <code>while</code>이 자연스럽다. 열 순서보다 별칭을 포함한 열 이름으로 읽으면 SELECT 절이 바뀌어도 의도가 명확하다. SQL의 NULL과 Java 기본형의 기본값은 다르므로 nullable 열은 래퍼 타입과 <code>wasNull()</code>도 고려한다.</p>
<blockquote><strong>복습 기준:</strong> JDBC 코드를 볼 때는 “연결을 어디서 얻는가, 값이 바인딩되는가, 결과가 어떤 객체로 매핑되는가, 모든 자원이 반환되는가” 네 가지를 먼저 확인한다.</blockquote>`);

  replace("jdbc", 1, `<h2>계층 분리는 코드의 위치가 아니라 책임의 경계다</h2>
<p>웹 애플리케이션에서 요청 해석, 업무 규칙, SQL 실행을 한 메서드에 넣으면 수정 이유가 서로 다른 코드가 강하게 얽힌다. Controller·Service·DAO(Repository)는 각각 입력과 출력, 유스케이스, 영속성을 담당해 변경의 파급 범위를 줄인다.</p>
<table><tr><th>계층</th><th>주요 책임</th><th>두지 않는 것</th></tr><tr><td>Controller</td><td>요청값 변환·검증, Service 호출, 응답 선택</td><td>SQL, 핵심 업무 규칙</td></tr><tr><td>Service</td><td>업무 절차와 규칙, 여러 DAO 조합, 트랜잭션 경계</td><td>HTTP 세부 정보, JDBC 반복 코드</td></tr><tr><td>DAO</td><td>SQL 실행, ResultSet 매핑, 저장소 예외 변환</td><td>화면 이동, 업무 정책 판단</td></tr></table>
<h2>요청은 아래로 내려가고 결과는 위로 돌아온다</h2>
<div class="concept-flow"><span>HTTP 요청</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>DAO</span><i>→</i><span>DB</span></div>
<pre data-lang="Java"><code>public final class MemberService {
    private final MemberDao memberDao;

    public MemberService(MemberDao memberDao) {
        this.memberDao = memberDao;
    }

    public Member register(RegisterCommand command) {
        if (memberDao.existsByEmail(command.email())) {
            throw new DuplicateEmailException(command.email());
        }
        Member member = Member.create(command.name(), command.email());
        return memberDao.insert(member);
    }
}</code></pre>
<p>Service가 <code>HttpServletRequest</code>를 직접 받지 않고 <code>RegisterCommand</code> 같은 명시적인 입력 모델을 받으면 웹 기술과 분리된다. 같은 가입 기능을 REST API, 배치, 테스트에서도 재사용하기 쉽다.</p>
<h2>DTO와 도메인 객체를 구분하는 이유</h2>
<p>요청 DTO는 외부 입력 형식, 응답 DTO는 공개할 출력 형식, 도메인 객체는 업무 상태와 규칙을 표현한다. 하나의 객체를 전 계층에서 공유하면 DB 열 추가가 API 응답을 바꾸거나, 비밀번호 해시 같은 내부 값이 노출될 수 있다. 작은 예제에서는 같아 보여도 역할을 구분해 두면 성장할 때 안전하다.</p>
<pre data-lang="Java"><code>public record RegisterRequest(String name, String email) {}
public record MemberResponse(long id, String name, String email) {
    static MemberResponse from(Member member) {
        return new MemberResponse(member.getId(), member.getName(), member.getEmail());
    }
}</code></pre>
<h2>의존성은 구체 클래스보다 계약을 향하게 한다</h2>
<p>Service가 JDBC 구현의 생성 방법까지 알면 테스트할 때 실제 DB가 필요하다. DAO 인터페이스를 생성자로 주입하면 운영에서는 JDBC 구현을, 단위 테스트에서는 메모리 구현을 넣을 수 있다. 이것이 의존성 역전과 의존성 주입의 실용적인 출발점이다.</p>
<pre data-lang="Java"><code>public interface MemberDao {
    Optional&lt;Member&gt; findById(long id);
    boolean existsByEmail(String email);
    Member insert(Member member);
}</code></pre>
<h2>예외도 계층의 언어로 번역한다</h2>
<p>DAO의 <code>SQLException</code>을 Controller까지 그대로 던지면 상위 계층이 DB 기술을 알아야 한다. DAO에서는 저장 실패 같은 애플리케이션 예외로 감싸고, Service는 중복 이메일 등 업무 예외를 만들며, Controller는 이를 HTTP 상태와 오류 응답으로 변환한다. 로그에는 원인을 남기되 사용자에게 SQL과 스택 트레이스를 노출하지 않는다.</p>
<blockquote><strong>설계 질문:</strong> 이 코드가 바뀌는 이유가 HTTP인가, 업무 정책인가, DB인가? 답에 맞는 계층에 놓으면 된다.</blockquote>`);

  replace("jdbc", 2, `<h2>CRUD는 SQL 네 개가 아니라 상태를 안전하게 바꾸는 패턴이다</h2>
<p>Create·Read·Update·Delete는 대부분의 데이터 기능의 뼈대다. 하지만 실무에서는 영향 행 수, 생성 키, 존재하지 않는 대상, 동시 수정, 여러 쿼리의 원자성까지 처리해야 완성된다.</p>
<table><tr><th>작업</th><th>SQL</th><th>JDBC 반환값</th><th>확인할 것</th></tr><tr><td>Create</td><td>INSERT</td><td>영향 행 수·생성 키</td><td>중복 키, 필수값</td></tr><tr><td>Read</td><td>SELECT</td><td>ResultSet</td><td>0건·1건·여러 건</td></tr><tr><td>Update</td><td>UPDATE</td><td>영향 행 수</td><td>대상 존재, 변경 충돌</td></tr><tr><td>Delete</td><td>DELETE</td><td>영향 행 수</td><td>참조 무결성, 소프트 삭제</td></tr></table>
<h2>삽입 후 생성된 기본 키를 받는다</h2>
<pre data-lang="Java"><code>String sql = "INSERT INTO member(name, email) VALUES (?, ?)";
try (PreparedStatement ps = con.prepareStatement(
        sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, member.getName());
    ps.setString(2, member.getEmail());
    int affected = ps.executeUpdate();
    if (affected != 1) throw new DataAccessException("회원 저장 실패");

    try (ResultSet keys = ps.getGeneratedKeys()) {
        if (!keys.next()) throw new DataAccessException("생성 키 없음");
        return member.withId(keys.getLong(1));
    }
}</code></pre>
<p><code>executeUpdate()</code>의 결과를 무시하면 WHERE 조건이 틀려 0건이 변경되어도 성공으로 처리할 수 있다. 한 건을 기대하는 명령이라면 반드시 1인지 검증한다.</p>
<h2>트랜잭션은 여러 작업을 하나의 성공 또는 실패로 묶는다</h2>
<p>주문 저장과 재고 차감처럼 둘 중 하나만 반영되면 데이터가 깨지는 작업은 같은 Connection에서 수행해야 한다. 자동 커밋을 끄고 모든 작업이 성공하면 <code>commit()</code>, 하나라도 실패하면 <code>rollback()</code>한다.</p>
<pre data-lang="Java"><code>try (Connection con = dataSource.getConnection()) {
    con.setAutoCommit(false);
    try {
        orderDao.insert(con, order);
        stockDao.decrease(con, order.productId(), order.quantity());
        con.commit();
    } catch (Exception e) {
        con.rollback();
        throw e;
    } finally {
        con.setAutoCommit(true);
    }
}</code></pre>
<p>DAO마다 새 Connection을 얻으면 같은 트랜잭션이 아니다. 그래서 트랜잭션 경계는 여러 DAO를 조합하는 Service에 두고, 해당 범위에서 동일한 연결을 공유해야 한다. Spring의 <code>@Transactional</code>은 이 반복 작업을 프록시가 대신하지만 원리는 동일하다.</p>
<h2>ACID를 코드의 상황으로 이해한다</h2>
<ul><li><strong>Atomicity:</strong> 주문과 재고 차감이 모두 반영되거나 모두 취소된다.</li><li><strong>Consistency:</strong> 재고는 음수가 될 수 없다는 규칙을 전후로 지킨다.</li><li><strong>Isolation:</strong> 동시에 실행되는 거래가 서로의 중간 상태를 함부로 보지 않는다.</li><li><strong>Durability:</strong> 커밋된 결과는 장애 후에도 보존된다.</li></ul>
<h2>실패하기 쉬운 지점</h2>
<p>너무 넓은 트랜잭션은 연결과 잠금을 오래 잡고, 외부 API 호출까지 포함하면 응답 지연 동안 DB 자원이 묶인다. 반대로 너무 잘게 나누면 부분 성공이 생긴다. 트랜잭션은 하나의 업무 규칙을 지키는 최소 범위로 잡고, 예외를 잡아 삼켜 커밋되는 일이 없도록 전파 규칙을 분명히 한다.</p>
<blockquote><strong>복습 기준:</strong> 변경 쿼리를 보면 영향 행 수를 확인하고, 두 개 이상의 변경이 한 유스케이스를 이루면 같은 트랜잭션인지 확인한다.</blockquote>`);
})();
