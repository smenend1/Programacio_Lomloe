const STORAGE_KEY = 'prog_lomloe_library_v1';
const SETTINGS_KEY = 'prog_lomloe_settings_v1';
let deferredInstallPrompt = null;
let state = createDefaultProgram();

function createDefaultProgram(){
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    general:{
      departament:'Tecnologia i expressió',
      docents:'',
      materia:'Tecnologia i digitalització',
      tipusMateria:'Comuna',
      nivell:'2n ESO',
      cursAcademic:'2025-2026',
      centre:'',
      grup:''
    },
    marcNormatiu:'Programació elaborada d’acord amb el currículum vigent i l’enfocament competencial de la LOMLOE, adaptada al projecte educatiu del centre i a les necessitats del grup classe.',
    vectorsPedagogics:'Aprenentatge competencial, inclusió educativa, sostenibilitat, perspectiva de gènere, benestar emocional, ciutadania democràtica i ús responsable de la tecnologia.',
    competenciesClau:'Competència en comunicació lingüística (CCL): expressió oral, escrita i interacció comunicativa.\nCompetència matemàtica i competències bàsiques en ciència i tecnologia (CMCT): resolució de problemes, projectes i prototips.\nCompetència digital (CD): ús segur, crític, responsable i creatiu de les tecnologies digitals.\nCompetència personal, social i d’aprendre a aprendre (CPSAA): autonomia, esforç, reflexió i millora.\nCompetència emprenedora (CE): generació d’idees, planificació i presa de decisions.\nCompetència ciutadana (CC): responsabilitat ecosocial i participació.\nCompetència en consciència i expressió culturals (CCEC): creativitat, expressió i producció cultural.',
    terms:[
      {nom:'1r Trimestre',sabers:'Procés de resolució de problemes i de projectes\n- Aplicació d’estratègies, tècniques i marcs de resolució de problemes.\n- Cerca crítica d’informació.\n- Anàlisi de productes i sistemes tecnològics.\n\nTecnologia sostenible\n- Eficiència energètica, consum responsable i energies renovables.',situacions:'SA1: L’energia i la seva transformació\nSA2: Electricitat i magnetisme',competencies:'C3. Aplicar tècniques i coneixements interdisciplinaris per construir solucions tecnològiques.\nC7. Fer un ús ètic, sostenible i ecosocialment responsable de la tecnologia.',criteris:'3.1. Fabricar objectes o models mitjançant la manipulació i conformació de materials.\n7.1. Identificar la influència de l’activitat tecnològica en la societat i la sostenibilitat ambiental.\n7.2. Fer un ús responsable i ètic de les tecnologies emergents.'},
      {nom:'2n Trimestre',sabers:'Procés de resolució de problemes i de projectes\n- Anàlisi i disseny d’estructures.\n- Sistemes mecànics bàsics.\n\nDigitalització de l’entorn personal d’aprenentatge\n- Eines i entorns virtuals d’aprenentatge.\n- Creació de continguts i emmagatzematge segur.',situacions:'SA3: Màquines i mecanismes\nSA4: Digitalització de l’entorn personal d’aprenentatge',competencies:'C2. Planificar, dissenyar i desenvolupar solucions a problemes tecnològics.\nC3. Aplicar tècniques i coneixements interdisciplinaris.\nC6. Utilitzar dispositius i aplicacions de l’entorn digital d’aprenentatge.',criteris:'2.1. Idear i dissenyar solucions tecnològiques originals.\n3.1. Fabricar objectes o models.\n6.1. Fer un ús eficient i segur dels dispositius digitals.\n6.2. Crear continguts i respectar llicències i drets d’autoria.'},
      {nom:'3r Trimestre',sabers:'Comunicació i difusió d’idees\n- Ús del vocabulari tècnic apropiat.\n- Aplicacions CAD 2D i 3D.\n\nPensament computacional, programació i robòtica\n- Algorísmica i diagrames de flux.\n- Programació, simulació i depuració iterativa.',situacions:'SA5: Programació en 3D amb Tinkercad Codeblocks - CLIL',competencies:'C5. Desenvolupar algorismes i aplicacions informàtiques aplicant el pensament computacional.',criteris:'5.1. Descriure, interpretar i dissenyar solucions mitjançant algorismes i diagrames de flux.'}
    ],
    indicators:[
      {criteri:'3.1. Descriure els components d’un circuit elèctric simple i analitzar-ne el funcionament.', as:'Descriu els components mínims necessaris i interpreta esquemes senzills.', an:'Descriu components de control i protecció, i realitza esquemes senzills.', ae:'Explica el funcionament dels components i situa els circuits en contextos reals.'},
      {criteri:'5.1. Utilitzar l’entorn de programació per implementar algorismes.', as:'Distingeix pseudocodi i diagrames de flux.', an:'Representa algorismes en l’entorn de programació.', ae:'Representa algorismes i utilitza amb facilitat les eines de l’entorn.'}
    ],
    metodologia:'La matèria combina activitats d’aula, treball pràctic, projectes i activitats manipulatives. Es promou el treball cooperatiu, la resolució de problemes, l’autonomia progressiva i la connexió amb situacions properes a l’alumnat. El seguiment es pot fer amb una plataforma virtual d’aprenentatge i amb un dossier de treball.',
    recursos:'Recursos visuals, materials de taller, eines i màquines, material elèctric, dispositius digitals, connexió a Internet, entorns de simulació, eines d’edició i plataforma virtual d’aprenentatge.',
    atencioDiversitat:{
      universals:'Activitats de reforç i ampliació dins del grup. Aprenentatge cooperatiu. Explicació clara dels objectius i dels passos de cada activitat.',
      addicionals:'Adaptació de continguts i activitats per a alumnat amb pla individualitzat o necessitats lingüístiques. Possibilitat de proves visuals o orals.',
      intensives:'Actuacions educatives extraordinàries adaptades a la singularitat de l’alumnat NESE. Ús de recursos metodològics i materials diversos.'
    },
    activitatsComplementaries:'',
    avaluacio:'L’avaluació és contínua i competencial. Es valoren activitats d’aula, projectes, quadern o dossier de treball, proves, produccions digitals i rúbriques vinculades als criteris d’avaluació.\n\nQualificació: 1 = NA, 2 = AS, 3 = AN, 4 = AE.\n\nRecuperació: caldrà entregar o refer les activitats no assolides i demostrar el progrés en els sabers i competències treballades.'
  };
}

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return Array.from(document.querySelectorAll(sel))}
function toast(msg){const el=qs('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400)}
function getPath(obj,path){return path.split('.').reduce((a,k)=>a && a[k],obj)}
function setPath(obj,path,value){const parts=path.split('.');let ref=obj;parts.slice(0,-1).forEach(p=>ref=ref[p]);ref[parts.at(-1)]=value}
function escapeHtml(str=''){return String(str).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function linesToHtml(str=''){return escapeHtml(str).split('\n').filter(Boolean).map(line=>line.trim().startsWith('-')?`<p>${line}</p>`:`<p>${line}</p>`).join('') || '<p class="blank">&nbsp;</p>'}
function download(filename, content, type='application/octet-stream'){
  const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function filenameBase(){const g=state.general;return `${g.materia || 'programacio'}_${g.nivell || ''}_${g.cursAcademic || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'').toLowerCase()}

function bindFields(){
  qsa('[data-field]').forEach(el=>{
    const path=el.dataset.field; const value=getPath(state,path); el.value=value ?? '';
    el.oninput=()=>{setPath(state,path,el.value); state.updatedAt=new Date().toISOString(); renderDocument();};
  });
}
function renderTerms(){
  const host=qs('#termsEditor'); host.innerHTML='';
  state.terms.forEach((term,i)=>{
    const card=document.createElement('div'); card.className='term-card';
    card.innerHTML=`<div class="term-head"><strong>${escapeHtml(term.nom || 'Període')}</strong><button class="btn small danger" data-del-term="${i}">Elimina</button></div>
    <div class="term-fields">
      <label>Període<input data-term="${i}" data-key="nom"></label>
      <label>Situacions d’aprenentatge<textarea rows="5" data-term="${i}" data-key="situacions"></textarea></label>
      <label>Sabers<textarea rows="8" data-term="${i}" data-key="sabers"></textarea></label>
      <label>Competències específiques<textarea rows="8" data-term="${i}" data-key="competencies"></textarea></label>
      <label>Criteris d’avaluació<textarea rows="8" data-term="${i}" data-key="criteris"></textarea></label>
    </div>`;
    host.appendChild(card);
  });
  qsa('[data-term]').forEach(el=>{const i=Number(el.dataset.term),key=el.dataset.key;el.value=state.terms[i][key]||'';el.oninput=()=>{state.terms[i][key]=el.value;renderDocument();};});
  qsa('[data-del-term]').forEach(btn=>btn.onclick=()=>{state.terms.splice(Number(btn.dataset.delTerm),1);renderTerms();renderDocument();});
}
function renderIndicators(){
  const host=qs('#indicatorsEditor'); host.innerHTML='';
  state.indicators.forEach((it,i)=>{
    const card=document.createElement('div'); card.className='indicator-card';
    card.innerHTML=`<div class="indicator-head"><strong>Criteri ${i+1}</strong><button class="btn small danger" data-del-ind="${i}">Elimina</button></div>
    <div class="term-fields">
      <label>Criteri d’avaluació<textarea rows="5" data-ind="${i}" data-key="criteri"></textarea></label>
      <label>AS<textarea rows="5" data-ind="${i}" data-key="as"></textarea></label>
      <label>AN<textarea rows="5" data-ind="${i}" data-key="an"></textarea></label>
      <label>AE<textarea rows="5" data-ind="${i}" data-key="ae"></textarea></label>
    </div>`;
    host.appendChild(card);
  });
  qsa('[data-ind]').forEach(el=>{const i=Number(el.dataset.ind),key=el.dataset.key;el.value=state.indicators[i][key]||'';el.oninput=()=>{state.indicators[i][key]=el.value;renderDocument();};});
  qsa('[data-del-ind]').forEach(btn=>btn.onclick=()=>{state.indicators.splice(Number(btn.dataset.delInd),1);renderIndicators();renderDocument();});
}
function renderDocument(){
  const g=state.general;
  const terms=state.terms.map(t=>`<tr><td class="narrow"><strong>${escapeHtml(t.nom)}</strong></td><td>${linesToHtml(t.sabers)}</td><td>${linesToHtml(t.situacions)}</td><td>${linesToHtml(t.competencies)}</td><td>${linesToHtml(t.criteris)}</td></tr>`).join('');
  const indicators=state.indicators.map(i=>`<tr><td><strong>${linesToHtml(i.criteri)}</strong></td><td>${linesToHtml(i.as)}</td><td>${linesToHtml(i.an)}</td><td>${linesToHtml(i.ae)}</td></tr>`).join('');
  qs('#printArea').innerHTML=`
  <h1>Programació anual ESO - nou currículum</h1>
  <table><tr><th>Camp</th><th>Informació</th></tr>
    <tr><td><strong>Departament</strong></td><td>${escapeHtml(g.departament)}</td></tr>
    <tr><td><strong>Docent/s</strong></td><td>${escapeHtml(g.docents)}</td></tr>
    <tr><td><strong>Matèria</strong></td><td>${escapeHtml(g.materia)}</td></tr>
    <tr><td><strong>Tipus de matèria</strong></td><td>${escapeHtml(g.tipusMateria)}</td></tr>
    <tr><td><strong>Nivell</strong></td><td>${escapeHtml(g.nivell)}</td></tr>
    <tr><td><strong>Curs acadèmic</strong></td><td>${escapeHtml(g.cursAcademic)}</td></tr>
    <tr><td><strong>Centre</strong></td><td>${escapeHtml(g.centre)}</td></tr>
    <tr><td><strong>Grup/s</strong></td><td>${escapeHtml(g.grup)}</td></tr>
  </table>
  <h2>Marc normatiu</h2>${linesToHtml(state.marcNormatiu)}
  <h2>Competències clau i indicadors</h2><table><tr><th>Competència clau</th><th>Indicadors / concreció</th></tr>${state.competenciesClau.split('\n').filter(Boolean).map(line=>`<tr><td>${escapeHtml(line.split(':')[0]||'')}</td><td>${escapeHtml(line.includes(':')?line.split(':').slice(1).join(':').trim():line)}</td></tr>`).join('')}</table>
  <h2>Temporització, sabers, situacions d’aprenentatge, competències i criteris</h2><table><tr><th>Temp</th><th>Sabers</th><th>Situacions d’aprenentatge</th><th>Competències específiques</th><th>Criteris d’avaluació</th></tr>${terms}</table>
  <h2>Indicadors d’avaluació</h2><table><tr><th>Criteris d’avaluació</th><th>AS</th><th>AN</th><th>AE</th></tr>${indicators}</table>
  <h2>Estratègies metodològiques i gestió d’aula</h2>${linesToHtml(state.metodologia)}
  <h2>Recursos i materials didàctics</h2>${linesToHtml(state.recursos)}
  <h2>Mesures i suports d’atenció educativa inclusiva</h2><table><tr><th>Tipus de mesura</th><th>Descripció</th></tr><tr><td><strong>Universals</strong></td><td>${linesToHtml(state.atencioDiversitat.universals)}</td></tr><tr><td><strong>Addicionals</strong></td><td>${linesToHtml(state.atencioDiversitat.addicionals)}</td></tr><tr><td><strong>Intensives</strong></td><td>${linesToHtml(state.atencioDiversitat.intensives)}</td></tr></table>
  <h2>Activitats complementàries</h2>${linesToHtml(state.activitatsComplementaries)}
  <h2>Procediments d’avaluació, qualificació i recuperació</h2>${linesToHtml(state.avaluacio)}
  <h2>Vectors o principis pedagògics</h2>${linesToHtml(state.vectorsPedagogics)}
  `;
}
function getLibrary(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')}catch{return[]}}
function setLibrary(items){localStorage.setItem(STORAGE_KEY,JSON.stringify(items))}
function saveCurrent(){state.updatedAt=new Date().toISOString(); const items=getLibrary(); const idx=items.findIndex(x=>x.id===state.id); if(idx>=0)items[idx]=state; else items.unshift(state); setLibrary(items); renderLibrary(); toast('Programació desada a la biblioteca local.');}
function renderLibrary(){const host=qs('#libraryList'); const items=getLibrary(); host.innerHTML=items.length?'':'<article class="card"><p>No hi ha cap programació desada encara.</p></article>'; items.forEach(item=>{const div=document.createElement('div'); div.className='library-item'; div.innerHTML=`<div><strong>${escapeHtml(item.general?.materia||'Programació')}</strong><p class="hint">${escapeHtml(item.general?.nivell||'')} · ${escapeHtml(item.general?.cursAcademic||'')} · Actualitzada: ${new Date(item.updatedAt||item.createdAt).toLocaleString('ca-ES')}</p></div><div class="toolbar"><button class="btn small secondary" data-load="${item.id}">Obre</button><button class="btn small secondary" data-export="${item.id}">JSON</button><button class="btn small danger" data-delete="${item.id}">Elimina</button></div>`; host.appendChild(div);});
qsa('[data-load]').forEach(b=>b.onclick=()=>{const found=getLibrary().find(x=>x.id===b.dataset.load); if(found){state=found; refreshAll(); toast('Programació carregada.');}});
qsa('[data-export]').forEach(b=>b.onclick=()=>{const found=getLibrary().find(x=>x.id===b.dataset.export); if(found) download(`${filenameBase()}_programacio.json`,JSON.stringify(found,null,2),'application/json');});
qsa('[data-delete]').forEach(b=>b.onclick=()=>{setLibrary(getLibrary().filter(x=>x.id!==b.dataset.delete)); renderLibrary(); toast('Programació eliminada.');});}
function exportWord(){
  renderDocument();
  const html=`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(state.general.materia)}</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:6px;vertical-align:top}th{background:#eef3ee}h1{text-align:center;text-transform:uppercase}h2{text-transform:uppercase;border-bottom:2px solid #222}</style></head><body>${qs('#printArea').innerHTML}</body></html>`;
  download(`${filenameBase()}.doc`, html, 'application/msword');
}
function refreshAll(){bindFields();renderTerms();renderIndicators();renderDocument();renderLibrary();renderDiagnostic();}
async function renderDiagnostic(){
  const box=qs('#diagnosticBox');
  const sw='serviceWorker' in navigator ? 'Disponible' : 'No disponible';
  const controller=navigator.serviceWorker?.controller ? 'Actiu' : 'Encara no controla la pàgina';
  let cacheText='No comprovat';
  if('caches' in window){const keys=await caches.keys(); cacheText=keys.length?keys.join(', '):'Cap cache detectada';}
  box.innerHTML=`<div class="status-row"><strong>Service worker</strong><span class="pill">${sw}</span></div><div class="status-row"><strong>Control de pàgina</strong><span class="pill">${controller}</span></div><div class="status-row"><strong>Cache</strong><span class="pill">${escapeHtml(cacheText)}</span></div><div class="status-row"><strong>Mode connexió</strong><span class="pill">${navigator.onLine?'En línia':'Offline'}</span></div><div class="status-row"><strong>Biblioteca local</strong><span class="pill">${getLibrary().length} programació/ns</span></div>`;
}
function setup(){
  qsa('.nav-item').forEach(btn=>btn.onclick=()=>{qsa('.nav-item').forEach(b=>b.classList.remove('active'));btn.classList.add('active');qsa('.view').forEach(v=>v.classList.remove('active-view'));qs('#'+btn.dataset.view).classList.add('active-view');renderDocument();});
  qs('#newBtn').onclick=()=>{state=createDefaultProgram();refreshAll();toast('Nova programació creada.');};
  qs('#saveBtn').onclick=saveCurrent;
  qs('#addTermBtn').onclick=()=>{state.terms.push({nom:'Nou període',sabers:'',situacions:'',competencies:'',criteris:''});renderTerms();renderDocument();};
  qs('#addIndicatorBtn').onclick=()=>{state.indicators.push({criteri:'',as:'',an:'',ae:''});renderIndicators();renderDocument();};
  qs('#printBtn').onclick=()=>window.print(); qs('#pdfBtn').onclick=()=>{qsa('.nav-item').find(b=>b.dataset.view==='document').click();setTimeout(()=>window.print(),100)};
  qs('#wordBtn').onclick=exportWord;
  qs('#copyDocBtn').onclick=async()=>{renderDocument(); await navigator.clipboard.writeText(qs('#printArea').innerText); toast('Document copiat com a text.');};
  qs('#backupBtn').onclick=()=>download(`copia_seguretat_prog_lomloe_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({type:'prog-lomloe-backup',version:'0.1.0',exportedAt:new Date().toISOString(),items:getLibrary()},null,2),'application/json');
  qs('#jsonFile').onchange=e=>{const file=e.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{try{const data=JSON.parse(reader.result); if(data.items){setLibrary(data.items);renderLibrary();toast('Còpia de seguretat importada.')} else {state=data;refreshAll();toast('Programació importada.')}}catch{toast('No s’ha pogut llegir el JSON.')}}; reader.readAsText(file);};
  qs('#textFile').onchange=e=>{const file=e.target.files[0]; if(!file)return; if(!file.name.toLowerCase().endsWith('.txt')){toast('En aquesta versió només s’importa TXT directament.');return;} const reader=new FileReader(); reader.onload=()=>{qs('#importedText').value=reader.result;toast('Text importat.');}; reader.readAsText(file);};
  qs('#useImportedAsMethodology').onclick=()=>{state.metodologia=qs('#importedText').value;refreshAll();toast('Text enviat a metodologia.');};
  qs('#useImportedAsResources').onclick=()=>{state.recursos=qs('#importedText').value;refreshAll();toast('Text enviat a recursos.');};
  qs('#saveSettingsBtn').onclick=()=>{const settings={saveApiKey:qs('#saveApiKey').checked}; if(settings.saveApiKey) settings.apiKey=qs('#apiKey').value; localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings)); toast('Configuració desada.');};
  qsa('.local-gen').forEach(btn=>btn.onclick=()=>{if(btn.dataset.target==='metodologia')state.metodologia='La metodologia combina explicacions breus, aprenentatge basat en projectes, activitats cooperatives, pràctiques guiades i moments de reflexió individual. Es prioritza la connexió amb situacions properes a l’alumnat i l’ús progressiu d’eines digitals.'; if(btn.dataset.target==='avaluacio')state.avaluacio='L’avaluació és contínua, formativa i competencial. Es recullen evidències mitjançant rúbriques, activitats d’aula, projectes, proves, autoavaluació i coavaluació. La recuperació es basa en la revisió i millora de les tasques no assolides.'; if(btn.dataset.target==='diversitat')state.atencioDiversitat={universals:'Instruccions clares, models d’exemple, activitats graduades, treball cooperatiu i opcions diverses de representació i expressió.',addicionals:'Adaptacions de temps, suport visual, guiatge específic, parelles de suport i activitats ajustades a necessitats concretes.',intensives:'Mesures individualitzades segons el pla de suport, coordinació amb orientació i adaptació d’activitats i instruments quan sigui necessari.'}; refreshAll(); toast('Text base afegit.');});
  qs('#refreshDiagBtn').onclick=renderDiagnostic;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;qs('#installBtn').hidden=false;});
  qs('#installBtn').onclick=async()=>{if(deferredInstallPrompt){deferredInstallPrompt.prompt();deferredInstallPrompt=null;qs('#installBtn').hidden=true;}};
  if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(renderDiagnostic).catch(()=>toast('No s’ha pogut registrar el service worker.'));}
  const settings=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'); if(settings.apiKey){qs('#apiKey').value=settings.apiKey;qs('#saveApiKey').checked=true;}
  refreshAll();
}
document.addEventListener('DOMContentLoaded',setup);
