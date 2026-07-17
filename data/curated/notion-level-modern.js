/* React 상태 관리와 JWT를 원문에서 이해하려 했던 순서대로 풀어 쓴다. */
(function () {
  const add = (slug, index, html) => { const l=(window.CURATED_STUDY||[]).find(c=>c.slug===slug)?.lessons[index]; if(l) l.body+=html; };

  add("react",0,`<h2>React는 HTML을 한 번 그리는 도구가 아니다</h2><p>컴포넌트 함수는 현재 props와 state를 입력받아 이번 화면의 JSX를 계산한다. state가 바뀌면 React가 함수를 다시 호출하고 이전 결과와 새 결과를 비교해 필요한 DOM만 반영한다. 따라서 화면을 직접 찾아 고치기보다 화면을 결정하는 state를 바꾼다.</p><figure class="console-shot"><img src="assets/notion-guide/react-project.png" alt="Vite React 프로젝트의 src 폴더와 App 컴포넌트 화면" loading="lazy"><figcaption>원문 수업 화면에서 기억할 구조: main.jsx가 React 시작점을 만들고 App.jsx가 최상위 화면을 구성한다. terminal의 현재 폴더와 편집 중인 프로젝트가 같은지도 함께 확인한다.</figcaption></figure><pre data-lang="JSX"><code>function Counter(){
  const [count,setCount]=useState(0);
  return &lt;button onClick={()=&gt;setCount(count+1)}&gt;{count}&lt;/button&gt;;
}</code></pre><p>버튼 클릭 시 DOM의 글자를 직접 바꾸지 않았다. state 변경이 새 렌더링을 만들고 JSX의 <code>{count}</code>가 달라진다. 이 흐름이 이후 form·API·Redux를 이해하는 출발점이다.</p><h3>렌더링 중에는 순수하게 계산한다</h3><p>컴포넌트 본문에서 fetch, timer, DOM 변경을 실행하면 렌더링할 때마다 부수 효과가 반복될 수 있다. 화면 계산은 본문에, 외부 시스템 동기화는 event handler나 effect에 둔다.</p>`);

  add("react",1,`<h2>컴포넌트는 파일 분리가 아니라 책임 분리다</h2><p>반복되는 UI, 독립적으로 상태를 갖는 부분, 이름을 붙여 설명할 수 있는 역할을 컴포넌트로 나눈다. 부모는 props로 필요한 값을 내려주고 자식은 받은 값을 임의로 수정하지 않는다.</p><pre data-lang="JSX"><code>function MemberCard({member,onSelect}){
  return &lt;button onClick={()=&gt;onSelect(member.id)}&gt;
    &lt;strong&gt;{member.nickname}&lt;/strong&gt;
  &lt;/button&gt;;
}</code></pre><p>자식이 부모 state를 직접 알 필요 없이 callback으로 사건만 알린다. <code>children</code>은 공통 틀 안에 서로 다른 내용을 끼워 넣는 합성 방식이다. 컴포넌트를 너무 잘게 나눠 props 전달만 복잡해지지 않도록 변경 이유와 재사용 경계를 본다.</p>`);

  add("react",2,`<h2>state는 지금 렌더링의 스냅샷이다</h2><p><code>setState</code>를 호출해도 현재 함수 안의 state 변수가 즉시 바뀌는 것은 아니다. 다음 렌더링을 예약한다. 이전 값을 기준으로 연속 변경할 때는 함수형 update를 사용한다.</p><pre data-lang="JSX"><code>setCount(prev=&gt;prev+1);
setTodos(prev=&gt;[...prev,newTodo]);
setMember(prev=&gt;({...prev,nickname:value}));</code></pre><p>배열의 push나 객체 field 직접 수정은 기존 참조를 그대로 유지한다. React가 변경을 알아보기 어렵고 이전 state까지 바뀌므로 새 배열·객체를 만든다.</p><h3>state를 최소화한다</h3><p>목록과 검색어가 있으면 검색 결과를 별도 state에 계속 복사하기보다 렌더링에서 filter로 계산한다. 서로 독립적으로 바뀔 수 없는 중복 state는 불일치의 원인이 된다.</p>`);

  add("react",3,`<h2>입력값의 주인을 React로 만들면 controlled form이다</h2><pre data-lang="JSX"><code>const [form,setForm]=useState({email:'',password:''});
const change=e=&gt;setForm(prev=&gt;({...prev,[e.target.name]:e.target.value}));
return &lt;input name="email" value={form.email} onChange={change}/&gt;;</code></pre><p>사용자가 입력하면 onChange가 state를 바꾸고, 새 state가 다시 input value로 내려간다. 화면값과 제출값이 같은 source를 사용하므로 검증과 초기화가 쉽다.</p><p>submit handler에서는 <code>preventDefault</code>로 기본 form 이동을 막고, 빈 값·형식을 먼저 검사한 뒤 API를 호출한다. button의 type을 생략하면 form 안에서 submit으로 동작할 수 있으므로 일반 버튼은 type을 명시한다.</p>`);

  add("react",4,`<h2>URL도 애플리케이션 상태다</h2><p>현재 보고 있는 회원 번호, 검색어, 페이지 번호가 URL에 있으면 새로고침과 공유가 가능하다. path parameter는 resource 식별, query string은 검색·정렬·paging처럼 선택 조건에 사용한다.</p><div class="concept-flow"><span>/boards/17</span><i>→</i><span>useParams</span><i>→</i><span>17번 조회</span></div><p><code>navigate</code>는 event 뒤 이동에, Link는 사용자가 누르는 탐색에 사용한다. render 중 조건에 따라 navigate를 실행하면 반복 이동이 생길 수 있다. Router 밖에서 hook을 쓰거나 배포 base path가 맞지 않으면 route가 동작하지 않으므로 route tree와 hosting 경로를 함께 확인한다.</p>`);

  add("react",5,`<h2>useEffect는 외부 시스템과 화면을 맞추는 곳이다</h2><p>원문에서 가장 자주 헷갈린 지점은 ‘API 함수니까 effect’가 아니라, 컴포넌트가 나타나거나 특정 값이 바뀔 때 server 데이터와 동기화해야 해서 effect를 쓴다는 점이다.</p><pre data-lang="JSX"><code>useEffect(()=&gt;{
  let ignore=false;
  async function load(){
    try{
      setLoading(true);
      const data=await todoApi.list();
      if(!ignore) setTodos(data);
    }catch(e){ if(!ignore) setError(e); }
    finally{ if(!ignore) setLoading(false); }
  }
  load();
  return ()=&gt;{ignore=true};
},[]);</code></pre><p>dependency 배열이 없으면 모든 렌더링 뒤, 빈 배열이면 mount 뒤, 값이 있으면 그 값이 바뀔 때 다시 실행된다. effect가 바꾸는 state를 dependency로 잘못 넣으면 요청과 렌더링이 반복될 수 있다.</p><h3>cleanup은 선택 기능이 아니다</h3><p>timer·subscription·event listener는 cleanup에서 해제한다. 느린 요청 응답이 화면을 떠난 뒤 도착해 state를 덮지 않도록 취소 또는 무시 처리도 둔다.</p>`);

  add("react",6,`<h2>useRef의 두 역할을 state와 비교한다</h2><table><tr><th>목적</th><th>선택</th></tr><tr><td>값이 바뀌면 화면도 바뀌어야 함</td><td>useState</td></tr><tr><td>렌더 사이에 값은 기억하지만 화면 갱신 불필요</td><td>useRef</td></tr><tr><td>input 같은 실제 DOM 접근</td><td>useRef</td></tr></table><pre data-lang="JSX"><code>const inputRef=useRef(null);
const requestIdRef=useRef(0);

inputRef.current?.focus();
requestIdRef.current+=1;</code></pre><p>ref.current를 바꿔도 다시 렌더링되지 않는다. 화면에 보여야 하는 값을 ref에 두면 내부 값은 바뀌었는데 UI는 그대로인 오류가 생긴다. DOM 접근도 React가 element를 연결한 이후에만 current가 생긴다.</p>`);

  add("react",7,`<h2>상태 관리 도구보다 데이터 흐름을 먼저 잡는다</h2><p>가까운 부모·자식만 쓰는 값은 props, 하위 여러 곳이 공유하는 theme·로그인 정보는 Context, 변경 규칙과 추적이 필요한 큰 전역 상태는 Reducer나 Redux Toolkit을 고려한다. 모든 값을 Redux에 넣는 것이 목표가 아니다.</p><h3>Redux Toolkit을 만드는 순서</h3><ol><li>slice에서 initialState와 reducer를 정의한다.</li><li>configureStore에 reducer를 등록한다.</li><li>최상단에 Provider로 store를 연결한다.</li><li>useSelector로 필요한 상태를 읽는다.</li><li>useDispatch로 action을 보낸다.</li></ol><pre data-lang="JavaScript"><code>const counterSlice=createSlice({
 name:'counter',initialState:{value:0},
 reducers:{increment(state){state.value+=1}}
});</code></pre><p>slice 안의 직접 수정처럼 보이는 코드는 Immer가 immutable update로 바꾼다. component는 reducer를 직접 부르지 않고 action을 dispatch하며, store가 바뀌면 해당 값을 selector로 읽는 component가 다시 렌더링된다.</p>`);

  add("react",8,`<h2>컴포넌트에서 HTTP 세부사항을 분리한다</h2><pre data-lang="JavaScript"><code>// api/axios.js
export const api=axios.create({baseURL:'/api',timeout:10000});

// api/todoApi.js
export const todoApi={
 list:async()=&gt;(await api.get('/todos')).data,
 create:async(body)=&gt;(await api.post('/todos',body)).data
};</code></pre><p>컴포넌트마다 base URL·header·응답 꺼내기를 반복하지 않는다. 공통 instance는 timeout과 interceptor를, domain API 파일은 endpoint와 request·response 모양을 담당한다.</p><h3>Vite Proxy가 바꾸는 실제 요청 경로</h3><p>개발 중 browser는 Vite의 <code>/api/todos</code>로 요청하고 Vite가 Spring 주소로 전달한다. proxy는 개발 server 기능이라 production build에는 없다. 운영에서는 reverse proxy 또는 환경별 API URL을 준비한다. 설정을 바꾼 뒤 Vite server 재시작, 요청 path의 <code>/api</code>, Spring 실행 여부를 차례로 확인한다.</p>`);

  add("security",0,`<h2>인증과 인가를 요청 순서로 구분한다</h2><p>인증은 이 요청을 보낸 사람이 누구인지 확인하는 일이고, 인가는 확인된 사용자가 해당 URL과 resource를 사용할 수 있는지 판단하는 일이다. 로그인은 인증 수단을 발급하는 과정이며 이후 요청마다 다시 신원을 복원해야 한다.</p><table><tr><th>세션</th><th>JWT</th></tr><tr><td>server가 로그인 상태 저장</td><td>서명된 token에 claim 저장</td></tr><tr><td>client는 session id cookie 전송</td><td>client는 token 전송</td></tr><tr><td>즉시 만료 관리가 비교적 쉬움</td><td>분산 server에서 검증이 편하지만 폐기 전략 필요</td></tr></table><p>JWT가 암호화된 비밀 상자는 아니다. header와 payload는 읽을 수 있고 signature가 위·변조 여부를 보장한다. 비밀번호나 민감 정보를 payload에 넣지 않는다.</p>`);

  add("security",1,`<h2>Security Filter Chain은 URL 앞의 검문 순서다</h2><div class="concept-flow"><span>Request</span><i>→</i><span>JWT Filter</span><i>→</i><span>Authentication</span><i>→</i><span>Authorization</span><i>→</i><span>Controller</span></div><p>SecurityConfig는 어떤 URL을 공개하고 어떤 URL에 role이 필요한지, session·CSRF·CORS를 어떻게 처리할지, custom filter를 어느 위치에 넣을지 정한다. Filter는 Controller보다 먼저 실행된다.</p><p>JWT 검증이 성공하면 사용자와 권한을 담은 Authentication을 SecurityContext에 저장한다. 이후 인가 단계와 Controller의 Principal이 같은 정보를 사용한다. token을 검사했지만 context에 넣지 않으면 여전히 anonymous로 처리된다.</p>`);

  add("security",2,`<h2>회원가입에서 password는 저장 전에 단방향 변환한다</h2><p>Controller는 Join DTO를 받고, Service가 email 중복과 업무 규칙을 검사하며, PasswordEncoder가 password hash를 만든 뒤 Entity에 저장한다. 평문과 hash를 log에 남기지 않는다.</p><pre data-lang="Java"><code>if(memberRepository.existsByEmail(req.email()))
  throw new DuplicateEmailException();
String encoded=passwordEncoder.encode(req.password());
memberRepository.save(Member.create(req.email(),encoded,Role.USER));</code></pre><p>BCrypt 결과는 같은 password도 매번 다를 수 있으므로 문자열 동등 비교를 하지 않고 <code>matches(raw,encoded)</code>를 사용한다. 응답 DTO에는 password field 자체를 포함하지 않는다.</p>`);

  add("security",3,`<h2>로그인은 사용자 조회와 비밀번호 검증 뒤 token을 만든다</h2><ol><li>email과 password를 Login DTO로 받는다.</li><li>UserDetailsService 또는 Service가 사용자를 조회한다.</li><li>PasswordEncoder가 평문 입력과 저장 hash를 비교한다.</li><li>성공하면 Authentication이 만들어진다.</li><li>사용자 ID·role·만료 시각을 claim으로 Access Token을 발급한다.</li></ol><p>사용자가 없을 때와 password가 틀렸을 때 외부 메시지를 지나치게 다르게 주면 가입 여부를 추측할 수 있다. 내부 log는 원인을 구분하되 client 응답 정책은 보안을 고려한다.</p>`);

  add("security",4,`<h2>JWT Filter는 다섯 단계만 정확히 지킨다</h2><ol><li>Authorization header에서 Bearer token을 찾는다.</li><li>없으면 공개 URL일 수 있으므로 다음 filter로 보낸다.</li><li>서명·형식·만료를 검증한다.</li><li>subject와 role을 읽어 Authentication을 만든다.</li><li>SecurityContext에 저장하고 chain을 계속한다.</li></ol><p>Filter에서 로그인 페이지로 이동시키는 SSR 방식과 REST API의 401 JSON 응답을 섞지 않는다. 이미 context에 인증이 있다면 중복 설정하지 않고, 잘못된 token의 예외는 공통 entry point에서 일관된 응답으로 바꾼다.</p>`);

  add("security",5,`<h2>Access와 Refresh는 수명과 노출 범위가 다르다</h2><p>Access Token은 API 요청마다 사용하므로 짧게 만료시키고, Refresh Token은 새 Access Token을 받을 때만 사용한다. Refresh를 DB나 Redis에 저장하면 logout·탈취 시 폐기할 수 있고 rotation으로 한 번 사용한 token을 교체할 수 있다.</p><div class="concept-flow"><span>Access 만료</span><i>→</i><span>Refresh 검증</span><i>→</i><span>저장값 비교</span><i>→</i><span>새 token 발급</span></div><p>Refresh가 유효하다고 무조건 발급하지 말고 사용자 상태와 token 식별자도 확인한다. 재발급 실패 시 client는 무한 반복하지 않고 로그인 만료 상태로 전환한다.</p>`);

  add("security",6,`<h2>401·403·CORS·CSRF를 한 오류로 부르지 않는다</h2><table><tr><th>현상</th><th>의미</th></tr><tr><td>401</td><td>인증 정보 없음·위조·만료</td></tr><tr><td>403</td><td>인증됐지만 필요한 권한 없음</td></tr><tr><td>CORS 차단</td><td>browser가 다른 origin 응답 사용을 제한</td></tr><tr><td>CSRF</td><td>browser가 자동 전송하는 인증 정보를 악용한 요청 위조</td></tr></table><p>Authorization header 기반 stateless API와 cookie 기반 인증은 CSRF 위험과 설정이 다르다. CORS에서 credentials를 허용하면 origin을 wildcard로 둘 수 없고, preflight OPTIONS가 Security에서 막히지 않게 한다.</p>`);

  add("security",7,`<h2>정상 로그인 하나로 보안 구현을 완료하지 않는다</h2><ol><li>token 없이 공개·보호 URL을 각각 호출한다.</li><li>정상 token과 위조 signature token을 비교한다.</li><li>만료 token이 401인지 확인한다.</li><li>USER token으로 ADMIN URL을 호출해 403을 확인한다.</li><li>가입 중복과 잘못된 password 응답을 확인한다.</li><li>Refresh 재발급·rotation·logout 후 재사용을 시험한다.</li></ol><p>Postman에서는 요청 header와 상태를 확인하고, browser에서는 Network의 preflight와 실제 요청을 따로 본다. log에는 요청 ID와 실패 유형을 남기되 token 전체를 출력하지 않는다.</p><blockquote><strong>완료 기준:</strong> SecurityConfig·로그인 filter·JWT filter·JwtUtil·UserDetailsService가 각각 어느 단계에 필요한지 빈 종이에 흐름으로 그릴 수 있어야 한다.</blockquote>`);
})();
