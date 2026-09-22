const KEY='bulla-poc-products-v1';
const defaults=[['ham-roll','Ham roll','Skinksemla','Kinkkusämpylä',350,'🥪'],['bulla','Bulla','Bulle','Pulla',250,'🥐'],['candy','Candy bag','Godispåse','Karkkipussi',220,'🍬'],['ice-cream','Assorted ice cream','Blandad glass','Valikoima jäätelöitä',300,'🍦'],['chocolate','Chocolate bar','Chokladstång','Suklaapatukka',180,'🍫'],['soft-drink','Soft drink','Läsk','Virvoitusjuoma',200,'🥤']].map((x,i)=>({id:x[0],names:{en:x[1],sv:x[2],fi:x[3]},name:x[1],priceCents:x[4],icon:x[5],image:'',active:true,sortOrder:i+1}));
let rows=load(),savedSnapshot=JSON.stringify(rows),imageReaders=0,toastTimer;
function normalize(p,i){const en=p.names?.en??p.name??'',sv=p.names?.sv??'',fi=p.names?.fi??'';return{...p,names:{en,sv,fi},name:en,priceCents:Number(p.priceCents)||0,active:p.active!==false,sortOrder:Number(p.sortOrder)||i+1}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.length)return x.map(normalize)}catch{}return structuredClone(defaults)}
function esc(s=''){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function savedRows(){try{return JSON.parse(savedSnapshot)}catch{return[]}}
function rowDirty(p,i){const saved=savedRows()[i];return !saved||JSON.stringify(p)!==JSON.stringify(saved)}
function capture(){document.querySelectorAll('.bulla-product-row').forEach(el=>{const p=rows[+el.dataset.i];p.names.en=el.querySelector('[data-lang="en"]').value;p.names.sv=el.querySelector('[data-lang="sv"]').value;p.names.fi=el.querySelector('[data-lang="fi"]').value;p.name=p.names.en;p.priceCents=Math.round(Number(el.querySelector('[data-field="price"]').value||0)*100);p.icon=el.querySelector('[data-field="icon"]').value;p.active=el.querySelector('[data-field="active"]').checked});updateDirty()}
function updateDirty(){const dirty=JSON.stringify(rows)!==savedSnapshot||imageReaders>0;saveProducts.disabled=!dirty;saveProducts.textContent=dirty?'Save':'Saved';document.body.classList.toggle('has-unsaved-products',dirty);document.querySelectorAll('.bulla-product-row').forEach(el=>{const dirtyCard=rowDirty(rows[+el.dataset.i],+el.dataset.i);el.classList.toggle('is-dirty',dirtyCard);const badge=el.querySelector('.product-save-state');if(badge){badge.textContent=dirtyCard?'● Unsaved':'Saved';badge.classList.toggle('unsaved',dirtyCard)}})}
function render(){productEditor.innerHTML=rows.map((p,i)=>`<article class="bulla-product-row ${p.active?'':'inactive'}" data-i="${i}">
  <div class="bulla-product-visual">
    <div class="bulla-product-picture">${p.image?`<img src="${esc(p.image)}" alt="">`:`<span>${esc(p.icon||'☕')}</span>`}</div>
    <label class="picture-button">Change picture<input type="file" accept="image/*" data-image="${i}"></label>
    <span class="product-position">Product ${i+1} of ${rows.length}</span>
  </div>
  <div class="bulla-product-content">
    <div class="product-card-heading"><div><span class="eyebrow">Product</span><h3>${esc(p.names.en||'Unnamed product')}</h3></div><span class="product-save-state ${rowDirty(p,i)?'unsaved':''}">${rowDirty(p,i)?'● Unsaved':'Saved'}</span></div>
    <section class="product-section"><h4>Product names</h4><div class="bulla-name-fields">
      <label><span>English</span><input data-lang="en" value="${esc(p.names.en)}" placeholder="English name"></label>
      <label><span>Swedish</span><input data-lang="sv" value="${esc(p.names.sv)}" placeholder="Svenskt namn"></label>
      <label><span>Finnish</span><input data-lang="fi" value="${esc(p.names.fi)}" placeholder="Suomenkielinen nimi"></label>
    </div></section>
    <section class="product-section product-settings"><div><h4>Price</h4><label class="price-field"><span>Price (€)</span><input data-field="price" type="number" min="0" step="0.01" value="${(p.priceCents/100).toFixed(2)}"></label></div><div><h4>Status</h4><label class="product-active-toggle"><input data-field="active" type="checkbox" ${p.active?'checked':''}><span class="toggle-track" aria-hidden="true"></span><span class="toggle-label">${p.active?'Active':'Inactive'}</span></label></div><div><h4>Fallback</h4><label><span>Icon</span><input class="icon-field" data-field="icon" value="${esc(p.icon||'')}" maxlength="8"></label></div></section>
    <footer class="bulla-product-actions"><div class="sort-actions"><button data-up="${i}" ${i?'':'disabled'} title="Move product up">↑ <span>Move up</span></button><button data-down="${i}" ${i===rows.length-1?'disabled':''} title="Move product down">↓ <span>Move down</span></button></div><button class="danger" data-remove="${i}">Delete product</button></footer>
  </div>
</article>`).join('');updateDirty()}
productEditor.addEventListener('input',e=>{if(!e.target.matches('[type="file"]')){capture();const card=e.target.closest('.bulla-product-row');if(e.target.matches('[data-lang="en"]'))card.querySelector('.product-card-heading h3').textContent=e.target.value||'Unnamed product'}});
productEditor.addEventListener('change',e=>{if(e.target.matches('[data-image]')){capture();const file=e.target.files[0];if(!file)return;imageReaders++;updateDirty();const index=+e.target.dataset.image,reader=new FileReader();reader.onload=()=>{rows[index].image=reader.result;imageReaders--;render()};reader.onerror=()=>{imageReaders--;show('Picture could not be loaded');updateDirty()};reader.readAsDataURL(file)}else{capture();if(e.target.matches('[data-field="active"]'))render()}});
productEditor.addEventListener('click',e=>{const up=e.target.closest('[data-up]'),down=e.target.closest('[data-down]'),del=e.target.closest('[data-remove]');if(!up&&!down&&!del)return;capture();if(up){const i=+up.dataset.up;[rows[i-1],rows[i]]=[rows[i],rows[i-1]]}if(down){const i=+down.dataset.down;[rows[i+1],rows[i]]=[rows[i],rows[i+1]]}if(del&&confirm('Delete this product?'))rows.splice(+del.dataset.remove,1);rows.forEach((p,i)=>p.sortOrder=i+1);render()});
addProduct.onclick=()=>{capture();rows.push({id:crypto.randomUUID?.()||String(Date.now()),names:{en:'New product',sv:'Ny produkt',fi:'Uusi tuote'},name:'New product',priceCents:0,icon:'☕',image:'',active:true,sortOrder:rows.length+1});render();document.querySelector('.bulla-product-row:last-child [data-lang="en"]').focus()};
saveProducts.onclick=()=>{capture();if(imageReaders)return show('Wait for the picture to finish loading');rows.forEach((p,i)=>{p.sortOrder=i+1;p.name=p.names.en});localStorage.setItem(KEY,JSON.stringify(rows));savedSnapshot=JSON.stringify(rows);updateDirty();show('Product list saved')};
window.addEventListener('beforeunload',e=>{if(JSON.stringify(rows)===savedSnapshot&&!imageReaders)return;e.preventDefault();e.returnValue=''});
function show(x){toast.textContent=x;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}
render();
