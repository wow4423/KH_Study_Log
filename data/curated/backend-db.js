(function () {
  const category = (slug) => window.CURATED_STUDY.find((item) => item.slug === slug);
  const replace = (slug, index, body) => { category(slug).lessons[index].body = body; };

  replace("sql", 0, `<h2>관계형 데이터베이스는 데이터를 표와 관계로 관리한다</h2>
<p>테이블은 같은 성격의 데이터를 행과 열로 표현한다. 행은 한 개체, 열은 그 개체의 속성이다. 기본 키(PK)는 행을 유일하게 식별하고, 외래 키(FK)는 다른 테이블의 키를 참조해 관계와 무결성을 만든다.</p>
<table><tr><th>제약조건</th><th>보장하는 것</th><th>예</th></tr><tr><td>PRIMARY KEY</td><td>행의 유일성과 NOT NULL</td><td>member_id</td></tr><tr><td>FOREIGN KEY</td><td>존재하는 부모 행만 참조</td><td>order.member_id</td></tr><tr><td>UNIQUE</td><td>중복 값 방지</td><td>email</td></tr><tr><td>NOT NULL</td><td>필수값 보장</td><td>name</td></tr><tr><td>CHECK</td><td>값의 허용 범위</td><td>price &gt;= 0</td></tr></table>
<h2>SELECT는 논리적인 처리 순서로 읽는다</h2>
<pre data-lang="SQL"><code>SELECT status, name
FROM member
WHERE created_at &gt;= DATE '2025-01-01'
ORDER BY name ASC;</code></pre>
<p>작성 순서와 달리 개념적으로 <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</code> 순서로 처리된다. 그래서 SELECT에서 만든 별칭을 같은 단계보다 먼저 실행되는 WHERE에서 바로 쓸 수 없는 경우가 많다.</p>
<h2>WHERE는 TRUE인 행만 남긴다</h2>
<p>SQL의 NULL은 0이나 빈 문자열이 아니라 “알 수 없음”이다. <code>= NULL</code>이 아니라 <code>IS NULL</code>을 사용한다. NULL이 포함된 비교는 UNKNOWN이 되어 WHERE를 통과하지 않는다.</p>
<pre data-lang="SQL"><code>SELECT member_id, name
FROM member
WHERE status = 'ACTIVE'
  AND deleted_at IS NULL
  AND name LIKE '김%';</code></pre>
<p><code>AND</code>가 <code>OR</code>보다 먼저 평가되므로 조건이 섞이면 괄호로 의도를 표시한다. 날짜 열에 함수를 씌우기보다 범위 조건을 사용하면 인덱스를 활용하기 쉽다.</p>
<h2>정규화는 중복과 갱신 이상을 줄인다</h2>
<p>회원 이름을 주문 행마다 저장하면 이름 변경 시 여러 행을 수정해야 한다. 회원과 주문을 분리하고 키로 연결하면 사실을 한곳에 저장할 수 있다. 다만 조회 성능을 위한 반정규화는 측정된 병목과 일관성 유지 전략이 있을 때 선택한다.</p>
<blockquote><strong>복습 기준:</strong> 테이블을 볼 때 “한 행은 무엇인가, PK는 무엇인가, 반복 저장되는 사실은 없는가, NULL은 어떤 의미인가”를 먼저 묻는다.</blockquote>`);

  replace("sql", 1, `<h2>집계 함수는 여러 행을 하나의 값으로 요약한다</h2>
<p><code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code>, <code>MAX</code>가 대표적이다. <code>COUNT(*)</code>는 행 수를 세고 <code>COUNT(column)</code>은 NULL이 아닌 값만 센다.</p>
<pre data-lang="SQL"><code>SELECT status,
       COUNT(*) AS member_count,
       AVG(point) AS average_point
FROM member
GROUP BY status
HAVING COUNT(*) &gt;= 10
ORDER BY member_count DESC;</code></pre>
<h2>WHERE와 HAVING은 필터링 시점이 다르다</h2>
<p>WHERE는 그룹을 만들기 전의 개별 행을, HAVING은 GROUP BY 뒤의 집계 결과를 걸러낸다. 집계와 무관한 조건은 WHERE에 먼저 두어 처리할 행을 줄이는 것이 명확하고 효율적이다.</p>
<h2>JOIN은 관계된 테이블의 행을 결합한다</h2>
<table><tr><th>종류</th><th>결과</th><th>용도</th></tr><tr><td>INNER JOIN</td><td>양쪽 조건이 맞는 행만</td><td>주문이 있는 회원</td></tr><tr><td>LEFT JOIN</td><td>왼쪽 전체 + 오른쪽 일치</td><td>주문이 없는 회원도 포함</td></tr><tr><td>SELF JOIN</td><td>같은 테이블끼리 연결</td><td>직원과 관리자</td></tr></table>
<pre data-lang="SQL"><code>SELECT m.member_id, m.name,
       COUNT(o.order_id) AS order_count,
       COALESCE(SUM(o.total_price), 0) AS total_amount
FROM member m
LEFT JOIN orders o
  ON o.member_id = m.member_id
 AND o.status = 'PAID'
GROUP BY m.member_id, m.name;</code></pre>
<p>LEFT JOIN에서 오른쪽 테이블 조건을 WHERE에 두면 NULL로 채워진 행이 제거되어 사실상 INNER JOIN처럼 될 수 있다. 오른쪽 행의 결합 조건이라면 ON 절에 두는 차이를 이해해야 한다.</p>
<h2>일대다 JOIN은 행을 증식시킨다</h2>
<p>회원 한 명에 주문 세 건이면 회원 행이 세 번 나타난다. 여러 일대다 관계를 동시에 JOIN하면 곱집합처럼 수가 늘어 집계가 부풀 수 있다. 각 자식 테이블을 먼저 집계한 뒤 결합하거나 서브쿼리로 목적별 결과를 만든다.</p>
<h2>실행 계획으로 추측을 검증한다</h2>
<p>느린 쿼리는 SQL 모양만 보고 판단하지 말고 EXPLAIN으로 접근 경로, 예상 행 수, 인덱스 사용, 정렬·임시 영역을 확인한다. 인덱스는 조회를 빠르게 하지만 쓰기와 저장 공간 비용이 있으므로 자주 검색·조인·정렬하는 선택도 높은 열 조합을 기준으로 설계한다.</p>
<blockquote><strong>핵심:</strong> JOIN은 테이블을 붙이는 문법이 아니라 어떤 관계의 어떤 행을 결과에 남길지 정의하는 작업이다.</blockquote>`);

  replace("sql", 2, `<h2>서브쿼리는 다른 쿼리의 결과를 입력으로 사용한다</h2>
<p>단일 행 서브쿼리는 <code>=</code> 같은 비교에, 다중 행 서브쿼리는 <code>IN</code>, <code>EXISTS</code> 등에 사용한다. 상관 서브쿼리는 바깥 행의 값을 참조한다.</p>
<pre data-lang="SQL"><code>SELECT m.member_id, m.name
FROM member m
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.member_id = m.member_id
    AND o.status = 'PAID'
);</code></pre>
<p><code>EXISTS</code>는 조건에 맞는 행의 존재 여부만 묻는다. <code>NOT IN</code>의 목록에 NULL이 포함되면 예상과 다른 UNKNOWN 결과가 생길 수 있어 부재 확인에는 <code>NOT EXISTS</code>가 안전한 경우가 많다.</p>
<h2>CTE는 복잡한 쿼리에 이름 붙인 중간 단계를 만든다</h2>
<pre data-lang="SQL"><code>WITH paid_total AS (
  SELECT member_id, SUM(total_price) AS amount
  FROM orders
  WHERE status = 'PAID'
  GROUP BY member_id
)
SELECT m.name, p.amount
FROM member m
JOIN paid_total p ON p.member_id = m.member_id
WHERE p.amount &gt;= 100000;</code></pre>
<h2>INSERT·UPDATE·DELETE는 영향 범위를 먼저 확인한다</h2>
<pre data-lang="SQL"><code>UPDATE member
SET status = 'DORMANT', updated_at = CURRENT_TIMESTAMP
WHERE last_login_at &lt; CURRENT_DATE - INTERVAL '1 year'
  AND status = 'ACTIVE';</code></pre>
<p>UPDATE와 DELETE에서 WHERE 누락은 치명적이다. 같은 조건으로 SELECT를 먼저 실행해 대상 건수를 확인하고, 트랜잭션 안에서 영향 행 수를 검증한다. 여러 행 입력은 개별 INSERT 반복보다 DB가 지원하는 다중 행 또는 배치 방식을 고려한다.</p>
<h2>트랜잭션은 변경의 원자성을 보장한다</h2>
<pre data-lang="SQL"><code>BEGIN;
UPDATE account SET balance = balance - 10000 WHERE account_id = 1;
UPDATE account SET balance = balance + 10000 WHERE account_id = 2;
COMMIT; -- 중간 실패 시 ROLLBACK</code></pre>
<p>동시성에서는 갱신 손실, 더티 리드, 반복 불가능 읽기 등이 생길 수 있다. 격리 수준을 높이면 일관성은 강화되지만 대기와 충돌이 늘 수 있어 업무 규칙과 부하에 맞춰 선택한다.</p>
<blockquote><strong>안전 절차:</strong> 변경 전 대상 조회 → 트랜잭션 시작 → 변경 → 영향 행 수 확인 → 커밋 순서로 습관화한다.</blockquote>`);

  replace("sql", 3, `<h2>VIEW는 자주 쓰는 조회에 이름과 경계를 부여한다</h2>
<p>View는 SELECT 결과를 테이블처럼 노출한다. 복잡한 JOIN을 재사용하고 사용자별로 허용된 열만 공개할 수 있다. 일반 View는 결과를 저장하지 않으므로 원본 쿼리 비용이 사라지는 것은 아니다. 성능 목적이라면 DB가 지원하는 Materialized View와 갱신 전략을 검토한다.</p>
<pre data-lang="SQL"><code>CREATE VIEW active_member_view AS
SELECT member_id, name, email
FROM member
WHERE status = 'ACTIVE' AND deleted_at IS NULL;</code></pre>
<h2>SEQUENCE는 동시 요청에서도 고유 숫자를 발급한다</h2>
<pre data-lang="SQL"><code>CREATE SEQUENCE member_seq START WITH 1 INCREMENT BY 1;
INSERT INTO member(member_id, name)
VALUES (NEXTVAL('member_seq'), '아현');</code></pre>
<p>시퀀스 값은 롤백되어도 되돌아가지 않아 번호에 빈칸이 생길 수 있다. PK는 연속성을 보여주는 업무 번호가 아니라 식별자이므로 보통 문제가 아니다. 주문번호처럼 형식과 연속 정책이 필요한 값은 별도 규칙으로 만든다.</p>
<h2>PL/SQL은 DB 안에서 절차적 로직을 실행한다</h2>
<p>변수, 조건문, 반복문, 예외 처리, 프로시저·함수를 사용해 여러 SQL을 서버 내부에서 수행할 수 있다. 대량 데이터 가까이에서 실행되어 왕복을 줄일 수 있지만, 업무 로직이 애플리케이션과 DB에 나뉘고 특정 DB에 종속될 수 있다.</p>
<pre data-lang="SQL"><code>CREATE OR REPLACE PROCEDURE add_point(
  p_member_id IN NUMBER,
  p_amount IN NUMBER
) AS
BEGIN
  IF p_amount &lt;= 0 THEN
    RAISE_APPLICATION_ERROR(-20001, '포인트는 양수여야 합니다');
  END IF;
  UPDATE member SET point = point + p_amount
  WHERE member_id = p_member_id;
  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20002, '회원을 찾을 수 없습니다');
  END IF;
END;</code></pre>
<h2>DB 객체의 선택 기준</h2>
<table><tr><th>객체</th><th>좋은 사용처</th><th>주의점</th></tr><tr><td>VIEW</td><td>조회 재사용·권한 경계</td><td>숨겨진 복잡도와 성능</td></tr><tr><td>SEQUENCE</td><td>동시 고유 키 발급</td><td>번호 공백은 정상</td></tr><tr><td>Procedure</td><td>DB 중심 대량 처리</td><td>테스트·배포·이식성</td></tr><tr><td>Function</td><td>재사용 가능한 계산</td><td>행마다 호출되는 비용</td></tr></table>
<blockquote><strong>설계 원칙:</strong> DB에 둘 수 있다는 이유만으로 로직을 옮기지 말고, 데이터 근접성의 이득이 종속성과 운영 복잡도보다 큰지 판단한다.</blockquote>`);
})();
