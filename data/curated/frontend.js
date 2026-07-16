(function(){
  const category=(slug)=>window.CURATED_STUDY.find((item)=>item.slug===slug);
  const replace=(slug,index,body)=>{category(slug).lessons[index].body=body;};

  replace("html-css",0,`<h2>웹 페이지를 공부할 때 가장 먼저 잡아야 할 그림</h2>
<p>웹 페이지는 HTML 파일을 더블클릭해서 보는 화면만을 뜻하지 않는다. 실제 서비스에서는 브라우저가 서버에 주소를 요청하고, 서버가 HTML·CSS·JavaScript·이미지 같은 자원을 응답한다. 브라우저는 받은 파일을 해석해 사용자가 보는 화면을 만든다. 이 요청과 응답의 관계를 먼저 이해하면 이후에 배우는 Servlet, Spring, React, REST API도 하나의 흐름으로 연결된다.</p>
<div class="concept-flow"><span>브라우저가 URL 요청</span><i>→</i><span>서버가 자원 응답</span><i>→</i><span>HTML 해석</span><i>→</i><span>CSS 적용</span><i>→</i><span>화면 렌더링</span></div>
<h2>HTML·CSS·JavaScript는 무엇을 나누어 맡을까?</h2>
<table><tr><th>기술</th><th>질문</th><th>담당하는 역할</th></tr><tr><td>HTML</td><td>무엇이 있는가?</td><td>제목, 문단, 이미지, 입력창처럼 내용의 의미와 구조를 정의한다.</td></tr><tr><td>CSS</td><td>어떻게 보이는가?</td><td>색상, 글꼴, 크기, 간격, 정렬과 반응형 배치를 결정한다.</td></tr><tr><td>JavaScript</td><td>어떻게 동작하는가?</td><td>클릭과 입력에 반응하고 데이터를 바꾸며 서버와 통신한다.</td></tr></table>
<p>세 기술은 완전히 분리된 것이 아니라 같은 문서를 서로 다른 관점에서 다룬다. JavaScript가 요소를 찾으려면 HTML 구조가 명확해야 하고, CSS가 안정적으로 적용되려면 재사용 가능한 class 이름이 필요하다.</p>
<h2>브라우저 내부의 렌더링 과정</h2>
<ol><li>HTML을 위에서 아래로 읽어 DOM 트리를 만든다.</li><li>CSS를 읽어 CSSOM을 만든다.</li><li>DOM과 CSSOM을 조합해 실제로 그릴 요소를 결정한다.</li><li>각 요소의 크기와 위치를 계산하는 Layout을 수행한다.</li><li>픽셀을 화면에 그리는 Paint와 Composite 과정을 거친다.</li></ol>
<p>JavaScript로 요소의 크기를 계속 바꾸면 Layout이 반복될 수 있다. 그래서 애니메이션은 가능한 한 <code>transform</code>과 <code>opacity</code>를 활용하고, DOM 변경은 묶어서 처리하는 것이 좋다.</p>
<h2>경로를 이해해야 자원이 정상적으로 연결된다</h2>
<pre data-lang="HTML"><code>&lt;link rel="stylesheet" href="./css/style.css" /&gt;
&lt;img src="../images/profile.png" alt="프로필 사진" /&gt;
&lt;script src="./js/app.js" defer&gt;&lt;/script&gt;</code></pre>
<ul><li><code>./</code>: 현재 파일이 있는 폴더</li><li><code>../</code>: 한 단계 상위 폴더</li><li><code>/</code>로 시작하는 경로: 사이트의 루트를 기준으로 하는 경로</li></ul>
<div class="note-warning"><strong>혼자 확인해 보기</strong><p>개발자 도구의 Network 탭에서 HTML, CSS, JS가 각각 어떤 요청으로 내려오는지 확인해 보자. 404가 발생한다면 코드를 고치기 전에 요청 URL과 실제 파일 위치부터 비교한다.</p></div>`);

  replace("html-css",1,`<h2>HTML은 화면 모양이 아니라 정보의 의미를 기록한다</h2>
<p>HTML 요소를 고를 때는 기본 디자인보다 콘텐츠의 역할을 기준으로 판단한다. 큰 글씨가 필요하다고 무조건 <code>h1</code>을 쓰는 것이 아니라 문서의 대표 제목일 때 h1을 사용한다. 모양은 CSS로 바꿀 수 있지만 잘못된 의미 구조는 검색 엔진과 스크린 리더가 바로잡아 주지 못한다.</p>
<h2>문서의 기본 골격</h2><pre data-lang="HTML"><code>&lt;!doctype html&gt;
&lt;html lang="ko"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1" /&gt;
    &lt;title&gt;학습 노트&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;header&gt;사이트 머리말&lt;/header&gt;
    &lt;nav&gt;주요 메뉴&lt;/nav&gt;
    &lt;main&gt;
      &lt;article&gt;독립적으로 읽을 수 있는 글&lt;/article&gt;
    &lt;/main&gt;
    &lt;footer&gt;사이트 바닥글&lt;/footer&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<h2>블록 요소와 인라인 요소</h2><p>블록 요소는 일반적으로 새로운 줄에서 시작하고 사용 가능한 가로 영역을 차지한다. 인라인 요소는 문장 흐름 안에서 콘텐츠 크기만큼 배치된다. 하지만 CSS의 <code>display</code>로 표현 방식은 바꿀 수 있으므로 “div는 무조건 한 줄, span은 무조건 작다”처럼 외우기보다 기본 표시 방식과 의미를 나누어 이해한다.</p>
<h2>자주 사용하는 의미 요소</h2><table><tr><th>요소</th><th>사용 기준</th></tr><tr><td><code>section</code></td><td>하나의 주제로 묶이며 보통 제목을 가진 영역</td></tr><tr><td><code>article</code></td><td>게시글처럼 독립적으로 배포하거나 읽을 수 있는 콘텐츠</td></tr><tr><td><code>nav</code></td><td>페이지의 주요 이동 링크 묶음</td></tr><tr><td><code>button</code></td><td>현재 화면에서 동작을 실행</td></tr><tr><td><code>a</code></td><td>다른 주소나 위치로 이동</td></tr></table>
<div class="note-warning"><strong>접근성에서 자주 놓치는 부분</strong><p>이미지의 alt는 파일명이 아니라 이미지가 전달하는 의미를 적는다. 장식 이미지는 빈 alt를 사용한다. 입력 요소는 placeholder만 두지 말고 label과 연결한다. 클릭 동작에 div를 사용하지 말고 button을 사용한다.</p></div>`);

  replace("html-css",2,`<h2>폼은 사용자 입력을 서버가 이해할 데이터로 묶는다</h2>
<p><code>form</code>은 입력 요소를 하나의 제출 단위로 묶는다. 사용자가 보는 입력창만 만드는 것이 아니라 어떤 주소로, 어떤 HTTP 방식으로, 어떤 이름의 값을 보낼지 정의한다. 화면에 값이 보이더라도 <code>name</code>이 없으면 일반적인 폼 제출 데이터에 포함되지 않는다.</p>
<pre data-lang="HTML"><code>&lt;form action="/members" method="post"&gt;
  &lt;label for="member-id"&gt;아이디&lt;/label&gt;
  &lt;input id="member-id" name="memberId" type="text" required /&gt;

  &lt;fieldset&gt;
    &lt;legend&gt;관심 분야&lt;/legend&gt;
    &lt;label&gt;&lt;input type="checkbox" name="interest" value="java" /&gt; Java&lt;/label&gt;
    &lt;label&gt;&lt;input type="checkbox" name="interest" value="react" /&gt; React&lt;/label&gt;
  &lt;/fieldset&gt;
  &lt;button type="submit"&gt;가입하기&lt;/button&gt;
&lt;/form&gt;</code></pre>
<h2>id·name·value·label을 구분하는 기준</h2>
<table><tr><th>항목</th><th>누가 사용하는가?</th><th>역할</th></tr><tr><td>id</td><td>브라우저·CSS·JavaScript</td><td>문서 안의 특정 요소를 식별한다.</td></tr><tr><td>name</td><td>서버</td><td>전송 데이터의 key가 된다.</td></tr><tr><td>value</td><td>서버</td><td>선택되거나 입력되어 전송되는 실제 값이다.</td></tr><tr><td>label</td><td>사용자·보조 기술</td><td>입력 목적을 설명하고 클릭 영역을 넓힌다.</td></tr></table>
<p>radio는 같은 <code>name</code>을 사용해야 하나의 그룹에서 하나만 선택된다. checkbox는 같은 name으로 여러 값을 보낼 수 있다. label의 <code>for</code>와 input의 id가 같아야 연결된다.</p>
<h2>입력 타입과 검증</h2>
<p><code>email</code>, <code>number</code>, <code>date</code>, <code>file</code>처럼 목적에 맞는 타입을 사용하면 모바일 키보드와 기본 검증의 도움을 받을 수 있다. <code>required</code>, <code>minlength</code>, <code>pattern</code>은 사용자 실수를 빠르게 알려주지만 보안 검증은 아니다. 브라우저 검증은 우회할 수 있으므로 서버가 같은 규칙을 다시 검사해야 한다.</p>
<h2>GET·POST와 파일 전송</h2>
<ul><li>GET: 조회 조건이 URL query string에 포함된다. 검색·필터처럼 다시 열거나 공유할 수 있는 요청에 적합하다.</li><li>POST: 요청 body에 데이터를 담아 서버 상태를 생성·변경할 때 사용한다.</li><li>파일 포함: <code>method="post"</code>와 <code>enctype="multipart/form-data"</code>가 필요하다.</li></ul>
<div class="note-warning"><strong>자주 하는 오해</strong><p>POST는 주소창에 값이 보이지 않을 뿐 자동 암호화가 아니다. 로그인과 개인정보 전송은 반드시 HTTPS를 사용해야 한다.</p></div>`);

  replace("html-css",3,`<h2>CSS가 적용되는 과정은 ‘선택 → 충돌 해결 → 상속 → 계산’이다</h2>
<p>브라우저는 선택자와 일치하는 모든 규칙을 모은 뒤 중요도, 명시도, 작성 순서를 비교해 최종 값을 정한다. CSS가 예상과 다를 때 속성을 계속 덧붙이기보다 개발자 도구의 Computed와 Styles 영역에서 어떤 규칙이 이겼는지 확인하는 습관이 중요하다.</p>
<h2>선택자를 관계로 이해하기</h2>
<pre data-lang="CSS"><code>/* card의 직계 자식인 title */
.card &gt; .title { color: #25407a; }

/* card 안 어디에 있든 link */
.card .link { text-decoration: none; }

/* button 바로 다음에 오는 p */
button + p { margin-top: 8px; }

/* disabled가 아닌 버튼 */
button:not(:disabled) { cursor: pointer; }</code></pre>
<table><tr><th>선택자</th><th>의미</th></tr><tr><td><code>A B</code></td><td>A의 모든 후손 B</td></tr><tr><td><code>A &gt; B</code></td><td>A의 직계 자식 B</td></tr><tr><td><code>A + B</code></td><td>A 바로 다음 형제 B</td></tr><tr><td><code>A ~ B</code></td><td>A 뒤에 나오는 같은 부모의 B</td></tr></table>
<h2>상태 선택자와 구조 선택자</h2>
<p><code>:hover</code>, <code>:focus-visible</code>, <code>:checked</code>, <code>:disabled</code>는 요소의 상태를 선택한다. <code>:first-child</code>, <code>:last-child</code>, <code>:nth-child()</code>는 형제 중 위치를 기준으로 선택한다. <code>nth-child(2n)</code>은 짝수 번째, <code>2n+1</code>은 홀수 번째다.</p>
<h2>명시도와 상속</h2>
<p>대체로 id, class·속성·가상 클래스, 태그 순으로 명시도가 높다. 동일하면 나중 규칙이 이긴다. color와 font 계열은 자식에게 상속되는 경우가 많지만 width, margin, border는 상속되지 않는다. <code>inherit</code>, <code>initial</code>, <code>unset</code>으로 동작을 명시할 수 있다.</p>
<div class="note-warning"><strong>유지보수 원칙</strong><p>id와 긴 후손 선택자를 남발하면 덮어쓰기 경쟁이 생긴다. 재사용할 스타일은 class 중심으로 짧게 작성하고, <code>!important</code>는 외부 스타일을 제한적으로 재정의하는 상황 외에는 피한다.</p></div>`);

  replace("html-css",4,`<h2>박스 모델을 이해해야 크기와 간격을 예측할 수 있다</h2>
<p>모든 요소는 content, padding, border, margin으로 이루어진 사각형이다. 기본 <code>content-box</code>에서 width는 content만 뜻하므로 padding과 border만큼 실제 크기가 커진다. 프로젝트 시작 시 전체 요소에 <code>border-box</code>를 적용하면 지정한 width 안에 padding과 border가 포함되어 계산이 단순해진다.</p>
<pre data-lang="CSS"><code>*, *::before, *::after { box-sizing: border-box; }

.card {
  width: 320px;
  padding: 24px;
  border: 1px solid #dedbe1;
  margin-block: 16px;
}</code></pre>
<h2>margin과 padding을 고르는 기준</h2><p>padding은 요소의 배경과 클릭 영역 안쪽 간격이고, margin은 다른 요소와의 바깥 간격이다. 세로 margin은 상황에 따라 collapse될 수 있으므로 목록 간격은 부모의 <code>gap</code>을 활용하면 더 예측하기 쉽다.</p>
<h2>Flex의 축부터 결정한다</h2>
<pre data-lang="CSS"><code>.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}</code></pre>
<p><code>flex-direction</code>이 row이면 가로가 주축, 세로가 교차축이다. <code>justify-content</code>는 주축, <code>align-items</code>는 교차축을 정렬한다. 이 기준을 놓치면 속성을 바꾸어 보며 맞추게 된다.</p>
<h2>아이템 크기: grow·shrink·basis</h2>
<p><code>flex: 1 1 240px</code>은 기본 크기 240px에서 남는 공간은 늘어나고 부족하면 줄어들 수 있다는 뜻이다. 텍스트가 긴 flex item이 줄어들지 않을 때는 <code>min-width: 0</code>이 필요한 경우가 있다. 줄바꿈이 필요하면 부모에 <code>flex-wrap: wrap</code>을 준다.</p>
<div class="note-warning"><strong>Flex가 적합한 경우</strong><p>내비게이션, 툴바, 버튼 묶음처럼 한 방향의 정렬 관계가 중요할 때 사용한다. 행과 열을 동시에 맞춰야 하는 카드 목록이나 전체 페이지 구조는 Grid가 더 자연스럽다.</p></div>`);

  replace("html-css",5,`<h2>Grid는 행과 열을 동시에 설계한다</h2>
<p>Flex가 콘텐츠 흐름을 따라 한 축으로 배치한다면 Grid는 먼저 열과 행의 트랙을 정의하고 요소를 그 격자에 놓는다. 대시보드, 카드 목록, 사이드바가 있는 전체 레이아웃처럼 2차원 관계가 중요할 때 적합하다.</p>
<pre data-lang="CSS"><code>.layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 32px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}</code></pre>
<h2>fr·minmax·repeat 이해하기</h2><ul><li><code>fr</code>: 고정 크기와 gap을 제외한 남은 공간의 비율</li><li><code>minmax(240px, 1fr)</code>: 최소 240px을 지키면서 남은 공간까지 확장</li><li><code>repeat(3, 1fr)</code>: 동일한 열을 반복</li><li><code>auto-fit</code>: 들어갈 수 있는 열을 만들고 빈 트랙은 접음</li></ul>
<h2>명시적 배치와 암시적 배치</h2><p><code>grid-column: 1 / 3</code>처럼 선 번호로 영역을 지정할 수 있고, <code>grid-template-areas</code>로 이름을 붙일 수도 있다. 위치를 지정하지 않은 요소는 auto-placement 규칙에 따라 빈 칸에 배치된다. 콘텐츠 수가 변하는 목록은 자동 배치를 활용하는 편이 유지보수에 좋다.</p>
<h2>반응형 레이아웃을 만드는 순서</h2><ol><li>작은 화면에서 읽히는 단일 열 구조부터 만든다.</li><li>콘텐츠가 넓어질 수 있는 최대 폭을 제한한다.</li><li><code>min()</code>, <code>max()</code>, <code>clamp()</code>와 유연 단위를 먼저 활용한다.</li><li>실제로 내용이 깨지는 지점에만 미디어 쿼리를 추가한다.</li></ol>
<pre data-lang="CSS"><code>.page { width: min(1180px, calc(100% - 32px)); margin-inline: auto; }
.title { font-size: clamp(28px, 5vw, 56px); }

@media (max-width: 720px) {
  .layout { grid-template-columns: 1fr; }
}</code></pre>
<blockquote><strong>선택 기준:</strong> 한 줄의 정렬은 Flex, 행과 열의 관계는 Grid를 먼저 고려한다. 둘은 경쟁 기술이 아니라 한 화면 안에서 함께 사용하는 도구다.</blockquote>`);

  replace("javascript",0,`<h2>JavaScript는 값의 타입을 실행 중에 판단한다</h2><p>변수에 타입을 선언하지 않지만 값에는 타입이 있다. 원시값은 string, number, boolean, bigint, symbol, undefined, null이며 객체·배열·함수는 참조형이다. <code>const</code>는 변수 재할당을 막을 뿐 객체 내부 변경까지 막지는 않는다.</p><pre data-lang="JavaScript"><code>const member = { name: "AHJ", skills: ["Java"] };
member.skills.push("React"); // 가능
// member = {};             // 재할당은 불가능</code></pre>
<h2>변수와 비교 규칙</h2><p>기본은 const, 재할당이 필요하면 let을 사용한다. var는 함수 스코프와 호이스팅 방식 때문에 현대 코드에서는 피한다. <code>===</code>는 타입 변환 없이 비교하지만 <code>==</code>는 암묵적으로 타입을 바꾸므로 예상하지 못한 결과를 만들 수 있다.</p><table><tr><th>표현</th><th>결과</th><th>이유</th></tr><tr><td><code>0 == "0"</code></td><td>true</td><td>문자열을 숫자로 변환</td></tr><tr><td><code>0 === "0"</code></td><td>false</td><td>타입이 다름</td></tr><tr><td><code>null == undefined</code></td><td>true</td><td>느슨한 비교의 예외 규칙</td></tr></table>
<h2>함수는 값처럼 다룰 수 있다</h2><p>함수를 변수에 저장하고 인자로 전달하며 반환할 수 있다. 다른 함수에 전달되어 나중에 실행되는 함수를 callback이라고 한다. 화살표 함수는 간결하지만 자체 <code>this</code>와 arguments를 만들지 않는다는 차이가 있다.</p><pre data-lang="JavaScript"><code>const toName = ({ name }) =&gt; name;
const activeNames = members
  .filter((member) =&gt; member.active)
  .map(toName);</code></pre>
<h2>배열과 객체를 변경하지 않고 갱신하기</h2><pre data-lang="JavaScript"><code>const added = [...members, newMember];
const edited = members.map((m) =&gt;
  m.id === targetId ? { ...m, name: nextName } : m
);
const removed = members.filter((m) =&gt; m.id !== targetId);</code></pre><p>이 패턴은 React 상태 관리에서도 중요하다. 새 배열과 새 객체를 만들면 변경 전후를 참조값으로 구분할 수 있다.</p>
<div class="note-warning"><strong>확인할 부분</strong><p><code>typeof null</code>은 역사적인 이유로 object를 반환한다. 배열 확인은 <code>Array.isArray()</code>, 값이 없는지 명확히 확인할 때는 의도에 따라 null과 undefined를 구분한다.</p></div>`);

  replace("javascript",1,`<h2>DOM은 HTML을 JavaScript에서 다룰 수 있게 만든 객체 트리다</h2><p>브라우저는 HTML을 읽어 Document 아래에 요소 객체를 연결한다. JavaScript는 selector로 요소를 찾고 속성·class·text를 변경하거나 새 노드를 추가한다.</p><pre data-lang="JavaScript"><code>const list = document.querySelector(".member-list");
const item = document.createElement("li");
item.className = "member-item";
item.textContent = member.name;
list.append(item);</code></pre>
<h2>문자열 HTML과 DOM API의 차이</h2><p><code>innerHTML</code>은 문자열을 다시 HTML로 파싱하므로 편리하지만 사용자 입력을 그대로 넣으면 XSS 위험이 있다. 단순 텍스트는 <code>textContent</code>를 사용한다. 반복 요소를 많이 추가할 때는 DocumentFragment나 한 번의 렌더링으로 변경 횟수를 줄인다.</p>
<h2>이벤트는 발생 → 전파 → 처리 순서로 이해한다</h2><p>이벤트는 Window에서 대상까지 내려가는 capture, 대상에서 처리되는 target, 다시 올라오는 bubble 단계를 거친다. 대부분의 이벤트는 bubble되므로 목록의 각 버튼 대신 부모 하나에서 처리하는 이벤트 위임을 사용할 수 있다.</p><pre data-lang="JavaScript"><code>list.addEventListener("click", (event) =&gt; {
  const button = event.target.closest("[data-member-id]");
  if (!button || !list.contains(button)) return;
  removeMember(Number(button.dataset.memberId));
});</code></pre>
<h2>target과 currentTarget</h2><ul><li><code>event.target</code>: 실제 클릭이 시작된 가장 안쪽 요소</li><li><code>event.currentTarget</code>: 현재 이벤트 처리기가 등록된 요소</li><li><code>preventDefault()</code>: 링크 이동·폼 제출 같은 기본 동작 취소</li><li><code>stopPropagation()</code>: 상위 요소로의 전파 중단</li></ul>
<h2>폼 이벤트와 검증 흐름</h2><p>폼의 submit 이벤트 한 곳에서 값을 모으고 검증한다. 버튼 click만 감시하면 Enter 제출을 놓칠 수 있다. 오류는 입력 요소와 가까운 곳에 보여주고, 성공 후에만 화면 상태를 갱신한다.</p><div class="note-warning"><strong>접근성</strong><p>키보드 사용자를 위해 기본 button과 input을 유지하고 focus outline을 무조건 제거하지 않는다. 커스텀 동작은 Enter·Space와 스크린 리더 안내까지 고려한다.</p></div>`);

  replace("javascript",2,`<h2>localStorage는 브라우저에 남는 문자열 저장소다</h2><p>도메인별로 데이터를 저장하며 브라우저를 닫아도 유지된다. 저장과 조회가 동기식이므로 큰 데이터를 반복해서 처리하면 화면을 막을 수 있다. 서버와 공유되지 않고 사용자가 직접 수정·삭제할 수 있으므로 중요한 원본 DB처럼 사용하면 안 된다.</p><pre data-lang="JavaScript"><code>const STORAGE_KEY = "study.todos";

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}</code></pre>
<h2>JSON은 전송 가능한 텍스트 형식이다</h2><p><code>JSON.stringify</code>는 객체를 문자열로 직렬화하고 <code>JSON.parse</code>는 문자열을 JavaScript 값으로 역직렬화한다. 함수, undefined, 순환 참조는 일반 JSON으로 표현할 수 없고 Date는 문자열이 되므로 복원 규칙이 필요하다.</p>
<h2>CRUD를 하나의 상태 흐름으로 본다</h2><ol><li>저장소에서 현재 배열을 읽는다.</li><li>Create·Update·Delete 규칙으로 새 배열을 만든다.</li><li>새 배열을 저장한다.</li><li>저장된 상태를 기준으로 화면을 다시 그린다.</li></ol><pre data-lang="JavaScript"><code>function updateTodo(id, patch) {
  const next = loadTodos().map((todo) =&gt;
    todo.id === id ? { ...todo, ...patch } : todo
  );
  saveTodos(next);
  renderTodos(next);
}</code></pre>
<h2>여러 페이지에서 선택 상태 전달하기</h2><p>목록에서 상세 페이지로 이동할 때 선택 번호만 localStorage에 따로 저장할 수도 있지만 URL query 또는 path parameter로 표현하는 편이 새로고침·공유·뒤로 가기에 자연스럽다. localStorage는 임시 학습 프로젝트에 적합한 선택이고 실제 서비스 데이터는 서버 API가 기준이 된다.</p>
<div class="note-warning"><strong>저장하면 안 되는 것</strong><p>비밀번호, Access Token, 개인정보를 localStorage에 저장하지 않는다. 같은 출처에서 실행된 JavaScript가 읽을 수 있어 XSS가 발생하면 탈취될 수 있다.</p></div>`);

  replace("javascript",3,`<h2>비동기가 필요한 이유</h2><p>서버 통신과 파일 읽기는 시간이 걸린다. 결과를 기다리는 동안 JavaScript 실행 전체가 멈추면 클릭과 화면 갱신도 멈춘다. 브라우저는 작업을 외부에 맡기고 완료 결과를 task queue에 넣으며 event loop가 call stack이 비었을 때 callback을 실행한다.</p>
<h2>Promise는 미래 결과의 상태를 표현한다</h2><p>Promise는 pending에서 fulfilled 또는 rejected로 한 번만 바뀐다. <code>then</code>은 성공 값을, <code>catch</code>는 실패를 처리한다. async 함수는 항상 Promise를 반환하고 await은 해당 async 함수 안에서 결과가 결정될 때까지 다음 줄 실행을 미룬다.</p><pre data-lang="JavaScript"><code>async function fetchMembers(signal) {
  const response = await fetch("/api/members", { signal });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "HTTP " + response.status);
  }
  return response.json();
}</code></pre>
<h2>fetch에서 await이 두 번 등장하는 이유</h2><p>첫 번째 await은 응답 헤더가 도착할 때까지 기다려 Response를 얻는다. <code>response.json()</code>도 body stream을 읽고 파싱하는 비동기 작업이므로 두 번째 await이 필요하다. fetch는 404·500 응답에서 reject되지 않기 때문에 <code>response.ok</code>를 직접 검사해야 한다.</p>
<h2>여러 요청과 취소</h2><ul><li>서로 독립된 요청은 <code>Promise.all</code>로 동시에 처리한다.</li><li>검색어가 바뀌어 이전 요청이 필요 없어지면 AbortController로 취소한다.</li><li>버튼 연속 클릭은 disabled, loading 상태 또는 debounce로 중복 요청을 막는다.</li><li>finally에서 loading 상태를 원래대로 되돌린다.</li></ul>
<h2>오류를 사용자 관점에서 분리한다</h2><p>네트워크 단절, 인증 만료, 잘못된 입력, 서버 오류는 사용자의 다음 행동이 다르다. catch 하나에서 모두 “오류”라고 표시하지 말고 상태 코드와 오류 형식에 따라 다시 로그인, 입력 수정, 재시도 안내를 제공한다.</p><blockquote><strong>핵심:</strong> async/await은 비동기를 동기로 바꾸는 기능이 아니다. Promise 기반 흐름을 위에서 아래로 읽기 쉽게 표현하는 문법이다.</blockquote>`);

  replace("react",0,`<h2>React가 해결하려는 문제</h2><p>화면이 복잡해지면 어떤 데이터가 바뀌었을 때 어느 DOM을 수정해야 하는지 직접 관리하기 어렵다. React는 “현재 상태라면 화면은 이렇게 보여야 한다”는 선언을 컴포넌트로 작성하게 한다. 상태가 바뀌면 컴포넌트를 다시 호출해 새로운 UI 표현을 만들고 이전 결과와 비교해 필요한 DOM만 반영한다.</p>
<h2>프로젝트의 기본 렌더링 흐름</h2><div class="concept-flow"><span>index.html의 root</span><i>→</i><span>main.jsx</span><i>→</i><span>App</span><i>→</i><span>하위 컴포넌트</span></div><pre data-lang="JSX"><code>createRoot(document.getElementById("root")).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;
);</code></pre><p>개발 환경의 StrictMode는 부수 효과 문제를 찾기 위해 일부 로직을 의도적으로 두 번 실행해 볼 수 있다. 운영에서 두 번 렌더링된다는 뜻이 아니다.</p>
<h2>JSX는 HTML 문자열이 아니다</h2><p>JSX는 JavaScript로 변환되는 문법이다. class 대신 <code>className</code>, label의 for 대신 <code>htmlFor</code>를 사용한다. JavaScript 표현식은 중괄호 안에 넣고, 컴포넌트는 하나의 부모 요소 또는 Fragment를 반환한다.</p><pre data-lang="JSX"><code>function MemberCard({ member, onSelect }) {
  return (
    &lt;article className="member-card"&gt;
      &lt;h2&gt;{member.name}&lt;/h2&gt;
      &lt;button onClick={() =&gt; onSelect(member.id)}&gt;상세 보기&lt;/button&gt;
    &lt;/article&gt;
  );
}</code></pre>
<h2>컴포넌트와 props</h2><p>컴포넌트는 UI 책임을 가진 함수이고 props는 부모가 전달하는 읽기 전용 입력이다. 자식이 props를 직접 바꾸지 않고 변경이 필요하면 부모가 전달한 callback을 호출한다. 데이터는 아래로, 이벤트는 위로 흐른다는 원칙을 지키면 상태의 주인을 찾기 쉽다.</p>
<h2>목록과 key</h2><p>목록을 map으로 렌더링할 때 key는 항목의 정체성을 나타낸다. 배열 index는 삽입·삭제·정렬 시 다른 항목에 재사용될 수 있으므로 DB id처럼 안정적이고 고유한 값을 사용한다.</p><div class="note-warning"><strong>컴포넌트 분리 기준</strong><p>파일 줄 수가 아니라 독립된 책임, 반복 사용, 별도 상태, 테스트 필요성을 기준으로 나눈다. 모든 태그를 작은 컴포넌트로 만들면 오히려 흐름을 찾기 어려워진다.</p></div>`);

  replace("react",1,`<h2>State는 렌더링 사이에 기억되는 값이다</h2><p>일반 지역 변수는 컴포넌트가 다시 호출될 때 초기화되고 값을 바꿔도 React가 알지 못한다. useState는 값을 보존하고 setter 호출을 다음 렌더링에 반영한다.</p><pre data-lang="JSX"><code>const [members, setMembers] = useState([]);

function addMember(newMember) {
  setMembers((current) =&gt; [...current, newMember]);
}</code></pre><p>다음 상태가 이전 상태에 의존하면 함수형 업데이트를 사용한다. React는 Object.is 기반으로 이전 값과 새 값을 비교하므로 객체·배열을 직접 변경한 뒤 같은 참조를 전달하면 변경을 놓칠 수 있다.</p>
<h2>렌더링은 snapshot을 읽는다</h2><p>이벤트 처리기 안의 state는 그 렌더링 시점의 값이다. setter를 호출했다고 같은 함수 안의 변수가 즉시 바뀌지는 않는다. 여러 상태 업데이트는 batching될 수 있다. 화면에 필요한 값을 기존 state에서 계산할 수 있다면 별도 state로 중복 저장하지 않는다.</p>
<h2>useEffect는 외부 시스템과 동기화한다</h2><p>API 요청, 브라우저 이벤트, timer, WebSocket처럼 React 바깥 시스템을 연결할 때 사용한다. 단순 계산이나 클릭에 따른 상태 변경을 effect로 우회하지 않는다.</p><pre data-lang="JSX"><code>useEffect(() =&gt; {
  const controller = new AbortController();
  fetchMembers(controller.signal)
    .then(setMembers)
    .catch((error) =&gt; {
      if (error.name !== "AbortError") setError(error.message);
    });
  return () =&gt; controller.abort();
}, []);</code></pre>
<p>의존성 배열에는 effect가 읽는 reactive value를 빠짐없이 넣는다. 빈 배열은 “처음 한 번만”이라는 주문이 아니라 외부 값에 의존하지 않는 effect라는 의미다. cleanup은 다음 effect 실행 전과 unmount 때 실행된다.</p>
<h2>useRef는 렌더링과 무관한 값을 보관한다</h2><p>ref의 current를 바꿔도 다시 렌더링되지 않는다. DOM focus, timer id, 이전 값, 외부 라이브러리 인스턴스 보관에 적합하다. 화면에 표시되어야 하는 값은 state를 사용한다.</p>
<h2>자주 쓰는 Hook 선택 기준</h2><table><tr><th>Hook</th><th>사용 목적</th></tr><tr><td>useState</td><td>화면에 영향을 주는 지역 상태</td></tr><tr><td>useEffect</td><td>외부 시스템 동기화</td></tr><tr><td>useRef</td><td>DOM 또는 렌더링과 무관한 가변 값</td></tr><tr><td>useMemo</td><td>비싼 계산 결과 재사용</td></tr><tr><td>useCallback</td><td>필요한 경우 함수 참조 재사용</td></tr></table>`);

  replace("react",2,`<h2>Router는 URL을 애플리케이션 상태의 일부로 만든다</h2><p>SPA에서도 사용자가 보고 있는 화면은 URL로 표현되어야 새로고침, 북마크, 뒤로 가기, 링크 공유가 자연스럽다. Route는 path와 컴포넌트를 연결하고 중첩 Route는 공통 Layout 안에 자식 화면을 렌더링한다.</p><pre data-lang="JSX"><code>&lt;Routes&gt;
  &lt;Route element={&lt;DefaultLayout /&gt;}&gt;
    &lt;Route path="/members" element={&lt;MemberListPage /&gt;} /&gt;
    &lt;Route path="/members/:memberId" element={&lt;MemberDetailPage /&gt;} /&gt;
  &lt;/Route&gt;
&lt;/Routes&gt;</code></pre><ul><li><code>Link</code>: 사용자가 누르는 선언적 이동</li><li><code>useNavigate</code>: 저장 성공 후 이동 같은 명령형 이동</li><li><code>useParams</code>: path parameter 읽기</li><li><code>useSearchParams</code>: 검색·필터·페이지 query 관리</li></ul>
<h2>API 계층을 컴포넌트에서 분리한다</h2><p>컴포넌트마다 axios 설정과 URL을 반복하면 인증·오류 처리 방식이 달라진다. 공통 인스턴스를 만들고 도메인별 API 함수로 감싼다.</p><pre data-lang="JavaScript"><code>export const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

export const memberApi = {
  findAll: () =&gt; api.get("/members").then(({ data }) =&gt; data),
  findById: (id) =&gt; api.get("/members/" + id).then(({ data }) =&gt; data),
};</code></pre><p>화면은 loading, success, empty, error 상태를 각각 표현한다. 요청이 겹칠 수 있으면 취소나 최신 요청 판별이 필요하다.</p>
<h2>상태를 어디에 둘지 결정하는 순서</h2><ol><li>한 컴포넌트만 사용하면 해당 컴포넌트의 state</li><li>가까운 형제가 함께 사용하면 공통 부모로 끌어올림</li><li>트리 여러 곳에서 안정적으로 공유하면 Context</li><li>복잡한 변경 규칙·개발 도구·미들웨어가 필요하면 Redux Toolkit</li><li>서버 데이터 캐시가 핵심이면 서버 상태 전용 도구도 고려</li></ol>
<h2>Redux Toolkit의 데이터 흐름</h2><div class="concept-flow"><span>UI dispatch</span><i>→</i><span>action</span><i>→</i><span>slice reducer</span><i>→</i><span>store 변경</span><i>→</i><span>selector 재렌더링</span></div><p>slice는 초기 상태와 reducer, action creator를 함께 만든다. Provider로 store를 연결하고 <code>useSelector</code>로 필요한 조각만 구독한다. 모든 state를 Redux에 넣지 말고 여러 화면이 공유하며 변경 흐름을 추적해야 하는 상태에 사용한다.</p>
<div class="note-warning"><strong>Vite Proxy와 CORS</strong><p>개발 중 <code>/api</code>를 백엔드 주소로 proxy하면 프론트 코드는 상대 경로를 유지할 수 있다. 설정 변경 후 개발 서버를 재시작해야 한다. Proxy는 개발 환경 편의 기능이며 운영 서버의 CORS와 reverse proxy는 별도 설정이다.</p></div>`);
})();
