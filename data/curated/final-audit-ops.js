/* 배포·운영 원문과 프로젝트 실습에서 축약됐던 재현·진단 단원을 복원한다. */
(function () {
  const find = (slug) => (window.CURATED_STUDY || []).find((item) => item.slug === slug);
  const lesson = (slug, title, summary, body, important = false) => {
    const category = find(slug);
    if (category && !category.lessons.some((item) => item.title === title)) category.lessons.push({ title, summary, body, important });
  };

  lesson("security", "인증 흐름 통합 테스트와 공격 시나리오", "정상 로그인뿐 아니라 만료·변조·재사용·권한 부족을 요청 단위로 검증한다.", `<h2>인증 기능은 성공 응답 하나로 완료되지 않는다</h2><table><tr><th>시나리오</th><th>기대 결과</th></tr><tr><td>올바른 계정 로그인</td><td>Access·Refresh 발급, 비밀번호와 token 원문은 log에 없음</td></tr><tr><td>잘못된 비밀번호</td><td>401과 일정한 오류 형태, 계정 존재 여부 과노출 금지</td></tr><tr><td>서명 변조·만료 Access</td><td>401, SecurityContext를 만들지 않음</td></tr><tr><td>일반 사용자의 관리자 API</td><td>인증은 됐지만 권한 부족이므로 403</td></tr><tr><td>폐기된 Refresh 재사용</td><td>재발급 거부, 필요하면 token family 전체 폐기</td></tr></table>
<h3>Postman으로 확인할 때의 순서</h3><ol><li>회원가입 후 DB에는 BCrypt hash만 저장됐는지 확인한다.</li><li>로그인 응답의 token을 환경 변수에 저장하고 보호 API에 Bearer로 보낸다.</li><li>문자 하나를 바꾼 token, 만료 token, header가 없는 요청을 각각 보낸다.</li><li>Refresh 후 이전 Refresh가 다시 사용 가능한지 정책대로 확인한다.</li><li>로그아웃 뒤 Access의 남은 수명과 Refresh 폐기 동작을 구분한다.</li></ol>
<p>브라우저 cookie 인증이면 CORS의 allowed origin·credentials와 CSRF 방어를 함께 test한다. <code>*</code> origin과 credential은 함께 사용할 수 없다.</p>`, true);

  lesson("aws", "도메인·DNS·HTTPS·Reverse Proxy 연결", "IP로 동작하는 서버를 도메인과 TLS가 적용된 서비스 주소로 완성한다.", `<h2>도메인은 서버가 아니라 이름을 IP에 연결하는 체계다</h2><p>DNS의 A record는 IPv4, CNAME은 다른 hostname을 가리킨다. EC2의 public IP가 재시작으로 바뀌면 연결이 끊길 수 있으므로 Elastic IP 또는 Load Balancer처럼 안정적인 endpoint를 사용한다. DNS 변경은 TTL 동안 이전 값이 남을 수 있다.</p>
<div class="concept-flow"><span>도메인</span><i>DNS</i><span>공인 IP·LB</span><i>443</i><span>Nginx</span><i>proxy</i><span>Spring :8080</span></div>
<h3>Reverse Proxy가 맡는 것</h3><ul><li>80·443에서 외부 요청을 받고 내부 application port로 전달</li><li>TLS 인증서 종료와 HTTP → HTTPS redirect</li><li>Host, X-Forwarded-For, X-Forwarded-Proto header 전달</li><li>정적 파일·upload 크기·timeout 정책</li></ul>
<pre data-lang="NGINX"><code>location /api/ {
  proxy_pass http://127.0.0.1:8080/;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}</code></pre>
<p>인증서는 Certbot 또는 AWS Certificate Manager로 관리하되 적용 위치가 다르다. 보안 그룹은 80·443만 공개하고 application port와 DB port는 필요한 내부 경로에만 허용한다.</p>`, true);

  lesson("infra", "Linux 파일·권한·프로세스·네트워크 명령", "배포 서버에서 현재 위치와 권한, 실행 프로세스, 열린 포트를 순서대로 확인한다.", `<h2>명령을 외우기 전에 무엇을 확인하는지 구분한다</h2><table><tr><th>질문</th><th>명령</th></tr><tr><td>지금 어디에 있고 무엇이 있는가?</td><td><code>pwd</code>, <code>ls -al</code>, <code>find</code></td></tr><tr><td>파일 내용과 log는?</td><td><code>cat</code>, <code>less</code>, <code>tail -f</code>, <code>grep</code></td></tr><tr><td>누가 읽고 쓰고 실행할 수 있는가?</td><td><code>id</code>, <code>ls -l</code>, <code>chmod</code>, <code>chown</code></td></tr><tr><td>무슨 process가 실행 중인가?</td><td><code>ps</code>, <code>top</code>, <code>systemctl status</code>, <code>journalctl</code></td></tr><tr><td>어느 port를 듣고 있는가?</td><td><code>ss -lntp</code>, <code>curl -v</code></td></tr></table>
<h3>rwx 권한 읽기</h3><p><code>-rwxr-x---</code>는 owner가 읽기·쓰기·실행, group이 읽기·실행, others는 권한 없음이다. <code>chmod 750</code>은 각각 7(rwx), 5(r-x), 0(---)을 뜻한다. 문제를 빨리 없애려고 777을 주면 다른 사용자가 코드와 secret을 바꿀 수 있다.</p>
<h3>프로세스 장애 확인 순서</h3><pre data-lang="Shell"><code>systemctl status ahj-api
journalctl -u ahj-api -n 200 --no-pager
ss -lntp | grep 8080
curl -v http://127.0.0.1:8080/actuator/health</code></pre><p>서비스가 실패하면 status의 exit code와 첫 원인 예외를 보고, 실행 중인데 요청이 안 되면 listen address·port·firewall 순으로 좁힌다.</p>`, true);

  lesson("infra", "Ansible inventory·playbook과 멱등성", "여러 서버의 원하는 상태를 선언하고 같은 자동화를 반복 실행해도 안전하게 만든다.", `<h2>Vagrant와 Ansible의 책임은 다르다</h2><p>Vagrant는 VM의 box·CPU·memory·network를 만들고, Ansible은 이미 존재하는 host에 package·user·file·service 상태를 적용한다. inventory는 대상 서버와 그룹, playbook은 어떤 host에 어떤 role·task를 적용할지 정의한다.</p>
<pre data-lang="YAML"><code>- hosts: app
  become: true
  tasks:
    - name: Install JRE
      apt:
        name: openjdk-21-jre-headless
        state: present
        update_cache: true
    - name: Start application service
      systemd:
        name: ahj-api
        state: started
        enabled: true</code></pre>
<p><code>shell: apt install ...</code>을 반복하는 것보다 상태를 이해하는 module을 사용하면 이미 설치된 경우 changed가 발생하지 않는다. 이것이 멱등성이다. 설정 파일이 바뀔 때만 handler가 service를 restart하도록 연결해 불필요한 중단을 줄인다.</p>
<h3>secret과 검증</h3><p>SSH key와 password는 저장소에 평문으로 넣지 않고 Ansible Vault나 배포 환경의 secret을 사용한다. <code>--check --diff</code>로 변경 예측을 보고 작은 대상 그룹부터 적용한 뒤 service health를 검증한다.</p>`);

  lesson("realtime", "채팅 메시지 순서·중복·재접속 설계", "WebSocket 연결이 끊겨도 메시지가 유실·중복되지 않도록 client와 server의 기준을 세운다.", `<h2>‘전송 버튼을 눌렀다’와 ‘서버에 저장됐다’는 다른 상태다</h2><p>client는 임시 id로 pending 메시지를 표시하고 server는 저장 성공 후 영구 message id와 createdAt을 응답한다. 재접속이나 timeout으로 같은 요청을 다시 보낼 수 있으므로 clientMessageId를 함께 보내 server가 중복 저장을 막는다.</p>
<div class="concept-flow"><span>client pending</span><i>send</i><span>server 인증·검증</span><i>transaction</i><span>DB 저장</span><i>publish</i><span>subscribers</span></div>
<h3>재접속 뒤 복구</h3><ol><li>지수 backoff와 최대 간격을 두고 다시 연결한다.</li><li>연결되면 인증 정보를 갱신하고 destination을 재구독한다.</li><li>마지막으로 받은 message id 이후의 누락분을 HTTP로 조회한다.</li><li>id 기준으로 기존 목록과 합쳐 중복을 제거하고 서버 timestamp로 정렬한다.</li></ol>
<p>WebSocket broadcast만 사용하면 offline 사용자는 메시지를 잃는다. DB를 기록의 기준으로 두고 Redis Pub/Sub은 여러 application instance 사이의 실시간 전달에 사용한다. Pub/Sub 자체는 과거 메시지를 보관하지 않으므로 복구 조회를 대신하지 않는다.</p>`, true);

  lesson("setup", "새 프로젝트 기준 환경 검증 체크리스트", "설치 화면을 지나 실제 build·DB 연결·API 호출·배포까지 최소 정상 경로를 확인한다.", `<h2>설치는 아이콘이 생기는 것으로 끝나지 않는다</h2><p>새 프로젝트를 시작할 때는 각 도구의 버전 숫자만 보지 말고 하나의 정상 경로를 끝까지 실행한다. 문제가 생기면 IDE 설정, 터미널 PATH, 프로젝트 build 설정 중 어느 층인지 분리할 수 있다.</p>
<ol><li><strong>Java:</strong> 새 터미널의 <code>java -version</code>과 Gradle이 사용하는 JVM을 맞추고 <code>gradlew test bootJar</code>를 성공시킨다.</li><li><strong>Node:</strong> <code>node -v</code>, <code>npm -v</code> 확인 후 clean install과 production build를 실행한다.</li><li><strong>DB:</strong> 관리 도구 접속뿐 아니라 애플리케이션 계정으로 간단한 SELECT와 migration을 확인한다.</li><li><strong>Backend:</strong> health URL과 한 개의 CRUD API를 Postman에서 호출한다.</li><li><strong>Frontend:</strong> proxy를 거친 API, 새로고침, production preview의 asset 경로를 확인한다.</li><li><strong>Git:</strong> secret·IDE·build 결과가 ignore되고 새 clone에서도 build되는지 확인한다.</li><li><strong>Deployment:</strong> 환경 변수를 주입한 동일 artifact를 실행하고 외부 URL에서 health를 확인한다.</li></ol>
<h3>README에 반드시 남길 것</h3><p>필수 버전, 설치 명령, 환경 변수 이름, DB 준비 순서, 실행·test·build 명령, 기본 port, 자주 발생한 오류와 해결 기준을 남긴다. 실제 비밀번호는 쓰지 않고 <code>.env.example</code>과 안전한 secret 저장 위치를 안내한다.</p>`, true);
})();
