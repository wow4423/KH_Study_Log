(function () {
  const categoryDefs = [
    {slug:"html-css",title:"HTML & CSS",intro:"웹 페이지의 구조를 만들고 화면을 배치하는 기본부터 다시 본다.",indexes:[2,3,4,5,8,9,10]},
    {slug:"java",title:"Java",intro:"기초 문법부터 객체지향, 컬렉션, 예외, 스레드까지 Java의 흐름을 이어서 정리한다.",indexes:[11,12,15,16,17,18,19,22,23,24,25,26,29,31]},
    {slug:"git",title:"Git & GitHub",intro:"혼자 작업할 때와 팀으로 협업할 때 필요한 버전 관리 흐름을 다시 확인한다.",indexes:[32,78]},
    {slug:"sql",title:"Oracle & SQL",intro:"SELECT 문법부터 JOIN·집계·트랜잭션·인덱스까지, 결과가 만들어지는 이유를 단계별로 다시 본다.",indexes:[33,34,35,36,37,38,39,85]},
    {slug:"jdbc",title:"JDBC",intro:"Connection을 얻는 순간부터 SQL 실행·객체 매핑·트랜잭션·반환까지 요청 한 건의 전체 수명을 따라간다.",indexes:[40,41,42,43,44]},
    {slug:"javascript",title:"JavaScript",intro:"값과 실행 컨텍스트부터 DOM 이벤트·저장소·비동기 요청까지 브라우저 앱의 동작 흐름으로 연결한다.",indexes:[45,47,48,49,50,51,53,54,55]},
    {slug:"servlet-jsp",title:"Servlet & JSP",intro:"브라우저의 요청을 Java 서버가 받고 화면으로 돌려주는 전체 흐름을 다시 본다.",indexes:[57,58,60,61]},
    {slug:"mybatis",title:"MyBatis",intro:"Mapper 연결부터 동적 SQL·트랜잭션·N+1 진단까지, SQL 통제권에 따르는 책임을 함께 익힌다.",indexes:[62,63,64]},
    {slug:"spring-mvc",title:"Spring MVC",intro:"요청이 DispatcherServlet을 지나 객체로 변환되고 HTML·JSON·파일 응답으로 돌아가는 전체 파이프라인을 따라간다.",indexes:[66,67,68,69,70,71,72,88,91,92]},
    {slug:"spring-core",title:"Spring 핵심 기능",intro:"프록시·트랜잭션·공통 처리·스케줄러가 실제로 어디서 적용되고 어떤 운영 증거를 남기는지 본다.",indexes:[73,74,75]},
    {slug:"react",title:"React",intro:"렌더링 원리부터 Hook·Router·API·전역 상태까지, 화면이 바뀌는 이유를 코드 흐름으로 따라간다.",indexes:[79,80,81,82,83,84,93,94,95,98,113]},
    {slug:"jpa",title:"JPA & QueryDSL",intro:"Entity 생명주기·트랜잭션·연관관계·N+1·DTO 경계·동적 조회를 실제 쿼리 흐름으로 연결한다.",indexes:[96,97,104,111]},
    {slug:"security",title:"JWT & Security",intro:"회원가입부터 로그인·토큰 검증·갱신·권한 실패까지 Security Filter Chain의 순서대로 따라간다.",indexes:[105,106,107]},
    {slug:"aws",title:"AWS & 배포",intro:"콘솔을 처음 여는 순간부터 EC2·RDS·S3를 연결하고 Spring Boot를 계속 실행시키는 순간까지 실제 순서대로 따라간다.",indexes:[99,101,102,103,112]},
    {slug:"infra",title:"Linux · Docker",intro:"이미지를 만드는 순간부터 실행·진단·Compose·Registry·EC2 배포와 IaC까지 재현 가능한 순서로 익힌다.",indexes:[100,116]},
    {slug:"realtime",title:"WebSocket & Redis",intro:"연결·구독·저장·방송·재연결과 다중 서버 메시지 전달까지 실시간 기능의 전체 수명을 따라간다.",indexes:[109,115]}
    ,{slug:"setup",title:"프로젝트 시작 가이드",intro:"새 프로젝트를 시작할 때 반복해서 필요한 설치, 설정, 연결 순서를 한곳에 모았다.",indexes:[]}
    ,{slug:"plus-lab",title:"PLUS LAB",intro:"강사님 공유 자료에서 골라낸 실전 연동·배포 지식을 현재 기준으로 다시 설계한 보충 자료실.",indexes:[],plus:true}
  ];
  const categoryNav=document.getElementById("category-nav"),topicList=document.getElementById("topic-list"),reader=document.getElementById("reader");
  const STORAGE_KEY="study-log:last-note";
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
    requestAnimationFrame(()=>{const active=categoryNav.querySelector(".active");if(active)categoryNav.scrollTo({left:Math.max(0,active.offsetLeft-(categoryNav.clientWidth-active.offsetWidth)/2),behavior:"smooth"});requestAnimationFrame(moveCategoryIndicator);});
  }
  function renderTopics(){
    const category=categoryDefs[activeCategory],notes=getNotes();
    document.getElementById("category-title").textContent=category.title;document.getElementById("category-intro").textContent=category.intro;document.getElementById("chapter-number").textContent=category.plus?"SUPPLEMENT LIBRARY":`CHAPTER ${String(activeCategory+1).padStart(2,"0")}`;
    topicList.innerHTML=notes.map((note,i)=>{const important=i===0||/(트랜잭션|보안|Security|인증|객체|상태|배포|Docker|AWS|관계|REST|실행 흐름|프로젝트)/i.test(note.title);return `<button data-note="${note.sourceIndex}" class="${String(note.sourceIndex)===String(activeNote)?"active":""} ${important?"important":""}" ${String(note.sourceIndex)===String(activeNote)?'aria-current="page"':""}><span>${String(i+1).padStart(2,"0")}</span><b>${escapeHtml(cleanTitle(note.title))}</b>${important?'<em aria-label="중요 개념" title="중요 개념"></em>':''}</button>`;}).join("");
    const current=topicList.querySelector(".active");if(current){if(window.matchMedia("(max-width:700px)").matches)topicList.scrollLeft=Math.max(0,current.offsetLeft-(topicList.clientWidth-current.offsetWidth)/2);else topicList.scrollTop=Math.max(0,current.offsetTop-(topicList.clientHeight-current.offsetHeight)/2);}
  }
  function showNote(sourceIndex,moveToReadingStart=false){
    const notes=getNotes(),note=notes.find((item)=>String(item.sourceIndex)===String(sourceIndex));if(!note)return;activeNote=String(sourceIndex);
    rememberLocation(activeNote);
    const position=notes.findIndex((n)=>String(n.sourceIndex)===String(sourceIndex)),prev=notes[position-1],next=notes[position+1];
    document.getElementById("note-position").textContent=`${position+1} / ${notes.length}`;document.getElementById("progress-bar").style.width=`${((position+1)/notes.length)*100}%`;
    const isPlus=categoryDefs[activeCategory].plus;
    reader.classList.toggle("plus-reader",Boolean(isPlus));
    reader.innerHTML=`<header class="note-title"><div class="note-title-row"><p>${isPlus?"PLUS LAB · PRACTICAL RECIPE":`${escapeHtml(categoryDefs[activeCategory].title)} · CONCEPT ${String(position+1).padStart(2,"0")}`}</p><button class="note-link-button" type="button" data-copy-link aria-label="현재 학습 노트 링크 복사"><i aria-hidden="true">↗</i><span>링크 복사</span></button></div><h1>${escapeHtml(cleanTitle(note.title))}</h1>${note.summary?`<span>${escapeHtml(note.summary)}</span>`:""}</header><div class="note-body">${note.content}</div><nav class="reader-nav">${prev?`<button data-go="${prev.sourceIndex}"><small>PREVIOUS</small><b>← ${escapeHtml(cleanTitle(prev.title))}</b></button>`:"<span></span>"}${next?`<button data-go="${next.sourceIndex}"><small>NEXT</small><b>${escapeHtml(cleanTitle(next.title))} →</b></button>`:""}</nav>`;
    reader.classList.remove("note-enter");void reader.offsetWidth;reader.classList.add("note-enter");
    renderTopics();
    reader.querySelectorAll("blockquote").forEach((item)=>item.classList.add("key-point"));
    if(moveToReadingStart){requestAnimationFrame(()=>{const rail=document.querySelector(".category-rail");const offset=(rail?.offsetHeight||80)+18;const top=reader.getBoundingClientRect().top+window.scrollY-offset;window.scrollTo({top:Math.max(0,top),behavior:"smooth"});});}
  }
  function rememberLocation(sourceIndex){
    try{history.replaceState(null,"",`#${sourceIndex}`);}catch(e){}
    try{localStorage.setItem(STORAGE_KEY,String(sourceIndex));}catch(e){}
  }
  function readStoredLocation(){try{return localStorage.getItem(STORAGE_KEY);}catch(e){return null;}}
  function findByHash(hash){
    const raw=String(hash||"").replace(/^#/,""),match=raw.match(/^(.+)-(\d+)$/);
    if(!match)return null;
    const categoryIndex=categoryDefs.findIndex((c)=>c.slug===match[1]);
    if(categoryIndex===-1)return null;
    const note=getNotes(categoryIndex)[Number(match[2])];
    return note?{categoryIndex,sourceIndex:note.sourceIndex}:null;
  }
  function goToSource(sourceIndex,moveToReadingStart=true){
    const target=findByHash(`#${sourceIndex}`);if(!target)return;
    if(target.categoryIndex!==activeCategory){activeCategory=target.categoryIndex;renderCategories();}
    showNote(target.sourceIndex,moveToReadingStart);
  }
  function goRelative(direction){
    const notes=getNotes(),position=notes.findIndex((note)=>String(note.sourceIndex)===String(activeNote));
    if(position+direction>=0&&position+direction<notes.length){showNote(notes[position+direction].sourceIndex,true);return;}
    const nextCategory=activeCategory+direction;
    if(nextCategory<0||nextCategory>=categoryDefs.length)return;
    const nextNotes=getNotes(nextCategory);if(!nextNotes.length)return;
    activeCategory=nextCategory;renderCategories();showNote(nextNotes[direction>0?0:nextNotes.length-1].sourceIndex,true);
  }
  async function copyCurrentLink(button){
    const url=location.href;
    try{await navigator.clipboard.writeText(url);}
    catch(e){const area=document.createElement("textarea");area.value=url;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();document.execCommand("copy");area.remove();}
    const label=button.querySelector("span");if(!label)return;label.textContent="복사 완료";button.classList.add("copied");
    window.setTimeout(()=>{label.textContent="링크 복사";button.classList.remove("copied");},1600);
  }
  function selectCategory(index){activeCategory=index;const first=getNotes(index)[0];activeNote=first?.sourceIndex||0;renderCategories();renderTopics();if(first)showNote(first.sourceIndex);}
  categoryNav.addEventListener("click",(e)=>{const b=e.target.closest("[data-category]");if(b)selectCategory(Number(b.dataset.category));});
  topicList.addEventListener("click",(e)=>{const b=e.target.closest("[data-note]");if(b)showNote(b.dataset.note,true);});
  reader.addEventListener("click",(e)=>{const b=e.target.closest("[data-go]");if(b){showNote(b.dataset.go,true);return;}const copy=e.target.closest("[data-copy-link]");if(copy)copyCurrentLink(copy);});
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
  document.addEventListener("keydown",(event)=>{
    const isTyping=["INPUT","TEXTAREA","SELECT"].includes(event.target.tagName)||event.target.isContentEditable;
    if(isTyping||event.ctrlKey||event.metaKey||event.altKey||document.querySelector("dialog[open]"))return;
    if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();goRelative(event.key==="ArrowRight"?1:-1);}
  });
  document.getElementById("top-button").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  window.addEventListener("hashchange",()=>{const target=findByHash(location.hash);if(target)goToSource(target.sourceIndex,false);});
  const initial=findByHash(location.hash)||findByHash(`#${readStoredLocation()||""}`);
  if(initial){activeCategory=initial.categoryIndex;renderCategories();showNote(initial.sourceIndex);}
  else{selectCategory(0);}
  window.StudyNav={categoryDefs,getNotes,cleanTitle,plain,goToSource,goRelative};
})();
