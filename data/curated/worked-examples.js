/* 짧은 고난도 노트를 한 개의 독립 학습 단위로 읽을 수 있도록 실제 예제와 결과를 보충한다. */
(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const add = (slug, index, content) => {
    const lesson = category(slug)?.lessons[index];
    if (lesson) lesson.body += content;
  };
  const W = (title, situation, lang, code, steps, mistake, result) => `<section class="worked-example"><span>예제로 끝까지 따라가기</span><h2>${title}</h2><p>${situation}</p>${code ? `<pre data-lang="${lang}"><code>${code}</code></pre>` : ""}<h3>코드가 움직이는 순서</h3><ol>${steps.map((step) => `<li>${step}</li>`).join("")}</ol><div class="worked-mistake"><b>잘못 작성하면</b><p>${mistake}</p></div><h3>실행 후 무엇을 확인할까?</h3><p>${result}</p></section>`;

  add("sql", 4, W("재고 1개를 두 사용자가 동시에 주문한다면", "상품 재고가 1개일 때 A와 B가 거의 동시에 주문했다고 가정한다. 둘 다 먼저 재고를 조회하고 나중에 1을 빼면 두 요청이 모두 성공할 수 있다.", "SQL", `UPDATE product
SET stock = stock - 1
WHERE product_id = :productId
  AND stock &gt;= 1;`, ["A와 B가 UPDATE를 요청하지만 DB는 같은 행의 변경 순서를 조정한다.", "먼저 실행된 요청이 stock을 0으로 만들고 영향 행 수 1을 받는다.", "다음 요청은 stock >= 1 조건을 만족하지 않아 영향 행 수 0을 받는다.", "Service는 0을 재고 부족으로 해석하고 주문 전체를 rollback한다."], "재고를 SELECT한 뒤 Java에서 stock - 1을 계산해 저장하면 두 요청이 같은 이전 값을 기준으로 수정하는 lost update가 생길 수 있다.", "변경 SQL의 영향 행 수, 주문 INSERT와 재고 UPDATE가 같은 트랜잭션인지, 실패 요청에서 주문 행이 남지 않았는지를 확인한다."));
  add("sql", 5, W("회원별 최근 주문을 빠르게 찾는 인덱스", "목록 화면이 특정 회원의 주문을 최신순으로 반복 조회한다면 WHERE와 ORDER BY에 함께 쓰이는 열의 순서를 고려할 수 있다.", "SQL", `CREATE INDEX ix_orders_member_date
ON orders(member_id, ordered_at DESC);

SELECT order_id, ordered_at, total_amount
FROM orders
WHERE member_id = :memberId
ORDER BY ordered_at DESC
FETCH FIRST 20 ROWS ONLY;`, ["인덱스에서 member_id가 같은 범위를 먼저 찾는다.", "같은 범위 안은 ordered_at 내림차순으로 정렬돼 있어 앞의 20건을 읽는다.", "SELECT에 없는 열이 필요하면 인덱스 위치를 이용해 실제 테이블 행에 접근한다."], "ordered_at만 조건으로 검색하는 다른 화면까지 이 인덱스가 항상 유리한 것은 아니다. 복합 인덱스는 앞쪽 열부터 사용하는 조건에 강하다.", "실행 계획에서 full scan인지 index range scan인지 확인하고, 인덱스 추가 전후의 읽은 블록 수와 실행 시간을 실제 데이터로 비교한다."));

  add("jdbc", 3, W("계좌 이체를 하나의 Connection으로 묶기", "A 계좌에서 출금한 뒤 B 계좌에 입금하는 두 SQL은 반드시 함께 성공하거나 함께 취소돼야 한다.", "Java", `try (Connection con = dataSource.getConnection()) {
  con.setAutoCommit(false);
  try {
    accountDao.withdraw(con, fromId, amount);
    accountDao.deposit(con, toId, amount);
    con.commit();
  } catch (Exception e) {
    con.rollback();
    throw e;
  }
}`, ["Service가 Connection 하나를 빌리고 자동 확정을 끈다.", "두 DAO는 새 연결을 만들지 않고 전달받은 con으로 SQL을 실행한다.", "입금까지 성공해야 commit하며, 중간 예외는 두 SQL을 모두 rollback한다.", "try-with-resources가 끝나면 Connection은 pool로 반환된다."], "withdraw와 deposit DAO가 각각 새 Connection을 얻으면 출금은 commit되고 입금만 rollback되는 부분 성공이 생길 수 있다.", "입금 DAO에서 고의로 예외를 발생시킨 뒤 두 계좌 잔액이 모두 이전 값인지 확인한다. pool의 active connection 수도 요청 후 원래대로 돌아와야 한다."));

  add("javascript", 4, W("버튼마다 독립된 count를 기억하는 closure", "버튼을 만들 때마다 count 지역 변수를 하나 만들고, click handler가 그 변수를 기억하게 한다.", "JavaScript", `function createCounter(button) {
  let count = 0;
  button.addEventListener('click', () =&gt; {
    count += 1;
    button.textContent = '클릭 ' + count;
  });
}

createCounter(document.querySelector('#a'));
createCounter(document.querySelector('#b'));`, ["createCounter를 두 번 호출하므로 서로 다른 count 환경이 두 개 만들어진다.", "각 화살표 함수는 자신이 만들어진 호출의 count와 button을 기억한다.", "A 버튼을 눌러도 B 버튼의 count는 바뀌지 않는다."], "반복문 밖 전역 count 하나를 공유하면 어느 버튼을 눌러도 같은 숫자가 증가한다. 사용하지 않는 큰 객체를 closure가 계속 참조하면 메모리도 오래 유지된다.", "A를 두 번, B를 한 번 눌러 각각 ‘클릭 2’, ‘클릭 1’이 되는지 확인한다. DOM을 제거할 때 listener 정리가 필요한 구조인지도 본다."));
  add("javascript", 5, W("회원가입 폼을 검증하고 서버 오류까지 표시하기", "브라우저는 빈 값과 형식을 빠르게 검사하고, 서버는 이메일 중복처럼 DB가 필요한 규칙을 최종 판정한다.", "JavaScript", `form.addEventListener('submit', async (event) =&gt; {
  event.preventDefault();
  clearErrors();

  const email = form.email.value.trim();
  if (!email.includes('@')) {
    showFieldError('email', '이메일 형식을 확인해 주세요.');
    return;
  }

  const response = await fetch('/api/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!response.ok) showServerError(await response.json());
});`, ["submit 기본 동작을 막아 검증 전에 페이지가 이동하지 않게 한다.", "브라우저에서 즉시 확인할 수 있는 형식을 검사한다.", "통과한 값만 JSON으로 보내고 HTTP 상태를 확인한다.", "409 중복과 400 필드 오류를 서버 응답에 맞춰 다시 화면에 표시한다."], "fetch는 400·409·500에서도 Promise를 reject하지 않는다. response.ok를 확인하지 않으면 실패 응답을 성공 데이터처럼 처리할 수 있다.", "잘못된 형식에서는 Network 요청이 생기지 않는지, 중복 이메일에서는 서버 메시지가 해당 필드 근처에 나타나는지 확인한다."));

  add("mybatis", 2, W("주문 저장과 재고 차감을 Mapper 두 개로 처리하기", "Mapper가 달라도 Service의 같은 @Transactional 안에서 호출되면 Spring이 같은 트랜잭션 자원을 연결한다.", "Java", `@Transactional
public Long placeOrder(Order order) {
  int stockChanged = productMapper.decreaseStock(
      order.getProductId(), order.getQuantity());
  if (stockChanged != 1) throw new OutOfStockException();

  int orderInserted = orderMapper.insert(order);
  if (orderInserted != 1) throw new OrderSaveException();
  return order.getId();
}`, ["proxy가 Service 호출 전에 트랜잭션을 시작한다.", "재고 UPDATE 결과가 1인지 확인한 뒤 주문 INSERT를 실행한다.", "useGeneratedKeys로 생성된 ID가 order 객체에 채워진다.", "예외 없이 반환되면 두 SQL이 commit된다."], "Mapper 반환값을 무시하면 WHERE가 틀려 재고가 줄지 않았는데도 주문을 저장할 수 있다. 예외를 catch하고 정상 반환해도 rollback되지 않을 수 있다.", "SQL 로그의 Connection 식별자가 같은지, INSERT 실패를 만들었을 때 재고 UPDATE도 취소되는지 확인한다."));
  add("mybatis", 3, W("게시글 20개와 작성자 이름을 조회할 때", "게시글 목록을 먼저 조회하고 각 게시글마다 작성자를 nested select로 조회하면 게시글 20건에 추가 SQL 20번이 실행된다.", "SQL", `SELECT b.board_id, b.title,
       m.member_id, m.nickname
FROM board b
JOIN member m ON m.member_id = b.writer_id
WHERE b.deleted = 'N'
ORDER BY b.board_id DESC
FETCH FIRST 20 ROWS ONLY;`, ["기존 방식의 SQL 로그에서 board 조회 1번과 member 조회 반복을 확인한다.", "목록에 필요한 작성자 필드만 JOIN으로 함께 가져온다.", "resultMap 또는 DTO에 board와 writer 값을 한 번에 매핑한다.", "목록 크기를 늘려도 쿼리 수가 고정되는지 다시 측정한다."], "댓글까지 1:N JOIN으로 한꺼번에 붙이면 게시글 행이 댓글 수만큼 늘어나 paging 결과가 틀어질 수 있다.", "한 요청의 SQL 횟수, 반환 행 수, 중복 게시글 수를 함께 확인한다. 관계가 여러 개면 게시글 ID 목록을 먼저 paging하는 2단계 조회도 비교한다."));

  add("spring-mvc", 3, W("GET /api/members/10 요청이 Controller에 도착하기까지", "브라우저가 보낸 URL 문자열이 바로 method 호출로 바뀌는 것이 아니라 Spring MVC의 여러 구성 요소가 handler 탐색과 인자 변환을 나눠 처리한다.", "Java", `@GetMapping('/api/members/{id}')
public MemberResponse detail(@PathVariable Long id) {
  return memberService.find(id);
}`, ["DispatcherServlet이 GET 요청을 받고 HandlerMapping에 일치하는 method를 묻는다.", "HandlerAdapter가 PathVariable resolver로 문자열 ‘10’을 Long으로 변환한다.", "Controller가 Service 결과인 MemberResponse를 반환한다.", "Jackson MessageConverter가 객체를 JSON으로 만들고 Content-Type을 설정한다."], "매핑 URL은 맞지만 id를 숫자로 바꾸지 못하면 Controller 본문에 들어가기 전에 400이 발생한다. 객체를 @Controller에서 반환하면서 @ResponseBody가 없으면 View 처리로 오해될 수 있다.", "Controller 첫 줄 로그가 없는 400이라면 binding 단계 로그를 확인한다. 응답 header의 Content-Type과 JSON 필드도 계약과 일치하는지 본다."));
  add("spring-mvc", 4, W("JSON 회원가입 요청을 DTO로 받고 두 단계 검증하기", "email 형식과 비밀번호 길이는 DTO에서, 이미 가입한 이메일인지는 Service와 DB에서 검사한다.", "Java", `public record JoinRequest(
  @Email String email,
  @Size(min = 8) String password
) {}

@PostMapping('/api/members')
public ResponseEntity&lt;MemberResponse&gt; join(
    @Valid @RequestBody JoinRequest request) {
  return ResponseEntity.status(201)
      .body(memberService.join(request));
}`, ["MessageConverter가 JSON key를 record field에 연결한다.", "@Valid가 email과 password 형식을 검사하며 실패하면 Service를 호출하지 않는다.", "Service가 repository로 중복 이메일을 확인하고 비밀번호를 hash한다.", "동시 요청을 대비해 DB UNIQUE 위반도 같은 409 오류로 변환한다."], "DTO 형식 검증만 믿으면 두 요청이 중복 확인을 동시에 통과할 수 있다. 반대로 Entity에 HTTP 입력 검증을 모두 넣으면 DB 모델이 API 형식에 결합된다.", "잘못된 JSON, 형식 오류, 중복 이메일을 각각 보내 status와 fieldErrors가 다르게 반환되는지 확인한다."));
  add("spring-mvc", 5, W("같은 실패를 항상 같은 오류 JSON으로 응답하기", "Controller마다 try/catch를 쓰지 않고 업무 예외와 검증 예외를 공통 응답 계약으로 변환한다.", "Java", `@ExceptionHandler(MemberNotFoundException.class)
ResponseEntity&lt;ApiError&gt; handle(MemberNotFoundException e) {
  ApiError body = new ApiError(
      'MEMBER_NOT_FOUND', '회원을 찾을 수 없습니다.');
  return ResponseEntity.status(404).body(body);
}`, ["Service가 의미 있는 업무 예외를 던진다.", "Controller를 빠져나온 예외를 ControllerAdvice가 찾는다.", "handler가 안전한 code·message와 404 status를 만든다.", "request ID와 stack trace는 응답이 아니라 서버 로그에 기록한다."], "Exception 전체를 잡아 e.getMessage()를 그대로 반환하면 SQL·경로·내부 구현이 노출될 수 있다. Security Filter에서 난 예외는 이 handler까지 오지 않는다.", "존재하지 않는 ID, 검증 실패, 예상하지 못한 오류의 status·code·로그 수준이 각각 다른지 확인한다."));

  add("spring-core", 2, W("회원가입과 로그인에서 BCrypt가 사용되는 위치", "같은 비밀번호를 두 번 encode해도 salt 때문에 다른 hash가 나오지만 matches는 둘 다 올바르게 검증한다.", "Java", `String encoded = passwordEncoder.encode(request.password());
memberRepository.save(Member.join(request.email(), encoded));

boolean ok = passwordEncoder.matches(
    loginRequest.password(), member.getPasswordHash());`, ["회원가입 요청의 raw password는 Controller에서 Service로 짧게 전달된다.", "PasswordEncoder가 salt와 비용을 적용한 hash를 만든다.", "DB에는 hash만 저장한다.", "로그인 때 raw 값을 다시 encode해 문자열 비교하지 않고 matches로 검증한다."], "encode(raw).equals(savedHash)로 비교하면 매번 salt가 달라 실패한다. Secret key처럼 복호화가 필요한 값과 비밀번호 hash를 같은 방식으로 처리해서도 안 된다.", "DB 값이 평문이 아닌지, 같은 비밀번호의 hash가 매번 다른지, matches는 true인지 확인하고 로그에 raw password가 없는지 검색한다."));

  const react = [
    ["setState 뒤 화면이 바뀌는 정확한 시점", "버튼을 세 번 증가시키되 이전 state를 기준으로 update한다.", "JSX", `const [count, setCount] = useState(0);
function increaseThree() {
  setCount(c =&gt; c + 1);
  setCount(c =&gt; c + 1);
  setCount(c =&gt; c + 1);
}`, ["handler가 실행되는 동안 화면의 count는 현재 render 값으로 유지된다.", "세 updater가 queue에 순서대로 들어간다.", "React가 이전 결과를 다음 updater에 전달해 최종값 3을 계산한다.", "한 번의 새 render와 commit으로 화면이 갱신된다."], "setCount(count + 1)을 세 번 호출하면 세 코드가 같은 count를 읽어 최종값이 1만 증가할 수 있다.", "Console에서 handler 내부 값과 다음 render 값을 나눠 출력해 update가 즉시 변수 대입처럼 동작하지 않는 것을 확인한다."],
    ["목록과 선택 상태를 부모·자식으로 나누기", "MemberList가 데이터를 소유하고 MemberCard는 표시와 선택 event만 담당한다.", "JSX", `function MemberList({ members }) {
  const [selectedId, setSelectedId] = useState(null);
  return members.map(member =&gt; (
    &lt;MemberCard key={member.id}
      member={member}
      selected={member.id === selectedId}
      onSelect={() =&gt; setSelectedId(member.id)} /&gt;
  ));
}`, ["부모가 members와 selectedId를 소유한다.", "각 Card는 자기 member와 선택 여부를 props로 받는다.", "Card 클릭이 부모 callback을 호출한다.", "부모가 새 selectedId로 render하고 모든 Card의 selected를 다시 계산한다."], "배열 index를 key로 쓰면 정렬·삭제 시 기존 컴포넌트 상태가 다른 항목에 붙을 수 있다.", "항목을 삭제하거나 정렬해도 선택 표시가 올바른 member에 유지되는지 확인한다."],
    ["객체 state의 한 필드만 수정하기", "회원가입 form에서 email을 바꿔도 password 값은 유지해야 한다.", "JSX", `const [form, setForm] = useState({ email: '', password: '' });
function handleChange(event) {
  const { name, value } = event.target;
  setForm(prev =&gt; ({ ...prev, [name]: value }));
}`, ["event가 발생한 input의 name과 value를 읽는다.", "prev 객체의 모든 field를 새 객체로 복사한다.", "계산된 property name으로 변경 대상만 덮어쓴다.", "새 객체 reference로 React가 다음 render를 예약한다."], "form.email을 직접 바꾸거나 setForm({email:value})만 호출하면 변경 감지가 불명확하거나 password가 사라진다.", "email과 password를 번갈아 입력해 다른 field 값이 유지되는지 React DevTools에서 state를 확인한다."],
    ["입력·검증·전송 상태를 분리하기", "controlled form은 입력값뿐 아니라 submitting과 error도 화면 상태로 관리한다.", "JSX", `async function handleSubmit(event) {
  event.preventDefault();
  setSubmitting(true);
  setError(null);
  try { await memberApi.join(form); }
  catch (e) { setError(toMessage(e)); }
  finally { setSubmitting(false); }
}`, ["입력값은 form state와 항상 동기화된다.", "submit 시 버튼을 잠그고 이전 오류를 지운다.", "API 성공은 이동 또는 완료 상태로 처리한다.", "실패는 error에 저장하고 finally에서 버튼을 다시 활성화한다."], "submitting 상태가 없으면 사용자가 버튼을 연속 클릭해 같은 요청을 중복 전송할 수 있다.", "느린 Network를 설정하고 버튼 잠김, 성공 이동, 실패 메시지, 재시도 가능 여부를 확인한다."],
    ["목록 URL에 검색어와 페이지 남기기", "새로고침과 뒤로가기를 지원하려면 화면 선택 상태를 query string에 둔다.", "JSX", `const [params, setParams] = useSearchParams();
const page = Number(params.get('page') || 1);
const keyword = params.get('keyword') || '';

function search(nextKeyword) {
  setParams({ keyword: nextKeyword, page: '1' });
}`, ["URL에서 keyword와 page를 읽어 화면 상태를 만든다.", "검색하면 page를 1로 초기화해 새 URL을 만든다.", "URL 변경으로 페이지가 다시 render된다.", "Effect 또는 데이터 도구가 새 parameter로 목록을 요청한다."], "검색 조건을 local state에만 두면 새로고침·링크 공유·뒤로가기에서 조건이 사라진다.", "검색 후 URL을 복사해 새 탭에서 같은 결과가 나오는지, 뒤로가기로 이전 검색이 복원되는지 확인한다."],
    ["검색 요청이 뒤늦게 도착해 화면을 덮는 문제", "‘ja’ 요청 뒤 ‘java’ 요청을 보냈는데 첫 요청이 늦게 끝날 수 있다.", "JSX", `useEffect(() =&gt; {
  const controller = new AbortController();
  memberApi.search(keyword, controller.signal)
    .then(setMembers)
    .catch(e =&gt; { if (e.name !== 'AbortError') setError(e); });
  return () =&gt; controller.abort();
}, [keyword]);`, ["keyword가 바뀌면 이전 Effect cleanup이 이전 요청을 abort한다.", "새 AbortController로 최신 요청을 시작한다.", "취소 오류는 사용자 오류로 표시하지 않는다.", "최신 응답만 members state에 반영된다."], "cleanup 없이 요청하면 느린 과거 응답이 빠른 최신 응답 뒤에 도착해 화면을 이전 검색어 결과로 되돌릴 수 있다.", "Network throttling에서 빠르게 검색어를 바꾸고 이전 요청이 canceled 되는지, 마지막 검색 결과만 남는지 확인한다."],
    ["input에 focus하고 timer ID 보관하기", "화면을 바꿀 필요 없는 DOM 객체와 timer ID는 ref에 둔다.", "JSX", `const inputRef = useRef(null);
const timerRef = useRef(null);

function focusLater() {
  clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() =&gt; inputRef.current?.focus(), 300);
}

&lt;input ref={inputRef} /&gt;`, ["commit 뒤 input DOM이 ref.current에 연결된다.", "버튼 event에서 이전 timer를 취소하고 새 ID를 ref에 저장한다.", "300ms 뒤 현재 DOM이 존재하면 focus한다.", "unmount cleanup에서 남은 timer도 취소한다."], "timer ID를 일반 지역 변수에 두면 render마다 다시 만들어지고 이전 timer를 안정적으로 찾기 어렵다.", "여러 번 눌러도 focus 작업이 한 번만 실행되는지, 화면을 닫은 뒤 callback 오류가 없는지 확인한다."],
    ["로그인 정보를 Context와 reducer로 관리하기", "여러 화면이 로그인 사용자를 읽고 logout action으로 같은 규칙을 실행한다.", "JavaScript", `function authReducer(state, action) {
  switch (action.type) {
    case 'login': return { user: action.user, ready: true };
    case 'logout': return { user: null, ready: true };
    default: return state;
  }
}`, ["Provider가 auth state와 dispatch를 소유한다.", "로그인 성공이 user를 담은 login action을 보낸다.", "reducer가 새 state를 반환한다.", "Header와 보호 페이지가 같은 Context 값을 읽어 함께 갱신된다."], "API에서 받은 서버 목록 같은 데이터까지 Context 하나에 넣으면 변경 범위와 책임이 너무 커진다.", "logout 후 Header·현재 페이지·보호 route가 모두 같은 사용자 없음 상태를 반영하는지 확인한다."],
    ["개발 proxy와 운영 API 주소를 분리하기", "컴포넌트는 환경마다 URL을 바꾸지 않고 항상 /api 경로의 API 모듈을 호출한다.", "JavaScript", `export const api = axios.create({ baseURL: '/api' });

// vite.config.js
server: {
  proxy: { '/api': { target: 'http://localhost:8080' } }
}`, ["브라우저는 현재 Vite origin의 /api/members로 요청한다.", "개발 서버가 /api 요청을 Spring 8080으로 전달한다.", "Spring 응답이 Vite를 거쳐 브라우저로 돌아온다.", "운영에서는 Nginx 또는 배포 구조가 같은 /api 경로를 백엔드로 연결한다."], "Vite proxy 설정만 믿고 정적 배포하면 운영에는 Vite 개발 서버가 없어 API 요청이 404가 된다.", "개발 Network의 Request URL과 실제 Spring 로그를 함께 보고, 운영 배포 문서에 /api 연결 주체가 명시됐는지 확인한다."]
  ];
  react.forEach((args, index) => add("react", index, W(...args)));

  const jpa = [
    ["조회한 Entity를 수정했는데 UPDATE가 나가는 이유", "Service에서 save를 다시 호출하지 않아도 managed Entity의 변경을 JPA가 감지한다.", "Java", `@Transactional
public void rename(Long id, String name) {
  Member member = repository.findById(id).orElseThrow();
  member.changeName(name);
}`, ["조회 결과가 영속성 컨텍스트에 저장되고 snapshot이 만들어진다.", "changeName이 같은 managed 객체의 field를 바꾼다.", "commit 전 flush에서 snapshot과 현재 값을 비교한다.", "차이가 있는 field의 UPDATE가 실행된다."], "transaction 밖에서 수정한 detached Entity는 자동 추적되지 않는다. 모든 객체 변경이 무조건 SQL이 되는 것은 아니다.", "SQL 로그에서 SELECT 뒤 UPDATE 시점을 확인하고, 예외를 던져 rollback했을 때 DB 값이 유지되는지 본다."],
    ["요청 DTO에서 안전한 Entity 만들기", "사용자가 보낸 role·createdAt·id를 그대로 Entity에 복사하지 않고 서버가 허용한 값만 생성자에 전달한다.", "Java", `public static Member join(String email, String encodedPassword) {
  Member member = new Member();
  member.email = email;
  member.password = encodedPassword;
  member.role = Role.USER;
  return member;
}`, ["Controller DTO가 형식 검증된 email과 raw password를 받는다.", "Service가 password를 hash하고 기본 role을 선택한다.", "Entity factory가 유효한 초기 상태를 만든다.", "DB 제약조건이 중복과 NULL을 마지막으로 검사한다."], "public setter로 모든 field를 열면 클라이언트 값이나 실수로 ID·권한·생성일이 바뀔 수 있다.", "가입 요청에 role을 임의로 넣어도 USER로 저장되는지, 중복 email이 명확한 오류로 변환되는지 확인한다."],
    ["검색 요구에 따라 조회 도구 바꾸기", "고정 email 조회는 파생 쿼리, 선택 가능한 이름·상태·기간 검색은 QueryDSL로 나눈다.", "Java", `Optional&lt;Member&gt; findByEmail(String email);

BooleanExpression statusEq(Status status) {
  return status == null ? null : member.status.eq(status);
}`, ["하나의 고정 조건은 method 이름만으로 의도가 충분하다.", "검색 화면의 빈 조건은 predicate에서 null을 반환한다.", "where가 실제로 입력된 조건만 조합한다.", "목록에 Entity 전체가 필요 없으면 DTO projection으로 반환한다."], "모든 조회를 native SQL로 만들면 Entity field 변경을 컴파일러가 추적하지 못하고 DB 제품 의존성이 커진다.", "조건 없음·한 개·여러 개 조합을 테스트하고 생성 SQL의 WHERE가 기대대로 달라지는지 확인한다."],
    ["transaction 안과 밖의 Entity 차이", "같은 findById 결과라도 transaction이 끝난 뒤에는 변경 감지와 LAZY 로딩이 더 이상 같은 방식으로 동작하지 않는다.", "Java", `@Transactional
public MemberResponse detail(Long id) {
  Member member = repository.findById(id).orElseThrow();
  String teamName = member.getTeam().getName();
  return new MemberResponse(member.getId(), teamName);
}`, ["transaction 시작과 함께 EntityManager가 현재 thread에 연결된다.", "Member와 필요할 때 Team을 조회한다.", "transaction 안에서 DTO가 필요한 값을 복사한다.", "method 종료 후 EntityManager가 닫혀도 DTO는 일반 값으로 응답된다."], "Controller에서 LAZY field를 처음 접근하면 영속성 컨텍스트가 닫혀 예외가 나거나 OSIV에 의존한 숨은 SQL이 생길 수 있다.", "Service 종료 전 SQL이 모두 실행되는지, Controller serialization 중 추가 SQL이 없는지 로그로 확인한다."],
    ["Order와 Member 양방향 관계 맞추기", "외래 키는 Order에 있지만 객체 탐색을 위해 Member도 orders 목록을 가질 수 있다.", "Java", `public void assignMember(Member member) {
  this.member = member;
  member.getOrders().add(this);
}`, ["새 Order가 assignMember를 호출한다.", "연관관계 주인인 order.member에 Member를 저장한다.", "반대편 member.orders에도 현재 Order를 넣어 메모리 상태를 맞춘다.", "flush 때 orders.member_id 외래 키가 INSERT 또는 UPDATE된다."], "member.getOrders().add(order)만 호출하면 mappedBy 쪽만 바뀌어 외래 키 SQL이 기대대로 생성되지 않는다.", "저장 직후 DB를 다시 조회하지 않아도 양쪽 객체 탐색 결과가 일치하는지, SQL의 member_id가 올바른지 확인한다."],
    ["주문 목록 N+1을 쿼리 로그로 찾기", "주문 10개를 조회한 뒤 각 주문의 회원 이름을 출력하는 코드를 관찰한다.", "Java", `List&lt;Order&gt; orders = repository.findAllWithMember();
for (Order order : orders) {
  log.info('member={}', order.getMember().getName());
}`, ["기존 findAll에서는 주문 SELECT 뒤 회원 SELECT가 반복되는지 센다.", "해당 화면 전용 fetch join 조회를 만든다.", "Order와 Member가 한 SQL로 조회되는지 확인한다.", "주문 수를 늘려도 SQL 수가 1회로 유지되는지 측정한다."], "컬렉션까지 여러 개 fetch join하면 row가 곱해지고 paging이 깨질 수 있다. 필요한 관계의 방향과 개수를 먼저 본다.", "SQL 횟수뿐 아니라 반환 행 수와 실행 시간도 비교한다. 테스트에 쿼리 수 조건을 두면 재발을 빨리 찾을 수 있다."],
    ["Entity를 반환했을 때 생기는 순환 참조", "Member가 Orders를 갖고 Order가 다시 Member를 가지면 JSON serializer가 관계를 계속 따라갈 수 있다.", "Java", `public record OrderResponse(
    Long id, Long memberId, String memberName) {
  static OrderResponse from(Order order) {
    return new OrderResponse(order.getId(),
        order.getMember().getId(), order.getMember().getName());
  }
}`, ["Service가 use case에 필요한 Entity 관계를 조회한다.", "transaction 안에서 공개할 값만 DTO로 복사한다.", "Controller는 Entity 대신 DTO를 반환한다.", "Jackson은 평평한 DTO만 JSON으로 변환한다."], "annotation으로 순환만 억지로 끊어도 비밀번호 같은 내부 field 노출과 API 결합 문제는 남는다.", "응답 JSON에 필요한 field만 존재하는지, Entity field 추가가 API 응답을 몰래 바꾸지 않는지 확인한다."],
    ["검색 조건과 count query 분리하기", "목록에는 작성자 JOIN이 필요하지만 전체 개수는 주문 테이블의 조건만으로 셀 수 있다.", "Java", `List&lt;OrderSummary&gt; content = query
  .select(summary).from(order)
  .join(order.member, member)
  .where(statusEq(status), keywordContains(keyword))
  .offset(pageable.getOffset()).limit(pageable.getPageSize())
  .fetch();`, ["content query는 화면 field와 검색에 필요한 JOIN을 구성한다.", "조건 helper가 null을 제외해 WHERE를 만든다.", "count query에는 개수 계산에 불필요한 fetch join과 정렬을 뺀다.", "전체 개수가 필요 없으면 size + 1건으로 다음 페이지 존재만 판단한다."], "content query를 그대로 count에 복사하면 불필요한 JOIN과 DISTINCT 때문에 페이지 조회보다 count가 더 느려질 수 있다.", "content SQL과 count SQL을 따로 확인하고, 마지막 페이지·조건 없음·복수 조건에서 total과 목록이 일치하는지 테스트한다."]
  ];
  jpa.forEach((args, index) => add("jpa", index, W(...args)));

  const security = [
    ["로그인 성공과 관리자 접근 허용은 다른 판단", "USER가 로그인에 성공해도 ADMIN endpoint는 거부돼야 한다.", "HTTP", `POST /api/auth/login  → 200 + token
GET /api/profile        → 200
DELETE /api/admin/users/10 → 403`, ["로그인에서 credential을 검증해 사용자 신원을 확인한다.", "JWT에서 검증된 role을 Authentication authority로 복원한다.", "각 endpoint의 필요한 authority와 비교한다.", "인증은 성공했지만 ADMIN이 아니므로 마지막 요청만 403을 반환한다."], "로그인 성공 여부만 검사하고 모든 endpoint를 authenticated()로 두면 일반 사용자도 관리자 기능을 호출할 수 있다.", "USER·ADMIN token으로 같은 API를 교차 호출해 401과 403이 구분되는지 확인한다."],
    ["공개·사용자·관리자 URL 규칙 순서", "더 구체적인 URL을 먼저 쓰고 마지막에 나머지 요청 규칙을 둔다.", "Java", `authorize.requestMatchers('/api/auth/**').permitAll()
  .requestMatchers('/api/admin/**').hasRole('ADMIN')
  .requestMatchers('/api/**').authenticated()
  .anyRequest().permitAll();`, ["요청 URL이 위에서부터 matcher와 비교된다.", "첫 번째로 일치한 규칙이 필요한 인증과 권한을 결정한다.", "JWT Filter가 만든 authority를 Authorization 단계가 사용한다.", "규칙을 통과한 요청만 Controller로 간다."], "넓은 /api/** 규칙을 앞에 두면 뒤의 /api/admin/** 세부 규칙이 기대대로 적용되지 않을 수 있다.", "보안 테스트에서 URL별 익명·USER·ADMIN 기대 status를 표로 만들고 자동화한다."],
    ["가입 요청에서 ADMIN 값 무시하기", "클라이언트가 role 필드를 조작해 보내도 서버는 가입 정책에 따라 USER만 부여한다.", "Java", `String hash = passwordEncoder.encode(request.password());
Member member = Member.join(request.email(), hash, Role.USER);
memberRepository.save(member);`, ["DTO에는 role field를 아예 두지 않거나 입력을 무시한다.", "email 중복과 형식을 검사한다.", "raw password를 hash하고 서버 상수 Role.USER를 전달한다.", "DB의 UNIQUE와 NOT NULL 제약이 마지막 검증을 수행한다."], "요청 DTO를 Entity로 자동 복사하면 공격자가 role·id·status 같은 내부 field를 주입하는 mass assignment 문제가 생길 수 있다.", "role을 포함한 변조 JSON을 보내도 USER로 저장되는지, DB에 raw password가 없는지 확인한다."],
    ["로그인 Filter에서 JSON을 읽고 token 만들기", "email과 password를 받은 뒤 인증 성공 handler에서만 JWT를 발급한다.", "Java", `LoginRequest request = objectMapper.readValue(
    httpRequest.getInputStream(), LoginRequest.class);
UsernamePasswordAuthenticationToken authRequest =
    UsernamePasswordAuthenticationToken.unauthenticated(
        request.email(), request.password());
return authenticationManager.authenticate(authRequest);`, ["Filter가 body를 LoginRequest로 변환한다.", "미인증 token 객체에 credential을 담아 Manager에 전달한다.", "Provider가 DB 사용자와 password hash를 검증한다.", "성공 callback이 인증된 principal과 authority로 JWT를 서명한다."], "attempt 단계에서 바로 JWT를 만들면 비밀번호 검증 전 token을 발급하는 심각한 오류가 된다.", "잘못된 password에서는 발급 header가 없는지, 성공 token의 sub·exp·role이 기대값인지 확인한다."],
    ["Bearer Token 하나를 검증하는 Filter", "보호 API 요청마다 header를 읽고 서명과 만료가 모두 정상일 때만 SecurityContext를 채운다.", "Java", `String header = request.getHeader('Authorization');
if (header == null || !header.startsWith('Bearer ')) {
  filterChain.doFilter(request, response);
  return;
}
String token = header.substring(7);
JwtClaims claims = jwtService.verify(token);`, ["token이 없으면 공개 URL일 수 있으므로 다음 Filter로 넘긴다.", "token이 있으면 signature·exp·issuer·audience를 검증한다.", "claim으로 인증된 Authentication을 만든다.", "SecurityContext에 저장한 뒤 endpoint 권한 검사로 진행한다."], "header를 substring하기 전에 Bearer 형식을 검사하지 않으면 짧거나 다른 형식의 header에서 예외가 난다. decode만 하고 verify하지 않아도 안 된다.", "token 없음·prefix 오류·한 글자 변조·만료·정상 token을 각각 보내 응답과 Filter 로그를 비교한다."],
    ["Refresh Token 재사용을 감지하는 흐름", "한 번 재발급에 사용한 Refresh Token은 폐기하고 새 token 묶음으로 교체한다.", "Plain Text", `R1 사용 → A2 + R2 발급 → R1 폐기
R1 다시 사용 → 재사용 감지 → 해당 로그인 묶음 전체 폐기`, ["로그인 시 Refresh ID와 사용자·기기·만료 상태를 저장한다.", "재발급 요청이 오면 signature와 저장 상태를 함께 확인한다.", "정상이면 기존 R1을 사용 완료 처리하고 A2·R2를 발급한다.", "이미 사용된 R1이 다시 오면 탈취 가능성으로 보고 관련 token을 폐기한다."], "Refresh를 긴 만료의 Access처럼 검증만 하면 탈취된 token을 서버가 즉시 끊거나 재사용을 발견하기 어렵다.", "정상 재발급 뒤 이전 Refresh로 다시 요청해 거부되는지, 로그아웃 뒤에도 거부되는지 확인한다."],
    ["Postman은 성공하지만 브라우저 preflight가 실패할 때", "브라우저가 Authorization header를 포함한 다른 origin 요청 전에 OPTIONS를 먼저 보낸다.", "HTTP", `OPTIONS /api/members
Origin: http://localhost:5173
Access-Control-Request-Method: GET
Access-Control-Request-Headers: authorization`, ["브라우저가 실제 GET 전에 preflight를 보낸다.", "서버가 허용 origin·method·header를 응답해야 한다.", "preflight가 성공하면 브라우저가 실제 token 요청을 보낸다.", "서버 응답에도 허용 origin이 있어야 JavaScript가 결과를 읽는다."], "OPTIONS가 Security 인증에 막히거나 authorization header를 허용하지 않으면 실제 Controller는 한 번도 호출되지 않는다.", "Network에서 OPTIONS status와 Access-Control-Allow-* header를 확인하고, wildcard origin과 credentials를 함께 쓰지 않았는지 본다."],
    ["인증 경계 조건을 표로 테스트하기", "정상 token 하나만 확인하지 않고 실패 원인을 하나씩 분리한다.", "Plain Text", `token 없음          → 401
서명 변조 token     → 401
만료 token          → 401
USER → ADMIN API    → 403
ADMIN → ADMIN API   → 200`, ["각 테스트는 한 가지 조건만 바꾼다.", "status와 error code를 함께 검증한다.", "서버 로그에는 사용자 ID와 실패 종류만 남긴다.", "전체 token·password가 로그에 없는지 별도로 확인한다."], "모든 실패가 403이거나 500이면 어느 단계가 잘못됐는지 클라이언트와 운영자가 구분하기 어렵다.", "자동 테스트에 표의 다섯 경우를 고정하고 Security 설정 변경 때마다 실행한다." ]
  ];
  security.forEach((args, index) => add("security", index, W(...args)));
})();
