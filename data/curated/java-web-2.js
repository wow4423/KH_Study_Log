(function(){
  const category=(slug)=>window.CURATED_STUDY.find((item)=>item.slug===slug);
  const replace=(slug,index,body)=>{category(slug).lessons[index].body=body;};

  replace("java",3,`<h2>클래스는 관련된 상태와 행동을 하나의 책임으로 묶는다</h2>
<p>절차형 코드에서는 여러 변수와 함수가 흩어지기 쉽다. 클래스는 같은 대상에 속하는 데이터와 기능을 한곳에 모아 프로그램을 객체들의 협력으로 표현한다. 클래스는 설계이고 <code>new</code>로 만들어진 실제 값은 객체 또는 인스턴스다.</p>
<pre data-lang="Java"><code>public class Member {
    private long id;
    private String name;
    private int point;

    public void addPoint(int amount) {
        if (amount &lt;= 0) {
            throw new IllegalArgumentException("포인트는 양수여야 합니다.");
        }
        point += amount;
    }
}</code></pre>
<p>필드는 객체가 기억할 상태이고 메서드는 객체가 수행할 행동이다. 위 객체는 point 값을 외부에 맡기지 않고 자신의 규칙으로 변경한다.</p>
<h2>객체 변수에는 참조값이 저장된다</h2>
<pre data-lang="Java"><code>Member first = new Member();
Member second = first;

second.addPoint(100);</code></pre>
<p>first와 second는 서로 다른 객체가 아니라 같은 객체를 가리킨다. 따라서 second를 통해 바꾼 상태를 first로 조회해도 동일하다. 메서드 인자로 객체를 전달할 때도 참조값이 복사된다.</p>
<h2>메서드의 입력과 출력</h2>
<p>메서드는 매개변수로 필요한 값을 받고 반환 타입에 맞는 결과를 돌려준다. 반환값이 없으면 void를 사용한다. 한 메서드가 입력, 계산, 출력, 저장을 모두 담당하면 재사용과 테스트가 어려워지므로 하나의 목적을 갖게 분리한다.</p>
<pre data-lang="Java"><code>public int calculateTotal(int price, int quantity) {
    if (price &lt; 0 || quantity &lt; 0) {
        throw new IllegalArgumentException("가격과 수량을 확인하세요.");
    }
    return price * quantity;
}</code></pre>
<h2>객체 모델링 순서</h2>
<ol><li>프로그램이 다루는 대상을 찾는다.</li><li>대상이 반드시 기억해야 할 상태를 필드로 정한다.</li><li>그 상태를 사용하거나 변경하는 행동을 메서드로 정한다.</li><li>객체가 스스로 지켜야 할 규칙을 내부에 둔다.</li><li>다른 객체에 속한 책임은 억지로 가져오지 않는다.</li></ol>
<div class="note-warning"><strong>VO와 행동이 있는 객체</strong><p>화면·DB 사이에서 값만 전달하는 VO/DTO는 데이터 중심일 수 있다. 반면 도메인 객체는 자신의 상태를 유효하게 만드는 행동을 갖는 편이 좋다. 모든 클래스를 getter와 setter만 있는 형태로 만들 필요는 없다.</p></div>`);

  replace("java",4,`<h2>캡슐화는 객체가 잘못된 상태가 되는 것을 막는다</h2>
<p>필드를 private으로 숨기는 이유는 단순히 직접 접근을 금지하기 위해서가 아니다. 상태 변경이 반드시 객체의 메서드를 통과하게 하면 검증과 관련 규칙을 한곳에서 보장할 수 있다.</p>
<pre data-lang="Java"><code>public class BankAccount {
    private long balance;

    public void withdraw(long amount) {
        if (amount &lt;= 0) throw new IllegalArgumentException("출금액 오류");
        if (balance &lt; amount) throw new IllegalStateException("잔액 부족");
        balance -= amount;
    }

    public long getBalance() {
        return balance;
    }
}</code></pre>
<h2>접근 제한자의 범위</h2>
<table><tr><th>제한자</th><th>접근 범위</th></tr><tr><td>private</td><td>현재 클래스 내부</td></tr><tr><td>default</td><td>같은 패키지</td></tr><tr><td>protected</td><td>같은 패키지와 상속받은 클래스</td></tr><tr><td>public</td><td>어디서든 접근 가능</td></tr></table>
<p>가장 좁은 범위에서 시작하고 외부 협력에 필요한 것만 공개한다. public setter를 자동으로 만드는 것은 캡슐화가 아니다. 변경이 필요한 이유를 나타내는 <code>changeNickname</code>, <code>cancel</code> 같은 메서드가 의도를 더 잘 드러낸다.</p>
<h2>생성자는 유효한 시작 상태를 만든다</h2>
<pre data-lang="Java"><code>public Member(long id, String name) {
    if (id &lt;= 0) throw new IllegalArgumentException("id 오류");
    if (name == null || name.isBlank()) {
        throw new IllegalArgumentException("이름은 필수입니다.");
    }
    this.id = id;
    this.name = name;
}</code></pre>
<p>생성자를 하나도 작성하지 않으면 컴파일러가 기본 생성자를 제공한다. 생성자를 직접 작성하면 기본 생성자는 자동으로 생기지 않는다. <code>this</code>는 현재 객체를 가리키며 필드와 매개변수 이름을 구분하거나 다른 생성자를 호출할 때 사용한다.</p>
<h2>static은 객체가 아닌 클래스에 속한다</h2>
<p>static 필드는 모든 인스턴스가 공유하고 클래스가 로딩될 때 준비된다. 공통 상수나 객체 상태에 의존하지 않는 순수한 보조 기능에 적합하다.</p>
<pre data-lang="Java"><code>public final class DiscountPolicy {
    public static final double VIP_RATE = 0.1;

    private DiscountPolicy() {}

    public static int discount(int price) {
        return (int) (price * VIP_RATE);
    }
}</code></pre>
<div class="note-warning"><strong>주의</strong><p>변경 가능한 값을 static으로 공유하면 테스트 순서와 여러 요청 사이에서 상태가 섞일 수 있다. 서버의 로그인 사용자나 장바구니처럼 요청마다 다른 데이터는 static 필드에 두면 안 된다.</p></div>`);

  replace("java",5,`<h2>상속은 ‘is-a’ 관계를 코드로 표현한다</h2>
<p>하위 클래스는 상위 클래스의 필드와 메서드를 물려받고 필요한 동작을 재정의할 수 있다. 하지만 공통 코드가 있다는 이유만으로 상속하면 두 클래스가 강하게 결합된다. 하위 객체를 상위 타입으로 사용해도 의미가 자연스러운 관계인지 먼저 확인한다.</p>
<pre data-lang="Java"><code>abstract class Payment {
    public abstract void pay(int amount);
}

class CardPayment extends Payment {
    @Override
    public void pay(int amount) {
        System.out.println("카드 결제: " + amount);
    }
}</code></pre>
<h2>다형성은 같은 메시지에 다른 구현이 응답하는 성질이다</h2>
<pre data-lang="Java"><code>List&lt;Payment&gt; payments = List.of(
    new CardPayment(),
    new AccountPayment()
);

for (Payment payment : payments) {
    payment.pay(10_000);
}</code></pre>
<p>변수는 상위 타입이지만 실제 실행되는 메서드는 객체의 재정의된 메서드다. 호출 코드는 구체 클래스별 if문 없이 같은 규약으로 여러 구현을 사용할 수 있다.</p>
<h2>인터페이스는 구현이 따라야 할 계약이다</h2>
<pre data-lang="Java"><code>public interface NotificationSender {
    void send(String receiver, String message);
}

public class EmailSender implements NotificationSender {
    @Override
    public void send(String receiver, String message) { ... }
}</code></pre>
<p>인터페이스 타입에 의존하면 Email을 SMS나 테스트용 Fake로 교체하기 쉽다. 인터페이스는 여러 개 구현할 수 있으며 구현 세부가 아니라 제공해야 할 기능을 표현한다.</p>
<h2>추상 클래스와 인터페이스 선택</h2>
<table><tr><th>기준</th><th>추상 클래스</th><th>인터페이스</th></tr><tr><td>목적</td><td>가까운 클래스의 공통 상태·기본 구현</td><td>서로 다른 구현이 지킬 기능 계약</td></tr><tr><td>상속</td><td>하나만 가능</td><td>여러 개 구현 가능</td></tr><tr><td>필드</td><td>인스턴스 상태 가능</td><td>상수 중심</td></tr></table>
<h2>상속보다 조합이 나은 경우</h2><p>기능을 재사용하고 싶을 뿐 타입 관계가 아니라면 필요한 객체를 필드로 가지고 위임하는 조합을 사용한다. 조합은 런타임에 구현을 바꾸기 쉽고 부모 내부 변경이 자식에 전파되는 문제를 줄인다.</p>
<div class="note-warning"><strong>다운캐스팅</strong><p>상위 타입을 특정 하위 타입으로 강제 변환해야 하는 코드가 반복되면 다형성을 제대로 활용하지 못하고 있을 가능성이 높다. 타입을 묻기보다 객체에 행동을 요청할 수 있는지 검토한다.</p></div>`);

  replace("java",6,`<h2>컬렉션은 데이터 사용 방식에 맞는 저장 구조를 제공한다</h2>
<table><tr><th>인터페이스</th><th>특징</th><th>대표 구현</th></tr><tr><td>List</td><td>순서 유지, 중복 허용, index 접근</td><td>ArrayList, LinkedList</td></tr><tr><td>Set</td><td>중복 제거, 집합 연산</td><td>HashSet, TreeSet</td></tr><tr><td>Map</td><td>고유한 key로 value 조회</td><td>HashMap, TreeMap</td></tr></table>
<h2>구현체보다 인터페이스 타입으로 선언한다</h2>
<pre data-lang="Java"><code>List&lt;Member&gt; members = new ArrayList&lt;&gt;();
Set&lt;String&gt; tags = new HashSet&lt;&gt;();
Map&lt;Long, Member&gt; memberById = new HashMap&lt;&gt;();</code></pre>
<p>사용 코드는 필요한 기능 계약에 의존하고 생성 시 구현체를 선택한다. ArrayList는 index 조회와 끝 추가가 빠르고 중간 삽입·삭제는 뒤 요소 이동이 필요하다. LinkedList가 항상 삽입에 유리한 것은 아니며 위치 탐색 비용까지 고려해야 한다.</p>
<h2>Set과 Map의 중복 판단</h2>
<p>HashSet과 HashMap의 key는 <code>hashCode()</code>로 후보 위치를 찾고 <code>equals()</code>로 같은 값인지 확인한다. 사용자 정의 객체를 key 또는 Set 원소로 사용한다면 두 메서드의 규약을 함께 구현해야 한다. equals가 true인 두 객체는 같은 hashCode를 반환해야 한다.</p>
<h2>제네릭은 타입 오류를 컴파일 시점으로 앞당긴다</h2>
<pre data-lang="Java"><code>public class Box&lt;T&gt; {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

Box&lt;String&gt; box = new Box&lt;&gt;();
box.set("Java");</code></pre>
<p>제네릭이 없으면 Object로 저장한 뒤 사용할 때 cast가 필요하고 잘못된 타입이 런타임에 발견된다. 타입 매개변수로 API가 다룰 타입을 명시하면 cast가 줄고 의도가 드러난다.</p>
<h2>와일드카드의 읽기와 쓰기</h2><ul><li><code>? extends Number</code>: Number의 하위 타입 목록을 읽는 생산자. 안전하게 값을 추가하기 어렵다.</li><li><code>? super Integer</code>: Integer를 넣을 수 있는 소비자. 읽으면 Object로 보인다.</li></ul><p>PECS 원칙은 Producer Extends, Consumer Super로 기억할 수 있다.</p>
<div class="note-warning"><strong>선택 기준</strong><p>목록이면 무조건 List를 쓰지 않는다. 중복을 허용하는지, 순서가 필요한지, 어떤 key로 얼마나 자주 조회하는지를 먼저 정한다.</p></div>`);

  replace("java",7,`<h2>예외는 정상 흐름으로 결과를 만들 수 없음을 전달한다</h2>
<p>예외 객체에는 실패 종류와 메시지, 발생 위치의 stack trace, 원인이 되는 예외가 담긴다. 단순히 프로그램을 멈추는 기능이 아니라 현재 메서드가 처리할 수 없는 문제를 호출자에게 전달하는 수단이다.</p>
<h2>Checked와 Unchecked</h2>
<table><tr><th>구분</th><th>특징</th><th>예</th></tr><tr><td>Checked Exception</td><td>컴파일러가 catch 또는 throws를 요구</td><td>IOException, SQLException</td></tr><tr><td>Runtime Exception</td><td>컴파일 강제 없음, 프로그래밍·상태 오류 표현</td><td>IllegalArgumentException, NullPointerException</td></tr></table>
<h2>잡을 위치를 선택한다</h2>
<pre data-lang="Java"><code>try {
    return memberDao.findById(id);
} catch (SQLException e) {
    throw new DataAccessException("회원 조회에 실패했습니다.", e);
}</code></pre>
<p>현재 계층이 복구 방법을 알고 있을 때 catch한다. 해결할 수 없으면 의미 있는 예외로 변환해 원인 예외를 함께 전달한다. catch 후 로그만 찍고 정상값을 반환하면 호출자는 실패를 알 수 없다.</p>
<h2>try-with-resources</h2>
<pre data-lang="Java"><code>try (BufferedReader reader = Files.newBufferedReader(path)) {
    return reader.lines().toList();
} catch (IOException e) {
    throw new FileReadException(path + " 읽기 실패", e);
}</code></pre>
<p>AutoCloseable 자원은 블록 종료 시 역순으로 자동 정리된다. finally에서 직접 close하는 코드보다 누락과 예외 덮어쓰기 위험이 적다.</p>
<h2>Stream은 데이터 처리 단계를 연결한다</h2>
<pre data-lang="Java"><code>Map&lt;String, Long&gt; countByDepartment = members.stream()
    .filter(Member::isActive)
    .collect(Collectors.groupingBy(
        Member::getDepartment,
        Collectors.counting()
    ));</code></pre>
<p>중간 연산 filter·map은 지연 실행되고 collect·toList 같은 최종 연산이 호출될 때 처리된다. Stream은 원본을 직접 변경하지 않는다. 외부 상태를 수정하는 부수 효과, 복잡한 예외, 지나치게 긴 체인은 일반 반복문보다 읽기 어려울 수 있다.</p>
<div class="note-warning"><strong>사용자 정의 예외</strong><p>기술 이름보다 업무 실패를 드러내는 이름을 사용한다. 예: <code>InsufficientBalanceException</code>. 메시지에는 원인을 판단할 문맥을 담되 비밀번호나 개인정보는 포함하지 않는다.</p></div>`);

  replace("java",8,`<h2>프로세스 안에서 여러 실행 흐름이 자원을 공유한다</h2>
<p>프로세스는 실행 중인 프로그램과 독립된 메모리 공간이고 스레드는 그 안의 실행 흐름이다. 같은 프로세스의 스레드는 heap 객체를 공유하지만 각자 stack을 가진다. 공유 덕분에 통신은 빠르지만 동시에 같은 값을 변경하면 경쟁 상태가 생긴다.</p>
<h2>start와 run의 차이</h2>
<pre data-lang="Java"><code>Thread worker = new Thread(() -&gt; {
    System.out.println(Thread.currentThread().getName());
    doWork();
});

worker.start(); // 새 스레드에서 run 실행
// worker.run(); // 현재 스레드의 일반 메서드 호출</code></pre>
<p>Thread를 상속할 수도 있지만 작업을 Runnable로 분리하면 실행 정책과 할 일을 분리할 수 있다. 실무에서는 매 작업마다 Thread를 만들기보다 ExecutorService의 스레드 풀을 사용한다.</p>
<h2>공유 상태와 동기화</h2>
<pre data-lang="Java"><code>public synchronized void increase() {
    count++;
}</code></pre>
<p><code>count++</code>는 읽기·증가·쓰기가 분리된 연산이라 두 스레드가 동시에 실행하면 증가가 사라질 수 있다. synchronized lock이나 AtomicInteger로 임계 영역을 보호한다. lock 범위가 너무 넓으면 병렬 이점이 줄고 서로 lock을 기다리는 deadlock 가능성도 생긴다.</p>
<h2>sleep·interrupt·join</h2><ul><li><code>sleep</code>: 현재 스레드를 일정 시간 대기시키며 InterruptedException을 처리해야 한다.</li><li><code>interrupt</code>: 강제 종료가 아니라 중단 요청 신호다.</li><li><code>join</code>: 다른 스레드가 끝날 때까지 기다린다.</li></ul><p>무한 반복 작업은 interrupt 상태를 확인하고 자원을 정리한 뒤 종료하도록 설계한다.</p>
<h2>네트워크 통신의 기본 구조</h2><div class="concept-flow"><span>서버가 port에서 대기</span><i>→</i><span>클라이언트 socket 연결</span><i>→</i><span>stream으로 송수신</span><i>→</i><span>연결 종료</span></div><p>IP는 컴퓨터를, port는 그 컴퓨터 안의 프로그램을 구분한다. TCP는 연결과 순서·재전송을 제공하고 HTTP는 TCP 위에서 요청과 응답의 형식을 정의한다. InputStream의 read는 데이터가 올 때까지 block될 수 있으므로 timeout과 스레드 관리가 필요하다.</p>
<h2>서버 코드에서 생각할 것</h2><p>클라이언트마다 무제한 스레드를 만들지 않고 pool 크기와 queue를 제한한다. 연결 timeout, 읽기 timeout, 예외 발생 시 socket close, 메시지 경계를 정한다. 텍스트는 양쪽이 같은 charset을 사용해야 한다.</p>
<div class="note-warning"><strong>핵심</strong><p>동시성 문제는 실행 순서가 매번 달라 재현하기 어렵다. 가능하면 공유 변경 상태를 줄이고 불변 객체와 thread-safe 자료구조, 높은 수준의 실행 도구를 사용한다.</p></div>`);
})();
