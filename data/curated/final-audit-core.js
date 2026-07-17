/* 116개 원문 노트 전수 대조에서 독립 단원이 필요하다고 판단한 기초·데이터 영역. */
(function () {
  const find = (slug) => (window.CURATED_STUDY || []).find((item) => item.slug === slug);
  const lesson = (slug, title, summary, body, important = false) => {
    const category = find(slug);
    if (category && !category.lessons.some((item) => item.title === title)) category.lessons.push({ title, summary, body, important });
  };

  lesson("html-css", "경로·이미지·링크와 개발 도구 사용법", "VS Code에서 파일 구조를 만들고 상대 경로와 절대 경로를 구분해 자원을 정확히 연결한다.", `<h2>브라우저가 찾는 것은 내 컴퓨터의 감이 아니라 URL이다</h2>
<p>HTML에서 CSS·JavaScript·이미지를 연결할 때 기준은 현재 문서의 위치다. <code>./</code>는 현재 폴더, <code>../</code>는 한 단계 위, <code>/</code>는 배포된 사이트의 루트를 뜻한다. 로컬에서 우연히 보이던 이미지가 GitHub Pages에서 사라지는 가장 흔한 이유는 대소문자와 기준 경로가 달라졌기 때문이다.</p>
<pre data-lang="TEXT"><code>project/
├─ index.html
├─ css/style.css
├─ js/app.js
└─ images/logo.png</code></pre>
<pre data-lang="HTML"><code>&lt;link rel="stylesheet" href="./css/style.css"&gt;
&lt;img src="./images/logo.png" alt="서비스 로고"&gt;
&lt;script src="./js/app.js" defer&gt;&lt;/script&gt;</code></pre>
<h3>링크와 이미지에서 함께 확인할 것</h3><ul><li><code>a</code>의 <code>href</code>는 이동 주소이고 새 창을 열면 <code>rel="noopener noreferrer"</code>를 함께 둔다.</li><li><code>img</code>의 <code>alt</code>는 파일명이 아니라 이미지가 전달하는 의미를 쓴다. 장식 이미지는 빈 alt를 사용한다.</li><li>경로 오류는 개발자 도구 Network에서 404 요청 URL을 보고 고친다. 파일을 여기저기 복사해 해결하지 않는다.</li></ul>
<h3>VS Code에서 수업 프로젝트를 시작하는 순서</h3><ol><li>프로젝트 루트 폴더 자체를 연다.</li><li>Explorer에서 폴더 구조와 현재 편집 파일의 위치를 확인한다.</li><li>Emmet의 <code>!</code>로 기본 HTML을 만든 뒤 <code>lang</code>, title, viewport를 고친다.</li><li>Live Server는 편리한 정적 서버일 뿐 백엔드나 배포 환경을 대신하지 않는다는 점을 구분한다.</li></ol>
<div class="note-warning"><strong>Windows에서만 통과하는 경로</strong><p>Windows는 파일명 대소문자를 관대하게 처리하지만 Linux 배포 서버는 <code>Logo.png</code>와 <code>logo.png</code>를 다른 파일로 본다. 저장소의 실제 이름과 코드 경로를 완전히 맞춘다.</p></div>`, true);

  lesson("java", "메서드·오버로딩과 JVM 메모리", "메서드 호출과 매개변수 전달, 오버로딩, stack·heap의 관계를 한 흐름으로 이해한다.", `<h2>메서드는 입력을 받아 한 책임을 수행하는 코드 단위다</h2><pre data-lang="Java"><code>public int totalPrice(int price, int quantity) {
    if (price &lt; 0 || quantity &lt; 0) throw new IllegalArgumentException();
    return price * quantity;
}</code></pre>
<p>선언부에는 접근 제한자, 반환형, 이름, 매개변수가 있다. 호출할 때 전달한 argument는 매개변수에 값으로 복사된다. 기본형은 값 자체가, 참조형은 객체를 가리키는 참조값이 복사되므로 메서드 안에서 객체의 필드를 바꾸면 호출자도 같은 변화를 보지만 매개변수에 새 객체를 대입하는 것은 호출자의 변수 자체를 바꾸지 않는다.</p>
<h3>오버로딩은 이름이 같아도 매개변수 목록이 다르면 가능하다</h3><p>개수나 타입, 순서가 달라야 하며 반환형만 다른 메서드는 구분할 수 없다. 비슷한 동작을 하나의 이름으로 표현할 때 유용하지만, 의미가 다른 작업을 억지로 같은 이름에 넣으면 호출 의도가 흐려진다.</p>
<h3>호출 순간의 메모리 그림</h3><ul><li>각 메서드 호출의 지역 변수와 매개변수는 stack frame에 생기고 반환하면 사라진다.</li><li><code>new</code>로 만든 객체와 배열은 heap에 존재하며 변수에는 참조가 들어간다.</li><li>더 이상 도달할 수 없는 객체는 GC 대상이 되지만 즉시 제거된다고 가정하면 안 된다.</li><li>재귀 호출이 종료 조건 없이 쌓이면 heap 부족이 아니라 <code>StackOverflowError</code>가 발생한다.</li></ul>
<blockquote><strong>설명할 수 있어야 하는 문장:</strong> Java는 항상 값을 전달한다. 객체를 넘길 때도 객체 자체가 아니라 같은 객체를 가리키는 참조값이 복사된다.</blockquote>`, true);

  lesson("java", "문자열·날짜·Object와 자주 쓰는 Java API", "직접 구현하기 전에 표준 API의 계약과 불변 객체의 사용법을 익힌다.", `<h2>String은 내용이 바뀌지 않는 불변 객체다</h2><p><code>concat</code>, <code>replace</code>, <code>substring</code>은 원본을 고치는 대신 새 문자열을 반환한다. 반복문에서 <code>+</code> 연결을 계속하면 중간 객체가 많이 생길 수 있으므로 조립이 반복될 때는 <code>StringBuilder</code>를 사용한다. 문자열 내용 비교는 <code>==</code>가 아니라 <code>equals</code>다.</p>
<pre data-lang="Java"><code>String normalized = input == null ? "" : input.trim().toLowerCase();
String text = new StringBuilder().append(name).append(" : ").append(score).toString();</code></pre>
<h3>모든 클래스가 물려받는 Object 계약</h3><table><tr><th>메서드</th><th>재정의 기준</th></tr><tr><td><code>toString</code></td><td>로그와 디버깅에 필요한 상태를 표현하되 비밀번호는 제외한다.</td></tr><tr><td><code>equals</code></td><td>두 객체를 같은 값으로 볼 업무 기준을 정한다.</td></tr><tr><td><code>hashCode</code></td><td>equals가 true인 객체는 반드시 같은 hashCode를 반환해야 한다.</td></tr></table>
<h3>날짜는 목적에 맞는 타입을 선택한다</h3><ul><li><code>LocalDate</code>: 생일·영업일처럼 날짜만 필요할 때</li><li><code>LocalDateTime</code>: 지역 시간은 있지만 시간대가 없는 값</li><li><code>Instant</code>: 서버 이벤트처럼 세계 공통 시점을 저장할 때</li><li><code>Duration</code>/<code>Period</code>: 시간 기반 또는 날짜 기반 간격</li></ul><p>문자열과 날짜 사이 변환은 <code>DateTimeFormatter</code>를 사용하고 DB·JSON의 시간대 규칙을 프로젝트 전체에서 통일한다.</p>`);

  lesson("java", "파일 입출력과 자원 닫기", "Stream의 방향과 byte·문자 차이를 구분하고 try-with-resources로 안전하게 파일을 다룬다.", `<h2>입력과 출력은 프로그램을 기준으로 부른다</h2><p>파일이나 네트워크에서 프로그램 안으로 읽으면 Input, 프로그램에서 밖으로 쓰면 Output이다. 이미지·압축 파일은 byte stream, 문자 파일은 encoding을 해석하는 Reader·Writer 계열을 사용한다. 텍스트를 byte로 읽은 뒤 무작정 char로 바꾸면 한글이 깨질 수 있다.</p>
<pre data-lang="Java"><code>Path path = Path.of("data", "members.txt");
try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}</code></pre>
<h3>왜 반드시 닫아야 할까?</h3><p>파일 descriptor와 socket은 JVM 밖의 운영체제 자원이다. GC에 맡기면 닫히는 시점을 보장할 수 없고, 출력 buffer에 남은 데이터도 파일에 반영되지 않을 수 있다. <code>AutoCloseable</code>을 구현한 자원은 try-with-resources에 넣으면 정상·예외 경로 모두 역순으로 닫힌다.</p>
<h3>실제 파일 저장에서 놓치기 쉬운 것</h3><ul><li>상대 경로는 실행한 현재 디렉터리를 기준으로 하므로 <code>toAbsolutePath</code>로 확인한다.</li><li>덮어쓰기·이어쓰기 옵션을 명시하고 임시 파일에 쓴 뒤 교체하면 중간 실패의 손상을 줄일 수 있다.</li><li>사용자 파일명에는 <code>../</code> 같은 경로 이동이 들어갈 수 있으므로 서버에서 안전한 이름을 새로 만든다.</li><li>큰 파일 전체를 메모리에 올리지 말고 buffer 단위로 복사한다.</li></ul>`, true);

  lesson("git", "SourceTree로 보는 add·commit·push 흐름", "GUI 버튼을 Git 개념과 연결해 변경 확인부터 원격 반영까지 안전하게 수행한다.", `<h2>SourceTree는 Git을 대신하는 것이 아니라 같은 명령을 화면으로 보여준다</h2><p>File Status의 Working Copy는 수정된 작업 파일, Staged files는 다음 commit에 포함할 snapshot이다. 체크박스를 누르기 전에 diff의 초록·빨강 줄을 읽고 secret, 생성 파일, 불필요한 포맷 변경이 섞이지 않았는지 확인한다.</p>
<ol><li>Pull부터 누르기 전에 fetch로 원격 변경을 가져와 graph를 확인한다.</li><li>작업 목적과 관계있는 변경만 stage한다.</li><li>commit 메시지는 “무엇을 왜 바꿨는지” 한 단위로 작성한다.</li><li>push할 branch와 원격 이름을 확인하고 upstream을 연결한다.</li><li>GitHub에서 commit과 파일 목록이 의도대로 보이는지 확인한다.</li></ol>
<h3>clone·add remote·push를 혼동하지 않는다</h3><table><tr><th>상황</th><th>작업</th></tr><tr><td>원격 저장소를 처음 내려받음</td><td>Clone으로 폴더와 원격 연결을 함께 만든다.</td></tr><tr><td>이미 로컬 Git 저장소가 있음</td><td>Remote를 추가하고 최초 push 시 upstream을 지정한다.</td></tr><tr><td>저장소 안에 또 저장소가 생김</td><td>상위·하위의 <code>.git</code> 위치를 확인하고 의도하지 않은 중첩을 해소한다.</td></tr></table>
<div class="note-warning"><strong>GUI에서도 되돌리기는 위험도가 다르다</strong><p>Discard는 commit되지 않은 파일 내용을 잃을 수 있다. 팀에 공개된 commit은 reset으로 지우기보다 reverse commit(revert)을 만들어 이력을 보존한다.</p></div>`, true);

  lesson("git", "stash·rebase·tag와 충돌 복구", "작업을 잠시 보관하고 이력을 정리하며 충돌을 끝까지 검증하는 실전 흐름을 익힌다.", `<h2>작업 중 다른 branch로 가야 할 때 stash를 사용한다</h2><pre data-lang="Shell"><code>git stash push -m "member form WIP"
git switch main
git pull --ff-only
git switch feature/member
git stash pop</code></pre><p>stash는 임시 서랍이지 영구 백업이 아니다. untracked 파일 포함 여부를 확인하고, 다시 적용할 때 충돌이 날 수 있으므로 완료 작업은 작은 commit으로 남기는 편이 안전하다.</p>
<h3>merge와 rebase의 차이</h3><p>merge는 두 갈래 이력을 합치는 commit을 만들고 실제 협업 흐름을 보존한다. rebase는 내 commit의 부모를 최신 기준으로 다시 만들어 직선 이력을 만든다. 이미 공유한 branch를 rebase 후 강제 push하면 동료 이력이 꼬이므로 개인 feature branch에서만 사용한다.</p>
<h3>충돌을 해결하는 순서</h3><ol><li><code>git status</code>로 충돌 파일을 확인한다.</li><li>ours와 theirs 중 하나를 기계적으로 고르지 말고 두 변경의 요구사항을 합친 최종 코드를 작성한다.</li><li>충돌 marker가 모두 제거됐는지 검색한다.</li><li>빌드와 관련 테스트를 실행한다.</li><li>파일을 stage하고 merge 또는 rebase를 계속한다.</li></ol><p>배포 지점은 <code>v1.0.0</code> 같은 annotated tag로 표시할 수 있다. branch는 이동하지만 tag는 특정 commit을 고정해서 가리키므로 어떤 코드가 배포됐는지 추적하기 좋다.</p>`);

  lesson("sql", "데이터 모델링·키·정규화", "화면을 바로 테이블로 옮기지 않고 엔터티·관계·식별자를 설계하는 기준을 세운다.", `<h2>테이블 설계는 저장할 업무 사실을 찾는 것부터 시작한다</h2><p>회원, 부서, 주문처럼 독립적으로 식별할 대상을 엔터티로 잡고 속성과 관계를 정한다. 화면의 한 줄에 보인다는 이유로 모든 값을 한 테이블에 넣으면 같은 정보가 반복되고 수정·삭제 시 모순이 생긴다.</p>
<h3>키의 역할</h3><ul><li><strong>후보키:</strong> 행을 유일하게 식별할 수 있는 최소 속성 집합</li><li><strong>기본키:</strong> 후보키 중 대표로 선택한 NOT NULL·UNIQUE 식별자</li><li><strong>대체키:</strong> 기본키로 선택되지 않은 후보키</li><li><strong>외래키:</strong> 다른 테이블의 키를 참조해 관계와 무결성을 표현</li></ul>
<h3>정규화를 문제 상황으로 이해한다</h3><table><tr><th>단계</th><th>확인 질문</th></tr><tr><td>1NF</td><td>한 칸에 전화번호 여러 개처럼 반복 값이 들어가지는 않았는가?</td></tr><tr><td>2NF</td><td>복합키의 일부에만 의존하는 속성이 섞이지 않았는가?</td></tr><tr><td>3NF</td><td>일반 속성이 다른 일반 속성을 통해 간접적으로 결정되지 않는가?</td></tr></table>
<p>정규화는 join을 늘리기 위한 규칙이 아니라 중복과 갱신 이상을 줄이는 과정이다. 조회 성능 때문에 비정규화를 선택할 수 있지만, 원본 값과 계산 값의 기준·갱신 책임을 먼저 정해야 한다.</p>
<blockquote><strong>ERD 검토법:</strong> 각 테이블을 “이 한 행은 무엇 하나를 뜻하는가?”라는 문장으로 말해 보고, 모든 외래키 관계의 1:N 방향과 삭제 정책을 설명한다.</blockquote>`, true);

  lesson("sql", "제약조건과 DDL·DML 전체 흐름", "PRIMARY KEY·FOREIGN KEY·UNIQUE·CHECK를 설계하고 구조 변경과 데이터 변경을 구분한다.", `<h2>제약조건은 잘못된 데이터가 들어온 뒤 고치는 규칙이 아니다</h2><pre data-lang="SQL"><code>CREATE TABLE board (
  board_id NUMBER PRIMARY KEY,
  writer_id NUMBER NOT NULL,
  title VARCHAR2(200) NOT NULL,
  status CHAR(1) DEFAULT 'Y' CHECK (status IN ('Y','N')),
  CONSTRAINT fk_board_writer FOREIGN KEY (writer_id)
    REFERENCES member(member_id)
);</code></pre>
<p>PRIMARY KEY는 행 식별, UNIQUE는 중복 금지, NOT NULL은 필수값, CHECK는 허용 범위, FOREIGN KEY는 참조 대상 존재를 DB가 보장한다. 애플리케이션 검증만으로는 동시 요청이나 다른 입력 경로를 막을 수 없으므로 데이터의 마지막 방어선은 DB 제약조건이다.</p>
<h3>DDL과 DML을 나누는 이유</h3><ul><li>DDL의 <code>CREATE·ALTER·DROP·TRUNCATE</code>는 구조를 바꾸며 Oracle에서는 암묵적 commit에 주의한다.</li><li>DML의 <code>INSERT·UPDATE·DELETE·MERGE</code>는 행을 바꾸며 commit 전에는 rollback할 수 있다.</li><li><code>DELETE</code>는 조건에 맞는 행을 지우고 rollback 가능하지만, <code>TRUNCATE</code>는 테이블 전체를 빠르게 비우는 DDL이다.</li></ul>
<h3>외래키 삭제 정책</h3><p><code>ON DELETE CASCADE</code>는 부모 삭제가 자식 삭제로 전파되고, <code>SET NULL</code>은 관계만 끊는다. 편리함이 아니라 업무 의미로 선택한다. 주문처럼 보존해야 하는 이력이 회원 탈퇴와 함께 사라지면 안 되므로 논리 삭제나 익명화를 검토한다.</p>`);

  lesson("sql", "NULL·함수·집합 연산과 조회 순서", "SQL의 3값 논리와 SELECT 실행 순서를 이해해 조건식과 집계를 정확히 작성한다.", `<h2>NULL은 빈 문자열이나 0이 아니라 ‘알 수 없음’이다</h2><p><code>column = NULL</code>은 true가 되지 않으므로 <code>IS NULL</code>을 사용한다. NULL과의 산술 결과도 NULL이며, Oracle에서는 빈 문자열을 NULL처럼 처리한다. 화면에 보여줄 대체값은 <code>NVL</code> 또는 표준 <code>COALESCE</code>로 정하되 원본 값 자체를 바꾸는 것과 구분한다.</p>
<pre data-lang="SQL"><code>SELECT department_id,
       COUNT(*) AS total_count,
       COUNT(bonus) AS bonus_count,
       COALESCE(AVG(bonus), 0) AS avg_bonus
FROM employee
GROUP BY department_id
HAVING COUNT(*) &gt;= 3;</code></pre>
<p><code>COUNT(*)</code>는 행 수, <code>COUNT(column)</code>은 NULL이 아닌 값 수다. WHERE는 grouping 전 행을 거르고 HAVING은 grouping 결과를 거른다.</p>
<h3>논리적인 실행 순서</h3><div class="concept-flow"><span>FROM·JOIN</span><i>→</i><span>WHERE</span><i>→</i><span>GROUP BY</span><i>→</i><span>HAVING</span><i>→</i><span>SELECT</span><i>→</i><span>ORDER BY</span></div>
<h3>UNION 계열</h3><p><code>UNION</code>은 중복을 제거하고 <code>UNION ALL</code>은 그대로 합친다. 두 SELECT의 컬럼 수와 대응 타입이 맞아야 한다. 중복 제거가 필요하지 않다면 불필요한 sort 비용이 없는 UNION ALL이 적합하다.</p>`);

  lesson("sql", "Procedure·Function·Trigger와 PL/SQL", "SQL을 절차적으로 묶는 객체들의 반환 방식과 실행 시점을 구분한다.", `<h2>PL/SQL 블록은 선언·실행·예외 영역으로 구성된다</h2><pre data-lang="SQL"><code>CREATE OR REPLACE PROCEDURE raise_salary(
  p_employee_id IN NUMBER,
  p_rate IN NUMBER
) AS
BEGIN
  UPDATE employee
  SET salary = salary * (1 + p_rate)
  WHERE employee_id = p_employee_id;
  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20001, '직원을 찾을 수 없습니다.');
  END IF;
END;</code></pre>
<table><tr><th>객체</th><th>핵심 차이</th></tr><tr><td>Procedure</td><td>업무 작업을 수행하며 IN·OUT 매개변수로 값을 주고받는다.</td></tr><tr><td>Function</td><td>반드시 한 값을 RETURN하며 SQL 식에서 호출 가능한 순수성이 중요하다.</td></tr><tr><td>Trigger</td><td>특정 DML·DDL 사건 전후에 자동 실행되므로 호출 코드가 눈에 보이지 않는다.</td></tr></table>
<p>Trigger에 복잡한 업무 로직을 넣으면 숨은 실행과 순환 호출, 테스트 어려움이 커진다. 감사 기록이나 강한 DB 무결성처럼 자동 실행이 꼭 필요한 범위에 제한한다. 트랜잭션의 commit·rollback 책임도 호출 애플리케이션과 DB 객체 중 어디에 있는지 명확히 정한다.</p>`);

  lesson("jdbc", "JDBC 설정·PreparedStatement·자원 관리", "Driver부터 Connection, SQL 실행, ResultSet, close까지 한 요청의 실제 순서를 재현한다.", `<h2>JDBC는 Java 코드와 DB 사이의 표준 통신 절차다</h2><div class="concept-flow"><span>Driver</span><i>→</i><span>Connection</span><i>→</i><span>PreparedStatement</span><i>→</i><span>ResultSet</span><i>→</i><span>close</span></div>
<pre data-lang="Java"><code>String sql = "SELECT member_id, name FROM member WHERE email = ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, email);
    try (ResultSet rs = ps.executeQuery()) {
        return rs.next() ? new Member(rs.getLong("member_id"), rs.getString("name")) : null;
    }
}</code></pre>
<p><code>PreparedStatement</code>의 <code>?</code>에는 값만 binding한다. 따옴표 연결보다 SQL injection과 타입 변환 오류를 줄이고 DB가 실행 계획을 재사용하기 쉽다. 테이블명·정렬 방향 같은 SQL 구조는 placeholder로 넣을 수 없으므로 허용 목록에서 선택한다.</p>
<h3>실행 메서드 구분</h3><ul><li><code>executeQuery</code>: SELECT 후 ResultSet 반환</li><li><code>executeUpdate</code>: INSERT·UPDATE·DELETE 후 영향받은 행 수 반환</li><li><code>execute</code>: 결과 형태가 동적인 특수 상황</li></ul><p>Connection·Statement·ResultSet은 열린 역순으로 닫아야 하며 try-with-resources를 사용한다. URL·계정·비밀번호는 코드에 작성하지 않고 환경별 설정으로 분리한다.</p>`, true);

  lesson("jdbc", "ResultSet 매핑·페이징과 DAO 검증", "조회 결과를 객체로 옮기는 책임과 목록 조회의 안정적인 페이징 방법을 익힌다.", `<h2>ResultSet의 cursor는 첫 행보다 앞에서 시작한다</h2><p>단건 조회도 먼저 <code>rs.next()</code>가 true인지 확인해야 한다. 여러 건은 while로 순회하고 컬럼명 alias와 Java 타입을 명확히 맞춘다. DB의 NULL 숫자를 primitive getter로 읽으면 0과 구분하기 어려우므로 <code>getObject</code> 또는 <code>wasNull</code>을 고려한다.</p>
<pre data-lang="Java"><code>List&lt;Board&gt; result = new ArrayList&lt;&gt;();
while (rs.next()) {
    result.add(new Board(
        rs.getLong("board_id"),
        rs.getString("title"),
        rs.getTimestamp("created_at").toLocalDateTime()
    ));
}</code></pre>
<h3>페이징은 정렬 기준과 함께 설계한다</h3><p>offset 방식은 페이지 번호 이동이 쉽지만 뒤 페이지로 갈수록 건너뛸 행이 많고 중간 삽입 시 중복·누락이 생길 수 있다. 반드시 <code>created_at DESC, board_id DESC</code>처럼 동률을 깨는 고유 정렬을 둔다. 계속 내려가는 피드는 마지막 키를 다음 조건으로 넘기는 cursor 방식이 안정적이다.</p>
<h3>DAO 테스트에서 확인할 것</h3><ul><li>결과가 0건·1건·여러 건일 때 반환 계약</li><li>한글·NULL·날짜·큰 숫자의 타입 매핑</li><li>중복키와 외래키 위반이 의미 있는 예외로 변환되는지</li><li>여러 DAO 작업 실패 시 Service transaction이 전체 rollback하는지</li></ul>`);
})();
