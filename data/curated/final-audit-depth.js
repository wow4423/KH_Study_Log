/* 새로 복원한 단원이 요약 카드로 끝나지 않도록 실행·실패·검증 맥락을 더한다. */
(function () {
  const add = (slug, title, html) => {
    const category = (window.CURATED_STUDY || []).find((item) => item.slug === slug);
    const target = category?.lessons.find((item) => item.title === title);
    if (target) target.body += html;
  };

  add("html-css", "경로·이미지·링크와 개발 도구 사용법", `<h2>정적 자원을 찾지 못할 때의 진단 순서</h2><ol><li>Elements에서 최종 <code>src</code>·<code>href</code> 값을 확인한다.</li><li>Network의 실패 요청을 열어 Request URL과 status를 본다.</li><li>그 URL을 주소창에서 직접 열어 서버가 어떤 파일을 반환하는지 확인한다.</li><li>저장소의 실제 파일명·확장자·대소문자와 비교한다.</li><li>Vite 같은 bundler를 쓴다면 public 자원과 import 자원의 처리 규칙을 구분한다.</li></ol><p>HTML 파일을 폴더 안으로 옮기면 같은 <code>./images</code>도 다른 위치를 가리킨다. 경로를 수정할 때 현재 문서 → 공통 조상 폴더 → 대상 파일 순서로 종이에 그리면 <code>../</code> 개수를 감으로 정하지 않아도 된다.</p><h3>표와 외부 라이브러리</h3><p>표 데이터는 <code>table·thead·tbody·th·td</code>로 관계를 표현한다. Bootstrap·Font Awesome CDN은 빠른 실습에는 편하지만 네트워크가 끊기면 동작하지 않고 버전이 바뀔 수 있다. 운영에서는 버전을 고정하고 integrity·license·불필요한 용량을 확인한다.</p>`);

  add("java", "메서드·오버로딩과 JVM 메모리", `<h2>참조값 복사를 코드로 확인하기</h2><pre data-lang="Java"><code>void rename(Member member) { member.setName("Kim"); }
void replace(Member member) { member = new Member("Lee"); }</code></pre><p><code>rename</code>은 복사된 참조가 가리키는 같은 객체를 수정하므로 호출자에게 보인다. <code>replace</code>는 지역 매개변수만 다른 객체를 가리키게 하므로 호출자의 참조는 그대로다. 이 차이는 배열·List를 method에 넘길 때도 동일하다.</p><h3>좋은 메서드 경계</h3><p>입력 검증, 계산, 출력까지 한 method에 넣기보다 계산 method는 값을 반환하고 화면 출력은 호출자가 맡게 한다. boolean만 반환해 실패 원인을 잃지 말고 업무상 잘못된 입력은 의미 있는 exception이나 결과 타입으로 표현한다. method 이름에 구현 방식보다 업무 의도를 담으면 Controller·Service 분리에도 같은 원칙을 적용할 수 있다.</p>`);
  add("java", "문자열·날짜·Object와 자주 쓰는 Java API", `<h2>Wrapper와 parsing</h2><p>사용자 입력은 문자열이므로 <code>Integer.parseInt</code>, <code>Long.parseLong</code>으로 변환할 때 공백·빈 값·범위 초과·<code>NumberFormatException</code>을 처리한다. Wrapper는 collection에 기본형 값을 담거나 null을 표현할 때 필요하지만 auto boxing이 반복문에서 불필요한 객체를 만들 수 있다.</p><h3>Random과 값 비교</h3><p>게임 실습의 난수는 <code>Random.nextInt(bound)</code>의 범위가 0 이상 bound 미만임을 먼저 적는다. 보안 token에는 예측 가능한 Random 대신 <code>SecureRandom</code>을 사용한다. 값 객체의 equals를 재정의했다면 HashSet·HashMap에서도 같은 객체로 동작하는지 hashCode 계약까지 테스트한다.</p><div class="note-warning"><strong>날짜 저장 기준</strong><p>서버의 현재 지역 시간에만 의존하면 배포 지역 변경과 일광 절약 시간에 흔들린다. 사건 시점은 UTC Instant로 저장하고 사용자 지역에서 표시할 때 변환한다.</p></div>`);
  add("java", "파일 입출력과 자원 닫기", `<h2>byte stream을 이어 붙이는 보조 stream</h2><p><code>FileInputStream</code>이 파일에서 byte를 읽는다면 <code>BufferedInputStream</code>은 여러 번의 작은 OS 호출을 줄이고, <code>DataInputStream</code>은 primitive 형식 읽기를 돕는다. 객체를 무조건 Java serialization로 저장하면 class 변경과 보안 문제가 생기므로 장기 보관·통신에는 JSON처럼 명시적인 형식을 우선한다.</p><pre data-lang="Java"><code>try (InputStream in = Files.newInputStream(source);
     OutputStream out = Files.newOutputStream(target)) {
    in.transferTo(out);
}</code></pre><h3>업로드 파일 검증</h3><p>확장자만 믿지 말고 크기 제한과 실제 content type을 확인하며, 원본 파일명은 화면 표시용 metadata로만 보관한다. 저장 경로는 서버가 만든 UUID 이름을 사용하고 공개 가능한 파일과 인증이 필요한 파일의 저장소를 분리한다.</p>`);

  add("git", "SourceTree로 보는 add·commit·push 흐름", `<h2>팀 작업의 하루 흐름</h2><p>작업 시작에는 main을 최신화한 뒤 feature branch를 만들고, 작업 중에는 기능이 동작하는 작은 단위로 commit한다. push 전에 원격 변경을 fetch해 내 branch가 뒤처졌는지 확인한다. Pull Request에서는 결과 파일이 아니라 diff를 기준으로 리뷰하고, merge 뒤 로컬 main을 갱신한 다음 끝난 branch를 정리한다.</p><pre data-lang="Shell"><code>git switch main
git pull --ff-only
git switch -c feature/member-search
# 작업·검증·commit
git push -u origin feature/member-search</code></pre><p>SourceTree graph에서 갈라진 선은 폴더가 나뉜 것이 아니라 commit 부모 관계다. push 버튼 옆의 force 옵션은 일반 해결 버튼이 아니며 공유 이력을 덮을 수 있으므로 사용 이유를 설명할 수 없으면 선택하지 않는다.</p>`);
  add("git", "stash·rebase·tag와 충돌 복구", `<h2>잘못 되돌렸을 때 reflog가 마지막 추적점이다</h2><p><code>git reflog</code>는 HEAD가 가리켰던 로컬 위치를 기록한다. reset으로 commit이 보이지 않게 된 경우에도 object가 정리되기 전이라면 hash를 찾아 새 branch로 복구할 수 있다. 하지만 uncommitted 파일을 discard한 내용까지 항상 복원해 주는 것은 아니므로 중요한 변경은 commit 또는 별도 patch로 남긴다.</p><h3>충돌 이후의 진짜 검증</h3><p>문법 marker를 지웠다고 기능 충돌이 해결된 것은 아니다. 양쪽 branch가 각각 수정한 API 계약, DB migration, 환경 변수 이름을 비교하고 전체 build와 통합 test를 실행한다. schema 파일 순서나 package lock처럼 자동 병합이 위험한 파일은 생성 도구를 다시 실행해 일관된 결과를 만든다.</p>`);

  add("sql", "데이터 모델링·키·정규화", `<h2>관계의 cardinality와 선택성을 적는다</h2><p>한 부서에는 여러 직원이 있고 직원은 한 부서에 속한다면 1:N이다. 부서가 아직 없는 직원이 허용되는지에 따라 외래키 NULL 가능 여부가 달라진다. 학생과 강의처럼 N:M 관계는 수강이라는 연결 엔터티로 풀고 신청일·점수 같은 관계 자체의 속성을 둔다.</p><h3>자연키와 대리키</h3><p>이메일·사업자번호 같은 자연키는 업무 의미가 있지만 변경 가능성과 길이가 있다. 숫자·UUID 대리키를 기본키로 쓰더라도 자연키의 중복을 막는 UNIQUE 제약은 남겨야 한다. 키 선택은 화면에 보이는 번호가 아니라 생성 주체, 변경 가능성, 외부 노출, 분산 생성 방식을 함께 본다.</p><h3>반정규화 전 질문</h3><p>어떤 query가 실제로 느린지 실행 계획으로 확인했는가, 중복 값을 누가 언제 갱신하는가, 실패 시 복구 기준은 무엇인가를 답하지 못하면 먼저 index·query·cache를 검토한다.</p>`);
  add("sql", "제약조건과 DDL·DML 전체 흐름", `<h2>ALTER는 운영 데이터와 함께 생각한다</h2><p>NOT NULL column을 기존 대형 테이블에 바로 추가하면 기존 행을 채울 값이 없어 실패하거나 긴 lock이 생길 수 있다. nullable column 추가 → 데이터 backfill → 검증 → NOT NULL 적용처럼 migration을 나눌 수 있다. column 삭제·타입 축소는 되돌리기 어렵기 때문에 backup과 rollback SQL을 준비한다.</p><pre data-lang="SQL"><code>MERGE INTO member_target t
USING member_source s ON (t.email = s.email)
WHEN MATCHED THEN UPDATE SET t.name = s.name
WHEN NOT MATCHED THEN INSERT (member_id, email, name)
VALUES (member_seq.NEXTVAL, s.email, s.name);</code></pre><p>INSERT ALL은 여러 대상에 조건별 insert할 때, MERGE는 일치 여부에 따른 update·insert에 사용한다. 실행 전 source 중복이 한 target을 여러 번 갱신하지 않는지 확인한다.</p>`);
  add("sql", "NULL·함수·집합 연산과 조회 순서", `<h2>OUTER JOIN 조건의 위치</h2><p>LEFT JOIN한 오른쪽 테이블 조건을 WHERE에 쓰면 NULL로 보존된 행이 제거되어 사실상 INNER JOIN이 될 수 있다. 오른쪽 행의 매칭 조건이면 ON에, 최종 결과 전체를 거르는 조건이면 WHERE에 둔다.</p><pre data-lang="SQL"><code>SELECT m.member_id, COUNT(b.board_id)
FROM member m
LEFT JOIN board b
  ON b.writer_id = m.member_id
 AND b.status = 'Y'
GROUP BY m.member_id;</code></pre><h3>문자·숫자·날짜 함수</h3><p>UPPER·SUBSTR·TRIM, ROUND·MOD, EXTRACT·날짜 연산은 편리하지만 index column을 함수로 감싸면 일반 index를 쓰기 어려울 수 있다. 검색 조건의 변환 방향과 function-based index 필요성을 실행 계획으로 확인한다.</p>`);
  add("sql", "Procedure·Function·Trigger와 PL/SQL", `<h2>PL/SQL의 변수·분기·반복과 예외</h2><p><code>%TYPE</code>은 column 타입을 따라가고 <code>%ROWTYPE</code>은 행 구조를 따른다. SELECT INTO는 0건이면 <code>NO_DATA_FOUND</code>, 여러 건이면 <code>TOO_MANY_ROWS</code>가 발생한다. 예외를 <code>WHEN OTHERS THEN NULL</code>로 삼키지 말고 업무 메시지와 원인을 남기거나 호출자에게 다시 전달한다.</p><h3>row trigger와 statement trigger</h3><p><code>FOR EACH ROW</code>가 있으면 영향받는 행마다 실행되고 <code>:OLD</code>·<code>:NEW</code>를 볼 수 있다. 대량 update에서 행마다 외부 작업을 수행하면 성능이 급격히 떨어진다. trigger가 변경한 값을 application도 다시 계산하지 않도록 책임을 한곳에 둔다.</p>`);

  add("jdbc", "JDBC 설정·PreparedStatement·자원 관리", `<h2>한 transaction에서 같은 Connection을 써야 한다</h2><p>계좌 차감과 입금 사이에 서로 다른 Connection을 얻으면 한쪽만 commit될 수 있다. 수동 JDBC에서는 Service가 Connection을 열어 DAO에 전달하고 성공 시 commit, 실패 시 rollback한 뒤 닫는다. Spring에서는 <code>@Transactional</code>이 thread에 묶인 Connection을 관리하므로 DAO가 임의로 새 Connection을 만들거나 commit하지 않는다.</p><pre data-lang="Java"><code>conn.setAutoCommit(false);
try {
    accountDao.withdraw(conn, from, amount);
    accountDao.deposit(conn, to, amount);
    conn.commit();
} catch (Exception e) {
    conn.rollback();
    throw e;
}</code></pre><p>Pool에서 받은 Connection의 close는 물리 연결 종료가 아니라 pool 반환이다. 반환 전 transaction·readOnly 같은 상태가 정상화되는지 pool이 관리하게 한다.</p>`);
  add("jdbc", "ResultSet 매핑·페이징과 DAO 검증", `<h2>생성된 키와 영향 행 수 확인</h2><p>INSERT 후 sequence 값을 다시 추측하지 말고 <code>RETURN_GENERATED_KEYS</code> 또는 DB의 RETURNING 기능으로 실제 id를 받는다. update·delete의 반환 행 수가 0이면 대상 없음이나 동시 변경일 수 있으므로 성공으로 처리하지 않는다.</p><h3>검색 조건 SQL 조립</h3><p>선택 조건을 문자열로 직접 붙이더라도 값은 계속 placeholder로 binding하고 parameter 순서를 함께 관리한다. 정렬 column과 방향은 enum·switch 허용 목록으로만 고른다. 목록 query와 count query의 WHERE 조건이 달라지면 페이지 총수가 틀어지므로 하나의 조건 모델을 공유한다.</p>`);

  add("servlet-jsp", "forward·redirect·scope·session·cookie", `<h2>EL이 값을 찾는 순서</h2><p><code>\${member.name}</code>은 보통 page → request → session → application scope 순서로 이름을 찾는다. 같은 이름을 여러 scope에 두면 예상과 다른 값이 보이므로 <code>requestScope.member</code>처럼 명시할 수 있다. JSP는 출력에 집중하고 scriptlet Java 로직은 Servlet·Service로 옮긴다.</p><h3>Cookie 속성</h3><p>Path는 어느 URL에 보낼지, Max-Age는 수명, HttpOnly는 JavaScript 접근 차단, Secure는 HTTPS 전송, SameSite는 cross-site 전송 범위를 정한다. session id cookie를 URL 전체에 불필요하게 넓히지 않고 로그인 성공 시 session fixation을 막기 위해 session id를 교체한다.</p>`);
  add("mybatis", "MyBatis 초기 설정과 Mapper 연결", `<h2>boot 실패와 query 실패를 분리한다</h2><p>DataSource URL·driver·계정이 틀리면 application 시작이나 첫 연결에서 실패한다. mapper XML 문법·namespace 중복은 build 시 parsing 오류로 드러나고, column·table 오타는 해당 statement 실행 순간 DB 오류가 난다. 오류 메시지의 <code>resource</code>, <code>statement id</code>, 실제 SQL, root cause 순서로 읽는다.</p><h3>logging 주의</h3><p>개발 환경에서 SQL과 parameter를 보면 편하지만 비밀번호·주민번호 같은 값이 log에 남을 수 있다. 운영에서는 SQL timing과 statement 식별자는 남기되 민감 parameter masking과 log 보존 기간을 적용한다.</p>`);
  add("spring-core", "Bean 생명주기·scope·profile과 설정 분리", `<h2>초기화 callback을 constructor와 구분한다</h2><p>constructor 시점에는 주입과 proxy 후처리가 끝나지 않았을 수 있다. 모든 의존성이 준비된 뒤 해야 하는 가벼운 검증은 <code>@PostConstruct</code>를 사용할 수 있지만 외부 API 호출처럼 실패·지연 가능한 작업으로 전체 부팅을 불안정하게 만들지 않는다. 종료 시 thread pool·client 자원을 닫아야 하면 <code>@PreDestroy</code>를 사용한다.</p><h3>Proxy 때문에 생기는 경계</h3><p><code>@Transactional</code>·AOP는 대개 bean을 감싼 proxy를 통해 적용된다. 같은 객체 안에서 private method나 self-invocation으로 호출하면 proxy를 지나지 않아 기대한 부가 기능이 적용되지 않을 수 있다. annotation을 붙이기 전에 호출 경계를 확인한다.</p>`);

  add("jpa", "cascade·orphanRemoval과 도메인 상태 전이", `<h2>양방향 연관관계는 두 메모리 방향을 함께 맞춘다</h2><p>DB 외래키를 실제로 바꾸는 owning side와 Java 탐색 편의를 위한 inverse side가 다르다. 편의 method에서 두 쪽을 함께 연결하지 않으면 같은 transaction 안의 객체 graph가 DB 결과와 다르게 보일 수 있다. JSON 직렬화에서는 양쪽 참조가 무한 순환하므로 Entity를 응답으로 직접 쓰지 않는다.</p><h3>고아 삭제의 정확한 의미</h3><p>orphanRemoval은 부모 collection에서 빠진 자식을 DB에서도 삭제한다. 단순 관계 해제가 아니라 데이터 삭제이므로 다른 곳에서 참조하거나 이력을 보존해야 하는 자식에는 적합하지 않다. 삭제 SQL이 언제 발생하는지 transaction commit 시점까지 확인한다.</p>`);
  add("security", "인증 흐름 통합 테스트와 공격 시나리오", `<h2>동시 요청과 token 탈취까지 생각한다</h2><p>Refresh token rotation에서 두 요청이 동시에 재발급을 시도하면 하나만 성공하도록 원자적으로 사용 상태를 바꿔야 한다. 탈취된 token을 발견하면 해당 기기 하나만 로그아웃할지 사용자 전체 세션을 폐기할지 정책을 정한다. token에는 최소 claim만 넣고 개인정보와 권한 변경이 즉시 반영돼야 하는 값은 서버에서 다시 확인한다.</p><h3>오류 응답도 정보 노출을 통제한다</h3><p>아이디 없음과 비밀번호 틀림을 외부에서 지나치게 구분하면 계정 열거가 가능하다. client에는 안정적인 code와 일반 메시지를 주고, 내부 log에는 correlation id·실패 단계·사용자 식별자의 안전한 형태를 남긴다. JWT 원문과 Authorization header는 기록하지 않는다.</p>`);

  add("infra", "Linux 파일·권한·프로세스·네트워크 명령", `<h2>경로와 삭제 명령을 다루는 습관</h2><p><code>rm -rf</code> 전에 <code>pwd</code>와 대상의 절대 경로를 확인하고 wildcard가 무엇에 확장되는지 본다. application 실행 user는 home·working directory·log directory·upload directory에 필요한 최소 권한만 갖게 한다. root로 application을 실행해 권한 문제를 숨기지 않는다.</p><h3>환경 변수 확인</h3><p>interactive shell에서 보이는 변수가 systemd service에는 없을 수 있다. unit의 <code>EnvironmentFile</code>, <code>WorkingDirectory</code>, <code>ExecStart</code>, 실행 user를 확인하고 수정 후 <code>daemon-reload</code>와 restart를 한다. secret 값 자체는 status와 log에 출력하지 않는다.</p>`);
  add("realtime", "채팅 메시지 순서·중복·재접속 설계", `<h2>방 단위 권한을 매 메시지에서 확인한다</h2><p>WebSocket 연결 때 인증했더라도 사용자가 어떤 room을 publish·subscribe할 수 있는지는 destination마다 검증한다. client가 보낸 senderId를 신뢰하지 말고 인증 principal에서 작성자를 결정한다. 메시지 길이·type·첨부 key도 서버에서 검증한다.</p><h3>순서는 하나의 서버 시계만으로도 완벽하지 않다</h3><p>여러 instance에서 동시에 생성된 메시지는 같은 timestamp를 가질 수 있다. DB sequence나 시간+고유 id를 안정적인 정렬 기준으로 쓰고 client는 server가 확정한 순서를 따른다. 읽음 처리는 사용자별 마지막 읽은 message id로 압축할 수 있으며 방 인원이 많을 때 메시지마다 읽음 행을 무한히 늘리지 않도록 모델을 고른다.</p>`);
})();
