(function(){
 const category=s=>window.CURATED_STUDY.find(x=>x.slug===s);const replace=(s,i,b)=>category(s).lessons[i].body=b;
 replace("jpa",0,`<h2>JPA는 객체와 관계형 데이터 사이의 변환 규칙을 표준화한다</h2><p>JPA는 ORM 표준이고 Hibernate는 대표 구현체다. Entity를 저장·조회하면 영속성 컨텍스트가 객체의 상태를 추적하고 적절한 SQL을 실행한다. SQL을 몰라도 되는 기술이 아니라, 객체 모델과 테이블 모델의 차이를 관리하는 기술이다.</p><pre data-lang="Java"><code>@Entity
@Table(name="member")
public class Member {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;
 @Column(nullable=false, length=50) private String name;
 @Enumerated(EnumType.STRING) private MemberStatus status;
 protected Member() {}
}</code></pre><h2>Entity의 생명주기는 영속성 컨텍스트를 기준으로 바뀐다</h2><p>새 객체는 비영속, <code>persist</code> 또는 조회로 관리되면 영속, 컨텍스트에서 분리되면 준영속, 삭제 예약되면 삭제 상태다. 같은 트랜잭션에서 같은 PK를 조회하면 동일 객체를 반환하는 1차 캐시와 동일성 보장이 동작한다.</p><h2>변경 감지는 스냅샷과 현재 상태를 비교한다</h2><pre data-lang="Java"><code>@Transactional
public void changeName(Long id, String name) {
 Member member = repository.findById(id).orElseThrow();
 member.changeName(name); // save 재호출 없이 커밋 시 UPDATE
}</code></pre><p>flush 때 변경된 Entity를 찾아 SQL을 DB에 전달하고 commit이 트랜잭션을 확정한다. flush는 commit이 아니며 JPQL 실행 전에도 일어날 수 있다.</p><h2>Entity 설계에는 DB 제약과 도메인 규칙이 함께 들어간다</h2><ul><li>기본 생성자는 프록시 생성을 위해 protected 이상으로 둔다.</li><li>Enum은 순서 변경에 취약한 ORDINAL보다 STRING이 안전하다.</li><li>모든 필드 setter 대신 의미 있는 변경 메서드로 규칙을 지킨다.</li><li><code>equals/hashCode</code>는 생성 전후 바뀌는 식별자와 프록시를 고려한다.</li></ul><h2>N+1은 연관 데이터를 필요한 시점마다 추가 조회하며 생긴다</h2><p>목록 한 번 뒤 각 행마다 연관 조회가 나가면 쿼리가 1+N번 실행된다. SQL 로그와 통합 테스트로 확인하고 fetch join, EntityGraph, batch fetching, DTO projection 중 화면 요구에 맞는 방법을 사용한다.</p><blockquote><strong>핵심:</strong> JPA의 중심은 Repository 메서드 수가 아니라 트랜잭션 안에서 Entity 상태가 어떻게 추적되고 SQL로 동기화되는지 이해하는 것이다.</blockquote>`);
 replace("jpa",1,`<h2>연관관계 매핑은 외래 키를 객체 참조로 표현한다</h2><p>관계형 DB는 FK로 관계를 저장하고 객체는 참조로 탐색한다. <code>@ManyToOne</code> 쪽이 FK를 가지므로 일반적으로 연관관계의 주인이다.</p><pre data-lang="Java"><code>@Entity
class Order {
 @ManyToOne(fetch=FetchType.LAZY)
 @JoinColumn(name="member_id", nullable=false)
 private Member member;
 public void changeMember(Member member){ this.member=member; }
}</code></pre><h2>양방향 관계는 탐색 편의를 위한 두 개의 매핑이다</h2><p><code>mappedBy</code> 쪽은 읽기 전용이며 FK 변경은 주인 쪽에서 한다. 편의 메서드는 양쪽 컬렉션을 함께 맞추되, 무분별한 양방향 매핑은 순환 참조와 복잡도를 키우므로 실제 탐색이 필요할 때만 추가한다.</p><h2>지연 로딩을 기본으로 하고 조회 목적에 따라 가져온다</h2><p>to-one 관계도 EAGER 기본값을 그대로 두지 말고 LAZY를 명시한다. 목록 화면에서 필요한 관계는 fetch join이나 DTO projection으로 한 번에 조회한다. 컬렉션 fetch join과 페이징을 함께 쓰면 메모리 페이징이나 행 증식 문제가 생길 수 있어 분리 조회나 batch size를 고려한다.</p><h2>DTO는 API와 영속 모델 사이의 안전한 경계다</h2><p>Entity 직접 반환은 내부 필드 노출, 지연 로딩 예외, JSON 순환 참조, API 변경이 DB 모델에 영향을 주는 문제를 만든다. 조회 전용 DTO는 필요한 열만 선택해 전송량과 쿼리를 줄일 수도 있다.</p><h2>QueryDSL은 동적 조건을 타입 안전한 Java 코드로 조립한다</h2><pre data-lang="Java"><code>public List&lt;MemberSummary&gt; search(MemberSearch c) {
 return queryFactory.select(new QMemberSummary(member.id,member.name,member.status))
  .from(member)
  .where(nameContains(c.keyword()), statusEq(c.status()))
  .orderBy(member.id.desc()).fetch();
}
private BooleanExpression statusEq(MemberStatus s){return s==null?null:member.status.eq(s);}</code></pre><p>where에 null 조건을 전달하면 무시되므로 작은 조건 메서드를 조합하기 좋다. 단순 CRUD는 Spring Data 메서드, 고정 쿼리는 JPQL, 복잡한 동적 조회는 QueryDSL처럼 도구를 목적에 맞게 나눈다.</p><blockquote><strong>복습 기준:</strong> 연관관계를 보면 FK 위치, 주인, 로딩 전략, 실제 화면에서 발생할 SQL, Entity 노출 여부를 차례로 확인한다.</blockquote>`);
 replace("security",0,`<h2>인증은 누구인지, 인가는 무엇을 할 수 있는지 확인한다</h2><p>Spring Security는 요청이 Controller에 도달하기 전 Filter Chain에서 인증 정보를 추출·검증하고 SecurityContext에 사용자 정보를 저장한다. 이후 URL 규칙과 메서드 보안이 권한을 판단한다.</p><div class="concept-flow"><span>요청</span><i>→</i><span>Security Filter Chain</span><i>→</i><span>AuthenticationManager</span><i>→</i><span>SecurityContext</span><i>→</i><span>인가</span></div><h2>비밀번호는 복호화하지 않고 해시를 비교한다</h2><p>BCrypt처럼 salt와 비용 계수를 포함한 단방향 해시를 사용한다. 로그인 시 입력을 같은 알고리즘으로 비교하며 평문·단순 SHA 해시는 저장하지 않는다.</p><h2>Filter Chain 규칙은 구체적인 경로부터 설계한다</h2><pre data-lang="Java"><code>http.authorizeHttpRequests(auth -> auth
 .requestMatchers("/api/auth/**", "/public/**").permitAll()
 .requestMatchers(HttpMethod.DELETE,"/api/admin/**").hasRole("ADMIN")
 .anyRequest().authenticated());</code></pre><p>401은 인증 정보가 없거나 유효하지 않은 상태, 403은 인증됐지만 권한이 부족한 상태다. 각각 AuthenticationEntryPoint와 AccessDeniedHandler에서 일관된 JSON 오류를 만든다.</p><h2>세션과 토큰은 인증 상태를 보관하는 위치가 다르다</h2><table><tr><th>방식</th><th>상태 위치</th><th>장점</th><th>주의</th></tr><tr><td>Session</td><td>서버</td><td>즉시 무효화·단순한 브라우저 인증</td><td>공유 저장소·CSRF</td></tr><tr><td>JWT</td><td>서명된 토큰</td><td>분산 검증·API 친화</td><td>탈취·만료 전 취소</td></tr></table><h2>CORS와 CSRF는 다른 문제다</h2><p>CORS는 브라우저의 교차 출처 읽기 정책이고, CSRF는 사용자의 인증 정보가 자동 전송되는 점을 악용한 요청 위조다. 쿠키 인증이면 SameSite와 CSRF 토큰을 검토한다. Authorization 헤더 방식이라도 토큰 저장 위치와 XSS 방어가 중요하다.</p><blockquote><strong>핵심:</strong> 보안은 로그인이 되는지보다 자격 증명의 저장·전송·검증·만료·권한 실패 전 과정을 설계하는 일이다.</blockquote>`);
 replace("security",1,`<h2>JWT는 header.payload.signature로 구성된 서명 토큰이다</h2><p>Payload는 암호화된 비밀 공간이 아니어서 누구나 디코딩할 수 있다. 사용자 식별자, 권한, 발급·만료 시각처럼 검증에 필요한 최소 정보만 넣고 개인정보와 비밀번호는 넣지 않는다. 서버는 알고리즘, 서명, issuer, audience, expiration을 검증한다.</p><h2>Access와 Refresh Token은 수명과 역할을 나눈다</h2><table><tr><th>토큰</th><th>수명</th><th>사용처</th><th>탈취 대응</th></tr><tr><td>Access</td><td>짧음</td><td>API 인증</td><td>피해 시간 제한</td></tr><tr><td>Refresh</td><td>김</td><td>Access 재발급</td><td>서버 저장·회전·폐기</td></tr></table><div class="concept-flow"><span>로그인</span><i>→</i><span>두 토큰 발급</span><i>→</i><span>Access로 API</span><i>→</i><span>만료</span><i>→</i><span>Refresh 검증·회전</span></div><h2>Refresh Token Rotation은 재사용을 탐지한다</h2><p>재발급할 때 기존 Refresh를 폐기하고 새 토큰을 발급한다. 이미 폐기된 토큰이 다시 오면 탈취 가능성이 있으므로 토큰 패밀리 전체를 무효화할 수 있다. 로그아웃, 비밀번호 변경, 계정 잠금 때 서버 저장 레코드를 폐기한다.</p><h2>브라우저 저장 위치는 XSS와 CSRF를 함께 본다</h2><p>localStorage는 JS가 읽을 수 있어 XSS에 취약하다. HttpOnly·Secure 쿠키는 JS 접근을 막지만 자동 전송되므로 SameSite와 CSRF 방어를 설정한다. 흔히 Refresh는 제한된 경로의 HttpOnly 쿠키, Access는 짧게 메모리에 두는 전략을 검토한다.</p><h2>JWT Filter는 매 요청에서 최소한의 일을 한다</h2><ol><li>Authorization Bearer 헤더를 읽는다.</li><li>서명과 클레임·만료를 검증한다.</li><li>사용자와 권한을 Authentication으로 만든다.</li><li>SecurityContext에 넣고 다음 필터로 진행한다.</li></ol><p>토큰 원문을 로그로 남기지 않고, 키는 코드 저장소가 아닌 비밀 관리 시스템에 보관하며 교체 가능한 key id 전략을 둔다.</p><blockquote><strong>복습 기준:</strong> “토큰이 탈취되면 얼마나 오래 쓸 수 있고, 서버가 어떻게 발견·차단하는가?”에 답할 수 있어야 한다.</blockquote>`);
})();
