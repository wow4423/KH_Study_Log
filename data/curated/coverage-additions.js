(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const append = (slug, index, html) => { category(slug).lessons[index].body += html; };

  append("html-css", 5, `<h2>Bootstrap과 Font Awesome은 직접 만든 CSS를 대체하는 목적이 다르다</h2>
<p>Bootstrap은 Grid·간격·버튼·Modal 같은 UI 규칙과 컴포넌트를 제공하는 CSS/JavaScript 도구 모음이고, Font Awesome은 의미 있는 아이콘을 제공한다. CDN 링크로 빠르게 시작할 수 있지만 운영 프로젝트에서는 버전을 고정하고 필요한 자원만 설치하는 편이 재현성과 성능에 유리하다.</p>
<pre data-lang="HTML"><code>&lt;button class="btn btn-primary" type="button"&gt;
  &lt;i class="fa-solid fa-floppy-disk" aria-hidden="true"&gt;&lt;/i&gt;
  &lt;span&gt;저장&lt;/span&gt;
&lt;/button&gt;</code></pre>
<p>아이콘만으로 기능을 전달하지 말고 텍스트나 <code>aria-label</code>을 함께 둔다. Bootstrap 클래스를 무작정 덮어쓰기보다 프로젝트 색상·간격을 CSS 변수와 제한된 확장 클래스로 관리한다.</p>`);

  append("sql", 3, `<h2>DDL과 Trigger는 스키마 구조와 자동 반응을 정의한다</h2>
<p><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code>는 테이블과 제약조건 같은 구조를 바꾼다. 운영에서는 콘솔에서 즉흥 실행하지 않고 순서가 있는 Migration으로 남기며, 데이터 손실 가능성과 DB별 자동 커밋 특성을 확인한다.</p>
<pre data-lang="SQL"><code>CREATE OR REPLACE TRIGGER member_updated_at_trg
BEFORE UPDATE ON member
FOR EACH ROW
BEGIN
  :NEW.updated_at := CURRENT_TIMESTAMP;
END;</code></pre>
<p>Trigger는 특정 INSERT·UPDATE·DELETE에 자동 실행되어 감사 기록이나 무결성 보조에 쓸 수 있다. 하지만 호출 위치가 애플리케이션 코드에 보이지 않아 숨은 부작용과 순환 실행을 만들 수 있으므로 이름·실행 시점·대상 행·실패 영향을 문서화하고 꼭 필요한 DB 규칙에만 사용한다.</p>`);

  append("spring-core", 0, `<h2>비밀번호 해시와 쿠키는 서로 다른 보안 경계다</h2>
<p>비밀번호는 BCrypt처럼 salt와 비용 계수를 가진 단방향 해시로 저장하고 로그인 때 <code>matches</code>로 비교한다. 암호화 키나 평문 비밀번호를 로그에 남기지 않는다. 쿠키에는 세션 식별자나 제한된 토큰만 두고 <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>, Path, Max-Age를 목적에 맞게 설정한다.</p>
<pre data-lang="Java"><code>String encoded = passwordEncoder.encode(rawPassword);
boolean valid = passwordEncoder.matches(loginPassword, encoded);</code></pre>
<p>HttpOnly는 JavaScript 탈취를 줄이지만 CSRF를 자동 해결하지 않고, Secure는 HTTPS에서만 전송되게 한다. 민감한 값 자체를 쿠키에 그대로 저장하지 않는다.</p>`);

  append("spring-mvc", 2, `<h2>이미지 미리보기와 실제 업로드는 서로 다른 단계다</h2>
<pre data-lang="JavaScript"><code>fileInput.addEventListener('change', () =&gt; {
  const file = fileInput.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.onload = () =&gt; URL.revokeObjectURL(previewUrl);
});</code></pre>
<p>미리보기는 브라우저의 로컬 파일을 보여줄 뿐 서버 저장 성공을 뜻하지 않는다. 클라이언트 검증은 사용자 편의이고, 서버는 크기·실제 파일 형식·소유 권한을 다시 검증해야 한다.</p>`);

  append("aws", 1, `<h2>공공 API 연결은 키 발급 이후의 운영 조건까지 확인한다</h2>
<p>서비스 포털에서 활용 신청과 인증 키를 발급받고 요청 URL, 필수 파라미터, 인코딩 방식, 일일 호출 한도, 데이터 갱신 주기와 이용 약관을 확인한다. 키는 프론트 번들에 넣지 않고 백엔드에서 호출하거나 허용된 도메인 제한을 사용한다.</p>
<pre data-lang="Java"><code>WebClient client = WebClient.builder()
    .baseUrl(publicApiBaseUrl)
    .defaultHeader("Authorization", publicApiKey)
    .build();</code></pre>
<p>HTTP 200이어도 응답 본문의 업무 오류 코드를 확인하고, timeout·rate limit·빈 결과·필드 누락을 처리한다. 원본 응답과 내부 DTO를 분리해 외부 스키마 변경의 영향을 제한한다.</p>`);

  append("setup", 8, `<h2>Vagrantfile의 기본 구조</h2>
<pre data-lang="Ruby"><code>Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64"
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end
  config.vm.provision "shell", path: "scripts/bootstrap.sh"
end</code></pre>
<p><code>vagrant up</code>은 생성·provisioning, <code>vagrant ssh</code>는 접속, <code>vagrant halt</code>는 종료, <code>vagrant destroy</code>는 VM 삭제다. provisioning은 여러 번 실행해도 같은 결과가 되도록 설치 여부를 검사하고, box 버전과 포트 충돌을 기록한다.</p>`);
})();
