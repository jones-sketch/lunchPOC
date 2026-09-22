const key="lunch-poc-menu-config-v6", days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const labels={
  main:{en:"Main dish",sv:"Huvudrätt",fi:"Pääruoka"},
  main2:{en:"Second main dish (optional)",sv:"Andra huvudrätt (valfri)",fi:"Toinen pääruoka (valinnainen)"},
  vegetarian:{en:"Vegetarian",sv:"Vegetarisk",fi:"Kasvisruoka"},
  soup:{en:"Soup",sv:"Soppa",fi:"Keitto"}
};
const seed={
  main:{en:"Meatballs with mashed potatoes",sv:"Köttbullar med potatismos",fi:"Lihapullat ja perunamuusi"},
  main2:{en:"",sv:"",fi:""},
  vegetarian:{en:"Vegetable lasagne",sv:"Grönsakslasagne",fi:"Kasvislasagne"},
  soup:{en:"Tomato soup",sv:"Tomatsoppa",fi:"Tomaattikeitto"}
};
let cfg=load(),active=0,timer;
function newWeek(){return{days:days.map(day=>({day,meals:Object.entries(seed).map(([type,names])=>({type,names:{...names}}))}))}}
function normalizeWeek(w){w.days.forEach(d=>{if(!d.meals.some(m=>m.type==="main2")){const at=Math.max(1,d.meals.findIndex(m=>m.type==="vegetarian"));d.meals.splice(at,0,{type:"main2",names:{en:"",sv:"",fi:""}})}});return w}
function load(){try{const x=JSON.parse(localStorage.getItem(key))||JSON.parse(localStorage.getItem("lunch-poc-menu-config-v5"));if(x?.weeks){x.weeks.forEach(normalizeWeek);return x}}catch{}return{repeatWeeks:4,weeks:Array.from({length:4},newWeek)}}
const repeat=document.querySelector('#repeatWeeks'),tabs=document.querySelector('#weekTabs'),box=document.querySelector('#dayEditors');repeat.value=cfg.repeatWeeks;
function resize(){capture();const n=+repeat.value;while(cfg.weeks.length<n)cfg.weeks.push(newWeek());cfg.weeks.length=n;cfg.repeatWeeks=n;if(active>=n)active=n-1;render()}
function mealCard(m,di,mi){const l=labels[m.type]||{en:"Meal",sv:"Måltid",fi:"Ateria"};return `<div class="meal-entry ${m.type==="main2"?'optional-meal':''}"><div class="meal-type"><strong>${l.en}</strong><span>${l.sv} · ${l.fi}</span></div><label><span>EN</span><input data-day="${di}" data-meal="${mi}" data-lang="en" value="${esc(m.names.en)}" placeholder="${m.type==='main2'?'Leave empty if not used':'English'}"></label><label><span>SV</span><input data-day="${di}" data-meal="${mi}" data-lang="sv" value="${esc(m.names.sv)}" placeholder="${m.type==='main2'?'Lämna tom om den inte används':'Svenska'}"></label><label><span>FI</span><input data-day="${di}" data-meal="${mi}" data-lang="fi" value="${esc(m.names.fi)}" placeholder="${m.type==='main2'?'Jätä tyhjäksi, jos ei käytössä':'Suomi'}"></label></div>`}
function render(){tabs.innerHTML=cfg.weeks.map((_,i)=>`<button class="week-tab ${i===active?'active':''}" data-week="${i}">Week ${i+1}</button>`).join('');document.querySelector('#editingWeek').textContent=`Week ${active+1}`;document.querySelector('#cycleTitle').textContent=`${cfg.repeatWeeks}-week menu`;box.innerHTML=cfg.weeks[active].days.map((d,di)=>`<section class="friendly-day"><div class="friendly-day-head"><div><strong>${d.day}</strong><span>Main meals only</span></div><button class="text-button" data-clear="${di}">Clear day</button></div><div class="meal-entry-grid">${d.meals.map((m,mi)=>mealCard(m,di,mi)).join('')}</div></section>`).join('')}
function capture(){box.querySelectorAll('input[data-lang]').forEach(i=>cfg.weeks[active].days[+i.dataset.day].meals[+i.dataset.meal].names[i.dataset.lang]=i.value.trim())}
function esc(s=''){return s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}
tabs.addEventListener('click',e=>{const b=e.target.closest('[data-week]');if(!b)return;capture();active=+b.dataset.week;render()});repeat.addEventListener('change',resize);box.addEventListener('click',e=>{const b=e.target.closest('[data-clear]');if(!b)return;box.querySelectorAll(`input[data-day="${b.dataset.clear}"]`).forEach(i=>i.value='')});document.querySelector('#copyPrevious').addEventListener('click',()=>{capture();if(!active)return show('Week 1 has no previous week');cfg.weeks[active]=structuredClone(cfg.weeks[active-1]);render();show('Previous week copied')});document.querySelector('#saveMenu').addEventListener('click',()=>{capture();localStorage.setItem(key,JSON.stringify(cfg));show('Menu saved')});function show(s){const t=document.querySelector('#toast');t.textContent=s;t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),2200)}render();