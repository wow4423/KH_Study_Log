(function(){
  const category=(slug)=>window.CURATED_STUDY.find((item)=>item.slug===slug);
  const replace=(slug,index,body)=>{category(slug).lessons[index].body=body;};

  replace("java",0,`<h2>Java 코드가 실행되기까지</h2><p>Java 소스 파일은 CPU가 바로 실행하지 않는다. JDK에 포함된 <code>javac</code> 컴파일러가 <code>.java</code>를 JVM이 이해하는 <code>.class</code> 바이트코드로 바꾸고, JVM이 운영체제에 맞게 해석하거나 JIT 컴파일해 실행한다. 이 구조 덕분에 같은 class 파일을 JVM이 있는 여러 운영체제에서 실행할 수 있다.</p><div class="concept-flow"><span>Source.java</span><i>javac →</i><span>Source.class</span><i>JVM →</i><span>기계어 실행</span></div>
<h2>JDK·JVM·IDE를 구분한다</h2><table><tr><th>도구</th><th>역할</th></tr><tr><td>JVM</td><td>바이트코드 실행, 메모리와 Garbage Collection 관리</td></tr><tr><td>JDK</td><td>JVM과 컴파일러, 디버거 등 개발 도구의 묶음</td></tr><tr><td>IDE</td><td>코드 작성·실행·디버깅을 편리하게 연결하는 프로그램</td></tr></table><p>IDE의 실행 버튼도 내부적으로는 컴파일과 java 실행 명령을 호출한다. 오류를 이해하려면 프로젝트의 Java 버전, 컴파일 대상 버전, 실행 JVM이 일치하는지 확인할 수 있어야 한다.</p>
<h2>변수는 타입이 정한 메모리 해석 규칙을 가진다</h2><pre data-lang="Java"><code>int count = 10;
long population = 51_000_000L;
double average = 87.5;
char grade = 'A';
boolean passed = true;
String name = "AHJ";</code></pre><p>기본형 변수는 값을 직접 보관하고 참조형 변수는 객체를 가리키는 참조값을 보관한다. 정수 literal은 기본적으로 int, 실수 literal은 double이므로 long에는 <code>L</code>, float에는 <code>F</code>를 붙이는 경우가 있다.</p>
<h2>형변환과 값의 범위</h2><p>작은 범위에서 큰 범위로 이동하는 widening은 자동 변환될 수 있다. 큰 범위를 작은 타입으로 바꾸는 narrowing은 정보 손실 가능성이 있어 명시적 cast가 필요하다.</p><pre data-lang="Java"><code>int score = 95;
double converted = score;     // 95.0

double price = 19.8;
int truncated = (int) price;  // 19, 반올림이 아님</code></pre>
<h2>변수의 범위와 상수</h2><p>지역 변수는 선언된 블록 안에서만 사용할 수 있고 사용 전에 초기화해야 한다. 변경하면 안 되는 값은 <code>final</code>로 선언한다. 여러 곳에서 공유하는 상수는 보통 <code>static final</code>과 대문자 이름을 사용한다.</p><div class="note-warning"><strong>디버깅 기준</strong><p>숫자가 이상하면 계산식만 보지 말고 타입 범위, 정수 나눗셈, overflow, cast 시점을 확인한다. 돈처럼 오차가 허용되지 않는 값은 float·double 대신 BigDecimal을 고려한다.</p></div>`);

  replace("java",1,`<h2>연산자는 값을 만들고 조건식은 실행 경로를 고른다</h2><p>산술 연산 결과 타입은 피연산자 타입의 영향을 받는다. <code>5 / 2</code>는 두 값이 int이므로 2이며, 실수 결과가 필요하면 하나를 double로 변환해야 한다. 나머지 연산자 <code>%</code>는 짝수 판별, 순환 인덱스 등에 사용한다.</p><pre data-lang="Java"><code>double average = (double) total / count;
boolean canEnter = age &gt;= 18 &amp;&amp; hasTicket;
int nextIndex = (currentIndex + 1) % items.length;</code></pre>
<h2>문자열은 equals로 비교한다</h2><p><code>==</code>는 기본형의 값 또는 참조형의 참조값을 비교한다. 서로 다른 String 객체의 내용이 같아도 참조가 다를 수 있으므로 문자열 내용 비교는 <code>equals()</code>를 사용한다. null 가능성이 있으면 상수에서 호출하거나 <code>Objects.equals</code>를 사용한다.</p><pre data-lang="Java"><code>if ("ADMIN".equals(role)) { ... }
if (Objects.equals(inputName, savedName)) { ... }</code></pre>
<h2>조건문을 읽기 쉽게 만드는 순서</h2><p>if는 범위와 복합 조건에 적합하고 switch는 하나의 값에 따른 분기가 명확할 때 적합하다. 조건이 깊게 중첩되면 실패 조건을 먼저 반환하는 guard clause와 의미 있는 boolean 메서드를 사용한다.</p><pre data-lang="Java"><code>void register(Member member) {
    if (member == null) throw new IllegalArgumentException("회원이 필요합니다.");
    if (!member.isAdult()) throw new IllegalStateException("성인만 가입할 수 있습니다.");
    repository.save(member);
}</code></pre>
<h2>반복문 선택 기준</h2><table><tr><th>반복문</th><th>적합한 상황</th></tr><tr><td>for</td><td>횟수와 index가 중요할 때</td></tr><tr><td>향상된 for</td><td>배열·컬렉션의 값을 순서대로 읽을 때</td></tr><tr><td>while</td><td>횟수보다 종료 조건이 중요할 때</td></tr><tr><td>do-while</td><td>최소 한 번 실행해야 할 때</td></tr></table><p><code>break</code>는 반복 전체를 종료하고 <code>continue</code>는 현재 회차의 나머지만 건너뛴다. 무한 반복에는 반드시 외부에서 도달 가능한 종료 조건이 있어야 한다.</p>
<h2>짧은 실습을 개념으로 연결하기</h2><p>가위바위보는 입력 검증과 분기, UP & DOWN은 while과 범위 갱신, 키오스크는 메뉴 반복과 누적 상태를 연습한다. 실습 코드를 완성한 뒤 입력·계산·출력을 메서드로 분리하면 제어 흐름이 더 분명해진다.</p>`);

  replace("java",2,`<h2>배열은 같은 타입의 값을 고정된 길이로 보관한다</h2><p>배열 객체를 만들면 길이가 정해지고 각 칸은 타입의 기본값으로 초기화된다. int는 0, boolean은 false, 참조형은 null이다. 배열 변수에는 배열 객체의 참조가 저장된다.</p><pre data-lang="Java"><code>int[] scores = new int[3];
scores[0] = 90;
scores[1] = 85;
scores[2] = 100;

for (int i = 0; i &lt; scores.length; i++) {
    System.out.printf("%d번 점수: %d%n", i + 1, scores[i]);
}</code></pre>
<h2>인덱스 오류를 예방하는 기준</h2><p>유효한 index는 0부터 <code>length - 1</code>까지다. 반복 조건을 <code>&lt;= length</code>로 작성하면 마지막에 범위를 벗어난다. 외부 입력을 index로 사용할 때는 0 이상이고 length 미만인지 먼저 검증한다.</p>
<h2>배열 복사와 참조 공유</h2><pre data-lang="Java"><code>int[] original = {1, 2, 3};
int[] same = original;                  // 같은 배열을 참조
int[] copy = Arrays.copyOf(original, original.length); // 새 배열</code></pre><p><code>same[0]</code>을 바꾸면 original도 바뀐다. 변수 대입은 배열 내용을 복제하지 않고 참조만 복사하기 때문이다. 독립된 배열이 필요하면 copyOf나 arraycopy를 사용한다.</p>
<h2>다차원 배열은 배열 안에 배열이 있는 구조다</h2><pre data-lang="Java"><code>int[][] seats = {
    {1, 1, 0},
    {1, 0, 0},
    {1, 1, 1}
};

for (int row = 0; row &lt; seats.length; row++) {
    for (int col = 0; col &lt; seats[row].length; col++) {
        System.out.print(seats[row][col] + " ");
    }
}</code></pre><p>각 행이 별도 배열이므로 길이가 서로 다를 수 있다. 행마다 <code>seats[row].length</code>를 사용해야 한다.</p>
<h2>배열과 컬렉션 중 무엇을 선택할까?</h2><p>개수가 고정되고 index 기반 처리가 중요하면 배열이 단순하고 효율적이다. 실행 중 추가·삭제가 잦다면 ArrayList가 적합하다. 학생 성적처럼 값 여러 개가 한 학생이라는 의미로 묶인다면 평행 배열 여러 개보다 Student 객체의 목록으로 모델링하는 편이 안전하다.</p><div class="note-warning"><strong>문제 해결 순서</strong><p>구구단·성적 계산 실습에서는 먼저 입력과 출력 형식을 정하고, 배열에 저장한 뒤 계산 메서드와 출력 메서드를 분리한다. 중첩 반복의 각 index가 무엇을 뜻하는지 이름으로 드러낸다.</p></div>`);
})();
