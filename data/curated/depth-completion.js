/* 전체 분량 감사에서 짧게 남은 정규 과정 단원에 전제·추적 방법·오류 진단을 보충한다. */
(function () {
  const find = (slug, index) => (window.CURATED_STUDY || []).find((c) => c.slug === slug)?.lessons[index];
  const add = (slug, index, html) => { const lesson = find(slug, index); if (lesson) lesson.body += html; };

  add("html-css", 0, `<h2>주소 하나를 입력했을 때 실제로 벌어지는 일</h2><ol><li>브라우저가 URL에서 protocol·host·port·path를 나눈다.</li><li>DNS로 host의 IP를 찾고 TCP, HTTPS라면 TLS 연결을 맺는다.</li><li>HTTP request method·header·body를 서버로 보낸다.</li><li>서버가 status·header·body로 응답한다.</li><li>브라우저가 HTML을 읽다가 CSS·JavaScript·이미지를 추가 요청한다.</li></ol><p>개발자 도구 Network에서 document 요청과 정적 자원 요청을 구분해 본다. 화면이 하얗다면 HTML 응답 자체, CSS 경로, JavaScript console 오류를 차례로 확인한다.</p>`);
  add("html-css", 1, `<h2>시맨틱 태그는 모양이 아니라 문서의 역할을 말한다</h2><p><code>header</code>는 무조건 화면 맨 위, <code>aside</code>는 무조건 왼쪽이라는 뜻이 아니다. header는 해당 영역의 머리말, nav는 주요 이동, main은 문서의 핵심, article은 독립 배포 가능한 내용, section은 제목을 가진 주제 묶음이다. CSS를 제거해도 제목 계층과 읽는 순서가 자연스러운지 확인하면 구조가 제대로 잡혔는지 판단하기 쉽다.</p><p>키보드 Tab 순서, form label, button과 link의 구분도 HTML 단계에서 정한다. 클릭한다고 모두 div로 만들면 키보드와 보조 기술이 의미를 알 수 없다.</p>`);
  add("html-css", 2, `<h2>폼 제출은 이름이 붙은 값들의 묶음이다</h2><p>브라우저는 form 안의 성공한 control 중 <code>name</code>이 있는 값만 전송한다. label의 <code>for</code>와 input의 id를 맞추고, 화면 안내용 placeholder를 label 대신 사용하지 않는다. GET은 검색처럼 URL로 공유 가능한 조회, POST는 등록처럼 body에 담는 변경 요청에 주로 사용한다.</p><pre data-lang="HTML"><code>&lt;label for="email"&gt;이메일&lt;/label&gt;
&lt;input id="email" name="email" type="email" required&gt;
&lt;button type="submit"&gt;가입하기&lt;/button&gt;</code></pre><p>브라우저 검증은 사용자 편의 기능일 뿐 보안 경계가 아니다. 서버에서도 길이·형식·권한·중복을 다시 검증한다.</p>`);
  add("html-css", 3, `<h2>선택자가 맞는데 적용되지 않을 때 보는 순서</h2><ol><li>Elements에서 실제 요소가 그 selector와 일치하는지 본다.</li><li>Styles에서 속성이 취소선인지, 어느 규칙이 이겼는지 본다.</li><li>origin·important·inline·specificity·작성 순서를 확인한다.</li><li>상속 가능한 속성인지와 부모에서 받은 값인지 본다.</li></ol><p>선택자를 계속 길게 만들어 이기려 하지 말고 component class 하나로 의도를 표현한다. <code>!important</code>는 구조를 고치지 않은 채 우선순위만 높이므로 이후 상태 class와 반응형 규칙을 더 어렵게 만든다.</p>`);

  add("java", 0, `<h2>코드가 실행되기 전부터 타입 검사가 시작된다</h2><p><code>.java</code> source는 compiler가 bytecode인 <code>.class</code>로 바꾸고 JVM이 실행한다. compile error는 실행 자체가 시작되지 않은 것이고, exception은 실행 중 문제가 발생한 것이다. primitive는 값 자체를, reference 변수는 객체를 찾을 수 있는 참조를 저장한다는 차이를 먼저 잡는다.</p><pre data-lang="Java"><code>int count = 3;       // primitive 값
Member member = new Member("AHJ"); // reference
Member same = member; // 객체 복사가 아니라 같은 객체를 가리킨다</code></pre>`);
  add("java", 1, `<h2>제어문을 중첩하기 전에 조건의 의미를 이름으로 꺼낸다</h2><pre data-lang="Java"><code>boolean canPurchase = member.isActive() && balance >= price;
if (!canPurchase) {
  return PurchaseResult.rejected();
}</code></pre><p>복잡한 조건을 한 줄에 계속 붙이면 어느 조건이 실패했는지 알기 어렵다. guard clause로 실패 조건을 먼저 반환하고, 반복문에는 종료 조건과 매번 변하는 값을 적는다. <code>==</code>는 primitive 값에는 적합하지만 객체 내용 비교는 <code>equals</code> 계약을 사용한다.</p>`);
  add("java", 4, `<h2>생성자는 유효한 객체가 시작되는 경계다</h2><p>필드를 private로 감추는 것만으로 캡슐화가 완성되지 않는다. 생성 시 필수값을 검사하고, 상태 변경은 의미가 있는 method를 통해서만 허용해야 객체가 잘못된 상태로 존재하지 않는다. <code>static</code>은 모든 instance가 공유하는 class 소속 값이므로 사용자별 상태를 저장하면 안 된다.</p><pre data-lang="Java"><code>public void changePassword(String encodedPassword) {
  if (encodedPassword == null || encodedPassword.isBlank()) throw new IllegalArgumentException();
  this.password = encodedPassword;
}</code></pre>`);
  add("java", 6, `<h2>Collection은 자료형보다 조회·변경 방식으로 선택한다</h2><table><tr><th>구조</th><th>선택 기준</th></tr><tr><td>List</td><td>순서와 중복이 필요하다.</td></tr><tr><td>Set</td><td>중복 없는 membership 판단이 중요하다.</td></tr><tr><td>Map</td><td>key로 값을 빠르게 찾는다.</td></tr></table><p>generic은 compile 시점에 element 타입을 제한해 cast 오류를 줄인다. 객체를 Set key나 Map key로 쓴다면 <code>equals</code>와 <code>hashCode</code>가 같은 기준을 사용해야 한다. 순회 중 구조를 직접 바꾸지 말고 Iterator 또는 <code>removeIf</code>를 사용한다.</p>`);

  add("git", 0, `<h2>status와 diff가 다음 명령을 결정한다</h2><p>명령을 외워 순서대로 누르기보다 <code>git status</code>로 working tree와 staging 상태를 읽는다. commit 전에는 <code>git diff</code>와 <code>git diff --staged</code>를 모두 확인해 빠진 파일과 의도하지 않은 secret·generated file이 없는지 본다. commit은 “작업한 시간”이 아니라 하나의 이유로 함께 되돌릴 수 있는 변경 단위다.</p>`);
  add("git", 1, `<h2>충돌은 파일 문제가 아니라 두 의도의 충돌이다</h2><p>marker를 지우는 것으로 끝내지 말고 양쪽 branch가 왜 그 줄을 바꿨는지 이해한 뒤 최종 동작을 다시 만든다. 해결 후 test를 실행하고 merge commit 또는 rebase 결과의 history를 확인한다. 이미 공유한 branch를 강제로 다시 쓰지 않으며, 필요할 때는 <code>--force-with-lease</code>의 보호 의미를 이해하고 제한적으로 사용한다.</p>`);

  add("sql", 0, `<h2>SELECT는 작성 순서와 실행 논리가 다르다</h2><div class="concept-flow"><span>FROM·JOIN</span><i>→</i><span>WHERE</span><i>→</i><span>GROUP BY</span><i>→</i><span>HAVING</span><i>→</i><span>SELECT</span><i>→</i><span>ORDER BY</span></div><p>alias를 WHERE에서 바로 쓸 수 없는 이유도 이 논리 순서로 설명할 수 있다. NULL은 빈 문자열이나 0이 아니라 모르는 값이므로 <code>= NULL</code>이 아니라 <code>IS NULL</code>을 사용하고, 산술·비교 결과가 UNKNOWN이 될 수 있음을 고려한다.</p>`);
  add("javascript", 1, `<h2>이벤트는 target에서 끝나지 않고 전파된다</h2><p>이벤트는 capture를 거쳐 target에 도달하고 bubble 단계로 조상에게 올라간다. 반복 항목마다 listener를 붙이기보다 부모 하나에서 <code>event.target.closest()</code>로 실제 항목을 찾는 event delegation을 사용하면 동적으로 추가된 요소도 처리할 수 있다.</p><pre data-lang="JavaScript"><code>list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button || !list.contains(button)) return;
  removeItem(button.dataset.remove);
});</code></pre>`);
  add("spring-core", 1, `<h2>트랜잭션 경계는 Service의 use case에 둔다</h2><p>두 repository 변경이 하나의 업무 성공·실패를 이루면 같은 transaction으로 묶는다. RuntimeException rollback, self invocation, private method, 비동기·다른 thread로 넘어가는 경계를 확인한다. Scheduler는 같은 작업이 두 서버에서 동시에 실행될 수 있으므로 lock, idempotency key, 처리 상태를 설계하고 시작·성공·실패·소요 시간을 log로 남긴다.</p>`);

  add("infra", 0, `<h2>VM·Container·Process의 경계를 구분한다</h2><p>VM은 guest OS와 kernel을 포함하고, container는 host kernel을 공유하며 격리된 process로 실행된다. image는 실행 전 read-only layer, container는 그 image에 writable layer가 더해진 instance다. container를 삭제해도 남아야 하는 DB data와 upload는 volume 또는 외부 storage에 둔다.</p>`);
  add("infra", 2, `<h2>docker run 옵션을 연결 그림으로 읽는다</h2><pre data-lang="Shell"><code>docker run -d --name api \
  -p 8080:8080 \
  --env-file .env \
  --network app-net \
  my-api:1.0.0</code></pre><p>앞의 8080은 host, 뒤는 container port다. env file은 image 안에 복사하지 않고 실행 시 전달한다. 같은 network의 container끼리는 container 이름으로 통신하며, container 안의 localhost는 자기 자신이다.</p>`);
  add("infra", 3, `<h2>장애가 나면 container를 새로 만들기 전에 증거를 남긴다</h2><ol><li><code>docker ps -a</code>로 종료 상태와 exit code를 본다.</li><li><code>docker logs --tail 200</code>으로 첫 원인을 찾는다.</li><li><code>docker inspect</code>에서 env·mount·network를 본다.</li><li>같은 image를 동일한 env로 local에서 재현한다.</li></ol><p>container 내부를 직접 고친 결과는 재생성하면 사라진다. Dockerfile, Compose, 설정 파일을 수정해 다시 만들 수 있는 해결로 남긴다.</p>`);
  add("infra", 4, `<h2>Compose는 실행 순서가 아니라 원하는 서비스 구성을 선언한다</h2><p>service마다 image/build, port, environment, network, volume, healthcheck, restart 정책을 적는다. <code>depends_on</code>은 process 시작 순서만 다룰 수 있으므로 실제 준비 완료는 healthcheck와 애플리케이션 재시도로 보완한다. <code>docker compose config</code>로 환경 변수가 합쳐진 최종 설정을 먼저 확인한다.</p>`);
  add("infra", 5, `<h2>Registry 배포에서도 동일한 image를 이동시킨다</h2><p>서버에서 source를 다시 build하지 않고 CI가 test한 commit의 image에 고정 tag와 digest를 붙여 push한다. EC2는 그 image를 pull해 실행하고 health가 실패하면 이전 digest로 되돌린다. <code>latest</code>만 사용하면 어느 코드가 실행 중인지 증명하기 어렵다.</p>`);
  add("infra", 6, `<h2>IaC 파일도 애플리케이션 코드처럼 검증한다</h2><p>Vagrantfile은 VM 자원과 network를, Ansible은 package·file·service의 원하는 상태를 정의한다. 새 VM에서 처음부터 적용하고 같은 playbook을 두 번 실행했을 때 불필요한 변경이 없는지 확인한다. password와 key는 inventory에 평문으로 넣지 않고 vault 또는 환경별 secret 관리 방식을 사용한다.</p>`);

  add("realtime", 0, `<h2>Polling과 WebSocket은 변경 빈도와 연결 비용으로 선택한다</h2><p>가끔 바뀌는 데이터는 짧은 polling이나 Server-Sent Events가 더 단순할 수 있다. 양방향으로 자주 메시지를 주고받고 지연이 중요할 때 WebSocket을 선택한다. 연결이 열렸다는 사실만으로 전달 보장·저장·순서·인증이 해결되는 것은 아니다.</p>`);
  add("realtime", 0, `<h3>운영 연결 경로도 함께 확인한다</h3><p>HTTPS 페이지에서는 <code>wss://</code>를 사용하고 reverse proxy가 Upgrade와 Connection header를 전달해야 한다. 서버는 연결 수, 사용자별 연결 제한, inbound message 크기, 느린 client의 outbound buffer를 관찰한다. 정상 연결 test뿐 아니라 proxy timeout 뒤 끊김과 재연결도 확인한다.</p>`);
  add("realtime", 2, `<h2>저장과 전송의 순서를 먼저 결정한다</h2><p>채팅을 DB에 성공적으로 저장한 뒤 전송하면 재접속 후 history가 맞지만 DB가 느릴 때 응답도 늦어진다. 먼저 전송하면 빠르지만 저장 실패 시 화면과 DB가 달라질 수 있다. messageId, roomId, senderId, server timestamp와 처리 상태를 두고 retry에도 중복 저장되지 않게 만든다.</p>`);
  add("realtime", 3, `<h2>재연결은 연결 버튼을 다시 누르는 것보다 복잡하다</h2><p>heartbeat timeout으로 끊김을 감지하고 exponential backoff와 jitter로 재연결 폭주를 막는다. 다시 연결되면 인증 갱신, destination 재구독, 마지막 수신 offset 이후의 누락 메시지 조회를 수행한다. 여러 탭과 모바일 background 전환도 별도 시나리오로 시험한다.</p>`);
  add("realtime", 4, `<h2>Redis key는 자료형·수명·소유자를 함께 설계한다</h2><pre data-lang="Text"><code>session:{sessionId}       String · TTL
room:{roomId}:members    Set
ranking:weekly           Sorted Set
member:{memberId}        Hash</code></pre><p>TTL이 필요한 key와 영구 key를 구분하고 prefix로 충돌을 막는다. cache는 원본 DB가 아니므로 eviction이나 재시작으로 사라져도 복구할 수 있어야 한다.</p>`);
  add("realtime", 4, `<h3>Cache miss가 몰릴 때 DB도 함께 보호한다</h3><p>인기 key가 만료되는 순간 여러 요청이 동시에 DB를 조회하는 cache stampede를 막기 위해 짧은 lock, TTL 분산, 미리 갱신 전략을 검토한다. 존재하지 않는 값도 아주 짧게 caching하면 반복 공격성 조회를 줄일 수 있지만, 생성 직후까지 없다고 보이지 않도록 invalidation 정책을 함께 둔다.</p>`);
  add("realtime", 5, `<h2>Pub/Sub과 Stream은 놓친 메시지를 다루는 방식이 다르다</h2><p>Pub/Sub은 그 순간 연결된 subscriber에게만 전달하며 offline consumer의 메시지를 보관하지 않는다. Stream은 entry를 저장하고 consumer group, pending 목록, ack로 처리 상태를 추적할 수 있다. 업무 이벤트처럼 재처리와 확인이 필요하면 Stream 또는 전문 broker를 선택하고, 단순 실시간 알림은 Pub/Sub이 가볍다.</p>`);
})();
