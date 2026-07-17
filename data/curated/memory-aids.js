/* 개념을 '읽은 기록'이 아니라 다시 꺼낼 수 있는 기억으로 남기기 위한 장치 */
(function () {
  const categoryModel = {
    "html-css": "HTML은 건물의 구조, CSS는 배치와 인테리어다. 먼저 구조를 세우고 그다음 보이게 만든다.",
    java: "Java 프로그램은 JVM이라는 작업장 안에서 객체들이 역할을 나눠 일하는 모습으로 그린다.",
    git: "Git은 작업대·포장대·창고를 오가며 변경 이력을 쌓는 시스템이다.",
    sql: "DB는 표가 아니라 규칙이 있는 창고다. SQL은 필요한 물건을 찾고 묶고 바꾸는 작업 지시서다.",
    jdbc: "Java와 DB 사이의 전화 통화다. 연결하고, 질문하고, 답을 받고, 반드시 전화를 끊는다.",
    javascript: "브라우저라는 무대에서 값과 함수가 움직이고, 이벤트가 다음 장면을 시작한다.",
    "servlet-jsp": "Servlet은 요청을 판단하는 직원, JSP는 결과를 화면으로 차려 내는 직원이다.",
    mybatis: "Java 객체와 SQL 사이를 연결하는 통역사다. 번역 규칙은 Mapper에 모인다.",
    "spring-mvc": "요청이 안내 데스크를 지나 담당 Controller와 Service로 전달되고 응답이 되돌아오는 건물이다.",
    "spring-core": "핵심 로직 주변에 반복되는 일을 경비실·방송실·금고처럼 따로 둔다.",
    react: "React 화면은 현재 state를 찍은 사진이다. state가 바뀌면 새 사진을 다시 그린다.",
    jpa: "JPA는 객체의 변화를 지켜보다 트랜잭션 끝에 SQL 장부로 옮겨 적는 관리자다.",
    security: "공항 보안처럼 신원 확인, 출입 권한 확인, 통과·거절 기록이 순서대로 이어진다.",
    aws: "AWS 배포는 섬들을 놓는 일이 아니라 EC2·RDS·S3 사이에 안전한 길을 연결하는 일이다.",
    infra: "실행 환경을 이삿짐 상자처럼 묶고, 어디서든 같은 순서로 풀어 실행한다.",
    realtime: "계속 문을 두드리는 polling 대신 통화선을 열어 두고, 메시지가 생길 때 바로 보낸다.",
    setup: "설정은 주문서다. 버전·경로·포트·환경 변수를 정확히 적어야 같은 결과가 재현된다.",
    "plus-lab": "기능 하나를 코드 조각으로 외우지 말고 요청·상태·실패·검증이 이어지는 한 사이클로 본다."
  };

  const hooks = {
    "html-css": [
      "주소를 입력하면 서버가 재료를 보내고, 브라우저가 HTML·CSS·JavaScript를 조립해 화면을 만든다.",
      "head는 문서의 안내표, body는 실제 관람 공간이다. 시맨틱 태그는 공간마다 이름표를 붙인다.",
      "form은 봉투, input은 빈칸, name은 항목명, submit은 봉투를 보내는 동작으로 기억한다.",
      "선택자는 대상을 찾는 주소다. 더 구체적인 주소가 이기지만, 나중 선언과 상속도 함께 본다.",
      "모든 요소는 내용물·완충재·상자 벽·바깥 간격을 가진 택배 상자다. Flex는 한 줄 배치 담당이다.",
      "Flex가 한 방향의 줄이라면 Grid는 행과 열이 있는 좌석표다. 화면 폭에 따라 좌석 배치를 바꾼다."
    ],
    java: [
      "변수는 타입이 정해진 이름표 상자다. 소스가 컴파일되어 bytecode가 되고 JVM이 실행한다.",
      "조건문은 갈림길, 반복문은 회전문이다. 연산 결과의 타입과 참·거짓이 흐름을 결정한다.",
      "배열은 같은 타입만 들어가는 번호표 사물함이다. 2차원 배열은 사물함이 행과 열로 놓인 모습이다.",
      "클래스는 설계도, 객체는 설계도로 만든 실제 물건, 참조 변수는 그 물건의 위치표다.",
      "생성자는 입구, 캡슐화는 잠금장치, static은 모든 객체가 함께 쓰는 공용 게시판이다.",
      "상속은 공통 골격, 다형성은 같은 리모컨으로 서로 다른 기기를 조작하는 능력이다.",
      "List는 순서 있는 줄, Set은 중복 없는 명단, Map은 이름표가 붙은 서랍으로 구분한다.",
      "예외는 비상 통로, Stream은 데이터가 중간 작업을 거쳐 최종 결과로 흐르는 컨베이어 벨트다.",
      "스레드는 한 주방의 여러 요리사, 네트워크는 주소와 포트를 알고 통신하는 전화 연결이다."
    ],
    git: [
      "working tree에서 고치고, staging area에서 고르고, repository에 커밋해 사진을 남긴다.",
      "브랜치는 평행 작업선, merge는 합류 지점, push와 pull은 로컬과 원격 창고 사이의 운반이다."
    ],
    sql: [
      "행은 한 건, 열은 속성, PK는 절대 겹치지 않는 주민번호다. SELECT는 결과표를 만드는 질문이다.",
      "GROUP BY는 바구니 나누기, 집계는 바구니별 계산, JOIN은 공통 열쇠로 두 표를 지퍼처럼 맞춘다.",
      "서브쿼리는 질문 안의 질문이다. INSERT·UPDATE·DELETE는 조회가 아니라 실제 장부를 바꾼다.",
      "VIEW는 저장된 창문, SEQUENCE는 번호표 기계, PL/SQL은 DB 안에서 실행하는 절차 묶음이다.",
      "트랜잭션은 한 묶음 영수증이다. 전부 반영하거나 전부 취소하고, 락은 동시 수정을 줄 세운다.",
      "인덱스는 책의 찾아보기다. 읽기는 빨라지지만 쓰기와 저장 공간 비용이 생기므로 실행 계획으로 확인한다."
    ],
    jdbc: [
      "드라이버 준비 → Connection → SQL 준비 → 실행 → ResultSet 해석 → 자원 반환 순서로 외운다.",
      "Controller는 접수, Service는 업무 판단, DAO는 DB 창구다. 한 계층이 옆 계층의 일까지 가져가지 않는다.",
      "CRUD 문법보다 중요한 것은 입력이 어느 SQL로 가고 결과가 어떤 객체로 돌아오는지 추적하는 것이다.",
      "한 업무는 하나의 Connection을 공유해야 같은 트랜잭션이 된다. Pool은 연결을 버리지 않고 반납받는다."
    ],
    javascript: [
      "값은 재료, 함수는 조리법, 배열은 순서 있는 재료함, 객체는 이름표가 붙은 재료함이다.",
      "DOM은 HTML을 객체 트리로 본 모습이고, 이벤트는 사용자의 행동이 어느 가지에서 발생했는지 전달한다.",
      "JSON은 전송용 문자열 규격, localStorage는 브라우저 서랍이다. 저장할 때와 꺼낼 때 변환 방향을 구분한다.",
      "Promise는 미래의 결과표다. await는 결과가 올 때까지 해당 함수의 다음 줄만 잠시 기다리게 한다.",
      "this는 호출한 방식에 따라 달라지는 현재 주인, closure는 함수가 바깥 변수를 계속 기억하는 배낭이다.",
      "검증은 현관 검사, 정규식은 형식 자, 파일은 문자열이 아니라 별도 전송 방식이 필요한 짐이다."
    ],
    "servlet-jsp": [
      "Web Server는 정적 파일 창구, WAS는 Java 로직 주방, Servlet은 요청마다 담당 메서드를 고르는 직원이다.",
      "JSP는 Java 로직을 쓰는 곳이 아니라 전달받은 값을 EL로 꺼내 JSTL로 보여 주는 화면 템플릿이다.",
      "요청 → Controller → Service → DAO → request 저장 → JSP forward 순서를 화살표 하나로 그릴 수 있어야 한다."
    ],
    mybatis: [
      "메서드 이름표와 Mapper SQL의 id를 맞추고, 열 이름을 Java 필드에 번역해 결과 객체를 만든다.",
      "동적 SQL은 조건에 따라 문장을 조립하는 블록이다. if·where·foreach가 공백과 구문까지 책임진다.",
      "Mapper는 SQL을 실행하지만 업무 단위 commit·rollback의 경계는 Service에서 잡는다.",
      "N+1은 목록 1번 뒤에 상세 조회 N번이 따라오는 그림이다. 로그와 실행 횟수로 먼저 발견한다."
    ],
    "spring-mvc": [
      "IoC 컨테이너가 객체를 만들고 DI로 연결한다. 요청은 DispatcherServlet이 알맞은 Controller에 배달한다.",
      "REST 응답은 화면 이름이 아니라 상태 코드·헤더·JSON 본문으로 된 택배 상자다.",
      "파일은 multipart, 목록은 page, 반복 처리는 공통 계층으로 빼서 각 Controller의 본문을 가볍게 한다.",
      "DispatcherServlet을 중앙역으로 두고 HandlerMapping·Adapter·Controller·ViewResolver의 이동 경로를 그린다.",
      "바인딩은 요청 값을 객체 칸에 옮겨 담는 일, Validation은 담긴 값이 규칙을 지키는지 검사하는 일이다.",
      "예외는 숨기지 말고 공통 응답으로 번역한다. 로그·상태 코드·요청 식별자가 원인을 찾는 흔적이다."
    ],
    "spring-core": [
      "Filter는 건물 입구, AOP는 여러 방에 공통으로 설치한 센서, Logging은 이동 경로를 남기는 CCTV다.",
      "트랜잭션은 업무 묶음의 경계, Scheduler는 정해진 시각에 그 업무를 호출하는 알람이다.",
      "암호화는 열쇠로 되돌릴 수 있고 해시는 원칙적으로 되돌리지 않는다. Secret은 코드 밖 금고에 둔다."
    ],
    react: [
      "렌더링은 state의 현재 모습을 JSX로 찍는 작업이다. 이전 화면을 직접 고치지 않고 새 화면을 계산한다.",
      "컴포넌트는 조립 부품, props는 부모가 건네는 주문서, children은 부품 사이에 끼워 넣는 내용이다.",
      "state는 스냅샷이고 업데이트는 예약표에 쌓인다. 기존 객체를 고치지 말고 새 객체를 만들어 교체한다.",
      "입력값을 state가 들고 있으면 controlled input이다. 이벤트에서 값을 읽고 state를 바꾸면 화면이 따라온다.",
      "URL은 화면의 주소이자 공유 가능한 state다. 경로·파라미터·쿼리를 무엇에 쓸지 먼저 나눈다.",
      "useEffect는 렌더링 바깥 세상과 약속하는 곳이다. 의존성은 언제 약속을 다시 잡을지 적는 목록이다.",
      "useRef는 다시 렌더링하지 않는 개인 서랍이자 실제 DOM 요소를 가리키는 손잡이다.",
      "Context는 방송망, Reducer는 상태 변경 규칙표, Redux Toolkit은 큰 앱의 방송과 기록을 관리하는 관제실이다.",
      "컴포넌트가 URL을 직접 조립하지 않게 Axios 창구를 두고, 개발 중 Vite Proxy가 백엔드로 중계한다."
    ],
    jpa: [
      "Entity는 영속성 컨텍스트에 들어오면 관리 상태가 된다. 비영속·영속·준영속·삭제를 방 이동처럼 본다.",
      "테이블의 PK와 Entity의 id 생성 전략을 먼저 맞추고, 열 규칙을 annotation으로 번역한다.",
      "단순 CRUD·메서드 이름 조회·JPQL·QueryDSL 중 질문의 복잡도에 맞는 도구를 고른다.",
      "트랜잭션 안에서 관리 중인 Entity가 바뀌면 JPA가 전후를 비교해 UPDATE를 만든다.",
      "FK를 실제로 바꾸는 쪽이 연관관계의 주인이다. 편의 메서드는 양쪽 객체의 기억을 함께 맞춘다.",
      "LAZY는 필요할 때 여는 문이다. 목록을 돌며 문을 N번 열면 N+1이 되므로 쿼리 횟수를 확인한다.",
      "Entity는 DB와 연결된 내부 모델, DTO는 화면·API 경계를 건너는 안전한 운반 상자다.",
      "BooleanExpression을 조건 블록처럼 조합하고, content 조회와 count 조회를 분리해 페이징 비용을 본다."
    ],
    security: [
      "인증은 ‘누구인가’, 인가는 ‘무엇을 할 수 있나’다. 세션과 JWT는 그 확인 결과를 들고 다니는 방식이다.",
      "요청은 여러 Filter 검문소를 순서대로 지난다. 어느 검문소가 인증 정보를 만들고 거절하는지 찾는다.",
      "가입 시 평문 비밀번호를 저장하지 않는다. 단방향 해시와 salt가 적용된 결과만 DB에 남긴다.",
      "로그인 성공은 비밀번호 재전송이 아니라 짧게 쓸 Access Token을 발급하는 순간이다.",
      "JWT 필터는 토큰 찾기 → 서명·만료 검사 → 사용자 복원 → SecurityContext 저장 순서다.",
      "Access는 짧은 출입증, Refresh는 새 출입증을 받는 장기 교환권이다. 보관·폐기 전략도 함께 설계한다.",
      "401은 신원 확인 실패, 403은 신원은 알지만 권한 부족이다. CORS와 CSRF는 서로 다른 위협을 막는다.",
      "정상 요청만 보지 말고 없음·위조·만료·권한 부족을 각각 만들어 상태 코드와 로그를 확인한다."
    ],
    aws: [
      "사용자는 EC2 API를 부르고, EC2는 RDS에 저장하며 S3에 파일을 둔다. IAM과 보안 그룹이 모든 길의 문지기다.",
      "S3의 버킷은 창고, object key는 선반 주소다. 업로드 권한과 공개 읽기 권한은 별개다.",
      "EC2는 인터넷에 빌린 Linux 컴퓨터다. 리전·키·보안 그룹·공인 주소를 한 세트로 확인한다.",
      "SSH는 열쇠 파일로 원격 터미널 문을 여는 일이다. 접속 후 Java·시간대·폴더·방화벽을 준비한다.",
      "JAR을 옮기고 환경 변수를 주고 실행한 뒤, systemd에 등록해 재부팅 후에도 살아나게 한다.",
      "RDS는 관리형 DB 컴퓨터다. 엔진·버전·서브넷·보안 그룹·초기 DB 이름을 차례로 정한다.",
      "내 PC와 EC2는 서로 다른 출발지다. 같은 RDS라도 각각의 접속 허용과 연결 문자열을 따로 검증한다.",
      "Spring은 파일 자체 대신 S3 key를 DB에 남긴다. IAM 권한·bucket·region·content type을 함께 확인한다.",
      "Lambda는 사건이 생길 때만 잠깐 일하는 직원이다. 전체 배포 완성은 URL보다 재시작·로그·비밀 관리로 판정한다."
    ],
    infra: [
      "이미지는 실행 설명서가 봉인된 틀, 컨테이너는 그 틀로 실제 실행한 상자, VM은 OS까지 가진 방이다.",
      "Dockerfile은 위에서 아래로 쌓이는 레이어 레시피다. 빌드 산출물과 실행 환경을 분리하면 가벼워진다.",
      "포트는 문 연결, 환경 변수는 설정 주입, 볼륨은 상자가 사라져도 남는 외부 보관함이다.",
      "장애가 나면 ps → logs → inspect → exec 순으로 외부 상태부터 내부 상태까지 좁혀 들어간다.",
      "Compose는 여러 컨테이너의 배선도다. 서비스 이름이 내부 DNS 이름이 되고 공통 네트워크에서 만난다.",
      "build → tag → push → pull → run을 물류 이동처럼 외우고, 배포 서버에서는 이미지 버전을 고정한다.",
      "Vagrant는 머신 준비, Ansible은 머신 설정, IaC는 그 둘을 코드로 반복 가능하게 만드는 원칙이다."
    ],
    realtime: [
      "polling은 계속 초인종을 누르고, WebSocket은 통화선을 유지한다. 빈도와 지연 요구로 선택한다.",
      "endpoint는 건물 입구, subscribe destination은 수신 채널, publish destination은 발신 창구다.",
      "받기 → 검증 → 저장 → 전송 순서를 지키면 재접속 뒤에도 메시지 기록과 화면이 어긋나지 않는다.",
      "연결에도 로그인·생존 확인·끊김·재시도 상태가 있다. 재연결은 중복 구독까지 함께 막아야 한다.",
      "String·Hash·List·Set·Sorted Set은 보관 모양이 다르고, TTL은 데이터에 붙이는 유통기한이다.",
      "Pub/Sub은 지금 듣는 사람에게 방송하고, Streams는 메시지를 장부에 남겨 나중에 다시 읽게 한다."
    ],
    setup: [
      "node -v → 프로젝트 생성 → npm install → npm run dev 순서로 설치와 프로젝트 문제를 분리한다.",
      "브라우저는 프론트 주소로 요청하고 Proxy가 백엔드로 전달한다. 대상 포트와 path rewrite를 확인한다.",
      "Initializr에서 빌드 도구·Java·Boot 버전·의존성을 고른 뒤 IDE의 JDK와 Gradle 설정까지 맞춘다.",
      "Spring Boot에서 JSP는 템플릿 위치와 의존성 설정이 추가로 필요하다. 정적 파일 경로와 섞지 않는다.",
      "DB 설치 → 사용자 생성 → 권한 부여 → 테이블 공간·스키마 확인 → 접속 테스트 순서로 준비한다.",
      "의존성 → datasource → config → mapper 위치 → interface 연결 → SQL 로그 순으로 한 칸씩 확인한다.",
      "git init 뒤 무작정 add 하지 말고 .gitignore를 먼저 만든다. remote와 기본 branch를 확인한 뒤 push한다.",
      "EC2 보안 그룹은 출발지와 포트를 지정하는 문이다. DB·앱·관리 도구마다 꼭 필요한 길만 연다.",
      "Docker와 Vagrant 모두 버전 확인 → 최소 예제 실행 → 포트·볼륨 확인으로 환경 재현 여부를 판정한다."
    ],
    "plus-lab": [
      "먼저 정규 학습에서 원리를 찾고, 이 장에서는 실제 연결 순서와 실패 지점을 체크한다.",
      "Vite의 base, asset 경로, GitHub Pages source가 맞아야 빈 화면 없이 정적 파일이 열린다.",
      "브라우저 → Spring multipart → S3 object → DB key의 네 지점을 끊김 없이 연결한다.",
      "카카오가 주는 신원과 우리 서비스 회원을 매핑한 뒤, 우리 서비스용 로그인 수단을 따로 발급한다.",
      "결제 준비가 주문 완료는 아니다. tid와 주문 상태를 저장하고 승인 응답 뒤에만 완료로 바꾼다.",
      "외부 API token은 서버 금고에 두고, 요청 실패·권한 범위·rate limit을 운영 조건으로 본다.",
      "감시 요소가 화면에 들어오면 다음 페이지를 요청하되 loading·끝·중복 요청 상태를 잠근다.",
      "로그인 요청과 이후 API 요청은 서로 다른 필터 경로다. 토큰 발급과 검증 책임을 분리한다.",
      "이미지를 registry에 올리고 EC2가 받아 실행한다. 환경 변수·포트·재시작 정책·로그까지 배포 단위다."
    ]
  };

  const visualAssets = {
    "servlet-jsp-1": {
      src: "assets/memory/jsp-web-inf.png",
      alt: "Eclipse에서 WEB-INF 아래에 JSP 파일을 만드는 화면",
      caption: "기억할 위치: 외부에서 JSP를 직접 여는 대신 Controller가 forward하도록 WEB-INF 아래에 view를 둔다. 프로젝트 설정에 따라 실제 views 경로는 달라질 수 있다."
    },
    "spring-mvc-0": {
      src: "assets/memory/spring-initializr.png",
      alt: "Spring Initializr에서 프로젝트와 의존성을 선택하는 화면",
      caption: "원문 수업 당시의 선택 화면이다. 화면에 보이는 버전을 그대로 외우지 말고, 프로젝트의 Java·Spring Boot 호환 버전과 필요한 의존성을 확인하는 순서를 기억한다."
    },
    "react-0": {
      src: "assets/memory/react-vite-structure.png",
      alt: "Vite React 프로젝트 폴더와 App 컴포넌트가 열린 화면",
      caption: "src 아래에서 main.jsx가 시작점을 만들고 App.jsx가 화면 컴포넌트를 구성한다. 실행 중인 터미널과 편집 중인 프로젝트 폴더가 같은지도 함께 확인한다."
    },
    "react-8": {
      src: "assets/memory/react-api-layer.png",
      alt: "React 프로젝트의 api 폴더 안에 axios와 도메인 API 파일을 나눈 화면",
      caption: "axios 공통 설정과 todoApi 같은 도메인 요청을 분리하면 컴포넌트는 URL·헤더 조립보다 화면 상태에 집중할 수 있다."
    },
    "setup-0": {
      src: "assets/memory/vite-ready.png",
      alt: "Vite 개발 서버가 localhost 5173에서 준비된 터미널 화면",
      caption: "ready 문구와 Local 주소가 보이면 개발 서버가 실행된 것이다. 브라우저가 안 열릴 때는 이 터미널을 닫지 않았는지와 포트 번호부터 본다."
    },
    "spring-mvc-5": {
      src: "assets/memory/spring-whitelabel-404.png",
      alt: "Spring Boot Whitelabel Error Page 404 화면",
      caption: "404는 서버 자체가 꺼졌다는 뜻이 아니라, 서버에는 도달했지만 해당 URL을 처리할 mapping이나 정적 자원을 찾지 못했다는 단서다."
    }
  };

  const escapeHtml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  for (const category of window.CURATED_STUDY || []) {
    const categoryHooks = hooks[category.slug] || [];
    category.lessons.forEach((lesson, index) => {
      const hook = categoryHooks[index];
      if (!hook) return;
      const key = `${category.slug}-${index}`;
      const image = visualAssets[key];
      const figure = image ? `<figure class="memory-figure"><img src="${image.src}" alt="${image.alt}" loading="lazy"><figcaption>${image.caption}</figcaption></figure>` : "";
      const memory = `<section class="memory-card"><div class="memory-card-head"><span>MEMORY ANCHOR</span><b>외우려 하지 말고, 이 장면으로 기억하기</b></div><p class="memory-sentence">${hook}</p><div class="memory-model"><b>전체 지도에 놓으면</b><p>${categoryModel[category.slug]}</p></div>${figure}<details class="recall-card"><summary>자료를 가리고 30초만 떠올려보기</summary><ol><li><strong>${escapeHtml(lesson.title)}</strong>을(를) 처음 듣는 사람에게 한 문장으로 설명할 수 있는가?</li><li>입력이나 요청이 들어온 뒤 결과가 나올 때까지의 순서를 화살표로 그릴 수 있는가?</li><li>본문을 보지 않고 가장 자주 생기는 실수와 확인 방법을 하나씩 말할 수 있는가?</li></ol><p>막힌 질문이 지금 다시 읽을 부분이다. 전부 기억나지 않는 것이 정상이고, 한 질문만 회복해도 이번 복습은 성공이다.</p></details></section>`;
      lesson.body = memory + lesson.body;
    });
  }
})();
