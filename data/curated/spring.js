(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const replace = (slug, index, body) => { category(slug).lessons[index].body = body; };

  replace("spring-mvc", 0, `<h2>IoC는 객체 생성과 연결의 주도권을 컨테이너에 맡기는 원리다</h2>
<p>직접 <code>new</code>로 의존 객체를 만들면 구현 선택과 생명주기가 사용하는 클래스에 고정된다. Spring 컨테이너는 설정을 읽어 객체를 Bean으로 만들고 필요한 의존성을 주입한다. 애플리케이션 코드는 “어떻게 만들지”보다 “무엇이 필요한지”에 집중한다.</p>
<pre data-lang="Java"><code>@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}</code></pre>
<p>생성자 주입은 필수 의존성을 누락할 수 없고 필드를 <code>final</code>로 유지하며 테스트에서 대역을 넣기 쉽다. 같은 타입 Bean이 여러 개라면 <code>@Qualifier</code> 또는 <code>@Primary</code>로 선택 기준을 명시한다.</p>
<h2>Component Scan과 Bean 설정을 구분한다</h2>
<p><code>@Component</code>, <code>@Controller</code>, <code>@Service</code>, <code>@Repository</code>는 탐색 대상임을 표시한다. 외부 라이브러리 객체나 생성 과정이 복잡한 객체는 <code>@Configuration</code> 안의 <code>@Bean</code>으로 등록한다. Bean은 기본적으로 singleton이므로 요청별 변경 상태를 필드에 두지 않는다.</p>
<h2>Spring MVC의 앞문은 DispatcherServlet이다</h2>
<div class="concept-flow"><span>HTTP 요청</span><i>→</i><span>DispatcherServlet</span><i>→</i><span>HandlerMapping</span><i>→</i><span>Controller</span><i>→</i><span>Service</span><i>→</i><span>View/JSON</span></div>
<p>HandlerMapping이 URL과 메서드에 맞는 Controller 메서드를 찾고, HandlerAdapter가 파라미터 바인딩과 호출을 처리한다. 반환값은 ViewResolver를 거쳐 HTML이 되거나 HttpMessageConverter를 거쳐 JSON이 된다.</p>
<pre data-lang="Java"><code>@Controller
@RequestMapping("/members")
public class MemberController {
    @GetMapping("/{id}")
    public String detail(@PathVariable long id, Model model) {
        model.addAttribute("member", memberService.findById(id));
        return "member/detail";
    }
}</code></pre>
<h2>입력 바인딩 뒤에는 검증이 필요하다</h2>
<p><code>@RequestParam</code>은 쿼리·폼 값, <code>@PathVariable</code>은 경로 값, <code>@ModelAttribute</code>는 폼 객체, <code>@RequestBody</code>는 JSON 본문을 받는다. 타입 변환 성공이 업무적으로 올바른 값이라는 뜻은 아니므로 Bean Validation과 Service의 업무 규칙 검증을 분리한다.</p>
<blockquote><strong>핵심:</strong> IoC/DI는 애노테이션 사용법이 아니라 객체 간 결합을 낮춰 교체와 테스트를 가능하게 하는 설계 원리다.</blockquote>`);

  replace("spring-mvc", 1, `<h2>REST API는 자원을 HTTP의 의미로 다룬다</h2>
<p>URL은 동사보다 자원을 표현하고, 동작은 HTTP 메서드로 구분한다. <code>GET /members/10</code>은 조회, <code>POST /members</code>는 생성, <code>PATCH /members/10</code>은 부분 수정, <code>DELETE /members/10</code>은 삭제를 뜻한다.</p>
<table><tr><th>메서드</th><th>성격</th><th>대표 성공 상태</th></tr><tr><td>GET</td><td>안전·멱등</td><td>200</td></tr><tr><td>POST</td><td>생성·명령</td><td>201</td></tr><tr><td>PUT</td><td>전체 교체·멱등</td><td>200/204</td></tr><tr><td>PATCH</td><td>부분 수정</td><td>200/204</td></tr><tr><td>DELETE</td><td>삭제·멱등하게 설계 가능</td><td>204</td></tr></table>
<h2>@RestController의 반환값은 응답 본문으로 변환된다</h2>
<pre data-lang="Java"><code>@PostMapping
public ResponseEntity&lt;MemberResponse&gt; create(
        @Valid @RequestBody CreateMemberRequest request) {
    MemberResponse created = memberService.create(request.toCommand());
    URI location = URI.create("/api/members/" + created.id());
    return ResponseEntity.created(location).body(created);
}</code></pre>
<p>Jackson 기반 MessageConverter가 DTO를 JSON으로 직렬화한다. Entity를 직접 반환하면 지연 로딩, 순환 참조, 내부 필드 노출, API와 DB 구조의 결합이 생기므로 응답 DTO로 경계를 만든다.</p>
<h2>상태 코드는 처리 결과의 계약이다</h2>
<p>잘못된 입력은 400, 인증되지 않음은 401, 권한 부족은 403, 자원 없음은 404, 상태 충돌은 409로 표현한다. 모든 실패를 200과 문자열 메시지로 돌려주면 클라이언트가 HTTP 표준을 활용할 수 없다.</p>
<pre data-lang="JSON"><code>{
  "code": "VALIDATION_FAILED",
  "message": "입력값을 확인해 주세요.",
  "fieldErrors": [{"field":"email","reason":"이메일 형식이 아닙니다."}]
}</code></pre>
<h2>예외 응답은 @RestControllerAdvice에서 일관되게 만든다</h2>
<p>Controller마다 try/catch를 반복하지 않고 업무 예외, 검증 예외, 예상하지 못한 예외를 공통 형식으로 변환한다. 사용자 응답에는 안전한 메시지만, 서버 로그에는 원인과 요청 추적 정보를 남긴다.</p>
<h2>API 계약에는 경계 조건이 포함된다</h2>
<p>날짜 형식과 시간대, null과 필드 생략의 차이, 빈 목록, 페이지 번호, 정렬 허용값을 문서화한다. 멱등성이 필요한 결제·주문 생성은 idempotency key 같은 중복 방지 전략도 고려한다.</p>
<blockquote><strong>복습 기준:</strong> 엔드포인트마다 자원, 메서드, 요청 DTO, 성공 상태, 오류 상태, 응답 DTO를 한 세트로 설명할 수 있어야 한다.</blockquote>`);

  replace("spring-mvc", 2, `<h2>파일 업로드는 메타데이터와 실제 파일을 분리해 생각한다</h2>
<p><code>multipart/form-data</code> 요청은 텍스트 필드와 바이너리 파트를 함께 보낸다. Controller는 <code>MultipartFile</code>을 받고 Service가 파일 정책과 저장을 담당한다. 원본 파일명은 표시용 메타데이터일 뿐 저장 경로로 신뢰하면 안 된다.</p>
<pre data-lang="Java"><code>@PostMapping(value="/attachments", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
public AttachmentResponse upload(@RequestPart MultipartFile file) {
    return attachmentService.store(file);
}</code></pre>
<ul><li>크기 제한과 허용 확장자뿐 아니라 실제 MIME·파일 시그니처를 확인한다.</li><li>서버가 생성한 UUID 이름을 사용하고 경로 이동 문자를 차단한다.</li><li>실행 파일은 웹 루트 밖에 저장하며 다운로드 시 Content-Disposition을 설정한다.</li><li>DB에는 저장 키, 원본명, 크기, 타입, 소유자 등 메타데이터를 저장한다.</li></ul>
<h2>페이징은 데이터가 커져도 일정한 단위로 읽기 위한 계약이다</h2>
<pre data-lang="Java"><code>Page&lt;Member&gt; page = memberService.search(
    condition, PageRequest.of(pageNumber, size, Sort.by("id").descending())
);</code></pre>
<p>페이지 번호는 보통 0 또는 1 기준이 섞이므로 API 계약에서 명확히 한다. size 상한과 정렬 허용 열을 제한한다. offset 방식은 구현이 단순하지만 뒤 페이지로 갈수록 건너뛸 행이 많고 데이터 추가 시 중복·누락이 생길 수 있다. 연속 스크롤이나 대량 데이터에는 마지막 키를 기준으로 하는 cursor/keyset 방식을 검토한다.</p>
<h2>공통 처리는 실행 위치에 따라 나눈다</h2>
<table><tr><th>기능</th><th>적합한 위치</th><th>예</th></tr><tr><td>Filter</td><td>Servlet 전후</td><td>CORS, 인코딩, 인증 토큰</td></tr><tr><td>Interceptor</td><td>Controller 전후</td><td>로그인 확인, 요청 사용자 주입</td></tr><tr><td>ArgumentResolver</td><td>메서드 인자 생성</td><td>@LoginUser 객체</td></tr><tr><td>ControllerAdvice</td><td>예외·바인딩 공통화</td><td>오류 응답</td></tr><tr><td>AOP</td><td>Bean 메서드 횡단 관심사</td><td>트랜잭션, 수행시간</td></tr></table>
<h2>업로드와 DB 저장의 실패 시점을 설계한다</h2>
<p>파일 저장은 성공했는데 DB 저장이 실패하면 고아 파일이 남고, 반대면 깨진 메타데이터가 남는다. 임시 영역 저장 → 검증 → DB 반영 → 최종 위치 이동 같은 보상 절차를 두고 실패 파일 정리 작업을 마련한다.</p>
<blockquote><strong>핵심:</strong> 편의 기능도 입력 제한, 저장 일관성, 대용량에서의 비용까지 포함해야 운영 가능한 기능이 된다.</blockquote>`);

  replace("spring-core", 0, `<h2>Logging은 실행 중인 시스템을 관찰하기 위한 기록이다</h2>
<p><code>System.out.println</code> 대신 SLF4J API와 Logback 구현을 사용하면 레벨, 출력 형식, 파일 분리와 환경별 설정을 제어할 수 있다. 문자열 결합 대신 placeholder를 사용하면 해당 레벨이 꺼져 있을 때 불필요한 계산을 줄인다.</p>
<pre data-lang="Java"><code>log.info("order completed. orderId={}, memberId={}", orderId, memberId);
log.warn("stock is low. productId={}, remaining={}", productId, remaining);</code></pre>
<table><tr><th>레벨</th><th>의미</th></tr><tr><td>ERROR</td><td>즉시 확인할 실패</td></tr><tr><td>WARN</td><td>처리는 가능하지만 위험한 상태</td></tr><tr><td>INFO</td><td>주요 업무 이벤트와 상태 변화</td></tr><tr><td>DEBUG/TRACE</td><td>개발·진단용 세부 흐름</td></tr></table>
<p>비밀번호, 토큰, 주민번호, 카드정보는 로그에 남기지 않는다. 요청 ID나 trace ID를 모든 로그에 포함하면 한 요청의 여러 계층 기록을 연결할 수 있다.</p>
<h2>Filter는 HTTP 요청이 Spring MVC에 들어오기 전부터 동작한다</h2>
<p>Servlet 표준 계층에서 인코딩, CORS, 보안 필터, 요청 래핑을 처리한다. 반드시 <code>chain.doFilter()</code>를 호출해야 다음 필터와 Controller로 진행하며, 전후 시간을 재면 전체 요청 지연을 관찰할 수 있다.</p>
<h2>AOP는 여러 Bean에 흩어질 횡단 관심사를 분리한다</h2>
<p>Aspect는 어디에 적용할지(Pointcut)와 무엇을 할지(Advice)를 정의한다. 메서드 실행 전후, 반환 후, 예외 후, 전체를 감싸는 Around Advice가 있다.</p>
<pre data-lang="Java"><code>@Around("execution(* com.example..service..*(..))")
public Object measure(ProceedingJoinPoint joinPoint) throws Throwable {
    long start = System.nanoTime();
    try { return joinPoint.proceed(); }
    finally { log.debug("{} {}ms", joinPoint.getSignature(), elapsedMs(start)); }
}</code></pre>
<h2>Spring AOP는 프록시 기반이라는 제한이 있다</h2>
<p>외부 호출이 프록시를 통과할 때 Advice가 적용된다. 같은 객체 안에서 다른 메서드를 호출하는 self-invocation은 프록시를 거치지 않아 <code>@Transactional</code> 같은 기능이 적용되지 않을 수 있다. private/final 메서드와 프록시 방식의 관계도 확인해야 한다.</p>
<blockquote><strong>기준:</strong> AOP에는 기술적 공통 관심사를 두고, 주문 할인 같은 핵심 업무 규칙은 명시적인 도메인 코드에 남긴다.</blockquote>`);

  replace("spring-core", 1, `<h2>@Transactional은 트랜잭션 경계를 선언한다</h2>
<p>프록시는 메서드 시작 전에 트랜잭션을 열고 정상 반환이면 커밋, 예외면 롤백한다. 여러 Repository 변경을 하나의 업무 단위로 묶는 Service 메서드에 두는 것이 일반적이다.</p>
<pre data-lang="Java"><code>@Transactional
public Order placeOrder(PlaceOrderCommand command) {
    Product product = productRepository.findById(command.productId())
        .orElseThrow(ProductNotFoundException::new);
    product.decreaseStock(command.quantity());
    return orderRepository.save(Order.create(product, command));
}</code></pre>
<h2>롤백 규칙과 전파를 이해한다</h2>
<p>기본적으로 unchecked 예외는 롤백하고 checked 예외는 롤백하지 않는다. 예외를 잡아 정상 반환하면 프록시는 성공으로 판단할 수 있으므로 다시 던지거나 rollback 규칙을 명시한다. <code>REQUIRED</code>는 기존 트랜잭션에 참여하고 없으면 새로 만들며, <code>REQUIRES_NEW</code>는 기존 것을 보류하고 별도 트랜잭션을 만든다.</p>
<h2>readOnly와 지연 로딩의 경계를 맞춘다</h2>
<p>조회 메서드에 <code>readOnly=true</code>를 지정하면 의도를 표현하고 구현체가 최적화할 여지가 생긴다. JPA 지연 로딩은 영속성 컨텍스트가 열린 트랜잭션 안에서 필요한 데이터를 DTO로 변환해 두는 편이 안전하다. Controller까지 트랜잭션을 늘리는 OSIV는 편하지만 쿼리 위치와 연결 점유를 흐릴 수 있다.</p>
<h2>Scheduler는 정해진 시간이나 간격에 작업을 실행한다</h2>
<pre data-lang="Java"><code>@Scheduled(cron = "0 0 3 * * *", zone = "Asia/Seoul")
public void expireCoupons() {
    couponService.expireBefore(Instant.now());
}</code></pre>
<p><code>fixedRate</code>는 시작 간격, <code>fixedDelay</code>는 종료 후 대기 간격, cron은 달력 기반 일정을 표현한다. 시간대, 서버 재시작 중 놓친 실행, 중복 실행을 고려해야 한다.</p>
<h2>다중 서버에서는 한 번만 실행된다는 보장이 없다</h2>
<p>인스턴스마다 Scheduler가 실행되므로 DB 락, 분산 락, 리더 선출, 전용 배치 시스템 중 하나로 단일 실행을 보장한다. 작업 자체도 재실행해도 결과가 깨지지 않는 멱등성을 갖추고 처리 건수와 실패를 기록한다.</p>
<blockquote><strong>운영 기준:</strong> 트랜잭션은 일관성을 지킬 최소 업무 범위로, 스케줄 작업은 중복·누락·재시도를 견디는 구조로 설계한다.</blockquote>`);
})();
