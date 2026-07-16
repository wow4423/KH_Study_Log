/*
 * 강사님 공개 학습 자료에서 기술 주제만 선별해 다시 쓴 보충 자료실.
 * 공지·과제·발표·면접 자료는 포함하지 않았고, 설정은 현재 공식 문서 기준으로 보완했다.
 */
(function () {
  const lesson = (title, summary, body) => ({ title, summary, body });

  window.CURATED_STUDY.push({
    slug: "plus-lab",
    title: "PLUS LAB",
    intro: "정규 학습 흐름 옆에서 필요할 때 꺼내 쓰는 실전 연동·배포 레시피.",
    lessons: [
      lesson(
        "PLUS LAB 사용 지도",
        "기초 개념을 실제 기능으로 연결할 때 필요한 순서와 자료의 경계를 먼저 잡는다.",
        `<div class="plus-origin"><span>CURATED SUPPLEMENT</span><strong>강사님 공유 노트 × 현재 공식 문서</strong><p>원문의 실습 흐름은 살리고, 단편적인 메모는 ‘왜 필요한가 → 어떻게 흐르는가 → 무엇을 설정하는가 → 어디서 막히는가’ 순서로 다시 썼다.</p></div>
<h2>이 자료실은 언제 쓰는가</h2>
<p>정규 챕터가 개념을 배우는 곳이라면 PLUS LAB은 <strong>여러 개념을 하나의 기능으로 조립하는 곳</strong>이다. 예를 들어 S3 업로드에는 HTTP multipart, Spring Controller, AWS 인증, IAM 권한, 객체 키 설계가 함께 필요하다.</p>
<div class="recipe-map">
  <article><span>DEPLOY</span><strong>React · GitHub Pages</strong><p>빌드 결과와 공개 경로가 어긋날 때</p></article>
  <article><span>CLOUD</span><strong>S3 · EC2 · Docker</strong><p>로컬 기능을 외부 서버로 옮길 때</p></article>
  <article><span>CONNECT</span><strong>Kakao · Notion · Slack</strong><p>외부 서비스 인증과 API를 붙일 때</p></article>
  <article><span>UX & AUTH</span><strong>Infinite Scroll · JWT</strong><p>사용성과 보안 흐름을 완성할 때</p></article>
</div>
<h2>레시피를 읽는 순서</h2>
<ol class="step-list"><li><strong>흐름</strong><span>브라우저·서버·외부 서비스 사이에서 데이터가 어디로 이동하는지 본다.</span></li><li><strong>준비</strong><span>콘솔 설정, 환경 변수, 의존성처럼 코드 밖의 조건을 확인한다.</span></li><li><strong>구현</strong><span>최소 코드로 핵심 경계를 연결한다.</span></li><li><strong>검증</strong><span>성공 응답뿐 아니라 취소·만료·권한 부족·재시도도 확인한다.</span></li></ol>
<blockquote><strong>원칙:</strong> 예제의 키·토큰·비밀번호는 설명을 위한 자리표시자다. 실제 값은 저장소에 커밋하지 않고 환경 변수, 로컬 비공개 설정, 배포 환경의 Secret으로 주입한다.</blockquote>
<a class="reference-link" href="https://solar-magnolia-7f8.notion.site/2025_11_18_ALL_U-PUBLIC-2afe19965f298099a783edb87752b834?pvs=143" target="_blank" rel="noopener"><small>자료의 출발점</small><span>강사님 공유 학습 노트</span><b>↗</b></a>`
      ),

      lesson(
        "React를 GitHub Pages에 정확히 배포하기",
        "개발 서버가 아니라 빌드 산출물과 저장소 하위 경로를 기준으로 배포를 이해한다.",
        `<h2>먼저 구분할 것: 소스와 배포 결과물</h2>
<p><code>npm run dev</code>는 개발용 서버를 띄운다. GitHub Pages는 Node 서버를 실행하지 않고 정적 파일을 전달하므로, Vite가 만든 <code>dist</code> 안의 HTML·CSS·JavaScript가 실제 배포 대상이다.</p>
<div class="concept-flow"><span>React source</span><i>→</i><span>vite build</span><i>→</i><span>dist</span><i>→</i><span>Pages artifact</span></div>
<h2>저장소 하위 주소와 base</h2>
<p>프로젝트 페이지 주소가 <code>https://사용자.github.io/저장소명/</code>이라면 브라우저의 기준 경로도 <code>/저장소명/</code>이다. Vite의 <code>base</code>가 빠지면 생성된 자산 주소가 루트(<code>/assets/...</code>)를 바라봐 흰 화면이 생길 수 있다.</p>
<pre data-lang="JavaScript"><code>import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/REPOSITORY_NAME/'
})</code></pre>
<h2>배포 전 검증 순서</h2>
<ol><li><code>npm run build</code>가 오류 없이 끝나는지 확인한다.</li><li><code>npm run preview</code>로 빌드된 결과를 직접 본다.</li><li>브라우저 개발자 도구의 Network에서 JS·CSS가 200인지 확인한다.</li><li>SPA의 하위 URL을 새로고침할 계획이라면 404 fallback 또는 HashRouter 전략을 정한다.</li><li>Pages의 Source가 branch 방식인지 GitHub Actions 방식인지 한 가지만 명확히 선택한다.</li></ol>
<div class="note-warning"><strong>흰 화면 빠른 진단</strong><p>Console의 JavaScript 오류 → Network의 404 → Vite <code>base</code> → Router 경로 순서로 보면 원인을 빨리 좁힐 수 있다. ‘배포가 완료됨’과 ‘앱이 정상 실행됨’은 다른 문제다.</p></div>
<a class="reference-link" href="https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages" target="_blank" rel="noopener"><small>공식 문서</small><span>GitHub Pages custom workflows</span><b>↗</b></a>`
      ),

      lesson(
        "Spring Boot에서 S3 파일 업로드 설계하기",
        "버킷 생성부터 IAM, 객체 키, 업로드 API까지 한 흐름으로 연결한다.",
        `<h2>S3에는 ‘파일 경로’가 아니라 객체 키가 있다</h2>
<p>S3의 기본 단위는 <strong>버킷 안의 객체</strong>다. <code>profile/2026/uuid.jpg</code>처럼 보이는 값 전체가 객체 키이며, 슬래시는 콘솔에서 폴더처럼 보여 주기 위한 구분자다. 원본 파일명을 그대로 키로 쓰면 충돌과 추측 가능한 URL 문제가 생기므로 UUID와 용도별 prefix를 조합한다.</p>
<div class="concept-flow"><span>MultipartFile</span><i>→</i><span>검증</span><i>→</i><span>object key</span><i>→</i><span>S3 putObject</span><i>→</i><span>DB metadata</span></div>
<h2>준비 단계</h2>
<ol><li>리전과 버킷을 정하고 기본 공개 차단을 유지한다.</li><li>애플리케이션에는 필요한 버킷의 필요한 동작만 허용한다.</li><li>로컬은 AWS profile 또는 환경 변수, EC2는 IAM Role을 우선 사용한다.</li><li>Spring 설정에는 버킷명과 리전만 두고 Access Key를 코드에 넣지 않는다.</li><li>업로드 크기, 허용 MIME type, 파일명 정책을 먼저 정한다.</li></ol>
<pre data-lang="Java"><code>@Bean
S3Client s3Client(@Value("\${app.aws.region}") String region) {
    return S3Client.builder()
        .region(Region.of(region))
        .build(); // 기본 credentials provider chain 사용
}</code></pre>
<pre data-lang="Java"><code>String key = "uploads/" + UUID.randomUUID() + extension;

PutObjectRequest request = PutObjectRequest.builder()
    .bucket(bucketName)
    .key(key)
    .contentType(file.getContentType())
    .build();

s3Client.putObject(request,
    RequestBody.fromBytes(file.getBytes()));</code></pre>
<h2>DB에는 무엇을 저장할까</h2>
<p>버킷 전체 URL을 고정 문자열로 저장하기보다 <code>objectKey</code>, 원본명, 크기, MIME type, 업로더, 생성 시각을 저장하면 버킷이나 전달 방식을 바꾸기 쉽다. 비공개 파일은 서버가 권한을 확인한 뒤 짧게 만료되는 presigned URL을 발급하는 방식이 안전하다.</p>
<div class="note-warning"><strong>권한 주의</strong><p>학습 예제에서 편하다는 이유로 <code>AmazonS3FullAccess</code>를 붙이면 삭제·다른 버킷 접근까지 열릴 수 있다. 실제 프로젝트에서는 대상 버킷 ARN과 <code>GetObject</code>·<code>PutObject</code> 등 필요한 action만 허용한다.</p></div>
<h2>업로드가 실패할 때</h2>
<table><tr><th>증상</th><th>먼저 확인할 곳</th></tr><tr><td>403 AccessDenied</td><td>IAM policy, bucket policy, 객체 ARN의 <code>/*</code></td></tr><tr><td>301/리전 오류</td><td>S3Client의 region과 버킷 region</td></tr><tr><td>브라우저 CORS 오류</td><td>직접 업로드일 때 bucket CORS의 origin·method·header</td></tr><tr><td>파일은 있지만 조회 불가</td><td>공개 여부가 아니라 조회 설계와 presigned URL</td></tr></table>
<a class="reference-link" href="https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/java_s3_code_examples.html" target="_blank" rel="noopener"><small>공식 문서</small><span>AWS SDK for Java 2.x · S3 examples</span><b>↗</b></a>`
      ),

      lesson(
        "카카오 로그인: OAuth 흐름을 내 회원 시스템에 연결하기",
        "인가 코드와 액세스 토큰의 역할을 분리하고, 외부 계정을 내부 회원으로 매핑한다.",
        `<h2>카카오 로그인은 우리 서비스의 로그인을 대신 완성하지 않는다</h2>
<p>카카오는 사용자의 동의와 카카오 계정 확인 결과를 제공한다. 우리 서버는 받은 식별자로 내부 회원을 찾거나 가입시키고, 마지막에 <strong>우리 서비스의 세션 또는 JWT</strong>를 발급해야 한다.</p>
<div class="concept-flow"><span>인가 요청</span><i>→</i><span>사용자 동의</span><i>→</i><span>code</span><i>→</i><span>Kakao token</span><i>→</i><span>사용자 조회</span><i>→</i><span>우리 로그인</span></div>
<h2>콘솔에서 먼저 맞출 값</h2>
<ul><li>카카오 로그인 활성화</li><li>플랫폼의 도메인 등록</li><li>Redirect URI의 완전한 일치</li><li>필요한 동의 항목만 설정</li><li>Client secret 사용 여부와 배포 환경의 Secret 등록</li></ul>
<h2>서버가 처리하는 핵심 단계</h2>
<ol><li>추측하기 어려운 <code>state</code>를 만들고 사용자 세션에 저장한 뒤 인가 URL로 보낸다.</li><li>콜백의 <code>state</code>와 저장한 값을 비교해 CSRF를 막는다.</li><li>짧게 유효한 <code>code</code>를 토큰 엔드포인트에 한 번 교환한다.</li><li>카카오 사용자 식별자와 동의된 프로필만 조회한다.</li><li><code>provider=KAKAO</code>와 <code>providerUserId</code> 조합으로 내부 회원을 찾는다.</li><li>내부 가입·로그인을 완료하고 카카오 토큰과 우리 토큰의 수명을 따로 관리한다.</li></ol>
<pre data-lang="HTTP"><code>POST https://kauth.kakao.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
client_id=REST_API_KEY
redirect_uri=REGISTERED_REDIRECT_URI
code=AUTHORIZATION_CODE
client_secret=CLIENT_SECRET</code></pre>
<div class="note-warning"><strong>자주 틀리는 지점</strong><p><code>redirect_uri</code>는 콘솔 등록값, 인가 요청값, 토큰 요청값이 모두 같아야 한다. 이메일은 사용자가 동의하지 않았거나 계정에 없을 수 있으므로 카카오 고유 식별자의 대체 키로 쓰지 않는다.</p></div>
<h2>반드시 테스트할 경우</h2>
<p>정상 로그인뿐 아니라 동의 취소, 이미 가입된 계정, 필요한 정보 미동의, 잘못된 state, 만료된 code, 연결 해제 후 재로그인을 확인한다.</p>
<a class="reference-link" href="https://developers.kakao.com/docs/ko/kakaologin/rest-api" target="_blank" rel="noopener"><small>공식 문서</small><span>카카오 로그인 REST API</span><b>↗</b></a>`
      ),

      lesson(
        "카카오페이: 결제 준비와 승인을 하나의 상태로 관리하기",
        "결제창을 띄우는 준비 요청과 실제 결제 확정인 승인 요청을 구분한다.",
        `<h2>결제창으로 이동했다고 결제가 끝난 것이 아니다</h2>
<p>결제는 보통 <strong>준비(ready) → 사용자 결제 → 승인(approve)</strong>의 두 서버 요청과 한 번의 사용자 이동으로 진행된다. 준비 응답의 거래 식별자와 주문 식별자를 서버가 보관해야 콜백에서 같은 결제를 승인할 수 있다.</p>
<div class="concept-flow"><span>주문 생성</span><i>→</i><span>ready</span><i>→</i><span>결제 화면</span><i>→</i><span>pg_token</span><i>→</i><span>approve</span><i>→</i><span>PAID</span></div>
<h2>결제 상태를 먼저 설계한다</h2>
<table><tr><th>상태</th><th>의미</th><th>허용되는 다음 행동</th></tr><tr><td>CREATED</td><td>내부 주문 생성</td><td>결제 준비</td></tr><tr><td>READY</td><td>외부 거래 ID 수신</td><td>승인·취소·만료</td></tr><tr><td>PAID</td><td>승인 응답 검증 완료</td><td>상품 제공·환불</td></tr><tr><td>CANCELED / FAILED</td><td>사용자 취소 또는 오류</td><td>새 결제 시도</td></tr></table>
<h2>서버에 보관할 값</h2>
<ul><li>내부 orderId와 사용자 ID</li><li>서버가 계산한 최종 결제 금액</li><li>준비 응답의 거래 식별자</li><li>승인 완료 시각과 외부 결제 번호</li><li>실패 코드와 재시도 여부</li></ul>
<blockquote><strong>핵심:</strong> 브라우저가 보낸 상품명과 가격을 그대로 신뢰하지 않는다. 서버가 DB의 상품·쿠폰·배송비로 금액을 다시 계산하고, 승인 응답의 금액과 비교한 뒤 주문을 PAID로 바꾼다.</blockquote>
<h2>중복 승인을 막는 방법</h2>
<p>사용자가 성공 URL을 새로고침하거나 네트워크 재시도가 발생할 수 있다. 승인 전에 현재 주문 상태를 확인하고, 이미 PAID라면 같은 결과를 반환하는 멱등성 처리가 필요하다. 외부 승인 성공과 내부 DB 반영 사이의 장애를 추적할 로그도 남긴다.</p>
<div class="note-warning"><strong>운영 전 체크</strong><p>테스트 CID·키와 운영 값을 분리하고, 성공·취소·실패 URL 모두 구현한다. 결제 비밀키는 프론트엔드 번들에 포함하지 않는다.</p></div>
<a class="reference-link" href="https://developers.kakaopay.com/docs/payment/online/single-payment" target="_blank" rel="noopener"><small>공식 문서</small><span>카카오페이 단건 결제</span><b>↗</b></a>`
      ),

      lesson(
        "Notion API와 Slack Bot을 안전하게 붙이기",
        "외부 API 연동의 공통 골격인 권한·토큰·요청·페이지네이션·실패 처리를 익힌다.",
        `<h2>두 기능의 공통 구조</h2>
<p>Notion에서 데이터를 읽든 Slack 채널에 메시지를 보내든 순서는 같다. 외부 서비스에서 앱을 만들고, <strong>최소 권한</strong>을 부여하고, 대상 페이지나 채널에 앱을 연결한 뒤, 서버가 토큰을 사용해 HTTPS 요청을 보낸다.</p>
<div class="concept-flow"><span>App 생성</span><i>→</i><span>Scope</span><i>→</i><span>대상 연결</span><i>→</i><span>Server request</span><i>→</i><span>응답 검증</span></div>
<h2>Notion 데이터 읽기</h2>
<ol><li>Integration을 만들고 내부 통합 Secret을 발급한다.</li><li>읽을 페이지·데이터 소스에 해당 Integration 연결 권한을 준다.</li><li>현재 API 버전에 맞는 <code>Notion-Version</code> 헤더를 보낸다.</li><li>응답의 <code>has_more</code>와 <code>next_cursor</code>를 확인해 다음 페이지를 읽는다.</li><li>Notion property 구조를 곧바로 화면에 노출하지 말고 내부 DTO로 변환한다.</li></ol>
<pre data-lang="HTTP"><code>POST https://api.notion.com/v1/data_sources/DATA_SOURCE_ID/query
Authorization: Bearer NOTION_TOKEN
Notion-Version: 2025-09-03
Content-Type: application/json

{ "page_size": 50 }</code></pre>
<p>예전 노트의 <code>/v1/databases/{id}/query</code>는 구 API 버전의 방식이다. 2025-09-03부터 database와 data source 개념이 분리되었으므로 새 연동은 현재 문서를 기준으로 endpoint와 ID를 확인한다.</p>
<h2>Slack 채널에 알림 보내기</h2>
<ol><li>Slack App을 만들고 Bot Token Scope에 <code>chat:write</code>를 추가한다.</li><li>앱을 Workspace에 설치하고 Bot Token을 배포 Secret에 둔다.</li><li>대상 채널에 봇을 초대하고 채널 ID를 확인한다.</li><li><code>chat.postMessage</code>에 채널 ID와 메시지 내용을 보낸다.</li><li>HTTP 200만 보지 말고 JSON의 <code>ok</code>와 <code>error</code>를 검사한다.</li></ol>
<pre data-lang="HTTP"><code>POST https://slack.com/api/chat.postMessage
Authorization: Bearer xoxb-***
Content-Type: application/json

{ "channel": "CHANNEL_ID", "text": "배포가 완료되었습니다." }</code></pre>
<div class="note-warning"><strong>토큰 관리</strong><p>Notion Secret과 Slack Bot Token은 브라우저 JavaScript에서 호출하면 노출된다. 반드시 백엔드에서 사용하고, 로그에 Authorization 헤더가 찍히지 않게 한다.</p></div>
<a class="reference-link" href="https://developers.notion.com/reference/query-a-data-source" target="_blank" rel="noopener"><small>공식 문서</small><span>Notion · Query a data source</span><b>↗</b></a>
<a class="reference-link" href="https://api.slack.com/methods/chat.postMessage" target="_blank" rel="noopener"><small>공식 문서</small><span>Slack · chat.postMessage</span><b>↗</b></a>`
      ),

      lesson(
        "IntersectionObserver로 무한 스크롤 만들기",
        "스크롤 이벤트를 계속 계산하지 않고 관찰 지점이 보일 때 다음 페이지를 요청한다.",
        `<h2>무한 스크롤의 핵심은 ‘맨 아래의 감시 표지판’</h2>
<p>목록 끝에 작은 sentinel 요소를 두고 IntersectionObserver가 화면 진입을 알려주면 다음 페이지를 요청한다. <code>threshold: 0</code>은 1px이라도 교차할 때 콜백이 실행되고, <code>rootMargin</code>으로 실제 도착 전에 미리 불러올 수 있다.</p>
<div class="concept-flow"><span>sentinel 관찰</span><i>→</i><span>화면 진입</span><i>→</i><span>다음 페이지 요청</span><i>→</i><span>목록 병합</span><i>→</i><span>hasNext 확인</span></div>
<pre data-lang="JSX"><code>const sentinelRef = useRef(null);

useEffect(() => {
  const target = sentinelRef.current;
  if (!target || !hasNext) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isLoading) loadNextPage();
  }, { rootMargin: '240px 0px', threshold: 0 });

  observer.observe(target);
  return () => observer.disconnect();
}, [hasNext, isLoading, loadNextPage]);</code></pre>
<h2>데이터 상태는 네 가지를 분리한다</h2>
<ul><li><code>items</code>: 지금까지 받은 누적 목록</li><li><code>cursor</code> 또는 <code>page</code>: 다음 요청 위치</li><li><code>isLoading</code>: 중복 요청 차단</li><li><code>hasNext</code>: 더 불러올 데이터가 있는지</li></ul>
<h2>목록을 합칠 때 생기는 문제</h2>
<p>콜백이 연속으로 실행되면 같은 페이지가 두 번 요청될 수 있다. 요청 중에는 진입을 무시하고, 응답 항목은 고유 ID 기준으로 병합한다. 검색 조건이 바뀌면 이전 목록·cursor·hasNext를 함께 초기화해야 한다.</p>
<div class="note-warning"><strong>UX 보완</strong><p>로딩 스켈레톤, 실패 시 다시 시도 버튼, ‘마지막 항목’ 안내를 제공한다. 브라우저 뒤로 가기 후 위치 복원이 중요하거나 사용자가 특정 페이지를 공유해야 한다면 무한 스크롤보다 페이지네이션이 낫다.</p></div>`
      ),

      lesson(
        "Spring Security와 JWT 필터 흐름 잡기",
        "회원가입의 암호화부터 로그인 필터, 토큰 검증, 인가 실패까지 요청 순서로 이해한다.",
        `<h2>인증과 인가를 나눈다</h2>
<p><strong>인증(Authentication)</strong>은 누구인지 확인하는 일이고, <strong>인가(Authorization)</strong>는 그 사용자가 이 기능을 실행해도 되는지 확인하는 일이다. 비밀번호 암호화는 회원가입 시점, JWT 검증은 이후 API 요청마다 수행된다.</p>
<div class="concept-flow"><span>Request</span><i>→</i><span>JWT Filter</span><i>→</i><span>SecurityContext</span><i>→</i><span>Authorization</span><i>→</i><span>Controller</span></div>
<h2>회원가입과 로그인</h2>
<ol><li>회원가입 DTO를 검증하고 중복 계정을 확인한다.</li><li><code>PasswordEncoder</code>로 비밀번호를 단방향 해시해 저장한다.</li><li>로그인 시 UserDetailsService가 사용자를 읽고 비밀번호를 검증한다.</li><li>성공하면 subject, role, 발급·만료 시각을 가진 짧은 Access Token을 발급한다.</li></ol>
<h2>JWT 필터가 해야 할 일</h2>
<ol><li>공개 경로인지 확인하거나 필터 체인의 정책에 맡긴다.</li><li><code>Authorization: Bearer ...</code>에서 토큰을 꺼낸다.</li><li>서명·만료·issuer·audience 등 서비스가 정한 claim을 검증한다.</li><li>검증된 사용자 정보로 Authentication을 만들고 SecurityContext에 넣는다.</li><li>토큰이 없으면 익명 요청으로 계속 진행하고, 잘못된 토큰은 일관된 401 응답으로 처리한다.</li></ol>
<pre data-lang="Java"><code>http
  .csrf(csrf -> csrf.disable())
  .sessionManagement(session -> session
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
  .authorizeHttpRequests(auth -> auth
      .requestMatchers("/api/auth/**").permitAll()
      .requestMatchers("/api/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated());</code></pre>
<div class="note-warning"><strong>permitAll의 위치</strong><p>회원가입이 401로 막힌다면 Controller보다 먼저 SecurityFilterChain의 경로·HTTP method 규칙을 본다. 단, 문제를 피하려고 전체 경로를 허용하지 말고 공개 endpoint만 좁게 열어야 한다.</p></div>
<h2>401과 403을 구분한다</h2>
<table><tr><th>응답</th><th>의미</th><th>예</th></tr><tr><td>401 Unauthorized</td><td>인증 정보가 없거나 유효하지 않음</td><td>만료·위조 토큰</td></tr><tr><td>403 Forbidden</td><td>신원은 확인했지만 권한이 부족함</td><td>일반 사용자의 관리자 API 호출</td></tr></table>`
      ),

      lesson(
        "Docker 이미지에서 AWS EC2 실행까지",
        "애플리케이션을 이미지로 고정하고 Registry를 거쳐 서버에서 같은 방식으로 실행한다.",
        `<h2>배포 단위를 jar가 아니라 이미지로 묶는 이유</h2>
<p>jar만 옮기면 서버의 Java 버전과 실행 옵션을 따로 맞춰야 한다. Docker 이미지는 런타임과 실행 명령을 함께 고정해 로컬·테스트·EC2의 차이를 줄인다. 다만 DB와 업로드 파일 같은 상태는 컨테이너 바깥에 둔다.</p>
<div class="concept-flow"><span>bootJar</span><i>→</i><span>Docker build</span><i>→</i><span>Registry push</span><i>→</i><span>EC2 pull</span><i>→</i><span>container run</span></div>
<h2>작은 Spring Boot 이미지</h2>
<pre data-lang="Dockerfile"><code>FROM eclipse-temurin:21-jre
WORKDIR /app
COPY build/libs/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>
<p><code>EXPOSE</code>는 문서 역할이며 실제 외부 공개는 <code>-p 8080:8080</code>과 EC2 보안 그룹이 결정한다. 이미지 안에 <code>application-private.properties</code>나 AWS key를 COPY하지 않는다.</p>
<h2>배포 흐름</h2>
<pre data-lang="Shell"><code>./gradlew clean bootJar
docker build -t USER/app:1.0.0 .
docker push USER/app:1.0.0

# EC2
docker pull USER/app:1.0.0
docker run -d --name app \
  --restart unless-stopped \
  -p 8080:8080 \
  --env-file /opt/app/app.env \
  USER/app:1.0.0</code></pre>
<h2>접속되지 않을 때 네 겹으로 확인한다</h2>
<ol><li><strong>프로세스:</strong> <code>docker ps</code>, <code>docker logs app</code></li><li><strong>컨테이너 포트:</strong> 앱이 8080에서 뜨고 <code>-p</code>가 맞는지</li><li><strong>서버 내부:</strong> EC2에서 <code>curl localhost:8080</code>이 되는지</li><li><strong>AWS 경계:</strong> 보안 그룹 inbound가 필요한 출발지와 포트만 허용하는지</li></ol>
<div class="note-warning"><strong>운영 기준</strong><p>데모가 아니라면 애플리케이션 포트를 전 세계에 바로 열기보다 80/443 reverse proxy 또는 Load Balancer 뒤에 둔다. 태그는 <code>latest</code>만 쓰지 말고 되돌릴 수 있는 버전을 함께 남긴다.</p></div>
<h2>업데이트와 되돌리기</h2>
<p>새 컨테이너의 health check가 통과한 뒤 트래픽을 넘기고 이전 이미지는 잠시 보관한다. 장애가 나면 직전 태그로 다시 실행한다. ‘새 이미지 push 완료’가 아니라 ‘외부 health endpoint 정상’까지가 배포 완료다.</p>`
      )
    ]
  });
})();
