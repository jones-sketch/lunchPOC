const E='lunch-poc-employees-v8',S='bulla-poc-card-session-v1',defaults=[{cardNumber:'123',employeeNumber:'10435',employeeName:'Jonas Westerlund'},{cardNumber:'456',employeeNumber:'10473',employeeName:'Diana Fagerholm'},{cardNumber:'789',employeeNumber:'10488',employeeName:'Thomas Nyström'}];
function employees(){try{const x=JSON.parse(localStorage.getItem(E));if(x?.length)return x}catch{}return defaults}
function normalizeCardNumber(value){const card=String(value).trim();return card.length>5?card.slice(-5):card}
sessionStorage.removeItem(S);
function login(v){const card=normalizeCardNumber(v),x=employees().find(e=>String(e.cardNumber)===card);if(!x){loginMessage.textContent='Card not recognized.';loginMessage.className='login-message error';cardInput.value='';cardInput.focus();return}sessionStorage.setItem(S,JSON.stringify(x));loginMessage.textContent=`Welcome, ${x.employeeName}`;loginMessage.className='login-message success';setTimeout(()=>location.href='order.html',250)}
cardForm.addEventListener('submit',e=>{e.preventDefault();login(cardInput.value)});document.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>login(b.dataset.card));
