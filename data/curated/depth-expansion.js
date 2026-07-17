/* 이미 아는 사람용 요약으로 끝났던 장을, 처음 다시 공부해도 흐름이 이어지도록 보강한다. */
(function () {
  const category = (slug) => (window.CURATED_STUDY || []).find((item) => item.slug === slug);
  const add = (slug, index, html) => {
    const lesson = category(slug)?.lessons[index];
    if (lesson) lesson.body += html;
  };

  add("git", 0, `<h2>파일 하나가 커밋되기까지 실제로 무슨 일이 일어날까?</h2>
  <p>파일을 수정했다고 Git 저장소의 이력이 바로 바뀌는 것은 아니다. 수정된 파일은 먼저 Working Tree에만 존재한다. <code>git add</code>를 실행하면 현재 파일의 내용이 Staging Area에 복사되고, <code>git commit</code>은 그 staging 상태를 하나의 commit으로 저장한다. 따라서 add 이후 파일을 다시 수정하면 같은 파일 안에도 <em>staging된 변경</em>과 <em>아직 staging되지 않은 변경</em>이 동시에 존재할 수 있다.</p>
  <pre data-lang="Shell"><code>git status
git diff           # 아직 add하지 않은 차이
git diff --staged  # 다음 commit에 들어갈 차이</code></pre>
  <p>commit은 변경 파일만 따로 보관하는 메모가 아니라, 그 시점 프로젝트 전체의 상태를 가리키는 snapshot과 부모 commit 정보, 작성자, 메시지를 함께 가진다. 그래서 commit 사이의 차이를 비교하거나 특정 시점으로 이동할 수 있다.</p>
  <h2>restore·reset·revert를 언제 구분해서 써야 할까?</h2>
  <p>아직 commit하지 않은 작업 파일을 되돌릴 때는 <code>git restore</code>, staging에서만 빼고 수정 내용은 남길 때는 <code>git restore --staged</code>를 사용한다. 이미 팀에 push한 commit을 취소하려면 기존 이력을 삭제하지 않고 반대 변경을 새 commit으로 만드는 <code>git revert</code>가 안전하다. <code>reset</code>은 branch 포인터 자체를 옮기므로 개인 로컬 이력을 정리할 때만 신중하게 사용한다.</p>`);

  add("git", 1, `<h2>브랜치는 폴더 복사가 아니라 commit을 가리키는 이름이다</h2>
  <p>새 브랜치를 만들 때 프로젝트 파일 전체가 한 벌 더 복사되는 것은 아니다. branch는 특정 commit을 가리키는 움직일 수 있는 이름이고, HEAD는 현재 작업 중인 branch를 가리킨다. 새 commit을 만들면 현재 branch 포인터만 새 commit으로 이동한다. 이 구조를 이해하면 branch 생성과 전환이 빠른 이유, 같은 파일을 고쳤을 때만 충돌이 생기는 이유가 보인다.</p>
  <h2>충돌은 오류가 아니라 Git이 대신 결정할 수 없는 상태다</h2>
  <p>두 branch가 같은 줄 주변을 서로 다르게 바꾸면 Git은 어느 변경이 최종 의도인지 알 수 없다. 이때 conflict marker의 위쪽과 아래쪽 중 하나를 무조건 지우는 것이 아니라, 두 변경이 각각 해결하려던 요구사항을 확인해 최종 코드를 직접 만든다. marker를 제거한 뒤에는 <code>git diff</code>와 테스트로 합쳐진 결과가 양쪽 기능을 모두 보존하는지 확인한다.</p>
  <pre data-lang="Shell"><code>git fetch origin
git log --oneline --graph --all
git merge origin/main
# 충돌 파일 수정 후
git add 충돌파일
git commit</code></pre>
  <p><code>pull</code>은 fetch와 통합을 한 번에 실행하므로 편하지만, 협업에서는 먼저 fetch로 원격 이력을 보고 어떤 통합이 일어날지 확인하는 습관이 안전하다.</p>`);

  add("infra", 0, `<h2>컨테이너는 작은 가상 머신이 아니다</h2>
  <p>VM은 Hypervisor 위에 guest OS와 kernel을 각각 올린다. 반면 컨테이너는 host의 Linux kernel을 공유하면서 namespace로 process·network·filesystem을 분리하고 cgroup으로 CPU와 memory 사용량을 제한한다. 그래서 시작이 빠르고 가볍지만, host kernel과 완전히 독립된 컴퓨터는 아니다.</p>
  <p>Image는 여러 read-only layer가 쌓인 실행 설계도이고, Container를 시작하면 그 위에 쓰기 가능한 layer 하나가 추가된다. 실행 중 만든 파일은 이 container layer에만 있으므로 container를 삭제하면 함께 사라진다. 영구 데이터는 volume이나 외부 DB·object storage로 분리해야 한다.</p>
  <h2>같은 이미지인데 왜 환경마다 다르게 실행할 수 있을까?</h2>
  <p>Image에는 변하지 않는 애플리케이션과 runtime을 넣고, DB 주소·비밀번호·profile·port처럼 환경마다 달라지는 값은 실행 시 환경 변수로 주입한다. 이 원칙을 지키면 개발·테스트·운영이 같은 image digest를 사용하면서 설정만 다르게 가질 수 있다.</p>`);

  add("infra", 1, `<h2>Dockerfile은 명령 목록이 아니라 layer를 만드는 순서다</h2>
  <p><code>FROM</code>은 출발 image, <code>WORKDIR</code>은 이후 명령의 기준 폴더, <code>COPY</code>는 build context의 파일을 image에 넣는 단계다. <code>RUN</code>은 build할 때 한 번 실행되고, <code>ENTRYPOINT</code>와 <code>CMD</code>는 container가 시작할 때 실행된다. 이 둘을 섞으면 build는 성공했는데 실행 직후 종료되는 일이 생긴다.</p>
  <h2>빌드와 실행을 분리하는 multi-stage build</h2>
  <pre data-lang="Dockerfile"><code>FROM eclipse-temurin:21-jdk AS builder
WORKDIR /source
COPY . .
RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /source/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]</code></pre>
  <p>앞 단계에는 Gradle과 source가 필요하지만 최종 단계에는 JRE와 JAR만 남는다. 결과 image가 작아지고 build 도구와 source가 운영 image에 들어가지 않는다. 의존성 파일을 먼저 copy하도록 순서를 조정하면 source만 바뀔 때 dependency layer cache도 재사용할 수 있다.</p>`);

  add("infra", 2, `<h2><code>-p 8080:8080</code>에서 두 숫자는 서로 다른 공간이다</h2>
  <p>앞 숫자는 host가 외부 요청을 받을 port이고 뒤 숫자는 container 안에서 애플리케이션이 listen하는 port다. Spring Boot가 container 내부에서 8080으로 실행된다면 <code>-p 80:8080</code>으로 host의 80번 요청을 연결할 수도 있다. <code>EXPOSE</code>는 문서 역할에 가깝고, 실제 host 공개는 <code>-p</code>가 만든다.</p>
  <h2>환경 변수와 volume은 image 밖의 상태를 맡는다</h2>
  <p><code>--env-file</code>에는 환경마다 다른 설정을 두되 저장소에는 실제 값 대신 <code>.env.example</code>만 남긴다. volume은 host가 관리하는 저장 공간을 container 경로에 연결한다. named volume은 Docker가 위치를 관리하고 bind mount는 특정 host 경로를 직접 연결한다. 운영 DB는 volume만 믿기보다 backup과 restore 절차까지 있어야 한다.</p>
  <pre data-lang="Shell"><code>docker port ahj-api
docker inspect ahj-api --format '{{json .Config.Env}}'
docker volume inspect pgdata</code></pre>`);

  add("infra", 3, `<h2>장애 진단은 바깥에서 안쪽으로 좁혀 간다</h2>
  <p>먼저 container가 존재하고 실행 중인지 <code>docker ps -a</code>로 본다. 종료됐다면 exit code와 logs를 확인한다. 실행 중이라면 host port가 publish됐는지, 애플리케이션이 container 안에서 실제로 해당 port를 listen하는지, health URL이 내부에서 응답하는지 순서대로 확인한다.</p>
  <pre data-lang="Shell"><code>docker inspect -f '{{.State.Status}} {{.State.ExitCode}}' ahj-api
docker exec ahj-api sh -c 'wget -qO- http://127.0.0.1:8080/actuator/health'
curl -v http://127.0.0.1:8080/actuator/health</code></pre>
  <p>내부 호출도 실패하면 Java 실행·profile·DB 연결 같은 애플리케이션 문제다. 내부는 성공하지만 host 호출이 실패하면 port publish나 host firewall 문제다. host에서는 성공하지만 외부에서만 실패하면 cloud 보안 그룹·reverse proxy·DNS 순으로 범위를 넓힌다.</p>
  <div class="note-warning"><strong>로그만 보고 끝내지 않는다</strong><p>OOMKilled, restart count, disk full, health 상태처럼 log 밖의 실행 정보도 inspect와 stats로 확인해야 한다.</p></div>`);

  add("infra", 4, `<h2>Compose가 해결하는 것은 ‘여러 run 명령의 관계’다</h2>
  <p>API와 DB를 각각 긴 <code>docker run</code> 명령으로 실행하면 network·volume·환경 변수 관계를 사람이 기억해야 한다. Compose 파일은 각 service가 어떤 image를 쓰고, 누구와 통신하며, 무엇을 보존하는지를 선언한다. 같은 Compose project의 service는 기본 network에 함께 연결되고 service 이름을 DNS처럼 사용한다.</p>
  <p>API container에서 <code>localhost</code>는 DB가 아니라 API container 자신이다. DB 주소는 <code>db:5432</code>처럼 service 이름을 사용한다. host PC의 DB 관리 도구에서 접속할 때만 publish한 host port를 사용한다.</p>
  <h2>시작됨과 준비됨은 다르다</h2>
  <p>DB process가 시작됐다고 즉시 connection을 받을 준비가 된 것은 아니다. healthcheck로 실제 준비 상태를 검사하고 API에는 일정 시간 재시도 정책을 둔다. <code>docker compose ps</code>, <code>logs</code>, <code>config</code>를 함께 보면 최종 적용 설정과 준비 상태를 확인할 수 있다.</p>`);

  add("infra", 5, `<h2>배포 대상은 source가 아니라 식별 가능한 image다</h2>
  <p>서버에서 git pull 후 직접 build하면 서버마다 build 도구와 cache가 달라 결과가 어긋날 수 있다. CI가 한 번 build하고 test한 image에 version 또는 commit SHA tag를 붙여 registry에 올린 뒤, 모든 서버가 같은 image를 pull하도록 해야 한다.</p>
  <h2>업데이트와 rollback을 한 쌍으로 준비한다</h2>
  <p>새 image를 pull했다고 기존 container가 자동으로 바뀌지는 않는다. 새 container를 시작하고 health check와 핵심 API를 확인한 뒤 트래픽을 넘긴다. 실패하면 이전 tag로 다시 실행할 수 있어야 한다. 환경 변수 파일과 volume은 image 교체와 분리해 보존한다.</p>
  <pre data-lang="Shell"><code>docker image inspect USER/ahj-api:1.0.0 --format '{{.Id}}'
docker logs --tail 100 ahj-api
curl -f http://127.0.0.1:8080/actuator/health
# 실패 시 이전 tag로 다시 run</code></pre>`);

  add("infra", 6, `<h2>Vagrant와 Ansible은 같은 일을 하는 도구가 아니다</h2>
  <p>Vagrant는 VM의 box·CPU·memory·network·공유 폴더를 정의해 ‘컴퓨터’를 준비한다. Ansible은 이미 준비된 host에 package가 설치돼 있는지, 설정 파일이 원하는 내용인지, service가 실행 중인지 선언해 ‘컴퓨터 안의 상태’를 맞춘다.</p>
  <p>Ansible task는 한 번 성공하는 shell script가 아니라 여러 번 실행해도 최종 상태가 같아야 한다. package 설치 여부를 직접 grep하고 명령을 실행하기보다 apt·copy·template·service 같은 module로 원하는 상태를 표현한다. 변경이 있을 때만 handler로 service를 재시작하면 불필요한 중단도 줄어든다.</p>
  <h2>재현 가능하다는 말의 실제 기준</h2>
  <p>새 PC에서 저장소를 clone한 사람이 문서대로 한두 명령을 실행해 같은 port와 version의 환경을 만들 수 있어야 한다. 코드 리뷰에서 인프라 변경 이유를 볼 수 있고, 실패한 변경을 이전 commit으로 되돌릴 수 있어야 IaC의 장점이 생긴다.</p>`);

  add("realtime", 0, `<h2>HTTP 요청·응답 모델에서 무엇이 달라질까?</h2>
  <p>일반 HTTP에서는 client가 요청해야 server가 응답할 수 있다. 새 알림이 있는지 3초마다 polling하면 구현은 단순하지만 변화가 없어도 요청이 반복되고, 변화가 생긴 직후라도 다음 polling까지 기다린다. WebSocket은 처음 HTTP handshake를 한 뒤 protocol을 전환해 하나의 TCP 연결에서 양쪽이 frame을 보낼 수 있게 한다.</p>
  <p>연결이 오래 유지된다는 것은 공짜가 아니다. server는 동시 connection을 관리해야 하고, load balancer의 idle timeout, mobile network 전환, browser 절전, server 재배포로 연결이 언제든 끊길 수 있다. 그래서 실시간 기능은 ‘메시지 보내기’보다 연결 상태와 복구 흐름까지 포함해 설계한다.</p>
  <h2>무엇을 WebSocket으로 보내지 않을까?</h2>
  <p>초기 채팅 목록 조회, 검색, 파일 업로드처럼 요청과 결과가 명확한 작업은 HTTP가 편하다. 새 메시지 도착과 접속 상태처럼 server가 먼저 알려야 하는 변화만 WebSocket으로 전달하면 API 책임이 선명해진다.</p>`);

  add("realtime", 1, `<h2>WebSocket 위에 STOMP를 올리는 이유</h2>
  <p>순수 WebSocket은 byte나 text frame을 주고받는 통로만 제공한다. 어떤 방을 구독하는지, 메시지를 어디로 보내는지, 연결을 어떻게 시작하고 종료하는지는 애플리케이션이 직접 규칙을 만들어야 한다. STOMP는 CONNECT·SUBSCRIBE·SEND 같은 command와 destination 규칙을 제공해 이 구조를 통일한다.</p>
  <p><code>/ws</code>는 처음 연결할 endpoint다. client가 <code>/app/rooms/1/messages</code>로 SEND하면 application prefix가 제거된 destination을 <code>@MessageMapping</code>이 처리한다. server가 <code>/topic/rooms/1</code>로 publish하면 그 topic을 SUBSCRIBE한 여러 client가 받는다. endpoint와 application destination, broker destination을 같은 종류의 URL로 보면 흐름이 헷갈린다.</p>
  <h2>개인 알림은 broadcast와 다르게 본다</h2>
  <p>방 전체에는 topic을 사용하지만 특정 사용자 한 명에게 보내는 알림은 user destination과 인증된 Principal을 이용한다. client가 임의의 user ID를 보내게 두면 다른 사람의 알림을 구독하는 권한 문제가 생긴다.</p>`);

  add("realtime", 2, `<h2>클라이언트가 보낸 메시지를 그대로 방송하면 안 된다</h2>
  <p>요청 DTO에는 사용자가 입력할 수 있는 본문과 필요한 client 식별자만 둔다. 작성자 ID·작성 시각·권한·최종 message ID는 server가 인증 정보와 DB 결과를 기준으로 만든다. client 값을 그대로 신뢰하면 다른 사용자를 사칭하거나 시각과 방 번호를 조작할 수 있다.</p>
  <p>저장 후 방송하는 방식에서는 구독자가 받은 message ID를 기준으로 목록과 중복을 관리할 수 있다. 저장은 성공했지만 방송이 실패한 경우에는 재조회로 복구할 수 있지만, 방송부터 하고 저장이 실패하면 화면에만 존재하는 메시지가 생긴다. 더 높은 전달 보장이 필요하면 DB transaction과 message broker 사이의 불일치를 outbox pattern 같은 방식으로 다룬다.</p>
  <h2>화면에서는 optimistic UI와 확정 메시지를 구분한다</h2>
  <p>전송 직후 임시 ID로 메시지를 먼저 보여 줄 수 있지만, server가 돌려준 확정 ID를 받으면 교체해야 한다. timeout 뒤 재전송할 때도 같은 client request ID를 사용하면 중복 저장을 막는 기준이 된다.</p>`);

  add("realtime", 3, `<h2>HTTP 인증이 됐다고 STOMP message가 자동으로 안전한 것은 아니다</h2>
  <p>연결 단계에서 token을 검증해 Principal을 만들고, SUBSCRIBE와 SEND마다 사용자가 해당 room에 참여할 권한이 있는지 확인한다. endpoint 연결 허용, destination 구독 권한, message 전송 권한은 서로 다른 검사다. URL에 token을 넣으면 proxy log와 browser history에 남을 수 있으므로 전달 방식도 검토한다.</p>
  <h2>재연결은 새 연결을 하나 더 만드는 과정이다</h2>
  <p>기존 subscription을 정리하지 않은 채 다시 연결하면 같은 callback이 여러 번 등록된다. 연결 상태를 한곳에서 관리하고 disconnect 시 subscription reference를 해제한 뒤, 재연결 성공 시 필요한 방만 다시 구독한다. 재시도 간격은 즉시 무한 반복하지 말고 1초, 2초, 4초처럼 늘리며 최대값과 jitter를 둔다.</p>
  <p>heartbeat는 메시지가 없을 때도 연결 생존 여부를 확인하는 신호다. client와 server 양쪽 설정, 중간 proxy timeout보다 짧은 주기를 함께 맞춰야 실제 끊김을 발견할 수 있다.</p>`);

  add("realtime", 4, `<h2>Redis는 빠른 DB가 아니라 memory 기반 자료구조 server다</h2>
  <p>모든 값을 String으로 저장할 수도 있지만, 목적에 맞는 자료형을 쓰면 server가 원자적으로 연산해 준다. 접속자 집합은 Set, 점수 순위는 Sorted Set, object 일부 필드는 Hash, 처리해야 할 이벤트는 Stream처럼 선택한다. 자료형을 먼저 고르고 key 이름 규칙과 만료 정책을 함께 정한다.</p>
  <h2>Cache Aside를 요청 하나로 따라가기</h2>
  <ol><li>애플리케이션이 Redis에서 key를 조회한다.</li><li>값이 있으면 DB를 호출하지 않고 반환한다.</li><li>값이 없으면 DB를 조회한다.</li><li>DB 결과를 TTL과 함께 Redis에 저장하고 반환한다.</li><li>DB 원본이 변경되면 관련 cache를 삭제하거나 갱신한다.</li></ol>
  <p>TTL은 memory 정리만 위한 값이 아니라 오래된 데이터를 얼마나 허용할지 정하는 업무 규칙이다. 너무 짧으면 cache miss가 많아지고 너무 길면 변경 전 값이 오래 보인다. 존재하지 않는 값도 짧게 cache하지 않으면 같은 잘못된 조회가 DB에 반복될 수 있다.</p>`);

  add("realtime", 5, `<h2>Pub/Sub은 방송이고 Streams는 수신 확인이 가능한 장부다</h2>
  <p>Pub/Sub publisher가 channel에 메시지를 보내면 현재 연결된 subscriber만 받는다. subscriber가 잠시 끊겼거나 처리 중 실패해도 Redis가 다시 전달하지 않는다. 따라서 여러 WebSocket server 사이에 ‘지금 접속한 사용자에게 즉시 알리기’에는 적합하지만 작업 유실이 허용되지 않는 queue로 쓰면 안 된다.</p>
  <p>Streams는 entry ID와 함께 메시지를 저장한다. consumer group은 여러 worker가 작업을 나눠 받고, 처리한 메시지에 ACK를 남긴다. ACK되지 않은 pending 메시지를 확인해 다른 consumer가 재처리할 수 있지만, 중복 전달 가능성은 있으므로 consumer 작업은 같은 이벤트를 다시 처리해도 안전하게 만든다.</p>
  <h2>서버가 여러 대일 때의 전체 경로</h2>
  <div class="concept-flow"><span>Client A</span><i>→</i><span>Server 1</span><i>→</i><span>Redis</span><i>→</i><span>Server 2</span><i>→</i><span>Client B</span></div>
  <p>각 server는 자신에게 연결된 client만 직접 알고 있다. Redis나 외부 broker가 instance 사이의 공통 전달망이 되어야 어느 server에 접속했는지와 무관하게 같은 room의 메시지를 받을 수 있다.</p>`);

  add("setup", 0, `<h2>설치가 끝났다는 기준을 단계별로 확인한다</h2>
  <p>Node 설치 화면이 끝났다는 것과 프로젝트가 실행된다는 것은 다르다. 새 terminal을 열어 <code>node -v</code>와 <code>npm -v</code>가 모두 출력되는지 확인하고, 프로젝트 폴더에서 <code>package.json</code>이 있는 위치를 기준으로 install과 dev 명령을 실행한다. terminal의 현재 경로가 다른데 명령부터 실행하면 package.json을 찾지 못한다.</p>
  <pre data-lang="Shell"><code>node -v
npm -v
npm install
npm run dev
npm run build</code></pre>
  <p><code>npm run dev</code>는 개발 server를 켜는 명령이라 terminal을 닫으면 함께 종료된다. 화면이 보이는 것만으로 끝내지 말고 production build도 성공해야 import 대소문자, 누락 파일, build 환경 문제를 미리 발견할 수 있다.</p>`);

  add("setup", 1, `<h2>Proxy가 필요한 상황을 먼저 구분한다</h2>
  <p>개발 중 Vite는 보통 5173, Spring Boot는 8080처럼 서로 다른 origin에서 실행된다. browser가 React에서 Spring으로 직접 요청하면 CORS 검사가 발생한다. Vite dev proxy를 설정하면 browser는 같은 5173의 <code>/api</code>로 요청하고, Vite가 server 쪽에서 8080으로 대신 전달한다.</p>
  <pre data-lang="JavaScript"><code>server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}</code></pre>
  <p>Network 탭에는 browser가 요청한 URL이 보이고 Spring log에는 proxy가 전달한 URL이 남는다. 404라면 prefix가 중복되거나 빠졌는지, CORS라면 요청이 proxy를 거치지 않고 백엔드로 직접 갔는지 먼저 본다. build된 정적 파일에는 Vite dev server가 없으므로 운영에서는 Nginx나 실제 API URL 설정이 이 역할을 맡는다.</p>`);

  add("setup", 2, `<h2>Initializr의 선택 항목은 서로 연결돼 있다</h2>
  <p>Java version은 개발 PC의 JDK뿐 아니라 Gradle toolchain과 배포 server runtime이 모두 지원해야 한다. Spring Boot version을 정하면 호환되는 Gradle plugin과 dependency 묶음이 따라온다. 강의 화면의 숫자를 그대로 복사하기보다 현재 프로젝트의 기준 버전을 먼저 정하고 팀 전체가 wrapper로 같은 build를 실행하게 한다.</p>
  <p>Spring Web을 추가하면 embedded server와 MVC 기본 구성이 들어오지만, DB driver만 추가하고 접속 정보를 주지 않으면 DataSource 자동 설정 단계에서 실행이 실패할 수 있다. 처음에는 Web만으로 부팅을 확인한 뒤 DB 설정을 연결하거나, 필요한 환경 변수를 함께 준비한다.</p>
  <h2>생성 직후 남겨야 하는 첫 번째 정상 상태</h2>
  <p><code>./gradlew test</code>, <code>bootRun</code>, health 또는 간단한 endpoint, <code>bootJar</code>를 차례로 확인하고 첫 commit을 남긴다. 이후 문제가 생기면 Initializr 자체 문제인지 새 설정 문제인지 비교할 기준점이 된다.</p>`);

  add("setup", 3, `<h2>Spring Boot에서 JSP가 추가 설정을 요구하는 이유</h2>
  <p>Thymeleaf처럼 Boot가 주로 지원하는 template과 달리 JSP는 servlet container의 Jasper compiler와 JSTL 의존성, view prefix·suffix, packaging 조건을 함께 맞춰야 한다. Controller가 <code>member/list</code>를 반환하면 ViewResolver가 prefix와 suffix를 붙여 실제 JSP 경로를 찾는다.</p>
  <div class="concept-flow"><span>/members 요청</span><i>→</i><span>@Controller</span><i>→</i><span>Model 저장</span><i>→</i><span>member/list</span><i>→</i><span>WEB-INF/views/member/list.jsp</span></div>
  <p>WEB-INF 아래 파일은 browser URL로 직접 접근할 수 없다. 반드시 Controller를 거쳐 Model이 준비된 뒤 forward되므로 화면과 요청 제어가 분리된다. 404가 나면 mapping, 반환한 view 이름, prefix·suffix, 실제 파일 경로를 앞에서부터 맞춰 본다.</p>`);

  add("setup", 4, `<h2>관리자 계정과 애플리케이션 계정을 분리한다</h2>
  <p>SYS나 SYSTEM은 DB 자체를 관리하는 계정이지 애플리케이션이 CRUD할 계정이 아니다. 프로젝트용 사용자를 만들고 필요한 table·sequence 권한과 tablespace quota만 부여한다. 이렇게 해야 잘못된 SQL이 다른 schema나 DB 설정까지 바꾸는 범위를 줄일 수 있다.</p>
  <p>접속이 실패하면 비밀번호부터 반복 입력하지 말고 listener가 실행 중인지, host와 port가 맞는지, SID가 필요한지 service name이 필요한지, 접속한 사용자 기준으로 table이 존재하는지 구분한다. SQL Developer에서 성공한 접속 정보와 애플리케이션 JDBC URL의 각 항목을 나란히 비교하면 원인을 빨리 찾을 수 있다.</p>
  <h2>DDL도 프로젝트 이력으로 남긴다</h2>
  <p>수업 중 console에서 실행한 CREATE 문만 남기면 새 환경에서 같은 schema를 만들 수 없다. 순서가 있는 migration 파일로 table·constraint·index·seed를 나누고, 어느 파일까지 적용됐는지 확인할 수 있게 관리한다.</p>`);

  add("setup", 5, `<h2>MyBatis 연결은 다섯 고리가 모두 맞아야 한다</h2>
  <div class="concept-flow"><span>DataSource</span><i>→</i><span>Mapper scan</span><i>→</i><span>Interface</span><i>→</i><span>XML namespace/id</span><i>→</i><span>Result mapping</span></div>
  <p>DB 접속이 된다고 Mapper가 연결된 것은 아니다. Spring이 interface를 bean으로 찾고, XML resource를 읽고, namespace와 interface 전체 이름을 맞추고, 메서드 이름과 statement id를 맞춰야 한다. 반환 열 이름과 Java field 이름이 다르면 resultMap이나 alias도 필요하다.</p>
  <p><code>#{id}</code>는 PreparedStatement parameter로 안전하게 binding하지만 <code>\${}</code>는 문자열을 SQL에 직접 붙인다. 정렬 열처럼 구조를 동적으로 넣어야 할 때도 허용 목록으로 제한하지 않으면 SQL injection이 생긴다.</p>
  <h2>첫 테스트는 복잡한 화면이 아니라 Mapper 한 건으로 한다</h2>
  <p>고정된 SELECT 1건과 parameter 1개부터 실행해 SQL log, binding 값, 결과 객체를 확인한다. 그다음 목록·등록·수정 영향 행 수와 transaction rollback을 단계별로 늘리면 어느 연결 고리에서 실패했는지 알 수 있다.</p>`);

  add("setup", 6, `<h2><code>git init</code> 전에 저장소의 경계를 확인한다</h2>
  <p>현재 폴더에서 init하면 그 아래 모든 파일이 추적 후보가 된다. 상위 Desktop이나 여러 프로젝트를 함께 담은 폴더에서 잘못 실행하지 않도록 <code>pwd</code>와 파일 목록을 먼저 본다. <code>.gitignore</code>를 첫 add보다 먼저 만들어 node_modules, build, IDE 설정, 환경 변수, key 파일을 제외한다.</p>
  <p>remote 저장소에 README commit이 이미 있고 로컬에도 별도 첫 commit이 있으면 두 이력의 출발점이 다르다. 무조건 force push하지 말고 remote log를 확인해 pull로 합칠지, 깨끗하게 clone해 파일을 옮길지 결정한다.</p>
  <h2>다른 사람이 clone해서 실행할 수 있어야 초기 설정이 끝난다</h2>
  <p>README의 version·환경 변수 이름·DB 준비·실행·테스트 순서만 보고 새 폴더에서 build가 되는지 확인한다. 내 PC의 전역 설정이나 IDE 자동 보정에만 의존한 부분은 이 과정에서 드러난다.</p>`);

  add("setup", 7, `<h2>보안 그룹 규칙은 ‘누가 어느 문으로 들어오는가’다</h2>
  <p>8080 port를 열었다는 사실만 보지 말고 source가 내 IP인지, load balancer 보안 그룹인지, 전 세계인지 확인한다. SSH 22는 관리하는 IP로 제한하고, RDS port는 EC2 보안 그룹에서 오는 요청만 허용하는 것이 기본이다. 보안 그룹은 애플리케이션 내부 인증을 대신하지 않는다.</p>
  <h2>연결은 각 구간을 따로 검사한다</h2>
  <ol><li>EC2 내부에서 Spring이 localhost port에 응답하는지 확인한다.</li><li>EC2에서 RDS endpoint와 port에 연결되는지 확인한다.</li><li>EC2의 IAM role로 S3 작업이 되는지 확인한다.</li><li>외부에서 공개 URL과 HTTPS가 정상인지 확인한다.</li></ol>
  <p>한 번에 browser 화면만 보면 어느 구간이 막혔는지 알 수 없다. 각 구간의 성공 증거를 남긴 뒤 다음 구간으로 이동하면 보안 그룹, 환경 변수, 애플리케이션 오류를 분리할 수 있다.</p>`);

  add("setup", 8, `<h2>‘내 컴퓨터에서는 됨’을 없애는 확인 절차</h2>
  <p>기존 container와 volume이 남아 있으면 설정이 틀려도 예전 데이터 덕분에 실행될 수 있다. 중요한 데이터를 backup한 뒤 새 clone과 빈 환경에서 image를 다시 build하고 Compose를 올려 본다. README에 적은 단 한 번의 명령으로 준비되는지, health가 성공하는지, container를 다시 만들어도 필요한 데이터가 남는지 확인한다.</p>
  <p>Vagrant는 host의 VirtualBox·Hyper-V 조건과 port 충돌 영향을 받는다. VM 내부에서는 guest port, host browser에서는 forwarded host port를 사용한다. provisioning 실패 후 다시 <code>vagrant provision</code>해도 중복 설치나 설정 파일 손상이 없어야 한다.</p>
  <h2>재현 파일에 넣지 말아야 할 것</h2>
  <p>실제 password·token·private key는 image, Vagrantfile, Compose file에 직접 쓰지 않는다. 필요한 변수 이름과 예시만 저장하고 실제 값은 환경 변수나 secret 저장소에서 주입한다.</p>`);

  add("infra", 0, `<h2>프로세스 관점으로 한 번 더 구분하기</h2>
  <p>같은 image로 container 두 개를 실행하면 각각 별도의 process ID 공간과 filesystem 변경 layer, network 주소를 가진다. 하나가 종료돼도 다른 하나는 계속 실행된다. 다만 둘 다 같은 host 자원을 사용하므로 memory 제한을 두지 않은 container 하나가 host 전체를 압박할 수 있다.</p>
  <p><code>docker image ls</code>는 실행 설계도 목록, <code>docker ps</code>는 현재 실행 instance 목록이다. image를 지우려는데 사용 중이라는 오류가 나면 그 image에서 만들어진 container가 남아 있는지 먼저 확인한다.</p>`);

  add("infra", 1, `<h2>Spring Boot 실행 옵션은 image를 다시 만들지 않고 주입한다</h2>
  <pre data-lang="Shell"><code>docker run -e SPRING_PROFILES_ACTIVE=prod \
  -e JAVA_TOOL_OPTIONS="-Xms256m -Xmx512m" \
  ahj/app:1.0.0</code></pre>
  <p>profile과 memory limit은 환경별로 달라질 수 있으므로 Dockerfile에 고정하지 않는다. container memory 제한보다 JVM 최대 heap이 지나치게 크면 kernel이 process를 종료할 수 있다. image 안에 어떤 파일이 들어갔는지는 <code>docker history</code>와 임시 container로 확인하고, Secret이 layer에 들어갔다면 최종 파일을 삭제해도 이전 layer에는 남을 수 있으므로 image를 새로 설계해야 한다.</p>`);

  add("infra", 2, `<h2>DB 연결 문자열의 localhost를 특히 조심한다</h2>
  <p>Spring container에서 <code>localhost:5432</code>는 같은 container 안의 5432를 뜻한다. DB도 Compose에 있다면 service 이름을 사용하고, host PC에 있는 DB에 연결하려면 운영체제별 host gateway 주소를 사용한다. RDS처럼 외부 DB라면 endpoint와 보안 그룹을 확인한다.</p>
  <p>환경 변수 이름이 Spring property 이름과 어떻게 매핑되는지도 확인한다. 예를 들어 <code>SPRING_DATASOURCE_URL</code>은 <code>spring.datasource.url</code>에 대응한다. inspect 출력에는 비밀이 보일 수 있으므로 운영 화면이나 로그에 그대로 남기지 않는다.</p>`);

  add("infra", 3, `<h2>자주 만나는 종료 상태를 해석한다</h2>
  <table><tr><th>상태</th><th>먼저 볼 것</th></tr><tr><td>Exited (0)</td><td>주 process가 정상 종료됨. server 명령이 foreground로 유지되는지 확인</td></tr><tr><td>Exited (1)</td><td>애플리케이션 예외, 잘못된 command·설정</td></tr><tr><td>Exited (137)</td><td>SIGKILL 또는 memory 부족 가능성</td></tr><tr><td>Restarting</td><td>restart policy 때문에 실패와 재시작이 반복됨</td></tr></table>
  <p>container의 수명은 PID 1인 주 process의 수명과 같다. background로 Java를 띄운 뒤 shell이 끝나는 script를 entrypoint로 쓰면 Java가 남아 있을 것 같아도 container는 종료될 수 있다.</p>`);

  add("infra", 4, `<h2>Compose에서 설정이 실제로 어떻게 합쳐졌는지 본다</h2>
  <pre data-lang="Shell"><code>docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f api
docker compose down       # volume은 유지
docker compose down -v    # volume도 삭제하므로 주의</code></pre>
  <p><code>config</code>는 환경 변수 치환과 여러 Compose 파일 병합이 끝난 최종 결과를 보여 준다. 데이터가 필요한 환경에서 <code>down -v</code>를 습관적으로 실행하면 DB volume까지 사라지므로 명령의 범위를 먼저 확인한다. 개발 편의를 위한 bind mount와 운영 image 배포 설정도 같은 파일에 무리하게 섞지 않는다.</p>`);

  add("infra", 5, `<h2>배포 작업표에는 확인과 실패 시 행동까지 적는다</h2>
  <ol><li>배포할 image tag와 digest를 기록한다.</li><li>현재 실행 version과 환경 변수 파일 backup 위치를 확인한다.</li><li>새 image를 pull하고 container를 교체한다.</li><li>health뿐 아니라 로그인·DB 쓰기 같은 핵심 기능을 확인한다.</li><li>실패하면 이전 tag로 복귀하고 원인 log를 보존한다.</li></ol>
  <p>오래된 image 정리는 새 배포가 안정된 뒤 수행한다. 즉시 모두 지우면 rollback할 image를 다시 내려받느라 복구가 늦어진다. 외부에서 접속되는 것과 process가 살아 있는 것은 다른 조건이므로 reverse proxy와 HTTPS까지 최종 경로로 검사한다.</p>`);

  add("infra", 6, `<h2>Inventory와 playbook을 분리해 읽는다</h2>
  <pre data-lang="INI"><code>[app]
app-01 ansible_host=10.0.1.10
app-02 ansible_host=10.0.1.11

[app:vars]
ansible_user=ubuntu</code></pre>
  <p>inventory는 어떤 host를 어떤 group으로 관리하는지 정의하고 playbook은 그 group이 가져야 할 상태를 정의한다. <code>--check</code>로 변경 예상 범위를 보고, 한 대에 먼저 적용한 뒤 전체로 넓힐 수 있다. 비밀번호나 private key를 평문 변수 파일에 넣지 않고 Vault 또는 별도 Secret 관리 방식을 사용한다.</p>`);

  add("realtime", 0, `<h2>연결 상태도 화면 state로 관리해야 한다</h2>
  <p>화면은 단순히 socket 객체가 있는지만 보지 않고 connecting·connected·reconnecting·failed 상태를 구분해야 한다. 연결 중에는 중복 send를 막고, 끊겼을 때는 사용자에게 재연결 중임을 알리며, 복구 후에는 놓친 데이터를 HTTP로 다시 조회할지 결정한다.</p>
  <p>실시간 숫자 하나만 필요하고 양방향 전송이 없다면 Server-Sent Events도 선택지가 된다. 기술 이름부터 고르지 말고 server push 필요 여부, 양방향 여부, 메시지 빈도, 유실 허용 여부를 먼저 적는다.</p>`);

  add("realtime", 1, `<h2>클라이언트 코드를 연결·구독·정리 순서로 읽는다</h2>
  <pre data-lang="JavaScript"><code>client.onConnect = () =&gt; {
  subscription = client.subscribe('/topic/rooms/1', frame =&gt; {
    const message = JSON.parse(frame.body);
    renderMessage(message);
  });
};
client.activate();

// 화면 종료 시
subscription?.unsubscribe();
client.deactivate();</code></pre>
  <p>activate 직후가 아니라 onConnect 이후에 구독해야 한다. React에서는 effect cleanup에서 unsubscribe와 deactivate를 처리하고, 연결 객체를 render마다 새로 만들지 않도록 생명주기를 한곳에 둔다.</p>`);

  add("realtime", 2, `<h2>메시지 응답에는 화면 복구에 필요한 값을 담는다</h2>
  <pre data-lang="JSON"><code>{
  "messageId": 381,
  "roomId": 12,
  "sender": { "id": 7, "name": "AHJ" },
  "content": "배포 완료!",
  "createdAt": "2026-07-17T11:20:00+09:00"
}</code></pre>
  <p>client가 이미 알고 있을 것이라 가정해 일부 값만 보내면 새로 접속한 화면과 실시간으로 받은 화면의 모델이 달라진다. HTTP 목록 API와 WebSocket event가 가능한 한 같은 response 형태를 사용하면 state에 넣는 코드와 정렬 기준을 공유할 수 있다. 시간은 server 기준으로 만들고 timezone 표현을 명확히 한다.</p>`);

  add("realtime", 3, `<h2>끊긴 동안의 메시지는 heartbeat가 복구해 주지 않는다</h2>
  <p>heartbeat는 연결이 죽었는지 알아내는 기능이지, 끊긴 동안 발생한 메시지를 저장하는 기능이 아니다. 재연결 시 마지막으로 본 message ID나 시각을 기준으로 HTTP에서 누락분을 조회하거나 저장형 broker의 offset을 이용해야 한다.</p>
  <p>token이 재연결 전에 만료될 수도 있다. Access Token을 갱신한 뒤 새 CONNECT frame에 넣고, 갱신까지 실패하면 무한 재접속하지 말고 로그인 만료 상태로 전환한다. 인증 실패와 일시적 network 실패를 같은 retry 정책으로 처리하지 않는다.</p>`);

  add("realtime", 4, `<h2>key 이름만 봐도 소유자와 목적이 보여야 한다</h2>
  <pre data-lang="Plain Text"><code>member:7:profile
room:12:online-members
product:31:detail:v2
refresh-token:member:7</code></pre>
  <p>key에 domain과 식별자, 목적을 일정한 순서로 넣으면 삭제 범위와 monitoring이 쉬워진다. 다만 production에서 <code>KEYS *</code>로 전체를 검색하면 Redis가 오래 멈출 수 있으므로 scan 기반 도구를 사용한다. 큰 value 하나보다 변경 단위와 조회 방식에 맞는 구조를 선택한다.</p>
  <p>cache가 없어도 서비스는 DB로 동작해야 하고, Redis 장애가 핵심 저장 데이터 손실로 이어지지 않게 원본의 위치를 분명히 한다.</p>`);

  add("realtime", 5, `<h2>어떤 전달 방식을 고를지 질문으로 결정한다</h2>
  <table><tr><th>질문</th><th>선택 방향</th></tr><tr><td>지금 접속한 사용자에게만 즉시 알리면 되는가?</td><td>Pub/Sub</td></tr><tr><td>소비자가 늦게 와도 읽어야 하는가?</td><td>Streams</td></tr><tr><td>처리 완료 ACK와 재시도가 필요한가?</td><td>Streams 또는 전용 message broker</td></tr><tr><td>장기 보관과 검색이 필요한가?</td><td>DB 저장을 별도로 설계</td></tr></table>
  <p>Redis가 전달했다고 WebSocket client가 화면에 표시했다는 뜻은 아니다. DB 저장 성공, broker publish 성공, client 수신 성공의 경계를 나눠 어떤 수준까지 보장할지 정해야 한다.</p>`);

  add("html-css", 1, `<h2>태그를 고를 때 모양보다 역할을 먼저 본다</h2>
  <p><code>div</code>는 의미 없는 묶음이고 <code>header</code>·<code>nav</code>·<code>main</code>·<code>article</code>·<code>section</code>·<code>footer</code>는 영역의 역할을 설명한다. 브라우저 화면은 CSS로 같게 만들 수 있지만, 검색 엔진과 screen reader는 이 구조를 이용해 문서의 중심 내용과 이동 영역을 이해한다.</p>
  <p>heading은 글자 크기를 위한 태그가 아니라 문서 목차다. h1 아래에 h2, 그 안의 세부 항목에 h3을 사용한다. 제목 크기는 CSS로 바꾸고 단계는 내용의 포함 관계에 맞춘다. button은 동작, a는 다른 주소로 이동할 때 사용해야 keyboard와 기본 접근성 동작이 자연스럽다.</p>`);

  add("html-css", 3, `<h2>스타일 충돌은 세 단계로 판정한다</h2>
  <p>먼저 해당 property가 상속되는지 보고, 여러 규칙이 같은 요소를 선택하면 중요도와 specificity를 비교하며, 여기까지 같으면 source에서 나중에 선언된 값이 적용된다. 무조건 <code>!important</code>를 붙이면 이 판단 구조를 건너뛰어 이후 수정이 더 어려워진다.</p>
  <pre data-lang="CSS"><code>.card p { color: navy; }       /* class 1 + element 1 */
#notice p { color: crimson; } /* id 1 + element 1: 더 구체적 */</code></pre>
  <p>개발자 도구의 Styles와 Computed 영역에서 취소선이 생긴 규칙, 실제 적용값, box model을 함께 보면 ‘CSS가 안 먹는다’를 selector·상속·오타·파일 로딩 문제로 나눌 수 있다.</p>`);

  add("html-css", 4, `<h2>width가 보이는 크기와 다를 때 box-sizing을 확인한다</h2>
  <p>기본 <code>content-box</code>에서 width는 내용 영역만 뜻하므로 padding과 border가 바깥에 더해진다. <code>border-box</code>는 지정한 width 안에 padding과 border를 포함해 layout 계산이 단순해진다.</p>
  <pre data-lang="CSS"><code>*, *::before, *::after { box-sizing: border-box; }
.toolbar { display: flex; gap: 12px; align-items: center; }
.toolbar .search { flex: 1; min-width: 0; }</code></pre>
  <p>Flex에서 <code>justify-content</code>는 main axis, <code>align-items</code>는 cross axis를 정렬한다. row와 column을 바꾸면 축도 바뀐다. 긴 글자가 flex item을 밀어낼 때는 자식의 기본 <code>min-width:auto</code> 때문에 줄지 않는 경우가 있어 <code>min-width:0</code>을 확인한다.</p>`);

  add("sql", 0, `<h2>SELECT 문은 적는 순서와 처리 순서가 다르다</h2>
  <div class="concept-flow"><span>FROM·JOIN</span><i>→</i><span>WHERE</span><i>→</i><span>GROUP BY</span><i>→</i><span>HAVING</span><i>→</i><span>SELECT</span><i>→</i><span>ORDER BY</span></div>
  <p>DB는 먼저 어느 table을 읽고 결합할지 정한 뒤 행을 걸러 내고, group을 만든 다음 결과 열을 계산한다. 그래서 SELECT에서 만든 alias를 같은 단계보다 앞선 WHERE에서 바로 사용할 수 없는 경우가 생긴다. SQL을 위에서 아래로만 읽지 말고 데이터가 어느 단계에서 몇 행으로 변하는지 따라간다.</p>
  <p><code>NULL</code>은 빈 문자열이나 0이 아니라 값이 알려지지 않았다는 상태다. <code>= NULL</code>이 아니라 <code>IS NULL</code>을 사용하고, 연산과 비교에서 UNKNOWN이 생길 수 있음을 고려한다.</p>`);

  add("sql", 1, `<h2>JOIN 결과 행 수를 예상한 뒤 실행한다</h2>
  <p>회원 한 명에게 주문이 세 건 있으면 회원과 주문을 JOIN한 결과에는 회원 정보가 세 행 반복된다. 1:N 관계를 JOIN하면서 원본 table 행 수와 같을 것이라 기대하면 합계와 count가 부풀 수 있다. 각 table의 key와 관계를 먼저 적고 결과가 몇 행이 될지 예상한다.</p>
  <p><code>WHERE</code>는 group 전의 개별 행, <code>HAVING</code>은 group 후의 집계 결과를 거른다. LEFT JOIN에서 오른쪽 table 조건을 WHERE에 두면 NULL로 남아야 할 행이 제거돼 INNER JOIN처럼 바뀔 수 있으므로 조건 위치도 결과 의미의 일부다.</p>
  <pre data-lang="SQL"><code>SELECT m.member_id, COUNT(o.order_id)
FROM member m
LEFT JOIN orders o ON o.member_id = m.member_id
GROUP BY m.member_id;</code></pre>`);

  add("javascript", 0, `<h2>원시값과 객체는 복사되는 방식부터 다르다</h2>
  <p>number·string·boolean 같은 원시값을 다른 변수에 대입하면 값이 복사된다. 객체와 배열을 대입하면 같은 객체를 가리키는 참조가 복사된다. 따라서 한 변수로 property를 바꾸면 다른 변수에서 본 객체도 바뀐다.</p>
  <pre data-lang="JavaScript"><code>const a = { count: 1 };
const b = a;
b.count = 2;       // a.count도 2
const c = { ...a, count: 3 }; // 새 객체</code></pre>
  <p><code>const</code>는 객체 내부를 불변으로 만드는 것이 아니라 변수에 다른 참조를 다시 대입하지 못하게 한다. React state에서 spread를 사용하는 이유도 기존 객체를 직접 바꾸지 않고 새 참조를 만들어 변경을 드러내기 위해서다.</p>`);

  add("javascript", 2, `<h2>JSON 변환과 저장 실패를 따로 생각한다</h2>
  <p>localStorage는 문자열만 저장하므로 객체는 <code>JSON.stringify</code>하고 꺼낸 문자열은 <code>JSON.parse</code>해야 한다. parse 대상이 비어 있거나 이전 버전의 잘못된 문자열이면 예외가 발생할 수 있어 기본값과 예외 처리가 필요하다.</p>
  <pre data-lang="JavaScript"><code>function loadTodos() {
  try { return JSON.parse(localStorage.getItem('todos')) ?? []; }
  catch { return []; }
}
function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}</code></pre>
  <p>localStorage는 같은 origin의 browser에만 남고 server DB와 동기화되지 않는다. 민감한 token이나 개인정보를 안전하게 보관하는 금고가 아니며 용량과 동기 API 특성도 있어 작은 사용자 설정에 적합하다.</p>`);

  add("javascript", 3, `<h2>비동기 코드는 성공 경로만 이어 붙이지 않는다</h2>
  <p><code>fetch</code> Promise는 network 자체가 실패할 때 reject되지만 404나 500 응답만으로 자동 reject되지는 않는다. <code>response.ok</code>를 확인한 뒤 body를 읽어야 한다. loading 시작과 종료, 오류 메시지, 요청 취소까지 하나의 수명주기로 본다.</p>
  <pre data-lang="JavaScript"><code>try {
  setLoading(true);
  const response = await fetch('/api/members');
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const members = await response.json();
  setMembers(members);
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}</code></pre>
  <p><code>await</code>는 JavaScript 전체를 멈추지 않고 현재 async 함수의 다음 실행만 미룬다. 서로 독립적인 요청을 무조건 차례로 await하면 불필요하게 느려질 수 있어 <code>Promise.all</code> 여부도 판단한다.</p>`);

  add("security", 0, `<h2>세션과 JWT는 인증 결과를 어디에 두는지가 다르다</h2>
  <p>세션 방식은 server가 session ID에 대응하는 로그인 상태를 저장하고 browser는 cookie로 ID를 보낸다. JWT 방식은 server가 서명한 claim을 token에 담아 client가 요청마다 보낸다. JWT도 탈취되면 만료 전까지 악용될 수 있고 즉시 폐기 목록이나 refresh token 저장소가 필요할 수 있으므로 ‘server 상태가 전혀 없다’고 단순화하면 안 된다.</p>
  <p>어떤 방식을 사용하든 HTTPS, 안전한 비밀번호 hash, token·cookie 저장 위치, 만료, logout, 권한 변경 반영을 함께 설계한다. 로그인 성공만 구현하고 탈취·만료·재발급을 빼면 인증의 절반만 만든 것이다.</p>`);

  add("aws", 2, `<h2>EC2 생성 화면의 선택값은 이후 연결 구조를 결정한다</h2>
  <p>AMI는 시작 OS, instance type은 CPU와 memory 크기, key pair는 SSH 접속 수단, subnet과 public IP는 internet 접근 경로, security group은 허용할 inbound 문을 정한다. 생성 뒤 문제가 생기면 이 항목들을 한꺼번에 바꾸지 말고 연결에 필요한 조건부터 하나씩 확인한다.</p>
  <p>처음에는 SSH source를 현재 내 IP로 제한하고 애플리케이션 port도 테스트가 끝난 뒤 필요한 source에만 연다. instance를 중지·시작하면 기본 public IPv4가 바뀔 수 있으므로 고정 주소가 필요하면 Elastic IP나 DNS 구조를 검토한다.</p>`);

  add("aws", 3, `<h2>SSH 접속 실패를 네 단계로 나눈다</h2>
  <ol><li>instance가 running이고 status check를 통과했는지 본다.</li><li>현재 public IP와 username이 AMI에 맞는지 확인한다.</li><li>보안 그룹 22번 source가 현재 내 IP를 허용하는지 본다.</li><li>private key 파일과 권한, 명령 경로를 확인한다.</li></ol>
  <p>접속한 뒤에는 <code>pwd</code>, <code>whoami</code>, disk, memory, Java version부터 기록한다. 설치 명령을 여러 번 복사하기보다 배포 폴더와 service 사용자, log 위치를 먼저 정하면 이후 systemd 설정과 권한 오류가 줄어든다.</p>`);

  add("aws", 8, `<h2>Lambda를 쓰기 좋은 일과 그렇지 않은 일을 구분한다</h2>
  <p>파일 업로드 후 thumbnail 생성, 정해진 event 변환, 짧은 주기 작업처럼 입력이 명확하고 실행 시간이 짧은 기능은 Lambda와 잘 맞는다. 반대로 계속 연결을 유지하거나 local state에 의존하고 실행 시간이 긴 server를 그대로 옮기면 cold start와 제한, 관찰 어려움이 커질 수 있다.</p>
  <p>배포가 끝났다는 기준은 AWS console에 resource가 보이는 것이 아니다. 외부 요청, DB 읽기·쓰기, S3 업로드, 재부팅·재배포 후 자동 복구, log와 alarm, 비용 budget까지 확인해야 운영 가능한 상태다.</p>`);
})();
