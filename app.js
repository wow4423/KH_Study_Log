(function () {
  const categoryDefs = [
    {slug:"html-css",title:"HTML & CSS",intro:"웹 페이지의 구조를 만들고 화면을 배치하는 기본부터 다시 본다.",indexes:[2,3,4,5,8,9,10]},
    {slug:"java",title:"Java",intro:"기초 문법부터 객체지향, 컬렉션, 예외, 스레드까지 Java의 흐름을 이어서 정리한다.",indexes:[11,12,15,16,17,18,19,22,23,24,25,26,29,31]},
    {slug:"git",title:"Git & GitHub",intro:"혼자 작업할 때와 팀으로 협업할 때 필요한 버전 관리 흐름을 다시 확인한다.",indexes:[32,78]},
    {slug:"sql",title:"Oracle & SQL",intro:"데이터를 만들고 조회하고 변경하는 SQL과 관계형 데이터베이스의 핵심을 모았다.",indexes:[33,34,35,36,37,38,39,85]},
    {slug:"jdbc",title:"JDBC",intro:"Java에서 DB까지 요청이 어떻게 이동하는지, 계층을 왜 나누는지 중심으로 본다.",indexes:[40,41,42,43,44]},
    {slug:"javascript",title:"JavaScript",intro:"문법, DOM, 이벤트, 저장소, 비동기 통신까지 브라우저에서 일어나는 일을 정리한다.",indexes:[45,47,48,49,50,51,53,54,55]},
    {slug:"servlet-jsp",title:"Servlet & JSP",intro:"브라우저의 요청을 Java 서버가 받고 화면으로 돌려주는 전체 흐름을 다시 본다.",indexes:[57,58,60,61]},
    {slug:"mybatis",title:"MyBatis",intro:"반복적인 JDBC 코드를 줄이고 Java 객체와 SQL을 연결하는 방법을 정리한다.",indexes:[62,63,64]},
    {slug:"spring-mvc",title:"Spring MVC",intro:"Controller부터 응답까지, Spring 웹 애플리케이션의 구조와 기능을 모아서 본다.",indexes:[66,67,68,69,70,71,72,88,91,92]},
    {slug:"spring-core",title:"Spring 핵심 기능",intro:"로깅, 암호화, Filter, Scheduler, AOP처럼 여러 곳에서 공통으로 쓰는 기능을 정리한다.",indexes:[73,74,75]},
    {slug:"react",title:"React",intro:"컴포넌트와 Hook, 상태 관리, 서버 연동을 하나의 화면 흐름으로 다시 이해한다.",indexes:[79,80,81,82,83,84,93,94,95,98,113]},
    {slug:"jpa",title:"JPA & QueryDSL",intro:"테이블을 객체로 다루는 방식과 영속성, 연관관계, 동적 조회를 다시 정리한다.",indexes:[96,97,104,111]},
    {slug:"security",title:"JWT & Security",intro:"로그인 이후 토큰이 발급되고 검증되는 과정을 Spring Security와 연결해서 본다.",indexes:[105,106,107]},
    {slug:"aws",title:"AWS & 배포",intro:"만든 애플리케이션을 클라우드에 올리고 외부에서 접근하게 만드는 과정을 정리한다.",indexes:[99,101,102,103,112]},
    {slug:"infra",title:"Linux · Docker",intro:"서버 운영체제와 컨테이너, 실행 환경을 재현하는 기본 개념을 모았다.",indexes:[100,116]},
    {slug:"realtime",title:"WebSocket & Redis",intro:"실시간 메시지와 빠른 데이터 저장이 필요한 이유와 활용 흐름을 정리한다.",indexes:[109,115]}
    ,{slug:"setup",title:"프로젝트 시작 가이드",intro:"새 프로젝트를 시작할 때 반복해서 필요한 설치, 설정, 연결 순서를 한곳에 모았다.",indexes:[]}
    ,{slug:"plus-lab",title:"PLUS LAB",intro:"강사님 공유 자료에서 골라낸 실전 연동·배포 지식을 현재 기준으로 다시 설계한 보충 자료실.",indexes:[],plus:true}
  ];
  const categoryNav=document.getElementById("category-nav"),topicList=document.getElementById("topic-list"),reader=document.getElementById("reader");
  let activeCategory=0,activeNote=0;
  const escapeHtml=(s)=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const plain=(html)=>{const el=document.createElement("div");el.innerHTML=html;return el.textContent.replace(/\s+/g," ").trim();};
  function cleanTitle(title){return String(title).replace(/^\d+(?:\.\d+)?\s*/,"").replace(/\s*실습(?:\s*노트)?$/," 실습").trim();}
  function cleanContent(html,includeGuide=true){
    const box=document.createElement("div");box.innerHTML=html||"";
    box.querySelectorAll(".todo-item,.file-block").forEach((el)=>el.remove());
    const unrelated=/과제|제출|마감|언제까지|발표\s*(준비|자료)|파일\s*목록|숙제|체크리스트|주말에|해오기|제출하기/;
    box.querySelectorAll("p,li,blockquote,details,h2,h3,h4").forEach((el)=>{
      if(unrelated.test(el.textContent)&&!/(개념|원리|문법|코드|예제|실습)/.test(el.textContent))el.remove();
    });
    const typoMap=[["매서드","메서드"],["Servelt","Servlet"],["JAVA Script","JavaScript"],["Java Script","JavaScript"],["쓰레드","스레드"],["로컬 스토리지","로컬 스토리지(localStorage)"],["깃허브","GitHub"],["리액트","React"]];
    const walker=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);const textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);
    textNodes.forEach((node)=>{if(node.parentElement?.closest("code,pre"))return;let value=node.nodeValue;typoMap.forEach(([wrong,right])=>{value=value.replaceAll(wrong,right)});node.nodeValue=value;});
    box.querySelectorAll("h2,h3,h4").forEach((el)=>{el.textContent=el.textContent.replace(/[✅📌🔥🎯💡⭐✔💎🔟1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣]+/g,"").replace(/^\s*[)】\]}]+\s*/,"").replace(/^\s*[\d]+[.-]\s*/,"").trim();if(!el.textContent)el.remove();});
    box.querySelectorAll("details").forEach((el)=>{if(/과제|파일 목록|과제모음/.test(el.querySelector("summary")?.textContent||""))el.remove();});
    box.querySelectorAll("p,li,blockquote").forEach((el)=>{el.innerHTML=el.innerHTML.replace(/👉|➡️|⭕|❌|⚠️/g,"").replace(/(?:일단|그냥|뭔가)\s*/g,"").replace(/\s{2,}/g," ");});
    box.querySelectorAll("p").forEach((el)=>{
      const value=el.textContent.trim();
      if(/^\d+[.)]\s+.{2,45}$/.test(value)&&!el.querySelector("img,code")){const heading=document.createElement("h3");heading.textContent=value.replace(/^\d+[.)]\s+/,"");el.replaceWith(heading);}
    });
    box.querySelectorAll("a").forEach((link)=>{if(/^https?:\/\//.test(link.textContent.trim())){link.classList.add("reference-link");link.setAttribute("target","_blank");link.setAttribute("rel","noopener");link.innerHTML=`<small>참고 자료</small><span>${escapeHtml(link.textContent.replace(/^https?:\/\//,"").replace(/\/$/,""))}</span><b>↗</b>`;}});
    box.querySelectorAll("p,li,blockquote,summary").forEach((el)=>{if(!el.textContent.trim()&&!el.querySelector("img,pre,code"))el.remove();});
    box.querySelectorAll("ul,ol,details").forEach((el)=>{if(!el.textContent.trim()&&!el.querySelector("img,pre,code"))el.remove();});
    box.querySelectorAll("hr + hr").forEach((el)=>el.remove());
    const headings=[...box.querySelectorAll("h2,h3")].map((el)=>el.textContent.trim()).filter((v,i,a)=>v&&a.indexOf(v)===i).slice(0,8);
    const guide=includeGuide&&headings.length?`<section class="learning-guide"><span>이 노트에서 다루는 내용</span><ol>${headings.map((h)=>`<li>${escapeHtml(h)}</li>`).join("")}</ol></section>`:"";
    return guide+box.innerHTML;
  }
  function getNotes(categoryIndex=activeCategory){
    const category=categoryDefs[categoryIndex],curated=(window.CURATED_STUDY||[]).find((item)=>item.slug===category.slug);
    if(!curated)return [];
    return curated.lessons.map((lesson,index)=>({title:lesson.title,content:lesson.body,summary:lesson.summary,sourceIndex:`${category.slug}-${index}`,curated:true}));
  }
  function moveCategoryIndicator(){
    const active=categoryNav.querySelector("button.active"),indicator=categoryNav.querySelector(".category-indicator");
    if(!active||!indicator)return;
    indicator.style.width=`${active.offsetWidth}px`;
    indicator.style.transform=`translate3d(${active.offsetLeft}px,0,0)`;
  }
  function renderCategories(){
    if(!categoryNav.querySelector("[data-category]")){
      categoryNav.innerHTML=categoryDefs.map((c,i)=>`<button data-category="${i}" class="${i===activeCategory?"active":""} ${c.plus?"plus-category":""}"><span>${c.plus?"+":String(i+1).padStart(2,"0")}</span><b>${escapeHtml(c.title)}</b></button>`).join("")+`<i class="category-indicator" aria-hidden="true"></i>`;
      const indicator=categoryNav.querySelector(".category-indicator");
      indicator?.classList.add("initializing");
      requestAnimationFrame(()=>{moveCategoryIndicator();requestAnimationFrame(()=>indicator?.classList.remove("initializing"));});
    }else{
      categoryNav.querySelectorAll("[data-category]").forEach((button,index)=>button.classList.toggle("active",index===activeCategory));
    }
    requestAnimationFrame(()=>{categoryNav.querySelector(".active")?.scrollIntoView({inline:"center",block:"nearest",behavior:"smooth"});requestAnimationFrame(moveCategoryIndicator);});
  }
  function renderTopics(){
    const category=categoryDefs[activeCategory],notes=getNotes();
    document.getElementById("category-title").textContent=category.title;document.getElementById("category-intro").textContent=category.intro;document.getElementById("chapter-number").textContent=category.plus?"SUPPLEMENT LIBRARY":`CHAPTER ${String(activeCategory+1).padStart(2,"0")}`;
    topicList.innerHTML=notes.map((note,i)=>{const important=i===0||/(트랜잭션|보안|Security|인증|객체|상태|배포|Docker|AWS|관계|REST|실행 흐름|프로젝트)/i.test(note.title);return `<button data-note="${note.sourceIndex}" class="${String(note.sourceIndex)===String(activeNote)?"active":""} ${important?"important":""}"><span>${String(i+1).padStart(2,"0")}</span><b>${escapeHtml(cleanTitle(note.title))}</b>${important?'<em aria-label="핵심 개념" title="핵심 개념">✦</em>':''}</button>`;}).join("");
    topicList.querySelector(".active")?.scrollIntoView({inline:"center",block:"nearest"});
  }
  function showNote(sourceIndex,moveToReadingStart=false){
    const notes=getNotes(),note=notes.find((item)=>String(item.sourceIndex)===String(sourceIndex));if(!note)return;activeNote=String(sourceIndex);
    const position=notes.findIndex((n)=>String(n.sourceIndex)===String(sourceIndex)),prev=notes[position-1],next=notes[position+1];
    document.getElementById("note-position").textContent=`${position+1} / ${notes.length}`;document.getElementById("progress-bar").style.width=`${((position+1)/notes.length)*100}%`;
    const isPlus=categoryDefs[activeCategory].plus;
    reader.classList.toggle("plus-reader",Boolean(isPlus));
    reader.innerHTML=`<header class="note-title"><p>${isPlus?"PLUS LAB · PRACTICAL RECIPE":`${escapeHtml(categoryDefs[activeCategory].title)} · CONCEPT ${String(position+1).padStart(2,"0")}`}</p><h1>${escapeHtml(cleanTitle(note.title))}</h1>${note.summary?`<span>${escapeHtml(note.summary)}</span>`:""}</header><div class="note-body">${note.content}</div><nav class="reader-nav">${prev?`<button data-go="${prev.sourceIndex}"><small>PREVIOUS</small><b>← ${escapeHtml(cleanTitle(prev.title))}</b></button>`:"<span></span>"}${next?`<button data-go="${next.sourceIndex}"><small>NEXT</small><b>${escapeHtml(cleanTitle(next.title))} →</b></button>`:""}</nav>`;
    reader.classList.remove("note-enter");void reader.offsetWidth;reader.classList.add("note-enter");
    renderTopics();
    reader.querySelectorAll("blockquote").forEach((item)=>item.classList.add("key-point"));
    if(moveToReadingStart){requestAnimationFrame(()=>{const rail=document.querySelector(".category-rail");const offset=(rail?.offsetHeight||80)+18;const top=reader.getBoundingClientRect().top+window.scrollY-offset;window.scrollTo({top:Math.max(0,top),behavior:"smooth"});});}
  }
  function selectCategory(index){activeCategory=index;const first=getNotes(index)[0];activeNote=first?.sourceIndex||0;renderCategories();renderTopics();if(first)showNote(first.sourceIndex);}
  categoryNav.addEventListener("click",(e)=>{const b=e.target.closest("[data-category]");if(b)selectCategory(Number(b.dataset.category));});
  topicList.addEventListener("click",(e)=>{const b=e.target.closest("[data-note]");if(b)showNote(b.dataset.note,true);});
  reader.addEventListener("click",(e)=>{const b=e.target.closest("[data-go]");if(b)showNote(b.dataset.go,true);});
  function enableDragScroll(container){
    let down=false,startX=0,startScroll=0,moved=false,suppressClick=false;
    container.addEventListener("pointerdown",(event)=>{if(event.pointerType==="mouse"&&event.button!==0)return;down=true;moved=false;suppressClick=false;startX=event.clientX;startScroll=container.scrollLeft;});
    window.addEventListener("pointermove",(event)=>{if(!down)return;const distance=event.clientX-startX;if(Math.abs(distance)>7){moved=true;container.classList.add("dragging");container.scrollLeft=startScroll-distance;}});
    window.addEventListener("pointerup",()=>{if(!down)return;suppressClick=moved;down=false;moved=false;container.classList.remove("dragging");});
    container.addEventListener("click",(event)=>{if(!suppressClick)return;suppressClick=false;event.preventDefault();event.stopPropagation();},true);
    container.addEventListener("dragstart",(event)=>event.preventDefault());
  }
  enableDragScroll(categoryNav);enableDragScroll(topicList);
  window.addEventListener("resize",moveCategoryIndicator,{passive:true});
  document.getElementById("top-button").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  selectCategory(0);
})();
