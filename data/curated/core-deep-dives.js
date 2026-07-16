/* 원본 노션 대비 지나치게 압축됐던 고난도 파트의 단계별 학습서 */
(function () {
  const set = (slug, intro, lessons) => {
    const category = window.CURATED_STUDY.find((item) => item.slug === slug);
    if (!category) return;
    category.intro = intro;
    category.lessons = lessons;
  };
  const L = (title, summary, body) => ({ title, summary, body });
  const flow = (...items) => `<div class="concept-flow">${items.map((item, index) => `${index ? "<i>→</i>" : ""}<span>${item}</span>`).join("")}</div>`;

  set("react", "렌더링 원리부터 Hook·Router·API·전역 상태까지, 화면이 바뀌는 이유를 코드 흐름으로 따라간다.", [
    L("React의 렌더링 모델", "state가 바뀌면 컴포넌트 함수가 다시 실행되고 새 UI 설명이 계산되는 과정을 이해한다.", `<h2>React는 DOM 조작 코드가 아니라 UI 계산 규칙을 작성한다</h2><p>컴포넌트는 props와 state를 입력받아 JSX를 반환하는 함수다. 이벤트가 state를 변경하면 React가 컴포넌트를 다시 호출해 다음 화면을 계산하고, 이전 결과와 비교해 필요한 DOM만 반영한다.</p>${flow("Event", "setState", "Render", "Reconciliation", "Commit")}<h3>렌더와 커밋</h3><ul><li><strong>Render:</strong> JSX를 계산하는 단계. 순수해야 하며 API 호출이나 DOM 변경을 넣지 않는다.</li><li><strong>Commit:</strong> 계산 결과를 실제 DOM에 반영하는 단계.</li></ul><pre data-lang="JSX"><code>function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() =&gt; setCount(c =&gt; c + 1)}&gt;
    {count}
  &lt;/button&gt;;
}</code></pre><blockquote><strong>핵심:</strong> 부모가 다시 렌더되면 기본적으로 자식 컴포넌트 함수도 다시 호출된다. 다시 호출되는 것과 실제 DOM이 전부 다시 만들어지는 것은 다르다.</blockquote>`),
    L("컴포넌트·props·합성", "UI를 책임 단위로 나누고 데이터를 부모에서 자식으로 전달한다.", `<h2>어디서 컴포넌트를 나눌까</h2><p>반복되는 모양, 독립적인 책임, 자체 상태가 있는 영역, 다른 화면에서도 쓸 영역을 컴포넌트 후보로 본다. 파일을 작게 만드는 것보다 <strong>변경 이유가 하나가 되게</strong> 나누는 것이 중요하다.</p><pre data-lang="JSX"><code>function MemberCard({ member, onSelect }) {
  return (
    &lt;article&gt;
      &lt;strong&gt;{member.nickname}&lt;/strong&gt;
      &lt;button onClick={() =&gt; onSelect(member.id)}&gt;선택&lt;/button&gt;
    &lt;/article&gt;
  );
}</code></pre><h3>데이터 흐름</h3>${flow("Parent state", "props", "Child render", "callback event", "Parent update")}<p>props는 자식이 수정하는 값이 아니다. 자식이 변경을 요청해야 한다면 부모가 전달한 callback을 호출한다. 여러 화면 조각을 감싸는 레이아웃은 <code>children</code>을 이용해 합성한다.</p><div class="note-warning"><strong>피해야 할 구조</strong><p>모든 것을 하나의 App 컴포넌트에 넣기, 단순히 줄 수만 줄이려고 의미 없는 컴포넌트 만들기, 자식이 받은 객체를 직접 변경하기.</p></div>`),
    L("state·불변성·업데이트 큐", "React가 변경을 감지할 수 있도록 새 객체와 배열을 만들고 이전 값을 기준으로 갱신한다.", `<h2>state는 그 렌더의 스냅샷</h2><p><code>setState</code>를 호출해도 현재 함수 안의 값이 즉시 바뀌는 것은 아니다. 다음 렌더를 예약한다. 이전 값에 의존하는 갱신은 함수형 업데이트를 사용한다.</p><pre data-lang="JavaScript"><code>setCount(prev =&gt; prev + 1);
setMember(prev =&gt; ({ ...prev, nickname: nextName }));
setTodos(prev =&gt; prev.map(todo =&gt;
  todo.id === id ? { ...todo, done: true } : todo
));</code></pre><h3>왜 push와 직접 대입이 문제인가</h3><p>객체 내부만 바꾸면 바깥 참조가 그대로라 변경 판단과 과거 상태 추적이 어려워진다. 배열은 <code>map</code>, <code>filter</code>, spread를 사용해 새 배열을 만든다.</p><table><tr><th>목적</th><th>사용</th></tr><tr><td>추가</td><td><code>[...prev, newItem]</code></td></tr><tr><td>수정</td><td><code>map</code></td></tr><tr><td>삭제</td><td><code>filter</code></td></tr></table><blockquote><strong>파생 값:</strong> 다른 state로 계산할 수 있는 값은 state로 중복 저장하지 말고 렌더 중 계산한다.</blockquote>`),
    L("입력 폼과 이벤트", "controlled input으로 화면 값과 state를 한 방향으로 동기화한다.", `<h2>입력값의 주인을 React로 만든다</h2><pre data-lang="JSX"><code>const [form, setForm] = useState({ email: '', password: '' });

function handleChange(event) {
  const { name, value } = event.target;
  setForm(prev =&gt; ({ ...prev, [name]: value }));
}

&lt;input name="email" value={form.email} onChange={handleChange} /&gt;</code></pre><p><code>value</code>는 state에서 오고 <code>onChange</code>가 state를 바꾸므로 화면과 데이터가 일치한다. submit에서는 <code>preventDefault()</code> 후 검증하고 API를 호출한다.</p><h3>검증을 나누는 기준</h3><ul><li>필수값·형식: 브라우저에서 즉시 안내</li><li>중복 ID·권한: 서버가 최종 판단</li><li>서버 오류: 필드 오류와 전체 오류를 분리 표시</li></ul><div class="note-warning"><strong>파일 입력</strong><p>파일 input은 문자열 state처럼 다루지 않고 <code>event.target.files</code>에서 File을 꺼내 FormData로 보낸다.</p></div>`),
    L("React Router와 URL 상태", "URL을 화면 선택 상태로 사용하고 선언적 이동과 코드 이동을 구분한다.", `<h2>Router가 하는 일</h2>${flow("URL", "Route match", "Page component", "params/query", "data load")}<pre data-lang="JSX"><code>&lt;Routes&gt;
  &lt;Route element={&lt;DefaultLayout /&gt;}&gt;
    &lt;Route path="/members" element={&lt;MemberList /&gt;} /&gt;
    &lt;Route path="/members/:memberId" element={&lt;MemberDetail /&gt;} /&gt;
  &lt;/Route&gt;
&lt;/Routes&gt;</code></pre><ul><li><code>Link</code>: 사용자가 클릭하는 일반 이동</li><li><code>useNavigate</code>: 로그인 성공처럼 로직 결과에 따른 이동</li><li><code>useParams</code>: 경로의 식별자 읽기</li><li><code>useSearchParams</code>: 검색·정렬·페이지처럼 공유 가능한 화면 상태</li></ul><p>목록의 필터와 페이지를 URL에 두면 새로고침·뒤로가기·링크 공유가 자연스러워진다. 인증 여부에 따른 보호는 Layout 또는 route guard에서 처리한다.</p>`),
    L("useEffect와 서버 동기화", "Effect를 렌더 후 외부 시스템 동기화에만 사용하고 cleanup과 요청 경쟁을 처리한다.", `<h2>Effect는 계산용이 아니다</h2><p>API, 타이머, 이벤트 구독, WebSocket처럼 React 밖의 시스템과 동기화할 때 사용한다. props와 state로 계산 가능한 값은 Effect에서 다시 set하지 않는다.</p><pre data-lang="JSX"><code>useEffect(() =&gt; {
  const controller = new AbortController();

  async function load() {
    try {
      const response = await api.get('/members', {
        signal: controller.signal
      });
      setMembers(response.data);
    } catch (error) {
      if (error.name !== 'CanceledError') setError(error);
    }
  }

  load();
  return () =&gt; controller.abort();
}, [keyword]);</code></pre><table><tr><th>dependency</th><th>실행</th></tr><tr><td>없음</td><td>모든 commit 뒤</td></tr><tr><td><code>[]</code></td><td>mount 뒤, unmount 때 cleanup</td></tr><tr><td><code>[keyword]</code></td><td>mount 및 keyword 변경 뒤</td></tr></table><blockquote><strong>Strict Mode:</strong> 개발 중 mount를 다시 수행해 cleanup이 올바른지 드러낼 수 있다. ref로 실행을 억지로 막기보다 구독 해제·요청 취소를 구현한다.</blockquote><a class="reference-link" href="https://react.dev/learn/synchronizing-with-effects" target="_blank" rel="noopener"><small>React 공식 문서</small><span>Synchronizing with Effects</span><b>↗</b></a>`),
    L("useRef의 두 가지 역할", "렌더링을 일으키지 않는 값 보관과 DOM 참조를 state와 구분한다.", `<h2>state와 ref의 차이</h2><table><tr><th></th><th>state</th><th>ref</th></tr><tr><td>변경 시 렌더</td><td>한다</td><td>하지 않는다</td></tr><tr><td>화면에 보이는 값</td><td>적합</td><td>부적합</td></tr><tr><td>DOM·timer ID</td><td>부적합</td><td>적합</td></tr></table><pre data-lang="JSX"><code>const inputRef = useRef(null);
const timerRef = useRef(null);

function focusInput() {
  inputRef.current?.focus();
}

&lt;input ref={inputRef} /&gt;</code></pre><p>ref 값은 렌더 사이에 유지되지만 변경해도 화면이 갱신되지 않는다. 이전 값, interval ID, WebSocket 객체처럼 화면 계산에 직접 사용하지 않는 값을 보관한다.</p><div class="note-warning"><strong>주의</strong><p>렌더 중 <code>ref.current</code>를 읽고 써서 UI를 결정하지 않는다. DOM 접근도 focus·측정·외부 라이브러리 연동처럼 필요한 곳에 한정한다.</p></div>`),
    L("Context·Reducer·Redux Toolkit", "상태 범위와 변경 복잡도에 따라 props, Context, reducer, Redux를 선택한다.", `<h2>전역 상태부터 만들지 않는다</h2><ol><li>한 컴포넌트만 쓰면 local state</li><li>가까운 형제가 쓰면 공통 부모로 올리기</li><li>테마·로그인처럼 트리 전체가 쓰면 Context</li><li>변경 규칙이 많으면 reducer</li><li>여러 화면·비동기·DevTools 추적이 필요하면 Redux Toolkit</li></ol><pre data-lang="JavaScript"><code>const memberSlice = createSlice({
  name: 'member',
  initialState: { user: null, status: 'idle' },
  reducers: {
    signedOut(state) { state.user = null; }
  }
});</code></pre>${flow("UI dispatch", "action", "reducer", "new state", "selector render")}<p><code>useSelector</code>는 store에서 필요한 값을 읽고, <code>useDispatch</code>는 무슨 일이 일어났는지 action을 보낸다. 서버 데이터는 캐시 도구와 전역 UI 상태를 구분하면 구조가 선명해진다.</p>`),
    L("Axios 계층과 Vite Proxy", "요청 주소·공통 헤더·도메인 API를 분리하고 개발 proxy의 범위를 이해한다.", `<h2>통신 코드를 컴포넌트에 흩뿌리지 않는다</h2><pre data-lang="JavaScript"><code>export const api = axios.create({ baseURL: '/api', timeout: 5000 });

export const memberApi = {
  list: params =&gt; api.get('/members', { params }),
  detail: id =&gt; api.get('/members/' + id)
};</code></pre><p>컴포넌트는 로딩·성공·실패 화면에 집중하고, endpoint와 요청 형식은 API 모듈이 책임진다. interceptor에는 토큰 첨부와 공통 오류 변환만 두고 화면 이동을 과하게 넣지 않는다.</p><h3>Vite 개발 proxy</h3><pre data-lang="JavaScript"><code>server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}</code></pre>${flow("Browser /api", "Vite dev server", "localhost:8080", "Spring API")}<blockquote><strong>중요:</strong> proxy는 개발 서버 기능이다. 운영에서는 reverse proxy, 동일 origin 배포, 또는 서버 CORS 정책을 별도로 구성한다.</blockquote>`)
  ]);

  set("jpa", "Entity의 생명주기와 연관관계부터 DTO 경계·N+1·QueryDSL까지 SQL이 만들어지는 이유를 따라간다.", [
    L("ORM과 Entity 생명주기", "객체 상태 변경이 언제 SQL로 반영되는지 영속성 컨텍스트 중심으로 본다.", `<h2>JPA는 SQL을 없애는 기술이 아니다</h2><p>Entity와 테이블의 변환 규칙을 선언하고, EntityManager가 객체 상태를 추적해 적절한 SQL을 실행한다. 생성한 Java 객체가 모두 자동 저장되는 것은 아니다.</p>${flow("Transient", "Managed", "Detached", "Removed")}<ul><li><strong>비영속:</strong> new만 한 객체</li><li><strong>영속:</strong> 영속성 컨텍스트가 추적</li><li><strong>준영속:</strong> 추적에서 분리</li><li><strong>삭제:</strong> 삭제 예정</li></ul><p>같은 트랜잭션 안에서 같은 ID를 다시 조회하면 1차 캐시의 동일 객체를 받을 수 있다. flush는 변경 SQL을 DB에 전달하지만 트랜잭션 commit과 같은 뜻은 아니다.</p>`),
    L("Entity 매핑과 식별자", "테이블 규칙과 객체 규칙을 분리하고 안전한 생성 경로를 만든다.", `<pre data-lang="Java"><code>@Entity
@Table(name = "member")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String email;

  protected Member(String email) { this.email = email; }
}</code></pre><p>Entity에는 DB 식별자와 불변 조건을 지키는 생성·변경 메서드를 둔다. API 요청 DTO의 validation과 DB constraint는 역할이 다르므로 둘 다 필요하다.</p><h3>공통 시간</h3><p><code>@MappedSuperclass</code>와 auditing으로 createdAt·updatedAt을 공통화할 수 있다. equals/hashCode에 변경 가능한 모든 필드를 넣으면 컬렉션에서 문제가 생길 수 있어 식별 전략을 먼저 정한다.</p>`),
    L("Repository와 조회 방법 선택", "파생 쿼리, JPQL, native SQL, projection의 경계를 구분한다.", `<h2>쉬운 조회부터 가장 단순한 도구를 쓴다</h2><pre data-lang="Java"><code>Page&lt;Book&gt; findByDeletedFalseAndTitleContainingIgnoreCase(
    String keyword, Pageable pageable);

@Query("select b from Book b where b.author.id = :authorId")
List&lt;Book&gt; findByAuthor(@Param("authorId") Long authorId);</code></pre><ul><li>파생 쿼리: 짧고 명확한 조건</li><li>JPQL: Entity와 필드를 기준으로 직접 작성</li><li>QueryDSL: 선택 조건이 조합되는 동적 조회</li><li>Native SQL: DB 고유 기능이 꼭 필요할 때</li><li>Projection: 필요한 열만 조회할 때</li></ul><blockquote><strong>메서드 이름이 문장처럼 길어지면</strong> 파생 쿼리를 고집하지 말고 쿼리 의도를 드러내는 방법으로 바꾼다.</blockquote><a class="reference-link" href="https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html" target="_blank" rel="noopener"><small>Spring Data JPA</small><span>JPA Query Methods</span><b>↗</b></a>`),
    L("트랜잭션과 변경 감지", "Service의 작업 단위를 하나의 트랜잭션으로 묶고 managed Entity 변경을 이해한다.", `<pre data-lang="Java"><code>@Transactional
public void changeNickname(Long memberId, String nickname) {
  Member member = repository.findById(memberId)
      .orElseThrow(MemberNotFoundException::new);
  member.changeNickname(nickname);
} // commit 직전 flush에서 UPDATE</code></pre><p>명시적인 save가 없어도 managed Entity의 스냅샷과 현재 상태가 다르면 UPDATE가 생성된다. 조회 Service에는 <code>@Transactional(readOnly = true)</code>를 기본으로 두고 쓰기 메서드에서 다시 write transaction을 선언할 수 있다.</p><div class="note-warning"><strong>self invocation</strong><p>같은 클래스 안에서 <code>this.someTransactionalMethod()</code>를 호출하면 proxy 경계를 통과하지 않아 annotation이 기대대로 적용되지 않을 수 있다. 트랜잭션 경계는 외부에서 호출되는 public Service 메서드로 설계한다.</p></div>`),
    L("연관관계의 주인과 편의 메서드", "외래 키를 실제로 바꾸는 쪽과 객체 양방향 참조를 구분한다.", `<h2>DB 외래 키가 있는 쪽이 보통 주인</h2><pre data-lang="Java"><code>@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "member_id", nullable = false)
private Member member;

@OneToMany(mappedBy = "member")
private List&lt;Order&gt; orders = new ArrayList&lt;&gt;();</code></pre><p><code>mappedBy</code>가 있는 컬렉션은 외래 키를 직접 수정하지 않는다. 양쪽 객체 상태를 맞추는 편의 메서드를 한쪽에 둔다.</p><pre data-lang="Java"><code>public void addOrder(Order order) {
  orders.add(order);
  order.assignMember(this);
}</code></pre><h3>cascade와 orphanRemoval</h3><p>부모와 자식의 생명주기가 정말 같을 때만 cascade를 사용한다. 다른 Aggregate도 참조하는 Entity에 remove cascade를 걸면 예상치 못한 삭제가 생긴다.</p>`),
    L("LAZY와 N+1 문제", "조회 쿼리 수를 로그로 확인하고 필요한 관계만 한 번에 가져온다.", `<h2>N+1은 반복문이 아니라 조회 전략 문제</h2><pre data-lang="Java"><code>List&lt;Order&gt; orders = orderRepository.findAll(); // 1
for (Order order : orders) {
  order.getMember().getNickname();              // N
}</code></pre><p>연관 Entity가 LAZY이고 각 proxy를 접근할 때 추가 SELECT가 발생하면 1+N 쿼리가 된다. 해결은 모든 관계를 EAGER로 바꾸는 것이 아니다.</p><ul><li>fetch join: 해당 use case에 필요한 관계를 함께 조회</li><li><code>@EntityGraph</code>: repository 조회 계획 선언</li><li>DTO projection: 화면에 필요한 열만 조회</li><li>batch fetch: 여러 LAZY proxy를 묶어 조회</li></ul><div class="note-warning"><strong>컬렉션 fetch join과 paging</strong><p>행이 증가해 메모리 paging이나 중복 문제가 생길 수 있다. 루트 ID를 먼저 paging하고 상세을 별도 조회하는 2단계 전략도 고려한다.</p></div>`),
    L("Entity와 DTO의 경계", "DB 모델을 API 계약으로 직접 노출하지 않고 Service에서 변환한다.", `<h2>권장 흐름</h2>${flow("Request DTO", "Controller", "Service", "Entity", "Response DTO")}<p>Entity를 그대로 JSON으로 반환하면 LAZY 초기화, 양방향 참조 무한 순환, 비밀번호 같은 필드 노출, API와 DB 구조 결합 문제가 생긴다.</p><pre data-lang="Java"><code>public record MemberResponse(Long id, String nickname) {
  static MemberResponse from(Member member) {
    return new MemberResponse(member.getId(), member.getNickname());
  }
}</code></pre><p>Controller는 HTTP 입출력을, Service는 use case와 트랜잭션을, Repository는 영속화를 담당한다. 변환 위치는 팀 규칙에 따라 mapper로 분리할 수 있지만 Entity가 Controller 밖까지 새어 나가지 않게 한다.</p>`),
    L("QueryDSL 동적 검색과 페이징", "null 조건 조합으로 타입 안전한 검색식을 만들고 count 비용을 분리한다.", `<pre data-lang="Java"><code>private BooleanExpression titleContains(String keyword) {
  return hasText(keyword) ? book.title.containsIgnoreCase(keyword) : null;
}

private BooleanExpression authorEq(Long authorId) {
  return authorId != null ? book.author.id.eq(authorId) : null;
}

List&lt;BookSummary&gt; content = queryFactory
  .select(Projections.constructor(BookSummary.class, book.id, book.title))
  .from(book)
  .where(titleContains(keyword), authorEq(authorId))
  .orderBy(book.id.desc())
  .offset(pageable.getOffset())
  .limit(pageable.getPageSize())
  .fetch();</code></pre><p>where에 null을 전달하면 조건에서 제외되므로 작은 predicate 메서드를 조합할 수 있다. 정렬 값은 외부 문자열을 그대로 path로 쓰지 말고 허용 목록으로 변환한다.</p><h3>count query</h3><p>복잡한 join의 content query와 단순한 count query를 분리한다. 전체 개수가 필요 없는 ‘더 보기’ UI라면 Slice를 사용해 count 비용을 피할 수 있다.</p>`)
  ]);

  set("security", "회원가입부터 로그인·JWT 검증·권한 실패·Refresh Token까지 요청이 필터 체인을 지나는 순서로 다시 배운다.", [
    L("인증·인가·세션·JWT", "신원 확인과 권한 판단을 분리하고 상태 저장 방식의 차이를 본다.", `<table><tr><th>개념</th><th>질문</th><th>실패</th></tr><tr><td>인증</td><td>누구인가?</td><td>401</td></tr><tr><td>인가</td><td>이 기능을 써도 되는가?</td><td>403</td></tr></table><h2>세션과 JWT</h2><div class="compare-lane"><article><span>Session</span><ul><li>서버가 로그인 상태 저장</li><li>브라우저는 session ID cookie 보관</li><li>즉시 강제 로그아웃이 쉽다.</li></ul></article><article><span>JWT</span><ul><li>서명된 claim을 클라이언트가 전달</li><li>서버는 서명·만료·issuer 등을 검증</li><li>폐기·갱신 전략을 따로 설계한다.</li></ul></article></div><blockquote><strong>JWT는 암호화 봉투가 아니다.</strong> payload는 읽을 수 있으므로 비밀번호·주민번호·민감정보를 넣지 않는다.</blockquote>`),
    L("Security Filter Chain 전체 구조", "Controller 전에 요청을 검사하는 필터와 AuthenticationManager의 역할을 연결한다.", `<h2>요청은 Controller로 바로 가지 않는다</h2>${flow("HTTP Request", "Security Filters", "Authentication", "Authorization", "Controller")}<ul><li><strong>SecurityFilterChain:</strong> 어떤 필터와 URL 규칙을 쓸지 정의</li><li><strong>AuthenticationManager:</strong> 인증 요청을 적절한 Provider에 전달</li><li><strong>AuthenticationProvider:</strong> 실제 자격 증명 검증</li><li><strong>SecurityContextHolder:</strong> 현재 요청의 인증 결과 보관</li></ul><pre data-lang="Java"><code>http
  .sessionManagement(s -&gt; s.sessionCreationPolicy(STATELESS))
  .authorizeHttpRequests(auth -&gt; auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .anyRequest().authenticated());</code></pre><p>구체적인 규칙을 앞에, 넓은 규칙을 뒤에 둔다. 전체 permitAll로 오류를 숨기지 않는다.</p>`),
    L("회원가입과 비밀번호 저장", "입력 검증·중복 확인·PasswordEncoder를 거쳐 안전하게 계정을 만든다.", `<h2>회원가입도 보안 필터를 통과한다</h2>${flow("Join DTO", "Validation", "Duplicate check", "Password encode", "Entity save")}<pre data-lang="Java"><code>@Bean
PasswordEncoder passwordEncoder() {
  return new BCryptPasswordEncoder();
}

String encoded = passwordEncoder.encode(request.password());
memberRepository.save(Member.join(request.email(), encoded));</code></pre><p>비밀번호는 복호화할 수 있는 형태가 아니라 salted one-way hash로 저장한다. 로그인 때는 <code>matches(raw, encoded)</code>로 검증한다.</p><ul><li>회원가입 endpoint만 permitAll</li><li>role은 요청 DTO에서 그대로 받지 않고 서버가 기본값 부여</li><li>중복 오류와 DB unique constraint를 모두 처리</li><li>로그에 raw password를 남기지 않기</li></ul>`),
    L("로그인과 Access Token 발급", "로그인 필터가 자격 증명을 인증하고 성공한 사용자에게 토큰을 만든다.", `<h2>로그인 요청 흐름</h2>${flow("email/password", "Login Filter", "AuthenticationManager", "UserDetailsService", "PasswordEncoder", "JWT issue")}<p>로그인 필터는 JSON body를 DTO로 읽어 미인증 Authentication을 만들고 Manager에 전달한다. 성공 handler에서 인증된 principal과 authorities로 토큰을 발급한다.</p><pre data-lang="HTTP"><code>POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "********" }</code></pre><h3>토큰 claim 최소 구성</h3><ul><li><code>sub</code>: 변하지 않는 사용자 식별자</li><li><code>iat</code>, <code>exp</code>: 발급·만료</li><li><code>iss</code>, <code>aud</code>: 발급자·대상 서비스</li><li>권한: 서버 정책에 필요한 최소 role/scope</li></ul>`),
    L("JWT 검증 필터", "매 요청에서 Bearer Token을 꺼내 검증하고 SecurityContext를 채운다.", `<pre data-lang="Java"><code>String header = request.getHeader("Authorization");
if (header == null || !header.startsWith("Bearer ")) {
  filterChain.doFilter(request, response);
  return;
}

String token = header.substring(7);
JwtClaims claims = jwtService.verify(token); // signature, exp, iss, aud
Authentication auth = authenticationFrom(claims);
SecurityContextHolder.getContext().setAuthentication(auth);
filterChain.doFilter(request, response);</code></pre><p>토큰이 없으면 공개 endpoint일 수 있으므로 다음 필터로 넘기고, 토큰이 있는데 잘못됐다면 401 응답으로 끝낸다. 문자열 decode만 하고 신뢰하면 안 되며 반드시 서명과 표준 claim을 검증한다.</p><a class="reference-link" href="https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html" target="_blank" rel="noopener"><small>Spring Security</small><span>JWT Resource Server 인증 구조</span><b>↗</b></a>`),
    L("Access·Refresh Token 전략", "짧은 API 토큰과 갱신용 토큰의 수명·저장·회전을 분리한다.", `<table><tr><th></th><th>Access</th><th>Refresh</th></tr><tr><td>목적</td><td>API 접근</td><td>Access 재발급</td></tr><tr><td>수명</td><td>짧게</td><td>상대적으로 길게</td></tr><tr><td>노출 영향</td><td>만료까지 API 사용</td><td>새 토큰 지속 발급 위험</td></tr></table><h2>권장 흐름</h2>${flow("login", "access + refresh", "access expired", "refresh rotate", "new pair")}<p>Refresh Token은 서버 저장소에서 사용자·기기·만료·폐기 상태를 추적하고 재사용을 감지할 수 있다. 로그아웃 시 해당 refresh를 폐기한다.</p><div class="note-warning"><strong>브라우저 저장</strong><p>토큰 저장 위치는 XSS·CSRF·배포 구조를 함께 보고 결정한다. HttpOnly·Secure·SameSite cookie를 사용하면 JavaScript 접근을 줄일 수 있지만 CSRF 방어가 필요하다.</p></div>`),
    L("401·403·CORS·CSRF", "비슷하게 보이는 보안 실패를 발생 지점별로 구분한다.", `<table><tr><th>증상</th><th>뜻</th><th>먼저 확인</th></tr><tr><td>401</td><td>인증 없음·실패</td><td>Authorization header, 만료, 서명</td></tr><tr><td>403</td><td>인증됐지만 권한 부족</td><td>role prefix, request matcher</td></tr><tr><td>CORS</td><td>브라우저가 다른 origin 응답 차단</td><td>preflight, allowed origin/header</td></tr><tr><td>CSRF</td><td>사용자 자격 증명으로 위조 요청</td><td>cookie 기반 인증 여부와 token</td></tr></table><p>Postman 성공·브라우저 실패라면 CORS 가능성이 크다. CORS 설정은 SecurityFilterChain과 MVC 양쪽에 중복·충돌하지 않게 한 곳의 정책으로 관리한다.</p>`),
    L("인증 테스트와 장애 진단", "정상 로그인만이 아니라 만료·위조·권한 부족을 테스트한다.", `<h2>Postman 테스트 순서</h2><ol><li>회원가입 → DB의 비밀번호가 평문이 아닌지 확인</li><li>로그인 성공 → token과 만료 확인</li><li>token 없이 보호 API → 401</li><li>정상 token → 200</li><li>서명 한 글자 변경 → 401</li><li>만료 token → 401</li><li>USER token으로 ADMIN API → 403</li><li>refresh 재발급 후 이전 refresh 재사용 정책 확인</li></ol><h2>로그 위치</h2><p>필터 진입, 인증 성공·실패 원인, 사용자 ID, endpoint는 남기되 비밀번호와 전체 token은 남기지 않는다. 예외가 ControllerAdvice에 안 잡히면 Controller 이전의 Security filter에서 발생했는지 확인한다.</p>`)
  ]);

  set("realtime", "WebSocket 연결·STOMP 메시지 경로·재연결·Redis 확장까지 실시간 기능의 실패 지점을 따라간다.", [
    L("HTTP polling과 WebSocket", "요청마다 연결하는 방식과 지속 연결의 차이를 이해한다.", `<table><tr><th></th><th>HTTP Polling</th><th>WebSocket</th></tr><tr><td>연결</td><td>주기적으로 요청</td><td>연결 유지</td></tr><tr><td>서버 push</td><td>다음 polling까지 대기</td><td>즉시 전송 가능</td></tr><tr><td>적합</td><td>가끔 변하는 데이터</td><td>채팅·알림·협업</td></tr></table>${flow("HTTP handshake", "101 Switching Protocols", "persistent connection", "bidirectional frames")}<p>연결이 지속되므로 인증 만료, 연결 끊김, 서버 재시작, 중복 구독을 반드시 설계한다. 모든 API를 WebSocket으로 바꾸는 것이 아니라 CRUD는 HTTP, 실시간 변화만 WebSocket으로 나누는 경우가 많다.</p>`),
    L("STOMP endpoint와 destination", "연결 주소, 발행 주소, 구독 주소를 서로 다른 개념으로 구분한다.", `<pre data-lang="Java"><code>@EnableWebSocketMessageBroker
class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws");
  }
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.setApplicationDestinationPrefixes("/app");
    config.enableSimpleBroker("/topic", "/queue");
  }
}</code></pre>${flow("CONNECT /ws", "SEND /app/chat", "@MessageMapping", "broker", "SUBSCRIBE /topic/rooms/1")}<p><code>/ws</code>는 handshake endpoint, <code>/app</code>은 서버 handler로 보낼 prefix, <code>/topic</code>은 여러 구독자 broadcast에 쓰는 broker destination이다.</p><a class="reference-link" href="https://docs.spring.io/spring-framework/reference/web/websocket/stomp.html" target="_blank" rel="noopener"><small>Spring Framework</small><span>STOMP over WebSocket</span><b>↗</b></a>`),
    L("메시지 DTO·저장·전송 순서", "실시간 전송과 영구 저장의 성공 기준을 분리한다.", `<h2>채팅 한 건의 흐름</h2>${flow("Client send", "authenticate", "validate", "DB save", "broadcast", "Client append")}<pre data-lang="Java"><code>@MessageMapping("/rooms/{roomId}/messages")
public void send(@DestinationVariable Long roomId,
                 ChatMessageRequest request,
                 Principal principal) {
  ChatMessageResponse saved = chatService.save(roomId, principal, request);
  messagingTemplate.convertAndSend("/topic/rooms/" + roomId, saved);
}</code></pre><p>클라이언트가 보낸 sender ID를 신뢰하지 않고 연결의 Principal에서 사용자를 얻는다. 메시지를 먼저 방송하고 DB 저장이 실패하면 화면과 기록이 달라지므로 시스템의 성공 순서를 정한다.</p>`),
    L("인증·heartbeat·재연결", "연결 단계에서 토큰을 검증하고 끊김 후 구독을 안전하게 복구한다.", `<h2>연결 수명주기</h2>${flow("connecting", "connected", "subscribed", "disconnected", "backoff reconnect")}<ul><li>CONNECT frame의 token을 ChannelInterceptor에서 검증</li><li>인가되지 않은 room destination 구독 차단</li><li>heartbeat로 죽은 연결 감지</li><li>재연결은 지수 backoff와 최대 간격 적용</li><li>재연결 성공 후 기존 subscription 다시 등록</li><li>컴포넌트 unmount에서 unsubscribe·disconnect</li></ul><div class="note-warning"><strong>중복 메시지</strong><p>Strict Mode 재마운트나 재연결 때 subscription cleanup이 빠지면 같은 메시지를 여러 번 받는다. 메시지 ID로 UI 중복 방지도 준비한다.</p></div>`),
    L("Redis 자료형·TTL·캐시", "Redis를 단순 Map이 아니라 목적별 자료구조와 만료 정책으로 사용한다.", `<table><tr><th>자료형</th><th>용도</th></tr><tr><td>String</td><td>캐시, counter, token</td></tr><tr><td>Hash</td><td>객체 필드</td></tr><tr><td>Set</td><td>중복 없는 접속 사용자</td></tr><tr><td>Sorted Set</td><td>점수 기반 순위</td></tr><tr><td>Stream</td><td>순서 있는 이벤트 로그</td></tr></table><h2>Cache Aside</h2>${flow("cache GET", "miss", "DB query", "cache SET + TTL", "response")}<p>TTL이 없으면 오래된 값이 남고 메모리가 계속 늘어난다. DB 변경 후 cache delete 또는 update 정책을 정하며, 동시에 많은 miss가 발생하는 stampede도 고려한다.</p><a class="reference-link" href="https://redis.io/docs/latest/develop/data-types/" target="_blank" rel="noopener"><small>Redis 공식 문서</small><span>Redis data types</span><b>↗</b></a>`),
    L("Redis Pub/Sub과 Streams", "실시간 확장용 방송과 유실을 허용하지 않는 이벤트 처리를 구분한다.", `<div class="compare-lane"><article><span>Pub/Sub</span><ul><li>현재 연결된 subscriber에게 즉시 전달</li><li>저장·재처리 없음</li><li>채팅 broadcast fan-out</li></ul></article><article><span>Streams</span><ul><li>append-only event 저장</li><li>consumer group·ack·재처리</li><li>작업 queue와 이벤트 처리</li></ul></article></div><p>서버가 여러 대면 한 서버의 in-memory simple broker만으로 다른 서버의 client에게 전달할 수 없다. 외부 broker 또는 Redis channel을 통해 instance 간 메시지를 전달하고, 각 서버가 자기 연결에 broadcast한다.</p><blockquote><strong>전달 보장:</strong> Redis Pub/Sub은 subscriber가 끊겨 있으면 메시지를 잃는다. 재처리가 필요하면 Streams 같은 저장형 구조를 쓴다.</blockquote><a class="reference-link" href="https://redis.io/docs/latest/develop/pubsub/" target="_blank" rel="noopener"><small>Redis 공식 문서</small><span>Pub/Sub delivery semantics</span><b>↗</b></a>`)
  ]);

  set("infra", "Linux 서버 운영과 Docker 이미지·컨테이너·Compose·배포, Vagrant·Ansible 자동화까지 실행 환경을 재현한다.", [
    L("이미지·컨테이너·VM", "불변 실행 패키지와 격리된 프로세스를 구분한다.", `<h2>세 개를 구분하면 Docker가 쉬워진다</h2><table><tr><th>개념</th><th>역할</th></tr><tr><td>Dockerfile</td><td>이미지를 만드는 레시피</td></tr><tr><td>Image</td><td>실행 파일·런타임·설정을 담은 불변 패키지</td></tr><tr><td>Container</td><td>이미지를 실행한 격리 프로세스</td></tr></table>${flow("Dockerfile", "docker build", "Image", "docker run", "Container")}<p>VM은 별도 OS kernel까지 포함하지만 컨테이너는 host kernel을 공유한다. 컨테이너를 삭제해도 이미지는 남고, 컨테이너 내부에만 저장한 데이터는 사라질 수 있다.</p><a class="reference-link" href="https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/" target="_blank" rel="noopener"><small>Docker Docs</small><span>What is a container?</span><b>↗</b></a>`),
    L("Spring Boot Dockerfile", "JAR와 JRE를 이미지에 넣고 예측 가능한 실행 명령을 만든다.", `<pre data-lang="Dockerfile"><code>FROM eclipse-temurin:21-jre
WORKDIR /app
COPY build/libs/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre><h2>빌드 전 준비</h2><pre data-lang="Shell"><code>./gradlew clean bootJar
docker build -t ahj/app:1.0.0 .
docker image ls ahj/app</code></pre><p>base image의 Java major version은 JAR와 맞춘다. build context에 불필요한 파일과 Secret이 들어가지 않도록 <code>.dockerignore</code>를 둔다.</p><pre data-lang="Plain Text"><code>.git
.gradle
build
*.env
application-private.properties</code></pre><blockquote><strong>이미지는 불변이다.</strong> 실행 중 컨테이너를 고쳐 새 버전으로 쓰지 않고 Dockerfile을 고쳐 새 tag로 build한다.</blockquote>`),
    L("docker run·포트·환경 변수·볼륨", "container 내부와 host 경계를 옵션별로 연결한다.", `<pre data-lang="Shell"><code>docker run -d \
  --name ahj-api \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file ./app.env \
  ahj/app:1.0.0</code></pre><table><tr><th>옵션</th><th>뜻</th></tr><tr><td><code>-d</code></td><td>백그라운드</td></tr><tr><td><code>--name</code></td><td>관리할 이름</td></tr><tr><td><code>-p host:container</code></td><td>host 포트를 container 포트에 연결</td></tr><tr><td><code>--env-file</code></td><td>실행 환경 주입</td></tr></table><p>DB 데이터와 사용자 업로드는 container writable layer에만 두지 않는다. named volume 또는 외부 서비스(RDS·S3)를 사용한다.</p><pre data-lang="Shell"><code>docker run -v pgdata:/var/lib/postgresql/data postgres</code></pre>`),
    L("컨테이너 로그와 장애 진단", "상태·로그·포트·환경을 안에서 밖으로 확인한다.", `<pre data-lang="Shell"><code>docker ps
docker ps -a
docker logs -f --tail 100 ahj-api
docker inspect ahj-api
docker exec -it ahj-api sh
docker stats</code></pre><h2>실행 직후 종료될 때</h2><ol><li><code>docker ps -a</code>에서 exit code 확인</li><li><code>docker logs</code>에서 Java·DB·환경 변수 오류 확인</li><li>ENTRYPOINT 명령과 JAR 경로 확인</li><li>host 포트 충돌 확인</li><li>health endpoint를 container 내부와 host에서 각각 호출</li></ol><div class="check-result"><span>container 내부 성공</span><i>+</i><span>host 실패</span><b>포트 publish 또는 host firewall 문제</b></div>`),
    L("Docker Compose로 여러 서비스 묶기", "API·DB·Redis의 네트워크와 환경을 한 파일로 재현한다.", `<pre data-lang="YAML"><code>services:
  api:
    build: .
    ports: ["8080:8080"]
    env_file: .env
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: app
      POSTGRES_PASSWORD: change-me
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
volumes:
  pgdata:</code></pre><p>container끼리는 service name인 <code>db</code>로 통신한다. container 안의 <code>localhost</code>는 그 container 자신이다. <code>depends_on</code>의 시작 순서만으로 DB 준비가 보장되지 않아 healthcheck나 재시도 정책이 필요하다.</p>`),
    L("Registry에서 EC2 배포까지", "버전 tag로 이미지를 올리고 서버에서 같은 이미지를 실행한다.", `<h2>배포 흐름</h2>${flow("build", "tag", "registry push", "EC2 pull", "run", "health check")}<pre data-lang="Shell"><code>docker build -t USER/ahj-api:1.0.0 .
docker push USER/ahj-api:1.0.0

# EC2
docker pull USER/ahj-api:1.0.0
docker stop ahj-api &amp;&amp; docker rm ahj-api
docker run -d --name ahj-api --restart unless-stopped \
  -p 8080:8080 --env-file /opt/ahj/app.env USER/ahj-api:1.0.0</code></pre><p><code>latest</code>만 사용하면 어떤 코드인지 추적하고 rollback하기 어렵다. commit SHA 또는 release version tag를 남기고 새 container health check가 성공한 뒤 이전 이미지를 정리한다.</p>`),
    L("Vagrant·Ansible·IaC", "가상 머신 생성과 서버 설정 자동화의 책임을 나눈다.", `<div class="compare-lane"><article><span>Vagrant</span><ul><li>VM의 CPU·memory·network 정의</li><li><code>vagrant up</code>으로 환경 생성</li><li>로컬 실습 환경 통일</li></ul></article><article><span>Ansible</span><ul><li>package·file·service 상태 선언</li><li>여러 서버에 동일 설정</li><li>반복 실행 가능한 멱등성 지향</li></ul></article></div>${flow("Vagrantfile", "VM create", "Ansible playbook", "Java/Docker install", "service running")}<pre data-lang="YAML"><code>- hosts: app
  become: true
  tasks:
    - name: Install Docker
      ansible.builtin.apt:
        name: docker.io
        state: present
        update_cache: true
    - name: Ensure Docker is running
      ansible.builtin.service:
        name: docker
        state: started
        enabled: true</code></pre><p>IaC의 목적은 명령어를 파일에 옮기는 것이 아니라 같은 선언으로 같은 환경을 재현하고 변경 이력을 검토하는 것이다.</p>`)
  ]);
})();
