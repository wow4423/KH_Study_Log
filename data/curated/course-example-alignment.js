/* 원본 수업 필기에서 실제로 사용한 실습 도메인으로 코드 예시를 통일한다. */
(function () {
  const categories = window.CURATED_STUDY || [];
  const lessonAt = (slug, index) => categories.find((category) => category.slug === slug)?.lessons[index];
  const lessonContaining = (slug, text) => categories.find((category) => category.slug === slug)?.lessons.find((lesson) => lesson.body.includes(text));
  const encode = (code) => String(code).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const block = (language, code, context = "") => `${context ? `<div class="course-code-context"><span>수업에서 했던 예제로 다시 보기</span><p>${context}</p></div>` : ""}<pre data-lang="${language}"><code>${encode(code.trim())}</code></pre>`;

  function replaceCode(lesson, matcher, language, code, context = "") {
    if (!lesson) return;
    const pattern = /<pre\b[^>]*><code>([\s\S]*?)<\/code><\/pre>/g;
    let replaced = false;
    lesson.body = lesson.body.replace(pattern, (whole, content) => {
      if (replaced || !matcher.test(content)) return whole;
      replaced = true;
      return block(language, code, context);
    });
  }

  function replaceAllCodes(lesson, matcher, language, code) {
    if (!lesson) return;
    const pattern = /<pre\b[^>]*><code>([\s\S]*?)<\/code><\/pre>/g;
    lesson.body = lesson.body.replace(pattern, (whole, content) => matcher.test(content) ? block(language, code) : whole);
  }

  // Java: 학생·Person·Member 실습 흐름으로 객체지향 개념을 다시 연결한다.
  const javaObject = lessonAt("java", 3);
  if (javaObject) {
    javaObject.body = javaObject.body.replace(
      /<h2>객체는 관련된 상태와 행동을 한 단위로 묶는다<\/h2>[\s\S]*?(?=<blockquote>)/,
      `<h2>수업에서 만들었던 Student 객체로 다시 보기</h2><p>수업에서는 학생 이름과 점수를 각각 따로 들고 다니는 대신 <code>Student</code>라는 하나의 객체로 묶었다. 객체를 배열에 담으면 학생 수가 늘어나도 같은 방식으로 순회할 수 있다.</p>${block("Java", `public class Student {
    private String name;
    private int score;

    public Student(String name, int score) {
        this.name = name;
        setScore(score);
    }

    public void setScore(int score) {
        if (score < 0 || score > 100) {
            throw new IllegalArgumentException("점수는 0~100점입니다.");
        }
        this.score = score;
    }
}

Student[] students = {
    new Student("홍길동", 100),
    new Student("김철수", 85)
};`, "Java 초반에 작성했던 학생 성적 관리 예제를 객체로 발전시킨 형태다.")}<p><code>new</code>가 Heap에 객체를 만들고 생성자가 초기 상태를 완성한다. 참조 변수 두 개가 같은 Student를 가리킬 수 있다는 점도 Member 예제와 같은 원리다.</p>`
    );
  }

  const javaPolymorphism = lessonAt("java", 5);
  replaceCode(javaPolymorphism, /abstract class Payment/, "Java", `abstract class Person {
    private final String name;

    protected Person(String name) { this.name = name; }
    public String getName() { return name; }
    public abstract void introduce();
}

class Student extends Person {
    private final int score;

    Student(String name, int score) {
        super(name);
        this.score = score;
    }

    @Override
    public void introduce() {
        System.out.println(getName() + " 학생, 점수 " + score);
    }
}`, "Person을 상속한 Student를 만들고 오버라이딩했던 수업 흐름으로 상속을 확인한다.");
  replaceAllCodes(javaPolymorphism, /List&lt;Payment&gt;|List<Payment>/, "Java", `List<Person> people = List.of(
    new Student("룰루", 85),
    new Student("홍길동", 100)
);

for (Person person : people) {
    person.introduce(); // 실제 Student의 메서드 실행
}`);
  if (javaPolymorphism) javaPolymorphism.body = javaPolymorphism.body.replace("구체 결제 방식을 몰라도 된다", "구체적인 Student 구현을 몰라도 된다");

  replaceCode(lessonAt("java", 7), /orderService\.order/, "Java", `try {
    memberService.join(request);
} catch (MemberJoinException e) {
    System.out.println(e.getMessage());
}`, "수업에서 직접 만든 MemberJoinException을 호출부에서 처리했던 예시다.");

  // Oracle: 수업용 EMPLOYEE·DEPARTMENT·LOCATION 스키마를 기준으로 조회 예제를 맞춘다.
  replaceCode(lessonAt("sql", 0), /FROM member\s+WHERE created_at/i, "SQL", `SELECT EMP_ID, EMP_NAME, SALARY
FROM EMPLOYEE
WHERE SALARY >= 3000000
ORDER BY EMP_NAME;`, "Oracle 수업 내내 사용한 EMPLOYEE 테이블 기준이다.");
  replaceCode(lessonAt("sql", 1), /FROM member\s+GROUP BY status/i, "SQL", `SELECT JOB_CODE,
       COUNT(*) AS EMP_COUNT,
       ROUND(AVG(SALARY)) AS AVG_SALARY
FROM EMPLOYEE
GROUP BY JOB_CODE
HAVING COUNT(*) >= 3
ORDER BY EMP_COUNT DESC;`, "EMPLOYEE 데이터를 직급별로 묶어 COUNT와 AVG를 함께 확인한다.");
  replaceCode(lessonAt("sql", 1), /COUNT\(o\.order_id\).*SUM/s, "SQL", `SELECT D.DEPT_ID,
       D.DEPT_TITLE,
       COUNT(E.EMP_ID) AS EMP_COUNT,
       NVL(ROUND(AVG(E.SALARY)), 0) AS AVG_SALARY
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E ON E.DEPT_CODE = D.DEPT_ID
GROUP BY D.DEPT_ID, D.DEPT_TITLE
ORDER BY D.DEPT_ID;`, "DEPARTMENT와 EMPLOYEE를 JOIN했던 수업 문제를 집계까지 확장했다.");
  replaceCode(lessonAt("sql", 1), /LEFT JOIN orders/i, "SQL", `SELECT D.DEPT_ID, COUNT(E.EMP_ID) AS EMP_COUNT
FROM DEPARTMENT D
LEFT JOIN EMPLOYEE E ON E.DEPT_CODE = D.DEPT_ID
GROUP BY D.DEPT_ID;`);
  replaceCode(lessonAt("sql", 2), /WHERE EXISTS[\s\S]*FROM orders/, "SQL", `SELECT E.EMP_ID, E.EMP_NAME, E.SALARY
FROM EMPLOYEE E
WHERE E.SALARY > (
    SELECT AVG(SALARY)
    FROM EMPLOYEE
);`, "평균 급여보다 많이 받는 사원을 찾았던 서브쿼리 흐름이다.");
  replaceCode(lessonAt("sql", 2), /WITH paid_total/, "SQL", `WITH DEPT_SALARY AS (
    SELECT DEPT_CODE, SUM(SALARY) AS TOTAL_SALARY
    FROM EMPLOYEE
    GROUP BY DEPT_CODE
)
SELECT D.DEPT_TITLE, S.TOTAL_SALARY
FROM DEPARTMENT D
JOIN DEPT_SALARY S ON S.DEPT_CODE = D.DEPT_ID
ORDER BY S.TOTAL_SALARY DESC;`);
  replaceCode(lessonAt("sql", 5), /CREATE INDEX ix_orders_member_date/, "SQL", `CREATE INDEX IX_BOARD_WRITER_DATE
ON BOARD(WRITER_NO, CREATED_AT DESC);

SELECT NO, TITLE, CREATED_AT
FROM BOARD
WHERE WRITER_NO = :memberNo
  AND DEL_YN = 'N'
ORDER BY CREATED_AT DESC
FETCH FIRST 20 ROWS ONLY;`, "게시판 목록과 작성자별 조회에 맞춘 복합 인덱스 예시다.");
  replaceCode(lessonAt("sql", 5), /FROM orders/i, "SQL", `SELECT NO, TITLE, CREATED_AT
FROM BOARD
WHERE WRITER_NO = :memberNo
ORDER BY CREATED_AT DESC
FETCH FIRST 20 ROWS ONLY;`);

  // JavaScript: 여러 페이지 CRUD 예제는 원문의 게시판 localStorage 구조로 통일한다.
  replaceCode(lessonAt("javascript", 8), /const items = JSON\.parse/, "JavaScript", `const params = new URLSearchParams(location.search);
const boardNo = params.get("no");
const boards = JSON.parse(localStorage.getItem("boards") ?? "[]");
const board = boards.find((item) => String(item.no) === boardNo);

if (!board) {
    alert("게시글을 찾을 수 없습니다.");
    location.href = "board_list.html";
}`, "board_list → board_detail로 이동하며 쿼리스트링의 글 번호를 전달했던 수업 예제다.");

  // Spring: 수업에서 계속 이어 간 Member·Board 계층으로 교체한다.
  replaceCode(lessonAt("spring-mvc", 0), /class OrderService/, "Java", `@Service
public class MemberService {
    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }
}`, "Servlet부터 Spring MVC까지 이어서 사용한 회원 기능으로 DI를 확인한다.");
  replaceCode(lessonAt("spring-core", 0), /order completed/, "Java", `log.info("board created. boardId={}, writerId={}", boardId, memberId);
log.warn("login failed. username={}, reason={}", username, reason);`, "게시글 작성과 로그인 실패처럼 실제 수업 기능에서 필요한 로그 문맥을 남긴다.");
  replaceCode(lessonAt("spring-core", 1), /public Order placeOrder/, "Java", `@Transactional
public Long write(BoardWriteRequest request, String username) {
    Member writer = memberRepository.findByUsername(username)
        .orElseThrow(MemberNotFoundException::new);

    Board board = Board.create(request.getTitle(), request.getContent(), writer);
    return boardRepository.save(board).getId();
}`, "회원과 게시판을 연결했던 수업 프로젝트의 한 요청을 트랜잭션으로 묶는다.");

  // JPA·QueryDSL: 임의 주문 예제 대신 원문 후반의 MEMBER–BOARD 모델을 사용한다.
  const relation = lessonAt("jpa", 4);
  replaceCode(relation, /private List&lt;Order&gt; orders/, "Java", `@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "WRITER_ID", nullable = false)
private Member writer;

// MemberEntity
@OneToMany(mappedBy = "writer")
private List<Board> boards = new ArrayList<>();`, "게시글의 writer가 연관관계의 주인으로 MEMBER 외래키를 관리한다.");
  replaceAllCodes(relation, /addOrder|assignMember|getOrders/, "Java", `public void assignWriter(Member writer) {
    this.writer = writer;
    if (!writer.getBoards().contains(this)) {
        writer.getBoards().add(this);
    }
}`);
  if (relation) {
    const relationTerms = [
      ["새 Order가 assignMember를 호출한다.", "새 Board가 assignWriter를 호출한다."],
      ["연관관계 주인인 order.member에 Member를 저장한다.", "연관관계 주인인 board.writer에 Member를 저장한다."],
      ["반대편 member.orders에도 현재 Order를 넣어 메모리 상태를 맞춘다.", "반대편 member.boards에도 현재 Board를 넣어 메모리 상태를 맞춘다."],
      ["flush 때 orders.member_id 외래 키가 INSERT 또는 UPDATE된다.", "flush 때 board.writer_id 외래 키가 INSERT 또는 UPDATE된다."],
      ["member.getOrders().add(order)만", "member.getBoards().add(board)만"]
    ];
    relationTerms.forEach(([before, after]) => { relation.body = relation.body.replaceAll(before, after); });
  }

  const nPlusOne = lessonAt("jpa", 5);
  replaceCode(nPlusOne, /List&lt;Order&gt; orders = orderRepository/, "Java", `List<Board> boards = boardRepository.findAll(); // 게시글 1회 조회
for (Board board : boards) {
    board.getWriter().getNick(); // 작성자마다 추가 조회 N회
}`, "게시글 목록에서 작성자 닉네임을 출력할 때 발생하는 N+1이다.");
  replaceCode(nPlusOne, /findAllWithMember/, "Java", `@Query("select b from Board b join fetch b.writer where b.delYn = 'N'")
List<Board> findAllWithWriter();`);

  replaceCode(lessonAt("jpa", 6), /record OrderResponse/, "Java", `public record BoardResponse(
    Long id,
    String title,
    Long writerId,
    String writerNick
) {
    static BoardResponse from(Board board) {
        return new BoardResponse(
            board.getId(),
            board.getTitle(),
            board.getWriter().getId(),
            board.getWriter().getNick()
        );
    }
}`, "Entity를 그대로 응답하지 않고 게시판 화면에 필요한 값만 DTO로 만든다.");

  const queryDsl = lessonAt("jpa", 7);
  replaceCode(queryDsl, /private BooleanExpression titleContains[\s\S]*book\.title/, "Java", `private static final QBoardEntity board = QBoardEntity.boardEntity;

private BooleanExpression titleContains(String title) {
    return StringUtils.hasText(title) ? board.title.contains(title) : null;
}

private BooleanExpression writerNickContains(String nick) {
    return StringUtils.hasText(nick) ? board.writer.nick.contains(nick) : null;
}

public List<BoardEntity> search(BoardSearchCondition condition) {
    return queryFactory.selectFrom(board)
        .where(
            titleContains(condition.getTitle()),
            writerNickContains(condition.getWriterNick()),
            board.delYn.eq("N")
        )
        .orderBy(board.id.desc())
        .fetch();
}`, "수업 후반에 작성한 BoardRepositoryImpl의 동적 게시글 검색 구조다.");
  replaceCode(queryDsl, /List&lt;OrderSummary&gt;/, "Java", `List<BoardSummary> content = queryFactory
    .select(Projections.constructor(
        BoardSummary.class,
        board.id,
        board.title,
        board.writer.nick
    ))
    .from(board)
    .join(board.writer, member)
    .where(titleContains(condition.getTitle()), board.delYn.eq("N"))
    .offset(pageable.getOffset())
    .limit(pageable.getPageSize())
    .fetch();`);

  const redis = lessonContaining("realtime", "product:31:detail");
  replaceCode(redis, /product:31:detail/, "Plain Text", `member:7:profile
room:12:online-members
board:31:detail:v2
refresh-token:member:7`, "회원·채팅방·게시글·Refresh Token처럼 수업 기능을 키 이름에 드러낸다.");
})();
