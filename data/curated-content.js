/*
 * 노션 원문을 화면에서 직접 렌더링하지 않기 위한 재집필 원고.
 * 날짜별 메모를 개념의 선후 관계에 맞춰 병합·분리한 학습 자료다.
 */
window.CURATED_STUDY = [
  {
    slug: "html-css",
    title: "HTML & CSS",
    intro: "HTML로 정보의 의미와 구조를 만들고 CSS로 배치와 표현을 완성하는 과정을 순서대로 정리한다.",
    lessons: [
      {
        title: "웹 페이지가 만들어지는 방식",
        summary: "브라우저가 HTML, CSS, JavaScript를 읽고 화면을 구성하는 전체 흐름부터 이해한다.",
        body: `<h2>웹 페이지는 파일을 그대로 보여주는 것이 아니다</h2>
<p>브라우저는 서버에서 전달받은 HTML을 분석해 문서 구조를 만들고, CSS를 계산해 각 요소의 위치와 모양을 결정한다. JavaScript가 있다면 만들어진 화면에 동작과 상태 변화를 추가한다.</p>
<div class="concept-flow"><span>HTML 파싱</span><i>→</i><span>DOM 생성</span><i>→</i><span>CSS 계산</span><i>→</i><span>레이아웃</span><i>→</i><span>화면 그리기</span></div>
<h3>세 기술의 역할</h3><table><tr><th>기술</th><th>담당하는 것</th><th>예시</th></tr><tr><td>HTML</td><td>내용의 의미와 구조</td><td>제목, 문단, 목록, 폼</td></tr><tr><td>CSS</td><td>크기, 색상, 간격, 배치</td><td>Grid, Flex, 반응형 화면</td></tr><tr><td>JavaScript</td><td>사용자 동작과 데이터 변화</td><td>클릭, 검증, 서버 통신</td></tr></table>
<blockquote><strong>핵심:</strong> HTML을 작성할 때는 먼저 “어떻게 보일까?”보다 “이 내용은 어떤 의미인가?”를 생각한다.</blockquote>`
      },
      {
        title: "HTML 문서 구조와 시맨틱 태그",
        summary: "태그와 속성의 문법을 익히고, 의미에 맞는 요소를 선택하는 기준을 세운다.",
        body: `<h2>HTML의 기본 문법</h2><pre data-lang="HTML"><code>&lt;태그명 속성명="속성값"&gt;내용&lt;/태그명&gt;</code></pre>
<p>태그는 콘텐츠의 종류를 나타내고, 속성은 태그에 추가 정보를 제공한다. 예를 들어 링크의 <code>href</code>는 이동할 주소를, 이미지의 <code>alt</code>는 이미지를 볼 수 없을 때 전달할 설명을 뜻한다.</p>
<h3>문서의 기본 골격</h3><pre data-lang="HTML"><code>&lt;!doctype html&gt;
&lt;html lang="ko"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8" /&gt;
    &lt;title&gt;문서 제목&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;main&gt;핵심 콘텐츠&lt;/main&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>
<h3>시맨틱 태그를 사용하는 이유</h3><p><code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>article</code>, <code>footer</code>는 영역의 의미를 이름으로 드러낸다. 이렇게 작성하면 검색 엔진과 보조 기술이 문서를 이해하기 쉽고, 개발자도 구조를 빠르게 파악할 수 있다.</p>
<div class="note-warning"><strong>주의</strong><p>화면을 나누기 위해 모든 요소를 <code>div</code>로 만들 수는 있지만, 의미가 있는 영역에는 목적에 맞는 태그를 우선 사용한다.</p></div>`
      },
      {
        title: "폼과 사용자 입력",
        summary: "입력 요소의 역할과 서버로 전달되는 데이터의 구조를 정확히 구분한다.",
        body: `<h2>폼은 사용자 입력을 하나의 요청으로 묶는다</h2><pre data-lang="HTML"><code>&lt;form action="/members" method="post"&gt;
  &lt;label for="user-id"&gt;아이디&lt;/label&gt;
  &lt;input id="user-id" name="userId" type="text" required /&gt;
  &lt;button type="submit"&gt;가입하기&lt;/button&gt;
&lt;/form&gt;</code></pre>
<h3>헷갈리기 쉬운 네 가지</h3><table><tr><th>속성</th><th>역할</th></tr><tr><td><code>id</code></td><td>문서 안에서 요소를 식별하고 label, CSS, JavaScript와 연결한다.</td></tr><tr><td><code>name</code></td><td>서버로 전송되는 데이터의 키가 된다.</td></tr><tr><td><code>value</code></td><td>서버로 전송되는 실제 값이다.</td></tr><tr><td><code>label</code></td><td>입력 요소가 무엇인지 사용자에게 설명하고 클릭 영역을 넓힌다.</td></tr></table>
<h3>GET과 POST</h3><p>GET은 조회 조건을 URL에 표현할 때 적합하고, POST는 서버의 상태를 변경하거나 큰 데이터를 전송할 때 사용한다. POST라고 해서 데이터가 자동으로 암호화되는 것은 아니므로 민감한 정보는 반드시 HTTPS로 전송해야 한다.</p>`
      },
      {
        title: "CSS 선택자와 스타일 적용 규칙",
        summary: "선택자, 상속, 우선순위가 충돌할 때 어떤 스타일이 적용되는지 이해한다.",
        body: `<h2>CSS 규칙의 구성</h2><pre data-lang="CSS"><code>.card {
  padding: 1rem;
  color: #172239;
}</code></pre><p><code>.card</code>는 선택자, 중괄호 안의 항목은 선언이다. 선언은 속성과 값으로 구성된다.</p>
<h3>자주 사용하는 선택자</h3><ul><li><code>p</code>: 모든 p 요소</li><li><code>.notice</code>: notice 클래스를 가진 요소</li><li><code>#header</code>: header 아이디를 가진 요소</li><li><code>nav a</code>: nav 안에 있는 모든 a 요소</li><li><code>input[type="text"]</code>: type이 text인 input</li></ul>
<h3>우선순위 판단</h3><p>대체로 인라인 스타일, 아이디, 클래스·속성·가상 클래스, 태그 순서로 강하다. 우선순위가 같으면 나중에 작성한 규칙이 적용된다. 하지만 숫자를 외우는 것보다 선택자를 단순하게 유지하고 클래스 중심으로 설계하는 것이 중요하다.</p>
<div class="note-warning"><strong><code>!important</code>를 조심해야 하는 이유</strong><p>당장은 충돌을 해결하지만 이후 정상적인 우선순위로 덮기 어려워진다. 외부 라이브러리를 제한된 범위에서 재정의하는 경우가 아니라면 구조부터 점검한다.</p></div>`
      },
      {
        title: "박스 모델과 Flex 레이아웃",
        summary: "요소의 실제 크기를 계산하고 한 방향 레이아웃을 안정적으로 구성한다.",
        body: `<h2>모든 요소는 사각형 상자다</h2><p>요소의 영역은 콘텐츠, 안쪽 여백(padding), 테두리(border), 바깥 여백(margin) 순으로 구성된다. 기본 <code>content-box</code>에서는 width에 padding과 border가 더해지지만, <code>border-box</code>에서는 지정한 width 안에 모두 포함된다.</p>
<pre data-lang="CSS"><code>*, *::before, *::after { box-sizing: border-box; }</code></pre>
<h3>Flex는 한 방향 배치에 적합하다</h3><pre data-lang="CSS"><code>.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}</code></pre><p>주축은 <code>flex-direction</code>으로 결정한다. <code>justify-content</code>는 주축, <code>align-items</code>는 교차축 정렬을 담당한다. 요소 사이 간격은 개별 margin보다 <code>gap</code>을 쓰면 구조가 단순해진다.</p>`
      },
      {
        title: "Grid와 반응형 레이아웃",
        summary: "행과 열을 함께 제어하고 화면 크기에 맞춰 자연스럽게 바뀌는 구조를 만든다.",
        body: `<h2>Grid는 2차원 레이아웃 도구다</h2><pre data-lang="CSS"><code>.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}</code></pre><p><code>minmax(240px, 1fr)</code>은 카드가 최소 240px을 유지하면서 남은 공간을 나누어 갖게 한다. <code>auto-fit</code>과 조합하면 미디어 쿼리를 많이 쓰지 않아도 열 개수가 자동으로 조절된다.</p>
<h3>반응형 설계 순서</h3><ol><li>콘텐츠가 작은 화면에서도 읽히는 기본 구조를 먼저 만든다.</li><li>고정 너비 대신 <code>%</code>, <code>fr</code>, <code>min()</code>, <code>max()</code>, <code>clamp()</code>를 활용한다.</li><li>구조가 실제로 깨지는 지점에 미디어 쿼리를 추가한다.</li></ol>
<blockquote><strong>Flex와 Grid 선택:</strong> 한 줄의 정렬은 Flex, 행과 열의 관계가 중요한 전체 영역은 Grid부터 고려한다.</blockquote>`
      }
    ]
  },
  {
    slug: "java",
    title: "Java",
    intro: "문법을 따로 외우기보다 값이 저장되고 객체가 협력하며 프로그램이 실행되는 흐름으로 이해한다.",
    lessons: [
      {title:"Java 실행 구조와 변수",summary:"JDK, 컴파일, JVM의 관계와 타입에 맞게 값을 저장하는 방법을 이해한다.",body:`<h2>작성한 코드는 어떻게 실행될까?</h2><div class="concept-flow"><span>.java 소스</span><i>→ javac</i><span>.class 바이트코드</span><i>→ JVM</i><span>운영체제에서 실행</span></div><p>JDK는 컴파일러와 개발 도구를 포함하고, JVM은 컴파일된 바이트코드를 실행한다. JVM 덕분에 같은 바이트코드를 여러 운영체제에서 실행할 수 있다.</p><h3>변수와 타입</h3><p>변수는 값을 저장할 메모리 공간에 이름을 붙인 것이다. 정수는 <code>int</code>·<code>long</code>, 실수는 <code>double</code>, 논리값은 <code>boolean</code>, 한 문자는 <code>char</code>를 주로 사용한다. 문자열은 기본형이 아니라 <code>String</code> 객체다.</p><pre data-lang="Java"><code>int age = 30;
long population = 51_000_000L;
double rate = 0.85;
boolean active = true;
String name = "AHJ";</code></pre><div class="note-warning"><strong>핵심</strong><p>타입은 저장할 수 있는 값의 범위뿐 아니라 가능한 연산까지 결정한다.</p></div>`},
      {title:"연산자와 제어 흐름",summary:"조건과 반복을 조합해 프로그램의 실행 순서를 제어한다.",body:`<h2>식의 결과가 다음 실행을 결정한다</h2><p>산술·비교·논리 연산자는 값을 계산하거나 조건식을 만든다. 문자열의 내용 비교에는 <code>==</code>가 아니라 <code>equals()</code>를 사용해야 한다.</p><pre data-lang="Java"><code>if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else {
    grade = "C";
}</code></pre><h3>반복문 선택 기준</h3><ul><li>반복 횟수가 명확하면 <code>for</code></li><li>조건이 유지되는 동안 반복하면 <code>while</code></li><li>배열이나 컬렉션을 순서대로 읽으면 향상된 <code>for</code></li></ul><p><code>break</code>는 반복을 끝내고, <code>continue</code>는 현재 회차만 건너뛴다. 중첩 반복이 깊어지면 메서드 분리를 먼저 고려한다.</p>`},
      {title:"배열과 다차원 데이터",summary:"같은 타입의 여러 값을 연속된 인덱스로 관리한다.",body:`<h2>배열은 길이가 고정된 동일 타입 저장소다</h2><pre data-lang="Java"><code>int[] scores = {90, 85, 100};
for (int score : scores) {
    System.out.println(score);
}</code></pre><p>인덱스는 0부터 시작하고 마지막 인덱스는 <code>length - 1</code>이다. 존재하지 않는 위치에 접근하면 <code>ArrayIndexOutOfBoundsException</code>이 발생한다.</p><h3>다차원 배열</h3><p><code>int[][] seats</code>는 배열 안에 배열이 들어 있는 구조다. 표 형태의 데이터를 표현할 수 있지만 각 행의 길이가 다를 수도 있다. 데이터 개수가 자주 변한다면 고정 길이 배열보다 컬렉션이 적합하다.</p>`},
      {title:"클래스와 객체",summary:"데이터와 기능을 하나의 책임 단위로 묶어 현실의 개념을 코드로 모델링한다.",body:`<h2>클래스는 설계도, 객체는 실제 인스턴스다</h2><pre data-lang="Java"><code>class Member {
    private String name;

    void introduce() {
        System.out.println("안녕하세요. " + name + "입니다.");
    }
}</code></pre><p>필드는 객체의 상태, 메서드는 객체가 수행하는 행동을 나타낸다. 좋은 클래스는 단순히 데이터를 모으는 것이 아니라 자신의 상태를 올바르게 관리할 책임을 가진다.</p><h3>참조 변수</h3><p>객체 변수에는 객체 자체가 아니라 객체를 가리키는 참조값이 저장된다. 두 변수가 같은 객체를 참조하면 한쪽에서 변경한 상태가 다른 쪽에서도 보인다.</p>`},
      {title:"캡슐화·생성자·static",summary:"객체가 유효한 상태를 유지하도록 접근을 통제하고 생성 과정을 정의한다.",body:`<h2>캡슐화는 데이터를 숨기는 것에서 끝나지 않는다</h2><p>필드를 <code>private</code>으로 감추고 필요한 동작만 공개하면 외부 코드가 객체의 상태를 임의로 깨뜨리지 못한다.</p><pre data-lang="Java"><code>public Member(String name) {
    if (name == null || name.isBlank()) {
        throw new IllegalArgumentException("이름은 필수입니다.");
    }
    this.name = name;
}</code></pre><p>생성자는 객체가 만들어지는 순간 필요한 값을 받고 유효한 초기 상태를 보장한다. <code>static</code> 필드와 메서드는 특정 객체가 아니라 클래스 전체에 속한다. 모든 객체가 공유해야 하는 값이나 객체 상태와 무관한 기능에 제한적으로 사용한다.</p>`},
      {title:"상속·다형성·인터페이스",summary:"공통 규약을 중심으로 구현을 교체할 수 있는 객체지향 구조를 만든다.",body:`<h2>상속은 공통 코드를 얻기 위한 도구만은 아니다</h2><p>상속은 하위 타입이 상위 타입의 의미를 그대로 만족하는 관계에서 사용한다. 단순 코드 재사용만 필요하다면 조합이 더 안전할 수 있다.</p><h3>다형성</h3><pre data-lang="Java"><code>Payment payment = new CardPayment();
payment.pay(10_000);</code></pre><p>변수 타입을 인터페이스로 두면 호출 코드는 구체적인 결제 방식에 의존하지 않는다. 새로운 구현을 추가해도 사용하는 쪽의 변경을 줄일 수 있다.</p><h3>인터페이스의 역할</h3><p>인터페이스는 “무엇을 할 수 있어야 하는가”라는 규약을 정의한다. 구현 클래스는 “어떻게 할 것인가”를 담당한다.</p>`},
      {title:"컬렉션과 제네릭",summary:"데이터의 특성에 맞는 자료구조를 선택하고 타입 안정성을 확보한다.",body:`<h2>자료구조는 사용 목적에 따라 선택한다</h2><table><tr><th>종류</th><th>특징</th><th>적합한 상황</th></tr><tr><td>List</td><td>순서와 중복을 허용</td><td>목록, 검색 결과</td></tr><tr><td>Set</td><td>중복을 허용하지 않음</td><td>태그, 고유 값</td></tr><tr><td>Map</td><td>키와 값의 쌍</td><td>아이디로 빠르게 값 조회</td></tr></table><pre data-lang="Java"><code>List&lt;Member&gt; members = new ArrayList&lt;&gt;();
members.add(new Member("AHJ"));</code></pre><p>제네릭은 컬렉션이 다룰 타입을 컴파일 시점에 제한한다. 형변환을 줄이고 잘못된 타입이 들어오는 문제를 미리 발견할 수 있다.</p>`},
      {title:"예외 처리와 Stream",summary:"실패를 의미 있게 전달하고 데이터 처리 과정을 선언적으로 표현한다.",body:`<h2>예외는 예상하지 못한 상황을 전달하는 객체다</h2><p>복구 가능한 예외는 적절한 위치에서 처리하고, 현재 계층이 해결할 수 없다면 의미를 유지한 채 상위 계층으로 전달한다. 예외를 잡은 뒤 아무 처리도 하지 않으면 원인을 추적하기 어려워진다.</p><pre data-lang="Java"><code>try {
    return repository.findById(id);
} catch (SQLException e) {
    throw new DataAccessException("회원 조회 실패", e);
}</code></pre><h3>Stream</h3><pre data-lang="Java"><code>List&lt;String&gt; names = members.stream()
    .filter(Member::isActive)
    .map(Member::getName)
    .toList();</code></pre><p>Stream은 원본 데이터를 직접 변경하지 않고 필터링, 변환, 집계를 연결한다. 복잡한 분기나 부수 효과가 많다면 일반 반복문이 더 읽기 쉬울 수 있다.</p>`},
      {title:"스레드와 네트워크 기초",summary:"한 프로세스 안의 여러 실행 흐름과 네트워크 통신의 기본 구조를 이해한다.",body:`<h2>프로세스와 스레드</h2><p>프로세스는 실행 중인 프로그램이며 독립된 메모리 공간을 가진다. 스레드는 프로세스 안에서 코드를 실행하는 흐름으로, 같은 프로세스의 자원을 공유한다.</p><pre data-lang="Java"><code>Thread worker = new Thread(() -&gt; doWork());
worker.start();</code></pre><p><code>run()</code>을 직접 호출하면 현재 스레드에서 일반 메서드처럼 실행된다. <code>start()</code>를 호출해야 새로운 실행 흐름이 만들어지고 JVM이 그 안에서 <code>run()</code>을 실행한다.</p><h3>네트워크의 기본</h3><p>서버는 특정 포트에서 연결을 기다리고 클라이언트는 서버의 IP와 포트로 접속한다. 소켓은 두 프로그램이 데이터를 주고받는 통로다. 실제 서버 개발에서는 스레드 풀과 높은 수준의 네트워크 프레임워크를 사용해 연결을 관리한다.</p>`}
    ]
  }
];

const makeLesson = (title, summary, sections) => ({
  title,
  summary,
  body: sections.map(([heading, content]) => `<h2>${heading}</h2>${content}`).join("")
});

window.CURATED_STUDY.push(
  {slug:"git",title:"Git & GitHub",intro:"변경 이력을 안전하게 남기고 팀의 작업을 합치는 흐름을 이해한다.",lessons:[
    makeLesson("Git의 세 영역과 커밋", "파일 변경이 커밋으로 기록되는 과정을 이해한다.", [["작업 폴더에서 저장소까지","<p>Git은 작업 디렉터리, 스테이징 영역, 저장소를 구분한다. 파일을 수정한 뒤 <code>git add</code>로 이번 커밋에 포함할 변경을 고르고 <code>git commit</code>으로 하나의 의미 있는 이력을 만든다.</p><pre data-lang='Shell'><code>git status\ngit add src/app.js\ngit commit -m &quot;feat: 학습 목차 추가&quot;</code></pre>"],["좋은 커밋의 기준","<p>한 커밋에는 하나의 목적만 담고, 메시지는 무엇을 왜 바꿨는지 알 수 있게 작성한다. 비밀번호·토큰·환경 설정은 커밋 전에 <code>.gitignore</code>와 환경 변수로 분리한다.</p>"]]),
    makeLesson("브랜치와 원격 협업", "기능별 작업을 분리하고 원격 변경을 안전하게 합친다.", [["브랜치 흐름","<p>브랜치는 독립된 작업 흐름을 만든다. 최신 기준 브랜치에서 기능 브랜치를 만들고, 작은 커밋으로 작업한 뒤 검토를 거쳐 병합한다.</p><pre data-lang='Shell'><code>git switch -c feature/study-nav\ngit push -u origin feature/study-nav</code></pre>"],["fetch·pull·push","<p><code>fetch</code>는 원격 이력만 가져오고, <code>pull</code>은 가져온 뒤 현재 브랜치에 합친다. <code>push</code>는 로컬 커밋을 원격에 보낸다. 충돌이 나면 양쪽 의도를 확인해 파일을 직접 정리한 뒤 다시 커밋한다.</p>"]])
  ]},
  {slug:"sql",title:"Oracle & SQL",intro:"관계형 데이터의 구조를 설계하고 정확하게 조회·변경하는 방법을 정리한다.",lessons:[
    makeLesson("관계형 데이터와 SELECT", "테이블·행·열의 관계와 기본 조회 순서를 이해한다.", [["조회문의 실행 흐름","<p><code>SELECT</code>는 필요한 열을 고르고 <code>FROM</code>에서 대상을 정한 뒤 <code>WHERE</code>로 행을 필터링한다. NULL은 값이 없음을 뜻하므로 <code>= NULL</code>이 아니라 <code>IS NULL</code>로 비교한다.</p><pre data-lang='SQL'><code>SELECT employee_id, employee_name\nFROM employee\nWHERE department_id IN (10, 20)\nORDER BY employee_name;</code></pre>"],["정확한 조건식","<p>문자열 패턴은 <code>LIKE</code>, 범위는 <code>BETWEEN</code>, 여러 후보는 <code>IN</code>을 사용한다. AND와 OR을 함께 쓸 때는 괄호로 의도를 명확히 한다.</p>"]]),
    makeLesson("집계·GROUP BY·JOIN", "여러 행을 요약하고 분리된 테이블을 관계로 연결한다.", [["그룹 집계","<p><code>GROUP BY</code>는 같은 기준의 행을 그룹으로 묶는다. 그룹 결과 조건은 <code>WHERE</code>가 아니라 <code>HAVING</code>에서 검사한다.</p><pre data-lang='SQL'><code>SELECT department_id, COUNT(*) count, AVG(salary) avg_salary\nFROM employee\nGROUP BY department_id\nHAVING COUNT(*) &gt;= 3;</code></pre>"],["JOIN","<p>JOIN은 외래키 관계를 기준으로 테이블을 연결한다. INNER JOIN은 양쪽에 일치하는 행만, LEFT JOIN은 왼쪽 행을 모두 유지한다. 조인 조건을 빠뜨리면 행이 불필요하게 곱해지는 카테시안 곱이 생긴다.</p>"]]),
    makeLesson("서브쿼리와 데이터 변경", "다른 조회 결과를 조건으로 사용하고 트랜잭션 단위로 변경한다.", [["서브쿼리","<p>서브쿼리는 한 SQL 안에서 먼저 필요한 값을 구하는 조회다. 반환 행과 열의 개수에 따라 단일행 연산자 또는 <code>IN</code>, <code>EXISTS</code> 등을 선택한다.</p>"],["DDL·DML·트랜잭션","<p>DDL은 테이블 구조를 정의하고 DML은 데이터를 조회·추가·수정·삭제한다. 여러 변경이 하나의 업무라면 같은 트랜잭션으로 묶고 성공 시 COMMIT, 실패 시 ROLLBACK한다. 기본키·외래키·NOT NULL·UNIQUE 제약조건으로 무결성을 DB에서도 보장한다.</p>"]]),
    makeLesson("VIEW·SEQUENCE·PL/SQL", "DB 객체와 절차형 기능이 필요한 상황을 구분한다.", [["재사용 가능한 DB 객체","<p>VIEW는 복잡한 조회를 가상 테이블처럼 제공하고, SEQUENCE는 중복되지 않는 숫자를 순서대로 생성한다. VIEW를 보안 경계로 사용할 때는 노출 열과 수정 가능 여부를 확인한다.</p>"],["PL/SQL","<p>PL/SQL은 변수, 조건, 반복, 예외 처리를 SQL과 함께 실행한다. Procedure는 작업 수행, Function은 값 반환, Trigger는 특정 DB 이벤트에 자동 반응한다. 애플리케이션 로직과 DB 로직의 경계를 명확히 해야 유지보수가 쉬워진다.</p>"]])
  ]},
  {slug:"jdbc",title:"JDBC",intro:"Java 코드에서 DB 연결부터 결과 변환까지 이어지는 표준 흐름을 이해한다.",lessons:[
    makeLesson("JDBC 실행 흐름", "연결·SQL 실행·결과 처리·자원 해제 순서를 익힌다.", [["기본 절차","<div class='concept-flow'><span>Connection</span><i>→</i><span>PreparedStatement</span><i>→</i><span>execute</span><i>→</i><span>ResultSet</span></div><p><code>PreparedStatement</code>는 SQL과 값을 분리해 타입을 안전하게 바인딩하고 SQL Injection 위험을 줄인다.</p><pre data-lang='Java'><code>String sql = &quot;SELECT * FROM MEMBER WHERE NO = ?&quot;;\nPreparedStatement pstmt = conn.prepareStatement(sql);\npstmt.setLong(1, memberNo);</code></pre>"],["자원 관리","<p>Connection, Statement, ResultSet은 사용 후 반드시 닫아야 한다. try-with-resources를 사용하면 예외가 발생해도 자원을 안정적으로 정리할 수 있다.</p>"]]),
    makeLesson("Controller·Service·DAO 분리", "입력, 업무 규칙, 데이터 접근의 책임을 계층별로 나눈다.", [["각 계층의 책임","<p>Controller는 요청과 응답을 다루고, Service는 검증과 트랜잭션 같은 업무 규칙을 처리하며, DAO는 SQL 실행에 집중한다. VO/DTO는 계층 사이에서 데이터를 전달한다.</p>"],["왜 나누는가","<p>한 클래스에 입력·검증·SQL이 섞이면 변경 이유도 섞인다. 책임을 분리하면 UI나 DB가 바뀌어도 다른 계층에 미치는 영향을 줄이고 각 부분을 독립적으로 테스트할 수 있다.</p>"]]),
    makeLesson("CRUD와 트랜잭션 패턴", "조회와 변경 작업의 반환값을 올바르게 해석한다.", [["조회와 변경의 차이","<p>SELECT는 ResultSet을 객체로 매핑한다. INSERT·UPDATE·DELETE는 영향을 받은 행의 수를 반환하므로 1 이상인지 확인해 성공 여부를 판단한다.</p>"],["트랜잭션 경계","<p>하나의 업무에서 여러 SQL이 실행되면 Service가 트랜잭션 경계를 가진다. 모두 성공해야 COMMIT하고 하나라도 실패하면 ROLLBACK해 데이터가 중간 상태로 남지 않게 한다.</p>"]])
  ]},
  {slug:"javascript",title:"JavaScript",intro:"브라우저의 데이터, 화면, 이벤트, 비동기 흐름을 하나의 실행 모델로 이해한다.",lessons:[
    makeLesson("값·함수·배열·객체", "JavaScript가 데이터를 표현하고 변환하는 방식을 정리한다.", [["타입과 비교","<p><code>const</code>를 기본으로 사용하고 재할당이 필요할 때만 <code>let</code>을 쓴다. 값과 타입이 모두 같은지 확인하는 <code>===</code>를 기본 비교로 사용한다.</p>"],["데이터 가공","<p>배열의 <code>map</code>, <code>filter</code>, <code>find</code>는 원본을 직접 변경하지 않고 필요한 결과를 만든다. 객체 구조 분해와 전개 문법을 사용하면 필요한 값과 변경점을 명확히 표현할 수 있다.</p><pre data-lang='JavaScript'><code>const activeNames = members\n  .filter(({ active }) =&gt; active)\n  .map(({ name }) =&gt; name);</code></pre>"]]),
    makeLesson("DOM과 이벤트", "문서 요소를 찾고 사용자 행동에 반응하는 흐름을 이해한다.", [["DOM 조작","<p>DOM은 HTML을 객체 트리로 표현한 것이다. 요소를 선택한 뒤 속성이나 텍스트를 변경하고, 새 요소는 <code>createElement</code>로 만들어 필요한 위치에 추가한다.</p>"],["이벤트 모델","<p><code>addEventListener</code>는 한 요소에 여러 처리기를 등록할 수 있다. <code>event.target</code>은 실제 이벤트가 시작된 요소, <code>currentTarget</code>은 처리기가 등록된 요소다. 반복 목록은 부모에서 처리하는 이벤트 위임이 효율적이다.</p>"]]),
    makeLesson("JSON·localStorage·CRUD", "브라우저 저장소에 구조화된 데이터를 안전하게 보관한다.", [["문자열로 저장하기","<p>localStorage는 문자열만 저장한다. 객체나 배열은 <code>JSON.stringify</code>로 직렬화하고 읽을 때 <code>JSON.parse</code>로 복원한다.</p><pre data-lang='JavaScript'><code>localStorage.setItem(&quot;todos&quot;, JSON.stringify(todos));\nconst saved = JSON.parse(localStorage.getItem(&quot;todos&quot;) ?? &quot;[]&quot;);</code></pre>"],["CRUD 사고 흐름","<p>등록·조회·수정·삭제가 끝날 때마다 저장 데이터와 화면을 일치시킨다. localStorage는 브라우저에 노출되므로 토큰이나 비밀번호 같은 민감정보를 저장하지 않는다.</p>"]]),
    makeLesson("Promise·fetch·async/await", "시간이 걸리는 작업을 막지 않고 결과와 오류를 처리한다.", [["Promise의 의미","<p>fetch는 응답 자체가 아니라 미래 결과를 나타내는 Promise를 반환한다. <code>await</code>은 현재 async 함수의 실행만 잠시 멈추고 Promise 결과를 꺼낸다.</p><pre data-lang='JavaScript'><code>const response = await fetch(&quot;/api/members&quot;);\nif (!response.ok) throw new Error(`HTTP ${response.status}`);\nconst members = await response.json();</code></pre>"],["오류 처리","<p>네트워크 성공과 HTTP 성공은 다르다. fetch는 404나 500에서도 resolve될 수 있으므로 <code>response.ok</code>를 확인하고 try/catch에서 사용자에게 보여줄 오류를 분리한다.</p>"]])
  ]},
  {slug:"servlet-jsp",title:"Servlet & JSP",intro:"HTTP 요청이 Java 웹 서버를 거쳐 HTML 응답이 되는 과정을 계층별로 정리한다.",lessons:[
    makeLesson("Web Server·WAS·Servlet", "정적 응답과 동적 요청 처리의 차이를 이해한다.", [["서버의 역할","<p>Web Server는 파일 같은 정적 자원을 전달하고 WAS는 Java 코드 실행, 세션, DB 연동 같은 동적 처리를 담당한다. Servlet은 WAS 안에서 HTTP 요청과 응답을 다루는 Java 객체다.</p>"],["요청 처리","<p>URL과 HTTP 메서드로 요청을 매핑하고 파라미터를 검증한 뒤 Service를 호출한다. Servlet이 직접 SQL과 HTML을 모두 처리하지 않도록 책임을 분리한다.</p>"]]),
    makeLesson("JSP·EL·JSTL", "표현 로직을 View에 두고 Java 코드를 최소화한다.", [["JSP의 위치","<p>Controller가 준비한 데이터를 request scope에 담고 JSP로 forward하면 JSP는 HTML을 렌더링한다. EL은 <code>${member.name}</code>처럼 데이터를 읽고 JSTL은 조건과 반복을 태그로 표현한다.</p>"],["Scope","<p>page, request, session, application은 데이터가 살아 있는 범위가 다르다. 화면 한 번에 필요한 값은 request, 로그인 상태처럼 여러 요청에서 유지할 값은 session을 사용한다.</p>"]]),
    makeLesson("SSR과 MVC 흐름", "서버 렌더링의 전체 요청 경로를 연결한다.", [["전체 흐름","<div class='concept-flow'><span>Browser</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>DAO</span><i>→</i><span>JSP</span></div><p>Controller는 흐름을 제어하고, Model은 화면에 필요한 데이터, View는 최종 표현을 담당한다. redirect는 새 요청을 만들고 forward는 같은 요청을 서버 내부에서 전달한다.</p>"]])
  ]},
  {slug:"mybatis",title:"MyBatis",intro:"SQL의 제어권은 유지하면서 반복적인 JDBC 코드를 줄인다.",lessons:[
    makeLesson("Mapper와 결과 매핑", "Java 메서드와 SQL을 연결하고 결과를 객체로 변환한다.", [["MyBatis가 맡는 일","<p>Connection·Statement·ResultSet 처리와 객체 매핑을 대신한다. 개발자는 Mapper 인터페이스와 SQL에 집중한다. SQL 자체와 올바른 트랜잭션 설계까지 자동으로 해결해 주는 것은 아니다.</p>"],["파라미터와 결과","<p><code>#{value}</code>는 PreparedStatement 바인딩을 사용한다. 여러 파라미터는 DTO나 <code>@Param</code>으로 이름을 명확히 하고, 컬럼명과 필드명이 다르면 resultMap으로 매핑한다.</p>"]]),
    makeLesson("동적 SQL", "조건에 따라 필요한 SQL 조각만 안전하게 조합한다.", [["조건 조립","<p><code>if</code>, <code>choose</code>, <code>where</code>, <code>set</code>, <code>foreach</code>로 검색 조건과 부분 수정을 구성한다. 문자열 치환인 <code>${}</code>는 SQL Injection 위험이 있어 정렬 컬럼처럼 통제된 값 외에는 피한다.</p><pre data-lang='XML'><code>&lt;where&gt;\n  &lt;if test=&quot;keyword != null and keyword != ''&quot;&gt;\n    TITLE LIKE '%' || #{keyword} || '%'\n  &lt;/if&gt;\n&lt;/where&gt;</code></pre>"]])
  ]}
);

/* 프로젝트 시작 시 바로 찾아 쓰는 설정 전용 장 */
const detailedSetupLessons = [
 makeLesson("개발 도구·Node·React/Vite 준비","프론트엔드 작업 환경을 처음부터 확인한다.",[["시작 순서","<ol><li>Node.js LTS와 npm 버전을 확인한다.</li><li>Vite로 React 프로젝트를 만든다.</li><li>프로젝트 폴더에서 의존성을 설치한다.</li><li>개발 서버를 실행하고 기본 화면을 확인한다.</li></ol><pre data-lang='Shell'><code>node -v\nnpm -v\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev</code></pre><p>에디터 포맷 설정은 팀과 공유하고, 라이브러리는 실제 필요가 생겼을 때 추가한다.</p>"]]),
 makeLesson("Vite Proxy와 프론트·백엔드 연결","개발 중 API 주소와 CORS 문제를 단순화한다.",[["Proxy 설정","<pre data-lang='JavaScript'><code>export default defineConfig({\n  server: {\n    proxy: {\n      '/api': { target: 'http://localhost:8080', changeOrigin: true }\n    }\n  }\n});</code></pre><p>프론트에서는 <code>/api/members</code>처럼 호출한다. 설정 파일 변경 후 Vite 서버를 재시작하고 백엔드 서버가 실행 중인지 확인한다. Proxy는 개발 편의 기능이며 운영 환경의 reverse proxy와 CORS 정책은 별도로 구성한다.</p>"]]),
 makeLesson("Spring Initializr와 기본 프로젝트","백엔드 프로젝트의 버전과 의존성을 목적에 맞게 선택한다.",[["Initializr 선택 기준","<ul><li>Build: Gradle</li><li>Language: Java</li><li>Java: 프로젝트가 사용하는 LTS 버전</li><li>기본 의존성: Spring Web, Validation, Lombok</li><li>DB 방식에 따라 JPA 또는 MyBatis와 Driver 추가</li></ul><p>생성 후 <code>./gradlew test</code> 또는 애플리케이션 실행으로 기본 구성을 먼저 검증한다. Controller·Service·Repository 패키지를 역할별로 나눈다.</p>"]]),
 makeLesson("Spring Boot·JSP 프로젝트 설정","JSP View Resolver와 필요한 의존성을 연결한다.",[["확인할 항목","<p>JSP를 사용한다면 Jasper와 JSTL 의존성을 추가하고 View prefix/suffix를 설정한다. JSP 파일은 일반적으로 <code>WEB-INF/views</code> 아래에 두어 직접 접근을 막는다.</p><pre data-lang='Properties'><code>spring.mvc.view.prefix=/WEB-INF/views/\nspring.mvc.view.suffix=.jsp</code></pre><p>Spring Boot 버전에 따라 Jakarta 패키지와 JSTL 의존성 조합이 달라질 수 있으므로 사용 버전 문서를 기준으로 맞춘다.</p>"]]),
 makeLesson("Oracle·계정·스키마 준비","DB 접속 정보와 애플리케이션 계정을 분리한다.",[["안전한 준비 순서","<ol><li>Oracle과 SQL Developer 접속을 확인한다.</li><li>수업·프로젝트 전용 사용자를 생성한다.</li><li>필요한 권한만 부여한다.</li><li>테이블·시퀀스 스크립트를 별도 파일로 관리한다.</li><li>접속 비밀번호는 Git에 올리지 않는다.</li></ol><p>DDL과 샘플 데이터는 실행 순서를 명시하고, 운영 데이터베이스에 개발용 전체 권한을 부여하지 않는다.</p>"]]),
 makeLesson("MyBatis 설치·설정·Mapper 연결","설정 파일에서 Mapper 실행까지 필요한 요소를 빠짐없이 연결한다.",[["연결 체크리스트","<ol><li>MyBatis와 DB Driver 의존성을 추가한다.</li><li>DataSource 접속 정보를 비공개 설정으로 분리한다.</li><li>Mapper 인터페이스를 등록한다.</li><li>XML namespace와 인터페이스 전체 이름을 일치시킨다.</li><li>statement id와 메서드 이름, parameter/result type을 확인한다.</li></ol><p>Spring Boot Starter를 사용하면 SqlSessionFactory의 많은 설정이 자동화되지만 SQL 매핑 오류까지 해결해 주는 것은 아니다.</p>"]]),
 makeLesson("Git 저장소 시작과 협업 설정","첫 커밋 전에 저장소 규칙과 제외 파일을 준비한다.",[["저장소 초기화","<pre data-lang='Shell'><code>git init\ngit switch -c main\ngit add .\ngit commit -m &quot;chore: initialize project&quot;</code></pre><p><code>.gitignore</code>에 빌드 결과, IDE 설정, 환경 파일, 업로드 파일을 추가한다. README에는 요구 버전, 환경 변수 목록, 실행 명령, DB 준비 순서를 기록한다. 개인 토큰과 Access Key는 한 번이라도 커밋되었다면 파일 삭제만 하지 말고 즉시 폐기한다.</p>"]]),
 makeLesson("AWS EC2·보안 그룹·외부 서비스 연결","클라우드 인스턴스에 애플리케이션을 올리는 전체 순서를 점검한다.",[["배포 체크리스트","<ol><li>리전·인스턴스·키 페어를 선택한다.</li><li>보안 그룹은 SSH와 서비스 포트를 필요한 출발지에만 연다.</li><li>Java·Docker 등 실행 환경을 준비한다.</li><li>환경 변수와 IAM Role로 자격 증명을 주입한다.</li><li>프로세스 실행, 로그, 헬스체크를 확인한다.</li><li>도메인·HTTPS·reverse proxy를 연결한다.</li></ol><p>S3, RDS, 공공 API, Lambda를 연결할 때도 최소 권한과 타임아웃·재시도·비용을 함께 확인한다.</p>"]]),
 makeLesson("Docker·Vagrant 환경 재현","실행 환경과 가상 머신 구성을 코드로 남긴다.",[["Docker","<p>Dockerfile은 베이스 이미지, 애플리케이션 복사, 실행 명령을 정의한다. 비밀값을 이미지에 넣지 않고 실행 시 환경 변수로 전달한다. 포트, 볼륨, 네트워크와 헬스체크를 함께 기록한다.</p>"],["Vagrant","<p>Vagrantfile에는 사용할 이미지, CPU·메모리, 네트워크, 공유 폴더, provisioning을 정의한다. 팀원이 같은 명령으로 동일한 VM을 만들 수 있어야 한다.</p><pre data-lang='Shell'><code>vagrant up\nvagrant ssh\nvagrant halt</code></pre>"]])
];

window.CURATED_STUDY.push(
 {slug:"spring-mvc",title:"Spring MVC",intro:"요청부터 응답까지 계층별 책임을 분리한다.",lessons:[makeLesson("IoC·DI와 Spring MVC 흐름","객체 생성은 컨테이너에 맡기고 계층은 인터페이스로 협력한다.",[["Spring이 객체를 관리하는 이유","<p>Bean은 Spring 컨테이너가 생성·연결·관리하는 객체다. 생성자 주입을 사용하면 의존관계가 명확하고 테스트할 때 대체 구현을 넣기 쉽다.</p><div class='concept-flow'><span>요청</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>Repository</span></div>"]]),makeLesson("REST·JSON·ResponseEntity","HTTP 의미가 드러나는 API를 설계한다.",[["응답 설계","<p>리소스 중심 URL과 GET·POST·PATCH·DELETE를 조합한다. ResponseEntity로 상태 코드와 응답 본문을 명확히 전달하고 DTO로 외부 계약을 분리한다.</p>"]]),makeLesson("파일 업로드·페이징·공통 처리","실무 웹 기능의 반복 구조를 정리한다.",[["파일과 목록","<p>파일은 multipart/form-data와 MultipartFile로 받고 저장 이름을 새로 생성한다. 페이징은 전체 개수, 페이지 크기, 현재 페이지로 조회 범위와 이동 블록을 계산한다.</p>"],["공통 관심사","<p>Interceptor는 Controller 전후 처리, ControllerAdvice는 전역 예외 응답에 적합하다. 기능의 책임에 맞는 확장 지점을 선택한다.</p>"]])]},
 {slug:"spring-core",title:"Spring 핵심 기능",intro:"핵심 로직 밖의 반복 기능을 적절한 위치로 분리한다.",lessons:[makeLesson("Logging·Filter·AOP","관찰과 공통 처리를 비즈니스 코드에서 분리한다.",[["도구의 경계","<p>로그는 레벨과 환경 설정을 사용하고 민감정보를 남기지 않는다. Filter는 HTTP 요청의 가장 바깥, Interceptor는 Spring MVC, AOP는 메서드 실행 지점의 공통 처리에 사용한다.</p>"]]),makeLesson("트랜잭션과 Scheduler","원자적인 변경과 예약 작업을 관리한다.",[["안전한 실행","<p><code>@Transactional</code>은 여러 DB 변경을 하나의 작업으로 묶는다. Scheduler 작업은 중복 실행과 실패 재시도를 고려하고 긴 작업은 별도 실행기로 분리한다.</p>"]])]},
 {slug:"react",title:"React",intro:"상태 변화가 화면으로 이어지는 컴포넌트 기반 구조를 이해한다.",lessons:[makeLesson("컴포넌트·JSX·props","UI를 책임 단위로 나누고 데이터를 위에서 아래로 전달한다.",[["React의 렌더링","<p>컴포넌트는 props를 입력받아 UI를 반환한다. JSX 안의 목록에는 안정적인 key가 필요하며, 컴포넌트는 작고 명확한 책임을 갖게 나눈다.</p>"]]),makeLesson("State와 Hook","렌더링에 영향을 주는 값과 생명주기를 관리한다.",[["상태 관리","<p>useState는 새 값을 설정해 다시 렌더링한다. 객체와 배열은 직접 변경하지 않고 새 참조를 만든다. useEffect는 외부 시스템 동기화에 쓰며 의존성과 정리 함수를 정확히 작성한다. useRef는 렌더링과 무관한 값이나 DOM 참조를 보관한다.</p>"]]),makeLesson("Router·API·전역 상태","페이지 이동과 서버 데이터를 애플리케이션 구조에 연결한다.",[["구조 선택","<p>Router는 URL과 화면을 연결하고 Link는 새로고침 없는 이동을 제공한다. Axios 인스턴스로 공통 주소와 인터셉터를 모은다. 가까운 상태는 props, 범위가 넓은 상태는 Context 또는 Redux Toolkit을 사용한다.</p>"]])]},
 {slug:"jpa",title:"JPA & QueryDSL",intro:"객체 모델과 관계형 DB 사이의 차이를 영속성 계층에서 다룬다.",lessons:[makeLesson("Entity와 영속성 컨텍스트","Entity의 생명주기와 변경 감지를 이해한다.",[["영속 상태","<p>Entity는 테이블과 매핑되는 도메인 객체다. 영속성 컨텍스트는 1차 캐시와 변경 감지를 제공하며 트랜잭션 안에서 조회한 Entity 변경을 SQL로 반영한다.</p>"]]),makeLesson("연관관계·DTO·QueryDSL","관계를 안전하게 탐색하고 조회 결과를 외부 모델과 분리한다.",[["경계 만들기","<p>외래키를 관리하는 쪽을 연관관계의 주인으로 정한다. Entity를 API에 직접 노출하면 순환 참조와 민감정보 문제가 생길 수 있어 DTO로 변환한다. 동적 검색은 QueryDSL BooleanExpression으로 조건을 조합한다.</p>"]])]},
 {slug:"security",title:"JWT & Security",intro:"인증 정보가 발급되고 매 요청에서 검증되는 흐름을 정리한다.",lessons:[makeLesson("인증·인가와 Security Filter Chain","사용자 확인과 권한 확인을 구분한다.",[["보호된 요청","<p>비밀번호는 단방향 해시로 저장한다. 로그인 성공 후 JWT를 발급하고 이후 요청의 Authorization 헤더를 필터에서 검증해 SecurityContext에 인증 객체를 넣는다.</p>"]]),makeLesson("Access·Refresh Token","토큰의 수명과 탈취 위험을 함께 관리한다.",[["운영 원칙","<p>Access Token은 짧게, Refresh Token은 더 엄격하게 보관한다. 서명은 내용을 숨기지 않으므로 민감정보를 payload에 넣지 않는다. 만료·변조·권한 부족 응답을 구분한다.</p>"]])]},
 {slug:"aws",title:"AWS & 배포",intro:"애플리케이션이 클라우드에서 실행되고 외부와 통신하는 구조를 이해한다.",lessons:[makeLesson("EC2·네트워크·배포","서버 인스턴스와 접근 경로를 구성한다.",[["배포 흐름","<p>EC2에 실행 환경을 준비하고 보안 그룹은 필요한 포트만 연다. 애플리케이션 설정은 환경 변수로 주입하고 로그·헬스체크·재시작 전략을 함께 준비한다.</p>"]]),makeLesson("스토리지·외부 API·Lambda","요구에 맞는 관리형 서비스를 선택한다.",[["서비스 선택","<p>S3는 파일 객체, RDS는 관계형 데이터, Lambda는 이벤트 기반 짧은 작업에 적합하다. IAM 권한은 최소 권한 원칙으로 부여하고 Access Key를 코드에 저장하지 않는다.</p>"]])]},
 {slug:"infra",title:"Linux · Docker",intro:"동일한 실행 환경을 만들고 운영에 필요한 기본 명령을 익힌다.",lessons:[makeLesson("Linux 운영 기초","파일·권한·프로세스·네트워크 상태를 확인한다.",[["서버 점검","<p><code>pwd</code>, <code>ls</code>, <code>chmod</code>, <code>ps</code>, <code>top</code>, <code>ss</code>, <code>journalctl</code>을 목적에 맞게 사용한다. root 상시 사용을 피하고 로그로 원인을 확인한 뒤 변경한다.</p>"]]),makeLesson("Docker와 실행 환경","이미지로 실행 조건을 고정하고 컨테이너로 격리한다.",[["이미지에서 컨테이너까지","<p>Dockerfile로 이미지를 만들고 컨테이너 실행 시 포트·볼륨·환경 변수를 주입한다. 이미지는 불변 배포 단위이고 영속 데이터는 컨테이너 밖의 볼륨에 둔다.</p>"]])]},
 {slug:"realtime",title:"WebSocket & Redis",intro:"연결을 유지하는 통신과 빠른 공유 상태 저장을 조합한다.",lessons:[makeLesson("WebSocket·STOMP","서버와 클라이언트가 양방향으로 메시지를 교환한다.",[["실시간 흐름","<p>WebSocket은 연결을 유지해 매번 HTTP 요청을 만들지 않고 메시지를 주고받는다. STOMP는 destination과 subscribe/publish 규칙을 제공한다. 연결 종료·재연결·인증을 반드시 설계한다.</p>"]]),makeLesson("Redis 활용","메모리 저장소를 캐시와 메시징에 사용한다.",[["빠르지만 영구 DB는 아니다","<p>Redis는 캐시, 세션, 만료 데이터, Pub/Sub에 적합하다. TTL과 키 이름 규칙을 정하고 캐시 무효화 전략을 준비한다. 중요한 원본 데이터는 영속 DB를 기준으로 삼는다.</p>"]])]},
 {slug:"setup",title:"프로젝트 시작 가이드",intro:"프로젝트를 시작할 때 반복되는 설정만 빠르게 찾아 적용한다.",lessons:[]},
);
window.CURATED_STUDY.find((category)=>category.slug==="setup").lessons = detailedSetupLessons;
