const STORE_KEY = 'prog_lomloe_library_v060';
const SETTINGS_KEY = 'prog_lomloe_settings_v060';
let deferredPrompt = null;
let state = currentCourseProgram();

function uid(prefix='id'){return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`}
function lines(v){return String(v||'').split('\n').map(s=>s.trim()).filter(Boolean)}
function escapeHtml(str=''){return String(str).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function nl(str=''){return escapeHtml(str).replace(/\n/g,'<br>')}
function download(name, content, type='application/json'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

const CURRICULUM_BANK_KEY = 'prog_lomloe_curriculum_bank_v060';
const CURRICULUM_COURSES = {
  '1t': {
    label:'1r ESO · Tecnologia i Digitalització', etapa:'ESO', nivell:'1r ESO', materia:'Tecnologia i Digitalització', tipusMateria:'Comuna',
    sabers:'Procés de resolució de problemes i de projectes: identificació de necessitats, recerca d’informació, ideació, planificació i comunicació de solucions.\nMaterials, eines i fabricació: selecció i ús segur de materials i eines bàsiques en la construcció d’objectes senzills.\nComunicació i representació tècnica: esbossos, croquis, plànols senzills, mesures i ús de vocabulari tècnic.\nDigitalització de l’entorn d’aprenentatge: ús responsable d’eines digitals, organització d’arxius i creació de continguts.\nTecnologia sostenible: consum responsable, reutilització de materials, reducció de residus i valoració de l’impacte ambiental.',
    competencies:[
      {codi:'CE1', text:'Identificar necessitats o reptes senzills de l’entorn proper i proposar solucions tecnològiques creatives, viables i sostenibles.'},
      {codi:'CE2', text:'Aplicar el procés tecnològic en projectes guiats, des de la ideació fins a la construcció, la prova i la millora.'},
      {codi:'CE3', text:'Utilitzar materials, eines i tècniques bàsiques de manera segura i adequada a la finalitat del projecte.'},
      {codi:'CE4', text:'Representar i comunicar idees tecnològiques mitjançant esbossos, croquis, documents senzills i vocabulari tècnic.'},
      {codi:'CE5', text:'Fer servir eines digitals de manera responsable per crear, organitzar, documentar i compartir informació.'},
      {codi:'CE6', text:'Valorar l’impacte ambiental dels productes i decisions tecnològiques, aplicant criteris de sostenibilitat.'}
    ],
    criteris:'1.1. Identificar una necessitat o repte proper i proposar una solució tecnològica senzilla.\n2.1. Planificar les fases bàsiques d’un projecte tecnològic.\n2.2. Construir un objecte o prototip senzill utilitzant materials i eines de manera segura.\n3.1. Seleccionar materials i eines adequats segons la funció i les propietats.\n4.1. Comunicar una solució mitjançant esbossos, croquis o documents senzills.\n5.1. Utilitzar eines digitals per documentar, crear o compartir el projecte.\n6.1. Aplicar criteris de reutilització, consum responsable i sostenibilitat.'
  },
  '2t': {
    label:'2n ESO · Tecnologia i Digitalització', etapa:'ESO', nivell:'2n ESO', materia:'Tecnologia i Digitalització', tipusMateria:'Comuna',
    sabers:'Procés de resolució de problemes i de projectes: estratègies de cerca, anàlisi de problemes, planificació i avaluació de solucions.\nOperadors, estructures, mecanismes, electricitat i electrònica bàsica aplicats a projectes.\nComunicació tècnica: vocabulari, documents de projecte, representació 2D/3D i eines digitals.\nDigitalització de l’entorn personal d’aprenentatge: entorns virtuals, edició de continguts, organització segura d’informació i comunicació digital.\nPensament computacional, programació inicial, simulació, robòtica o sistemes de control senzills.\nTecnologia sostenible: eficiència energètica, consum responsable, energies renovables i economia circular.',
    competencies:[
      {codi:'CE1', text:'Analitzar problemes tecnològics propers i generar propostes de solució creatives, sostenibles i justificades.'},
      {codi:'CE2', text:'Planificar, dissenyar i desenvolupar solucions tecnològiques aplicant el procés tecnològic amb autonomia progressiva.'},
      {codi:'CE3', text:'Aplicar tècniques, operadors, materials, eines i coneixements interdisciplinaris per construir o simular solucions tecnològiques.'},
      {codi:'CE4', text:'Comunicar idees i projectes tecnològics utilitzant representacions, documents tècnics, vocabulari específic i suports digitals.'},
      {codi:'CE5', text:'Desenvolupar algorismes, aplicacions senzilles o sistemes programats aplicant els principis del pensament computacional.'},
      {codi:'CE6', text:'Utilitzar dispositius, aplicacions i entorns digitals de manera eficient, segura, crítica i responsable.'},
      {codi:'CE7', text:'Fer un ús ètic, sostenible i ecosocialment responsable de la tecnologia, valorant-ne l’impacte social i ambiental.'}
    ],
    criteris:'2.1. Idear i dissenyar solucions tecnològiques originals a problemes plantejats.\n3.1. Fabricar objectes o models utilitzant instruments, eines i materials adequats.\n4.1. Elaborar i comunicar documentació tècnica del procés i del resultat.\n5.1. Dissenyar o interpretar solucions mitjançant algorismes, diagrames o programes senzills.\n6.1. Fer un ús eficient i segur dels dispositius i entorns digitals.\n6.2. Crear i compartir continguts digitals respectant llicències i drets d’autoria.\n7.1. Identificar la influència de l’activitat tecnològica en la societat i la sostenibilitat.\n7.2. Fer un ús responsable i ètic de les tecnologies emergents.\n7.3. Valorar l’economia circular i la reducció de residus.'
  },
  '3t': {
    label:'3r ESO · Tecnologia i Digitalització', etapa:'ESO', nivell:'3r ESO', materia:'Tecnologia i Digitalització', tipusMateria:'Comuna',
    sabers:'Procés tecnològic aplicat a problemes més oberts: recerca, ideació, planificació, gestió de projectes i avaluació de resultats.\nFabricació i prototipatge: materials, eines, tècniques de fabricació manual, mecànica o digital i normes de seguretat.\nOperadors tecnològics: estructures, mecanismes, electricitat, electrònica, sensors, actuadors i sistemes de control.\nPensament computacional, programació, dades, simuladors, robòtica i introducció a tecnologies emergents.\nComunicació i difusió de projectes: documentació tècnica, presentacions, representació digital i treball col·laboratiu.\nTecnologia sostenible: anàlisi d’impacte, eficiència, disseny responsable i presa de decisions informada.',
    competencies:[
      {codi:'CE1', text:'Analitzar necessitats, oportunitats i problemes tecnològics amb sentit crític, incorporant criteris de sostenibilitat i impacte social.'},
      {codi:'CE2', text:'Planificar i gestionar projectes tecnològics de manera cooperativa, ordenada i creativa, documentant el procés.'},
      {codi:'CE3', text:'Dissenyar, construir, provar i millorar prototips o sistemes utilitzant materials, operadors, components i eines adequades.'},
      {codi:'CE4', text:'Representar, documentar i difondre solucions tecnològiques amb precisió tècnica i ús adequat de suports digitals.'},
      {codi:'CE5', text:'Aplicar pensament computacional, programació, simulació o robòtica per resoldre problemes concrets.'},
      {codi:'CE6', text:'Utilitzar entorns digitals, dispositius i eines de manera eficient, segura, crítica i col·laborativa.'},
      {codi:'CE7', text:'Avaluar l’impacte ètic, social i ambiental de les solucions tecnològiques i proposar millores sostenibles.'}
    ],
    criteris:'1.1. Analitzar una necessitat o problema i justificar les condicions que ha de complir la solució.\n2.1. Planificar i documentar projectes tecnològics amb fases, recursos i responsabilitats.\n2.2. Construir o simular productes i sistemes utilitzant tècniques i eines adequades.\n3.1. Integrar operadors, materials, components i mecanismes en una solució funcional.\n4.1. Comunicar el procés i el resultat amb documentació tècnica clara i ordenada.\n5.1. Desenvolupar algorismes, programes o sistemes de control senzills.\n6.1. Utilitzar entorns digitals i col·laboratius de forma eficient i segura.\n7.1. Valorar l’impacte ambiental i social del projecte i proposar millores.'
  },
  '4o': {
    label:'4t ESO · Tecnologia optativa', etapa:'ESO', nivell:'4t ESO', materia:'Tecnologia Aplicada', tipusMateria:'Optativa',
    sabers:'Projectes tecnològics i procés de disseny: anàlisi de necessitats, recerca, ideació, prototipatge, prova, millora i documentació.\nMaterials, sostenibilitat i consum responsable: propietats, selecció, reutilització, impacte ambiental i eficiència.\nElectricitat, electrònica i instal·lacions: magnituds bàsiques, circuits, components, protecció, mesura, simulació i seguretat.\nElectrònica digital i llenguatges digitals: binari, decimal, BCD, hexadecimal i operacions bàsiques.\nMecanismes, automatització i sistemes de control: sensors, controladors, actuadors, lleves, eixos, seguidors i transformació del moviment.\nEines digitals i representació: simuladors, plànols 2D/3D, documentació, comunicació i presentació de projectes.',
    competencies:[
      {codi:'CE1', text:'Idear i planificar solucions tecnològiques a partir de l’anàlisi de necessitats o reptes propers, proposant respostes creatives, viables, segures i sostenibles.'},
      {codi:'CE2', text:'Desenvolupar projectes tecnològics aplicant processos de disseny, planificació, construcció, prova, millora i avaluació de prototips.'},
      {codi:'CE3', text:'Utilitzar materials, eines, components, instruments de mesura, operadors i mecanismes adequats segons la funció, les propietats i l’impacte ambiental.'},
      {codi:'CE4', text:'Representar i comunicar idees, processos i solucions tecnològiques mitjançant esbossos, croquis, plànols, esquemes, càlculs, documents escrits i vocabulari tècnic.'},
      {codi:'CE5', text:'Utilitzar eines digitals, simuladors i llenguatges digitals bàsics per crear, representar, comprovar, documentar i compartir projectes tecnològics.'},
      {codi:'CE6', text:'Valorar la contribució de la tecnologia a la sostenibilitat, l’estalvi de recursos, la seguretat, l’eficiència energètica i la cura de l’entorn.'}
    ],
    criteris:'1.1. Analitzar una necessitat o repte tecnològic i planificar una solució coherent amb les condicions establertes.\n2.1. Aplicar les fases del procés tecnològic en el desenvolupament d’un projecte.\n2.2. Construir un objecte, prototip o circuit utilitzant materials, peces, components i unions adequades.\n3.1. Seleccionar i utilitzar materials, eines, instruments de mesura, mecanismes o components segons la finalitat.\n3.2. Aplicar coneixements tècnics, càlculs o procediments per interpretar el funcionament d’un sistema.\n4.1. Representar i comunicar projectes mitjançant dibuixos, esquemes, plànols, documents i vocabulari tècnic.\n5.1. Utilitzar eines digitals o llenguatges digitals per simular, comprovar, representar o resoldre tasques.\n6.1. Avaluar el funcionament d’un projecte o sistema, identificant punts forts, dificultats i possibles millores sostenibles.'
  }
};
function defaultCurriculumBank(){return JSON.parse(JSON.stringify(CURRICULUM_COURSES));}
function getCurriculumBank(){try{return JSON.parse(localStorage.getItem(CURRICULUM_BANK_KEY)||'null')||defaultCurriculumBank()}catch{return defaultCurriculumBank()}}
function setCurriculumBank(bank){localStorage.setItem(CURRICULUM_BANK_KEY,JSON.stringify(bank));}
function courseFromSelect(){return document.getElementById('curriculumCourseSelect')?.value || '4o'}
function selectedCurriculum(){return getCurriculumBank()[courseFromSelect()] || getCurriculumBank()['4o'];}
function renderCurriculumBank(){
  const sel=document.getElementById('curriculumCourseSelect'); if(!sel) return;
  const bank=getCurriculumBank();
  const current=sel.value || detectCourseKey();
  sel.innerHTML=Object.keys(CURRICULUM_COURSES).map(k=>`<option value="${k}">${escapeHtml(bank[k]?.label||CURRICULUM_COURSES[k].label)}</option>`).join('');
  sel.value=bank[current]?current:'4o';
  fillCurriculumEditor();
}
function detectCourseKey(){
  const n=String(state.general?.nivell||'').toLowerCase();
  const m=String(state.general?.materia||'').toLowerCase();
  if(n.includes('1')) return '1t';
  if(n.includes('2')) return '2t';
  if(n.includes('3')) return '3t';
  if(n.includes('4') || m.includes('aplicada') || m.includes('optativa')) return '4o';
  return '4o';
}
function fillCurriculumEditor(){
  const c=selectedCurriculum();
  const ids={curriculumLabel:c.label,curriculumSabers:c.sabers,curriculumCriteris:c.criteris};
  Object.keys(ids).forEach(id=>{const el=document.getElementById(id); if(el) el.value=ids[id]||''});
  const ce=document.getElementById('curriculumCE');
  if(ce) ce.value=(c.competencies||[]).map(x=>`${x.codi}. ${x.text}`).join('\n');
}
function saveCurriculumEditor(){
  const bank=getCurriculumBank(); const key=courseFromSelect(); const cur=bank[key]||{};
  cur.label=document.getElementById('curriculumLabel')?.value || cur.label;
  cur.sabers=document.getElementById('curriculumSabers')?.value || '';
  cur.criteris=document.getElementById('curriculumCriteris')?.value || '';
  cur.competencies=lines(document.getElementById('curriculumCE')?.value || '').map(line=>{
    const m=line.match(/^\s*(CE\s*\d+)\s*[\.:-]?\s*(.*)$/i);
    return m?{codi:m[1].replace(/\s+/g,'').toUpperCase(),text:m[2].trim()}:{codi:'',text:line};
  }).filter(x=>x.codi||x.text);
  bank[key]=cur; setCurriculumBank(bank); renderCurriculumBank(); alert('Banc curricular desat localment.');
}
function resetCurriculumCourse(){
  const bank=getCurriculumBank(); const key=courseFromSelect(); bank[key]=JSON.parse(JSON.stringify(CURRICULUM_COURSES[key])); setCurriculumBank(bank); renderCurriculumBank(); alert('S’ha restaurat aquest curs del banc curricular.');
}
function applyCurriculumToProgram(){
  const c=selectedCurriculum();
  state.general.etapa=c.etapa||state.general.etapa; state.general.nivell=c.nivell||state.general.nivell; state.general.materia=c.materia||state.general.materia; state.general.tipusMateria=c.tipusMateria||state.general.tipusMateria;
  state.competenciesEspecifiques=(c.competencies||[]).map(x=>({id:uid('ce'),codi:x.codi,text:x.text}));
  renderAll(); showSection('competencies'); alert('S’han aplicat curs, matèria i competències específiques del banc. Els sabers i criteris queden com a suggeriment editable, no s’imposen a les SA.');
}
function copyCurriculumSabers(){
  const c=selectedCurriculum(); const text=`SABERS\n${c.sabers||''}\n\nCRITERIS D’AVALUACIÓ\n${c.criteris||''}`;
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(()=>alert('Sabers i criteris copiats.')).catch(()=>prompt('Copia els sabers i criteris:',text));}
  else prompt('Copia els sabers i criteris:',text);
}
function addCurriculumSuggestionToSA(){
  if(!state.situacions.length) return alert('Primer crea una SA.');
  const c=selectedCurriculum(); const sa=state.situacions[state.situacions.length-1];
  if(!sa.sabers) sa.sabers=c.sabers||'';
  if(!sa.criteris) sa.criteris=c.criteris||'';
  if(!sa.competencies) sa.competencies=(c.competencies||[]).map(x=>x.codi).filter(Boolean).join('\n');
  renderAll(); showSection('sa'); alert('S’han afegit els suggeriments del banc a l’última SA buida o incompleta. Revisa’ls i adapta’ls.');
}
function exportCurriculumBank(){download('banc_curricular_tecnologia_eso.json', JSON.stringify({type:'banc-curricular-tecnologia-eso',version:'0.6.0',exportedAt:new Date().toISOString(),courses:getCurriculumBank()},null,2));}
async function importCurriculumBankFile(file){
  const data=JSON.parse(await file.text()); const bank=data.courses || data; setCurriculumBank(bank); renderCurriculumBank(); alert('Banc curricular importat. Revisa els cursos abans d’aplicar-los.');
}

const FONT_OPTIONS={
  times:{label:'Times New Roman',css:'\"Times New Roman\", Times, serif'},
  arial:{label:'Arial',css:'Arial, Helvetica, sans-serif'},
  georgia:{label:'Georgia',css:'Georgia, \"Times New Roman\", serif'},
  verdana:{label:'Verdana',css:'Verdana, Geneva, sans-serif'},
  system:{label:'Sistema',css:'system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif'}
};
function getSettings(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}catch{return {}}}
function setSettings(settings){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings||{}))}
function getCurrentFont(){return getSettings().font||'times'}
function applyFont(font=getCurrentFont()){
  const selected=FONT_OPTIONS[font]?font:'times';
  document.body.classList.remove('font-times','font-arial','font-georgia','font-verdana','font-system');
  document.body.classList.add('font-'+selected);
  const sel=document.getElementById('fontSelect');
  if(sel) sel.value=selected;
  return selected;
}
function setCurrentFont(font){const settings=getSettings();settings.font=FONT_OPTIONS[font]?font:'times';setSettings(settings);applyFont(settings.font);renderPreview();}
function currentFontCss(){return FONT_OPTIONS[getCurrentFont()]?.css||FONT_OPTIONS.times.css}
function getDocOptions(){const s=getSettings();return {tableMode:s.tableMode||'compact',orientation:s.orientation||'landscape'}}
function setDocOption(name,value){const s=getSettings();s[name]=value;setSettings(s);applyDocOptions();renderPreview()}
function applyDocOptions(){const opts=getDocOptions();const t=document.getElementById('tableModeSelect');if(t)t.value=opts.tableMode;const o=document.getElementById('orientationSelect');if(o)o.value=opts.orientation;return opts}
function docPageClass(extra=''){const mode=getDocOptions().tableMode;return ['doc-page',mode==='compact'?'doc-compact':'',mode==='ultra'?'doc-ultra':'',extra].filter(Boolean).join(' ')}
function exportDensity(){const mode=getDocOptions().tableMode;return mode==='ultra'?{pad:'3px',font:'8.8pt',line:'1.08'}:mode==='compact'?{pad:'4px',font:'9.4pt',line:'1.14'}:{pad:'6px',font:'10pt',line:'1.22'}}
function documentStylesForExport(opts={}){
  const font=currentFontCss();
  const density=exportDensity();
  const orientation=opts.orientation||getDocOptions().orientation;
  const layout=opts.docsFriendly?'auto':'fixed';
  return `@page{size:A4 ${orientation};margin:1.1cm}body,.doc-page,.document-view,table,td,th{font-family:${font};color:#111}body{margin:18px;background:#fff}.doc-page{max-width:none}.doc-title{font-size:16pt;font-weight:900;text-transform:uppercase;margin:0 0 14px}.doc-section{font-size:12pt;font-weight:900;text-transform:uppercase;margin:18px 0 8px}table,.doc-table{border-collapse:collapse!important;width:100%;table-layout:${layout};margin:10px 0;border:1px solid #111!important}td,th{border:1px solid #111!important;padding:${density.pad};vertical-align:top;white-space:pre-wrap;font-size:${density.font};line-height:${density.line}}th{background:#e6e6e6;text-align:center;font-weight:900}.label{font-weight:900;background:#f2f2f2}p{margin:0 0 6px}tr,td,th{break-inside:avoid;page-break-inside:avoid}.page-break{page-break-before:always}.sa-print-section{break-inside:avoid;page-break-inside:avoid;margin:0 0 14px}.sa-print-section h3{margin:10px 0 6px;font-size:12pt}`;
}
function inlineExportHtml(html, opts={}){
  const density=exportDensity();
  const layout=opts.docsFriendly?'auto':'fixed';
  const tableStyle=`border-collapse:collapse;width:100%;table-layout:${layout};margin:10px 0;border:1px solid #111;`;
  const tdBase=`border:1px solid #111;padding:${density.pad};vertical-align:top;white-space:pre-wrap;font-size:${density.font};line-height:${density.line};`;
  const thBase=tdBase+'background:#e6e6e6;text-align:center;font-weight:900;';
  html=html.replace(/<table class="doc-table">/g, `<table class="doc-table" border="1" cellspacing="0" cellpadding="6" style="${tableStyle}">`);
  html=html.replace(/<td([^>]*)>/g,(m,a)=>{
    const extra=/class="label"/.test(a)?'font-weight:900;background:#f2f2f2;':'';
    if(/style="/.test(a)) return `<td${a.replace(/style="([^"]*)"/, `style="${tdBase}${extra}$1"`)}>`;
    return `<td${a} style="${tdBase}${extra}">`;
  });
  html=html.replace(/<th([^>]*)>/g,(m,a)=>{
    if(/style="/.test(a)) return `<th${a.replace(/style="([^"]*)"/, `style="${thBase}$1"`)}>`;
    return `<th${a} style="${thBase}">`;
  });
  return html;
}
function expandCompetenciesForDocument(raw){
  const ceMap={};
  (state.competenciesEspecifiques||[]).forEach(c=>{ if(c.codi) ceMap[String(c.codi).replace(/\s+/g,'').toUpperCase()] = c; });
  const rawText=String(raw||'').trim();
  if(!rawText) return '';
  const out=[];
  rawText.split(/\n/).forEach(line=>{
    const clean=line.trim();
    if(!clean) return;
    const tokens=clean.match(/\bCE\s*\d+\b/gi)||[];
    const onlyCodes= tokens.length && clean.replace(/\bCE\s*\d+\b|[,;·\s]/gi,'').trim()==='';
    if(onlyCodes){
      tokens.forEach(t=>{
        const code=t.replace(/\s+/g,'').toUpperCase();
        const ce=ceMap[code];
        out.push(ce && ce.text ? `${ce.codi}. ${ce.text}` : code);
      });
    }else{
      out.push(clean);
    }
  });
  return out.join('\n\n');
}
function documentHtmlForExport(opts={}){return `<!doctype html><html lang="ca"><head><meta charset="utf-8"><meta name="ProgId" content="Word.Document"><meta name="Generator" content="Programacio LOMLOE"><title>${escapeHtml(state.general.materia||'Programació')}</title><style>${documentStylesForExport(opts)}</style></head><body><div class="WordSection1">${inlineExportHtml(makeDocumentHtml(opts),opts)}</div></body></html>`}
function stripHtmlToText(html){const d=document.createElement('div');d.innerHTML=html;d.querySelectorAll('tr').forEach(tr=>tr.appendChild(document.createTextNode('\n')));d.querySelectorAll('td,th').forEach(cell=>cell.appendChild(document.createTextNode('\t')));return d.innerText.replace(/\t\n/g,'\n').trim()}
async function copyRichDocument(){
  renderPreview();
  const html=`<style>${documentStylesForExport()}</style>${inlineExportHtml(makeDocumentHtml())}`;
  const text=stripHtmlToText(makeDocumentHtml());
  try{
    if(navigator.clipboard && window.ClipboardItem){
      await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]);
      alert('Document copiat amb taules. Enganxa’l directament a Word o Google Docs.');
      return;
    }
  }catch(err){console.warn(err)}
  const area=document.createElement('div');
  area.contentEditable='true'; area.style.position='fixed'; area.style.left='-9999px'; area.innerHTML=html;
  document.body.appendChild(area);
  const range=document.createRange(); range.selectNodeContents(area);
  const sel=window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  const ok=document.execCommand('copy'); sel.removeAllRanges(); area.remove();
  alert(ok?'Document copiat amb taules. Enganxa’l directament a Word o Google Docs.':'No he pogut copiar automàticament. Prova el botó HTML copiable (recomanat).');
}
function downloadCopyHtml(){renderPreview();download(`${state.general.materia||'programacio'}_${state.general.nivell||''}_copiable.html`, documentHtmlForExport(), 'text/html')}
async function copyDocsOptimized(){
  renderPreview();
  const html=`<style>${documentStylesForExport({docsFriendly:true})}</style>${inlineExportHtml(makeDocumentHtml({docsFriendly:true}),{docsFriendly:true})}`;
  const text=stripHtmlToText(makeDocumentHtml({docsFriendly:true}));
  try{
    if(navigator.clipboard && window.ClipboardItem){
      await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]);
      alert('Versió optimitzada per Google Docs copiada. Enganxa-la directament al document.');
      return;
    }
  }catch(err){console.warn(err)}
  const area=document.createElement('div');area.contentEditable='true';area.style.position='fixed';area.style.left='-9999px';area.innerHTML=html;document.body.appendChild(area);
  const range=document.createRange();range.selectNodeContents(area);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);const ok=document.execCommand('copy');sel.removeAllRanges();area.remove();
  alert(ok?'Versió optimitzada per Google Docs copiada.':'No he pogut copiar automàticament. Prova HTML copiable (recomanat).');
}



// v0.6.0 - DOCX real + banc curricular flexible (OOXML natiu, sense dependre d'HTML convertit)
const DOCX_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
function xmlEsc(v=''){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))}
function cleanFilename(v='programacio'){return String(v||'programacio').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,80)||'programacio'}
function utf8Bytes(str){return new TextEncoder().encode(str)}
function u16(n){return [n&255,(n>>>8)&255]}
function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
function concatBytes(chunks){let len=chunks.reduce((a,c)=>a+c.length,0),out=new Uint8Array(len),pos=0;for(const c of chunks){out.set(c,pos);pos+=c.length}return out}
let CRC_TABLE=null;
function crc32(bytes){
  if(!CRC_TABLE){CRC_TABLE=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);CRC_TABLE[n]=c>>>0}}
  let c=0xffffffff;for(const b of bytes)c=CRC_TABLE[(c^b)&0xff]^(c>>>8);return (c^0xffffffff)>>>0;
}
function dosDateTime(d=new Date()){
  const time=((d.getHours()&31)<<11)|((d.getMinutes()&63)<<5)|((Math.floor(d.getSeconds()/2))&31);
  const date=(((d.getFullYear()-1980)&127)<<9)|(((d.getMonth()+1)&15)<<5)|(d.getDate()&31);
  return {time,date};
}
function zipStore(files){
  const now=dosDateTime();let offset=0;const locals=[],centrals=[];
  for(const [name,content] of files){
    const nameB=utf8Bytes(name),data=content instanceof Uint8Array?content:utf8Bytes(content),crc=crc32(data);
    const local=concatBytes([new Uint8Array([0x50,0x4b,0x03,0x04]),new Uint8Array(u16(20)),new Uint8Array(u16(0x0800)),new Uint8Array(u16(0)),new Uint8Array(u16(now.time)),new Uint8Array(u16(now.date)),new Uint8Array(u32(crc)),new Uint8Array(u32(data.length)),new Uint8Array(u32(data.length)),new Uint8Array(u16(nameB.length)),new Uint8Array(u16(0)),nameB,data]);
    locals.push(local);
    const central=concatBytes([new Uint8Array([0x50,0x4b,0x01,0x02]),new Uint8Array(u16(20)),new Uint8Array(u16(20)),new Uint8Array(u16(0x0800)),new Uint8Array(u16(0)),new Uint8Array(u16(now.time)),new Uint8Array(u16(now.date)),new Uint8Array(u32(crc)),new Uint8Array(u32(data.length)),new Uint8Array(u32(data.length)),new Uint8Array(u16(nameB.length)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u32(0)),new Uint8Array(u32(offset)),nameB]);
    centrals.push(central);offset+=local.length;
  }
  const cdStart=offset, cd=concatBytes(centrals), cdEnd=concatBytes([new Uint8Array([0x50,0x4b,0x05,0x06]),new Uint8Array(u16(0)),new Uint8Array(u16(0)),new Uint8Array(u16(files.length)),new Uint8Array(u16(files.length)),new Uint8Array(u32(cd.length)),new Uint8Array(u32(cdStart)),new Uint8Array(u16(0))]);
  return new Blob([concatBytes([...locals,cd,cdEnd])],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
function wText(text){return `<w:r><w:t xml:space="preserve">${xmlEsc(text)}</w:t></w:r>`}
function wBreak(){return '<w:r><w:br/></w:r>'}
function wP(text='',opts={}){
  const align=opts.align?`<w:jc w:val="${opts.align}"/>`:'';
  const bold=opts.bold?'<w:b/>':'';
  const size=opts.size?`<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>`:'';
  const spacing=opts.spacing===false?'':`<w:spacing w:after="${opts.after||80}"/>`;
  const pPr=`<w:pPr>${align}${spacing}</w:pPr>`;
  const rPr=(bold||size)?`<w:rPr>${bold}${size}</w:rPr>`:'';
  const parts=String(text||'').split('\n');
  const runs=parts.map((part,i)=>`${i?wBreak():''}<w:r>${rPr}<w:t xml:space="preserve">${xmlEsc(part)}</w:t></w:r>`).join('');
  return `<w:p>${pPr}${runs}</w:p>`;
}
function wHeading(text,level=1){return wP(String(text||'').toUpperCase(),{bold:true,size:level===1?28:24,after:120})}
function wCell(text,width,opts={}){
  const shade=opts.shade?`<w:shd w:fill="${opts.shade}"/>`:'';
  const vAlign='<w:vAlign w:val="top"/>';
  const wTag=width?`<w:tcW w:w="${width}" w:type="dxa"/>`:'';
  const pars=Array.isArray(text)?text.map(x=>typeof x==='string'?wP(x,opts):x).join(''):String(text||'').split('\n\n').map(x=>wP(x,opts)).join('');
  return `<w:tc><w:tcPr>${wTag}${vAlign}${shade}</w:tcPr>${pars||wP('')}</w:tc>`;
}
function wRow(cells,widths=[],opts={}){return `<w:tr>${cells.map((c,i)=>wCell(c,widths[i],opts.header?{bold:true,align:'center',shade:'E6E6E6'}:{})).join('')}</w:tr>`}
function wTable(rows,widths=[]){
  const grid=widths.length?`<w:tblGrid>${widths.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>`:'';
  const props='<w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="8"/><w:left w:val="single" w:sz="8"/><w:bottom w:val="single" w:sz="8"/><w:right w:val="single" w:sz="8"/><w:insideH w:val="single" w:sz="8"/><w:insideV w:val="single" w:sz="8"/></w:tblBorders><w:tblLayout w:type="fixed"/></w:tblPr>';
  return `<w:tbl>${props}${grid}${rows}</w:tbl>`;
}
function ceTextForDocx(raw){return expandCompetenciesForDocument(raw||'')}
function buildDocxDocumentXml(){
  const g=state.general||{};
  const landscape=getDocOptions().orientation!=='portrait';
  const pgSz=landscape?'<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>':'<w:pgSz w:w="11906" w:h="16838"/>';
  const sectPr=`<w:sectPr>${pgSz}<w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr>`;
  const body=[];
  body.push(wHeading('PROGRAMACIÓ ANUAL ESO - NOU CURRÍCULUM',1));
  body.push(wTable([
    wRow(['DEPARTAMENT:',g.departament||'','DOCENT/S:',g.docents||''],[2500,5200,2500,5200]),
    wRow(['MATÈRIA:',g.materia||'','TIPUS DE MATÈRIA:',g.tipusMateria||''],[2500,5200,2500,5200]),
    wRow(['NIVELL:',g.nivell||'','CURS:',g.cursAcademic||''],[2500,5200,2500,5200]),
    wRow(['CENTRE:',g.centre||'','GRUP/S:',g.grup||''],[2500,5200,2500,5200])
  ].join(''),[2500,5200,2500,5200]));
  body.push(wHeading('COMPETÈNCIES CLAU I INDICADORS',2));
  const compRows=wRow(['COMPETÈNCIES CLAU','INDICADORS'],[6200,9200],{header:true})+(state.competenciesClau||[]).map(c=>wRow([c.nom||'',c.indicadors||''],[6200,9200])).join('');
  body.push(wTable(compRows,[6200,9200]));
  body.push(wHeading('TEMPORITZACIÓ, SABERS, SITUACIONS D’APRENENTATGE, CE I CA',2));
  const mainWidths=[900,3800,3800,3300,3600];
  const mainRows=wRow(['TEMP','SABERS','SITUACIONS APRENENTATGE','COMPETÈNCIES ESPECÍFIQUES','CRITERIS D’AVALUACIÓ'],mainWidths,{header:true})+(state.situacions||[]).map(sa=>{
    const tri=(state.trimestres||[]).find(t=>t.id===sa.trimestre)?.nom||'';
    const saText=`${sa.titol||''}${sa.descripcio?'\n\n'+sa.descripcio:''}${sa.repte?'\n\nRepte:\n'+sa.repte:''}${sa.producteFinal?'\n\nProducte final:\n'+sa.producteFinal:''}`;
    return wRow([tri,sa.sabers||'',saText,ceTextForDocx(sa.competencies),sa.criteris||''],mainWidths);
  }).join('');
  body.push(wTable(mainRows,mainWidths));
  if((state.indicadors||[]).length){
    body.push(wHeading('INDICADORS D’AVALUACIÓ',2));
    const indW=[5200,3400,3400,3400];
    const rows=wRow(['CRITERIS D’AVALUACIÓ','AS','AN','AE'],indW,{header:true})+state.indicadors.map(i=>wRow([i.criteri||'',i.AS||'',i.AN||'',i.AE||''],indW)).join('');
    body.push(wTable(rows,indW));
  }
  body.push(wHeading('ESTRATÈGIES METODOLÒGIQUES I GESTIÓ D’AULA',2));
  body.push(wTable(wRow([state.metodologia?.estrategies||''],[15400]),[15400]));
  body.push(wHeading('RECURSOS I MATERIALS DIDÀCTICS',2));
  body.push(wTable(wRow(['Recursos',state.recursos?.recursos||''],[3000,12400])+wRow(['Materials',state.recursos?.materials||''],[3000,12400]),[3000,12400]));
  body.push(wHeading('MESURES I SUPORTS D’ATENCIÓ EDUCATIVA INCLUSIVA',2));
  body.push(wTable(wRow(['DUA',state.dua?.text||''],[3000,12400])+wRow(['Universals',state.atencioDiversitat?.universals||''],[3000,12400])+wRow(['Addicionals',state.atencioDiversitat?.addicionals||''],[3000,12400])+wRow(['Intensives',state.atencioDiversitat?.intensives||''],[3000,12400]),[3000,12400]));
  body.push(wHeading('ACTIVITATS COMPLEMENTÀRIES',2));
  body.push(wTable(wRow([state.activitatsComplementaries||''],[15400]),[15400]));
  body.push(wHeading('PROCEDIMENTS D’AVALUACIÓ I RECUPERACIÓ',2));
  body.push(wTable(wRow(['Instruments d’avaluació',state.avaluacio?.instruments||''],[3300,12100])+wRow(['Criteris i instruments de qualificació',state.avaluacio?.criterisQualificacio||''],[3300,12100])+wRow(['Recuperació trimestral',state.avaluacio?.recuperacioTrimestral||''],[3300,12100])+wRow(['Recuperació del curs',state.avaluacio?.recuperacioCurs||''],[3300,12100]),[3300,12100]));
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${DOCX_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>${body.join('')}${sectPr}</w:body></w:document>`;
}
function buildDocxBlob(){
  const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/></Types>`;
  const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const docRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="${DOCX_NS}"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style></w:styles>`;
  const settings=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="${DOCX_NS}"><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>`;
  return zipStore([
    ['[Content_Types].xml',contentTypes],['_rels/.rels',rels],['word/document.xml',buildDocxDocumentXml()],['word/_rels/document.xml.rels',docRels],['word/styles.xml',styles],['word/settings.xml',settings]
  ]);
}
function exportDocxReal(){
  renderPreview();
  const name=`${cleanFilename(state.general?.materia||'programacio')}_${cleanFilename(state.general?.nivell||'')}_v060.docx`;
  const a=document.createElement('a');a.href=URL.createObjectURL(buildDocxBlob());a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}

function makeBlockPdfHtml(){
  const g=state.general;
  const keyRows=state.competenciesClau.map(c=>`<tr><td>${escapeHtml(c.nom)}</td><td>${nl(c.indicadors)}</td></tr>`).join('');
  const saBlocks=state.situacions.map((sa,idx)=>{
    const tri=state.trimestres.find(t=>t.id===sa.trimestre)?.nom||'';
    return `<section class="block-print-section"><h3>${escapeHtml(tri)} · ${escapeHtml(sa.titol||('SA '+(idx+1)))}</h3><table class="doc-table block-table"><tr><td class="label">SABERS</td><td>${nl(sa.sabers)}</td></tr><tr><td class="label">SITUACIÓ D’APRENENTATGE</td><td><strong>${escapeHtml(sa.titol)}</strong><br>${nl(sa.descripcio)}${sa.repte?'<br><br><strong>Repte:</strong><br>'+nl(sa.repte):''}${sa.producteFinal?'<br><br><strong>Producte final:</strong> '+escapeHtml(sa.producteFinal):''}</td></tr><tr><td class="label">COMPETÈNCIES ESPECÍFIQUES</td><td>${nl(expandCompetenciesForDocument(sa.competencies))}</td></tr><tr><td class="label">CRITERIS D’AVALUACIÓ</td><td>${nl(sa.criteris)}</td></tr><tr><td class="label">INSTRUMENTS</td><td>${nl(sa.instruments)}</td></tr></table></section>`;
  }).join('');
  const indRows=state.indicadors.map(it=>`<tr><td><strong>${nl(it.criteri)}</strong></td><td>${nl(it.AS)}</td><td>${nl(it.AN)}</td><td>${nl(it.AE)}</td></tr>`).join('') || '<tr><td></td><td></td><td></td><td></td></tr>';
  return `<div class="doc-page block-report"><div class="doc-title">PROGRAMACIÓ ANUAL ESO - NOU CURRÍCULUM</div><table class="doc-table"><tr><td class="label" colspan="3">DEPARTAMENT: ${escapeHtml(g.departament)}</td><td class="label" colspan="2">DOCENT/S: ${escapeHtml(g.docents)}</td></tr><tr><td class="label" colspan="2">MATÈRIA: ${escapeHtml(g.materia)}</td><td class="label">TIPUS DE MATÈRIA: ${escapeHtml(g.tipusMateria)}</td><td class="label" colspan="2">NIVELL: ${escapeHtml(g.nivell)}</td></tr><tr><td class="label">CURS: ${escapeHtml(g.cursAcademic)}</td><td class="label" colspan="2">CENTRE: ${escapeHtml(g.centre)}</td><td class="label" colspan="2">GRUP/S: ${escapeHtml(g.grup)}</td></tr></table><div class="doc-section">Competències clau i indicadors</div><table class="doc-table"><tr><th>COMPETÈNCIES CLAU</th><th>INDICADORS</th></tr>${keyRows}</table><div class="doc-section">Situacions d’aprenentatge per blocs</div>${saBlocks}<div class="doc-section">Indicadors d’avaluació</div><table class="doc-table"><tr><th rowspan="2">CRITERIS D’AVALUACIÓ</th><th colspan="3">INDICADORS D’AVALUACIÓ</th></tr><tr><th>AS</th><th>AN</th><th>AE</th></tr>${indRows}</table><div class="doc-section">Estratègies metodològiques i gestió d’aula</div><table class="doc-table"><tr><td>${nl(state.metodologia.estrategies)}</td></tr></table><div class="doc-section">Recursos i materials didàctics</div><table class="doc-table"><tr><td class="label">Recursos</td><td>${nl(state.recursos.recursos)}</td></tr><tr><td class="label">Materials</td><td>${nl(state.recursos.materials)}</td></tr></table><div class="doc-section">Mesures i suports d’atenció educativa inclusiva</div><table class="doc-table"><tr><td class="label">DUA</td><td>${nl(state.dua.text)}</td></tr><tr><td class="label">Universals</td><td>${nl(state.atencioDiversitat.universals)}</td></tr><tr><td class="label">Addicionals</td><td>${nl(state.atencioDiversitat.addicionals)}</td></tr><tr><td class="label">Intensives</td><td>${nl(state.atencioDiversitat.intensives)}</td></tr></table><div class="doc-section">Activitats complementàries</div><table class="doc-table"><tr><td>${nl(state.activitatsComplementaries)}</td></tr></table><div class="doc-section">Procediments d’avaluació i recuperació</div><table class="doc-table"><tr><td class="label">Instruments d’avaluació</td><td>${nl(state.avaluacio.instruments)}</td></tr><tr><td class="label">Criteris i instruments de qualificació</td><td>${nl(state.avaluacio.criterisQualificacio)}</td></tr><tr><td class="label">Recuperació trimestral</td><td>${nl(state.avaluacio.recuperacioTrimestral)}</td></tr><tr><td class="label">Recuperació del curs</td><td>${nl(state.avaluacio.recuperacioCurs)}</td></tr><tr><td class="label">Recuperació cursos anteriors</td><td>${nl(state.avaluacio.recuperacioAnteriors)}</td></tr></table></div>`;
}
function prepareBlockPrint(){
  applyDocOptions();
  const area=document.getElementById('printArea');
  const original=area.innerHTML;
  area.innerHTML=makeBlockPdfHtml();
  const st=document.getElementById('printOptionsStyle') || document.createElement('style');
  st.id='printOptionsStyle';
  document.head.appendChild(st);
  const density=exportDensity();
  st.textContent=`@media print{
  @page{size:297mm 210mm;margin:6mm}
  html,body{background:#fff!important;width:297mm!important;min-width:297mm!important;margin:0!important;padding:0!important;overflow:visible!important}
  .layout,.content,#preview,.document-view,#printArea{display:block!important;width:285mm!important;max-width:285mm!important;margin:0!important;padding:0!important;overflow:visible!important}
  .doc-page,.block-report{width:285mm!important;max-width:285mm!important;margin:0!important;padding:0!important;transform:none!important;zoom:1!important}
  .doc-title{font-size:12pt!important;margin:0 0 5mm!important}
  .doc-section{font-size:10pt!important;margin:5mm 0 2mm!important;break-after:avoid!important;page-break-after:avoid!important}
  .doc-table{table-layout:auto!important;width:100%!important;max-width:100%!important;margin:2mm 0!important;border-collapse:collapse!important;border:1px solid #111!important}
  .doc-table th,.doc-table td{padding:2px!important;font-size:${density.font}!important;line-height:${density.line}!important;border:1px solid #111!important;vertical-align:top!important;white-space:normal!important;word-break:normal!important;overflow-wrap:anywhere!important}
  .block-table td:first-child{width:17%!important;min-width:17%!important}
  .block-print-section{display:block!important;width:100%!important;max-width:100%!important;break-inside:avoid!important;page-break-inside:avoid!important;margin:0 0 5mm!important}
  .block-print-section h3{font-size:10pt!important;margin:3mm 0 2mm!important;break-after:avoid!important;page-break-after:avoid!important}
  tr,td,th{break-inside:avoid!important;page-break-inside:avoid!important}
}`;
  setTimeout(()=>{print(); setTimeout(()=>{area.innerHTML=original;},900);},100);
}

function preparePrint(){
  renderPreview();
  const opts=getDocOptions();
  let st=document.getElementById('printOptionsStyle');
  if(!st){st=document.createElement('style');st.id='printOptionsStyle';document.head.appendChild(st)}
  const density=exportDensity();
  st.textContent=`@media print{@page{size:A4 ${opts.orientation};margin:1.1cm}.doc-table th,.doc-table td{padding:${density.pad}!important;font-size:${density.font}!important;line-height:${density.line}!important}.doc-table{table-layout:fixed!important}tr,td,th{break-inside:avoid!important;page-break-inside:avoid!important}.sa-print-section{break-inside:avoid!important;page-break-inside:avoid!important}}`;
  setTimeout(()=>print(),100);
}


function defaultProgram(){return {
  id: uid('prog'), version:'0.6.0', updatedAt:new Date().toISOString(),
  general:{titol:'Programació anual ESO - Nou currículum', cursAcademic:'2025-2026', centre:'', departament:'Tecnologia i expressió', docents:'', etapa:'ESO', nivell:'4t ESO', grup:'', materia:'', tipusMateria:'Optativa', horesSetmanals:'', marcNormatiu:''},
  competenciesClau:[{id:uid('cc'), nom:'Competència en comunicació lingüística (CCL)', indicadors:'CCL1.\nCCL3.'},{id:uid('cc'), nom:'Competència digital (CD)', indicadors:'CD2.\nCD4.'}],
  competenciesEspecifiques:[{id:uid('ce'), codi:'CE1', text:''},{id:uid('ce'), codi:'CE2', text:''},{id:uid('ce'), codi:'CE3', text:''}],
  trimestres:[{id:'t1', nom:'1r TRI'},{id:'t2', nom:'2n TRI'},{id:'t3', nom:'3r TRI'}],
  situacions:[], indicadors:[],
  metodologia:{estrategies:''}, recursos:{recursos:'', materials:''}, activitatsComplementaries:'',
  dua:{text:''}, atencioDiversitat:{universals:'', addicionals:'', intensives:''},
  avaluacio:{instruments:'', criterisQualificacio:'', recuperacioTrimestral:'', recuperacioCurs:'', recuperacioAnteriors:''}
}}


function currentCourseProgram(){
  const prog = defaultProgram();
  prog.version = '0.4.1';
  Object.assign(prog.general, {
    titol:'Programació anual ESO - Nou currículum',
    cursAcademic:'2025-2026',
    centre:'Institut Salvador Espriu',
    departament:'Tecnologia i expressió',
    docents:'Sergio Menéndez i Isabel Marginet',
    etapa:'ESO',
    nivell:'4t ESO',
    grup:'',
    materia:'Tecnologia Aplicada',
    tipusMateria:'Optativa',
    horesSetmanals:'',
    marcNormatiu:'Programació de matèria elaborada segons el nou currículum competencial de l’ESO i adaptada a les situacions d’aprenentatge realment treballades durant el curs 2025-2026.'
  });
  prog.competenciesClau = [
    {id:uid('cc'), nom:'Competència en comunicació lingüística (CCL)', indicadors:'CCL1. S’expressa de forma oral, escrita o signada amb coherència, correcció i adequació als diferents contextos, i participa en interaccions comunicatives amb actitud cooperativa i respectuosa.\nCCL3. Localitza, selecciona i contrasta informació procedent de diferents fonts i la integra per comunicar-la amb un punt de vista creatiu, crític i respectuós amb la propietat intel·lectual.'},
    {id:uid('cc'), nom:'Competència matemàtica i competència en ciència, tecnologia i enginyeria (MCTE)', indicadors:'CMCCTE3. Planteja i desenvolupa projectes dissenyant, fabricant i avaluant prototips o models per crear solucions a una necessitat o problema de manera creativa, cooperativa i sostenible.'},
    {id:uid('cc'), nom:'Competència digital (CD)', indicadors:'CD2. Gestiona i utilitza el seu entorn personal digital d’aprenentatge per construir coneixement i crear continguts digitals.\nCD4. Identifica riscos i adopta mesures en l’ús de les tecnologies digitals per protegir dispositius, dades personals, salut i medi ambient.'},
    {id:uid('cc'), nom:'Competència personal, social i d’aprendre a aprendre (CPSAA)', indicadors:'CPSAA4. Fa autoavaluacions sobre el seu procés d’aprenentatge i contrasta la informació per obtenir conclusions rellevants.\nCPSAA5. Planifica objectius a mitjà termini i desenvolupa processos de retroalimentació per aprendre dels errors.'},
    {id:uid('cc'), nom:'Competència emprenedora (CE)', indicadors:'CE1. Analitza necessitats i oportunitats i afronta reptes amb sentit crític, valorant-ne la sostenibilitat i l’impacte en l’entorn.'},
    {id:uid('cc'), nom:'Competència ciutadana (CC)', indicadors:'CC4. Interpreta les relacions d’interdependència i ecodependència i adopta un estil de vida sostenible i responsable.'}
  ];
  prog.competenciesEspecifiques = [
    {id:uid('ce'), codi:'CE1', text:'Idear i planificar solucions tecnològiques a partir de l’anàlisi de necessitats o reptes propers, proposant respostes creatives, viables, segures i sostenibles.'},
    {id:uid('ce'), codi:'CE2', text:'Desenvolupar projectes tecnològics aplicant processos de disseny, planificació, construcció, prova, millora i avaluació de prototips.'},
    {id:uid('ce'), codi:'CE3', text:'Utilitzar materials, eines, components, instruments de mesura, operadors i mecanismes adequats segons la funció, les propietats i l’impacte ambiental.'},
    {id:uid('ce'), codi:'CE4', text:'Representar i comunicar idees, processos i solucions tecnològiques mitjançant esbossos, croquis, plànols, esquemes, càlculs, documents escrits i vocabulari tècnic.'},
    {id:uid('ce'), codi:'CE5', text:'Utilitzar eines digitals, simuladors i llenguatges digitals bàsics per crear, representar, comprovar, documentar i compartir projectes tecnològics.'},
    {id:uid('ce'), codi:'CE6', text:'Valorar la contribució de la tecnologia a la sostenibilitat, l’estalvi de recursos, la seguretat, l’eficiència energètica i la cura de l’entorn.'}
  ];
  const T1='t1',T2='t2',T3='t3';
  prog.situacions = [
    {id:uid('sa'), trimestre:T1, titol:'SA1. Materials, sostenibilitat i consum responsable', durada:'1r trimestre',
      descripcio:'L’alumnat treballa les propietats dels materials i reflexiona sobre la importància de seleccionar-los tenint en compte criteris tècnics, econòmics i ambientals. Aquesta situació serveix de base per aplicar criteris de sostenibilitat en els projectes del trimestre.',
      repte:'Com podem triar materials adequats per construir productes tecnològics que siguin funcionals, sostenibles i respectuosos amb l’entorn?',
      producteFinal:'Fitxes i activitats sobre propietats dels materials, criteris de selecció i sostenibilitat aplicats als projectes del trimestre.',
      sabers:'Anàlisi de l’impacte ambiental dels materials i dels productes tecnològics.\nValoració de l’ús de materials reciclables i de la reutilització com a estratègia de sostenibilitat.\nIdentificació de propietats dels materials: resistència, duresa, conductivitat, durabilitat, facilitat de treball, cost, disponibilitat, biodegradabilitat, oxidació, corrosió i reciclabilitat.\nSelecció de materials segons criteris físics, econòmics, funcionals, estètics i ambientals.\nReflexió sobre l’estalvi de recursos, la reducció de residus i el consum responsable.',
      competencies:'CE1\nCE3\nCE6',
      criteris:'1.1. Identificar una necessitat o repte tecnològic i proposar una solució planificada, creativa, viable i vinculada a l’entorn proper.\n3.1. Seleccionar materials i recursos tecnològics en funció de les seves propietats, disponibilitat, cost, facilitat d’ús, durabilitat i impacte ambiental.\n6.1. Aplicar criteris de sostenibilitat, reutilització i consum responsable en la presa de decisions tecnològiques.',
      activitats:'Fitxes de propietats dels materials.\nAnàlisi de materials segons criteris físics, econòmics, funcionals i ambientals.\nAplicació dels criteris de selecció als projectes del trimestre.',
      instruments:'Fitxes de treball.\nActivitats d’aula.\nObservació del procés.\nRevisió de respostes.', recursos:'Fitxes de materials, aula de tecnologia i exemples de materials reciclables.', dua:'Activitats guiades, suport visual, vocabulari tècnic progressiu i possibilitat d’ampliació o reforç.', observacions:''},
    {id:uid('sa'), trimestre:T1, titol:'SA2. Construïm una màquina de Rube Goldberg amb cartró i materials reciclables', durada:'1r trimestre',
      descripcio:'En el marc de la Setmana de la Ciència, l’alumnat construeix en grup una màquina de Goldberg formada per una sèrie de reaccions en cadena. El repte consisteix a dissenyar un mecanisme complex que, amb diversos passos, aconsegueixi una acció final senzilla, utilitzant cartró i materials reciclables.',
      repte:'Som capaços de dissenyar i construir una màquina que, a partir d’una acció inicial, desencadeni una seqüència de mecanismes fins a aconseguir una acció final?',
      producteFinal:'Màquina de Rube Goldberg funcional construïda amb cartró i materials reciclables, amb un mínim de cinc mecanismes i explicació del funcionament.',
      sabers:'Procés tecnològic, disseny i construcció de prototips.\nPlanificació mitjançant esbossos, esquemes i seqüències d’accions.\nConstrucció amb cartró i materials reciclables.\nÚs segur i responsable d’eines i materials de taller.\nRealització de proves, detecció d’errors i aplicació de millores.\nMecanismes simples: palanca, pla inclinat, politja, roda i eix, objectes que roden, peces que colpegen i transmissió del moviment.\nDisseny d’una seqüència lògica d’accions encadenades.\nSistema automàtic senzill sense intervenció humana directa durant el funcionament.',
      competencies:'CE1\nCE2\nCE3\nCE4\nCE6',
      criteris:'1.1. Identificar una necessitat o repte tecnològic i proposar una solució planificada, creativa, viable i vinculada a l’entorn proper.\n2.1. Planificar el desenvolupament d’un projecte tecnològic mitjançant esbossos, seqüències de treball, selecció de materials i organització del procés.\n2.2. Construir productes o prototips tecnològics utilitzant materials, eines i tècniques adequades, aplicant proves i millores durant el procés.\n4.1. Representar i comunicar solucions tecnològiques mitjançant esbossos, esquemes, explicacions orals o documents digitals.\n6.1. Aplicar criteris de sostenibilitat, reutilització i consum responsable en la presa de decisions tecnològiques.',
      activitats:'Disseny d’un esquema inicial.\nSelecció de materials reciclables.\nConstrucció dels mecanismes.\nProva de cada mecanisme per separat.\nConnexió de les accions.\nAjustos i millores.\nPresentació i explicació final.',
      instruments:'Rúbrica del projecte.\nObservació del treball en grup.\nFuncionament del prototip.\nExplicació oral del funcionament.\nAutoavaluació o coavaluació del treball en equip.', recursos:'Cartró, materials reciclables, elements de taller i material de suport de la màquina de Rube Goldberg.', dua:'Treball cooperatiu, repartiment de rols, suport visual del procés i possibilitat d’adaptar la complexitat del mecanisme.', observacions:''},
    {id:uid('sa'), trimestre:T1, titol:'SA3. Dissenyem el nostre habitatge amb Floorplanner', durada:'1r trimestre',
      descripcio:'L’alumnat mesura el seu habitatge, en fa un esbós manual amb llapis i mesures, i després el representa digitalment amb Floorplanner. El projecte inclou parets, finestres, portes, mobiliari i comprovació en 3D.',
      repte:'Podem representar digitalment un habitatge real a partir de mesures pròpies i comprovar-ne la coherència en 3D?',
      producteFinal:'Projecte de Floorplanner amb plànol 2D, visualització 3D, mobiliari i enllaç o arxiu compartit.',
      sabers:'Presa de mesures d’un habitatge o espai real.\nElaboració d’un esbós manual amb proporcions i mesures.\nRepresentació digital d’un habitatge en 2D.\nVisualització i comprovació del disseny en 3D.\nIncorporació de parets, portes, finestres, mobiliari i elements de distribució interior.\nÚs d’eines digitals en línia per crear, guardar i compartir projectes.',
      competencies:'CE4\nCE5',
      criteris:'4.1. Representar i comunicar solucions tecnològiques mitjançant esbossos, plànols, esquemes, explicacions orals o documents digitals.\n5.1. Utilitzar eines digitals per resoldre tasques de disseny, representació, documentació i compartició de projectes.',
      activitats:'Mesurar les estances de casa.\nFer un esbós en paper amb llapis i mesures.\nCrear o accedir a un projecte de Floorplanner.\nDibuixar parets, portes i finestres.\nAfegir mobiliari i detalls.\nComprovar el resultat en 3D.\nGuardar i compartir l’enllaç o arxiu.',
      instruments:'Esbós en paper.\nProjecte digital.\nVisualització 3D.\nGrau de detall.\nCoherència espacial.\nEntrega de l’enllaç o arxiu.', recursos:'Floorplanner, ordinador, connexió a Internet i fitxa o guia de treball.', dua:'Modelatge pas a pas, suport visual, possibilitat de simplificar el nivell de detall i treball amb espais propers.', observacions:''},
    {id:uid('sa'), trimestre:T2, titol:'SA4. Circuits elèctrics: de la protoboard a Tinkercad', durada:'2n trimestre',
      descripcio:'L’alumnat treballa els conceptes bàsics d’electricitat mitjançant el muntatge de circuits amb protoboard i components elèctrics. Posteriorment, reprodueix o simula els circuits amb Tinkercad per comprovar si el comportament real i el simulat coincideixen. També utilitza multímetres i resol fitxes de càlcul.',
      repte:'Podem construir un circuit real, simular-lo digitalment i comprovar que els resultats coincideixen?', producteFinal:'Fitxes de pràctiques amb circuits muntats en protoboard, simulació equivalent a Tinkercad, mesures amb multímetre i càlculs bàsics.',
      sabers:'Magnituds elèctriques bàsiques: tensió, intensitat, resistència i potència.\nAplicació bàsica de la llei d’Ohm i la llei de Watt.\nCàlcul de la intensitat i la resistència a partir de la potència i la tensió.\nIdentificació de circuits en sèrie i en paral·lel.\nMuntatge de circuits senzills amb protoboard i elements elèctrics.\nÚs del multímetre per mesurar magnituds elèctriques bàsiques.\nComparació entre el circuit real i la simulació digital.\nÚs de Tinkercad Circuits per dissenyar, provar i verificar circuits.\nVerificació experimental de resultats i detecció d’errors de muntatge o de càlcul.',
      competencies:'CE2\nCE3\nCE5',
      criteris:'2.2. Muntar circuits elèctrics senzills amb protoboard i components bàsics, aplicant normes de seguretat, comprovant-ne el funcionament i corregint possibles errors.\n3.1. Utilitzar instruments de mesura, com el multímetre, per obtenir dades bàsiques d’un circuit i interpretar-les de manera adequada.\n3.2. Aplicar la llei d’Ohm i la llei de Watt per calcular intensitat, resistència o potència en situacions elèctriques senzilles.\n5.1. Utilitzar Tinkercad Circuits per simular circuits elèctrics i comparar els resultats amb el muntatge real.',
      activitats:'Muntatge de circuits senzills amb protoboard.\nIdentificació de components.\nÚs del multímetre.\nSimulació a Tinkercad.\nComparació entre circuit real i simulat.\nCàlculs amb Ohm i Watt.\nResolució de fitxes.',
      instruments:'Fitxes de pràctiques.\nObservació del muntatge.\nComprovació del funcionament.\nSimulació a Tinkercad.\nÚs del multímetre.\nCorrecció dels càlculs.', recursos:'Protoboard, resistències, leds, cables, multímetres, ordinadors i Tinkercad Circuits.', dua:'Treball guiat, parelles o petits grups, esquemes visuals, comprovació pràctica i simulació digital com a suport.', observacions:''},
    {id:uid('sa'), trimestre:T2, titol:'SA5. Electricitat aplicada a l’habitatge', durada:'2n trimestre',
      descripcio:'L’alumnat aplica els coneixements d’electricitat bàsica a situacions domèstiques: interpretació de circuits amb bombetes i interruptors, càlcul de magnituds per estances, representació d’esquemes pràctics i funcionals, i identificació d’elements de protecció elèctrica.',
      repte:'Com podem representar, calcular i entendre els circuits elèctrics bàsics d’una estança o habitatge?', producteFinal:'Esquemes de circuits, plànol en planta d’una estança, càlculs de magnituds elèctriques i fitxes d’avaluació.',
      sabers:'Representació de circuits pràctics i funcionals.\nInterpretació de circuits elèctrics domèstics amb fase, neutre, interruptors, bombetes i caixes de connexió.\nIdentificació d’elements de protecció elèctrica: ICP, ID i PIA.\nFunció dels dispositius de protecció en una instal·lació domèstica.\nRelació entre seguretat, consum i ús responsable de l’energia.\nRepresentació d’una estança amb llums i interruptors en planta.\nDiferenciació entre sensors, controladors i actuadors.\nPrincipis bàsics de l’arquitectura bioclimàtica: orientació, entorn i clima.\nIdentificació de mecanismes hidràulics habituals en l’habitatge.',
      competencies:'CE1\nCE4\nCE6',
      criteris:'2.1. Representar circuits elèctrics senzills mitjançant esquemes pràctics, funcionals o plànols en planta, utilitzant una simbologia adequada i diferenciant-ne els elements principals.\n4.1. Explicar el funcionament d’un circuit o instal·lació elèctrica domèstica utilitzant vocabulari tècnic bàsic: fase, neutre, interruptor, bombeta, caixa de connexió, ICP, ID i PIA.\n6.1. Identificar elements de seguretat, automatització i eficiència en l’habitatge, valorant-ne la funció i la importància en l’ús responsable de la tecnologia.',
      activitats:'Dibuixar un circuit pràctic amb bombetes, interruptor, caixa de connexió, fase i neutre.\nDibuixar el circuit funcional en sèrie o paral·lel.\nSituar llums i interruptors en un plànol en planta.\nCalcular intensitat i resistència per estances.\nDefinir ICP, ID i PIA.\nIdentificar sensors, controladors i actuadors.\nRelacionar habitatge, seguretat, consum i bioclimatisme.',
      instruments:'Examen.\nFitxes.\nEsquemes.\nCàlculs.\nDefinicions tècniques.\nActivitats d’aplicació.', recursos:'Fitxes, esquemes, examen, aula i material de suport de circuits domèstics.', dua:'Problemes contextualitzats, models d’esquema, resolució pas a pas, suport en fórmules i adaptació de l’exigència gràfica.', observacions:''},
    {id:uid('sa'), trimestre:T3, titol:'SA6. Electrònica digital bàsica: binari, decimal, BCD i hexadecimal', durada:'3r trimestre',
      descripcio:'L’alumnat treballa els fonaments dels llenguatges digitals a partir d’activitats i fitxes. Es practiquen conversions entre decimal i binari, conversió de binari a decimal, introducció al codi BCD, coneixement bàsic de l’hexadecimal i operacions senzilles amb nombres binaris.',
      repte:'Com representen la informació els sistemes digitals i com podem passar d’un sistema numèric a un altre?', producteFinal:'Fitxes de treball i examen amb conversions decimal-binari, binari-decimal, codi BCD, coneixement de l’hexadecimal i operacions senzilles amb binaris.',
      sabers:'Identificació dels principals llenguatges digitals i les seves característiques bàsiques.\nComprensió del sistema binari com a llenguatge fonamental dels sistemes digitals.\nConversió de nombres decimals a binari seguint el procediment treballat a classe.\nConversió de nombres binaris a decimal.\nIntroducció al codi BCD i relació entre decimal, binari i representació codificada.\nConeixement inicial del sistema hexadecimal i la seva relació amb els llenguatges digitals.\nRealització d’operacions senzilles amb nombres binaris i comprovació decimal.\nÚs de fitxes i activitats guiades per consolidar els procediments.',
      competencies:'CE5',
      criteris:'5.1. Convertir nombres entre decimal i binari, interpretar el codi BCD i conèixer la funció del sistema hexadecimal en l’electrònica digital.\n5.2. Realitzar operacions senzilles amb nombres binaris i comprovar-ne el resultat mitjançant la conversió decimal.',
      activitats:'Definir llenguatges digitals.\nConvertir nombres decimals a binari.\nConvertir nombres binaris a decimal.\nIntroduir el codi BCD.\nConèixer l’hexadecimal.\nFer sumes i restes senzilles amb binaris i comprovar-les en decimal.',
      instruments:'Fitxes.\nActivitats guiades.\nExamen escrit.', recursos:'Fitxes de treball, exercicis, pissarra i examen de 3r trimestre.', dua:'Procediments pas a pas, exemples resolts, activitats graduades i comprovació amb el sistema decimal.', observacions:''},
    {id:uid('sa'), trimestre:T3, titol:'SA7. Construïm un autòmat simple amb cartró', durada:'3r trimestre',
      descripcio:'L’alumnat construeix un autòmat simple amb cartró seguint unes pautes de muntatge i unes normes clares de documentació. El projecte permet aplicar el procés tecnològic complet: identificar la necessitat, buscar informació, generar idees, construir, provar, ajustar i avaluar.',
      repte:'Podem construir un autòmat funcional amb cartró i explicar tècnicament com el mecanisme transforma el moviment?', producteFinal:'Autòmat simple construït amb cartró i document manual del projecte amb portada, índex, anàlisi de la necessitat, recerca, esbossos, croquis, plànol, muntatge, avaluació i anàlisi del moviment.',
      sabers:'Aplicació de les fases del procés tecnològic: descripció i anàlisi de la necessitat, recerca d’informació, generació i selecció d’idees, execució i avaluació.\nConstrucció d’un objecte tecnològic amb cartró i peces simples.\nInterpretació de pautes de muntatge, mesures i elements constructius.\nÚs de dibuix tècnic: esbós, croquis i plànol.\nIdentificació de les parts principals de l’autòmat: base, parets, eix, lleva, seguidor, tija, taps, sostre i manovella.\nAnàlisi del moviment: transformació del gir de la manovella en moviment vertical de la tija mitjançant la lleva.\nMuntatge, ajust, prova i millora del mecanisme.\nElaboració d’un document manual del projecte amb ordre, netedat, vocabulari tècnic i explicació del procés.\nComunicació del procés mitjançant document escrit i, si escau, vídeo breu del muntatge.',
      competencies:'CE1\nCE2\nCE3\nCE4\nCE6',
      criteris:'1.1. Analitzar una necessitat o repte tecnològic i planificar una solució coherent amb les condicions establertes.\n2.1. Aplicar les fases del procés tecnològic en el desenvolupament d’un projecte: anàlisi, recerca, ideació, execució i avaluació.\n2.2. Construir un objecte tecnològic senzill utilitzant materials, peces i unions adequades, seguint pautes de muntatge i aplicant millores durant el procés.\n3.1. Identificar i explicar el funcionament de mecanismes simples, especialment la transformació del moviment circular en moviment lineal o vertical.\n4.1. Representar un projecte tecnològic mitjançant esbossos, croquis, plànols i documentació ordenada, clara i coherent amb l’objecte construït.\n6.1. Avaluar el funcionament d’un projecte tecnològic, utilitzant vocabulari tècnic adequat i identificant punts forts, dificultats i possibles millores.',
      activitats:'Analitzar el repte.\nBuscar exemples.\nFer esbós, croquis i plànol.\nConstruir l’estructura.\nMuntar l’eix i la lleva.\nInserir tija i seguidor.\nAjustar el moviment.\nProvar el mecanisme.\nElaborar el document del projecte.\nPreparar vídeo si escau.',
      instruments:'Document manual del procés tecnològic.\nAutòmat construït.\nObservació del taller.\nAnàlisi del moviment.\nPresentació ordenada.\nPossible vídeo del procés.', recursos:'Cartró, eix, lleva, seguidor, tija, taps, silicona, guia visual de muntatge, pautes del document i rúbriques.', dua:'Guia visual de muntatge, fases clarament pautades, vocabulari tècnic de suport, possibilitat de documentar amb dibuixos i explicacions breus.', observacions:''}
  ];
  prog.indicadors = [
    {id:uid('ind'), criteri:'3.1. Seleccionar materials i recursos tecnològics en funció de les seves propietats, disponibilitat, cost, facilitat d’ús, durabilitat i impacte ambiental.', AS:'Identifica propietats bàsiques dels materials i les relaciona amb usos senzills.', AN:'Selecciona materials de manera raonada segons propietats i finalitat del projecte.', AE:'Justifica amb criteris tècnics, econòmics i ambientals la selecció de materials i proposa alternatives sostenibles.'},
    {id:uid('ind'), criteri:'2.2. Construir productes o prototips tecnològics utilitzant materials, eines i tècniques adequades, aplicant proves i millores durant el procés.', AS:'Construeix el prototip amb ajuda i aconsegueix un funcionament parcial o bàsic.', AN:'Construeix un prototip funcional, corregeix errors habituals i aplica millores.', AE:'Construeix un prototip funcional, net i sòlid, amb ajustos ben resolts i justificació de les millores.'},
    {id:uid('ind'), criteri:'5.1. Utilitzar eines digitals per resoldre tasques de disseny, representació, documentació i compartició de projectes.', AS:'Utilitza l’eina digital amb suport i crea una representació bàsica.', AN:'Utilitza l’eina digital correctament, guarda i comparteix el projecte amb una representació coherent.', AE:'Utilitza l’eina digital amb autonomia, detall i precisió, i presenta un projecte complet i ben compartit.'},
    {id:uid('ind'), criteri:'2.1. Representar circuits elèctrics senzills mitjançant esquemes pràctics, funcionals o plànols en planta, utilitzant una simbologia adequada.', AS:'Dibuixa els esquemes principals, però pot presentar algun error de simbologia o distribució.', AN:'Dibuixa els esquemes correctament, amb simbologia adequada i distribució clara.', AE:'Dibuixa els esquemes amb molta claredat, precisió tècnica i sense errors conceptuals.'},
    {id:uid('ind'), criteri:'3.2. Aplicar la llei d’Ohm i la llei de Watt per calcular intensitat, resistència o potència en situacions elèctriques senzilles.', AS:'Aplica les dues lleis, però comet alguns errors de càlcul o d’unitats.', AN:'Calcula correctament la majoria de situacions i utilitza les unitats adequades.', AE:'Realitza tots els càlculs de manera correcta, ordenada i justificada, amb fórmules i unitats adequades.'},
    {id:uid('ind'), criteri:'3.1. Utilitzar instruments de mesura, com el multímetre, per obtenir dades bàsiques d’un circuit.', AS:'Utilitza el multímetre amb ajuda i identifica algunes magnituds bàsiques.', AN:'Utilitza el multímetre correctament i interpreta les dades obtingudes.', AE:'Utilitza el multímetre amb seguretat i autonomia, selecciona l’escala adequada i relaciona mesures amb càlculs.'},
    {id:uid('ind'), criteri:'5.1. Convertir nombres entre decimal i binari, interpretar el codi BCD i conèixer la funció del sistema hexadecimal.', AS:'Realitza conversions senzilles amb alguns errors i reconeix de manera bàsica el BCD o l’hexadecimal.', AN:'Realitza correctament la majoria de conversions, mostra el procediment i entén la relació entre decimal, binari i BCD.', AE:'Realitza les conversions de manera correcta, ordenada i justificada, interpreta el BCD i explica la utilitat del binari i l’hexadecimal.'},
    {id:uid('ind'), criteri:'5.2. Realitzar operacions senzilles amb nombres binaris i comprovar-ne el resultat mitjançant la conversió decimal.', AS:'Fa algunes operacions binàries senzilles, però pot cometre errors en el càlcul o la comprovació.', AN:'Resol correctament la majoria d’operacions binàries i en comprova el resultat en decimal.', AE:'Resol totes les operacions amb precisió, mostra el procediment complet i comprova correctament els resultats.'},
    {id:uid('ind'), criteri:'2.1. Aplicar les fases del procés tecnològic en el desenvolupament d’un projecte.', AS:'Recull algunes fases del procés tecnològic, però de manera incompleta o poc connectada amb el projecte.', AN:'Documenta les fases principals i les relaciona amb el projecte realitzat.', AE:'Documenta amb detall totes les fases i les connecta amb decisions, dificultats i millores.'},
    {id:uid('ind'), criteri:'3.1. Identificar i explicar el funcionament de mecanismes simples, especialment la transformació del moviment circular en moviment vertical.', AS:'Explica el funcionament de manera general, amb poca precisió tècnica.', AN:'Explica com la lleva transforma el gir de la manovella en moviment vertical de la tija amb vocabulari bàsic.', AE:'Explica amb precisió el mecanisme utilitzant correctament eix, lleva, seguidor, tija, taps i manovella.'}
  ];
  prog.metodologia.estrategies = 'La matèria es desenvolupa amb una metodologia competencial, manipulativa i aplicada. Es combinen activitats guiades, fitxes, treball al taller, pràctiques amb materials i components reals, ús d’eines digitals, simulació, disseny, construcció de prototips, documentació del procés i avaluació del producte final.\n\nEs fomenta el treball cooperatiu, la resolució de problemes, la prova i millora dels prototips, la comunicació tècnica i la relació entre coneixements teòrics i aplicacions reals. Les activitats parteixen de situacions properes a l’alumnat: materials i sostenibilitat, habitatge, circuits elèctrics, eines digitals, electrònica digital i mecanismes.';
  prog.recursos.recursos = 'Aula/taller de tecnologia, ordinadors, Floorplanner, Tinkercad Circuits, entorn virtual d’aprenentatge, fitxes de treball, guies de muntatge, rúbriques, models d’examen, material de suport visual i recursos digitals.';
  prog.recursos.materials = 'Cartró, materials reciclables, eines i materials de taller, protoboards, cables, leds, resistències, interruptors, multímetres, elements per a circuits senzills, peces per a l’autòmat, taps, eix, tija, silicona i altres materials necessaris per als projectes.';
  prog.dua.text = 'Es proporcionen instruccions pautades, models visuals, exemples resolts, rúbriques, treball cooperatiu, activitats graduades, suport en vocabulari tècnic i possibilitat d’adaptar el nivell de complexitat dels prototips o documents segons les necessitats de l’alumnat.';
  prog.atencioDiversitat.universals = 'Activitats de reforç i ampliació dins el grup, treball cooperatiu, explicacions pas a pas, suport visual, exemples pràctics, models de resposta i flexibilitat en la manera de documentar alguns processos.';
  prog.atencioDiversitat.addicionals = 'Adaptació de tasques, simplificació de processos, suport en la comprensió de vocabulari tècnic, proves o activitats més visuals i possibilitat d’acompanyament més guiat en les pràctiques.';
  prog.atencioDiversitat.intensives = 'Aplicació de mesures específiques segons els plans individualitzats, adaptació d’instruments d’avaluació, priorització de l’assoliment competencial i valoració del progrés individual, l’esforç i la participació.';
  prog.activitatsComplementaries = 'Participació en activitats vinculades a la Setmana de la Ciència mitjançant la construcció de la màquina de Rube Goldberg.';
  prog.avaluacio.instruments = 'Fitxes de treball, activitats guiades, observació del taller, rúbriques, projectes construïts, simulacions digitals, documents manuals, esquemes, càlculs, ús d’instruments de mesura, presentacions o explicacions orals, vídeos de procés si escau i proves escrites.';
  prog.avaluacio.criterisQualificacio = 'L’avaluació és contínua i competencial. Cada situació d’aprenentatge disposa d’instruments d’avaluació vinculats als criteris treballats. Les rúbriques i activitats indiquen la gradació en nivells d’assoliment: 1 = No assolit (NA), 2 = Assolit satisfactòriament (AS), 3 = Assolit notablement (AN), 4 = Assolit excel·lentment (AE).';
  prog.avaluacio.recuperacioTrimestral = 'Caldrà lliurar o recuperar les activitats, fitxes, pràctiques o projectes no assolits que el professorat consideri imprescindibles. En tractar-se d’una avaluació contínua, es valorarà el progrés al llarg del curs.';
  prog.avaluacio.recuperacioCurs = 'Caldrà presentar les activitats o evidències essencials no assolides i, si escau, realitzar una prova o tasca de recuperació vinculada als sabers i competències treballats durant el curs.';
  prog.avaluacio.recuperacioAnteriors = 'Es concretarà segons els acords de departament i la situació individual de l’alumnat amb matèries pendents.';
  return prog;
}

function seed4ESO(){
  state = currentCourseProgram();
  renderAll();
  saveCurrent();
  showSection('preview');
  alert('S’ha carregat la programació 4t ESO Tecnologia Aplicada 2025-2026, preparada per revisar i exportar a PDF.');
}

function createBlankTechCourse(){
  const key=document.getElementById('blankTechTemplate')?.value || '4o';
  const teacher=document.getElementById('blankTechTeachers')?.value || '';
  const c=(getCurriculumBank()[key] || CURRICULUM_COURSES[key] || CURRICULUM_COURSES['4o']);
  state=defaultProgram();
  Object.assign(state.general,{etapa:c.etapa||'ESO',nivell:c.nivell||'',materia:c.materia||'',tipusMateria:c.tipusMateria||'',docents:teacher,titol:'Programació anual ESO - Nou currículum'});
  state.competenciesEspecifiques=(c.competencies||[]).map(x=>({id:uid('ce'),codi:x.codi,text:x.text}));
  renderAll(); showSection('general'); alert('S’ha creat una plantilla buida amb el banc curricular del curs seleccionat. Ara pots importar o crear SA.');
}

function copySupportSectionsFrom(full, overwrite=false){
  const should=(v)=>overwrite || !String(v||'').trim();
  state.metodologia = state.metodologia || {estrategies:''};
  state.recursos = state.recursos || {recursos:'', materials:''};
  state.dua = state.dua || {text:''};
  state.atencioDiversitat = state.atencioDiversitat || {universals:'', addicionals:'', intensives:''};
  state.avaluacio = state.avaluacio || {instruments:'', criterisQualificacio:'', recuperacioTrimestral:'', recuperacioCurs:'', recuperacioAnteriors:''};
  if(should(state.metodologia.estrategies)) state.metodologia.estrategies = full.metodologia?.estrategies || '';
  if(should(state.recursos.recursos)) state.recursos.recursos = full.recursos?.recursos || '';
  if(should(state.recursos.materials)) state.recursos.materials = full.recursos?.materials || '';
  if(should(state.activitatsComplementaries)) state.activitatsComplementaries = full.activitatsComplementaries || '';
  if(should(state.dua.text)) state.dua.text = full.dua?.text || '';
  if(should(state.atencioDiversitat.universals)) state.atencioDiversitat.universals = full.atencioDiversitat?.universals || '';
  if(should(state.atencioDiversitat.addicionals)) state.atencioDiversitat.addicionals = full.atencioDiversitat?.addicionals || '';
  if(should(state.atencioDiversitat.intensives)) state.atencioDiversitat.intensives = full.atencioDiversitat?.intensives || '';
  if(should(state.avaluacio.instruments)) state.avaluacio.instruments = full.avaluacio?.instruments || '';
  if(should(state.avaluacio.criterisQualificacio)) state.avaluacio.criterisQualificacio = full.avaluacio?.criterisQualificacio || '';
  if(should(state.avaluacio.recuperacioTrimestral)) state.avaluacio.recuperacioTrimestral = full.avaluacio?.recuperacioTrimestral || '';
  if(should(state.avaluacio.recuperacioCurs)) state.avaluacio.recuperacioCurs = full.avaluacio?.recuperacioCurs || '';
  if(should(state.avaluacio.recuperacioAnteriors)) state.avaluacio.recuperacioAnteriors = full.avaluacio?.recuperacioAnteriors || '';
}

function loadCourseSAOnly(){
  const full = currentCourseProgram();
  state.trimestres = JSON.parse(JSON.stringify(full.trimestres));
  state.situacions = JSON.parse(JSON.stringify(full.situacions));
  state.indicadors = JSON.parse(JSON.stringify(full.indicadors));
  state.competenciesEspecifiques = JSON.parse(JSON.stringify(full.competenciesEspecifiques));
  copySupportSectionsFrom(full, false);
  renderAll();
  showSection('sa');
  alert('S’han carregat les SA, sabers, CE, CA i indicadors. També s’han omplert metodologia, recursos, inclusió i avaluació si estaven buits. Les dades generals actuals es mantenen.');
}

function fillMethodology4ESO(overwrite=false){
  copySupportSectionsFrom(currentCourseProgram(), overwrite);
  renderAll();
  showSection('methodology');
  alert(overwrite?'S’ha substituït la metodologia, recursos i activitats complementàries.':'S’ha omplert la metodologia, recursos i activitats complementàries que estaven buits.');
}

function fillInclusion4ESO(overwrite=false){
  copySupportSectionsFrom(currentCourseProgram(), overwrite);
  renderAll();
  showSection('inclusion');
  alert(overwrite?'S’han substituït DUA i mesures inclusives.':'S’han omplert DUA i mesures inclusives si estaven buides.');
}

function buildSupportFromSA(){
  const saCount=state.situacions.length;
  const instruments=[...new Set(state.situacions.flatMap(sa=>lines(sa.instruments)))].slice(0,18);
  const recursos=[...new Set(state.situacions.flatMap(sa=>lines(sa.recursos)))].slice(0,18);
  const duas=[...new Set(state.situacions.flatMap(sa=>lines(sa.dua)))].slice(0,18);
  state.metodologia = state.metodologia || {};
  state.recursos = state.recursos || {};
  state.dua = state.dua || {};
  state.atencioDiversitat = state.atencioDiversitat || {};
  state.avaluacio = state.avaluacio || {};
  if(saCount){
    state.metodologia.estrategies = `La matèria es desenvolupa a partir de ${saCount} situacions d’aprenentatge vinculades a projectes, pràctiques, fitxes, simulacions digitals, construcció de prototips i documentació del procés tecnològic. Es combina el treball individual amb el treball cooperatiu, l’activitat manipulativa al taller, la resolució de problemes, l’ús d’eines digitals i la comunicació tècnica dels resultats.\n\nLes situacions d’aprenentatge permeten relacionar els sabers tecnològics amb contextos propers a l’alumnat i afavoreixen la prova, l’error, la millora i l’avaluació competencial.`;
    state.recursos.recursos = recursos.join('\n') || state.recursos.recursos || 'Fitxes de treball, recursos visuals, eines digitals, simuladors, ordinadors, material de taller i documents de suport.';
    state.dua.text = duas.join('\n') || state.dua.text || 'Instruccions pautades, suports visuals, exemples resolts, activitats graduades, treball cooperatiu i flexibilitat en la manera de documentar o presentar alguns processos.';
    state.avaluacio.instruments = instruments.join('\n') || state.avaluacio.instruments;
  }
  renderAll();
  showSection('methodology');
  alert('S’ha generat una proposta de metodologia, recursos, DUA i instruments a partir de les SA actuals.');
}


function saToExport(sa){
  return {
    type:'situacio-aprenentatge',
    version:'1.0',
    exportedAt:new Date().toISOString(),
    titol:sa.titol||'',
    trimestre:(state.trimestres.find(t=>t.id===sa.trimestre)?.nom)||sa.trimestre||'',
    durada:sa.durada||'',
    context:sa.descripcio||'',
    descripcio:sa.descripcio||'',
    repte:sa.repte||'',
    producteFinal:sa.producteFinal||'',
    sabers:lines(sa.sabers||''),
    competenciesEspecifiques:lines(sa.competencies||''),
    criterisAvaluacio:lines(sa.criteris||''),
    activitats:lines(sa.activitats||''),
    instruments:lines(sa.instruments||''),
    recursos:lines(sa.recursos||''),
    dua:lines(sa.dua||''),
    observacions:sa.observacions||''
  };
}
function exportSA(i){
  const sa=state.situacions[i]; if(!sa)return;
  download((sa.titol||'situacio_aprenentatge').replace(/[^a-z0-9à-ÿ\-_ ]/gi,'_')+'.json', JSON.stringify(saToExport(sa),null,2));
}
function exportAllSA(){
  const data={type:'paquet-situacions-aprenentatge',version:'1.0',app:'Programació LOMLOE',exportedAt:new Date().toISOString(),situacions:state.situacions.map(saToExport)};
  download('situacions_aprenentatge_programacio_lomloe.json', JSON.stringify(data,null,2));
}
function listToText(value){
  if(Array.isArray(value)) return value.map(v=>typeof v==='string'?v:(v.codi?`${v.codi}. ${v.text||''}`:(v.text||JSON.stringify(v)))).filter(Boolean).join('\n');
  return value||'';
}
function ensureTrimester(name){
  const raw=(name||'').toString().trim();
  if(!raw) return state.trimestres[0]?.id || 't1';
  const found=state.trimestres.find(t=>t.id===raw || (t.nom||'').toLowerCase()===raw.toLowerCase());
  if(found) return found.id;
  const id=uid('tri'); state.trimestres.push({id,nom:raw}); return id;
}
function normalizeSA(obj){
  const trimestre=ensureTrimester(obj.trimestre||obj.temporitzacio||obj.temp||obj.blocTemporal||obj.bloc||'');
  return {
    id:uid('sa'),
    titol:obj.titol||obj.title||obj.nom||obj.situacio||'SA importada',
    trimestre,
    durada:obj.durada||obj.sessions||obj.temporalitzacio||'',
    descripcio:obj.context||obj.descripcio||obj.descripció||obj.description||'',
    repte:obj.repte||obj.preguntaGuia||obj.pregunta_guia||'',
    producteFinal:obj.producteFinal||obj.producte_final||obj.evidencia||'',
    sabers:listToText(obj.sabers),
    competencies:listToText(obj.competenciesEspecifiques||obj.competènciesEspecífiques||obj.competencies||obj.ce),
    criteris:listToText(obj.criterisAvaluacio||obj.criterisAvaluació||obj.criteris||obj.ca),
    activitats:listToText(obj.activitats||obj.seqüencia||obj.sequencia||obj.tasques),
    instruments:listToText(obj.instruments||obj.instrumentsAvaluacio||obj.instrumentsAvaluació),
    recursos:listToText(obj.recursos||obj.materials),
    dua:listToText(obj.dua||obj.inclusio||obj.inclusió||obj.mesuresInclusives),
    observacions:obj.observacions||obj.notes||''
  };
}
function extractSAObjects(data){
  if(Array.isArray(data)) return data;
  if(data.type==='situacio-aprenentatge') return [data];
  if(Array.isArray(data.situacions)) return data.situacions;
  if(Array.isArray(data.situacionsAprenentatge)) return data.situacionsAprenentatge;
  if(Array.isArray(data.items)) return data.items;
  return [data];
}
async function importSAJsonFiles(files){
  let count=0;
  for(const f of files){
    try{
      const data=JSON.parse(await f.text());
      extractSAObjects(data).forEach(obj=>{state.situacions.push(normalizeSA(obj));count++});
    }catch(err){ alert('No he pogut importar '+f.name+'. Revisa que sigui un JSON vàlid.'); }
  }
  renderAll(); showSection('sa'); alert(`S'han importat ${count} SA.`);
}
function parseSAFromText(text){
  const map={
    titol:['títol','titol','title','nom'],
    trimestre:['trimestre','temp','temporalització','temporitzacio','bloc temporal'],
    durada:['durada','sessions'],
    descripcio:['context','descripció','descripcio','finalitat'],
    repte:['repte','pregunta guia','pregunta'],
    producteFinal:['producte final','producte','evidència','evidencia'],
    sabers:['sabers','continguts'],
    competencies:['competències específiques','competencies especifiques','ce','competències'],
    criteris:['criteris d’avaluació','criteris d\'avaluació','criteris avaluacio','criteris','ca'],
    activitats:['activitats','tasques','seqüència','sequencia'],
    instruments:['instruments d’avaluació','instruments avaluacio','instruments'],
    recursos:['recursos','materials'],
    dua:['dua','inclusió','inclusio','mesures inclusives'],
    observacions:['observacions','notes']
  };
  const out={}; let current='descripcio'; out[current]='';
  text.split(/\r?\n/).forEach(line=>{
    const m=line.match(/^\s*([^:]{2,45})\s*:\s*(.*)$/);
    if(m){
      const head=m[1].trim().toLowerCase();
      const key=Object.keys(map).find(k=>map[k].includes(head));
      if(key){current=key; out[current]=(out[current]?out[current]+'\n':'')+m[2].trim(); return;}
    }
    out[current]=(out[current]?out[current]+'\n':'')+line.trim();
  });
  if(!out.titol){out.titol=lines(text)[0]||'SA importada des de text';}
  return normalizeSA(out);
}
function pasteSAFromText(){
  const text=prompt('Enganxa aquí el text de la SA exportada o copiada de DocentKit. Si té apartats com TÍTOL:, REPTE:, SABERS:, CE: i CA:, els repartirà automàticament.');
  if(!text || !text.trim())return;
  state.situacions.push(parseSAFromText(text.trim()));
  renderAll(); showSection('sa');
}

function library(){try{return JSON.parse(localStorage.getItem(STORE_KEY)||'[]')}catch{return []}}
function setLibrary(items){localStorage.setItem(STORE_KEY,JSON.stringify(items))}
function saveCurrent(){state.updatedAt=new Date().toISOString(); const items=library(); const i=items.findIndex(x=>x.id===state.id); if(i>=0) items[i]=state; else items.unshift(state); setLibrary(items); renderLibrary();}
function loadProgram(id){const item=library().find(x=>x.id===id); if(item){state=item; renderAll(); showSection('general')}}
function deleteProgram(id){if(!confirm('Vols eliminar aquesta programació de la biblioteca local?'))return; setLibrary(library().filter(x=>x.id!==id)); if(state.id===id)state=defaultProgram(); renderAll();}
function duplicateProgram(id){const item=library().find(x=>x.id===id); if(!item)return; state=JSON.parse(JSON.stringify(item)); state.id=uid('prog'); state.general.titol=(state.general.titol||'Programació')+' · còpia'; saveCurrent(); renderAll(); showSection('general')}

function bindGeneral(){document.querySelectorAll('[id^="general."]').forEach(el=>{const k=el.id.split('.')[1]; el.value=state.general[k]||''; el.oninput=()=>{state.general[k]=el.value; autoPreview()}});}
function bindText(id,path){const el=document.getElementById(id); if(!el)return; const parts=path.split('.'); let obj=state; parts.slice(0,-1).forEach(p=>obj=obj[p]); const key=parts.at(-1); el.value=obj[key]||''; el.oninput=()=>{obj[key]=el.value; autoPreview()}}
function renderLibrary(){const root=document.getElementById('libraryList'); const items=library(); root.innerHTML = items.length?items.map(x=>`<div class="card"><h3>${escapeHtml(x.general?.materia||'Programació sense matèria')}</h3><p><strong>${escapeHtml(x.general?.nivell||'')}</strong> · ${escapeHtml(x.general?.tipusMateria||'')}</p><p class="hint">${escapeHtml(x.general?.cursAcademic||'')} · ${new Date(x.updatedAt||Date.now()).toLocaleString('ca-ES')}</p><div class="row-actions"><button class="primary" onclick="loadProgram('${x.id}')">Obre</button><button class="secondary" onclick="duplicateProgram('${x.id}')">Duplica</button><button class="danger" onclick="deleteProgram('${x.id}')">Elimina</button></div></div>`).join(''):'<div class="card"><h3>Encara no hi ha programacions</h3><p>Crea una programació nova o una base de 4t ESO optativa.</p></div>'}

function renderCompetencies(){
 const kc=document.getElementById('keyCompetences'); kc.innerHTML=state.competenciesClau.map((c,i)=>`<div class="item-card"><label>Competència clau<input value="${escapeHtml(c.nom)}" oninput="state.competenciesClau[${i}].nom=this.value;autoPreview()"></label><label>Indicadors<textarea rows="4" oninput="state.competenciesClau[${i}].indicadors=this.value;autoPreview()">${escapeHtml(c.indicadors)}</textarea></label><button class="danger" onclick="state.competenciesClau.splice(${i},1);renderCompetencies();autoPreview()">Elimina</button></div>`).join('');
 const sc=document.getElementById('specificCompetences'); sc.innerHTML=state.competenciesEspecifiques.map((c,i)=>`<div class="item-card"><div class="mini-grid"><label>Codi<input value="${escapeHtml(c.codi)}" oninput="state.competenciesEspecifiques[${i}].codi=this.value;autoPreview()"></label><label style="grid-column:span 2">Text<input value="${escapeHtml(c.text)}" oninput="state.competenciesEspecifiques[${i}].text=this.value;autoPreview()"></label></div><button class="danger" onclick="state.competenciesEspecifiques.splice(${i},1);renderCompetencies();autoPreview()">Elimina</button></div>`).join('')
}

function renderTrimesters(){document.getElementById('trimesters').innerHTML=`<h3>Trimestres o blocs temporals</h3>`+state.trimestres.map((t,i)=>`<div class="item-card"><div class="mini-grid"><label>Nom<input value="${escapeHtml(t.nom)}" oninput="state.trimestres[${i}].nom=this.value;renderSituations();autoPreview()"></label><div></div><div class="row-actions"><button class="danger" onclick="removeTrimester(${i})">Elimina</button></div></div></div>`).join('')}
function removeTrimester(i){if(state.trimestres.length<=1)return alert('Cal mantenir com a mínim un bloc temporal.'); const id=state.trimestres[i].id; state.trimestres.splice(i,1); state.situacions.forEach(sa=>{if(sa.trimestre===id)sa.trimestre=state.trimestres[0].id}); renderAll();}
function renderSituations(){
 const opts=state.trimestres.map(t=>`<option value="${t.id}">${escapeHtml(t.nom)}</option>`).join('');
 document.getElementById('situations').innerHTML=`<h3>Situacions d’aprenentatge</h3>`+ (state.situacions.length?state.situacions.map((sa,i)=>`<article class="sa-card"><header><h3>${escapeHtml(sa.titol||'SA sense títol')}</h3><div class="row-actions"><button class="secondary" onclick="exportSA(${i})">Exporta JSON</button><button class="danger" onclick="state.situacions.splice(${i},1);renderSituations();autoPreview()">Elimina</button></div></header><div class="form-grid"><label>Títol<input value="${escapeHtml(sa.titol)}" oninput="state.situacions[${i}].titol=this.value;autoPreview()"></label><label>Trimestre<select onchange="state.situacions[${i}].trimestre=this.value;autoPreview()">${opts}</select></label><label>Durada<input value="${escapeHtml(sa.durada)}" oninput="state.situacions[${i}].durada=this.value;autoPreview()"></label><label>Producte final<input value="${escapeHtml(sa.producteFinal)}" oninput="state.situacions[${i}].producteFinal=this.value;autoPreview()"></label></div><label>Descripció / context<textarea rows="3" oninput="state.situacions[${i}].descripcio=this.value;autoPreview()">${escapeHtml(sa.descripcio)}</textarea></label><label>Repte o pregunta guia<textarea rows="2" oninput="state.situacions[${i}].repte=this.value;autoPreview()">${escapeHtml(sa.repte)}</textarea></label><div class="form-grid"><label>Sabers associats<textarea rows="7" placeholder="Un saber per línia" oninput="state.situacions[${i}].sabers=this.value;autoPreview()">${escapeHtml(sa.sabers)}</textarea></label><label>Competències específiques<textarea rows="7" placeholder="CE1..." oninput="state.situacions[${i}].competencies=this.value;autoPreview()">${escapeHtml(sa.competencies)}</textarea></label><label>Criteris d’avaluació<textarea rows="7" placeholder="1.1..." oninput="state.situacions[${i}].criteris=this.value;autoPreview()">${escapeHtml(sa.criteris)}</textarea></label><label>Instruments d’avaluació<textarea rows="7" oninput="state.situacions[${i}].instruments=this.value;autoPreview()">${escapeHtml(sa.instruments)}</textarea></label></div><label>Activitats<textarea rows="4" oninput="state.situacions[${i}].activitats=this.value;autoPreview()">${escapeHtml(sa.activitats)}</textarea></label><div class="form-grid"><label>Recursos<textarea rows="4" oninput="state.situacions[${i}].recursos=this.value;autoPreview()">${escapeHtml(sa.recursos)}</textarea></label><label>DUA / inclusió<textarea rows="4" oninput="state.situacions[${i}].dua=this.value;autoPreview()">${escapeHtml(sa.dua)}</textarea></label></div><label>Observacions<textarea rows="2" oninput="state.situacions[${i}].observacions=this.value;autoPreview()">${escapeHtml(sa.observacions)}</textarea></label></article>`).join(''):'<div class="card"><h3>Cap SA encara</h3><p>Afegeix una SA completa. Aquesta versió està pensada perquè cada SA aporti sabers, CE i CA a la taula trimestral.</p></div>');
 state.situacions.forEach((sa,i)=>{const sel=document.querySelectorAll('#situations select')[i]; if(sel)sel.value=sa.trimestre})
}

function renderIndicators(){document.getElementById('indicatorsList').innerHTML=state.indicadors.map((it,i)=>`<div class="item-card"><label>Criteri d’avaluació<textarea rows="3" oninput="state.indicadors[${i}].criteri=this.value;autoPreview()">${escapeHtml(it.criteri)}</textarea></label><div class="form-grid"><label>AS<textarea rows="4" oninput="state.indicadors[${i}].AS=this.value;autoPreview()">${escapeHtml(it.AS)}</textarea></label><label>AN<textarea rows="4" oninput="state.indicadors[${i}].AN=this.value;autoPreview()">${escapeHtml(it.AN)}</textarea></label><label>AE<textarea rows="4" oninput="state.indicadors[${i}].AE=this.value;autoPreview()">${escapeHtml(it.AE)}</textarea></label></div><button class="danger" onclick="state.indicadors.splice(${i},1);renderIndicators();autoPreview()">Elimina</button></div>`).join('') || '<div class="card"><p>Encara no hi ha indicadors. Pots afegir-ne quan tinguis els CA definitius.</p></div>'}

function renderPreview(){applyFont();applyDocOptions();document.getElementById('printArea').innerHTML=makeDocumentHtml()}
function makeDocumentHtml(opts={}){
 const g=state.general; const rows=(arr,fn)=>arr.map(fn).join('');
 const saRows=state.situacions.map(sa=>{const tri=state.trimestres.find(t=>t.id===sa.trimestre)?.nom||''; return `<tr><td><strong>${escapeHtml(tri)}</strong></td><td>${nl(sa.sabers)}</td><td><strong>${escapeHtml(sa.titol)}</strong><br>${nl(sa.descripcio)}${sa.repte?'<br><br><strong>Repte:</strong><br>'+nl(sa.repte):''}${sa.producteFinal?'<br><br><strong>Producte final:</strong> '+escapeHtml(sa.producteFinal):''}</td><td>${nl(expandCompetenciesForDocument(sa.competencies))}</td><td>${nl(sa.criteris)}</td></tr>`}).join('') || '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
 const indRows=state.indicadors.map(it=>`<tr><td><strong>${nl(it.criteri)}</strong></td><td>${nl(it.AS)}</td><td>${nl(it.AN)}</td><td>${nl(it.AE)}</td></tr>`).join('') || '<tr><td></td><td></td><td></td><td></td></tr>';
 return `<div class="${docPageClass(opts.docsFriendly?'docs-friendly':'')}"><div class="doc-title">PROGRAMACIÓ ANUAL ESO - NOU CURRÍCULUM</div><table class="doc-table"><tr><td class="label" colspan="3">DEPARTAMENT: ${escapeHtml(g.departament)}</td><td class="label" colspan="2">DOCENT/S: ${escapeHtml(g.docents)}</td></tr><tr><td class="label" colspan="2">MATÈRIA: ${escapeHtml(g.materia)}</td><td class="label">TIPUS DE MATÈRIA: ${escapeHtml(g.tipusMateria)}</td><td class="label" colspan="2">NIVELL: ${escapeHtml(g.nivell)}</td></tr><tr><td class="label">CURS: ${escapeHtml(g.cursAcademic)}</td><td class="label" colspan="2">CENTRE: ${escapeHtml(g.centre)}</td><td class="label" colspan="2">GRUP/S: ${escapeHtml(g.grup)}</td></tr></table><div class="doc-section">Competències clau i indicadors</div><table class="doc-table"><tr><th>COMPETÈNCIES CLAU</th><th>INDICADORS</th></tr>${rows(state.competenciesClau,c=>`<tr><td>${escapeHtml(c.nom)}</td><td>${nl(c.indicadors)}</td></tr>`)}</table><div class="doc-section">Temporització, sabers, situacions d’aprenentatge, CE i CA</div><table class="doc-table"><tr><th style="width:8%">TEMP</th><th style="width:29%">SABERS</th><th style="width:22%">SITUACIONS APRENENTATGE</th><th style="width:19%">COMPETÈNCIES ESPECÍFIQUES</th><th style="width:22%">CRITERIS D’AVALUACIÓ</th></tr>${saRows}</table><div class="doc-section">Indicadors d’avaluació</div><table class="doc-table"><tr><th rowspan="2">CRITERIS D’AVALUACIÓ</th><th colspan="3">INDICADORS D’AVALUACIÓ</th></tr><tr><th>AS</th><th>AN</th><th>AE</th></tr>${indRows}</table><div class="doc-section">Estratègies metodològiques i gestió d’aula</div><table class="doc-table"><tr><td>${nl(state.metodologia.estrategies)}</td></tr></table><div class="doc-section">Recursos i materials didàctics</div><table class="doc-table"><tr><td class="label">Recursos</td><td>${nl(state.recursos.recursos)}</td></tr><tr><td class="label">Materials</td><td>${nl(state.recursos.materials)}</td></tr></table><div class="doc-section">Mesures i suports d’atenció educativa inclusiva</div><table class="doc-table"><tr><td class="label">DUA</td><td>${nl(state.dua.text)}</td></tr><tr><td class="label">Universals</td><td>${nl(state.atencioDiversitat.universals)}</td></tr><tr><td class="label">Addicionals</td><td>${nl(state.atencioDiversitat.addicionals)}</td></tr><tr><td class="label">Intensives</td><td>${nl(state.atencioDiversitat.intensives)}</td></tr></table><div class="doc-section">Activitats complementàries</div><table class="doc-table"><tr><td>${nl(state.activitatsComplementaries)}</td></tr></table><div class="doc-section">Procediments d’avaluació i recuperació</div><table class="doc-table"><tr><td class="label">Instruments d’avaluació</td><td>${nl(state.avaluacio.instruments)}</td></tr><tr><td class="label">Criteris i instruments de qualificació</td><td>${nl(state.avaluacio.criterisQualificacio)}</td></tr><tr><td class="label">Recuperació trimestral</td><td>${nl(state.avaluacio.recuperacioTrimestral)}</td></tr><tr><td class="label">Recuperació del curs</td><td>${nl(state.avaluacio.recuperacioCurs)}</td></tr><tr><td class="label">Recuperació cursos anteriors</td><td>${nl(state.avaluacio.recuperacioAnteriors)}</td></tr></table></div>`
}
let previewTimer; function autoPreview(){clearTimeout(previewTimer); previewTimer=setTimeout(renderPreview,250)}

function renderAll(){bindGeneral(); ['metodologia.estrategies','recursos.recursos','recursos.materials','activitatsComplementaries','dua.text','atencioDiversitat.universals','atencioDiversitat.addicionals','atencioDiversitat.intensives','avaluacio.instruments','avaluacio.criterisQualificacio','avaluacio.recuperacioTrimestral','avaluacio.recuperacioCurs','avaluacio.recuperacioAnteriors'].forEach(id=>bindText(id,id)); renderLibrary(); renderCompetencies(); renderCurriculumBank(); renderTrimesters(); renderSituations(); renderIndicators(); renderPreview();}
function showSection(id){document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id)); document.querySelectorAll('.sidebar button').forEach(b=>b.classList.toggle('active',b.dataset.section===id)); if(id==='preview')renderPreview(); if(id==='diagnostics')runDiagnostics();}


function isFilled(value){
  return String(value || '').trim().length > 0;
}
function countLines(value){
  return lines(value).length;
}
function validationMessages(){
  const errors=[];
  const warnings=[];
  const ok=[];
  const g=state.general||{};
  if(!isFilled(g.titol)) errors.push('Falta el títol de la programació.'); else ok.push('Títol informat.');
  if(!isFilled(g.cursAcademic)) warnings.push('Falta el curs acadèmic.');
  if(!isFilled(g.centre)) warnings.push('Falta el centre.');
  if(!isFilled(g.departament)) warnings.push('Falta el departament.');
  if(!isFilled(g.docents)) warnings.push('Falta el nom del docent o docents.');
  if(!isFilled(g.nivell)) errors.push('Falta el nivell o curs.');
  if(!isFilled(g.materia)) errors.push('Falta la matèria.');
  if(!isFilled(g.tipusMateria)) warnings.push('Falta el tipus de matèria.');

  const sas=Array.isArray(state.situacions)?state.situacions:[];
  if(!sas.length){
    errors.push('No hi ha cap situació d’aprenentatge.');
  } else {
    ok.push(`Hi ha ${sas.length} situació/ns d’aprenentatge.`);
    sas.forEach((sa,i)=>{
      const name=sa.titol || `SA ${i+1}`;
      if(!isFilled(sa.trimestre)) errors.push(`${name}: falta trimestre o bloc temporal.`);
      if(!isFilled(sa.titol)) errors.push(`SA ${i+1}: falta títol.`);
      if(!isFilled(sa.sabers)) warnings.push(`${name}: no té sabers informats.`);
      if(!isFilled(sa.competencies)) warnings.push(`${name}: no té competències específiques informades.`);
      if(!isFilled(sa.criteris)) warnings.push(`${name}: no té criteris d’avaluació informats.`);
      if(!isFilled(sa.instruments)) warnings.push(`${name}: no té instruments d’avaluació.`);
      if(!isFilled(sa.producteFinal)) warnings.push(`${name}: no té producte final o evidència.`);
    });
  }

  const ce=Array.isArray(state.competenciesEspecifiques)?state.competenciesEspecifiques:[];
  const ceSenseText=ce.filter(c=>isFilled(c.codi)&&!isFilled(c.text)).map(c=>c.codi);
  if(!ce.length) warnings.push('No hi ha banc de competències específiques.');
  if(ceSenseText.length) warnings.push('Hi ha CE sense definició: '+ceSenseText.join(', ')+'.');

  const inds=Array.isArray(state.indicadors)?state.indicadors:[];
  if(!inds.length){
    warnings.push('No hi ha indicadors d’avaluació AS/AN/AE.');
  } else {
    const incomplets=inds.filter(ind=>!isFilled(ind.criteri)||!isFilled(ind.AS)||!isFilled(ind.AN)||!isFilled(ind.AE)).length;
    if(incomplets) warnings.push(`${incomplets} indicador/s d’avaluació estan incomplets.`);
    else ok.push('Indicadors d’avaluació complets.');
  }

  if(!isFilled(state.metodologia && state.metodologia.estrategies)) warnings.push('L’apartat de metodologia està buit.');
  if(!isFilled(state.recursos && (state.recursos.recursos || state.recursos.materials))) warnings.push('L’apartat de recursos/materials està buit.');
  const inclusio = [state.dua&&state.dua.text, state.atencioDiversitat&&state.atencioDiversitat.universals, state.atencioDiversitat&&state.atencioDiversitat.addicionals, state.atencioDiversitat&&state.atencioDiversitat.intensives].join('\n');
  if(!isFilled(inclusio)) warnings.push('L’apartat d’inclusió/DUA està buit.');
  const av = state.avaluacio || {};
  if(!isFilled(av.instruments)) warnings.push('Falten instruments generals d’avaluació.');
  if(!isFilled(av.criterisQualificacio)) warnings.push('Falten criteris de qualificació.');
  if(!isFilled(av.recuperacioTrimestral) && !isFilled(av.recuperacioCurs)) warnings.push('Falten criteris de recuperació.');

  if(!errors.length && !warnings.length) ok.push('No s’han detectat errors ni avisos importants.');
  return {errors,warnings,ok};
}
function renderValidationResult(result){
  const box=document.getElementById('validationSummary');
  if(!box) return;
  const parts=[];
  const status = result.errors.length ? '❌ Errors pendents' : (result.warnings.length ? '⚠️ Avisos detectats' : '✅ Programació revisada');
  parts.push(`<strong>${status}</strong>`);
  parts.push(`<p>${result.errors.length} error/s · ${result.warnings.length} avís/os · ${result.ok.length} comprovació/ns correctes</p>`);
  if(result.errors.length){
    parts.push('<h3>Errors que convé resoldre</h3><ul>'+result.errors.map(x=>`<li>${escapeHtml(x)}</li>`).join('')+'</ul>');
  }
  if(result.warnings.length){
    parts.push('<h3>Avisos de millora</h3><ul>'+result.warnings.map(x=>`<li>${escapeHtml(x)}</li>`).join('')+'</ul>');
  }
  if(result.ok.length){
    parts.push('<h3>Correcte</h3><ul>'+result.ok.slice(0,10).map(x=>`<li>${escapeHtml(x)}</li>`).join('')+'</ul>');
  }
  box.innerHTML=parts.join('');
}
function runValidation(show=true){
  const box=document.getElementById('validationSummary');
  if(box) box.textContent='Revisant programació...';
  const result=validationMessages();
  renderValidationResult(result);
  if(show) showSection('validation');
  return result;
}
function validateBeforeExport(){
  const result=runValidation(true);
  if(result.errors.length){
    alert('La validació ha detectat errors pendents. Revisa l’informe abans d’exportar.');
  } else if(result.warnings.length){
    alert('La validació ha detectat avisos de millora. Pots exportar, però revisa l’informe.');
  } else {
    alert('Programació revisada: no s’han detectat errors importants.');
  }
  return result;
}

async function runDiagnostics(){
 const box=document.getElementById('diagnosticBox');
 if(!box) return;
 const lines=[];
 const proto=location.protocol;
 const isLocalFile = proto==='file:' || proto==='content:';
 const isSecure = proto==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1';
 lines.push(`URL: ${location.href}`);
 lines.push(`Protocol: ${proto || 'desconegut'}`);
 lines.push(`Mode segur HTTPS/localhost: ${isSecure?'Sí':'No'}`);
 lines.push(`Mode fitxer mòbil/local: ${isLocalFile?'Sí. Correcte per editar i exportar, però no per instal·lar com a PWA completa.':'No'}`);
 try{
   localStorage.setItem('__prog_lomloe_diag__','ok');
   localStorage.removeItem('__prog_lomloe_diag__');
   lines.push('localStorage: Disponible');
 }catch(err){
   lines.push('localStorage: No disponible o bloquejat');
 }
 lines.push(`Service worker API: ${'serviceWorker' in navigator?'Disponible':'No disponible'}`);
 if(!('serviceWorker' in navigator)){
   lines.push('SW registrat: No aplicable');
   box.textContent=lines.join('\n');
   return;
 }
 if(!isSecure){
   lines.push('SW registrat: No. Els navegadors només el permeten en HTTPS o localhost.');
   lines.push('Nota: obrint index.html com a fitxer local o content:// és normal que el diagnòstic PWA digui que no és instal·lable.');
   box.textContent=lines.join('\n');
   return;
 }
 box.textContent=lines.concat('Comprovant service worker...').join('\n');
 try{
   const reg=await navigator.serviceWorker.getRegistration();
   box.textContent=lines.concat(`SW registrat: ${reg?'Sí':'No'}`).join('\n');
 }catch(err){
   box.textContent=lines.concat(`SW registrat: No s'ha pogut comprovar (${err && err.message ? err.message : 'error desconegut'})`).join('\n');
 }
}

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.getElementById('btnInstall').classList.remove('hidden')});
document.addEventListener('click',e=>{const b=e.target.closest('button[data-section]'); if(b)showSection(b.dataset.section)});
document.getElementById('btnNew').onclick=()=>{if(confirm('Crear una programació nova?')){state=defaultProgram();renderAll();showSection('general')}};
document.getElementById('btnSave').onclick=()=>{saveCurrent();alert('Programació desada a la biblioteca local.')};
document.getElementById('btnSeed4ESO').onclick=seed4ESO;
const btnBlankTechCourse=document.getElementById('btnBlankTechCourse'); if(btnBlankTechCourse) btnBlankTechCourse.onclick=createBlankTechCourse;
document.getElementById('btnLoadCourseSA').onclick=loadCourseSAOnly;
const btnFillMethodology=document.getElementById('btnFillMethodology'); if(btnFillMethodology) btnFillMethodology.onclick=()=>fillMethodology4ESO(false);
const btnReplaceMethodology=document.getElementById('btnReplaceMethodology'); if(btnReplaceMethodology) btnReplaceMethodology.onclick=()=>fillMethodology4ESO(true);
const btnBuildSupportFromSA=document.getElementById('btnBuildSupportFromSA'); if(btnBuildSupportFromSA) btnBuildSupportFromSA.onclick=buildSupportFromSA;
const btnFillInclusion=document.getElementById('btnFillInclusion'); if(btnFillInclusion) btnFillInclusion.onclick=()=>fillInclusion4ESO(false);
const btnReplaceInclusion=document.getElementById('btnReplaceInclusion'); if(btnReplaceInclusion) btnReplaceInclusion.onclick=()=>fillInclusion4ESO(true);
document.getElementById('btnLoadFullCourse').onclick=seed4ESO;
const curriculumCourseSelect=document.getElementById('curriculumCourseSelect'); if(curriculumCourseSelect) curriculumCourseSelect.onchange=fillCurriculumEditor;
const btnSaveCurriculum=document.getElementById('btnSaveCurriculum'); if(btnSaveCurriculum) btnSaveCurriculum.onclick=saveCurriculumEditor;
const btnResetCurriculum=document.getElementById('btnResetCurriculum'); if(btnResetCurriculum) btnResetCurriculum.onclick=resetCurriculumCourse;
const btnApplyCurriculum=document.getElementById('btnApplyCurriculum'); if(btnApplyCurriculum) btnApplyCurriculum.onclick=applyCurriculumToProgram;
const btnCopyCurriculum=document.getElementById('btnCopyCurriculum'); if(btnCopyCurriculum) btnCopyCurriculum.onclick=copyCurriculumSabers;
const btnSuggestToSA=document.getElementById('btnSuggestToSA'); if(btnSuggestToSA) btnSuggestToSA.onclick=addCurriculumSuggestionToSA;
const btnExportCurriculum=document.getElementById('btnExportCurriculum'); if(btnExportCurriculum) btnExportCurriculum.onclick=exportCurriculumBank;
const curriculumImportFile=document.getElementById('curriculumImportFile'); if(curriculumImportFile) curriculumImportFile.onchange=e=>{const f=e.target.files[0]; if(f) importCurriculumBankFile(f)};
document.getElementById('btnAddKeyCompetence').onclick=()=>{state.competenciesClau.push({id:uid('cc'),nom:'',indicadors:''});renderCompetencies()};
document.getElementById('btnAddSpecificCompetence').onclick=()=>{state.competenciesEspecifiques.push({id:uid('ce'),codi:'',text:''});renderCompetencies()};
document.getElementById('btnAddTrimester').onclick=()=>{state.trimestres.push({id:uid('tri'),nom:'Nou bloc'});renderTrimesters();renderSituations()};
document.getElementById('btnAddSA').onclick=()=>{state.situacions.push({id:uid('sa'),titol:'Nova situació d’aprenentatge',trimestre:state.trimestres[0]?.id||'t1',durada:'',descripcio:'',repte:'',producteFinal:'',sabers:'',competencies:'',criteris:'',activitats:'',instruments:'',recursos:'',dua:'',observacions:''});renderSituations();autoPreview()};
document.getElementById('btnClearOldSA').onclick=()=>{if(confirm('Vols buidar totes les SA, sabers, CE i CA de la programació actual?')){state.situacions=[];renderSituations();autoPreview()}};
document.getElementById('saJsonFile').onchange=e=>{if(e.target.files.length)importSAJsonFiles(e.target.files)};
document.getElementById('btnPasteSA').onclick=pasteSAFromText;
document.getElementById('btnExportAllSA').onclick=exportAllSA;
document.getElementById('btnAddIndicator').onclick=()=>{state.indicadors.push({id:uid('ind'),criteri:'',AS:'',AN:'',AE:''});renderIndicators()};
const btnRunValidation=document.getElementById('btnRunValidation'); if(btnRunValidation) btnRunValidation.onclick=()=>runValidation(true);
document.getElementById('btnRefreshPreview').onclick=renderPreview;
const btnValidateBeforeExport=document.getElementById('btnValidateBeforeExport'); if(btnValidateBeforeExport) btnValidateBeforeExport.onclick=validateBeforeExport;
document.getElementById('btnCopyRich').onclick=copyRichDocument;
const btnCopyDocs=document.getElementById('btnCopyDocs'); if(btnCopyDocs) btnCopyDocs.onclick=copyDocsOptimized;
document.getElementById('btnHtml').onclick=downloadCopyHtml;
document.getElementById('fontSelect').onchange=e=>setCurrentFont(e.target.value);
const tableSel=document.getElementById('tableModeSelect'); if(tableSel) tableSel.onchange=e=>setDocOption('tableMode',e.target.value);
const orientSel=document.getElementById('orientationSelect'); if(orientSel) orientSel.onchange=e=>setDocOption('orientation',e.target.value);
document.getElementById('btnPrint').onclick=preparePrint;
const btnPrintMobile=document.getElementById('btnPrintMobile'); if(btnPrintMobile) btnPrintMobile.onclick=prepareBlockPrint;
document.getElementById('btnWord').onclick=exportDocxReal;
document.getElementById('btnExportJson').onclick=()=>download(`${state.general.materia||'programacio'}.json`,JSON.stringify(state,null,2));
document.getElementById('btnBackup').onclick=()=>download(`copia_programacions_lomloe.json`,JSON.stringify({type:'prog-lomloe-backup',version:'0.6.0',exportedAt:new Date().toISOString(),items:library()},null,2));
document.getElementById('jsonFile').onchange=async e=>{const f=e.target.files[0]; if(!f)return; const data=JSON.parse(await f.text()); if(data.items){setLibrary(data.items); renderLibrary(); alert('Còpia restaurada.')} else {state=data; state.id=state.id||uid('prog'); renderAll(); showSection('general')}};
document.getElementById('txtFile').onchange=async e=>{const f=e.target.files[0]; if(f)document.getElementById('importText').value=await f.text()};
document.getElementById('btnCreateSAFromText').onclick=()=>{const text=document.getElementById('importText').value.trim(); if(!text)return; state.situacions.push({id:uid('sa'),titol:lines(text)[0]||'SA importada',trimestre:state.trimestres[0]?.id||'t1',durada:'',descripcio:text,repte:'',producteFinal:'',sabers:'',competencies:'',criteris:'',activitats:'',instruments:'',recursos:'',dua:'',observacions:'Text importat pendent de repartir pels camps.'});renderSituations();showSection('sa')};
document.getElementById('btnRunDiagnostics').onclick=runDiagnostics;
const btnCopyDiagnostics=document.getElementById('btnCopyDiagnostics'); if(btnCopyDiagnostics) btnCopyDiagnostics.onclick=async()=>{const txt=document.getElementById('diagnosticBox')?.textContent||''; try{await navigator.clipboard.writeText(txt); alert('Diagnòstic copiat.')}catch(e){prompt('Copia el diagnòstic:',txt)}};
document.getElementById('btnInstall').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt=null;document.getElementById('btnInstall').classList.add('hidden')};
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
applyFont();
renderAll();
