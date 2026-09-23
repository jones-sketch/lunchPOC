const employeeKey='lunch-poc-employees-v8',userKey='lunch-poc-current-user-v17',languageKey='lunch-poc-language-v5';
const defaults=[
{cardNumber:'10488',employeeNumber:'10488',employeeName:'Thomas Nyström'},
{cardNumber:'10157',employeeNumber:'10157',employeeName:'Camilla Rantala'},
{cardNumber:'10254',employeeNumber:'10254',employeeName:'Lisa Rudbacka'},
{cardNumber:'10473',employeeNumber:'10473',employeeName:'Diana Fagerholm'},
{cardNumber:'10435',employeeNumber:'10435',employeeName:'Jonas Westerlund'},
{cardNumber:'10152',employeeNumber:'10152',employeeName:'Maria Wargh'},
{cardNumber:'10154',employeeNumber:'10154',employeeName:'Sinikka Nyfelt'}];
const text={en:{title:'Lunch service',intro:'Enter your employee number to continue.',number:'Employee number',button:'Continue',unknown:'Employee number not recognized.'},sv:{title:'Lunchtjänst',intro:'Ange ditt anställningsnummer för att fortsätta.',number:'Anställningsnummer',button:'Fortsätt',unknown:'Anställningsnumret känns inte igen.'},fi:{title:'Lounaspalvelu',intro:'Jatka syöttämällä työntekijänumerosi.',number:'Työntekijänumero',button:'Jatka',unknown:'Työntekijänumeroa ei löytynyt.'}};
function employees(){try{const s=JSON.parse(localStorage.getItem(employeeKey));if(s?.length)return s}catch{}return defaults}
function normalizeEmployeeNumber(value){const number=String(value||'').trim();return number.length>5?number.slice(-5):number}
if(JSON.parse(localStorage.getItem(userKey)||'null')?.employeeNumber)location.replace('index.html');
let language=localStorage.getItem(languageKey)||'sv';
function render(){const t=text[language];loginTitle.textContent=t.title;loginIntro.textContent=t.intro;employeeNumberLabel.textContent=t.number;loginButton.textContent=t.button;loginLanguage.value=language;demoUsers.innerHTML=employees().map(e=>`<button type="button" data-id="${e.employeeNumber}">${e.employeeNumber}</button>`).join('')}
employeeNumber.addEventListener('input',()=>{const e=employees().find(x=>x.employeeNumber===normalizeEmployeeNumber(employeeNumber.value));employeePreview.textContent=e?e.employeeName:''});
demoUsers.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;employeeNumber.value=b.dataset.id;employeeNumber.dispatchEvent(new Event('input'))});
loginLanguage.onchange=()=>{language=loginLanguage.value;localStorage.setItem(languageKey,language);render()};
loginForm.onsubmit=(e)=>{e.preventDefault();const emp=employees().find(x=>x.employeeNumber===normalizeEmployeeNumber(employeeNumber.value));if(!emp){loginMessage.textContent=text[language].unknown;return;}localStorage.setItem(userKey,JSON.stringify(emp));location.replace('index.html')};
render();
