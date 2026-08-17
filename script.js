const sectionTitles=['Lead-in: Build the picture','Notice the pattern in context','Discover the adjective sequence','The most useful short version','Opinion versus description','Put the adjectives in order','Complete the adjective chain','Rebuild the noun phrases','Which description sounds natural?','Find and correct the problem','Don’t use every adjective','A special case: adjectives joined by and','Describe and guess','Sentence expansion','What comes to mind?','Language from the previous lesson','Translation challenge','Spot the hidden meaning change'];
const headingLines=new Set(['Initial challenge','Discuss','Match the adjective categories with the examples.','Put the categories in order','The usual order','Example','Examples','Meaning check','Classify the adjectives','Add a reaction','Create a context for five phrases.','Reduce the support','Now the teacher says only the noun. Describe it with three appropriately ordered adjectives:','Explain the category sequence','Extend the correction','Too crowded','More natural','Rewrite naturally','Compare:','Decide: fixed sequence or equal descriptions?','Describe:','Ideas','Follow-up questions','Personal follow-up','Then add a personal reaction using an -ed adjective.','Explain the difference:']);
const naturalPairs=[
 ['a wooden beautiful old house','a beautiful old wooden house',1],['an Italian fascinating medieval town','a fascinating medieval Italian town',1],['a leather black small bag','a small black leather bag',1],['a visual useful digital aid','a useful digital visual aid',1],['an old lovely little café','a lovely little old café',1],['a round large glass table','a large round glass table',1],['a red small plastic first-aid kit','a small red plastic first-aid kit',1],['a teaching new confusing platform','a confusing new teaching platform',1],['a turquoise unusual glass lamp','an unusual turquoise glass lamp',1],['a historical inspiring Ukrainian film','an inspiring Ukrainian historical film',1]
];
const orderAnswers=['a beautiful old wooden cottage','a small black leather backpack','an expensive new Italian coffee machine','a large round wooden table','a fascinating old Ukrainian tradition','an unusual turquoise glass lamp','a useful rectangular digital visual aid','a small red metal first-aid kit','an inspiring modern educational documentary','a charming little French café','a confusing new teaching platform','a comfortable large grey sofa'];
const phraseAnswers=['be sceptical about','When I found out','immerse yourself in the atmosphere','comes to mind','unwind · recharge','whatever it takes','come to mind'];
let sections=[],current=0;

function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function inline(s){return esc(s).replace(/→/g,'<b>→</b>').replace(/__________/g,'<strong>__________</strong>')}
function parseLesson(text){
 const lines=text.replace(/\r/g,'').split('\n');let pre=[],list=[],active=null;
 for(const raw of lines){const line=raw.trim();const m=line.match(/^(\d+)\.\s+(.+)/);if(m&&Number(m[1])<=18){active={number:Number(m[1]),title:m[2],lines:[]};list.push(active)}else if(active)active.lines.push(line);else if(line)pre.push(line)}
 list[0].pre=pre;return list;
}
function overview(pre){return `<div class="block"><h3>Lesson focus</h3>${pre.slice(1).map(x=>`<p>${inline(x)}</p>`).join('')}</div><div class="category-strip"><div>OPINION</div><div>SIZE</div><div>AGE</div><div>COLOUR</div><div>MATERIAL</div></div>`}
function renderGeneric(sec){
 let html='',promptRun=[],paraRun=[];
 const flushPrompts=()=>{if(!promptRun.length)return;html+=`<div class="prompt-grid">${promptRun.map((x,i)=>`<article class="prompt-card" data-index="${i+1}">${inline(x)}</article>`).join('')}</div>`;promptRun=[]};
 const flushParas=()=>{if(!paraRun.length)return;html+=`<div class="block">${paraRun.map(x=>`<p>${inline(x)}</p>`).join('')}</div>`;paraRun=[]};
 for(let i=0;i<sec.lines.length;i++){
  const line=sec.lines[i];if(!line){flushPrompts();flushParas();continue}
  if(headingLines.has(line)||(!/[.?!:]$/.test(line)&&line.length<55&&i>0)){flushPrompts();flushParas();html+=`<div class="block"><h3>${inline(line)}</h3></div>`;continue}
  if(line.endsWith('?')){flushParas();promptRun.push(line);continue}
  if(line.includes('\t')){flushPrompts();flushParas();const cells=line.split('\t');html+=`<div class="table-wrap"><table><tr>${cells.map(c=>`<td>${inline(c)}</td>`).join('')}</tr></table></div>`;continue}
  paraRun.push(line)
 }
 flushPrompts();flushParas();return html;
}
function renderNaturalQuiz(){return `<div class="block"><h3>Choose the more natural version</h3><p class="speak-note">Choose one option. Explain the category sequence aloud.</p></div><div class="prompt-grid" id="naturalQuiz">${naturalPairs.map((q,i)=>`<article class="choice-card" data-answer="${q[2]}"><strong>${i+1}</strong><div class="choices"><button>${esc(q[0])}</button><button>${esc(q[1])}</button></div></article>`).join('')}</div><div class="controls"><button class="primary" data-check="naturalQuiz">Check choices</button><button class="secondary" data-reset="naturalQuiz">Try again</button></div><p class="feedback" id="naturalQuizFeedback"></p><div class="block"><h3>Explain the category sequence</h3><p>beautiful → opinion</p><p>old → age</p><p>wooden → material</p></div>`}
function renderAnswerReveal(title,answers){return `<div class="answer-panel" id="answers-${current}"><strong>${esc(title)}</strong>${answers.map(x=>`<p>${inline(x)}</p>`).join('')}</div><button class="reveal" data-reveal="answers-${current}">Reveal suggested answers</button>`}
function renderSection(sec){
 let body='';
 if(sec.number===1)body+=overview(sec.pre);
 if(sec.number===9)body+=renderNaturalQuiz();else body+=renderGeneric(sec);
 if(sec.number===6)body+=renderAnswerReveal('Suggested natural order',orderAnswers);
 if(sec.number===16)body+=renderAnswerReveal('Suggested phrases',phraseAnswers);
 if([2,3,4,5,7,8,10,11,12,13,14,15,17,18].includes(sec.number))body+=`<div class="speak-note">Complete the task aloud. Use the card as support, then repeat without looking.</div>`;
 return `<header class="section-head"><span class="number">${String(sec.number).padStart(2,'0')}</span><div><h2>${esc(sec.title)}</h2><p>${sectionSubtitle(sec.number)}</p></div></header><div class="content">${body}</div>`;
}
function sectionSubtitle(n){return ['','Build the picture before you study the rule.','Read closely, notice the combinations and discuss.','Find the logic behind the full sequence.','Use a practical sequence you can retrieve while speaking.','Separate personal evaluation from factual description.','Arrange every phrase, then add your reaction.','Complete the chain and create a context.','Build complete noun phrases orally.','Trust your ear, then explain the grammar.','Correct the order and extend the idea.','Turn heavy strings into natural descriptions.','Compare fixed order with equal descriptions.','Describe it without naming it.','Add one layer at a time, then remember the whole phrase.','Respond immediately with rich, natural descriptions.','Recycle the previous lesson in a new grammar context.','Translate naturally and react personally.','Explore how position can change meaning.'][n]}
function bind(){
 document.querySelectorAll('.choices button').forEach(b=>b.onclick=()=>{const card=b.closest('.choice-card');card.querySelectorAll('button').forEach(x=>x.classList.remove('selected','correct','wrong'));b.classList.add('selected')});
 document.querySelectorAll('[data-check]').forEach(b=>b.onclick=()=>{const id=b.dataset.check,cards=[...document.querySelectorAll(`#${id} .choice-card`)];let score=0;cards.forEach(card=>{const opts=[...card.querySelectorAll('button')],sel=card.querySelector('.selected'),correct=opts[Number(card.dataset.answer)];correct.classList.add('correct');if(sel===correct)score++;else if(sel)sel.classList.add('wrong')});document.querySelector(`#${id}Feedback`).textContent=`${score}/${cards.length} natural choices correct.`});
 document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{const id=b.dataset.reset;document.querySelectorAll(`#${id} button`).forEach(x=>x.className='');document.querySelector(`#${id}Feedback`).textContent=''});
 document.querySelectorAll('[data-reveal]').forEach(b=>b.onclick=()=>{const p=document.getElementById(b.dataset.reveal);p.classList.toggle('show');b.textContent=p.classList.contains('show')?'Hide suggested answers':'Reveal suggested answers'});
}
function show(i){current=Math.max(0,Math.min(sections.length-1,i));lesson.innerHTML=renderSection(sections[current]);[...lessonNav.children].forEach((b,n)=>{b.classList.toggle('active',n===current);b.setAttribute('aria-current',n===current?'step':'false')});progressBar.style.width=`${(current+1)/sections.length*100}%`;pageLabel.textContent=`Section ${current+1} of ${sections.length}`;prev.disabled=current===0;next.disabled=current===sections.length-1;sessionStorage.setItem('adjectiveLessonSection',current);bind();scrollTo({top:0,behavior:'smooth'})}
fetch('lesson.txt').then(r=>r.text()).then(text=>{sections=parseLesson(text);sections.forEach((s,i)=>{const b=document.createElement('button');b.textContent=`${i+1}. ${sectionTitles[i]}`;b.onclick=()=>show(i);lessonNav.append(b)});current=Math.min(Number(sessionStorage.getItem('adjectiveLessonSection')||0),sections.length-1);show(current)}).catch(()=>{lesson.innerHTML='<div class="block"><h2>The lesson could not be loaded.</h2><p>Please refresh the page.</p></div>'});
prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);
