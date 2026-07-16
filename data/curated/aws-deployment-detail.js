/* 내 Notion의 AWS 실습 기록과 캡처를 바탕으로 다시 쓴 단계별 배포 가이드 */
(function () {
  const aws = window.CURATED_STUDY.find((category) => category.slug === "aws");
  if (!aws) return;

  const lesson = (title, summary, body) => ({ title, summary, body });
  const shot = (src, alt, caption) => `<figure class="console-shot"><img src="assets/aws-guide/${src}" alt="${alt}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;

  aws.intro = "AWS 콘솔을 처음 여는 순간부터 EC2·RDS·S3를 연결하고 Spring Boot를 계속 실행시키는 순간까지, 실제 실습 순서대로 따라간다.";
  aws.lessons = [
    lesson(
      "AWS 배포 전체 지도와 계정 안전장치",
      "서비스를 만들기 전에 전체 구조, 리전, MFA, 비용 경보부터 고정한다.",
      `<div class="aws-hero"><span>DEPLOYMENT ROADMAP</span><strong>로컬에서 되던 앱을 인터넷에서 계속 실행되게 만들기</strong><p>처음에는 서비스 이름이 많아서 어렵다. 하지만 이번 배포에서 각 서비스의 역할은 네 개로 나누면 된다.</p></div>
<div class="recipe-map aws-service-map"><article><span>COMPUTE</span><strong>EC2</strong><p>Spring Boot가 실행되는 원격 Ubuntu 컴퓨터</p></article><article><span>DATABASE</span><strong>RDS</strong><p>PostgreSQL을 설치·백업해 주는 관리형 DB</p></article><article><span>STORAGE</span><strong>S3</strong><p>이미지·정적 파일을 객체로 보관하는 저장소</p></article><article><span>PERMISSION</span><strong>IAM</strong><p>사람과 서버가 무엇을 할 수 있는지 정하는 권한</p></article></div>
<h2>먼저 머릿속에 넣을 최종 구조</h2>
<div class="deploy-architecture"><span>사용자 브라우저</span><i>HTTPS</i><span>EC2 · Spring Boot</span><i>SQL</i><span>RDS · PostgreSQL</span><b></b><span>S3 · 이미지</span></div>
<p>EC2는 프로그램을 실행하고, RDS는 데이터를 보존하고, S3는 파일을 보존한다. IAM과 보안 그룹은 이들 사이의 문을 연다. 배포가 안 될 때는 코드만 보지 말고 <strong>실행 상태 → 포트 → 보안 그룹 → 자격 증명</strong> 순서로 확인한다.</p>
<h2>STEP 01. 리전을 하나로 통일한다</h2>
<ol class="aws-steps"><li><b>콘솔 우측 상단</b><span>리전을 <strong>아시아 태평양(서울) · ap-northeast-2</strong>로 선택한다.</span></li><li><b>EC2·RDS·S3 확인</b><span>각 서비스 화면에서도 같은 리전인지 매번 본다.</span></li><li><b>이유</b><span>리전이 다르면 자원이 목록에 안 보이고, 연결·지연·비용이 예상과 달라진다.</span></li></ol>
<h2>STEP 02. MFA를 연결한다</h2>
<div class="console-path"><span>AWS 콘솔</span><i>→</i><span>우측 상단 계정</span><i>→</i><span>보안 자격 증명</span><i>→</i><span>MFA 디바이스 할당</span></div>
${shot("01-mfa-assign.png", "AWS 보안 자격 증명 화면의 MFA 디바이스 할당 버튼", "보안 자격 증명에서 ‘MFA 디바이스 할당’을 누른다.")}
${shot("02-mfa-method.png", "AWS MFA 방식 중 인증 관리자 앱 선택 화면", "학습 환경에서는 Google Authenticator 같은 인증 관리자 앱을 선택할 수 있다.")}
<ol><li>인증 관리자 앱을 선택하고 다음으로 이동한다.</li><li>휴대폰 앱에서 QR 코드를 스캔한다.</li><li>연속으로 생성되는 인증 코드 두 개를 순서대로 입력한다.</li><li>로그아웃 후 비밀번호와 MFA 코드로 다시 로그인되는지 확인한다.</li></ol>
<h2>STEP 03. 비용 경보를 먼저 만든다</h2>
<div class="console-path"><span>Billing and Cost Management</span><i>→</i><span>Budgets</span><i>→</i><span>예산 생성</span></div>
<p>월 예산과 알림 이메일을 설정한다. 예산 알림은 자원을 자동으로 삭제하지 않으므로, 실습이 끝난 뒤 EC2·RDS·Elastic IP·NAT Gateway·S3 객체를 직접 확인해야 한다.</p>
<div class="note-warning"><strong>처음 시작할 때 제일 중요한 습관</strong><p>화면 우측 상단의 <strong>리전</strong>, 지금 만들 자원의 <strong>이름</strong>, 비용이 생기는 <strong>옵션</strong>을 캡처하거나 메모한다. 나중에 삭제할 자원 목록까지 함께 적어 둔다.</p></div>
<a class="reference-link" href="https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>IAM 보안 모범 사례</span><b>↗</b></a>`
    ),

    lesson(
      "S3 버킷 만들기와 파일 공개 범위 정하기",
      "버킷 생성, 객체 업로드, 공개 차단과 버킷 정책의 관계를 화면 순서대로 익힌다.",
      `<h2>S3에서 기억할 세 단어</h2>
<table><tr><th>용어</th><th>뜻</th><th>예</th></tr><tr><td>Bucket</td><td>객체를 담는 최상위 저장 공간</td><td>my-study-assets</td></tr><tr><td>Object</td><td>실제 파일과 메타데이터</td><td>profile/uuid.jpg</td></tr><tr><td>Key</td><td>버킷 안에서 객체를 찾는 전체 이름</td><td>profile/2026/uuid.jpg</td></tr></table>
<h2>STEP 01. 버킷 생성 화면으로 간다</h2>
<div class="console-path"><span>서비스 검색</span><i>→</i><span>S3</span><i>→</i><span>버킷</span><i>→</i><span>버킷 만들기</span></div>
${shot("03-s3-create-region.png", "S3 버킷 생성 화면에서 서울 리전 선택", "리전을 서울(ap-northeast-2)로 맞춘다. 버킷 이름은 전 세계에서 고유해야 한다.")}
<ol class="aws-steps"><li><b>AWS 리전</b><span>서울 <code>ap-northeast-2</code></span></li><li><b>버킷 이름</b><span>소문자·숫자·하이픈으로 고유하게 작성한다. 예: <code>ahj-study-assets-2026</code></span></li><li><b>객체 소유권</b><span>특별한 이유가 없다면 ACL 비활성화와 Bucket owner enforced를 유지한다.</span></li><li><b>퍼블릭 액세스</b><span>기본은 모든 퍼블릭 액세스 차단이다. 공개 사이트 실습일 때만 목적을 이해하고 변경한다.</span></li><li><b>암호화</b><span>기본 서버 측 암호화를 유지한다.</span></li></ol>
<h2>STEP 02. 공개 여부를 결정한다</h2>
${shot("04-s3-public-access.png", "S3의 모든 퍼블릭 액세스 차단 설정", "수업에서는 공개 파일 실습을 위해 차단을 해제했지만, 실제 사용자 파일 버킷은 차단 유지가 기본이다.")}
<div class="compare-lane"><article><span>학습용 공개 정적 파일</span><ul><li>공개해도 되는 이미지·빌드 파일만 둔다.</li><li><code>s3:GetObject</code>만 특정 버킷 객체에 허용한다.</li><li>쓰기·삭제 권한은 공개하지 않는다.</li></ul></article><article><span>실제 사용자 업로드</span><ul><li>퍼블릭 액세스 차단을 유지한다.</li><li>서버가 IAM 권한으로 업로드한다.</li><li>조회는 권한 검사 후 presigned URL을 발급한다.</li></ul></article></div>
<h2>STEP 03. 파일을 올리고 확인한다</h2>
<ol><li>생성한 버킷을 열고 <strong>업로드</strong>를 누른다.</li><li>테스트 이미지 한 개를 추가하고 업로드한다.</li><li>객체 상세에서 Key, 크기, Content-Type을 확인한다.</li><li>객체 URL을 새 탭에서 열어 본다.</li><li>AccessDenied라면 ‘업로드 실패’가 아니라 <strong>조회 권한이 없는 상태</strong>다.</li></ol>
<h2>공개 파일용 최소 버킷 정책 예시</h2>
<pre data-lang="JSON"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::BUCKET_NAME/public/*"
  }]
}</code></pre>
<div class="note-warning"><strong>여기서 많이 막힌다</strong><p>버킷 ARN만 쓰면 객체가 포함되지 않는다. 객체 권한의 Resource는 끝에 <code>/*</code> 또는 공개할 prefix의 <code>/public/*</code>가 필요하다. 정책을 적용하기 전 버킷의 퍼블릭 액세스 차단과 충돌하지 않는지도 확인한다.</p></div>`
    ),

    lesson(
      "EC2 Ubuntu 인스턴스 생성하기",
      "AMI, 인스턴스 유형, 키 페어, 보안 그룹을 각각 왜 고르는지 이해하며 생성한다.",
      `<h2>EC2는 ‘AWS 안에 빌리는 깡통 PC’</h2>
<p>EC2를 만들었다고 Spring Boot가 자동으로 실행되는 것은 아니다. Ubuntu가 설치된 원격 컴퓨터를 한 대 받은 것이고, 그 안에 Java와 애플리케이션을 직접 준비해야 한다.</p>
<h2>STEP 01. 인스턴스 시작</h2>
<div class="console-path"><span>서비스 검색</span><i>→</i><span>EC2</span><i>→</i><span>인스턴스</span><i>→</i><span>인스턴스 시작</span></div>
<ol class="aws-steps"><li><b>이름</b><span>역할이 보이게 작성한다. 예: <code>study-api-server</code></span></li><li><b>AMI</b><span>Ubuntu Server LTS를 선택한다. CPU 아키텍처는 빌드 이미지와 맞춘다.</span></li><li><b>인스턴스 유형</b><span>콘솔에서 프리 티어 가능 표시와 예상 시간당 비용을 직접 확인한다.</span></li><li><b>키 페어</b><span>기존 키가 없다면 새 키를 만들고 <code>.pem</code> 파일을 안전하게 보관한다.</span></li><li><b>네트워크</b><span>기본 VPC·퍼블릭 IP 할당 여부와 보안 그룹을 확인한다.</span></li><li><b>스토리지</b><span>실습에 필요한 최소 크기로 시작하고 삭제 시 볼륨 삭제 옵션을 확인한다.</span></li></ol>
${shot("05-ec2-key-pair.png", "EC2 인스턴스 생성 화면의 새 키 페어 생성", "키 페어가 없다면 ‘새 키 페어 생성’을 누른다. 개인 키는 다시 다운로드할 수 없다.")}
<h2>STEP 02. 보안 그룹을 설계한다</h2>
<table><tr><th>용도</th><th>프로토콜·포트</th><th>권장 소스</th></tr><tr><td>SSH 접속</td><td>TCP 22</td><td>내 IP</td></tr><tr><td>HTTP</td><td>TCP 80</td><td>0.0.0.0/0, ::/0</td></tr><tr><td>HTTPS</td><td>TCP 443</td><td>0.0.0.0/0, ::/0</td></tr><tr><td>Spring 직접 테스트</td><td>TCP 8080</td><td>내 IP · 실습 중에만</td></tr></table>
<blockquote><strong>보안 그룹은 방화벽이다.</strong> 애플리케이션이 8080에서 정상 실행돼도 인바운드 8080이 닫혀 있으면 외부에서 접속할 수 없다. 반대로 포트를 열어도 프로세스가 실행되지 않았다면 접속되지 않는다.</blockquote>
<h2>STEP 03. 생성 직후 기록할 값</h2>
<ul><li>인스턴스 ID와 이름</li><li>퍼블릭 IPv4 또는 퍼블릭 DNS</li><li>AMI의 기본 사용자 이름 — Ubuntu는 보통 <code>ubuntu</code></li><li>연결된 보안 그룹 이름</li><li>사용한 키 페어 파일 위치</li></ul>
<div class="note-warning"><strong>중요</strong><p><code>.pem</code> 파일, 실제 퍼블릭 IP, 계정 ID는 학습 페이지나 GitHub에 올리지 않는다. 캡처를 공유하기 전 우측 상단 계정 정보와 리소스 식별자를 확인한다.</p></div>
<a class="reference-link" href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>EC2 키 페어와 인스턴스</span><b>↗</b></a>
<a class="reference-link" href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-security-group.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>EC2 보안 그룹 만들기</span><b>↗</b></a>`
    ),

    lesson(
      "SSH로 EC2에 접속하고 Ubuntu 준비하기",
      "터미널 또는 MobaXterm으로 접속한 뒤 패키지와 Java 실행 환경을 준비한다.",
      `<h2>연결 전에 확인할 네 가지</h2>
<ol><li>EC2 상태가 <strong>실행 중</strong>이고 상태 검사가 통과했는가?</li><li>퍼블릭 IP 또는 DNS를 복사했는가?</li><li>보안 그룹 22번 포트가 현재 내 IP에 열렸는가?</li><li>이 인스턴스를 만들 때 선택한 <code>.pem</code> 파일이 있는가?</li></ol>
<h2>방법 A. Windows 터미널에서 접속</h2>
<pre data-lang="PowerShell"><code>ssh -i "C:\\keys\\study-server.pem" ubuntu@PUBLIC_IP</code></pre>
<p>권한이 너무 열려 있다는 오류가 나면 개인 키 파일을 본인만 읽을 수 있도록 권한을 제한한다. Linux·macOS에서는 다음과 같이 설정한다.</p>
<pre data-lang="Shell"><code>chmod 400 study-server.pem
ssh -i study-server.pem ubuntu@PUBLIC_IP</code></pre>
<h2>방법 B. MobaXterm에서 접속</h2>
${shot("06-mobaxterm-home.png", "MobaXterm 시작 화면", "MobaXterm을 실행한 첫 화면. 상단 Session을 눌러 새 연결을 만든다.")}
${shot("07-mobaxterm-session.png", "MobaXterm 세션 유형 선택 화면에서 SSH", "Session 목록에서 SSH를 선택한다.")}
<ol class="aws-steps"><li><b>Remote host</b><span>EC2의 퍼블릭 IP 또는 DNS</span></li><li><b>Specify username</b><span><code>ubuntu</code></span></li><li><b>Advanced SSH settings</b><span>Use private key를 체크하고 <code>.pem</code> 선택</span></li><li><b>접속 확인</b><span>프롬프트가 <code>ubuntu@ip-...</code> 형태로 보이면 성공</span></li></ol>
<h2>Ubuntu 기본 준비</h2>
<pre data-lang="Shell"><code>sudo apt update
sudo apt install -y openjdk-21-jre-headless
java -version

mkdir -p ~/project
cd ~/project
pwd
ls -al</code></pre>
<p>프로젝트가 Java 17이라면 17 JRE를, Java 21이라면 21 JRE를 설치한다. <strong>로컬의 Java 버전과 서버 런타임 버전이 맞아야 한다.</strong></p>
<h2>접속 오류 빠른 진단</h2>
<table><tr><th>증상</th><th>확인</th></tr><tr><td>Connection timed out</td><td>퍼블릭 IP, 22번 인바운드, 현재 내 IP 변경 여부</td></tr><tr><td>Permission denied (publickey)</td><td>사용자 이름, 키 페어 일치, pem 경로</td></tr><tr><td>Host key verification failed</td><td>인스턴스 재생성으로 IP의 서버 키가 바뀌었는지</td></tr><tr><td>java: command not found</td><td>JRE 설치와 PATH</td></tr></table>`
    ),

    lesson(
      "Spring Boot JAR 배포와 systemd 자동 실행",
      "로컬 빌드부터 파일 전송, 실행 확인, 재부팅 후 자동 시작까지 완성한다.",
      `<h2>STEP 01. 로컬에서 배포 파일을 만든다</h2>
<pre data-lang="Shell"><code># Windows
gradlew.bat clean bootJar

# macOS / Linux
./gradlew clean bootJar</code></pre>
<p>완료되면 <code>build/libs</code>에 JAR가 생성된다. <code>-plain.jar</code>가 함께 있다면 보통 Spring Boot 실행용 JAR는 plain이 붙지 않은 파일이다.</p>
<h2>STEP 02. 서버로 전송한다</h2>
<p>MobaXterm 왼쪽 SFTP 영역에 JAR를 드래그하거나 <code>scp</code>를 사용한다.</p>
<pre data-lang="PowerShell"><code>scp -i "C:\\keys\\study-server.pem" build\libs\app-0.0.1-SNAPSHOT.jar ubuntu@PUBLIC_IP:/home/ubuntu/project/app.jar</code></pre>
<h2>STEP 03. 직접 실행해 먼저 검증한다</h2>
<pre data-lang="Shell"><code>cd /home/ubuntu/project
java -jar app.jar</code></pre>
<p>로그에 서버 포트와 Started 메시지가 보이면 다른 SSH 창에서 확인한다.</p>
<pre data-lang="Shell"><code>curl -i http://localhost:8080/actuator/health
# actuator가 없다면 실제 GET API 경로 호출</code></pre>
<div class="check-result"><span>서버 내부 curl 성공</span><i>+</i><span>외부 접속 실패</span><b>보안 그룹·퍼블릭 IP·포트 문제</b></div>
<h2>STEP 04. systemd 서비스로 등록한다</h2>
<p>SSH 창을 닫아도 계속 실행되고, 인스턴스 재부팅 후 자동으로 올라오게 만든다.</p>
<pre data-lang="INI"><code>[Unit]
Description=AHJ Spring Boot Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/project
ExecStart=/usr/bin/java -jar /home/ubuntu/project/app.jar
Restart=on-failure
RestartSec=10
EnvironmentFile=/home/ubuntu/project/app.env
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target</code></pre>
<pre data-lang="Shell"><code>sudo nano /etc/systemd/system/ahj-app.service
sudo systemctl daemon-reload
sudo systemctl enable --now ahj-app
sudo systemctl status ahj-app
journalctl -u ahj-app -f</code></pre>
<h2>새 버전으로 교체하는 안전한 순서</h2>
<ol><li>기존 JAR를 <code>app.jar.backup</code>으로 보관한다.</li><li>새 JAR를 임시 이름으로 업로드한다.</li><li>파일명 교체 후 <code>sudo systemctl restart ahj-app</code>을 실행한다.</li><li>status와 journal 로그를 확인한다.</li><li>health endpoint가 성공할 때 배포 완료로 본다.</li></ol>
<div class="note-warning"><strong>실행했는데 바로 꺼질 때</strong><p><code>journalctl -u ahj-app -n 100 --no-pager</code>에서 Java 버전, 포트 충돌, DB 접속 실패, 환경 변수 누락을 먼저 찾는다.</p></div>`
    ),

    lesson(
      "RDS PostgreSQL을 단계별로 생성하기",
      "엔진·템플릿·스토리지·네트워크·백업 옵션을 고르고 연결 가능한 DB를 만든다.",
      `<h2>RDS를 쓰는 이유</h2>
<p>EC2 안에 PostgreSQL을 직접 설치할 수도 있지만, RDS를 쓰면 DB 프로세스 운영·백업·패치·모니터링의 일부를 AWS가 관리한다. 애플리케이션은 RDS endpoint와 port로 접속한다.</p>
<h2>STEP 01. 데이터베이스 생성</h2>
<div class="console-path"><span>서비스 검색</span><i>→</i><span>RDS</span><i>→</i><span>데이터베이스</span><i>→</i><span>데이터베이스 생성</span></div>
${shot("08-rds-postgresql.png", "RDS 데이터베이스 엔진 중 PostgreSQL 선택", "엔진 옵션에서 PostgreSQL을 선택한다.")}
${shot("09-rds-free-tier.png", "RDS 전체 구성과 프리 티어 템플릿 선택", "학습할 때는 ‘전체 구성’에서 각 옵션의 의미를 확인하고 프리 티어 가능 여부를 본다.")}
<ol class="aws-steps"><li><b>생성 방식</b><span>처음에는 전체 구성을 선택해 옵션을 직접 확인한다.</span></li><li><b>엔진</b><span>PostgreSQL. Spring 의존성과 호환되는 메이저 버전을 고른다.</span></li><li><b>템플릿</b><span>콘솔에 프리 티어가 표시된다면 학습용으로 선택한다.</span></li><li><b>DB 식별자</b><span>예: <code>ahj-study-db</code>. endpoint와는 다른 관리용 이름이다.</span></li><li><b>마스터 사용자</b><span>예: <code>postgres</code>. 비밀번호는 Secret에 보관한다.</span></li></ol>
<h2>STEP 02. 인스턴스와 스토리지</h2>
${shot("10-rds-storage.png", "RDS 범용 SSD 스토리지와 자동 조정 옵션", "학습용은 최소 스토리지로 시작하고, 자동 조정과 최대 임계값을 이해한 뒤 선택한다.")}
<p>인스턴스 클래스와 스토리지는 비용에 직접 영향을 준다. ‘프리 티어’라는 이름만 믿지 말고 생성 화면의 월 예상 비용과 현재 계정의 무료 사용 조건을 확인한다.</p>
<h2>STEP 03. 네트워크 선택 — 학습과 운영을 나눈다</h2>
${shot("11-rds-public-access.png", "RDS 퍼블릭 액세스 예 선택 화면", "노션 당시 로컬 pgAdmin 접속 실습은 ‘예’를 선택했다. 운영 구조에서는 ‘아니요’가 기본이다.")}
<div class="compare-lane"><article><span>로컬에서 직접 접속하는 학습</span><ul><li>퍼블릭 액세스: 예</li><li>인바운드 5432: 현재 내 IP만</li><li>실습 후 규칙 제거 또는 DB 삭제</li></ul></article><article><span>EC2가 접속하는 운영 구조</span><ul><li>퍼블릭 액세스: 아니요</li><li>RDS와 EC2를 같은 VPC에 둔다.</li><li>5432 소스: EC2 보안 그룹</li></ul></article></div>
<h2>STEP 04. 백업과 삭제 보호</h2>
${shot("12-rds-backup.png", "RDS 추가 구성의 자동 백업 옵션", "자동 백업 보존 기간과 삭제 보호 여부를 목적에 맞게 선택한다.")}
<ul><li>학습용 임시 DB: 비용을 줄이려면 보존 기간과 최종 스냅샷 여부를 명확히 결정한다.</li><li>중요 데이터: 자동 백업, 보존 기간, 삭제 방지, 암호화를 켠다.</li><li>유지 관리 시간과 백업 시간은 트래픽이 적은 시간대로 정한다.</li></ul>
<h2>STEP 05. 생성 완료 확인</h2>
<p>상태가 <strong>Available</strong>이 될 때까지 기다린 뒤 연결 및 보안에서 endpoint, port <code>5432</code>, VPC, 보안 그룹을 기록한다. endpoint는 <code>https://</code> 주소가 아니라 JDBC가 접속하는 호스트 이름이다.</p>
<a class="reference-link" href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateDBInstance.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>RDS DB 인스턴스 생성</span><b>↗</b></a>`
    ),

    lesson(
      "pgAdmin과 Spring Boot를 RDS에 연결하기",
      "DB 외부 접속부터 JDBC 설정, 테이블 생성, 서버 배포 환경 분리까지 확인한다.",
      `<h2>먼저 pgAdmin으로 네트워크만 검증한다</h2>
<p>Spring 설정을 고치기 전에 pgAdmin 또는 <code>psql</code>로 접속하면 ‘AWS 네트워크 문제’와 ‘애플리케이션 설정 문제’를 분리할 수 있다.</p>
<table><tr><th>pgAdmin 항목</th><th>입력값</th></tr><tr><td>Host name/address</td><td>RDS endpoint</td></tr><tr><td>Port</td><td>5432</td></tr><tr><td>Maintenance database</td><td>postgres 또는 생성한 DB명</td></tr><tr><td>Username</td><td>RDS 마스터 사용자 또는 앱 전용 사용자</td></tr><tr><td>Password</td><td>Secret에 보관한 값</td></tr></table>
<h2>접속 실패 시 이 순서로 본다</h2>
<ol class="aws-steps"><li><b>RDS 상태</b><span>Available인가?</span></li><li><b>endpoint·port</b><span>오타 없이 5432인가?</span></li><li><b>public 설정</b><span>로컬 직접 접속 실습이라면 Publicly accessible인가?</span></li><li><b>보안 그룹</b><span>PostgreSQL 5432의 소스가 현재 내 공인 IP인가?</span></li><li><b>계정 정보</b><span>DB명·사용자·비밀번호가 맞는가?</span></li></ol>
<h2>Spring Boot 의존성</h2>
<pre data-lang="Gradle"><code>dependencies {
    runtimeOnly 'org.postgresql:postgresql'
    // JPA 사용 시
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
}</code></pre>
<h2>로컬 비공개 설정</h2>
<pre data-lang="Properties"><code>spring.datasource.url=jdbc:postgresql://RDS_ENDPOINT:5432/DB_NAME
spring.datasource.username=APP_DB_USER
spring.datasource.password=APP_DB_PASSWORD

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.properties.hibernate.format_sql=true</code></pre>
<p><code>application-private.properties</code>를 쓴다면 Git에서 제외하고, 기본 설정에서 해당 profile을 포함하거나 실행 시 profile을 활성화한다. 실제 배포에서는 파일을 JAR 안에 넣기보다 환경 변수로 주입하는 편이 안전하다.</p>
<pre data-lang="Environment"><code>SPRING_DATASOURCE_URL=jdbc:postgresql://RDS_ENDPOINT:5432/DB_NAME
SPRING_DATASOURCE_USERNAME=APP_DB_USER
SPRING_DATASOURCE_PASSWORD=CHANGE_ME</code></pre>
<h2>연결 성공을 확인하는 최소 테스트</h2>
<ol><li>pgAdmin에서 테스트 테이블과 데이터를 만든다.</li><li>Spring Boot를 로컬에서 실행해 repository 조회가 되는지 본다.</li><li>EC2의 systemd 환경 파일에 RDS 정보를 넣고 서비스를 재시작한다.</li><li>EC2 로그에서 connection pool 시작과 SQL 오류 여부를 확인한다.</li><li>API를 호출해 RDS 데이터가 응답되는지 확인한다.</li></ol>
<div class="note-warning"><strong>운영 DB 계정</strong><p>마스터 계정을 애플리케이션이 계속 쓰지 말고, 필요한 스키마 권한만 가진 앱 전용 사용자를 만든다. DB 비밀번호를 커밋한 적이 있다면 파일 삭제만 하지 말고 즉시 비밀번호를 변경한다.</p></div>`
    ),

    lesson(
      "Spring Boot에서 S3 업로드 연결하기",
      "SDK 의존성, IAM 권한, S3Client, Multipart 업로드와 검증 순서를 실제 코드로 연결한다.",
      `<h2>노션 실습에서 현재 방식으로 바꾼 부분</h2>
<p>수업 당시에는 AWS SDK v1과 장기 Access Key를 properties에 넣어 실습했다. 흐름을 이해하는 데는 도움이 되지만, 현재 프로젝트는 <strong>AWS SDK for Java 2.x + 기본 자격 증명 공급자 체인</strong>으로 구성하는 편이 낫다. EC2에서는 Access Key 대신 IAM Role의 임시 자격 증명을 사용한다.</p>
<h2>STEP 01. IAM Role을 EC2에 연결한다</h2>
<div class="console-path"><span>IAM</span><i>→</i><span>역할 생성</span><i>→</i><span>신뢰할 엔터티 EC2</span><i>→</i><span>S3 최소 권한 정책</span><i>→</i><span>EC2에 역할 연결</span></div>
<pre data-lang="JSON"><code>{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
    "Resource": "arn:aws:s3:::BUCKET_NAME/uploads/*"
  }]
}</code></pre>
<h2>STEP 02. SDK 의존성을 추가한다</h2>
<pre data-lang="Gradle"><code>implementation platform('software.amazon.awssdk:bom:VERSION')
implementation 'software.amazon.awssdk:s3'</code></pre>
<h2>STEP 03. S3Client를 Bean으로 만든다</h2>
<pre data-lang="Java"><code>@Configuration
public class S3Config {
    @Bean
    S3Client s3Client(@Value("\${app.aws.region}") String region) {
        return S3Client.builder()
            .region(Region.of(region))
            .build();
    }
}</code></pre>
<p>credentials를 코드에 지정하지 않으면 로컬의 AWS profile, 환경 변수, EC2 IAM Role 등을 순서대로 찾는다.</p>
<h2>STEP 04. 원본 파일명과 저장 키를 분리한다</h2>
<pre data-lang="Java"><code>String originalName = file.getOriginalFilename();
String extension = FilenameUtils.getExtension(originalName);
String objectKey = "uploads/" + UUID.randomUUID()
    + (extension.isBlank() ? "" : "." + extension);

PutObjectRequest request = PutObjectRequest.builder()
    .bucket(bucketName)
    .key(objectKey)
    .contentType(file.getContentType())
    .build();

s3Client.putObject(request,
    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));</code></pre>
<h2>Postman 검증 순서</h2>
<ol class="aws-steps"><li><b>Method</b><span>POST</span></li><li><b>Body</b><span>form-data</span></li><li><b>Key</b><span>Controller의 MultipartFile 파라미터 이름과 동일</span></li><li><b>Type</b><span>File</span></li><li><b>확인</b><span>응답 objectKey → S3 콘솔 객체 → DB 메타데이터 순서</span></li></ol>
<div class="note-warning"><strong>업로드 전에 검증</strong><p>빈 파일, 최대 크기, 허용 MIME type, 확장자, 파일명을 검사한다. Content-Type만 믿지 말고 필요하면 실제 파일 시그니처도 확인한다. 사용자 파일을 같은 이름으로 덮어쓰지 않게 UUID 키를 쓴다.</p></div>
<h2>오류별 확인 위치</h2>
<table><tr><th>오류</th><th>확인할 것</th></tr><tr><td>Unable to load credentials</td><td>로컬 profile·환경 변수 또는 EC2 IAM Role 연결</td></tr><tr><td>AccessDenied</td><td>Role policy의 Action, bucket ARN, prefix</td></tr><tr><td>PermanentRedirect</td><td>S3Client region과 버킷 region</td></tr><tr><td>413 Payload Too Large</td><td>Spring multipart 제한과 reverse proxy 제한</td></tr></table>
<a class="reference-link" href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>EC2 애플리케이션에 IAM Role 권한 부여</span><b>↗</b></a>
<a class="reference-link" href="https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/java_s3_code_examples.html" target="_blank" rel="noopener"><small>AWS 공식 문서</small><span>AWS SDK for Java 2.x · S3 예제</span><b>↗</b></a>`
    ),

    lesson(
      "Lambda의 위치와 전체 배포 완성",
      "EC2 상시 서버와 Lambda 이벤트 함수의 차이를 알고 최종 연결을 점검한다.",
      `<h2>Lambda는 EC2를 작게 쪼갠 것이 아니다</h2>
<p>EC2는 서버 프로세스를 계속 실행하고, Lambda는 요청이나 이벤트가 들어올 때 정해진 함수를 실행한다. 짧은 변환·알림·S3 이벤트 처리에는 Lambda가 잘 맞지만, 기존 Spring Boot 전체를 처음부터 Lambda로 옮기는 것은 별도의 설계가 필요하다.</p>
<table><tr><th>기준</th><th>EC2</th><th>Lambda</th></tr><tr><td>실행</td><td>프로세스 상시 실행</td><td>이벤트 때 함수 실행</td></tr><tr><td>관리 단위</td><td>OS·런타임·프로세스</td><td>함수·권한·트리거</td></tr><tr><td>적합한 예</td><td>Spring Boot API 서버</td><td>S3 업로드 후 썸네일 생성</td></tr><tr><td>비용 관점</td><td>인스턴스 실행 시간</td><td>호출 수와 실행 시간</td></tr></table>
<h2>S3 이벤트 Lambda 실습 흐름</h2>
<ol><li>Lambda 함수를 만들고 런타임을 선택한다.</li><li>함수 실행 Role에 필요한 S3 객체 읽기 권한만 준다.</li><li>S3의 특정 prefix·확장자 이벤트를 트리거로 연결한다.</li><li>테스트 파일을 올리고 CloudWatch Logs에서 실행을 확인한다.</li><li>같은 출력 파일이 다시 함수를 호출하지 않도록 입력·출력 prefix를 분리한다.</li></ol>
<h2>최종 배포 체크리스트</h2>
<div class="deployment-checks"><label><input type="checkbox" disabled> EC2에서 Java와 Spring Boot 서비스가 실행된다.</label><label><input type="checkbox" disabled> systemd가 재부팅 후 서비스를 자동 시작한다.</label><label><input type="checkbox" disabled> 외부 health API가 응답한다.</label><label><input type="checkbox" disabled> EC2에서 RDS에 접속한다.</label><label><input type="checkbox" disabled> S3 업로드와 조회 권한이 최소 범위로 동작한다.</label><label><input type="checkbox" disabled> 비밀번호와 Access Key가 Git에 없다.</label><label><input type="checkbox" disabled> 필요 없는 22·8080·5432 공개 규칙을 닫았다.</label><label><input type="checkbox" disabled> 예산 경보와 로그 확인 경로를 알고 있다.</label></div>
<h2>배포가 안 될 때 보는 순서</h2>
<div class="trouble-flow"><span>1. 프로세스</span><i>→</i><span>2. localhost</span><i>→</i><span>3. 포트 매핑</span><i>→</i><span>4. 보안 그룹</span><i>→</i><span>5. 외부 DNS</span></div>
<p><strong>안에서부터 밖으로 확인한다.</strong> 서버에서 <code>curl localhost:8080</code>도 실패하면 AWS 네트워크 문제가 아니다. localhost는 되는데 외부만 안 되면 그때 보안 그룹과 공개 경로를 본다.</p>
<h2>실습 종료 후 비용 정리</h2>
<ol><li>EC2가 더 필요 없으면 종료가 아니라 <strong>terminate</strong>하고 연결된 EBS도 확인한다.</li><li>RDS 삭제 시 최종 스냅샷이 필요한지 결정하고 자동 백업 보존 여부를 본다.</li><li>연결하지 않은 Elastic IP가 남았는지 확인한다.</li><li>S3 버킷은 객체와 버전까지 비운 뒤 삭제한다.</li><li>CloudWatch, Load Balancer, NAT Gateway 등 추가로 만든 자원이 없는지 리전별로 확인한다.</li></ol>`
    )
  ];
})();
