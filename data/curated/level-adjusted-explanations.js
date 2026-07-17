/* 사용자의 원문 필기에서 드러난 이해 수준에 맞춰, 압축됐던 고난도 노트에 설명의 중간 단계를 보충한다. */
(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const bridge = (lead, terms, steps, confusion) => `<section class="level-bridge"><span>먼저 이해할 것</span><p>${lead}</p>${terms?.length ? `<dl>${terms.map(([term, meaning]) => `<div><dt>${term}</dt><dd>${meaning}</dd></div>`).join("")}</dl>` : ""}${steps?.length ? `<h3>실제로는 이 순서로 움직인다</h3><ol>${steps.map((step) => `<li>${step}</li>`).join("")}</ol>` : ""}${confusion ? `<div class="level-confusion"><b>여기서 많이 헷갈린다</b><p>${confusion}</p></div>` : ""}</section>`;
  const prepend = (slug, index, content) => {
    const lesson = category(slug)?.lessons[index];
    if (lesson) lesson.body = content + lesson.body;
  };

  prepend("sql", 4, bridge(
    "트랜잭션은 SQL 문법 하나가 아니라 여러 변경을 하나의 업무로 묶는 약속이다. 주문은 저장됐는데 재고는 그대로인 상태처럼, 중간 결과만 DB에 남지 않게 하는 것이 목적이다.",
    [["commit", "현재 트랜잭션의 변경을 최종 확정한다."], ["rollback", "아직 확정되지 않은 변경을 시작 전 상태로 되돌린다."], ["lock", "동시에 같은 데이터를 바꾸려는 작업의 순서를 조정한다."]],
    ["요청이 들어오면 하나의 DB 연결에서 트랜잭션을 시작한다.", "필요한 행을 읽고 주문 저장·재고 차감 같은 SQL을 실행한다.", "모두 성공하면 commit하고, 하나라도 실패하면 rollback한다.", "다른 요청과 같은 행을 수정했다면 lock 또는 version 충돌을 처리한다."],
    "트랜잭션이 있다고 동시성 문제가 자동으로 사라지는 것은 아니다. 두 요청이 같은 값을 읽은 뒤 수정하면 lost update가 생길 수 있어 조건부 UPDATE, 낙관적 락, 비관적 락 중 하나가 추가로 필요하다."
  ));
  prepend("sql", 5, bridge(
    "인덱스는 책의 색인처럼 전체 행을 처음부터 읽지 않고 후보 위치를 찾게 해 주는 별도 자료구조다. 조회는 빨라질 수 있지만 저장할 때 인덱스도 함께 갱신해야 한다.",
    [["full scan", "테이블의 많은 블록을 순서대로 읽는다."], ["index scan", "인덱스에서 조건에 맞는 위치를 찾고 테이블 행에 접근한다."], ["실행 계획", "DB가 어떤 순서와 방법으로 SQL을 처리할지 보여 주는 계획이다."]],
    ["WHERE·JOIN·ORDER BY에서 자주 사용하는 조건을 찾는다.", "데이터 분포와 반환 비율을 확인해 인덱스 후보를 정한다.", "실행 계획에서 실제로 인덱스를 선택했는지 확인한다.", "INSERT·UPDATE 비용과 저장 공간까지 비교한 뒤 유지 여부를 결정한다."],
    "인덱스를 만들었다고 반드시 사용되는 것은 아니다. 대부분의 행을 가져오거나 인덱스 열에 함수를 씌우면 DB가 full scan이 더 싸다고 판단할 수 있다."
  ));

  prepend("jdbc", 3, bridge(
    "Connection은 단순한 주소 문자열이 아니라 DB와 대화하는 한 세션이다. 같은 트랜잭션에 포함할 DAO들은 반드시 같은 Connection을 사용해야 한다.",
    [["auto commit", "SQL 한 문장이 끝날 때마다 자동 확정하는 기본 모드다."], ["connection pool", "연결을 매번 새로 만들지 않고 미리 만들어 빌려주는 저장소다."], ["connection leak", "빌린 연결을 반환하지 않아 pool이 고갈되는 문제다."]],
    ["Service가 pool에서 Connection 하나를 빌린다.", "auto commit을 끄고 그 Connection을 여러 DAO에 전달한다.", "모든 DAO 작업이 성공하면 commit, 실패하면 rollback한다.", "finally 또는 try-with-resources에서 Connection을 pool로 반환한다."],
    "DAO가 각자 dataSource.getConnection()을 호출하면 코드상 한 Service 안에 있어도 서로 다른 트랜잭션이다."
  ));

  prepend("javascript", 4, bridge(
    "함수는 호출이 끝나면 지역 변수가 사라지는 것이 기본이지만, 반환된 함수가 그 변수를 계속 참조하면 JavaScript가 해당 환경을 보존한다. 이것이 closure다.",
    [["호출 시점의 this", "일반 함수의 this는 함수를 누가 어떤 방식으로 호출했는지에 따라 정해진다."], ["lexical scope", "변수를 함수가 작성된 코드 위치를 기준으로 찾는 규칙이다."], ["closure", "함수와 그 함수가 기억하는 바깥 변수 환경의 조합이다."]],
    ["바깥 함수가 지역 변수를 만든다.", "안쪽 함수가 그 변수를 읽거나 변경한다.", "안쪽 함수가 반환되거나 event handler로 등록된다.", "바깥 함수 실행이 끝나도 안쪽 함수가 필요한 변수는 유지된다."],
    "화살표 함수는 자체 this를 만들지 않는다. 메서드를 무조건 화살표 함수로 바꾸면 객체 자신을 가리킬 것이라는 기대와 다르게 동작할 수 있다."
  ));
  prepend("javascript", 5, bridge(
    "폼 검증은 사용자가 틀린 값을 빨리 고치도록 돕는 과정이지 보안의 최종 방어선이 아니다. 브라우저에서 통과한 요청도 직접 조작할 수 있으므로 서버가 같은 규칙을 다시 검사한다.",
    [["client validation", "필수값·길이·형식을 화면에서 즉시 안내한다."], ["server validation", "권한·중복·업무 규칙을 신뢰 가능한 서버에서 판정한다."], ["FormData", "문자열 필드와 File을 multipart 요청으로 묶는 객체다."]],
    ["submit event에서 preventDefault로 기본 전송을 잠시 막는다.", "input 값을 읽고 필드별 오류를 화면에 표시한다.", "검증을 통과하면 JSON 또는 FormData로 요청을 만든다.", "서버 오류 응답을 다시 필드 오류와 전체 오류로 나눠 보여 준다."],
    "정규식은 문자열 모양만 검사한다. 이메일이 실제로 존재하는지, 비밀번호가 유출된 적 있는지, 파일 내용이 안전한지는 별도 검증이 필요하다."
  ));

  prepend("mybatis", 2, bridge(
    "MyBatis Mapper 호출도 결국 JDBC Connection에서 SQL을 실행한다. 따라서 여러 Mapper 메서드를 하나의 업무로 묶는 위치는 DAO가 아니라 Service의 트랜잭션 경계다.",
    [["영향 행 수", "INSERT·UPDATE·DELETE가 실제로 변경한 행의 수다."], ["생성 키", "DB가 INSERT 뒤 만든 PK 값이다."], ["SqlSession", "Mapper 실행과 Connection을 묶어 관리하는 MyBatis 세션이다."]],
    ["Controller가 요청 DTO를 Service에 넘긴다.", "Service의 @Transactional proxy가 트랜잭션을 시작한다.", "여러 Mapper가 같은 SqlSession과 Connection에서 SQL을 실행한다.", "정상 반환이면 commit하고 예외가 밖으로 전달되면 rollback한다."],
    "update 결과가 0인데 예외가 없다고 성공은 아니다. 대상이 없었거나 WHERE가 틀렸을 수 있으므로 기대 행 수를 확인해야 한다."
  ));
  prepend("mybatis", 3, bridge(
    "N+1은 목록 한 번을 조회한 뒤 각 행의 연관 데이터를 다시 한 번씩 조회해 SQL이 폭증하는 현상이다. 화면은 정상이라 작은 데이터에서는 놓치기 쉽다.",
    [["nested select", "resultMap에서 다른 select를 호출해 연관 객체를 채우는 방식이다."], ["offset paging", "앞의 행을 건너뛴 뒤 일정 개수를 가져온다."], ["keyset paging", "마지막으로 본 키 다음부터 가져온다."]],
    ["SQL 로그에서 한 요청이 실행한 쿼리 개수를 센다.", "반복되는 SQL이 부모 행 수만큼 실행되는지 확인한다.", "JOIN 매핑 또는 ID 목록 일괄 조회로 쿼리 수를 고정한다.", "실제 데이터 양으로 paging SQL과 실행 계획을 다시 확인한다."],
    "JOIN 하나로 합치면 SQL 수는 줄지만 1:N 관계에서 부모 행이 반복된다. resultMap의 id 설정과 중복 합성 결과까지 확인해야 한다."
  ));

  prepend("spring-mvc", 3, bridge(
    "DispatcherServlet은 모든 일을 직접 하는 Controller가 아니라, 요청을 처리할 적절한 부품을 찾아 연결하는 중앙 창구다.",
    [["HandlerMapping", "URL과 HTTP method에 맞는 Controller method를 찾는다."], ["HandlerAdapter", "찾은 handler를 호출할 수 있게 parameter와 반환값을 처리한다."], ["MessageConverter", "JSON과 Java 객체를 서로 변환한다."]],
    ["Servlet Filter를 통과한 요청이 DispatcherServlet에 도착한다.", "HandlerMapping이 실행할 Controller method를 찾는다.", "ArgumentResolver와 Converter가 method 인자를 만든다.", "Controller 반환값을 ViewResolver 또는 MessageConverter가 HTTP 응답으로 바꾼다."],
    "@RestController에서는 객체 반환이 View 이름이 아니라 JSON body가 된다. @Controller에서 문자열을 반환하는 경우와 섞어 이해하면 화면 경로 오류가 생긴다."
  ));
  prepend("spring-mvc", 4, bridge(
    "바인딩은 HTTP의 문자열 데이터를 Java 타입으로 옮기는 일이고, 검증은 변환된 값이 사용 가능한지 판단하는 일이다. 둘은 같은 과정이 아니다.",
    [["binding", "path·query·form·JSON 값을 method parameter나 DTO에 채운다."], ["Bean Validation", "@NotBlank, @Email처럼 입력 형식 규칙을 검사한다."], ["business validation", "중복 가입·재고 부족처럼 DB와 업무 상태가 필요한 규칙을 검사한다."]],
    ["Content-Type에 맞는 resolver 또는 converter가 요청을 읽는다.", "DTO가 만들어지면 @Valid가 형식 규칙을 검사한다.", "Controller는 검증된 DTO를 Service 명령으로 넘긴다.", "Service가 DB 상태와 권한이 필요한 업무 규칙을 최종 판단한다."],
    "JSON 요청에 @ModelAttribute를 쓰거나 form 요청에 @RequestBody를 쓰면 값이 채워지지 않을 수 있다. 먼저 요청의 Content-Type부터 확인한다."
  ));
  prepend("spring-mvc", 5, bridge(
    "오류 응답은 사용자에게 보여 줄 정보와 개발자가 원인을 찾을 정보를 분리해야 한다. 내부 예외 메시지를 그대로 보내면 구현 구조나 민감한 값이 노출될 수 있다.",
    [["ControllerAdvice", "여러 Controller에서 발생한 MVC 예외를 공통 처리한다."], ["error code", "클라이언트가 실패 종류를 안정적으로 구분하는 애플리케이션 코드다."], ["request ID", "한 요청의 여러 계층 로그를 연결하는 식별자다."]],
    ["가장 구체적인 업무 예외를 의미 있는 HTTP status와 code로 변환한다.", "입력 오류는 field와 reason 목록으로 만든다.", "예상하지 못한 오류는 안전한 500 응답을 보내고 전체 원인은 서버 로그에 남긴다.", "Security Filter에서 끝난 오류는 MVC Advice가 아닌 보안 handler에서 처리한다."],
    "모든 Exception을 한 handler에서 200으로 반환하면 클라이언트가 성공과 실패를 구분하기 어렵고 모니터링도 실패를 놓친다."
  ));

  prepend("spring-core", 2, bridge(
    "encoding, encryption, hashing은 모두 문자열이 달라 보이지만 목적이 다르다. 특히 비밀번호는 원문을 다시 알아낼 필요가 없으므로 암호화보다 password hashing이 맞다.",
    [["encoding", "전송·표현 형식을 바꾸며 누구나 규칙을 알면 되돌릴 수 있다."], ["encryption", "key를 가진 주체가 원문을 복구할 수 있게 보호한다."], ["password hash", "salt와 반복 비용을 사용해 원문 복원을 어렵게 하고 일치 여부만 검사한다."]],
    ["회원가입에서 PasswordEncoder가 매번 다른 salt를 포함한 hash를 만든다.", "DB에는 hash만 저장하고 raw password는 로그와 객체에 오래 남기지 않는다.", "로그인에서는 matches(raw, storedHash)로 비교한다.", "DB password와 signing key는 코드 밖 Secret 저장소에서 주입하고 주기적으로 교체한다."],
    "단순 SHA-256 한 번은 비밀번호 저장용으로 부족하다. 빠른 hash는 공격자도 빠르게 대입할 수 있어 BCrypt·Argon2 같은 느린 전용 알고리즘을 사용한다."
  ));

  const react = [
    ["React 컴포넌트는 화면 그 자체가 아니라 현재 props와 state로부터 화면 모양을 계산하는 함수다.", [["render", "컴포넌트 함수를 호출해 다음 JSX를 계산하는 단계다."], ["commit", "계산 결과 중 필요한 변경을 실제 DOM에 반영하는 단계다."]], ["처음 mount할 때 컴포넌트 함수가 실행된다.", "event가 setState를 호출하면 다음 render가 예약된다.", "React가 이전 결과와 새 결과를 비교한다.", "달라진 DOM만 commit한 뒤 화면이 갱신된다."], "render 중 API 호출이나 setState를 하면 계산 과정이 다시 계산을 불러 무한 반복이 생길 수 있다."],
    ["컴포넌트를 나누는 기준은 파일 길이가 아니라 서로 다른 이유로 변경되는 책임이다.", [["props", "부모가 자식에게 읽기 전용으로 전달하는 값이다."], ["callback prop", "자식이 부모에게 변경을 요청하도록 전달하는 함수다."]], ["부모가 데이터 state를 소유한다.", "자식에게 필요한 값과 callback만 props로 전달한다.", "자식 event가 callback을 호출한다.", "부모 state가 바뀌면 새 props로 자식이 다시 render된다."], "자식이 props 객체를 직접 수정하면 부모 state와 화면의 기준이 갈라진다. 변경 요청은 callback으로 올린다."],
    ["state는 계속 변하는 상자라기보다 특정 render가 찍어 둔 값의 스냅샷이다.", [["불변성", "기존 객체를 고치지 않고 새 객체를 만들어 변경을 표현하는 규칙이다."], ["함수형 업데이트", "이전 state를 인자로 받아 다음 state를 계산한다."]], ["event handler는 현재 render의 state를 읽는다.", "setState가 다음 값을 update queue에 넣는다.", "handler가 끝난 뒤 React가 update를 처리한다.", "새 state로 컴포넌트가 다시 실행된다."], "setState 직후 같은 함수에서 state를 읽으면 이전 값일 수 있다. 이전 값에 의존하면 setCount(prev => prev + 1)을 사용한다."],
    ["controlled input에서는 input의 현재 표시값도 React state가 결정한다.", [["value", "state에서 input으로 내려가는 현재 값이다."], ["onChange", "사용자 입력을 다시 state에 반영하는 event다."]], ["사용자가 키를 입력하면 change event가 발생한다.", "handler가 name과 value를 읽어 새 form 객체를 만든다.", "state 변경으로 다시 render된다.", "새 value가 input에 표시된다."], "value만 주고 onChange가 없으면 input은 읽기 전용처럼 보인다. 파일 input은 value 대신 files에서 File 객체를 읽는다."],
    ["Router는 화면을 숨기고 보이는 도구가 아니라 URL과 페이지 컴포넌트의 대응 규칙을 관리한다.", [["path parameter", "자원 ID처럼 경로의 일부가 되는 값이다."], ["query string", "검색·정렬·페이지처럼 선택 가능한 조건이다."]], ["브라우저 URL이 변경된다.", "Routes가 가장 맞는 path를 찾는다.", "useParams·useSearchParams가 URL 상태를 읽는다.", "페이지가 해당 값으로 데이터를 요청하고 화면을 만든다."], "일반 이동은 Link, 작업 성공 후 이동은 useNavigate가 자연스럽다. 새로고침 배포 오류는 Router보다 서버 fallback 설정 문제일 수 있다."],
    ["Effect는 state를 계산하는 장소가 아니라 React 밖의 시스템을 현재 화면 상태와 맞추는 장소다.", [["dependency", "Effect가 다시 동기화되어야 하는 값을 나타낸다."], ["cleanup", "이전 구독·timer·요청을 정리하는 함수다."]], ["render가 끝나 DOM이 commit된다.", "dependency가 달라졌으면 이전 cleanup이 먼저 실행된다.", "새 Effect가 API·timer·subscription을 시작한다.", "unmount 때 마지막 cleanup이 실행된다."], "dependency를 빼서 실행 횟수를 줄이는 것이 해결책은 아니다. Effect가 읽는 값과 dependency를 맞추고, 오래된 요청은 AbortController로 취소한다."],
    ["ref는 render 사이에 값을 보존하지만 값을 바꿔도 화면을 다시 계산하지 않는 상자다.", [["ref.current", "보존되는 실제 값 또는 DOM 객체다."], ["DOM ref", "React가 생성한 실제 element를 가리킨다."]], ["useRef가 동일한 ref 객체를 유지한다.", "ref 속성이 연결되면 commit 뒤 current에 DOM이 들어간다.", "event에서 focus·scroll 같은 명령을 호출한다.", "unmount되면 DOM ref는 null이 된다."], "화면에 보여야 하는 값을 ref에 저장하면 변경해도 render되지 않는다. 그런 값은 state가 맞다."],
    ["전역 상태 도구는 멀리 떨어진 컴포넌트가 같은 값을 쓰는 문제를 풀지만, 서버 데이터와 모든 입력값까지 넣는 공간은 아니다.", [["Context", "트리 아래 여러 컴포넌트에 값을 전달한다."], ["reducer", "action에 따라 state가 어떻게 바뀌는지 한 함수에 모은다."], ["selector", "store에서 화면에 필요한 일부 값만 읽는다."]], ["UI가 action을 dispatch한다.", "reducer가 이전 state와 action으로 다음 state를 만든다.", "store가 바뀐다.", "해당 값을 선택한 컴포넌트가 다시 render된다."], "Context value 객체를 render마다 새로 만들면 모든 consumer가 자주 다시 render될 수 있다. 상태 범위부터 작게 유지한다."],
    ["Axios 모듈은 HTTP 통신의 공통 규칙을 모으고, Vite proxy는 개발 브라우저의 요청을 백엔드로 대신 전달한다.", [["baseURL", "모든 API 요청 앞에 붙는 공통 경로다."], ["interceptor", "요청 전 또는 응답 후 공통 처리를 끼워 넣는다."], ["proxy", "개발 서버가 특정 경로 요청을 다른 서버로 전달한다."]], ["컴포넌트가 도메인 API 함수를 호출한다.", "Axios instance가 baseURL·header·timeout을 적용한다.", "개발 중 /api 요청은 Vite가 Spring 서버로 전달한다.", "응답은 API 함수에서 정리되어 컴포넌트의 loading·error·data 상태로 반영된다."], "proxy는 운영 배포에서 자동으로 존재하지 않는다. 운영 reverse proxy나 CORS 정책을 별도로 준비해야 한다."]
  ];
  react.forEach((args, index) => prepend("react", index, bridge(...args)));

  const jpa = [
    ["JPA의 핵심은 Java 객체를 SQL로 자동 변환한다는 말보다, 영속성 컨텍스트가 어떤 Entity를 추적하고 있는지 이해하는 데 있다.", [["Entity", "테이블의 한 행과 연결되는 식별 가능한 객체다."], ["영속성 컨텍스트", "조회·저장한 Entity를 추적하는 작업 공간이다."], ["flush", "추적한 변경을 SQL로 만들어 DB에 전달한다."]], ["Repository가 Entity를 조회하면 managed 상태가 된다.", "Service가 같은 객체의 값을 변경한다.", "flush 시점에 이전 snapshot과 비교한다.", "변경이 있으면 UPDATE SQL을 실행하고 transaction commit으로 확정한다."], "flush는 commit이 아니다. SQL이 DB에 전달돼도 transaction이 rollback되면 최종 데이터는 되돌아간다."],
    ["Entity mapping은 annotation을 붙이는 일이 아니라 객체 필드와 DB 제약조건 사이의 변환 규칙을 선언하는 일이다.", [["식별자", "Entity를 다른 객체와 구분하고 같은 DB 행을 찾는 기준이다."], ["constraint", "NOT NULL·UNIQUE처럼 DB가 마지막으로 지키는 규칙이다."]], ["요청 DTO가 외부 입력을 받는다.", "Service가 검증된 값으로 Entity를 생성한다.", "JPA가 mapping 정보를 보고 INSERT를 만든다.", "DB가 PK·제약조건을 검사하고 결과를 확정한다."], "DTO validation을 통과해도 동시 요청의 중복은 생길 수 있다. DB UNIQUE 제약과 예외 변환이 함께 필요하다."],
    ["조회 도구는 더 강한 것을 고르는 문제가 아니라 조건의 복잡도와 반환 형태에 맞는 가장 단순한 방법을 고르는 문제다.", [["파생 쿼리", "method 이름으로 짧은 조건을 표현한다."], ["JPQL", "테이블이 아닌 Entity와 field를 기준으로 작성한다."], ["projection", "Entity 전체가 아니라 필요한 값만 조회한다."]], ["고정되고 단순한 조건이면 파생 쿼리를 사용한다.", "직접 표현할 고정 조회는 JPQL로 작성한다.", "선택 조건이 조합되면 QueryDSL predicate를 만든다.", "화면에 일부 값만 필요하면 DTO projection을 검토한다."], "method 이름이 지나치게 길어지면 동작은 해도 의도가 읽히지 않는다. QueryDSL이나 명시적 query로 옮길 시점이다."],
    ["@Transactional은 Entity를 특별하게 만드는 annotation이 아니라 Service method 호출 전후에 transaction을 여닫는 proxy 규칙이다.", [["dirty checking", "managed Entity의 처음 상태와 현재 상태를 비교해 변경 SQL을 만드는 기능이다."], ["readOnly", "조회 목적임을 선언해 불필요한 변경 감지를 줄일 수 있는 힌트다."]], ["외부 객체가 transactional Service method를 호출한다.", "proxy가 transaction과 EntityManager를 준비한다.", "조회된 Entity가 managed 상태에서 변경된다.", "method가 정상 종료되면 flush와 commit이 진행된다."], "같은 클래스 내부에서 this.method()로 호출하면 proxy를 지나지 않아 새 transaction 설정이 적용되지 않을 수 있다."],
    ["객체는 양쪽을 참조할 수 있지만 DB 외래 키는 한 열에만 존재한다. 연관관계의 주인은 그 외래 키 값을 실제로 UPDATE하는 쪽이다.", [["ManyToOne", "여러 자식 행이 하나의 부모를 참조한다."], ["mappedBy", "이 필드는 반대편 mapping을 읽기만 한다는 표시다."], ["cascade", "부모 작업을 연관 Entity의 생명주기로 전파한다."]], ["자식 Entity에 부모 reference를 설정한다.", "필요하면 편의 method가 부모 collection도 함께 갱신한다.", "flush 때 주인 쪽 foreign key 값으로 SQL이 만들어진다.", "조회 시 LAZY 설정이면 실제 접근할 때 연관 데이터를 읽는다."], "양방향 관계의 두 객체를 모두 맞추지 않으면 DB는 맞아도 현재 메모리 상태가 어긋날 수 있다. 편의 method로 한 곳에서 함께 설정한다."],
    ["LAZY는 연관 데이터를 나중에 읽는 전략이고, N+1은 그 나중 조회가 목록 반복 안에서 N번 발생한 결과다.", [["proxy", "실제 Entity 대신 있다가 접근 시 데이터를 조회하는 대리 객체다."], ["fetch join", "특정 조회에서 필요한 연관 데이터를 한 SQL로 함께 가져온다."], ["batch fetch", "여러 proxy를 일정 개수씩 묶어 조회한다."]], ["부모 목록을 한 SQL로 조회한다.", "각 부모의 LAZY 연관 field를 반복문에서 접근한다.", "초기화되지 않은 proxy마다 추가 SELECT가 실행된다.", "쿼리 로그와 용도에 맞춰 fetch join·projection·batch 전략을 적용한다."], "모든 관계를 EAGER로 바꾸면 다른 화면에서도 불필요한 JOIN과 예측하기 어려운 SQL이 생긴다."],
    ["Entity는 DB 내부 모델이고 Response DTO는 외부에 약속한 API 모델이다. 두 모델의 변경 이유가 다르므로 경계를 분리한다.", [["Request DTO", "외부 입력 형식과 validation을 담당한다."], ["Response DTO", "클라이언트에 공개할 필드와 JSON 구조를 정의한다."], ["lazy initialization", "영속성 컨텍스트 밖에서 아직 읽지 않은 연관 데이터에 접근하는 문제다."]], ["Controller가 Request DTO를 받는다.", "Service가 Entity를 조회·변경한다.", "transaction 안에서 필요한 값을 Response DTO로 변환한다.", "Controller가 DTO를 JSON으로 응답한다."], "Entity를 그대로 반환하면 양방향 참조 무한 순환, 민감 필드 노출, API와 DB 구조 결합이 함께 생길 수 있다."],
    ["QueryDSL의 장점은 문자열 SQL을 없애는 것보다 Java field를 기준으로 조건을 조합해 컴파일 단계에서 오류를 찾는 데 있다.", [["Q-type", "Entity field 경로를 타입 안전하게 표현하는 생성 클래스다."], ["predicate", "where에 넣을 수 있는 조건 표현식이다."], ["count query", "페이지 전체 개수를 계산하는 별도 조회다."]], ["검색 DTO의 각 값이 비어 있는지 확인한다.", "값이 있으면 작은 predicate method가 조건을 반환하고 없으면 null을 반환한다.", "where가 null 조건을 제외하고 나머지를 AND로 조합한다.", "content 조회와 count 조회의 JOIN 필요성을 각각 판단한다."], "정렬 field를 요청 문자열 그대로 path로 만들면 허용하지 않은 열 접근이나 오류가 생긴다. enum 허용 목록으로 변환한다."]
  ];
  jpa.forEach((args, index) => prepend("jpa", index, bridge(...args)));

  const security = [
    ["인증은 사용자 신원을 확인하는 단계이고, 인가는 확인된 사용자가 특정 기능을 사용할 수 있는지 판단하는 다음 단계다.", [["principal", "인증된 사용자를 대표하는 정보다."], ["authority", "사용자가 허용받은 role 또는 scope다."], ["credential", "비밀번호처럼 신원을 증명하는 값이다."]], ["로그인 요청이 credential을 제출한다.", "서버가 사용자와 비밀번호를 검증해 Authentication을 만든다.", "이후 요청에서 인증 정보를 복원한다.", "URL·method에 필요한 authority와 비교해 접근을 허용하거나 거부한다."], "401은 인증 자체가 없거나 실패한 경우이고, 403은 신원은 확인됐지만 권한이 부족한 경우다."],
    ["Spring Security는 Controller 앞에 여러 Filter를 순서대로 두고 인증 정보 생성과 접근 허용 여부를 처리한다.", [["SecurityFilterChain", "적용할 Filter와 URL 접근 규칙의 순서를 정의한다."], ["AuthenticationManager", "인증 요청을 처리할 Provider에 전달한다."], ["SecurityContext", "현재 요청에서 인증된 사용자 정보를 보관한다."]], ["요청이 Security Filter Chain에 들어온다.", "인증 Filter가 cookie 또는 Authorization header를 확인한다.", "성공하면 Authentication을 SecurityContext에 저장한다.", "Authorization Filter가 endpoint 규칙과 authority를 비교한 뒤 Controller로 보낸다."], "permitAll은 해당 URL에서 인증을 요구하지 않는다는 뜻이지 Security Filter 전체가 실행되지 않는다는 뜻은 아니다."],
    ["회원가입은 계정을 만드는 기능이고 로그인은 기존 계정의 credential을 검증하는 기능이다. 비밀번호 원문은 두 과정 어디에서도 DB에 저장하지 않는다.", [["PasswordEncoder", "비밀번호를 salt가 포함된 hash로 만들고 일치 여부를 검사한다."], ["unique constraint", "동시 가입 요청에서도 email 중복을 DB가 막는 마지막 규칙이다."]], ["DTO 형식을 검증하고 email 중복을 조회한다.", "서버가 허용한 기본 role을 결정한다.", "PasswordEncoder로 raw password를 hash한다.", "Entity를 저장하고 raw password가 남지 않게 한다."], "클라이언트가 role을 보내게 두면 ADMIN 값을 조작할 수 있다. 가입 시 권한은 서버 정책으로 정한다."],
    ["로그인은 username과 password를 바로 JWT와 비교하지 않는다. 먼저 DB의 사용자·password hash로 인증한 뒤, 성공 결과를 증명하는 JWT를 새로 발급한다.", [["attemptAuthentication", "요청에서 credential을 읽어 미인증 Authentication을 만든다."], ["UserDetailsService", "DB에서 로그인 대상을 조회한다."], ["successfulAuthentication", "검증 성공 뒤 token 또는 응답을 만든다."]], ["로그인 Filter가 JSON body를 읽는다.", "AuthenticationManager가 UserDetails와 password hash를 검증한다.", "성공한 Authentication에서 사용자 ID와 authority를 얻는다.", "서버가 만료 시간이 있는 Access Token을 서명해 응답한다."], "JWT payload는 암호화되지 않아 누구나 읽을 수 있다. 비밀번호와 개인정보를 claim에 넣지 않는다."],
    ["JWT Filter의 목적은 token 문자열을 decode하는 것이 아니라 서명·만료·발급자까지 검증한 뒤 현재 요청의 인증 상태를 복원하는 것이다.", [["Bearer Token", "Authorization header에 실어 보내는 접근 token 형식이다."], ["signature", "token 내용이 서버 발급 후 바뀌지 않았는지 확인한다."], ["OncePerRequestFilter", "한 요청에서 한 번 실행되도록 돕는 Filter 기반 클래스다."]], ["Authorization header가 Bearer 형식인지 확인한다.", "token의 signature·exp·iss·aud를 검증한다.", "검증된 subject와 authority로 Authentication을 만든다.", "SecurityContext에 저장하고 다음 Filter로 요청을 넘긴다."], "Base64 decode가 성공한 것은 인증 성공이 아니다. 공격자도 임의 payload를 만들 수 있으므로 signature 검증이 필수다."],
    ["Access Token을 짧게 두면 탈취 피해 시간은 줄지만 사용자는 자주 로그인해야 한다. Refresh Token은 이 불편을 줄이는 대신 더 엄격한 저장·폐기 규칙이 필요하다.", [["rotation", "재발급할 때 Refresh Token도 새것으로 교체한다."], ["revocation", "로그아웃·탈취 시 더 이상 사용할 수 없도록 폐기한다."], ["reuse detection", "이미 교체된 token의 재사용을 찾아 token 묶음을 무효화한다."]], ["로그인 성공 시 짧은 Access와 긴 Refresh를 발급한다.", "Access 만료 시 Refresh를 전용 endpoint에 보낸다.", "서버가 저장된 상태·만료·폐기 여부를 확인한다.", "새 token 묶음을 발급하고 이전 Refresh를 더 이상 쓰지 못하게 한다."], "Refresh Token도 JWT라는 이유만으로 서버 저장이 필요 없지는 않다. 즉시 로그아웃과 탈취 대응을 하려면 상태 추적이 유용하다."],
    ["CORS와 CSRF는 모두 브라우저 보안과 관련 있지만 발생 이유가 다르다. CORS는 다른 origin 응답을 읽는 권한이고, CSRF는 사용자의 자격 증명을 악용한 위조 요청 문제다.", [["preflight", "브라우저가 실제 요청 전에 OPTIONS로 허용 여부를 확인한다."], ["SameSite", "다른 site 요청에 cookie를 보낼 범위를 제한한다."], ["CSRF token", "정상 화면에서 만든 요청인지 추가 값으로 확인한다."]], ["브라우저가 origin과 method·header를 보고 preflight 필요 여부를 판단한다.", "서버 CORS 정책이 origin·method·header를 응답한다.", "cookie 인증이면 브라우저가 cookie를 자동 첨부할 수 있다.", "변경 요청은 SameSite와 CSRF token 정책으로 위조 여부를 추가 검사한다."], "Postman에는 브라우저 CORS 제한이 없다. Postman 성공·브라우저 실패라면 서버 로직보다 preflight 응답을 먼저 본다."],
    ["인증 기능은 로그인 성공 한 번으로 검증되지 않는다. token이 없거나, 변조되거나, 만료됐거나, 권한이 부족한 경계 조건이 더 중요하다.", [["positive test", "올바른 입력에서 기대한 성공이 나는지 확인한다."], ["negative test", "잘못된 token과 권한에서 정확히 거부되는지 확인한다."], ["entry point", "인증 실패를 401 응답으로 만드는 보안 처리 지점이다."]], ["공개 endpoint와 보호 endpoint를 구분해 token 없이 호출한다.", "정상 token으로 200과 현재 사용자 정보를 확인한다.", "signature 변조·만료 token으로 각각 401을 확인한다.", "낮은 role로 관리자 endpoint를 호출해 403을 확인한다."], "응답 status만 보지 말고 Filter 로그에서 어느 단계가 거부했는지 확인한다. 단, 전체 token과 password는 로그에 남기지 않는다."]
  ];
  security.forEach((args, index) => prepend("security", index, bridge(...args)));
})();
