(function(){
 const add=(s,i,h)=>{const l=(window.CURATED_STUDY||[]).find(c=>c.slug===s)?.lessons[i];if(l)l.body+=h;};
 add("setup",2,`<h2>수업 화면을 현재 프로젝트 기준으로 읽는 법</h2><figure class="console-shot"><img src="assets/notion-guide/spring-initializr.png" alt="Spring Initializr에서 빌드 도구와 의존성을 고르는 화면" loading="lazy"><figcaption>원문 당시의 Initializr 선택 화면이다. 화면의 버전 숫자를 그대로 복사하지 말고 Java·Spring Boot 호환성을 먼저 맞춘다. Spring Web, DB driver, MyBatis·JPA, Validation 등 실제 사용할 의존성만 선택한다.</figcaption></figure><p>생성 후 IDE에서 프로젝트를 여는 것으로 끝내지 않는다. Gradle 동기화, JDK 인식, test, bootRun, bootJar가 모두 성공해야 기준 프로젝트가 준비된 것이다. DB 의존성을 넣었다면 접속 환경 변수까지 준비하지 않으면 자동 설정 단계에서 부팅이 실패할 수 있다.</p>`);
 add("java",2,`<h2>배열은 같은 타입의 값을 번호로 관리한다</h2><p>변수 열 개를 따로 만들면 반복문으로 처리할 수 없다. 배열은 길이가 정해진 연속 공간에 같은 타입을 저장하고 0부터 시작하는 index로 접근한다.</p><pre data-lang="Java"><code>int[] scores=new int[3];
scores[0]=90;
for(int i=0;i&lt;scores.length;i++) sum+=scores[i];</code></pre><p>배열 변수에는 배열 자체가 아니라 참조가 들어간다. 다른 변수에 대입하면 같은 배열을 가리키므로 한쪽 수정이 다른 쪽에도 보인다. 2차원 배열은 행마다 배열을 참조하는 배열이라 행 길이가 서로 다를 수도 있다.</p><h3>실습 문제를 풀 때의 순서</h3><p>입력 개수와 저장할 값부터 정하고, index가 언제 증가하는지, 검색 실패를 어떤 값으로 표현할지 적는다. <code>i &lt; length</code> 경계를 넘으면 ArrayIndexOutOfBoundsException이 발생한다.</p>`);
 add("java",3,`<h2>객체는 관련된 상태와 행동을 한 단위로 묶는다</h2><p>Book 객체는 제목·가격 같은 field와 가격 변경 같은 method를 함께 가진다. Main에서 모든 값을 따로 관리하지 않고 객체가 자기 상태를 책임지게 한다.</p><pre data-lang="Java"><code>class Book{
 private String title;
 private int price;
 Book(String title,int price){this.title=title;setPrice(price);}
 void setPrice(int price){if(price&lt;0)throw new IllegalArgumentException();this.price=price;}
}</code></pre><p><code>new</code>가 heap에 객체를 만들고 생성자가 초기 상태를 완성한다. 참조 변수 두 개가 같은 객체를 가리킬 수 있으므로 <code>==</code>는 같은 객체인지, <code>equals</code>는 논리적으로 같은 값인지 구분한다.</p>`);
 add("java",5,`<h2>상속보다 다형성의 사용 장면을 먼저 본다</h2><p>부모 타입 변수는 여러 자식 객체를 같은 방식으로 다룰 수 있다. 실제 실행 method는 생성된 객체의 override method다.</p><pre data-lang="Java"><code>List&lt;Payment&gt; payments=List.of(new CardPayment(),new KakaoPayment());
for(Payment p:payments) p.pay(amount);</code></pre><p>호출 코드는 구체 결제 방식을 몰라도 된다. Interface는 구현 클래스가 지켜야 할 method 계약을 만들고, Service가 interface에 의존하면 test 구현과 실제 구현을 교체하기 쉽다. 단지 code 재사용만을 위해 깊은 상속 구조를 만들기보다 역할 계약과 합성을 먼저 고려한다.</p>`);
 add("java",7,`<h2>예외를 어디서 처리할지는 복구 가능 여부로 정한다</h2><p>Checked Exception은 compile 단계에서 처리 또는 전달을 요구하고 Runtime Exception은 주로 잘못된 상태와 programming 오류를 표현한다. try-catch를 쓴다는 사실보다 그 위치에서 실제로 복구할 수 있는지가 중요하다.</p><pre data-lang="Java"><code>try{orderService.order(request);}
catch(OutOfStockException e){showMessage("재고가 부족합니다");}</code></pre><p>DAO에서 SQLException을 catch하고 성공값을 반환하면 Service가 rollback해야 할 실패를 모른다. 원인을 보존한 업무 예외로 바꿔 위로 전달한다. finally나 try-with-resources는 성공·실패와 무관하게 resource를 닫는다.</p><h3>Stream은 collection을 바꾸는 저장소가 아니다</h3><p>source에서 filter·map 같은 중간 연산을 연결하고 collect·toList 같은 최종 연산에서 실행된다. 복잡한 상태 변경을 Stream 안에 숨기지 않고 데이터 변환 흐름이 명확할 때 사용한다.</p>`);
 add("java",8,`<h2>start를 호출해야 별도 실행 흐름이 생긴다</h2><p><code>run()</code>을 직접 부르면 현재 thread의 일반 method 호출이다. <code>start()</code>가 새 call stack을 만들고 JVM이 그 thread에서 run을 호출한다. 실행 순서는 scheduler가 정하므로 출력 순서를 가정할 수 없다.</p><pre data-lang="Java"><code>Thread worker=new Thread(()-&gt;doWork());
worker.start();
worker.join();</code></pre><p>sleep은 정확한 예약 시간이 아니라 최소 대기 시간이며 InterruptedException을 통해 중단 요청을 받는다. 여러 thread가 같은 값을 수정하면 race condition이 생겨 동기화나 concurrent 자료구조가 필요하다.</p><h3>Socket 통신의 두 끝</h3><p>ServerSocket은 port에서 연결을 기다리고 accept가 client별 Socket을 반환한다. 양쪽은 InputStream과 OutputStream으로 약속된 형식의 데이터를 주고받는다. host는 컴퓨터 주소, port는 그 컴퓨터 안의 프로그램 창구다.</p>`);

 add("sql",2,`<h2>서브쿼리는 안쪽 결과의 모양부터 확인한다</h2><p>서브쿼리를 외우기 어려운 이유는 안쪽 query가 한 값인지, 여러 행인지, 여러 열인지에 따라 바깥 연산자가 달라지기 때문이다. 먼저 서브쿼리만 실행해 결과 모양을 본다.</p><pre data-lang="SQL"><code>SELECT employee_name,salary
FROM employee
WHERE salary &gt; (SELECT AVG(salary) FROM employee);</code></pre><p>한 값이면 =·&gt; 같은 비교가 가능하고, 여러 값이면 IN·ANY·ALL을 사용한다. <code>IN</code>은 목록 중 하나와 같음, <code>&gt; ANY</code>는 하나보다만 커도 됨, <code>&gt; ALL</code>은 모두보다 커야 함이다.</p><p>상관 서브쿼리는 바깥 행 값을 안쪽 query가 사용해 행마다 평가될 수 있다. 같은 결과를 JOIN이나 analytic function으로 더 명확히 만들 수 있는지도 비교한다.</p>`);
 add("sql",3,`<h2>DDL·DML·TCL을 데이터 변화 범위로 구분한다</h2><p>DDL은 table·constraint·view 같은 구조를 정의하고, DML은 행을 넣고 바꾸고 지우며, TCL은 transaction을 확정하거나 취소한다. FOREIGN KEY는 자식 값이 부모 PK에 존재하도록 관계를 지킨다.</p><table><tr><th>삭제 옵션</th><th>부모 삭제 시</th></tr><tr><td>기본</td><td>자식이 있으면 거절</td></tr><tr><td>ON DELETE CASCADE</td><td>자식도 함께 삭제</td></tr><tr><td>ON DELETE SET NULL</td><td>자식 FK를 NULL로 변경</td></tr></table><p>옵션은 편의가 아니라 업무 규칙이다. 게시글 작성 회원 삭제 시 글도 사라져야 하는지, 탈퇴 회원 표시로 남겨야 하는지 먼저 결정한다. View는 query를 저장한 가상 table이며 권한과 복잡한 조회 단순화에 쓰지만 원본 데이터를 별도로 복사하지 않는다.</p>`);
 add("sql",4,`<h2>트랜잭션 격리는 동시에 실행될 때의 관찰 규칙이다</h2><p>두 사용자가 같은 재고를 읽고 수정하면 단일 사용자 test에서는 없던 문제가 생긴다. DB는 lock과 isolation level로 dirty read·non-repeatable read·phantom read 같은 현상을 조절한다.</p><p>애플리케이션에서 값을 읽고 계산한 뒤 UPDATE하기보다 조건부 UPDATE 한 문장으로 경쟁을 줄일 수 있다.</p><pre data-lang="SQL"><code>UPDATE product SET stock=stock-1
WHERE product_id=:id AND stock&gt;=1;</code></pre><p>영향 행 수가 0이면 재고 부족 또는 대상 없음으로 해석한다. transaction을 길게 유지하면 lock 대기가 늘어나므로 외부 API 호출을 DB transaction 안에 오래 두지 않는다.</p>`);
 add("sql",5,`<h2>인덱스는 정렬된 별도 구조라 쓰기 비용이 생긴다</h2><p>책의 찾아보기처럼 조건에 맞는 행 위치를 빠르게 찾지만 INSERT·UPDATE·DELETE 때 인덱스도 갱신한다. 모든 column에 만들지 않고 자주 검색·JOIN·정렬하는 조건과 선택도를 본다.</p><p>복합 인덱스 <code>(member_id, ordered_at)</code>는 왼쪽 column부터 사용하는 query에 유리하다. function을 씌우거나 암시적 type 변환이 생기면 index를 활용하지 못할 수 있다. 실행 계획에서 full scan 자체를 무조건 나쁘다고 하지 말고 table 크기와 예상 행 수를 함께 본다.</p>`);

 add("jpa",0,`<h2>Entity는 단순한 DB 행 복사 객체가 아니다</h2><p>영속성 Context가 식별자 기준으로 Entity를 관리하며 같은 transaction 안에서 같은 ID 조회는 같은 객체를 돌려줄 수 있다. new 상태는 비영속, persist·조회된 상태는 영속, Context에서 분리되면 준영속, remove되면 삭제 상태다.</p><p>영속 Entity의 변경은 transaction commit 시 snapshot과 비교되어 UPDATE로 반영된다. Setter 호출마다 즉시 SQL이 나가는 것이 아니며 flush 시점에 SQL이 DB로 전달된다.</p>`);
 add("jpa",1,`<h2>객체 mapping은 DB 제약조건과 함께 설계한다</h2><p><code>@Entity</code>와 <code>@Id</code>만 붙이는 것으로 끝나지 않는다. nullable·length·unique 같은 Java mapping과 실제 migration DDL을 맞추고, IDENTITY·SEQUENCE 전략이 DB와 어떻게 번호를 만드는지 이해한다.</p><p>기본 생성자는 JPA가 reflection으로 객체를 만들 때 필요하다. Entity의 모든 field를 public setter로 열기보다 의미 있는 생성 method와 변경 method로 유효한 상태만 만들게 한다.</p>`);
 add("jpa",2,`<h2>조회 복잡도에 맞춰 도구를 선택한다</h2><p>ID CRUD는 JpaRepository, 간단한 조건은 method 이름 query, 고정된 복잡 query는 JPQL, 선택 조건이 많은 검색은 QueryDSL이 적합하다. method 이름이 지나치게 길어지면 의미를 읽기 어렵고 조건 조합도 제한된다.</p><p>Repository가 Entity를 반환한 뒤 Controller에서 연관관계를 따라다니며 query를 추가로 실행하지 않게 Service에서 필요한 데이터 범위와 transaction을 결정한다.</p>`);
 add("jpa",3,`<h2>@Transactional은 변경 감지가 일어나는 작업 공간을 만든다</h2><pre data-lang="Java"><code>@Transactional
public void changeNickname(Long id,String nickname){
 Member member=repository.findById(id).orElseThrow();
 member.changeNickname(nickname);
}</code></pre><p>save를 다시 호출하지 않아도 관리 중인 Entity의 변경이 commit 때 반영된다. transaction 밖에서 가져온 준영속 객체를 바꿔도 자동 UPDATE되지 않는다. readOnly transaction은 조회 의도를 드러내고 불필요한 변경 감지를 줄이는 데 도움을 준다.</p>`);
 add("jpa",4,`<h2>연관관계의 주인은 FK를 실제로 수정하는 쪽이다</h2><p>Member 1명과 Board N개의 관계에서 FK는 board table에 있으므로 Board의 member field가 주인이다. Member의 boards에만 add하고 Board.member를 설정하지 않으면 DB FK는 바뀌지 않는다.</p><pre data-lang="Java"><code>public void addBoard(Board board){
 boards.add(board);
 board.assignMember(this);
}</code></pre><p>편의 method는 메모리 안 양쪽 관계를 함께 맞춘다. JSON 응답에서 양방향 Entity를 그대로 반환하면 서로를 반복 참조할 수 있으므로 DTO 경계를 사용한다.</p>`);
 add("jpa",5,`<h2>LAZY는 query를 없애지 않고 실행 시점을 늦춘다</h2><p>목록 Entity 20건을 조회한 뒤 각 연관 Entity에 접근하면 추가 query가 20번 실행될 수 있다. 이것이 N+1이다. SQL 로그에서 처음 1번과 반복 N번을 확인한다.</p><p>필요한 관계가 명확하면 fetch join, EntityGraph, DTO projection을 선택한다. collection fetch join과 paging을 함께 쓰면 row 중복과 memory paging 문제가 생길 수 있어 content query를 분리하거나 batch size를 고려한다.</p>`);
 add("jpa",6,`<h2>Entity는 Service 안에서 DTO로 바꾼다</h2><p>Entity를 Controller까지 보내면 DB field가 API 계약이 되고 password 같은 내부 값 노출, LAZY 초기화 예외, 양방향 무한 참조가 생길 수 있다. 요청 DTO는 client 입력을, 응답 DTO는 공개할 모양을 표현한다.</p><div class="concept-flow"><span>Request DTO</span><i>→</i><span>Service</span><i>→</i><span>Entity</span><i>→</i><span>Response DTO</span></div><p>변환 위치를 Service transaction 안에 두면 필요한 LAZY 값도 의도적으로 읽을 수 있고 Controller는 HTTP 응답에만 집중한다.</p>`);
 add("jpa",7,`<h2>QueryDSL은 조건을 null로 조립하는 방식부터 익힌다</h2><pre data-lang="Java"><code>private BooleanExpression titleContains(String keyword){
 return hasText(keyword)?board.title.containsIgnoreCase(keyword):null;
}
query.selectFrom(board)
 .where(titleContains(cond.keyword()),writerEq(cond.writerId()))
 .orderBy(board.createdAt.desc(),board.id.desc())
 .offset(pageable.getOffset()).limit(pageable.getPageSize()).fetch();</code></pre><p>where는 null 조건을 무시하므로 if로 query 문자열을 이어 붙이지 않아도 된다. content 조회와 count 조회에서 불필요한 join을 분리하고, 정렬에 고유 ID를 보조 기준으로 넣어 page 사이 중복·누락을 막는다.</p>`);
})();
